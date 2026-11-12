import { CATALOG } from "@/data/catalog";
import type { StyleTypeCode } from "@/data/styleTypes";

export function stylePresentation(code: StyleTypeCode) {
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