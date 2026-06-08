"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { fontFamily, fontStyle, homeSnippetLabelStyle } from "@/design-system";
import type { ListeningWidgetData } from "@/app/lib/spotify";
import { HomeListeningDial } from "./HomeListeningDial";

const ACCENT = "var(--ds-color-accent-terminal)";

/** Eyebrow label (DM Mono, uppercase, tracked) shared by "Playing now" / "Earlier today". */
const eyebrowStyle = {
  fontFamily: fontFamily.mono,
  fontSize: "10px",
  letterSpacing: "0.08em",
  lineHeight: "12px",
  textTransform: "uppercase",
} satisfies CSSProperties;

const trackTitleStyle = {
  ...fontStyle.body,
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "120%",
  color: "var(--ds-text-primary)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: 0,
} satisfies CSSProperties;

const trackArtistStyle = {
  ...fontStyle.body,
  fontSize: "13px",
  lineHeight: "130%",
  color: "var(--ds-text-muted)",
} satisfies CSSProperties;

const timeLabelStyle = {
  fontFamily: fontFamily.mono,
  fontSize: "11px",
  lineHeight: "14px",
  color: "var(--ds-text-faint)",
} satisfies CSSProperties;

const captionTitleStyle = {
  ...fontStyle.body,
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "130%",
  color: "var(--ds-text-primary)",
  whiteSpace: "nowrap",
} satisfies CSSProperties;

const captionMetaStyle = {
  ...fontStyle.body,
  fontSize: "11px",
  lineHeight: "130%",
  color: "var(--ds-text-faint)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
} satisfies CSSProperties;

const THUMBNAIL_SIZE_PX = 36;

type HomeV2ListeningWidgetProps = {
  data: ListeningWidgetData | null;
};

export function HomeV2ListeningWidget({ data }: HomeV2ListeningWidgetProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLeadHovered, setIsLeadHovered] = useState(false);

  if (!data) return null;

  const { lead, earlierToday } = data;
  const hovered = hoveredIndex !== null ? earlierToday[hoveredIndex] : null;
  const isNowPlaying = lead.status === "now-playing";

  return (
    <div className="home-v2-listening-widget" style={{ width: "480px" }}>
      <HomeListeningDial />

      <div style={homeSnippetLabelStyle}>
        <span aria-hidden>🎵</span>
        <span>Listening</span>
      </div>

      {/* Lead track: now playing, or last played if nothing's active */}
      <a
        href={lead.spotifyUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${lead.title} by ${lead.artist} on Spotify`}
        className="cursor-hover-pointer"
        onMouseEnter={() => setIsLeadHovered(true)}
        onMouseLeave={() => setIsLeadHovered(false)}
        onFocus={() => setIsLeadHovered(true)}
        onBlur={() => setIsLeadHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--listening-art-to-text-gap, 16px)",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          className="transition-shadow duration-200 ease-out"
          style={{
            position: "relative",
            width: "88px",
            height: "88px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "2px solid var(--ds-color-on-dark)",
            boxShadow: isLeadHovered
              ? `0px 8px 22px rgba(0, 0, 0, 0.14), 0 0 0 1.5px var(--ds-color-on-dark), 0 0 0 3px ${ACCENT}`
              : "0px 8px 22px rgba(0, 0, 0, 0.14)",
            flexShrink: 0,
          }}
        >
          <Image
            src={lead.albumArtUrl}
            alt={`${lead.title} album art`}
            fill
            sizes="88px"
            className="object-cover transition-[filter] duration-300 ease-out"
            style={{ filter: isLeadHovered ? "brightness(0.92)" : "brightness(1)" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, gap: "var(--listening-label-to-track-gap, 8px)" }}>
          <div style={{ ...eyebrowStyle, color: isNowPlaying ? ACCENT : "var(--ds-text-quiet)" }}>
            {isNowPlaying ? "Playing now" : "Last played"}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", minWidth: 0 }}>
            <span style={{ ...trackTitleStyle, flex: 1 }}>{lead.title}</span>
            <span style={{ ...trackArtistStyle, flexShrink: 0 }}>{lead.artist}</span>
          </div>

          {lead.status === "now-playing" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "var(--listening-track-to-progress-gap, 4px)" }}>
              <div
                style={{
                  position: "relative",
                  height: "3px",
                  borderRadius: "2px",
                  background: "var(--ds-color-border-media)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${lead.progressPercent}%`,
                    borderRadius: "2px",
                    background: ACCENT,
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={timeLabelStyle}>{lead.elapsed}</span>
                <span style={timeLabelStyle}>{lead.duration}</span>
              </div>
            </div>
          ) : (
            <span style={{ ...timeLabelStyle, marginTop: "var(--listening-track-to-progress-gap, 4px)" }}>
              {lead.playedAgo}
            </span>
          )}
        </div>
      </a>

      {/* Earlier today */}
      {earlierToday.length > 0 ? (
      <div
        style={{
          marginTop: "var(--listening-section-gap, 24px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "20px", display: "flex", alignItems: "center" }}>
          <span style={{ ...eyebrowStyle, color: "var(--ds-text-quiet)" }}>Earlier today</span>
        </div>

        <div
          style={{
            marginTop: "var(--listening-earlier-today-gap, 8px)",
            display: "flex",
            alignItems: "center",
            gap: "var(--listening-thumbnail-gap, 12px)",
          }}
        >
          {earlierToday.map((track, index) => (
            <a
              key={track.title}
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${track.title} by ${track.artist} on Spotify, played ${track.playedAgo}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              className="cursor-hover-pointer transition-shadow duration-200 ease-out"
              style={{
                position: "relative",
                width: `${THUMBNAIL_SIZE_PX}px`,
                height: `${THUMBNAIL_SIZE_PX}px`,
                borderRadius: "5px",
                overflow: "hidden",
                flexShrink: 0,
                boxShadow:
                  hoveredIndex === index
                    ? `0 0 0 1.5px var(--ds-color-on-dark), 0 0 0 3px ${ACCENT}`
                    : "0 0 0 0px transparent",
              }}
            >
              <Image
                src={track.albumArtUrl}
                alt=""
                fill
                sizes={`${THUMBNAIL_SIZE_PX}px`}
                className="object-cover transition-[filter] duration-300 ease-out"
                style={{ filter: hoveredIndex === index ? "brightness(0.92)" : "brightness(1)" }}
              />
            </a>
          ))}
        </div>

        {/* Fixed-height caption takeover — reserves space so revealing the
            hovered track's name never shifts the layout. */}
        <div
          className="transition-opacity duration-200 ease-out"
          style={{
            marginTop: "var(--listening-caption-gap, 12px)",
            height: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            opacity: hovered ? 1 : 0,
            overflow: "hidden",
          }}
        >
          <span style={captionTitleStyle}>{hovered?.title ?? ""}</span>
          <span style={captionMetaStyle}>
            {hovered ? `${hovered.artist}, ${hovered.playedAgo}` : ""}
          </span>
        </div>
      </div>
      ) : null}
    </div>
  );
}
