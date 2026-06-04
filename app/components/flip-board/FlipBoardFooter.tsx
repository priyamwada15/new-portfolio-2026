"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type PointerEvent,
} from "react";
import { buildFlipBoardGrid, groupSpecsByWord } from "./buildGrid";
import {
  FLIP_BOARD_BACKGROUND_SRC,
  FLIP_BOARD_REVEAL_DURATION_S,
  FLIP_BOARD_ROWS,
  LINE_1_ROWS,
  SOCIAL_SEGMENTS,
} from "./constants";
import { playFlipBoardSpin, stopFlipBoardSpin } from "./flipBoardSound";
import {
  FLIP_BOARD_THEME_DEFAULTS,
  flipBoardCssVars,
} from "./flipBoardDial.config";
import {
  buildCounterStrip,
  randomGibberishChar,
} from "./flipCharSequence";
import "./flip-board-footer.css";
import { mapGridSegments, segmentGridForRender } from "./renderGrid";
import {
  SplitFlapCell,
  type SplitFlapCellHandle,
} from "./SplitFlapCell";
import type { FlipBoardCellSpec } from "./types";
import { cn } from "@/lib/utils";

export type FlipBoardFooterProps = {
  /**
   * `scroll-reveal`: fixed under the page; sheet scrolls up to uncover the board
   * and the sentinel triggers the flip animation. `fixed`: overlay (z-20).
   */
  layout?: "scroll-reveal" | "fixed";
};

const SCROLL_REVEAL_SENTINEL_ID = "flip-board-reveal-sentinel";

gsap.registerPlugin(useGSAP);

const SR_MESSAGE = [
  LINE_1_ROWS.join(" "),
  SOCIAL_SEGMENTS.map((s) => s.label).join(", "),
].join(". ");

function targetChar(spec: FlipBoardCellSpec): string {
  if (spec.kind === "icon") return " ";
  const ch = spec.display ?? " ";
  return ch === "'" ? ch : ch.toUpperCase();
}

function settleCell(root: HTMLElement) {
  root.classList.remove("is-flipping", "is-gibberish");
  root.classList.add("is-settled");
}

function animateCell(
  handle: SplitFlapCellHandle,
  spec: FlipBoardCellSpec,
  reducedMotion: boolean,
  revealDuration: number,
): gsap.core.Timeline {
  const root = handle.root;
  const timeline = gsap.timeline();

  if (!root) return timeline;

  const goal = targetChar(spec);

  timeline.add(() => {
    root.classList.remove("is-settled");
    if (spec.kind === "char") {
      root.classList.add("is-flipping", "is-gibberish");
    }
  });

  if (spec.kind === "icon") {
    timeline.add(() => settleCell(root), revealDuration);
    return timeline;
  }

  const from = handle.getChar();
  const strip = buildCounterStrip(from, goal, { extraFullRotations: 1 });
  const steps = Math.max(0, strip.length - 1);

  if (reducedMotion) {
    timeline.add(() => {
      handle.setChar(goal);
      settleCell(root);
    });
    return timeline;
  }

  if (steps === 0) {
    timeline.add(() => {
      handle.setChar(goal);
      settleCell(root);
    }, revealDuration);
    return timeline;
  }

  timeline.add(
    handle.runCounter(strip, reducedMotion, revealDuration),
    0,
  );
  timeline.add(() => settleCell(root), revealDuration);

  return timeline;
}

export default function FlipBoardFooter({
  layout = "scroll-reveal",
}: FlipBoardFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cellHandles = useRef<Map<string, SplitFlapCellHandle>>(new Map());
  const flipTweenRef = useRef<gsap.core.Timeline | null>(null);
  const scrollRevealFiredRef = useRef(false);

  const specs = useMemo(() => buildFlipBoardGrid(), []);
  const interactiveSpecs = useMemo(
    () => specs.filter((cell) => cell.interactive),
    [specs],
  );

  const specsByRow = useMemo(() => {
    const rows: FlipBoardCellSpec[][] = Array.from(
      { length: FLIP_BOARD_ROWS },
      () => [],
    );
    for (const spec of specs) {
      rows[spec.row]?.push(spec);
    }
    return rows;
  }, [specs]);

  const setCellHandle = useCallback(
    (id: string, handle: SplitFlapCellHandle | null) => {
      if (handle) cellHandles.current.set(id, handle);
      else cellHandles.current.delete(id);
    },
    [],
  );

  const resetToIdle = useCallback(() => {
    stopFlipBoardSpin();
    flipTweenRef.current?.kill();
    flipTweenRef.current = null;

    for (const spec of interactiveSpecs) {
      const handle = cellHandles.current.get(spec.id);
      handle?.resetIdle();
    }
  }, [interactiveSpecs]);

  const runFlipAnimation = useCallback(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ordered = [...interactiveSpecs].sort(
      (a, b) => a.row - b.row || a.col - b.col,
    );

    const ready = ordered.every((spec) => cellHandles.current.has(spec.id));
    if (!ready) return false;

    flipTweenRef.current?.kill();
    stopFlipBoardSpin();

    const revealDuration = FLIP_BOARD_REVEAL_DURATION_S;

    if (!reducedMotion) {
      playFlipBoardSpin();
    }

    const master = gsap.timeline({
      onComplete: () => {
        stopFlipBoardSpin();
      },
    });

    ordered.forEach((spec) => {
      const handle = cellHandles.current.get(spec.id)!;
      const cellTl = animateCell(handle, spec, reducedMotion, revealDuration);
      master.add(cellTl, 0);
    });

    flipTweenRef.current = master;
    return true;
  }, [interactiveSpecs]);

  const seedGibberish = useCallback(() => {
    for (const spec of interactiveSpecs) {
      const handle = cellHandles.current.get(spec.id);
      const root = handle?.root;
      if (!handle || !root) continue;
      if (spec.kind !== "char") continue;
      handle.setChar(randomGibberishChar());
      root.classList.remove("is-settled");
      root.classList.add("is-gibberish");
    }
  }, [interactiveSpecs]);

  const onFooterClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as Element | null;
      const clickedLink = target?.closest("a");

      if (!clickedLink) {
        const isSettled = interactiveSpecs.some((spec) =>
          cellHandles.current.get(spec.id)?.root?.classList.contains("is-settled"),
        );

        if (isSettled) {
          scrollRevealFiredRef.current = false;
          resetToIdle();
          seedGibberish();
          return;
        }

        runFlipAnimation();
      }
    },
    [interactiveSpecs, resetToIdle, runFlipAnimation, seedGibberish],
  );

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--flip-footer-height",
        `${footer.offsetHeight}px`,
      );
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(footer);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--flip-footer-height");
    };
  }, []);

  useEffect(() => {
    if (layout !== "scroll-reveal") return;

    const footer = footerRef.current;
    const sentinel = document.getElementById(SCROLL_REVEAL_SENTINEL_ID);
    if (!footer || !sentinel) return;

    let rafId = 0;
    const syncRevealVisibility = () => {
      rafId = 0;
      const show = sentinel.getBoundingClientRect().top <= window.innerHeight;
      footer.classList.toggle("flip-board-footer--reveal-visible", show);
    };
    const scheduleRevealVisibility = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(syncRevealVisibility);
    };

    scheduleRevealVisibility();
    const revealObserver = new IntersectionObserver(scheduleRevealVisibility, {
      threshold: [0, 1],
    });
    revealObserver.observe(sentinel);
    window.addEventListener("scroll", scheduleRevealVisibility, { passive: true });
    window.addEventListener("resize", scheduleRevealVisibility, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", scheduleRevealVisibility);
      window.removeEventListener("resize", scheduleRevealVisibility);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      footer.classList.remove("flip-board-footer--reveal-visible");
    };
  }, [layout]);

  useEffect(() => {
    if (layout !== "scroll-reveal") return;

    const sentinel = document.getElementById(SCROLL_REVEAL_SENTINEL_ID);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || scrollRevealFiredRef.current) return;

        const ready = interactiveSpecs.every((spec) =>
          cellHandles.current.has(spec.id),
        );
        if (!ready) return;

        scrollRevealFiredRef.current = true;
        runFlipAnimation();
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [layout, interactiveSpecs, runFlipAnimation]);

  useGSAP(
    () => () => {
      stopFlipBoardSpin();
      flipTweenRef.current?.kill();
    },
    { scope: boardRef },
  );

  useEffect(() => {
    let cancelled = false;

    const trySeed = () => {
      if (cancelled) return;
      const ready = interactiveSpecs.every((spec) =>
        cellHandles.current.has(spec.id),
      );
      if (!ready) {
        requestAnimationFrame(trySeed);
        return;
      }
      seedGibberish();
    };

    trySeed();
    return () => {
      cancelled = true;
    };
  }, [interactiveSpecs, seedGibberish]);

  const cellRefCallbacks = useRef(
    new Map<string, (handle: SplitFlapCellHandle | null) => void>(),
  );

  const getCellRef = useCallback(
    (id: string) => {
      const cached = cellRefCallbacks.current.get(id);
      if (cached) return cached;
      const callback = (handle: SplitFlapCellHandle | null) => {
        setCellHandle(id, handle);
      };
      cellRefCallbacks.current.set(id, callback);
      return callback;
    },
    [setCellHandle],
  );

  const renderCell = useCallback(
    (spec: FlipBoardCellSpec) => (
    <SplitFlapCell
      key={spec.id}
      ref={getCellRef(spec.id)}
      spec={spec}
    />
  ),
    [getCellRef],
  );

  const onSocialLinkEnter = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      boardRef.current?.classList.add(
        "flip-board-footer__display--social-hover",
      );
      event.currentTarget.classList.add("is-hovered");
    },
    [],
  );

  const onSocialLinkLeave = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      event.currentTarget.classList.remove("is-hovered");
      requestAnimationFrame(() => {
        if (
          !boardRef.current?.querySelector(
            ".flip-board-footer__link.is-hovered",
          )
        ) {
          boardRef.current?.classList.remove(
            "flip-board-footer__display--social-hover",
          );
        }
      });
    },
    [],
  );

  const socialLinkHover = useMemo(
    () => ({
      onPointerEnter: onSocialLinkEnter,
      onPointerLeave: onSocialLinkLeave,
    }),
    [onSocialLinkEnter, onSocialLinkLeave],
  );

  const footerStyle = flipBoardCssVars(
    {
      displayBgColor: FLIP_BOARD_THEME_DEFAULTS.displayBgColor,
      displayBgOpacity: FLIP_BOARD_THEME_DEFAULTS.displayBgOpacity,
      displayBlur: FLIP_BOARD_THEME_DEFAULTS.displayBlur,
      cellGap: FLIP_BOARD_THEME_DEFAULTS.cellGap,
      rowGap: FLIP_BOARD_THEME_DEFAULTS.rowGap,
      textCellColor: FLIP_BOARD_THEME_DEFAULTS.textCellColor,
      fontColor: FLIP_BOARD_THEME_DEFAULTS.fontColor,
      fontColorDim: FLIP_BOARD_THEME_DEFAULTS.fontColorDim,
      flapAccentColor: FLIP_BOARD_THEME_DEFAULTS.flapAccentColor,
      flapAccentHeight: FLIP_BOARD_THEME_DEFAULTS.flapAccentHeight,
    },
    FLIP_BOARD_BACKGROUND_SRC,
  ) as React.CSSProperties;

  return (
    <footer
      ref={footerRef}
      className={cn(
        "flip-board-footer",
        layout === "fixed"
          ? "flip-board-footer--fixed"
          : "flip-board-footer--scroll-reveal",
      )}
      style={footerStyle}
      aria-label="Site footer"
      onClick={onFooterClick}
    >
      <p className="flip-board-footer__sr-message">{SR_MESSAGE}</p>

      <div className="flip-board-footer__shell">
        <div ref={boardRef} className="flip-board-footer__display" aria-hidden>
          {specsByRow.map((rowSpecs, row) => {
            if (rowSpecs.length === 0) return null;

            if (row < 2) {
              return (
                <div key={`row-${row}`} className="flip-board-footer__row">
                  {groupSpecsByWord(rowSpecs).map((wordSpecs, wordIndex) => (
                    <div
                      key={`row-${row}-word-${wordIndex}`}
                      className="flip-board-footer__word"
                    >
                      {wordSpecs.map((spec) => renderCell(spec))}
                    </div>
                  ))}
                </div>
              );
            }

            const rowSegments = segmentGridForRender(rowSpecs);
            return (
              <div
                key={`row-${row}`}
                className="flip-board-footer__row flip-board-footer__row--social"
              >
                {mapGridSegments(rowSegments, renderCell, socialLinkHover)}
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
