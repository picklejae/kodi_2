import type React from "react";
import { isJasonSample, jasonPendingLooks, jasonClosetLook } from "@/data/jason";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { planStyle, renderStyleLook } from "@/lib/styleGeneration.functions";
import { looksFromPlan, photoReference, styleProfile, defaultConcept, type GeneratedLook, type StylePlan } from "@/lib/styleGeneration";
import { ROUNDS } from "@/data/diagnosis";
import { UPLOAD_SAMPLES, type ItemCategory, type Occasion } from "@/data/samples";
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
import { STYLE_PRESETS, stylePresetKey, PRESET_LOADING_MS } from "@/data/stylePresets";
import { originalImageIdentity, styleCacheKey, generationBody, bypassStyleCache, readStyleCache, writeStyleCache } from "@/lib/styleCache";
import type { ConceptItem } from "@/data/moodboards";

export type StylePreference = "menswear" | "womenswear";
export const PREFERENCE_KEY = "pairly.stylePreference";
export type Screen = "welcome" | "diagnosis" | "reveal" | "upload" | "results";
export type Tab = "style" | "saved" | "feed" | "me";
export type UnitSystem = "metric" | "imperial";
export interface BodyStats { heightCm: number | null; weightKg: number | null }
export interface BudgetRange { min: number; max: number }
export const BUDGET_LIMIT = 500;
export interface PostDraft { image: string | null; pickImages?: string[]; look?: Look; ownedImage?: string }

export interface UploadedItem {
  image: string;
  category: ItemCategory;
  attributes: string[];
  source: "upload" | "sample";
  name?: string;
  sampleId?: string;
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
  body: BodyStats;
  units: UnitSystem;
  budget: BudgetRange;
  activeTab: Tab;
  posts: SocialPost[];
  userVotes: Record<string, "up" | "down">;
  draft: PostDraft | null;
  feedHintDismissed: boolean;
}

const initial: PairlyState = { recentItems: RECENT_ITEMS, savedOutfits: SAVED_OUTFITS, stylePreference: null, preferenceLoaded: false, screen: "welcome", answers: [], styleType: null, axisScores: null, exploreLevel: "low", quizSkipped: false, uploadedItem: null, occasion: null, note: "", shopClicks: 0, selectedConcept: 0, picks: null, body: { heightCm: null, weightKg: null }, units: "metric", budget: { min: 0, max: BUDGET_LIMIT }, activeTab: "style", posts: POSTS, userVotes: {}, draft: null, feedHintDismissed: false };

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
  regenerate: () => void;
  retryLook: (index: number) => void;
  searchShopping: (look: GeneratedLook, item: ConceptItem, country?: string, budget?: ShoppingInput["budget"]) => void;
  saveLook: (look: GeneratedLook) => boolean;
  setBody: (b: BodyStats) => void;
  setUnits: (u: UnitSystem) => void;
  setBudget: (b: BudgetRange) => void;
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
  const imageIdentities = useRef(new Map<string, string | Promise<string>>());
  const cacheSession = useRef<{ key: string; plan: StylePlan; looks: GeneratedLook[] } | null>(null);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(PREFERENCE_KEY); } catch { /* storage unavailable */ }
    setState((s) => ({ ...s, preferenceLoaded: true, stylePreference: s.stylePreference ?? (saved === "menswear" || saved === "womenswear" ? saved : null) }));
  }, []);
  const generation = useRef<{ preference: StylePreference; reference: string; presentation: string; occasion: string; mood: string; body: string } | null>(null);
  const persistSession = async (token: number) => {
    const session = cacheSession.current;
    if (runId.current !== token || !session) return;
    await writeStyleCache({ ...session, createdAt: Date.now() });
  };
  const renderLook = async (index: number, look: GeneratedLook, token: number) => {
    const request = generation.current;
    if (!request || inFlight.current.has(index)) return;
    inFlight.current.add(index);
    setState((s) => ({ ...s, generatedLooks: s.generatedLooks?.map((entry, i) => i === index ? { ...entry, status: "loading", error: "" } : entry) ?? [] }));
    let completed: GeneratedLook;
    try {
      // A partial cached result prepares the reference only on explicit retry.
      const ownedImage = look.items.find((item) => item.role === "Your piece")?.image;
      const reference = request.reference || (ownedImage ? await photoReference(ownedImage) : "");
      const result = await renderFn({ data: { ...request, reference, styling: look.styling } });
      completed = result.ok ? { ...look, status: "success", image: result.image, error: "" } : { ...look, status: "failed", error: result.error };
    } catch {
      completed = { ...look, status: "failed", error: "Connection interrupted. This attempt may have started; retry only for a new attempt." };
    }
    if (runId.current === token) {
      if (cacheSession.current) cacheSession.current.looks[index] = completed;
      setState((s) => ({ ...s, generatedLooks: s.generatedLooks?.map((entry, i) => i === index ? completed : entry) ?? [] }));
    }
    inFlight.current.delete(index);
    if (!running.current) await persistSession(token);
  };
  const createMoodboards = async (force = false) => {
    if (!state.uploadedItem || !state.stylePreference) return;
    const knownIdentity = imageIdentities.current.get(state.uploadedItem.image);
    if (!force && !bypassStyleCache(window.location.search) && typeof knownIdentity === "string") {
      const currentKey = styleCacheKey({ imageIdentity: knownIdentity, preference: state.stylePreference, ...styleProfile(state.styleType, state.axisScores, state.quizSkipped), occasion: state.occasion ?? "", mood: state.note.trim().slice(0, 600), body: generationBody(state.body), category: state.uploadedItem.category, name: state.uploadedItem.name ?? state.uploadedItem.category });
      if (existingRequest.current === currentKey && !state.generationError && state.generatedLooks?.length) {
        setState((s) => ({ ...s, screen: "results", activeTab: "style" }));
        return;
      }
    }
    if (running.current || inFlight.current.size) {
      setState((s) => ({ ...s, screen: "results", activeTab: "style" }));
      return;
    }
    running.current = true;
    let token = runId.current;
    const item = state.uploadedItem;
    const preference = state.stylePreference;
    const fromCloset = isJasonSample(item);
    const profile = styleProfile(state.styleType, state.axisScores, state.quizSkipped);
    const skipCache = force || bypassStyleCache(window.location.search);
    const requestContext = { preference, occasion: state.occasion ?? "", mood: state.note.slice(0, 600), body: generationBody(state.body) };
    setState((s) => ({ ...s, screen: "results", activeTab: "style", picks: generatePicks(CATALOG, item.category, item.name ?? item.category, profile.styleType, s.occasion) }));
    try {
      const sampleId = item.source === "sample" ? UPLOAD_SAMPLES.find((sample) => sample.image === item.image)?.id : undefined;
      let identityPromise = imageIdentities.current.get(item.image);
      if (!identityPromise) {
        identityPromise = originalImageIdentity(item.image, sampleId);
        imageIdentities.current.set(item.image, identityPromise);
        void identityPromise.catch(() => imageIdentities.current.delete(item.image));
      }
      const imageIdentity = await identityPromise;
      imageIdentities.current.set(item.image, imageIdentity);
      if (runId.current !== token) return;
      const key = styleCacheKey({ imageIdentity, preference, ...profile, occasion: requestContext.occasion, mood: state.note.trim().slice(0, 600), body: requestContext.body, category: item.category, name: item.name ?? item.category });
      if (!skipCache && existingRequest.current === key && !state.generationError && state.generatedLooks?.length) return;
      existingRequest.current = key;
      selectionTouched.current = false;
      token = ++runId.current;
      const showLoading = () => setState((s) => ({ ...s, selectedConcept: defaultConcept(state.exploreLevel), generatedLooks: fromCloset ? jasonPendingLooks(preference).map((look, index) => index === 0 ? look : { ...look, status: "loading" }) : [], planning: true, generationError: "", picks: generatePicks(CATALOG, item.category, item.name ?? item.category, profile.styleType, s.occasion) }));
      const restore = (plan: StylePlan, successful: GeneratedLook[]) => {
        const planned = looksFromPlan(plan, item.name ?? item.category, item.image, preference);
        const looks: GeneratedLook[] = planned.map((look) => {
          const hit = successful.find((saved) => saved.tier === look.tier);
          return hit ? { ...hit, status: "success" as const, error: "", items: look.items } : { ...look, status: "failed" as const, error: "This look wasn't generated. Retry this look." };
        });
        if (fromCloset) looks[0] = jasonClosetLook(preference);
        generation.current = { ...requestContext, reference: "", presentation: plan.presentation };
        cacheSession.current = { key, plan, looks };
        running.current = false;
        setState((s) => ({ ...s, generatedLooks: looks, planning: false, generationError: "", selectedConcept: defaultConcept(state.exploreLevel), picks: generatePicks(CATALOG, item.category, item.name ?? item.category, profile.styleType, s.occasion) }));
      };
      const preset = skipCache ? undefined : STYLE_PRESETS[stylePresetKey(imageIdentity, preference, profile.styleType)];
      if (preset) {
        showLoading();
        await new Promise((resolve) => setTimeout(resolve, PRESET_LOADING_MS));
        if (runId.current !== token) return;
        const looks = looksFromPlan(preset.result.plan, item.name ?? item.category, item.image, preference).map((look, index) => ({ ...look, image: preset.images[index] ?? "", status: "success" as const }));
        restore(preset.result.plan, looks);
        return;
      }
      const cached = skipCache ? null : await readStyleCache(key);
      if (runId.current !== token) return;
      if (cached) { restore(cached.plan, cached.looks); return; }
      showLoading();
      cacheSession.current = null;
      const reference = await photoReference(item.image);
      if (runId.current !== token) return;
      const request = { ...requestContext, reference };
      const result = await planFn({ data: { ...request, ...profile, category: item.category, name: item.name ?? item.category } });
      if (runId.current !== token) return;
      if (!result.ok) throw new Error(result.error);
      const planned = looksFromPlan(result.plan, item.name ?? item.category, item.image, preference);
      const looks = fromCloset ? [jasonClosetLook(preference), ...planned.slice(1)] : planned;
      generation.current = { ...request, presentation: result.plan.presentation };
      cacheSession.current = { key, plan: result.plan, looks: [...looks] };
      setState((s) => ({ ...s, generatedLooks: looks, planning: false }));
      await Promise.all(looks.map((look, index) => fromCloset && index === 0 ? Promise.resolve() : renderLook(index, look, token)));
      running.current = false;
      await persistSession(token);
    } catch (error) {
      if (runId.current === token) setState((s) => ({ ...s, planning: false, generatedLooks: fromCloset ? (s.generatedLooks ?? []).map((look, index) => index === 0 ? look : { ...look, status: "failed", error: "Couldn’t prepare this new look. Try generation again." }) : s.generatedLooks ?? [], generationError: error instanceof Error ? error.message : "Couldn't prepare your styling directions." }));
    } finally { if (runId.current === token) running.current = false; }
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
    deleteSavedOutfit: (id) => setState((s) => ({ ...s, savedOutfits: removeOutfit(s.savedOutfits, id) })),
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
    regenerate: () => { void createMoodboards(true); },
    retryLook: (index) => { const look = state.generatedLooks?.[index]; if (look?.status !== "failed") return; if (state.generationError) { void createMoodboards(); return; } void renderLook(index, look, runId.current); },
    saveLook: (look) => {
      if (look.status !== "success" || !look.image) return false;
      const entry: SavedOutfit = {
        id: `${look.id}:${look.image.length}`,
        imageUrl: look.image,
        lookName: look.name,
        explanation: look.explanation,
        ownedName: look.items.find((item) => item.owned)?.name ?? "Your piece",
        products: look.items,
      };
      if (state.savedOutfits.some((outfit) => outfit.id === entry.id)) return false;
      setState((s) => (s.savedOutfits.some((outfit) => outfit.id === entry.id) ? s : { ...s, savedOutfits: [entry, ...s.savedOutfits] }));
      return true;
    },
    setBody: (body) => setState((s) => ({ ...s, body })),
    setUnits: (units) => setState((s) => ({ ...s, units })),
    setBudget: (budget) => setState((s) => ({ ...s, budget })),
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
      setState((s) => ({ ...base(s), uploadedItem: item, picks, screen: "results", activeTab: preset === "feed" ? "feed" : preset === "saved" ? "saved" : "style" }));
    },
  }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePairly() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePairly must be used inside PairlyProvider");
  return c;
}
