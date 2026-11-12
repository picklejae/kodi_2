import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PairlyProvider, usePairly } from "./PairlyContext";

describe("quiz state", () => {
  it("saving a pick retains its whole look and owned image after another upload", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setUploadedItem({ image: "first-piece", category: "jacket", attributes: [], source: "upload" }));
    act(() => result.current.findMatches());
    const item = result.current.picks?.safe.items[0];
    if (!item) throw new Error("Missing pick");
    act(() => result.current.toggleSave(item.id));
    expect(result.current.savedLooks.some((entry) => entry.ownedImage === "first-piece" && entry.look.items.some((i) => i.id === item.id))).toBe(true);
    act(() => result.current.setUploadedItem({ image: "second-piece", category: "pants", attributes: [], source: "upload" }));
    act(() => result.current.findMatches());
    expect(result.current.savedLooks[0]?.ownedImage).toBe("first-piece");
    act(() => result.current.toggleSave(item.id));
    expect(result.current.savedLooks).toHaveLength(0);
  });
  it("posting retains both old and new boards with their pick metadata", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setUploadedItem({ image: "owned", category: "jacket", attributes: [], source: "upload" }));
    act(() => result.current.findMatches());
    const look = result.current.picks?.safe;
    if (!look) throw new Error("Missing look");
    act(() => result.current.openDraft({ image: "board-one", ownedImage: "owned", look }));
    act(() => result.current.createPost({ image: "board-one", question: "First", occasion: null }));
    act(() => result.current.openDraft({ image: "board-two", ownedImage: "owned", look }));
    act(() => result.current.createPost({ image: "board-two", question: "Second", occasion: null }));
    const mine = result.current.posts.filter((p) => p.isUserPost);
    expect(mine.map((p) => p.image)).toEqual(["board-two", "board-one"]);
    expect(mine.every((p) => p.look?.items.length === 2 && p.ownedImage === "owned")).toBe(true);
    act(() => result.current.reset());
    expect(result.current.savedLooks).toHaveLength(0);
    expect(result.current.posts.some((p) => p.isUserPost)).toBe(false);
  });
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