import { describe, expect, it } from "vitest";
import { ROUNDS, type DiagnosisCard } from "@/data/diagnosis";
import { computeDiagnosis, computeStyleType, type Answer } from "./styleType";

describe("computeStyleType", () => {
  it("uses 12 outfit cards", () => {
    expect(ROUNDS).toHaveLength(12);
  });
  it("no yes votes falls back to TNPF", () => {
    expect(computeStyleType(ROUNDS, Array(12).fill("no"))).toBe("TNPF");
    expect(computeStyleType(ROUNDS, [])).toBe("TNPF");
  });
  it("a tie on every axis uses TNPF", () => {
    const cards: DiagnosisCard[] = [{ id: 1, image: "", tags: "TNPF" }, { id: 2, image: "", tags: "RCDS" }];
    expect(computeStyleType(cards, ["yes", "yes"])).toBe("TNPF");
  });
  it("only yes votes contribute to all four axes", () => {
    const answers: Answer[] = ROUNDS.map((c) => c.tags === "RCDS" ? "yes" : "no");
    expect(computeDiagnosis(ROUNDS, answers)).toMatchObject({ styleType: "RCDS", axisScores: [1, 1, 1, 1], exploreLevel: "low" });
  });
  it("exploration is high for four combinations varying on three or more axes", () => {
    expect(computeDiagnosis(ROUNDS, Array(12).fill("yes")).exploreLevel).toBe("high");
    expect(computeDiagnosis(ROUNDS, Array(3).fill("yes")).exploreLevel).toBe("low");
  });
  it("undo removes the last vote from the result", () => {
    const answers: Answer[] = ["no", "yes"];
    expect(computeStyleType(ROUNDS, answers)).toBe(ROUNDS[1]?.tags);
    expect(computeStyleType(ROUNDS, answers.slice(0, -1))).toBe("TNPF");
  });
});
