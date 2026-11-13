import { CATALOG } from "@/data/catalog";
import type { StyleTypeCode } from "@/data/styleTypes";
import { pexels, womenLooksFor } from "@/data/womenLooks";

export function stylePresentation(code: StyleTypeCode, preference: "menswear" | "womenswear" | null = "menswear") {
  if (preference === "womenswear") return womenPresentation(code);
  const formal = code.charAt(3) === "F";
  const detailed = code.charAt(2) === "D";
  const relaxed = code.charAt(0) === "R";
  const colorful = code.charAt(1) === "C";
  const first = formal ? (relaxed ? "pleated trousers" : "chinos") : (detailed ? "cargo pants" : "straight-leg jeans");
  const second = detailed ? (formal ? "a cable-knit sweater" : "a chambray shirt") : (formal ? "an oxford shirt" : "a clean tee");
  const pieces = (["pants", "shirts", "knits", "shoes"] as const).flatMap((category) => {
    const ranked = CATALOG.filter((item) => item.category === category).sort((a, b) => {
      const score = (tags: string) => [...code].reduce((n, letter, i) => n + (tags.charAt(i) === letter ? 1 : 0), 0);
      return score(b.tags) - score(a.tags);
    });
    return ranked[0] ? [ranked[0]] : [];
  });
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
  const flipped = (code.slice(0, 3) + (code.charAt(3) === "F" ? "S" : "F")) as StyleTypeCode;
  const looks = [...womenLooksFor(code), ...womenLooksFor(flipped).slice(0, 1)].slice(0, 4);
  const pieces = looks.map((look) => ({ id: `w-${look.photo}`, name: look.name, image: pexels(look.photo, 400) }));
  return { line: `You look great in ${colorful ? "colorful " : ""}${first} and ${second}.`, pieces };
}
