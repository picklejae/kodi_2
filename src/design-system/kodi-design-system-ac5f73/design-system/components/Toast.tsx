import * as React from "react";
import { cn } from "../utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Auto-dismiss after this many ms (default 2500). */
  duration?: number;
  onDismiss?: () => void;
}
/** Short message on Ink. Auto-dismisses after 2.5s. */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({ className, duration = 2500, onDismiss, ...props }, ref) => {
  React.useEffect(() => {
    if (!onDismiss) return;
    const t = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(t);
  }, [duration, onDismiss]);
  return <div ref={ref} role="status" aria-live="polite" className={cn("inline-flex min-h-12 items-center rounded-sm bg-toast px-4 text-body-sm text-toast-foreground", className)} {...props} />;
});
Toast.displayName = "Toast";
