import Link from "next/link";
import { SunlightEffect } from "../components/SunlightEffect";
import { SUNLIGHT_SHADER_GITHUB_HREF } from "../lib/playPortfolio";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

/** Text links that turn rose on hover, matching the nav. */
const linkClass =
  "cursor-pointer font-medium text-[14px] leading-[17px] text-[#333333] no-underline transition-colors duration-200 ease-out hover:text-nav-active";

export default function SunlightPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "#ECEAE6" }}
    >
      <SunlightEffect />
      <div className="relative z-[2] flex min-h-screen w-full items-center justify-center gap-6 px-6">
        <Link href="/" className={linkClass} style={figtree} aria-label="Back to homepage">
          Back Home
        </Link>
        <a
          href={SUNLIGHT_SHADER_GITHUB_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          style={figtree}
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
