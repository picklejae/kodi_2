import { toast } from "sonner";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { PreferenceChoice } from "@/components/pairly/PreferenceChoice";
import { LOOK_IMAGES } from "@/data/styleTypes";
import { quizAvailable } from "@/data/diagnosis";
import { usePairly } from "@/store/PairlyContext";
import { Logo } from "@/design-system/kodi-design-system-ac5f73";

export function Welcome() {
  const { go, stylePreference, preferenceLoaded, skipQuiz } = usePairly();
  const quiz = stylePreference ? quizAvailable(stylePreference) : true;
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
      <Logo size="hero" />
      {quiz && (
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Photo src={LOOK_IMAGES.suit} alt="Tailored look" className="col-span-2 row-span-2 h-72 rounded-3xl" />
          <Photo src={LOOK_IMAGES.casual} alt="Casual look" className="h-[140px] rounded-2xl" />
          <Photo src={LOOK_IMAGES.coat} alt="Coat look" className="h-[140px] rounded-2xl" />
        </div>
      )}
      <h1 className="mt-8 font-serif text-4xl leading-tight">Own it. Now know what to wear it with.</h1>
      <p className="mt-3 text-sm text-muted-foreground">Swipe a few looks to find your style. Then get 3 ways to wear one piece you own.</p>
      {preferenceLoaded && (
        <div className="mt-auto space-y-3 pt-8">
          <h2 className="font-serif text-2xl">What are you looking for?</h2>
          <PreferenceChoice />
          {stylePreference && (quiz
            ? <PillButton onClick={() => go("diagnosis")}>Find my Style Type</PillButton>
            : <>
                <p className="text-xs text-muted-foreground">The swipe quiz looks are menswear only for now, so it's skipped for womenswear. You can still style your piece.</p>
                <PillButton onClick={skipQuiz}>Start styling</PillButton>
              </>)}
          <PillButton variant="outline" onClick={() => toast("Coming soon")}>Sign In</PillButton>
        </div>
      )}
    </div>
  );
}
