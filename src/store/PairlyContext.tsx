import type React from "react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
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
  picks: Picks | null;
  savedItems: string[];
  savedLooks: SavedLook[];
  activeTab: Tab;
  posts: SocialPost[];
  userVotes: Record<string, "up" | "down">;
  draft: PostDraft | null;
  feedHintDismissed: boolean;
}

const initial: PairlyState = { recentItems: RECENT_ITEMS, savedOutfits: SAVED_OUTFITS, screen: "welcome", answers: [], styleType: null, axisScores: null, exploreLevel: "low", quizSkipped: false, uploadedItem: null, occasion: null, note: "", shopClicks: 0, picks: null, savedItems: [], savedLooks: [], activeTab: "style", posts: POSTS, userVotes: {}, draft: null, feedHintDismissed: false };

interface PairlyCtx extends PairlyState {
  recordUpload: (image: string, name?: string, category?: ItemCategory) => void;
  deleteRecent: (id: string) => void;
  deleteSavedOutfit: (id: string) => void;
  go: (s: Screen) => void;
  answer: (a: Answer) => void;
  skipQuiz: () => void;
  back: () => void;
  retake: () => void;
  reset: () => void;
  setUploadedItem: (i: UploadedItem | null) => void;
  setOccasion: (o: Occasion | null) => void;
  setNote: (note: string) => void;
  countShopClick: () => void;
  findMatches: () => void;
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
  const value = useMemo<PairlyCtx>(() => ({
    ...state,
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
    reset: () => setState(initial),
    setUploadedItem: (uploadedItem) => setState((s) => ({ ...s, uploadedItem })),
    setOccasion: (occasion) => setState((s) => ({ ...s, occasion })),
    setNote: (note) => setState((s) => ({ ...s, note })),
    countShopClick: () => setState((s) => ({ ...s, shopClicks: s.shopClicks + 1 })),
    findMatches: () =>
      setState((s) => s.uploadedItem ? {
        ...s, screen: "results",
        picks: generatePicks(CATALOG, s.uploadedItem.category, s.uploadedItem.name ?? s.uploadedItem.category, s.styleType ?? DEFAULT_CODE, s.occasion),
      } : s),
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
      const base: PairlyState = { ...initial, feedHintDismissed: state.feedHintDismissed, styleType: preset === "welcome" || preset === "diagnosis" ? null : type };
      if (preset === "welcome" || preset === "diagnosis" || preset === "reveal" || preset === "upload") return setState({ ...base, screen: preset });
      const picks = generatePicks(CATALOG, item.category, item.name ?? item.category, type, null);
      setState({ ...base, uploadedItem: item, picks, screen: "results", activeTab: preset === "feed" ? "feed" : preset === "closet" ? "closet" : "style" });
    },
  }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePairly() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePairly must be used inside PairlyProvider");
  return c;
}
