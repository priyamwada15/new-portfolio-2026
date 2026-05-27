"use client";

import AboutSnippetsStrip from "../about/AboutSnippetsStrip";
import { AboutBookHoverProvider } from "../about/AboutBookHoverContext";

export function HomeV2SnippetsSection() {
  return (
    <AboutBookHoverProvider>
      <AboutSnippetsStrip
        className="mt-0"
        headingClassName="w-[152px] text-[18px] font-normal leading-[160%]"
        headingStyle={{ height: "29px" }}
      />
    </AboutBookHoverProvider>
  );
}
