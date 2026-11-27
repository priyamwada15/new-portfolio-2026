import Image from "next/image";
import { caseStudyRowTitle, caseStudyText, caseStudyVisualTitle } from "@/design-system";
import { MediaWash, WASH_SCREEN_EDGE, washShadow } from "../../components/MediaWash";

const KIND_LABEL = {
  crop: "Screen",
  video: "Video",
  coded: "Coded demo",
} as const;

/** Space between the edge of the wash and a screen, in tile px at full width. */
const PAD = 48;

/**
 * The full-height crops are 1232 by 982 frame px, pre-scaled with Lanczos to twice the 846px a screen shows
 * at full width, as full-colour (4:4:4) AVIF. A larger file made the browser shrink it by 2.5x or more, which
 * aliases thin UI text; 2x shrinks cleanly and is 1:1 on a retina screen. They are served untouched
 * (`unoptimized`): Next's optimizer would re-encode them at quality 75 and blur the text.
 */
const FULL_CROP = { width: 1692, height: 1349 } as const;

/**
 * One visual on the showcase page: a bold title and one grey sentence above a
 * lilac wash, as on Shaun Tan's case studies. The sentence says what the
 * screen fixes. The tile keeps its Figma aspect ratio (1008px for a full-width
 * tile, 492px for half of a pair).
 *
 * - `src`: a full-height crop of a screen. It shows its top and sides and runs
 *   off the bottom of the wash, so only its top corners are rounded.
 * - `dialog`: a dialog cut to its own edges, floating whole in the middle of
 *   the wash at this width (in tile px). `radius` rounds it past any dark corner
 *   pixels left from the dimmed app behind it.
 * - neither: the empty wash, until the screen exists.
 * - `subgrid`: set on both tiles of a pair so their titles and tiles line up
 *   even when the text wraps differently.
 */
export function ShowcaseTile({
  title,
  text,
  size,
  src,
  alt = "",
  dialog,
  kind = "crop",
  subgrid = false,
}: {
  title: string;
  text: string;
  /** The tile's width and height in Figma px. */
  size: readonly [number, number];
  src?: string;
  alt?: string;
  dialog?: { width: number; imageSize: readonly [number, number]; radius?: number };
  kind?: keyof typeof KIND_LABEL;
  subgrid?: boolean;
}) {
  const [width, height] = size;
  const padX = (PAD / width) * 100;
  const padY = (PAD / height) * 100;
  return (
    <figure
      className={`m-0 min-w-0 ${subgrid ? "row-span-2 grid grid-rows-subgrid gap-y-4" : "flex flex-col gap-4"}`}
    >
      <figcaption className="flex flex-col gap-2">
        <h3 className={caseStudyRowTitle}>{title}</h3>
        <p className={`${caseStudyText} max-w-[640px]`}>{text}</p>
      </figcaption>
      <MediaWash style={{ aspectRatio: `${width} / ${height}` }}>
        {src && !dialog && (
          <Image
            src={src}
            alt={alt}
            width={FULL_CROP.width}
            height={FULL_CROP.height}
            unoptimized
            className="absolute h-auto max-w-none"
            style={{
              left: `${padX}%`,
              top: `${padY}%`,
              width: `${100 - padX * 2}%`,
              borderRadius: "10px 10px 0 0",
              boxShadow: washShadow(),
              border: WASH_SCREEN_EDGE,
              borderBottom: 0,
            }}
          />
        )}
        {src && dialog && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              width={dialog.imageSize[0]}
              height={dialog.imageSize[1]}
              unoptimized
              className="h-auto"
              style={{
                width: `${(dialog.width / width) * 100}%`,
                borderRadius: dialog.radius ?? 10,
                boxShadow: washShadow(),
                border: WASH_SCREEN_EDGE,
              }}
            />
          </div>
        )}
        {!src && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
            <p className={caseStudyVisualTitle}>Screen coming soon</p>
            <p className="font-label text-[12px] leading-[16px] text-secondary">
              {KIND_LABEL[kind]} {width} by {height}
            </p>
          </div>
        )}
      </MediaWash>
    </figure>
  );
}
