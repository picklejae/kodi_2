import men01 from "@/assets/onboarding/men-01.jpg";
import men02 from "@/assets/onboarding/men-02.jpg";
import men03 from "@/assets/onboarding/men-03.jpg";
import men04 from "@/assets/onboarding/men-04.jpg";
import men05 from "@/assets/onboarding/men-05.jpg";
import men06 from "@/assets/onboarding/men-06.jpg";
import men07 from "@/assets/onboarding/men-07.jpg";
import men08 from "@/assets/onboarding/men-08.jpg";
import men09 from "@/assets/onboarding/men-09.jpg";
import men10 from "@/assets/onboarding/men-10.jpg";
import men11 from "@/assets/onboarding/men-11.jpg";
import men12 from "@/assets/onboarding/men-12.jpg";
import type { StyleTypeCode } from "./styleTypes";

export interface DiagnosisCard { id: number; image: string; tags: StyleTypeCode }

// Original AI-generated menswear lookbook photos (faces cropped), one consistent studio style.
// Tags are demo annotations, not visible labels or image-analysis results. All 16 Style Types are reachable.
export const ROUNDS: DiagnosisCard[] = [
  { id: 1, image: men01, tags: "TNPF" }, // black suit, white shirt, coat over arm
  { id: 2, image: men02, tags: "RCPS" }, // denim shirt, olive tank, white linen trousers
  { id: 3, image: men03, tags: "RNDF" }, // navy suede blouson, brown pleated trousers
  { id: 4, image: men04, tags: "RNDS" }, // black technical hoodie, wide trousers
  { id: 5, image: men05, tags: "TCPF" }, // brown suit, black shirt
  { id: 6, image: men06, tags: "RNPF" }, // grey oversized blazer, white tee, black pleated trousers
  { id: 7, image: men07, tags: "RCDS" }, // silver satin shirt, scarf, black wide jeans
  { id: 8, image: men08, tags: "TNPS" }, // navy ringer tee, light jeans
  { id: 9, image: men09, tags: "TCDF" }, // camel cable vest, blue oxford, navy pleated trousers
  { id: 10, image: men10, tags: "RNPF" }, // cream knit polo, charcoal wide trousers
  { id: 11, image: men11, tags: "TNDF" }, // black utility blazer, striped shirt and tie, leather trousers
  { id: 12, image: men12, tags: "RCDS" }, // green shell jacket, olive cargo trousers
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
