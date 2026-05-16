"use client";

import { cn } from "@/lib/utils";
import AboutTimeline from "./AboutTimeline";
import { useAboutBookHover } from "./AboutBookHoverContext";

export default function AboutTimelinePanel() {
  const { bookHover } = useAboutBookHover();

  return (
    <div
      className={cn(
        "min-w-0 flex-1 transition-[filter] duration-300 ease-out motion-reduce:transition-none",
        bookHover !== null && "blur-md motion-reduce:blur-none"
      )}
    >
      <AboutTimeline />
    </div>
  );
}
