import { describe, expect, it } from "vitest";
import { pathFor, stateFor } from "./screenPaths";

describe("screen paths", () => {
  it("maps onboarding screens to numbered URLs", () => {
    expect(pathFor("welcome", "style")).toBe("/onboarding-1");
    expect(pathFor("budget", "feed")).toBe("/onboarding-4");
  });
  it("maps generated looks to /menu1-style-1", () => expect(pathFor("results", "style")).toBe("/menu1-style-1"));
  it("maps tabs to menu URLs", () => expect(pathFor("upload", "me")).toBe("/menu4-me"));
  it("round-trips feed", () => expect(stateFor("/menu3-feed", "welcome")).toEqual({ screen: "upload", tab: "feed" }));
});
