import a1 from "@/assets/presets/a1.jpg.asset.json";
import a2 from "@/assets/presets/a2.jpg.asset.json";
import a3 from "@/assets/presets/a3.jpg.asset.json";
import b1 from "@/assets/presets/b1.jpg.asset.json";
import b2 from "@/assets/presets/b2.jpg.asset.json";
import b3 from "@/assets/presets/b3.jpg.asset.json";
import chinos from "@/assets/presets/piece-chinos.jpg.asset.json";
import jacket from "@/assets/presets/piece-leather-jacket.jpg.asset.json";
import { TIERS, type GeneratedLook } from "@/lib/styleGeneration";
import type { SampleItem } from "./samples";
import type { ConceptItem } from "./moodboards";

export type DemoSetId = "set-a" | "set-b";
export const DEMO_SAMPLES: Record<DemoSetId, SampleItem> = {
  "set-a": { id: "set-a", name: "Beige chinos", image: chinos.url, category: "pants", attributes: ["Beige", "Cotton", "Wide"] },
  "set-b": { id: "set-b", name: "Brown leather jacket", image: jacket.url, category: "jacket", attributes: ["Brown", "Leather", "Zip-front"] },
};
// Descriptive piece labels transcribed from the supplied images; no invented brands/prices.
const sets = {
  "set-a": [
    { image: a1.url, name: "Heritage layers", pieces: [["Inner layer", "Navy waxed jacket with blue check shirt"], ["Shoes", "Black lace-up shoes"]] },
    { image: a2.url, name: "Soft cable knit", pieces: [["Inner layer", "Ivory cable-knit sweater with white shirt"], ["Shoes", "Brown suede loafers"]] },
    { image: a3.url, name: "Green and stripes", pieces: [["Inner layer", "Forest-green cardigan with navy-and-white striped tee"], ["Shoes", "Green retro sneakers"]] },
  ],
  "set-b": [
    { image: b1.url, name: "Leather and cream", pieces: [["Inner layer", "Charcoal tee"], ["Bottoms", "Cream wide-leg trousers"], ["Shoes", "Black leather shoes"], ["Accessories", "Silver necklace and black belt"]] },
    { image: b2.url, name: "Everyday denim", pieces: [["Inner layer", "White tee"], ["Bottoms", "Dark straight-leg jeans"], ["Shoes", "White low-top sneakers"]] },
    { image: b3.url, name: "Textured evening", pieces: [["Inner layer", "Black turtleneck"], ["Bottoms", "Charcoal textured pleated trousers"], ["Shoes", "Burgundy loafers"]] },
  ],
} as const;
export function demoSetLooks(id: DemoSetId): GeneratedLook[] {
  const owned = DEMO_SAMPLES[id];
  return sets[id].map((entry, index) => ({
    id: `${id}-${index}`, demoSet: id, tier: TIERS[index] ?? "safe", shift: "", preference: "menswear", department: "men", status: "success", image: entry.image, name: entry.name,
    explanation: `${entry.pieces.map(([, name]) => name).join(", ")} complement your ${owned.name.toLowerCase()}.`, styling: entry.name,
    items: [{ role: "Your piece", name: owned.name, image: owned.image, owned: true, brand: null, price: null, shopUrl: null }, ...entry.pieces.map(([role, name]): ConceptItem => ({ role, name, owned: false, brand: null, price: null, shopUrl: null }))],
  }));
}