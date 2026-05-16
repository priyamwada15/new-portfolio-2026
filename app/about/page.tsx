import type { Metadata } from "next";
import { SunlightEffect } from "../components/SunlightEffect";
import { AboutBookHoverProvider } from "./AboutBookHoverContext";
import AboutLeftSticky from "./AboutLeftSticky";
import AboutSnippetsStrip from "./AboutSnippetsStrip";
import AboutTimelinePanel from "./AboutTimelinePanel";

export const metadata: Metadata = {
  title: "About | Priyamwada Pandey",
  description: "About Priyamwada Pandey, product designer.",
};

export default function AboutPage() {
  return (
    <AboutBookHoverProvider>
      <SunlightEffect className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" />
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative z-[2] mx-auto w-[86%] max-w-[1008px]">
        <main
          aria-label="About"
          className="flex flex-col gap-12 pt-4 lg:flex-row lg:items-start lg:gap-16"
        >
          <AboutLeftSticky />
          <AboutTimelinePanel />
        </main>
        <AboutSnippetsStrip />
      </div>
    </AboutBookHoverProvider>
  );
}
