# Arcade EffWon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/ascii-game` lane-dodge game with a new route, `/arcade-effwon`, implementing a pseudo-3D (OutRun-style) pixel-art F1 racer ported from the Claude Design handoff prototype `F1 Racer.dc.html`, and remove every trace of the old game.

**Architecture:** A single full-bleed client route. Pure data/math (team roster, track geometry, corner-curve math, rival-car spawn/AI helpers) live in small standalone modules. The game component itself keeps per-frame physics in a `useRef` object (never triggers React re-renders) and mirrors only HUD-relevant fields into `useState` once per frame, matching the prototype's own split between its mutable `this.g` object and `this.state`. Canvas drawing stays imperative (`ctx` calls inside a `requestAnimationFrame` loop). Screens (team select, countdown, playing, paused, game over, finished) are conditionally-rendered presentational overlay components living in their own file.

**Tech Stack:** Next.js 16 (App Router) client components, TypeScript, `next/font/google` (`Press_Start_2P`), Canvas 2D, Web Audio (`AudioContext`), `localStorage`. No new dependencies.

**Note on verification:** This repository has no automated test runner (confirmed via `package.json` — no jest/vitest/playwright, `"lint": "eslint"` is the only test-adjacent script). Every task below is verified by running `npx tsc --noEmit`, `npm run lint`, and checking behavior in the browser via the dev server — matching the pattern used in `docs/superpowers/plans/2026-08-11-kinetic-plate-facade-plan.md`. Do not introduce a new test framework for this.

**Note on file structure vs. the design spec:** [`docs/superpowers/specs/2026-08-17-arcade-effwon-design.md`](../specs/2026-08-17-arcade-effwon-design.md) described `ArcadeEffWonGame.tsx` as holding "the entire game" as a single file. This plan splits the pure data/math (`raceData.ts`, `raceMath.ts`, `raceAudio.ts`) and the presentational screen overlays (`ArcadeEffWonOverlays.tsx`) out of that file, following this codebase's established pattern of small, focused files (see `docs/superpowers/plans/2026-08-11-kinetic-plate-facade-plan.md`'s own `plateGrid.ts`/`materialVariants.ts` split). Behavior and route/file locations the design approved are unchanged — only internal organization within `app/arcade-effwon/` differs from the spec's literal single-file description.

## Global Constraints

- New route is `/arcade-effwon` (not `/ascii-game`) — approved in the design spec's route-naming decision.
- Difficulty, starting grid size, and min-rivals are **hardcoded constants** (`DIFFICULTY_MULTIPLIER`, `STARTING_GRID_SIZE`, `MIN_RIVALS` in `raceData.ts`) — no settings UI, per the design spec's scope boundary.
- The homepage/`/playground` Play card for this game has its `videoSrc`, `posterSrc`, and `githubLiquidCta` **removed**, not stubbed with placeholders — confirmed safe against `PlaygroundCardGrid.tsx`'s `if (!item.videoSrc)` fallback.
- Old game code is **deleted**, not left in place: `app/ascii-game/`, `app/about/AboutRaceGameOverlay.tsx`, `app/about/AboutRaceStrip.tsx`, `components/ui/pixelact-ui/toast.tsx`, `public/ASCII F1 Car.svg`.
- Do **not** touch `components/ui/pixelact-ui/button.tsx` (live consumer: `app/about/AboutMusicControl.tsx`) or `components/ui/pixelact-ui/dialog.tsx` (already unused before this change, out of scope).
- Do **not** touch the `{false && (...)}` dead "Frame 10" block in `app/page.tsx` — it's pre-existing, unrendered, and out of scope per the design spec.
- Best-score `localStorage` key is `arcade_effwon_best` (new key — the old game's `f1racer_best` key is abandoned, not migrated).

---

## Task 1: Font, bare-page wiring, and route scaffold

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/components/AppChrome.tsx`
- Modify: `app/sitemap.ts`
- Create: `app/arcade-effwon/page.tsx`
- Create: `app/arcade-effwon/ArcadeEffWonGame.tsx`

**Interfaces:**
- Produces: `--font-press-start-2p` CSS variable (global, via `<html>` className), the `/arcade-effwon` route (full-bleed, no nav/footer), a default-exported `ArcadeEffWonGame` client component (static shell only in this task).
- Consumed by: every later task that modifies `ArcadeEffWonGame.tsx`.

- [ ] **Step 1: Add the `Press_Start_2P` font to the root layout**

In `app/layout.tsx`, add `Press_Start_2P` to the `next/font/google` import list:

```ts
import type { Metadata } from "next";
import {
  DM_Mono,
  Festive,
  Figtree,
  Inter,
  Kalam,
  IBM_Plex_Sans_Devanagari,
  Geist,
  Ovo,
  Young_Serif,
  Frank_Ruhl_Libre,
  Forum,
  Sree_Krushnadevaraya,
  Press_Start_2P,
} from "next/font/google";
```

Add the font instantiation right after the existing `sreeKrushnadevaraya` block:

```ts
const sreeKrushnadevaraya = Sree_Krushnadevaraya({
  variable: "--font-sree-krushnadevaraya",
  subsets: ["latin"],
  weight: "400",
});

// Temporary: only used by the Arcade EffWon game page's pixel-art HUD.
const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});
```

Add `pressStart2P.variable,` to the `<html>` className list:

```tsx
      className={cn(
        figtree.variable,
        inter.variable,
        ibmPlexDevanagari.variable,
        kalam.variable,
        dmMono.variable,
        festive.variable,
        ovo.variable,
        youngSerif.variable,
        frankRuhlLibre.variable,
        forum.variable,
        sreeKrushnadevaraya.variable,
        pressStart2P.variable,
        "font-sans",
        geist.variable,
      )}
```

- [ ] **Step 2: Point `AppChrome`'s bare-page check at the new route**

In `app/components/AppChrome.tsx`, replace:

```ts
  const bareAsciiGame =
    pathname === "/ascii-game" || pathname.startsWith("/ascii-game/");
```

with:

```ts
  const bareArcadeEffwon =
    pathname === "/arcade-effwon" || pathname.startsWith("/arcade-effwon/");
```

And replace:

```ts
  const isBarePage =
    bareAsciiGame || bareSunlight || bareWater || bareFloorPlanVersion || bareKineticFacade;
```

with:

```ts
  const isBarePage =
    bareArcadeEffwon || bareSunlight || bareWater || bareFloorPlanVersion || bareKineticFacade;
```

- [ ] **Step 3: Update the sitemap entry**

In `app/sitemap.ts`, replace:

```ts
    {
      url: `${BASE_URL}/ascii-game`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
```

with:

```ts
    {
      url: `${BASE_URL}/arcade-effwon`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
```

- [ ] **Step 4: Create the route entry**

`app/arcade-effwon/page.tsx`:

```tsx
import type { Metadata } from "next";
import ArcadeEffWonGame from "./ArcadeEffWonGame";

export const metadata: Metadata = {
  title: "Arcade EffWon | Priyamwada Pandey",
  description:
    "A pseudo-3D pixel-art F1 racer built in canvas — pick a team, survive 8 laps, don't DNF.",
};

export default function ArcadeEffWonPage() {
  return <ArcadeEffWonGame />;
}
```

- [ ] **Step 5: Create a minimal static shell for the game component**

`app/arcade-effwon/ArcadeEffWonGame.tsx`:

```tsx
"use client";

export default function ArcadeEffWonGame() {
  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-[#0a0a0a] text-white"
      style={{ fontFamily: "var(--font-press-start-2p), monospace" }}
    >
      <div className="relative h-full flex-1 bg-[#2f7a2f]" />
      <div className="h-full w-[240px] shrink-0 bg-[#141414]" />
    </div>
  );
}
```

- [ ] **Step 6: Verify in browser**

Run:

```bash
npm run dev
```

Open `http://localhost:3000/arcade-effwon`. Expected:
- Full-bleed page: no site nav bar, no footer (bare-page wiring from Step 2 is working).
- Left panel fills with green (`#2f7a2f`), right sidebar is a 240px dark (`#141414`) column.
- No console errors.

Open devtools console and run `getComputedStyle(document.documentElement).getPropertyValue('--font-press-start-2p')` — should return a non-empty value referencing "Press Start 2P" (confirms the font loaded and the CSS variable is wired up); the pixel font itself only becomes visible on real text once it's added in Task 2.

- [ ] **Step 7: Typecheck and lint**

```bash
npx tsc --noEmit
npm run lint
```

Expected: both clean (no errors).

- [ ] **Step 8: Commit**

```bash
git add app/layout.tsx app/components/AppChrome.tsx app/sitemap.ts app/arcade-effwon
git commit -m "feat(arcade-effwon): scaffold route, font, and bare-page wiring"
```

---

## Task 2: Team select and countdown screens

**Files:**
- Create: `app/arcade-effwon/raceData.ts`
- Create: `app/arcade-effwon/raceMath.ts`
- Create: `app/arcade-effwon/raceAudio.ts`
- Create: `app/arcade-effwon/ArcadeEffWonOverlays.tsx`
- Modify: `app/arcade-effwon/ArcadeEffWonGame.tsx`

**Interfaces:**
- Produces (`raceData.ts`): `type Team = { name: string; p: string; a: string }`, `TEAMS: Team[]` (11 entries), `type Corner`, `type TrackTheme`, `type Track`, `TRACK: Track`, `DIFFICULTY_MULTIPLIER: number`, `STARTING_GRID_SIZE: number`, `MIN_RIVALS: number`, `TOTAL_LAPS: number`, `BEST_SCORE_STORAGE_KEY: string`.
- Produces (`raceMath.ts`): `type Car`, `rollTier(): number`, `makeCar(team: { p: string; a: string; name: string }, d: number, offset?: number): Car`, `curveOffset(track: Track, pos: number, intensity: number): number`, `type MinimapCache`, `buildMinimapCache(track: Track): MinimapCache`, `pad(n: number, width: number): string`, `formatTime(totalSeconds: number): string`.
- Produces (`raceAudio.ts`): `type BeepFn = (freq: number, dur?: number, type?: OscillatorType, vol?: number) => void`, `createBeeper(): BeepFn`.
- Produces (`ArcadeEffWonOverlays.tsx`, this task): `TeamSelectOverlay({ teamIndex, onSelect, onStart })`, `CountdownOverlay({ lightsLit })`, `HudSidebar({ hud })` where `hud` is `{ score, lap, speed, pos, time, damage, best }`.
- Consumed by: Task 3 (extends `ArcadeEffWonOverlays.tsx` with more screens, extends `ArcadeEffWonGame.tsx`'s state machine), Task 4 (uses `makeCar`, `MIN_RIVALS`, `STARTING_GRID_SIZE`).

- [ ] **Step 1: Create the race data module**

`app/arcade-effwon/raceData.ts`:

```ts
export type Team = {
  name: string;
  /** primary body color */
  p: string;
  /** accent/cockpit color */
  a: string;
};

export const TEAMS: Team[] = [
  { name: "CRIMSON RACING", p: "#d81f26", a: "#ffffff" },
  { name: "SILVER ARROWS", p: "#b8bcc2", a: "#1a1a1a" },
  { name: "AZURE PERFORMANCE", p: "#1a5fd8", a: "#ffe000" },
  { name: "EMERALD GP", p: "#1a8f3c", a: "#ffffff" },
  { name: "SUNBURST RACING", p: "#ff7a1a", a: "#101010" },
  { name: "ONYX MOTORSPORT", p: "#1a1a1a", a: "#d81f26" },
  { name: "COBALT WOLVES", p: "#123a6b", a: "#29e0e0" },
  { name: "VIPER YELLOW", p: "#f1c40f", a: "#101010" },
  { name: "AMETHYST RACING", p: "#7b2fd6", a: "#ffffff" },
  { name: "STEEL HAWKS", p: "#5c6670", a: "#ff7a1a" },
  { name: "CORAL VELOCITY", p: "#ff5c7a", a: "#16b3a0" },
];

export type Corner = { d: number; s: number; w: number };

export type TrackTheme = {
  grassA: string;
  grassB: string;
  buildingP: string;
  buildingA: string;
  tree: string;
  road: string;
};

export type Track = {
  length: number;
  corners: Corner[];
  theme: TrackTheme;
  map: [number, number][];
};

export const TRACK: Track = {
  length: 3200,
  corners: [
    { d: 700, s: -1.0, w: 170 },
    { d: 1500, s: 0.75, w: 70 },
    { d: 1680, s: -0.75, w: 70 },
    { d: 1860, s: 0.75, w: 70 },
    { d: 2500, s: 1.0, w: 170 },
  ],
  theme: {
    grassA: "#2f7a2f",
    grassB: "#276927",
    buildingP: "#8a4a2c",
    buildingA: "#c0392b",
    tree: "#1e4a1a",
    road: "#232323",
  },
  map: [
    [0.78, 0.95], [0.9, 0.9], [0.9, 0.68], [0.78, 0.6], [0.55, 0.53],
    [0.68, 0.45], [0.9, 0.38], [0.9, 0.12], [0.78, 0.05], [0.3, 0.05],
    [0.18, 0.12], [0.18, 0.38], [0.4, 0.45], [0.28, 0.53], [0.1, 0.6],
    [0.1, 0.9], [0.22, 0.95], [0.78, 0.95],
  ],
};

/** Hardcoded — the prototype exposed this as a Claude-Design editor prop; this site has no such editor. */
export const DIFFICULTY_MULTIPLIER = 1;
/** Hardcoded — prototype default (of an editable 6–10 range). */
export const STARTING_GRID_SIZE = 10;
/** Hardcoded — prototype default (of an editable 2–5 range). */
export const MIN_RIVALS = 3;
export const TOTAL_LAPS = 8;

export const BEST_SCORE_STORAGE_KEY = "arcade_effwon_best";
```

- [ ] **Step 2: Create the race math module**

`app/arcade-effwon/raceMath.ts`:

```ts
import type { Track } from "./raceData";

export type Car = {
  d: number;
  speed: number;
  phase: number;
  weaveSpeed: number;
  weaveAmp: number;
  color: string;
  accent: string;
  name: string;
  hit: number;
  offset: number;
  justReset: boolean;
};

/** Weighted random speed tier for a rival car: 15% fast, 65% mid, 20% slow. */
export function rollTier(): number {
  const r = Math.random();
  if (r < 0.15) return 1.4 + Math.random() * 0.25;
  if (r < 0.8) return 0.85 + Math.random() * 0.3;
  return 0.55 + Math.random() * 0.25;
}

export function makeCar(
  team: { p: string; a: string; name: string },
  d: number,
  offset = 0,
): Car {
  return {
    d,
    speed: 90 * rollTier(),
    phase: Math.random() * 10,
    weaveSpeed: 0.5 + Math.random() * 0.9,
    weaveAmp: 18 + Math.random() * 22,
    color: team.p,
    accent: team.a,
    name: team.name,
    hit: 0,
    offset,
    justReset: true,
  };
}

/** Lateral road-center offset at a given world position, from the track's corner list. */
export function curveOffset(track: Track, pos: number, intensity: number): number {
  let total = 0;
  const L = track.length;
  for (const c of track.corners) {
    let delta = pos - c.d;
    delta -= L * Math.round(delta / L);
    total += c.s * 62 * Math.exp(-(delta * delta) / (2 * c.w * c.w));
  }
  return Math.max(-115, Math.min(115, total * intensity));
}

export type MinimapCache = {
  pts: { x: number; y: number }[];
  cum: number[];
  total: number;
  w: number;
  h: number;
};

export function buildMinimapCache(track: Track): MinimapCache {
  const w = 150;
  const h = 120;
  const pad = 14;
  const pts = track.map.map((p) => ({
    x: pad + p[0] * (w - 2 * pad),
    y: pad + p[1] * (h - 2 * pad),
  }));
  let total = 0;
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(total);
  }
  return { pts, cum, total, w, h };
}

export function pad(n: number, width: number): string {
  return String(Math.floor(n)).padStart(width, "0");
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${pad(mins, 2)}:${pad(secs, 2)}`;
}
```

- [ ] **Step 3: Create the audio module**

`app/arcade-effwon/raceAudio.ts`:

```ts
export type BeepFn = (
  freq: number,
  dur?: number,
  type?: OscillatorType,
  vol?: number,
) => void;

/** Lazily creates one AudioContext per game session and plays short square/sine/etc. blips through it. */
export function createBeeper(): BeepFn {
  let ctx: AudioContext | null = null;
  return (freq, dur = 0.15, type = "square", vol = 0.06) => {
    if (!ctx) {
      try {
        const AudioContextCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctx = new AudioContextCtor();
      } catch {
        return;
      }
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur + 0.02);
  };
}
```

- [ ] **Step 4: Create the screen overlay components**

`app/arcade-effwon/ArcadeEffWonOverlays.tsx`:

```tsx
"use client";

import { TEAMS } from "./raceData";
import { pad, formatTime } from "./raceMath";

export function TeamSelectOverlay({
  teamIndex,
  onSelect,
  onStart,
}: {
  teamIndex: number;
  onSelect: (index: number) => void;
  onStart: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] overflow-y-auto bg-black/[.92] p-6 text-white">
      <div className="text-[18px] text-[#ff3b3b]">CHOOSE YOUR TEAM</div>
      <div className="grid max-w-[820px] grid-cols-4 gap-[10px]">
        {TEAMS.map((team, i) => (
          <button
            key={team.name}
            type="button"
            onClick={() => onSelect(i)}
            className="flex cursor-pointer flex-col items-center gap-[6px] rounded p-[10px_6px]"
            style={{
              background: i === teamIndex ? "#2a2a2a" : "#1a1a1a",
              border: `2px solid ${i === teamIndex ? "#ffd23f" : "#333"}`,
            }}
          >
            <div
              className="h-[22px] w-[44px] rounded-sm"
              style={{ background: team.p, borderBottom: `7px solid ${team.a}` }}
            />
            <div className="text-center text-[7px] leading-[1.5]">{team.name}</div>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-3 cursor-pointer rounded bg-[#ff3b3b] px-7 py-3 text-[11px]"
      >
        START RACE
      </button>
      <div className="text-[7px] text-[#aaa]">
        ENTER TO START · ARROWS/CLICK TO PICK TEAM
      </div>
    </div>
  );
}

export function CountdownOverlay({ lightsLit }: { lightsLit: number }) {
  return (
    <div className="absolute inset-x-0 top-6 flex justify-center gap-[14px]">
      {[0, 1, 2, 3, 4].map((i) => {
        const lit = i < lightsLit;
        return (
          <div
            key={i}
            className="h-[26px] w-[26px] rounded-full border-[3px] border-[#300]"
            style={{
              background: lit ? "#ff2020" : "#3a0a0a",
              boxShadow: lit ? "0 0 12px 3px rgba(255,32,32,0.8)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export function HudSidebar({
  hud,
}: {
  hud: {
    score: number;
    lap: number;
    speed: number;
    pos: string;
    time: number;
    damage: number;
    best: number;
  };
}) {
  const dmgColor = (level: number) => (hud.damage >= level ? "#e74c3c" : "#2a2a2a");
  return (
    <div className="flex h-full w-[240px] shrink-0 flex-col gap-3 overflow-y-auto bg-[#141414] p-[18px_16px] text-white">
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">SCORE</div>
        <div className="text-[15px] text-[#ffd23f]">{pad(hud.score, 6)}</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">LAP</div>
        <div className="text-[13px]">{hud.lap} / 8</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">SPEED</div>
        <div className="text-[13px]">
          {pad(hud.speed, 3)} <span className="text-[8px] text-[#888]">KM/H</span>
        </div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">POS</div>
        <div className="text-[13px]">{hud.pos || "--"}</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">TIME</div>
        <div className="text-[13px]">{formatTime(hud.time)}</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">DAMAGE</div>
        <div className="flex gap-[6px]">
          <div className="h-[14px] w-[14px] border border-[#444]" style={{ background: dmgColor(1) }} />
          <div className="h-[14px] w-[14px] border border-[#444]" style={{ background: dmgColor(2) }} />
          <div className="h-[14px] w-[14px] border border-[#444]" style={{ background: dmgColor(3) }} />
        </div>
      </div>

      <div className="mt-2 border-t border-[#2a2a2a] pt-[14px]">
        <div className="mb-[10px] text-[9px] text-[#888]">CONTROLS</div>
        <div className="mb-[6px] grid grid-cols-3 gap-1">
          <div />
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ▲
          </div>
          <div />
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ◀
          </div>
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ▼
          </div>
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ▶
          </div>
        </div>
        <div className="mb-3 text-[7px] leading-[1.6] text-[#999]">STEER / ACCEL / BRAKE</div>
        <div className="flex items-center gap-2">
          <div className="rounded-[3px] border border-[#444] bg-[#2a2a2a] px-2 py-[5px] text-[8px]">
            P
          </div>
          <div className="text-[7px] text-[#999]">PAUSE</div>
        </div>
      </div>

      <div className="mt-auto text-[8px] text-[#555]">BEST {pad(hud.best, 6)}</div>
    </div>
  );
}
```

- [ ] **Step 5: Wire the select/countdown state machine into the game component**

Replace `app/arcade-effwon/ArcadeEffWonGame.tsx` in full:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TEAMS } from "./raceData";
import { createBeeper } from "./raceAudio";
import { TeamSelectOverlay, CountdownOverlay, HudSidebar } from "./ArcadeEffWonOverlays";

type Screen = "select" | "countdown" | "playing" | "gameover" | "finished";

type HudState = {
  screen: Screen;
  teamIndex: number;
  score: number;
  best: number;
  speed: number;
  pos: string;
  time: number;
  damage: number;
  paused: boolean;
  lightsLit: number;
  lap: number;
};

const INITIAL_HUD: HudState = {
  screen: "select",
  teamIndex: 0,
  score: 0,
  best: 0,
  speed: 0,
  pos: "",
  time: 0,
  damage: 0,
  paused: false,
  lightsLit: 0,
  lap: 1,
};

export default function ArcadeEffWonGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hud, setHudState] = useState<HudState>(INITIAL_HUD);
  const hudRef = useRef<HudState>(INITIAL_HUD);
  const setHud = useCallback(
    (update: Partial<HudState> | ((s: HudState) => Partial<HudState>)) => {
      setHudState((prev) => {
        const patch = typeof update === "function" ? update(prev) : update;
        const next = { ...prev, ...patch };
        hudRef.current = next;
        return next;
      });
    },
    [],
  );

  const countdownTRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const beepRef = useRef(createBeeper());

  const startRace = useCallback(() => {
    countdownTRef.current = 0;
    setHud({
      screen: "countdown",
      lightsLit: 0,
      score: 0,
      speed: 0,
      pos: "",
      time: 0,
      damage: 0,
      lap: 1,
    });
  }, [setHud]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const el = wrapRef.current;
    function layout() {
      if (!el || !canvas) return;
      const rect = el.getBoundingClientRect();
      canvas.width = Math.max(200, Math.round(rect.width));
      canvas.height = Math.max(200, Math.round(rect.height));
    }
    layout();
    window.addEventListener("resize", layout);

    const onKeyDown = (e: KeyboardEvent) => {
      const screen = hudRef.current.screen;
      if (screen === "select") {
        if (e.key === "ArrowRight")
          setHud((s) => ({ teamIndex: Math.min(TEAMS.length - 1, s.teamIndex + 1) }));
        if (e.key === "ArrowLeft")
          setHud((s) => ({ teamIndex: Math.max(0, s.teamIndex - 1) }));
        if (e.key === "ArrowDown")
          setHud((s) => ({ teamIndex: Math.min(TEAMS.length - 1, s.teamIndex + 4) }));
        if (e.key === "ArrowUp")
          setHud((s) => ({ teamIndex: Math.max(0, s.teamIndex - 4) }));
        if (e.key === "Enter") startRace();
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
        e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", layout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [setHud, startRace]);

  const updateCountdown = useCallback(
    (dt: number) => {
      countdownTRef.current += dt;
      const lit = Math.min(5, Math.floor(countdownTRef.current / 0.55));
      if (lit !== hudRef.current.lightsLit) {
        if (lit > 0 && lit <= 5) beepRef.current(500, 0.08, "square", 0.05);
        setHud({ lightsLit: lit });
      }
      if (countdownTRef.current > 3.4) {
        beepRef.current(700, 0.2, "sine", 0.08);
        beepRef.current(900, 0.2, "sine", 0.06);
        lastTsRef.current = performance.now();
        setHud({ screen: "playing" });
      }
    },
    [setHud],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#2f7a2f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const loop = (t: number) => {
      if (lastTsRef.current === null) lastTsRef.current = t;
      let dt = (t - lastTsRef.current) / 1000;
      lastTsRef.current = t;
      dt = Math.max(0, Math.min(dt, 0.05));

      if (hudRef.current.screen === "countdown") updateCountdown(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCountdown, draw]);

  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-[#0a0a0a] text-white"
      style={{ fontFamily: "var(--font-press-start-2p), monospace" }}
    >
      <div ref={wrapRef} className="relative h-full flex-1">
        <canvas ref={canvasRef} className="block h-full w-full [image-rendering:pixelated]" />

        {hud.screen === "select" && (
          <TeamSelectOverlay
            teamIndex={hud.teamIndex}
            onSelect={(i) => setHud({ teamIndex: i })}
            onStart={startRace}
          />
        )}

        {hud.screen === "countdown" && <CountdownOverlay lightsLit={hud.lightsLit} />}
      </div>

      <HudSidebar hud={hud} />
    </div>
  );
}
```

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/arcade-effwon`. Expected:
- "CHOOSE YOUR TEAM" screen with an 11-card grid in Press Start 2P pixel font, first team (CRIMSON RACING) highlighted with a yellow border.
- Arrow keys move the highlighted selection (right/left by 1, down/up by 4, clamped at the grid edges); clicking a card selects it directly.
- Pressing Enter (or clicking "START RACE") starts a ~3.4s countdown: 5 circular lights fill left-to-right roughly every 0.55s, each with an audible beep (unmute your system volume to confirm — Web Audio beeps only fire after a user gesture, which Enter/click provides).
- After the countdown, two ascending tones play and the screen goes to a plain green canvas with no overlay (the "playing" screen has no content yet — that's Task 3).
- Sidebar on the right shows SCORE/LAP/SPEED/POS/TIME/DAMAGE at their zero/blank defaults, plus the controls legend.
- No console errors.

- [ ] **Step 7: Typecheck and lint**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 8: Commit**

```bash
git add app/arcade-effwon
git commit -m "feat(arcade-effwon): add team select and countdown screens"
```

---

## Task 3: Solo racing — road, driving physics, minimap, pause, finish

**Files:**
- Create: `app/arcade-effwon/arcadeEffwon.css`
- Modify: `app/arcade-effwon/ArcadeEffWonOverlays.tsx`
- Modify: `app/arcade-effwon/ArcadeEffWonGame.tsx`

**Interfaces:**
- Produces (`ArcadeEffWonOverlays.tsx`, added this task): `PausedOverlay()`, `FinishedOverlay({ podium, resultLine, score, best })` where `podium: { label: string; name: string; isPlayer: boolean }[]`.
- Produces (`ArcadeEffWonGame.tsx`, this task): `type Dims`, `type GameRuntime` (full shape — `worldScroll, playerOffset, speed, time, damage, rank, invuln, shakeT, cars: Car[], retireTimer, countdownT, minRivals, totalLaps, lap, scoreAcc`), `type PodiumSlot`. `GameRuntime.cars` is always `[]` in this task — rival spawning is Task 4.
- Consumed by: Task 4, which replaces `startRace`, `update`, and `draw` in `ArcadeEffWonGame.tsx` to populate and use `GameRuntime.cars` for real, and adds a `gameOver` function alongside the `finishRace` function this task introduces.

- [ ] **Step 1: Add the blink keyframes stylesheet**

`app/arcade-effwon/arcadeEffwon.css`:

```css
@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
```

- [ ] **Step 2: Add the paused and finished overlay components**

Append to `app/arcade-effwon/ArcadeEffWonOverlays.tsx` (after `HudSidebar`):

```tsx
export function PausedOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 text-white">
      <div className="text-[16px] text-[#ffd23f]">PAUSED</div>
      <div className="animate-[blink_1s_step-start_infinite] text-[8px] text-[#aaa]">
        PRESS P TO RESUME
      </div>
    </div>
  );
}

export function FinishedOverlay({
  podium,
  resultLine,
  score,
  best,
}: {
  podium: { label: string; name: string; isPlayer: boolean }[];
  resultLine: string;
  score: string;
  best: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-5 text-center text-white">
      <div className="text-[16px] text-[#ffd23f]">CHECKERED FLAG</div>
      <div className="flex items-end gap-4">
        {podium.map((slot) => (
          <div
            key={slot.label}
            className="min-w-[100px] rounded p-[12px_16px]"
            style={{
              background: slot.isPlayer ? "#2a2a2a" : "#1a1a1a",
              border: `2px solid ${slot.isPlayer ? "#ffd23f" : "#333"}`,
            }}
          >
            <div className="text-[8px]">{slot.label}</div>
            <div className="mt-[6px] text-[7px]">{slot.name}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[9px]">{resultLine}</div>
      <div className="text-[9px] text-white">SCORE {score}</div>
      <div className="text-[9px] text-[#6ab04c]">BEST {best}</div>
      <div className="animate-[blink_1s_step-start_infinite] text-[9px] text-[#ffd23f]">
        PRESS ENTER TO RACE AGAIN
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Replace the game component with the solo-racing version**

Replace `app/arcade-effwon/ArcadeEffWonGame.tsx` in full:

```tsx
"use client";

import "./arcadeEffwon.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BEST_SCORE_STORAGE_KEY,
  DIFFICULTY_MULTIPLIER,
  MIN_RIVALS,
  TEAMS,
  TOTAL_LAPS,
  TRACK,
} from "./raceData";
import {
  buildMinimapCache,
  curveOffset,
  pad,
  type Car,
  type MinimapCache,
} from "./raceMath";
import { createBeeper } from "./raceAudio";
import {
  TeamSelectOverlay,
  CountdownOverlay,
  PausedOverlay,
  FinishedOverlay,
  HudSidebar,
} from "./ArcadeEffWonOverlays";

type Screen = "select" | "countdown" | "playing" | "gameover" | "finished";

type HudState = {
  screen: Screen;
  teamIndex: number;
  score: number;
  best: number;
  speed: number;
  pos: string;
  time: number;
  damage: number;
  paused: boolean;
  lightsLit: number;
  lap: number;
};

const INITIAL_HUD: HudState = {
  screen: "select",
  teamIndex: 0,
  score: 0,
  best: 0,
  speed: 0,
  pos: "",
  time: 0,
  damage: 0,
  paused: false,
  lightsLit: 0,
  lap: 1,
};

type Dims = { W: number; H: number; roadHW: number; CX: number; playerY: number };

type GameRuntime = {
  worldScroll: number;
  playerOffset: number;
  speed: number;
  time: number;
  damage: number;
  rank: number;
  invuln: number;
  shakeT: number;
  cars: Car[];
  retireTimer: number;
  countdownT: number;
  minRivals: number;
  totalLaps: number;
  lap: number;
  scoreAcc: number;
};

type PodiumSlot = { label: string; name: string; isPlayer: boolean };

export default function ArcadeEffWonGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);

  const [hud, setHudState] = useState<HudState>(INITIAL_HUD);
  const hudRef = useRef<HudState>(INITIAL_HUD);
  const setHud = useCallback(
    (update: Partial<HudState> | ((s: HudState) => Partial<HudState>)) => {
      setHudState((prev) => {
        const patch = typeof update === "function" ? update(prev) : update;
        const next = { ...prev, ...patch };
        hudRef.current = next;
        return next;
      });
    },
    [],
  );

  const dimsRef = useRef<Dims | null>(null);
  const gameRef = useRef<GameRuntime | null>(null);
  const minimapCacheRef = useRef<MinimapCache | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const steerDirRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const finishRankRef = useRef(1);
  const finishFieldRef = useRef<Car[]>([]);
  const beepRef = useRef(createBeeper());

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem(BEST_SCORE_STORAGE_KEY) || "0", 10);
      if (!Number.isNaN(stored)) setHud({ best: stored });
    } catch {
      // localStorage unavailable — best stays 0
    }
  }, [setHud]);

  const layout = useCallback(() => {
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const rect = el.getBoundingClientRect();
    const W = Math.max(200, Math.round(rect.width));
    const H = Math.max(200, Math.round(rect.height));
    canvas.width = W;
    canvas.height = H;
    dimsRef.current = {
      W,
      H,
      roadHW: Math.max(80, Math.min(200, W * 0.15)),
      CX: W / 2,
      playerY: H - 130,
    };
  }, []);

  const startRace = useCallback(() => {
    minimapCacheRef.current = buildMinimapCache(TRACK);
    gameRef.current = {
      worldScroll: 0,
      playerOffset: 0,
      speed: 0,
      time: 0,
      damage: 0,
      rank: 1,
      invuln: 999,
      shakeT: 0,
      cars: [],
      retireTimer: 10 + Math.random() * 6,
      countdownT: 0,
      minRivals: MIN_RIVALS,
      totalLaps: TOTAL_LAPS,
      lap: 1,
      scoreAcc: 0,
    };
    setHud({
      screen: "countdown",
      lightsLit: 0,
      score: 0,
      speed: 0,
      pos: "",
      time: 0,
      damage: 0,
      lap: 1,
    });
  }, [setHud]);

  useEffect(() => {
    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      const screen = hudRef.current.screen;
      if (screen === "select") {
        if (e.key === "ArrowRight")
          setHud((s) => ({ teamIndex: Math.min(TEAMS.length - 1, s.teamIndex + 1) }));
        if (e.key === "ArrowLeft")
          setHud((s) => ({ teamIndex: Math.max(0, s.teamIndex - 1) }));
        if (e.key === "ArrowDown")
          setHud((s) => ({ teamIndex: Math.min(TEAMS.length - 1, s.teamIndex + 4) }));
        if (e.key === "ArrowUp")
          setHud((s) => ({ teamIndex: Math.max(0, s.teamIndex - 4) }));
        if (e.key === "Enter") startRace();
      } else if (e.key === "Enter" && screen === "finished") {
        setHud({ screen: "select" });
      }
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        if (hudRef.current.screen === "playing") setHud((s) => ({ paused: !s.paused }));
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
        e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [layout, setHud, startRace]);

  const updateCountdown = useCallback(
    (dt: number) => {
      const g = gameRef.current;
      if (!g) return;
      g.countdownT += dt;
      const lit = Math.min(5, Math.floor(g.countdownT / 0.55));
      if (lit !== hudRef.current.lightsLit) {
        if (lit > 0 && lit <= 5) beepRef.current(500, 0.08, "square", 0.05);
        setHud({ lightsLit: lit });
      }
      if (g.countdownT > 3.4) {
        beepRef.current(700, 0.2, "sine", 0.08);
        beepRef.current(900, 0.2, "sine", 0.06);
        g.invuln = 0.6;
        lastTsRef.current = performance.now();
        setHud({ screen: "playing" });
      }
    },
    [setHud],
  );

  const finishRace = useCallback(
    (finalScore: number) => {
      const g = gameRef.current;
      const best = Math.max(hudRef.current.best, finalScore);
      try {
        localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(best));
      } catch {
        // localStorage unavailable — best score just won't persist
      }
      beepRef.current(660, 0.15, "sine");
      beepRef.current(880, 0.2, "sine");
      finishRankRef.current = g?.rank ?? 1;
      finishFieldRef.current = g ? g.cars.slice() : [];
      setHud({ screen: "finished", score: finalScore, best, lap: TOTAL_LAPS });
    },
    [setHud],
  );

  const update = useCallback(
    (dt: number) => {
      const g = gameRef.current;
      const dims = dimsRef.current;
      if (!g || !dims) return;
      const ROAD_HW = dims.roadHW;
      g.time += dt;

      let dir = 0;
      if (keysRef.current.ArrowLeft) dir -= 1;
      if (keysRef.current.ArrowRight) dir += 1;
      steerDirRef.current = dir;
      g.playerOffset += dir * 150 * dt;
      g.playerOffset = Math.max(-ROAD_HW * 2, Math.min(ROAD_HW * 2, g.playerOffset));

      const offRoad = Math.abs(g.playerOffset) > ROAD_HW - 8;
      const braking = keysRef.current.ArrowDown;
      const accel = keysRef.current.ArrowUp;

      const speedRamp = 1 + g.time * 0.012 * DIFFICULTY_MULTIPLIER;
      let baseMax = 240 * speedRamp;
      if (offRoad) baseMax *= 0.5;

      if (accel) g.speed += 220 * dt;
      else g.speed -= 50 * dt;
      if (braking) g.speed -= 200 * dt;
      g.speed = Math.max(0, Math.min(baseMax, g.speed));

      g.worldScroll += g.speed * dt;
      g.lap = Math.min(g.totalLaps, Math.floor(g.worldScroll / TRACK.length) + 1);
      if (g.invuln > 0) g.invuln -= dt;

      const scoreGain = g.speed * dt * 0.12;
      g.scoreAcc = Math.max(0, g.scoreAcc + scoreGain);
      g.shakeT = Math.max(0, g.shakeT - dt);

      if (g.worldScroll >= TRACK.length * g.totalLaps) {
        finishRace(Math.floor(g.scoreAcc) + 500);
        return;
      }

      setHud({
        score: Math.floor(g.scoreAcc),
        speed: Math.floor(g.speed),
        pos: `${g.rank} / ${g.cars.length + 1}`,
        time: g.time,
        damage: g.damage,
        lap: g.lap,
      });
    },
    [finishRace, setHud],
  );

  const drawCar = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      primary: string,
      accent: string,
      invuln: boolean,
      hit: boolean,
      tilt = 0,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      if (tilt) ctx.rotate(tilt);
      if (invuln) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 60);
      if (hit) {
        ctx.fillStyle = "#ff5a3c";
        ctx.fillRect(-13, -20, 26, 40);
      }
      ctx.fillStyle = "#151515";
      ctx.fillRect(-9, -16, 4, 6);
      ctx.fillRect(5, -16, 4, 6);
      ctx.fillRect(-9, 10, 4, 6);
      ctx.fillRect(5, 10, 4, 6);
      ctx.fillStyle = primary;
      ctx.fillRect(-6, -18, 12, 36);
      ctx.fillRect(-11, -19, 22, 4);
      ctx.fillRect(-9, 15, 18, 4);
      ctx.fillStyle = accent;
      ctx.fillRect(-4, -6, 8, 10);
      ctx.fillStyle = "#151515";
      ctx.fillRect(-3, -4, 6, 5);
      ctx.restore();
    },
    [],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const dims = dimsRef.current;
    if (!canvas || !dims) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const theme = TRACK.theme;
    const { W, H, roadHW: ROAD_HW, CX, playerY: PLAYER_Y } = dims;
    const g = gameRef.current;
    const screen = hudRef.current.screen;
    const inRace = screen === "playing" || screen === "countdown";
    const time = g?.time ?? 0;
    const intensity =
      screen === "countdown" ? 0 : Math.min(1.3, 1 + time * 0.003 * DIFFICULTY_MULTIPLIER);

    ctx.save();
    if (g && g.shakeT > 0) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);

    ctx.fillStyle = theme.grassA;
    ctx.fillRect(0, 0, W, H);

    if (inRace && g) {
      const rowStep = 4;
      for (let y = 0; y < H; y += rowStep) {
        const absPos = g.worldScroll + (PLAYER_Y - y);
        const center = CX + curveOffset(TRACK, absPos, intensity);
        const seg = Math.floor(absPos / 40);
        ctx.fillStyle = seg % 2 === 0 ? theme.grassA : theme.grassB;
        ctx.fillRect(0, y, W, rowStep);
        ctx.fillStyle = theme.road;
        ctx.fillRect(center - ROAD_HW, y, ROAD_HW * 2, rowStep);
        ctx.fillStyle = seg % 2 === 0 ? "#c0392b" : "#e8e8e8";
        ctx.fillRect(center - ROAD_HW - 3, y, 3, rowStep);
        ctx.fillRect(center + ROAD_HW, y, 3, rowStep);
        if (seg % 2 === 0) {
          ctx.fillStyle = "#e8e8e8";
          ctx.fillRect(center - 2, y, 4, rowStep * 0.6);
        }
        if (seg % 3 === 0 && y % 40 < rowStep) {
          const lv = (Math.sin(seg * 12.9898) * 43758.5453) % 1;
          const rv = (Math.sin(seg * 78.233) * 43758.5453) % 1;
          if (Math.abs(lv) > 0.5) {
            ctx.fillStyle = theme.tree;
            ctx.beginPath();
            ctx.arc(center - ROAD_HW - 16, y, 9, 0, 7);
            ctx.fill();
          } else {
            ctx.fillStyle = theme.buildingP;
            ctx.fillRect(center - ROAD_HW - 26, y - 8, 16, 16);
            ctx.fillStyle = theme.buildingA;
            ctx.fillRect(center - ROAD_HW - 26, y - 8, 16, 4);
          }
          if (Math.abs(rv) > 0.5) {
            ctx.fillStyle = theme.tree;
            ctx.beginPath();
            ctx.arc(center + ROAD_HW + 16, y, 9, 0, 7);
            ctx.fill();
          } else {
            ctx.fillStyle = theme.buildingP;
            ctx.fillRect(center + ROAD_HW + 10, y - 8, 16, 16);
            ctx.fillStyle = theme.buildingA;
            ctx.fillRect(center + ROAD_HW + 10, y - 8, 16, 4);
          }
        }
      }

      const playerCenter = CX + curveOffset(TRACK, g.worldScroll, intensity);
      const team = TEAMS[hudRef.current.teamIndex];
      drawCar(
        ctx,
        playerCenter + g.playerOffset,
        PLAYER_Y,
        team.p,
        team.a,
        g.invuln > 0,
        false,
        steerDirRef.current * 0.12,
      );
    }

    ctx.restore();

    const mm = minimapRef.current;
    const cache = minimapCacheRef.current;
    if (mm && cache && g && (inRace || screen === "finished")) {
      const mctx = mm.getContext("2d");
      if (mctx) {
        mctx.clearRect(0, 0, cache.w, cache.h);
        mctx.strokeStyle = "#888";
        mctx.lineWidth = 2;
        mctx.beginPath();
        cache.pts.forEach((p, i) => (i === 0 ? mctx.moveTo(p.x, p.y) : mctx.lineTo(p.x, p.y)));
        mctx.stroke();
        mctx.fillStyle = "#fff";
        mctx.fillRect(cache.pts[0].x - 3, cache.pts[0].y - 3, 6, 6);
        const frac = (g.worldScroll % TRACK.length) / TRACK.length;
        const targetLen = frac * cache.total;
        let idx = 0;
        while (idx < cache.cum.length - 1 && cache.cum[idx + 1] < targetLen) idx++;
        const segLen = cache.cum[idx + 1] - cache.cum[idx] || 1;
        const t2 = (targetLen - cache.cum[idx]) / segLen;
        const p0 = cache.pts[idx];
        const p1 = cache.pts[Math.min(idx + 1, cache.pts.length - 1)];
        const px = p0.x + (p1.x - p0.x) * t2;
        const py = p0.y + (p1.y - p0.y) * t2;
        mctx.fillStyle = TEAMS[hudRef.current.teamIndex].p;
        mctx.beginPath();
        mctx.arc(px, py, 4, 0, 7);
        mctx.fill();
      }
    }
  }, [drawCar]);

  useEffect(() => {
    const loop = (t: number) => {
      if (lastTsRef.current === null) lastTsRef.current = t;
      let dt = (t - lastTsRef.current) / 1000;
      lastTsRef.current = t;
      dt = Math.max(0, Math.min(dt, 0.05));

      const screen = hudRef.current.screen;
      if (screen === "countdown") updateCountdown(dt);
      else if (screen === "playing" && !hudRef.current.paused) update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateCountdown, update, draw]);

  const podium: PodiumSlot[] = useMemo(() => {
    if (hud.screen !== "finished") return [];
    const teamObj = TEAMS[hud.teamIndex];
    const fillers = finishFieldRef.current.map((c) => c.name);
    const rank = finishRankRef.current;
    const slots: PodiumSlot[] = [];
    for (let p = 1; p <= 3; p++) {
      const isPlayer = p === rank;
      slots.push({
        label: `P${p}`,
        name: isPlayer ? `${teamObj.name} (YOU)` : fillers.shift() ?? "RIVAL TEAM",
        isPlayer,
      });
    }
    return slots;
  }, [hud.screen, hud.teamIndex]);

  const showMinimap =
    hud.screen === "playing" || hud.screen === "countdown" || hud.screen === "finished";

  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-[#0a0a0a] text-white"
      style={{ fontFamily: "var(--font-press-start-2p), monospace" }}
    >
      <div ref={wrapRef} className="relative h-full flex-1">
        <canvas ref={canvasRef} className="block h-full w-full [image-rendering:pixelated]" />

        {showMinimap && (
          <canvas
            ref={minimapRef}
            width={150}
            height={120}
            className="absolute right-4 top-4 rounded border-2 border-[#333] bg-black/55"
          />
        )}

        {hud.screen === "select" && (
          <TeamSelectOverlay
            teamIndex={hud.teamIndex}
            onSelect={(i) => setHud({ teamIndex: i })}
            onStart={startRace}
          />
        )}

        {hud.screen === "countdown" && <CountdownOverlay lightsLit={hud.lightsLit} />}

        {hud.screen === "playing" && hud.paused && <PausedOverlay />}

        {hud.screen === "finished" && (
          <FinishedOverlay
            podium={podium}
            resultLine={`YOUR RESULT: P${finishRankRef.current}`}
            score={pad(hud.score, 6)}
            best={pad(hud.best, 6)}
          />
        )}
      </div>

      <HudSidebar hud={hud} />
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/arcade-effwon`, pick a team, start the race. Expected:
- After the countdown, a scrolling pseudo-3D road appears with alternating grass/road stripes, red-and-white curbs, and roadside trees/buildings.
- Holding the up arrow accelerates, the road scrolls faster; the road visibly bends left/right around corners (the layout matches the corner list in `raceData.ts`'s `TRACK.corners`).
- Left/right arrows steer the player's car sideways; steering off the road (past the curb) roughly halves your top speed.
- Down arrow brakes.
- The minimap (top-right) shows the track outline with a colored dot tracking your position around it.
- Sidebar SCORE, SPEED, TIME, LAP update live; POS shows "1 / 1" (no rivals yet — Task 4).
- Pressing `P` (or Escape) mid-race shows "PAUSED" with a blinking "PRESS P TO RESUME" and freezes the road; pressing it again resumes.
- To check the finish screen without waiting several minutes: temporarily change `TOTAL_LAPS` in `raceData.ts` to `1`, save (hot reload applies it), finish a lap, confirm "CHECKERED FLAG" appears with a 3-slot podium (your team highlighted, other two slots read "RIVAL TEAM" since there are no rivals yet), then **revert `TOTAL_LAPS` back to `8`** before committing.
- On the finished screen, Enter returns to the team-select screen.
- No console errors.

- [ ] **Step 5: Typecheck and lint**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add app/arcade-effwon
git commit -m "feat(arcade-effwon): add road rendering, driving physics, minimap, pause, and finish screen"
```

---

## Task 4: Rival cars, overtaking, collisions, and DNF

**Files:**
- Modify: `app/arcade-effwon/ArcadeEffWonOverlays.tsx`
- Modify: `app/arcade-effwon/ArcadeEffWonGame.tsx`

**Interfaces:**
- Produces (`ArcadeEffWonOverlays.tsx`, added this task): `GameOverOverlay({ score, best })`.
- Produces (`ArcadeEffWonGame.tsx`, this task): a `gameOver(finalScore: number)` callback alongside the existing `finishRace`. `startRace`, `update`, and `draw` are replaced in full (spawning/simulating/rendering real rival cars).
- Consumed by: none (this is the last gameplay task — Task 5 only touches other files).

- [ ] **Step 1: Add the game-over overlay component**

Append to `app/arcade-effwon/ArcadeEffWonOverlays.tsx` (after `FinishedOverlay`):

```tsx
export function GameOverOverlay({ score, best }: { score: string; best: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[14px] bg-black/85 p-5 text-center text-white">
      <div className="text-[16px] text-[#ff3b3b]">DNF</div>
      <div className="text-[9px] text-white">SCORE {score}</div>
      <div className="text-[9px] text-[#6ab04c]">BEST {best}</div>
      <div className="animate-[blink_1s_step-start_infinite] text-[9px] text-[#ffd23f]">
        PRESS ENTER TO PICK A TEAM
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add rival cars — spawn, AI, collisions, and DNF**

In `app/arcade-effwon/ArcadeEffWonGame.tsx`:

Add `STARTING_GRID_SIZE` to the `./raceData` import (`MIN_RIVALS` is already imported as of Task 3), add `makeCar` to the `./raceMath` import, and add `GameOverOverlay` to the `./ArcadeEffWonOverlays` import:

```ts
import {
  BEST_SCORE_STORAGE_KEY,
  DIFFICULTY_MULTIPLIER,
  MIN_RIVALS,
  STARTING_GRID_SIZE,
  TEAMS,
  TOTAL_LAPS,
  TRACK,
} from "./raceData";
import {
  buildMinimapCache,
  curveOffset,
  makeCar,
  pad,
  type Car,
  type MinimapCache,
} from "./raceMath";
import { createBeeper } from "./raceAudio";
import {
  TeamSelectOverlay,
  CountdownOverlay,
  PausedOverlay,
  GameOverOverlay,
  FinishedOverlay,
  HudSidebar,
} from "./ArcadeEffWonOverlays";
```

Replace the `startRace` function:

```ts
  const startRace = useCallback(() => {
    const idx = hudRef.current.teamIndex;
    const roadHW = dimsRef.current?.roadHW ?? 100;
    const rivals = TEAMS.filter((_, i) => i !== idx).slice(0, STARTING_GRID_SIZE);
    const cars = rivals.map((team, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const offset = (col === 0 ? -1 : 1) * roadHW * 0.4;
      return makeCar(team, 90 + row * 75, offset);
    });
    minimapCacheRef.current = buildMinimapCache(TRACK);
    gameRef.current = {
      worldScroll: 0,
      playerOffset: 0,
      speed: 0,
      time: 0,
      damage: 0,
      rank: cars.length + 1,
      invuln: 999,
      shakeT: 0,
      cars,
      retireTimer: 10 + Math.random() * 6,
      countdownT: 0,
      minRivals: MIN_RIVALS,
      totalLaps: TOTAL_LAPS,
      lap: 1,
      scoreAcc: 0,
    };
    setHud({
      screen: "countdown",
      teamIndex: idx,
      lightsLit: 0,
      score: 0,
      speed: 0,
      pos: "",
      time: 0,
      damage: 0,
      lap: 1,
    });
  }, [setHud]);
```

Add the `gameOver` function, right after `finishRace`:

```ts
  const gameOver = useCallback(
    (finalScore: number) => {
      const best = Math.max(hudRef.current.best, finalScore);
      try {
        localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(best));
      } catch {
        // localStorage unavailable — best score just won't persist
      }
      beepRef.current(200, 0.3, "sawtooth");
      beepRef.current(140, 0.4, "sawtooth");
      setHud({ screen: "gameover", score: finalScore, best, damage: 3 });
    },
    [setHud],
  );
```

Replace the `update` function:

```ts
  const update = useCallback(
    (dt: number) => {
      const g = gameRef.current;
      const dims = dimsRef.current;
      if (!g || !dims) return;
      const ROAD_HW = dims.roadHW;
      g.time += dt;

      let dir = 0;
      if (keysRef.current.ArrowLeft) dir -= 1;
      if (keysRef.current.ArrowRight) dir += 1;
      steerDirRef.current = dir;
      g.playerOffset += dir * 150 * dt;
      g.playerOffset = Math.max(-ROAD_HW * 2, Math.min(ROAD_HW * 2, g.playerOffset));

      const offRoad = Math.abs(g.playerOffset) > ROAD_HW - 8;
      const braking = keysRef.current.ArrowDown;
      const accel = keysRef.current.ArrowUp;

      const speedRamp = 1 + g.time * 0.012 * DIFFICULTY_MULTIPLIER;
      let baseMax = 240 * speedRamp;
      if (offRoad) baseMax *= 0.5;

      if (accel) g.speed += 220 * dt;
      else g.speed -= 50 * dt;
      if (braking) g.speed -= 200 * dt;
      g.speed = Math.max(0, Math.min(baseMax, g.speed));

      g.worldScroll += g.speed * dt;
      g.lap = Math.min(g.totalLaps, Math.floor(g.worldScroll / TRACK.length) + 1);
      if (g.invuln > 0) g.invuln -= dt;

      let scoreGain = g.speed * dt * 0.12;

      for (const c of g.cars) {
        const prevD = c.d;
        c.d -= (g.speed - c.speed * speedRamp) * dt;
        c.phase += dt * c.weaveSpeed;
        c.offset = Math.max(
          -(ROAD_HW - 14),
          Math.min(ROAD_HW - 14, Math.sin(c.phase) * c.weaveAmp),
        );
        if (c.hit > 0) c.hit -= dt;

        if (!c.justReset) {
          if (prevD >= 0 && c.d < 0) {
            g.rank = Math.max(1, g.rank - 1);
            scoreGain += 60;
            beepRef.current(880, 0.08, "sine", 0.05);
          } else if (prevD <= 0 && c.d > 0) {
            g.rank = Math.min(g.cars.length + 1, g.rank + 1);
            beepRef.current(220, 0.12, "triangle", 0.05);
          }
        }
        c.justReset = false;

        if (
          g.invuln <= 0 &&
          Math.abs(c.d) < 16 &&
          Math.abs(c.offset - g.playerOffset) < 20
        ) {
          g.damage += 1;
          g.invuln = 1.4;
          c.hit = 0.4;
          c.d = 200 + Math.random() * 100;
          c.justReset = true;
          g.speed *= 0.5;
          g.shakeT = 0.3;
          beepRef.current(120, 0.25, "sawtooth", 0.12);
        }
      }

      g.cars = g.cars.filter((c) => {
        if (c.d < -60) {
          if (g.cars.length > g.minRivals) return false;
          Object.assign(
            c,
            makeCar({ p: c.color, a: c.accent, name: c.name }, 300 + Math.random() * 260),
          );
        } else if (c.d > 640) {
          Object.assign(
            c,
            makeCar({ p: c.color, a: c.accent, name: c.name }, 260 + Math.random() * 200),
          );
        }
        return true;
      });
      g.rank = Math.min(g.rank, g.cars.length + 1);

      if (g.cars.length > g.minRivals) {
        g.retireTimer -= dt;
        if (g.retireTimer <= 0) {
          g.retireTimer = 9 + Math.random() * 8;
          const idx = Math.floor(Math.random() * g.cars.length);
          g.cars.splice(idx, 1);
          g.rank = Math.min(g.rank, g.cars.length + 1);
          beepRef.current(300, 0.15, "triangle", 0.04);
        }
      }

      g.shakeT = Math.max(0, g.shakeT - dt);
      g.scoreAcc = Math.max(0, g.scoreAcc + scoreGain);

      if (g.damage >= 3) {
        gameOver(Math.floor(g.scoreAcc));
        return;
      }

      if (g.worldScroll >= TRACK.length * g.totalLaps) {
        finishRace(Math.floor(g.scoreAcc) + 500);
        return;
      }

      setHud({
        score: Math.floor(g.scoreAcc),
        speed: Math.floor(g.speed),
        pos: `${g.rank} / ${g.cars.length + 1}`,
        time: g.time,
        damage: g.damage,
        lap: g.lap,
      });
    },
    [gameOver, finishRace, setHud],
  );
```

Inside `draw`, add rival car rendering right after the road-drawing loop closes and before the player car is drawn — replace:

```tsx
      const playerCenter = CX + curveOffset(TRACK, g.worldScroll, intensity);
      const team = TEAMS[hudRef.current.teamIndex];
      drawCar(
```

with:

```tsx
      const playerCenter = CX + curveOffset(TRACK, g.worldScroll, intensity);
      const sorted = [...g.cars].sort((a, b) => b.d - a.d);
      for (const c of sorted) {
        const cy = PLAYER_Y - c.d;
        if (cy < -30 || cy > H + 30) continue;
        const cc = CX + curveOffset(TRACK, g.worldScroll + c.d, intensity);
        drawCar(ctx, cc + c.offset, cy, c.color, c.accent, false, c.hit > 0);
      }

      const team = TEAMS[hudRef.current.teamIndex];
      drawCar(
```

Add the game-over screen to the JSX, right after the paused-overlay line:

```tsx
        {hud.screen === "playing" && hud.paused && <PausedOverlay />}

        {hud.screen === "gameover" && (
          <GameOverOverlay score={pad(hud.score, 6)} best={pad(hud.best, 6)} />
        )}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/arcade-effwon`, pick a team, start the race. Expected:
- After the countdown, up to 10 rival cars are visible on the road ahead/behind, each colored per its team, weaving side to side.
- Driving faster than a rival closes the gap and passes it — POS in the sidebar decrements (e.g. "8 / 11" → "7 / 11") with an ascending "pass" beep; getting passed increments it with a lower "passed" beep.
- Steering into a rival (same lateral offset, close distance) increments a DAMAGE square (turns red), the player car flickers (invulnerability), your speed is cut in half, and the screen briefly shakes.
- After the 3rd hit, "DNF" appears with your score and best score, and a blinking "PRESS ENTER TO PICK A TEAM"; Enter returns to team select.
- Occasionally a rival car disappears entirely (retirement) as long as the field stays above `MIN_RIVALS` (3).
- Finishing 8 laps without 3 hits still shows the checkered-flag podium, now with real rival team names filling the non-player slots instead of "RIVAL TEAM" placeholders (use the same temporary `TOTAL_LAPS = 1` trick from Task 3 to check this quickly, then revert it).
- No console errors.

- [ ] **Step 4: Typecheck and lint**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add app/arcade-effwon
git commit -m "feat(arcade-effwon): add rival cars, overtaking, collisions, and DNF"
```

---

## Task 5: Site integration and old-game cleanup

**Files:**
- Modify: `app/lib/playPortfolio.ts`
- Delete: `app/ascii-game/page.tsx`
- Delete: `app/ascii-game/AsciiGamePageClient.tsx`
- Delete: `app/about/AboutRaceGameOverlay.tsx`
- Delete: `app/about/AboutRaceStrip.tsx`
- Delete: `components/ui/pixelact-ui/toast.tsx`
- Delete: `public/ASCII F1 Car.svg`

**Interfaces:**
- Consumes: nothing new from earlier tasks (this task only touches unrelated files and deletes now-dead ones).
- Produces: nothing consumed by later tasks — this is a leaf task.

- [ ] **Step 1: Update the Play-portfolio card**

In `app/lib/playPortfolio.ts`, remove the now-unused constants (the old game's GitHub link, video, and poster):

Remove:

```ts
const ASCII_GAME_GITHUB_HREF =
  "https://github.com/priyamwada15/ASCII-race-game-with-Pixelact-and-shadcn-UI";
```

Remove:

```ts
const ASCII_GAME_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1778784207/Screen_Recording_2026-05-13_235432_gyusng.mp4";
const ASCII_GAME_POSTER_SRC = `${PLAY_AVIF}/ascii-game-poster.avif`;
```

Replace the `ascii-run` item in `PLAY_PORTFOLIO_ITEMS`:

```ts
  {
    id: "ascii-run",
    title: "ASCII Run",
    tagParts: ["Mini-game", "Cursor", "Next.js", "May 2026"],
    description:
      "A fast scroll-linked lane dodge game, navigate using arrow keys, ramping speed every 5s and a chance to listen to my favorite song.",
    experienceCta: {
      label: "Play Game",
      href: "/ascii-game",
      ariaLabel: "Play the ASCII lane game",
    },
    githubLiquidCta: {
      href: ASCII_GAME_GITHUB_HREF,
      ariaLabel: "View ASCII Run on GitHub",
    },
    videoSrc: ASCII_GAME_VIDEO_SRC,
    posterSrc: ASCII_GAME_POSTER_SRC,
    mediaAlt: "Screen recording of the ASCII lane game",
  },
```

with:

```ts
  {
    id: "arcade-effwon",
    title: "Arcade EffWon",
    tagParts: ["Mini-game", "Canvas", "Next.js", "Aug 2026"],
    description:
      "A pseudo-3D pixel-art F1 racer built on a single canvas. Pick a team, survive 8 laps of corners and rival traffic without racking up 3 hits.",
    experienceCta: {
      label: "Play Game",
      href: "/arcade-effwon",
      ariaLabel: "Play Arcade EffWon",
    },
    mediaAlt: "Arcade EffWon pseudo-3D racer",
  },
```

Update the id in `HOME_PLAY_TAB_ITEM_IDS`:

```ts
export const HOME_PLAY_TAB_ITEM_IDS = [
  "arcade-effwon",
  "sunlight-effect",
  "rocket-lisa",
  "robot-duet",
  "stellar-scan",
  "ai-intelligencer",
] as const;
```

- [ ] **Step 2: Confirm nothing else references the files about to be deleted**

```bash
grep -rn "AboutRaceGameOverlay\|AboutRaceStrip\|ascii-game\|ASCII F1 Car" app components --include="*.tsx" --include="*.ts"
```

Expected: no remaining matches (the `app/ascii-game` route itself will still show up until Step 3 deletes it — that's expected at this point).

- [ ] **Step 3: Delete the old game's route, components, and assets**

```bash
git rm -r "app/ascii-game"
git rm "app/about/AboutRaceGameOverlay.tsx"
git rm "app/about/AboutRaceStrip.tsx"
git rm "components/ui/pixelact-ui/toast.tsx"
git rm "public/ASCII F1 Car.svg"
```

- [ ] **Step 4: Re-run the reference check**

```bash
grep -rn "AboutRaceGameOverlay\|AboutRaceStrip\|toastRestartPrompt\|/ascii-game\|ASCII F1 Car" app components --include="*.tsx" --include="*.ts"
```

Expected: no matches at all now.

- [ ] **Step 5: Typecheck, lint, and build**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all clean. `npm run build`'s route list should show `/arcade-effwon` and should **not** show `/ascii-game`.

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

- Open `http://localhost:3000/` and switch to the Play tab (or open `http://localhost:3000/playground`) — confirm the card now reads "Arcade EffWon" with the updated tags/description, no video (blank placeholder panel is expected — new footage comes later), and no GitHub pill; its "Play Game" link opens `/arcade-effwon`.
- Open `http://localhost:3000/ascii-game` directly — confirm it 404s (route no longer exists).
- Open `http://localhost:3000/about` — confirm it still renders normally (it never actually imported the deleted race components, per the earlier grep).

- [ ] **Step 7: Commit**

```bash
git add app/lib/playPortfolio.ts
git commit -m "feat(arcade-effwon): point homepage/playground card at the new game and remove the old one"
```

---

## Task 6: Final verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Full playthrough checklist**

```bash
npm run dev
```

Open `http://localhost:3000/arcade-effwon` and walk through, in order:

1. **Team select** — arrow keys (all 4 directions) move the highlighted card and clamp at the grid edges; clicking a card selects it; Enter starts the race.
2. **Countdown** — 5 lights fill in sequence with audible beeps; race starts automatically once all 5 are lit.
3. **Racing** — steering, accel, brake all respond; speed visibly ramps up over time; drifting off-road roughly halves top speed.
4. **Rivals** — visible on track, weaving; overtaking/being overtaken updates POS with distinct beeps.
5. **Collisions** — hitting a rival increments DAMAGE, triggers a brief invulnerability flicker and a speed cut; the 3rd hit ends the run with "DNF" and shows SCORE/BEST.
6. **Pause** — `P` (or Escape) toggles the paused overlay mid-race and resumes correctly.
7. **Laps** — the LAP counter climbs correctly toward 8 as `worldScroll` crosses each multiple of the track length.
8. **Finish** — reaching lap 8 without a DNF shows "CHECKERED FLAG" with a 3-slot podium (your team highlighted at your finishing rank, real rival names filling the other slots) and the final score.
9. **Minimap** — visible during countdown/playing/finished; the colored dot tracks your position around the outline.
10. **Best score** — reload the page after a run; confirm BEST persists (check `localStorage.getItem("arcade_effwon_best")` in devtools).
11. **Restart loop** — from both the DNF and finished screens, Enter returns to team select and a new race can be started immediately.

- [ ] **Step 2: Integration checklist**

- `/` (Play tab) and `/playground` show the "Arcade EffWon" card with correct copy, a blank media placeholder, and a working "Play Game" link.
- `/ascii-game` 404s.
- `/arcade-effwon` renders full-bleed — no site nav bar, no footer.
- `/about` still renders normally.
- `/sitemap.xml` (or `app/sitemap.ts`'s output) lists `/arcade-effwon`, not `/ascii-game`.

- [ ] **Step 3: Static checks**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all three clean, with `/arcade-effwon` present in the build's route output.

- [ ] **Step 4: Confirm no leftover references**

```bash
grep -rn "ascii-game\|AsciiGamePageClient\|AboutRaceGameOverlay\|AboutRaceStrip\|f1racer_best" app components docs --include="*.tsx" --include="*.ts" --include="*.md"
```

Expected: no matches outside of the design/plan docs under `docs/superpowers/` (which are historical records and intentionally keep the old names).

- [ ] **Step 5: Fix any issues found**

If any check in Steps 1–4 fails, fix the relevant file from the task that introduced it (most likely `ArcadeEffWonGame.tsx` for gameplay-feel issues, `raceData.ts`/`raceMath.ts` for track/physics values, or `playPortfolio.ts`/`AppChrome.tsx`/`sitemap.ts` for integration issues) and re-run the relevant checklist step.

- [ ] **Step 6: Commit if any fixes were made**

```bash
git add app/arcade-effwon app/lib/playPortfolio.ts app/components/AppChrome.tsx app/sitemap.ts app/layout.tsx
git commit -m "fix(arcade-effwon): address issues found in final verification pass"
```

(Skip this commit if Steps 1–4 passed clean with no changes.)
