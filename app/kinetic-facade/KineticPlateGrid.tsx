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
