// Copies Lovable-hosted image assets (*.asset.json) into pages/public so the static build is self-contained.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const file of walk("src").filter((f) => f.endsWith(".asset.json"))) {
  const { url, project_id } = JSON.parse(readFileSync(file, "utf8"));
  const out = join("pages/public", url);
  if (existsSync(out)) continue;
  const res = await fetch(`https://id-preview--${project_id}.lovable.app${url}`);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log("fetched", url);
}
