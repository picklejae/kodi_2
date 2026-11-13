import { Shirt, User, Users } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { usePairly, type Tab } from "@/store/PairlyContext";

function WardrobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="17" rx="2" />
      <path d="M12 3v17M9 10v3M15 10v3M6 20v1M18 20v1" />
    </svg>
  );
}

const TABS: { id: Tab; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: "match", label: "Match", Icon: Shirt },
  { id: "social", label: "Social", Icon: Users },
  { id: "saved", label: "Saved", Icon: WardrobeIcon },
  { id: "me", label: "Me", Icon: User },
];

export function BottomTabBar() {
  const { activeTab, setTab, screen, go } = usePairly();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-background/95 px-2 pb-5 pt-2 backdrop-blur">
      {TABS.map(({ id, label, Icon }) => (
        <button
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
            "flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-medium",
            activeTab === id ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <Icon
            className={cn("h-5 w-5", id !== "saved" && activeTab === id && "fill-foreground/10")}
          />
          {label}
        </button>
      ))}
    </nav>
  );
}
