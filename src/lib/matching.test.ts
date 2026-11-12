import { describe, expect, it } from "vitest";
import { CATALOG } from "@/data/catalog";
import { CATEGORIES } from "@/data/samples";
import { STYLE_TYPES, type StyleTypeCode } from "@/data/styleTypes";
import { EXCLUDED, generatePicks } from "./matching";

const codes = Object.keys(STYLE_TYPES) as StyleTypeCode[];

describe("generatePicks", () => {
  it("returns exactly one safe, one step and one bold pick", () => {
    const p = generatePicks(CATALOG, "jacket", "Navy blazer", "TNPF", null);
    expect([p.safe.item.boldness, p.step.item.boldness, p.bold.item.boldness]).toEqual(["safe", "step", "bold"]);
  });
  it("uses 3 different categories, never the uploaded item's category", () => {
    for (const cat of CATEGORIES) for (const t of codes) {
      const p = generatePicks(CATALOG, cat, "item", t, "date");
      const cats = [p.safe, p.step, p.bold].map((x) => x.item.category);
      expect(new Set(cats).size).toBe(3);
      for (const c of cats) expect(EXCLUDED[cat]).not.toContain(c);
    }
  });
  it("keeps catalog prices between $40 and $400", () => {
    for (const c of CATALOG) { expect(c.price).toBeGreaterThanOrEqual(40); expect(c.price).toBeLessThanOrEqual(400); }
  });
});
