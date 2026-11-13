import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { OutfitResultView } from "@/components/pairly/OutfitResultView";
import { PillButton } from "@/components/pairly/PillButton";
import { StyleTypeChip } from "@/components/pairly/StyleTypeChip";
import { BOLDNESS_LABEL, type Boldness } from "@/data/catalog";
import { lookOrder } from "@/lib/matching";
import { makeOutfitBoard } from "@/lib/outfitBoard";
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
        {order.map((b) => <div key={b} ref={(el) => { refs.current[b] = el; }} className="scroll-mt-16"><OutfitResultView pick={picks[b]} itemImage={uploadedItem.image} highlighted={active === b} /></div>)}
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">Ranked by fit with your style. No sponsored placements.</p>
      <div className="mt-8 space-y-3">
        <PillButton disabled={sharing} onClick={feedback}>{sharing ? "Preparing look…" : "Get feedback"}</PillButton>
        <PillButton variant="outline" onClick={() => go("upload")}>Try another piece</PillButton>
      </div>
    </div>
  );
}
