import * as React from "react";
import { Bookmark, Shirt, UserRound, Users, type LucideIcon } from "lucide-react";
import { cn } from "../utils";

export type TabKey = "style" | "saved" | "feed" | "me";
const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "style", label: "Style", icon: Shirt },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "feed", label: "Feed", icon: Users },
  { key: "me", label: "Me", icon: UserRound },
];

export interface BottomTabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  active: TabKey;
  onChange?: (tab: TabKey) => void;
}
/** Four-tab bar: Style, Saved, Feed, Me. Hidden during onboarding. */
export const BottomTabBar = React.forwardRef<HTMLElement, BottomTabBarProps>(({ className, active, onChange, ...props }, ref) => (
  <nav ref={ref} aria-label="Main" className={cn("grid grid-cols-4 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]", className)} {...props}>
    {TABS.map(({ key, label, icon: Icon }) => {
      const on = key === active;
      return (
        <button key={key} type="button" aria-current={on ? "page" : undefined} onClick={() => onChange?.(key)}
          className={cn("flex h-tabbar flex-col items-center justify-center gap-1 text-label outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", on ? "font-semibold text-foreground" : "text-muted-foreground")}>
          <Icon className="size-5" strokeWidth={on ? 2.25 : 1.75} />
          {label}
        </button>
      );
    })}
  </nav>
));
BottomTabBar.displayName = "BottomTabBar";
