import type { PromptAdapter } from "./prompt.js";

export interface GlobalFlags {
  readonly cwd?: string;
  readonly dryRun: boolean;
  readonly format?: string;
  readonly verbose: boolean;
  readonly color: boolean;
}

export interface CommandContext {
  readonly commandName: string;
  readonly commandPath: ReadonlyArray<string>;
  readonly flags: GlobalFlags;
  readonly env: NodeJS.ProcessEnv;
  readonly prompt: PromptAdapter;
}

export interface CreateCommandContextOptions {
  readonly commandPath: ReadonlyArray<string>;
  readonly args: Readonly<Record<string, unknown>>;
  readonly env?: NodeJS.ProcessEnv;
  readonly prompt: PromptAdapter;
}

export const createCommandContext = (options: CreateCommandContextOptions): CommandContext => {
  const env = options.env ?? process.env;
  const commandPath = [...options.commandPath];
  const commandName = commandPath.at(-1) ?? "velty";

  const cwd = asOptionalString(options.args.cwd);
  const format = asOptionalString(options.args.format);

  return {
    commandName,
    commandPath,
    flags: {
      ...(cwd !== undefined && { cwd }),
      dryRun: asBoolean(options.args.dryRun) || asBoolean(options.args["dry-run"]),
      ...(format !== undefined && { format }),
      verbose: asBoolean(options.args.verbose),
      color: options.args.color !== false
    },
    env,
    prompt: options.prompt
  };
};

const asBoolean = (value: unknown): boolean => value === true;

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === "string" && value.length > 0 ? value : undefined;
