import { describe, expect, it } from "vitest";
import { devButtonVisible, parsePresetParams } from "./devPresets";

describe("parsePresetParams", () => {
  it("opens the time-skip Feed preset without the budget step", () => {
    expect(parsePresetParams("?screen=feed-later")?.preset).toBe("feed-later");
    expect(parsePresetParams("?screen=looks")?.preset).toBe("saved");
    expect(parsePresetParams("?screen=set-a")?.preset).toBe("set-a");
    expect(parsePresetParams("?screen=set-b")?.preset).toBe("set-b");
  });
  it("opens Saved from new and legacy URL presets", () => {
    expect(parsePresetParams("?screen=saved")?.preset).toBe("saved");
    expect(parsePresetParams("?screen=closet")?.preset).toBe("saved");
  });
  it("opens Feed from new and legacy URL presets", () => {
    expect(parsePresetParams("?screen=feed")?.preset).toBe("feed");
    expect(parsePresetParams("?screen=social")?.preset).toBe("feed");
    expect(parsePresetParams("?screen=style")?.preset).toBe("upload");
  });
  it("reads screen, type and sample", () => {
    const r = parsePresetParams("?screen=results&type=RNDS&sample=coat");
    expect(r?.preset).toBe("results");
    expect(r?.type).toBe("RNDS");
    expect(r?.sample.id).toBe("coat");
  });
  it("defaults to TNPF and navy blazer", () => {
    const r = parsePresetParams("?screen=upload&type=XXXX");
    expect(r?.type).toBe("TNPF");
    expect(r?.sample.id).toBe("blazer");
  });
  it("ignores unknown screens", () => expect(parsePresetParams("?screen=nope")).toBeNull());
});

describe("devButtonVisible", () => {
  it("hidden with ?demo=1", () => expect(devButtonVisible("?demo=1", null)).toBe(false));
  it("hidden when toggled off", () => expect(devButtonVisible("", "1")).toBe(false));
  it("shown by default", () => expect(devButtonVisible("", null)).toBe(true));
});
