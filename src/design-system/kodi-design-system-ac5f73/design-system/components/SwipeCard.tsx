import * as React from "react";
import { cn } from "../utils";

export interface SwipeCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag"> {
  src: string;
  alt: string;
  onSwipe?: (direction: "yes" | "no") => void;
}
/** Draggable 3:4 photo. YES/NO stamps show only while dragging; commits past 25% width. Arrow keys also work. */
export const SwipeCard = React.forwardRef<HTMLDivElement, SwipeCardProps>(({ className, src, alt, onSwipe, ...props }, ref) => {
  const [dx, setDx] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const start = React.useRef(0);
  const width = React.useRef(1);

  const finish = (x: number) => {
    setDragging(false);
    if (Math.abs(x) > width.current * 0.25) {
      const dir = x > 0 ? "yes" : "no";
      setDx(x > 0 ? width.current * 1.5 : -width.current * 1.5);
      window.setTimeout(() => { setDx(0); onSwipe?.(dir); }, 260);
    } else setDx(0);
  };

  return (
    <div
      ref={ref}
      role="group"
      tabIndex={0}
      aria-label={`${alt}. Press right arrow for yes, left arrow for no.`}
      onKeyDown={(e) => { if (e.key === "ArrowRight") onSwipe?.("yes"); if (e.key === "ArrowLeft") onSwipe?.("no"); }}
      onPointerDown={(e) => { width.current = e.currentTarget.offsetWidth; start.current = e.clientX; setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => dragging && setDx(e.clientX - start.current)}
      onPointerUp={(e) => dragging && finish(e.clientX - start.current)}
      onPointerCancel={() => { setDragging(false); setDx(0); }}
      style={{ transform: `translateX(${dx}px) rotate(${dx / 30}deg)`, transition: dragging ? "none" : "transform 260ms var(--ease-kodi)" }}
      className={cn("relative mx-auto aspect-[3/4] w-full max-w-swipe touch-none select-none overflow-hidden bg-secondary outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring cursor-grab active:cursor-grabbing", className)}
      {...props}
    >
      <img src={src} alt="" className="size-full object-cover" draggable={false} />
      {dx > 8 && <span className="absolute right-4 top-4 border-2 border-inverse bg-background px-3 py-1 text-subheading font-bold text-foreground">YES</span>}
      {dx < -8 && <span className="absolute left-4 top-4 border-2 border-inverse bg-background px-3 py-1 text-subheading font-bold text-foreground">NO</span>}
    </div>
  );
});
SwipeCard.displayName = "SwipeCard";
