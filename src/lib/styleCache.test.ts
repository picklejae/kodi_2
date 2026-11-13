import { beforeEach, describe, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { webcrypto } from "node:crypto";
import { generationBody, hashImageBytes, originalImageIdentity, readStyleCache, styleCacheKey, writeStyleCache } from "./styleCache";
import { looksFromPlan, TIERS, type StylePlan } from "./styleGeneration";

const plan: StylePlan = { presentation: "studio", looks: TIERS.map((tier) => ({ tier, shift: "", name: tier, explanation: "outfit", styling: "style", items: [{ role: "Bottoms", name: "Trousers", highlight: true }, { role: "Shoes", name: "Shoes", highlight: true }] })) };
const looks = looksFromPlan(plan, "Coat", "owned", "menswear").map((look) => ({ ...look, status: "success" as const, image: `image-${look.tier}` }));
beforeEach(() => { vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("crypto", webcrypto); });
describe("Style result cache", () => {
  it("keeps at most 20 entries and drops the oldest", async () => {
    for (let i = 0; i < 21; i++) await writeStyleCache({ key: `key-${i}`, plan, looks, createdAt: i });
    expect(await readStyleCache("key-0")).toBeNull();
    for (let i = 1; i < 21; i++) expect((await readStyleCache(`key-${i}`))?.key).toBe(`key-${i}`);
  });
  it("never stores failed looks but preserves the plan and successful slots", async () => {
    await writeStyleCache({ key: "partial", plan, createdAt: 1, looks: looks.map((look) => look.tier === "step" ? { ...look, status: "failed" as const } : look) });
    expect((await readStyleCache("partial"))?.looks.map((look) => look.tier)).toEqual(["safe", "bold"]);
    expect((await readStyleCache("partial"))?.plan).toEqual(plan);
  });
  it("hashes original bytes with SHA-256 and does not fetch built-in samples", async () => {
    const bytes = new TextEncoder().encode("abc").buffer;
    expect(await hashImageBytes(bytes)).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    const fetcher = vi.fn(async () => new Response(bytes));
    vi.stubGlobal("fetch", fetcher);
    expect(await originalImageIdentity("photo-url")).toBe(await hashImageBytes(bytes));
    fetcher.mockClear();
    expect(await originalImageIdentity("photo-url", "coat")).toBe("coat");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("keys all generation inputs including trimmed mood, sent body and axis scores", () => {
    const inputs = { imageIdentity: "hash", preference: "menswear" as const, styleType: "TNPF" as const, occasion: "date", mood: " calm ", body: generationBody({ heightCm: 178, weightKg: 72 }), axisScores: [0.5, 0.5, 0.5, 0.5], category: "coat", name: "Coat" };
    expect(inputs.body).toBe("approximately 178 cm tall and 72 kg");
    expect(styleCacheKey(inputs)).toBe(styleCacheKey({ ...inputs, mood: "calm" }));
    for (const changed of [{ imageIdentity: "other" }, { preference: "womenswear" as const }, { styleType: "RNPS" as const }, { occasion: "coffee" }, { mood: "bold" }, { body: "different build" }, { axisScores: [1, 0, 0, 1] }]) expect(styleCacheKey({ ...inputs, ...changed })).not.toBe(styleCacheKey(inputs));
  });
});