# Playground Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real `/playground` page — a full-viewport kinetic facade (copper dissolve variant) sitting on top of a normal, Nav/Footer-equipped page with a placeholder project-card grid, with hover/drag peek and click/tap dissolve-out on both desktop and mobile.

**Architecture:** Reuse the pure physics/data modules already built and verified in `app/kinetic-facade/` (`plateGrid.ts`, `pendulumPhysics.ts`, `windField.ts`, `ripplePhysics.ts`, `dissolvePhysics.ts`, `dissolvePoints.ts`, `materialVariants.ts`) unchanged. Build a new, simpler R3F rendering component (`PlaygroundPlateGrid`) that drops the lift-mode/toggle-demo branching `KineticPlateGrid` needs and is dissolve-only, one-directional, and touch-aware. Wrap it in an outer DOM layer (`PlaygroundFacade`) that manages the pointer-events handoff — full-viewport and interactive while covering, click-through once dissolved — independently of the R3F scene's own internals. The real page content (`PlaygroundCardGrid`) renders through the site's standard `AppChrome` chrome (Nav/Footer) exactly like any other page.

**Tech Stack:** Next.js App Router, React Three Fiber (already a dependency from `/kinetic-facade`), existing design-token system (`design-system/`).

## Global Constraints

- New route at `/playground`. Facade is a `fixed inset-0` full-viewport overlay; page content underneath uses the site's standard `AppChrome` treatment (Nav + Footer) and the existing `w-[86%] max-w-[1008px] mx-auto` container convention (no shared container component exists in this codebase — this follows the established copy-per-file pattern, not a new abstraction).
- Desktop: `pointermove`-driven continuous wind-field peek + `pointerdown`-driven dissolve-out ripple — both reused as-is from the existing physics modules.
- Mobile: touch drag drives the same wind-field peek (touch already delivers `pointermove`/`pointerdown` via the unified Pointer Events API in modern browsers — verified, not assumed, in Task 3); `pointerActive` tracking additionally listens for `touchmove`/`touchend`/`touchcancel` since touch has no hover-equivalent leave event.
- Dissolve is **one-directional** for this pass: first click/tap triggers it, further clicks/taps do nothing. No reform.
- Once dissolved (2200ms after the trigger — comfortably past the dissolve's practical settle time), the facade's wrapper div switches to `pointer-events: none`, making Nav/Footer/card-grid normally interactive.
- Card grid is placeholder content only: 6 cards, white rounded rectangles (`bg-surface-card`) with a title/date row beneath each (not inside), on a new dark page background (`#0a0a0a`, wired as a proper design token, not a hardcoded hex in a component).
- `/kinetic-facade` (the existing prototype route) is not modified by this plan.
- No hex colors hardcoded in new components — use existing tokens (`bg-surface-card`, `text-ink`, `text-muted`) and the new `bg-surface-playground`/`PLAYGROUND_PAGE_BG` token added in Task 1.
- An accessibility bypass for keyboard-only/reduced-motion users who can't trigger a mouse/touch dissolve is explicitly out of scope for this plan (flagged during design, deliberately deferred).
- No automated test suite exists in this repo (confirmed during the original kinetic-facade work) — every task below is verified by running the dev server and checking behavior in the browser.

---

## Task 1: Design token + page shell with placeholder card grid

**Files:**
- Modify: `design-system/tokens/primitives.css`
- Modify: `design-system/tokens/semantic.css`
- Modify: `design-system/theme.css`
- Modify: `design-system/layout.ts`
- Modify: `design-system/index.ts`
- Modify: `app/components/AppChrome.tsx`
- Create: `app/playground/page.tsx`
- Create: `app/playground/PlaygroundCardGrid.tsx`

**Interfaces:**
- Produces: `PLAYGROUND_PAGE_BG` (string, CSS `var()` reference) exported from `design-system` for use in Task 2 if needed; `bg-surface-playground` Tailwind utility class.
- Produces: `<PlaygroundCardGrid />` component (no props), rendered by `app/playground/page.tsx`.

- [ ] **Step 1: Add the `surface-playground` design token (primitive → semantic → Tailwind)**

In `design-system/tokens/primitives.css`, inside the `/* Surfaces */` block (after `--ds-color-surface-chip: #f3f5f6;`):

```css
  --ds-color-surface-playground: #0a0a0a;
```

In `design-system/tokens/semantic.css`, after the line `--ds-surface-chip: var(--ds-color-surface-chip);`:

```css
  --ds-surface-playground: var(--ds-color-surface-playground);
```

In `design-system/theme.css`, after the line `--color-surface-chip: var(--ds-surface-chip);`:

```css
  --color-surface-playground: var(--ds-surface-playground);
```

- [ ] **Step 2: Export `PLAYGROUND_PAGE_BG` from the design system**

In `design-system/layout.ts`, after the `HOME_V2_PAGE_BG` export:

```ts
/** Playground page surface. */
export const PLAYGROUND_PAGE_BG = "var(--ds-surface-playground)";
```

In `design-system/index.ts`, change:

```ts
export {
  CASE_STUDY_PAGE_BG,
  CASE_STUDY_CHROME_BG,
  SITE_DEFAULT_PAGE_BG,
  HOME_V2_PAGE_BG,
  CASE_STUDY_COLUMN_CLASS,
```

to:

```ts
export {
  CASE_STUDY_PAGE_BG,
  CASE_STUDY_CHROME_BG,
  SITE_DEFAULT_PAGE_BG,
  HOME_V2_PAGE_BG,
  PLAYGROUND_PAGE_BG,
  CASE_STUDY_COLUMN_CLASS,
```

- [ ] **Step 3: Wire the Playground body background into `AppChrome`**

In `app/components/AppChrome.tsx`, change the import:

```tsx
import { HOME_V2_PAGE_BG, SITE_DEFAULT_PAGE_BG } from "@/design-system";
```

to:

```tsx
import { HOME_V2_PAGE_BG, PLAYGROUND_PAGE_BG, SITE_DEFAULT_PAGE_BG } from "@/design-system";
```

Add a route flag next to the other `isX`/`bareX` consts (after the `isCaseStudy` line):

```tsx
  const isCaseStudy = pathname ? isCaseStudyPath(pathname) : false;
  const isPlayground =
    pathname === "/playground" || pathname.startsWith("/playground/");
```

Change the body-background effect from:

```tsx
  useEffect(() => {
    if (isBarePage) return;

    if (isHomeV2) {
      document.body.style.backgroundColor = HOME_V2_PAGE_BG;
    } else if (isCaseStudy) {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
    }

    return () => {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
    };
  }, [isBarePage, isCaseStudy, isHomeV2]);
```

to:

```tsx
  useEffect(() => {
    if (isBarePage) return;

    if (isHomeV2) {
      document.body.style.backgroundColor = HOME_V2_PAGE_BG;
    } else if (isCaseStudy) {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
    } else if (isPlayground) {
      document.body.style.backgroundColor = PLAYGROUND_PAGE_BG;
    }

    return () => {
      document.body.style.backgroundColor = SITE_DEFAULT_PAGE_BG;
    };
  }, [isBarePage, isCaseStudy, isHomeV2, isPlayground]);
```

Do not add `/playground` to `isBarePage` — this route keeps Nav/Footer, just visually covered by the facade until dissolved.

- [ ] **Step 4: Create the placeholder card grid**

`app/playground/PlaygroundCardGrid.tsx`:

```tsx
type PlaceholderCard = {
  id: string;
  title: string;
  date: string;
};

const PLACEHOLDER_CARDS: PlaceholderCard[] = [
  { id: "card-1", title: "Experiment One", date: "01 Jan 26" },
  { id: "card-2", title: "Experiment Two", date: "02 Jan 26" },
  { id: "card-3", title: "Experiment Three", date: "03 Jan 26" },
  { id: "card-4", title: "Experiment Four", date: "04 Jan 26" },
  { id: "card-5", title: "Experiment Five", date: "05 Jan 26" },
  { id: "card-6", title: "Experiment Six", date: "06 Jan 26" },
];

export function PlaygroundCardGrid() {
  return (
    <div className="relative z-[1] mx-auto w-[86%] max-w-[1008px] pt-[32px] pb-[96px] xl:pt-[72px]">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 tablet:grid-cols-2">
        {PLACEHOLDER_CARDS.map((card) => (
          <div key={card.id} className="flex flex-col gap-3">
            <div className="aspect-square w-full rounded-2xl bg-surface-card" />
            <div className="flex items-baseline justify-between">
              <span className="text-ink">{card.title}</span>
              <span className="text-muted text-sm">{card.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create the route entry**

`app/playground/page.tsx`:

```tsx
import { PlaygroundCardGrid } from "./PlaygroundCardGrid";

export default function PlaygroundPage() {
  return <PlaygroundCardGrid />;
}
```

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/playground`. Expected:
- Page background is solid black (`#0a0a0a`), not the site's default off-white.
- Nav renders at the top (LinkedIn/email/resume links), Footer at the bottom — check whether their text/icons are legible against black. If not, note it as a finding (do not attempt to fix Nav/Footer styling in this plan — that's a separate, out-of-scope change) but do not treat it as blocking Task 1.
- 6 placeholder cards render in a grid: 1 column on narrow viewports, 2 columns from the `tablet` breakpoint (744px) up, each a plain rounded off-white square with a title and date beneath it.
- No console errors.

- [ ] **Step 7: Commit**

```bash
git add design-system/tokens/primitives.css design-system/tokens/semantic.css design-system/theme.css design-system/layout.ts design-system/index.ts app/components/AppChrome.tsx app/playground
git commit -m "feat(playground): add page shell with placeholder card grid"
```

---

## Task 2: Facade overlay — dissolve-only physics, pointer-events handoff

**Files:**
- Create: `app/playground/PlaygroundPlateGrid.tsx`
- Create: `app/playground/PlaygroundFacadeScene.tsx`
- Create: `app/playground/PlaygroundFacade.tsx`
- Create: `app/playground/PlaygroundApp.tsx`
- Modify: `app/playground/page.tsx`

**Interfaces:**
- Consumes: `buildPlateGrid`, `DEFAULT_GRID_CONFIG` from `app/kinetic-facade/plateGrid.ts`; `stepPendulum`, `type PlateSwingState` from `app/kinetic-facade/pendulumPhysics.ts`; `computeWindTorque` from `app/kinetic-facade/windField.ts`; `createRipple`, `hasRippleReachedPlate`, `isRippleExpired`, `type Ripple` from `app/kinetic-facade/ripplePhysics.ts`; `stepDissolve`, `type DissolveState` from `app/kinetic-facade/dissolvePhysics.ts`; `buildDissolvePoints` from `app/kinetic-facade/dissolvePoints.ts`; `MATERIAL_VARIANTS` from `app/kinetic-facade/materialVariants.ts`. None of these are modified — read-only reuse.
- Produces: `<PlaygroundApp />` (no props) — the new default export rendered by `page.tsx`.

- [ ] **Step 1: Create the dissolve-only, touch-aware plate grid**

`app/playground/PlaygroundPlateGrid.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  type MeshPhysicalMaterial,
  type Object3D,
  Plane,
  type PointsMaterial,
  Vector3,
} from "three";
import { buildPlateGrid, DEFAULT_GRID_CONFIG } from "@/app/kinetic-facade/plateGrid";
import {
  stepPendulum,
  type PlateSwingState,
} from "@/app/kinetic-facade/pendulumPhysics";
import { computeWindTorque } from "@/app/kinetic-facade/windField";
import {
  createRipple,
  hasRippleReachedPlate,
  isRippleExpired,
  type Ripple,
} from "@/app/kinetic-facade/ripplePhysics";
import {
  stepDissolve,
  type DissolveState,
} from "@/app/kinetic-facade/dissolvePhysics";
import { buildDissolvePoints } from "@/app/kinetic-facade/dissolvePoints";
import { MATERIAL_VARIANTS } from "@/app/kinetic-facade/materialVariants";

type PlaygroundPlateGridProps = {
  reducedMotion: boolean;
};

const VARIANT = MATERIAL_VARIANTS.copperDissolve;

export function PlaygroundPlateGrid({ reducedMotion }: PlaygroundPlateGridProps) {
  const { gl, viewport } = useThree();

  const columns = useMemo(
    () =>
      Math.ceil(
        viewport.width / (DEFAULT_GRID_CONFIG.plateWidth + DEFAULT_GRID_CONFIG.gapX),
      ),
    [viewport.width],
  );
  const plates = useMemo(
    () => buildPlateGrid({ ...DEFAULT_GRID_CONFIG, columns }),
    [columns],
  );
  const swingStates = useRef<PlateSwingState[]>(
    plates.map(() => ({ angle: 0, angularVelocity: 0, targetAngle: 0 })),
  );
  const dissolveStates = useRef<DissolveState[]>(
    plates.map(() => ({ progress: 0, target: 0 })),
  );
  const groupRefs = useRef<(Group | null)[]>([]);
  const meshMaterialRefs = useRef<(MeshPhysicalMaterial | null)[]>([]);
  const pointsRefs = useRef<(Object3D | null)[]>([]);
  const pointsMaterialRefs = useRef<(PointsMaterial | null)[]>([]);
  const plane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);
  const pointerWorld = useRef(new Vector3());
  const clickWorld = useRef(new Vector3());
  const pointerActive = useRef(false);
  const wasReducedMotion = useRef(false);
  const prevPlateCount = useRef(plates.length);
  const ripples = useRef<Ripple[]>([]);
  const pendingClick = useRef(false);
  const active = useRef(false);

  const dissolveGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = buildDissolvePoints(
      DEFAULT_GRID_CONFIG.plateWidth * 2.5,
      DEFAULT_GRID_CONFIG.plateHeight * 2.5,
      40,
    );
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useEffect(() => {
    if (plates.length !== prevPlateCount.current) {
      swingStates.current = plates.map(() => ({
        angle: 0,
        angularVelocity: 0,
        targetAngle: 0,
      }));
      dissolveStates.current = plates.map(() => ({ progress: 0, target: 0 }));
      groupRefs.current = groupRefs.current.slice(0, plates.length);
      meshMaterialRefs.current = meshMaterialRefs.current.slice(0, plates.length);
      pointsRefs.current = pointsRefs.current.slice(0, plates.length);
      pointsMaterialRefs.current = pointsMaterialRefs.current.slice(0, plates.length);
      ripples.current = [];
      prevPlateCount.current = plates.length;
    }
  }, [plates]);

  useEffect(() => {
    const el = gl.domElement;
    const enter = () => {
      pointerActive.current = true;
    };
    const leave = () => {
      pointerActive.current = false;
    };
    const down = () => {
      if (active.current) return;
      pendingClick.current = true;
    };
    const touchMove = () => {
      pointerActive.current = true;
    };
    const touchEnd = () => {
      pointerActive.current = false;
    };
    el.addEventListener("pointermove", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("touchmove", touchMove, { passive: true });
    el.addEventListener("touchend", touchEnd);
    el.addEventListener("touchcancel", touchEnd);
    return () => {
      el.removeEventListener("pointermove", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("touchmove", touchMove);
      el.removeEventListener("touchend", touchEnd);
      el.removeEventListener("touchcancel", touchEnd);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (reducedMotion) {
      if (!wasReducedMotion.current) {
        swingStates.current = plates.map(() => ({
          angle: 0,
          angularVelocity: 0,
          targetAngle: 0,
        }));
        dissolveStates.current = plates.map(() => ({ progress: 0, target: 0 }));
        groupRefs.current.forEach((group) => {
          if (group) group.rotation.x = 0;
        });
        meshMaterialRefs.current.forEach((material) => {
          if (material) material.opacity = 1;
        });
        pointsMaterialRefs.current.forEach((material) => {
          if (material) material.opacity = 0;
        });
        pointsRefs.current.forEach((points) => {
          if (points) points.scale.setScalar(1);
        });
        active.current = false;
        wasReducedMotion.current = true;
      }
      return;
    }
    wasReducedMotion.current = false;

    let pointer: { x: number; y: number } | null = null;
    if (pointerActive.current) {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const hit = state.raycaster.ray.intersectPlane(plane, pointerWorld.current);
      pointer = hit
        ? { x: pointerWorld.current.x, y: pointerWorld.current.y }
        : null;
    }

    if (pendingClick.current) {
      pendingClick.current = false;
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const clickHit = state.raycaster.ray.intersectPlane(plane, clickWorld.current);
      if (clickHit && !active.current) {
        active.current = true;
        ripples.current.push(
          createRipple(
            clickWorld.current.x,
            clickWorld.current.y,
            state.clock.elapsedTime,
            plates.length,
            true,
          ),
        );
      }
    }

    const elapsedTime = state.clock.elapsedTime;
    const stableDelta = Math.min(delta, 1 / 30);

    plates.forEach((plate, index) => {
      const windTorque = computeWindTorque({ x: plate.x, y: plate.y }, pointer);

      let dissolveState = dissolveStates.current[index];
      for (const ripple of ripples.current) {
        if (!ripple.hit[index] && hasRippleReachedPlate(ripple, plate, elapsedTime)) {
          dissolveState = { progress: dissolveState.progress, target: 1 };
          ripple.hit[index] = 1;
        }
      }

      const nextState = stepPendulum(swingStates.current[index], windTorque, stableDelta);
      swingStates.current[index] = nextState;

      const group = groupRefs.current[index];
      if (group) group.rotation.x = nextState.angle;

      const nextDissolve = stepDissolve(dissolveState, stableDelta);
      dissolveStates.current[index] = nextDissolve;

      const meshMaterial = meshMaterialRefs.current[index];
      if (meshMaterial) meshMaterial.opacity = 1 - nextDissolve.progress;

      const pointsMaterial = pointsMaterialRefs.current[index];
      if (pointsMaterial) pointsMaterial.opacity = Math.sin(nextDissolve.progress * Math.PI);

      const points = pointsRefs.current[index];
      if (points) points.scale.setScalar(1 + nextDissolve.progress * 1.5);
    });

    if (ripples.current.length > 0) {
      ripples.current = ripples.current.filter(
        (ripple) => !isRippleExpired(ripple, elapsedTime),
      );
    }
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
              ref={(el) => {
                meshMaterialRefs.current[index] = el;
              }}
              color={VARIANT.color}
              metalness={VARIANT.metalness}
              roughness={VARIANT.roughness}
              transparent
            />
          </mesh>
          <points
            ref={(el) => {
              pointsRefs.current[index] = el;
            }}
            position={[0, -plate.height / 2, 0]}
            geometry={dissolveGeometry}
          >
            <pointsMaterial
              ref={(el) => {
                pointsMaterialRefs.current[index] = el;
              }}
              color={VARIANT.color}
              size={0.06}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </points>
        </group>
      ))}
    </>
  );
}
```

- [ ] **Step 2: Create the scene wrapper**

`app/playground/PlaygroundFacadeScene.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { PlaygroundPlateGrid } from "./PlaygroundPlateGrid";
import { MATERIAL_VARIANTS } from "@/app/kinetic-facade/materialVariants";

type PlaygroundFacadeSceneProps = {
  reducedMotion: boolean;
};

export function PlaygroundFacadeScene({ reducedMotion }: PlaygroundFacadeSceneProps) {
  const environmentPreset = MATERIAL_VARIANTS.copperDissolve.environmentPreset;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Environment preset={environmentPreset} environmentRotation={[0, Math.PI, 0]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 8, 6]} intensity={2.5} />
      <PlaygroundPlateGrid reducedMotion={reducedMotion} />
    </Canvas>
  );
}
```

- [ ] **Step 3: Create the pointer-events handoff wrapper**

`app/playground/PlaygroundFacade.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import { PlaygroundFacadeScene } from "./PlaygroundFacadeScene";

const DISSOLVE_SETTLE_MS = 2200;

type PlaygroundFacadeProps = {
  reducedMotion: boolean;
};

export function PlaygroundFacade({ reducedMotion }: PlaygroundFacadeProps) {
  const [dissolved, setDissolved] = useState(false);
  const hasTriggered = useRef(false);

  const handleTrigger = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    window.setTimeout(() => setDissolved(true), DISSOLVE_SETTLE_MS);
  };

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: dissolved ? "none" : "auto" }}
      onPointerDown={handleTrigger}
    >
      <PlaygroundFacadeScene reducedMotion={reducedMotion} />
    </div>
  );
}
```

- [ ] **Step 4: Create the top-level app component and wire it into the route**

`app/playground/PlaygroundApp.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { PlaygroundCardGrid } from "./PlaygroundCardGrid";
import { PlaygroundFacade } from "./PlaygroundFacade";

export function PlaygroundApp() {
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

  return (
    <>
      <PlaygroundCardGrid />
      <PlaygroundFacade reducedMotion={reducedMotion} />
    </>
  );
}
```

Replace `app/playground/page.tsx` with:

```tsx
import { PlaygroundApp } from "./PlaygroundApp";

export default function PlaygroundPage() {
  return <PlaygroundApp />;
}
```

- [ ] **Step 5: Verify in browser**

Reload `http://localhost:3000/playground`. Expected:
- On load, the facade (copper plate grid) fills the entire viewport — Nav, Footer, and the card grid underneath are completely covered/invisible.
- Moving the cursor over the facade causes nearby plates to sway (the wind-field peek), same feel as the `/kinetic-facade` Dissolve variant.
- Clicking anywhere on the facade triggers the dissolve-out ripple: plates near the click fade into dust and disappear first, with the effect sweeping outward.
- Clicking again during or after the dissolve does nothing new (no second ripple, no re-toggle).
- About 2.2 seconds after the click, the facade stops blocking the page: hovering/clicking Nav links and the card grid now works normally, and the (now fully invisible) facade no longer intercepts any pointer events. Confirm by clicking a Nav link (e.g. Resume) after this point and confirming navigation occurs.
- No console errors throughout.

- [ ] **Step 6: Commit**

```bash
git add app/playground
git commit -m "feat(playground): add dissolve-only facade overlay with click-through handoff"
```

---

## Task 3: Mobile/touch verification

**Files:** none expected — verification pass. If a real gap is found, fix in `app/playground/PlaygroundPlateGrid.tsx` or `app/playground/PlaygroundFacade.tsx` as appropriate and re-verify.

- [ ] **Step 1: Verify touch behavior in a mobile-emulated viewport**

Resize the browser viewport to a mobile preset (e.g. 375×812) with touch emulation enabled, and reload `http://localhost:3000/playground`. Expected:
- Facade still fills the entire viewport on load, same as desktop.
- Dragging a finger across the facade causes nearby plates to sway, following the touch position the same way desktop hover does — confirm the effect tracks the drag continuously, not just a one-time reaction to touch-start.
- Lifting the finger settles the swaying plates back down (equivalent to desktop's cursor leaving the canvas) rather than leaving them stuck mid-sway.
- Tapping the facade triggers the same dissolve-out ripple as desktop's click.
- About 2.2 seconds after the tap, the facade becomes non-blocking and the card grid/Nav underneath are tappable normally.
- No console errors.

- [ ] **Step 2: Fix any gap found**

If dragging doesn't produce continuous tracking (e.g. only registers at touch-start), or if lifting the finger doesn't clear the sway (plates stay deflected), the most likely cause is the browser treating the drag as a page-scroll gesture instead of feeding it to the canvas's pointer-event handling. If so, add `touch-action: none` to the facade wrapper in `app/playground/PlaygroundFacade.tsx`:

```tsx
    <div
      className="fixed inset-0 z-[100] touch-none"
      style={{ pointerEvents: dissolved ? "none" : "auto" }}
      onPointerDown={handleTrigger}
    >
```

(`touch-none` is Tailwind's utility for `touch-action: none`.) Re-run Step 1 after any fix.

- [ ] **Step 3: Commit if a fix was needed**

```bash
git add app/playground
git commit -m "fix(playground): prevent touch-drag from scrolling the page instead of driving the facade"
```

(Skip this commit if Step 1 passed clean with no changes.)

---

## Task 4: Final verification pass

**Files:** none — verification only.

- [ ] **Step 1: Run the full spec checklist**

With `npm run dev` running and `http://localhost:3000/playground` open:
- Desktop: hover-peek and click-to-dissolve both work as described in Task 2's verification.
- Mobile-emulated: drag-to-peek and tap-to-dissolve both work as described in Task 3's verification.
- Page background is `#0a0a0a`; card grid is 6 placeholder cards, 1 column narrow / 2 columns from `tablet` (744px) up.
- `reducedMotion` (OS-level or forced via DevTools `matchMedia` override): facade plates render static, no swing animation, and clicking still triggers dissolve (the dissolve mechanic isn't gated by reduced motion — only the continuous wind-sway is).
- `/kinetic-facade` still works exactly as before (Steel/Copper/Dissolve toggle, all three variants) — confirms this plan didn't regress the existing prototype route.
- No console errors anywhere in the above.

- [ ] **Step 2: Fix any issues found**

Fix in the relevant file and re-run Step 1.

- [ ] **Step 3: Commit if any fixes were made**

```bash
git add app/playground app/kinetic-facade
git commit -m "fix(playground): address issues found in final verification pass"
```

(Skip this commit if Step 1 passed clean with no changes.)
