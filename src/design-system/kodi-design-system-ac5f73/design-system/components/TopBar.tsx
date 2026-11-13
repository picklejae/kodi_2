import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../utils";

export interface TopBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  /** Shows the back arrow when provided. */
  onBack?: () => void;
  backLabel?: string;
  /** Optional trailing slot (e.g. a TextLinkButton). */
  trailing?: React.ReactNode;
}
/** 56px navigation bar: back arrow, centered title. */
export const TopBar = React.forwardRef<HTMLElement, TopBarProps>(({ className, title, onBack, backLabel = "Go back", trailing, ...props }, ref) => (
  <header ref={ref} className={cn("relative flex h-topbar items-center bg-background px-screen text-foreground", className)} {...props}>
    {onBack && (
      <button type="button" onClick={onBack} aria-label={backLabel} className="-ml-3 inline-flex size-touch items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-5" strokeWidth={1.75} />
      </button>
    )}
    <h1 className="pointer-events-none absolute inset-x-16 text-center text-body font-semibold truncate">{title}</h1>
    <div className="ml-auto">{trailing}</div>
  </header>
));
TopBar.displayName = "TopBar";
