# Pairly: Full Implementation Plan (Chunks 1-4)

Mobile web app, 390x844 frame, mock data only, one global store.

## 1. Screens and navigation

```text
S01 Welcome --"Find my Style Type"--> S02 Diagnosis (8 rounds, A/B photo)
S02 --round 8--> S03 Reveal (4-letter code, name, description, 4 axis bars)
S03 --"Find matches"--> S04 Upload (Match tab)  [tab bar appears from here]
S04 --sample / photo + "Find 3 matches"--> S05 Analyzing (~1.5s) --> S06 Results
S06 --"Get feedback"--> Create-post sheet (prefilled: item + 3 picks) --> Social tab
S06 --"Try another piece"--> S04
S06 card "Shop" --> buyUrl (new tab); heart --> savedItems + toast "Saved"
Tab bar: Match (S04/S06) | Social (S07) | Saved (S08) | Me (S09)
S07 Social: swipe stack, quick feedback, trends carousel, top-rated grid, "Your post"
S07 "+" FAB --> Create-post sheet --> "Post" --> pinned post with live votes
S07 trend / top post tap --> Detail sheet
S09 Me: Style Type + axes, "Retake style diagnosis" --> S02
Reset demo (small control, top corner) --> clears store --> S01
Anything else: disabled or "Coming soon" toast
```

## 2. Shared components

- PhoneFrame (390px centered, lavender-to-white gradient), ResetDemoButton
- PillButton (primary black / outline), Chip (selectable), StyleTypeChip
- ProgressBar (diagnosis), AxisBar (Reveal, Me)
- ProductCard (image, heart, name, brand, price, boldness label, reason, Shop)
- UploadDropzone (Take photo / Choose from library, `capture` attr)
- BottomTabBar, FloatingPlusButton, BottomSheet
- SwipeCard + VoteButtons, QuickFeedbackRow, TrendCard, TopPostCard, VoteSplitBar
- Toaster (sonner) mounted once

## 3. Global state (React Context, persisted to nothing)

```ts
{
  screen: 'welcome'|'diagnosis'|'reveal'|'upload'|'analyzing'|'results';
  activeTab: 'match'|'social'|'saved'|'me';
  answers: ('A'|'B')[];             // 8
  styleType: StyleTypeCode | null;  // fallback TNPF for demo
  uploadedItem: { image; category; attributes: string[]; source: 'upload'|'sample' } | null;
  occasion: 'coffee'|'recruiting'|'date'|'weekend' | null;
  picks: { safe; step; bold } | null;   // CatalogItem + reason
  savedItems: string[];                 // catalog ids
  posts: SocialPost[];                  // presets + user posts
  userVotes: Record<postId, 'up'|'down'>;
}
```
Actions: answer, computeType, setUpload, setOccasion, generatePicks, toggleSave, vote, addFeedback, createPost, retake, reset.

## 4. Mock data

- **StyleType** (16): `{ code, name, description, axes: {fit:'T'|'R', color:'N'|'C', detail:'P'|'D', mood:'F'|'S'} }`
- **DiagnosisRound** (8, 2 per axis): `{ id, axis, a: {image, letter}, b: {image, letter} }`; tie-break per axis by round order.
- **CatalogItem** (~40, 7 categories, $40-$400): `{ id, name, brand, price, image, category, tags: {fit,color,detail,mood}, boldness: 'safe'|'step'|'bold', buyUrl, pairsWith: ItemCategory[] }`
- **SampleItem** (4): navy blazer, camel coat, denim, oxford shirt with attributes.
- **Matching**: exclude same/near-duplicate category, score by axis-tag overlap (+occasion bias), take best per boldness; reason from template `"{pick} keeps your {item} {adjective}."`. No sponsor field.
- **SocialPost**: `{ id, author, image, styleType, occasion, question, votesUp, votesDown, topFeedback[], isUserPost? }` (~15)
- **TrendCard** (5): `{ id, title, postCount, image, description }`

## 5. Build order

- **Chunk 1**: design tokens (serif + sans fonts, gradient, pill buttons), PhoneFrame, store, Reset demo, Welcome -> Diagnosis -> Reveal. Clickable end: Reveal shows type.
- **Chunk 2**: Upload screen, samples, real file input, analyzing state, category selector, attribute chips, occasion chips. Clickable end: "Find 3 matches" goes to Results placeholder.
- **Chunk 3**: catalog, matching, Results (3 ProductCards, saved toast, Shop link, no-ads note, "Get feedback" -> Coming soon until Chunk 4, "Try another piece"). Clickable end: full match flow.
- **Chunk 4**: tab bar, Social (swipe + buttons, quick feedback, trends, top rated, detail sheet), create-post sheet + simulated live votes, Saved grid, Me with retake; wire "Get feedback". Clickable end: full demo loop.

## Conflicts and open questions

1. Results bottom buttons: Chunk 3 originally said "Ask a friend" -> Share; updated to "Get feedback" -> create-post sheet. Plan uses the update; no separate Share screen.
2. Saved and Me tabs come from Chunk 4 and exceed "only build what's asked"? Confirm they stay simple (Saved grid, Me profile).
3. Sign-up: principle says login only after picks. No login is planned anywhere; confirm none needed.
4. Retake diagnosis: keep uploadedItem/picks, or clear them? Plan: keep item, recompute picks.
5. Direct entry without diagnosis: default Style Type TNPF, OK?
6. Real uploads cannot be analyzed; category defaults to jacket with selector, attributes are generic. Acceptable for demo?
7. Create-post photo: use uploaded item image, or an outfit photo? Plan: uploaded item plus 3 pick thumbnails.
8. Style Type names for all 16 still draft; only 4 given.
