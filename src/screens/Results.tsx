import { useRef, useState } from "react";
import { ChevronLeft, Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { StyleTypeChip } from "@/components/pairly/StyleTypeChip";
import { BOLDNESS_LABEL, type Boldness } from "@/data/catalog";
import type { Pick } from "@/lib/matching";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";

const ORDER: Boldness[] = ["safe", "step", "bold"];

export function Results() {
  const { picks, uploadedItem, go } = usePairly();
  const [active, setActive] = useState<Boldness>("safe");
  const refs = useRef<Partial<Record<Boldness, HTMLDivElement | null>>>({});
  if (!picks || !uploadedItem) return <div className="flex flex-1 items-center justify-center px-6"><PillButton onClick={() => go("upload")}>Pick a piece first</PillButton></div>;

  const select = (b: Boldness) => { setActive(b); refs.current[b]?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-12">
      <div className="flex items-center gap-3">
        <button onClick={() => go("upload")} aria-label="Back" className="-ml-2 p-2"><ChevronLeft className="h-5 w-5" /></button>
        <Photo src={uploadedItem.image} alt={uploadedItem.name ?? "Your item"} className="h-11 w-11 rounded-xl shadow-soft" />
        <StyleTypeChip />
      </div>
      <h1 className="mt-6 font-serif text-4xl leading-tight">3 ways to wear it</h1>

      <div role="tablist" className="sticky top-0 z-10 -mx-1 mt-5 flex rounded-full border border-border bg-card/95 p-1 backdrop-blur">
        {ORDER.map((b) => (
          <button key={b} role="tab" aria-selected={active === b} onClick={() => select(b)}
            className={cn("flex-1 rounded-full py-2 text-xs font-semibold transition", active === b ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
            {BOLDNESS_LABEL[b]}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-6">
        {ORDER.map((b) => (
          <div key={b} ref={(el) => { refs.current[b] = el; }} className="scroll-mt-4">
            <ProductCard pick={picks[b]} itemImage={uploadedItem.image} highlighted={active === b} />
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">Ranked by fit with your style. No sponsored placements.</p>

      <div className="mt-8 space-y-3">
        <PillButton onClick={() => toast("Coming soon")}>Get feedback</PillButton>
        <PillButton variant="outline" onClick={() => go("upload")}>Try another piece</PillButton>
      </div>
    </div>
  );
}

function ProductCard({ pick, itemImage, highlighted }: { pick: Pick; itemImage: string; highlighted: boolean }) {
  const { savedItems, toggleSave } = usePairly();
  const { item } = pick;
  const saved = savedItems.includes(item.id);
  return (
    <article className={cn("rounded-3xl bg-card p-4 shadow-soft ring-2 transition", highlighted ? "ring-primary" : "ring-transparent")}>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">{BOLDNESS_LABEL[pick.boldness]}</span>
        <div className="flex items-center gap-1" aria-label="Your item plus this pick">
          <Photo src={itemImage} alt="Your item" className="h-8 w-8 rounded-lg" />
          <Plus className="h-3 w-3 text-muted-foreground" />
          <Photo src={item.image} alt={item.name} className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      <div className="relative mt-3">
        <Photo src={item.image} alt={item.name} className="aspect-[4/5] rounded-2xl" />
        <button aria-label={saved ? "Unsave" : "Save"} aria-pressed={saved}
          onClick={() => { if (toggleSave(item.id)) toast("Saved"); }}
          className="absolute right-3 top-3 rounded-full bg-card/90 p-2 shadow-soft">
          <Heart className={cn("h-4 w-4", saved && "fill-foreground")} />
        </button>
      </div>
      <h3 className="mt-3 font-serif text-xl leading-snug">{item.name}</h3>
      <div className="mt-0.5 flex justify-between text-sm"><span className="text-muted-foreground">{item.brand}</span><span className="font-semibold">${item.price}</span></div>
      <p className="mt-3 text-sm"><span className="font-semibold">Why it works: </span>{pick.reason}</p>
      <PillButton variant="outline" className="mt-4 h-10" onClick={() => window.open(item.buyUrl, "_blank", "noopener,noreferrer")}>Shop</PillButton>
    </article>
  );
}
