# Kinetic Plate Facade — Mechanics Prototype Design

## Concept

Inspiration: a building facade clad in metallic plates, each pinned only at its top edge, free to swing outward and settle back — wind makes them sway individually, catching light at different angles as they move (photo reference provided by user shows the resulting light/shadow "wave" across the facade).

This will eventually become the hero background for the site's Playground page (a planned showcase page for experimental/craft work, separate from the main portfolio case studies and separate from the existing "Gallery of Experiments" 3D world spec at `public/new-homepage-plan/playground-section-spec.html`). The eventual hero version will render the plates as an irregular mosaic of four shape types (triangle, square, hexagon, pentagon) rather than uniform rectangles, with a headline overlaid on top.

**This spec covers Phase 1 only: an isolated mechanics/motion prototype**, built to lock down the swing physics and metallic lighting before adding shape variety or integrating it into the real hero. This follows the project's existing pattern of standalone effect-test routes (see `app/water/page.tsx`, `app/sunlight/page.tsx`).

An earlier alternate idea (cursor-driven mask/shader reveal, inspired by the UW Design Show 2022 site) was considered and explicitly dropped in favor of this kinetic-facade direction.

## Scope boundaries

**In scope for this prototype:**
- A grid of uniform rectangular plates, each pinned at its top edge
- Pendulum-style swing physics driven by cursor position as a "wind" input, with a ripple/falloff radius (nearby plates react most, effect decreases with distance)
- Realistic metallic PBR lighting (fixed light source, not cursor-following)
- Respects `prefers-reduced-motion`

**Explicitly out of scope for this prototype** (later work, not part of this plan):
- Irregular mosaic of triangle/square/hexagon/pentagon shapes
- Integration into the actual Playground hero page (headline, copy, final layout)
- Sound / wind-chime effect (deferred — may be added as a follow-up once the visual is validated)
- Mobile/touch-specific idle animation
- Cursor-following secondary light accent (nice-to-have, only added later if the base version needs more sparkle)

Performance is not a hard constraint here — the Playground page is meant to showcase technical range, unlike the rest of the site where the priority has been minimal JS and fast load (per prior portfolio-migration decisions). This prototype is loaded on its own isolated route so it never affects the bundle size of any other page.

## Tech stack

- **`@react-three/fiber`** — React renderer for Three.js, scene/camera/render-loop setup
- **`@react-three/drei`** — `Environment` component with HDRI presets for realistic metallic reflections without manually authoring a lighting rig (preset varies by material variant — see Material & lighting variants below)
- **`MeshPhysicalMaterial`** (or `MeshStandardMaterial` if clearcoat isn't needed) with `metalness`/`roughness`/color tuned per material variant
- **Hand-rolled pendulum physics**, not a full physics engine. Each plate has exactly one rotational degree of freedom (its swing angle around the top hinge), which a full engine like `@react-three/rapier` would be overkill for at this stage. A damped spring/pendulum formula per plate, updated in a single `useFrame` loop, gives full control over the feel with no added WASM dependency.
  - Noted as a considered alternative: `@react-three/rapier` (Rapier physics via WASM, real revolute/hinge joints, real collision) — worth revisiting later if plate-to-plate collision ("clinking") needs to be physically real rather than a heuristic cue.

## Motion model

Each plate is pinned only at its top edge (matches the reference photo — earlier design draft incorrectly assumed a two-point top-and-bottom pin, corrected during design review).

- Rest state: plate hangs flat (angle ≈ 0, flush against the "wall" plane).
- Per plate, track `angle` and `angularVelocity`.
- Each frame: compute distance from cursor (projected into the plate grid's plane) to the plate's position. Map through a radius-clamped falloff curve to get a "wind torque" input — plates near the cursor get pushed hardest, decreasing with distance, direction pushing outward from the cursor (like a gust passing through).
- Apply gravity torque (pulls back toward rest angle) and damping (energy loss) each frame, integrate `angularVelocity` and `angle`.
- Result: plates near the cursor swing open, overshoot slightly, and oscillate back to rest — a real pendulum, not just an eased tween — while the effect ripples outward as the cursor moves, matching the "wind blowing through" feel from the original brief.
- Rendered via `rotateX` on each plate's group, with `transform-origin`/pivot at the top edge (in R3F terms: position the plate mesh's geometry offset so the group's local origin sits at the hinge, and rotate the group).

## Material & lighting variants

Two selectable material presets, each paired with lighting tuned to suit it:

- **Steel / Aluminum (default)** — cool, brushed-metal tone matching the portfolio's existing clean visual language. Paired with a neutral/cool HDRI preset (e.g. drei's `studio` or `city` preset) so reflections read crisp and sleek.
- **Copper / Brass** — warm tone matching the original architectural reference photo. Paired with a warm HDRI preset (e.g. `sunset`/`warehouse`) for an oxidized-copper glow.

Both variants share the same geometry, plate grid, and pendulum physics — only `metalness`/`roughness`/base color and the `Environment` preset swap. A small toggle control in the prototype UI switches between the two live, so look and lighting can be compared side-by-side under identical motion, without navigating away. Steel/aluminum is the default given the goal of matching the portfolio's clean look; copper/brass stays available as the secondary option since it's the closer match to the original building reference.

## Lighting model

The light source is **fixed**, not tied to the cursor, for either variant. This is intentional: the reference photo's light/shadow wave comes entirely from each plate's own swing angle catching a constant light source differently — if the light instead followed the cursor, that traveling-wave effect would collapse into a simple spotlight-follows-mouse effect and lose the "wind" read.

- Wind (motion) and light (shading) are deliberately decoupled: cursor drives physics only, never lighting.
- A secondary cursor-following point light, as a subtle glint accent layered on top of the fixed lighting, is a possible later addition — not built in this first pass, and not tied to either material variant specifically. Only add if the base version reads as needing more sparkle once it's moving on screen.

## Accessibility

- `prefers-reduced-motion: reduce` → plates render at rest (no swing animation), matching the existing pattern in `app/components/HeroPriyamwadaWord.tsx`.

## File structure

New standalone route, following the existing `app/water/`, `app/sunlight/` convention (bare effect + a "back home" link, no site nav/header):

- `app/kinetic-facade/page.tsx` — route entry, owns the active material-variant state and renders the toggle control
- `app/kinetic-facade/KineticFacadeScene.tsx` — R3F Canvas, scene setup, Environment/lighting (reads the active variant)
- `app/kinetic-facade/KineticPlateGrid.tsx` — generates the uniform plate grid, owns the per-plate physics state and pointer tracking
- `app/kinetic-facade/materialVariants.ts` — the two variant presets (color/metalness/roughness/HDRI preset name)

(Route/file names are a starting proposal — easy to rename before or during implementation.)

## Testing / verification

Since this is a visual/motion prototype, verification is manual in-browser:
- Confirm plates hang flat at rest with visible metallic sheen from the fixed light, in both material variants.
- Move cursor across the grid: nearby plates should swing open with a pendulum overshoot-and-settle motion, with a visible falloff (farther plates react less).
- Confirm the light/shadow highlight moves believably as plates swing (fixed-light PBR should produce this automatically), in both material variants.
- Switch the variant toggle mid-interaction and confirm material/lighting swap cleanly without disrupting in-progress plate motion.
- Toggle OS-level reduced-motion and confirm plates go static.
