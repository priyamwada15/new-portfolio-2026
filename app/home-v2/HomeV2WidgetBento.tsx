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
  borderRadius: "24px",
  overflow: "hidden",
  flex: "none",
} satisfies CSSProperties;

const tileLabelPositionStyle = {
  position: "absolute",
  left: "24px",
  top: "24px",
  zIndex: 1,
} satisfies CSSProperties;

const tickerTextStyle = {
  fontFamily: "Figtree, sans-serif",
  fontSize: "10px",
  color: "#333",
} satisfies CSSProperties;

function FloorPlanTile({ style }: { style: CSSProperties }) {
  return (
    <a
      href="/floor-plan-version"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open the floor-plan homepage concept"
      className="cursor-hover-pointer bento-fp-tile"
      style={{ ...tileShellStyle, ...style, display: "block" }}
    >
      <span style={{ ...homeBentoTileLabelStyle, ...tileLabelPositionStyle }}>Floor Plan Version</span>
      <div className="bento-tilt-outer" style={{ position: "absolute", left: "52px", top: "59px" }}>
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
            src="/26june-homepage-assets/floor plan.png"
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
  return (
    <div style={{ ...tileShellStyle, ...style }}>
      <span style={{ ...homeBentoTileLabelStyle, ...tileLabelPositionStyle }}>Reading</span>
      <div
        style={{
          position: "absolute",
          width: "74.82px",
          height: "113.74px",
          left: "51.9px",
          top: "52.04px",
          borderRadius: "2px",
          overflow: "hidden",
          boxShadow: "4px 4px 20px rgba(0, 0, 0, 0.15)",
          transform: "rotate(6.74deg)",
        }}
      >
        <Image src="/26june-homepage-assets/book.png" alt="Currently reading" fill sizes="150px" className="object-cover" />
      </div>
    </div>
  );
}

function CreativeLicenseTile({ style }: { style: CSSProperties }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div
        className="cursor-hover-pointer bento-cl-tile"
        style={{ ...tileShellStyle, ...style }}
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Open Creative License"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightboxOpen(true); }}
      >
        <span style={{ ...homeBentoTileLabelStyle, ...tileLabelPositionStyle }}>About</span>
        <div className="bento-tilt-outer" style={{ position: "absolute", left: "40.21px", top: "34.48px" }}>
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
      <span style={{ ...homeBentoTileLabelStyle, ...tileLabelPositionStyle }}>Listening</span>

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
              left: "calc(50% - 44px)",
              top: "calc(50% - 44px + 4px)",
              width: "88px",
              height: "88px",
              border: "1.6px solid #fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: hovered
                ? "0px 8px 22px rgba(0,0,0,0.14), 0 0 0 1.5px #fff, 0 0 0 3px #d6336c"
                : "0px 8px 22px rgba(0,0,0,0.14)",
              transition: "box-shadow 0.2s ease",
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
    <div className="home-v2-widget-bento">
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
      <div className="flex xl:hidden" style={{ gap: "16px", width: "784px" }}>
        <FloorPlanTile style={{ flex: "1 0 0", height: "186px" }} />
        <CreativeLicenseTile style={{ flex: "1 0 0", height: "186px" }} />
      </div>
    </div>
  );
}
