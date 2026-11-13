import { JASON_FITS } from "./jason";
import { DEFAULT_CODE, type StyleTypeCode } from "./styleTypes";
import { mockVoteGroups, type Feedback, type SocialPost } from "./social";

const comment = (author: string, styleType: StyleTypeCode, text: string, daysAgo: number): Feedback => ({ author, styleType, text, daysAgo, exploreLevel: styleType === "RCDS" ? "high" : "low" });

export function jasonPosts(styleType: StyleTypeCode = DEFAULT_CODE): SocialPost[] {
  return [
    {
      id: "jason-heritage", author: "@jason", image: JASON_FITS[0]?.image ?? "", styleType, occasion: "weekend", question: "Heritage weekend look. Does it work?", daysAgo: 2,
      votesUp: 38, votesDown: 5, voteGroups: mockVoteGroups(38, 5), exploreLevel: "low", topFeedback: [], isUserPost: true,
      feedback: [
        comment("@minjun", "TNDF", "The waxed jacket with wide chinos is a great balance. Roll the hem once to show the boots.", 2),
        comment("@daniel.k", "RNPF", "Love the check shirt peeking out. A cream knit would soften it for fall.", 2),
        comment("@theo", "TNPS", "Boots feel a bit heavy for the city. Try brown suede loafers.", 2),
        comment("@sam_w", "RNPS", "Exactly the kind of outfit I'd save. Clean and easy.", 2),
      ],
    },
    {
      id: "jason-leather", author: "@jason", image: JASON_FITS[5]?.image ?? "", styleType, occasion: "date", question: "Leather jacket for a night out. Too casual?", daysAgo: 3,
      votesUp: 45, votesDown: 7, voteGroups: mockVoteGroups(45, 7), exploreLevel: "low", topFeedback: [], isUserPost: true,
      feedback: [
        comment("@leo.p", "RCDS", "Ecru chinos keep the leather from feeling heavy. Nice.", 3),
        comment("@jun", "TNPS", "The chain is a good touch. A plain black tee would look sharper than the graphic.", 3),
        comment("@marco", "RNDS", "Great fit. Try a slightly shorter break on the pants.", 3),
      ],
    },
  ];
}