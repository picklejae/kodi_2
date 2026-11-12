import type { StyleTypeCode } from "./styleTypes";

export type CatalogCategory = "pants" | "shirts" | "knits" | "tees" | "outerwear" | "shoes" | "accessories";
export type Boldness = "safe" | "step" | "bold";
export const BOLDNESS_LABEL: Record<Boldness, string> = { safe: "Safe", step: "One step up", bold: "Bold" };

export interface CatalogItem {
  id: string; name: string; brand: string; price: number; image: string;
  category: CatalogCategory; tags: StyleTypeCode; boldness: Boldness; buyUrl: string;
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=70`;
type Row = [string, string, number, string, CatalogCategory, StyleTypeCode, Boldness];
const rows: Row[] = [
  ["Grey flannel trousers", "Northfield", 145, "1594938298603-c8148c4dae35", "pants", "TNPF", "safe"],
  ["Pleated wool trousers", "Atelier Row", 220, "1624378439575-d8705ad7ae80", "pants", "TNDF", "step"],
  ["Ecru wide chinos", "Common Thread", 95, "1473966968600-fa801b869a1a", "pants", "RNPS", "safe"],
  ["Olive cargo pants", "Field & Co", 110, "1517438476312-10d79c077509", "pants", "RNDS", "step"],
  ["Rust corduroy trousers", "Harlow", 130, "1506629082955-511b1aa562c8", "pants", "RCDF", "bold"],
  ["Dark selvedge jeans", "Indigo Mill", 180, "1542272604-787c3835535d", "pants", "TNPS", "safe"],
  ["White oxford shirt", "Brook Lane", 85, "1596755094514-f87e34085b2c", "shirts", "TNPF", "safe"],
  ["Light blue poplin shirt", "Brook Lane", 90, "1602810318383-e386cc2a3ccf", "shirts", "TNPF", "safe"],
  ["Striped camp-collar shirt", "Seaside Supply", 75, "1598033129183-c4f50c736f10", "shirts", "RCDS", "bold"],
  ["Chambray work shirt", "Field & Co", 70, "1589310243389-96a5483213a8", "shirts", "RNDS", "step"],
  ["Ecru linen shirt", "Common Thread", 95, "1607345366928-199ea26cfe3e", "shirts", "RNPS", "safe"],
  ["Navy merino crewneck", "Northfield", 120, "1620799140408-edc6dcb6d633", "knits", "TNPF", "safe"],
  ["Cream cable-knit sweater", "Harlow", 165, "1576871337632-b9aef4c17ab9", "knits", "TNDF", "step"],
  ["Forest green cardigan", "Atelier Row", 190, "1591047139829-d91aecb6caea", "knits", "RCDF", "bold"],
  ["Charcoal turtleneck", "Monoform", 140, "1608063615781-e2ef8c73d114", "knits", "TNPF", "step"],
  ["Burgundy half-zip", "Peak Line", 110, "1614975059251-992f11792b9f", "knits", "TCPS", "bold"],
  ["Oatmeal waffle henley", "Common Thread", 65, "1618354691373-d851c5c3a990", "knits", "RNDS", "safe"],
  ["White heavyweight tee", "Monoform", 45, "1521572163474-6864f9cf17ab", "tees", "RNPS", "safe"],
  ["Black pocket tee", "Monoform", 40, "1583743814966-8936f5b7be1a", "tees", "TNPS", "safe"],
  ["Navy striped breton", "Seaside Supply", 60, "1622445275463-afa2ab738c34", "tees", "TNDS", "step"],
  ["Cobalt boxy tee", "Peak Line", 50, "1529374255404-311a2a4f1fd9", "tees", "RCPS", "bold"],
  ["Washed graphic tee", "Lot 9", 55, "1503341504253-dff4815485f1", "tees", "RCDS", "bold"],
  ["Stone harrington jacket", "Field & Co", 210, "1551028719-00167b16eac5", "outerwear", "TNPS", "safe"],
  ["Navy chore coat", "Field & Co", 175, "1591047139829-d91aecb6caea", "outerwear", "RNDS", "step"],
  ["Camel overcoat", "Atelier Row", 390, "1539533018447-63fcce2678e3", "outerwear", "TNPF", "step"],
  ["Plaid shirt jacket", "Harlow", 150, "1559551409-dadc959f76b8", "outerwear", "RCDS", "bold"],
  ["Black bomber", "Lot 9", 230, "1548126032-079a0fb0099d", "outerwear", "TNPS", "step"],
  ["Brown suede loafers", "Calder", 240, "1614252235316-8c857d38b5f4", "shoes", "TNPF", "safe"],
  ["White leather sneakers", "Monoform", 160, "1549298916-b41d501d3772", "shoes", "TNPS", "safe"],
  ["Dark brown chelsea boots", "Calder", 280, "1638247025967-b4e38f787b76", "shoes", "TNPF", "step"],
  ["Tan suede desert boots", "Calder", 190, "1520639888713-7851133b1ed0", "shoes", "RNDS", "step"],
  ["Burgundy penny loafers", "Brook Lane", 260, "1533867617858-e7b97e060509", "shoes", "TCDF", "bold"],
  ["Green retro runners", "Peak Line", 120, "1542291026-7eec264c27ff", "shoes", "RCPS", "bold"],
  ["Black leather belt", "Calder", 60, "1553062407-98eeb64c6a62", "accessories", "TNPF", "safe"],
  ["Silver steel watch", "Hour & Co", 350, "1524592094714-0f0654e20314", "accessories", "TNPF", "step"],
  ["Navy knit tie", "Brook Lane", 55, "1589756823695-278bc923f962", "accessories", "TNDF", "step"],
  ["Patterned silk scarf", "Atelier Row", 95, "1520903920243-00d872a2d1c9", "accessories", "TCDF", "bold"],
  ["Grey wool beanie", "Northfield", 40, "1576871337622-98d48d1cf531", "accessories", "RNPS", "safe"],
  ["Tortoise sunglasses", "Lot 9", 140, "1511499767150-a48a237f0083", "accessories", "TCDS", "bold"],
  ["Canvas tote", "Field & Co", 70, "1590874103328-eac38a683ce7", "accessories", "RNDS", "step"],
];

export const CATALOG: CatalogItem[] = rows.map(([name, brand, price, photo, category, tags, boldness], i) => ({
  id: `c${i + 1}`, name, brand, price, image: img(photo), category, tags, boldness,
  buyUrl: `https://example.com/shop/${name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
}));
