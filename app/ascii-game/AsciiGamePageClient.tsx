"use client";

import "@/components/ui/pixelact-ui/styles/styles.css";
import { Toaster } from "@/components/ui/sonner";
import AboutRaceGameOverlay from "../about/AboutRaceGameOverlay";
import AboutRaceStrip from "../about/AboutRaceStrip";

/** Public asset: `public/ASCII F1 Car.svg` */
const ASCII_F1_CAR_SRC = "/ASCII%20F1%20Car.svg";

/** Lane game only: no about-page intro dialog; game starts immediately. */
export default function AsciiGamePageClient() {
  return (
    <div className="relative min-h-dvh w-full bg-[#111111] text-neutral-200">
      <Toaster theme="dark" position="top-center" className="z-[200]" />
      <AboutRaceStrip carSrc={ASCII_F1_CAR_SRC} gameRunning />
      <AboutRaceGameOverlay />
    </div>
  );
}
