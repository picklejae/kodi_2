import { describe, it, expect } from "vitest";
import { RECENT_ITEMS, SAVED_OUTFITS } from "@/data/saved";
import type { ConceptItem } from "@/data/moodboards";
import { addRecent, removeRecent, removeOutfit, hotspotPlacements, HOTSPOT_POSITIONS } from "./saved";
describe("Saved collections", () => {
  it("starts with Jason’s chinos first and three curated example looks", () => {
    expect(RECENT_ITEMS).toHaveLength(7);
    expect(RECENT_ITEMS[0]?.productName).toBe("My beige chinos");
    expect(SAVED_OUTFITS).toHaveLength(3);
    expect(
      SAVED_OUTFITS.every((o) => o.imageUrl && o.products.some((p) => p.owned && p.role === "Your piece") && o.products.some((p) => !p.owned)),
    ).toBe(true);
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
  it("deletes a recent photo without deleting saved outfits", () => {
    expect(removeRecent(RECENT_ITEMS, "jason-chinos")).toHaveLength(6);
    expect(SAVED_OUTFITS).toHaveLength(3);
  });
  it("deletes only the selected saved outfit", () => {
    const next = removeOutfit(SAVED_OUTFITS, "outfit-1");
    expect(next).toHaveLength(2);
    expect(next.some((o) => o.id === "outfit-1")).toBe(false);
  });
});
describe("hotspotPlacements", () => {
  it("places hotspots by product category and skips the owned piece", () => {
    const first = SAVED_OUTFITS[0];
    if (!first) throw new Error("Missing seed outfit");
    const placements = hotspotPlacements(first.products);
    expect(placements.some((p) => p.product.owned)).toBe(false);
    const byRole = Object.fromEntries(placements.map((p) => [p.product.role, p]));
    expect(byRole["Inner layer"]).toMatchObject(HOTSPOT_POSITIONS.top);
    expect(byRole["Bottoms"]).toMatchObject(HOTSPOT_POSITIONS.bottom);
    expect(byRole["Shoes"]).toMatchObject(HOTSPOT_POSITIONS.shoes);
    expect(byRole["Accessories"]).toMatchObject(HOTSPOT_POSITIONS.accessory);
  });
  it("offsets a second product in the same category by 12%", () => {
    const products: ConceptItem[] = [
      { role: "Shoes", name: "Derbies", owned: false, brand: null, price: null, shopUrl: null },
      { role: "Shoes", name: "Loafers", owned: false, brand: null, price: null, shopUrl: null },
    ];
    const [first, second] = hotspotPlacements(products);
    const { x, y } = HOTSPOT_POSITIONS.shoes;
    expect(first).toMatchObject({ x, y });
    expect(second).toMatchObject({ x: x + 12, y });
  });
});
