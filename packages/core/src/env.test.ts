import { describe, expect, it } from "vitest";
import { isCiEnvironment } from "./env.js";

describe("isCiEnvironment", () => {
  it("is false when CI is absent", () => {
    expect(isCiEnvironment({})).toBe(false);
  });

  it("is false when CI is explicitly false-like", () => {
    expect(isCiEnvironment({ CI: "" })).toBe(false);
    expect(isCiEnvironment({ CI: "0" })).toBe(false);
    expect(isCiEnvironment({ CI: "false" })).toBe(false);
    expect(isCiEnvironment({ CI: "FALSE" })).toBe(false);
  });

  it("is true for common CI truthy values", () => {
    expect(isCiEnvironment({ CI: "true" })).toBe(true);
    expect(isCiEnvironment({ CI: "1" })).toBe(true);
    expect(isCiEnvironment({ CI: "yes" })).toBe(true);
  });
});
