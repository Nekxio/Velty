import type { CommandMeta } from "citty";
import { describe, expect, it } from "vitest";
import { defineVeltyCommand, globalArgs } from "./command.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

describe("globalArgs", () => {
  it("defines cwd as string", () => {
    expect(globalArgs.cwd.type).toBe("string");
  });

  it("defines dry-run as boolean", () => {
    expect(globalArgs["dry-run"].type).toBe("boolean");
  });

  it("defines format as string", () => {
    expect(globalArgs.format.type).toBe("string");
  });

  it("defines verbose as boolean", () => {
    expect(globalArgs.verbose.type).toBe("boolean");
  });

  it("defines color as boolean with default true", () => {
    expect(globalArgs.color.type).toBe("boolean");
    expect(globalArgs.color.default).toBe(true);
  });
});

describe("defineVeltyCommand — meta", () => {
  const cmd = defineVeltyCommand({ name: "my-cmd", description: "A test command.", run: () => {} });

  it("sets name", () => {
    expect(getMeta(cmd.meta).name).toBe("my-cmd");
  });

  it("sets description", () => {
    expect(getMeta(cmd.meta).description).toBe("A test command.");
  });

  it("omits alias when not provided", () => {
    expect(getMeta(cmd.meta).alias).toBeUndefined();
  });
});

describe("defineVeltyCommand — alias", () => {
  const cmd = defineVeltyCommand({ name: "gen", description: "Generate.", alias: ["g"], run: () => {} });

  it("includes alias when provided", () => {
    expect(getMeta(cmd.meta).alias).toEqual(["g"]);
  });

  it("alias is a copy of the input array", () => {
    const alias = ["g"];
    const command = defineVeltyCommand({ name: "x", description: ".", alias, run: () => {} });
    alias.push("gen");
    expect(getMeta(command.meta).alias).toEqual(["g"]);
  });
});

describe("defineVeltyCommand — args", () => {
  const cmd = defineVeltyCommand({
    name: "cmd",
    description: ".",
    args: { extra: { type: "string", description: "Extra." } },
    run: () => {}
  });

  it("includes all globalArgs keys", () => {
    for (const key of Object.keys(globalArgs)) {
      expect(cmd.args).toHaveProperty(key);
    }
  });

  it("includes command-specific args", () => {
    expect(cmd.args).toHaveProperty("extra");
  });
});

describe("defineVeltyCommand — run", () => {
  it("calls options.run with a context whose commandName matches the command name", async () => {
    let capturedName = "";
    const cmd = defineVeltyCommand({
      name: "my-cmd",
      description: ".",
      run: (ctx) => {
        capturedName = ctx.commandName;
      }
    });

    await (cmd.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd });

    expect(capturedName).toBe("my-cmd");
  });

  it("awaits an async options.run", async () => {
    const log: Array<string> = [];
    const cmd = defineVeltyCommand({
      name: "async-cmd",
      description: ".",
      run: () =>
        Promise.resolve().then(() => {
          log.push("done");
        })
    });

    await (cmd.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd });

    expect(log).toEqual(["done"]);
  });

  it("passes flags from args to the context", async () => {
    let capturedDryRun = false;
    const cmd = defineVeltyCommand({
      name: "flagged-cmd",
      description: ".",
      run: (ctx) => {
        capturedDryRun = ctx.flags.dryRun;
      }
    });

    await (cmd.run as (ctx: unknown) => Promise<void>)({ args: { dryRun: true }, rawArgs: [], cmd });

    expect(capturedDryRun).toBe(true);
  });
});
