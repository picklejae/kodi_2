import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Node 25+ ships its own global localStorage that hides jsdom's (localStorage.clear is undefined).
    execArgv: ["--no-experimental-webstorage"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
