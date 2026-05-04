import type { CommandContext } from "@velty/core";
import { defineVeltyCommand } from "../command.js";

const runCheck = (context: CommandContext): void => {
  console.log(`${context.commandName} is not implemented yet. The wrapper boundary for svelte-check is ready.`);
};

export const checkCommand = defineVeltyCommand({
  name: "check",
  description: "Run Svelte diagnostics via svelte-check.",
  run: runCheck
});
