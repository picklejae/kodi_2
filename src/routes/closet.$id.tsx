import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PhoneFrame } from "@/components/pairly/PhoneFrame";
import { BottomTabBar } from "@/components/pairly/BottomTabBar";
import { PillButton } from "@/components/pairly/PillButton";
import { OutfitResultView } from "@/components/pairly/OutfitResultView";
import { StyleTypeChip } from "@/components/pairly/StyleTypeChip";
import { DevJumper } from "@/components/pairly/DevJumper";
import { usePairly } from "@/store/PairlyContext";
export const Route = createFileRoute("/closet/$id")({
  head: () => ({
    meta: [
      { title: "Closet outfit · Pairly" },
      {
        name: "description",
        content: "Revisit your saved outfit and shop the pieces paired with your own.",
      },
      { property: "og:title", content: "Closet outfit · Pairly" },
      {
        property: "og:description",
        content: "Revisit your saved outfit and shop the pieces paired with your own.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedOutfitDetail,
});
function SavedOutfitDetail() {
  const { id } = Route.useParams();
  const { savedOutfits, savedLooks, setTab, go, screen } = usePairly();
  const navigate = useNavigate();
  const outfit = savedOutfits.find((o) => o.id === id);
  const snapshot = savedLooks.find((o) => o.id === id);
  const back = () => {
    if (screen === "welcome") go("upload");
    setTab("closet");
    navigate({ to: "/" });
  };
  return (
    <PhoneFrame>
      <div className="px-6 pb-32 pt-12">
        <div className="flex items-center gap-3">
          <PillButton
            variant="ghost"
            aria-label="Back to Closet"
            onClick={back}
            className="h-9 w-9 px-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </PillButton>
          <StyleTypeChip />
        </div>
        <h1 className="mb-6 mt-6 font-serif text-4xl">Closet outfit</h1>
        {outfit ? (
          <OutfitResultView
            pick={outfit.look}
            itemImage={outfit.ownedImage}
            imageUrl={outfit.imageUrl}
            products={outfit.products}
            showTierTabs={false}
          />
        ) : snapshot ? (
          <OutfitResultView
            pick={snapshot.look}
            itemImage={snapshot.ownedImage}
            showTierTabs={false}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">This outfit is no longer saved.</p>
            <PillButton className="mt-5" onClick={back}>
              Back to Closet
            </PillButton>
          </>
        )}
      </div>
      <BottomTabBar />
      <DevJumper />
    </PhoneFrame>
  );
}
