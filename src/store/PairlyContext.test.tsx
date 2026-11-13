import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { GeneratedLook } from "@/lib/styleGeneration";
import { PairlyProvider, usePairly } from "./PairlyContext";
import { parsePresetParams } from "@/lib/devPresets";

describe("quiz state", () => {
  it("budget skip stores unknown and proceeds to Upload", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.go("budget"));
    act(() => result.current.completeBudget(null));
    expect(result.current.budgetKnown).toBe(false);
    expect(result.current.screen).toBe("upload");
    act(() => result.current.completeBudget({ min: 50, max: 100 }));
    expect(result.current.budgetKnown).toBe(true);
    expect(result.current.budget).toEqual({ min: 50, max: 100 });
  });
  it("both Set shortcuts bypass budget and budget changes preserve fixed images and pieces", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    for (const set of ["set-a", "set-b"]) {
      const preset = parsePresetParams(`?screen=${set}`);
      if (!preset) throw new Error("Missing Set preset");
      act(() => result.current.loadPreset(preset));
      expect(result.current.screen).toBe("results");
      expect(result.current.generatedLooks?.map((look) => look.tier)).toEqual(["safe", "step", "bold"]);
      expect(result.current.generatedLooks?.every((look) => look.status === "success" && look.demoSet === set)).toBe(true);
      const looks = result.current.generatedLooks;
      act(() => result.current.setBudget({ min: 0, max: 49.99 }));
      expect(result.current.generatedLooks).toEqual(looks);
    }
  });
  it("shows the Feed hint once until demo reset, including across tab changes", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setStylePreference("menswear"));
    expect(result.current.feedHintDismissed).toBe(false);
    act(() => result.current.setTab("feed"));
    act(() => result.current.dismissFeedHint());
    act(() => result.current.setTab("saved"));
    act(() => result.current.setTab("feed"));
    expect(result.current.feedHintDismissed).toBe(true);
    act(() => result.current.reset());
    expect(result.current.feedHintDismissed).toBe(false);
  });
  it("records uploads and deletes photos independently of saved outfits", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setStylePreference("menswear"));
    act(() => result.current.recordUpload("new-photo", "Blue shirt", "shirt"));
    expect(result.current.recentItems[0]?.imageUrl).toBe("new-photo");
    expect(result.current.recentItems).toHaveLength(8);
    act(() => result.current.deleteRecent("jason-chinos"));
    expect(result.current.savedOutfits).toHaveLength(3);
    act(() => result.current.deleteSavedOutfit("outfit-1"));
    expect(result.current.savedOutfits).toHaveLength(2);
    act(() => result.current.reset());
    expect(result.current.recentItems).toHaveLength(7);
    expect(result.current.savedOutfits).toHaveLength(3);
  });
  it("saves a generated look to the front of Looks only once", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setStylePreference("menswear"));
    const look: GeneratedLook = {
      id: "ai-0", tier: "safe", shift: "", preference: "menswear", department: "men", name: "Tailored", explanation: "Charcoal sharpens the camel.", styling: "styling", status: "success",
      image: "data:image/jpeg;base64,aaaa",
      items: [
        { role: "Your piece", name: "Camel coat", owned: true, brand: null, price: null, shopUrl: null },
        { role: "Shoes", name: "Black loafers", owned: false, brand: null, price: null, shopUrl: null },
      ],
    };
    let saved = false;
    act(() => { saved = result.current.saveLook(look); });
    expect(saved).toBe(true);
    expect(result.current.savedOutfits).toHaveLength(4);
    expect(result.current.savedOutfits[0]?.lookName).toBe("Tailored");
    expect(result.current.savedOutfits[0]?.ownedName).toBe("Camel coat");
    expect(result.current.savedOutfits[0]?.products).toHaveLength(2);
    act(() => { saved = result.current.saveLook(look); });
    expect(saved).toBe(false);
    expect(result.current.savedOutfits).toHaveLength(4);
    const { image: _image, ...withoutImage } = look;
    act(() => { saved = result.current.saveLook({ ...withoutImage, status: "loading" }); });
    expect(saved).toBe(false);
  });
  it("stores body stats, units and budget range until reset", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setBody({ heightCm: 178, weightKg: 72 }));
    act(() => result.current.setUnits("metric"));
    act(() => result.current.setBudget({ min: 50, max: 200 }));
    expect(result.current.body).toEqual({ heightCm: 178, weightKg: 72 });
    expect(result.current.units).toBe("metric");
    expect(result.current.budget).toEqual({ min: 50, max: 200 });
    act(() => result.current.reset());
    expect(result.current.body).toEqual({ heightCm: null, weightKg: null });
    expect(result.current.units).toBe("imperial");
    expect(result.current.budget).toEqual({ min: 0, max: 500 });
  });
  it("posting retains both old and new boards with their pick metadata", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setStylePreference("menswear"));
    act(() => result.current.setUploadedItem({ image: "owned", category: "jacket", attributes: [], source: "upload" }));
    act(() => result.current.findMatches());
    const look = result.current.picks?.safe;
    if (!look) throw new Error("Missing look");
    act(() => result.current.openDraft({ image: "board-one", ownedImage: "owned", look }));
    act(() => result.current.createPost({ image: "board-one", question: "First", occasion: null }));
    act(() => result.current.openDraft({ image: "board-two", ownedImage: "owned", look }));
    act(() => result.current.createPost({ image: "board-two", question: "Second", occasion: null }));
    const mine = result.current.posts.filter((p) => p.isUserPost && p.id !== "jason-heritage" && p.id !== "jason-leather");
    expect(mine.map((p) => p.image)).toEqual(["board-two", "board-one"]);
    expect(mine.every((p) => p.look?.items.length === 2 && p.ownedImage === "owned")).toBe(true);
    act(() => result.current.reset());
    expect(result.current.posts.filter((p) => p.isUserPost).map((p) => p.id)).toEqual([]);
  });
  it("carries the optional note to Results and counts every shop tap until reset", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setStylePreference("menswear"));
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
    act(() => result.current.setStylePreference("menswear"));
    act(() => result.current.answer("yes"));
    act(() => result.current.skipQuiz());
    expect(result.current.styleType).toBe("TNPF");
    expect(result.current.quizSkipped).toBe(true);
    expect(result.current.exploreLevel).toBe("low");
    expect(result.current.axisScores).toEqual([0.5, 0.5, 0.5, 0.5]);
    expect(result.current.screen).toBe("upload"); // Skip Quiz now goes straight to Style (ec6a16c)
  });
  it("retake keeps the owned item and completing 12 swipes stores exploration", () => {
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setStylePreference("menswear"));
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