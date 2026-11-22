"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import shared from "./CardDemo.module.css";

/** Demos are drawn at the card's desktop size (keep in step with CardDemo.module.css). Smaller cards scale the
 *  stage down; larger ones centre it at true size, so the UI never grows past its designed size. */
export const STAGE_W = 704;
export const STAGE_H = 520;

export type Beat<S> = { set: Partial<S>; wait: number };

/**
 * Shared behaviour for the coded demos on the homepage case study cards:
 * fitting the 704×520 stage to the card, playing the loop only while the card
 * is on screen (and resetting it when it leaves), a visitor taking over (which
 * stops the loop) and reduced motion (the final scene, no loop). The demos
 * aren't interactive: the card link sits under them and takes every click.
 *
 * Put `rootRef` and `rootProps` on the demo's root and `stageProps` on its stage.
 */
export function useCardDemo<S extends { fading?: boolean }>({
  start,
  final,
  beats,
  onReset,
  entry,
  loopFrom,
  stage,
  startRatio,
  startMargin,
}: {
  start: S;
  final: S;
  beats: Beat<S>[];
  /** The size the demo is drawn at, when it isn't the default 704×520 (e.g. a screen that fills the whole card) */
  stage?: { w: number; h: number };
  /**
   * For a demo with an opening to watch: start only once this much of the card (0 to 1) is on screen, and
   * measure against the screen edge itself (`startMargin`). By default the loop starts early, a little before
   * the card arrives, so it is already moving when it appears.
   */
  startRatio?: number;
  startMargin?: string;
  /** The beat later passes start from, once the first pass is over (default 0, the whole loop). A demo whose opening assembles the screen sets this past the assembly, so it only plays the first time. */
  loopFrom?: number;
  /** Called when the loop starts over (restart button, or the card leaving the screen), to clear any timers the demo runs itself */
  onReset?: () => void;
  /**
   * Where the loop opens when the card scrolls into view: a scene that already
   * says something, and the beat to carry on from. Later passes, and the restart
   * button, play the whole loop from the top.
   */
  entry?: { scene: S; beat: number };
}) {
  const stageW = stage?.w ?? STAGE_W;
  const stageH = stage?.h ?? STAGE_H;
  const onResetRef = useRef(onReset);
  useEffect(() => {
    onResetRef.current = onReset;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 0, x: 0, y: 0 });
  const scale = fit.scale;
  const opening = entry?.scene ?? start;
  const [scene, setScene] = useState<S>(opening);
  // True until the loop has started from the entry point once since coming into view
  const fromEntry = useRef(true);
  // Demos are display-only; the embeds still branch on this from when they were clickable
  const interactive = false;
  // Autoplay runs until a visitor takes over; it comes back after the card leaves the screen
  const [auto, setAuto] = useState(true);
  // Bumped by the restart button to start the loop over from the top
  const [run, setRun] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Fit the full-size layout to the card
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.min(1, width / stageW, height / stageH);
      setFit({ scale: s, x: (width - stageW * s) / 2, y: (height - stageH * s) / 2 });
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [stageW, stageH]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Starts once enough of the card shows, then keeps playing until it leaves the screen
          if (entry.intersectionRatio >= (startRatio ?? 0)) setInView(true);
        } else {
          setInView(false);
          // Leaving the screen resets the loop, so it starts from the top next time
          onResetRef.current?.();
          fromEntry.current = true;
          setAuto(true);
          setScene(opening);
        }
      },
      // By default, start (and reset) a little beyond the screen edge, so a demo is already moving by the time it arrives
      { threshold: startRatio ? [0, startRatio] : 0.1, rootMargin: startMargin ?? "20% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
    // opening is a module constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The loop
  useEffect(() => {
    if (reduced || !inView || !auto) return;
    let beat = fromEntry.current && entry ? entry.beat : 0;
    fromEntry.current = false;
    let timer: number;
    const step = () => {
      const { set, wait } = beats[beat];
      setScene((s) => ({ ...s, ...set }));
      beat = beat + 1 < beats.length ? beat + 1 : (loopFrom ?? 0);
      timer = window.setTimeout(step, wait);
    };
    step();
    return () => window.clearTimeout(timer);
    // beats and entry are module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, auto, reduced, run]);

  const restart = () => {
    onResetRef.current?.();
    setAuto(true);
    setRun((n) => n + 1);
  };

  /** A visitor took over: stop the loop and show the scene the update returns. */
  const takeOver = useCallback((update: (current: S) => S) => {
    setAuto(false);
    setScene(update);
  }, []);

  // Reduced motion shows the final scene until a visitor takes over
  const view = reduced && auto ? final : scene;

  return {
    rootRef,
    uiRef,
    view,
    interactive,
    takeOver,
    restart,
    rootProps: {
      "data-interactive": interactive || undefined,
      role: "group",
    },
    rootClass: shared.root,
    stageProps: {
      className: shared.stage,
      style: {
        "--scale": scale,
        "--x": `${fit.x}px`,
        "--y": `${fit.y}px`,
        ...(stage ? { "--stage-w": `${stage.w}px`, "--stage-h": `${stage.h}px` } : {}),
        opacity: scale ? undefined : 0,
      } as CSSProperties,
      "data-fading": view.fading || undefined,
    },
    chrome: null,
  };
}

/** Material Symbols icon from /public, tinted with the text colour. */
export function DemoIcon({ src, size, className }: { src: string; size: number; className?: string }) {
  return (
    <span
      className={className ? `${shared.icon} ${className}` : shared.icon}
      style={{ "--icon": `url(${src})`, width: size, height: size } as CSSProperties}
      aria-hidden="true"
    />
  );
}
