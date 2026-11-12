import { toast } from "sonner";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { LOOK_IMAGES } from "@/data/styleTypes";
import { usePairly } from "@/store/PairlyContext";

export function Welcome() {
  const { go } = usePairly();
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Pairly</p>
      <div className="mt-6 grid grid-cols-3 gap-2">
        <Photo src={LOOK_IMAGES.suit} alt="Tailored look" className="col-span-2 row-span-2 h-72 rounded-3xl" />
        <Photo src={LOOK_IMAGES.casual} alt="Casual look" className="h-[140px] rounded-2xl" />
        <Photo src={LOOK_IMAGES.coat} alt="Coat look" className="h-[140px] rounded-2xl" />
      </div>
      <h1 className="mt-8 font-serif text-4xl leading-tight">Own it. Now know what to wear it with.</h1>
      <p className="mt-3 text-sm text-muted-foreground">Pick between outfits for 8 quick rounds. We'll find your Style Type, then 3 matches for one piece you own.</p>
      <div className="mt-auto space-y-3 pt-8">
        <PillButton onClick={() => go("diagnosis")}>Find my Style Type</PillButton>
        <PillButton variant="outline" onClick={() => toast("Coming soon")}>Sign In</PillButton>
      </div>
    </div>
  );
}
