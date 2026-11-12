import { toast } from "sonner";
import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { AXIS_LABELS, DEFAULT_CODE, STYLE_TYPES, type Axis } from "@/data/styleTypes";
import { usePairly } from "@/store/PairlyContext";

const AXES: Axis[] = ["fit", "color", "detail", "mood"];

export function Reveal() {
  const { styleType, retake } = usePairly();
  const t = STYLE_TYPES[styleType ?? DEFAULT_CODE];
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14 animate-in fade-in duration-500">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your Style Type</p>
      <h1 className="mt-3 font-serif text-6xl tracking-wide">{t.code}</h1>
      <p className="mt-1 font-serif text-2xl italic">{t.name}</p>
      <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{t.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
      <div className="mt-6 space-y-2 rounded-3xl bg-card p-4 shadow-soft">
        {AXES.map((a, idx) => {
          const [left, right] = AXIS_LABELS[a];
          const isLeft = t.code[idx] === left[0];
          return (
            <div key={a} className="flex items-center justify-between text-xs">
              <span className={isLeft ? "font-semibold" : "text-muted-foreground"}>{left}</span>
              <div className="mx-3 flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={`h-full w-1/2 rounded-full bg-primary ${isLeft ? "" : "ml-auto"}`} />
              </div>
              <span className={!isLeft ? "font-semibold" : "text-muted-foreground"}>{right}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {t.looks.map((l, i) => <Photo key={i} src={l} alt={`${t.name} look ${i + 1}`} className="h-36 rounded-2xl" />)}
      </div>
      <div className="mt-auto space-y-3 pt-8">
        <PillButton onClick={() => toast("Coming soon")}>Find matches</PillButton>
        <PillButton variant="outline" onClick={retake}>Retake</PillButton>
      </div>
    </div>
  );
}
