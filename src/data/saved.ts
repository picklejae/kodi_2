import type { ItemCategory } from "./samples";
import type { ConceptItem } from "./moodboards";
import r1 from "@/assets/recent-item-1.jpg";
import r2 from "@/assets/recent-item-2.jpg";
import r3 from "@/assets/recent-item-3.jpg";
import r4 from "@/assets/recent-item-4.jpg";
import r5 from "@/assets/recent-item-5.jpg";
import r6 from "@/assets/recent-item-6.jpg";
import tailored from "@/assets/moodboards/camel-tailored.jpg";
import contrast from "@/assets/moodboards/camel-soft-contrast.jpg";
import evening from "@/assets/moodboards/camel-evening.jpg";
import { JASON_SAMPLE } from "./jason";
import wTrench from "@/assets/saved/women-coat-trench-olive.jpg";
import wAutumn from "@/assets/saved/women-coat-autumn.jpg";
import wGrey from "@/assets/saved/women-coat-grey-city.jpg";
import { WOMEN_SAMPLES } from "./samples";
export interface RecentItem {
  id: string;
  imageUrl: string;
  productName: string;
  uploadedAt: string;
  category: ItemCategory;
  attributes?: string[];
  /** Demo seeds are tagged so each preference sees its own; user items have none and always show. */
  department?: "menswear" | "womenswear";
}
/** A curated outfit the user saved from Style: the AI model-worn image plus its products. */
export interface SavedOutfit {
  id: string;
  imageUrl: string;
  lookName: string;
  explanation: string;
  ownedName: string;
  products: ConceptItem[];
  feedbackImage?: string;
  department?: "menswear" | "womenswear";
}
const names = [
  "Brown Sweater",
  "Light Wash Denim Jacket",
  "Black Leather Loafers",
  "Cream Oxford Shirt",
  "Navy Chore Jacket",
  "Forest Green Cardigan",
];
const categories: ItemCategory[] = ["knit", "jacket", "shoes", "shirt", "jacket", "knit"];
const originalRecents: RecentItem[] = [r1, r2, r3, r4, r5, r6].map((imageUrl, i) => ({
  id: `recent-${i + 1}`,
  imageUrl,
  productName: names[i] ?? "Your piece",
  uploadedAt: `2026-11-${String(12 - i).padStart(2, "0")}T12:00:00Z`,
  category: categories[i] ?? "shirt",
  department: "menswear" as const,
}));
const WOMEN_RECENTS: RecentItem[] = WOMEN_SAMPLES.map((sample, i) => ({ id: `w-recent-${i + 1}`, imageUrl: sample.image, productName: sample.name, uploadedAt: `2026-11-${String(12 - i).padStart(2, "0")}T12:00:00Z`, category: sample.category, attributes: sample.attributes, department: "womenswear" }));
export const RECENT_ITEMS: RecentItem[] = [{ id: "jason-chinos", imageUrl: JASON_SAMPLE.image, productName: JASON_SAMPLE.name, uploadedAt: "2026-11-13T04:27:00Z", category: "pants", attributes: JASON_SAMPLE.attributes, department: "menswear" }, ...originalRecents, ...WOMEN_RECENTS];
function seed(id: string, imageUrl: string, lookName: string, explanation: string, pieces: [ConceptItem["role"], string][], department: "menswear" | "womenswear" = "menswear", ownedName = "Camel coat"): SavedOutfit {
  return {
    id,
    imageUrl,
    lookName,
    explanation,
    department,
    ownedName,
    products: [
      { role: "Your piece", name: ownedName, owned: true, brand: null, price: null, shopUrl: null },
      ...pieces.map(([role, name]): ConceptItem => ({ role, name, owned: false, brand: null, price: null, shopUrl: null })),
    ],
  };
}
// Demo seeds: example saved outfits produced by the same AI curation feature.
export const SAVED_OUTFITS: SavedOutfit[] = [
  seed("outfit-1", tailored, "Tailored", "An ivory knit softens the warm outer layer, while charcoal trousers and black loafers give the silhouette a clean finish.", [["Inner layer", "Ivory fine-knit crewneck"], ["Bottoms", "Charcoal straight-leg trousers"], ["Shoes", "Black leather loafers"], ["Accessories", "Slim black belt"]]),
  seed("outfit-2", contrast, "Soft Contrast", "Pale grey texture and off-white trousers create a gentle contrast with the camel wool; white sneakers keep the finish relaxed.", [["Inner layer", "Pale grey textured sweater"], ["Bottoms", "Off-white relaxed trousers"], ["Shoes", "White low-profile sneakers"], ["Accessories", "Soft grey scarf"]]),
  seed("outfit-3", evening, "Evening", "A fitted black turtleneck balances the open coat, while wide-leg black trousers and boots extend the silhouette.", [["Inner layer", "Fitted black turtleneck"], ["Bottoms", "Black wide-leg trousers"], ["Shoes", "Black Chelsea boots"], ["Accessories", "Slim black belt"]]),
  // Womenswear examples: real outfit photos (Pexels, free license), each built around the coat in the photo.
  seed("w-outfit-1", wTrench, "Belted & Olive", "The belted trench over a white top keeps the coat line clean, while olive trousers and boots warm up the neutrals.", [["Inner layer", "White fitted top"], ["Bottoms", "Olive straight trousers"], ["Shoes", "Black leather ankle boots"]], "womenswear", "Beige trench coat"),
  seed("w-outfit-2", wAutumn, "Autumn Walk", "A houndstooth coat over dark basics lets the pattern lead; black tights and boots keep it easy for a long day outside.", [["Inner layer", "Black fitted knit"], ["Bottoms", "Black tights"], ["Shoes", "Black ankle boots"]], "womenswear", "Houndstooth coat"),
  seed("w-outfit-3", wGrey, "City Grey", "A dark turtleneck and grey trousers let the grey coat lead; one tone head to toe looks sharp for meetings.", [["Inner layer", "Dark fitted turtleneck"], ["Bottoms", "Grey tailored trousers"], ["Shoes", "Black pointed flats"]], "womenswear", "Grey long coat"),
];
