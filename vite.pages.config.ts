// Prototype-only static build for GitHub Pages. Lovable never uses this file.
// AI and shopping server functions are swapped for stubs (pages/stubs.ts): cached/demo results still work.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

const base = process.env.PAGES_BASE ?? "/pairly-notes/kodi/";

// Lovable asset URLs are root-absolute ("/__l5e/..."); prefix them with the Pages base.
const assetBase = {
  name: "pages-asset-base",
  enforce: "pre" as const,
  // The Lovable root route renders a full <html> document (SSR shell); use a client-only root instead.
  resolveId(source: string, importer?: string) {
    if (source === "./routes/__root" && importer?.endsWith("routeTree.gen.ts")) return r("./pages/root.tsx");
  },
  load(id: string) {
    if (!id.endsWith(".asset.json")) return;
    const data = JSON.parse(readFileSync(id, "utf8"));
    data.url = base + String(data.url).replace(/^\//, "");
    return JSON.stringify(data);
  },
};

export default defineConfig({
  root: r("./pages"),
  base,
  plugins: [assetBase, react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@\/lib\/(styleGeneration|shopping)\.functions$/, replacement: r("./pages/stubs.ts") },
      { find: /^@\//, replacement: r("./src") + "/" },
    ],
  },
  build: { outDir: r("./dist-pages"), emptyOutDir: true },
});
