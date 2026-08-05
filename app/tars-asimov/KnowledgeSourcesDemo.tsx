"use client";

import { BookOpenText, TreeStructure } from "@phosphor-icons/react";
import { useState } from "react";
import AutoPauseVideo from "../components/AutoPauseVideo";

const TABS = [
  {
    id: "sources",
    label: "Add Knowledge Sources",
    icon: BookOpenText,
    videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785522096/Add_Sources_mt2bli.mp4",
  },
  {
    id: "channels",
    label: "Add Slack Channels",
    icon: TreeStructure,
    videoSrc: "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785522101/Add_Channels_us0vbk.mp4",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function KnowledgeSourcesDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("sources");
  const active = TABS.find((tab) => tab.id === activeTab)!;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-row items-center gap-1 pb-1.5 pt-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          const color = isActive ? "#333333" : "#A6A6A6";

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              aria-label={tab.label}
              className="cursor-hover-pointer flex flex-row items-center gap-1.5 rounded-[6px] px-2 py-1"
            >
              <Icon size={14} weight="regular" color={color} />
              <span className="hidden text-[12px] leading-[160%] sm:inline" style={{ color }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative aspect-[768/460] w-full">
        <AutoPauseVideo
          key={active.id}
          src={active.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${active.label} demo`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
