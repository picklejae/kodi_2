import * as React from "react";
import { cn } from "../utils";

export interface ProgressLineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0 to 1. */
  value: number;
  text?: string;
}
/** 3px progress line with optional caption. Never beside a spinner. */
export const ProgressLine = React.forwardRef<HTMLDivElement, ProgressLineProps>(({ className, value, text, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
    {text && <span className="text-caption text-muted-foreground">{text}</span>}
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label={text ?? "Progress"} className="h-[3px] w-full bg-secondary">
      <div className="h-full bg-primary transition-[width] duration-200 ease-kodi" style={{ width: `${Math.min(1, Math.max(0, value)) * 100}%` }} />
    </div>
  </div>
));
ProgressLine.displayName = "ProgressLine";
