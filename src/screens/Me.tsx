import { Chip } from "@/components/pairly/Chip";
import { PillButton } from "@/components/pairly/PillButton";
import { DEFAULT_CODE, STYLE_TYPES } from "@/data/styleTypes";
import { usePairly } from "@/store/PairlyContext";
import { BudgetSection, FitProfileSection } from "@/components/pairly/ProfileSections";
import { StyleScales } from "@/components/pairly/StyleScales";
import { PreferenceChoice } from "@/components/pairly/PreferenceChoice";

export function Me() {
  const { styleType, axisScores, quizSkipped, retake } = usePairly();
  const t = STYLE_TYPES[styleType ?? DEFAULT_CODE];
  return (
    <div className="px-screen pb-8 pt-12">
      <div>
      <h1 className="text-title font-bold">Jason</h1>

      <section className="mt-8" aria-label="Your Style Type">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your Style Type</h2>
        <div className="mt-3 rounded-2xl bg-card p-4 shadow-soft">
          {quizSkipped ? <>
            <button type="button" onClick={retake} className="font-serif text-2xl underline decoration-1 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">Find My Style</button>
            <StyleScales type={t.code} scores={null} unknown />
          </> : <>
            <p className="font-serif text-2xl">{t.name}</p>
            <StyleScales type={t.code} scores={axisScores} />
            <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{t.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
            <PillButton variant="outline" className="mt-5" onClick={retake}>Retake</PillButton>
          </>}
        </div>
      </section>

      </div>
      <div>
      <FitProfileSection />

      <BudgetSection />

      <section className="mt-8" aria-label="Clothing preference">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">What are you looking for?</h2>
        <div className="mt-3"><PreferenceChoice compact /></div>
      </section>
      </div>
    </div>
  );
}
