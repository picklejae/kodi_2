import { JASON_FITS } from "@/data/jason";
import type { SavedOutfit } from "@/data/saved";
import type { SocialPost, Feedback } from "@/data/social";
import type { GeneratedLook } from "./styleGeneration";

export function savedLook(look: GeneratedLook): SavedOutfit | null {
  if (look.status !== "success" || !look.image) return null;
  const realImage = look.id === "jason-closet" || look.id === "set-a-0" ? JASON_FITS[0]?.image : look.id === "set-b-0" ? JASON_FITS[5]?.image : undefined;
  return {
    id: `${look.id}:${look.image.length}`, imageUrl: look.image, lookName: look.name, explanation: look.explanation,
    ownedName: look.items.find((item) => item.owned)?.name ?? "Your piece", products: look.items,
    ...(realImage ? { feedbackImage: realImage } : {}),
  };
}

export function feedbackPost(posts: SocialPost[], outfit: SavedOutfit, newPost: SocialPost): { posts: SocialPost[]; postId: string; duplicate: boolean } {
  const existing = outfit.feedbackImage ? posts.find((post) => post.isUserPost && post.image === outfit.feedbackImage) : undefined;
  return existing ? { posts, postId: existing.id, duplicate: true } : { posts: [newPost, ...posts], postId: newPost.id, duplicate: false };
}

export function appendComment(posts: SocialPost[], id: string, feedback: Feedback): SocialPost[] {
  const text = feedback.text.trim();
  if (!text) return posts;
  return posts.map((post) => post.id === id ? { ...post, feedback: [...post.feedback, { ...feedback, text }] } : post);
}

export function myPosts(posts: SocialPost[]): SocialPost[] {
  return posts.filter((post) => post.isUserPost).sort((a, b) => {
    const age = (post: SocialPost) => post.daysAgo !== undefined ? post.daysAgo * 86400000 : post.createdAt ? Date.now() - Date.parse(post.createdAt) : 0;
    return age(a) - age(b);
  });
}

export function timeAgo(entry: { createdAt?: string; daysAgo?: number }): string {
  if (entry.daysAgo !== undefined) return `${entry.daysAgo} days ago`;
  if (!entry.createdAt) return "Just now";
  const minutes = Math.max(0, Math.floor((Date.now() - Date.parse(entry.createdAt)) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
}
const BUMP_GROUPS = [["RNPS", "low"], ["TNDF", "low"], ["RCDS", "high"], ["TNPF", "low"]] as const;
export const BUMP_FEEDBACK = ["Great fit", "Add a layer", "Try darker shoes"];
/** One simulated round of community responses on the user's own post. */
export function bumpPost(posts: SocialPost[], id: string, step: number): SocialPost[] {
  return posts.map((p) => {
    if (p.id !== id) return p;
    const [styleType, exploreLevel] = BUMP_GROUPS[step % BUMP_GROUPS.length] ?? BUMP_GROUPS[0];
    const down = step % 2 === 1 ? 1 : 0;
    const next = { ...p, votesUp: p.votesUp + 2, votesDown: p.votesDown + down, voteGroups: [...p.voteGroups, { styleType, exploreLevel, yes: 2, no: down }] };
    if (next.votesUp > 3 && !next.feedback.some((f) => f.author === "@kodi.crew")) {
      next.feedback = [...next.feedback, ...BUMP_FEEDBACK.map((text, i) => ({ text, author: "@kodi.crew", styleType: (BUMP_GROUPS[i] ?? BUMP_GROUPS[0])[0], exploreLevel: (BUMP_GROUPS[i] ?? BUMP_GROUPS[0])[1], createdAt: new Date().toISOString() }))];
    }
    return next;
  });
}
