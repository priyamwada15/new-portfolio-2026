import { Fragment, forwardRef } from "react";
import { ABOUT_HEADLINE } from "./aboutTimelineContent";

const figtree = { fontFamily: "var(--font-hind), sans-serif" } as const;

const headlineWords = ABOUT_HEADLINE.split(" ");

export const AboutAnimatedHeadline = forwardRef<
  HTMLHeadingElement,
  { className?: string }
>(function AboutAnimatedHeadline({ className }, ref) {
  return (
    <h2 ref={ref} className={className} style={figtree}>
      {headlineWords.map((word, i) => (
        <Fragment key={i}>
          <span
            className="word-animate"
            style={{ transitionDelay: `${160 + i * 50}ms` }}
          >
            {word}
          </span>{" "}
        </Fragment>
      ))}
    </h2>
  );
});
