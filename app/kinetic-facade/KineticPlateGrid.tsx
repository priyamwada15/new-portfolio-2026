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
import { buildPlateGrid, DEFAULT_GRID_CONFIG } from "./plateGrid";
import {
  stepPendulum,
  type PlateSwingState,
} from "./pendulumPhysics";
import { computeWindTorque } from "./windField";
import {
  createRipple,
  DEFAULT_RIPPLE_PARAMS,
  hasRippleReachedPlate,
  isRippleExpired,
  type Ripple,
} from "./ripplePhysics";
import {
  stepDissolve,
  type DissolveState,
} from "./dissolvePhysics";
import { buildDissolvePoints } from "./dissolvePoints";
import type { MaterialVariant } from "./materialVariants";

type KineticPlateGridProps = {
  variant: MaterialVariant;
  reducedMotion: boolean;
};

export function KineticPlateGrid({
  variant,
  reducedMotion,
}: KineticPlateGridProps) {
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
      active.current = false;
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
      pendingClick.current = true;
    };
    el.addEventListener("pointermove", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    return () => {
      el.removeEventListener("pointermove", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
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
          if (group) {
            group.rotation.x = 0;
          }
        });
        meshMaterialRefs.current.forEach((material) => {
          if (material) {
            material.opacity = 1;
          }
        });
        pointsMaterialRefs.current.forEach((material) => {
          if (material) {
            material.opacity = 0;
          }
        });
        pointsRefs.current.forEach((points) => {
          if (points) {
            points.scale.setScalar(1);
          }
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
      if (clickHit) {
        active.current = !active.current;

        const isReform = variant.interactionMode === "dissolve" && !active.current;
        const direction = isReform ? "inward" : "outward";
        let maxDistance = 0;
        if (isReform) {
          for (const plate of plates) {
            const dx = plate.x - clickWorld.current.x;
            const dy = plate.y - clickWorld.current.y;
            maxDistance = Math.max(maxDistance, Math.sqrt(dx * dx + dy * dy));
          }
        }

        ripples.current.push(
          createRipple(
            clickWorld.current.x,
            clickWorld.current.y,
            state.clock.elapsedTime,
            plates.length,
            active.current,
            direction,
            maxDistance,
          ),
        );
      }
    }

    const elapsedTime = state.clock.elapsedTime;
    // Cap the timestep fed into the pendulum integrator. A throttled/
    // backgrounded tab can deliver a single frame with a much larger delta
    // than normal, which destabilizes the semi-implicit Euler integration
    // (angularVelocity diverges instead of settling). Clamping keeps every
    // step well inside the integrator's stability margin.
    const stableDelta = Math.min(delta, 1 / 30);

    plates.forEach((plate, index) => {
      const windTorque = computeWindTorque({ x: plate.x, y: plate.y }, pointer);

      let plateState = swingStates.current[index];
      let dissolveState = dissolveStates.current[index];

      for (const ripple of ripples.current) {
        if (!ripple.hit[index] && hasRippleReachedPlate(ripple, plate, elapsedTime)) {
          if (variant.interactionMode === "lift") {
            plateState = {
              angle: plateState.angle,
              angularVelocity: plateState.angularVelocity,
              targetAngle: ripple.toActive ? DEFAULT_RIPPLE_PARAMS.liftAngle : 0,
            };
          } else {
            dissolveState = {
              progress: dissolveState.progress,
              target: ripple.toActive ? 1 : 0,
            };
          }
          ripple.hit[index] = 1;
        }
      }

      const nextState = stepPendulum(plateState, windTorque, stableDelta);
      swingStates.current[index] = nextState;

      const group = groupRefs.current[index];
      if (group) {
        group.rotation.x = nextState.angle;
      }

      if (variant.interactionMode === "dissolve") {
        const nextDissolve = stepDissolve(dissolveState, stableDelta);
        dissolveStates.current[index] = nextDissolve;

        const meshMaterial = meshMaterialRefs.current[index];
        if (meshMaterial) {
          meshMaterial.opacity = 1 - nextDissolve.progress;
        }

        const pointsMaterial = pointsMaterialRefs.current[index];
        if (pointsMaterial) {
          pointsMaterial.opacity = Math.sin(nextDissolve.progress * Math.PI);
        }

        const points = pointsRefs.current[index];
        if (points) {
          points.scale.setScalar(1 + nextDissolve.progress * 1.5);
        }
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
              color={variant.color}
              metalness={variant.metalness}
              roughness={variant.roughness}
              transparent={variant.interactionMode === "dissolve"}
            />
          </mesh>
          {variant.interactionMode === "dissolve" && (
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
                color={variant.color}
                size={0.06}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </points>
          )}
        </group>
      ))}
    </>
  );
}
