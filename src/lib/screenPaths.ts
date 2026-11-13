import type { Screen, Tab } from "@/store/PairlyContext";

export const SCREEN_PATHS = {
  "/onboarding-1": "Onboarding-1 · Welcome",
  "/onboarding-2": "Onboarding-2 · Quiz",
  "/onboarding-3": "Onboarding-3 · Style Passport",
  "/onboarding-4": "Onboarding-4 · Budget",
  "/menu1-style": "Menu1 · Style",
  "/menu1-style-1": "Menu1 · Generated looks",
  "/menu2-saved": "Menu2 · Saved",
  "/menu2-saved-1": "Menu2 · Saved look",
  "/menu3-feed": "Menu3 · Feed",
  "/menu4-me": "Menu4 · Me",
} as const;
export type ScreenPath = keyof typeof SCREEN_PATHS;

const ONBOARDING: Partial<Record<Screen, ScreenPath>> = { welcome: "/onboarding-1", diagnosis: "/onboarding-2", reveal: "/onboarding-3", budget: "/onboarding-4" };

/** URL for an in-memory screen + tab combination. */
export function pathFor(screen: Screen, tab: Tab): ScreenPath {
  const onboarding = ONBOARDING[screen];
  if (onboarding) return onboarding;
  if (tab === "feed") return "/menu3-feed";
  if (tab === "saved") return "/menu2-saved";
  if (tab === "me") return "/menu4-me";
  return screen === "results" ? "/menu1-style-1" : "/menu1-style";
}

/** Screen + tab a URL stands for; null for paths that aren't main screens. */
export function stateFor(path: string, current: Screen): { screen: Screen; tab: Tab | null } | null {
  const hit = (Object.entries(ONBOARDING) as [Screen, ScreenPath][]).find(([, p]) => p === path);
  if (hit) return { screen: hit[0], tab: null };
  const menuScreen: Screen = current === "results" ? "results" : "upload";
  if (path === "/menu1-style") return { screen: "upload", tab: "style" };
  if (path === "/menu1-style-1") return { screen: "results", tab: "style" };
  if (path === "/menu2-saved") return { screen: menuScreen, tab: "saved" };
  if (path === "/menu3-feed") return { screen: menuScreen, tab: "feed" };
  if (path === "/menu4-me") return { screen: menuScreen, tab: "me" };
  return null;
}
