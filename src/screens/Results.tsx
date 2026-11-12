import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Heart } from "lucide-react";
import { toast } from "sonner";
import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { OutfitBoard } from "@/components/pairly/OutfitBoard";
import { PillButton } from "@/components/pairly/PillButton";
import { StyleTypeChip } from "@/components/pairly/StyleTypeChip";
import { BOLDNESS_LABEL, type Boldness, type CatalogItem } from "@/data/catalog";
import { lookOrder, type Pick } from "@/lib/matching";
import { makeOutfitBoard } from "@/lib/outfitBoard";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";

const DIAL: Boldness[] = ["safe", "step", "bold"];

export function Results() {
  const { picks, uploadedItem, exploreLevel, note, go, openDraft } = usePairly();
  const order = lookOrder(exploreLevel);
  const [active, setActive] = useState<Boldness>(order[0] ?? "safe");
  const [sharing, setSharing] = useState(false);
  const refs = useRef<Partial<Record<Boldness, HTMLDivElement | null>>>({});
  const suppressObserver = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => {
      if (suppressObserver.current) return;
      const visible = DIAL.flatMap((b) => {
        const rect = refs.current[b]?.getBoundingClientRect();
        return rect && rect.bottom > 80 && rect.top < window.innerHeight * 0.6 ? [{ b, distance: Math.abs(rect.top - 80) }] : [];
      }).sort((a, b) => a.distance - b.distance);
      if (visible[0]) setActive(visible[0].b);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); if (scrollTimer.current) clearTimeout(scrollTimer.current); };
  }, [picks]);

  if (!picks || !uploadedItem) return <div className="flex flex-1 items-center justify-center px-6"><PillButton onClick={() => go("upload")}>Pick a piece first</PillButton></div>;
  const select = (b: Boldness) => {
    setActive(b); suppressObserver.current = true;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    refs.current[b]?.scrollIntoView({ behavior: "smooth", block: "start" });
    scrollTimer.current = setTimeout(() => { suppressObserver.current = false; }, 1000);
  };
  const feedback = async () => {
    // Read the viewport now: a tap can follow a scroll before its event updates state.
    const visible = DIAL.filter((b) => {
      const rect = refs.current[b]?.getBoundingClientRect();
      return rect && rect.bottom > 80 && rect.top < window.innerHeight * 0.6;
    });
    const viewed = suppressObserver.current ? active : visible.at(-1) ?? active;
    const look = picks[viewed];
    setActive(viewed);
    setSharing(true);
    try {
      const image = await makeOutfitBoard([uploadedItem.image, look.items[0].image, look.items[1].image]);
      openDraft({ image, ownedImage: uploadedItem.image, look, pickImages: look.items.map((item) => item.image) });
    } catch {
      toast("Couldn't prepare the outfit photo. Please try again.");
    } finally { setSharing(false); }
  };

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-12">
      <div className="flex items-center gap-3">
        <PillButton variant="ghost" onClick={() => go("upload")} aria-label="Back" className="h-9 w-9 shrink-0 px-0"><ChevronLeft className="h-5 w-5" /></PillButton>
        <Photo src={uploadedItem.image} alt={uploadedItem.name ?? "Your item"} className="h-11 w-11 shrink-0 rounded-xl shadow-soft" />
        <StyleTypeChip />
      </div>
      <h1 className="mt-6 font-serif text-4xl leading-tight">3 ways to wear it</h1>
      {note.trim() && <div className="mt-3 min-w-0"><Chip className="max-w-full whitespace-normal [overflow-wrap:anywhere]">{note.trim()}</Chip></div>}
      <div role="tablist" aria-label="Look boldness" className="sticky top-0 z-10 -mx-1 mt-5 flex rounded-full border border-border bg-card/95 p-1 backdrop-blur">
        {DIAL.map((b) => <PillButton key={b} variant={active === b ? "primary" : "ghost"} role="tab" aria-selected={active === b} onClick={() => select(b)} className="h-9 flex-1 px-1 text-xs">{BOLDNESS_LABEL[b]}</PillButton>)}
      </div>
      <div className="mt-5 space-y-6">
        {order.map((b) => <div key={b} ref={(el) => { refs.current[b] = el; }} className="scroll-mt-16"><LookCard pick={picks[b]} itemImage={uploadedItem.image} highlighted={active === b} /></div>)}
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">Ranked by fit with your style. No sponsored placements.</p>
      <div className="mt-8 space-y-3">
        <PillButton disabled={sharing} onClick={feedback}>{sharing ? "Preparing look…" : "Get feedback"}</PillButton>
        <PillButton variant="outline" onClick={() => go("upload")}>Try another piece</PillButton>
      </div>
    </div>
  );
}

function LookCard({ pick, itemImage, highlighted }: { pick: Pick; itemImage: string; highlighted: boolean }) {
  return <article aria-label={`${BOLDNESS_LABEL[pick.boldness]} look`} className={cn("rounded-3xl bg-card p-4 shadow-soft ring-2 transition", highlighted ? "ring-primary" : "ring-transparent")}>
    <OutfitBoard itemImage={itemImage} items={pick.items} />
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold">{BOLDNESS_LABEL[pick.boldness]}</span>
      {pick.boldness === "step" && <Chip className="px-2 text-[10px]">Recommended for you</Chip>}
    </div>
    <p className="mt-3 text-sm"><span className="font-semibold">Why it works: </span>{pick.reason}</p>
    <div className="mt-4 divide-y divide-border">{pick.items.map((item) => <PickRow key={item.id} item={item} />)}</div>
  </article>;
}

function PickRow({ item }: { item: CatalogItem }) {
  const { savedItems, toggleSave, countShopClick } = usePairly();
  const saved = savedItems.includes(item.id);
  return <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
    <Photo src={item.image} alt={item.name} className="h-28 w-20 shrink-0 rounded-lg" />
    <div className="min-w-0 flex-1">
      <div className="flex items-start gap-1">
        <h3 className="flex-1 font-serif text-lg leading-snug">{item.name}</h3>
        <PillButton variant="ghost" aria-label={saved ? "Unsave" : "Save"} aria-pressed={saved} onClick={() => { if (toggleSave(item.id)) toast("Saved"); }} className="h-8 w-8 shrink-0 px-0"><Heart className={cn("h-4 w-4", saved && "fill-foreground")} /></PillButton>
      </div>
      <p className="text-xs text-muted-foreground">{item.brand}</p>
      <p className="mt-1 text-sm font-semibold">${item.price}</p>
      <PillButton variant="outline" className="mt-2 h-9" onClick={() => { countShopClick(); window.open(item.buyUrl, "_blank", "noopener,noreferrer"); }}>Shop</PillButton>
    </div>
  </div>;
}
