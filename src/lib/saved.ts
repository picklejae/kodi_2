import type { ConceptItem } from "@/data/moodboards";
import type { RecentItem, SavedOutfit } from "@/data/saved";
export function addRecent(items: RecentItem[], item: RecentItem): RecentItem[] {
  return [item, ...items.filter((entry) => entry.id !== item.id)].sort((a, b) =>
    b.uploadedAt.localeCompare(a.uploadedAt),
  );
}
export function removeRecent(items: RecentItem[], id: string) {
  return items.filter((item) => item.id !== id);
}
export function removeOutfit(items: SavedOutfit[], id: string) {
  return items.filter((item) => item.id !== id);
}

/** Hotspot anchors in percent of the image, fitted to the fixed 3:4 full-body mannequin render
 *  (savedoutfit_pin_issue.png): chest, coat panel, left leg, left shoe, belt line. */
export const HOTSPOT_POSITIONS = {
  top: { x: 50, y: 21 },
  outerwear: { x: 37, y: 28 },
  bottom: { x: 45, y: 72 },
  shoes: { x: 41, y: 91 },
  bag: { x: 63, y: 48 },
  accessory: { x: 50, y: 35 },
} as const;
export type HotspotCategory = keyof typeof HOTSPOT_POSITIONS;
const ROLE_CATEGORY: Record<ConceptItem["role"], HotspotCategory | null> = {
  "Your piece": null,
  "Inner layer": "top",
  "Bottoms": "bottom",
  "Shoes": "shoes",
  // No pins for accessories or bags: they are too small to place reliably on the render.
  "Accessories": null,
};
const OUTER = /\b(jacket|coat|overcoat|blazer|cardigan|parka|bomber|trench|overshirt|gilet|vest)\b/i;
export interface HotspotPlacement {
  product: ConceptItem;
  x: number;
  y: number;
}
/** One hotspot per non-owned product, placed by category; a second product in the same category shifts 12% right. */
export function hotspotPlacements(products: ConceptItem[]): HotspotPlacement[] {
  const seen = new Map<HotspotCategory, number>();
  const placements: HotspotPlacement[] = [];
  for (const product of products) {
    if (product.owned) continue;
    // Outer pieces arrive as "Inner layer" (the AI role set has no outerwear), so place them by name.
    const category = product.role === "Inner layer" && OUTER.test(product.name) ? "outerwear" : ROLE_CATEGORY[product.role];
    if (!category) continue;
    const count = seen.get(category) ?? 0;
    seen.set(category, count + 1);
    const base = HOTSPOT_POSITIONS[category];
    placements.push({ product, x: base.x + count * 12, y: base.y });
  }
  return placements;
}
