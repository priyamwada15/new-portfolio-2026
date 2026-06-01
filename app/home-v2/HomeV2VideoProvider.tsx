"use client";

import { X } from "@phosphor-icons/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type VideoPayload = { src: string; label: string };

const HomeV2VideoContext = createContext<{
  openVideo: (payload: VideoPayload) => void;
} | null>(null);

export function useHomeV2Video() {
  const ctx = useContext(HomeV2VideoContext);
  if (!ctx) {
    throw new Error("useHomeV2Video must be used within HomeV2VideoProvider");
  }
  return ctx;
}

const MAX_VIDEO_WIDTH_PX = 720;
const MAX_VIDEO_HEIGHT_VH = 0.85;

export function HomeV2VideoProvider({ children }: { children: ReactNode }) {
  const [video, setVideo] = useState<VideoPayload | null>(null);
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number } | null>(
    null,
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    setVideo(null);
    setDisplaySize(null);
  }, []);

  const openVideo = useCallback((payload: VideoPayload) => {
    setDisplaySize(null);
    setVideo(payload);
  }, []);

  useEffect(() => {
    if (!video) return;

    document.body.classList.add("home-v2-lightbox-open");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("home-v2-lightbox-open");
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [video, close]);

  useEffect(() => {
    if (!video) return;
    const el = videoRef.current;
    if (!el) return;
    void el.play().catch(() => {});
  }, [video, displaySize]);

  const fitVideoToViewport = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.videoWidth || !el.videoHeight) return;

    const maxW = Math.min(window.innerWidth * 0.9, MAX_VIDEO_WIDTH_PX);
    const maxH = window.innerHeight * MAX_VIDEO_HEIGHT_VH;
    const scale = Math.min(maxW / el.videoWidth, maxH / el.videoHeight, 1);

    setDisplaySize({
      w: Math.round(el.videoWidth * scale),
      h: Math.round(el.videoHeight * scale),
    });
  }, []);

  return (
    <HomeV2VideoContext.Provider value={{ openVideo }}>
      {children}
      {video ? (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={video.label}
        >
          <button
            type="button"
            className="absolute inset-0 bg-surface-home/55 backdrop-blur-md"
            aria-label="Close video"
            onClick={close}
          />
          <div
            className="relative z-10 flex items-start gap-3 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-auto rounded-lg bg-ink shadow-lg">
              <video
                ref={videoRef}
                key={video.src}
                src={video.src}
                controls
                playsInline
                onLoadedMetadata={fitVideoToViewport}
                aria-label={video.label}
                className="block max-h-[85vh] max-w-[min(90vw,720px)] object-contain"
                style={
                  displaySize
                    ? { width: displaySize.w, height: displaySize.h }
                    : undefined
                }
              />
            </div>
            <button
              type="button"
              onClick={close}
              className="pointer-events-auto mt-0 flex shrink-0 items-center justify-center rounded-full p-2 text-secondary transition-colors hover:text-ink"
              aria-label="Close video"
            >
              <X size={24} weight="regular" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </HomeV2VideoContext.Provider>
  );
}
