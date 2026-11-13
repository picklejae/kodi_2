import * as React from "react";
import { cn } from "../utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}
/** Pill choice (occasion). Selected = black fill. */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(({ className, selected = false, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    aria-pressed={selected}
    className={cn(
      "inline-flex h-10 items-center rounded-pill border px-4 text-body-sm transition-colors duration-200 ease-kodi outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:text-disabled",
      selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground active:bg-secondary hover:bg-muted",
      className,
    )}
    {...props}
  />
));
Chip.displayName = "Chip";
