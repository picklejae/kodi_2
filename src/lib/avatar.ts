import avatar from "@/assets/presets/a1.jpg.asset.json";

export const AVATAR_REFERENCE = avatar.url;
export const AVATAR_VERSION = "faceless-matte-grey-v1";
export function avatarPresentation(preference: "menswear" | "womenswear") {
  return `The SECOND reference (a1.jpg) defines the ONLY avatar and studio style, not the clothing. A faceless mannequin-style avatar with a smooth matte light-grey head and hands, no facial features, no hair, an average ${preference === "womenswear" ? "female" : "male"} build, full body head to shoes, front-facing neutral standing pose with arms relaxed, centered with margins above the head and below the shoes. Plain light warm-grey background, soft studio light, portrait 3:4. No real-looking faces, no hair, no other backgrounds, no flat-lays for full looks. Ignore any conflicting human model or background description; never copy clothing or filename text from the second reference.`;
}