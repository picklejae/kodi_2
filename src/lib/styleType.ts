import { DEFAULT_CODE, type StyleTypeCode } from "@/data/styleTypes";
import type { DiagnosisCard } from "@/data/diagnosis";

export type Answer = "yes" | "no";
export type ExploreLevel = "low" | "high";
const LEFT = ["T", "N", "P", "F"];
const RIGHT = ["R", "C", "D", "S"];

export function computeDiagnosis(cards: DiagnosisCard[], answers: Answer[]) {
  const liked = cards.filter((_, i) => answers[i] === "yes");
  const axisScores = LEFT.map((letter, i) => liked.length
    ? liked.filter((c) => c.tags.charAt(i) !== letter).length / liked.length
    : 0.5);
  const styleType = axisScores.map((score, i) => !liked.length || score === 0.5
    ? DEFAULT_CODE.charAt(i) : score > 0.5 ? RIGHT[i] : LEFT[i]).join("") as StyleTypeCode;
  // Provisional demo threshold: four unique liked combinations, varying on at least three axes.
  const variedAxes = axisScores.filter((score) => score > 0 && score < 1).length;
  const exploreLevel: ExploreLevel = new Set(liked.map((c) => c.tags)).size >= 4 && variedAxes >= 3 ? "high" : "low";
  return { styleType, axisScores, exploreLevel };
}

export function computeStyleType(cards: DiagnosisCard[], answers: Answer[]): StyleTypeCode {
  return computeDiagnosis(cards, answers).styleType;
}
