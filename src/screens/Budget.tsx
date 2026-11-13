import { PillButton } from "@/components/pairly/PillButton";
import { BUDGET_CHOICES } from "@/lib/budget";
import { usePairly } from "@/store/PairlyContext";

export function Budget() {
  const { completeBudget } = usePairly();
  return <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your budget</p>
    <h1 className="mt-4 text-3xl leading-tight">What do you usually spend on one piece?</h1>
    <div className="mt-8 space-y-3">{BUDGET_CHOICES.map(({ label, range }) => <PillButton key={label} variant="outline" onClick={() => completeBudget(range)}>{label}</PillButton>)}</div>
    <PillButton variant="ghost" onClick={() => completeBudget(null)} className="mt-5 h-10 text-sm underline underline-offset-4">Not sure yet</PillButton>
  </div>;
}