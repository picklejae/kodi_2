import { describe, expect, it } from "vitest";
import { looksFromPlan, planSchema } from "./styleGeneration";
const look = { name: "City texture", explanation: "Soft texture balances structured wool.", styling: "Grey knit, dark pants, boots", items: [{ role: "Bottoms" as const, name: "Dark trousers", highlight: true }, { role: "Shoes" as const, name: "Leather boots", highlight: false }] };
describe("personalized look state", () => {
 it("requires exactly three planned looks", () => {
  expect(planSchema.safeParse({ presentation: "studio", looks: [look, look] }).success).toBe(false);
  expect(planSchema.safeParse({ presentation: "studio", looks: [look, look, look] }).success).toBe(true);
 });
 it("starts each look loading with the same actual owned reference, never a demo image", () => {
  const looks = looksFromPlan({ presentation: "studio", looks: [look, look, look] }, "My coat", "owned-reference", "menswear");
  expect(looks).toHaveLength(3);
  for (const entry of looks) {
   expect(entry.status).toBe("loading");
   expect(entry.image).toBeUndefined();
   expect(entry.items[0]?.image).toBe("owned-reference");
   expect(entry.items[0]?.owned).toBe(true);
   expect(entry.items.every((item) => item.shopUrl === null && item.price === null)).toBe(true);
  }
 });
});