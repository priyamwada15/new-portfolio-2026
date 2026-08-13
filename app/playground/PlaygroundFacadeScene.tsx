"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { PlaygroundPlateGrid } from "./PlaygroundPlateGrid";
import { MATERIAL_VARIANTS } from "@/app/kinetic-facade/materialVariants";

type PlaygroundFacadeSceneProps = {
  reducedMotion: boolean;
  keyboardTriggerCount: number;
  onLoaded: () => void;
};

// Renders as a Canvas child alongside Environment/PlaygroundPlateGrid, all
// under R3F's implicit Suspense boundary — this only mounts once that
// boundary resolves, so its effect fires exactly when the scene (HDRI +
// plates) is actually ready to be seen, not just when the Canvas itself
// was created.
function SceneLoadedSignal({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);
  return null;
}

export function PlaygroundFacadeScene({
  reducedMotion,
  keyboardTriggerCount,
  onLoaded,
}: PlaygroundFacadeSceneProps) {
  const environmentPreset = MATERIAL_VARIANTS.copperDissolve.environmentPreset;

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <Environment preset={environmentPreset} environmentRotation={[0, Math.PI, 0]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 8, 6]} intensity={2.5} />
      <PlaygroundPlateGrid
        reducedMotion={reducedMotion}
        keyboardTriggerCount={keyboardTriggerCount}
      />
      <SceneLoadedSignal onLoaded={onLoaded} />
    </Canvas>
  );
}
