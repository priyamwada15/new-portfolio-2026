"use client";

export default function ArcadeEffWonGame() {
  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-[#0a0a0a] text-white"
      style={{ fontFamily: "var(--font-press-start-2p), monospace" }}
    >
      <div className="relative h-full flex-1 bg-[#2f7a2f]" />
      <div className="h-full w-[240px] shrink-0 bg-[#141414]" />
    </div>
  );
}
