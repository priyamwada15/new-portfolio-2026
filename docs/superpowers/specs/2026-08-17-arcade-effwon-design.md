# Arcade EffWon — ASCII Game Rework Design

## Concept

Replace the existing `/ascii-game` route — a 2D lane-dodge sprite game ("ASCII Run") — with a new pseudo-3D (OutRun-style) canvas racer, ported from a Claude Design handoff prototype (`F1 Racer.dc.html`, provided by the user at `C:\Users\mukta\Downloads\F1 Racing Game Concept-handoff`). The name changes too: **Arcade EffWon**.

The new game: pick one of 11 racing teams, a 5-light F1-style countdown, a pseudo-3D scrolling road with corners, rival AI cars to overtake/avoid, a damage system (3 hits = DNF), 8 laps, a minimap, pause, and a checkered-flag podium screen. Visual style: dark background, "Press Start 2P" pixel font, team-colored cars drawn on canvas.

## Scope boundaries

**In scope:**
- New route `app/arcade-effwon/` implementing the full game from the prototype (team select → countdown → racing → gameover/finished), functionally ported to React/TypeScript
- Deleting the old game's route and now-orphaned components
- Updating every live reference to the old game (route path, sitemap, homepage Play card, `/playground` grid) to point at the new one

**Explicitly out of scope:**
- Any settings/config UI for difficulty, grid size, or rival count — the prototype exposes these as Claude-Design editor props; this site has no such editor, so they become hardcoded constants (see Config below)
- Recording new video/poster media or creating a new GitHub repo for the homepage Play card — those fields are removed for now (see Homepage integration below) and left for the user to re-add once new footage/repo exist
- The `{false && (...)}` dead "Frame 10" block in `app/page.tsx`, which also references the old game — it's already unrendered and pre-existing; not touched by this change
- `components/ui/pixelact-ui/button.tsx` and `dialog.tsx` — button.tsx has an unrelated live consumer (`AboutMusicControl.tsx`); dialog.tsx is already-unused pre-existing code, not something this change should remove

## Porting approach

The prototype is a class-based Claude Design component (`DCLogic` + `sc-if`/`sc-for`/`{{ }}` template bindings) driving direct canvas draws. Port 1:1 in behavior to a plain React function component — same game feel, different implementation shell:

- **Mutable game state** (`worldScroll`, `playerOffset`, `speed`, `cars[]`, `damage`, `rank`, `invuln`, `shakeT`, `retireTimer`, `countdownT`, `time`, `lap`, etc.) lives in a `useRef` object, mutated directly inside the per-frame loop — mirrors the prototype's `this.g`. This avoids a React re-render on every physics tick.
- **HUD-visible state** (`screen`, `teamIndex`, `score`, `speed`, `pos`, `time`, `damage`, `paused`, `lightsLit`, `lap`, `best`) lives in `useState`, updated once per frame (or on discrete events like key presses) — same cadence as the prototype's `this.setState` calls.
- **Canvas drawing** stays imperative: a `draw()` function called every `requestAnimationFrame`, doing the same math as the prototype — road/grass striping with curve offset, roadside trees/buildings, car sprites (rect-based pixel art), minimap polyline + player dot.
- **Screens** (`select` / `countdown` / `playing` / `paused` overlay / `gameover` / `finished`) become conditionally-rendered JSX over the canvas, replacing `sc-if`.
- **Carried over unchanged** (same constants/formulas as the prototype — this is the actual game design, not implementation detail):
  - `TEAMS` roster (11 teams, name + primary/accent colors)
  - `TRACK` geometry (length, corners array with distance/sign/width, minimap path points, theme colors)
  - `curveOffset()` corner-bend math, `rollTier()` rival speed distribution, `makeCar()` spawn logic
  - Collision/damage rules (3 hits → DNF), scoring formula, overtake rank tracking, rival respawn/retire logic
  - Countdown timing (5 lights, ~0.55s apart, 3.4s total before green)
  - Web Audio beep SFX via a raw `AudioContext` oscillator (same frequencies/durations as the prototype's `beep()`)
  - `localStorage` best-score persistence (key renamed to `arcade_effwon_best` to avoid colliding with the old `f1racer_best` key, since this is a distinct game identity)

## Config (hardcoded, no settings UI)

The prototype's Claude-Design editor props become fixed constants in the ported component:

```ts
const DIFFICULTY = "normal";      // prototype default; was editable easy/normal/hard
const STARTING_GRID_SIZE = 10;    // prototype default; was editable 6–10
const MIN_RIVALS = 3;             // prototype default; was editable 2–5
```

## Font

Prototype uses "Press Start 2P" from Google Fonts. Add via `next/font/google` in `app/layout.tsx`, following the existing precedent for page-scoped fonts (`ovo`, commented "Temporary: only used by the Asimov page's dialkit font tester"):

```ts
const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});
```

Added to the `<html>` className list alongside the other font variables (global CSS var, scoped usage — only `arcade-effwon`'s own JSX applies `font-[family-name:var(--font-press-start-2p)]` or equivalent).

## Full-bleed page

Like the old `/ascii-game`, this route needs no site nav/footer. In `app/components/AppChrome.tsx`, replace the `bareAsciiGame` check:

```ts
const bareArcadeEffwon =
  pathname === "/arcade-effwon" || pathname.startsWith("/arcade-effwon/");
```

(swapped into the `isBarePage` union in place of `bareAsciiGame`.)

## File structure

- `app/arcade-effwon/page.tsx` — route entry, metadata only:
  - `title: "Arcade EffWon | Priyamwada Pandey"`
  - `description`: something like "A pseudo-3D pixel-art F1 racer — pick a team, survive 8 laps, don't DNF."
- `app/arcade-effwon/ArcadeEffWonGame.tsx` — `"use client"`, the entire game (canvas ref, game loop, screens, HUD sidebar, controls legend)

No dependency on `AboutRaceGameOverlay`, `AboutRaceStrip`, or `pixelact-ui` — this is a self-contained component.

## Deletions

- `app/ascii-game/` (whole directory — `page.tsx` + `AsciiGamePageClient.tsx`)
- `app/about/AboutRaceGameOverlay.tsx`
- `app/about/AboutRaceStrip.tsx`
- `components/ui/pixelact-ui/toast.tsx` (its only consumer, `AboutRaceStrip`, is deleted above — genuine orphan of this change)
- `public/ASCII F1 Car.svg` (confirmed unused outside the deleted files)

Kept as-is (not orphaned by this change, or pre-existing/unrelated):
- `components/ui/pixelact-ui/button.tsx` — used by `app/about/AboutMusicControl.tsx`
- `components/ui/pixelact-ui/dialog.tsx` — already unused before this change
- `components/ui/pixelact-ui/styles/styles.css` — still imported by kept button styling
- `public/ASCII game poster.png`, `public/play/ascii-game-poster.avif` — public assets, only code references are removed; files left in place

## Integration touches

- **`app/sitemap.ts`**: `/ascii-game` → `/arcade-effwon`
- **`app/lib/playPortfolio.ts`** (drives both the homepage Play tab and `/playground` grid via `PLAY_PORTFOLIO_ITEMS`):
  - id `ascii-run` → `arcade-effwon` (and update the matching entry in `HOME_PLAY_TAB_ITEM_IDS`)
  - `title`: "Arcade EffWon"
  - `tagParts`: updated to describe the new game (e.g. `["Mini-game", "Canvas", "Next.js", "Aug 2026"]`)
  - `description`: rewritten for the pseudo-3D racer (team select, 8 laps, damage system)
  - `experienceCta`: `{ label: "Play Game", href: "/arcade-effwon", ariaLabel: "Play Arcade EffWon" }`
  - **Removed** (stale until the user records new footage / pushes a new repo): `videoSrc`, `posterSrc`, `githubLiquidCta`
  - Confirmed safe: both `PlaygroundCardGrid.tsx` (`if (!item.videoSrc)` → blank placeholder card) and the (currently-unused) home-tab path handle a missing `videoSrc`/`githubLiquidCta` gracefully — no crash, just an empty media panel and no GitHub pill

## Testing / verification

No automated tests exist for the old game or its prototype equivalent; verification is manual, in-browser, covering the full state machine:

1. **Team select** — arrow keys (left/right/up/down move selection across the 4-column grid) and mouse click both work; Enter starts the race
2. **Countdown** — 5 lights fill in sequence with beeps, race starts automatically after all 5
3. **Racing** — steering (left/right), accel/brake (up/down), speed ramps over time, off-road slowdown when drifting outside the road width
4. **Collisions** — hitting a rival car increments damage, grants brief invulnerability (flicker), reduces speed; 3rd hit ends the run (DNF screen) with score/best shown
5. **Pause** — `P` toggles pause overlay mid-race, resumes correctly
6. **Laps** — lap counter increments correctly up to 8, worldScroll math matches track length × laps
7. **Finish** — reaching 8 laps shows the checkered-flag podium (3 slots, player's team highlighted at their finishing rank) and final score
8. **Minimap** — visible during countdown/playing/finished, player dot tracks position around the track outline
9. **Best score** — persists across page reloads via `localStorage`
10. **Integration** — homepage Play tab and `/playground` show "Arcade EffWon" with correct copy and a blank media placeholder (no broken video); old `/ascii-game` route 404s; new `/arcade-effwon` renders full-bleed (no site nav/footer)
