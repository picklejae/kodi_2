import { useEffect, useRef, useState } from "react";
import { Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "@/components/pairly/BottomSheet";
import { Chip } from "@/components/pairly/Chip";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { VoteSplitBar } from "@/components/pairly/VoteSplitBar";
import { OCCASIONS } from "@/data/samples";
import { FEEDBACK_CHIPS, TRENDS, type SocialPost, type Feedback, type VoteGroup } from "@/data/social";
import { DEFAULT_CODE, type StyleTypeCode } from "@/data/styleTypes";
import { topRated, upPercent, filterPosts, filteredVotes, filteredFeedback, latestUserPost, type SocialFilter } from "@/lib/social";
import { StyleBadge, FeedbackSummary, FeedbackList } from "@/components/pairly/SocialFeedback";
import { SwipePhotoCard } from "@/components/pairly/SwipePhotoCard";
import { usePairly } from "@/store/PairlyContext";

type Detail = { title: string; image: string; groups: VoteGroup[]; feedback: Feedback[]; sub?: string; author?: string; type?: StyleTypeCode };
const occLabel = (o: SocialPost["occasion"]) => OCCASIONS.find((x) => x.id === o)?.label;

export function Social() {
  const { posts, styleType, userVotes, vote, addFeedback, openDraft } = usePairly();
  const type = styleType ?? DEFAULT_CODE;
  const [filter, setFilter] = useState<SocialFilter>("similar");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);
  const trendsRef = useRef<HTMLElement>(null);
  const others = filterPosts(posts.filter((p) => !p.isUserPost), type, filter);
  const mine = latestUserPost(posts);
  const stack = others.filter((p) => !userVotes[p.id]);

  useEffect(() => {
    if (!feedbackFor) return;
    const t = setTimeout(() => setFeedbackFor(null), 2000);
    return () => clearTimeout(t);
  }, [feedbackFor]);

  const doVote = (id: string, v: "up" | "down") => { vote(id, v); setFeedbackFor(id); };

  return (
    <div className="px-6 pt-12">
      {mine && <YourPost key={mine.id} post={mine} filter={filter} type={type} onOpen={() => setDetail({ title: mine.question, image: mine.image, groups: mine.voteGroups, feedback: mine.feedback, author: mine.author, type: mine.styleType })} />}

      <h1 className="font-serif text-4xl">Rate the fit</h1>
      <p className="mt-1 text-sm text-muted-foreground">Swipe right if it works, left if it doesn't.</p>
      <div className="mt-4 flex gap-2" role="group" aria-label="Social filter">
        <PillButton className="h-10 flex-1 px-3 text-xs" variant={filter === "similar" ? "primary" : "outline"} aria-pressed={filter === "similar"} onClick={() => { setFilter("similar"); setFeedbackFor(null); }}>People like me</PillButton>
        <PillButton className="h-10 flex-1 px-3 text-xs" variant={filter === "adventurous" ? "primary" : "outline"} aria-pressed={filter === "adventurous"} onClick={() => { setFilter("adventurous"); setFeedbackFor(null); }}>More adventurous</PillButton>
      </div>

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
            <button key={t.id} onClick={() => setDetail({ title: t.title, image: t.image, groups: t.voteGroups, feedback: t.feedback, sub: t.description })} className="w-36 shrink-0 snap-start text-left">
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
          {topRated(others.map((p) => { const tally = filteredVotes(p.voteGroups, type, filter); return { ...p, votesUp: tally.yes, votesDown: tally.no }; })).map((p) => (
            <PillButton variant="ghost" key={p.id} onClick={() => setDetail({ title: p.question, image: p.image, groups: p.voteGroups, feedback: p.feedback, author: p.author, type: p.styleType })} className="block h-auto px-0 text-left font-normal">
              <Photo src={p.image} alt={p.question} className="aspect-[4/5] rounded-2xl shadow-soft" />
              <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs"><span className="text-muted-foreground">{p.author}</span><StyleBadge type={p.styleType} /></div><p className="mt-1 text-xs font-semibold">{upPercent(p.votesUp, p.votesDown)}% 👍</p>
            </PillButton>
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
          {detail.author && detail.type && <div className="flex flex-wrap items-center gap-2 text-xs"><span>{detail.author}</span><StyleBadge type={detail.type} /></div>}
          <Photo src={detail.image} alt={detail.title} className="mt-4 h-72 rounded-2xl" />
          <div className="mt-4"><VoteSplitBar up={filteredVotes(detail.groups, type, filter).yes} down={filteredVotes(detail.groups, type, filter).no} /></div>
          <FeedbackSummary groups={detail.groups} type={type} />
          <FeedbackList feedback={filteredFeedback(detail.feedback, type, filter)} />
        </>}
      </BottomSheet>
    </div>
  );
}

function SwipeCard({ post, top, onVote }: { post: SocialPost; top: boolean; onVote: (v: "up" | "down") => void }) {
  return (
    <SwipePhotoCard image={post.image} alt={post.question} top={top} onSwipe={(positive) => onVote(positive ? "up" : "down")} positiveStamp="👍" negativeStamp="👎">
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-5 pt-16 text-background">
        <div className="flex flex-wrap items-center gap-2"><span className="text-xs opacity-90">{post.author}</span><StyleBadge type={post.styleType} /></div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {post.occasion && <Chip className="border-transparent bg-background/90">{occLabel(post.occasion)}</Chip>}
        </div>
        <p className="mt-2 font-serif text-xl leading-snug">{post.question}</p>
      </div>
    </SwipePhotoCard>
  );
}

function YourPost({ post, filter, type, onOpen }: { post: SocialPost; filter: SocialFilter; type: StyleTypeCode; onOpen: () => void }) {
  const { bumpUserPost } = usePairly();
  const ticks = useRef(0);
  useEffect(() => {
    const t = setInterval(() => {
      if (ticks.current++ >= 10) return clearInterval(t);
      bumpUserPost(post.id, 1 + Math.floor(Math.random() * 3), Math.random() < 0.3 ? 1 : 0);
    }, 700);
    return () => clearInterval(t);
  }, [post.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const tally = filteredVotes(post.voteGroups, type, filter);
  return (
    <article aria-label="Your post" className="mb-8 rounded-3xl bg-card p-4 shadow-soft ring-2 ring-primary">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Your post</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs"><span>{post.author}</span><StyleBadge type={post.styleType} /></div>
      <div className="mt-3 flex gap-3">
        <Photo src={post.image} alt="Your post" className="h-24 w-20 rounded-xl" />
        <div className="flex-1">
          <p className="font-serif text-lg leading-snug">{post.question}</p>
          {post.pickImages && <div className="mt-2 flex gap-1">{post.pickImages.map((p) => <Photo key={p} src={p} alt="Pick" className="h-8 w-8 rounded-md" />)}</div>}
        </div>
      </div>
      <div className="mt-3"><VoteSplitBar up={tally.yes} down={tally.no} /></div>
      <FeedbackSummary groups={post.voteGroups} type={type} />
      <FeedbackList feedback={filteredFeedback(post.feedback, type, filter)} />
      <PillButton variant="ghost" className="mt-2 h-8 text-xs" onClick={onOpen}>View feedback</PillButton>
    </article>
  );
}
