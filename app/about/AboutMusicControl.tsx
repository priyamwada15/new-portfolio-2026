"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/pixelact-ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./about-page-pixelact-tooltip";

/**
 * Add an MP3 of the track to `public/` (licensed for your use).
 * Not fetched until the user presses Play (`preload="none"`).
 */
const AUDIO_SRC = "/about-game-music.mp3";

/** Start cue (2:05). Natural `ended` loops back here. */
const MUSIC_START_SEC = 2 * 60 + 5;

const FADE_IN_MS = 2_800;
const FADE_OUT_MS = 2_200;

export default function AboutMusicControl() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const volRef = useRef(0);
  const hasStartedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const fadeRafRef = useRef<number | null>(null);

  const stopFade = useCallback(() => {
    if (fadeRafRef.current != null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback(
    (from: number, to: number, durationMs: number, done: () => void) => {
      stopFade();
      const a = audioRef.current;
      if (!a) {
        done();
        return;
      }
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / durationMs);
        const v = from + (to - from) * t;
        volRef.current = v;
        a.volume = v;
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          fadeRafRef.current = null;
          done();
        }
      };
      fadeRafRef.current = requestAnimationFrame(step);
    },
    [stopFade]
  );

  const seekToCue = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = MUSIC_START_SEC;
  }, []);

  const startFromCueWithFade = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;

    const run = () => {
      seekToCue();
      a.volume = 0;
      volRef.current = 0;
      void a.play().then(() => {
        setPlaying(true);
        fadeVolume(0, 1, FADE_IN_MS, () => {});
      });
    };

    if (a.readyState >= HTMLMediaElement.HAVE_METADATA) {
      run();
      return;
    }

    const once = () => {
      a.removeEventListener("loadedmetadata", once);
      run();
    };
    a.addEventListener("loadedmetadata", once);
    a.load();
  }, [fadeVolume, seekToCue]);

  const resumeWithFade = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    volRef.current = 0;
    void a.play().then(() => {
      setPlaying(true);
      fadeVolume(0, 1, FADE_IN_MS, () => {});
    });
  }, [fadeVolume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onEnded = () => {
      seekToCue();
      void a.play();
      setPlaying(true);
    };

    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("ended", onEnded);
    };
  }, [seekToCue]);

  useEffect(
    () => () => {
      stopFade();
      audioRef.current?.pause();
    },
    [stopFade]
  );

  const onToggle = () => {
    const a = audioRef.current;
    if (!a) return;

    if (playing) {
      fadeVolume(volRef.current, 0, FADE_OUT_MS, () => {
        a.pause();
        setPlaying(false);
      });
      return;
    }

    if (!hasStartedRef.current || a.ended) {
      hasStartedRef.current = true;
      startFromCueWithFade();
    } else {
      resumeWithFade();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="none"
        className="hidden"
        aria-hidden
      />
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="default"
              className="shrink-0"
              onClick={onToggle}
              aria-pressed={playing}
            >
              {playing ? "Pause Music" : "Play Music"}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={10}>
            Little Black Submarines- The Black Keys
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
