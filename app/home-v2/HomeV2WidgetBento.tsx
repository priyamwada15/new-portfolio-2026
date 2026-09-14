"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { homeBentoTileLabelStyle } from "@/design-system";
import type { ListeningWidgetData } from "@/app/lib/spotify";

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

// Title is always visible now (used to only reveal on hover).
const tileLabelStyle = {
  ...homeBentoTileLabelStyle,
  position: "absolute",
  left: "24px",
  top: "24px",
  fontSize: "14px",
  lineHeight: "17px",
  opacity: 1,
  zIndex: 1,
} satisfies CSSProperties;

// Speed-line dashes to the left of the F1 car, always visible now that the
// tile rests in what used to be the hover position.
const ARCADE_SPEED_LINES: Array<{ left: number; top: number; width: number }> = [
  { left: 0, top: 74, width: 19 },
  { left: 6, top: 82, width: 11 },
  { left: 12, top: 109, width: 8 },
  { left: 5, top: 125, width: 22 },
];

function ArcadeEffWonTile({ style }: { style: CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/arcade-effwon"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Arcade EffWon"
      className="cursor-hover-pointer"
      style={{ ...tileShellStyle, ...style, display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={tileLabelStyle}>Arcade EffWon</span>

      {/* Resting position now matches the old hover state; hovering plays a
          one-shot sweep — car and its speed lines exit right together
          (accelerating), reappear at left, and ease back into place. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...(hovered ? { animation: "arcade-car-sweep 1100ms linear" } : {}),
        }}
      >
        {ARCADE_SPEED_LINES.map((line, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              height: "6px",
              width: `${line.width}px`,
              left: `${line.left}px`,
              top: `${line.top}px`,
              background: "#D9D9D9",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            width: "min(346.79px, 90%)",
            aspectRatio: "346.79 / 99",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, calc(-50% + 28px))",
          }}
        >
          <Image
            src="/arcade-effwon/F1 Car.svg"
            alt="Arcade EffWon F1 car"
            fill
            sizes="347px"
            className="object-contain"
          />
        </div>
      </div>
    </a>
  );
}

// The card's border radius is asymmetric in Figma: top-left, top-right,
// bottom-right, bottom-left.
const INTELLIGENCER_CARD_RADIUS = "9.55px 9.55px 12.4885px 8.81538px";

function IntelligencerCardLayer({
  hovered,
  hoverRotationDeg,
  style,
  children,
}: {
  hovered: boolean;
  hoverRotationDeg: number;
  style: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "8.815px",
        boxSizing: "border-box",
        borderRadius: INTELLIGENCER_CARD_RADIUS,
        transform: `rotate(${hovered ? hoverRotationDeg : 0}deg)`,
        transition: `transform ${HOVER_DURATION} ${HOVER_EASE}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function IntelligencerTile({ style }: { style: CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/the-intelligencer"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open The Intelligencer"
      className="cursor-hover-pointer"
      style={{ ...tileShellStyle, ...style, display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={tileLabelStyle}>The Intelligencer</span>

      {/* Anchors the 3 stacked cards; each rotates independently on hover,
          same as the 3 matched Figma layers under smart animate. Sits at
          what used to be the hover position now that the label is always
          visible. */}
      <div
        style={{
          position: "absolute",
          width: "157.94px",
          height: "184.83px",
          left: "calc(50% - 157.94px/2 - 0.5px)",
          top: "54.68px",
        }}
      >
        {/* Back card (sage) */}
        <IntelligencerCardLayer
          hovered={hovered}
          hoverRotationDeg={20.27}
          style={{
            top: "21.374px",
            width: "140.31px",
            height: "163.45px",
            background: "#DBE3CA",
            border: "0.294px solid #DBE3CA",
          }}
        />

        {/* Middle card (olive) */}
        <IntelligencerCardLayer
          hovered={hovered}
          hoverRotationDeg={-9.3}
          style={{
            top: "21.374px",
            width: "140.31px",
            height: "163.45px",
            background: "#C8D984",
            border: "0.294px solid #DBE3CA",
          }}
        />

        {/* Front card: the actual article preview */}
        <IntelligencerCardLayer
          hovered={hovered}
          hoverRotationDeg={4.55}
          style={{
            top: "0px",
            width: "140.31px",
            height: "184.83px",
            display: "flex",
            flexDirection: "column",
            gap: "8.82px",
            padding: "8.815px",
            overflow: "hidden",
            background: "#FBFAF4",
            border: "0.294px solid rgba(0, 0, 0, 0.08)",
            boxShadow:
              "0px 4.408px 11.019px rgba(38, 58, 47, 0.09), 0px 0.735px 1.469px rgba(38, 58, 47, 0.05)",
          }}
        >
          {/* Badge + issue counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "2.204px 5.877px",
                background: "#C8D984",
                borderRadius: "2.204px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  fontSize: "4.408px",
                  lineHeight: "normal",
                  color: "#263A2F",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Models
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-sora), sans-serif",
                fontSize: "3.673px",
                lineHeight: "3.673px",
                color: "#69786C",
                whiteSpace: "nowrap",
              }}
            >
              01 / 03
            </span>
          </div>

          {/* Heading + paragraph */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5.877px", width: "100%" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sora), sans-serif",
                fontWeight: 700,
                fontSize: "13.223px",
                lineHeight: 1.2,
                letterSpacing: "-0.529px",
                color: "#263A2F",
                width: "100%",
              }}
            >
              Open-source models are moving from demos to dependable tools
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 300,
                fontSize: "5.877px",
                lineHeight: 1.45,
                letterSpacing: "-0.0477px",
                color: "#526258",
                width: "100%",
              }}
            >
              Community-built models are becoming easier to run, tune, and put into everyday products. The shift is less about one breakthrough release and more about a growing ecosystem of smaller, capable systems that can be inspected and adapted.
            </p>
          </div>

          {/* Footer: timestamp + source link */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingTop: "8.815px",
              width: "100%",
              opacity: 0.8,
              marginTop: "auto",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sora), sans-serif",
                fontSize: "4.408px",
                lineHeight: "4.408px",
                color: "#69786C",
                whiteSpace: "nowrap",
              }}
            >
              18 min ago
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "2.938px" }}>
              <span
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  fontSize: "4.408px",
                  lineHeight: "4.848px",
                  color: "#3E624C",
                  whiteSpace: "nowrap",
                }}
              >
                The Verge
              </span>
              <Image
                src="/26june-homepage-assets/intelligencer-external-link.svg"
                alt=""
                width={6}
                height={6}
              />
            </span>
          </div>
        </IntelligencerCardLayer>
      </div>
    </a>
  );
}

const KINETIC_PLATE_COUNT = 7;
const KINETIC_PLATE_STAGGER_MS = 70;

function KineticFacadeTile({ style }: { style: CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/kinetic-facade"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Kinetic Facade"
      className="cursor-hover-pointer"
      style={{ ...tileShellStyle, ...style, display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={tileLabelStyle}>Kinetic Facade</span>
      {/* Centered in the space below the label (not the whole tile) so the
          gap above and below the plates reads as balanced, now that the
          label is always visible and eats into what used to be top margin. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "69.5px",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          perspective: "320px",
        }}
      >
        {Array.from({ length: KINETIC_PLATE_COUNT }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "16px",
              height: "88px",
              borderRadius: "3px",
              background: "linear-gradient(180deg, #c98a52 0%, #b5652d 40%, #8f4d20 100%)",
              transformOrigin: "bottom",
              transform: "rotateX(0deg)",
              ...(hovered
                ? {
                    animation: "kinetic-plate-lift 900ms ease-in-out",
                    animationDelay: `${i * KINETIC_PLATE_STAGGER_MS}ms`,
                  }
                : {}),
            }}
          />
        ))}
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
      <span style={tileLabelStyle}>Reading</span>
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

const STELLAR_SCAN_HREF = "https://stellar-scan-eta.vercel.app/";

function StellarScanTile({ style }: { style: CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={STELLAR_SCAN_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Stellar Scan"
      className="cursor-hover-pointer"
      style={{ ...tileShellStyle, ...style, display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={tileLabelStyle}>Stellar Scan</span>
      {/* Figma positions this via a rotated-bounding-box wrapper that
          flex-centers the true-size image inside it before rotating. Rather
          than reproduce that wrapper, we rotate the image directly around
          its own center, at the pre-rotation top/left that puts its center
          in the same place the wrapper's centering would have. Sits at
          what used to be the hover position now that the label is always
          visible; only the rotation still changes on hover. */}
      <div
        style={{
          position: "absolute",
          width: "264.48px",
          height: "415.79px",
          left: "calc(50% - 116.38px)",
          top: "57.85px",
          borderRadius: "16px",
          overflow: "hidden",
          transform: `rotate(${hovered ? -10 : -5}deg)`,
          transition: `transform ${HOVER_DURATION} ${HOVER_EASE}`,
        }}
      >
        <Image
          src="/26june-homepage-assets/constellation-pegasus.png"
          alt="Stellar Scan constellation preview"
          fill
          sizes="265px"
          className="object-cover"
        />
      </div>
    </a>
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
      <span style={tileLabelStyle}>Listening</span>

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
          <ArcadeEffWonTile style={{ width: "388px", height: "186px" }} />
          <IntelligencerTile style={{ width: "190px", height: "186px" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <KineticFacadeTile style={{ width: "190px", height: "186px" }} />
          <StellarScanTile style={{ width: "388px", height: "186px" }} />
        </div>
      </div>

      {/* <1280px: Floor Plan + Creative License only */}
      <div className="flex xl:hidden" style={{ gap: "16px", width: "100%" }}>
        <ArcadeEffWonTile style={{ flex: "1 0 0", height: "186px" }} />
        <StellarScanTile style={{ flex: "1 0 0", height: "186px" }} />
      </div>
    </div>
  );
}
