import type React from "react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ROUNDS } from "@/data/diagnosis";
import type { ItemCategory, Occasion } from "@/data/samples";
import type { StyleTypeCode } from "@/data/styleTypes";
import { computeStyleType, type Answer } from "@/lib/styleType";
import { generatePicks, type Picks } from "@/lib/matching";
import { CATALOG } from "@/data/catalog";
import { DEFAULT_CODE } from "@/data/styleTypes";
import { POSTS, type SocialPost } from "@/data/social";

export type Screen = "welcome" | "diagnosis" | "reveal" | "upload" | "results";
export type Tab = "match" | "social" | "saved" | "me";
export interface PostDraft { image: string | null; pickImages?: string[] }

export interface UploadedItem {
  image: string;
  category: ItemCategory;
  attributes: string[];
  source: "upload" | "sample";
  name?: string;
}

interface PairlyState {
  screen: Screen;
  answers: Answer[];
  styleType: StyleTypeCode | null;
  uploadedItem: UploadedItem | null;
  occasion: Occasion | null;
  picks: Picks | null;
  savedItems: string[];
  activeTab: Tab;
  posts: SocialPost[];
  userVotes: Record<string, "up" | "down">;
  draft: PostDraft | null;
}

const initial: PairlyState = { screen: "welcome", answers: [], styleType: null, uploadedItem: null, occasion: null, picks: null, savedItems: [], activeTab: "match", posts: POSTS, userVotes: {}, draft: null };

interface PairlyCtx extends PairlyState {
  go: (s: Screen) => void;
  answer: (a: Answer) => void;
  back: () => void;
  retake: () => void;
  reset: () => void;
  setUploadedItem: (i: UploadedItem | null) => void;
  setOccasion: (o: Occasion | null) => void;
  findMatches: () => void;
  toggleSave: (id: string) => boolean;
  setTab: (t: Tab) => void;
  openDraft: (d: PostDraft | null) => void;
  vote: (id: string, v: "up" | "down") => void;
  addFeedback: (id: string, chip: string) => void;
  createPost: (p: Pick<SocialPost, "image" | "pickImages" | "question" | "occasion">) => void;
  bumpUserPost: (id: string, up: number, down: number) => void;
}

// Keep one context object across hot reloads; a re-created context makes the
// provider and consumers disagree and throws "must be used inside PairlyProvider".
const g = globalThis as { __pairlyCtx?: React.Context<PairlyCtx | null> };
const Ctx = (g.__pairlyCtx ??= createContext<PairlyCtx | null>(null));

export function PairlyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PairlyState>(initial);
  const value = useMemo<PairlyCtx>(() => ({
    ...state,
    go: (screen) => setState((s) => ({ ...s, screen, activeTab: screen === "upload" || screen === "results" ? "match" : s.activeTab })),
    answer: (a) =>
      setState((s) => {
        const answers = [...s.answers, a];
        if (answers.length >= ROUNDS.length) {
          const styleType = computeStyleType(ROUNDS, answers);
          const picks = s.uploadedItem && s.picks
            ? generatePicks(CATALOG, s.uploadedItem.category, s.uploadedItem.name ?? s.uploadedItem.category, styleType, s.occasion)
            : s.picks;
          return { ...s, answers, styleType, picks, screen: "reveal" };
        }
        return { ...s, answers };
      }),
    back: () =>
      setState((s) => (s.answers.length ? { ...s, answers: s.answers.slice(0, -1) } : { ...s, screen: "welcome" })),
    retake: () => setState((s) => ({ ...s, answers: [], screen: "diagnosis" })),
    reset: () => setState(initial),
    setUploadedItem: (uploadedItem) => setState((s) => ({ ...s, uploadedItem })),
    setOccasion: (occasion) => setState((s) => ({ ...s, occasion })),
    findMatches: () =>
      setState((s) => s.uploadedItem ? {
        ...s, screen: "results",
        picks: generatePicks(CATALOG, s.uploadedItem.category, s.uploadedItem.name ?? s.uploadedItem.category, s.styleType ?? DEFAULT_CODE, s.occasion),
      } : s),
    toggleSave: (id) => {
      const saving = !state.savedItems.includes(id);
      setState((s) => ({ ...s, savedItems: saving ? [...s.savedItems, id] : s.savedItems.filter((x) => x !== id) }));
      return saving;
    },
    setTab: (activeTab) => setState((s) => ({ ...s, activeTab })),
    openDraft: (draft) => setState((s) => ({ ...s, draft })),
    vote: (id, v) => setState((s) => ({
      ...s, userVotes: { ...s.userVotes, [id]: v },
      posts: s.posts.map((p) => p.id === id ? { ...p, votesUp: p.votesUp + (v === "up" ? 1 : 0), votesDown: p.votesDown + (v === "down" ? 1 : 0) } : p),
    })),
    addFeedback: (id, chip) => setState((s) => ({ ...s, posts: s.posts.map((p) => p.id === id && !p.topFeedback.includes(chip) ? { ...p, topFeedback: [chip, ...p.topFeedback].slice(0, 3) } : p) })),
    createPost: (p) => setState((s) => ({
      ...s, draft: null, activeTab: "social",
      posts: [{ ...p, id: `u${Date.now()}`, author: "@you", styleType: s.styleType ?? DEFAULT_CODE, votesUp: 0, votesDown: 0, topFeedback: [], isUserPost: true }, ...s.posts],
    })),
    bumpUserPost: (id, up, down) => setState((s) => ({ ...s, posts: s.posts.map((p) => p.id === id ? { ...p, votesUp: p.votesUp + up, votesDown: p.votesDown + down } : p) })),
  }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePairly() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePairly must be used inside PairlyProvider");
  return c;
}
