import { Sparkles, User, GalleryVerticalEnd, Heart } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { usePairly, type Tab } from "@/store/PairlyContext";
import { PillButton } from "@/components/pairly/PillButton";

const TABS: { id: Tab; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: "style", label: "Style", Icon: Sparkles },
  { id: "saved", label: "Saved", Icon: Heart },
  { id: "feed", label: "Feed", Icon: GalleryVerticalEnd },
  { id: "me", label: "Me", Icon: User },
];

export function BottomTabBar() {
  const { activeTab, setTab, screen, go } = usePairly();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-background/95 px-2 pb-5 pt-2 backdrop-blur">
      {TABS.map(({ id, label, Icon }) => (
        <PillButton
          variant="ghost"
          key={id}
          onClick={() => {
            if (location.pathname !== "/") {
              if (screen === "welcome") go("upload");
              navigate({ to: "/" });
            }
            setTab(id);
          }}
          aria-current={activeTab === id ? "page" : undefined}
          className={cn(
            "flex h-auto flex-1 flex-col items-center gap-1 rounded-none px-0 py-1 text-[11px] font-medium",
            activeTab === id ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <Icon
            strokeWidth={2}
            className={cn("h-5 w-5", activeTab === id && "fill-foreground/10")}
          />
          {label}
        </PillButton>
      ))}
    </nav>
  );
}
