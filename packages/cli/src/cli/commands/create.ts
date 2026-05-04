import type { CommandContext } from "@velty/core";
import { defineVeltyCommand } from "../command.js";

const runCreate = (context: CommandContext): void => {
  console.log(`${context.commandName} is not implemented yet. This CLI layer is ready for the create workflow.`);
};

export const createCommand = defineVeltyCommand({
  name: "create",
  description: "Create a Svelte or SvelteKit project.",
  args: {
    path: {
      type: "positional",
      required: false,
      description: "Target directory for the new project."
    },
    template: {
      type: "string",
      description: "Project template."
    },
    types: {
      type: "string",
      description: "Type checking mode."
    },
    add: {
      type: "string",
      description: "Add-ons to apply during creation."
    },
    install: {
      type: "string",
      description: "Package manager to use for installation."
    }
  },
  run: runCreate
});
