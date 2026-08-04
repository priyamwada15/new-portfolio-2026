"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";
import { homeBentoTileLabelStyle } from "@/design-system";
import type { ListeningWidgetData } from "@/app/lib/spotify";
import { CreativeLicenseLightbox } from "./CreativeLicenseLightbox";

type HomeV2WidgetBentoProps = {
  data: ListeningWidgetData | null;
};

const tileShellStyle = {
  position: "relative",
  background: "var(--ds-surface-page)",
  borderRadius: "var(--ds-radius-container)",
  overflow: "hidden",
  flex: "none",
} satisfies CSSProperties;

const tickerTextStyle = {
  fontFamily: "Figtree, sans-serif",
  fontSize: "10px",
  color: "#333",
} satisfies CSSProperties;

// Matches the Figma "Smart animate" hover interaction shared by all 4 bento tiles.
const HOVER_DURATION = "0.5s";
const HOVER_EASE = "cubic-bezier(0.52, -0.01, 0, 1)";

function tileLabelStyle(hovered: boolean): CSSProperties {
  return {
    ...homeBentoTileLabelStyle,
    position: "absolute",
    left: "24px",
    top: hovered ? "24px" : "-28px",
    fontSize: hovered ? "14px" : "10px",
    lineHeight: hovered ? "17px" : "12px",
    opacity: hovered ? 1 : 0.2,
    zIndex: 1,
    transition: `top ${HOVER_DURATION} ${HOVER_EASE}, font-size ${HOVER_DURATION} ${HOVER_EASE}, line-height ${HOVER_DURATION} ${HOVER_EASE}, opacity ${HOVER_DURATION} ${HOVER_EASE}`,
  };
}

function FloorPlanTile({ style, centerImage = false }: { style: CSSProperties; centerImage?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/floor-plan-version"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open the floor-plan homepage concept"
      className="cursor-hover-pointer"
      style={{ ...tileShellStyle, ...style, display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={tileLabelStyle(hovered)}>Floor Plan Version</span>
      <div
        style={{
          position: "absolute",
          left: centerImage ? "50%" : "52px",
          top: hovered ? "59px" : "27px",
          transform: centerImage ? "translateX(-50%)" : undefined,
          transition: `top ${HOVER_DURATION} ${HOVER_EASE}`,
        }}
      >
        <div
          style={{
            width: "250.54px",
            height: "257.87px",
            borderRadius: "12px",
            overflow: "hidden",
            transform: "rotate(6.25deg)",
          }}
        >
          <Image
            src="/26june-homepage-assets/floor-plan.avif"
            alt="Floor-plan homepage concept"
            fill
            sizes="502px"
            className="object-cover"
          />
        </div>
      </div>
    </a>
  );
}

function ReadingTile({ style }: { style: CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...tileShellStyle, ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={tileLabelStyle(hovered)}>Reading</span>
      <div
        style={{
          position: "absolute",
          width: hovered ? "74.82px" : "88px",
          height: hovered ? "113.74px" : "134px",
          left: hovered ? "51.9px" : "38.35px",
          top: hovered ? "52.04px" : "26px",
          borderRadius: hovered ? "2px" : "2.62px",
          overflow: "hidden",
          boxShadow: hovered
            ? "4px 4px 20px rgba(0, 0, 0, 0.15)"
            : "5.24px 5.24px 26.18px rgba(0, 0, 0, 0.15)",
          transform: "rotate(6.74deg)",
          transition: `width ${HOVER_DURATION} ${HOVER_EASE}, height ${HOVER_DURATION} ${HOVER_EASE}, left ${HOVER_DURATION} ${HOVER_EASE}, top ${HOVER_DURATION} ${HOVER_EASE}, border-radius ${HOVER_DURATION} ${HOVER_EASE}, box-shadow ${HOVER_DURATION} ${HOVER_EASE}`,
        }}
      >
        <Image src="/26june-homepage-assets/slow_gods_book_cover.avif" alt="Currently reading" fill sizes="150px" className="object-cover" />
      </div>
    </div>
  );
}

function CreativeLicenseTile({ style }: { style: CSSProperties }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className="cursor-hover-pointer"
        style={{ ...tileShellStyle, ...style }}
        onClick={() => setLightboxOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={0}
        aria-label="Open Creative License"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightboxOpen(true); }}
      >
        <span style={tileLabelStyle(hovered)}>About</span>
        <div
          style={{
            position: "absolute",
            left: "40.21px",
            top: hovered ? "34.48px" : "10.48px",
            transition: `top ${HOVER_DURATION} ${HOVER_EASE}`,
          }}
        >
          <div
            style={{
              width: "301.12px",
              height: "200.75px",
              transform: "rotate(-5.47deg)",
              filter: "drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.04))",
            }}
          >
            <Image
              src="/26june-homepage-assets/Creative License Front.png"
              alt="Priyamwada's creative license"
              fill
              sizes="604px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      {lightboxOpen && <CreativeLicenseLightbox onClose={() => setLightboxOpen(false)} />}
    </>
  );
}

function ListeningTile({
  lead,
  style,
}: {
  lead: ListeningWidgetData["lead"] | null;
  style: CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ ...tileShellStyle, ...style }}>
      <span style={tileLabelStyle(hovered)}>Listening</span>

      {lead ? (
        <a
          href={lead.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${lead.title} by ${lead.artist} on Spotify`}
          className="cursor-hover-pointer"
          style={{ position: "absolute", inset: 0, display: "block" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Album art */}
          <div
            style={{
              position: "absolute",
              left: hovered ? "calc(50% - 44px)" : "calc(50% - 58.5px)",
              top: hovered ? "calc(50% - 40px)" : "calc(50% - 69px)",
              width: hovered ? "88px" : "117px",
              height: hovered ? "88px" : "117px",
              border: hovered ? "1.6px solid #fff" : "2.13px solid #fff",
              borderRadius: hovered ? "8px" : "10.64px",
              overflow: "hidden",
              boxShadow: hovered
                ? "0px 8px 22px rgba(0,0,0,0.14), 0 0 0 1.5px #fff, 0 0 0 3px var(--ds-color-accent-terminal)"
                : "0px 10.64px 29.25px rgba(0,0,0,0.14)",
              transition: `left ${HOVER_DURATION} ${HOVER_EASE}, top ${HOVER_DURATION} ${HOVER_EASE}, width ${HOVER_DURATION} ${HOVER_EASE}, height ${HOVER_DURATION} ${HOVER_EASE}, border ${HOVER_DURATION} ${HOVER_EASE}, border-radius ${HOVER_DURATION} ${HOVER_EASE}, box-shadow ${HOVER_DURATION} ${HOVER_EASE}`,
            }}
          >
            <Image
              src={lead.albumArtUrl}
              alt={`${lead.title} album art`}
              fill
              sizes="88px"
              className="object-cover"
              style={{
                filter: hovered ? "brightness(0.92)" : "brightness(1)",
                transition: "filter 0.2s ease",
              }}
            />
          </div>

          {/* Ticker */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "13px",
              overflow: "hidden",
              padding: "0 16px",
            }}
          >
            <div className="bento-ticker-track">
              <span style={tickerTextStyle}>
                <strong>{lead.title}</strong>
                {" · "}
                <span style={{ color: "#888", fontWeight: 400 }}>{lead.artist}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              <span style={tickerTextStyle}>
                <strong>{lead.title}</strong>
                {" · "}
                <span style={{ color: "#888", fontWeight: 400 }}>{lead.artist}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </a>
      ) : null}
    </div>
  );
}

export function HomeV2WidgetBento({ data }: HomeV2WidgetBentoProps) {
  const lead = data?.lead ?? null;

  return (
    <div className="home-v2-widget-bento" style={{ width: "100%" }}>
      {/* >=1280px: 2x2 bento (Floor Plan + Listening / Reading + Creative License) */}
      <div className="hidden xl:flex xl:flex-col" style={{ gap: "16px", width: "594px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <FloorPlanTile style={{ width: "388px", height: "186px" }} />
          <ListeningTile lead={lead} style={{ width: "190px", height: "186px" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <ReadingTile style={{ width: "190px", height: "186px" }} />
          <CreativeLicenseTile style={{ width: "388px", height: "186px" }} />
        </div>
      </div>

      {/* <1280px: Floor Plan + Creative License only */}
      <div className="flex xl:hidden" style={{ gap: "16px", width: "100%" }}>
        <FloorPlanTile style={{ flex: "1 0 0", height: "186px" }} centerImage />
        <CreativeLicenseTile style={{ flex: "1 0 0", height: "186px" }} />
      </div>
    </div>
  );
}
