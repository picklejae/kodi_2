import { AXIS_LABELS, STYLE_TYPES, type Axis, type StyleTypeCode } from "@/data/styleTypes";

const AXES: Axis[] = ["fit", "color", "detail", "mood"];
export function StyleScales({ type, scores }: { type: StyleTypeCode; scores: number[] | null }) {
  return <div className="mt-6 space-y-4">{AXES.map((axis, idx) => {
    const [left, right] = AXIS_LABELS[axis];
    const score = scores?.[idx] ?? (STYLE_TYPES[type].code.charAt(idx) === left.charAt(0) ? 0.25 : 0.75);
    return <div key={axis} className="text-xs">
      <div className="mb-2 flex justify-between text-muted-foreground"><span>{left}</span><span>{right}</span></div>
      <div role="meter" aria-label={`${left} to ${right}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(score * 100)} className="relative h-1.5 rounded-full bg-border">
        <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-background" style={{ left: `${5 + score * 90}%` }} />
      </div>
    </div>;
  })}</div>;
}