import { SectionLabel, TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";
import { PillButton } from "@/components/pairly/PillButton";
import { BudgetSection, FitProfileSection } from "@/components/pairly/ProfileSections";
import { usePairly } from "@/store/PairlyContext";

/** Onboarding "Just a few details": the same Fit Profile and Budget cards as the Me tab. */
export function Budget() {
  const { completeBudget, budget, budgetKnown } = usePairly();
  return <div className="flex flex-1 flex-col px-screen pb-screen pt-topbar">
    <SectionLabel as="p">Almost there</SectionLabel>
    <h1 className="mt-2 text-title font-bold">Just a few details</h1>
    <FitProfileSection />
    <BudgetSection />
    <div className="mt-auto flex flex-col items-center gap-2 pt-8">
      {/* Untouched slider means no budget given, same as Skip. */}
      <PillButton onClick={() => completeBudget(budgetKnown ? budget : null)}>Continue</PillButton>
      <TextLinkButton onClick={() => completeBudget(null)}>Skip</TextLinkButton>
    </div>
  </div>;
}
