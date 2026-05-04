import type { CommandMeta } from "citty";
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkCommand } from "./check.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

describe("checkCommand — meta", () => {
  it("has name 'check'", () => {
    expect(getMeta(checkCommand.meta).name).toBe("check");
  });

  it("has the correct description", () => {
    expect(getMeta(checkCommand.meta).description).toBe("Run Svelte diagnostics via svelte-check.");
  });
});

describe("checkCommand — run", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs that 'check' is not yet implemented", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await (checkCommand.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd: checkCommand });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("check"));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("not implemented"));
  });
});
