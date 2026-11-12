import { useRef, useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "./BottomSheet";
import { Photo } from "./Photo";
import { PillButton } from "./PillButton";
import { SelectChip } from "./SelectChip";
import { StyleTypeChip } from "./StyleTypeChip";
import { OCCASIONS, SAMPLES, type Occasion } from "@/data/samples";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";

export function CreatePostSheet() {
  const { draft, openDraft, createPost, occasion: storeOccasion } = usePairly();
  const [image, setImage] = useState<string | null>(null);
  const [question, setQuestion] = useState("How does this look?");
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft) return;
    setImage(draft.image); setQuestion("How does this look?"); setOccasion(draft.pickImages ? storeOccasion : null);
  }, [draft]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => setImage(String(r.result)); r.readAsDataURL(f); };
  const post = () => { if (!image) return; createPost({ image, ...(draft?.pickImages ? { pickImages: draft.pickImages } : {}), question: question.trim() || "How does this look?", occasion }); toast("Posted"); };

  return (
    <BottomSheet open={!!draft} onClose={() => openDraft(null)} title="Get feedback">
      <div className="mt-2"><StyleTypeChip /></div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {image ? (
        <div className="mt-4 flex gap-2">
          <Photo src={image} alt="Your photo" className="h-40 flex-1 rounded-2xl" />
          {draft?.pickImages && (
            <div className="flex w-16 flex-col gap-2">{draft.pickImages.map((p) => <Photo key={p} src={p} alt="Pick" className="h-12 rounded-lg" />)}</div>
          )}
        </div>
      ) : (
        <button onClick={() => fileRef.current?.click()} className="mt-4 flex h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/25 text-sm text-muted-foreground">
          <ImageIcon className="mb-2 h-6 w-6" />Upload your outfit photo
        </button>
      )}
      {!draft?.pickImages && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {SAMPLES.map((s) => (
            <button key={s.id} onClick={() => setImage(s.image)} aria-label={s.name}>
              <Photo src={s.image} alt={s.name} className={cn("aspect-square rounded-xl ring-2", image === s.image ? "ring-primary" : "ring-transparent")} />
            </button>
          ))}
        </div>
      )}
      <label className="mt-5 block text-sm font-medium" htmlFor="q">Your question</label>
      <input id="q" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={80}
        className="mt-2 h-11 w-full rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-foreground" />
      <p className="mt-5 text-sm font-medium">Occasion <span className="font-normal text-muted-foreground">(optional)</span></p>
      <div className="mt-2 flex flex-wrap gap-2">
        {OCCASIONS.map((o) => <SelectChip key={o.id} active={occasion === o.id} onClick={() => setOccasion(occasion === o.id ? null : o.id)}>{o.label}</SelectChip>)}
      </div>
      <PillButton className="mt-6" disabled={!image} onClick={post}>Post</PillButton>
    </BottomSheet>
  );
}
