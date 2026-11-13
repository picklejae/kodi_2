import { JASON_SAMPLE } from "./jason";
import menBlazer from "@/assets/samples/men-navy-blazer.jpg";
import menCoat from "@/assets/samples/men-camel-coat.jpg";
import menJeans from "@/assets/samples/men-light-jeans.jpg";
import menDerbies from "@/assets/samples/men-brown-derbies.jpg";
import womenCoat from "@/assets/samples/women-camel-coat.jpg";
import womenJeans from "@/assets/samples/women-light-jeans.jpg";
import womenBlazer from "@/assets/samples/women-navy-blazer.jpg";
import womenBag from "@/assets/samples/women-burgundy-bag.jpg";
export type ItemCategory = "jacket" | "coat" | "pants" | "skirt" | "shirt" | "knit" | "shoes" | "bag";
export const CATEGORIES: ItemCategory[] = ["jacket", "coat", "pants", "shirt"];

export interface SampleItem { id: string; name: string; image: string; category: ItemCategory; attributes: string[] }

// Default samples: original AI-generated single-garment product photos (no person), one studio style.
export const SAMPLES: SampleItem[] = [
  { id: "blazer", name: "Navy blazer", image: menBlazer, category: "jacket", attributes: ["Navy", "Wool", "Tailored"] },
  { id: "coat", name: "Camel coat", image: menCoat, category: "coat", attributes: ["Camel", "Wool", "Long"] },
  { id: "denim", name: "Light denim", image: menJeans, category: "pants", attributes: ["Light blue", "Denim", "Straight"] },
  { id: "derby", name: "Brown derbies", image: menDerbies, category: "shoes", attributes: ["Dark brown", "Leather", "Lace-up"] },
];

export const WOMEN_SAMPLES: SampleItem[] = [
  { id: "w-coat", name: "Camel coat", image: womenCoat, category: "coat", attributes: ["Camel", "Wool", "Tailored"] },
  { id: "w-jeans", name: "Light jeans", image: womenJeans, category: "pants", attributes: ["Light blue", "Denim", "Straight"] },
  { id: "w-blazer", name: "Navy blazer", image: womenBlazer, category: "jacket", attributes: ["Navy", "Wool", "Fitted"] },
  { id: "w-bag", name: "Burgundy handbag", image: womenBag, category: "bag", attributes: ["Burgundy", "Leather", "Structured"] },
];
export function samplesFor(preference: "menswear" | "womenswear" | null): SampleItem[] {
  return preference === "womenswear" ? WOMEN_SAMPLES : SAMPLES;
}

export const UPLOAD_SAMPLES: SampleItem[] = [JASON_SAMPLE, ...SAMPLES, ...WOMEN_SAMPLES];

// Simulated analysis for real uploads: generic attributes per chosen category.
export const GENERIC_ATTRIBUTES: Record<ItemCategory, string[]> = {
  jacket: ["Dark", "Structured", "Tailored"],
  coat: ["Neutral", "Wool", "Long"],
  pants: ["Neutral", "Cotton", "Straight"],
  skirt: ["Neutral", "Fluid", "Midi"],
  shirt: ["Light", "Cotton", "Classic"],
  knit: ["Soft", "Knitted", "Relaxed"],
  shoes: ["Leather", "Classic"],
  bag: ["Leather", "Structured"],
};

export type Occasion = "coffee" | "recruiting" | "date" | "weekend";
export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "coffee", label: "Coffee chat" },
  { id: "recruiting", label: "Recruiting" },
  { id: "date", label: "Date" },
  { id: "weekend", label: "Weekend" },
];
