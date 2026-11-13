import { toast } from "sonner";
import { PillButton } from "@/components/pairly/PillButton";
import { PreferenceChoice } from "@/components/pairly/PreferenceChoice";
import { LOOK_IMAGES } from "@/data/styleTypes";
import { quizAvailable } from "@/data/diagnosis";
import { usePairly } from "@/store/PairlyContext";
import { Logo, PhotoCard } from "@/design-system/kodi-design-system-ac5f73";

export function Welcome() {
  const { go, stylePreference, preferenceLoaded, skipQuiz } = usePairly();
  const quiz = stylePreference ? quizAvailable(stylePreference) : true;
  return (
    <div className="flex flex-1 flex-col gap-screen px-screen pb-screen pt-topbar lg:grid lg:grid-cols-[11fr_9fr] lg:items-center">
      <div className="flex flex-col gap-screen">
        <Logo size="hero" />
        {/* Always rendered at the same size so the toggle never shifts. */}
        <div className="grid grid-cols-3 gap-screen">
          <div className="col-span-2"><PhotoCard src={LOOK_IMAGES.suit} alt="Tailored look" ratio="look" /></div>
          <div className="flex flex-col gap-screen">
            <PhotoCard src={LOOK_IMAGES.casual} alt="Casual look" ratio="look" />
            <PhotoCard src={LOOK_IMAGES.coat} alt="Coat look" ratio="look" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-screen lg:flex-none">
        <h1 className="text-display font-bold">You own it. KODI styles it.</h1>
        <p className="text-body-sm text-muted-foreground">Swipe a few looks to find your style. Then get 3 ways to wear one piece you own.</p>
        {preferenceLoaded && (
          <div className="mt-auto flex flex-col gap-screen">
            <h2 className="text-heading">What are you looking for?</h2>
            <PreferenceChoice />
            {stylePreference && <PillButton onClick={quiz ? () => go("diagnosis") : skipQuiz}>{quiz ? "Find my style" : "Start styling"}</PillButton>}
            <PillButton variant="outline" onClick={() => toast("Coming soon")}>Sign In</PillButton>
          </div>
        )}
      </div>
    </div>
  );
}
