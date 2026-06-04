"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import gsap from "gsap";
import {
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import type { FlipBoardCellSpec } from "./types";

export type SplitFlapCellProps = {
  spec: FlipBoardCellSpec;
  className?: string;
};

export type SplitFlapCellHandle = {
  root: HTMLDivElement | null;
  getChar: () => string;
  setChar: (char: string) => void;
  runCounter: (
    sequence: string[],
    reducedMotion: boolean,
    durationSec: number,
  ) => gsap.core.Timeline;
  resetIdle: () => void;
};

function IconGlyph() {
  return (
    <ArrowUpRight
      className="counter-flap-cell__icon"
      size="1em"
      weight="bold"
      aria-hidden
    />
  );
}

export const SplitFlapCell = memo(
  forwardRef<SplitFlapCellHandle, SplitFlapCellProps>(function SplitFlapCell(
    { spec, className },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const displayedCharRef = useRef(" ");
    const [stripChars, setStripChars] = useState<string[]>([" "]);

    const isIcon = spec.kind === "icon";
    const isSpace = spec.kind === "space";

    if (isSpace) {
      return (
        <div
          className={cn(
            "counter-flap-cell counter-flap-cell--space is-settled",
            className,
          )}
          data-cell-id={spec.id}
          data-kind={spec.kind}
          aria-hidden
        >
          <div className="counter-flap-cell__revealed" aria-hidden>
            <div className="counter-flap-cell__window">
              <div className="counter-flap-cell__strip">
                <span className="counter-flap-cell__strip-char"> </span>
              </div>
            </div>
          </div>
          <div className="counter-flap-cell__hinge" aria-hidden />
        </div>
      );
    }

    const syncStripRowHeights = () => {
      const windowEl = windowRef.current;
      const stripEl = stripRef.current;
      if (!windowEl || !stripEl) return 0;

      return windowEl.clientHeight;
    };

    useLayoutEffect(() => {
      if (isIcon) return;
      const root = rootRef.current;
      if (!root) return;

      const sync = () => {
        syncStripRowHeights();
      };

      sync();
      const ro = new ResizeObserver(sync);
      ro.observe(root);
      return () => ro.disconnect();
    }, [stripChars, isIcon]);

    useImperativeHandle(
      ref,
      () => ({
        get root() {
          return rootRef.current;
        },
        getChar() {
          return displayedCharRef.current;
        },
        setChar(char: string) {
          if (isIcon) return;
          const c = char || " ";
          displayedCharRef.current = c;
          setStripChars([c]);
          if (stripRef.current) gsap.set(stripRef.current, { y: 0 });
        },
        runCounter(sequence, reducedMotion, durationSec) {
          const tl = gsap.timeline();
          const goal = sequence[sequence.length - 1] ?? " ";

          if (isIcon || !stripRef.current || !windowRef.current) {
            return tl;
          }

          flushSync(() => setStripChars(sequence));

          const stepPx = syncStripRowHeights();
          const steps = Math.max(0, sequence.length - 1);

          if (steps === 0 || stepPx <= 0) {
            displayedCharRef.current = goal;
            gsap.set(stripRef.current, { y: 0 });
            return tl;
          }

          gsap.set(stripRef.current, { y: 0 });

          if (reducedMotion) {
            displayedCharRef.current = goal;
            gsap.set(stripRef.current, { y: -steps * stepPx });
            return tl;
          }

          tl.to(stripRef.current, {
            y: -steps * stepPx,
            duration: durationSec,
            ease: `steps(${steps})`,
            onComplete: () => {
              displayedCharRef.current = goal;
            },
          });

          return tl;
        },
        resetIdle() {
          rootRef.current?.classList.remove("is-flipping", "is-settled");
        },
      }),
      [isIcon],
    );

    return (
      <div
        ref={rootRef}
        className={cn(
          "counter-flap-cell split-flap-cell--interactive is-gibberish",
          className,
        )}
        data-cell-id={spec.id}
        data-kind={spec.kind}
      >
        <div className="counter-flap-cell__revealed" aria-hidden>
          {isIcon ? (
            <div className="counter-flap-cell__glyph">
              <IconGlyph />
            </div>
          ) : (
            <div ref={windowRef} className="counter-flap-cell__window">
              <div ref={stripRef} className="counter-flap-cell__strip">
                {stripChars.map((char, index) => (
                  <span key={index} className="counter-flap-cell__strip-char">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="counter-flap-cell__hinge" aria-hidden />
      </div>
    );
  }),
);
