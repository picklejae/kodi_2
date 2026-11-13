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

/** Default hotspot anchors by product category, in percent of the image. Tune here. */
export const HOTSPOT_POSITIONS = {
  top: { x: 50, y: 32 },
  outerwear: { x: 50, y: 32 },
  bottom: { x: 50, y: 62 },
  shoes: { x: 50, y: 92 },
  bag: { x: 72, y: 50 },
  accessory: { x: 72, y: 50 },
} as const;
export type HotspotCategory = keyof typeof HOTSPOT_POSITIONS;
const ROLE_CATEGORY: Record<ConceptItem["role"], HotspotCategory | null> = {
  "Your piece": null,
  "Inner layer": "top",
  "Bottoms": "bottom",
  "Shoes": "shoes",
  "Accessories": "accessory",
};
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
    const category = ROLE_CATEGORY[product.role];
    if (!category) continue;
    const count = seen.get(category) ?? 0;
    seen.set(category, count + 1);
    const base = HOTSPOT_POSITIONS[category];
    placements.push({ product, x: base.x + count * 12, y: base.y });
  }
  return placements;
}
