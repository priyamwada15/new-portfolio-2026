import { Fragment } from "react";
import AnimatedCards from "./components/AnimatedCards";
import PlaySection from "./components/PlaySection";

const headline =
  "Product Designer turning complex AI systems and enterprise tools into experiences people actually understand.";
const words = headline.split(" ");

export default function Home() {
  return (
    <div>
      {/* Hero — centered */}
      <section className="flex flex-col items-center text-center w-[86%] max-w-[1238px] mx-auto mt-14 mb-20">
        {/* Available badge */}
        <div
          className="badge-animate flex items-center gap-2 mb-10 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "rgba(218,251,225,0.6)" }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: "#3B6D11" }}
          />
          <span
            className="text-[12px] font-semibold uppercase tracking-wide"
            style={{
              fontFamily: "var(--font-hind), sans-serif",
              color: "#3B6D11",
            }}
          >
            Available for full time roles
          </span>
        </div>

        {/* Hero headline — word-by-word fade + rise */}
        <h1
          className="font-normal text-[#333333] w-full"
          style={{
            fontFamily: "var(--font-ovo), serif",
            fontSize: "clamp(36px, 4.5vw, 56px)",
            lineHeight: 1.15,
            letterSpacing: "-0.3px",
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
      </section>

      {/* Project cards */}
      <div style={{ paddingBottom: "96px" }}>
        <AnimatedCards />
      </div>

      {/* Play / Side Quests */}
      <PlaySection />
    </div>
  );
}
