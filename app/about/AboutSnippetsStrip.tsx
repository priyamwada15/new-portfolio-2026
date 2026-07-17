"use client";

import Image from "next/image";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { useAboutBookHover } from "./AboutBookHoverContext";
import { SNIPPET_PHOTOS, SNIPPETS_HEADING, type SnippetPhoto } from "./aboutSnippetsContent";
import AboutPhotoStripScroll from "./AboutPhotoStripScroll";
import { CursorFollowTooltip } from "./CursorFollowTooltip";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

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
  const cardStyle = {
    left,
    top,
    width,
    height,
    "--snippet-rot": `${rotateDeg}deg`,
  } satisfies React.CSSProperties & Record<"--snippet-rot", string>;

  const card = (
    <div
      className="snippet-photo-card absolute box-border overflow-hidden rounded-[var(--ds-radius-container)] border-8 border-white"
      style={cardStyle}
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
    <ScrollReveal className={cn("relative z-[4] mt-20 w-full max-w-[1008px] overflow-visible", className)}>
    <section
      className={cn(
        "relative w-full transition-[filter] duration-300 ease-out motion-reduce:transition-none",
        "overflow-visible max-lg:min-h-[577px] lg:h-[577px]",
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
