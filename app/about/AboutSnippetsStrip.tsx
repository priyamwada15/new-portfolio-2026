"use client";

import Image from "next/image";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { useAboutBookHover } from "./AboutBookHoverContext";
import { SNIPPET_PHOTOS, SNIPPETS_HEADING, type SnippetPhoto } from "./aboutSnippetsContent";
import { CursorFollowTooltip } from "./CursorFollowTooltip";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

const PHOTO_CARD_SHADOW = "0px 4px 24px rgba(0, 0, 0, 0.12)";

function SnippetPhotoCard({
  src,
  alt,
  width,
  height,
  left,
  top,
  rotateDeg,
  tooltip,
}: SnippetPhoto) {
  const card = (
    <div
      className="absolute box-border overflow-hidden rounded-[24px] border-8 border-white"
      style={{
        left,
        top,
        width,
        height,
        boxShadow: PHOTO_CARD_SHADOW,
        transform: `rotate(${rotateDeg}deg)`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${width}px`}
      />
    </div>
  );

  if (tooltip) {
    return <CursorFollowTooltip label={tooltip}>{card}</CursorFollowTooltip>;
  }

  return card;
}

export default function AboutSnippetsStrip() {
  const { bookHover } = useAboutBookHover();

  return (
    <ScrollReveal className="timeline-snap-section relative z-[4] mt-20 w-full max-w-[1008px]">
    <section
      className={cn(
        "relative h-[577px] w-full transition-[filter] duration-300 ease-out motion-reduce:transition-none",
        bookHover !== null && "blur-md motion-reduce:blur-none"
      )}
      aria-labelledby="snippets-heading"
    >
      <h2
        id="snippets-heading"
        className="absolute left-0 top-[35px] max-w-[271px] text-[24px] font-medium leading-[130%] text-[#555555]"
        style={figtree}
      >
        {SNIPPETS_HEADING}
      </h2>

      <div className="absolute left-0 top-0 h-full w-full overflow-x-auto overflow-y-visible lg:overflow-visible">
        <div className="relative -left-[13.92px] h-[577.39px] w-[1036.35px] max-w-none shrink-0">
          {SNIPPET_PHOTOS.map((photo) => (
            <SnippetPhotoCard key={photo.src} {...photo} />
          ))}
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
}
