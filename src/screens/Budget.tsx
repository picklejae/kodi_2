import { SectionLabel, SecondaryButton, TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";
import { BUDGET_CHOICES } from "@/lib/budget";
import { usePairly } from "@/store/PairlyContext";

export function Budget() {
  const { completeBudget } = usePairly();
  return <div className="flex flex-1 flex-col gap-screen px-screen pb-screen pt-topbar">
    <SectionLabel as="p">Your budget</SectionLabel>
    <h1 className="text-title">What do you usually spend on one piece?</h1>
    <div className="flex flex-col gap-screen">{BUDGET_CHOICES.map(({ label, range }) => <SecondaryButton key={label} fullWidth onClick={() => completeBudget(range)}>{label}</SecondaryButton>)}</div>
    <TextLinkButton onClick={() => completeBudget(null)}>Not sure yet</TextLinkButton>
  </div>;
}