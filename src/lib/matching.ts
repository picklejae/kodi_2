import { BOLDNESS_LABEL, type Boldness, type CatalogCategory, type CatalogItem } from "@/data/catalog";
import type { ItemCategory, Occasion } from "@/data/samples";
import type { StyleTypeCode } from "@/data/styleTypes";

export interface Pick { item: CatalogItem; boldness: Boldness; reason: string }
export type Picks = Record<Boldness, Pick>;

// Same or near-duplicate catalog categories for an uploaded item.
export const EXCLUDED: Record<ItemCategory, CatalogCategory[]> = {
  jacket: ["outerwear"], coat: ["outerwear"], pants: ["pants"], shirt: ["shirts"],
};

const OCCASION_MOOD: Record<Occasion, "F" | "S"> = { coffee: "S", recruiting: "F", date: "F", weekend: "S" };

export function score(item: CatalogItem, type: StyleTypeCode, occasion: Occasion | null) {
  let s = 0;
  for (let i = 0; i < 4; i++) if (item.tags[i] === type[i]) s += 1;
  if (occasion && item.tags[3] === OCCASION_MOOD[occasion]) s += 0.5;
  return s;
}

const VIBE: Record<string, string> = { F: "sharp", S: "easy", N: "calm", C: "lively" };

export function reasonFor(item: CatalogItem, b: Boldness, itemName: string, type: StyleTypeCode) {
  const mood = VIBE[type[3]], color = VIBE[type[1]];
  if (b === "safe") return `${item.name} keep your ${itemName} ${color} and ${mood}.`.replace(/^(.*?) keep/, (m, n) => (/s$/.test(n) ? m : `${n} keeps`));
  if (b === "step") return `${item.name} adds texture to your ${itemName} without breaking your ${mood} style.`;
  return `${item.name} gives your ${itemName} one confident accent.`;
}

export function generatePicks(catalog: CatalogItem[], category: ItemCategory, itemName: string, type: StyleTypeCode, occasion: Occasion | null): Picks {
  const used = new Set<CatalogCategory>(EXCLUDED[category]);
  const out = {} as Picks;
  for (const b of ["safe", "step", "bold"] as Boldness[]) {
    const best = catalog
      .filter((c) => c.boldness === b && !used.has(c.category))
      .sort((x, y) => score(y, type, occasion) - score(x, type, occasion) || x.price - y.price)[0];
    used.add(best.category);
    out[b] = { item: best, boldness: b, reason: reasonFor(best, b, itemName.toLowerCase(), type) };
  }
  return out;
}
export { BOLDNESS_LABEL };
