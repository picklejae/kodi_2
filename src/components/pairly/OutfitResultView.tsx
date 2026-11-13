import { useEffect, useRef, useState, type ReactNode } from "react";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Chip } from "./Chip";
import { Photo } from "./Photo";
import { OutfitBoard } from "./OutfitBoard";
import { PillButton } from "./PillButton";
import { BOLDNESS_LABEL, type CatalogItem } from "@/data/catalog";
import type { SavedProduct } from "@/data/saved";
import type { Pick } from "@/lib/matching";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";
export function OutfitResultView({
  pick,
  itemImage,
  highlighted = false,
  showTierTabs = true,
  tierTabs,
  imageUrl,
  products,
}: {
  pick: Pick;
  itemImage: string;
  highlighted?: boolean;
  showTierTabs?: boolean;
  tierTabs?: ReactNode;
  imageUrl?: string;
  products?: SavedProduct[];
}) {
  return (
    <>
      {showTierTabs && tierTabs}
      <article
        aria-label={`${BOLDNESS_LABEL[pick.boldness]} look`}
        className={cn(
          "rounded-3xl bg-card p-4 shadow-soft ring-2 transition",
          highlighted ? "ring-primary" : "ring-transparent",
        )}
      >
        {imageUrl ? (
          <HotspotImage imageUrl={imageUrl} products={products ?? []} />
        ) : (
          <OutfitBoard itemImage={itemImage} items={pick.items} />
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold">
            {BOLDNESS_LABEL[pick.boldness]}
          </span>
          {showTierTabs && pick.boldness === "step" && (
            <Chip className="px-2 text-[10px]">Recommended for you</Chip>
          )}
        </div>
        <p className="mt-3 text-sm">
          <span className="font-semibold">Why it works: </span>
          {pick.reason}
        </p>
        <div className="mt-4 divide-y divide-border">
          {pick.items.map((item) => (
            <PickRow key={item.id} item={item} />
          ))}
        </div>
      </article>
    </>
  );
}
function HotspotImage({ imageUrl, products }: { imageUrl: string; products: SavedProduct[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { countShopClick } = usePairly();
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <div ref={ref} className="relative aspect-[3/4]" onClick={() => setOpen(null)}>
      <Photo src={imageUrl} alt="Saved outfit" className="h-full w-full rounded-2xl" />
      {products
        .filter((p) => !p.isOwned)
        .map((p) => (
          <div key={p.id} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <PillButton
              aria-label={`View ${p.name}`}
              aria-expanded={open === p.id}
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(open === p.id ? null : p.id);
              }}
              className="hotspot h-7 w-7 -translate-x-1/2 -translate-y-1/2 px-0"
            >
              <Plus className="h-4 w-4" />
            </PillButton>
            {open === p.id && (
              <div
                role="dialog"
                aria-label={p.name}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "absolute z-20 w-52 rounded-lg border border-border bg-popover p-3 shadow-soft",
                  p.x > 50 ? "right-0" : "left-0",
                  p.y > 55 ? "bottom-10" : "top-5",
                )}
              >
                <div className="flex gap-2">
                  <Photo
                    src={p.thumbnailUrl}
                    alt={p.name}
                    className="h-16 w-12 shrink-0 rounded-md"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                    <p className="text-xs font-semibold">{p.name}</p>
                    <p className="mt-1 text-xs">{p.price}</p>
                  </div>
                </div>
                <PillButton
                  className="mt-3 h-8"
                  onClick={() => {
                    countShopClick();
                    window.open(p.shopUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  Shop
                </PillButton>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
function PickRow({ item }: { item: CatalogItem }) {
  const { savedItems, toggleSave, countShopClick } = usePairly();
  const saved = savedItems.includes(item.id);
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <Photo src={item.image} alt={item.name} className="h-28 w-20 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1">
          <h3 className="flex-1 font-serif text-lg leading-snug">{item.name}</h3>
          <PillButton
            variant="ghost"
            aria-label={saved ? "Unsave" : "Save"}
            aria-pressed={saved}
            onClick={() => {
              if (toggleSave(item.id)) toast("Saved");
            }}
            className="h-8 w-8 shrink-0 px-0"
          >
            <Heart className={cn("h-4 w-4", saved && "fill-foreground")} />
          </PillButton>
        </div>
        <p className="text-xs text-muted-foreground">{item.brand}</p>
        <p className="mt-1 text-sm font-semibold">${item.price}</p>
        <PillButton
          variant="outline"
          className="mt-2 h-9"
          onClick={() => {
            countShopClick();
            window.open(item.buyUrl, "_blank", "noopener,noreferrer");
          }}
        >
          Shop
        </PillButton>
      </div>
    </div>
  );
}
