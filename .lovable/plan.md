# Pairly: Full Implementation Plan (Chunks 1-4), revised

Mobile web app, 390x844 frame, mock data only, one global store.

## 1. Screens and navigation

```text
S01 Welcome --"Find my Style Type"--> S02 Diagnosis (8 rounds, A/B photo)
S01 --"Sign In" (secondary)--> "Coming soon" toast
S02 each round: "Neither" (below photos) / "Skip" (top bar) -> advance, no score
S02 --round 8--> S03 Reveal (code, name, description, 4 axis bars,
                 3 keyword chips, 3 look photos)
S03 --"Retake" (secondary)--> S02
S03 --"Find matches"--> S04 Upload (Match tab)  [tab bar appears from here]
S04 --sample / photo + "Find 3 matches"--> S05 Analyzing (~1.5s) --> S06 Results
S06 top: uploaded item thumbnail + Style Type chip
S06 Safe / One step up / Bold dial --> scrolls to + highlights that card
S06 --"Get feedback"--> Create-post sheet (item + 3 pick thumbnails) --> Social
S06 --"Try another piece"--> S04
S06 card "Shop" --> buyUrl (new tab); heart --> savedItems + toast "Saved"
Tab bar: Match (S04/S06) | Social (S07) | Saved (S08) | Me (S09)
S07 Social: swipe stack, quick feedback, trends carousel, top-rated grid, "Your post"
S07 stack empty --> "You're all caught up" + "See trends" (scrolls to trends)
S07 "+" FAB --> Create-post sheet (user's own outfit photo: upload or sample)
       --> "Post" --> pinned post with live votes
S07 trend / top post tap --> Detail sheet
S08 Saved: simple grid
S09 Me: Style Type summary + "Retake" --> S02
Reset demo (small control, top corner) --> clears store --> S01
Anything else: disabled or "Coming soon" toast. No login anywhere.
```

## 2. Shared components

- PhoneFrame (390px centered, lavender-to-white gradient), ResetDemoButton
- PillButton (primary black / outline), Chip (selectable), StyleTypeChip
- ProgressBar (diagnosis), AxisBar (Reveal, Me), KeywordChips, LookStrip
- ProductCard (image, heart, name, brand, price, boldness label, reason, Shop,
  PairingPreview: your item + this pick)
- BoldnessDial (segmented Safe / One step up / Bold)
- UploadDropzone (Take photo / Choose from library, `capture` attr)
- BottomTabBar, FloatingPlusButton, BottomSheet
- SwipeCard + VoteButtons, QuickFeedbackRow, EmptyStack, TrendCard, TopPostCard, VoteSplitBar
- Toaster (sonner) mounted once

## 3. Global state (React Context, in memory)

```ts
{
  screen: 'welcome'|'diagnosis'|'reveal'|'upload'|'analyzing'|'results';
  activeTab: 'match'|'social'|'saved'|'me';
  answers: ('A'|'B'|null)[];        // 8; null = Neither / Skip
  styleType: StyleTypeCode | null;  // fallback TNPF
  uploadedItem: { image; category; attributes: string[]; source: 'upload'|'sample' } | null;
  occasion: 'coffee'|'recruiting'|'date'|'weekend' | null;
  picks: { safe; step; bold } | null;   // CatalogItem + reason
  savedItems: string[];
  posts: SocialPost[];
  userVotes: Record<postId, 'up'|'down'>;
}
```
Actions: answer, computeType, setUpload, setOccasion, generatePicks, toggleSave, vote, addFeedback, createPost, retake (keeps uploadedItem, recomputes picks), reset.

## 4. Mock data

- **StyleType** (16; 4 given, 12 names/descriptions drafted by me for your review):
  `{ code, name, description, keywords: string[], looks: string[], axes: {fit, color, detail, mood} }`
- **DiagnosisRound** (8, 2 per axis): `{ id, axis, a: {image, letter}, b: {image, letter} }`.
  Tie or no answers on an axis -> that axis letter from TNPF.
- **CatalogItem** (~40, 7 categories, $40-$400): `{ id, name, brand, price, image, category, tags, boldness, buyUrl, pairsWith }`
- **SampleItem** (4): navy blazer, camel coat, denim, oxford shirt. Real uploads default to jacket + category selector, generic attributes.
- **Matching**: exclude same/near-duplicate category, score by axis-tag overlap (+occasion bias), best per boldness, **3 picks from 3 different categories**; template reason. No sponsor field.
- **SocialPost**: `{ id, author, image, pickImages?, styleType, occasion, question, votesUp, votesDown, topFeedback[], isUserPost? }` (~15)
- **TrendCard** (5): `{ id, title, postCount, image, description }`

## 5. Build order

- **Chunk 1**: design tokens, PhoneFrame, store, Reset demo, Welcome (+ Sign In toast) -> Diagnosis (Neither / Skip) -> Reveal (keywords, looks, Retake).
- **Chunk 2**: Upload, samples, file input, analyzing, category selector, attribute chips, occasion chips. Ends at Results placeholder.
- **Chunk 3**: catalog, matching, Results (item thumbnail + type chip, boldness dial, 3 cards with pairing preview, Saved toast, Shop, no-ads note, "Get feedback" -> Coming soon until Chunk 4, "Try another piece").
- **Chunk 4**: tab bar, Social (swipe, quick feedback, empty state, trends, top rated, detail sheet), create-post sheet (two photo sources) + live votes, Saved grid, Me + Retake; wire "Get feedback".

## Decisions (resolved)

1. No separate Share screen.
2. Saved and Me stay simple.
3. No login anywhere.
4. Retake keeps uploadedItem, recomputes picks.
5. Default TNPF.
6. Simulated upload analysis is acceptable.
7. Post photo: "Get feedback" = item + 3 pick thumbnails; "+" = user's own outfit photo.
8. I draft the other 12 Style Types; you review later.
