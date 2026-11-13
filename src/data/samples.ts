export type ItemCategory = "jacket" | "coat" | "pants" | "shirt" | "knit" | "shoes";
export const CATEGORIES: ItemCategory[] = ["jacket", "coat", "pants", "shirt"];

export interface SampleItem { id: string; name: string; image: string; category: ItemCategory; attributes: string[] }

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;

export const SAMPLES: SampleItem[] = [
  { id: "blazer", name: "Navy blazer", image: img("1594938298603-c8148c4dae35"), category: "jacket", attributes: ["Navy", "Wool", "Tailored"] },
  { id: "coat", name: "Camel coat", image: img("1539533018447-63fcce2678e3"), category: "coat", attributes: ["Camel", "Wool", "Long"] },
  { id: "denim", name: "Light denim", image: img("1541099649105-f69ad21f3246"), category: "pants", attributes: ["Light blue", "Denim", "Straight"] },
  { id: "oxford", name: "Oxford shirt", image: img("1596755094514-f87e34085b2c"), category: "shirt", attributes: ["White", "Cotton", "Button-down"] },
];

// Simulated analysis for real uploads: generic attributes per chosen category.
export const GENERIC_ATTRIBUTES: Record<ItemCategory, string[]> = {
  jacket: ["Dark", "Structured", "Tailored"],
  coat: ["Neutral", "Wool", "Long"],
  pants: ["Neutral", "Cotton", "Straight"],
  shirt: ["Light", "Cotton", "Classic"],
  knit: ["Soft", "Knitted", "Relaxed"],
  shoes: ["Leather", "Classic"],
};

export type Occasion = "coffee" | "recruiting" | "date" | "weekend";
export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "coffee", label: "Coffee chat" },
  { id: "recruiting", label: "Recruiting dinner" },
  { id: "date", label: "Date" },
  { id: "weekend", label: "Weekend" },
];
