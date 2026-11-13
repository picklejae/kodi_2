import type { ItemCategory } from "./samples";
import type { CatalogItem } from "./catalog";
import type { Pick } from "@/lib/matching";
import r1 from "@/assets/recent-item-1.jpg";
import r2 from "@/assets/recent-item-2.jpg";
import r3 from "@/assets/recent-item-3.jpg";
import r4 from "@/assets/recent-item-4.jpg";
import r5 from "@/assets/recent-item-5.jpg";
import r6 from "@/assets/recent-item-6.jpg";
import { JASON_FITS, JASON_SAMPLE, JASON_EXPLANATION } from "./jason";
export interface RecentItem {
  id: string;
  imageUrl: string;
  productName: string;
  uploadedAt: string;
  category: ItemCategory;
  attributes?: string[];
}
export interface SavedProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  thumbnailUrl: string;
  shopUrl: string;
  x: number;
  y: number;
  isOwned: boolean;
}
export interface SavedOutfit {
  id: string;
  imageUrl: string;
  ownedItemId: string;
  ownedImage: string;
  ownedName: string;
  products: SavedProduct[];
  look: Pick;
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
}));
export const RECENT_ITEMS: RecentItem[] = [{ id: "jason-chinos", imageUrl: JASON_SAMPLE.image, productName: JASON_SAMPLE.name, uploadedAt: "2026-11-13T04:27:00Z", category: "pants", attributes: JASON_SAMPLE.attributes }, ...originalRecents];
export const SAVED_OUTFITS: SavedOutfit[] = JASON_FITS.map((fit, i) => {
 const products: SavedProduct[] = fit.pieces.map(([name, x, y], j) => ({ id: `jason-${i + 1}-${j}`, name, x, y, brand: "My closet", price: "", shopUrl: "", thumbnailUrl: fit.image, isOwned: true }));
 const items = products.map((p): CatalogItem => ({ id: p.id, name: p.name, brand: p.brand, price: 0, image: p.thumbnailUrl, category: "accessories", tags: "TNPF", boldness: "safe", buyUrl: "" }));
 const first = items[0], second = items[1];
 if (!first || !second) throw new Error("Missing Jason outfit pieces");
 return { id: `outfit-${i + 1}`, imageUrl: fit.image, ownedItemId: i === 0 ? "jason-chinos" : `jason-fit-${i + 1}`, ownedImage: i === 0 ? JASON_SAMPLE.image : fit.image, ownedName: i === 0 ? JASON_SAMPLE.name : products[0]?.name ?? "My outfit", products, look: { items: [first, second], boldness: "safe", reason: i === 0 ? JASON_EXPLANATION : "An outfit from your own closet." } };
});
