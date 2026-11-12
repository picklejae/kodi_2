import { Heart, Shirt, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePairly, type Tab } from "@/store/PairlyContext";

const TABS: { id: Tab; label: string; Icon: typeof Heart }[] = [
  { id: "match", label: "Match", Icon: Shirt },
  { id: "social", label: "Social", Icon: Users },
  { id: "saved", label: "Saved", Icon: Heart },
  { id: "me", label: "Me", Icon: User },
];

export function BottomTabBar() {
  const { activeTab, setTab } = usePairly();
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-background/95 px-2 pb-5 pt-2 backdrop-blur">
      {TABS.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => setTab(id)} aria-current={activeTab === id ? "page" : undefined}
          className={cn("flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-medium", activeTab === id ? "text-foreground" : "text-muted-foreground")}>
          <Icon className={cn("h-5 w-5", activeTab === id && "fill-foreground/10")} />{label}
        </button>
      ))}
    </nav>
  );
}
