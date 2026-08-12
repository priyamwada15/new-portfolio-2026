"use client";

import { useEffect, useState } from "react";
import { PlaygroundCardGrid } from "./PlaygroundCardGrid";
import { PlaygroundFacade } from "./PlaygroundFacade";

export function PlaygroundApp() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return (
    <>
      <PlaygroundCardGrid />
      <PlaygroundFacade reducedMotion={reducedMotion} />
    </>
  );
}
