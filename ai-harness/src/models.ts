import type { Interface } from "node:readline/promises";
import { Cursor, type SDKModel } from "@cursor/sdk";

export const DEFAULT_FALLBACK_MODEL = "composer-2.5";

interface ParsedModelSortKey {
  family: string;
  version: number[];
  dateStamp: number;
  originalIndex: number;
}

/**
 * Extracts a YYYYMMDD numeric date stamp from a model ID if present
 * (e.g. `20250514` or `2025-05-14`). Returns 0 when none is found.
 */
function extractDateStamp(id: string): number {
  const dashed = id.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (dashed) {
    return Number(`${dashed[1]}${dashed[2]}${dashed[3]}`);
  }
  const compact = id.match(/(?:^|[-_])(20\d{2})(\d{2})(\d{2})(?:$|[-_])/);
  if (compact) {
    return Number(`${compact[1]}${compact[2]}${compact[3]}`);
  }
  return 0;
}

/**
 * Strips embedded YYYYMMDD / YYYY-MM-DD date stamps so they are not treated as
 * semantic version numbers, then extracts numeric version segments in order.
 */
function extractVersionNumbers(id: string): number[] {
  const withoutDates = id
    .replace(/\b20\d{2}-\d{2}-\d{2}\b/g, "")
    .replace(/(?:^|[-_])20\d{2}\d{2}\d{2}(?=$|[-_])/g, "");

  const matches = withoutDates.match(/\d+(?:\.\d+)*/g);
  if (!matches) {
    return [];
  }

  const parts: number[] = [];
  for (const token of matches) {
    for (const seg of token.split(".")) {
      const n = Number(seg);
      if (Number.isFinite(n)) {
        parts.push(n);
      }
    }
  }
  return parts;
}

/**
 * Derives the leading model family token (e.g. `composer`, `claude`, `gpt`,
 * `gemini`, `o`, `grok`) from a model ID so versions are compared within the
 * same family rather than across unrelated numbering schemes.
 */
function extractFamily(id: string): string {
  const lower = id.toLowerCase();
  const match = lower.match(/^[a-z]+/);
  return match ? match[0] : lower;
}

function compareNumberArraysDesc(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) {
      return bv - av;
    }
  }
  return 0;
}

/**
 * Sorts models from latest to oldest within each model family while preserving
 * the API's relative family order (since `SDKModel` does not expose a release
 * timestamp).
 */
export function sortModelsLatestFirst(models: readonly SDKModel[]): SDKModel[] {
  const familyOrder = new Map<string, number>();
  const keyed: Array<{ model: SDKModel; key: ParsedModelSortKey }> = models.map(
    (model, originalIndex) => {
      const family = extractFamily(model.id);
      if (!familyOrder.has(family)) {
        familyOrder.set(family, familyOrder.size);
      }
      return {
        model,
        key: {
          family,
          version: extractVersionNumbers(model.id),
          dateStamp: extractDateStamp(model.id),
          originalIndex,
        },
      };
    },
  );

  keyed.sort((a, b) => {
    const famA = familyOrder.get(a.key.family) ?? 0;
    const famB = familyOrder.get(b.key.family) ?? 0;
    if (famA !== famB) {
      return famA - famB;
    }

    const hasVerA = a.key.version.length > 0;
    const hasVerB = b.key.version.length > 0;
    if (hasVerA !== hasVerB) {
      return hasVerA ? -1 : 1;
    }

    const verCmp = compareNumberArraysDesc(a.key.version, b.key.version);
    if (verCmp !== 0) {
      return verCmp;
    }

    if (a.key.dateStamp !== b.key.dateStamp) {
      return b.key.dateStamp - a.key.dateStamp;
    }

    return a.key.originalIndex - b.key.originalIndex;
  });

  return keyed.map((entry) => entry.model);
}

export async function fetchAvailableModels(apiKey: string): Promise<SDKModel[]> {
  const models = await Cursor.models.list({ apiKey });
  return sortModelsLatestFirst(models);
}

function resolveDefaultModel(models: readonly SDKModel[], preferred?: string): string {
  if (preferred) {
    const exact = models.find(
      (m) =>
        m.id.toLowerCase() === preferred.toLowerCase() ||
        m.aliases?.some((a) => a.toLowerCase() === preferred.toLowerCase()),
    );
    return exact ? exact.id : preferred;
  }

  const fallback = models.find((m) => m.id === DEFAULT_FALLBACK_MODEL);
  if (fallback) {
    return fallback.id;
  }

  return models[0]?.id ?? DEFAULT_FALLBACK_MODEL;
}

function formatModelLine(model: SDKModel, index: number, width: number, isDefault: boolean): string {
  const num = String(index + 1).padStart(width, " ");
  const hasDistinctName =
    model.displayName && model.displayName.trim().toLowerCase() !== model.id.toLowerCase();
  const label = hasDistinctName ? `${model.id} — ${model.displayName}` : model.id;
  const suffix = isDefault ? " (default)" : "";
  return `  ${num}. ${label}${suffix}`;
}

export async function promptModelSelection(
  rl: Interface,
  models: readonly SDKModel[],
  preferredDefault?: string,
): Promise<string | null> {
  if (models.length === 0) {
    return preferredDefault ?? DEFAULT_FALLBACK_MODEL;
  }

  const defaultModel = resolveDefaultModel(models, preferredDefault);
  const width = String(models.length).length;

  console.log("Available models (latest first per family):");
  models.forEach((model, idx) => {
    console.log(formatModelLine(model, idx, width, model.id === defaultModel));
  });
  console.log();

  while (true) {
    let answer: string;
    try {
      answer = await rl.question(
        `Pick a model [1-${models.length}] or type an ID (Enter for ${defaultModel}): `,
      );
    } catch {
      return null;
    }

    const trimmed = answer.trim();
    if (!trimmed) {
      return defaultModel;
    }

    if (/^\d+$/.test(trimmed)) {
      const idx = Number(trimmed) - 1;
      if (idx >= 0 && idx < models.length) {
        return models[idx].id;
      }
      console.log(`Please enter a number between 1 and ${models.length}.`);
      continue;
    }

    const matched = models.find(
      (m) =>
        m.id.toLowerCase() === trimmed.toLowerCase() ||
        m.aliases?.some((a) => a.toLowerCase() === trimmed.toLowerCase()),
    );
    if (matched) {
      return matched.id;
    }

    console.log(
      `Unknown model "${trimmed}". Enter a number between 1 and ${models.length}, or a listed model ID.`,
    );
  }
}
