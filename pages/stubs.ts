// Static prototype: no server, so live AI and shopping calls return a friendly failure.
const off = async (..._args: unknown[]) => ({ ok: false as const, error: "Live AI is off in the prototype. Use a sample piece (cached looks) instead." });
export const planStyle = off;
export const renderStyleLook = off;
export const findShoppingProducts = off;
export function presentationFor(p: "menswear" | "womenswear") { return p; }
