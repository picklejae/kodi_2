import { toast } from "sonner";
import { PillButton } from "@/components/pairly/PillButton";
import { PreferenceChoice } from "@/components/pairly/PreferenceChoice";
import { quizAvailable } from "@/data/diagnosis";
import { usePairly } from "@/store/PairlyContext";
import { Sentences } from "@/components/pairly/Sentences";
import { Logo } from "@/design-system/kodi-design-system-ac5f73";

export function Welcome() {
  const { go, stylePreference, preferenceLoaded, skipQuiz } = usePairly();
  const quiz = stylePreference ? quizAvailable(stylePreference) : true;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-screen px-screen pb-screen pt-topbar text-center">
      <div className="flex flex-col items-center gap-screen">
      <Logo size="hero" />
      <h1 className="text-display font-bold">You own it.<br />KODI styles it.</h1>
      <p className="text-body-sm text-muted-foreground"><Sentences text="Swipe a few looks to find your style. Then get 3 ways to wear one piece you own." /></p>
      </div>
      {preferenceLoaded && (
        <div className="mt-topbar flex w-full flex-col gap-screen border-t border-border pt-topbar">
          <h2 className="text-heading">What are you looking for?</h2>
          <PreferenceChoice />
          {stylePreference && <PillButton onClick={quiz ? () => go("diagnosis") : skipQuiz}>{quiz ? "Find my style" : "Start styling"}</PillButton>}
          <button type="button" onClick={() => toast("Coming soon")} className="self-center min-h-touch text-body-sm text-muted-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Sign in</button>
        </div>
      )}
    </div>
  );
}
