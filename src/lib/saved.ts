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
