import { describe, expect, it } from "vitest";
import { jasonPosts } from "@/data/jasonPosts";
import { JASON_FITS } from "@/data/jason";
import { demoSetLooks } from "@/data/demoSets";
import { appendComment, feedbackPost, myPosts, savedLook } from "./feedFlow";

describe("Looks to Feed", () => {
  it("seeds heritage at 2 days with 38 positive and 5 negative votes and four comments", () => {
    const post = jasonPosts("TNDF")[0];
    expect(post).toMatchObject({ author: "@jason", styleType: "TNDF", daysAgo: 2, votesUp: 38, votesDown: 5, image: JASON_FITS[0]?.image });
    expect(post?.feedback.map((comment) => comment.author)).toEqual(["@minjun", "@daniel.k", "@theo", "@sam_w"]);
    expect(post?.feedback[0]?.text).toBe("The waxed jacket with wide chinos is a great balance. Roll the hem once to show the boots.");
  });
  it("seeds leather at 3 days with 45 positive and 7 negative votes and three comments", () => {
    const post = jasonPosts()[1];
    expect(post).toMatchObject({ daysAgo: 3, votesUp: 45, votesDown: 7, image: JASON_FITS[5]?.image });
    expect(post?.feedback.map((comment) => comment.author)).toEqual(["@leo.p", "@jun", "@marco"]);
  });
  it.each(["set-a", "set-b"] as const)("%s closet favorite keeps avatar and posts the real photo without duplicate", (set) => {
    const look = demoSetLooks(set)[0];
    if (!look) throw new Error("Missing look");
    const outfit = savedLook(look);
    if (!outfit) throw new Error("Missing saved outfit");
    expect(outfit.imageUrl).toBe(look.image);
    expect(outfit.feedbackImage).toBe(JASON_FITS[set === "set-a" ? 0 : 5]?.image);
    const posts = jasonPosts(); const base = posts[0];
    if (!base) throw new Error("Missing post");
    const result = feedbackPost(posts, outfit, { ...base, id: "new", image: outfit.feedbackImage ?? outfit.imageUrl });
    expect(result.duplicate).toBe(true);
    expect(result.posts).toHaveLength(2);
    expect(result.postId).toBe(set === "set-a" ? "jason-heritage" : "jason-leather");
  });
  it("other looks post their avatar newest first", () => {
    const look = demoSetLooks("set-a")[1]; const base = jasonPosts()[0];
    if (!look || !base) throw new Error("Missing fixtures");
    const outfit = savedLook(look);
    if (!outfit) throw new Error("Missing outfit");
    expect(outfit.feedbackImage).toBeUndefined();
    const result = feedbackPost(jasonPosts(), outfit, { ...base, id: "new", image: outfit.imageUrl, daysAgo: 0 });
    expect(result.duplicate).toBe(false);
    expect(myPosts(result.posts).map((post) => post.id)).toEqual(["new", "jason-heritage", "jason-leather"]);
  });
  it("saves all comments with author and Style Type without changing votes", () => {
    const posts = jasonPosts();
    const result = appendComment(posts, "jason-heritage", { author: "@jason", styleType: "TNDF", exploreLevel: "low", text: "  Try suede shoes.  ", createdAt: "2026-11-13T06:09:00Z" });
    expect(result[0]?.feedback).toHaveLength(5);
    expect(result[0]?.feedback[4]).toMatchObject({ author: "@jason", styleType: "TNDF", text: "Try suede shoes." });
    expect(result[0]?.votesUp).toBe(38); expect(result[0]?.votesDown).toBe(5);
  });
});
import { bumpPost } from "./feedFlow";
describe("bumpPost", () => {
  it("adds votes and the three feedback lines once votesUp passes 3", () => {
    const base = { id: "u1", author: "@jason", image: "", styleType: "TNPF", occasion: null, question: "", votesUp: 0, votesDown: 0, topFeedback: [], exploreLevel: "low", voteGroups: [], feedback: [], isUserPost: true } as never;
    let posts = bumpPost([base], "u1", 0);
    expect(posts[0].votesUp).toBe(2);
    expect(posts[0].feedback).toHaveLength(0);
    posts = bumpPost(posts, "u1", 1);
    posts = bumpPost(posts, "u1", 2);
    expect(posts[0].votesUp).toBe(6);
    expect(posts[0].feedback.map((f) => f.text)).toEqual(["Great fit", "Add a layer", "Try darker shoes"]);
  });
});
