"use client";

import { useState, useEffect, useRef } from "react";
import VisualCaption from "../components/VisualCaption";
import LightMediaFrame from "../components/LightMediaFrame";

interface TabItem {
  label: string;
  desc: string;
  caption: string;
  videoSrc?: string;
  imageSrc?: string;
}

export default function TabbedSections({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active]);

  return (
    <div>
      {/* Tab pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={[
              "font-mono text-[12px] font-semibold tracking-wider border cursor-pointer",
              "transition-[background-color,color,border-color]",
              i === active
                ? "bg-ink text-surface border-ink"
                : "text-secondary border-border hover:border-secondary",
            ].join(" ")}
            style={{
              paddingBlock: "calc(var(--spacing) * 2)",
              paddingInline: "calc(var(--spacing) * 5)",
              borderRadius: "8px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description, body text only, no title or border */}
      <p className="font-sans text-base text-secondary leading-relaxed mb-6">
        {tabs[active].desc}
      </p>

      {/* Media, video or image, all in DOM so tab switches are instant */}
      {tabs.map((tab, i) => (
        <div key={tab.label} className={i === active ? "block" : "hidden"}>
          {tab.videoSrc ? (
            <LightMediaFrame className="w-full">
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={tab.videoSrc}
                muted
                playsInline
                loop
                preload="metadata"
                className="w-full max-w-full block"
              />
            </LightMediaFrame>
          ) : tab.imageSrc ? (
            <LightMediaFrame className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tab.imageSrc}
                alt={tab.caption}
                className="w-full"
                style={{ display: "block" }}
              />
            </LightMediaFrame>
          ) : null}
          <VisualCaption>{tab.caption}</VisualCaption>
        </div>
      ))}
    </div>
  );
}
