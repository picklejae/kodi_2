/** Renders each sentence as an unbreakable-first unit so wrapping happens between sentences. */
export function Sentences({ text }: { text: string }) {
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  return <>{parts.map((s, i) => <span key={i} className="inline-block">{s.trim()}{i < parts.length - 1 ? "\u00a0" : ""}</span>)}</>;
}
