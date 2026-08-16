"use client";

import { useEffect, useState } from "react";
import { PlaygroundCardGrid, PLAYGROUND_CARD_GRID_FOCUS_ID } from "./PlaygroundCardGrid";
import { PlaygroundFacade } from "./PlaygroundFacade";

export function PlaygroundApp() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dissolved, setDissolved] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!dissolved) return;
    document.getElementById(PLAYGROUND_CARD_GRID_FOCUS_ID)?.focus({ preventScroll: true });
  }, [dissolved]);

  return (
    <>
      <PlaygroundCardGrid inert={!dissolved} />
      {!dissolved && (
        <PlaygroundFacade
          reducedMotion={reducedMotion}
          onDissolve={() => setDissolved(true)}
        />
      )}
    </>
  );
}
