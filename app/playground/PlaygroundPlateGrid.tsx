"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshPhysicalMaterial,
  type Object3D,
  Plane,
  type PointsMaterial,
  Vector3,
} from "three";
import {
  buildGapFillers,
  buildPlateGrid,
  DEFAULT_GRID_CONFIG,
  MAX_GRID_COLUMNS,
  MAX_GRID_ROWS,
  resolveGridAxis,
} from "@/app/kinetic-facade/plateGrid";
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
  keyboardTriggerCount: number;
};

const VARIANT = MATERIAL_VARIANTS.copperDissolve;

// Any deviation past this (radians) counts as "lifted" for seam-filler
// fading — small enough that even a slight hover-driven sway hides the
// adjacent fillers, matching the "even the slightest lift" requirement.
const FILLER_LIFT_ANGLE_THRESHOLD = 0.01;
// Faster than the plate dissolve's own fade rate (2) so filler opacity
// doesn't visibly lag behind the quick wind-driven sway it's reacting to.
const FILLER_FADE_PARAMS = { rate: 6 };

export function PlaygroundPlateGrid({
  reducedMotion,
  keyboardTriggerCount,
}: PlaygroundPlateGridProps) {
  const { gl, viewport } = useThree();

  const { count: columns, scale: widthScale } = useMemo(
    () =>
      resolveGridAxis(
        viewport.width,
        DEFAULT_GRID_CONFIG.plateWidth,
        DEFAULT_GRID_CONFIG.gapX,
        MAX_GRID_COLUMNS,
      ),
    [viewport.width],
  );
  const { count: rows, scale: heightScale } = useMemo(
    () =>
      resolveGridAxis(
        viewport.height,
        DEFAULT_GRID_CONFIG.plateHeight,
        DEFAULT_GRID_CONFIG.gapY,
        MAX_GRID_ROWS,
      ),
    [viewport.height],
  );
  const gridConfig = useMemo(
    () => ({
      columns,
      rows,
      plateWidth: DEFAULT_GRID_CONFIG.plateWidth * widthScale,
      plateHeight: DEFAULT_GRID_CONFIG.plateHeight * heightScale,
      gapX: DEFAULT_GRID_CONFIG.gapX * widthScale,
      gapY: DEFAULT_GRID_CONFIG.gapY * heightScale,
    }),
    [columns, rows, widthScale, heightScale],
  );
  const plates = useMemo(() => buildPlateGrid(gridConfig), [gridConfig]);
  const gapFillers = useMemo(() => buildGapFillers(gridConfig), [gridConfig]);
  const swingStates = useRef<PlateSwingState[]>(
    plates.map(() => ({ angle: 0, angularVelocity: 0, targetAngle: 0 })),
  );
  const dissolveStates = useRef<DissolveState[]>(
    plates.map(() => ({ progress: 0, target: 0 })),
  );
  const fillerOpacityStates = useRef<DissolveState[]>(
    gapFillers.map(() => ({ progress: 1, target: 1 })),
  );
  const groupRefs = useRef<(Group | null)[]>([]);
  const fillerRefs = useRef<(Mesh | null)[]>([]);
  const fillerMaterialRefs = useRef<(MeshBasicMaterial | null)[]>([]);
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
  const pendingKeyboardTrigger = useRef(false);
  const active = useRef(false);

  const dissolveGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = buildDissolvePoints(
      gridConfig.plateWidth * 2.5,
      gridConfig.plateHeight * 2.5,
      40,
    );
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, [gridConfig]);

  const plateGeometry = useMemo(
    () => new BoxGeometry(gridConfig.plateWidth, gridConfig.plateHeight, 0.03),
    [gridConfig],
  );

  useEffect(() => {
    if (plates.length !== prevPlateCount.current) {
      swingStates.current = plates.map(() => ({
        angle: 0,
        angularVelocity: 0,
        targetAngle: 0,
      }));
      dissolveStates.current = plates.map(() => ({ progress: 0, target: 0 }));
      fillerOpacityStates.current = gapFillers.map(() => ({ progress: 1, target: 1 }));
      groupRefs.current = groupRefs.current.slice(0, plates.length);
      meshMaterialRefs.current = meshMaterialRefs.current.slice(0, plates.length);
      pointsRefs.current = pointsRefs.current.slice(0, plates.length);
      pointsMaterialRefs.current = pointsMaterialRefs.current.slice(0, plates.length);
      fillerRefs.current = fillerRefs.current.slice(0, gapFillers.length);
      fillerMaterialRefs.current = fillerMaterialRefs.current.slice(0, gapFillers.length);
      ripples.current = [];
      active.current = false;
      prevPlateCount.current = plates.length;
    }
  }, [plates, gapFillers]);

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

  useEffect(() => {
    if (keyboardTriggerCount > 0) {
      pendingKeyboardTrigger.current = true;
    }
  }, [keyboardTriggerCount]);

  // Gap fillers only need to hide the tiny resting-state seams; once the
  // dissolve reveals the real page behind, a lingering grid of seam lines
  // over that page would look like a stray artifact. There's no reform in
  // this build, so this only ever needs to fire once, but it's written the
  // same way as the kinetic-facade prototype's toggleable version for
  // consistency.
  const hideFillers = () => {
    fillerRefs.current.forEach((mesh) => {
      if (mesh) mesh.visible = false;
    });
  };

  useFrame((state, delta) => {
    if (reducedMotion) {
      if (!wasReducedMotion.current) {
        swingStates.current = plates.map(() => ({
          angle: 0,
          angularVelocity: 0,
          targetAngle: 0,
        }));
        groupRefs.current.forEach((group) => {
          if (group) group.rotation.x = 0;
        });
        wasReducedMotion.current = true;
      }
    } else {
      wasReducedMotion.current = false;
    }

    let pointer: { x: number; y: number } | null = null;
    if (!reducedMotion && pointerActive.current) {
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
        hideFillers();
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

    if (pendingKeyboardTrigger.current) {
      pendingKeyboardTrigger.current = false;
      if (!active.current) {
        active.current = true;
        hideFillers();
        ripples.current.push(
          createRipple(0, 0, state.clock.elapsedTime, plates.length, true),
        );
      }
    }

    const elapsedTime = state.clock.elapsedTime;
    const stableDelta = Math.min(delta, 1 / 30);

    plates.forEach((plate, index) => {
      let dissolveState = dissolveStates.current[index];
      for (const ripple of ripples.current) {
        if (!ripple.hit[index] && hasRippleReachedPlate(ripple, plate, elapsedTime)) {
          dissolveState = { progress: dissolveState.progress, target: 1 };
          ripple.hit[index] = 1;
        }
      }

      if (!reducedMotion) {
        const windTorque = computeWindTorque({ x: plate.x, y: plate.y }, pointer);
        const nextState = stepPendulum(swingStates.current[index], windTorque, stableDelta);
        swingStates.current[index] = nextState;

        const group = groupRefs.current[index];
        if (group) group.rotation.x = nextState.angle;
      }

      const nextDissolve = stepDissolve(dissolveState, stableDelta);
      dissolveStates.current[index] = nextDissolve;

      const meshMaterial = meshMaterialRefs.current[index];
      if (meshMaterial) meshMaterial.opacity = 1 - nextDissolve.progress;

      const pointsMaterial = pointsMaterialRefs.current[index];
      if (pointsMaterial) pointsMaterial.opacity = Math.sin(nextDissolve.progress * Math.PI);

      const points = pointsRefs.current[index];
      if (points) points.scale.setScalar(1 + nextDissolve.progress * 1.5);
    });

    // Fade each seam filler out the moment either plate it sits between
    // sways off rest by more than a hair, and back in once both settle —
    // otherwise the fillers read as bars sitting on top of the page once a
    // plate lifts far enough to expose them against the revealed content.
    gapFillers.forEach((filler, index) => {
      const angleA = Math.abs(swingStates.current[filler.plateIndexA].angle);
      const angleB = Math.abs(swingStates.current[filler.plateIndexB].angle);
      const isLifted =
        angleA > FILLER_LIFT_ANGLE_THRESHOLD || angleB > FILLER_LIFT_ANGLE_THRESHOLD;

      const nextOpacity = stepDissolve(
        { progress: fillerOpacityStates.current[index].progress, target: isLifted ? 0 : 1 },
        stableDelta,
        FILLER_FADE_PARAMS,
      );
      fillerOpacityStates.current[index] = nextOpacity;

      const fillerMaterial = fillerMaterialRefs.current[index];
      if (fillerMaterial) {
        fillerMaterial.opacity = nextOpacity.progress;
      }
    });

    if (ripples.current.length > 0) {
      ripples.current = ripples.current.filter(
        (ripple) => !isRippleExpired(ripple, elapsedTime),
      );
    }
  });

  return (
    <>
      {gapFillers.map((filler, index) => (
        <mesh
          key={filler.id}
          ref={(el) => {
            fillerRefs.current[index] = el;
          }}
          position={[filler.x, filler.y, 0]}
        >
          <planeGeometry args={[filler.width, filler.height]} />
          <meshBasicMaterial
            ref={(el) => {
              fillerMaterialRefs.current[index] = el;
            }}
            color="#0a0a0a"
            transparent
            opacity={1}
          />
        </mesh>
      ))}
      {plates.map((plate, index) => (
        <group
          key={plate.id}
          ref={(el) => {
            groupRefs.current[index] = el;
          }}
          position={[plate.x, plate.y + plate.height / 2, 0]}
        >
          <mesh position={[0, -plate.height / 2, 0]} geometry={plateGeometry}>
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
