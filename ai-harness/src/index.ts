#!/usr/bin/env node
import "dotenv/config";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  Agent,
  Cursor,
  JsonlLocalAgentStore,
  getDefaultSdkStateRoot,
  type Run,
  type SDKAgent,
  type SDKModel,
} from "@cursor/sdk";
import {
  DEFAULT_FALLBACK_MODEL,
  fetchAvailableModels,
  promptModelSelection,
} from "./models.js";

interface CliOptions {
  model?: string;
  cwd: string;
  initialPrompt?: string;
}

function parseArgs(argv: string[]): CliOptions {
  let model: string | undefined;
  let cwd = process.cwd();
  const promptParts: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--model" || arg === "-m") {
      const next = argv[++i];
      if (!next) {
        console.error("Missing value for --model");
        process.exit(1);
      }
      model = next;
    } else if (arg === "--cwd") {
      const next = argv[++i];
      if (!next) {
        console.error("Missing value for --cwd");
        process.exit(1);
      }
      cwd = next;
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else {
      promptParts.push(arg);
    }
  }

  return {
    model,
    cwd,
    initialPrompt: promptParts.length > 0 ? promptParts.join(" ") : undefined,
  };
}

function printUsage(): void {
  console.log(`Usage: cursor-cli [options] [initial prompt]

Options:
  -m, --model <id>   Skip startup model picker and use this model ID directly
  --cwd <path>       Working directory for the local agent (default: current directory)
  -h, --help         Show this help message

Interactive commands:
  /model             List and switch the active model
  /new, /reset       Start a fresh conversation
  /summarize         Summarize conversation to free context
  /help              Show interactive commands
  /exit, /quit       Exit the CLI
`);
}

function printInteractiveHelp(): void {
  console.log(`Commands:
  /model         List and switch the active model
  /new, /reset   Start a fresh conversation
  /summarize     Summarize conversation to free context
  /help          Show this help message
  /exit, /quit   Exit the CLI`);
}

async function createAgent(apiKey: string, model: string, cwd: string): Promise<SDKAgent> {
  return Agent.create({
    apiKey,
    model: { id: model },
    local: { cwd },
  });
}

async function sendPrompt(
  agent: SDKAgent,
  prompt: string,
  model: string,
  setActiveRun: (run: Run | null) => void,
): Promise<void> {
  let streamedAnyDelta = false;
  let midLine = false;

  const ensureNewline = () => {
    if (midLine) {
      output.write("\n");
      midLine = false;
    }
  };

  const run = await agent.send(prompt, {
    model: { id: model },
    onDelta: ({ update }) => {
      if (update.type === "text-delta" && update.text) {
        streamedAnyDelta = true;
        output.write(update.text);
        midLine = !update.text.endsWith("\n");
      }
    },
  });

  setActiveRun(run);

  try {
    for await (const event of run.stream()) {
      switch (event.type) {
        case "assistant": {
          if (!streamedAnyDelta) {
            for (const block of event.message.content) {
              if (block.type === "text" && block.text) {
                output.write(block.text);
                midLine = !block.text.endsWith("\n");
              }
            }
          }
          break;
        }
        case "tool_call": {
          if (event.status === "running") {
            ensureNewline();
            console.log(`[tool: ${event.name}]`);
          } else if (event.status === "error") {
            ensureNewline();
            console.error(`[tool error: ${event.name}]`);
          }
          break;
        }
        case "summary": {
          ensureNewline();
          if (event.status === "running") {
            console.log("[summarizing conversation...]");
          } else if (event.status === "completed") {
            console.log("[conversation summarized]");
          } else if (event.status === "error") {
            console.error("[failed to summarize conversation]");
          }
          break;
        }
        case "status": {
          if (event.status === "ERROR" && event.message) {
            ensureNewline();
            console.error(`[error] ${event.message}`);
          }
          break;
        }
      }
    }

    const result = await run.wait();
    ensureNewline();

    if (result.status === "error" && result.error?.message) {
      console.error(`Run failed: ${result.error.message}`);
    } else if (result.status === "cancelled") {
      console.log("[cancelled]");
    }
  } finally {
    setActiveRun(null);
  }
}

async function loadModelsSafely(apiKey: string): Promise<SDKModel[] | null> {
  try {
    return await fetchAvailableModels(apiKey);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`Could not fetch available models (${message}).`);
    return null;
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const apiKey = process.env.CURSOR_API_KEY?.trim();

  if (!apiKey) {
    console.error("Missing CURSOR_API_KEY. Create a .env file with CURSOR_API_KEY=... (see .env.example).");
    process.exit(1);
  }

  // Use JsonlLocalAgentStore instead of the default node:sqlite store to avoid
  // experimental node:sqlite native crashes (0xC0000005) on early Node 22 builds on Windows.
  const store = new JsonlLocalAgentStore(join(getDefaultSdkStateRoot(options.cwd), "jsonl"));
  Cursor.configure({ local: { store } });

  let agent: SDKAgent | null = null;
  let activeRun: Run | null = null;
  let cachedModels: SDKModel[] | null = null;

  const rl = createInterface({ input, output });

  const onSigInt = () => {
    if (activeRun) {
      output.write("\n[cancelling run...]\n");
      void activeRun.cancel();
    } else {
      output.write("\n");
      rl.close();
    }
  };

  process.on("SIGINT", onSigInt);

  try {
    let currentModel: string;
    if (options.model) {
      currentModel = options.model;
    } else {
      const envDefault = process.env.CURSOR_MODEL?.trim() || undefined;
      cachedModels = await loadModelsSafely(apiKey);
      if (cachedModels && cachedModels.length > 0) {
        const chosen = await promptModelSelection(rl, cachedModels, envDefault);
        if (!chosen) {
          return;
        }
        currentModel = chosen;
      } else {
        currentModel = envDefault ?? DEFAULT_FALLBACK_MODEL;
        console.log(`Using fallback model: ${currentModel}`);
      }
    }

    agent = await createAgent(apiKey, currentModel, options.cwd);

    console.log(`\nCursor CLI harness ready (model: ${currentModel}, cwd: ${options.cwd})`);
    console.log("Type a message and press Enter. Use /help for commands, /exit to quit.\n");

    if (options.initialPrompt) {
      console.log(`you> ${options.initialPrompt}`);
      await sendPrompt(agent, options.initialPrompt, currentModel, (run) => {
        activeRun = run;
      });
    }

    while (true) {
      let line: string;
      try {
        line = await rl.question("\nyou> ");
      } catch {
        // Readline closed (EOF / Ctrl+D / Ctrl+C while idle)
        break;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      if (trimmed === "/exit" || trimmed === "/quit") {
        break;
      }

      if (trimmed === "/help") {
        printInteractiveHelp();
        continue;
      }

      if (trimmed === "/model") {
        cachedModels = (await loadModelsSafely(apiKey)) ?? cachedModels;
        if (!cachedModels || cachedModels.length === 0) {
          console.log(`No model list available. Current model: ${currentModel}`);
          continue;
        }
        const chosen = await promptModelSelection(rl, cachedModels, currentModel);
        if (!chosen) {
          break;
        }
        currentModel = chosen;
        console.log(`[switched model to ${currentModel}]`);
        continue;
      }

      if (trimmed === "/new" || trimmed === "/reset") {
        agent.close();
        agent = await createAgent(apiKey, currentModel, options.cwd);
        console.log(`[started a new conversation with ${currentModel}]`);
        continue;
      }

      if (trimmed === "/summarize") {
        try {
          const summaryRun = await agent.summarize();
          activeRun = summaryRun;
          const result = await summaryRun.wait();
          if (result.status === "finished") {
            console.log("[conversation summarized]");
          } else if (result.status === "error") {
            console.error(`Summarize failed: ${result.error?.message ?? "unknown error"}`);
          }
        } catch (err) {
          console.error(err instanceof Error ? err.message : String(err));
        } finally {
          activeRun = null;
        }
        continue;
      }

      try {
        await sendPrompt(agent, trimmed, currentModel, (run) => {
          activeRun = run;
        });
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
      }
    }
  } finally {
    process.off("SIGINT", onSigInt);
    rl.close();
    agent?.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
