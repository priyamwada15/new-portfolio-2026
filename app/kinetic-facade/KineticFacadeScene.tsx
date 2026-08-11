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
