import { z } from "zod";
import type { MoodboardLook } from "@/data/moodboards";
export const planSchema = z.object({ presentation: z.string().min(1), looks: z.array(z.object({ name: z.string().min(1).max(32), explanation: z.string().min(1), styling: z.string().min(1), items: z.array(z.object({ role: z.enum(["Inner layer", "Bottoms", "Shoes", "Accessories"]), name: z.string().min(1), highlight: z.boolean() })).min(2) })).length(3) });
export type StylePlan = z.infer<typeof planSchema>;
export type StylePreference = "menswear" | "womenswear";
/** Shopping department for future product queries; mirrors the clothing preference. */
export const DEPARTMENT: Record<StylePreference, string> = { menswear: "men", womenswear: "women" };
export type GeneratedLook = MoodboardLook & { preference: StylePreference; department: string; status: "idle" | "loading" | "success" | "failed"; error?: string; styling: string };
export function looksFromPlan(plan: StylePlan, name: string, image: string, preference: StylePreference): GeneratedLook[] {
 return plan.looks.map((look, index) => ({ id: `ai-${index}`, preference, department: DEPARTMENT[preference], name: look.name, explanation: look.explanation, styling: look.styling, status: "loading", items: [{ role: "Your piece", name, image, owned: true, brand: null, price: null, shopUrl: null }, ...look.items.map((item) => ({ ...item, owned: false, brand: null, price: null, shopUrl: null }))] }));
}
export async function photoReference(src: string): Promise<string> {
 const image = new Image(); image.crossOrigin = "anonymous";
 await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Couldn't read your garment photo. Please select it again.")); image.src = src; });
 const ratio = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
 const canvas = document.createElement("canvas"); canvas.width = Math.round(image.naturalWidth * ratio); canvas.height = Math.round(image.naturalHeight * ratio);
 const context = canvas.getContext("2d"); if (!context) throw new Error("Couldn't prepare your photo.");
 context.drawImage(image, 0, 0, canvas.width, canvas.height); return canvas.toDataURL("image/jpeg", 0.9);
}
