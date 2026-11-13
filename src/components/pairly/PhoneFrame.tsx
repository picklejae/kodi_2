import type { ReactNode } from "react";
import { usePairly } from "@/store/PairlyContext";
import { TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { reset, screen, activeTab } = usePairly();
  return (
    <div className="flex min-h-screen justify-center bg-muted">
      <div className={`relative flex min-h-screen w-full max-w-mobile flex-col bg-background ${screen === "results" && activeTab === "style" ? "lg:max-w-desktop" : ""}`}>
        <div className="absolute right-screen top-0 z-20"><TextLinkButton onClick={reset} aria-label="Reset demo">Reset demo</TextLinkButton></div>
        {children}
      </div>
    </div>
  );
}
