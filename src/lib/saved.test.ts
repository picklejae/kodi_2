import { describe, it, expect } from "vitest";
import { RECENT_ITEMS, SAVED_OUTFITS } from "@/data/saved";
import { addRecent, removeRecent, removeOutfit } from "./saved";
describe("Saved collections", () => {
  it("starts with six clothing photos and six complete outfits", () => {
    expect(RECENT_ITEMS).toHaveLength(6);
    expect(SAVED_OUTFITS).toHaveLength(6);
    expect(SAVED_OUTFITS.every((o) => o.products.filter((p) => !p.isOwned).length === 2)).toBe(
      true,
    );
  });
  it("puts each new upload first", () => {
    const item = {
      ...RECENT_ITEMS[0],
      id: "new",
      imageUrl: "uploaded",
      productName: "Uploaded jacket",
      category: "jacket" as const,
      uploadedAt: "2026-11-13T01:30:00Z",
    };
    expect(addRecent(RECENT_ITEMS, item)[0]?.id).toBe("new");
  });
  it("deletes a recent photo without deleting its saved outfits", () => {
    expect(removeRecent(RECENT_ITEMS, "recent-1")).toHaveLength(5);
    expect(SAVED_OUTFITS.some((o) => o.ownedItemId === "recent-1")).toBe(true);
  });
  it("deletes only the selected saved outfit", () => {
    const next = removeOutfit(SAVED_OUTFITS, "outfit-1");
    expect(next).toHaveLength(5);
    expect(next.some((o) => o.id === "outfit-1")).toBe(false);
  });
});
