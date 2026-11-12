export type Fit = "T" | "R";
export type Color = "N" | "C";
export type Detail = "P" | "D";
export type Mood = "F" | "S";
export type Axis = "fit" | "color" | "detail" | "mood";
export type StyleTypeCode = `${Fit}${Color}${Detail}${Mood}`;

export interface StyleType {
  code: StyleTypeCode;
  name: string;
  description: string;
  keywords: string[];
  looks: string[];
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;

const L = {
  suit: img("1617137968427-85924c800a22"),
  suit2: img("1507679799987-c73779587ccf"),
  suit3: img("1593030761757-71fae45fa0e7"),
  street: img("1516826957135-700dedea698c"),
  street2: img("1490578474895-699cd4e2cf59"),
  casual: img("1488161628813-04466f872be2"),
  tee: img("1521572163474-6864f9cf17ab"),
  coat: img("1520975954732-35dd22299614"),
  fashion: img("1552374196-1ab2a1c593e8"),
  denim: img("1542327897-4141b355e20e"),
};
export const LOOK_IMAGES = L;

// Default letters when an axis is tied or unanswered.
export const DEFAULT_CODE: StyleTypeCode = "TNPF";

export const AXIS_LABELS: Record<Axis, [string, string]> = {
  fit: ["Tailored", "Relaxed"],
  color: ["Neutral", "Color"],
  detail: ["Plain", "Detail"],
  mood: ["Formal", "Street"],
};

// 4 names from the brief (TNPF, RNPS, RNDS, TNDF); the other 12 are drafts for review.
export const STYLE_TYPES: Record<StyleTypeCode, StyleType> = {
  TNPF: { code: "TNPF", name: "Quiet Classic", description: "Clean lines, calm colors, nothing loud. You look put-together without trying to stand out.", keywords: ["Sharp", "Understated", "Timeless"], looks: [L.suit, L.suit2, L.coat] },
  TNPS: { code: "TNPS", name: "City Minimal", description: "Neat shapes in quiet colors, worn with an easy street edge.", keywords: ["Clean", "Urban", "Effortless"], looks: [L.street2, L.coat, L.tee] },
  TNDF: { code: "TNDF", name: "Ivy", description: "Tailored classics with texture: tweed, oxford cloth, a good knit.", keywords: ["Textured", "Collegiate", "Polished"], looks: [L.suit3, L.suit, L.coat] },
  TNDS: { code: "TNDS", name: "Modern Utility", description: "Sharp fits with useful details: pockets, seams, sturdy fabrics.", keywords: ["Functional", "Structured", "Muted"], looks: [L.coat, L.street, L.denim] },
  TCPF: { code: "TCPF", name: "Bright Tailor", description: "Classic shapes in confident, solid colors.", keywords: ["Confident", "Crisp", "Colorful"], looks: [L.suit2, L.fashion, L.suit3] },
  TCPS: { code: "TCPS", name: "Clean Pop", description: "Fitted basics with one bold color doing the talking.", keywords: ["Fresh", "Playful", "Neat"], looks: [L.fashion, L.tee, L.street2] },
  TCDF: { code: "TCDF", name: "Dapper", description: "Patterns, color and tailoring. You enjoy dressing up.", keywords: ["Expressive", "Refined", "Patterned"], looks: [L.suit3, L.fashion, L.suit] },
  TCDS: { code: "TCDS", name: "Street Tailor", description: "Fitted pieces with color and texture, worn casually.", keywords: ["Bold", "Sharp", "Mixed"], looks: [L.street, L.fashion, L.denim] },
  RNPF: { code: "RNPF", name: "Soft Formal", description: "Relaxed shapes in calm tones, still dressed for the room.", keywords: ["Soft", "Calm", "Grown-up"], looks: [L.coat, L.suit2, L.casual] },
  RNPS: { code: "RNPS", name: "Easy Minimal", description: "Loose, simple, neutral. Comfort first, but always clean.", keywords: ["Relaxed", "Simple", "Neutral"], looks: [L.tee, L.casual, L.street2] },
  RNDF: { code: "RNDF", name: "Gentle Heritage", description: "Roomy fits in rich textures like corduroy and wool.", keywords: ["Warm", "Textured", "Classic"], looks: [L.coat, L.casual, L.suit] },
  RNDS: { code: "RNDS", name: "Workwear", description: "Sturdy fabrics, roomy fits, earthy tones. Built to be worn.", keywords: ["Rugged", "Earthy", "Practical"], looks: [L.denim, L.street, L.casual] },
  RCPF: { code: "RCPF", name: "Relaxed Color", description: "Easy shapes in clear colors for dressier moments.", keywords: ["Warm", "Open", "Bright"], looks: [L.fashion, L.casual, L.suit2] },
  RCPS: { code: "RCPS", name: "Weekend Pop", description: "Loose fits and fun colors. Casual and upbeat.", keywords: ["Fun", "Easy", "Colorful"], looks: [L.tee, L.fashion, L.street] },
  RCDF: { code: "RCDF", name: "Artful", description: "Relaxed tailoring with prints and texture. A creative streak.", keywords: ["Creative", "Layered", "Rich"], looks: [L.fashion, L.coat, L.suit3] },
  RCDS: { code: "RCDS", name: "Street Mix", description: "Big shapes, color and detail. You like to experiment.", keywords: ["Loud", "Layered", "Street"], looks: [L.street, L.street2, L.denim] },
};
