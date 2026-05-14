import { Fragment } from "react";
import AnimatedCards from "./components/AnimatedCards";
import { SunlightEffect } from "./components/SunlightEffect";

const headline =
  "Hi, I'm Priyamwada, a Product Designer specializing in AI-native interfaces. I work where the design needs me, on paper or an IDE.";
const words = headline.split(" ");

export default function Home() {
  return (
    <div>
      <SunlightEffect className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" />
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative z-[2]">
      {/* Hero */}
      <section className="flex flex-col items-start w-[86%] max-w-[1008px] mx-auto mt-14 mb-[120px]">
        {/* Available badge */}
        <div
          className="badge-animate mb-10 box-border flex h-[30px] w-[176px] max-w-full shrink-0 flex-row items-center justify-center gap-2 whitespace-nowrap rounded-lg p-2"
          style={{ backgroundColor: "rgba(218, 251, 225, 0.6)" }}
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: "#4AC26B" }}
          />
          <span
            className="flex shrink-0 items-center text-center text-[12px] font-normal"
            style={{
              fontFamily: "var(--font-hind), sans-serif",
              color: "#333333",
              lineHeight: "14px",
            }}
          >
            Available for full-time roles
          </span>
        </div>

        {/* Hero headline, word-by-word fade + rise */}
        <div className="flex min-h-[84px] w-full max-w-[1008px] items-center">
          <h1
            className="w-full font-normal"
            style={{
              fontFamily: "var(--font-hind), sans-serif",
              fontSize: "32px",
              lineHeight: "130%",
              color: "#333333",
            }}
          >
            {words.map((word, i) => (
              <Fragment key={i}>
                <span
                  className="word-animate"
                  style={{ transitionDelay: `${160 + i * 60}ms` }}
                >
                  {word}
                </span>
                {" "}
              </Fragment>
            ))}
          </h1>
        </div>
      </section>

      {/* Project cards */}
      <div style={{ paddingBottom: "96px" }}>
        <AnimatedCards />
      </div>
      </div>
    </div>
  );
}
