import type { CommandMeta } from "citty";
import { afterEach, describe, expect, it, vi } from "vitest";
import { generateCommand } from "./generate.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

describe("generateCommand — meta", () => {
  it("has name 'generate'", () => {
    expect(getMeta(generateCommand.meta).name).toBe("generate");
  });

  it("has the correct description", () => {
    expect(getMeta(generateCommand.meta).description).toBe("Generate Svelte or SvelteKit files.");
  });

  it("has alias 'g'", () => {
    expect(getMeta(generateCommand.meta).alias).toEqual(["g"]);
  });
});

describe("generateCommand — args", () => {
  const args = generateCommand.args as Record<string, { type: string }>;

  it("defines 'entity' as positional", () => {
    expect(args["entity"]?.type).toBe("positional");
  });

  it("defines 'name' as positional", () => {
    expect(args["name"]?.type).toBe("positional");
  });

  it("defines 'force' as boolean", () => {
    expect(args["force"]?.type).toBe("boolean");
  });

  it("defines 'ts' as boolean", () => {
    expect(args["ts"]?.type).toBe("boolean");
  });
});

describe("generateCommand — run", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs that 'generate' is not yet implemented", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await (generateCommand.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd: generateCommand });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("generate"));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("not implemented"));
  });
});
