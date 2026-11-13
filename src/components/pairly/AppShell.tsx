import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/pairly/PhoneFrame";
import { Diagnosis } from "@/screens/Diagnosis";
import { Results } from "@/screens/Results";
import { Reveal } from "@/screens/Reveal";
import { Budget } from "@/screens/Budget";
import { Upload } from "@/screens/Upload";
import { Welcome } from "@/screens/Welcome";
import { Social } from "@/screens/Social";
import { Saved } from "@/screens/Saved";
import { Me } from "@/screens/Me";
import { BottomTabBar } from "@/components/pairly/BottomTabBar";
import { CreatePostSheet } from "@/components/pairly/CreatePostSheet";
import { DevJumper } from "@/components/pairly/DevJumper";
import { usePairly } from "@/store/PairlyContext";
import { pathFor, stateFor } from "@/lib/screenPaths";

/** Keeps the URL and the in-memory screen/tab in step, both directions. */
export function ScreenSync() {
  const { screen, activeTab, go, setTab } = usePairly();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const derived = pathFor(screen, activeTab);
  const prevDerived = useRef(derived);
  const prevPath = useRef<string | null>(null);
  const syncing = useRef(false);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    const next = stateFor(pathname, screen);
    if (!next || pathFor(next.screen, next.tab ?? activeTab) === derived) return;
    go(next.screen);
    if (next.tab) setTab(next.tab);
    syncing.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (prevDerived.current === derived) return;
    prevDerived.current = derived;
    // State just caught up with the URL; no navigation needed.
    if (syncing.current && derived === pathname) { syncing.current = false; return; }
    if (syncing.current) return;
    if (pathname !== derived) navigate({ to: derived });
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derived]);
  return null;
}

const PHONE_SCREENS = ["welcome", "diagnosis", "reveal", "budget"];

export function AppShell() {
  const { screen, activeTab } = usePairly();
  const { pathname } = useLocation();
  // Render from the URL first so a direct load never flashes another screen.
  const target = stateFor(pathname, screen);
  const s = target?.screen ?? screen;
  const tab = target?.tab ?? activeTab;
  let body;
  if (s === "diagnosis") body = <Diagnosis />;
  else if (s === "reveal") body = <Reveal />;
  else if (s === "budget") body = <Budget />;
  else if (s === "welcome") body = <Welcome />;
  else body = (
    <>
      <div className="flex flex-1 flex-col pb-24">
        {tab === "feed" ? <Social /> : tab === "saved" ? <Saved /> : tab === "me" ? <Me /> : s === "results" ? <Results /> : <Upload />}
      </div>
      <BottomTabBar />
      <CreatePostSheet />
    </>
  );
  return (
    <>
      <PhoneFrame phone={PHONE_SCREENS.includes(s) || tab === "saved"}>{body}</PhoneFrame>
      <DevJumper />
    </>
  );
}
