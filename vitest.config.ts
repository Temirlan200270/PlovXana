import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(dirname(fileURLToPath(import.meta.url)), "."),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});

