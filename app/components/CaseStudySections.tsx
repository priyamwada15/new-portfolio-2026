/**
 * Building blocks for the Sept 2026 case study layout, shared by every case study.
 * Brand colour comes from `--accent-dark`, which CaseStudyLayout sets per page.
 */
import {
  caseStudyCardLabel,
  caseStudyCardText,
  caseStudyEyebrow,
  caseStudyHeading,
  caseStudyRowTitle,
  caseStudySubheading,
  caseStudyText,
} from "@/design-system";

/** Heading on the left, body copy on the right, with an optional eyebrow above both. */
export function SectionHeader({
  eyebrow,
  title,
  subheading = false,
  titleAdornment,
  looseBody = false,
  bodyClassName,
  level = 2,
  children,
}: {
  eyebrow?: string;
  title: string;
  /** Decoration positioned absolutely against the heading (e.g. a sparkle icon). */
  titleAdornment?: React.ReactNode;
  /** 24px between body paragraphs instead of 16px. */
  looseBody?: boolean;
  /** Replaces the body column's default gap and top padding (e.g. for stat rows). */
  bodyClassName?: string;
  /** Heading level; use 3 for sub-rows inside a section. */
  level?: 2 | 3;
  /** Renders the 18px sub-heading style instead of the 24px section heading. */
  subheading?: boolean;
  children: React.ReactNode;
}) {
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <div className="flex w-full flex-col gap-2">
      {eyebrow && <p className={caseStudyEyebrow}>{eyebrow}</p>}
      <div className="flex w-full items-start gap-12">
        <div className="relative min-w-0 flex-1">
          <Heading className={subheading ? caseStudySubheading : caseStudyHeading}>{title}</Heading>
          {titleAdornment}
        </div>
        <div
          className={`${caseStudyText} flex min-w-0 flex-1 flex-col ${
            bodyClassName ?? `${looseBody ? "gap-6" : "gap-4"} ${subheading ? "" : "pt-2"}`
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Row of equal-width cards, each with a small label above its text.
 * `dark`: brand-filled cards with one line of medium text.
 * `stat`: light bordered cards with a large brand-coloured number above muted text.
 * `light`: pale brand cards with one or more paragraphs of body text.
 */
export function CardRow({
  cards,
  variant = "dark",
}: {
  /** `icon`: optional 16px image shown before the label. */
  cards: { label: string; text: string | string[]; icon?: string }[];
  variant?: "dark" | "stat" | "light";
}) {
  const stat = variant === "stat";
  const dark = variant === "dark" || stat;
  return (
    <div className={`flex w-full items-stretch ${dark ? "gap-6" : "gap-12"}`}>
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex min-w-0 flex-1 flex-col ${
            stat
              ? "gap-6 rounded-[16px] border border-border bg-surface-case-study px-[23px] py-[39px]"
              : `gap-3 rounded-[var(--ds-radius-container)] ${
                  dark
                    ? "border border-[var(--accent-dark)] bg-[var(--accent-dark)] px-[23px] py-[39px]"
                    : "bg-[var(--accent-light)] px-8 py-10"
                }`
          }`}
        >
          <div className="flex items-center gap-2">
            {card.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.icon} alt="" width={16} height={16} className="size-4 shrink-0" />
            )}
            <p
              className={
                stat
                  ? "font-label text-[32px] font-semibold leading-[38px] text-[var(--accent-dark)]"
                  : dark
                  ? `${caseStudyCardLabel} text-surface-page/50`
                  : "font-label text-[14px] font-semibold leading-[28px] text-[var(--accent-dark)]"
              }
            >
              {card.label}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {[card.text].flat().map((paragraph) => (
              <p
                key={paragraph}
                className={
                  stat
                    ? `${caseStudyCardText} text-tertiary`
                    : dark
                    ? `${caseStudyCardText} text-surface-page`
                    : "font-label text-[16px] leading-[28px] text-secondary"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** 1px tile border on each side — Figma offsets are measured inside it. */
const TILE_BORDER = 2;
const pct = (value: number, of: number) => `${(value / of) * 100}%`;

/**
 * Bordered tile holding a screenshot that is deliberately larger than the tile,
 * so it bleeds off the edges. `frame` is the tile's size in Figma; the image's
 * px offsets (measured inside the tile border) are converted to percentages so
 * the crop stays identical as the tile scales. Omit `left` and `right` to
 * centre the screenshot horizontally. The tile's own size comes from its parent.
 */
export function MediaTile({
  src,
  alt,
  className = "",
  frame,
  image,
}: {
  src: string;
  alt: string;
  className?: string;
  frame: { width: number; height: number };
  /** `radius` defaults to 16px. */
  image: { width: number; height: number; top: number; left?: number; right?: number; radius?: number };
}) {
  const innerW = frame.width - TILE_BORDER;
  const innerH = frame.height - TILE_BORDER;
  const centred = image.left === undefined && image.right === undefined;
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--ds-radius-container)] border border-border bg-surface-page ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute max-w-none border border-border object-cover shadow-[0_0_16px_3px_rgba(0,0,0,0.04)]"
        style={{
          width: pct(image.width, innerW),
          height: pct(image.height, innerH),
          borderRadius: image.radius ?? 16,
          top: pct(image.top, innerH),
          left: centred ? "50%" : image.left === undefined ? undefined : pct(image.left, innerW),
          right: image.right === undefined ? undefined : pct(image.right, innerW),
          transform: centred ? "translateX(-50%)" : undefined,
        }}
      />
    </div>
  );
}

/**
 * A 300px text column beside a cropped-screenshot tile. `imageSide` puts the
 * tile on the left or right; rows are meant to alternate. The tile keeps its
 * Figma aspect ratio (`media.frame`, default 668×346) as it scales.
 */
export function MediaRow({
  title,
  imageSide = "right",
  media,
  children,
}: {
  title: string;
  imageSide?: "left" | "right";
  media: Omit<React.ComponentProps<typeof MediaTile>, "className" | "frame"> & {
    frame?: { width: number; height: number };
  };
  children: React.ReactNode;
}) {
  const frame = media.frame ?? { width: 668, height: 346 };
  const text = (
    <div className="flex w-[300px] shrink-0 flex-col gap-4">
      <h3 className={caseStudyRowTitle}>{title}</h3>
      <div className={`${caseStudyText} flex flex-col gap-4`}>{children}</div>
    </div>
  );
  const tile = (
    <div className="min-w-0 flex-1" style={{ aspectRatio: `${frame.width} / ${frame.height}` }}>
      <MediaTile {...media} frame={frame} className="size-full" />
    </div>
  );
  return (
    <div className="flex w-full items-start gap-10">
      {imageSide === "left" ? tile : text}
      {imageSide === "left" ? text : tile}
    </div>
  );
}

/**
 * "Testimonials" section: eyebrow + heading, then quote cards side by side
 * (Figma 435px cards, 58px apart, inset 40px). Each card: quote, then the
 * name with a LinkedIn link and the person's title.
 */
export function Testimonials({
  title,
  items,
}: {
  title: string;
  items: { quote: string; name: string; title: string; linkedin: string }[];
}) {
  return (
    <section id="testimonials" className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-2">
        <p className={caseStudyEyebrow}>Testimonials</p>
        <h2 className={caseStudyHeading}>{title}</h2>
      </div>
      <div className="flex w-full items-stretch gap-[58px] px-10">
        {items.map((item) => (
          <figure
            key={item.name}
            className="flex min-w-0 flex-1 flex-col justify-center gap-4 rounded-[var(--ds-radius-container)] border border-border bg-surface-home p-6"
          >
            <blockquote className="font-label text-[14px] leading-[22px] text-secondary">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="flex flex-col gap-1">
              <span className="flex items-center gap-2">
                <span className="min-w-0 flex-1 font-label text-[14px] font-bold uppercase leading-[21px] text-[var(--accent-dark)]">
                  {item.name}
                </span>
                <a
                  href={item.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} on LinkedIn`}
                  className="shrink-0 cursor-pointer transition-opacity hover:opacity-60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/LinkedIn_icon.svg" alt="" width={16} height={16} className="size-4" />
                </a>
              </span>
              <span className="font-label text-[12px] leading-[1.5] text-secondary">{item.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
