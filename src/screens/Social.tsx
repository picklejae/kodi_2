import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet, PhotoCard, PrimaryButton, SecondaryButton, TextField, TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";
import type { SocialPost } from "@/data/social";
import { DEFAULT_CODE } from "@/data/styleTypes";
import { filterPosts, type SocialFilter } from "@/lib/social";
import { myPosts, timeAgo } from "@/lib/feedFlow";
import { StyleBadge } from "@/components/pairly/SocialFeedback";
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
  const [highlight, setHighlight] = useState<string | null>(null);
  const postsRef = useRef<HTMLElement>(null);
  const stack = filterPosts(posts.filter((post) => !post.isUserPost), type, filter).filter((post) => !userVotes[post.id]);
  const mine = myPosts(posts);
  const detail = posts.find((post) => post.id === detailId);
  useEffect(() => {
    if (!highlightedPost || !feedHintDismissed) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`feed-${highlightedPost}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <h1 className="text-display lg:col-span-2">Feed</h1>
      <div className="mt-screen flex flex-wrap gap-screen lg:col-start-2" role="group" aria-label="Feed filter">
        <TextLinkButton aria-pressed={filter === "similar"} onClick={() => setFilter("similar")}>People like me</TextLinkButton>
        <TextLinkButton aria-pressed={filter === "adventurous"} onClick={() => setFilter("adventurous")}>More adventurous</TextLinkButton>
      </div>
      <div className="relative mx-auto mt-screen aspect-[3/4] w-full max-w-card lg:col-start-1 lg:row-span-6">
        {stack.length === 0 ? <div className="flex h-full flex-col items-center justify-center bg-secondary text-center"><p className="text-heading">You're all caught up</p><TextLinkButton onClick={() => postsRef.current?.scrollIntoView({ behavior: "smooth" })}>View my posts</TextLinkButton></div> : stack.slice(0, 2).reverse().map((post, index, arr) => <SwipePhotoCard key={post.id} image={post.image} alt={post.question} top={index === arr.length - 1} onSwipe={(positive) => vote(post.id, positive ? "up" : "down")} positiveStamp="👍" negativeStamp="👎" />)}
      </div>
      {stack[0] && <div className="mt-screen"><div className="flex flex-wrap items-center gap-screen text-caption"><span>{stack[0].author}</span><StyleBadge type={stack[0].styleType} /></div><p className="text-body-sm">{stack[0].question}</p></div>}
      <div className="mt-screen flex items-center justify-between" aria-label="Outfit feedback">
        <SecondaryButton aria-label="Thumbs down" title="Thumbs down" disabled={!stack[0]} onClick={() => stack[0] && vote(stack[0].id, "down")}><ThumbsDown /></SecondaryButton>
        <TextLinkButton disabled={!stack[0]} onClick={() => { if (stack[0]) { setCommentId(stack[0].id); setComment(""); } }}><MessageCircle />Comment</TextLinkButton>
        <SecondaryButton aria-label="Thumbs up" title="Thumbs up" disabled={!stack[0]} onClick={() => stack[0] && vote(stack[0].id, "up")}><ThumbsUp /></SecondaryButton>
      </div>
      <div className="mt-screen lg:col-start-2"><PrimaryButton aria-label="New post" onClick={() => openDraft({ image: null })}><Plus />New post</PrimaryButton></div>
      <section ref={postsRef} className="mt-screen lg:col-start-2" aria-label="My posts">
        <h2 className="text-title">My posts</h2>
        <div className="flex flex-col gap-screen mt-screen">
          {mine.map((post) => <article id={`feed-${post.id}`} key={post.id} className={`scroll-mt-screen ${highlight === post.id ? "outline outline-border-strong" : ""}`}>
            <PhotoCard src={post.image} alt={post.question} ratio="look" onClick={() => setDetailId(post.id)} />
            <div className="mt-screen flex flex-wrap items-center gap-screen text-caption"><span>{post.author}</span><StyleBadge type={post.styleType} /><span className="text-muted-foreground">{timeAgo(post)}</span></div>
            <TextLinkButton onClick={() => setDetailId(post.id)}>{post.question}</TextLinkButton>
            <VoteSplitBar up={post.votesUp} down={post.votesDown} />
            <Comments post={post} />
          </article>)}
        </div>
      </section>
      <BottomSheet open={!!commentId} onClose={() => setCommentId(null)} title="Comment on outfit">
        <form className="flex flex-col gap-screen" onSubmit={(event) => { event.preventDefault(); postComment(); }}>
          <h2 className="text-heading">Comment on outfit</h2>
          <TextField autoFocus label="What would make this outfit better?" placeholder="What would make this outfit better?" value={comment} onChange={(event) => setComment(event.target.value)} />
          <PrimaryButton type="submit" disabled={!comment.trim()}>Post</PrimaryButton>
        </form>
      </BottomSheet>
      <BottomSheet open={!!detail} onClose={() => setDetailId(null)} title={detail?.question ?? "Post details"}>
        {detail && <div className="flex flex-col gap-screen"><h2 className="text-heading">{detail.question}</h2><PhotoCard src={detail.image} alt={detail.question} /><div className="flex flex-wrap items-center gap-screen text-caption"><span>{detail.author}</span><StyleBadge type={detail.styleType} /><span>{timeAgo(detail)}</span></div><VoteSplitBar up={detail.votesUp} down={detail.votesDown} /><Comments post={detail} /><SecondaryButton onClick={() => { setCommentId(detail.id); setDetailId(null); setComment(""); }}><MessageCircle />Add comment</SecondaryButton></div>}
      </BottomSheet>
      <BottomSheet open={!feedHintDismissed} onClose={dismissFeedHint} title="Swipe outfits">
        <div className="flex flex-col items-center gap-screen text-center"><div className="flex gap-screen" aria-hidden="true"><ArrowLeft /><ArrowRight /></div><p className="text-heading">Swipe right if you love it, left to skip</p><SecondaryButton aria-label="Dismiss swipe hint" onClick={dismissFeedHint}>Explore outfits</SecondaryButton></div>
      </BottomSheet>
    </div>
  );
}
function Comments({ post }: { post: SocialPost }) {
  return <div className="mt-screen flex flex-col gap-screen" aria-label="Comments">{post.feedback.map((feedback, index) => <div key={`${feedback.author}:${index}`}><div className="flex flex-wrap items-center gap-screen text-caption"><span>{feedback.author ?? "@member"}</span><StyleBadge type={feedback.styleType} /><span className="text-muted-foreground">{timeAgo(feedback)}</span></div><p className="text-body-sm">{feedback.text}</p></div>)}</div>;
}
