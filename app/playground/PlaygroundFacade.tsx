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
      className="fixed inset-0 z-[100] touch-none bg-surface-playground"
      role="button"
      tabIndex={0}
      aria-label="Reveal the Playground page"
      onPointerDown={handleTrigger}
      onKeyDown={handleKeyDown}
    >
      <PlaygroundFacadeScene
        reducedMotion={reducedMotion}
        keyboardTriggerCount={keyboardTriggerCount}
        dissolved={false}
      />
    </div>
  );
}
