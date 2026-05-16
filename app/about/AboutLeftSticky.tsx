"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/animate-ui/tooltip";
import { cn } from "@/lib/utils";
import { aboutAssets, SPOTIFY_PEACHES_ALBUM_URL } from "./aboutAssets";
import {
  AboutBookHoverOverlay,
  type BookHoverId,
  useAboutBookHover,
} from "./AboutBookHoverContext";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

const PORTRAIT_TOOLTIP_OFFSET = 14;
const PORTRAIT_TOOLTIP_OPEN_MS = 200;

const CARD_SHADOW = "0px 4px 24px rgba(0, 0, 0, 0.12)";

const BOOK_HOVER_MEDIA_CLASS =
  "pointer-events-none absolute top-1/2 z-40 size-[250px] -translate-y-1/2 overflow-hidden rounded-2xl border-4 border-white box-border transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[12px] font-medium leading-[130%] text-[#555555]"
      style={figtree}
    >
      {children}
    </p>
  );
}

function PortraitWithCursorTooltip() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => clearOpenTimer();
  }, [clearOpenTimer]);

  const updateCoords = useCallback((clientX: number, clientY: number) => {
    setCoords({
      x: clientX + PORTRAIT_TOOLTIP_OFFSET,
      y: clientY + PORTRAIT_TOOLTIP_OFFSET,
    });
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      updateCoords(event.clientX, event.clientY);
      clearOpenTimer();
      openTimerRef.current = setTimeout(() => setVisible(true), PORTRAIT_TOOLTIP_OPEN_MS);
    },
    [clearOpenTimer, updateCoords]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      updateCoords(event.clientX, event.clientY);
    },
    [updateCoords]
  );

  const handleMouseLeave = useCallback(() => {
    clearOpenTimer();
    setVisible(false);
  }, [clearOpenTimer]);

  return (
    <>
      <figure
        className="relative m-0 box-border h-[350px] w-full cursor-default overflow-hidden rounded-[24px] border-8 border-white transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none hover:[transform:perspective(900px)_rotateY(-5deg)_rotateX(3deg)_scale(1.015)] motion-reduce:hover:transform-none"
        style={{ boxShadow: CARD_SHADOW }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-describedby={visible ? "portrait-cursor-tooltip" : undefined}
      >
        <Image
          src={aboutAssets.portrait}
          alt="Priyamwada Pandey"
          fill
          className="object-cover"
          sizes="300px"
          priority
        />
      </figure>

      {mounted &&
        visible &&
        createPortal(
          <div
            id="portrait-cursor-tooltip"
            role="tooltip"
            className="pointer-events-none fixed z-[100] w-fit rounded-md bg-[#111111] px-3 py-1.5 text-xs text-[#fafafa] shadow-md"
            style={{
              left: coords.x,
              top: coords.y,
              fontFamily: "var(--font-hind), sans-serif",
            }}
          >
            Hi! I&apos;m Priyamwada
          </div>,
          document.body
        )}
    </>
  );
}

function BookHoverReveal({
  visible,
  align,
  children,
}: {
  visible: boolean;
  align: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        BOOK_HOVER_MEDIA_CLASS,
        align === "left" ? "left-0" : "right-0",
        visible
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-[0.96] opacity-0"
      )}
      style={{ boxShadow: CARD_SHADOW }}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}

export default function AboutLeftSticky() {
  const { bookHover, setBookHover } = useAboutBookHover();

  return (
    <TooltipProvider openDelay={200} closeDelay={100}>
      <AboutBookHoverOverlay />
      <aside
        className="relative z-[4] mx-auto w-full max-w-[300px] shrink-0 self-start lg:sticky lg:top-[120px] lg:mx-0"
        aria-label="About sidebar"
      >
        <section className="flex w-[300px] max-w-full flex-col overflow-visible">
          <PortraitWithCursorTooltip />

          <section className="mt-14 w-full">
            <SectionLabel>🎵 Currently listening</SectionLabel>
            <Tooltip side="top" sideOffset={8}>
              <TooltipTrigger asChild>
                <a
                  href={SPOTIFY_PEACHES_ALBUM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-4 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#333333]/30"
                >
                  <span className="relative block size-[50px] shrink-0 overflow-hidden rounded-[4px]">
                    <Image
                      src={aboutAssets.listeningAlbum}
                      alt="Peaches album art"
                      fill
                      className="object-cover"
                      sizes="50px"
                    />
                  </span>
                  <span
                    className="text-[14px] font-medium leading-[130%] text-[#333333]"
                    style={figtree}
                  >
                    Peaches by The Black Keys
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent>Listen on Spotify</TooltipContent>
            </Tooltip>
          </section>

          <section className="mt-14 w-full">
            <SectionLabel>📚 Currently reading</SectionLabel>
            <ul className="mt-4 flex list-none items-start gap-4 overflow-visible p-0">
              <li
                className="relative h-[150px] w-[92.92px] shrink-0 cursor-default"
                tabIndex={0}
                onMouseEnter={() => setBookHover("devils")}
                onMouseLeave={() => setBookHover(null)}
                onFocus={() => setBookHover("devils")}
                onBlur={() => setBookHover(null)}
              >
                <div
                  className={cn(
                    "relative h-full w-full overflow-hidden rounded-2xl border-4 border-white box-border transition-opacity duration-300",
                    bookHover === "devils" && "opacity-0"
                  )}
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <Image
                    src={aboutAssets.bookDevilsAdvocate}
                    alt="The Devil's Advocate book cover"
                    fill
                    className="object-cover"
                    sizes="93px"
                  />
                </div>
                <BookHoverReveal visible={bookHover === "devils"} align="left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutAssets.bookHoverCat}
                    alt=""
                    className="size-full object-cover"
                  />
                </BookHoverReveal>
              </li>

              <li
                className="relative h-[150px] w-[98.63px] shrink-0 cursor-default"
                tabIndex={0}
                onMouseEnter={() => setBookHover("culture")}
                onMouseLeave={() => setBookHover(null)}
                onFocus={() => setBookHover("culture")}
                onBlur={() => setBookHover(null)}
              >
                <div
                  className={cn(
                    "relative h-full w-full overflow-hidden rounded-2xl border-4 border-white box-border transition-opacity duration-300",
                    bookHover === "culture" && "opacity-0"
                  )}
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <Image
                    src={aboutAssets.bookCultureMap}
                    alt="The Culture Map book cover"
                    fill
                    className="object-cover"
                    sizes="99px"
                  />
                </div>
                <BookHoverReveal visible={bookHover === "culture"} align="right">
                  <Image
                    src={aboutAssets.bookHoverOffice}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="250px"
                    unoptimized
                  />
                </BookHoverReveal>
              </li>
            </ul>
          </section>
        </section>
      </aside>
    </TooltipProvider>
  );
}
