import { describe, expect, it } from "vitest";
import { POSTS, TRENDS } from "@/data/social";
import { topRated, upPercent } from "./social";
describe("social", () => {
  it("rounds thumbs-up percentage", () => { expect(upPercent(92, 8)).toBe(92); expect(upPercent(0, 0)).toBe(0); });
  it("top rated shows 6 posts, highest first", () => {
    const t = topRated(POSTS);
    expect(t).toHaveLength(6);
    expect(upPercent(t[0]!.votesUp, t[0]!.votesDown)).toBeGreaterThanOrEqual(upPercent(t[5]!.votesUp, t[5]!.votesDown));
  });
  it("has 15 posts and 5 trends", () => { expect(POSTS).toHaveLength(15); expect(TRENDS).toHaveLength(5); });
});
