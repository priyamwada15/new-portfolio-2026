"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/pixelact-ui/button";

const VIDEO_ID = "6k8es2BNloE";
/** Seek cue in seconds (2:05). */
const MUSIC_START_SEC = 2 * 60 + 5;

type YtPlayer = {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  unMute: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy?: () => void;
};

type YtWindow = Window & {
  YT?: {
    Player: new (
      hostId: string,
      options: {
        videoId: string;
        width: string;
        height: string;
        playerVars: Record<string, number>;
        events: {
          onStateChange: (e: { data: number }) => void;
          onReady: () => void;
        };
      }
    ) => YtPlayer;
    PlayerState: Record<string, number>;
  };
  onYouTubeIframeAPIReady?: () => void;
};

export default function AboutMusicControl() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [ytPlaying, setYtPlaying] = useState(false);
  const playerRef = useRef<YtPlayer | null>(null);
  const pendingPlayRef = useRef(false);
  const globalInitRef = useRef(false);

  const createPlayer = useCallback(() => {
    if (typeof document === "undefined") return;
    if (playerRef.current) return;
    const host = document.getElementById("about-yt-host");
    if (!host) return;

    const w = window as YtWindow;
    const YT = w.YT;
    if (!YT?.Player) return;

    playerRef.current = new YT.Player("about-yt-host", {
      videoId: VIDEO_ID,
      width: "100%",
      height: "100%",
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,
      },
      events: {
        onStateChange: (e: { data: number }) => {
          const g = (window as YtWindow).YT;
          if (!g) return;
          const PS = g.PlayerState;
          if (e.data === PS.PLAYING) {
            setYtPlaying(true);
          } else if (
            e.data === PS.PAUSED ||
            e.data === PS.ENDED ||
            e.data === PS.CUED
          ) {
            setYtPlaying(false);
          }
        },
        onReady: () => {
          const p = playerRef.current;
          if (!p) return;
          if (pendingPlayRef.current) {
            pendingPlayRef.current = false;
            p.seekTo(MUSIC_START_SEC, true);
            try {
              p.unMute();
            } catch {
              /* ignore */
            }
            p.playVideo();
          }
        },
      },
    });
  }, []);

  const ensureYoutubeApi = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window as YtWindow;

    if (w.YT?.Player) {
      createPlayer();
      return;
    }

    if (!globalInitRef.current) {
      globalInitRef.current = true;
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);
      }
    }
  }, [createPlayer]);

  const handleToggle = () => {
    if (!ytPlaying) {
      setOverlayVisible(true);
      const p = playerRef.current;
      if (p) {
        pendingPlayRef.current = false;
        p.seekTo(MUSIC_START_SEC, true);
        try {
          p.unMute();
        } catch {
          /* ignore */
        }
        p.playVideo();
        return;
      }
      pendingPlayRef.current = true;
      ensureYoutubeApi();
      return;
    }

    const p = playerRef.current;
    if (p) {
      p.pauseVideo();
    }
    setOverlayVisible(false);
    setYtPlaying(false);
  };

  useEffect(
    () => () => {
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    },
    []
  );

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "absolute right-0 bottom-full z-[45] mb-2 w-[min(92vw,360px)] shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-opacity duration-200",
          overlayVisible
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        )}
      >
        <div className="aspect-video w-full overflow-hidden rounded-sm border border-white/15 bg-black">
          <div id="about-yt-host" className="h-full min-h-[200px] w-full" />
        </div>
      </div>
      <Button
        type="button"
        variant="default"
        className="shrink-0"
        onClick={handleToggle}
        aria-pressed={ytPlaying}
      >
        {ytPlaying ? "Pause Music" : "Play Music"}
      </Button>
    </div>
  );
}
