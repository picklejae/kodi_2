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

## Prompts for Lovable (enter after the account move)

**Prompt 1**
```
Bug on real phones: in PhoneFrame, `min-h-screen` resolves to 20px below 768px wide, because our `--spacing-screen` token overrides Tailwind's `screen` size. Replace `min-h-screen` with `min-h-dvh` in PhoneFrame (both divs). Change nothing else.
```

**Prompt 2**
```
Welcome screen: after the tagline and divider were removed, the lower block ("What are you looking for?", the toggle, Find My Style, Sign in) moved up about 40px because the column is vertically centered. Put it back where it was without bringing back the text or the line: under the headline add an empty 42px spacer (aria-hidden), and give the lower block 21px top padding. Change nothing else.
```
