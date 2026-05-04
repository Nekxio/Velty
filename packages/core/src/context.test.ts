import { describe, expect, it } from "vitest";
import { createCommandContext } from "./context.js";
import type { PromptAdapter } from "./prompt.js";

const mockPrompt: PromptAdapter = {
  isInteractive: true,
  text: () => Promise.resolve(""),
  confirm: () => Promise.resolve(false),
  select: () => Promise.resolve("" as never),
  multiselect: () => Promise.resolve([])
};

const makeContext = (args: Record<string, unknown> = {}, commandPath: Array<string> = ["velty"]) =>
  createCommandContext({ commandPath, args, prompt: mockPrompt });

describe("createCommandContext — commandName", () => {
  it("is the last segment of commandPath", () => {
    expect(makeContext({}, ["velty", "add"]).commandName).toBe("add");
  });

  it("falls back to 'velty' when commandPath is empty", () => {
    expect(makeContext({}, []).commandName).toBe("velty");
  });

  it("commandPath is an immutable copy of the input", () => {
    const path = ["velty", "add"];
    const ctx = createCommandContext({ commandPath: path, args: {}, prompt: mockPrompt });
    path.push("extra");
    expect(ctx.commandPath).toEqual(["velty", "add"]);
  });
});

describe("createCommandContext — flags.dryRun", () => {
  it("is false by default", () => {
    expect(makeContext().flags.dryRun).toBe(false);
  });

  it("is true when args.dryRun is true", () => {
    expect(makeContext({ dryRun: true }).flags.dryRun).toBe(true);
  });

  it("is true when args['dry-run'] is true", () => {
    expect(makeContext({ "dry-run": true }).flags.dryRun).toBe(true);
  });

  it("is false for non-boolean truthy values", () => {
    expect(makeContext({ dryRun: "yes" }).flags.dryRun).toBe(false);
  });
});

describe("createCommandContext — flags.verbose", () => {
  it("is false by default", () => {
    expect(makeContext().flags.verbose).toBe(false);
  });

  it("is true when args.verbose is true", () => {
    expect(makeContext({ verbose: true }).flags.verbose).toBe(true);
  });
});

describe("createCommandContext — flags.color", () => {
  it("is true by default", () => {
    expect(makeContext().flags.color).toBe(true);
  });

  it("is false when args.color is false", () => {
    expect(makeContext({ color: false }).flags.color).toBe(false);
  });

  it("is true for any value other than false", () => {
    expect(makeContext({ color: undefined }).flags.color).toBe(true);
  });
});

describe("createCommandContext — flags.cwd", () => {
  it("is set when args.cwd is a non-empty string", () => {
    expect(makeContext({ cwd: "/workspace" }).flags.cwd).toBe("/workspace");
  });

  it("is undefined when args.cwd is an empty string", () => {
    expect(makeContext({ cwd: "" }).flags.cwd).toBeUndefined();
  });

  it("is undefined when args.cwd is absent", () => {
    expect(makeContext().flags.cwd).toBeUndefined();
  });
});

describe("createCommandContext — flags.format", () => {
  it("is set when args.format is a non-empty string", () => {
    expect(makeContext({ format: "json" }).flags.format).toBe("json");
  });

  it("is undefined when args.format is absent", () => {
    expect(makeContext().flags.format).toBeUndefined();
  });
});

describe("createCommandContext — env", () => {
  it("uses the provided env", () => {
    const env = { NODE_ENV: "test" };
    const ctx = createCommandContext({ commandPath: ["velty"], args: {}, env, prompt: mockPrompt });
    expect(ctx.env).toBe(env);
  });

  it("falls back to process.env when env is not provided", () => {
    const ctx = createCommandContext({ commandPath: ["velty"], args: {}, prompt: mockPrompt });
    expect(ctx.env).toBe(process.env);
  });
});

describe("createCommandContext — prompt", () => {
  it("passes the prompt adapter through unchanged", () => {
    expect(makeContext().prompt).toBe(mockPrompt);
  });
});
