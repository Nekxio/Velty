import type { CommandMeta } from "citty";
import { afterEach, describe, expect, it, vi } from "vitest";
import { addCommand } from "./add.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

describe("addCommand — meta", () => {
  it("has name 'add'", () => {
    expect(getMeta(addCommand.meta).name).toBe("add");
  });

  it("has the correct description", () => {
    expect(getMeta(addCommand.meta).description).toBe("Add one or more Velty add-ons to an existing project.");
  });
});

describe("addCommand — args", () => {
  const args = addCommand.args as Record<string, { type: string }>;

  it("defines 'addons' as positional", () => {
    expect(args["addons"]?.type).toBe("positional");
  });

  it("defines 'install' as string", () => {
    expect(args["install"]?.type).toBe("string");
  });

  it("defines 'list' as boolean", () => {
    expect(args["list"]?.type).toBe("boolean");
  });

  it("defines 'search' as string", () => {
    expect(args["search"]?.type).toBe("string");
  });

  it("defines 'force' as boolean", () => {
    expect(args["force"]?.type).toBe("boolean");
  });
});

describe("addCommand — run", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs that 'add' is not yet implemented", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await (addCommand.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd: addCommand });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("add"));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("not implemented"));
  });
});
