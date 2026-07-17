# Floor Plan Version — Mobile Optimization

## Problem

`/floor-plan-version` renders a fixed 1728×1117px illustrated "house" canvas
(`FloorPlanScene.tsx`) that `FloorPlanScaler.tsx` uniformly scales down to fit
the viewport width: `scale = containerWidth / ROOT_W`.

On a phone (~375px wide) this gives `scale ≈ 0.22`, which shrinks everything
proportionally:

- Hero text (36px) renders at ~8px — unreadable.
- Social icons (~41–49px native) render at ~9–11px — well under any usable
  touch-target size.
- The whole page becomes a small, static illustration rather than a usable
  navigational UI.

## Goals

- Preserve the exact illustration as-is (rooms, walls, trees, hero copy,
  foyer content) — no redesign of `FloorPlanScene.tsx`.
- Make it legible and tappable on phone-sized viewports by rendering at a
  larger fixed scale, accepting horizontal scrolling as the tradeoff.
- Land mobile visitors on the hero/entrance area first, not a random corner.
- Keep desktop/tablet behavior completely unchanged.

## Non-goals

- No pinch-to-zoom or custom pan/zoom gesture handling.
- No mobile-specific redesign or simplified content layout.
- No changes to room content, links, tooltips, or interactivity.

## Design

### Scale: clamp, not a breakpoint

Change the scale calculation in `FloorPlanScaler.tsx` from:

```ts
setScale(container.getBoundingClientRect().width / ROOT_W);
```

to:

```ts
const MOBILE_MIN_SCALE = 0.65;
setScale(Math.max(MOBILE_MIN_SCALE, container.getBoundingClientRect().width / ROOT_W));
```

`0.65 * ROOT_W ≈ 1123px` is the natural crossover point. Above that
container width, `containerWidth / ROOT_W` is already ≥ 0.65, so the clamp
never engages and behavior is byte-for-byte identical to today. Below it
(phone-sized viewports), the scale floors at 0.65 and the canvas becomes
wider than the viewport.

At 0.65x: social icons render at ~27px, hero text at ~23px — both
meaningfully legible/tappable, at the cost of needing to scroll
horizontally roughly 3 phone-widths to see the full house.

### Scrolling

When the scaled canvas is wider than its container, the wrapper needs to
scroll horizontally instead of clipping. `page.tsx`'s outer wrapper
currently sets `overflow-hidden`; this needs to become horizontally
scrollable specifically on the `FloorPlanScaler` container:

- Apply `overflow-x-auto` to the scroll container (the ref'd div in
  `FloorPlanScaler`).
- Leave vertical scroll as normal page flow — this component is the entire
  page's content, not a boxed sub-panel, so no nested vertical scroll
  container is needed.
- The container's own height stays `ROOT_H * scale` as today, so it never
  needs vertical clipping/scrolling itself.

### Hidden scrollbar

Add a scoped CSS class (e.g. `.floor-plan-scroll`) applied only to this
scroll container:

```css
.floor-plan-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* legacy Edge/IE */
}
.floor-plan-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari/WebKit */
}
```

Scrolling remains fully functional via touch swipe, mouse wheel, and
keyboard — only the visual scrollbar track/thumb disappears. Scoped to this
one container so no other page's scrollbars are affected.

### Initial scroll position

On mount (and after any resize/scale change), when the clamp is active,
compute the on-screen position of the hero/entrance area within the scaled
canvas and set `scrollLeft` / `scrollTop` so that point is horizontally and
vertically centered in the viewport.

The hero paragraphs sit at approximately:

- Horizontal: centered within the house (`left: calc(50% - 263.5px)`
  relative to the house, which is itself horizontally centered in the root
  canvas via `HOUSE_LEFT`).
- Vertical: `top: 508–528` within the house (`HOUSE_TOP = 27` offset), i.e.
  roughly the upper-middle of the 1117px-tall root canvas.

Compute an approximate target point from these known constants (no DOM
measurement of the actual text needed — the layout is fixed/authored, not
dynamic), multiply by `scale`, and center it in the scroll container on
mount when the clamp is active. When the clamp isn't active (desktop/tablet,
no overflow), this is a no-op since there's nothing to scroll.

### What doesn't change

- `FloorPlanScene.tsx` — completely untouched. Same rooms, same links, same
  tooltips, same tap targets (in canvas-space; they just render larger at
  0.65x than before).
- Desktop/tablet rendering — unchanged, verified by the clamp's crossover
  math above.

## Testing / verification

Manually verify in the browser preview at a spread of widths:

- **~375px, ~414px (phone):** scale is fixed at 0.65, container scrolls
  horizontally, scrollbar is visually hidden, initial view is centered on
  the hero/foyer area, room links/tooltips/social icons are tappable.
- **~768px, ~1024px (tablet):** confirm whether the clamp engages or not
  per the crossover math, and that whichever applies looks correct.
- **~1280px, ~1440px+ (desktop):** confirm pixel-identical behavior to
  before the change (no clamp engagement, no scrollbar, no forced initial
  scroll).

## Open questions

None — design approved as presented.
