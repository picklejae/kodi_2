import { describe, expect, it, vi } from "vitest";
import { initialShoppingItems, MAX_ATTEMPTS, MAX_CANDIDATES, productRetailer, rankMatch, shoppingInput, shoppingKey, shoppingQuery } from "./shopping";
import { discoverProducts, parseProduct } from "./shopping.server";
import { looksFromPlan } from "./styleGeneration";

const input = { role: "Inner layer" as const, description: "ivory cotton poplin shirt", preference: "womenswear" as const };
const productUrl = "https://www.everlane.com/products/womens-poplin-shirt-ivory";
const doc = { metadata: { statusCode: 200, sourceURL: productUrl, "og:type": "product", "og:title": "Women's Ivory Cotton Poplin Shirt", "og:description": "Relaxed cotton poplin shirt", "og:price:amount": "85.00", "og:price:currency": "USD", "og:image:secure_url": "https://www.everlane.com/cdn/shop/files/shirt.jpg" } };
describe("shopping rules", () => {
  it("initially searches exactly two complementary roles, key additions first, never owned", () => {
    const items = [{ role: "Your piece" as const, name: "Jeans", owned: true, brand: null, price: null, shopUrl: null }, ...["Accessories", "Shoes", "Inner layer", "Bottoms"].map((role, i) => ({ role: role as "Shoes", name: role, owned: false, highlight: i === 1 || i === 2, brand: null, price: null, shopUrl: null }))];
    expect(initialShoppingItems(items).map((i) => i.role)).toEqual(["Shoes", "Inner layer"]);
  });
  it("limits each role to three candidates and two user attempts", () => { expect(MAX_CANDIDATES).toBe(3); expect(MAX_ATTEMPTS).toBe(2); });
  it("rejects search, category, home, Amazon and unsafe URLs", () => {
    for (const url of ["https://www.amazon.com/s?k=cream", "https://www.nordstrom.com/", "https://www.jcrew.com/buy/cream-shirts", "http://www.everlane.com/products/shirt", "https://www.everlane.com.evil.test/products/shirt", "https://user:password@www.everlane.com/products/shirt", "https://localhost/products/shirt"]) expect(productRetailer(url)).toBeNull();
    expect(productRetailer("https://www.nordstrom.com/s/cotton-shirt/123456")).toMatchObject({ name: "Nordstrom" });
    expect(productRetailer("https://www.ssense.com/en-us/women/product/brand/shirt/123")).toMatchObject({ name: "SSENSE" });
    expect(productRetailer("https://www.farfetch.com/shopping/women/brand-shirt-item-123.aspx")).toMatchObject({ name: "FARFETCH" });
  });
  it("rejects caller URLs rather than offering unrestricted fetch", () => { expect(shoppingInput.safeParse({ ...input, description: "https://private.test/product" }).success).toBe(false); });
  it("propagates clothing preference, budget and country into query", () => {
    const query = shoppingQuery({ ...input, country: "US", budget: { maximum: 100, currency: "USD" } });
    expect(query).toContain("women ivory cotton poplin shirt"); expect(query).toContain("under 100 USD"); expect(query).toContain("US");
    expect(shoppingQuery({ ...input, preference: "menswear" })).toContain("men ivory");
  });
  it("ranks matching color/material above retailer preference and rejects wrong category or over-budget", () => {
    const exact = rankMatch(input, "ivory cotton poplin shirt", 85, "USD");
    const less = rankMatch(input, "blue linen shirt", 85, "USD");
    expect(exact?.score ?? 0).toBeGreaterThan(less?.score ?? 0);
    expect(rankMatch(input, "ivory cotton trousers", 80, "USD")).toBeNull();
    expect(rankMatch({ ...input, budget: { maximum: 50, currency: "USD" } }, "ivory shirt", 85, "USD")).toBeNull();
  });
  it("retains verified page fields together and never invents unknown prices", () => {
    expect(parseProduct(input, productUrl, doc)).toMatchObject({ name: "Women's Ivory Cotton Poplin Shirt", price: 85, currency: "USD", role: "Inner layer", url: productUrl, image: doc.metadata["og:image:secure_url"] });
    expect(parseProduct(input, productUrl, { metadata: { "og:type": "product", "og:title": "Ivory Shirt" } })?.price).toBeNull();
    expect(parseProduct(input, productUrl, { metadata: { ...doc.metadata, "og:price:amount": "0" } })?.price).toBeNull();
    expect(parseProduct(input, productUrl, { metadata: { "og:title": "Ivory Shirt" } })).toBeNull();
  });
  it("keys results by outfit, preference, budget and country", () => {
    const look = looksFromPlan({ presentation: "studio", looks: [{ name: "A", explanation: "A", styling: "Ivory shirt", items: [{ role: "Inner layer", name: input.description, highlight: true }, { role: "Shoes", name: "Black flats", highlight: true }] }] }, "Jeans", "owned", "womenswear")[0];
    if (!look) throw new Error("Missing test look");
    const item = look.items[1];
    if (!item) throw new Error("Missing test item");
    expect(shoppingKey(look, item)).not.toBe(shoppingKey({ ...look, preference: "menswear" }, item));
    expect(shoppingKey(look, item)).not.toBe(shoppingKey({ ...look, styling: "Black shirt" }, item));
    expect(shoppingKey(look, item)).not.toBe(shoppingKey(look, item, "GB"));
    expect(shoppingKey(look, item)).not.toBe(shoppingKey(look, item, undefined, { maximum: 50, currency: "USD" }));
  });
  it("returns no-match without demo substitution", async () => {
    const transport = vi.fn(async () => new Response(JSON.stringify({ success: true, creditsUsed: 2, data: { web: [] } }))) as unknown as typeof fetch;
    const result = await discoverProducts(input, { key: "test", connectionKey: "test" }, transport);
    expect(result.status).toBe("no-match"); expect(result.products).toEqual([]); expect(result.usage.calls).toBe(2);
  });
  it("returns honest service error and usage without products", async () => {
    const result = await discoverProducts(input, { key: "test", connectionKey: "test" }, async () => new Response("Credit limit reached", { status: 403 }));
    expect(result.status).toBe("error"); expect(result.products).toEqual([]); expect(result.error).toContain("403"); expect(result.usage.complete).toBe(false);
  });
  it("scrapes no more than three candidate pages and records actual usage", async () => {
    const transport = vi.fn(async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      return new Response(JSON.stringify(body.query ? { success: true, creditsUsed: 2, data: { web: Array.from({ length: 6 }, (_, i) => ({ url: `${productUrl}-${i}` })) } } : { success: true, creditsUsed: 1, data: doc }));
    }) as unknown as typeof fetch;
    const result = await discoverProducts(input, { key: "test", connectionKey: "test" }, transport);
    expect(result.products).toHaveLength(3); expect(result.usage).toEqual({ credits: 5, calls: 4, complete: true });
  });
});