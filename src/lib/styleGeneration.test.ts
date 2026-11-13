import { describe, expect, it } from "vitest";
import { looksFromPlan, planSchema, closestAxis, axisShifts, validateLadder, styleProfile, defaultConcept } from "./styleGeneration";
const look = { name: "City texture", explanation: "Soft texture balances structured wool.", styling: "Grey knit, dark pants, boots", items: [{ role: "Bottoms" as const, name: "Dark trousers", highlight: true }, { role: "Shoes" as const, name: "Leather boots", highlight: false }] };
const ladder = [{ ...look, tier: "safe" as const, shift: "" }, { ...look, tier: "step" as const, shift: "Neutral → Color" }, { ...look, tier: "bold" as const, shift: "Tailored → Relaxed, Plain → Detail" }];
describe("personalized look state", () => {
 it("requires exactly three planned looks", () => {
  expect(planSchema.safeParse({ presentation: "studio", looks: [look, look] }).success).toBe(false);
  expect(planSchema.safeParse({ presentation: "studio", looks: ladder }).success).toBe(true);
 });
 it("starts each look loading with the same actual owned reference, never a demo image", () => {
  const looks = looksFromPlan({ presentation: "studio", looks: ladder }, "My coat", "owned-reference", "menswear");
  expect(looks).toHaveLength(3);
  for (const entry of looks) {
   expect(entry.status).toBe("loading");
   expect(entry.image).toBeUndefined();
   expect(entry.items[0]?.image).toBe("owned-reference");
   expect(entry.items[0]?.owned).toBe(true);
   expect(entry.items.every((item) => item.shopUrl === null && item.price === null)).toBe(true);
  }
 });
 it("preserves safe, step, bold tier order and rejects reordered plans", () => {
  expect(looksFromPlan({ presentation: "studio", looks: ladder }, "Coat", "photo", "menswear").map((entry) => entry.tier)).toEqual(["safe", "step", "bold"]);
  expect(planSchema.safeParse({ presentation: "studio", looks: [...ladder].reverse() }).success).toBe(false);
 });
 it("moves the closest-to-midpoint axis for step and at least two for bold", () => {
  expect(closestAxis([0.1, 0.49, 0.8, 0.9])).toBe(1);
  expect(closestAxis([0.5, 0.5, 0.5, 0.5])).toBe(0);
  const plan = { presentation: "studio", looks: ladder };
  expect(validateLadder(plan, "TNPF", [0.1, 0.49, 0.8, 0.9])).toBe(plan);
  expect(() => validateLadder(plan, "TNPF", [0.49, 0.1, 0.8, 0.9])).toThrow();
  expect(() => validateLadder({ ...plan, looks: ladder.map((entry) => entry.tier === "bold" ? { ...entry, shift: "Plain → Detail" } : entry) }, "TNPF", [0.1, 0.49, 0.8, 0.9])).toThrow();
 });
 it("reverses shifts relative to the user's own type, not a generic classic baseline", () => {
  expect(axisShifts("RCDS")).toEqual(["Relaxed → Tailored", "Color → Neutral", "Detail → Plain", "Street → Formal"]);
 });
 it("uses the skipped-quiz fallback regardless of an old type", () => {
  expect(styleProfile("RCDS", [1, 1, 1, 1], true)).toEqual({ styleType: "TNPF", axisScores: [0.5, 0.5, 0.5, 0.5] });
 });
 it("defaults high exploration to step and low exploration to safe", () => {
  expect(defaultConcept("high")).toBe(1);
  expect(defaultConcept("low")).toBe(0);
 });
});