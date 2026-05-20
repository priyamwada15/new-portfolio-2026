"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Matches frosted nav shell (see Nav.tsx). */
const STRIP_CONTROL_SHELL_STYLE: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.62)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  boxShadow:
    "0 8px 28px -6px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
};

type StripImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Source files in /public/homepage-ui-strip — served as PNG (unoptimized), not AVIF/WebP. */
const STRIP_IMAGES: readonly StripImage[] = [
  {
    src: "/homepage-ui-strip/RM 1.png",
    alt: "Rocket Mortgage product UI",
    width: 1946,
    height: 4096,
  },
  {
    src: "/homepage-ui-strip/RM 2.png",
    alt: "Rocket Mortgage assistant UI",
    width: 1946,
    height: 4096,
  },
  {
    src: "/homepage-ui-strip/SF UI Strip 1.png",
    alt: "Salesforce Galileo planning UI",
    width: 2048,
    height: 1237,
  },
  {
    src: "/homepage-ui-strip/SF UI Strip 2.png",
    alt: "Salesforce Galileo detail UI",
    width: 2048,
    height: 1237,
  },
  {
    src: "/homepage-ui-strip/Debug UI Strip.png",
    alt: "TARS debug mode UI",
    width: 2048,
    height: 1237,
  },
  {
    src: "/homepage-ui-strip/Approved.png",
    alt: "Approval workflow UI",
    width: 2048,
    height: 1237,
  },
  {
    src: "/homepage-ui-strip/Audit Trail.png",
    alt: "Audit trail UI",
    width: 2048,
    height: 1237,
  },
  {
    src: "/homepage-ui-strip/Exceptions.png",
    alt: "Exceptions UI",
    width: 2048,
    height: 1237,
  },
] as const;

function StripNavArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? CaretLeft : CaretRight;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll strip left" : "Scroll strip right"}
      onClick={onClick}
      className={cn(
        "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-[#333333] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none",
        "scale-90 opacity-0 group-hover/strip:scale-100 group-hover/strip:opacity-100",
        "motion-reduce:scale-100 motion-reduce:opacity-100",
        "focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#744577]/40",
        disabled && "pointer-events-none! opacity-0!",
      )}
      style={STRIP_CONTROL_SHELL_STYLE}
    >
      <Icon size={22} weight="bold" aria-hidden />
    </button>
  );
}

export function HomepageUiStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: -1,
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const syncScrollEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = el.scrollLeft;
    setCanScrollLeft(left > 2);
    setCanScrollRight(left < max - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    syncScrollEdges();

    const onScroll = () => syncScrollEdges();
    const ro = new ResizeObserver(() => syncScrollEdges());

    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX <= absY && !e.shiftKey) return;
      e.preventDefault();
      el.scrollLeft += absX > absY ? e.deltaX : e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      ro.disconnect();
    };
  }, [syncScrollEdges]);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(280, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    const el = scrollRef.current;
    if (!el) return;

    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      pointerId: e.pointerId,
    };
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return;
    const el = scrollRef.current;
    if (!el) return;

    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 3) {
      dragRef.current.moved = true;
      setIsDragging(true);
    }
    if (!dragRef.current.moved) return;

    e.preventDefault();
    el.scrollLeft = dragRef.current.startScrollLeft - delta;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) return;
    const el = scrollRef.current;
    dragRef.current.active = false;
    setIsDragging(false);
    if (el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
  }, []);

  return (
    <div className="homepage-ui-strip-wrap group/strip relative z-[2] mb-16">
      <div
        className="homepage-ui-strip-controls pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 md:px-6"
        aria-hidden
      >
        <StripNavArrow
          direction="left"
          disabled={!canScrollLeft}
          onClick={() => scrollByPage(-1)}
        />
        <StripNavArrow
          direction="right"
          disabled={!canScrollRight}
          onClick={() => scrollByPage(1)}
        />
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "homepage-ui-strip w-full cursor-grab overflow-x-auto overflow-y-hidden overscroll-x-contain",
          isDragging && "cursor-grabbing",
        )}
        aria-label="Selected product interface previews"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div className="homepage-ui-strip-track flex w-max items-center gap-8 px-[max(5vw,20px)] pb-1 md:gap-10 md:px-[max(4vw,32px)]">
          {STRIP_IMAGES.map((item, i) => (
            <div
              key={item.src}
              className="relative h-[260px] w-auto shrink-0 sm:h-[320px] md:h-[400px] lg:h-[460px]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                unoptimized
                className="pointer-events-none h-full w-auto max-w-none select-none object-contain object-left"
                draggable={false}
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
