import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { usePairly } from "@/store/PairlyContext";
import { TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

/** Portal target for sheets that must stay inside the phone frame. */
export const PHONE_FRAME_ID = "phone-frame";

/** Scrolls the phone screen (not the window) back to the top. */
export function scrollPhoneTop() {
  document.querySelector(`#${PHONE_FRAME_ID} > div`)?.scrollTo({ top: 0, behavior: "smooth" });
}

/** Every screen renders inside one fixed iPhone-sized frame. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { reset } = usePairly();
  const zoom = usePhoneZoom();
  const scroller = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  // The frame scrolls internally, so window.scrollTo in ScreenSync can't reset it.
  useEffect(() => { scroller.current?.scrollTo(0, 0); }, [pathname]);
  const resetLink = <div className="absolute right-screen top-0 z-20"><TextLinkButton onClick={reset} aria-label="Reset demo">Reset demo</TextLinkButton></div>;
  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-background">
      {/* Fixed iPhone 17 Pro Safari viewport (402×718: visible page area with toolbars shown) at every breakpoint, with phone-sized gutters; not responsive by design.
          translateZ makes the frame the containing block for fixed children (tab bar, sheets). */}
      <div id={PHONE_FRAME_ID} className="relative flex h-phone w-phone-w shrink-0 flex-col overflow-hidden border border-border [--spacing-screen:20px] [transform:translateZ(0)]" style={{ zoom }}>
        <div ref={scroller} className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">{resetLink}{children}</div>
      </div>
    </div>
  );
}

// Matches --spacing-phone-w / --spacing-phone in styles.css.
const PHONE_W = 402, PHONE_H = 718, MARGIN = 16;

/** Shrinks the fixed phone uniformly when the window is smaller, so the frame never scrolls; layout stays 402×718. */
function usePhoneZoom() {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const fit = () => setZoom(Math.min(1, (innerHeight - 2 * MARGIN) / PHONE_H, (innerWidth - 2 * MARGIN) / PHONE_W));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);
  return zoom;
}
