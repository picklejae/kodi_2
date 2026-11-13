import { JASON_SAMPLE } from "./jason";
import menBlazer from "@/assets/samples/men-navy-blazer.jpg";
import menCoat from "@/assets/samples/men-camel-coat.jpg";
import menJeans from "@/assets/samples/men-light-jeans.jpg";
import menDerbies from "@/assets/samples/men-brown-derbies.jpg";
// Womenswear samples: Zara product shots, bundled (decision 11/13). AI women's photos stay in src/assets/samples, unused.
import womenSkirt from "@/assets/samples/women-satin-midi-skirt.jpg";
import womenTrench from "@/assets/samples/women-trench-coat.jpg";
import womenJeans from "@/assets/samples/women-jeans.jpg";
import womenCardigan from "@/assets/samples/women-cardigan.jpg";
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
  { id: "w-skirt", name: "Satin midi skirt", image: womenSkirt, category: "skirt", attributes: ["Beige", "Satin", "Midi"] },
  { id: "w-trench", name: "Trench coat", image: womenTrench, category: "coat", attributes: ["Beige", "Cotton", "Belted"] },
  { id: "w-jeans", name: "Jeans", image: womenJeans, category: "pants", attributes: ["Light blue", "Denim", "High waist"] },
  { id: "w-cardigan", name: "Cardigan", image: womenCardigan, category: "knit", attributes: ["Ecru", "Knit", "Gold buttons"] },
];
export function samplesFor(preference: "menswear" | "womenswear" | null): SampleItem[] {
  return preference === "womenswear" ? WOMEN_SAMPLES : SAMPLES;
}

// Ready-made "place or vibe" prompts for demos: pick one instead of typing live (memo field on Style).
export const VIBE_PROMPTS: string[] = [
  "Gallery opening in Chicago on a Friday night",
  "First coffee chat with a VC partner",
  "Rooftop brunch with friends in early fall",
  "Recruiting dinner at a downtown steakhouse",
];

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
