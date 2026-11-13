import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PairlyProvider, usePairly } from "./PairlyContext";

const mocks = vi.hoisted(() => ({ plan: vi.fn(), render: vi.fn(), photo: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: (fn: unknown) => fn }));
vi.mock("@/lib/styleGeneration.functions", () => ({ planStyle: mocks.plan, renderStyleLook: mocks.render }));
vi.mock("@/lib/styleGeneration", async (load) => ({ ...await load<object>(), photoReference: mocks.photo }));
function deferred() {
  let resolve: (value: { ok: boolean; image?: string; error?: string }) => void = () => {};
  const promise = new Promise<{ ok: boolean; image?: string; error?: string }>((r) => { resolve = r; });
  return { promise, resolve };
}
const plan = { presentation: "Same studio", looks: [0, 1, 2].map((i) => ({ name: `Look ${i}`, explanation: "Garment-specific outfit", styling: `Style ${i}`, items: [{ role: "Bottoms", name: "Trousers", highlight: true }, { role: "Shoes", name: "Loafers", highlight: false }] })) };
beforeEach(() => { vi.resetAllMocks(); mocks.photo.mockResolvedValue("reference"); mocks.plan.mockResolvedValue({ ok: true, plan }); mocks.render.mockResolvedValue({ ok: true, image: "new-image" }); });
describe("Style loading", () => {
  it("reveals the first completed look while others generate, reuses unchanged inputs, and retries only a failure", async () => {
    const jobs = [deferred(), deferred(), deferred()];
    jobs.forEach((job) => mocks.render.mockReturnValueOnce(job.promise));
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setUploadedItem({ image: "garment", category: "coat", attributes: [], source: "upload" }));
    act(() => { result.current.findMatches(); result.current.findMatches(); });
    await waitFor(() => expect(mocks.render).toHaveBeenCalledTimes(3));
    expect(mocks.plan).toHaveBeenCalledTimes(1);
    await act(async () => jobs[1]?.resolve({ ok: true, image: "image-two" }));
    expect(result.current.selectedConcept).toBe(1);
    expect(result.current.generatedLooks?.map((l) => l.status)).toEqual(["loading", "success", "loading"]);
    act(() => { result.current.setSelectedConcept(0); result.current.go("upload"); });
    act(() => result.current.findMatches());
    expect(result.current.screen).toBe("results");
    expect(mocks.plan).toHaveBeenCalledTimes(1);
    await act(async () => { jobs[0]?.resolve({ ok: false, error: "Service failed" }); jobs[2]?.resolve({ ok: true, image: "image-three" }); });
    expect(result.current.selectedConcept).toBe(0);
    mocks.render.mockResolvedValueOnce({ ok: true, image: "retry-image" });
    act(() => { result.current.retryLook(0); result.current.retryLook(0); result.current.retryLook(1); });
    await waitFor(() => expect(result.current.generatedLooks?.[0]?.image).toBe("retry-image"));
    expect(mocks.render).toHaveBeenCalledTimes(4);
    expect(result.current.generatedLooks?.[1]?.image).toBe("image-two");
    act(() => { result.current.go("upload"); result.current.setTab("feed"); result.current.setTab("style"); });
    act(() => result.current.findMatches());
    expect(mocks.plan).toHaveBeenCalledTimes(1);
    expect(result.current.generatedLooks).toHaveLength(3);
    act(() => result.current.setNote("Different occasion mood"));
    act(() => result.current.findMatches());
    await waitFor(() => expect(mocks.plan).toHaveBeenCalledTimes(2));
  });
  it("does not override an explicit selection when another image finishes first", async () => {
    const job = deferred(); mocks.render.mockReturnValue(job.promise);
    const { result } = renderHook(() => usePairly(), { wrapper: PairlyProvider });
    act(() => result.current.setUploadedItem({ image: "garment", category: "coat", attributes: [], source: "upload" }));
    act(() => result.current.findMatches());
    await waitFor(() => expect(mocks.render).toHaveBeenCalledTimes(3));
    act(() => result.current.setSelectedConcept(2));
    await act(async () => job.resolve({ ok: true, image: "image" }));
    expect(result.current.selectedConcept).toBe(2);
  });
});