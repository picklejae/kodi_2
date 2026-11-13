import { z } from "zod";
import type { MoodboardLook } from "@/data/moodboards";
import { AXIS_LABELS, DEFAULT_CODE, type StyleTypeCode } from "@/data/styleTypes";
export const TIERS = ["safe", "step", "bold"] as const;
export const TIER_LABELS = { safe: "Safe", step: "One step up", bold: "Bold" };
export const styleCodeSchema = z.string().regex(/^[TR][NC][PD][FS]$/).transform((code) => code as StyleTypeCode);
export const axisScoresSchema = z.array(z.number().min(0).max(1)).length(4);
export function styleProfile(styleType: StyleTypeCode | null, axisScores: number[] | null, skipped: boolean) {
 return { styleType: skipped ? DEFAULT_CODE : styleType ?? DEFAULT_CODE, axisScores: skipped ? [0.5, 0.5, 0.5, 0.5] : axisScores ?? [0.5, 0.5, 0.5, 0.5] };
}
export function defaultConcept(exploreLevel: "low" | "high") { return exploreLevel === "high" ? 1 : 0; }
export function closestAxis(scores: number[]) {
 return scores.reduce((best, score, index) => Math.abs(score - 0.5) < Math.abs((scores[best] ?? 0.5) - 0.5) ? index : best, 0);
}
export function axisShifts(code: StyleTypeCode) {
 return Object.values(AXIS_LABELS).map((labels, index) => {
  const opposite = code.charAt(index) === "TNPF".charAt(index) ? 1 : 0;
  return `${labels[1 - opposite]} → ${labels[opposite]}`;
 });
}
export function ladderPrompt(code: StyleTypeCode, scores: number[]) {
 return `User Style Type: ${code}. Axis scores (Fit, Color, Detail, Mood; 0 = first letter, 1 = opposite letter): ${JSON.stringify(scores)}. Create exactly three looks in this order. Look 1 "Safe": stay fully within the user's Style Type. Look 2 "One step up": keep three axes and move exactly one axis to its opposite letter, choosing the axis whose score is closest to 0.5. Look 3 "Bold": move two or more axes to their opposite letters. Axes: Fit T Tailored / R Relaxed, Color N Neutral / C Color, Detail P Plain / D Detail, Mood F Formal / S Street. Every look must still suit the occasion and mood; when the occasion is formal, make the Bold look bold through fit, color or detail rather than by making it casual. Ties choose Fit, then Color, then Detail, then Mood. The One step up shift must be "${axisShifts(code)[closestAxis(scores)]}". If that is a mood shift at a formal occasion, retain dress-code-appropriate formality with street-influenced styling rather than casual garments. Return tier safe | step | bold and shift naming only the axes actually moved, using these exact directional labels separated by commas: ${axisShifts(code).join("; ")}. Safe shift is an empty string. The Bold shift has at least two labels. Keep the owned garment unchanged; apply shifts through complementary pieces.`;
}
export const planSchema = z.object({ presentation: z.string().min(1), looks: z.array(z.object({ tier: z.enum(TIERS), shift: z.string(), name: z.string().min(1).max(32), explanation: z.string().min(1), styling: z.string().min(1), items: z.array(z.object({ role: z.enum(["Inner layer", "Bottoms", "Shoes", "Accessories"]), name: z.string().min(1), highlight: z.boolean() })).min(2) })).length(3) }).refine((plan) => plan.looks.every((look, i) => look.tier === TIERS[i]), "Looks must follow safe, step, bold order");
export function validateLadder(plan: StylePlan, code: StyleTypeCode, scores: number[]) {
 const shifts = axisShifts(code);
 const valid = plan.looks.every((look, index) => {
  const moved = look.shift.split(",").map((shift) => shift.trim()).filter(Boolean);
  return index === 0 ? moved.length === 0 : index === 1 ? moved.length === 1 && moved[0] === shifts[closestAxis(scores)] : moved.length >= 2 && new Set(moved).size === moved.length && moved.every((shift) => shifts.includes(shift));
 });
 if (!valid) throw new Error("The plan did not follow the personalized style ladder.");
 return plan;
}
export type StylePlan = z.infer<typeof planSchema>;
export type StylePreference = "menswear" | "womenswear";
/** Shopping department for future product queries; mirrors the clothing preference. */
export const DEPARTMENT: Record<StylePreference, string> = { menswear: "men", womenswear: "women" };
export type GeneratedLook = MoodboardLook & { tier: typeof TIERS[number]; shift: string; preference: StylePreference; department: string; status: "idle" | "loading" | "success" | "failed"; error?: string; styling: string };
export function looksFromPlan(plan: StylePlan, name: string, image: string, preference: StylePreference): GeneratedLook[] {
  return plan.looks.map((look, index) => ({ id: `ai-${index}`, tier: look.tier, shift: look.shift, preference, department: DEPARTMENT[preference], name: look.name, explanation: look.explanation, styling: look.styling, status: "loading", items: [{ role: "Your piece", name, image, owned: true, brand: null, price: null, shopUrl: null }, ...look.items.map((item) => ({ ...item, owned: false, brand: null, price: null, shopUrl: null }))] }));
}
export async function photoReference(src: string): Promise<string> {
 const image = new Image(); image.crossOrigin = "anonymous";
 await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Couldn't read your garment photo. Please select it again.")); image.src = src; });
 const ratio = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
 const canvas = document.createElement("canvas"); canvas.width = Math.round(image.naturalWidth * ratio); canvas.height = Math.round(image.naturalHeight * ratio);
 const context = canvas.getContext("2d"); if (!context) throw new Error("Couldn't prepare your photo.");
 context.drawImage(image, 0, 0, canvas.width, canvas.height); return canvas.toDataURL("image/jpeg", 0.9);
}
