import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
export function SelectChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={cn("rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground")}>
      {children}
    </button>
  );
}
