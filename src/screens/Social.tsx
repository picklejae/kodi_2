import { useEffect, useRef, useState } from "react";
import { Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "@/components/pairly/BottomSheet";
import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { VoteSplitBar } from "@/components/pairly/VoteSplitBar";
import { OCCASIONS } from "@/data/samples";
import { FEEDBACK_CHIPS, TRENDS, type SocialPost } from "@/data/social";
import { STYLE_TYPES } from "@/data/styleTypes";
import { topRated, upPercent } from "@/lib/social";
import { cn } from "@/lib/utils";
import { usePairly } from "@/store/PairlyContext";

type Detail = { title: string; image: string; up: number; down: number; feedback: string[]; sub?: string };
const occLabel = (o: SocialPost["occasion"]) => OCCASIONS.find((x) => x.id === o)?.label;

export function Social() {
  const { posts, userVotes, vote, addFeedback, openDraft } = usePairly();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);
  const trendsRef = useRef<HTMLElement>(null);
  const others = posts.filter((p) => !p.isUserPost);
  const mine = posts.filter((p) => p.isUserPost);
  const stack = others.filter((p) => !userVotes[p.id]);

  useEffect(() => {
    if (!feedbackFor) return;
    const t = setTimeout(() => setFeedbackFor(null), 2000);
    return () => clearTimeout(t);
  }, [feedbackFor]);

  const doVote = (id: string, v: "up" | "down") => { vote(id, v); setFeedbackFor(id); };

  return (
    <div className="px-6 pt-12">
      {mine.map((p) => <YourPost key={p.id} post={p} />)}

      <h1 className="font-serif text-4xl">Rate the fit</h1>
      <p className="mt-1 text-sm text-muted-foreground">Swipe right if it works, left if it doesn't.</p>

      <div className="relative mt-5 h-[440px]">
        {stack.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-card text-center shadow-soft">
            <p className="font-serif text-2xl">You're all caught up</p>
            <p className="mt-1 text-sm text-muted-foreground">New outfits arrive soon.</p>
            <PillButton variant="outline" className="mt-6 w-auto" onClick={() => trendsRef.current?.scrollIntoView({ behavior: "smooth" })}>See trends</PillButton>
          </div>
        ) : (
          stack.slice(0, 2).reverse().map((p, i, arr) => (
            <SwipeCard key={p.id} post={p} top={i === arr.length - 1} onVote={(v) => doVote(p.id, v)} />
          ))
        )}
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <button aria-label="Thumbs down" disabled={!stack[0]} onClick={() => stack[0] && doVote(stack[0].id, "down")} className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-soft disabled:opacity-40"><ThumbsDown className="h-5 w-5" /></button>
        <button aria-label="Thumbs up" disabled={!stack[0]} onClick={() => stack[0] && doVote(stack[0].id, "up")} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft disabled:opacity-40"><ThumbsUp className="h-5 w-5" /></button>
      </div>

      <div className="mt-4 min-h-[76px]">
        {feedbackFor && (
          <div className="animate-in fade-in">
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Quick feedback?</p><button onClick={() => setFeedbackFor(null)} className="text-xs font-medium text-muted-foreground">Skip</button></div>
            <div className="mt-2 flex flex-wrap gap-2">
              {FEEDBACK_CHIPS.map((c) => <button key={c} onClick={() => { addFeedback(feedbackFor, c); setFeedbackFor(null); toast("Thanks!"); }} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">{c}</button>)}
              <button onClick={() => toast("Coming soon")} className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">Add a comment</button>
            </div>
          </div>
        )}
      </div>

      <section ref={trendsRef} className="mt-6 scroll-mt-6">
        <h2 className="font-serif text-2xl">This week's trends</h2>
        <div className="-mx-6 mt-3 flex snap-x gap-3 overflow-x-auto px-6 pb-2">
          {TRENDS.map((t) => (
            <button key={t.id} onClick={() => setDetail({ title: t.title, image: t.image, up: t.votesUp, down: t.votesDown, feedback: t.topFeedback, sub: t.description })} className="w-36 shrink-0 snap-start text-left">
              <Photo src={t.image} alt={t.title} className="h-44 rounded-2xl shadow-soft" />
              <p className="mt-2 text-sm font-medium">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.postCount} posts</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 pb-36">
        <h2 className="font-serif text-2xl">Top rated this week</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {topRated(others).map((p) => (
            <button key={p.id} onClick={() => setDetail({ title: p.question, image: p.image, up: p.votesUp, down: p.votesDown, feedback: p.topFeedback, sub: `${p.author} · ${p.styleType}` })} className="text-left">
              <Photo src={p.image} alt={p.question} className="aspect-[4/5] rounded-2xl shadow-soft" />
              <div className="mt-1.5 flex justify-between text-xs"><span className="text-muted-foreground">{p.author}</span><span className="font-semibold">{upPercent(p.votesUp, p.votesDown)}% 👍</span></div>
            </button>
          ))}
        </div>
      </section>

      <button aria-label="New post" onClick={() => openDraft({ image: null })}
        className="fixed bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft"
        style={{ left: "min(calc(50% + 195px - 76px), calc(100% - 76px))" }}>
        <Plus className="h-6 w-6" />
      </button>

      <BottomSheet open={!!detail} onClose={() => setDetail(null)} title={detail?.title ?? ""}>
        {detail && <>
          {detail.sub && <p className="text-sm text-muted-foreground">{detail.sub}</p>}
          <Photo src={detail.image} alt={detail.title} className="mt-4 h-72 rounded-2xl" />
          <div className="mt-4"><VoteSplitBar up={detail.up} down={detail.down} /></div>
          <div className="mt-4 flex flex-wrap gap-2">{detail.feedback.map((f) => <Chip key={f}>{f}</Chip>)}</div>
        </>}
      </BottomSheet>
    </div>
  );
}

function SwipeCard({ post, top, onVote }: { post: SocialPost; top: boolean; onVote: (v: "up" | "down") => void }) {
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const start = useRef(0);
  const end = () => { setDrag(false); if (Math.abs(dx) > 100) onVote(dx > 0 ? "up" : "down"); else setDx(0); };
  return (
    <div
      onPointerDown={(e) => { if (!top) return; start.current = e.clientX; setDrag(true); e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => drag && setDx(e.clientX - start.current)}
      onPointerUp={end} onPointerCancel={end}
      className={cn("absolute inset-0 touch-pan-y select-none overflow-hidden rounded-3xl bg-card shadow-soft", !drag && "transition-transform duration-300", !top && "scale-95 opacity-70")}
      style={top ? { transform: `translateX(${dx}px) rotate(${dx / 15}deg)` } : undefined}
    >
      <Photo src={post.image} alt={post.question} className="pointer-events-none h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-5 pt-16 text-background">
        <p className="text-xs opacity-90">{post.author}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Chip className="border-transparent bg-background/90">{post.styleType} · {STYLE_TYPES[post.styleType].name}</Chip>
          {post.occasion && <Chip className="border-transparent bg-background/90">{occLabel(post.occasion)}</Chip>}
        </div>
        <p className="mt-2 font-serif text-xl leading-snug">{post.question}</p>
      </div>
      {top && <>
        <div className="absolute left-5 top-5 -rotate-12 rounded-xl border-4 border-background bg-primary px-3 py-1 text-2xl text-primary-foreground" style={{ opacity: Math.min(1, Math.max(0, dx / 100)) }}>👍</div>
        <div className="absolute right-5 top-5 rotate-12 rounded-xl border-4 border-background bg-destructive px-3 py-1 text-2xl text-destructive-foreground" style={{ opacity: Math.min(1, Math.max(0, -dx / 100)) }}>👎</div>
      </>}
    </div>
  );
}

function YourPost({ post }: { post: SocialPost }) {
  const { bumpUserPost } = usePairly();
  const ticks = useRef(0);
  useEffect(() => {
    const t = setInterval(() => {
      if (ticks.current++ >= 10) return clearInterval(t);
      bumpUserPost(post.id, 1 + Math.floor(Math.random() * 3), Math.random() < 0.3 ? 1 : 0);
    }, 700);
    return () => clearInterval(t);
  }, [post.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const fb = post.votesUp > 3 ? ["Great fit", "Add a layer", "Try darker shoes"] : [];
  return (
    <div className="mb-8 rounded-3xl bg-card p-4 shadow-soft ring-2 ring-primary">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Your post</p>
      <div className="mt-3 flex gap-3">
        <Photo src={post.image} alt="Your post" className="h-24 w-20 rounded-xl" />
        <div className="flex-1">
          <p className="font-serif text-lg leading-snug">{post.question}</p>
          {post.pickImages && <div className="mt-2 flex gap-1">{post.pickImages.map((p) => <Photo key={p} src={p} alt="Pick" className="h-8 w-8 rounded-md" />)}</div>}
        </div>
      </div>
      <div className="mt-3"><VoteSplitBar up={post.votesUp} down={post.votesDown} /></div>
      <div className="mt-3 flex flex-wrap gap-2">{fb.length ? fb.map((f) => <Chip key={f}>{f}</Chip>) : <span className="text-xs text-muted-foreground">Waiting for votes…</span>}</div>
    </div>
  );
}
