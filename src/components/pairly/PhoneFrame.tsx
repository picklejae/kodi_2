import type { ReactNode } from "react";
import { usePairly } from "@/store/PairlyContext";
import { TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

/** One page container shared by every screen: same width at every breakpoint. */
export function PhoneFrame({ children, phone = false }: { children: ReactNode; phone?: boolean }) {
  const { reset } = usePairly();
  return (
    <div className={phone ? "flex min-h-dvh items-center justify-center bg-background py-screen" : "min-h-dvh overflow-x-clip bg-background"}>
      {/* Fixed iPhone 18 viewport (402×874 pt) at every breakpoint, with phone-sized gutters; not responsive by design. */}
      <div className={phone ? "relative flex h-phone w-phone-w shrink-0 flex-col overflow-hidden border border-border [--spacing-screen:20px]" : "page-container relative flex min-h-dvh flex-col"}>
        <div className="absolute right-screen top-0 z-20"><TextLinkButton onClick={reset} aria-label="Reset demo">Reset demo</TextLinkButton></div>
        {children}
      </div>
    </div>
  );
}
