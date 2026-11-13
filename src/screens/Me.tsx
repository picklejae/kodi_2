import { Chip } from "@/components/pairly/Chip";
import { PillButton } from "@/components/pairly/PillButton";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_CODE, STYLE_TYPES } from "@/data/styleTypes";
import { BUDGET_LIMIT, usePairly, type UnitSystem } from "@/store/PairlyContext";
import { StyleScales } from "@/components/pairly/StyleScales";
import { PreferenceChoice } from "@/components/pairly/PreferenceChoice";
import { cn } from "@/lib/utils";

const CM_PER_IN = 2.54;
const LB_PER_KG = 2.20462;

function toImperial(heightCm: number | null, weightKg: number | null) {
  const totalIn = heightCm !== null ? heightCm / CM_PER_IN : null;
  return {
    ft: totalIn !== null ? Math.floor(totalIn / 12) : null,
    inch: totalIn !== null ? Math.round(totalIn % 12) : null,
    lb: weightKg !== null ? Math.round(weightKg * LB_PER_KG) : null,
  };
}

export function Me() {
  const { styleType, axisScores, retake, body, units, budget, budgetKnown, setBody, setUnits, setBudget } = usePairly();
  const t = STYLE_TYPES[styleType ?? DEFAULT_CODE];
  const imperial = toImperial(body.heightCm, body.weightKg);
  const setHeightImperial = (ft: number | null, inch: number | null) => {
    if (ft === null && inch === null) return setBody({ ...body, heightCm: null });
    setBody({ ...body, heightCm: ((ft ?? 0) * 12 + (inch ?? 0)) * CM_PER_IN });
  };
  return (
    <div className="px-screen pb-8 pt-12 lg:grid lg:grid-cols-[11fr_9fr] lg:items-center lg:gap-screen">
      <div>
      <h1 className="text-title font-bold">Me</h1>

      <section className="mt-8" aria-label="Your Style Type">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your Style Type</h2>
        <div className="mt-3 rounded-2xl bg-card p-4 shadow-soft">
          <p className="font-serif text-2xl">{t.name}</p>
          <StyleScales type={t.code} scores={axisScores} />
          <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">{t.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
          <PillButton variant="outline" className="mt-5" onClick={retake}>Retake</PillButton>
        </div>
      </section>

      </div>
      <div>
      <section className="mt-8" aria-label="Fit Profile">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fit Profile</h2>
        <p className="mt-1 text-xs text-muted-foreground">Used to match the generated person's build to yours.</p>
        <div className="mt-3 rounded-2xl bg-card px-4 shadow-soft">
          <div className="flex items-center justify-between gap-3 border-b border-border py-3">
            <span className="text-sm">Units</span>
            <div className="grid shrink-0 grid-cols-2 overflow-hidden rounded-full border border-border" role="group" aria-label="Units">
              {(["metric", "imperial"] as UnitSystem[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={units === option}
                  onClick={() => setUnits(option)}
                  className={cn("h-touch w-24 whitespace-nowrap text-center text-sm font-normal transition-colors duration-200 ease-kodi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", units === option ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground")}
                >
                  {option === "metric" ? "cm · kg" : "ft/in · lb"}
                </button>
              ))}
            </div>
          </div>
          {units === "metric" ? (
            <>
              <NumberRow
                label="Height"
                unit="cm"
                value={body.heightCm !== null ? String(Math.round(body.heightCm)) : ""}
                onChange={(v) => setBody({ ...body, heightCm: v })}
              />
              <NumberRow
                label="Weight"
                unit="kg"
                value={body.weightKg !== null ? String(Math.round(body.weightKg)) : ""}
                onChange={(v) => setBody({ ...body, weightKg: v })}
                last
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border py-3">
                <span className="text-sm">Height</span>
                <div className="flex items-center gap-2">
                  <NumberInput
                    aria-label="Height feet"
                    value={imperial.ft !== null ? String(imperial.ft) : ""}
                    onChange={(v) => setHeightImperial(v, imperial.ft === null && v === null ? null : imperial.inch)}
                  />
                  <span className="w-6 shrink-0 text-left text-xs text-muted-foreground">ft</span>
                  <NumberInput
                    aria-label="Height inches"
                    value={imperial.inch !== null ? String(imperial.inch) : ""}
                    onChange={(v) => setHeightImperial(imperial.ft, v)}
                  />
                  <span className="w-6 shrink-0 text-left text-xs text-muted-foreground">in</span>
                </div>
              </div>
              <NumberRow
                label="Weight"
                unit="lb"
                value={imperial.lb !== null ? String(imperial.lb) : ""}
                onChange={(v) => setBody({ ...body, weightKg: v !== null ? v / LB_PER_KG : null })}
                last
              />
            </>
          )}
        </div>
      </section>

      <section className="mt-8" aria-label="Budget">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Budget</h2>
        <div className="mt-3 rounded-2xl bg-card px-4 py-4 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-sm">Price range</span>
            <span className={cn("text-sm font-semibold", !budgetKnown && "underline underline-offset-4")}>{budgetKnown ? `$${budget.min} – $${budget.max}` : "Not sure yet"}</span>
          </div>
          <Slider
            className="mt-4"
            value={[budget.min, budget.max]}
            min={0}
            max={BUDGET_LIMIT}
            step={10}
            minStepsBetweenThumbs={1}
            aria-label="Budget range"
            onValueChange={([min, max]) => setBudget({ min: min ?? 0, max: max ?? BUDGET_LIMIT })}
          />
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>$0</span>
            <span>${BUDGET_LIMIT}</span>
          </div>
        </div>
      </section>

      <section className="mt-8" aria-label="Clothing preference">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">What are you looking for?</h2>
        <div className="mt-3"><PreferenceChoice compact /></div>
      </section>
      </div>
    </div>
  );
}

function NumberRow({ label, unit, value, onChange, last = false }: { label: string; unit: string; value: string; onChange: (v: number | null) => void; last?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-3", !last && "border-b border-border")}>
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <NumberInput aria-label={`${label} in ${unit}`} value={value} onChange={onChange} />
        <span className="w-6 shrink-0 text-left text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

function NumberInput({ value, onChange, "aria-label": ariaLabel }: { value: string; onChange: (v: number | null) => void; "aria-label": string }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") return onChange(null);
        const parsed = Number(raw);
        if (Number.isFinite(parsed) && parsed >= 0) onChange(parsed);
      }}
      className="h-9 w-20 rounded-lg border border-border bg-background px-2 text-right text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  );
}
