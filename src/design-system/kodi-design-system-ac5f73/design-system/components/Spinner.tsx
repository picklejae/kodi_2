import * as React from "react";
import { cn } from "../utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Accessible label announced to screen readers. */
  label?: string;
}

/** The single loading spinner. Use at most one per screen, never next to a ProgressLine. */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, label = "Loading", ...props }, ref) => (
    <span ref={ref} role="status" aria-label={label} className={cn("inline-block size-5 animate-spin rounded-pill border-2 border-current border-t-transparent", className)} {...props} />
  ),
);
Spinner.displayName = "Spinner";
