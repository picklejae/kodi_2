import { describe, expect, it } from "vitest";
import { DEMO_UPLOAD_HASHES, demoSetForImage } from "./demoSets";
import { SAMPLES } from "./samples";

describe("demo set routing", () => {
  it("routes only Jason's exact pieces to his avatar sets", () => {
    expect(demoSetForImage(DEMO_UPLOAD_HASHES["set-a"])).toBe("set-a");
    expect(demoSetForImage(DEMO_UPLOAD_HASHES["set-b"])).toBe("set-b");
    expect(demoSetForImage("jason-chinos")).toBe("set-a");
  });
  it("never gives Jason's avatars to other samples or unknown uploads", () => {
    for (const sample of SAMPLES) expect(demoSetForImage(sample.id)).toBeUndefined();
    expect(demoSetForImage("0".repeat(64))).toBeUndefined();
  });
});
