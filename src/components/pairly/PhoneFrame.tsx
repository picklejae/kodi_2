import type { ReactNode } from "react";
import { usePairly } from "@/store/PairlyContext";
import { TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

/** One page container shared by every screen: same width at every breakpoint. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { reset } = usePairly();
  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <div className="page-container relative flex min-h-screen flex-col">
        <div className="absolute right-screen top-0 z-20"><TextLinkButton onClick={reset} aria-label="Reset demo">Reset demo</TextLinkButton></div>
        {children}
      </div>
    </div>
  );
}
