# Playground Page — Design

## Concept

A new page at `/playground` whose entire first impression is the kinetic facade prototype built at `/kinetic-facade` (steel/copper metal plates, pendulum swing physics, cursor/touch-driven wind, click/tap-triggered particle dissolve) — but now acting as a real, full-viewport curtain in front of the page's actual content, rather than a standalone demo with a toggle panel.

On load, a visitor sees **only** the facade — no nav, no cards, nothing else. Moving the cursor (or dragging a finger on mobile) makes nearby plates lift and sway, giving a peek at what's underneath. Clicking/tapping the facade triggers the dissolve-out ripple already built for the "Dissolve" variant: plates disperse into scattered dust and disappear, sweeping outward from the click point, permanently revealing the page underneath.

This is the integration phase the original kinetic-facade prototype spec explicitly deferred ("Integration into the actual Playground hero page... later work, not part of this plan").

## Scope boundaries

**In scope for this pass:**
- New page, real page content (Nav, Footer, a grid of placeholder project cards) following the site's existing homepage layout conventions
- Facade as a full-viewport overlay on top of that content
- Desktop: hover-peek (existing wind mechanic, unchanged) + click-to-dissolve (existing ripple mechanic, unchanged)
- Mobile: drag-to-peek (same wind mechanic, driven by touch position instead of pointer position) + tap-to-dissolve
- Once fully dissolved, the facade becomes click-through so the real page (Nav, cards, Footer) is normally interactive

**Explicitly out of scope for this pass:**
- Dissolve-back-in / re-covering the page. First click/tap dissolves and that's final for this pass — no toggle back. (You're still deciding what should trigger this later.)
- Real project card content/styling — cards in this pass are plain placeholders (white rounded rectangles + label/date row underneath, matching the shape of your reference image, no live preview content inside).
- An accessibility bypass for keyboard-only/reduced-motion users who can't trigger a mouse/touch dissolve. This was flagged during design discussion and consciously deferred, not overlooked — worth solving before this page is the primary way to reach your project work, but not blocking this pass.

## Page structure & layering

Two independent layers:

1. **Page content** — a normal route rendered through the site's standard `AppChrome` treatment (same as the homepage): `Nav` at the top in normal document flow (not fixed/sticky, matching its current behavior), a card grid container using the same `w-[86%] max-w-[1008px] mx-auto` pattern already repeated across `app/page.tsx`, `app/about/page.tsx`, `Nav.tsx`, and `Footer.tsx` (no shared container component exists in this codebase yet — this follows the existing copy-per-file convention rather than introducing a new abstraction), and `Footer` at the bottom. No hero header — the card grid is the page's main content, starting right below Nav.
2. **Facade overlay** — a `fixed`, full-viewport (`100vw`/`100vh`) layer stacked above the page content via z-index, completely independent of the page's own max-width/margins. Because Nav isn't fixed, the facade covering the whole viewport is sufficient to hide it too — no special-casing needed.

## Facade behavior

**Desktop:**
- `pointermove` over the facade drives the existing continuous wind-field peek (plates near the cursor lift and settle) — reuses the mechanic as-is.
- `click` on the facade triggers the existing dissolve-out ripple (sweeps outward from the click point, plates disperse into dust).

**Mobile:**
- `touchmove` drives the same wind-field peek, using touch position in place of pointer position — no new physics, just an additional event listener feeding the same calculation.
- `tap` triggers the same dissolve-out ripple as desktop's click.

**Dissolve is one-directional for this pass:** once a click/tap starts the dissolve, it runs to completion and stays dissolved. Repeat clicks/taps during or after the dissolve do nothing (no re-toggle).

**Click-through handoff:** once every plate has fully dissolved (progress ≈ 1), the facade stops capturing pointer events entirely (`pointer-events: none` on its container), and the real page underneath — Nav, card grid, Footer — becomes normally interactive, exactly as if the facade were never there.

## Card grid placeholder

Matching the shape of the reference image you shared: white, rounded-corner cards on the page's dark background, arranged in a grid, each with a title and date in a row beneath the card (not inside it). For this pass, each card's interior is a plain placeholder block — no live preview content — since the real card component/styling will be shared and swapped in later without needing to touch the grid layout itself.

**Grid sizing (placeholder default, easy to change later):** 2 columns at desktop widths (matching the 2-up layout in your reference image), 1 column on narrow/mobile widths, with 6 placeholder cards total — enough to show the grid wrapping to a second row without implying a specific final project count.

## Code reuse

The existing `/kinetic-facade` prototype's pure physics/data modules (`plateGrid.ts`, `pendulumPhysics.ts`, `windField.ts`, `ripplePhysics.ts`, `dissolvePhysics.ts`, `dissolvePoints.ts`) and the `KineticFacadeScene` rendering wrapper are reused directly, imported from `app/kinetic-facade/` — none of that logic changes. A new page-specific top-level component replaces `KineticFacadeApp.tsx` (which exists specifically to drive the three-way Steel/Copper/Dissolve toggle demo and isn't needed here): it fixes the material to the copper/dissolve variant, adds the touch-drag listener alongside the existing pointer listener, removes the click-to-toggle-back behavior so dissolve only ever runs outward once, and manages the click-through handoff once fully dissolved.

**Assumption to confirm:** using the copper/dissolve material variant (rather than steel) for this page, since that's the variant with dissolve behavior already built and it matches the "metal plates" architectural reference. Flag if you want a different look.

The `/kinetic-facade` prototype route itself is left untouched — it stays available as a standalone testbed for further tuning.
