import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
    include: ["src/integration/**/*.integration.test.ts"],
    exclude: ["node_modules"],
    globalSetup: ["./src/integration/global-setup.ts"],
    setupFiles: ["./src/integration/setup.ts"],
    testTimeout: 30000,
    threads: false,
    singleThread: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
