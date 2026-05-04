import { pathToFileURL } from "node:url";
import { runCli } from "./cli/index.js";

export { runCli, veltyCommand } from "./cli/index.js";

const isEntrypoint = (): boolean => {
  const entryArgument = process.argv[1];
  return typeof entryArgument === "string" && import.meta.url === pathToFileURL(entryArgument).href;
};

if (isEntrypoint()) {
  await runCli();
}
