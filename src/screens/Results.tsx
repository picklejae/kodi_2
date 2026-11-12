import { PillButton } from "@/components/pairly/PillButton";
import { usePairly } from "@/store/PairlyContext";

// Placeholder until Chunk 3.
export function Results() {
  const { go } = usePairly();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-3xl">Your 3 matches</h1>
      <p className="mt-2 text-sm text-muted-foreground">Coming in the next step.</p>
      <PillButton variant="outline" className="mt-8" onClick={() => go("upload")}>Try another piece</PillButton>
    </div>
  );
}
