import { useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { pathFor } from "@/lib/screenPaths";
import { usePairly } from "@/store/PairlyContext";
import { BottomTabBar as KodiTabBar } from "@/design-system/kodi-design-system-ac5f73";

export function BottomTabBar() {
  const { activeTab, setTab, screen, go } = usePairly();
  const navigate = useNavigate();
  const bar = useRef<HTMLDivElement>(null);
  return (
    <div ref={bar} className="fixed inset-x-0 bottom-0 z-30 page-container">
      <KodiTabBar active={activeTab} onChange={(id) => {
            const nextScreen = screen === "results" ? "results" : "upload";
            if (screen !== nextScreen) go(nextScreen);
            setTab(id);
            navigate({ to: pathFor(nextScreen, id) });
          }} />
    </div>
  );
}
