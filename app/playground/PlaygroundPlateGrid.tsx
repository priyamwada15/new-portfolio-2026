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
  keyboardTriggerCount: number;
};

const VARIANT = MATERIAL_VARIANTS.copperDissolve;

export function PlaygroundPlateGrid({
  reducedMotion,
  keyboardTriggerCount,
}: PlaygroundPlateGridProps) {
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
  const pendingKeyboardTrigger = useRef(false);
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

  useEffect(() => {
    if (keyboardTriggerCount > 0) {
      pendingKeyboardTrigger.current = true;
    }
  }, [keyboardTriggerCount]);

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
        pendingKeyboardTrigger.current = false;
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

    if (pendingKeyboardTrigger.current) {
      pendingKeyboardTrigger.current = false;
      if (!active.current) {
        active.current = true;
        ripples.current.push(
          createRipple(0, 0, state.clock.elapsedTime, plates.length, true),
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
