import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@velty/core": new URL("packages/core/src/index.ts", import.meta.url).pathname,
      "@velty/generators": new URL("packages/generators/src/index.ts", import.meta.url).pathname
    }
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["node_modules", "dist", ".velty-tmp", "*.config.*"]
    }
  }
});
