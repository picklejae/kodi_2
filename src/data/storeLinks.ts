// Pre-matched store pages for the demo items (Jason's sets A/B and the Saved examples), found 2026-11-13 by
// searching Nordstrom product pages. A pin on these items opens the link directly: no Firecrawl call, no wait.
// Prices are as listed on 11/13 (null where the listing didn't show one); colour/stock can change.
export interface StoreLink { brand: string; price: number | null; url: string }
const n = (path: string) => `https://www.nordstrom.com/s/${path}`;

export const STORE_LINKS: Record<string, StoreLink> = {
  // Set A
  "navy waxed jacket with blue check shirt": { brand: "Barbour · Modern Powell Waxed Jacket", price: 460, url: n("barbour-modern-powell-wax-jack/9081199") },
  "black lace-up shoes": { brand: "A. Veer · New York Lace-up Derby", price: null, url: n("new-york-lace-up-derby/8387389") },
  "ivory cable-knit sweater with white shirt": { brand: "Boast · Cable-Knit Sweater", price: null, url: n("boast-cable-knit-sweater/9177553") },
  "brown suede loafers": { brand: "Lands' End · Suede Penny Loafers", price: null, url: n("suede-penny-loafers/8299919") },
  "forest-green cardigan with navy-and-white striped tee": { brand: "Cotton On · Men's Cropped Cardigan", price: null, url: n("mens-cropped-cardigan/8141533") },
  "green retro sneakers": { brand: "Vans · Premium Old Skool Suede Sneaker", price: null, url: n("premium-old-skool-suede-sneaker-men/7731258") },
  // Set B
  "charcoal tee": { brand: "GARNET · Cotton Crewneck T-shirt", price: 84, url: n("mens-cotton-crewneck-t-shirt/2228624") },
  "cream wide-leg trousers": { brand: "Manière De Voir · Loic Wide Leg Trousers", price: null, url: n("loic-wide-leg-textured-trousers-with-belt/8880690") },
  "black leather shoes": { brand: "Charles Tyrwhitt · Leather Oxford Shoes", price: 259, url: n("leather-oxford-shoes/8268168") },
  "silver necklace and black belt": { brand: "David Yurman · Box Chain Necklace", price: null, url: n("mens-box-chain-necklace-in-silver-2-7mm/3664884") },
  "white tee": { brand: "Nordstrom · Supima Cotton Crewneck Tee (4-pack)", price: null, url: n("nordstrom-4-pack-trim-fit-supima-cotton-crewneck-t-shirt/4472657") },
  "dark straight-leg jeans": { brand: "Johnston & Murphy · Straight Leg Jeans", price: 129.5, url: n("johnston-and-murphy-straight-leg-jeans-dark-wash/7750543") },
  "white low-top sneakers": { brand: "Off-White · Out of Office Low Top", price: 650, url: n("off-white-out-of-office-low-top-sneaker-men/7441907") },
  "black turtleneck": { brand: "Paul James · Merino Mock Turtleneck", price: 280, url: n("paul-james-merino-wool-mock-turtleneck-sweater/9258371") },
  "charcoal textured pleated trousers": { brand: "Berle · Pleated Classic Fit Trousers", price: null, url: n("berle-manufacturing-berle-lightweight-plain-weave-pleated-classic-fit-trousers/4601602") },
  "burgundy loafers": { brand: "MARC NOLAN · Calum Penny Loafer", price: null, url: n("marc-nolan-calum-burgundy-patent/9354192") },
  // Saved examples (menswear)
  "ivory fine-knit crewneck": { brand: "Charles Tyrwhitt · Pure Merino Crew Neck", price: null, url: n("charles-tyrwhitt-pure-merino-crew-neck-sweater/8611168") },
  "charcoal straight-leg trousers": { brand: "34 Heritage · Charisma Straight Leg Pants", price: null, url: n("34-heritage-charisma-charcoal-supreme/9218368") },
  "black leather loafers": { brand: "Nordstrom · Edward Penny Loafer", price: null, url: n("nordstrom-edward-penny-loafer-men/7836938") },
  "slim black belt": { brand: "The Edward · Slim Calfskin Belt", price: null, url: n("mens-the-edward-slim-calfskin-leather-belt/9139856") },
  "pale grey textured sweater": { brand: "Maceoo · Check Textured Crewneck", price: null, url: n("tipped-cotton-cashmere-crewneck-sweater/9231520") },
  "off-white relaxed trousers": { brand: "FRAME · Relaxed Cotton Pants", price: null, url: n("relaxed-cotton-pants/8727451") },
  "white low-profile sneakers": { brand: "Off-White · Out of Office Low Top", price: 650, url: n("off-white-out-of-office-low-top-sneaker-men/7441907") },
  "soft grey scarf": { brand: "Andrew Stewart · Cashmere Scarf", price: null, url: n("andrew-stewart-glen-plaid-cashmere-scarf/5732321") },
  "fitted black turtleneck": { brand: "Paul James · Merino Mock Turtleneck", price: 280, url: n("paul-james-merino-wool-mock-turtleneck-sweater/9258371") },
  "black wide-leg trousers": { brand: "PHILIPP PLEIN · Wool Wide Leg Trousers", price: null, url: n("philipp-plein-wool-wide-leg-trousers-men/9206491") },
  "black chelsea boots": { brand: "MORJAS · The Chelsea Boot", price: null, url: n("morjas-the-chelsea-boot-men/8479792") },
  // Saved examples (womenswear)
  "white fitted top": { brand: "Koton · Fitted Crew Neck T-shirt", price: null, url: n("fitted-long-sleeve-crew-neck-t-shirt/2298249") },
  "olive straight trousers": { brand: "matty m. · Bexley Straight Leg Trousers", price: null, url: n("bexley-straight-leg-trousers/9204620") },
  "black leather ankle boots": { brand: "Lucano · Leather Ankle Boot", price: null, url: n("lucano-leather-ankle-boot-women/8769562") },
  "black fitted knit": { brand: "H&M · Belted Rib-knit Sweater", price: null, url: n("belted-rib-knit-sweater/2229256") },
  "black tights": { brand: "Everyday · Sheer & Opaque Tights (2-pack)", price: null, url: n("everyday-assorted-2-pack-sheer-opaque-tights/8802652") },
  "black ankle boots": { brand: "Santoni · Easy Ankle Boot", price: null, url: n("leather-easy-ankle-boot/9112492") },
  "dark fitted turtleneck": { brand: "Splendid · Classic Turtleneck", price: null, url: n("splendid-classic-turtleneck/3341791") },
  "grey tailored trousers": { brand: "Etro · Tailored Trousers", price: null, url: n("tailored-trousers/7312065") },
  "black pointed flats": { brand: "Rothy's · The Point II Flat", price: 109, url: n("rothys-the-point-ii-pointed-toe-flat-women/8235260") },
};

/** Fill brand / price / store link for a demo item when we have a pre-matched page. */
export function withStoreLink<T extends { name: string; brand: string | null; price: number | null; shopUrl: string | null }>(item: T): T {
  const hit = STORE_LINKS[item.name.trim().toLowerCase()];
  return hit ? { ...item, brand: hit.brand, price: hit.price, shopUrl: hit.url } : item;
}
