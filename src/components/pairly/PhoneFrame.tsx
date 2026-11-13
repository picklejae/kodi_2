import type { ReactNode } from "react";
import { usePairly } from "@/store/PairlyContext";
import { TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

/** One page container shared by every screen: same width at every breakpoint. */
export function PhoneFrame({ children, phone = false }: { children: ReactNode; phone?: boolean }) {
  const { reset } = usePairly();
  return (
    <div className={phone ? "min-h-dvh overflow-x-clip bg-background md:flex md:items-center md:justify-center md:py-screen" : "min-h-dvh overflow-x-clip bg-background"}>
      <div className={phone ? "relative flex min-h-dvh w-full flex-col md:min-h-0 md:h-phone md:w-phone-w md:overflow-y-auto md:border md:border-border" : "page-container relative flex min-h-dvh flex-col"}>
        <div className="absolute right-screen top-0 z-20"><TextLinkButton onClick={reset} aria-label="Reset demo">Reset demo</TextLinkButton></div>
        {children}
      </div>
    </div>
  );
}
