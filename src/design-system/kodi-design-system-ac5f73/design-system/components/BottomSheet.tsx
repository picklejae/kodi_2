import * as React from "react";
import { cn } from "../utils";

export interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title: string;
}
/** Secondary details sheet: max 560 wide, 12px top radius, Escape or backdrop closes. */
export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(({ className, open, onClose, title, children, ...props }, ref) => {
  React.useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-overlay" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={cn("relative max-h-[85vh] w-full max-w-sheet overflow-y-auto rounded-t-lg bg-popover p-6 text-popover-foreground", className)} {...props}>
        <div className="mx-auto mb-4 h-1 w-9 rounded-pill bg-secondary" />
        {children}
      </div>
    </div>
  );
});
BottomSheet.displayName = "BottomSheet";
