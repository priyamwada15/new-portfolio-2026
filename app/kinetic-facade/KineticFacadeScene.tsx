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
      className="cursor-hover-pointer"
      camera={{ position: [0, 0, 8], fov: 50 }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Environment
        preset={variant.environmentPreset}
        environmentRotation={[0, Math.PI, 0]}
      />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 8, 6]} intensity={2.5} />
      {/* Remount when switching lift <-> dissolve: three.js compiles the plate
          shader as opaque and won't recompile when `transparent` flips, so the
          plates could never fade. A fresh grid also resets the toggle state. */}
      <KineticPlateGrid
        key={variant.interactionMode}
        variant={variant}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
