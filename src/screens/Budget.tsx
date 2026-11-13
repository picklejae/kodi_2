import { SectionLabel, SecondaryButton, TextField, TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";
import { BUDGET_CHOICES } from "@/lib/budget";
import { usePairly } from "@/store/PairlyContext";

const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;
const num = (v: string) => (v.trim() === "" || Number.isNaN(Number(v)) ? null : Number(v));

export function Budget() {
  const { completeBudget, body, setBody, units } = usePairly();
  const metric = units === "metric";
  const height = body.heightCm === null ? "" : String(Math.round(metric ? body.heightCm : body.heightCm / CM_PER_IN));
  const weight = body.weightKg === null ? "" : String(Math.round(metric ? body.weightKg : body.weightKg * LB_PER_KG));
  return <div className="flex flex-1 flex-col gap-screen px-screen pb-screen pt-topbar">
    <SectionLabel as="p">Your budget</SectionLabel>
    <h1 className="text-title font-bold">About you</h1>
    <div className="grid grid-cols-2 gap-screen">
      <TextField label={metric ? "Height (cm)" : "Height (in)"} inputMode="numeric" value={height} onChange={(e) => { const v = num(e.target.value); setBody({ ...body, heightCm: v === null ? null : metric ? v : v * CM_PER_IN }); }} />
      <TextField label={metric ? "Weight (kg)" : "Weight (lb)"} inputMode="numeric" value={weight} onChange={(e) => { const v = num(e.target.value); setBody({ ...body, weightKg: v === null ? null : metric ? v : v / LB_PER_KG }); }} />
    </div>
    <div className="flex flex-col gap-screen">{BUDGET_CHOICES.map(({ label, range }) => <SecondaryButton key={label} fullWidth onClick={() => completeBudget(range)}>{label}</SecondaryButton>)}</div>
    <div className="mt-auto flex justify-center"><TextLinkButton onClick={() => completeBudget(null)}>Skip</TextLinkButton></div>
  </div>;
}
