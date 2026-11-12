import { Chip } from "./Chip";
import { STYLE_TYPES, type StyleTypeCode } from "@/data/styleTypes";
import type { Feedback, VoteGroup } from "@/data/social";
import { voteSummary } from "@/lib/social";

export function StyleBadge({ type }: { type: StyleTypeCode }) {
  return <Chip className="px-2 py-0.5 text-[10px]">{STYLE_TYPES[type].name}</Chip>;
}

export function FeedbackList({ feedback }: { feedback: Feedback[] }) {
  return <div className="mt-3 space-y-2">{feedback.map((f, i) => <div key={`${f.text}-${i}`} className="flex flex-wrap items-center gap-2 text-xs"><span>{f.text}</span><StyleBadge type={f.styleType} /></div>)}</div>;
}

export function FeedbackSummary({ groups, type }: { groups: VoteGroup[]; type: StyleTypeCode }) {
  const summary = voteSummary(groups, type);
  return <div className="mt-4 space-y-1 text-xs" aria-label="Feedback summary">
    <p>{summary.total ? `${summary.yes} of ${summary.total} ${STYLE_TYPES[type].name} users said yes` : `Waiting for votes from ${STYLE_TYPES[type].name} users…`}</p>
    <p className="text-muted-foreground">{summary.adventurousTotal ? `More adventurous users ${summary.adventurousNo >= 40 && summary.adventurousNo <= 60 ? "were split" : summary.adventurousNo > 60 ? "leaned no" : "leaned yes"}: ${summary.adventurousNo}% said no` : "Waiting for votes from more adventurous users…"}</p>
  </div>;
}