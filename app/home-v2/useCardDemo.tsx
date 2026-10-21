"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useCursorDisc } from "./useCursorDisc";
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
 * stops the loop), a restart button, reduced motion (the final scene, no loop)
 * and the "Read" cursor over the scene on either side of the demo's UI.
 *
 * Put `rootRef` and `rootProps` on the demo's root, `stageProps` on its stage,
 * and `uiRef` on the element whose sides get the "Read" cursor.
 */
export function useCardDemo<S extends { fading?: boolean }>({
  start,
  final,
  beats,
  sideClear = { left: 32, right: 32 },
  onReset,
  entry,
}: {
  start: S;
  final: S;
  beats: Beat<S>[];
  /** Stage px beside the UI element where the "Read" cursor stays off */
  sideClear?: { left: number; right: number };
  /** Called when the loop starts over (restart button, or the card leaving the screen), to clear any timers the demo runs itself */
  onReset?: () => void;
  /**
   * Where the loop opens when the card scrolls into view: a scene that already
   * says something, and the beat to carry on from. Later passes, and the restart
   * button, play the whole loop from the top.
   */
  entry?: { scene: S; beat: number };
}) {
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
  const [interactive, setInteractive] = useState(false);
  // Autoplay runs until a visitor takes over; it comes back after the card leaves the screen
  const [auto, setAuto] = useState(true);
  // Bumped by the restart button to start the loop over from the top
  const [run, setRun] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const cursor = useCursorDisc("Read");

  // Fit the full-size layout to the card
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.min(1, width / STAGE_W, height / STAGE_H);
      setFit({ scale: s, x: (width - STAGE_W * s) / 2, y: (height - STAGE_H * s) / 2 });
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setInteractive(fine.matches);
      setReduced(motion.matches);
    };
    sync();
    fine.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        // Leaving the screen resets the loop, so it starts from the top next time
        if (!entry.isIntersecting) {
          onResetRef.current?.();
          fromEntry.current = true;
          setAuto(true);
          setScene(opening);
        }
      },
      { threshold: 0.35 },
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
      beat = (beat + 1) % beats.length;
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

  // "Read" cursor over the scene: the card link sits under the demo, so watch its media area
  useEffect(() => {
    const root = rootRef.current;
    const link = root?.closest("[data-study-row]")?.querySelector("a");
    const media = link?.querySelector<HTMLElement>("[data-card-media]");
    if (!interactive || !link || !media) return;
    /** The scene on either side of the UI: inside the media, outside the UI and its clearance. */
    const inSides = (e: PointerEvent) => {
      const r = media.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return false;
      const ui = uiRef.current;
      if (!ui) return true;
      const c = ui.getBoundingClientRect();
      return e.clientX < c.left - sideClear.left * scale || e.clientX > c.right + sideClear.right * scale;
    };
    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (inSides(e)) {
        if (shown) cursor.move(e);
        else cursor.show(e);
        shown = true;
      } else if (shown) {
        cursor.hide();
        shown = false;
      }
    };
    const onLeave = () => {
      cursor.hide();
      shown = false;
    };
    link.addEventListener("pointermove", onMove);
    link.addEventListener("pointerleave", onLeave);
    return () => {
      link.removeEventListener("pointermove", onMove);
      link.removeEventListener("pointerleave", onLeave);
    };
    // cursor's methods only touch refs and state setters; sideClear is a constant per demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, scale]);

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
      style: { "--scale": scale, "--x": `${fit.x}px`, "--y": `${fit.y}px`, opacity: scale ? undefined : 0 } as CSSProperties,
      "data-fading": view.fading || undefined,
    },
    /** Restart button and "Read" disc; render inside the demo's root, after the stage */
    chrome: (
      <>
        {interactive && !reduced && (
          <button type="button" className={shared.restart} aria-label="Restart demo" onClick={restart}>
            <DemoIcon src="/card-demo/icon-replay.svg" size={20} />
          </button>
        )}
        {cursor.disc}
      </>
    ),
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
