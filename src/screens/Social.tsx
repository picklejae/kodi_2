import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet, Chip, SectionLabel, PhotoCard, PrimaryButton, SecondaryButton, TextField, TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";
import { FEEDBACK_CHIPS, type SocialPost } from "@/data/social";
import { DEFAULT_CODE } from "@/data/styleTypes";
import { filterPosts, type SocialFilter } from "@/lib/social";
import { myPosts, timeAgo } from "@/lib/feedFlow";
import { VoteSplitBar } from "@/components/pairly/VoteSplitBar";
import { SwipePhotoCard } from "@/components/pairly/SwipePhotoCard";
import { usePairly } from "@/store/PairlyContext";

export function Social() {
  const { posts, styleType, userVotes, vote, addFeedback, openDraft, feedHintDismissed, dismissFeedHint, highlightedPost } = usePairly();
  const type = styleType ?? DEFAULT_CODE;
  const [filter, setFilter] = useState<SocialFilter>("similar");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [lastVoted, setLastVoted] = useState<string | null>(null);
  const [pinnedSheet, setPinnedSheet] = useState(false);
  const castVote = (id: string, v: "up" | "down") => { vote(id, v); setLastVoted(id); };
  const [highlight, setHighlight] = useState<string | null>(null);
  const others = posts.filter((post) => !post.isUserPost);
  const stack = (filter === "similar" ? filterPosts(others, type, filter) : [...others].sort((a, b) => b.votesUp + b.votesDown - (a.votesUp + a.votesDown))).filter((post) => !userVotes[post.id]);
  const mine = myPosts(posts);
  const [pinIdx, setPinIdx] = useState(0);
  useEffect(() => setPinIdx(0), [mine.length]);
  const cur = mine[Math.min(pinIdx, Math.max(0, mine.length - 1))];
  const detail = posts.find((post) => post.id === detailId);
  useEffect(() => {
    if (!highlightedPost || !feedHintDismissed) return;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setHighlight(highlightedPost);
    });
    const timer = setTimeout(() => setHighlight(null), 3000);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [highlightedPost, feedHintDismissed]);
  const postComment = () => {
    if (!commentId || !comment.trim()) return;
    addFeedback(commentId, comment);
    setCommentId(null); setComment(""); toast("Thanks for the feedback");
  };
  return (
    <div className="px-screen pt-topbar pb-tabbar lg:grid lg:grid-flow-dense lg:grid-cols-2 lg:items-start lg:gap-x-screen">
      <h1 className="text-title font-bold lg:col-span-2">Feed</h1>
      <div className="mt-screen lg:col-span-2"><PrimaryButton className="capitalize" aria-label="New post" onClick={() => openDraft({ image: null })}><Plus />New post</PrimaryButton></div>
      {cur && <div className="relative mt-screen flex items-center gap-screen border border-border p-screen lg:col-span-2" aria-label="Your look">
        <img src={cur.image} alt={cur.question} className="aspect-[3/4] w-touch shrink-0 rounded-none bg-secondary object-cover" />
        <div className="flex min-w-0 flex-1 flex-col"><SectionLabel>Your look</SectionLabel><p className="text-body-sm">Yes {cur.votesUp} · No {cur.votesDown}</p><TextLinkButton onClick={() => setPinnedSheet(true)}>View feedback</TextLinkButton></div>
        {mine.length > 1 && <><button type="button" aria-label="Previous look" className="absolute top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors duration-200 ease-kodi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring left-0 -translate-x-1/2" onClick={() => setPinIdx((pinIdx - 1 + mine.length) % mine.length)}><ChevronLeft className="size-4" /></button><button type="button" aria-label="Next look" className="absolute top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors duration-200 ease-kodi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring right-0 translate-x-1/2" onClick={() => setPinIdx((pinIdx + 1) % mine.length)}><ChevronRight className="size-4" /></button></>}
      </div>}
      {!cur && <div className="mt-screen flex items-center justify-between gap-screen border border-border p-screen lg:col-span-2" aria-label="Your look"><p className="text-body-sm">Post your look to get votes</p><TextLinkButton onClick={() => openDraft({ image: null })}>Post a look</TextLinkButton></div>}
      <div className="mt-screen flex w-full gap-screen border-b border-border lg:col-start-2" role="group" aria-label="Feed filter">
        {([["similar", "For you"], ["adventurous", "Trending"]] as const).map(([v, label]) => <button key={v} type="button" aria-pressed={filter === v} onClick={() => setFilter(v)} className={cn("-mb-px h-touch border-b-2 text-body-sm font-medium transition-colors duration-200 ease-kodi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", filter === v ? "border-foreground text-foreground" : "border-transparent text-muted-foreground")}>{label}</button>)}
      </div>
      <div className="relative mx-auto mt-screen aspect-[3/4] w-full max-w-card lg:col-start-1 lg:row-span-6">
        {stack.length === 0 ? <div className="flex h-full flex-col items-center justify-center bg-secondary text-center"><p className="text-heading">You're all caught up</p><TextLinkButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>View my posts</TextLinkButton></div> : stack.slice(0, 2).reverse().map((post, index, arr) => <SwipePhotoCard key={post.id} image={post.image} alt={post.question} top={index === arr.length - 1} onSwipe={(positive) => castVote(post.id, positive ? "up" : "down")} positiveStamp="👍" negativeStamp="👎" />)}
      </div>
      {stack[0] && <div className="mt-screen"><div className="flex flex-wrap items-center gap-screen text-caption"><span>{stack[0].author}</span></div><p className="text-body-sm">{stack[0].question}</p></div>}
      <div className="mt-screen flex items-center justify-between" aria-label="Outfit feedback">
        <SecondaryButton aria-label="Thumbs down" title="Thumbs down" disabled={!stack[0]} onClick={() => stack[0] && castVote(stack[0].id, "down")}><ThumbsDown /></SecondaryButton>
        <TextLinkButton disabled={!stack[0]} onClick={() => { if (stack[0]) { setCommentId(stack[0].id); setComment(""); } }}><MessageCircle />Comment</TextLinkButton>
        <SecondaryButton aria-label="Thumbs up" title="Thumbs up" disabled={!stack[0]} onClick={() => stack[0] && castVote(stack[0].id, "up")}><ThumbsUp /></SecondaryButton>
      </div>
      {lastVoted && <div className="mt-screen flex flex-wrap items-center gap-screen" aria-label="Quick feedback">
        {FEEDBACK_CHIPS.slice(0, 3).map((chip) => <Chip key={chip} onClick={() => { addFeedback(lastVoted, chip); setLastVoted(null); toast("Thanks for the feedback"); }}>{chip}</Chip>)}
        <TextLinkButton onClick={() => setLastVoted(null)}>Skip</TextLinkButton>
      </div>}
      <BottomSheet open={!!commentId} onClose={() => setCommentId(null)} title="Comment on outfit">
        <form className="flex flex-col gap-screen" onSubmit={(event) => { event.preventDefault(); postComment(); }}>
          <h2 className="text-heading">Comment on outfit</h2>
          <TextField autoFocus label="What would make this outfit better?" placeholder="What would make this outfit better?" value={comment} onChange={(event) => setComment(event.target.value)} />
          <PrimaryButton className="capitalize" type="submit" disabled={!comment.trim()}>Post</PrimaryButton>
        </form>
      </BottomSheet>
      <BottomSheet open={!!detail} onClose={() => setDetailId(null)} title={detail?.question ?? "Post details"}>
        {detail && <div className="flex flex-col gap-screen"><h2 className="text-heading">{detail.question}</h2><PhotoCard src={detail.image} alt={detail.question} /><div className="flex flex-wrap items-center gap-screen text-caption"><span>{detail.author}</span><span>{timeAgo(detail)}</span></div><VoteSplitBar up={detail.votesUp} down={detail.votesDown} /><Comments post={detail} /><SecondaryButton onClick={() => { setCommentId(detail.id); setDetailId(null); setComment(""); }}><MessageCircle />Add comment</SecondaryButton></div>}
      </BottomSheet>
      <BottomSheet open={pinnedSheet && !!cur} onClose={() => setPinnedSheet(false)} title="Feedback on your look">
        {cur && <div className="flex flex-col gap-screen"><h2 className="text-heading">Feedback on your look</h2><PhotoCard src={cur.image} alt={cur.question} ratio="look" /><VoteSplitBar up={cur.votesUp} down={cur.votesDown} />
          <Comments post={cur} /></div>}
      </BottomSheet>
      <BottomSheet open={!feedHintDismissed} onClose={dismissFeedHint} title="Swipe outfits">
        <div className="flex flex-col items-center gap-screen text-center"><div className="flex gap-screen" aria-hidden="true"><ChevronLeft /><ChevronRight /></div><p className="text-heading">Swipe right if you love it, left to skip</p><SecondaryButton aria-label="Dismiss swipe hint" onClick={dismissFeedHint}>Explore outfits</SecondaryButton></div>
      </BottomSheet>
    </div>
  );
}
function Comments({ post }: { post: SocialPost }) {
  return <div className="mt-screen flex flex-col gap-screen" aria-label="Comments">{post.feedback.map((feedback, index) => <div key={`${feedback.author}:${index}`}><div className="flex flex-wrap items-center gap-screen text-caption"><span>{feedback.author ?? "@member"}</span><span className="text-muted-foreground">{timeAgo(feedback)}</span></div><p className="text-body-sm">{feedback.text}</p></div>)}</div>;
}
