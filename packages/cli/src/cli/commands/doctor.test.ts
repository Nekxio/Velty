import type { CommandMeta } from "citty";
import { afterEach, describe, expect, it, vi } from "vitest";
import { doctorCommand } from "./doctor.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

describe("doctorCommand — meta", () => {
  it("has name 'doctor'", () => {
    expect(getMeta(doctorCommand.meta).name).toBe("doctor");
  });

  it("has the correct description", () => {
    expect(getMeta(doctorCommand.meta).description).toBe("Diagnose a Svelte or SvelteKit project.");
  });
});

describe("doctorCommand — args", () => {
  const args = doctorCommand.args as Record<string, { type: string }>;

  it("defines 'scope' as string", () => {
    expect(args["scope"]?.type).toBe("string");
  });

  it("defines 'fix' as boolean", () => {
    expect(args["fix"]?.type).toBe("boolean");
  });
});

describe("doctorCommand — run", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs that 'doctor' is not yet implemented", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await (doctorCommand.run as (ctx: unknown) => Promise<void>)({ args: {}, rawArgs: [], cmd: doctorCommand });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("doctor"));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("not implemented"));
  });
});
