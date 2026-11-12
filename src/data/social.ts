import type { Occasion } from "./samples";
import { LOOK_IMAGES as L, type StyleTypeCode } from "./styleTypes";

export interface SocialPost {
  id: string; author: string; image: string; pickImages?: string[];
  styleType: StyleTypeCode; occasion: Occasion | null; question: string;
  votesUp: number; votesDown: number; topFeedback: string[]; isUserPost?: boolean;
}
export interface Trend { id: string; title: string; postCount: number; image: string; description: string; votesUp: number; votesDown: number; topFeedback: string[] }

export const FEEDBACK_CHIPS = ["Great fit", "Try darker shoes", "Too formal", "Add a layer"];

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=70`;
type R = [string, string, StyleTypeCode, Occasion | null, string, number, number, string[]];
const rows: R[] = [
  ["@jun.k", L.suit, "TNPF", "recruiting", "Too formal for a coffee chat?", 128, 22, ["Great fit", "Too formal", "Add a layer"]],
  ["@marco.d", L.street, "RCDS", "weekend", "Is this too much color?", 94, 31, ["Great fit", "Try darker shoes", "Add a layer"]],
  ["@sam_lee", L.casual, "RNPS", "coffee", "Good enough for a first meeting?", 141, 12, ["Great fit", "Add a layer", "Try darker shoes"]],
  ["@theo.w", L.coat, "TNDF", "date", "Coat over a knit, or too warm?", 176, 9, ["Great fit", "Add a layer", "Too formal"]],
  ["@raj.p", L.tee, "RNPS", "weekend", "Basic tee okay for brunch?", 87, 40, ["Add a layer", "Great fit", "Try darker shoes"]],
  ["@ben.o", L.suit2, "TCPF", "recruiting", "Is the blue suit right for banking?", 102, 18, ["Great fit", "Too formal", "Try darker shoes"]],
  ["@kai.m", L.denim, "RNDS", "weekend", "Double denim, yes or no?", 66, 58, ["Try darker shoes", "Great fit", "Add a layer"]],
  ["@leo.c", L.fashion, "TCDS", "date", "Too loud for dinner?", 79, 35, ["Great fit", "Too formal", "Add a layer"]],
  ["@dan.h", L.street2, "TNPS", "coffee", "Clean enough for a coffee chat?", 133, 14, ["Great fit", "Add a layer", "Try darker shoes"]],
  ["@ali.r", L.suit3, "TNDF", "recruiting", "Tweed for a recruiting dinner?", 115, 21, ["Great fit", "Too formal", "Add a layer"]],
  ["@nate.b", u("1515886657613-9f3515b0c78f"), "RNPF", "date", "Relaxed trousers on a date?", 92, 19, ["Great fit", "Try darker shoes", "Add a layer"]],
  ["@will.t", u("1500648767791-00dcc994a43e"), "TNPS", "weekend", "Does this work for a gallery?", 71, 22, ["Great fit", "Add a layer", "Too formal"]],
  ["@chris.y", u("1507003211169-0a1dd7228f2d"), "RNDF", "coffee", "Corduroy too old-school?", 58, 27, ["Great fit", "Try darker shoes", "Add a layer"]],
  ["@eli.s", u("1492562080023-ab3db95bfbce"), "RCPS", "weekend", "Bright jacket for a game day?", 83, 30, ["Great fit", "Add a layer", "Too formal"]],
  ["@max.v", u("1506794778202-cad84cf45f1d"), "TNPF", "date", "Shirt tucked or untucked?", 120, 16, ["Great fit", "Too formal", "Try darker shoes"]],
];
export const POSTS: SocialPost[] = rows.map(([author, image, styleType, occasion, question, votesUp, votesDown, topFeedback], i) => ({ id: `p${i + 1}`, author, image, styleType, occasion, question, votesUp, votesDown, topFeedback }));

export const TRENDS: Trend[] = [
  { id: "t1", title: "Quiet layering", postCount: 248, image: L.coat, description: "Knit under coat, all in close neutrals.", votesUp: 412, votesDown: 38, topFeedback: ["Great fit", "Add a layer", "Too formal"] },
  { id: "t2", title: "Relaxed trousers", postCount: 196, image: L.casual, description: "Wider legs with a neat top half.", votesUp: 301, votesDown: 47, topFeedback: ["Great fit", "Try darker shoes", "Add a layer"] },
  { id: "t3", title: "Loafers over sneakers", postCount: 173, image: L.suit2, description: "Swapping sneakers for loafers with jeans.", votesUp: 288, votesDown: 52, topFeedback: ["Great fit", "Too formal", "Try darker shoes"] },
  { id: "t4", title: "Workwear jackets", postCount: 151, image: L.denim, description: "Chore coats and canvas in earthy tones.", votesUp: 240, votesDown: 41, topFeedback: ["Great fit", "Add a layer", "Try darker shoes"] },
  { id: "t5", title: "One color pop", postCount: 128, image: L.fashion, description: "Neutral outfit, one bright piece.", votesUp: 199, votesDown: 44, topFeedback: ["Great fit", "Too formal", "Add a layer"] },
];
