import tailored from "@/assets/moodboards/camel-tailored.jpg";
import contrast from "@/assets/moodboards/camel-soft-contrast.jpg";
import evening from "@/assets/moodboards/camel-evening.jpg";
import type { ItemCategory } from "./samples";

export interface ConceptItem {
  role: "Your piece" | "Inner layer" | "Bottoms" | "Shoes" | "Accessories";
  name: string;
  owned: boolean;
  highlight?: boolean;
  image?: string;
  brand: string | null;
  price: number | null;
  shopUrl: string | null;
}
export interface MoodboardLook {
  id: string;
  name: string;
  image?: string;
  explanation: string;
  items: ConceptItem[];
}
const directions = [
  { id: "tailored", name: "Tailored", image: tailored, inner: "Ivory fine-knit crewneck", bottoms: "Charcoal straight-leg trousers", shoes: "Black leather loafers", accessory: "Slim black belt", explanation: "An ivory knit softens the warm outer layer, while charcoal trousers and black loafers give the silhouette a clean finish." },
  { id: "contrast", name: "Soft Contrast", image: contrast, inner: "Pale grey textured sweater", bottoms: "Off-white relaxed trousers", shoes: "White low-profile sneakers", accessory: "Soft grey scarf", explanation: "Pale grey texture and off-white trousers create a gentle contrast with the camel wool; white sneakers keep the finish relaxed." },
  { id: "evening", name: "Evening", image: evening, inner: "Fitted black turtleneck", bottoms: "Black wide-leg trousers", shoes: "Black Chelsea boots", accessory: "Slim black belt", explanation: "A fitted black turtleneck balances the open coat, while wide-leg black trousers and boots extend the silhouette." },
];
export function getMoodboardLooks(category: ItemCategory, name: string, image: string): MoodboardLook[] {
  const isCamelDemo = category === "coat" && name === "Camel coat";
  return directions.map((direction) => {
    const item = (role: ConceptItem["role"], title: string, highlight = false): ConceptItem => ({ role, name: title, owned: false, highlight, brand: null, price: null, shopUrl: null });
    const items: ConceptItem[] = [{ ...item("Your piece", name), owned: true, image }];
    if (["jacket", "coat", "pants", "shoes"].includes(category)) items.push(item("Inner layer", direction.inner, true));
    if (category !== "pants") items.push(item("Bottoms", direction.bottoms, true));
    if (category !== "shoes") items.push(item("Shoes", direction.shoes));
    items.push(item("Accessories", direction.accessory));
    const companions = items.filter((entry) => !entry.owned && entry.role !== "Accessories").map((entry) => entry.name.toLowerCase());
    return { id: direction.id, name: direction.name, ...(isCamelDemo ? { image: direction.image } : {}),
      explanation: isCamelDemo ? direction.explanation : `${companions.join(", ")} create a ${direction.name.toLowerCase()} concept around your ${name.toLowerCase()}.`, items };
  });
}
