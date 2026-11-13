import { describe, expect, it } from "vitest";
import { POSTS, TRENDS } from "@/data/social";
import { topRated, upPercent, similarStyle, filterPosts, filteredVotes, filteredFeedback, voteSummary, latestUserPost } from "./social";
describe("social", () => {
  it("rounds thumbs-up percentage", () => { expect(upPercent(92, 8)).toBe(92); expect(upPercent(0, 0)).toBe(0); });
  it("top rated shows 6 posts, highest first", () => {
    const t = topRated(POSTS);
    expect(t).toHaveLength(6);
    const first = t[0]; const last = t[5];
    if (!first || !last) throw new Error("Missing top-rated posts");
    expect(upPercent(first.votesUp, first.votesDown)).toBeGreaterThanOrEqual(upPercent(last.votesUp, last.votesDown));
  });
  it("has 15 member posts, 20 credited ALT ME photos and 5 trends", () => {
    expect(POSTS.filter((p) => !p.credit)).toHaveLength(15);
    expect(POSTS.filter((p) => p.credit && p.department === "womenswear")).toHaveLength(10);
    expect(POSTS.filter((p) => p.credit && p.department === "menswear")).toHaveLength(10);
    expect(POSTS.filter((p) => p.credit).every((p) => p.votesUp === 0 && p.feedback.length === 0 && p.credit?.licenseUrl.startsWith("https://"))).toBe(true);
    expect(TRENDS).toHaveLength(5);
  });
  it("People like me includes styles sharing at least three axes", () => {
    expect(similarStyle("TNPF", "TNDF")).toBe(true);
    expect(similarStyle("TNPF", "RNDS")).toBe(false);
    expect(filterPosts(POSTS.filter((p) => !p.credit), "TNPF", "similar").map((p) => p.id)).toEqual(["p1", "p4", "p6", "p9", "p10", "p11", "p12", "p15"]);
  });
  it("More adventurous includes only high exploration posters and voters", () => {
    expect(filterPosts(POSTS.filter((p) => !p.credit), "TNPF", "adventurous").map((p) => p.id)).toEqual(["p2", "p6", "p8", "p14"]);
    const groups = [{ styleType: "TNPF" as const, exploreLevel: "low" as const, yes: 8, no: 4 }, { styleType: "RCDS" as const, exploreLevel: "high" as const, yes: 4, no: 5 }];
    expect(filteredVotes(groups, "TNPF", "similar")).toEqual({ yes: 8, no: 4 });
    expect(filteredVotes(groups, "TNPF", "adventurous")).toEqual({ yes: 4, no: 5 });
    expect(voteSummary(groups, "TNPF")).toEqual({ yes: 8, total: 12, adventurousTotal: 9, adventurousNo: 56 });
    expect(filteredFeedback([{ text: "Great fit", styleType: "TNPF", exploreLevel: "low" }, { text: "Add a layer", styleType: "RCDS", exploreLevel: "high" }], "TNPF", "adventurous").map((f) => f.text)).toEqual(["Add a layer"]);
  });
  it("pins only the latest user post and keeps older posts available", () => {
    const first = POSTS[0];
    if (!first) throw new Error("Missing mock post");
    const posts = [{ ...first, id: "new", isUserPost: true }, { ...first, id: "old", isUserPost: true }];
    expect(latestUserPost(posts)?.id).toBe("new");
    expect(posts.filter((p) => p.isUserPost)).toHaveLength(2);
  });
  it("attributed mock votes add up to the displayed totals", () => {
    POSTS.forEach((p) => {
      expect(p.voteGroups.reduce((n, g) => n + g.yes, 0)).toBe(p.votesUp);
      expect(p.voteGroups.reduce((n, g) => n + g.no, 0)).toBe(p.votesDown);
    });
  });
});
