import type { ItemCategory } from "./samples";
import type { CatalogItem } from "./catalog";
import type { Pick } from "@/lib/matching";
import r1 from "@/assets/recent-item-1.jpg";
import r2 from "@/assets/recent-item-2.jpg";
import r3 from "@/assets/recent-item-3.jpg";
import r4 from "@/assets/recent-item-4.jpg";
import r5 from "@/assets/recent-item-5.jpg";
import r6 from "@/assets/recent-item-6.jpg";
import o1 from "@/assets/saved-outfit-1.jpg";
import o2 from "@/assets/saved-outfit-2.jpg";
import o3 from "@/assets/saved-outfit-3.jpg";
import o4 from "@/assets/saved-outfit-4.jpg";
import o5 from "@/assets/saved-outfit-5.jpg";
import o6 from "@/assets/saved-outfit-6.jpg";
import t1 from "@/assets/outfit-1-bottom.jpg";
import s1 from "@/assets/outfit-1-shoes.jpg";
import t2 from "@/assets/outfit-2-bottom.jpg";
import s2 from "@/assets/outfit-2-shoes.jpg";
import t3 from "@/assets/outfit-3-bottom.jpg";
import s3 from "@/assets/outfit-3-shoes.jpg";
import t4 from "@/assets/outfit-4-bottom.jpg";
import s4 from "@/assets/outfit-4-shoes.jpg";
import t5 from "@/assets/outfit-5-bottom.jpg";
import s5 from "@/assets/outfit-5-shoes.jpg";
import t6 from "@/assets/outfit-6-bottom.jpg";
import s6 from "@/assets/outfit-6-top.jpg";
export interface RecentItem {
  id: string;
  imageUrl: string;
  productName: string;
  uploadedAt: string;
  category: ItemCategory;
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
export const RECENT_ITEMS: RecentItem[] = [r1, r2, r3, r4, r5, r6].map((imageUrl, i) => ({
  id: `recent-${i + 1}`,
  imageUrl,
  productName: names[i] ?? "Your piece",
  uploadedAt: `2026-11-${String(12 - i).padStart(2, "0")}T12:00:00Z`,
  category: categories[i] ?? "shirt",
}));
const outfits = [o1, o2, o3, o4, o5, o6];
const thumbs = [
  [t1, s1],
  [t2, s2],
  [t3, s3],
  [t4, s4],
  [t5, s5],
  [t6, s6],
];
const productNames = [
  ["Mustard Corduroy Pants", "White Sneakers"],
  ["Black Straight Trousers", "Black Leather Loafers"],
  ["Olive Chinos", "Brown Suede Loafers"],
  ["Grey Tailored Trousers", "Brown Chelsea Boots"],
  ["Dark Blue Jeans", "Cream Sneakers"],
  ["Charcoal Wool Trousers", "Light Blue Oxford Shirt"],
];
export const SAVED_OUTFITS: SavedOutfit[] = outfits.map((imageUrl, i) => {
  const owned = RECENT_ITEMS[i === 5 ? 2 : i === 2 ? 3 : i === 3 ? 4 : i === 4 ? 5 : i];
  if (!owned) throw new Error("Missing mock owned item");
  const products: SavedProduct[] = (productNames[i] ?? []).map((name, j) => ({
    id: `mock-${i + 1}-${j + 1}`,
    name,
    brand: j === 0 ? "Common Thread" : "Calder",
    price: j === 0 ? "$130" : "$160",
    thumbnailUrl: thumbs[i]?.[j] ?? imageUrl,
    shopUrl: `https://example.com/shop/${name.toLowerCase().replaceAll(" ", "-")}`,
    x: j === 0 ? 30 : 75,
    y: i === 5 && j === 1 ? 27 : 72,
    isOwned: false,
  }));
  const items = products.map((p, j): CatalogItem => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: Number(p.price.slice(1)),
    image: p.thumbnailUrl,
    category: j === 0 ? "pants" : i === 5 ? "shirts" : "shoes",
    tags: "TNPF",
    boldness: "step",
    buyUrl: p.shopUrl,
  }));
  const first = items[0],
    second = items[1];
  if (!first || !second) throw new Error("Missing mock products");
  return {
    id: `outfit-${i + 1}`,
    imageUrl,
    ownedItemId: owned.id,
    ownedImage: owned.imageUrl,
    ownedName: owned.productName,
    products,
    look: {
      items: [first, second],
      boldness: "step",
      reason: `These pieces bring balance and contrast to your ${owned.productName.toLowerCase()}, a fresh pairing for your Quiet Classic style.`,
    },
  };
});
