import { FLIP_BOARD_SPIN_SOUND_SRC } from "./constants";

let spinAudio: HTMLAudioElement | null = null;

function getSpinAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!spinAudio) {
    spinAudio = new Audio(FLIP_BOARD_SPIN_SOUND_SRC);
    spinAudio.preload = "auto";
  }
  return spinAudio;
}

export function playFlipBoardSpin(): void {
  const audio = getSpinAudio();
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

export function stopFlipBoardSpin(): void {
  const audio = getSpinAudio();
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}
