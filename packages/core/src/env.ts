export const isCiEnvironment = (env: NodeJS.ProcessEnv = process.env): boolean => {
  const value = env.CI;
  return value !== undefined && value !== "" && value !== "0" && value.toLowerCase() !== "false";
};
