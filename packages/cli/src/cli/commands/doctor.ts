import type { CommandContext } from "@velty/core";
import { defineVeltyCommand } from "../command.js";

const runDoctor = (context: CommandContext): void => {
  console.log(`${context.commandName} is not implemented yet. The diagnostic command entrypoint is ready.`);
};

export const doctorCommand = defineVeltyCommand({
  name: "doctor",
  description: "Diagnose a Svelte or SvelteKit project.",
  args: {
    scope: {
      type: "string",
      description: "Diagnostic scopes to run."
    },
    fix: {
      type: "boolean",
      description: "Apply safe fixes."
    }
  },
  run: runDoctor
});
