import { describe, expect, it } from "vitest";
import { AVATAR_REFERENCE, avatarPresentation } from "./avatar";
describe("avatar rendering rules", () => {
  it("uses a1 as the fixed visual style reference", () => {
    expect(AVATAR_REFERENCE.endsWith("/a1.jpg")).toBe(true);
  });
  it("keeps a female build for womenswear and male for menswear", () => {
    expect(avatarPresentation("womenswear")).toContain("average female build");
    expect(avatarPresentation("menswear")).toContain("average male build");
  });
});