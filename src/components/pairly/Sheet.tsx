import type { ReactNode } from "react";
import { X } from "lucide-react";
import { BottomSheet } from "@/design-system/kodi-design-system-ac5f73";

/**
 * App sheet: the design-system BottomSheet plus a close button that stays on screen.
 *
 * The vendor panel caps itself at 85vh — the *window*, which is taller than the phone
 * frame the app lives in — so a long sheet grew past the frame's top edge and hid its
 * own close affordance. max-h-full re-anchors that cap to the frame (100% of it), and
 * the sticky bar keeps the close button inside the frame even while the sheet scrolls.
 * The negative margins only cancel the vendor's own p-6 so the bar spans the panel.
 */
export function Sheet({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title} className="max-h-full">
      {children}
      <div className="sticky bottom-0 z-10 -mx-6 -mb-6 flex justify-end bg-popover px-6 pb-6 pt-2">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-touch items-center justify-center text-muted-foreground transition-colors duration-200 ease-kodi hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-5" />
        </button>
      </div>
    </BottomSheet>
  );
}
