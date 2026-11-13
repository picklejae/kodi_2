import { describe, expect, it } from "vitest";
import { CATALOG } from "@/data/catalog";
import { CATEGORIES } from "@/data/samples";
import { STYLE_TYPES, type StyleTypeCode } from "@/data/styleTypes";
import { EXCLUDED, generatePicks, lookOrder } from "./matching";

const codes = Object.keys(STYLE_TYPES) as StyleTypeCode[];

describe("generatePicks", () => {
  it("styles recent knits and shoes without duplicating the owned category", () => {
    for (const category of ["knit", "shoes"] as const) {
      for (const look of Object.values(generatePicks(CATALOG, category, "recent piece", "TNPF", null))) {
        expect(look.items.some((item) => item.category === "pants")).toBe(true);
        expect(look.items.every((item) => !EXCLUDED[category].includes(item.category))).toBe(true);
      }
    }
  });
  it("returns exactly three looks with two picks each", () => {
    const p = generatePicks(CATALOG, "jacket", "Navy blazer", "TNPF", null);
    expect(Object.keys(p)).toEqual(["safe", "step", "bold"]);
    for (const b of ["safe", "step", "bold"] as const) {
      expect(p[b].boldness).toBe(b);
      expect(p[b].items).toHaveLength(2);
    }
  });
  it("uses two distinct categories in each look, neither duplicating the owned category", () => {
    for (const cat of CATEGORIES) for (const t of codes) {
      const p = generatePicks(CATALOG, cat, "item", t, "date");
      for (const look of Object.values(p)) {
        const cats = look.items.map((item) => item.category);
        expect(new Set(cats).size).toBe(2);
        for (const c of cats) expect(EXCLUDED[cat]).not.toContain(c);
      }
    }
  });
  it("includes a bottom for tops and jackets, and a shirt or knit for bottoms", () => {
    for (const cat of CATEGORIES) for (const t of codes) {
      for (const look of Object.values(generatePicks(CATALOG, cat, "item", t, null))) {
        const cats = look.items.map((item) => item.category);
        if (cat === "pants") expect(cats.some((c) => c === "shirts" || c === "knits")).toBe(true);
        else expect(cats).toContain("pants");
      }
    }
  });
  it("orders low exploration Safe first and high exploration One step up first", () => {
    expect(lookOrder("low")).toEqual(["safe", "step", "bold"]);
    expect(lookOrder("high")).toEqual(["step", "safe", "bold"]);
  });
  it("keeps catalog prices between $40 and $400", () => {
    for (const c of CATALOG) { expect(c.price).toBeGreaterThanOrEqual(40); expect(c.price).toBeLessThanOrEqual(400); }
  });
});
