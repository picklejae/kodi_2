import type { StylePlan, StylePreference } from "@/lib/styleGeneration";
import type { StyleTypeCode } from "./styleTypes";

export interface StylePreset {
  result: { ok: true; plan: StylePlan };
  images: readonly [string, string, string];
}
export function stylePresetKey(imageHashOrSampleId: string, preference: StylePreference, styleType: StyleTypeCode): string {
  return JSON.stringify([imageHashOrSampleId, preference, styleType]);
}
// Import three finished images from src/assets/presets/, then add an entry using
// stylePresetKey(original-file SHA-256 or sample id, preference, styleType), result: { ok: true, plan }, and images: [safe, step, bold]. Never generate presets at runtime.
export const STYLE_PRESETS: Readonly<Record<string, StylePreset>> = {};
export const PRESET_LOADING_MS = 2000;