<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Main demo screens switch through PairlyContext on `/`; saved outfit details use `/saved/$id`, with the provider at the root so in-memory collections survive navigation.
- Track Feed hint dismissal in shared React state; why: it appears only once per demo session across tab and detail navigation, without persistence.
- Style generation uses server-only AI Gateway planning and reference-image edits; per-look results live in shared React state, never fall back to demos; the exact Jason chinos sample reserves its first slot for an owned photo and renders only the other two, while the Saved detail retains OutfitResultView.
- Reuse Style generation for identical garment/category/occasion/mood inputs and reveal the first success unless a look was explicitly selected; why: returning never repeats inference and mobile never waits on a slower default look.
- Keep selected Style concept in shared React state and expand only Style results on desktop; why: look selection survives tab navigation without widening other screens.
- Saved collections and uploads remain in React state with literal mock seeds; why: this demo intentionally resets on refresh without a backend.
- Mock data lives in `src/data/*`, pure logic in `src/lib/*` with vitest tests beside it; why: keeps rules testable without UI.
- Share swipe gestures through SwipePhotoCard across quiz and Social; why: keeps drag, tilt, stamps, and cancellation consistent.
- Store quiz axis scores, skip status, and exploration separately from the internal style code; why: Reveal needs continuous markers and Results can later consume exploration without changing types.
- Matching returns three tiered looks with two catalog picks each, enforcing the missing garment per look; why: outfit completeness must hold independently of rendering.
- Feedback composes the selected outfit board into a browser-generated image and retains its two pick images; why: Social can show full-look posts without altering its flow.
- Keep attributed vote cohorts and feedback on mock posts, and retain saved look snapshots plus posted boards in the shared store; why: Social filters and Me history must stay consistent after switching pieces.
- Persist the Menswear/Womenswear clothing preference in localStorage (read in an effect) and include it in the Style request key; why: returning visitors skip the choice and a change invalidates stale moodboards.
- Keep shopping RPCs server-side and on-demand, restrict discovery to configured retailer product paths, and key shared per-role results by outfit, preference, market and budget; why: browsing never regenerates moodboards or exposes unrestricted URL fetching.

- Keep legacy SAMPLES order for unchanged DEV defaults; use UPLOAD_SAMPLES for the Jason-first chooser, and store uploaded Jason media as local CDN asset pointers; why: preserves presets without committing binary uploads.
