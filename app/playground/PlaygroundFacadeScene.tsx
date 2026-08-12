"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { PlaygroundPlateGrid } from "./PlaygroundPlateGrid";
import { MATERIAL_VARIANTS } from "@/app/kinetic-facade/materialVariants";

type PlaygroundFacadeSceneProps = {
  reducedMotion: boolean;
  keyboardTriggerCount: number;
  dissolved: boolean;
};

export function PlaygroundFacadeScene({
  reducedMotion,
  keyboardTriggerCount,
  dissolved,
}: PlaygroundFacadeSceneProps) {
  const environmentPreset = MATERIAL_VARIANTS.copperDissolve.environmentPreset;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      frameloop={reducedMotion ? "demand" : "always"}
      style={{ pointerEvents: dissolved ? "none" : "auto" }}
    >
      <Environment preset={environmentPreset} environmentRotation={[0, Math.PI, 0]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 8, 6]} intensity={2.5} />
      <PlaygroundPlateGrid
        reducedMotion={reducedMotion}
        keyboardTriggerCount={keyboardTriggerCount}
      />
    </Canvas>
  );
}
