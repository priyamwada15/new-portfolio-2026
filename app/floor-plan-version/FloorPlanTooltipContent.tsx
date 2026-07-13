"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  TooltipContent as TooltipContentPrimitive,
  TooltipArrow as TooltipArrowPrimitive,
} from "@/app/components/animate-ui/primitives/tooltip";

type FloorPlanTooltipContentProps = {
  children: ReactNode;
};

/** Tooltip chrome for the floor-plan page only — hero headline pink (#95062c) background, white text, instead of the site-wide dark tooltip. */
export function FloorPlanTooltipContent({ children }: FloorPlanTooltipContentProps) {
  return (
    <TooltipContentPrimitive className="z-50 w-fit rounded-md bg-[#95062c]">
      <motion.div
        className="overflow-hidden px-3 py-1.5 text-xs text-balance text-white"
        style={{ fontFamily: "var(--font-hind), sans-serif" }}
      >
        <motion.div layout="preserve-aspect">{children}</motion.div>
      </motion.div>
      <TooltipArrowPrimitive
        className="fill-[#95062c] size-3 data-[side='bottom']:translate-y-[1px] data-[side='right']:translate-x-[1px] data-[side='left']:translate-x-[-1px] data-[side='top']:translate-y-[-1px]"
        tipRadius={2}
      />
    </TooltipContentPrimitive>
  );
}
