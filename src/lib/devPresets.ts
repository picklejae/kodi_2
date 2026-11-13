import { SAMPLES, type SampleItem } from "@/data/samples";
import { DEFAULT_CODE, type StyleTypeCode } from "@/data/styleTypes";

export type PresetId = "welcome" | "diagnosis" | "reveal" | "upload" | "results" | "feed" | "feed-later" | "saved" | "set-a" | "set-b";
export const PRESETS: { id: PresetId; label: string }[] = [
  { id: "welcome", label: "Welcome" },
  { id: "diagnosis", label: "Diagnosis (round 1)" },
  { id: "reveal", label: "Reveal (TNPF)" },
  { id: "upload", label: "Style / Upload (TNPF)" },
  { id: "results", label: "Results (TNPF + blazer)" },
  { id: "set-a", label: "Set A results" },
  { id: "set-b", label: "Set B results" },
  { id: "feed", label: "Feed" },
  { id: "feed-later", label: "Feed – 2 days later" },
  { id: "saved", label: "Looks" },
];

export interface PresetRequest { preset: PresetId; type: StyleTypeCode; sample: SampleItem }

/** Reads ?screen=&type=&sample= ; returns null when no valid screen is given. */
export function parsePresetParams(search: string): PresetRequest | null {
  const q = new URLSearchParams(search);
  const requested = q.get("screen")?.toLowerCase();
  const screen = requested === "social" ? "feed" : requested === "closet" || requested === "looks" ? "saved" : requested === "style" || requested === "match" ? "upload" : requested;
  if (!screen || !PRESETS.some((p) => p.id === screen)) return null;
  const t = q.get("type")?.toUpperCase() ?? "";
  const type = (/^[TR][NC][PD][FS]$/.test(t) ? t : DEFAULT_CODE) as StyleTypeCode;
  const sid = q.get("sample")?.toLowerCase();
  const sample = SAMPLES.find((s) => s.id === sid) ?? SAMPLES[0];
  if (!sample) return null;
  return { preset: screen as PresetId, type, sample };
}

/** DEV button shows unless ?demo=1 or the presenter hid it. */
export function devButtonVisible(search: string, hiddenFlag: string | null): boolean {
  if (new URLSearchParams(search).get("demo") === "1") return false;
  return hiddenFlag !== "1";
}
