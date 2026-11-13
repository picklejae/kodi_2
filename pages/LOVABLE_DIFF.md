# proto ↔ Lovable diff log

`main` = what Lovable has (Lovable syncs only `main`). `proto` = Claude's local prototype, published at
https://marco318.github.io/pairly-notes/kodi/ for the team. Lovable never sees this branch.

- See every difference: `git diff main..proto -- src`
- Prototype-only plumbing (never port to Lovable): `pages/`, `vite.pages.config.ts`, `build:pages` script, `.gitignore` lines
- Build: `npm run build:pages` → `dist-pages/` → copy into `pairly-notes/kodi/`
- When an item lands in Lovable: mark it ✅ with the Lovable commit, then merge `main` into `proto`

Base: `main` @ d35705e (2026-11-13 01:33 CT)

| # | Change (src/) | Why | Lovable status |
|---|---|---|---|
| 1 | `components/pairly/PhoneFrame.tsx`: `min-h-screen` → `min-h-dvh` (2 places) | Bug: on phones (<768px) `min-h-screen` computes to **20px**, because the custom `--spacing-screen` token overrides Tailwind's `screen` keyword. Real iPhones get screens that aren't full height (Welcome top-aligned, not centered). Lovable's desktop preview hides it (fixed 402×874 frame). | ⏳ prompt 1 |
| 2 | `screens/Welcome.tsx`: 42px spacer under headline + `pt-[21px]` on lower block | Keep the lower block where it was before the tagline + divider were removed (ef21fbf, 8fb9b55) | ⏳ prompt 2 |
| 3 | `screens/Social.tsx`: Your look card slides 48px + fades in over 320ms (ease-out-cubic) from the side of the arrow pressed, clipped inside the card; label shows `· 2/3` | Team: hard to notice the card changed when pressing ← →. v1 (16px/200ms) was too subtle — looked like a glitch. Respects reduced motion. | ⏳ prompt 3 |
| — | `pages/stubs.ts` (prototype only, do not port) | Static site has no AI: planStyle/renderStyleLook return saved results. Oxford sample → Oxford set (3 looks exported from the Lovable cache, `pages/cache/`); pants sample → chinos set A; jacket/coat sample → leather set B; any upload → one of the three by image fingerprint. Shopping off. | n/a |

## Prompts for Lovable (enter after the account move)

**Prompt 1**
```
Bug on real phones: in PhoneFrame, `min-h-screen` resolves to 20px below 768px wide, because our `--spacing-screen` token overrides Tailwind's `screen` size. Replace `min-h-screen` with `min-h-dvh` in PhoneFrame (both divs). Change nothing else.
```

**Prompt 2**
```
Welcome screen: after the tagline and divider were removed, the lower block ("What are you looking for?", the toggle, Find My Style, Sign in) moved up about 40px because the column is vertically centered. Put it back where it was without bringing back the text or the line: under the headline add an empty 42px spacer (aria-hidden), and give the lower block 21px top padding. Change nothing else.
```

**Prompt 3**
```
Feed, "Your look" card: when the ← → arrows change the look, it's hard to notice. Wrap the image + text in an element keyed by the post id, inside an overflow-hidden wrapper (so the arrows stay unclipped), and give it an enter animation: fade in plus a 48px slide from the side of the arrow pressed (next = from right, previous = from left), 320ms with ease-out-cubic `cubic-bezier(0.33,1,0.68,1)`, none when the user prefers reduced motion (tw-animate-css: `animate-in fade-in slide-in-from-right-12 duration-[320ms]`). Also show the position in the label, e.g. "Your look · 2/3", when there is more than one. Keep the arrows and card frame still. Change nothing else.
```
