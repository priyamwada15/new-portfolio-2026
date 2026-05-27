"use client";

import type { CSSProperties, ReactNode } from "react";
import { useHomeV2Video } from "./HomeV2VideoProvider";

type HomeV2PlayableCardProps = {
  videoSrc: string;
  videoLabel: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function HomeV2PlayableCard({
  videoSrc,
  videoLabel,
  className,
  style,
  children,
}: HomeV2PlayableCardProps) {
  const { openVideo } = useHomeV2Video();

  const open = () => openVideo({ src: videoSrc, label: videoLabel });

  return (
    <div
      className={className}
      style={{
        ...style,
        position: style?.position ?? "relative",
        zIndex: style?.zIndex ?? 2,
      }}
    >
      {children}
      <button
        type="button"
        className="absolute inset-0 z-20 m-0 cursor-inherit border-0 bg-transparent p-0"
        onClick={open}
        aria-label={`Play full video: ${videoLabel}`}
      />
    </div>
  );
}
