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
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Environment
        preset={variant.environmentPreset}
        environmentRotation={[0, Math.PI, 0]}
      />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 8, 6]} intensity={1.2} />
      <KineticPlateGrid variant={variant} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
