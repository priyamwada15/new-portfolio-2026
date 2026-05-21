import { Fragment, type ReactNode } from "react";
import AnimatedCards from "./components/AnimatedCards";
import { HeroCanvasWord } from "./components/HeroCanvasWord";
import { HeroComplexWord } from "./components/HeroComplexWord";
import { HeroTerminalWord } from "./components/HeroTerminalWord";
import { HomepageUiStrip } from "./components/HomepageUiStrip";
import { SunlightEffect } from "./components/SunlightEffect";

const headlineFirstLine =
  "Product Designer who turns complex systems into memorable experiences.";
const headlineSecondLine =
  "I work where the design needs me, on a canvas or in a terminal.";

function renderHeadlineWords(text: string, keyPrefix: string): ReactNode[] {
  return text.split(" ").map((word, i) => {
    if (word === "complex") {
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          <HeroComplexWord />
        </Fragment>
      );
    }
    if (word === "canvas") {
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          <HeroCanvasWord />
        </Fragment>
      );
    }
    if (word === "terminal" || word === "terminal.") {
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          <HeroTerminalWord />
        </Fragment>
      );
    }
    return (
      <Fragment key={`${keyPrefix}-${i}`}>
        <span>{word}</span>
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
        <h1
          className="hero-headline flex w-full max-w-[1008px] flex-wrap items-center gap-x-[0.35em] gap-y-[18px] text-[24px] font-normal leading-[130%] text-[#333333] md:text-[32px]"
          style={{ fontFamily: "var(--font-hind), sans-serif" }}
        >
          {renderHeadlineWords(headlineFirstLine, "l1")}
          {renderHeadlineWords(headlineSecondLine, "l2")}
        </h1>
      </section>

      <HomepageUiStrip />

      <div style={{ paddingBottom: "96px" }}>
        <AnimatedCards />
      </div>
      </div>
    </div>
  );
}
