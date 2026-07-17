import Link from "next/link";
import { CASE_STUDY_COLUMN_CLASS, fontStyle } from "@/design-system";

interface NextProjectCardProps {
  href: string;
  imageSrc: string;
  imageAlt: string;
  logoSrc: string;
  logoAlt: string;
  headline: string;
}

/** Case study footer card — links to the next project. Shared across all case study pages. */
export default function NextProjectCard({
  href,
  imageSrc,
  imageAlt,
  logoSrc,
  logoAlt,
  headline,
}: NextProjectCardProps) {
  return (
    // mt-[88px] + the case study article's own pb-16 (64px) = 152px gap above this card
    <div className={`${CASE_STUDY_COLUMN_CLASS} mt-[88px]`}>
      <Link
        href={href}
        className="block rounded-[var(--ds-radius-container)] bg-white pb-10 pt-8 transition-opacity hover:opacity-90"
      >
        <p
          className="text-center text-[14px] font-semibold leading-[150%] text-[#555555]"
          style={fontStyle.figtree}
        >
          Next Project
        </p>
        <div
          className="relative mx-auto mt-6 h-[325px] w-full max-w-[686px] overflow-hidden rounded-2xl border border-solid border-transparent box-border"
          style={{
            background:
              "linear-gradient(white, white) padding-box, linear-gradient(180deg, #E8E8E8 0%, rgba(232, 232, 232, 0) 100%) border-box",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white" />
        </div>
        <div className="mx-auto mt-6 flex w-full max-w-[550px] flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt={logoAlt} className="h-8 w-auto" />
          <p
            className="text-center text-[20px] font-medium leading-[140%] text-[#333333]"
            style={fontStyle.figtree}
          >
            {headline}
          </p>
        </div>
      </Link>
    </div>
  );
}
