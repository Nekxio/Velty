import { CANCEL_EXIT_CODE, CommandCancelledError, NonInteractivePromptError } from "@velty/core";
import { runMain, type CommandMeta } from "citty";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runCli, veltyCommand } from "./index.js";

const getMeta = (meta: unknown): CommandMeta => meta as CommandMeta;

vi.mock("citty", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return { ...actual, runMain: vi.fn() };
});

describe("veltyCommand — meta", () => {
  it("has name 'velty'", () => {
    expect(getMeta(veltyCommand.meta).name).toBe("velty");
  });

  it("has a version", () => {
    expect(getMeta(veltyCommand.meta).version).toBeDefined();
  });

  it("has a description", () => {
    expect(getMeta(veltyCommand.meta).description).toBe("Opinionated CLI for Svelte and SvelteKit.");
  });
});

describe("veltyCommand — subCommands", () => {
  const expected = ["create", "add", "generate", "doctor", "check", "migrate"] as const;

  for (const name of expected) {
    it(`registers '${name}'`, () => {
      expect(veltyCommand.subCommands).toHaveProperty(name);
    });
  }

  it("registers exactly 6 subcommands", () => {
    expect(Object.keys(veltyCommand.subCommands ?? {})).toHaveLength(6);
  });
});

describe("runCli — exit code handling", () => {
  let originalExitCode: number | undefined = process.exitCode as number | undefined;

  beforeEach(() => {
    originalExitCode = process.exitCode as number | undefined;
    process.exitCode = undefined;
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    vi.clearAllMocks();
  });

  it("sets exitCode to CANCEL_EXIT_CODE on CommandCancelledError", async () => {
    vi.mocked(runMain).mockRejectedValueOnce(new CommandCancelledError());
    await runCli([]);
    expect(process.exitCode).toBe(CANCEL_EXIT_CODE);
  });

  it("sets exitCode to 1 on NonInteractivePromptError", async () => {
    vi.mocked(runMain).mockRejectedValueOnce(new NonInteractivePromptError("CI blocked."));
    await runCli([]);
    expect(process.exitCode).toBe(1);
  });

  it("does not set exitCode for re-thrown errors", async () => {
    vi.mocked(runMain).mockRejectedValueOnce(new Error("boom"));
    await expect(runCli([])).rejects.toThrow();
    expect(process.exitCode).toBeUndefined();
  });
});

describe("runCli — error logging", () => {
  beforeEach(() => {
    process.exitCode = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("logs the cancellation message to stderr", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(runMain).mockRejectedValueOnce(new CommandCancelledError("Aborted."));
    await runCli([]);
    expect(spy).toHaveBeenCalledWith("Aborted.");
  });

  it("logs the non-interactive message to stderr", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(runMain).mockRejectedValueOnce(new NonInteractivePromptError("CI blocked."));
    await runCli([]);
    expect(spy).toHaveBeenCalledWith("CI blocked.");
  });

  it("re-throws unknown errors", async () => {
    const unknown = new Error("unexpected");
    vi.mocked(runMain).mockRejectedValueOnce(unknown);
    await expect(runCli([])).rejects.toThrow("unexpected");
  });
});

describe("runCli — argv forwarding", () => {
  it("passes argv to runMain", async () => {
    vi.mocked(runMain).mockResolvedValueOnce();
    await runCli(["create", "my-app"]);
    expect(vi.mocked(runMain)).toHaveBeenCalledWith(veltyCommand, { rawArgs: ["create", "my-app"] });
  });

  it("defaults to process.argv.slice(2) when no argv is provided", async () => {
    vi.mocked(runMain).mockResolvedValueOnce();
    await runCli();
    const call = vi.mocked(runMain).mock.calls[0];
    expect(call).toBeDefined();
    const options = call?.[1];
    expect(options).toBeDefined();
    expect(Array.isArray(options?.rawArgs)).toBe(true);
  });
});
