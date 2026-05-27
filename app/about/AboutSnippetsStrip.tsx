"use client";

import Image from "next/image";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { useAboutBookHover } from "./AboutBookHoverContext";
import { SNIPPET_PHOTOS, SNIPPETS_HEADING, type SnippetPhoto } from "./aboutSnippetsContent";
import AboutPhotoStripScroll from "./AboutPhotoStripScroll";
import { CursorFollowTooltip } from "./CursorFollowTooltip";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

const PHOTO_CARD_SHADOW = "0px 4px 24px rgba(0, 0, 0, 0.12)";

type AboutSnippetsStripProps = {
  className?: string;
  headingClassName?: string;
  headingStyle?: React.CSSProperties;
};

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

export default function AboutSnippetsStrip({
  className,
  headingClassName,
  headingStyle,
}: AboutSnippetsStripProps = {}) {
  const { bookHover } = useAboutBookHover();

  return (
    <ScrollReveal className={cn("timeline-snap-section relative z-[4] mt-20 w-full max-w-[1008px]", className)}>
    <section
      className={cn(
        "relative w-full transition-[filter] duration-300 ease-out motion-reduce:transition-none",
        "max-lg:min-h-[577px] max-lg:overflow-visible lg:h-[577px]",
        bookHover !== null && "blur-md motion-reduce:blur-none"
      )}
      aria-labelledby="snippets-heading"
    >
      <h2
        id="snippets-heading"
        className={cn(
          "absolute left-0 top-[35px] text-[#555555]",
          headingClassName ??
            "max-w-[271px] text-[24px] font-medium leading-[130%]",
        )}
        style={{ ...figtree, ...headingStyle }}
      >
        {SNIPPETS_HEADING}
      </h2>

      <AboutPhotoStripScroll
        className="absolute left-0 top-0 h-full w-full"
        scrollClassName="h-full lg:overflow-visible"
        trackClassName="relative -left-[13.92px] h-[577.39px] w-[1036.35px] max-w-none shrink-0"
      >
        {SNIPPET_PHOTOS.map((photo) => (
          <SnippetPhotoCard key={photo.src} {...photo} />
        ))}
      </AboutPhotoStripScroll>
    </section>
    </ScrollReveal>
  );
}
