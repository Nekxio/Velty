import type { CommandContext } from "@velty/core";
import { defineVeltyCommand } from "../command.js";

const runGenerate = (context: CommandContext): void => {
  console.log(
    `${context.commandName} is not implemented yet. The generate command scaffold is wired for future entities.`
  );
};

export const generateCommand = defineVeltyCommand({
  name: "generate",
  description: "Generate Svelte or SvelteKit files.",
  alias: ["g"],
  args: {
    entity: {
      type: "positional",
      required: false,
      description: "Entity to generate."
    },
    name: {
      type: "positional",
      required: false,
      description: "Generated file or route name."
    },
    force: {
      type: "boolean",
      description: "Overwrite conflicting files."
    },
    ts: {
      type: "boolean",
      description: "Force TypeScript output."
    }
  },
  run: runGenerate
});
