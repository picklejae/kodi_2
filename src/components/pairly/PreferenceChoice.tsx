import { cn } from "@/lib/utils";
import { usePairly, type StylePreference } from "@/store/PairlyContext";

const OPTIONS: { value: StylePreference; label: string }[] = [{ value: "menswear", label: "Menswear" }, { value: "womenswear", label: "Womenswear" }];

/** Clothing preference picker; a shopping department choice, not an identity question. */
export function PreferenceChoice({ compact = false }: { compact?: boolean }) {
  const { stylePreference, setStylePreference } = usePairly();
  return (
    <div role="radiogroup" aria-label="What are you looking for?" className="grid grid-cols-2 gap-3">
      {OPTIONS.map((o) => {
        const on = stylePreference === o.value;
        return (
          <button key={o.value} role="radio" aria-checked={on} onClick={() => setStylePreference(o.value)}
            className={cn("rounded-full border text-sm font-semibold transition active:scale-[0.98]", compact ? "h-10" : "h-12",
              on ? "border-primary bg-primary text-primary-foreground" : "border-foreground/80 bg-transparent text-foreground")}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
