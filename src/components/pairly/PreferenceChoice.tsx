import { cn } from "@/lib/utils";
import { usePairly, type StylePreference } from "@/store/PairlyContext";

const OPTIONS: { value: StylePreference; label: string }[] = [{ value: "menswear", label: "Menswear" }, { value: "womenswear", label: "Womenswear" }];

/** Full-width segmented clothing preference toggle; a shopping department choice, not an identity question. */
export function PreferenceChoice({ compact = false }: { compact?: boolean }) {
  const { stylePreference, setStylePreference } = usePairly();
  return (
    <div role="radiogroup" aria-label="What are you looking for?" className="grid w-full grid-cols-2 rounded-none border border-border">
      {OPTIONS.map((o) => {
        const on = stylePreference === o.value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => setStylePreference(o.value)}
            className={cn("rounded-none text-body-sm font-medium transition-colors duration-200 ease-kodi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset", compact ? "h-10" : "h-touch",
              on ? "bg-secondary text-foreground" : "bg-background text-muted-foreground")}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
