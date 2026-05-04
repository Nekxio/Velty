import type { CommandContext } from "@velty/core";
import { defineVeltyCommand } from "../command.js";

const runMigrate = (context: CommandContext): void => {
  console.log(`${context.commandName} is not implemented yet. The safe migration entrypoint is wired.`);
};

export const migrateCommand = defineVeltyCommand({
  name: "migrate",
  description: "Run guarded Svelte or SvelteKit migrations.",
  args: {
    migration: {
      type: "positional",
      required: false,
      description: "Migration identifier."
    },
    list: {
      type: "boolean",
      description: "List supported migrations."
    },
    install: {
      type: "string",
      description: "Package manager used to invoke svelte-migrate."
    }
  },
  run: runMigrate
});
