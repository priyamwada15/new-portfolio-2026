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
      <section className="flex flex-col items-start w-[86%] max-w-[1008px] mx-auto mt-[76px] mb-[96px]">
        {/* Hero headline, word-by-word fade + rise */}
        <div className="flex min-h-[84px] w-full max-w-[1008px] items-center">
          <h1
            className="w-full text-[24px] font-normal leading-[130%] text-[#333333] md:text-[32px]"
            style={{ fontFamily: "var(--font-hind), sans-serif" }}
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
