import fit1 from "@/assets/jason/jason-fit-01.jpg.asset.json";
import fit2 from "@/assets/jason/jason-fit-02.jpg.asset.json";
import fit3 from "@/assets/jason/jason-fit-03.jpg.asset.json";
import fit4 from "@/assets/jason/jason-fit-04.jpg.asset.json";
import fit5 from "@/assets/jason/jason-fit-05.jpg.asset.json";
import fit6 from "@/assets/jason/jason-fit-06.jpg.asset.json";
import fit7 from "@/assets/jason/jason-fit-07.jpg.asset.json";
import fit8 from "@/assets/jason/jason-fit-08.jpg.asset.json";
import chinos from "@/assets/jason/piece-beige-chinos.jpg.asset.json";
import type { SampleItem } from "./samples";
import type { GeneratedLook, StylePreference } from "@/lib/styleGeneration";
export const JASON_SAMPLE: SampleItem = { id: "jason-chinos", name: "My beige chinos", image: chinos.url, category: "pants", attributes: ["Beige", "Cotton twill", "Wide"] };
export const JASON_EXPLANATION = "You already own this one. The waxed jacket and check shirt give the chinos a heritage feel.";
export const JASON_FITS = [
 { image: fit1.url, pieces: [["Navy waxed jacket", 50, 27], ["Beige wide chinos", 45, 66], ["Black lace-up boots", 45, 96]] },
 { image: fit2.url, pieces: [["Lilac oversized tee", 48, 24], ["Cream wide pants", 38, 65], ["Black sneakers", 55, 96]] },
 { image: fit3.url, pieces: [["Navy cotton jacket", 24, 29], ["Navy rugby stripe shirt", 52, 19], ["Khaki chinos", 45, 65], ["Black shoes", 45, 94]] },
 { image: fit4.url, pieces: [["Butter-yellow oxford shirt", 51, 23], ["Cream chinos", 68, 62], ["Black tassel loafers", 26, 85]] },
 { image: fit5.url, pieces: [["Light blue shirt", 50, 29], ["Black wide trousers", 50, 68], ["Black derby shoes", 50, 95]] },
 { image: fit6.url, pieces: [["Brown leather jacket", 24, 26], ["Charcoal graphic tee", 59, 20], ["Ecru chinos", 44, 64], ["Black derbies", 45, 95]] },
 { image: fit7.url, pieces: [["Olive fleece pullover", 55, 23], ["Olive corduroy trousers", 49, 65], ["Black boots", 46, 95]] },
 { image: fit8.url, pieces: [["Black suit", 25, 37], ["Brown shirt", 51, 15], ["Black derbies", 46, 96]] },
] satisfies { image: string; pieces: [string, number, number][] }[];
export function isJasonSample(item: { source?: string; name?: string; category: string; image: string }): boolean {
 return item.source === "sample" && item.name === JASON_SAMPLE.name && item.category === "pants" && item.image === JASON_SAMPLE.image;
}
export function jasonClosetLook(preference: StylePreference): GeneratedLook {
 return { id: "jason-closet", preference, department: preference === "menswear" ? "men" : "women", name: "From your closet", image: fit1.url, explanation: JASON_EXPLANATION, styling: "Jason's existing heritage outfit", status: "success", items: [
  { role: "Inner layer", name: "Navy waxed jacket", owned: true, brand: "My closet", price: null, shopUrl: null },
  { role: "Inner layer", name: "Blue check shirt", owned: true, brand: "My closet", price: null, shopUrl: null },
  { role: "Your piece", name: "Beige wide chinos", image: chinos.url, owned: true, brand: "My closet", price: null, shopUrl: null },
  { role: "Shoes", name: "Black lace-up boots", owned: true, brand: "My closet", price: null, shopUrl: null },
 ] };
}
export function jasonPendingLooks(preference: StylePreference): GeneratedLook[] {
 return [jasonClosetLook(preference), ...[1, 2].map((index): GeneratedLook => ({ id: `ai-${index}`, preference, department: preference === "menswear" ? "men" : "women", name: `New look ${index}`, explanation: "", styling: "", status: "idle", items: [] }))];
}
