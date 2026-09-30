"use client";

import { useEffect, useRef } from "react";
import styles from "./HcnCube.module.css";

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;
const AXES = ["x", "y", "z"] as const;
const STEP_MS = 2200;

/**
 * Six-colored cube standing in for the HCN logo (one face per client).
 * Tumbles on a random axis every few seconds and always lands flat on a face.
 */
export function HcnCube() {
  const cubeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rotation = { x: -20, y: 30, z: 0 };
    const tumble = () => {
      if (document.hidden || !cubeRef.current) return;
      // Turn one or two random axes by a quarter or half turn
      const turns = Math.random() < 0.5 ? 1 : 2;
      const axes = [...AXES].sort(() => Math.random() - 0.5).slice(0, turns);
      for (const axis of axes) {
        const quarterTurns = Math.random() < 0.7 ? 1 : 2;
        rotation[axis] += (Math.random() < 0.5 ? -90 : 90) * quarterTurns;
      }
      cubeRef.current.style.transform =
        `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`;
    };

    const id = window.setInterval(tumble, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={styles.scene} aria-hidden="true">
      <span ref={cubeRef} className={styles.cube}>
        {FACES.map((face) => (
          <span key={face} className={`${styles.face} ${styles[face]}`} />
        ))}
      </span>
    </span>
  );
}
