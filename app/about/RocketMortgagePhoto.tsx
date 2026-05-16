"use client";

import Image from "next/image";
import { aboutTimelineAssets } from "./aboutAssets";
import { CursorFollowTooltip } from "./CursorFollowTooltip";

const PHOTO_CARD_SHADOW = "0px 4px 24px rgba(0, 0, 0, 0.12)";

export function RocketMortgagePhoto() {
  return (
    <CursorFollowTooltip label="First day @Rocket">
      <div
        className="relative z-0 -mr-10 h-[250px] w-[250px] shrink-0 -rotate-8 overflow-hidden rounded-[24px] border-8 border-white box-border"
        style={{ boxShadow: PHOTO_CARD_SHADOW }}
      >
        <Image
          src={aboutTimelineAssets.rocketMortgagePhoto}
          alt="Rocket Mortgage internship"
          fill
          className="object-cover"
          sizes="250px"
        />
      </div>
    </CursorFollowTooltip>
  );
}
