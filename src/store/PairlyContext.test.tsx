import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PairlyProvider, usePairly } from "./PairlyContext";

describe("quiz state", () => {
  it("carries the optional note to Results and counts every shop tap until reset", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setNote("Dinner in the city, not too formal"));
    act(() => result.current.setUploadedItem({ image: "item", category: "shirt", attributes: [], source: "upload" }));
    act(() => result.current.findMatches());
    expect(result.current.note).toBe("Dinner in the city, not too formal");
    expect(result.current.screen).toBe("results");
    act(() => { result.current.countShopClick(); result.current.countShopClick(); });
    expect(result.current.shopClicks).toBe(2);
    act(() => result.current.reset());
    expect(result.current.shopClicks).toBe(0);
    expect(result.current.note).toBe("");
  });
  it("skip quiz uses the classic fallback and resets exploration even after yes votes", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.answer("yes"));
    act(() => result.current.skipQuiz());
    expect(result.current.styleType).toBe("TNPF");
    expect(result.current.quizSkipped).toBe(true);
    expect(result.current.exploreLevel).toBe("low");
    expect(result.current.axisScores).toEqual([0.5, 0.5, 0.5, 0.5]);
    expect(result.current.screen).toBe("reveal");
  });
  it("retake keeps the owned item and completing 12 swipes stores exploration", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setUploadedItem({ image: "item", category: "jacket", attributes: [], source: "upload" }));
    act(() => result.current.findMatches());
    act(() => result.current.retake());
    expect(result.current.uploadedItem?.image).toBe("item");
    for (let i = 0; i < 12; i++) act(() => result.current.answer("yes"));
    expect(result.current.screen).toBe("reveal");
    expect(result.current.answers).toHaveLength(12);
    expect(result.current.exploreLevel).toBe("high");
    expect(result.current.picks).not.toBeNull();
    act(() => result.current.reset());
    expect(result.current.screen).toBe("welcome");
    expect(result.current.exploreLevel).toBe("low");
    expect(result.current.uploadedItem).toBeNull();
  });
});