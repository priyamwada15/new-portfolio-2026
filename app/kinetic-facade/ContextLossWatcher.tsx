"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Renders as a Canvas child so it can reach `gl` via useThree(). Reports if
// the GPU drops the WebGL context mid-render — a real failure mode on
// weaker/overloaded GPUs — so the caller can show a fallback instead of a
// frozen/black canvas or a crashed tab.
export function ContextLossWatcher({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLost);
  }, [gl, onContextLost]);

  return null;
}
