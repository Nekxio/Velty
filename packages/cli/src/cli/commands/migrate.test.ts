import type { CommandMeta } from "citty";
import { afterEach, describe, expect, it, vi } from "vitest";
import { migrateCommand } from "./migrate.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

describe("migrateCommand — meta", () => {
  it("has name 'migrate'", () => {
    expect(getMeta(migrateCommand.meta).name).toBe("migrate");
  });

  it("has the correct description", () => {
    expect(getMeta(migrateCommand.meta).description).toBe("Run guarded Svelte or SvelteKit migrations.");
  });
});

describe("migrateCommand — args", () => {
  const args = migrateCommand.args as Record<string, { type: string }>;

  it("defines 'migration' as positional", () => {
    expect(args["migration"]?.type).toBe("positional");
  });

  it("defines 'list' as boolean", () => {
    expect(args["list"]?.type).toBe("boolean");
  });

  it("defines 'install' as string", () => {
    expect(args["install"]?.type).toBe("string");
  });
});

describe("migrateCommand — run", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs that 'migrate' is not yet implemented", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await (migrateCommand.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd: migrateCommand });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("migrate"));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("not implemented"));
  });
});
