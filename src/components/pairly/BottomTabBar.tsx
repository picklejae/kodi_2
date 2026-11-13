import { useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { usePairly } from "@/store/PairlyContext";
import { BottomTabBar as KodiTabBar } from "@/design-system/kodi-design-system-ac5f73";

export function BottomTabBar() {
  const { activeTab, setTab, screen, go } = usePairly();
  const navigate = useNavigate();
  const location = useLocation();
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // The managed tab bar has fixed labels; relabel its text without changing its icon or skin.
    const tab = bar.current?.querySelectorAll("button")[1];
    if (!tab) return;
    tab.setAttribute("aria-label", "Looks");
    for (const node of tab.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent === "Saved") node.textContent = "Looks";
    }
  });
  return (
    <div ref={bar} className="fixed inset-x-0 bottom-0 z-30 page-container">
      <KodiTabBar active={activeTab} onChange={(id) => {
            if (location.pathname !== "/") {
              if (screen === "welcome") go("upload");
              navigate({ to: "/" });
            }
            setTab(id);
          }} />
    </div>
  );
}
