export interface PieceBudget { min: number; max: number }
export const BUDGET_CHOICES = [
  { label: "Under $50", range: { min: 0, max: 49.99 } },
  { label: "$50–100", range: { min: 50, max: 100 } },
  { label: "$100–200", range: { min: 100, max: 200 } },
  { label: "$200+", range: { min: 200, max: 500 } },
] as const;
export function shoppingBudget(range: PieceBudget, known: boolean) {
  return known && range.max < 500 ? { maximum: range.max, currency: "USD" } : undefined;
}
export function priceInBudget(price: number | null, currency: string | null, range: PieceBudget, known: boolean) {
  if (!known) return true;
  // Unverified/non-USD prices cannot establish a match to a dollar budget.
  return price !== null && currency === "USD" && price >= range.min && (range.max >= 500 || price <= range.max);
}