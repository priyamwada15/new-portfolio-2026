import { Fragment, type ReactNode } from "react";
import AnimatedCards from "./components/AnimatedCards";
import { HeroAiWord } from "./components/HeroAiWord";
import { HeroPriyamwadaWord } from "./components/HeroPriyamwadaWord";
import { HeroTerminalWord } from "./components/HeroTerminalWord";
import { HomepageUiStrip } from "./components/HomepageUiStrip";
import { SunlightEffect } from "./components/SunlightEffect";

const headlineFirstLine =
  "Hi, I'm Priyamwada. I design interfaces that work with and";
const headlineAiLine =
  "for AI. I work where the design needs me, on a canvas or in a";
const headlineTerminalLine = "terminal.";

function renderHeadlineWords(text: string, keyPrefix: string): ReactNode[] {
  return text.split(" ").map((word, i) => {
    if (word === "Priyamwada.") {
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          <span className="hero-name-slot">
            <HeroPriyamwadaWord />
          </span>
          .{" "}
        </Fragment>
      );
    }
    if (word === "AI.") {
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          <HeroAiWord />{" "}
        </Fragment>
      );
    }
    if (word === "terminal.") {
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          <HeroTerminalWord />{" "}
        </Fragment>
      );
    }
    return (
      <Fragment key={`${keyPrefix}-${i}`}>
        <span>{word}</span>{" "}
      </Fragment>
    );
  });
}

export default function Home() {
  return (
    <div>
      <SunlightEffect className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" />
      <div className="relative z-[2]">
      <section className="flex flex-col items-start w-[86%] max-w-[1008px] mx-auto mt-[76px] mb-[96px]">
        <div className="hero-headline-shell w-full max-w-[1008px]">
          <h1
            className="hero-headline flex w-full flex-col gap-[18px] text-[24px] font-normal leading-[130%] text-[#333333] md:text-[32px]"
            style={{ fontFamily: "var(--font-hind), sans-serif" }}
          >
            <span className="block">
              {renderHeadlineWords(headlineFirstLine, "l1")}
            </span>
            <span className="flex flex-col gap-[18px]">
              <span className="block">
                {renderHeadlineWords(headlineAiLine, "l2")}
              </span>
              <span className="block">
                {renderHeadlineWords(headlineTerminalLine, "l3")}
              </span>
            </span>
          </h1>
        </div>
      </section>

      <HomepageUiStrip />

      <div style={{ paddingBottom: "96px" }}>
        <AnimatedCards />
      </div>
      </div>
    </div>
  );
}
