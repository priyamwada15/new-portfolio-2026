import Link from "next/link";
import { SunlightEffect } from "../components/SunlightEffect";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

/** Matches play-card secondary CTA. */
const secondaryLinkClass =
  "group box-border inline-flex shrink-0 cursor-pointer flex-col items-stretch gap-1 no-underline";

export default function SunlightPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "#ECEAE6" }}
    >
      <SunlightEffect />
      <div className="relative z-[2] flex min-h-screen w-full items-center justify-center px-6">
        <Link href="/" className={secondaryLinkClass} aria-label="Back to homepage">
          <span
            className="font-medium text-[14px] leading-[17px] text-[#333333]"
            style={figtree}
          >
            Back Home
          </span>
          <span
            className="h-px w-full origin-left scale-x-0 bg-[#333333] transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
