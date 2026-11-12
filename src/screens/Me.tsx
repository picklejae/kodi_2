import { Chip } from "@/components/pairly/Chip";
import { PillButton } from "@/components/pairly/PillButton";
import { DEFAULT_CODE, STYLE_TYPES } from "@/data/styleTypes";
import { usePairly } from "@/store/PairlyContext";
import { StyleScales } from "@/components/pairly/StyleScales";
import { OutfitBoard } from "@/components/pairly/OutfitBoard";
import { Photo } from "@/components/pairly/Photo";

export function Me() {
  const { styleType, axisScores, retake, savedLooks, posts } = usePairly();
  const t = STYLE_TYPES[styleType ?? DEFAULT_CODE];
  return (
    <div className="px-6 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your Style Type</p>
      <h1 className="mt-3 font-serif text-4xl">{t.name}</h1>
      <StyleScales type={t.code} scores={axisScores} />
      <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{t.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
      <PillButton variant="outline" className="mt-8" onClick={retake}>Retake</PillButton>
      <section className="mt-8 pb-8">
        <h2 className="font-serif text-2xl">My looks</h2>
        {!savedLooks.length && !posts.some((p) => p.isUserPost) && <p className="mt-3 text-sm text-muted-foreground">No looks yet.</p>}
        <div className="mt-4 space-y-6">
          {posts.filter((p) => p.isUserPost).map((p) => <article key={p.id} aria-label="Posted look">
            {p.look && p.ownedImage ? <OutfitBoard itemImage={p.ownedImage} items={p.look.items} /> : <Photo src={p.image} alt={p.question} className="aspect-[9/8] rounded-lg" />}
            <p className="mt-2 text-xs text-muted-foreground">Posted</p><p className="mt-1 text-sm">{p.question}</p>
          </article>)}
          {savedLooks.map((entry) => <article key={entry.id} aria-label="Saved look"><OutfitBoard itemImage={entry.ownedImage} items={entry.look.items} /><p className="mt-2 text-xs text-muted-foreground">Saved · {entry.ownedName}</p><p className="mt-1 text-sm">{entry.look.items.map((item) => item.name).join(" + ")}</p></article>)}
        </div>
      </section>
    </div>
  );
}
