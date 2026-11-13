import { Sentences } from "@/components/pairly/Sentences";
import { useEffect, useRef } from "react";
import { Camera, ChevronLeft, ImageIcon, X } from "lucide-react";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { SelectChip } from "@/components/pairly/SelectChip";
import { StyleTypeChip } from "@/components/pairly/StyleTypeChip";
import { CATEGORIES, GENERIC_ATTRIBUTES, OCCASIONS, samplesFor, type ItemCategory } from "@/data/samples";
import { usePairly, type UploadedItem } from "@/store/PairlyContext";

export function Upload() {
  const { uploadedItem, setUploadedItem, occasion, setOccasion, note, setNote, go, findMatches, recordUpload, planning, generatedLooks, stylePreference, preferenceLoaded, setStylePreference } = usePairly();
  useEffect(() => { if (preferenceLoaded && !stylePreference) setStylePreference("menswear"); }, [preferenceLoaded, stylePreference, setStylePreference]);
  const libRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);


  const pick = (item: UploadedItem) => setUploadedItem(item);

  const onFile = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { const image = String(reader.result); recordUpload(image); pick({ image, category: "jacket", attributes: GENERIC_ATTRIBUTES.jacket, source: "upload" }); };
    reader.readAsDataURL(f);
  };

  const setCategory = (c: ItemCategory) =>
    uploadedItem && setUploadedItem({ ...uploadedItem, category: c, attributes: GENERIC_ATTRIBUTES[c] });

  return (
    <div className="flex flex-1 flex-col px-screen pb-8 pt-12 lg:grid lg:grid-cols-[11fr_9fr] lg:items-center lg:gap-screen">
      <div>
      <div className="flex items-center gap-2">
        <button onClick={() => go("reveal")} aria-label="Back" className="-ml-2 p-2"><ChevronLeft className="h-5 w-5" /></button>
        <StyleTypeChip />
      </div>
      <h1 className="mt-6 text-title font-bold">Style</h1>
      <p className="mt-2 text-sm text-muted-foreground">Snap one piece you already own.</p>

      <input ref={libRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      {!uploadedItem ? (
        <>
          <div className="mt-6 flex flex-col items-center rounded-3xl border-2 border-dashed border-foreground/25 bg-card/60 px-5 py-10 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground"><Sentences text="A jacket, coat, pants or shirt. Flat or on a hanger works best." /></p>
            <div className="mt-6 w-full space-y-3">
              <PillButton onClick={() => camRef.current?.click()}><Camera className="mr-2 h-4 w-4" />Take Photo</PillButton>
              <PillButton variant="outline" onClick={() => libRef.current?.click()}>Choose From Library</PillButton>
            </div>
          </div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Or try a sample</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {samplesFor(stylePreference).map((s) => (
              <button key={s.id} onClick={() => pick({ image: s.image, category: s.category, attributes: s.attributes, source: "sample", name: s.name })} className="text-left">
                <Photo src={s.image} alt={s.name} className="aspect-square rounded-2xl shadow-soft" />
                <p className="mt-1.5 text-[11px] font-medium leading-tight">{s.name}</p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 animate-in fade-in duration-300">
          <div className="relative">
            <Photo src={uploadedItem.image} alt={uploadedItem.name ?? "Your item"} className="h-64 rounded-3xl shadow-soft" />
            <button onClick={() => setUploadedItem(null)} aria-label="Remove photo" className="absolute right-3 top-3 rounded-full bg-card/90 p-1.5"><X className="h-4 w-4" /></button>
          </div>
            <div className="animate-in fade-in duration-300">
              {uploadedItem.source === "upload" ? (
                <div className="mt-5">
                  <p className="text-xs text-muted-foreground">Which piece should we style?</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => <SelectChip key={c} active={uploadedItem.category === c} onClick={() => setCategory(c)}><span className="capitalize">{c}</span></SelectChip>)}
                  </div>
                </div>
              ) : null}
              <p className="mt-6 text-sm font-medium">Where are you wearing it? <span className="text-muted-foreground font-normal">(optional)</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {OCCASIONS.map((o) => <SelectChip key={o.id} active={occasion === o.id} onClick={() => setOccasion(occasion === o.id ? null : o.id)}>{o.label}</SelectChip>)}
              </div>
              <label htmlFor="outfit-note" className="mt-5 block text-sm font-medium">Anything else? A place or a vibe.</label>
              <input id="outfit-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gallery curator in the fall in Paris"
                className="mt-2 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-foreground" />
            </div>
        </div>
      )}

      </div>
      <div className="mt-auto pt-8 lg:mt-0">
        <PillButton disabled={!uploadedItem || !stylePreference} onClick={findMatches}>{planning || generatedLooks?.some((look) => look.status === "loading") ? "View Generating Looks" : <>Kodi <span className="text-brand-orange">Me</span></>}</PillButton>
      </div>
    </div>
  );
}
