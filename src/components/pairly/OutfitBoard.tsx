import { Photo } from "./Photo";
import type { CatalogItem } from "@/data/catalog";

export function OutfitBoard({ itemImage, items }: { itemImage: string; items: [CatalogItem, CatalogItem] }) {
  return <div aria-label="Outfit board" className="grid aspect-[9/8] grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-2xl bg-secondary p-3">
    <div className="relative row-span-2 min-h-0 overflow-hidden rounded-lg">
      <Photo src={itemImage} alt="Your piece" className="h-full w-full" />
      <span className="absolute bottom-2 left-2 rounded-full bg-card/90 px-2 py-1 text-[10px] font-semibold">Your piece</span>
    </div>
    {items.map((item) => <Photo key={item.id} src={item.image} alt={item.name} className="h-full min-h-0 rounded-lg" />)}
  </div>;
}