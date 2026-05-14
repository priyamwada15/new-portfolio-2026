"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/pixelact-ui/dialog";
import "@/components/ui/pixelact-ui/styles/styles.css";
import { Toaster } from "@/components/ui/sonner";
import AboutRaceGameOverlay from "./AboutRaceGameOverlay";
import AboutRaceStrip from "./AboutRaceStrip";

/** Public asset: `public/ASCII F1 Car.svg` */
const ASCII_F1_CAR_SRC = "/ASCII%20F1%20Car.svg";

type AboutPageClientProps = {
  aboutCopy: string;
};

export default function AboutPageClient({ aboutCopy }: AboutPageClientProps) {
  const [introOpen, setIntroOpen] = useState(true);
  const [gameRunning, setGameRunning] = useState(false);

  return (
    <>
      <Dialog
        open={introOpen}
        onOpenChange={(open) => {
          setIntroOpen(open);
          if (!open) setGameRunning(true);
        }}
      >
        <DialogContent className="max-h-[min(90vh,32rem)] overflow-y-auto sm:max-w-lg">
          <DialogTitle className="pr-10 text-xs leading-snug sm:text-sm">
            Before you play
          </DialogTitle>
          <DialogDescription className="pixel-font pt-1 text-left text-[0.625rem] leading-relaxed text-neutral-400 sm:text-xs">
            {aboutCopy}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <div className="relative min-h-dvh w-full bg-[#111111] text-neutral-200">
        <Toaster theme="dark" position="top-center" className="z-[200]" />
        <AboutRaceStrip carSrc={ASCII_F1_CAR_SRC} gameRunning={gameRunning} />

        <AboutRaceGameOverlay />
      </div>
    </>
  );
}
