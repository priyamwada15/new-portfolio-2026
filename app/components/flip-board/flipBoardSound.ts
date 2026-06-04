import { FLIP_BOARD_SPIN_SOUND_SRC } from "./constants";

let spinAudio: HTMLAudioElement | null = null;
let audioUnlocked = false;
let unlockListenersAttached = false;
let playWhenUnlocked: (() => void) | null = null;

function getSpinAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!spinAudio) {
    spinAudio = new Audio(FLIP_BOARD_SPIN_SOUND_SRC);
    spinAudio.preload = "auto";
  }
  return spinAudio;
}

function runPendingSpinPlay(): void {
  const audio = getSpinAudio();
  if (!audio || !audioUnlocked) return;

  audio.pause();
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

/** Browsers block scroll-triggered audio until the user has gestured on the page. */
function unlockSpinAudio(): void {
  if (audioUnlocked || typeof window === "undefined") return;

  const audio = getSpinAudio();
  if (!audio) return;

  void audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;
      playWhenUnlocked?.();
      playWhenUnlocked = null;
    })
    .catch(() => {});
}

export function initFlipBoardAudioUnlock(): void {
  if (typeof window === "undefined" || unlockListenersAttached) return;
  unlockListenersAttached = true;

  const unlock = () => unlockSpinAudio();

  window.addEventListener("pointerdown", unlock, {
    capture: true,
    passive: true,
  });
  window.addEventListener("keydown", unlock, { capture: true });
  window.addEventListener("touchstart", unlock, {
    capture: true,
    passive: true,
  });
}

export function playFlipBoardSpin(): void {
  if (audioUnlocked) {
    runPendingSpinPlay();
    return;
  }

  playWhenUnlocked = () => runPendingSpinPlay();
}

export function stopFlipBoardSpin(): void {
  playWhenUnlocked = null;

  const audio = getSpinAudio();
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}
