import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Photo } from "./Photo";
import { useServerFn } from "@tanstack/react-start";
import { findShoppingProducts } from "@/lib/shopping.functions";
import type { RealProduct, ShoppingInput } from "@/lib/shopping";
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
    </article>
  );
}

function priceLabel(price: number | null, currency: string | null = "USD") {
  return price !== null ? new Intl.NumberFormat("en-US", { style: "currency", currency: currency ?? "USD" }).format(price) : null;
}
type Lookup = RealProduct | "loading" | { error: string };

function HotspotImage({ imageUrl, products }: { imageUrl: string; products: ConceptItem[] }) {
  return (
    <div className="relative aspect-[3/4]">
      <Photo src={imageUrl} alt="Saved outfit" className="h-full w-full rounded-2xl [&_img]:object-contain" />
      <HotspotLayer products={products} />
    </div>
  );
}

/** "+" pins over an outfit image (absolute, fills its positioned parent). Tapping a pin looks the piece up
 *  in stores via Firecrawl and links to the store page. Used by Saved and by Results. */
export function HotspotLayer({ products }: { products: ConceptItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { countShopClick, stylePreference } = usePairly();
  const shopFn = useServerFn(findShoppingProducts);
  // shortcut: lookups live per mounted view, so reopening the outfit searches again (Firecrawl credits); move to the store if that matters.
  const [found, setFound] = useState<Record<string, Lookup>>({});
  const lookup = (product: ConceptItem) => {
    if (product.shopUrl || found[product.name]) return;
    setFound((f) => ({ ...f, [product.name]: "loading" }));
    shopFn({ data: { role: product.role as ShoppingInput["role"], description: product.name, preference: stylePreference ?? "menswear" } })
      .then((r) => setFound((f) => ({ ...f, [product.name]: r.status === "success" && r.products[0] ? r.products[0] : { error: r.error ?? "No store match for this piece yet." } })))
      .catch(() => setFound((f) => ({ ...f, [product.name]: { error: "Shopping connection interrupted." } })));
  };
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
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {placements.map(({ product, x, y }, index) => {
        const key = `${product.name}-${index}`;
        return (
          <div key={key} className="pointer-events-auto absolute" style={{ left: `${x}%`, top: `${y}%` }}>
            <button
              type="button"
              aria-label={`View ${product.name}`}
              aria-expanded={open === key}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(open === key ? null : key);
                if (open !== key) lookup(product);
              }}
              className="flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-foreground shadow-soft backdrop-blur-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4" />
            </button>
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
                {(() => {
                  const hit = found[product.name];
                  const real = hit && hit !== "loading" && !("error" in hit) ? hit : null;
                  const url = product.shopUrl ?? real?.url ?? null;
                  const image = real?.image ?? product.image;
                  const body = (
                    <>
                      <div className="flex gap-2">
                        {image && <Photo src={image} alt={real?.name ?? product.name} className="h-16 w-12 shrink-0 rounded-md" />}
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground">{real ? [real.brand, real.retailer].filter(Boolean).join(" · ") : product.brand ?? product.role}</p>
                          <p className="text-xs font-semibold">{real?.name ?? product.name}</p>
                          {priceLabel(real?.price ?? product.price, real?.currency) && <p className="mt-1 text-xs">{priceLabel(real?.price ?? product.price, real?.currency)}</p>}
                        </div>
                      </div>
                      {hit === "loading" && <p className="mt-2 text-[10px] text-muted-foreground">Finding it in stores…</p>}
                      {hit && hit !== "loading" && "error" in hit && <p className="mt-2 text-[10px] text-muted-foreground">{hit.error}</p>}
                      {url && <p className="mt-2 text-[10px] font-semibold underline underline-offset-4">View at {real?.retailer ?? "store"}</p>}
                    </>
                  );
                  return url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" onClick={countShopClick} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring">{body}</a>
                  ) : body;
                })()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
