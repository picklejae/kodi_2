// ALT ME community feed photos: 10 womenswear + 10 menswear real-life photos from Wikimedia Commons
// (ALT-ME-fashion-gallery.html, verified 2026-11-13). Each shows creator, source page and license.
// These are not ALT ME users: no usernames, votes or endorsements are invented for them.
// Changes: resized to fit the feed card. CC BY-SA items stay under their original license.
import type { StyleTypeCode } from "./styleTypes";
import altme01 from "@/assets/feed/altme-01.jpg";
import altme02 from "@/assets/feed/altme-02.jpg";
import altme03 from "@/assets/feed/altme-03.jpg";
import altme04 from "@/assets/feed/altme-04.jpg";
import altme05 from "@/assets/feed/altme-05.jpg";
import altme06 from "@/assets/feed/altme-06.jpg";
import altme07 from "@/assets/feed/altme-07.jpg";
import altme08 from "@/assets/feed/altme-08.jpg";
import altme09 from "@/assets/feed/altme-09.jpg";
import altme10 from "@/assets/feed/altme-10.jpg";
import altme11 from "@/assets/feed/altme-11.jpg";
import altme12 from "@/assets/feed/altme-12.jpg";
import altme13 from "@/assets/feed/altme-13.jpg";
import altme14 from "@/assets/feed/altme-14.jpg";
import altme15 from "@/assets/feed/altme-15.jpg";
import altme16 from "@/assets/feed/altme-16.jpg";
import altme17 from "@/assets/feed/altme-17.jpg";
import altme18 from "@/assets/feed/altme-18.jpg";
import altme19 from "@/assets/feed/altme-19.jpg";
import altme20 from "@/assets/feed/altme-20.jpg";

export interface PhotoCredit { creator: string; sourceUrl: string; license: string; licenseUrl: string }
export interface AltMePhoto {
  id: string; department: "menswear" | "womenswear"; image: string; title: string; style: string;
  styleType: StyleTypeCode; alt: string; credit: PhotoCredit;
}

export const ALT_ME_PHOTOS: AltMePhoto[] = [
  { id: "altme-01", department: "womenswear", image: altme01, title: "Crosswalk, 1974", style: "Vintage", styleType: "RNDF", alt: "A pedestrian in a patterned sleeveless dress and wide-brim hat.", credit: { creator: "Patricia DuBose Duncan", sourceUrl: "https://commons.wikimedia.org/wiki/File:WOMAN_CROSSES_THE_STREET_AT_COTTONWOOD_FALLS,_KANSAS,_NEAR_EMPORIA._SHE_IS_ONE_OF_MANY_SPECTATORS_WHO_COME_TO_THE..._-_NARA_-_557039.jpg", license: "Public domain", licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-USGov-EPA" } },
  { id: "altme-02", department: "womenswear", image: altme02, title: "Helsinki, in plaid", style: "Vintage", styleType: "RNDF", alt: "A pedestrian in a checked coat on a Helsinki sidewalk.", credit: { creator: "Simo Rista", sourceUrl: "https://commons.wikimedia.org/wiki/File:Kruununhaka,_Meritullinkatu_-_ser094808_-_hkm.HKMS000005-km0000ol12.jpg", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0" } },
  { id: "altme-03", department: "womenswear", image: altme03, title: "Waiting for the light", style: "Vintage", styleType: "RNDF", alt: "Pedestrians in flared trousers and layered separates in Helsinki, 1977.", credit: { creator: "Pekka Punkari", sourceUrl: "https://commons.wikimedia.org/wiki/File:Simonkatu_1_-_Helsinki_1977_-_G29865_-_hkm.HKMS000005-km0000oa3x.jpg", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0" } },
  { id: "altme-04", department: "womenswear", image: altme04, title: "Sunshine & mini bags", style: "Casual", styleType: "RNPS", alt: "Two pedestrians in short summer dresses on a Brisbane shopping street.", credit: { creator: "Kgbo", sourceUrl: "https://commons.wikimedia.org/wiki/File:Brisbane_street_fashion_in_2018;_minidress,_black_mini_handbag_and_flip-flops.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-05", department: "womenswear", image: altme05, title: "Boots in Brisbane", style: "Casual", styleType: "RNPS", alt: "A pedestrian in a T-shirt, shorts and tall black boots.", credit: { creator: "Chris Olszewski", sourceUrl: "https://commons.wikimedia.org/wiki/File:Brisbane,_winter_female_street_fashion_in_2019;_t-shirt,_shorts_and_boots.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-06", department: "womenswear", image: altme06, title: "Graphic tee energy", style: "Casual", styleType: "RNPS", alt: "A person outdoors wearing a black graphic T-shirt.", credit: { creator: "Karugadk", sourceUrl: "https://commons.wikimedia.org/wiki/File:Culture._Rules._Everything._Around._Me_(C.R.E.A.M).jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-07", department: "womenswear", image: altme07, title: "Harajuku layers", style: "Quirky", styleType: "RCDS", alt: "Pedestrians in layered graphic tops and headwear on Takeshita Street.", credit: { creator: "Joe Mabel on Flickr as Joe Mabel from Seattle, US", sourceUrl: "https://commons.wikimedia.org/wiki/File:Harajuku_-_Takeshita_Street_27_(15554744827).jpg", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0" } },
  { id: "altme-08", department: "womenswear", image: altme08, title: "Prints on the pavement", style: "Quirky", styleType: "RCDS", alt: "Two pedestrians in Newstead, including shorts and boots and a patterned shirt.", credit: { creator: "Kgbo", sourceUrl: "https://commons.wikimedia.org/wiki/File:Street_fashion_in_Newstead,_Queensland,_2021.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-09", department: "womenswear", image: altme09, title: "Long coat, city day", style: "Street style", styleType: "TCDS", alt: "A pedestrian wearing a long patterned coat, jeans, boots and a knit hat.", credit: { creator: "Peter  T from Brooklyn, NY, USA", sourceUrl: "https://commons.wikimedia.org/wiki/File:NY_Fashion_Week_February_2017_(32806494336).jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } },
  { id: "altme-10", department: "womenswear", image: altme10, title: "Colour without rules", style: "Quirky", styleType: "RCDS", alt: "Two march attendees in dark layers with colourful hair and accessories.", credit: { creator: "Silar", sourceUrl: "https://commons.wikimedia.org/wiki/File:02022_0377_Equality_March_2022_in_Krak%C3%B3w.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-11", department: "menswear", image: altme11, title: "After-dark layers", style: "Casual", styleType: "RNPS", alt: "A person in a graphic top, jacket, dark trousers and white trainers on an outdoor court.", credit: { creator: "Peachyeung316", sourceUrl: "https://commons.wikimedia.org/wiki/File:A_speical_student_fashion_style.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-12", department: "menswear", image: altme12, title: "Stripes on the Strand", style: "Quirky", styleType: "RCDS", alt: "A street-style attendee in a dark jacket, striped trousers and green headwear.", credit: { creator: "Philafrenzy", sourceUrl: "https://commons.wikimedia.org/wiki/File:London_Fashion_Week_Men%27s_Strand_January_2017_05.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-13", department: "menswear", image: altme13, title: "Back-print moment", style: "Street style", styleType: "TCDS", alt: "Fashion-week attendees outdoors, including a patterned red vest and black hat.", credit: { creator: "TellusFashion", sourceUrl: "https://commons.wikimedia.org/wiki/File:Street_Style_at_London_Fashion_Week_01.jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } },
  { id: "altme-14", department: "menswear", image: altme14, title: "All-black afternoon", style: "Street style", styleType: "TCDS", alt: "A street-style attendee wearing sunglasses, a dark jacket and cropped trousers.", credit: { creator: "TellusFashion", sourceUrl: "https://commons.wikimedia.org/wiki/File:Street_Style_at_London_Fashion_Week_02.jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } },
  { id: "altme-15", department: "menswear", image: altme15, title: "Paint-day uniform", style: "Casual", styleType: "RNPS", alt: "A participant in a blue T-shirt, trousers and patterned bandanna at a community wall-painting event.", credit: { creator: "Satish Krishnamurthy from Bombay, India", sourceUrl: "https://commons.wikimedia.org/wiki/File:Bandanna_antennae_(3826642892).jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } },
  { id: "altme-16", department: "menswear", image: altme16, title: "Red sleeves, Tokyo", style: "Casual", styleType: "RNPS", alt: "A pedestrian in red and black layers with loose dark trousers on Omotesando.", credit: { creator: "Joe Mabel on Flickr as Joe Mabel from Seattle, US", sourceUrl: "https://commons.wikimedia.org/wiki/File:Harajuku_-_pedestrians_on_Omotesando_05_(15119981404).jpg", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0" } },
  { id: "altme-17", department: "menswear", image: altme17, title: "Loose-fit Paris", style: "Casual", styleType: "RNPS", alt: "A pedestrian seen from behind in a dark graphic top and loose low-slung jeans.", credit: { creator: "Tom Evil", sourceUrl: "https://commons.wikimedia.org/wiki/File:Sagger_in_Paris.jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } },
  { id: "altme-18", department: "menswear", image: altme18, title: "A louder trouser", style: "Quirky", styleType: "RCDS", alt: "Two pedestrians in dark tops and vividly patterned trousers in Brisbane.", credit: { creator: "Chris Olszewski", sourceUrl: "https://commons.wikimedia.org/wiki/File:Street_male_fashion_in_Brisbane,_June_2019.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } },
  { id: "altme-19", department: "menswear", image: altme19, title: "Dad on his bike, 1970", style: "Vintage", styleType: "RNDF", alt: "A man in a pale yellow shirt and dark trousers seated on a motorcycle in Anchorage.", credit: { creator: "Jennie R. F.", sourceUrl: "https://commons.wikimedia.org/wiki/File:Man_on_Motorcycle_1970.jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } },
  { id: "altme-20", department: "menswear", image: altme20, title: "New York, zipped up", style: "Casual", styleType: "RNPS", alt: "Two people on a New York sidewalk wearing hooded outerwear.", credit: { creator: "Bryan Ledgard", sourceUrl: "https://commons.wikimedia.org/wiki/File:New_York_May_2015_(18075423630).jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } },
];
