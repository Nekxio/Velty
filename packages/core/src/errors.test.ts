import { describe, expect, it } from "vitest";
import { CANCEL_EXIT_CODE, CommandCancelledError, NonInteractivePromptError, USAGE_EXIT_CODE } from "./errors.js";

describe("exit codes", () => {
  it("CANCEL_EXIT_CODE is 130", () => {
    expect(CANCEL_EXIT_CODE).toBe(130);
  });

  it("USAGE_EXIT_CODE is 2", () => {
    expect(USAGE_EXIT_CODE).toBe(2);
  });
});

describe("CommandCancelledError", () => {
  it("is an instance of Error", () => {
    expect(new CommandCancelledError()).toBeInstanceOf(Error);
  });

  it("has name CommandCancelledError", () => {
    expect(new CommandCancelledError().name).toBe("CommandCancelledError");
  });

  it("uses default message", () => {
    expect(new CommandCancelledError().message).toBe("Operation cancelled.");
  });

  it("accepts a custom message", () => {
    expect(new CommandCancelledError("aborted").message).toBe("aborted");
  });
});

describe("NonInteractivePromptError", () => {
  it("is an instance of Error", () => {
    expect(new NonInteractivePromptError("blocked")).toBeInstanceOf(Error);
  });

  it("has name NonInteractivePromptError", () => {
    expect(new NonInteractivePromptError("blocked").name).toBe("NonInteractivePromptError");
  });

  it("sets the message", () => {
    expect(new NonInteractivePromptError("blocked in CI").message).toBe("blocked in CI");
  });
});
