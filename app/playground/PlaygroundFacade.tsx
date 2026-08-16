"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PlaygroundFacadeScene } from "./PlaygroundFacadeScene";

const DISSOLVE_SETTLE_MS = 2200;

type PlaygroundFacadeProps = {
  reducedMotion: boolean;
  onDissolve: () => void;
};

export function PlaygroundFacade({ reducedMotion, onDissolve }: PlaygroundFacadeProps) {
  const [keyboardTriggerCount, setKeyboardTriggerCount] = useState(0);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const hasTriggered = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const handleTrigger = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      onDissolve();
    }, DISSOLVE_SETTLE_MS);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setKeyboardTriggerCount((count) => count + 1);
    handleTrigger();
  };

  // A resize mid-dissolve can change the plate grid's column/row count,
  // which resets the in-progress dissolve back to opaque (see
  // PlaygroundPlateGrid's plates.length effect). If that happens after this
  // component already scheduled its settle timeout, the stale timeout would
  // still fire and flip the page over even though the plates reset to
  // opaque, permanently stranding the page. Cancel the pending timeout and
  // allow a fresh trigger on any resize while a dissolve is unsettled.
  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      hasTriggered.current = false;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] touch-none"
      role="button"
      tabIndex={0}
      aria-label="Reveal the Playground page"
      onPointerDown={handleTrigger}
      onKeyDown={handleKeyDown}
    >
      <PlaygroundFacadeScene
        reducedMotion={reducedMotion}
        keyboardTriggerCount={keyboardTriggerCount}
        onLoaded={() => setSceneLoaded(true)}
      />
      {/* Opaque cover so the real page never flashes visible before the
          3D scene (HDRI + plates) has actually loaded. Separate from the
          Canvas itself so the Canvas's own transparency — the gaps between
          plates that the hover peek effect relies on — isn't blocked once
          the scene is ready.
          Inline pointerEvents (not just the Tailwind class) because
          Playground's flip-board footer layer applies a global
          `.site-scroll-layer__sheet-body *` rule forcing pointer-events:
          auto on every descendant, which otherwise outranks the single-class
          `pointer-events-none` utility on specificity and silently makes
          this "invisible" cover intercept every pointer event meant for the
          canvas beneath it — killing cursor-lift and click-to-dissolve. */}
      <div
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
        className={`absolute inset-0 bg-surface-playground transition-opacity duration-300 ${
          sceneLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
