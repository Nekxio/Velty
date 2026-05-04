import { confirm, multiselect, select, text } from "@clack/prompts";
import { CommandCancelledError, NonInteractivePromptError } from "@velty/core";
import { describe, expect, it, vi } from "vitest";
import { ClackPromptAdapter, createPromptAdapter } from "./prompt-adapter.js";

const cancelToken = Symbol("clack_cancel");

vi.mock("@clack/prompts", () => ({
  text: vi.fn(),
  confirm: vi.fn(),
  select: vi.fn(),
  multiselect: vi.fn(),
  isCancel: (value: unknown) => value === cancelToken
}));

describe("ClackPromptAdapter — isInteractive", () => {
  it("is false when CI=true", () => {
    expect(new ClackPromptAdapter({ env: { CI: "true" } }).isInteractive).toBe(false);
  });

  it("is true when CI is absent", () => {
    expect(new ClackPromptAdapter({ env: {} }).isInteractive).toBe(true);
  });

  it("is true when CI=false", () => {
    expect(new ClackPromptAdapter({ env: { CI: "false" } }).isInteractive).toBe(true);
  });

  it("is false when CI=1", () => {
    expect(new ClackPromptAdapter({ env: { CI: "1" } }).isInteractive).toBe(false);
  });
});

describe("ClackPromptAdapter — CI guard", () => {
  const ci = new ClackPromptAdapter({ env: { CI: "true" } });

  it("text() throws NonInteractivePromptError", async () => {
    await expect(ci.text({ message: "Name?" })).rejects.toThrow(NonInteractivePromptError);
  });

  it("confirm() throws NonInteractivePromptError", async () => {
    await expect(ci.confirm({ message: "Continue?" })).rejects.toThrow(NonInteractivePromptError);
  });

  it("select() throws NonInteractivePromptError", async () => {
    await expect(ci.select({ message: "Pick", options: [{ label: "A", value: "a" }] })).rejects.toThrow(
      NonInteractivePromptError
    );
  });

  it("multiselect() throws NonInteractivePromptError", async () => {
    await expect(ci.multiselect({ message: "Pick", options: [{ label: "A", value: "a" }] })).rejects.toThrow(
      NonInteractivePromptError
    );
  });

  it("error message includes the prompt message", async () => {
    await expect(ci.text({ message: "Enter project name" })).rejects.toThrow("Enter project name");
  });
});

describe("ClackPromptAdapter — cancel handling", () => {
  const adapter = new ClackPromptAdapter({ env: {} });

  it("text() throws CommandCancelledError when user cancels", async () => {
    vi.mocked(text).mockResolvedValue(cancelToken as unknown as string);
    await expect(adapter.text({ message: "Name?" })).rejects.toThrow(CommandCancelledError);
  });

  it("confirm() throws CommandCancelledError when user cancels", async () => {
    vi.mocked(confirm).mockResolvedValue(cancelToken as unknown as boolean);
    await expect(adapter.confirm({ message: "Continue?" })).rejects.toThrow(CommandCancelledError);
  });

  it("select() throws CommandCancelledError when user cancels", async () => {
    vi.mocked(select).mockResolvedValue(cancelToken as unknown as string);
    await expect(adapter.select({ message: "Pick", options: [{ label: "A", value: "a" }] })).rejects.toThrow(
      CommandCancelledError
    );
  });

  it("multiselect() throws CommandCancelledError when user cancels", async () => {
    vi.mocked(multiselect).mockResolvedValue(cancelToken as unknown as Array<string>);
    await expect(adapter.multiselect({ message: "Pick", options: [{ label: "A", value: "a" }] })).rejects.toThrow(
      CommandCancelledError
    );
  });
});

describe("createPromptAdapter", () => {
  it("returns a ClackPromptAdapter", () => {
    expect(createPromptAdapter()).toBeInstanceOf(ClackPromptAdapter);
  });

  it("forwards the env option", () => {
    expect(createPromptAdapter({ env: { CI: "true" } }).isInteractive).toBe(false);
  });
});
