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
      <div className="absolute inset-0 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {ROCKET_MORTGAGE_CARD_VIDEOS.map((src) => (
          <div key={src} className="relative min-h-0 min-w-0 overflow-hidden">
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
