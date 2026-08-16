import Link from "next/link";
import { fontStyle } from "@/design-system";
import { PLAY_PORTFOLIO_ITEMS } from "@/app/lib/playPortfolio";

// Figma-specified colors, tuned specifically for Playground's dark page —
// not promoted to design-system tokens since this is the only page using
// them (matching the same approach as Nav's dark-page icon color override).
const breadcrumbFontStyle: React.CSSProperties = {
  ...fontStyle.figtree,
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "17px",
  letterSpacing: "-0.02px",
};
const breadcrumbMutedStyle: React.CSSProperties = {
  ...breadcrumbFontStyle,
  color: "#767676",
};
const breadcrumbActiveStyle: React.CSSProperties = {
  ...breadcrumbFontStyle,
  color: "#E8E8E8",
};

// Stable id used as a programmatic focus target once the facade dissolves,
// and as a valid focus target itself (tabIndex={-1} keeps it out of the
// normal tab order).
export const PLAYGROUND_CARD_GRID_FOCUS_ID = "playground-card-grid";

type PlaygroundCardGridProps = {
  inert?: boolean;
};

export function PlaygroundCardGrid({ inert }: PlaygroundCardGridProps) {
  return (
    <div
      id={PLAYGROUND_CARD_GRID_FOCUS_ID}
      tabIndex={-1}
      inert={inert || undefined}
      className="relative z-[1] mx-auto w-[86%] max-w-[1008px] pt-[32px] pb-[96px] xl:pt-[72px] outline-none"
    >
      <div className="mb-8 flex flex-row items-center gap-2 py-2 pr-2">
        <Link href="/" className="cursor-hover-pointer" style={breadcrumbMutedStyle}>
          Home
        </Link>
        <span style={breadcrumbMutedStyle}>/</span>
        <span style={breadcrumbActiveStyle}>Play</span>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-12 tablet:grid-cols-2">
        {PLAY_PORTFOLIO_ITEMS.map((item) => {
          const tags = item.tagParts.slice(0, -1);
          return (
            <div key={item.id} className="flex flex-col gap-6">
              <div className="aspect-square w-full rounded-3xl bg-surface-card shadow-[0_0_0_5px_rgba(255,255,255,0.8)]" />
              <div className="flex items-center justify-between gap-14">
                <span className="text-on-dark grow">{item.title}</span>
                <div className="flex flex-none items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/10 px-3 py-1.5 text-xs font-medium text-on-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
