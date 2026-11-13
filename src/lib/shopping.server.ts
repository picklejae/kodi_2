import { MAX_CANDIDATES, productRetailer, rankMatch, shoppingQuery, type RealProduct, type ShoppingInput, type ShoppingResponse } from "./shopping";

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";
type Document = { html?: string; rawHtml?: string; metadata?: Record<string, unknown> };
type Reply = { success?: boolean; error?: string; creditsUsed?: number; data?: Document & { web?: { url: string; title?: string; description?: string }[] } };
function clean(value: unknown): string {
  return typeof value === "string" ? value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim() : "";
}
function imageUrl(value: unknown): string | null {
  const first = Array.isArray(value) ? value[0] : value;
  const raw = typeof first === "string" ? first : first && typeof first === "object" ? (first as Record<string, unknown>)["url"] || (first as Record<string, unknown>)["contentUrl"] : null;
  if (typeof raw !== "string") return null;
  try { const u = new URL(raw.replace(/^http:/, "https:")); return u.protocol === "https:" && !u.username && !u.password ? u.href : null; } catch { return null; }
}
function productJson(html: string): Record<string, unknown> | null {
  const walk = (value: unknown): Record<string, unknown> | null => {
    if (!value || typeof value !== "object") return null;
    if (Array.isArray(value)) { for (const entry of value) { const p = walk(entry); if (p) return p; } return null; }
    const object = value as Record<string, unknown>;
    if (object["@type"] === "Product" || (Array.isArray(object["@type"]) && object["@type"].includes("Product"))) return object;
    return walk(object["@graph"]);
  };
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const p = walk(JSON.parse(match[1] ?? "")); if (p) return p; } catch { /* ignore malformed retailer data */ }
  }
  return null;
}
export function parseProduct(input: ShoppingInput, url: string, doc: Document): RealProduct | null {
  const retailer = productRetailer(url), meta = doc.metadata ?? {};
  if (!retailer || (typeof meta["statusCode"] === "number" && meta["statusCode"] >= 400)) return null;
  const resolved = clean(meta["sourceURL"] || meta["url"] || url);
  if (!productRetailer(resolved) || productRetailer(resolved)?.domain !== retailer.domain) return null;
  const structured = productJson(doc.rawHtml ?? doc.html ?? "");
  // A valid product path alone is insufficient: require page-level product evidence.
  if (!structured && meta["og:type"] !== "product" && !meta["og:price:amount"] && !meta["product:price:amount"]) return null;
  const name = clean(structured?.["name"] || meta["og:title"] || meta["ogTitle"] || meta["title"]).slice(0, 240);
  if (!name || /access denied|captcha|not found|just a moment/i.test(name)) return null;
  const offersRaw = structured?.["offers"];
  const offers = (Array.isArray(offersRaw) ? offersRaw[0] : offersRaw) as Record<string, unknown> | undefined;
  const priceRaw = offers?.["price"] ?? offers?.["lowPrice"] ?? meta["product:price:amount"] ?? meta["og:price:amount"];
  const numeric = typeof priceRaw === "number" ? priceRaw : typeof priceRaw === "string" && /^\d+(\.\d+)?$/.test(priceRaw) ? Number(priceRaw) : null;
  const currencyRaw = clean(offers?.["priceCurrency"] || meta["product:price:currency"] || meta["og:price:currency"]);
  const currency = /^[A-Z]{3}$/.test(currencyRaw) ? currencyRaw : null;
  // Retailer zero placeholders are not credible clothing prices.
  const price = numeric !== null && Number.isFinite(numeric) && numeric > 0 && currency ? numeric : null;
  const description = clean(structured?.["description"] || meta["description"] || meta["og:description"] || meta["ogDescription"]);
  const ranked = rankMatch(input, `${name} ${description} ${resolved}`, price, currency);
  if (!ranked) return null;
  const brandRaw = structured?.["brand"];
  const brand = clean(typeof brandRaw === "object" && brandRaw ? (brandRaw as Record<string, unknown>)["name"] : brandRaw) || null;
  return { name, brand, retailer: retailer.name, image: imageUrl(structured?.["image"] || meta["og:image:secure_url"] || meta["og:image"] || meta["ogImage"]), price, currency, url: resolved, retrievedAt: new Date().toISOString(), role: input.role, ...ranked };
}

export async function discoverProducts(input: ShoppingInput, credentials: { key: string; connectionKey: string }, transport: typeof fetch = fetch): Promise<ShoppingResponse> {
  const usage = { credits: 0, calls: 0, complete: true }, blocked: string[] = [];
  const retrievedAt = new Date().toISOString();
  const call = async (path: string, body: object): Promise<Reply> => {
    usage.calls++;
    const response = await transport(`${GATEWAY}/${path}`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${credentials.key}`, "X-Connection-Api-Key": credentials.connectionKey }, body: JSON.stringify(body), signal: AbortSignal.timeout(55000) });
    if (!response.ok) {
      usage.complete = false;
      const error = await response.text();
      console.error(`Firecrawl [${response.status}]: ${error}`);
      throw new Error(`Shopping service returned ${response.status}. ${response.status === 402 ? "Workspace usage credits could not cover this search." : response.status === 403 ? "Access or a workspace usage limit stopped this request." : "Please retry later."}`);
    }
    const reply = await response.json() as Reply;
    const credits = reply.creditsUsed ?? (typeof reply.data?.metadata?.["creditsUsed"] === "number" ? reply.data.metadata["creditsUsed"] : undefined);
    if (credits === undefined) usage.complete = false; else usage.credits += credits;
    if (!reply.success) { console.error("Firecrawl unsuccessful response", reply.error); throw new Error("Shopping service couldn't complete this request. Please retry later."); }
    return reply;
  };
  try {
    const candidates = new Map<string, { url: string; title?: string; description?: string }>();
    const search = await call("search", { query: shoppingQuery(input), limit: MAX_CANDIDATES, ...(input.country ? { country: input.country.toLowerCase() } : {}) });
    for (const candidate of search.data?.web ?? []) if (productRetailer(candidate.url) && candidates.size < MAX_CANDIDATES) candidates.set(candidate.url.split("?")[0] ?? candidate.url, candidate);
    if (candidates.size < MAX_CANDIDATES) {
      // One narrower fallback, never a crawl; at most three product pages total.
      const fallback = await call("search", { query: `${input.preference === "menswear" ? "men" : "women"} ${input.description} ${input.budget ? `under ${input.budget.maximum} ${input.budget.currency}` : ""} ${input.country ?? ""} (site:nordstrom.com/s/ OR site:ssense.com product OR site:farfetch.com item OR site:everlane.com/products/ OR site:jcrew.com/p/ OR site:cos.com product) -inurl:buy -inurl:search -inurl:category -inurl:collections`, limit: MAX_CANDIDATES - candidates.size, ...(input.country ? { country: input.country.toLowerCase() } : {}) });
      for (const candidate of fallback.data?.web ?? []) if (productRetailer(candidate.url) && candidates.size < MAX_CANDIDATES) candidates.set(candidate.url.split("?")[0] ?? candidate.url, candidate);
    }
    const products: RealProduct[] = [];
    let failed = false;
    for (const candidate of [...candidates.values()].slice(0, MAX_CANDIDATES)) {
      const retailer = productRetailer(candidate.url);
      if (!retailer) continue;
      try {
        const reply = await call("scrape", { url: candidate.url, formats: ["rawHtml"], onlyMainContent: false, timeout: 45000 });
        const product = reply.data ? parseProduct(input, candidate.url, reply.data) : null;
        if (product) products.push(product); else blocked.push(`${retailer.name}: no usable matching product data`);
      } catch (error) {
        failed = true; blocked.push(`${retailer.name}: ${error instanceof Error ? error.message : "page unavailable"}`);
      }
    }
    products.sort((a, b) => b.score - a.score);
    console.info("Shopping usage", JSON.stringify({ role: input.role, ...usage, products: products.length, blocked }));
    return { status: products.length ? "success" : failed ? "error" : "no-match", products, usage, blocked, retrievedAt, ...(!products.length && failed ? { error: "Retailer pages couldn't be retrieved. Please retry later." } : {}) };
  } catch (error) {
    return { status: "error", products: [], error: error instanceof Error ? error.message : "Shopping connection interrupted. Please retry later.", usage, blocked, retrievedAt };
  }
}