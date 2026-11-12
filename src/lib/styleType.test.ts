import { describe, expect, it } from "vitest";
import { ROUNDS } from "@/data/diagnosis";
import { computeStyleType } from "./styleType";

describe("computeStyleType", () => {
  it("all B answers gives RCDS", () => {
    expect(computeStyleType(ROUNDS, Array(8).fill("B"))).toBe("RCDS");
  });
  it("no answers (all Neither/Skip) falls back to TNPF", () => {
    expect(computeStyleType(ROUNDS, Array(8).fill(null))).toBe("TNPF");
  });
  it("a tie on an axis uses the TNPF letter", () => {
    // fit rounds are index 0 and 4: one T, one R -> tie -> T
    const a: ("A" | "B" | null)[] = ["A", "B", "B", "B", "B", "B", "B", "B"];
    expect(computeStyleType(ROUNDS, a)).toBe("TCDS");
  });
});
