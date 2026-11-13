import { useState } from "react";
import { ExternalLink, ImageIcon, Loader2, RefreshCw } from "lucide-react";
import { PillButton } from "./PillButton";
import { Photo } from "./Photo";
import { usePairly } from "@/store/PairlyContext";
import { initialShoppingItems, MAX_ATTEMPTS, shoppingKey, type RealProduct } from "@/lib/shopping";
import type { GeneratedLook } from "@/lib/styleGeneration";

function Product({ product }: { product: RealProduct }) {
  const { countShopClick } = usePairly();
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="flex gap-4 py-4">
    {product.image && !imageFailed ? <img src={product.image} alt={product.name} onError={() => setImageFailed(true)} className="h-28 w-20 shrink-0 rounded-lg bg-secondary object-contain" /> : <div aria-label="Product photo unavailable" className="flex h-28 w-20 shrink-0 flex-col items-center justify-center gap-2 rounded-lg bg-secondary"><ImageIcon className="h-5 w-5 text-muted-foreground" /><span className="text-center text-[10px] text-muted-foreground">Photo unavailable</span></div>}
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{[product.brand, product.retailer].filter(Boolean).join(" · ")}</p>
      <h4 className="mt-1 text-sm font-semibold">{product.name}</h4>
      <p className="mt-1 text-sm">{product.price !== null && product.currency ? new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency }).format(product.price) : "Check price at retailer"}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{product.explanation}</p>
      <a href={product.url} target="_blank" rel="noopener noreferrer" onClick={countShopClick} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4">View at {product.retailer}<ExternalLink className="h-3 w-3" /></a>
      <p className="mt-2 text-[10px] text-muted-foreground">Retrieved {new Date(product.retrievedAt).toLocaleDateString()} · check price and availability at retailer</p>
    </div>
  </article>;
}
export function ShoppingSection({ look }: { look: GeneratedLook }) {
  const { shopping, searchShopping } = usePairly();
  const [alternatives, setAlternatives] = useState<Record<string, boolean>>({});
  const initial = initialShoppingItems(look.items);
  const loading = initial.some((item) => shopping?.[shoppingKey(look, item)]?.status === "loading");
  const started = initial.every((item) => Boolean(shopping?.[shoppingKey(look, item)]));
  return <section aria-label="Shopping matches">
    <h2 className="mt-9 font-serif text-2xl">Recreate this look</h2>
    <p className="mt-1 text-xs text-muted-foreground">Similar items to recreate this look · not necessarily the exact pieces pictured</p>
    {!started && <PillButton disabled={loading} onClick={() => initial.forEach((item) => searchShopping(look, item))} className="mt-4 gap-2">{loading && <Loader2 className="h-4 w-4 animate-spin" />}Find items for this look</PillButton>}
    <div className="mt-4 divide-y divide-border">
      {look.items.map((item, index) => {
        const key = shoppingKey(look, item), record = shopping?.[key];
        if (item.owned) return <article key={key} className="flex gap-4 py-4"><Photo src={item.image ?? ""} alt={item.name} className="h-20 w-16 shrink-0 rounded-lg" /><div><p className="text-[10px] font-semibold uppercase text-muted-foreground">Your piece — Already yours</p><h3 className="mt-1 text-sm font-semibold">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">No purchase needed</p></div></article>;
        return <div key={`${key}-${index}`} className="py-4">
          <h3 className="text-sm font-semibold">{item.name}</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase text-muted-foreground">{item.role}{item.highlight ? " · Key addition" : ""}</p>
          {!record && <PillButton variant="outline" onClick={() => searchShopping(look, item)} className="mt-3 h-9 w-auto px-4 text-xs">Find similar items</PillButton>}
          {record?.status === "loading" && <p role="status" className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Finding matching products…</p>}
          {record && ["error", "no-match"].includes(record.status) && <div role="status" className="mt-3"><p className="text-xs text-muted-foreground">{record.status === "no-match" ? "No suitable product pages found for this piece." : record.error}</p>{record.attempts < MAX_ATTEMPTS ? <PillButton variant="outline" onClick={() => searchShopping(look, item)} className="mt-3 h-9 w-auto gap-2 px-4 text-xs"><RefreshCw className="h-3 w-3" />Retry search</PillButton> : <p className="mt-2 text-xs text-muted-foreground">Search attempt limit reached for this piece.</p>}</div>}
          {record?.status === "success" && <>
            {(alternatives[key] ? record.products : record.products.slice(0, 1)).map((p) => <Product key={p.url} product={p} />)}
            {record.products.length > 1 && <PillButton variant="ghost" onClick={() => setAlternatives((s) => ({ ...s, [key]: !s[key] }))} className="h-9 w-auto px-0 text-xs underline underline-offset-4">{alternatives[key] ? "Hide alternatives" : "See alternatives"}</PillButton>}
          </>}
          {record && record.status !== "loading" && <p className="mt-2 text-[10px] text-muted-foreground">{record.usage.complete ? "Search usage" : "Reported usage (partial)"}: {record.usage.credits} Firecrawl credits ≈ {(record.usage.credits * 0.004).toFixed(3)} Lovable credits ({(record.usage.credits * 0.002).toFixed(3)} on Business)</p>}
        </div>;
      })}
    </div>
  </section>;
}