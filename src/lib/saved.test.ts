import { describe, it, expect } from "vitest";
import { RECENT_ITEMS, SAVED_OUTFITS } from "@/data/saved";
import { addRecent, removeRecent, removeOutfit } from "./saved";
describe("Saved collections", () => {
  it("starts with Jason’s chinos first and eight owned outfits", () => {
    expect(RECENT_ITEMS).toHaveLength(7);
    expect(RECENT_ITEMS[0]?.productName).toBe("My beige chinos");
    expect(SAVED_OUTFITS).toHaveLength(8);
    expect(SAVED_OUTFITS.every((o) => o.products.every((p) => p.isOwned && p.brand === "My closet" && p.price === "" && p.shopUrl === ""))).toBe(
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
      uploadedAt: "2026-11-13T05:30:00Z",
    };
    expect(addRecent(RECENT_ITEMS, item)[0]?.id).toBe("new");
  });
  it("deletes a recent photo without deleting its saved outfits", () => {
    expect(removeRecent(RECENT_ITEMS, "jason-chinos")).toHaveLength(6);
    expect(SAVED_OUTFITS.some((o) => o.ownedItemId === "jason-chinos")).toBe(true);
  });
  it("deletes only the selected saved outfit", () => {
    const next = removeOutfit(SAVED_OUTFITS, "outfit-1");
    expect(next).toHaveLength(7);
    expect(next.some((o) => o.id === "outfit-1")).toBe(false);
  });
});
