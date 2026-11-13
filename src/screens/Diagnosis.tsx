import { Heart, Undo2, X } from "lucide-react";
import { SwipePhotoCard } from "@/components/pairly/SwipePhotoCard";
import { PillButton } from "@/components/pairly/PillButton";
import { roundsFor, quizAvailable } from "@/data/diagnosis";
import { usePairly } from "@/store/PairlyContext";

export function Diagnosis() {
  const { answers, answer, back, skipQuiz, stylePreference } = usePairly();
  const i = answers.length;
  const ROUNDS = roundsFor(stylePreference);
  if (stylePreference && !quizAvailable(stylePreference)) return (
    <div className="flex flex-1 flex-col justify-center gap-4 px-screen"><h2 className="font-serif text-3xl">Womenswear quiz looks are coming soon</h2><p className="text-sm text-muted-foreground">The current swipe photos are menswear only, so we skip the quiz for womenswear.</p><PillButton onClick={skipQuiz}>Start styling</PillButton></div>
  );
  if (!ROUNDS[i]) return null;
  return (
    <div className="flex flex-1 flex-col overflow-x-clip px-screen pb-8 pt-12">
      <div className="flex items-center justify-between">
        <PillButton variant="ghost" onClick={back} disabled={!answers.length} aria-label="Undo last swipe" title="Undo last swipe" className="h-10 w-10 px-0"><Undo2 className="h-5 w-5" /></PillButton>
        <span className="text-xs font-medium text-muted-foreground" aria-live="polite">{i + 1} of {ROUNDS.length}</span>
        <div className="w-10" />
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / ROUNDS.length) * 100}%` }} />
      </div>
      <h2 className="mt-5 font-serif text-3xl">Does this feel like you?</h2>
      <div className="relative mx-auto mt-5 h-[min(440px,52svh)] w-full max-w-card">
        {ROUNDS.slice(i, i + 2).reverse().map((card, index, cards) => (
          <SwipePhotoCard key={card.id} image={card.image} alt={`Outfit ${card.id}`} top={index === cards.length - 1}
            onSwipe={(yes) => answer(yes ? "yes" : "no")} positiveStamp={<Heart className="h-7 w-7" />} negativeStamp={<X className="h-7 w-7" />} />
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-6">
        <PillButton variant="outline" aria-label="No" title="No" onClick={() => answer("no")} className="h-14 w-14 bg-card px-0 shadow-soft"><X className="h-6 w-6" /></PillButton>
        <PillButton aria-label="Yes" title="Yes" onClick={() => answer("yes")} className="h-14 w-14 px-0 shadow-soft"><Heart className="h-6 w-6" /></PillButton>
      </div>
      <div className="mt-auto pt-4 text-center">
        <PillButton variant="ghost" onClick={skipQuiz} className="h-9 w-auto px-2 underline underline-offset-4">Skip quiz</PillButton>
      </div>
    </div>
  );
}
