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
  { id: 8, image: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&w=600&q=70", tags: "RCPS" },
  { id: 9, image: L.coat, tags: "RNPF" },
  { id: 10, image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=70", tags: "TCDF" },
  { id: 11, image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=70", tags: "RCPS" },
  { id: 12, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=70", tags: "RCDF" },
];

const w = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;
export const WOMEN_ROUNDS: DiagnosisCard[] = [
  { id: 1, image: w("1554412933-514a83d2f3c8"), tags: "TNPF" },
  { id: 2, image: w("1503342217505-b0a15ec3261c"), tags: "RNPS" },
  { id: 3, image: w("1485968579580-b6d095142e6e"), tags: "TNDF" },
  { id: 4, image: w("1509631179647-0177331693ae"), tags: "RCDS" },
  { id: 5, image: w("1539109136881-3be0616acf4b"), tags: "TCPF" },
  { id: 6, image: w("1544022613-e87ca75a784a"), tags: "RNDS" },
  { id: 7, image: w("1485462537746-965f33f7f6a7"), tags: "TNPF" },
  { id: 8, image: w("1529139574466-a303027c1d8b"), tags: "RCPS" },
  { id: 9, image: w("1550614000-4895a10e1bfd"), tags: "RNPF" },
  { id: 10, image: w("1581044777550-4cfa60707c03"), tags: "TCDF" },
  { id: 11, image: w("1515886657613-9f3515b0c78f"), tags: "RCPS" },
  { id: 12, image: w("1496747611176-843222e1e57c"), tags: "RCDF" },
];

/** Same 12-card structure and tags per preference, so scoring is identical. */
export function roundsFor(preference: "menswear" | "womenswear" | null): DiagnosisCard[] {
  return preference === "womenswear" ? WOMEN_ROUNDS : ROUNDS;
}

/** Both clothing preferences now have quiz photos. */
export function quizAvailable(_preference: "menswear" | "womenswear"): boolean {
  return true;
}
