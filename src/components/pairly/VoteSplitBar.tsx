import { upPercent } from "@/lib/social";
export function VoteSplitBar({ up, down }: { up: number; down: number }) {
  const pct = upPercent(up, down);
  return (
    <div>
      <div className="flex justify-between text-xs font-medium"><span>👍 {up}</span><span>{pct}% like it</span><span>👎 {down}</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
