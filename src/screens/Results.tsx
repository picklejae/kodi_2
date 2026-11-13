import { ChevronLeft, Heart, ImageIcon, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { OCCASIONS } from "@/data/samples";
import { TIER_LABELS } from "@/lib/styleGeneration";
import { DEFAULT_CODE, STYLE_TYPES } from "@/data/styleTypes";
import { HotspotLayer } from "@/components/pairly/OutfitResultView";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";

export function Results() {
  const { styleType, quizSkipped, uploadedItem, occasion, note, go, selectedConcept, setSelectedConcept, generatedLooks, planning, generationError, retryLook, findMatches, regenerate, saveLook, savedOutfits, deleteSavedOutfit } = usePairly();
  if (!uploadedItem) return <div className="flex flex-1 items-center justify-center px-screen"><PillButton onClick={() => go("upload")}>Pick A Piece</PillButton></div>;
  const looks = generatedLooks ?? [];
  const active = looks[selectedConcept] ?? looks[0];
  if (!active) return <div className="px-screen pb-12 pt-12"><PillButton variant="ghost" aria-label="Back to Style" onClick={() => go("upload")} className="h-9 w-9 px-0"><ChevronLeft className="h-5 w-5" /></PillButton><h1 className="mt-6 text-title font-bold">Style your piece</h1><div role="status" className="mt-8 flex aspect-[3/4] flex-col items-center justify-center gap-5 rounded-2xl bg-secondary p-6 text-center">{planning ? <><Loader2 className="h-8 w-8 animate-spin" /><p>Creating your three styling directions…</p></> : <><ImageIcon className="h-8 w-8" /><p>{generationError || "Ready to style your piece"}</p><PillButton onClick={findMatches}>{generationError ? "Try Generation Again" : "Create Outfit Moodboards"}</PillButton></>}</div></div>;
  const occasionLabel = OCCASIONS.find((entry) => entry.id === occasion)?.label;
  return (
    <div className="flex flex-1 flex-col px-screen pb-screen pt-topbar">
      <div className="flex items-center gap-screen">
        <PillButton variant="ghost" onClick={() => go("upload")} aria-label="Back to Style" className="h-9 w-9 shrink-0 px-0"><ChevronLeft className="h-5 w-5" /></PillButton>
        <Photo src={uploadedItem.image} alt={uploadedItem.name ?? "Your item"} className="h-12 w-12 shrink-0 rounded-xl" />
        <div><p className="text-label text-muted-foreground">Your piece</p><p className="text-body-sm font-semibold capitalize">{uploadedItem.name ?? uploadedItem.category}</p></div>
      </div>
      <h1 className="mt-screen text-title font-bold">Style your piece</h1>
      <div className="mt-screen flex flex-wrap gap-screen">{occasionLabel && <Chip>{occasionLabel}</Chip>}{note.trim() && <p className="min-w-0 text-body-sm text-muted-foreground break-all">{note.trim()}</p>}</div>
      <p className="mt-screen text-body-sm">How far do you want to go from your usual style?</p>
      <div role="tablist" aria-label="Styling directions" className="mt-3 grid grid-cols-3 gap-1 rounded-2xl border border-border bg-card p-1">
        {looks.map((look, index) => { const on = active.id === look.id; return <button key={look.id} type="button" role="tab" id={`concept-${look.id}`} aria-controls="selected-concept" aria-selected={on} onClick={() => setSelectedConcept(index)} className={cn("relative flex h-16 min-w-0 flex-col items-center justify-center rounded-xl px-1 text-center text-xs transition-colors duration-200 ease-kodi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", on ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground")}>{(look.status === "loading" || look.status === "idle") && <Loader2 aria-label="Generating" className="absolute left-1 top-1 h-3 w-3 animate-spin" />}{look.status === "failed" && <ImageIcon aria-label="Generation failed" className="absolute left-1 top-1 h-3 w-3" />}<span className="block w-full font-semibold">{TIER_LABELS[look.tier]}</span>{/* Hide the name when the AI just repeated the tier label ("Safe" under "Safe"). */}<span className="mt-1 block w-full truncate text-[10px] font-normal" title={look.name}>{look.name.trim().toLowerCase() === TIER_LABELS[look.tier].toLowerCase() ? "\u00a0" : look.name}</span></button>; })}
      </div>
      <PillButton variant="ghost" onClick={regenerate} disabled={planning || looks.some((look) => look.status === "loading")} className="mt-2 h-8 w-auto self-start px-0 text-xs font-normal underline underline-offset-4">Regenerate</PillButton>
      <p className="mt-4 text-[10px] text-muted-foreground">{active.demoSet ? "Demo outfit" : looks[0]?.id === "jason-closet" ? "Your closet photo + two AI styling concepts" : "AI styling concepts · garment details and fit may vary"}</p>
      {looks.some((look) => look.status === "idle") && <PillButton className="mt-3" onClick={findMatches}>Create New Looks</PillButton>}
      <div>
      <div className="mt-screen" aria-label="Outfit moodboards">
        {looks.map((look, index) => <div key={look.id} className={cn(active.id !== look.id && "hidden")}><div className="relative">
          <PillButton variant="ghost" aria-label={`Select ${look.name} outfit`} aria-pressed={active.id === look.id} onClick={() => setSelectedConcept(index)} className={cn("relative block aspect-[3/4] h-auto overflow-hidden rounded-2xl p-0 ring-2 ring-offset-2 ring-offset-background active:scale-100", active.id === look.id ? "ring-primary" : "ring-transparent")}>
            {look.status === "success" && look.image ? <img src={look.image} alt={`${look.name}: model-worn outfit built around your piece, head to shoes`} width={768} height={1024} className="h-full w-full object-contain" /> : <div role="status" className="flex h-full flex-col items-center justify-center gap-4 bg-secondary px-8 text-center">{(look.status === "loading" || look.status === "idle") ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImageIcon className="h-8 w-8" />}<span className="font-serif text-2xl">{look.name}</span><span className="text-xs font-normal">{look.status === "idle" ? "Ready to create this look" : look.status === "loading" ? "Styling your garment…" : look.error || "Image not generated"}</span></div>}
          </PillButton>
          {/* Same shopping pins as Saved: tap + to find the piece in stores (Firecrawl). */}
          {look.status === "success" && look.image && active.id === look.id && <HotspotLayer products={look.items.filter((item) => !item.owned)} />}
          {look.status === "success" && look.image && (() => { const sid = `${look.id}:${look.image?.length}`; const saved = savedOutfits.some((outfit) => outfit.id === sid); return <button type="button" aria-label={saved ? `Unsave ${look.name} look` : `Save ${look.name} look`} aria-pressed={saved} onClick={() => { if (saved) deleteSavedOutfit(sid); else if (saveLook(look)) toast("Saved"); }} className="absolute right-0 top-0 flex min-h-touch min-w-touch items-center justify-center text-foreground transition-colors duration-200 ease-kodi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Heart className={cn("h-5 w-5", saved && "fill-current")} /></button>; })()}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">{look.id === "jason-closet" ? "From your closet · Your photo" : look.status === "success" ? "AI styling concept" : look.status === "loading" ? "Generating this look" : look.status === "idle" ? "Ready to generate" : "Generation failed · no demo fallback"}</p>
          {look.status === "failed" && <PillButton variant="outline" onClick={() => retryLook(index)} className="mt-3"><RefreshCw className="mr-2 h-4 w-4" />Retry This Look</PillButton>}
        </div>)}
      </div>
      <div id="selected-concept" role="tabpanel" aria-labelledby={`concept-${active.id}`} className="mt-screen">
        <h2 className="text-title">{active.name}</h2>
        <p className="mt-screen text-body-sm">{active.explanation}</p>
        {!active.demoSet && <p className="mt-2 text-xs text-muted-foreground">{active.tier === "safe" ? `Within your ${STYLE_TYPES[quizSkipped ? DEFAULT_CODE : styleType ?? DEFAULT_CODE].name}` : `${active.tier === "step" ? "One step" : "A bold move"} from your ${STYLE_TYPES[quizSkipped ? DEFAULT_CODE : styleType ?? DEFAULT_CODE].name}${active.shift ? `: ${active.shift}` : ""}`}</p>}
                
      </div>
      </div>
    </div>
  );
}
