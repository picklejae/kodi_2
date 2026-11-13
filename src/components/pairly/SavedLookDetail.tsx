import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PhoneFrame } from "@/components/pairly/PhoneFrame";
import { BottomTabBar } from "@/components/pairly/BottomTabBar";
import { PillButton } from "@/components/pairly/PillButton";
import { OutfitResultView } from "@/components/pairly/OutfitResultView";
import { StyleTypeChip } from "@/components/pairly/StyleTypeChip";
import { DevJumper } from "@/components/pairly/DevJumper";
import { usePairly } from "@/store/PairlyContext";
import { SAVED_OUTFITS } from "@/data/saved";

/** Saved look detail; without an id it shows the first sample saved look. */
export function SavedLookDetail({ id }: { id?: string }) {
  const { savedOutfits, setTab, go, screen } = usePairly();
  const navigate = useNavigate();
  const outfit = id ? savedOutfits.find((o) => o.id === id) : SAVED_OUTFITS[0];
  const back = () => {
    if (screen !== "upload" && screen !== "results") go("upload");
    setTab("saved");
    navigate({ to: "/menu2-saved" });
  };
  return (
    <PhoneFrame>
      <div className="px-6 pb-32 pt-12">
        <div className="flex items-center gap-3">
          <PillButton variant="ghost" aria-label="Back to Saved" onClick={back} className="h-9 w-9 px-0">
            <ChevronLeft className="h-5 w-5" />
          </PillButton>
          <StyleTypeChip />
        </div>
        <h1 className="mb-6 mt-6 text-title font-bold">Saved outfit</h1>
        {outfit ? (
          <OutfitResultView lookName={outfit.lookName} explanation={outfit.explanation} imageUrl={outfit.imageUrl} products={outfit.products} />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">This outfit is no longer saved.</p>
            <PillButton className="mt-5" onClick={back}>Back To Saved</PillButton>
          </>
        )}
      </div>
      <BottomTabBar />
      <DevJumper />
    </PhoneFrame>
  );
}
