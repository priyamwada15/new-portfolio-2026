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
