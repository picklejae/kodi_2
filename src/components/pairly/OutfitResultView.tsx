import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Photo } from "./Photo";
import { PillButton } from "./PillButton";
import type { ConceptItem } from "@/data/moodboards";
import { hotspotPlacements } from "@/lib/saved";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";

/** Shared saved-outfit view: the AI model-worn image with category hotspots plus its products. */
export function OutfitResultView({
  lookName,
  explanation,
  imageUrl,
  products,
}: {
  lookName: string;
  explanation: string;
  imageUrl: string;
  products: ConceptItem[];
}) {
  return (
    <article aria-label={`${lookName} look`} className="rounded-3xl bg-card p-4 shadow-soft">
      <HotspotImage imageUrl={imageUrl} products={products} />
      <h2 className="mt-4 font-serif text-2xl">{lookName}</h2>
      <p className="mt-2 text-sm leading-relaxed">{explanation}</p>
      <div className="mt-4 divide-y divide-border">
        {products.map((product, index) => (
          <ProductRow key={`${product.name}-${index}`} product={product} />
        ))}
      </div>
    </article>
  );
}

function priceLabel(product: ConceptItem) {
  return product.price !== null ? `$${product.price}` : null;
}

function HotspotImage({ imageUrl, products }: { imageUrl: string; products: ConceptItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { countShopClick } = usePairly();
  const placements = hotspotPlacements(products);
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
      <Photo src={imageUrl} alt="Saved outfit" className="h-full w-full rounded-2xl [&_img]:object-contain" />
      {placements.map(({ product, x, y }, index) => {
        const key = `${product.name}-${index}`;
        return (
          <div key={key} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
            <PillButton
              aria-label={`View ${product.name}`}
              aria-expanded={open === key}
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(open === key ? null : key);
              }}
              className="hotspot h-7 w-7 -translate-x-1/2 -translate-y-1/2 px-0"
            >
              <Plus className="h-4 w-4" />
            </PillButton>
            {open === key && (
              <div
                role="dialog"
                aria-label={product.name}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "absolute z-20 w-52 rounded-lg border border-border bg-popover p-3 shadow-soft",
                  x > 50 ? "right-0" : "left-0",
                  y > 55 ? "bottom-10" : "top-5",
                )}
              >
                <div className="flex gap-2">
                  {product.image && (
                    <Photo
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-12 shrink-0 rounded-md"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">{product.brand ?? product.role}</p>
                    <p className="text-xs font-semibold">{product.name}</p>
                    {priceLabel(product) && <p className="mt-1 text-xs">{priceLabel(product)}</p>}
                  </div>
                </div>
                {product.shopUrl && (
                  <PillButton
                    className="mt-3 h-8"
                    onClick={() => {
                      countShopClick();
                      window.open(product.shopUrl ?? undefined, "_blank", "noopener,noreferrer");
                    }}
                  >
                    Shop
                  </PillButton>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductRow({ product }: { product: ConceptItem }) {
  const { countShopClick } = usePairly();
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      {product.image && <Photo src={product.image} alt={product.name} className="h-28 w-20 shrink-0 rounded-lg" />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase text-muted-foreground">
          {product.owned ? "Your piece — Already yours" : product.role}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug">{product.name}</h3>
        {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
        {priceLabel(product) && <p className="mt-1 text-sm font-semibold">{priceLabel(product)}</p>}
        {product.shopUrl && (
          <PillButton
            variant="outline"
            className="mt-2 h-9"
            onClick={() => {
              countShopClick();
              window.open(product.shopUrl ?? undefined, "_blank", "noopener,noreferrer");
            }}
          >
            Shop
          </PillButton>
        )}
      </div>
    </div>
  );
}
