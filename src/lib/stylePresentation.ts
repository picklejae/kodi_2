import { samplesFor } from "@/data/samples";
import type { StyleTypeCode } from "@/data/styleTypes";

export function stylePresentation(code: StyleTypeCode, preference: "menswear" | "womenswear" | null = "menswear") {
  if (preference === "womenswear") return womenPresentation(code);
  const formal = code.charAt(3) === "F";
  const detailed = code.charAt(2) === "D";
  const relaxed = code.charAt(0) === "R";
  const colorful = code.charAt(1) === "C";
  const first = formal ? (relaxed ? "pleated trousers" : "chinos") : (detailed ? "cargo pants" : "straight-leg jeans");
  const second = detailed ? (formal ? "a cable-knit sweater" : "a chambray shirt") : (formal ? "an oxford shirt" : "a clean tee");
  // The 4 single-garment product photos (formerly the Style tab's samples).
  const pieces = samplesFor("menswear").map((sample) => ({ id: sample.id, name: sample.name, image: sample.image }));
  return { line: `You look great in ${colorful ? "colorful " : ""}${first} and ${second}.`, pieces };
}

/** Womenswear: real outfit photos for the user's type (3) plus one from the nearest type, and a womenswear line. */
function womenPresentation(code: StyleTypeCode) {
  const formal = code.charAt(3) === "F";
  const detailed = code.charAt(2) === "D";
  const relaxed = code.charAt(0) === "R";
  const colorful = code.charAt(1) === "C";
  const first = formal ? (relaxed ? "wide-leg trousers" : "tailored trousers") : (detailed ? "cargo pants" : "straight-leg jeans");
  const second = detailed ? (formal ? "a tweed jacket" : "a patterned cardigan") : (formal ? "a crisp blazer" : "a simple knit top");
  const pieces = samplesFor("womenswear").map((sample) => ({ id: sample.id, name: sample.name, image: sample.image }));
  return { line: `You look great in ${colorful ? "colorful " : ""}${first} and ${second}.`, pieces };
}
