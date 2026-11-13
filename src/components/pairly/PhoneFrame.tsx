import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { usePairly } from "@/store/PairlyContext";
import { TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

/** Portal target for sheets that must stay inside the phone frame. */
export const PHONE_FRAME_ID = "phone-frame";

/** One page container shared by every screen: same width at every breakpoint. */
export function PhoneFrame({ children, phone = false }: { children: ReactNode; phone?: boolean }) {
  const { reset } = usePairly();
  const zoom = usePhoneZoom(phone);
  const scroller = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  // The frame scrolls internally, so window.scrollTo in ScreenSync can't reset it.
  useEffect(() => { scroller.current?.scrollTo(0, 0); }, [pathname]);
  const resetLink = <div className="absolute right-screen top-0 z-20"><TextLinkButton onClick={reset} aria-label="Reset demo">Reset demo</TextLinkButton></div>;
  if (!phone) return (
    <div className="min-h-dvh overflow-x-clip bg-background">
      <div className="page-container relative flex min-h-dvh flex-col">{resetLink}{children}</div>
    </div>
  );
  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-background">
      {/* Fixed iPhone 18 viewport (402×874 pt) at every breakpoint, with phone-sized gutters; not responsive by design.
          translateZ makes the frame the containing block for fixed children (tab bar, sheets). */}
      <div id={PHONE_FRAME_ID} className="relative flex h-phone w-phone-w shrink-0 flex-col overflow-hidden border border-border [--spacing-screen:20px] [transform:translateZ(0)]" style={{ zoom }}>
        <div ref={scroller} className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">{resetLink}{children}</div>
      </div>
    </div>
  );
}

// Matches --spacing-phone-w / --spacing-phone in styles.css.
const PHONE_W = 402, PHONE_H = 874, MARGIN = 16;

/** Shrinks the fixed phone uniformly when the window is smaller, so the frame never scrolls; layout stays 402×874. */
function usePhoneZoom(phone: boolean) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    if (!phone) return;
    const fit = () => setZoom(Math.min(1, (innerHeight - 2 * MARGIN) / PHONE_H, (innerWidth - 2 * MARGIN) / PHONE_W));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, [phone]);
  return zoom;
}
