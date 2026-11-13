import * as React from "react";
import { cn } from "../utils";

export interface ScaleBarProps extends React.HTMLAttributes<HTMLDivElement> {
  start: string;
  end: string;
  /** Marker position from 0 (start) to 1 (end). */
  value: number;
}
/** Read-only scale between two labels. No numbers, no gradients. */
export const ScaleBar = React.forwardRef<HTMLDivElement, ScaleBarProps>(({ className, start, end, value, ...props }, ref) => {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <div ref={ref} role="img" aria-label={`Between ${start} and ${end}`} className={cn("flex items-center gap-2 text-label text-muted-foreground", className)} {...props}>
      <span className="w-20 shrink-0">{start}</span>
      <div className="relative h-1 flex-1 bg-secondary">
        <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-primary" style={{ left: `${pct}%` }} />
      </div>
      <span className="w-20 shrink-0 text-right">{end}</span>
    </div>
  );
});
ScaleBar.displayName = "ScaleBar";
