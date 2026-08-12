"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  const pointerActive = useRef(false);
  const wasReducedMotion = useRef(false);
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const enter = () => {
      pointerActive.current = true;
    };
    const leave = () => {
      pointerActive.current = false;
    };
    el.addEventListener("pointermove", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (reducedMotion) {
      if (!wasReducedMotion.current) {
        swingStates.current = plates.map(() => ({
          angle: 0,
          angularVelocity: 0,
        }));
        groupRefs.current.forEach((group) => {
          if (group) {
            group.rotation.x = 0;
          }
        });
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
