import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { CATALOG } from "@/data/catalog";
import { usePairly } from "@/store/PairlyContext";

export function Saved() {
  const { savedItems, setTab } = usePairly();
  const items = CATALOG.filter((c) => savedItems.includes(c.id));
  return (
    <div className="px-6 pt-12">
      <h1 className="font-serif text-4xl">Saved</h1>
      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">Tap the heart on a pick to save it here.</p>
          <PillButton variant="outline" className="mt-6" onClick={() => setTab("match")}>Find matches</PillButton>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {items.map((i) => (
            <a key={i.id} href={i.buyUrl} target="_blank" rel="noopener noreferrer">
              <Photo src={i.image} alt={i.name} className="aspect-[4/5] rounded-2xl shadow-soft" />
              <p className="mt-2 text-sm font-medium leading-snug">{i.name}</p>
              <p className="text-xs text-muted-foreground">{i.brand} · ${i.price}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
