"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { aboutTimelineAssets } from "./aboutAssets";
import { CursorFollowTooltip } from "./CursorFollowTooltip";

const PHOTO_CARD_SHADOW = "0px 4px 24px rgba(0, 0, 0, 0.12)";

function TimelinePhotoCard({
  src,
  alt,
  rotate,
  className,
  shadow = "box",
  tooltip,
}: {
  src: string;
  alt: string;
  rotate: string;
  className?: string;
  shadow?: "box" | "drop";
  tooltip: string;
}) {
  const card = (
    <div
      className={cn(
        "absolute box-border h-[250px] w-[250px] overflow-hidden rounded-[var(--ds-radius-container)] border-8 border-white",
        rotate,
        className
      )}
      style={
        shadow === "drop"
          ? { filter: "drop-shadow(0px 4px 24px rgba(0, 0, 0, 0.12))" }
          : { boxShadow: PHOTO_CARD_SHADOW }
      }
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="250px" />
    </div>
  );

  return <CursorFollowTooltip label={tooltip}>{card}</CursorFollowTooltip>;
}

export default function TimelinePhotoStripIub() {
  return (
    <div className="relative h-[396.62px] w-[643.57px] max-w-none">
      <TimelinePhotoCard
        src={aboutTimelineAssets.photoStripRobo}
        alt="Robot prototyping at IU"
        rotate="-rotate-8"
        className="left-0 top-[6.82px]"
        tooltip="My arduino mess"
      />
      <TimelinePhotoCard
        src={aboutTimelineAssets.photoStripMiddle}
        alt="Design work snapshot"
        rotate="rotate-[3.12deg]"
        className="left-[180.38px] top-[133.38px]"
        shadow="drop"
        tooltip="Thriller in Unity!"
      />
      <TimelinePhotoCard
        src={aboutTimelineAssets.photoStripWhatsapp}
        alt="Studio moment"
        rotate="rotate-[8deg]"
        className="left-[361.21px] top-0"
        tooltip="Selma, Leigh and me"
      />
    </div>
  );
}
