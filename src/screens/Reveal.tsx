import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { AXIS_LABELS, DEFAULT_CODE, STYLE_TYPES, type Axis } from "@/data/styleTypes";
import { usePairly } from "@/store/PairlyContext";
import { stylePresentation } from "@/lib/stylePresentation";

const AXES: Axis[] = ["fit", "color", "detail", "mood"];

export function Reveal() {
  const { styleType, axisScores, quizSkipped, retake, go } = usePairly();
  const t = STYLE_TYPES[styleType ?? DEFAULT_CODE];
  const { line, pieces } = stylePresentation(t.code);
  return (
    <div className="flex flex-1 flex-col px-screen pb-8 pt-14 animate-in fade-in duration-500 lg:grid lg:grid-cols-[11fr_9fr] lg:items-center lg:gap-screen">
      <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your Style Type</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight">You're {/^[AEIOU]/i.test(t.name) ? "an" : "a"} {t.name}</h1>
      {quizSkipped && <p className="mt-3 text-sm text-muted-foreground">Not sure yet? Here's a classic starting point.</p>}
      <div className="mt-6 space-y-4">
        {AXES.map((a, idx) => {
          const [left, right] = AXIS_LABELS[a];
          const score = axisScores?.[idx] ?? (t.code.charAt(idx) === left.charAt(0) ? 0.25 : 0.75);
          return (
            <div key={a} className="text-xs">
              <div className="mb-2 flex justify-between text-muted-foreground"><span>{left}</span><span>{right}</span></div>
              <div role="meter" aria-label={`${left} to ${right}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(score * 100)} className="relative h-1.5 rounded-full bg-border">
                <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-background" style={{ left: `${5 + score * 90}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      </div>
      <div className="flex flex-1 flex-col lg:flex-none">
      <p className="mt-6 text-sm">{line}</p>
      <div className="mt-4 flex flex-wrap gap-2">{t.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
      <h2 className="mt-6 font-serif text-xl">Pieces people like you wear</h2>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {pieces.map((piece) => <div key={piece.id}><Photo src={piece.image} alt={piece.name} className="aspect-[3/4] rounded-lg" /><p className="mt-2 text-[11px] leading-snug">{piece.name}</p></div>)}
      </div>
      <div className="mt-auto space-y-3 pt-8">
        <PillButton onClick={() => go("budget")}>Find matches</PillButton>
        <PillButton variant="outline" onClick={retake}>Retake</PillButton>
      </div>
      </div>
    </div>
  );
}
