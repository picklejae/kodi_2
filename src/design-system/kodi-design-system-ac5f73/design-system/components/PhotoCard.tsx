import * as React from "react";
import { cn } from "../utils";

export interface PhotoCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src?: string;
  alt: string;
  /** `look` = 3:4 model-worn outfit, `item` = 1:1 single garment. */
  ratio?: "look" | "item";
  label?: React.ReactNode;
  selected?: boolean;
  loading?: boolean;
}
/** Photo tile: radius 0, Stone behind the image, no borders or filters. */
export const PhotoCard = React.forwardRef<HTMLButtonElement, PhotoCardProps>(
  ({ className, src, alt, ratio = "look", label, selected = false, loading = false, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} aria-pressed={props.onClick ? selected : undefined} className={cn("group block w-full text-left outline-none", className)} {...props}>
      <div className={cn("relative w-full overflow-hidden bg-secondary transition-opacity duration-200 ease-kodi group-active:opacity-90 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring",
        ratio === "look" ? "aspect-[3/4]" : "aspect-square", selected && "outline-2 outline-border-strong")}>
        {!loading && src && <img src={src} alt={alt} className="size-full object-cover" draggable={false} />}
        {loading && <span className="absolute inset-0 animate-pulse bg-secondary" aria-label="Loading photo" />}
      </div>
      {label && <div className="mt-2 text-body-sm text-foreground">{label}</div>}
    </button>
  ),
);
PhotoCard.displayName = "PhotoCard";
