import { useState } from "react";
import { cn } from "@/lib/utils";
export function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      {!err && <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className="h-full w-full object-cover" />}
    </div>
  );
}
