import type { CommandContext } from "@velty/core";
import { defineVeltyCommand } from "../command.js";

const runAdd = (context: CommandContext): void => {
  console.log(`${context.commandName} is not implemented yet. The command routing and context boundary are in place.`);
};

export const addCommand = defineVeltyCommand({
  name: "add",
  description: "Add one or more Velty add-ons to an existing project.",
  args: {
    addons: {
      type: "positional",
      required: false,
      description: "Add-on identifiers."
    },
    install: {
      type: "string",
      description: "Package manager to use for installation."
    },
    list: {
      type: "boolean",
      description: "List available add-ons."
    },
    search: {
      type: "string",
      description: "Filter add-ons by name."
    },
    force: {
      type: "boolean",
      description: "Overwrite conflicting files."
    }
  },
  run: runAdd
});
