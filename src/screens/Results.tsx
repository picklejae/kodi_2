import { ChevronLeft, ImageIcon, RefreshCw, Loader2 } from "lucide-react";
import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { OCCASIONS } from "@/data/samples";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";

export function Results() {
  const { uploadedItem, occasion, note, go, selectedConcept, setSelectedConcept, generatedLooks, planning, generationError, retryLook, findMatches } = usePairly();
  if (!uploadedItem) return <div className="flex flex-1 items-center justify-center px-6"><PillButton onClick={() => go("upload")}>Pick a piece first</PillButton></div>;
  const looks = generatedLooks ?? [];
  const active = looks[selectedConcept] ?? looks[0];
  if (!active) return <div className="px-6 pb-12 pt-12"><PillButton variant="ghost" aria-label="Back to Style" onClick={() => go("upload")} className="h-9 w-9 px-0"><ChevronLeft className="h-5 w-5" /></PillButton><h1 className="mt-6 font-serif text-4xl">Style your piece</h1><div role="status" className="mt-8 flex aspect-[3/4] flex-col items-center justify-center gap-5 rounded-2xl bg-secondary p-6 text-center">{planning ? <><Loader2 className="h-8 w-8 animate-spin" /><p>Creating your three styling directions…</p></> : <><ImageIcon className="h-8 w-8" /><p>{generationError || "Ready to style your piece"}</p><PillButton onClick={findMatches}>{generationError ? "Try generation again" : "Create outfit moodboards"}</PillButton></>}</div></div>;
  const occasionLabel = OCCASIONS.find((entry) => entry.id === occasion)?.label;
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-12 lg:px-10">
      <div className="flex items-center gap-3">
        <PillButton variant="ghost" onClick={() => go("upload")} aria-label="Back to Style" className="h-9 w-9 shrink-0 px-0"><ChevronLeft className="h-5 w-5" /></PillButton>
        <Photo src={uploadedItem.image} alt={uploadedItem.name ?? "Your item"} className="h-12 w-12 shrink-0 rounded-xl" />
        <div><p className="text-[11px] text-muted-foreground">Your piece</p><p className="text-sm font-semibold capitalize">{uploadedItem.name ?? uploadedItem.category}</p></div>
      </div>
      <h1 className="mt-6 font-serif text-4xl leading-tight">Style your piece</h1>
      <div className="mt-3 flex flex-wrap gap-2">{occasionLabel && <Chip>{occasionLabel}</Chip>}{note.trim() && <Chip className="max-w-full whitespace-normal [overflow-wrap:anywhere]">{note.trim()}</Chip>}</div>
      <div role="tablist" aria-label="Styling directions" className="mt-5 flex gap-1 rounded-full border border-border bg-card p-1 lg:max-w-md">
        {looks.map((look, index) => <PillButton key={look.id} role="tab" id={`concept-${look.id}`} aria-controls="selected-concept" aria-selected={active.id === look.id} variant={active.id === look.id ? "primary" : "ghost"} onClick={() => setSelectedConcept(index)} className="h-10 min-w-0 flex-1 px-1 text-xs">{look.name}</PillButton>)}
      </div>
      <p className="mt-4 text-[10px] text-muted-foreground">AI styling concepts · garment details and fit may vary</p>
      <div className="mt-3 grid gap-4 lg:grid-cols-3" aria-label="Outfit moodboards">
        {looks.map((look, index) => <div key={look.id} className={cn(active.id !== look.id && "hidden lg:block")}>
          <PillButton variant="ghost" aria-label={`Select ${look.name} outfit`} aria-pressed={active.id === look.id} onClick={() => setSelectedConcept(index)} className={cn("relative block aspect-[3/4] h-auto overflow-hidden rounded-2xl p-0 ring-2 ring-offset-2 ring-offset-background active:scale-100", active.id === look.id ? "ring-primary" : "ring-transparent")}>
            {look.status === "success" && look.image ? <img src={look.image} alt={`${look.name}: model-worn outfit built around your piece, head to shoes`} width={768} height={1024} className="h-full w-full object-contain" /> : <div role="status" className="flex h-full flex-col items-center justify-center gap-4 bg-secondary px-8 text-center">{look.status === "loading" ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImageIcon className="h-8 w-8" />}<span className="font-serif text-2xl">{look.name}</span><span className="text-xs font-normal">{look.status === "loading" ? "Styling your garment…" : look.error || "Image not generated"}</span></div>}
          </PillButton>
          <p className="mt-3 text-[10px] text-muted-foreground">{look.status === "success" ? "AI styling concept" : look.status === "loading" ? "Generating this look" : "Generation failed · no demo fallback"}</p>
          {look.status === "failed" && <PillButton variant="outline" onClick={() => retryLook(index)} className="mt-3"><RefreshCw className="mr-2 h-4 w-4" />Retry this look</PillButton>}
          <p className="mt-3 hidden text-sm font-semibold lg:block">{look.name}</p>
        </div>)}
      </div>
      <div id="selected-concept" role="tabpanel" aria-labelledby={`concept-${active.id}`} className="mt-7">
        <h2 className="font-serif text-3xl">{active.name}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed">{active.explanation}</p>
        <div className="mt-5 flex flex-wrap gap-2"><PillButton variant="outline" disabled className="h-9 w-auto px-3 text-xs">More casual · Demo</PillButton><PillButton variant="outline" disabled className="h-9 w-auto px-3 text-xs">Lower budget · Demo</PillButton></div>
        <h2 className="mt-9 font-serif text-2xl">Recreate this look</h2>
        <p className="mt-1 text-xs text-muted-foreground">Demo pieces · prices and shopping links not connected</p>
        <div className="mt-4 divide-y divide-border">
          {active.items.map((item, index) => <article key={`${item.role}-${index}`} className="flex gap-4 py-4">
            {item.image ? <Photo src={item.image} alt={item.name} className="h-20 w-16 shrink-0 rounded-lg" /> : <div aria-label={`${item.role} image pending`} className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>}
            <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase text-muted-foreground">{item.role}{item.highlight ? " · Key addition" : ""}</p><h3 className="mt-1 text-sm font-semibold">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">{item.owned ? "Already yours · no purchase needed" : "Demo item · brand and price pending"}</p></div>
            {!item.owned && <div className="text-center"><PillButton variant="ghost" disabled aria-label={`Swap ${item.name} (demo, not connected)`} title="Swap this item · not connected" className="h-9 w-9 shrink-0 px-0"><RefreshCw className="h-4 w-4" /></PillButton><span className="text-[9px] text-muted-foreground">Demo swap</span></div>}
          </article>)}
        </div>
      </div>
    </div>
  );
}
