import * as React from "react";
import { cn } from "../utils";
import { TextLink } from "./TextLink";

export interface ProductRowProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  brand: string;
  name: string;
  /** Formatted price from real data. Never invented. */
  price: string;
  href: string;
}
/** 88px shop row: 72x88 image, brand / name / price, View link. */
export const ProductRow = React.forwardRef<HTMLDivElement, ProductRowProps>(({ className, image, brand, name, price, href, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-[88px] items-center gap-4 transition-colors duration-200 ease-kodi active:bg-secondary", className)} {...props}>
    <div className="h-[88px] w-[72px] shrink-0 bg-secondary"><img src={image} alt={name} className="size-full object-cover" /></div>
    <div className="min-w-0 flex-1">
      <p className="text-label uppercase tracking-label text-muted-foreground">{brand}</p>
      <p className="truncate text-body-sm text-foreground">{name}</p>
      <p className="text-price text-muted-foreground">{price}</p>
    </div>
    <TextLink href={href} target="_blank" rel="noreferrer">View</TextLink>
  </div>
));
ProductRow.displayName = "ProductRow";
