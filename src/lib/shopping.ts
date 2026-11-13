import { z } from "zod";
import type { ConceptItem } from "@/data/moodboards";
import type { GeneratedLook } from "./styleGeneration";

export const MAX_CANDIDATES = 3;
export const MAX_ATTEMPTS = 2;
export const SHOPPING_TTL = 30 * 60 * 1000;
export const RETAILERS = [
  { domain: "nordstrom.com", name: "Nordstrom", product: /\/s\/[^/]+\/\d+/ },
  { domain: "ssense.com", name: "SSENSE", product: /\/product\// },
  { domain: "farfetch.com", name: "FARFETCH", product: /-item-\d+\.aspx/ },
  { domain: "uniqlo.com", name: "Uniqlo", product: /\/products\// },
  { domain: "jcrew.com", name: "J.Crew", product: /\/p\// },
  { domain: "everlane.com", name: "Everlane", product: /\/products\// },
  { domain: "cos.com", name: "COS", product: /\/product[./-]/ },
  { domain: "arket.com", name: "ARKET", product: /\/product[./-]/ },
  { domain: "net-a-porter.com", name: "NET-A-PORTER", product: /\/product\// },
  { domain: "mrporter.com", name: "MR PORTER", product: /\/product\// },
  { domain: "bloomingdales.com", name: "Bloomingdale’s", product: /\/shop\/product\// },
  { domain: "macys.com", name: "Macy’s", product: /\/shop\/product\// },
];
export function productRetailer(raw: string) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    return RETAILERS.find((r) => (url.hostname === r.domain || url.hostname === `www.${r.domain}`) && r.product.test(url.pathname)) ?? null;
  } catch { return null; }
}
export const shoppingInput = z.object({
  role: z.enum(["Inner layer", "Bottoms", "Shoes", "Accessories"]),
  description: z.string().trim().min(3).max(240).refine((s) => !/https?:|www\./i.test(s), "Clothing descriptions only"),
  preference: z.enum(["menswear", "womenswear"]),
  country: z.string().regex(/^[A-Z]{2}$/).optional(),
  budget: z.object({ maximum: z.number().positive().max(100000), currency: z.string().regex(/^[A-Z]{3}$/) }).optional(),
});
export type ShoppingInput = z.infer<typeof shoppingInput>;
export interface RealProduct {
  name: string; brand: string | null; retailer: string; image: string | null;
  price: number | null; currency: string | null; url: string; retrievedAt: string;
  role: ShoppingInput["role"]; explanation: string; score: number;
}
export interface ShoppingResponse {
  status: "success" | "no-match" | "error"; products: RealProduct[]; error?: string;
  usage: { credits: number; calls: number; complete: boolean }; blocked: string[]; retrievedAt: string;
}
export type ShoppingRecord = ShoppingResponse & { status: ShoppingResponse["status"] | "loading"; attempts: number };
export function shoppingKey(look: GeneratedLook, item: ConceptItem, country?: string, budget?: ShoppingInput["budget"]) {
  return JSON.stringify([look.preference, look.styling, look.items.map((i) => [i.role, i.name]), item.role, item.name, country ?? "", budget ?? null]);
}
export function initialShoppingItems(items: ConceptItem[]) {
  return items.filter((i) => !i.owned).sort((a, b) => Number(Boolean(b.highlight)) - Number(Boolean(a.highlight))).slice(0, 2);
}
export function shoppingQuery(input: ShoppingInput) {
  const department = input.preference === "menswear" ? "men" : "women";
  const sites = RETAILERS.map((r) => `site:${r.domain}`).join(" OR ");
  return `${department} ${input.description} ${input.role === "Shoes" ? "shoes" : ""} ${input.budget ? `under ${input.budget.maximum} ${input.budget.currency}` : ""} ${input.country ?? ""} (${sites})`;
}
const groups = [
  ["shirt", "blouse", "button-up", "poplin"], ["knit", "sweater", "crewneck", "jumper", "cardigan", "turtleneck"],
  ["tee", "t-shirt"], ["trousers", "pants", "chinos"], ["jeans", "denim"], ["skirt"], ["shorts"],
  ["flats", "ballerina", "ballet"], ["loafers", "loafer"], ["sneakers", "trainers", "sneaker"], ["boots", "boot"],
  ["sandals", "sandal"], ["belt"], ["scarf"], ["bag", "tote"], ["jewelry", "necklace", "earrings"],
];
const colors = [["ivory", "cream", "off-white", "ecru"], ["black"], ["white"], ["grey", "gray", "charcoal"], ["navy"], ["blue"], ["brown", "tan", "camel"], ["green"], ["red", "burgundy"], ["pink"]];
const materials = ["cotton", "poplin", "wool", "cashmere", "linen", "leather", "suede", "silk", "denim"];
const shapes = ["wide", "straight", "slim", "fitted", "relaxed", "pointed", "cropped", "pleated", "ribbed"];
export function rankMatch(input: ShoppingInput, text: string, price: number | null, currency: string | null) {
  const wanted = input.description.toLowerCase(), actual = text.toLowerCase();
  const category = groups.find((g) => g.some((w) => wanted.includes(w)));
  if (!category || !category.some((w) => actual.includes(w))) return null;
  if (input.preference === "menswear" && /\b(women'?s?|womenswear|ladies)\b/.test(actual)) return null;
  if (input.preference === "womenswear" && /\b(men'?s?|menswear)\b/.test(actual)) return null;
  let score = 10;
  const matched: string[] = ["category"];
  const color = colors.find((g) => g.some((w) => wanted.includes(w)));
  if (color?.some((w) => actual.includes(w))) { score += 6; matched.push("color"); }
  for (const [words, weight, label] of [[materials, 3, "material"], [shapes, 4, "silhouette"]] as const) {
    const requested = words.filter((w) => wanted.includes(w));
    if (requested.some((w) => actual.includes(w))) { score += weight; matched.push(label); }
  }
  if (input.budget && price !== null && currency === input.budget.currency) {
    if (price > input.budget.maximum) return null;
    score += 2; matched.push("budget");
  }
  return { score, explanation: `Similar ${matched.join(", ")} to the ${input.role.toLowerCase()} in this look.` };
}