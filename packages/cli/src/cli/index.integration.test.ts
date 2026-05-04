import { renderUsage, runCommand, type CommandDef, type SubCommandsDef } from "citty";
import { describe, expect, it } from "vitest";
import { veltyCommand } from "./index.js";

describe("veltyCommand — Citty integration", () => {
  it("renders root help with MVP subcommands", async () => {
    const usage = await renderUsage(veltyCommand);

    expect(usage).toContain("USAGE velty");
    expect(usage).toContain("create");
    expect(usage).toContain("migrate");
  });

  it("renders subcommand help without marking optional positionals as required", async () => {
    const subCommands = veltyCommand.subCommands as SubCommandsDef;
    const migrateCommand = subCommands.migrate as CommandDef;
    const usage = await renderUsage(migrateCommand, veltyCommand as unknown as CommandDef);

    expect(usage).toContain("USAGE velty migrate [OPTIONS] [MIGRATION]");
    expect(usage).not.toContain("Migration identifier. (Required)");
  });

  it("allows migrate --list without a migration positional", async () => {
    await expect(runCommand(veltyCommand, { rawArgs: ["migrate", "--list"] })).resolves.toBeDefined();
  });

  it("allows create without a path positional for future interactive flow", async () => {
    await expect(runCommand(veltyCommand, { rawArgs: ["create"] })).resolves.toBeDefined();
  });
});
