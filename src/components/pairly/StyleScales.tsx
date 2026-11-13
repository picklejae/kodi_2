import { useEffect, useState } from "react";
import { AXIS_LABELS, STYLE_TYPES, type Axis, type StyleTypeCode } from "@/data/styleTypes";

const AXES: Axis[] = ["fit", "color", "detail", "mood"];
/** `reveal` (Reveal screen only): dots start centred and glide to their scores one after another. `unknown`: quiz skipped, centred "?" markers. */
export function StyleScales({ type, scores, reveal = false, revealDelay = 0, unknown = false }: { type: StyleTypeCode; scores: number[] | null; reveal?: boolean; revealDelay?: number; unknown?: boolean }) {
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
      <div role="meter" aria-label={`${left} to ${right}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={unknown ? undefined : Math.round(score * 100)} aria-valuetext={unknown ? "Not set yet" : undefined} className="relative h-1.5 rounded-full bg-border">
        {unknown ? <span className="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background" aria-hidden="true">?</span> : <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-background" style={{ left: `${5 + (settled ? score : 0.5) * 90}%`, transition: reveal ? `left 900ms cubic-bezier(0.22, 1, 0.36, 1) ${revealDelay + 250 + idx * 110}ms` : undefined }} />}
      </div>
    </div>;
  })}</div>;
}