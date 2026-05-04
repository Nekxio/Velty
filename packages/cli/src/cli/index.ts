import { CANCEL_EXIT_CODE, CommandCancelledError, NonInteractivePromptError } from "@velty/core";
import { defineCommand, runMain } from "citty";
import { globalArgs } from "./command.js";
import { addCommand } from "./commands/add.js";
import { checkCommand } from "./commands/check.js";
import { createCommand } from "./commands/create.js";
import { doctorCommand } from "./commands/doctor.js";
import { generateCommand } from "./commands/generate.js";
import { migrateCommand } from "./commands/migrate.js";

const version = "0.1.0";

export const veltyCommand = defineCommand({
  meta: {
    name: "velty",
    description: "Opinionated CLI for Svelte and SvelteKit.",
    version
  },
  args: globalArgs,
  subCommands: {
    create: createCommand,
    add: addCommand,
    generate: generateCommand,
    doctor: doctorCommand,
    check: checkCommand,
    migrate: migrateCommand
  }
});

export const runCli = async (argv: ReadonlyArray<string> = process.argv.slice(2)): Promise<void> => {
  try {
    await runMain(veltyCommand, {
      rawArgs: [...argv]
    });
  } catch (error) {
    if (error instanceof CommandCancelledError) {
      console.error(error.message);
      process.exitCode = CANCEL_EXIT_CODE;
      return;
    }

    if (error instanceof NonInteractivePromptError) {
      console.error(error.message);
      process.exitCode = 1;
      return;
    }

    throw error;
  }
};
