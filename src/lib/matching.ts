import { BOLDNESS_LABEL, type Boldness, type CatalogCategory, type CatalogItem } from "@/data/catalog";
import type { ItemCategory, Occasion } from "@/data/samples";
import { STYLE_TYPES, type StyleTypeCode } from "@/data/styleTypes";
import type { ExploreLevel } from "./styleType";

export interface Pick { items: [CatalogItem, CatalogItem]; boldness: Boldness; reason: string }
export type Picks = Record<Boldness, Pick>;

// Same or near-duplicate catalog categories for an uploaded item.
export const EXCLUDED: Record<ItemCategory, CatalogCategory[]> = {
  jacket: ["outerwear"], coat: ["outerwear"], pants: ["pants"], skirt: ["pants"], shirt: ["shirts"],
  knit: ["knits"], shoes: ["shoes"], bag: ["accessories"],
};

const OCCASION_MOOD: Record<Occasion, "F" | "S"> = { coffee: "S", recruiting: "F", date: "F", weekend: "S" };

export function score(item: CatalogItem, type: StyleTypeCode, occasion: Occasion | null) {
  let s = 0;
  for (let i = 0; i < 4; i++) if (item.tags[i] === type[i]) s += 1;
  if (occasion && item.tags[3] === OCCASION_MOOD[occasion]) s += 0.5;
  return s;
}

export function lookOrder(exploreLevel: ExploreLevel): Boldness[] {
  return exploreLevel === "low" ? ["safe", "step", "bold"] : ["step", "safe", "bold"];
}

export function reasonFor(items: [CatalogItem, CatalogItem], b: Boldness, itemName: string, type: StyleTypeCode) {
  const accent = b === "safe" ? "a familiar pairing" : b === "step" ? "a fresh texture" : "a confident accent";
  return `${items[0].name} and ${items[1].name} give your ${itemName} ${accent} that suits your ${STYLE_TYPES[type].name} style.`;
}

export function generatePicks(catalog: CatalogItem[], category: ItemCategory, itemName: string, type: StyleTypeCode, occasion: Occasion | null): Picks {
  const out = {} as Picks;
  for (const b of ["safe", "step", "bold"] as Boldness[]) {
    const eligible = catalog.filter((c) => !EXCLUDED[category].includes(c.category));
    const rank = (items: CatalogItem[]) => [...items].sort((x, y) => score(y, type, occasion) - score(x, type, occasion) || x.price - y.price);
    const mainCategories: CatalogCategory[] = category === "pants" ? ["shirts", "knits"] : ["pants"];
    const main = rank(eligible.filter((c) => c.boldness === b && mainCategories.includes(c.category)))[0];
    if (!main) throw new Error(`No ${b} main garment available`);
    const candidates = eligible.filter((c) => c.category !== main.category && c.category !== "tees");
    // Footwear completes the silhouette; prefer the tier, then fall back to style fit.
    const second = rank(candidates.filter((c) => c.category === "shoes" && c.boldness === b))[0]
      ?? rank(candidates.filter((c) => c.boldness === b))[0]
      ?? rank(candidates)[0];
    if (!second) throw new Error(`No ${b} companion garment available`);
    const items: [CatalogItem, CatalogItem] = [main, second];
    out[b] = { items, boldness: b, reason: reasonFor(items, b, itemName.toLowerCase(), type) };
  }
  return out;
}
export { BOLDNESS_LABEL };
