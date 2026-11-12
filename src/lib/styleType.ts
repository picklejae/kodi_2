import { DEFAULT_CODE, type Axis, type StyleTypeCode } from "@/data/styleTypes";
import type { DiagnosisRound } from "@/data/diagnosis";

export type Answer = "A" | "B" | null;
const ORDER: Axis[] = ["fit", "color", "detail", "mood"];

/** Majority per axis; tie or no answers falls back to that axis letter of TNPF. */
export function computeStyleType(rounds: DiagnosisRound[], answers: Answer[]): StyleTypeCode {
  return ORDER.map((axis, i) => {
    const counts: Record<string, number> = {};
    rounds.forEach((r, idx) => {
      if (r.axis !== axis) return;
      const ans = answers[idx];
      if (!ans) return;
      const letter = ans === "A" ? r.a.letter : r.b.letter;
      counts[letter] = (counts[letter] ?? 0) + 1;
    });
    const entries = Object.entries(counts).sort((x, y) => y[1] - x[1]);
    const [top, second] = entries;
    if (!top || (second && second[1] === top[1])) return DEFAULT_CODE[i];
    return top[0];
  }).join("") as StyleTypeCode;
}
