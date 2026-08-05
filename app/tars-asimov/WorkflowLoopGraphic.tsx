"use client";

import { useGSAP } from "@gsap/react";
import { Pause, Play } from "@phosphor-icons/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const DIMMED_OPACITY = 0.4;
const HOLD_DURATION = 1.3;
const FADE_OUT_DURATION = 0.7;
const LOOP_PAUSE = 0.5;
const BOX_FADE_DURATION = 0.7;
const ARROW_DRAW_DURATION = 0.8;
const ARROWHEAD_DURATION = 0.2;
const DIM_DURATION = 0.55;
const RESUME_TRANSITION_DURATION = 0.3;

function TagRow({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-row items-center justify-center gap-1.5">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[12px] leading-[160%] text-[#767676]">•</span>}
          <span className="text-[12px] italic leading-[160%] text-[#767676]">{item}</span>
        </span>
      ))}
    </div>
  );
}

export default function WorkflowLoopGraphic() {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);
  const dot3Ref = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<SVGLineElement>(null);
  const head1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);
  const head2Ref = useRef<SVGPathElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pulsesRef = useRef<gsap.core.Tween[]>([]);

  const [isPaused, setIsPaused] = useState(false);
  const [showControl, setShowControl] = useState(false);
  const [scale, setScale] = useState(1);

  // The diagram's boxes are fixed-width — below the width they need to sit
  // side by side, scale the whole row down instead of letting it get clipped.
  // CSS transforms don't affect layout box sizes, so scrollWidth/offsetWidth
  // are always safe to read regardless of the currently-applied scale.
  useEffect(() => {
    const outer = outerRef.current;
    const inner = containerRef.current;
    if (!outer || !inner) return;

    const updateScale = () => {
      const needed = inner.scrollWidth;
      const available = outer.offsetWidth;
      if (!needed) return;
      setScale(Math.min(1, available / needed));
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(outer);
    return () => resizeObserver.disconnect();
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      const boxes = [box1Ref.current, box2Ref.current, box3Ref.current];
      const arrowParts = [line1Ref.current, head1Ref.current, line2Ref.current, head2Ref.current];
      if (boxes.some((el) => !el) || arrowParts.some((el) => !el)) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Static, fully-revealed end state for reduced-motion users.
      gsap.set(boxes, { opacity: 1 });
      gsap.set([line1Ref.current, line2Ref.current], { strokeDashoffset: 0 });
      gsap.set([head1Ref.current, head2Ref.current], { opacity: 1 });
      if (reduceMotion) return;

      setShowControl(true);

      const dotPulse = (dot: HTMLSpanElement | null) =>
        gsap.to(dot, {
          scale: 1.35,
          opacity: 0.55,
          duration: 0.75,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center",
          paused: true,
        });

      const pulse1 = dotPulse(dot1Ref.current);
      const pulse2 = dotPulse(dot2Ref.current);
      const pulse3 = dotPulse(dot3Ref.current);
      pulsesRef.current = [pulse1, pulse2, pulse3];

      // Start from fully hidden — the loop's own fade-out leaves things this
      // way too, but the first run needs it set explicitly.
      gsap.set(boxes, { opacity: 0 });
      gsap.set([line1Ref.current, line2Ref.current], { strokeDashoffset: 1 });
      gsap.set([head1Ref.current, head2Ref.current], { opacity: 0 });

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });
      timelineRef.current = tl;

      tl.to(box1Ref.current, { opacity: 1, duration: BOX_FADE_DURATION })
        .call(() => pulse1.play())
        .to(line1Ref.current, { strokeDashoffset: 0, duration: ARROW_DRAW_DURATION, ease: "power1.inOut" })
        .to(head1Ref.current, { opacity: 1, duration: ARROWHEAD_DURATION }, "<+0.55")
        .to(box2Ref.current, { opacity: 1, duration: BOX_FADE_DURATION })
        .call(() => {
          pulse1.pause();
          pulse2.play();
        })
        .to(box1Ref.current, { opacity: DIMMED_OPACITY, duration: DIM_DURATION }, "<")
        .to(line2Ref.current, { strokeDashoffset: 0, duration: ARROW_DRAW_DURATION, ease: "power1.inOut" })
        .to(head2Ref.current, { opacity: 1, duration: ARROWHEAD_DURATION }, "<+0.55")
        .to(box3Ref.current, { opacity: 1, duration: BOX_FADE_DURATION })
        .call(() => {
          pulse2.pause();
          pulse3.play();
        })
        .to(box2Ref.current, { opacity: DIMMED_OPACITY, duration: DIM_DURATION }, "<")
        .to({}, { duration: HOLD_DURATION })
        .call(() => {
          pulse1.pause();
          pulse2.pause();
          pulse3.pause();
        })
        .to([box1Ref.current, box2Ref.current, box3Ref.current], {
          opacity: 0,
          duration: FADE_OUT_DURATION,
        })
        .to([head1Ref.current, head2Ref.current], { opacity: 0, duration: FADE_OUT_DURATION }, "<")
        .to(
          [line1Ref.current, line2Ref.current],
          { strokeDashoffset: 1, duration: FADE_OUT_DURATION },
          "<",
        )
        .to({}, { duration: LOOP_PAUSE });
    },
    { scope: containerRef },
  );

  const togglePause = contextSafe(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    pulsesRef.current.forEach((pulse) => pulse.pause());

    if (!isPaused) {
      // Pause on the same fully-revealed resting state used before the loop
      // was ever running — every box visible, both arrows fully drawn.
      tl.pause();
      gsap.to([box1Ref.current, box2Ref.current, box3Ref.current], {
        opacity: 1,
        duration: RESUME_TRANSITION_DURATION,
      });
      gsap.to([line1Ref.current, line2Ref.current], {
        strokeDashoffset: 0,
        duration: RESUME_TRANSITION_DURATION,
      });
      gsap.to([head1Ref.current, head2Ref.current], {
        opacity: 1,
        duration: RESUME_TRANSITION_DURATION,
      });
    } else {
      // Resuming re-plays the story from the top rather than picking up
      // mid-loop, since the paused state isn't actually a moment in it.
      gsap.set([box1Ref.current, box2Ref.current, box3Ref.current], { opacity: 0 });
      gsap.set([line1Ref.current, line2Ref.current], { strokeDashoffset: 1 });
      gsap.set([head1Ref.current, head2Ref.current], { opacity: 0 });
      tl.restart();
    }

    setIsPaused((prev) => !prev);
  });

  return (
    <div ref={outerRef} className="relative h-full w-full overflow-hidden">
      {showControl && (
        <button
          type="button"
          onClick={togglePause}
          aria-label={isPaused ? "Play workflow animation" : "Pause workflow animation"}
          aria-pressed={isPaused}
          className="cursor-hover-pointer absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#F2F2F2]"
        >
          {isPaused ? (
            <Play size={12} weight="fill" color="#555555" />
          ) : (
            <Pause size={12} weight="fill" color="#555555" />
          )}
        </button>
      )}

      <div
        ref={containerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}
        className="flex h-full w-full items-center gap-3 px-10"
      >
      {/* Connect Slack */}
      <div
        ref={box1Ref}
        className="flex h-[37px] w-[126px] shrink-0 flex-row items-center justify-center gap-2 rounded-[6px] border-[1.5px] bg-white px-2 py-1.5 opacity-0"
        style={{ borderColor: "rgba(224, 30, 90, 0.2)" }}
      >
        <span ref={dot1Ref} className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#E01E5A" }} />
        <span className="text-[14px] leading-[160%] text-[#333333]">Connect Slack</span>
      </div>

      {/* Arrow 1 */}
      <div className="flex h-2.5 min-w-4 flex-1 items-center">
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-2.5 w-full overflow-visible">
          <line
            ref={line1Ref}
            x1="0"
            y1="5"
            x2="92"
            y2="5"
            stroke="#C8C8C8"
            strokeWidth="1"
            pathLength={1}
            strokeDasharray="1 1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={head1Ref}
            d="M 88 2 L 95 5 L 88 8"
            fill="none"
            stroke="#C8C8C8"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Asimov Dashboard */}
      <div
        ref={box2Ref}
        className="flex h-[64px] w-[225px] shrink-0 flex-col items-center justify-center gap-2 rounded-[6px] border-[1.5px] bg-white px-2 py-1.5 opacity-0"
        style={{ borderColor: "rgba(109, 51, 170, 0.2)" }}
      >
        <div className="flex flex-row items-center gap-2">
          <span ref={dot2Ref} className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#6D33AA" }} />
          <span className="text-[14px] leading-[160%] text-[#333333]">Asimov Dashboard</span>
        </div>
        <TagRow items={["Knowledge", "Integrations", "Actions"]} />
      </div>

      {/* Arrow 2 */}
      <div className="flex h-2.5 min-w-4 flex-1 items-center">
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-2.5 w-full overflow-visible">
          <line
            ref={line2Ref}
            x1="0"
            y1="5"
            x2="92"
            y2="5"
            stroke="#C8C8C8"
            strokeWidth="1"
            pathLength={1}
            strokeDasharray="1 1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={head2Ref}
            d="M 88 2 L 95 5 L 88 8"
            fill="none"
            stroke="#C8C8C8"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Chat in Slack */}
      <div
        ref={box3Ref}
        className="flex h-[68px] w-[181px] shrink-0 flex-col items-center justify-center gap-2 rounded-[6px] border-[1.5px] bg-white p-2 opacity-0"
        style={{ borderColor: "rgba(224, 30, 90, 0.2)" }}
      >
        <div className="flex flex-row items-center gap-2">
          <span ref={dot3Ref} className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#E01E5A" }} />
          <span className="text-[14px] leading-[160%] text-[#333333]">Chat in Slack</span>
        </div>
        <TagRow items={["Summarize", "Retrieve", "Act"]} />
      </div>
      </div>
    </div>
  );
}
