# proto ↔ Lovable diff log

Repo: **picklejae/kodi_2** (moved here 11/13 from marco318/pairly). `main` = what Lovable has (Lovable syncs only `main`). `proto` = Claude's local prototype, published at
https://marco318.github.io/pairly-notes/kodi/ for the team. Lovable never sees this branch.

- See every difference: `git diff main..proto -- src`
- Prototype-only plumbing (never port to Lovable): `pages/`, `vite.pages.config.ts`, `build:pages` script, `.gitignore` lines
- Build: `npm run build:pages` → `dist-pages/` → copy into `pairly-notes/kodi/`
- When an item lands in Lovable: mark it ✅ with the Lovable commit, then merge `main` into `proto`

Base: kodi_2 `main` @ 2183350 (2026-11-13 10:11 CT). Earlier base: pairly `main` @ d35705e.

| # | Change (src/) | Why | Lovable status |
|---|---|---|---|
| 1 | `components/pairly/PhoneFrame.tsx`: `min-h-screen` → `min-h-dvh` (2 places) | Bug: on phones (<768px) `min-h-screen` computes to **20px**, because the custom `--spacing-screen` token overrides Tailwind's `screen` keyword. Real iPhones get screens that aren't full height (Welcome top-aligned, not centered). Lovable's desktop preview hides it (fixed 402×874 frame). | ✅ already in main (team fixed it the same way, d76f4c7) |
| 2 | `screens/Welcome.tsx`: 42px spacer under headline + `pt-[21px]` on lower block | Keep the lower block where it was before the tagline + divider were removed (ef21fbf, 8fb9b55) | ❌ dropped: the team restructured Welcome (863a71c…bad37a2), proto now uses theirs |
| 3 | `screens/Social.tsx`: Your look card slides 48px + fades in over 320ms (ease-out-cubic) from the side of the arrow pressed, clipped inside the card; label shows `· 2/3` | Team: hard to notice the card changed when pressing ← →. v1 (16px/200ms) was too subtle — looked like a glitch. Respects reduced motion. | ⏳ prompt 3 |
| 4 | `screens/Reveal.tsx`, `components/pairly/StyleScales.tsx` (`reveal` prop, Reveal only), `styles.css` (2 keyframes) | "Wow" moment after the quiz, kept refined: one staggered ~1.6s sequence — label → name rises out of a blur → 4 slider dots glide from centre to the user's scores → line, tags, piece photos rise in order → button last. Me screen's sliders unchanged. Reduced motion = no animation. | ⏳ prompt 4 |
| — | `pages/stubs.ts` (prototype only, do not port) | Static site has no AI: planStyle/renderStyleLook return saved results. Oxford sample → Oxford set (3 looks exported from the Lovable cache, `pages/cache/`); pants sample → chinos set A; jacket/coat sample → leather set B; any upload → one of the three by image fingerprint. Shopping off. | n/a |

## Prompts for Lovable (enter after the account move)

_Prompts 1–2 no longer needed (see table)._

**Prompt 3**
```
Feed, "Your look" card: when the ← → arrows change the look, it's hard to notice. Wrap the image + text in an element keyed by the post id, inside an overflow-hidden wrapper (so the arrows stay unclipped), and give it an enter animation: fade in plus a 48px slide from the side of the arrow pressed (next = from right, previous = from left), 320ms with ease-out-cubic `cubic-bezier(0.33,1,0.68,1)`, none when the user prefers reduced motion (tw-animate-css: `animate-in fade-in slide-in-from-right-12 duration-[320ms]`). Also show the position in the label, e.g. "Your look · 2/3", when there is more than one. Keep the arrows and card frame still. Change nothing else.
```

**Prompt 4**
```
Reveal screen (style-type result after the quiz): add one refined entrance sequence, about 1.6s total, no bounce, ease cubic-bezier(0.22,1,0.36,1).
1. 0ms: "Your Style Type" label fades up 14px (560ms).
2. 180ms: the "You're a …" title fades in from 18px below, scale 0.98, blur 8px → sharp (900ms).
3. 520ms: the 4 slider rows fade up, 70ms apart. Each dot starts at the centre and glides to the user's score (900ms, starting 250ms after its row, 110ms apart). Add this as an opt-in `reveal` prop on StyleScales so the Me screen stays static.
4. 980ms: the description line; 1080ms: tags, 60ms apart; 1200ms: "Pieces people like you wear"; 1280ms: the 4 piece photos, 70ms apart; 1600ms: the Start exploring button.
Use two CSS keyframes (rise, focus) with a per-element delay variable and `animation-fill-mode: both`. Turn everything off under prefers-reduced-motion. Remove the old whole-screen fade-in. Change nothing else.
```
