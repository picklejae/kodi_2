// Static prototype: no server, so "AI" answers come from results that were already generated once.
// planStyle picks one of three saved sets; renderStyleLook returns that set's saved image.
// Womenswear: real women's outfit photos along the Safe / One step up / Bold ladder (see womenSet).
// Menswear samples map by category (shirt → Oxford, pants → chinos set A, jacket/coat → leather set B);
// uploads (always tagged "jacket" by the app) are spread across the three sets by image fingerprint.
import { DEMO_SAMPLES, demoSetLooks } from "@/data/demoSets";
import { WOMEN_LOOKS, pexels } from "@/data/womenLooks";
import { axisShifts, closestAxis } from "@/lib/styleGeneration";
import type { StyleTypeCode } from "@/data/styleTypes";
import oxfordSafe from "./cache/oxford-safe.jpg";
import oxfordStep from "./cache/oxford-step.jpg";
import oxfordBold from "./cache/oxford-bold.jpg";

type Role = "Inner layer" | "Bottoms" | "Shoes" | "Accessories";
type PlanLook = { tier: "safe" | "step" | "bold"; shift: string; name: string; explanation: string; styling: string; items: { role: Role; name: string; highlight: boolean }[] };
type CachedSet = { id: string; presentation: string; looks: (PlanLook & { image: string })[] };

const OXFORD: CachedSet = {
  id: "oxford",
  presentation: "Same faceless mannequin, light-grey studio, soft even light.",
  looks: [
    { tier: "safe", shift: "", name: "Easy Polish", image: oxfordSafe, styling: "", explanation: "Roomy charcoal trousers balance the Oxford shirt's loose proportions, while plain black leather accessories keep its blue fabric and tiny white motifs grounded in a neutral, polished outfit.",
      items: [{ role: "Bottoms", name: "Relaxed charcoal wool trousers", highlight: true }, { role: "Shoes", name: "Plain black leather derbies", highlight: true }, { role: "Accessories", name: "Narrow black leather belt", highlight: false }, { role: "Accessories", name: "Simple silver watch with black strap", highlight: false }, { role: "Accessories", name: "Charcoal dress socks", highlight: false }] },
    { tier: "step", shift: "Neutral → Color", name: "Wine Accent", image: oxfordStep, styling: "", explanation: "Deep burgundy trousers introduce a clear color contrast to the muted blue shirt while retaining the same roomy silhouette, plain finishes and polished leather footwear.",
      items: [{ role: "Bottoms", name: "Relaxed burgundy wool trousers", highlight: true }, { role: "Shoes", name: "Plain black leather derbies", highlight: false }, { role: "Accessories", name: "Narrow black leather belt", highlight: false }, { role: "Accessories", name: "Simple silver watch with black strap", highlight: false }, { role: "Accessories", name: "Burgundy dress socks", highlight: false }] },
    { tier: "bold", shift: "Relaxed → Tailored, Neutral → Color, Plain → Detail", name: "Emerald Precision", image: oxfordBold, styling: "", explanation: "Sharply tapered emerald trousers create a structured counterpoint to the unchanged loose blue shirt, while oxblood broguing and a textured silver watch add deliberate detail without losing polish.",
      items: [{ role: "Bottoms", name: "Tailored emerald wool trousers", highlight: true }, { role: "Shoes", name: "Oxblood brogue Oxford shoes", highlight: true }, { role: "Accessories", name: "Oxblood belt with engraved silver buckle", highlight: false }, { role: "Accessories", name: "Silver bracelet watch with textured dial", highlight: false }, { role: "Accessories", name: "Dark emerald dress socks", highlight: false }] },
  ],
};

function fromDemoSet(id: "set-a" | "set-b"): CachedSet {
  return {
    id,
    presentation: "Same model, studio and light.",
    looks: demoSetLooks(id).map((look) => ({
      tier: look.tier, shift: "", name: look.name, explanation: look.explanation, styling: "", image: look.image ?? "",
      items: look.items.filter((item) => item.role !== "Your piece").map((item, i) => ({ role: item.role as Role, name: item.name, highlight: i < 2 })),
    })),
  };
}
const SETS: CachedSet[] = [OXFORD, fromDemoSet("set-a"), fromDemoSet("set-b")];

function fingerprint(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i += 97) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}
function pickSet(data: { category: string; name: string; reference: string }): CachedSet {
  const sampleNames = Object.values(DEMO_SAMPLES).map((s) => s.name);
  const isSample = /oxford|blazer|coat|denim|chinos/i.test(data.name) || sampleNames.includes(data.name);
  if (isSample) {
    if (data.category === "shirt" || data.category === "knit") return SETS[0];
    if (data.category === "pants") return SETS[1];
    return SETS[2];
  }
  return SETS[fingerprint(data.reference) % SETS.length];
}

// Womenswear: no saved mannequin renders exist, so use real women's outfit photos along the style ladder
// (Safe = your type, One step up = closest axis flipped, Bold = one more axis flipped).
const OPP: Record<string, string> = { T: "R", R: "T", N: "C", C: "N", P: "D", D: "P", F: "S", S: "F" };
const flip = (code: string, axes: number[]) => [...code].map((c, i) => (axes.includes(i) ? OPP[c] : c)).join("") as StyleTypeCode;
function roleOf(piece: string): Role {
  if (/heel|boot|sneaker|sandal|loafer|shoe/i.test(piece)) return "Shoes";
  if (/trouser|pant|jean|skirt/i.test(piece)) return "Bottoms";
  if (/bag|tights|haircut|bob/i.test(piece)) return "Accessories";
  return "Inner layer";
}
function womenSet(data: { styleType: StyleTypeCode; axisScores: number[]; reference: string }): CachedSet {
  const near = closestAxis(data.axisScores);
  const others = [0, 1, 2, 3].filter((i) => i !== near);
  const pick = (code: StyleTypeCode, n: number) => { const list = WOMEN_LOOKS.filter((l) => l.code === code); return list[n % Math.max(1, list.length)]; };
  const seed = fingerprint(data.reference);
  const shifts = axisShifts(data.styleType);
  const extra = others[seed % 3];
  const plan = [
    { tier: "safe" as const, code: data.styleType, axes: [] as number[] },
    { tier: "step" as const, code: flip(data.styleType, [near]), axes: [near] },
    { tier: "bold" as const, code: flip(data.styleType, [near, extra]), axes: [near, extra] },
  ];
  const names = { safe: "Your usual, polished", step: "One new note", bold: "Try something new" };
  return {
    id: `women-${data.styleType}-${seed % 97}`,
    presentation: "Real outfit photos (prototype).",
    looks: plan.map(({ tier, code, axes }, i) => {
      const look = pick(code, seed + i);
      const parts = look.description.split(/,| and /).map((x) => x.trim()).filter(Boolean);
      return {
        tier, shift: axes.map((a) => shifts[a]).join(", "), name: names[tier], image: pexels(look.photo, 700), styling: "",
        explanation: `${look.description}. Pair it with your piece for this direction.`,
        items: (parts.length >= 2 ? parts : [...parts, "Simple accessories"]).slice(0, 4).map((name, k) => ({ role: roleOf(name), name: name.charAt(0).toUpperCase() + name.slice(1), highlight: k < 2 })),
      };
    }),
  };
}
const dynamicSets = new Map<string, CachedSet>();

export async function planStyle({ data }: { data: { category: string; name: string; reference: string; preference?: string; styleType: StyleTypeCode; axisScores: number[] } }) {
  let set: CachedSet;
  if (data.preference === "womenswear") { set = womenSet(data); dynamicSets.set(set.id, set); }
  else set = pickSet(data);
  return { ok: true as const, plan: { presentation: set.presentation, looks: set.looks.map(({ image: _image, ...look }, index) => ({ ...look, styling: `proto:${set.id}:${index}` })) } };
}
export async function renderStyleLook({ data }: { data: { styling: string } }) {
  const [, id, index] = data.styling.split(":");
  const image = (dynamicSets.get(id) ?? SETS.find((set) => set.id === id))?.looks[Number(index)]?.image;
  return image ? { ok: true as const, image } : { ok: false as const, error: "No saved look for this piece in the prototype." };
}
export async function findShoppingProducts() {
  return { ok: false as const, error: "Shopping is off in the prototype." };
}
export function presentationFor(p: "menswear" | "womenswear") { return p; }
