import { useEffect, useState } from "react";
import { AXIS_LABELS, STYLE_TYPES, type Axis, type StyleTypeCode } from "@/data/styleTypes";

const AXES: Axis[] = ["fit", "color", "detail", "mood"];
/** `reveal` (Reveal screen only): dots start centred and glide to their scores one after another. */
export function StyleScales({ type, scores, reveal = false, revealDelay = 0 }: { type: StyleTypeCode; scores: number[] | null; reveal?: boolean; revealDelay?: number }) {
  const [settled, setSettled] = useState(!reveal);
  useEffect(() => {
    if (!reveal) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSettled(true); return; }
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setSettled(true)));
    return () => cancelAnimationFrame(frame);
  }, [reveal]);
  return <div className="mt-6 grid grid-cols-2 gap-x-screen gap-y-4">{AXES.map((axis, idx) => {
    const [left, right] = AXIS_LABELS[axis];
    const score = scores?.[idx] ?? (STYLE_TYPES[type].code.charAt(idx) === left.charAt(0) ? 0.25 : 0.75);
    return <div key={axis} className={reveal ? "reveal-rise text-xs" : "text-xs"} style={reveal ? { ["--d" as string]: `${revealDelay + idx * 70}ms` } : undefined}>
      <div className="mb-2 flex justify-between text-muted-foreground"><span>{left}</span><span>{right}</span></div>
      <div role="meter" aria-label={`${left} to ${right}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(score * 100)} className="relative h-1.5 rounded-full bg-border">
        <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-background" style={{ left: `${5 + (settled ? score : 0.5) * 90}%`, transition: reveal ? `left 900ms cubic-bezier(0.22, 1, 0.36, 1) ${revealDelay + 250 + idx * 110}ms` : undefined }} />
      </div>
    </div>;
  })}</div>;
}