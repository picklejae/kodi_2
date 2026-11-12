import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { usePairly } from "@/store/PairlyContext";

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { reset } = usePairly();
  return (
    <div className="flex min-h-screen justify-center bg-muted">
      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col bg-soft-gradient shadow-soft">
        <button onClick={reset} aria-label="Reset demo" className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] text-muted-foreground/70 hover:text-foreground">
          <RotateCcw className="h-3 w-3" /> Reset demo
        </button>
        {children}
      </div>
    </div>
  );
}
