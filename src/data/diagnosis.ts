import { LOOK_IMAGES as L, type StyleTypeCode } from "./styleTypes";

export interface DiagnosisCard { id: number; image: string; tags: StyleTypeCode }

// Tags are demo annotations, not visible labels or image-analysis results.
export const ROUNDS: DiagnosisCard[] = [
  { id: 1, image: L.suit, tags: "TNPF" },
  { id: 2, image: L.casual, tags: "RNPS" },
  { id: 3, image: L.suit3, tags: "TNDF" },
  { id: 4, image: L.street, tags: "RCDS" },
  { id: 5, image: L.fashion, tags: "TCPF" },
  { id: 6, image: L.denim, tags: "RNDS" },
  { id: 7, image: L.suit2, tags: "TNPF" },
  { id: 8, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=70", tags: "RCPS" },
  { id: 9, image: L.coat, tags: "RNPF" },
  { id: 10, image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=70", tags: "TCDF" },
  { id: 11, image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=70", tags: "RCPS" },
  { id: 12, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=70", tags: "RCDF" },
];

/** Quiz photos are menswear only; womenswear has no suitable assets yet, so its quiz is skipped. */
export function quizAvailable(preference: "menswear" | "womenswear"): boolean {
  return preference === "menswear";
}
