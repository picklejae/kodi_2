import type { SocialPost, VoteGroup, Feedback } from "@/data/social";
import type { StyleTypeCode } from "@/data/styleTypes";

export type SocialFilter = "similar" | "adventurous";
export function latestUserPost(posts: SocialPost[]) {
  return posts.find((post) => post.isUserPost);
}
export function similarStyle(a: StyleTypeCode, b: StyleTypeCode) {
  return [...a].filter((letter, i) => b.charAt(i) === letter).length >= 3;
}
export function filterPosts(posts: SocialPost[], type: StyleTypeCode, filter: SocialFilter) {
  return posts.filter((p) => filter === "similar" ? similarStyle(p.styleType, type) : p.exploreLevel === "high");
}
export function filteredVotes(groups: VoteGroup[], type: StyleTypeCode, filter: SocialFilter) {
  return groups.filter((g) => filter === "similar" ? similarStyle(g.styleType, type) : g.exploreLevel === "high")
    .reduce((sum, g) => ({ yes: sum.yes + g.yes, no: sum.no + g.no }), { yes: 0, no: 0 });
}
export function filteredFeedback(feedback: Feedback[], type: StyleTypeCode, filter: SocialFilter) {
  return feedback.filter((f) => filter === "similar" ? similarStyle(f.styleType, type) : f.exploreLevel === "high");
}
export function voteSummary(groups: VoteGroup[], type: StyleTypeCode) {
  const exact = groups.filter((g) => g.styleType === type).reduce((sum, g) => ({ yes: sum.yes + g.yes, no: sum.no + g.no }), { yes: 0, no: 0 });
  const adventurous = filteredVotes(groups, type, "adventurous");
  return { yes: exact.yes, total: exact.yes + exact.no, adventurousTotal: adventurous.yes + adventurous.no,
    adventurousNo: upPercent(adventurous.no, adventurous.yes) };
}

export function upPercent(up: number, down: number) {
  const t = up + down;
  return t === 0 ? 0 : Math.round((up / t) * 100);
}
export function topRated<T extends { votesUp: number; votesDown: number }>(posts: T[], n = 6) {
  return [...posts].sort((a, b) => upPercent(b.votesUp, b.votesDown) - upPercent(a.votesUp, a.votesDown)).slice(0, n);
}
