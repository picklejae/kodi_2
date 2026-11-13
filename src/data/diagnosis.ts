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
import women01 from "@/assets/onboarding/women-01.jpg";
import women02 from "@/assets/onboarding/women-02.jpg";
import women03 from "@/assets/onboarding/women-03.jpg";
import women04 from "@/assets/onboarding/women-04.jpg";
import women05 from "@/assets/onboarding/women-05.jpg";
import women06 from "@/assets/onboarding/women-06.jpg";
import women07 from "@/assets/onboarding/women-07.jpg";
import women08 from "@/assets/onboarding/women-08.jpg";
import women09 from "@/assets/onboarding/women-09.jpg";
import women10 from "@/assets/onboarding/women-10.jpg";
import women11 from "@/assets/onboarding/women-11.jpg";
import women12 from "@/assets/onboarding/women-12.jpg";
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

// Original AI-generated womenswear lookbook photos (faces cropped), same studio style as menswear.
// Tags are demo annotations; all 16 Style Types are reachable.
export const WOMEN_ROUNDS: DiagnosisCard[] = [
  { id: 1, image: women01, tags: "RNPF" }, // black oversized blazer, ivory knit, grey trousers
  { id: 2, image: women02, tags: "RCPF" }, // dusty-pink puff-sleeve linen midi dress
  { id: 3, image: women03, tags: "RCDS" }, // light-blue linen sundress, crochet cardigan
  { id: 4, image: women04, tags: "TNDS" }, // indigo denim chore jacket, raw straight jeans, boots
  { id: 5, image: women05, tags: "TCPF" }, // lilac blazer and flared midi skirt suit
  { id: 6, image: women06, tags: "TNPS" }, // cream and navy track jacket, track pants
  { id: 7, image: women07, tags: "RCDF" }, // rust floral tiered maxi dress, suede boots
  { id: 8, image: women08, tags: "RNDS" }, // black bomber, white tee, charcoal wide cargos
  { id: 9, image: women09, tags: "TCDF" }, // butter-yellow cardigan, plaid pleated skirt, loafers
  { id: 10, image: women10, tags: "TCPF" }, // emerald satin slip dress
  { id: 11, image: women11, tags: "TCDS" }, // green shell jacket, charcoal knit, black trousers
  { id: 12, image: women12, tags: "RNPS" }, // denim jacket, white tee, ecru wide jeans
];

/** Same 12-card structure and tags per preference, so scoring is identical. */
export function roundsFor(preference: "menswear" | "womenswear" | null): DiagnosisCard[] {
  return preference === "womenswear" ? WOMEN_ROUNDS : ROUNDS;
}

/** Both clothing preferences now have quiz photos. */
export function quizAvailable(_preference: "menswear" | "womenswear"): boolean {
  return true;
}
