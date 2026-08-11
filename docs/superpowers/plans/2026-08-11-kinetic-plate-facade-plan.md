# Kinetic Plate Facade Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/kinetic-facade` prototype route rendering a grid of top-pinned metallic plates that swing like wind-blown facade shingles as the cursor moves near them, in two swappable material looks (steel/aluminum, copper/brass).

**Architecture:** A React Three Fiber scene (`Canvas` + `drei`'s `Environment` for PBR lighting) renders a uniform grid of thin box meshes, each wrapped in a `<group>` pivoted at its top edge. A hand-rolled damped-pendulum integrator (no physics engine) updates each plate's swing angle every frame, driven by a wind-torque field computed from the cursor's projected position on the plate plane. Pure data/math modules (grid layout, material presets, pendulum step, wind field) are kept separate from the rendering components so the physics can be reasoned about and adjusted independently of the Three.js wiring.

**Tech Stack:** Next.js 16 (App Router) client components, React Three Fiber (`@react-three/fiber`), `@react-three/drei` (`Environment`), `three`, hand-rolled physics (no `@react-three/rapier` or other physics engine — see design spec's tradeoff notes).

**Note on file structure vs. the design spec:** [`docs/superpowers/specs/2026-08-11-kinetic-plate-facade-design.md`](../specs/2026-08-11-kinetic-plate-facade-design.md) listed `page.tsx` as owning variant/toggle state directly. This plan instead keeps `page.tsx` a thin server component and moves that state into a new `KineticFacadeApp.tsx` client component, matching the existing codebase convention where route `page.tsx` files stay server components and delegate interactivity to a colocated client component (see `app/sunlight/page.tsx` → `SunlightEffect`, `app/water/page.tsx` → `WaterGlintEffect`). Behavior is unchanged from the approved design.

**Note on verification:** This repository has no automated test runner (no jest/vitest/playwright configured — confirmed via `package.json` and repo search). The approved design spec's own "Testing / verification" section specifies manual in-browser checks, so every task below is verified by running the dev server and checking behavior in the browser rather than by an automated test suite. Do not introduce a new test framework for this — it would be scope creep beyond what was asked.

## Global Constraints

- Plates are pinned **only at the top edge** (not top-and-bottom) — rotation pivots from the top, matching the corrected design.
- The light source is **fixed**, never tied to cursor position. Cursor position drives wind/physics only, never lighting.
- Two material variants: **steel/aluminum is the default**, copper/brass is the secondary, user-toggleable option. Both share identical geometry and physics.
- No sound. No shape variety (uniform rectangular plates only). No hero copy/headline integration. All deferred per the design spec's scope boundaries.
- Must respect `prefers-reduced-motion: reduce` (plates render at rest, no swing loop).
- New route lives at `app/kinetic-facade/`, following the existing standalone-effect-route convention (bare effect + "Back Home" link, no site nav/header) used by `app/water/` and `app/sunlight/`.
- No physics-engine dependency (no `@react-three/rapier`, `cannon-es`, etc.) for this prototype — hand-rolled pendulum integration only.

---

## Task 1: Static plate grid with steel material and fixed lighting

**Files:**
- Create: `app/kinetic-facade/plateGrid.ts`
- Create: `app/kinetic-facade/materialVariants.ts`
- Create: `app/kinetic-facade/KineticPlateGrid.tsx`
- Create: `app/kinetic-facade/KineticFacadeScene.tsx`
- Create: `app/kinetic-facade/KineticFacadeApp.tsx`
- Create: `app/kinetic-facade/page.tsx`

**Interfaces:**
- Produces: `PlateDefinition` type `{ id: string; col: number; row: number; x: number; y: number; width: number; height: number }`, `buildPlateGrid(config?: PlateGridConfig): PlateDefinition[]`, `DEFAULT_GRID_CONFIG`.
- Produces: `MaterialVariantId = "steel" | "copper"`, `MaterialVariant` type `{ id: MaterialVariantId; label: string; color: string; metalness: number; roughness: number; environmentPreset: "studio" | "sunset" }`, `MATERIAL_VARIANTS: Record<MaterialVariantId, MaterialVariant>`, `DEFAULT_MATERIAL_VARIANT_ID`.
- Produces: `<KineticPlateGrid variant={MaterialVariant} reducedMotion={boolean} />`, `<KineticFacadeScene variant={MaterialVariant} reducedMotion={boolean} />`.
- Consumed by: Task 2 (toggle UI), Task 3 (pendulum physics), Task 4 (wind field), Task 5 (reduced motion).

- [ ] **Step 1: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Create the plate grid layout module**

`app/kinetic-facade/plateGrid.ts`:

```ts
export type PlateDefinition = {
  id: string;
  col: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PlateGridConfig = {
  columns: number;
  rows: number;
  plateWidth: number;
  plateHeight: number;
  gapX: number;
  gapY: number;
};

export const DEFAULT_GRID_CONFIG: PlateGridConfig = {
  columns: 14,
  rows: 9,
  plateWidth: 0.55,
  plateHeight: 0.8,
  gapX: 0.15,
  gapY: 0.15,
};

export function buildPlateGrid(
  config: PlateGridConfig = DEFAULT_GRID_CONFIG,
): PlateDefinition[] {
  const { columns, rows, plateWidth, plateHeight, gapX, gapY } = config;
  const cellWidth = plateWidth + gapX;
  const cellHeight = plateHeight + gapY;
  const totalWidth = columns * cellWidth;
  const totalHeight = rows * cellHeight;
  const plates: PlateDefinition[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = col * cellWidth - totalWidth / 2 + cellWidth / 2;
      const y = totalHeight / 2 - row * cellHeight - cellHeight / 2;
      plates.push({
        id: `${row}-${col}`,
        col,
        row,
        x,
        y,
        width: plateWidth,
        height: plateHeight,
      });
    }
  }

  return plates;
}
```

- [ ] **Step 3: Create the material variants module**

`app/kinetic-facade/materialVariants.ts`:

```ts
export type MaterialVariantId = "steel" | "copper";

export type MaterialVariant = {
  id: MaterialVariantId;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
  environmentPreset: "studio" | "sunset";
};

export const MATERIAL_VARIANTS: Record<MaterialVariantId, MaterialVariant> = {
  steel: {
    id: "steel",
    label: "Steel",
    color: "#c7cdd4",
    metalness: 0.9,
    roughness: 0.25,
    environmentPreset: "studio",
  },
  copper: {
    id: "copper",
    label: "Copper",
    color: "#b5652d",
    metalness: 0.85,
    roughness: 0.35,
    environmentPreset: "sunset",
  },
};

export const DEFAULT_MATERIAL_VARIANT_ID: MaterialVariantId = "steel";
```

- [ ] **Step 4: Create the plate grid rendering component (static, no physics yet)**

`app/kinetic-facade/KineticPlateGrid.tsx`:

```tsx
"use client";

import { useMemo, useRef } from "react";
import type { Group } from "three";
import { buildPlateGrid } from "./plateGrid";
import type { MaterialVariant } from "./materialVariants";

type KineticPlateGridProps = {
  variant: MaterialVariant;
  reducedMotion: boolean;
};

export function KineticPlateGrid({ variant }: KineticPlateGridProps) {
  const plates = useMemo(() => buildPlateGrid(), []);
  const groupRefs = useRef<(Group | null)[]>([]);

  return (
    <>
      {plates.map((plate, index) => (
        <group
          key={plate.id}
          ref={(el) => {
            groupRefs.current[index] = el;
          }}
          position={[plate.x, plate.y + plate.height / 2, 0]}
        >
          <mesh position={[0, -plate.height / 2, 0]}>
            <boxGeometry args={[plate.width, plate.height, 0.03]} />
            <meshPhysicalMaterial
              color={variant.color}
              metalness={variant.metalness}
              roughness={variant.roughness}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
```

(`reducedMotion` is accepted now so the prop stays stable for later tasks, even though this step doesn't use it yet — it's wired up for real in Task 5.)

- [ ] **Step 5: Create the R3F scene wrapper**

`app/kinetic-facade/KineticFacadeScene.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { KineticPlateGrid } from "./KineticPlateGrid";
import type { MaterialVariant } from "./materialVariants";

type KineticFacadeSceneProps = {
  variant: MaterialVariant;
  reducedMotion: boolean;
};

export function KineticFacadeScene({
  variant,
  reducedMotion,
}: KineticFacadeSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <Environment preset={variant.environmentPreset} />
      <ambientLight intensity={0.15} />
      <KineticPlateGrid variant={variant} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
```

- [ ] **Step 6: Create the client app component (owns variant state) and the route entry**

`app/kinetic-facade/KineticFacadeApp.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { KineticFacadeScene } from "./KineticFacadeScene";
import {
  DEFAULT_MATERIAL_VARIANT_ID,
  MATERIAL_VARIANTS,
} from "./materialVariants";

export function KineticFacadeApp() {
  const [variantId, setVariantId] = useState(DEFAULT_MATERIAL_VARIANT_ID);
  const reducedMotion = false;
  const variant = MATERIAL_VARIANTS[variantId];

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a]">
      <KineticFacadeScene variant={variant} reducedMotion={reducedMotion} />
      <Link
        href="/"
        className="absolute bottom-6 left-6 z-10 text-sm text-white/70 hover:text-white"
      >
        Back Home
      </Link>
    </div>
  );
}
```

`app/kinetic-facade/page.tsx`:

```tsx
import { KineticFacadeApp } from "./KineticFacadeApp";

export default function KineticFacadePage() {
  return <KineticFacadeApp />;
}
```

- [ ] **Step 7: Verify in browser**

Run:

```bash
npm run dev
```

Open `http://localhost:3000/kinetic-facade`. Expected:
- A grid of flat, brushed-steel-colored rectangular plates fills most of the viewport against a dark background.
- Plates show visible metallic reflections/highlights from the `studio` environment (not flat/matte).
- No console errors.
- "Back Home" link is visible bottom-left and navigates to `/`.

If the grid doesn't fill the viewport well, adjust `columns`/`rows`/`plateWidth`/`plateHeight` in `DEFAULT_GRID_CONFIG` or the camera `position` z-distance in `KineticFacadeScene.tsx` — these are starting values, not exact.

- [ ] **Step 8: Commit**

```bash
git add app/kinetic-facade
git commit -m "feat(kinetic-facade): add static steel plate grid prototype route"
```

---

## Task 2: Copper/brass variant toggle

**Files:**
- Modify: `app/kinetic-facade/KineticFacadeApp.tsx`

**Interfaces:**
- Consumes: `MATERIAL_VARIANTS`, `MaterialVariantId` from Task 1's `materialVariants.ts`.
- Produces: no new exports — this task adds UI/state only.

- [ ] **Step 1: Add the variant toggle buttons**

Replace the body of `app/kinetic-facade/KineticFacadeApp.tsx` with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { KineticFacadeScene } from "./KineticFacadeScene";
import {
  DEFAULT_MATERIAL_VARIANT_ID,
  MATERIAL_VARIANTS,
  type MaterialVariantId,
} from "./materialVariants";

export function KineticFacadeApp() {
  const [variantId, setVariantId] = useState<MaterialVariantId>(
    DEFAULT_MATERIAL_VARIANT_ID,
  );
  const reducedMotion = false;
  const variant = MATERIAL_VARIANTS[variantId];

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a]">
      <KineticFacadeScene variant={variant} reducedMotion={reducedMotion} />
      <div className="absolute left-6 top-6 z-10 flex gap-2">
        {Object.values(MATERIAL_VARIANTS).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setVariantId(option.id)}
            className={
              option.id === variantId
                ? "rounded-full bg-white px-4 py-2 text-sm text-black"
                : "rounded-full bg-white/10 px-4 py-2 text-sm text-white"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
      <Link
        href="/"
        className="absolute bottom-6 left-6 z-10 text-sm text-white/70 hover:text-white"
      >
        Back Home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:3000/kinetic-facade`. Expected:
- Two pill buttons, "Steel" and "Copper", top-left. "Steel" appears active (white background) by default.
- Clicking "Copper" changes plate color to the warm copper tone and swaps the environment lighting to the `sunset` preset (reflections shift warmer). "Copper" button becomes the active-styled one.
- Clicking "Steel" again reverts cleanly.
- No console errors during the switch.

- [ ] **Step 3: Commit**

```bash
git add app/kinetic-facade/KineticFacadeApp.tsx
git commit -m "feat(kinetic-facade): add steel/copper variant toggle"
```

---

## Task 3: Pendulum physics integration (test impulse, no pointer input yet)

**Files:**
- Create: `app/kinetic-facade/pendulumPhysics.ts`
- Modify: `app/kinetic-facade/KineticPlateGrid.tsx`

**Interfaces:**
- Produces: `PlateSwingState` type `{ angle: number; angularVelocity: number }`, `PendulumParams` type `{ stiffness: number; damping: number; maxAngle: number }`, `DEFAULT_PENDULUM_PARAMS`, `stepPendulum(state: PlateSwingState, windTorque: number, dt: number, params?: PendulumParams): PlateSwingState`.
- Consumed by: Task 4 (real wind-field-driven torque replaces the test impulse added here).

This task proves the pendulum math and rendering wiring work correctly using a temporary hardcoded test impulse, before wiring real pointer tracking in Task 4 — isolating physics-integration bugs from pointer-projection bugs.

- [ ] **Step 1: Create the pendulum physics module**

`app/kinetic-facade/pendulumPhysics.ts`:

```ts
export type PlateSwingState = {
  angle: number;
  angularVelocity: number;
};

export type PendulumParams = {
  stiffness: number;
  damping: number;
  maxAngle: number;
};

export const DEFAULT_PENDULUM_PARAMS: PendulumParams = {
  stiffness: 18,
  damping: 4.5,
  maxAngle: Math.PI / 2.2,
};

export function stepPendulum(
  state: PlateSwingState,
  windTorque: number,
  dt: number,
  params: PendulumParams = DEFAULT_PENDULUM_PARAMS,
): PlateSwingState {
  const restoringTorque = -params.stiffness * state.angle;
  const dampingTorque = -params.damping * state.angularVelocity;
  const angularAcceleration = restoringTorque + dampingTorque + windTorque;

  const angularVelocity = state.angularVelocity + angularAcceleration * dt;
  let angle = state.angle + angularVelocity * dt;
  angle = Math.max(-params.maxAngle, Math.min(params.maxAngle, angle));

  return { angle, angularVelocity };
}
```

- [ ] **Step 2: Wire the pendulum step into the plate grid with a temporary test impulse**

Replace `app/kinetic-facade/KineticPlateGrid.tsx` with:

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { buildPlateGrid } from "./plateGrid";
import {
  stepPendulum,
  type PlateSwingState,
} from "./pendulumPhysics";
import type { MaterialVariant } from "./materialVariants";

type KineticPlateGridProps = {
  variant: MaterialVariant;
  reducedMotion: boolean;
};

export function KineticPlateGrid({
  variant,
  reducedMotion,
}: KineticPlateGridProps) {
  const plates = useMemo(() => buildPlateGrid(), []);
  const swingStates = useRef<PlateSwingState[]>(
    plates.map(() => ({ angle: 0, angularVelocity: 0 })),
  );
  const groupRefs = useRef<(Group | null)[]>([]);
  const elapsed = useRef(0);

  useFrame((_state, delta) => {
    if (reducedMotion) return;
    elapsed.current += delta;

    // TEMPORARY test impulse: pulses a wind torque on plates near the grid
    // center for the first second, so the pendulum math can be verified
    // visually before real pointer tracking is wired in (Task 4).
    const testTorque = elapsed.current < 1 ? 30 : 0;

    plates.forEach((plate, index) => {
      const isNearCenter = Math.abs(plate.col - 6.5) < 2 && Math.abs(plate.row - 4) < 2;
      const windTorque = isNearCenter ? testTorque : 0;
      const nextState = stepPendulum(swingStates.current[index], windTorque, delta);
      swingStates.current[index] = nextState;

      const group = groupRefs.current[index];
      if (group) {
        group.rotation.x = nextState.angle;
      }
    });
  });

  return (
    <>
      {plates.map((plate, index) => (
        <group
          key={plate.id}
          ref={(el) => {
            groupRefs.current[index] = el;
          }}
          position={[plate.x, plate.y + plate.height / 2, 0]}
        >
          <mesh position={[0, -plate.height / 2, 0]}>
            <boxGeometry args={[plate.width, plate.height, 0.03]} />
            <meshPhysicalMaterial
              color={variant.color}
              metalness={variant.metalness}
              roughness={variant.roughness}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:3000/kinetic-facade`. Expected:
- On page load, the plates near the grid's center swing open (rotate forward from the top hinge) for about a second, then oscillate with decreasing amplitude and settle back to flat/resting — a visible damped pendulum swing, not an instant snap.
- Plates outside the center cluster stay flat throughout.
- Reloading the page repeats the same swing-and-settle motion.

- [ ] **Step 4: Commit**

```bash
git add app/kinetic-facade/pendulumPhysics.ts app/kinetic-facade/KineticPlateGrid.tsx
git commit -m "feat(kinetic-facade): wire pendulum physics with temporary test impulse"
```

---

## Task 4: Cursor-driven wind field (replaces test impulse)

**Files:**
- Create: `app/kinetic-facade/windField.ts`
- Modify: `app/kinetic-facade/KineticPlateGrid.tsx`

**Interfaces:**
- Produces: `PlatePosition` type `{ x: number; y: number }`, `WindFieldParams` type `{ radius: number; strength: number }`, `DEFAULT_WIND_FIELD_PARAMS`, `computeWindTorque(platePosition: PlatePosition, pointerPosition: PlatePosition | null, params?: WindFieldParams): number`.
- Consumes: `PlateSwingState`, `stepPendulum` from Task 3.

- [ ] **Step 1: Create the wind field module**

`app/kinetic-facade/windField.ts`:

```ts
export type PlatePosition = { x: number; y: number };

export type WindFieldParams = {
  radius: number;
  strength: number;
};

export const DEFAULT_WIND_FIELD_PARAMS: WindFieldParams = {
  radius: 2.5,
  strength: 40,
};

export function computeWindTorque(
  platePosition: PlatePosition,
  pointerPosition: PlatePosition | null,
  params: WindFieldParams = DEFAULT_WIND_FIELD_PARAMS,
): number {
  if (!pointerPosition) return 0;

  const dx = platePosition.x - pointerPosition.x;
  const dy = platePosition.y - pointerPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= params.radius) return 0;

  const falloff = 1 - distance / params.radius;
  return params.strength * falloff * falloff;
}
```

- [ ] **Step 2: Replace the test impulse with real pointer-projected wind**

In `app/kinetic-facade/KineticPlateGrid.tsx`:
- Remove the `elapsed` ref and the "TEMPORARY test impulse" block from Step 2 of Task 3.
- Add pointer projection (raycast the cursor onto the plate grid's `z = 0` plane every frame) and use `computeWindTorque` per plate.

Replace the file with:

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Plane, Vector3 } from "three";
import { buildPlateGrid } from "./plateGrid";
import {
  stepPendulum,
  type PlateSwingState,
} from "./pendulumPhysics";
import { computeWindTorque } from "./windField";
import type { MaterialVariant } from "./materialVariants";

type KineticPlateGridProps = {
  variant: MaterialVariant;
  reducedMotion: boolean;
};

export function KineticPlateGrid({
  variant,
  reducedMotion,
}: KineticPlateGridProps) {
  const plates = useMemo(() => buildPlateGrid(), []);
  const swingStates = useRef<PlateSwingState[]>(
    plates.map(() => ({ angle: 0, angularVelocity: 0 })),
  );
  const groupRefs = useRef<(Group | null)[]>([]);
  const plane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);
  const pointerWorld = useRef(new Vector3());

  useFrame((state, delta) => {
    if (reducedMotion) return;

    state.raycaster.setFromCamera(state.pointer, state.camera);
    const hit = state.raycaster.ray.intersectPlane(plane, pointerWorld.current);
    const pointer = hit
      ? { x: pointerWorld.current.x, y: pointerWorld.current.y }
      : null;

    plates.forEach((plate, index) => {
      const windTorque = computeWindTorque({ x: plate.x, y: plate.y }, pointer);
      const nextState = stepPendulum(swingStates.current[index], windTorque, delta);
      swingStates.current[index] = nextState;

      const group = groupRefs.current[index];
      if (group) {
        group.rotation.x = nextState.angle;
      }
    });
  });

  return (
    <>
      {plates.map((plate, index) => (
        <group
          key={plate.id}
          ref={(el) => {
            groupRefs.current[index] = el;
          }}
          position={[plate.x, plate.y + plate.height / 2, 0]}
        >
          <mesh position={[0, -plate.height / 2, 0]}>
            <boxGeometry args={[plate.width, plate.height, 0.03]} />
            <meshPhysicalMaterial
              color={variant.color}
              metalness={variant.metalness}
              roughness={variant.roughness}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:3000/kinetic-facade`. Expected:
- Plates are flat at rest on load (no more auto-triggered center swing).
- Moving the cursor over the grid causes nearby plates to swing open, with visibly less rotation the farther a plate is from the cursor (falloff), and no reaction for plates outside roughly a 2-3 plate-width radius.
- Plates spring back with a damped oscillation (slight overshoot, then settle) after the cursor moves away, not an instant snap.
- Moving the cursor steadily across the grid produces a traveling wave of open plates following it.
- If the effect feels too weak/strong or the radius too small/large, adjust `DEFAULT_WIND_FIELD_PARAMS.strength`/`radius` in `windField.ts`.

- [ ] **Step 4: Commit**

```bash
git add app/kinetic-facade/windField.ts app/kinetic-facade/KineticPlateGrid.tsx
git commit -m "feat(kinetic-facade): drive plate swing from cursor-projected wind field"
```

---

## Task 5: Respect `prefers-reduced-motion`

**Files:**
- Modify: `app/kinetic-facade/KineticFacadeApp.tsx`

**Interfaces:**
- Consumes: existing `reducedMotion` prop plumbing already threaded through `KineticFacadeScene`/`KineticPlateGrid` since Task 1 (previously hardcoded to `false`).

- [ ] **Step 1: Read the media query and wire it into state**

In `app/kinetic-facade/KineticFacadeApp.tsx`, replace the hardcoded `const reducedMotion = false;` line and add the media query effect:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KineticFacadeScene } from "./KineticFacadeScene";
import {
  DEFAULT_MATERIAL_VARIANT_ID,
  MATERIAL_VARIANTS,
  type MaterialVariantId,
} from "./materialVariants";

export function KineticFacadeApp() {
  const [variantId, setVariantId] = useState<MaterialVariantId>(
    DEFAULT_MATERIAL_VARIANT_ID,
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const variant = MATERIAL_VARIANTS[variantId];

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a]">
      <KineticFacadeScene variant={variant} reducedMotion={reducedMotion} />
      <div className="absolute left-6 top-6 z-10 flex gap-2">
        {Object.values(MATERIAL_VARIANTS).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setVariantId(option.id)}
            className={
              option.id === variantId
                ? "rounded-full bg-white px-4 py-2 text-sm text-black"
                : "rounded-full bg-white/10 px-4 py-2 text-sm text-white"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
      <Link
        href="/"
        className="absolute bottom-6 left-6 z-10 text-sm text-white/70 hover:text-white"
      >
        Back Home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

With OS/browser-level reduced motion OFF: confirm behavior is unchanged from Task 4 (plates swing with cursor).

With reduced motion ON (enable via OS accessibility settings, or temporarily in DevTools by running `window.matchMedia = () => ({ matches: true, addEventListener(){}, removeEventListener(){} })` in the console before reload, then reverting): confirm plates render at rest and do not move as the cursor crosses the grid.

- [ ] **Step 3: Commit**

```bash
git add app/kinetic-facade/KineticFacadeApp.tsx
git commit -m "feat(kinetic-facade): respect prefers-reduced-motion"
```

---

## Task 6: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Run the full spec verification checklist**

With `npm run dev` running and `http://localhost:3000/kinetic-facade` open, confirm all of the following (from the design spec's Testing/verification section):
- Plates hang flat at rest with visible metallic sheen from the fixed light, in both material variants (toggle between Steel and Copper and check both).
- Moving the cursor across the grid causes nearby plates to swing open with a pendulum overshoot-and-settle motion, with a visible falloff.
- The light/shadow highlight on each plate changes believably as it swings, in both variants.
- Switching the variant toggle mid-interaction (while plates are actively swinging) swaps material/lighting cleanly without breaking the in-progress motion or throwing console errors.
- With OS-level reduced-motion enabled, plates are static regardless of cursor movement.
- No console errors or warnings at any point above.

- [ ] **Step 2: Fix any issues found**

If any check fails, fix the relevant file (most likely `windField.ts` or `pendulumPhysics.ts` parameters for feel issues, or `KineticFacadeApp.tsx` for the reduced-motion/toggle wiring) and re-run Step 1.

- [ ] **Step 3: Commit if any fixes were made**

```bash
git add app/kinetic-facade
git commit -m "fix(kinetic-facade): address issues found in final verification pass"
```

(Skip this commit if Step 1 passed clean with no changes.)
