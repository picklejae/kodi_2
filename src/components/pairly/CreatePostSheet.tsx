import { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/design-system/kodi-design-system-ac5f73";
import { toast } from "sonner";
import { Sheet } from "./Sheet";
import { Photo } from "./Photo";
import { PillButton } from "./PillButton";
import { SelectChip } from "./SelectChip";
import { OCCASIONS, type Occasion } from "@/data/samples";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";
import { OutfitBoard } from "./OutfitBoard";

export function CreatePostSheet() {
  const { draft, openDraft, createPost, occasion: storeOccasion, recordUpload, recentItems } = usePairly();
  const [image, setImage] = useState<string | null>(null);
  const [question, setQuestion] = useState("How does this look?");
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft) return;
    setImage(draft.image); setQuestion("How does this look?"); setOccasion(draft.pickImages ? storeOccasion : null);
  }, [draft]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => { const image = String(r.result); setImage(image); recordUpload(image); }; r.readAsDataURL(f); };
  const post = () => { if (!image) return; createPost({ image, ...(draft?.pickImages ? { pickImages: draft.pickImages } : {}), question: question.trim() || "How does this look?", occasion }); toast("Posted"); };

  return (
    <Sheet open={!!draft} onClose={() => openDraft(null)} title="Get feedback">
      <h2 className="text-heading">Get feedback</h2>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {draft?.look && draft.ownedImage ? (
        <div className="mt-4"><OutfitBoard itemImage={draft.ownedImage} items={draft.look.items} /><p className="mt-3 text-sm">{draft.look.reason}</p></div>
      ) : image ? (
        <div className="mt-4 flex gap-2">
          <Photo src={image} alt="Your photo" className="h-40 flex-1 rounded-2xl" />
          {draft?.pickImages && (
            <div className="flex w-16 flex-col gap-2">{draft.pickImages.map((p) => <Photo key={p} src={p} alt="Pick" className="h-12 rounded-lg" />)}</div>
          )}
        </div>
      ) : (
        // Same two buttons as the Style upload box.
        <div className="mt-4 space-y-2">
          <Button fullWidth className="h-[47px] text-body-sm" onClick={() => camRef.current?.click()}><Camera className="h-4 w-4" />Upload Photo</Button>
          <Button fullWidth variant="secondary" className="h-[43px]" onClick={() => fileRef.current?.click()}>Choose From Library</Button>
        </div>
      )}
      {!draft?.pickImages && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {recentItems.map((r) => (
            <button key={r.id} type="button" onClick={() => setImage(r.imageUrl)} aria-label={r.productName}>
              <Photo src={r.imageUrl} alt={r.productName} className={cn("aspect-square w-full rounded-xl ring-2", image === r.imageUrl ? "ring-primary" : "ring-transparent")} />
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
    </Sheet>
  );
}
