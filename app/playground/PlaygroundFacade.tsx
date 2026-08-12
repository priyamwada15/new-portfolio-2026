"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { PlaygroundFacadeScene } from "./PlaygroundFacadeScene";

const DISSOLVE_SETTLE_MS = 2200;

type PlaygroundFacadeProps = {
  reducedMotion: boolean;
};

export function PlaygroundFacade({ reducedMotion }: PlaygroundFacadeProps) {
  const [dissolved, setDissolved] = useState(false);
  const [keyboardTriggerCount, setKeyboardTriggerCount] = useState(0);
  const hasTriggered = useRef(false);

  const handleTrigger = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    window.setTimeout(() => setDissolved(true), DISSOLVE_SETTLE_MS);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setKeyboardTriggerCount((count) => count + 1);
    handleTrigger();
  };

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: dissolved ? "none" : "auto" }}
      role="button"
      tabIndex={dissolved ? -1 : 0}
      aria-hidden={dissolved}
      aria-label="Reveal the Playground page"
      onPointerDown={handleTrigger}
      onKeyDown={handleKeyDown}
    >
      <PlaygroundFacadeScene
        reducedMotion={reducedMotion}
        keyboardTriggerCount={keyboardTriggerCount}
        dissolved={dissolved}
      />
    </div>
  );
}
