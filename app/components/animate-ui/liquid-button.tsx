"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export type LiquidButtonProps = Omit<HTMLMotionProps<"a">, "children"> & {
  children: React.ReactNode;
  /** Delay before the fill animation (seconds). */
  delay?: number;
  /** Reserved for API parity with Animate UI; fill always covers the button. */
  fillHeight?: string | number;
  hoverScale?: number;
  tapScale?: number;
};

const ease = [0.23, 1, 0.32, 1] as const;

export function LiquidButton({
  className,
  children,
  delay = 0,
  fillHeight: _fillHeight,
  hoverScale = 1.05,
  tapScale = 0.95,
  style,
  ...props
}: LiquidButtonProps) {
  return (
    <motion.a
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#111111] px-5 py-2.5 outline-none select-none",
        "text-[14px] font-semibold tracking-wide",
        "focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]",
        className
      )}
      style={{
        fontFamily: "var(--font-hind), sans-serif",
        color: "var(--liquid-button-color, #111111)",
        backgroundColor: "var(--liquid-button-background-color, rgba(253,253,253,0.35))",
        ...style,
      }}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={{
        rest: { scale: 1 },
        hover: { scale: hoverScale },
        tap: { scale: tapScale },
      }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      {...props}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 origin-bottom bg-[#111111]"
        variants={{
          rest: {
            scaleY: 0,
            transition: { duration: 0.3, ease },
          },
          hover: {
            scaleY: 1,
            transition: { duration: 0.42, delay, ease },
          },
          tap: { scaleY: 1 },
        }}
      />
      <span className="relative z-[1] flex items-center justify-center gap-2.5 text-[#111111] transition-colors duration-300 group-hover:text-[#FDFDFD]">
        {children}
      </span>
    </motion.a>
  );
}
