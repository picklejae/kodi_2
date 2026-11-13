import { createServerFn } from "@tanstack/react-start";
import { shoppingInput, type ShoppingResponse } from "./shopping";
import { discoverProducts } from "./shopping.server";

export const findShoppingProducts = createServerFn({ method: "POST" })
  .inputValidator((input) => shoppingInput.parse(input))
  .handler(async ({ data }): Promise<ShoppingResponse> => {
    const key = process.env["LOVABLE_API_KEY"], connectionKey = process.env["FIRECRAWL_API_KEY"];
    if (!key || !connectionKey) return { status: "error", products: [], error: "Shopping connection isn't available right now.", usage: { credits: 0, calls: 0, complete: false }, blocked: [], retrievedAt: new Date().toISOString() };
    return discoverProducts(data, { key, connectionKey });
  });