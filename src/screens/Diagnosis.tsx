import { ChevronLeft } from "lucide-react";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { ROUNDS } from "@/data/diagnosis";
import { usePairly } from "@/store/PairlyContext";

export function Diagnosis() {
  const { answers, answer, back } = usePairly();
  const i = Math.min(answers.length, ROUNDS.length - 1);
  const r = ROUNDS[i];
  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-12">
      <div className="flex items-center justify-between">
        <button onClick={back} aria-label="Back" className="-ml-2 p-2"><ChevronLeft className="h-5 w-5" /></button>
        <span className="text-xs font-medium text-muted-foreground">{i + 1} / {ROUNDS.length}</span>
        <button onClick={() => answer(null)} className="p-2 text-sm font-medium text-muted-foreground">Skip</button>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / ROUNDS.length) * 100}%` }} />
      </div>
      <h2 className="mt-8 font-serif text-3xl">Which feels more like you?</h2>
      <div key={r.id} className="mt-6 grid grid-cols-2 gap-3 animate-in fade-in duration-300">
        {(["A", "B"] as const).map((k) => {
          const o = k === "A" ? r.a : r.b;
          return (
            <button key={k} onClick={() => answer(k)} className="group text-left">
              <Photo src={o.image} alt={o.label} className="h-72 rounded-3xl shadow-soft ring-foreground transition group-active:ring-2" />
              <p className="mt-2 text-sm font-medium">{o.label}</p>
            </button>
          );
        })}
      </div>
      <div className="mt-auto pt-6">
        <PillButton variant="outline" onClick={() => answer(null)}>Neither</PillButton>
      </div>
    </div>
  );
}
