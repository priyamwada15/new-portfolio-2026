import { ROCKET_MORTGAGE_CARD_VIDEOS } from "@/app/lib/caseStudy";
import { cn } from "@/lib/utils";

type RocketMortgageTripleVideosProps = {
  className?: string;
};

/** Three Rocket Assist phone videos — shared by homepage card and case study hero. */
export function RocketMortgageTripleVideos({ className }: RocketMortgageTripleVideosProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full min-w-0 overflow-hidden sm:aspect-[16/10]",
        className,
      )}
    >
      <div className="absolute inset-0 grid grid-cols-2 gap-2 tablet:grid-cols-3 sm:gap-3 md:gap-4">
        {ROCKET_MORTGAGE_CARD_VIDEOS.map((src, index) => (
          <div
            key={src}
            className={cn(
              "relative min-h-0 min-w-0 overflow-hidden",
              index === 2 && "hidden tablet:block",
            )}
          >
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-bottom"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
