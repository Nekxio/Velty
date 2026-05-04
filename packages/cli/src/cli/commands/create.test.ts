import type { CommandMeta } from "citty";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCommand } from "./create.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

describe("createCommand — meta", () => {
  it("has name 'create'", () => {
    expect(getMeta(createCommand.meta).name).toBe("create");
  });

  it("has the correct description", () => {
    expect(getMeta(createCommand.meta).description).toBe("Create a Svelte or SvelteKit project.");
  });
});

describe("createCommand — args", () => {
  const args = createCommand.args as Record<string, { type: string }>;

  it("defines 'path' as positional", () => {
    expect(args["path"]?.type).toBe("positional");
  });

  it("defines 'template' as string", () => {
    expect(args["template"]?.type).toBe("string");
  });

  it("defines 'types' as string", () => {
    expect(args["types"]?.type).toBe("string");
  });

  it("defines 'add' as string", () => {
    expect(args["add"]?.type).toBe("string");
  });

  it("defines 'install' as string", () => {
    expect(args["install"]?.type).toBe("string");
  });
});

describe("createCommand — run", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs that 'create' is not yet implemented", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await (createCommand.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd: createCommand });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("create"));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("not implemented"));
  });
});
