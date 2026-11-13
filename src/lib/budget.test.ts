import { describe, expect, it } from "vitest";
import { BUDGET_CHOICES, priceInBudget, shoppingBudget } from "./budget";
describe("per-piece budget", () => {
  it("offers the four requested dollar ranges", () => {
    expect(BUDGET_CHOICES.map((choice) => choice.range)).toEqual([{ min: 0, max: 49.99 }, { min: 50, max: 100 }, { min: 100, max: 200 }, { min: 200, max: 500 }]);
  });
  it("unknown budget sends no ceiling and accepts every price range", () => {
    expect(shoppingBudget({ min: 0, max: 500 }, false)).toBeUndefined();
    expect(priceInBudget(1200, "USD", { min: 0, max: 500 }, false)).toBe(true);
    expect(priceInBudget(null, null, { min: 0, max: 500 }, false)).toBe(true);
  });
  it("a chosen range constrains verified live catalog prices only", () => {
    expect(shoppingBudget({ min: 50, max: 100 }, true)).toEqual({ maximum: 100, currency: "USD" });
    expect(priceInBudget(75, "USD", { min: 50, max: 100 }, true)).toBe(true);
    expect(priceInBudget(101, "USD", { min: 50, max: 100 }, true)).toBe(false);
    expect(priceInBudget(49, "USD", { min: 50, max: 100 }, true)).toBe(false);
    expect(priceInBudget(700, "USD", { min: 200, max: 500 }, true)).toBe(true);
  });
});