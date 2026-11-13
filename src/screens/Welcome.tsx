import { toast } from "sonner";
import { PillButton } from "@/components/pairly/PillButton";
import { PreferenceChoice } from "@/components/pairly/PreferenceChoice";
import { quizAvailable } from "@/data/diagnosis";
import { usePairly } from "@/store/PairlyContext";
import { Logo } from "@/design-system/kodi-design-system-ac5f73";

export function Welcome() {
  const { go, stylePreference, preferenceLoaded, skipQuiz } = usePairly();
  const quiz = stylePreference ? quizAvailable(stylePreference) : true;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-screen px-screen pb-screen pt-topbar text-center">
      <Logo size="hero" />
      <h1 className="text-display font-bold">You own it.<br />KODI styles it.</h1>
      <p className="text-body-sm text-muted-foreground">Swipe a few looks to find your style. Then get 3 ways to wear one piece you own.</p>
      {preferenceLoaded && (
        <div className="flex w-full flex-col gap-screen text-left">
          <h2 className="text-heading">What are you looking for?</h2>
          <PreferenceChoice />
          {stylePreference && <PillButton onClick={quiz ? () => go("diagnosis") : skipQuiz}>{quiz ? "Find my style" : "Start styling"}</PillButton>}
          <PillButton variant="outline" onClick={() => toast("Coming soon")}>Sign In</PillButton>
        </div>
      )}
    </div>
  );
}
