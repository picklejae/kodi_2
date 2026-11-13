import { JASON_SAMPLE } from "./jason";
export type ItemCategory = "jacket" | "coat" | "pants" | "skirt" | "shirt" | "knit" | "shoes";
export const CATEGORIES: ItemCategory[] = ["jacket", "coat", "pants", "shirt"];

export interface SampleItem { id: string; name: string; image: string; category: ItemCategory; attributes: string[] }

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;

export const SAMPLES: SampleItem[] = [
  { id: "blazer", name: "Navy blazer", image: img("1594938298603-c8148c4dae35"), category: "jacket", attributes: ["Navy", "Wool", "Tailored"] },
  { id: "coat", name: "Camel coat", image: img("1539533018447-63fcce2678e3"), category: "coat", attributes: ["Camel", "Wool", "Long"] },
  { id: "denim", name: "Light denim", image: img("1541099649105-f69ad21f3246"), category: "pants", attributes: ["Light blue", "Denim", "Straight"] },
  { id: "oxford", name: "Oxford shirt", image: img("1596755094514-f87e34085b2c"), category: "shirt", attributes: ["White", "Cotton", "Button-down"] },
];

// Womenswear samples: Zara product shots on a plain background (team reference board, 11/13).
// Images load from the publishers' CDNs; product pages: zara.com satin-midi-skirt p02157252,
// zw-collection belted trench p00518241, women's high-waist jeans, women's knit cardigans.
export const WOMEN_SAMPLES: SampleItem[] = [
  { id: "w-skirt", name: "Satin midi skirt", image: "https://content25.lecturas.com/medio/2024/11/01/falda-midi-satinada_46719dbb_241101232250_1920x2880.webp", category: "skirt", attributes: ["Beige", "Satin", "Midi"] },
  { id: "w-trench", name: "Trench coat", image: "https://www.marie-claire.es/wp-content/uploads/sites/2/2023/02/06/63e0da411aa41.jpeg", category: "coat", attributes: ["Beige", "Cotton", "Belted"] },
  { id: "w-jeans", name: "Jeans", image: "https://static.zara.net/assets/public/193b/11e3/86054305a94f/01a36957d564/04083022427-f1/04083022427-f1.jpg?f=auto&ts=1769164422756&w=570", category: "pants", attributes: ["Light blue", "Denim", "High waist"] },
  { id: "w-cardigan", name: "Cardigan", image: "https://n.cdn.cdek.shopping/images/shopping/32e1ad63d76b4fbdbd1cbbe9c5bf535c.jpg?v=1", category: "knit", attributes: ["Ecru", "Knit", "Gold buttons"] },
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
};

export type Occasion = "coffee" | "recruiting" | "date" | "weekend";
export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "coffee", label: "Coffee chat" },
  { id: "recruiting", label: "Recruiting" },
  { id: "date", label: "Date" },
  { id: "weekend", label: "Weekend" },
];
