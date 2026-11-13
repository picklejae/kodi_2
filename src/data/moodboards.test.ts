import { describe, expect, it } from "vitest";
import { getMoodboardLooks } from "./moodboards";
describe("demo moodboard concepts", () => {
  it("returns exactly three Camel coat concepts with complete outfit roles", () => {
    const looks = getMoodboardLooks("coat", "Camel coat", "owned.jpg");
    expect(looks).toHaveLength(3);
    expect(new Set(looks.map((look) => look.image)).size).toBe(3);
    for (const look of looks) {
      expect(look.image).toBeTruthy();
      expect(look.items.map((item) => item.role)).toEqual(["Your piece", "Inner layer", "Bottoms", "Shoes", "Accessories"]);
    }
  });
  it("does not pass off the coat demo images as personalized uploads", () => {
    expect(getMoodboardLooks("jacket", "Uploaded jacket", "upload.jpg").every((look) => look.image === undefined)).toBe(true);
  });
  it("retains the owned piece without selling it or inventing prices and links", () => {
    for (const look of getMoodboardLooks("coat", "Camel coat", "owned.jpg")) {
      expect(look.items.filter((item) => item.owned)).toHaveLength(1);
      expect(look.items[0]?.image).toBe("owned.jpg");
      expect(look.items.every((item) => item.price === null && item.shopUrl === null && item.brand === null)).toBe(true);
    }
  });
});
