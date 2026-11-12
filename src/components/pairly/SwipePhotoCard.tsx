import { useRef, useState, type ReactNode } from "react";
import { Photo } from "./Photo";
import { cn } from "@/lib/utils";

// Shared by the outfit quiz and Social; right is positive, left is negative.
export function SwipePhotoCard({ image, alt, top, onSwipe, positiveStamp, negativeStamp, children }: {
  image: string; alt: string; top: boolean; onSwipe: (positive: boolean) => void;
  positiveStamp: ReactNode; negativeStamp: ReactNode; children?: ReactNode;
}) {
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const start = useRef<number | null>(null);
  const end = (x: number) => {
    if (start.current === null) return;
    const distance = x - start.current;
    start.current = null;
    setDrag(false);
    setDx(0);
    if (Math.abs(distance) > 100) onSwipe(distance > 0);
  };
  return (
    <div
      onPointerDown={(e) => { if (!top) return; start.current = e.clientX; setDrag(true); e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (start.current !== null) setDx(e.clientX - start.current); }}
      onPointerUp={(e) => end(e.clientX)}
      onPointerCancel={() => { start.current = null; setDrag(false); setDx(0); }}
      className={cn("absolute inset-0 touch-pan-y select-none overflow-hidden rounded-3xl bg-card shadow-soft", !drag && "motion-safe:transition-transform motion-safe:duration-300", !top && "scale-95 opacity-70")}
      style={top ? { transform: `translateX(${dx}px) rotate(${dx / 15}deg)` } : undefined}
    >
      <Photo src={image} alt={alt} className="pointer-events-none h-full w-full" />
      {children}
      {top && <>
        <div className="absolute left-5 top-5 -rotate-12 rounded-xl border-4 border-background bg-primary px-3 py-1 text-2xl text-primary-foreground" style={{ opacity: Math.min(1, Math.max(0, dx / 100)) }}>{positiveStamp}</div>
        <div className="absolute right-5 top-5 rotate-12 rounded-xl border-4 border-background bg-destructive px-3 py-1 text-2xl text-destructive-foreground" style={{ opacity: Math.min(1, Math.max(0, -dx / 100)) }}>{negativeStamp}</div>
      </>}
    </div>
  );
}