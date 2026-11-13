import * as React from "react";
import { cn } from "../utils";

export type LadderStep = "safe" | "step" | "bold";
const STEPS: { key: LadderStep; label: string }[] = [
  { key: "safe", label: "Safe" },
  { key: "step", label: "One step up" },
  { key: "bold", label: "Bold" },
];

export interface LadderControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: LadderStep;
  onChange?: (value: LadderStep) => void;
}
/** Three equal segments: SAFE, ONE STEP UP, BOLD. Same color for all three. */
export const LadderControl = React.forwardRef<HTMLDivElement, LadderControlProps>(({ className, value, onChange, ...props }, ref) => (
  <div ref={ref} role="radiogroup" aria-label="How far from your usual style" className={cn("grid grid-cols-3 gap-1", className)} {...props}>
    {STEPS.map((s) => {
      const on = s.key === value;
      return (
        <button key={s.key} type="button" role="radio" aria-checked={on} onClick={() => onChange?.(s.key)}
          className={cn("h-touch border text-label font-semibold uppercase tracking-label transition-colors duration-200 ease-kodi outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted")}>
          {s.label}
        </button>
      );
    })}
  </div>
));
LadderControl.displayName = "LadderControl";
