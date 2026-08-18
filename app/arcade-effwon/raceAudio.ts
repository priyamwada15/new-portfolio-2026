export type BeepFn = ((
  freq: number,
  dur?: number,
  type?: OscillatorType,
  vol?: number,
) => void) & {
  dispose: () => void;
};

/** Lazily creates one AudioContext per game session and plays short square/sine/etc. blips through it. */
export function createBeeper(): BeepFn {
  let ctx: AudioContext | null = null;
  const beep = ((freq, dur = 0.15, type = "square", vol = 0.06) => {
    if (!ctx) {
      try {
        const AudioContextCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctx = new AudioContextCtor();
      } catch {
        return;
      }
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur + 0.02);
  }) as BeepFn;
  beep.dispose = () => {
    ctx?.close().catch(() => {});
    ctx = null;
  };
  return beep;
}
