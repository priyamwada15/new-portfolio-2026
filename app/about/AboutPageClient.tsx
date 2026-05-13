"use client";

import Link from "next/link";
import { Button } from "@/components/ui/pixelact-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/pixelact-ui/dialog";
import "@/components/ui/pixelact-ui/styles/styles.css";
import { cn } from "@/lib/utils";
import AboutRaceStrip from "./AboutRaceStrip";

/** Public asset: `public/ASCII F1 Car.svg` */
const ASCII_F1_CAR_SRC = "/ASCII%20F1%20Car.svg";

const X_PROFILE_HREF = "https://x.com/PriymwadaPandey";

const DPAD_CELL = "flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12";

function MovementPad() {
  return (
    <div
      className="grid w-fit grid-cols-3 gap-1.5"
      role="group"
      aria-label="Movement controls"
    >
      <div className={DPAD_CELL} aria-hidden="true" />
      <DpadKey rotation={0} />
      <div className={DPAD_CELL} aria-hidden="true" />
      <DpadKey rotation={-90} />
      <div className={DPAD_CELL} aria-hidden="true" />
      <DpadKey rotation={90} />
      <div className={DPAD_CELL} aria-hidden="true" />
      <DpadKey rotation={180} />
      <div className={DPAD_CELL} aria-hidden="true" />
    </div>
  );
}

function DpadKey({ rotation }: { rotation: number }) {
  return (
    <div className={DPAD_CELL}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        tabIndex={-1}
        aria-hidden="true"
        className="box-border flex h-full min-h-0 w-full min-w-0 items-center justify-center px-0 py-0 text-sm sm:text-base"
      >
        <span
          className={cn(
            "inline-flex items-center justify-center leading-none",
            rotation === 0 && "rotate-0",
            rotation === 90 && "rotate-90",
            rotation === 180 && "rotate-180",
            rotation === -90 && "-rotate-90"
          )}
          aria-hidden="true"
        >
          ↑
        </span>
      </Button>
    </div>
  );
}

type AboutPageClientProps = {
  aboutCopy: string;
};

export default function AboutPageClient({ aboutCopy }: AboutPageClientProps) {
  return (
    <>
      <Dialog defaultOpen>
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
        <AboutRaceStrip carSrc={ASCII_F1_CAR_SRC} />

        <div className="pointer-events-none fixed inset-0 z-30">
          <div className="pointer-events-auto absolute left-4 top-[max(1rem,env(safe-area-inset-top))]">
            <MovementPad />
          </div>
          <div className="pointer-events-auto absolute right-4 top-[max(1rem,env(safe-area-inset-top))]">
            <Button asChild variant="default" className="shrink-0">
              <Link href="/">Back Home</Link>
            </Button>
          </div>
          <div className="pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 w-[min(calc(100vw-2rem),20rem)] -translate-x-1/2">
            <Button asChild variant="default" className="mx-auto w-full max-w-full">
              <a
                href={X_PROFILE_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                Say hi on X
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
