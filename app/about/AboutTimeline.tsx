import Image from "next/image";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { cn } from "@/lib/utils";
import { AboutAnimatedHeadline } from "./AboutAnimatedHeadline";
import { ROCKET_MORTGAGE_ICON_SRC, TARS_ICON_SRC } from "./aboutAssets";
import {
  TIMELINE_DATES,
  TIMELINE_ENTRIES,
  type TimelineEntry,
} from "./aboutTimelineContent";
import TimelineScrollStage from "./TimelineScrollStage";
import { RocketMortgagePhoto } from "./RocketMortgagePhoto";
import TimelinePhotoStripIub from "./TimelinePhotoStripIub";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

const PHOTO_CARD_SHADOW = "0px 4px 24px rgba(0, 0, 0, 0.12)";

const CHIP_SHADOW = "0px 4px 24px rgba(0, 0, 0, 0.08)";

function TimelineDateBadge({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-[#333333] px-3 py-2.5">
      <span
        className="text-center text-[14px] font-medium leading-[130%] text-[#F4F1EB]"
        style={figtree}
      >
        {label}
      </span>
    </div>
  );
}

export const TIMELINE_SECTION_GAP_CLASS = "h-20";

export function TimelineRow({
  dateLabel,
  children,
  contentClassName,
  badgeMarker,
  snapPoint,
}: {
  dateLabel: string;
  children: React.ReactNode;
  contentClassName?: string;
  badgeMarker?: "first" | "last";
  snapPoint?: "always" | "edge";
}) {
  return (
    <div className="flex items-start gap-6">
      <div
        data-timeline-badge={badgeMarker}
        className={cn(
          "relative z-10 w-[163px] shrink-0",
          snapPoint === "always" && "timeline-chapter-snap",
          snapPoint === "edge" &&
            "timeline-chapter-snap timeline-chapter-snap-edge"
        )}
      >
        <TimelineDateBadge label={dateLabel} />
      </div>
      <div className={cn("min-w-0 flex-1 max-w-[457px]", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

function ScholarLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#858585] underline decoration-dotted underline-offset-[3px] transition-opacity hover:opacity-80"
      style={figtree}
    >
      {children}
    </a>
  );
}

function TimelineEntryBody({
  body,
  bodyLink,
}: Pick<TimelineEntry, "body" | "bodyLink">) {
  if (bodyLink) {
    return (
      <p
        className="text-[14px] font-normal leading-[140%] text-[#555555]"
        style={figtree}
      >
        {bodyLink.before}
        <ScholarLink href={bodyLink.href}>{bodyLink.linkText}</ScholarLink>
        {bodyLink.after}
      </p>
    );
  }

  return (
    <p
      className="text-[14px] font-normal leading-[140%] text-[#555555]"
      style={figtree}
    >
      {body}
    </p>
  );
}

function CompanyChip({
  iconSrc,
  iconAlt,
  name,
  href,
  borderWidth = 1,
  hoverable = true,
  className: classNameProp,
}: {
  iconSrc: string;
  iconAlt: string;
  name: string;
  href?: string;
  borderWidth?: 1 | 2;
  hoverable?: boolean;
  className?: string;
}) {
  const className = cn(
    "inline-flex w-fit max-w-full shrink-0 self-start items-center gap-2 rounded-md border-[#F3F3F3] bg-[#FDFDFD] px-2 py-1.5 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/30",
    hoverable && "transition-opacity hover:opacity-80",
    borderWidth === 2 ? "border-2" : "border",
    classNameProp
  );

  const content = (
    <>
      <Image src={iconSrc} alt={iconAlt} width={32} height={32} className="shrink-0" />
      <span
        className="text-[14px] font-medium leading-[140%] text-[#555555]"
        style={figtree}
      >
        {name}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{ boxShadow: CHIP_SHADOW }}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} style={{ boxShadow: CHIP_SHADOW }}>
      {content}
    </div>
  );
}

export function TimelineEntryBlock({ title, body, bodyLink, company }: TimelineEntry) {
  return (
    <article className="flex max-w-[457px] flex-col gap-4">
      <h3
        className="text-[16px] font-medium leading-[140%] text-[#333333]"
        style={figtree}
      >
        {title}
      </h3>
      <TimelineEntryBody body={body} bodyLink={bodyLink} />
      {company === "tars" && (
        <CompanyChip
          iconSrc={TARS_ICON_SRC}
          iconAlt=""
          name="Tars Technologies"
          href="https://hellotars.com/"
        />
      )}
    </article>
  );
}

export function RocketMortgagePhotoRow() {
  return (
    <div className="flex items-center">
      <RocketMortgagePhoto />
      <CompanyChip
        iconSrc={ROCKET_MORTGAGE_ICON_SRC}
        iconAlt=""
        name="Rocket Mortgage"
        borderWidth={2}
        hoverable={false}
        className="relative z-10"
      />
    </div>
  );
}

export default function AboutTimeline() {
  const [entry1, entry2, entry3, entry4] = TIMELINE_ENTRIES;

  return (
    <section className="max-w-[644px]" aria-label="Career timeline">
      <AboutAnimatedHeadline className="max-w-[644px] text-[32px] font-semibold leading-[130%] text-[#333333] lg:hidden" />

      <div className="mt-[73px] flex flex-col gap-10 lg:mt-0 lg:gap-0">
        <div className="flex flex-col gap-20 lg:hidden">
          <ScrollReveal revealOnMount className="flex flex-col gap-4">
            <TimelineDateBadge label={TIMELINE_DATES[0]} />
            <TimelineEntryBlock {...entry1} />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-4">
            <TimelineDateBadge label={TIMELINE_DATES[1]} />
            <TimelineEntryBlock {...entry2} />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-4">
            <TimelineDateBadge label={TIMELINE_DATES[2]} />
            <TimelineEntryBlock {...entry3} />
            <div className="relative left-1/2 mt-2 w-[min(100%,643.57px)] -translate-x-1/2 overflow-x-auto">
              <TimelinePhotoStripIub />
            </div>
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-4">
            <TimelineDateBadge label={TIMELINE_DATES[3]} />
            <TimelineEntryBlock {...entry4} />
            <RocketMortgagePhotoRow />
          </ScrollReveal>
        </div>

        <div className="hidden lg:block">
          <TimelineScrollStage />
        </div>
      </div>
    </section>
  );
}
