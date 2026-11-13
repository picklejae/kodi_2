import type React from "react";
import { isJasonSample, jasonPendingLooks, jasonClosetLook } from "@/data/jason";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { planStyle, renderStyleLook } from "@/lib/styleGeneration.functions";
import { looksFromPlan, photoReference, type GeneratedLook } from "@/lib/styleGeneration";
import { ROUNDS } from "@/data/diagnosis";
import type { ItemCategory, Occasion } from "@/data/samples";
import type { StyleTypeCode } from "@/data/styleTypes";
import { computeDiagnosis, type Answer, type ExploreLevel } from "@/lib/styleType";
import { generatePicks, type Picks, type Pick as Look } from "@/lib/matching";
import { CATALOG } from "@/data/catalog";
import { DEFAULT_CODE } from "@/data/styleTypes";
import { POSTS, mockFeedback, type SocialPost } from "@/data/social";
import type { PresetRequest } from "@/lib/devPresets";
import { RECENT_ITEMS, SAVED_OUTFITS, type RecentItem, type SavedOutfit } from "@/data/saved";
import { addRecent, removeRecent, removeOutfit } from "@/lib/saved";
import { findShoppingProducts } from "@/lib/shopping.functions";
import { MAX_ATTEMPTS, SHOPPING_TTL, shoppingKey, type ShoppingInput, type ShoppingRecord } from "@/lib/shopping";
import type { ConceptItem } from "@/data/moodboards";

export type StylePreference = "menswear" | "womenswear";
export const PREFERENCE_KEY = "pairly.stylePreference";
export type Screen = "welcome" | "diagnosis" | "reveal" | "upload" | "results";
export type Tab = "style" | "feed" | "closet" | "me";
export interface PostDraft { image: string | null; pickImages?: string[]; look?: Look; ownedImage?: string }
export interface SavedLook { id: string; look: Look; ownedImage: string; ownedName: string }

export interface UploadedItem {
  image: string;
  category: ItemCategory;
  attributes: string[];
  source: "upload" | "sample";
  name?: string;
}

interface PairlyState {
  recentItems: RecentItem[];
  savedOutfits: SavedOutfit[];
  stylePreference: StylePreference | null;
  preferenceLoaded: boolean;
  screen: Screen;
  answers: Answer[];
  styleType: StyleTypeCode | null;
  axisScores: number[] | null;
  exploreLevel: ExploreLevel;
  quizSkipped: boolean;
  uploadedItem: UploadedItem | null;
  occasion: Occasion | null;
  note: string;
  shopClicks: number;
  selectedConcept: number;
  generatedLooks?: GeneratedLook[];
  shopping?: Record<string, ShoppingRecord>;
  generationError?: string;
  planning?: boolean;
  picks: Picks | null;
  savedItems: string[];
  savedLooks: SavedLook[];
  activeTab: Tab;
  posts: SocialPost[];
  userVotes: Record<string, "up" | "down">;
  draft: PostDraft | null;
  feedHintDismissed: boolean;
}

const initial: PairlyState = { recentItems: RECENT_ITEMS, savedOutfits: SAVED_OUTFITS, stylePreference: null, preferenceLoaded: false, screen: "welcome", answers: [], styleType: null, axisScores: null, exploreLevel: "low", quizSkipped: false, uploadedItem: null, occasion: null, note: "", shopClicks: 0, selectedConcept: 0, picks: null, savedItems: [], savedLooks: [], activeTab: "style", posts: POSTS, userVotes: {}, draft: null, feedHintDismissed: false };

interface PairlyCtx extends PairlyState {
  recordUpload: (image: string, name?: string, category?: ItemCategory) => void;
  deleteRecent: (id: string) => void;
  deleteSavedOutfit: (id: string) => void;
  go: (s: Screen) => void;
  setStylePreference: (p: StylePreference) => void;
  answer: (a: Answer) => void;
  skipQuiz: () => void;
  back: () => void;
  retake: () => void;
  reset: () => void;
  setUploadedItem: (i: UploadedItem | null) => void;
  setOccasion: (o: Occasion | null) => void;
  setNote: (note: string) => void;
  setSelectedConcept: (index: number) => void;
  countShopClick: () => void;
  findMatches: () => void;
  retryLook: (index: number) => void;
  searchShopping: (look: GeneratedLook, item: ConceptItem, country?: string, budget?: ShoppingInput["budget"]) => void;
  toggleSave: (id: string) => boolean;
  setTab: (t: Tab) => void;
  dismissFeedHint: () => void;
  openDraft: (d: PostDraft | null) => void;
  vote: (id: string, v: "up" | "down") => void;
  addFeedback: (id: string, chip: string) => void;
  createPost: (p: Pick<SocialPost, "image" | "pickImages" | "question" | "occasion">) => void;
  bumpUserPost: (id: string, up: number, down: number) => void;
  loadPreset: (r: PresetRequest) => void;
}

// Keep one context object across hot reloads; a re-created context makes the
// provider and consumers disagree and throws "must be used inside PairlyProvider".
const g = globalThis as { __pairlyCtx?: React.Context<PairlyCtx | null> };
const Ctx = (g.__pairlyCtx ??= createContext<PairlyCtx | null>(null));

export function PairlyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PairlyState>(initial);
  const planFn = useServerFn(planStyle);
  const renderFn = useServerFn(renderStyleLook);
  const shoppingFn = useServerFn(findShoppingProducts);
  const shoppingPending = useRef(new Set<string>());
  const shoppingCache = useRef<Record<string, ShoppingRecord>>({});
  const running = useRef(false);
  const runId = useRef(0);
  const inFlight = useRef(new Set<number>());
  const existingRequest = useRef<string | null>(null);
  const selectionTouched = useRef(false);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(PREFERENCE_KEY); } catch { /* storage unavailable */ }
    setState((s) => ({ ...s, preferenceLoaded: true, stylePreference: s.stylePreference ?? (saved === "menswear" || saved === "womenswear" ? saved : null) }));
  }, []);
  const generation = useRef<{ preference: StylePreference; reference: string; presentation: string; occasion: string; mood: string } | null>(null);
  const renderLook = async (index: number, look: GeneratedLook, token: number) => {
    const request = generation.current;
    if (!request || inFlight.current.has(index)) return;
    inFlight.current.add(index);
    setState((s) => ({ ...s, generatedLooks: s.generatedLooks?.map((entry, i) => i === index ? { ...entry, status: "loading", error: "" } : entry) ?? [] }));
    try {
      const result = await renderFn({ data: { ...request, styling: look.styling } });
      if (runId.current !== token) return;
      setState((s) => ({ ...s, selectedConcept: result.ok && !selectionTouched.current && !s.generatedLooks?.some((entry) => entry.status === "success") ? index : s.selectedConcept, generatedLooks: s.generatedLooks?.map((entry, i) => i !== index ? entry : result.ok ? { ...entry, status: "success", image: result.image, error: "" } : { ...entry, status: "failed", error: result.error }) ?? [] }));
    } catch {
      if (runId.current === token) setState((s) => ({ ...s, generatedLooks: s.generatedLooks?.map((entry, i) => i === index ? { ...entry, status: "failed", error: "Connection interrupted. This attempt may have started; retry only for a new attempt." } : entry) ?? [] }));
    } finally { inFlight.current.delete(index); }
  };
  const createMoodboards = async () => {
    if (!state.uploadedItem || !state.stylePreference) return;
    const preference = state.stylePreference;
    const fromCloset = isJasonSample(state.uploadedItem);
    const key = JSON.stringify([preference, state.uploadedItem.image, state.uploadedItem.category, state.uploadedItem.name, state.occasion, state.note.slice(0, 600)]);
    if (existingRequest.current === key && !state.generationError && (state.planning || state.generatedLooks?.length)) {
      setState((s) => ({ ...s, screen: "results", activeTab: "style" }));
      return;
    }
    if (running.current || inFlight.current.size) return;
    existingRequest.current = key;
    selectionTouched.current = false;
    running.current = true;
    const token = ++runId.current;
    setState((s) => ({ ...s, screen: "results", activeTab: "style", selectedConcept: 0, generatedLooks: fromCloset ? jasonPendingLooks(preference).map((look, index) => index === 0 ? look : { ...look, status: "loading" }) : [], planning: true, generationError: "", picks: s.uploadedItem ? generatePicks(CATALOG, s.uploadedItem.category, s.uploadedItem.name ?? s.uploadedItem.category, s.styleType ?? DEFAULT_CODE, s.occasion) : s.picks }));
    try {
      const reference = await photoReference(state.uploadedItem.image);
      const request = { preference, reference, occasion: state.occasion ?? "", mood: state.note.slice(0, 600) };
      const result = await planFn({ data: { ...request, category: state.uploadedItem.category, name: state.uploadedItem.name ?? state.uploadedItem.category } });
      if (runId.current !== token) return;
      if (!result.ok) throw new Error(result.error);
      const planned = looksFromPlan(result.plan, state.uploadedItem.name ?? state.uploadedItem.category, state.uploadedItem.image, preference);
      const looks = fromCloset ? [jasonClosetLook(preference), ...planned.slice(1)] : planned;
      generation.current = { ...request, presentation: result.plan.presentation };
      setState((s) => ({ ...s, generatedLooks: looks, planning: false }));
      await Promise.all(looks.map((look, index) => fromCloset && index === 0 ? Promise.resolve() : renderLook(index, look, token)));
    } catch (error) {
      if (runId.current === token) setState((s) => ({ ...s, planning: false, generatedLooks: fromCloset ? s.generatedLooks?.map((look, index) => index === 0 ? look : { ...look, status: "failed", error: "Couldn’t prepare this new look. Try generation again." }) : s.generatedLooks, generationError: error instanceof Error ? error.message : "Couldn't prepare your styling directions." }));
    } finally { running.current = false; }
  };
  const value = useMemo<PairlyCtx>(() => ({
    ...state,
    searchShopping: (look, item, country, budget) => {
      if (item.owned || item.role === "Your piece" || look.preference !== state.stylePreference) return;
      const key = shoppingKey(look, item, country, budget);
      const cached = shoppingCache.current[key];
      if (shoppingPending.current.has(key) || (cached?.status === "success" && Date.now() - Date.parse(cached.retrievedAt) < SHOPPING_TTL) || (cached && cached.attempts >= MAX_ATTEMPTS)) return;
      const record: ShoppingRecord = { status: "loading", products: [], usage: { credits: 0, calls: 0, complete: true }, blocked: [], retrievedAt: new Date().toISOString(), attempts: (cached?.attempts ?? 0) + 1 };
      shoppingPending.current.add(key); shoppingCache.current[key] = record;
      setState((s) => ({ ...s, shopping: { ...s.shopping, [key]: record } }));
      void shoppingFn({ data: { role: item.role, description: item.name, preference: look.preference, ...(country ? { country } : {}), ...(budget ? { budget } : {}) } }).then((result) => {
        const completed = { ...result, attempts: record.attempts };
        shoppingCache.current[key] = completed;
        setState((s) => ({ ...s, shopping: { ...s.shopping, [key]: completed } }));
      }).catch(() => {
        const failed: ShoppingRecord = { ...record, status: "error", error: "Shopping connection interrupted. Your outfit is unchanged.", usage: { ...record.usage, complete: false } };
        shoppingCache.current[key] = failed;
        setState((s) => ({ ...s, shopping: { ...s.shopping, [key]: failed } }));
      }).finally(() => shoppingPending.current.delete(key));
    },
    recordUpload: (image, name = "Uploaded jacket", category = "jacket") => setState((s) => ({ ...s, recentItems: addRecent(s.recentItems, { id: crypto.randomUUID(), imageUrl: image, productName: name, category, uploadedAt: new Date().toISOString() }) })),
    deleteRecent: (id) => setState((s) => ({ ...s, recentItems: removeRecent(s.recentItems, id) })),
    deleteSavedOutfit: (id) => setState((s) => ({ ...s, savedOutfits: removeOutfit(s.savedOutfits, id), savedLooks: s.savedLooks.filter((entry) => entry.id !== id) })),
    go: (screen) => setState((s) => ({ ...s, screen, activeTab: screen === "upload" || screen === "results" ? "style" : s.activeTab })),
    answer: (a) =>
      setState((s) => {
        if (s.answers.length >= ROUNDS.length) return s;
        const answers = [...s.answers, a];
        if (answers.length >= ROUNDS.length) {
          const diagnosis = computeDiagnosis(ROUNDS, answers);
          const { styleType } = diagnosis;
          const picks = s.uploadedItem && s.picks
            ? generatePicks(CATALOG, s.uploadedItem.category, s.uploadedItem.name ?? s.uploadedItem.category, styleType, s.occasion)
            : s.picks;
          return { ...s, ...diagnosis, answers, quizSkipped: false, picks, screen: "reveal" };
        }
        return { ...s, answers };
      }),
    skipQuiz: () => setState((s) => ({
      ...s, styleType: DEFAULT_CODE, axisScores: [0.5, 0.5, 0.5, 0.5], exploreLevel: "low", quizSkipped: true, screen: "reveal",
      picks: s.uploadedItem && s.picks
        ? generatePicks(CATALOG, s.uploadedItem.category, s.uploadedItem.name ?? s.uploadedItem.category, DEFAULT_CODE, s.occasion)
        : s.picks,
    })),
    back: () =>
      setState((s) => (s.answers.length ? { ...s, answers: s.answers.slice(0, -1) } : { ...s, screen: "welcome" })),
    retake: () => setState((s) => ({ ...s, answers: [], quizSkipped: false, screen: "diagnosis" })),
    setStylePreference: (stylePreference) => {
      try { localStorage.setItem(PREFERENCE_KEY, stylePreference); } catch { /* storage unavailable */ }
      if (stylePreference === state.stylePreference) return;
      // A different preference makes old moodboards stale; never show them as new matches.
      runId.current++; existingRequest.current = null; generation.current = null;
      setState((s) => ({ ...s, stylePreference, generatedLooks: [], planning: false, generationError: "", selectedConcept: 0 }));
    },
    reset: () => { runId.current++; existingRequest.current = null; try { localStorage.removeItem(PREFERENCE_KEY); } catch { /* storage unavailable */ } setState({ ...initial, preferenceLoaded: true }); },
    setUploadedItem: (uploadedItem) => { if (state.uploadedItem?.image !== uploadedItem?.image) { runId.current++; existingRequest.current = null; } setState((s) => ({ ...s, uploadedItem, selectedConcept: s.uploadedItem?.image === uploadedItem?.image ? s.selectedConcept : 0, generatedLooks: s.uploadedItem?.image === uploadedItem?.image ? s.generatedLooks ?? [] : uploadedItem && isJasonSample(uploadedItem) && s.stylePreference ? jasonPendingLooks(s.stylePreference) : [], planning: s.uploadedItem?.image === uploadedItem?.image ? s.planning ?? false : false, generationError: "" })); },
    setOccasion: (occasion) => setState((s) => ({ ...s, occasion })),
    setNote: (note) => setState((s) => ({ ...s, note })),
    setSelectedConcept: (selectedConcept) => { selectionTouched.current = true; setState((s) => ({ ...s, selectedConcept })); },
    countShopClick: () => setState((s) => ({ ...s, shopClicks: s.shopClicks + 1 })),
    findMatches: () => { void createMoodboards(); },
    retryLook: (index) => { const look = state.generatedLooks?.[index]; if (look?.status !== "failed") return; if (state.generationError) { void createMoodboards(); return; } void renderLook(index, look, runId.current); },
    toggleSave: (id) => {
      const saving = !state.savedItems.includes(id);
      setState((s) => {
        const savedItems = saving ? [...s.savedItems, id] : s.savedItems.filter((x) => x !== id);
        const savedLooks = s.savedLooks.filter((entry) => entry.look.items.some((item) => savedItems.includes(item.id)));
        if (saving && s.picks && s.uploadedItem) {
          const owned = s.uploadedItem;
          Object.values(s.picks).filter((look) => look.items.some((item) => item.id === id)).forEach((look) => {
            const key = `${owned.image}:${look.boldness}:${look.items.map((item) => item.id).join(":")}`;
            if (!savedLooks.some((entry) => entry.id === key)) savedLooks.unshift({ id: key, look, ownedImage: owned.image, ownedName: owned.name ?? owned.category });
          });
        }
        return { ...s, savedItems, savedLooks };
      });
      return saving;
    },
    setTab: (activeTab) => setState((s) => ({ ...s, activeTab })),
    dismissFeedHint: () => setState((s) => ({ ...s, feedHintDismissed: true })),
    openDraft: (draft) => setState((s) => ({ ...s, draft })),
    vote: (id, v) => setState((s) => ({
      ...s, userVotes: { ...s.userVotes, [id]: v },
      posts: s.posts.map((p) => p.id === id ? { ...p, votesUp: p.votesUp + (v === "up" ? 1 : 0), votesDown: p.votesDown + (v === "down" ? 1 : 0),
        voteGroups: [...p.voteGroups, { styleType: s.styleType ?? DEFAULT_CODE, exploreLevel: s.exploreLevel, yes: v === "up" ? 1 : 0, no: v === "down" ? 1 : 0 }] } : p),
    })),
    addFeedback: (id, chip) => setState((s) => ({ ...s, posts: s.posts.map((p) => p.id === id ? { ...p, topFeedback: [chip, ...p.topFeedback].slice(0, 3), feedback: [{ text: chip, styleType: s.styleType ?? DEFAULT_CODE, exploreLevel: s.exploreLevel }, ...p.feedback].slice(0, 4) } : p) })),
    createPost: (p) => setState((s) => ({
      ...s, draft: null, activeTab: "feed",
      posts: [{ ...p, ...(s.draft?.look ? { look: s.draft.look } : {}), ...(s.draft?.ownedImage ? { ownedImage: s.draft.ownedImage } : {}), id: `u${crypto.randomUUID()}`, author: "@you", styleType: s.styleType ?? DEFAULT_CODE, exploreLevel: s.exploreLevel, votesUp: 0, votesDown: 0, topFeedback: [], voteGroups: [], feedback: [], isUserPost: true }, ...s.posts],
    })),
    bumpUserPost: (id, up, down) => setState((s) => ({ ...s, posts: s.posts.map((p) => p.id === id ? { ...p, votesUp: p.votesUp + up, votesDown: p.votesDown + down,
      voteGroups: [...p.voteGroups, { styleType: p.styleType, exploreLevel: "low", yes: Math.ceil(up / 2), no: 0 }, { styleType: "RCDS", exploreLevel: "high", yes: Math.floor(up / 2), no: down }],
      feedback: p.votesUp + up > 3 ? mockFeedback(["Great fit", "Add a layer", "Try darker shoes"]) : p.feedback } : p) })),
    loadPreset: ({ preset, type, sample }) => {
      const item: UploadedItem = { image: sample.image, category: sample.category, attributes: sample.attributes, source: "sample", name: sample.name };
      // Functional update keeps a preference restored from storage in the same tick.
      const base = (s: PairlyState): PairlyState => ({ ...initial, stylePreference: s.stylePreference, preferenceLoaded: s.preferenceLoaded, feedHintDismissed: s.feedHintDismissed, styleType: preset === "welcome" || preset === "diagnosis" ? null : type });
      if (preset === "welcome" || preset === "diagnosis" || preset === "reveal" || preset === "upload") return setState((s) => ({ ...base(s), screen: preset }));
      const picks = generatePicks(CATALOG, item.category, item.name ?? item.category, type, null);
      setState((s) => ({ ...base(s), uploadedItem: item, picks, screen: "results", activeTab: preset === "feed" ? "feed" : preset === "closet" ? "closet" : "style" }));
    },
  }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePairly() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePairly must be used inside PairlyProvider");
  return c;
}
