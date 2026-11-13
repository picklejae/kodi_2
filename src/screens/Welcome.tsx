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
      <div className="flex flex-col items-center gap-screen">
      <Logo size="hero" />
      <h1 className="whitespace-nowrap text-[22px] font-bold">You own it. KODI styles it.</h1>
      </div>
      {preferenceLoaded && (
        <div className="flex w-full flex-col gap-screen">
          <div className="flex w-full flex-col gap-3">
            <h2 className="text-body-sm">What are you looking for?</h2>
            <PreferenceChoice />
          </div>
          <div className="flex w-full flex-col items-center gap-2 pt-2.5">
            {stylePreference && <PillButton accent onClick={quiz ? () => go("diagnosis") : skipQuiz}>{quiz ? "Find My Style" : "Start Styling"}</PillButton>}
            <button type="button" onClick={() => toast("Coming soon")} className="min-h-touch text-body-sm text-muted-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Sign in</button>
          </div>
        </div>
      )}
    </div>
  );
}
