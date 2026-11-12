import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ROUNDS } from "@/data/diagnosis";
import type { StyleTypeCode } from "@/data/styleTypes";
import { computeStyleType, type Answer } from "@/lib/styleType";

export type Screen = "welcome" | "diagnosis" | "reveal";

interface PairlyState {
  screen: Screen;
  answers: Answer[];
  styleType: StyleTypeCode | null;
}

const initial: PairlyState = { screen: "welcome", answers: [], styleType: null };

interface PairlyCtx extends PairlyState {
  go: (s: Screen) => void;
  answer: (a: Answer) => void;
  back: () => void;
  retake: () => void;
  reset: () => void;
}

const Ctx = createContext<PairlyCtx | null>(null);

export function PairlyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PairlyState>(initial);
  const value = useMemo<PairlyCtx>(() => ({
    ...state,
    go: (screen) => setState((s) => ({ ...s, screen })),
    answer: (a) =>
      setState((s) => {
        const answers = [...s.answers, a];
        if (answers.length >= ROUNDS.length) {
          return { ...s, answers, styleType: computeStyleType(ROUNDS, answers), screen: "reveal" };
        }
        return { ...s, answers };
      }),
    back: () =>
      setState((s) => (s.answers.length ? { ...s, answers: s.answers.slice(0, -1) } : { ...s, screen: "welcome" })),
    retake: () => setState((s) => ({ ...s, answers: [], screen: "diagnosis" })),
    reset: () => setState(initial),
  }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePairly() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePairly must be used inside PairlyProvider");
  return c;
}
