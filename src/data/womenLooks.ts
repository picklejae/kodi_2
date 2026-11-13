// Womenswear reference looks: 3 real outfit photos per Style Type (Pexels, free license; sources in
// MBA BoothHacks style_refs/style_type_refs.json). Used for "People like you wear" when the preference is womenswear.
import type { StyleTypeCode } from "./styleTypes";

export interface WomenLook { code: StyleTypeCode; photo: string; name: string; description: string }
export const pexels = (id: string, w = 600) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=${w}`;

export const WOMEN_LOOKS: WomenLook[] = [
  { code: "TNPF", photo: "26256163", name: "Black tailored blazer and trousers", description: "Black tailored blazer and trousers, heels, studio" },
  { code: "TNPF", photo: "18709016", name: "Navy blazer", description: "Woman in navy blazer, trousers and white top" },
  { code: "TNPF", photo: "19985715", name: "Navy double-breasted suit", description: "Navy double-breasted suit, heels, seated on stool" },
  { code: "TNPS", photo: "4687038", name: "Black blazer", description: "Black blazer, beige tapered trousers, heels, city glass" },
  { code: "TNPS", photo: "7000911", name: "Black blazer", description: "Black blazer, grey trousers, boots, leaning on stairs" },
  { code: "TNPS", photo: "14979420", name: "Grey long coat", description: "Grey long coat, dark turtleneck, grey trousers, street" },
  { code: "TNDF", photo: "40679984", name: "Black-white tweed jacket", description: "Black-white tweed jacket, bob haircut, greenery" },
  { code: "TNDF", photo: "40654019", name: "Checked tweed jacket", description: "Checked tweed jacket, plaid skirt, bob, outdoors" },
  { code: "TNDF", photo: "39079926", name: "Pastel tweed jacket over black top", description: "Pastel tweed jacket over black top, green backdrop" },
  { code: "TNDS", photo: "7682078", name: "Beige trench with belt", description: "Beige trench with belt, trousers, white top, architecture" },
  { code: "TNDS", photo: "7682076", name: "Beige belted trench coat", description: "Beige belted trench coat, olive trousers, boots" },
  { code: "TNDS", photo: "20284091", name: "Khaki trench coat with belt", description: "Khaki trench coat with belt, wide trousers, arch" },
  { code: "TCPF", photo: "15345393", name: "Matching red blazer and trousers", description: "Matching red blazer and trousers, studio" },
  { code: "TCPF", photo: "13991643", name: "Full red blazer and pants outfit", description: "Full red blazer and pants outfit outdoors" },
  { code: "TCPF", photo: "9155709", name: "Solid green blazer and trousers", description: "Solid green blazer and trousers standing" },
  { code: "TCPS", photo: "18632569", name: "Yellow top and jeans", description: "Yellow top and jeans on city sidewalk" },
  { code: "TCPS", photo: "8929775", name: "Yellow crop top with denim", description: "Yellow crop top with denim, street" },
  { code: "TCPS", photo: "19211005", name: "Yellow top and jeans", description: "Yellow top and jeans, city street" },
  { code: "TCDF", photo: "19273134", name: "Plaid blazer and checked trousers", description: "Plaid blazer and checked trousers walking" },
  { code: "TCDF", photo: "18054157", name: "Checked suit", description: "Checked suit posed on urban balcony" },
  { code: "TCDF", photo: "40529479", name: "Plaid suit", description: "Plaid suit, studio full outfit" },
  { code: "TCDS", photo: "12083929", name: "Zigzag knit cardigan", description: "Zigzag knit cardigan, street, holding bag" },
  { code: "TCDS", photo: "10530718", name: "Floral cardigan and denim", description: "Floral cardigan and denim, yellow wall" },
  { code: "TCDS", photo: "24346107", name: "Star-patterned cardigan", description: "Star-patterned cardigan, casual outdoors" },
  { code: "RNPF", photo: "18173600", name: "Beige longline blazer with wide-leg pants", description: "Beige longline blazer with wide-leg pants" },
  { code: "RNPF", photo: "19628818", name: "Beige blazer", description: "Woman in beige blazer, cream trousers, black top" },
  { code: "RNPF", photo: "8796282", name: "Beige blazer set", description: "Beige blazer set standing in grass field" },
  { code: "RNPS", photo: "6454766", name: "White knit sweater with khaki pants", description: "White knit sweater with khaki pants" },
  { code: "RNPS", photo: "6630845", name: "Oversized white sweater", description: "Oversized white sweater, simple neutral look" },
  { code: "RNPS", photo: "6328415", name: "White sweater and black pants", description: "White sweater and black pants, easy basics" },
  { code: "RNDF", photo: "32314682", name: "Brown corduroy jacket", description: "Brown corduroy jacket, earthy and relaxed" },
  { code: "RNDF", photo: "36534043", name: "Long wool coat", description: "Long wool coat on autumn path" },
  { code: "RNDF", photo: "21915267", name: "Cream cable-knit vest", description: "Woman in cream cable-knit vest, loose cargo pants" },
  { code: "RNDS", photo: "13034570", name: "Denim work jacket with brown pants", description: "Denim work jacket with brown pants" },
  { code: "RNDS", photo: "10756683", name: "Denim jacket and pants", description: "Denim jacket and pants, utility feel" },
  { code: "RNDS", photo: "33373707", name: "Workwear-styled outfit in workshop setting", description: "Workwear-styled outfit in workshop setting" },
  { code: "RCPF", photo: "7576752", name: "Rust orange blazer with matching wide-leg trousers", description: "Rust orange blazer with matching wide-leg trousers" },
  { code: "RCPF", photo: "35590528", name: "Cobalt blazer over burgundy wide-leg cropped trousers", description: "Cobalt blazer over burgundy wide-leg cropped trousers" },
  { code: "RCPF", photo: "13070045", name: "Orange loose blazer", description: "Orange loose blazer, olive trousers, black top" },
  { code: "RCPS", photo: "3685522", name: "Mustard wide-leg pants", description: "Mustard wide-leg pants, beige cardigan, black top" },
  { code: "RCPS", photo: "6976934", name: "Yellow knit top", description: "Yellow knit top, loose brown pants, boots" },
  { code: "RCPS", photo: "18187794", name: "White tank with loose olive-green wide pants", description: "White tank with loose olive-green wide pants" },
  { code: "RCDF", photo: "16890607", name: "Pastel plaid jacket over white tee", description: "Pastel plaid jacket over white tee, purple trousers" },
  { code: "RCDF", photo: "932400", name: "Plaid blazer", description: "Plaid blazer, striped shirt, long tartan skirt" },
  { code: "RCDF", photo: "935955", name: "Oversized checkered coat with bright red pants", description: "Oversized checkered coat with bright red pants" },
  { code: "RCDS", photo: "16161517", name: "Multi-patterned oversized jacket", description: "Multi-patterned oversized jacket, baggy embroidered jeans, sandals" },
  { code: "RCDS", photo: "19273257", name: "Oversized yellow tee", description: "Oversized yellow tee, graphic jacket, ripped tights, sneakers" },
  { code: "RCDS", photo: "13625963", name: "Swirl-print loose trousers", description: "Swirl-print loose trousers, cropped blue knit, layered tops" },
];

export function womenLooksFor(code: StyleTypeCode): WomenLook[] {
  return WOMEN_LOOKS.filter((look) => look.code === code);
}
