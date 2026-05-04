import { createCommandContext, type CommandContext } from "@velty/core";
import { defineCommand } from "citty";
import { createPromptAdapter } from "./prompt-adapter.js";

export const globalArgs = {
  cwd: {
    type: "string",
    description: "Override the working directory."
  },
  "dry-run": {
    type: "boolean",
    description: "Plan changes without writing files."
  },
  format: {
    type: "string",
    description: "Output format."
  },
  verbose: {
    type: "boolean",
    description: "Enable verbose logs."
  },
  color: {
    type: "boolean",
    default: true,
    description: "Enable ANSI colors."
  }
} as const;

export interface CommandModuleOptions {
  readonly name: string;
  readonly description: string;
  readonly args?: Readonly<Record<string, unknown>>;
  readonly alias?: ReadonlyArray<string>;
  readonly run: (context: CommandContext) => Promise<void> | void;
}

export const defineVeltyCommand = (options: CommandModuleOptions) =>
  defineCommand({
    meta: {
      name: options.name,
      description: options.description,
      ...(options.alias !== undefined && { alias: [...options.alias] })
    },
    args: {
      ...globalArgs,
      ...options.args
    },
    async run(runContext) {
      const prompt = createPromptAdapter({ env: process.env });
      const context = createCommandContext({
        commandPath: ["velty", options.name],
        args: runContext.args as Readonly<Record<string, unknown>>,
        env: process.env,
        prompt
      });

      await options.run(context);
    }
  });
