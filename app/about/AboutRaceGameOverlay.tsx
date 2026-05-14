"use client";

import Link from "next/link";
import { Button } from "@/components/ui/pixelact-ui/button";
import AboutMusicControl from "./AboutMusicControl";

const X_PROFILE_HREF = "https://x.com/PriymwadaPandey";

/** Floating controls shared by the about page and the standalone ASCII game route. */
export default function AboutRaceGameOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="pointer-events-auto absolute left-4 top-[max(1rem,env(safe-area-inset-top))]">
        <Button asChild variant="default" className="shrink-0">
          <a href={X_PROFILE_HREF} target="_blank" rel="noopener noreferrer">
            Say hi on X
          </a>
        </Button>
      </div>
      <div className="pointer-events-auto absolute right-4 top-[max(1rem,env(safe-area-inset-top))]">
        <Button asChild variant="default" className="shrink-0">
          <Link href="/">Back Home</Link>
        </Button>
      </div>
      <div className="pointer-events-auto absolute right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))]">
        <AboutMusicControl />
      </div>
    </div>
  );
}
