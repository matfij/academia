# AGENTS.md

Guidance for coding agents and maintainers working on this repository.

## Project Overview

`ai-harness` is a minimal interactive TypeScript CLI harness built on `@cursor/sdk`. It keeps a persistent local Cursor `SDKAgent` alive across multiple turns in a single terminal session, supports startup and mid-session model selection, and streams assistant output to `stdout`.

- **Runtime**: Node.js 22+ (ESM, `"type": "module"`)
- **Language**: TypeScript 7 (`strict: true`, `module: "NodeNext"`)
- **Package manager**: `pnpm` (v11+)

## Repository Layout

- `src/index.ts` — CLI entry point: argument parsing, startup flow, REPL loop, `SIGINT` handling, and run streaming.
- `src/models.ts` — Model catalog fetching (`Cursor.models.list`), latest-first sorting within each model family, and interactive numbered model picker.
- `dist/` — Compiled JavaScript output from `tsc` (gitignored; exposed as `bin.cursor-cli`).
- `package.json` — Scripts and dependencies (`@cursor/sdk`, `dotenv`, `tsx`, `typescript`).
- `tsconfig.json` — TypeScript compiler config (`NodeNext`, `"types": ["node"]`).
- `pnpm-workspace.yaml` — Approves `esbuild` build scripts (`allowBuilds`) required by `tsx` under pnpm 11.
- `.env.example` — Template for `CURSOR_API_KEY` (required) and optional `CURSOR_MODEL`.

## Common Commands

```bash
pnpm install        # Install dependencies
pnpm run dev        # Run directly from TypeScript via tsx
pnpm run typecheck  # Type-check without emitting (tsc --noEmit)
pnpm run build      # Compile src/ -> dist/
pnpm run start      # Run compiled CLI (node dist/index.js)
```

Pass CLI arguments through pnpm with `--`, e.g. `pnpm run dev -- --help` or `pnpm run dev -- --model composer-2.5`.

## Environment & Secrets

- Secrets live in `.env` (gitignored) and are loaded via `import "dotenv/config"` in `src/index.ts`.
- Never commit `.env` or print/log `CURSOR_API_KEY`.
- `CURSOR_MODEL` is optional; when set, it is highlighted as the default choice in the startup model picker (and used as the fallback if `Cursor.models.list()` fails).

## `@cursor/sdk` Conventions & Gotchas

- **Streaming text**: Live token-by-token streaming comes from `SendOptions.onDelta` (`update.type === "text-delta"`). `SDKAssistantMessage` events in `run.stream()` do **not** have a top-level `event.text`; their text lives in `event.message.content` blocks where `block.type === "text"`. Keep the `streamedAnyDelta` guard so streamed text is not printed twice.
- **Model catalog & sorting**: `Cursor.models.list({ apiKey })` returns `SDKModel[]` (`ModelListItem`), which has `id`, `displayName`, `description`, `aliases`, `parameters`, and `variants` — it does not include a release timestamp. `sortModelsLatestFirst()` in `src/models.ts` preserves API family order while sorting versions and embedded dates (`YYYYMMDD` / `YYYY-MM-DD`) descending within each family.
- **Switching models**: Pass `model: { id }` in `agent.send(prompt, { model: { id } })` to switch models mid-session without losing conversation history.
- **Lifecycle & local store**: `agent.close()` is synchronous (`void`). `src/index.ts` configures `JsonlLocalAgentStore` under `join(getDefaultSdkStateRoot(cwd), "jsonl")` via `Cursor.configure({ local: { store } })` rather than the default `node:sqlite` store to avoid `ExperimentalWarning: SQLite` and native `0xC0000005` crashes on early Node 22 builds on Windows.
- **Cancellation**: `SIGINT` (`Ctrl+C`) cancels an active `Run` (`activeRun.cancel()`) instead of terminating the REPL; when idle, it closes readline and exits cleanly.

## Maintenance Rules

- Use `.js` extensions on relative ESM imports inside `src/` (required by `NodeNext`).
- Keep `src/index.ts` and `src/models.ts` small and modular; extract new interactive commands or SDK integrations into focused modules under `src/`.
- After every code change, run `pnpm run typecheck` and `pnpm run build` and confirm both exit cleanly.
- Update this file when adding new modules, scripts, environment variables, or CLI commands.
