import { useState } from "react";
import { cn } from "@/lib/utils";
/** fit="contain" shows the whole image inside the frame (letterboxed) instead of cropping it. */
export function Photo({ src, alt, className, fit = "cover" }: { src: string; alt: string; className?: string; fit?: "cover" | "contain" }) {
  const [err, setErr] = useState(false);
  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      {!err && <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover")} />}
    </div>
  );
}
