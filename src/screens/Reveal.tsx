import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { DEFAULT_CODE, STYLE_TYPES } from "@/data/styleTypes";
import { StyleScales } from "@/components/pairly/StyleScales";
import { usePairly } from "@/store/PairlyContext";
import { stylePresentation } from "@/lib/stylePresentation";


export function Reveal() {
  const { styleType, axisScores, quizSkipped, go } = usePairly();
  const t = STYLE_TYPES[styleType ?? DEFAULT_CODE];
  const { line, pieces } = stylePresentation(t.code);
  return (
    <div className="flex flex-1 flex-col px-screen pt-14">
      <div>
      <p className="reveal-rise text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your Style Type</p>
       <h1 className="reveal-focus mt-3 text-title font-bold" style={{ ["--d" as string]: "180ms" }}>You're {/^[AEIOU]/i.test(t.name) ? "an" : "a"} {t.name}</h1>
      {quizSkipped && <p className="reveal-rise mt-3 text-sm text-muted-foreground" style={{ ["--d" as string]: "500ms" }}>Not sure yet? Here's a classic starting point.</p>}
      <StyleScales type={t.code} scores={axisScores} reveal revealDelay={520} />
      </div>
      <div className="flex flex-1 flex-col">
      <p className="reveal-rise mt-6 text-sm" style={{ ["--d" as string]: "980ms" }}>{line}</p>
      <div className="mt-4 flex flex-wrap gap-2">{t.keywords.map((k, i) => <span key={k} className="reveal-rise" style={{ ["--d" as string]: `${1080 + i * 60}ms` }}><Chip>{k}</Chip></span>)}</div>
      <h2 className="reveal-rise mt-6 font-serif text-xl" style={{ ["--d" as string]: "1200ms" }}>Pieces people like you wear</h2>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {pieces.map((piece, i) => <div key={piece.id} className="reveal-rise" style={{ ["--d" as string]: `${1280 + i * 70}ms` }}><Photo src={piece.image} alt={piece.name} className="aspect-[3/4] rounded-lg" /><p className="mt-2 text-[11px] leading-snug">{piece.name}</p></div>)}
      </div>
      <div className="sticky bottom-0 mt-auto bg-background pb-screen pt-screen">
        <div className="reveal-rise" style={{ ["--d" as string]: "1600ms" }}><PillButton onClick={() => go("budget")}>Start exploring!</PillButton></div>
      </div>
      </div>
    </div>
  );
}
