import { Chip } from "@/components/pairly/Chip";
import { PillButton } from "@/components/pairly/PillButton";
import { AXIS_LABELS, DEFAULT_CODE, STYLE_TYPES, type Axis } from "@/data/styleTypes";
import { usePairly } from "@/store/PairlyContext";

const AXES: Axis[] = ["fit", "color", "detail", "mood"];

export function Me() {
  const { styleType, retake } = usePairly();
  const t = STYLE_TYPES[styleType ?? DEFAULT_CODE];
  return (
    <div className="px-6 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your Style Type</p>
      <h1 className="mt-3 font-serif text-5xl tracking-wide">{t.code}</h1>
      <p className="mt-1 font-serif text-2xl italic">{t.name}</p>
      <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{t.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
      <div className="mt-6 space-y-2 rounded-3xl bg-card p-4 shadow-soft">
        {AXES.map((a, i) => {
          const [l, r] = AXIS_LABELS[a]; const left = t.code[i] === l[0];
          return <div key={a} className="flex justify-between text-xs"><span className={left ? "font-semibold" : "text-muted-foreground"}>{l}</span><span className={!left ? "font-semibold" : "text-muted-foreground"}>{r}</span></div>;
        })}
      </div>
      <PillButton variant="outline" className="mt-8" onClick={retake}>Retake</PillButton>
    </div>
  );
}
