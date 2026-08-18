"use client";

import { TEAMS } from "./raceData";
import { pad, formatTime } from "./raceMath";

export function TeamSelectOverlay({
  teamIndex,
  onSelect,
  onStart,
}: {
  teamIndex: number;
  onSelect: (index: number) => void;
  onStart: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] overflow-y-auto bg-black/[.92] p-6 text-white">
      <div className="text-[18px] text-[#ff3b3b]">CHOOSE YOUR TEAM</div>
      <div className="grid max-w-[820px] grid-cols-4 gap-[10px]">
        {TEAMS.map((team, i) => (
          <button
            key={team.name}
            type="button"
            onClick={() => onSelect(i)}
            className="flex cursor-pointer flex-col items-center gap-[6px] rounded p-[10px_6px]"
            style={{
              background: i === teamIndex ? "#2a2a2a" : "#1a1a1a",
              border: `2px solid ${i === teamIndex ? "#ffd23f" : "#333"}`,
            }}
          >
            <div
              className="h-[22px] w-[44px] rounded-sm"
              style={{ background: team.p, borderBottom: `7px solid ${team.a}` }}
            />
            <div className="text-center text-[7px] leading-[1.5]">{team.name}</div>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-3 cursor-pointer rounded bg-[#ff3b3b] px-7 py-3 text-[11px]"
      >
        START RACE
      </button>
      <div className="text-[7px] text-[#aaa]">
        ENTER TO START · ARROWS/CLICK TO PICK TEAM
      </div>
    </div>
  );
}

export function CountdownOverlay({ lightsLit }: { lightsLit: number }) {
  return (
    <div className="absolute inset-x-0 top-6 flex justify-center gap-[14px]">
      {[0, 1, 2, 3, 4].map((i) => {
        const lit = i < lightsLit;
        return (
          <div
            key={i}
            className="h-[26px] w-[26px] rounded-full border-[3px] border-[#300]"
            style={{
              background: lit ? "#ff2020" : "#3a0a0a",
              boxShadow: lit ? "0 0 12px 3px rgba(255,32,32,0.8)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export function HudSidebar({
  hud,
}: {
  hud: {
    score: number;
    lap: number;
    speed: number;
    pos: string;
    time: number;
    damage: number;
    best: number;
  };
}) {
  const dmgColor = (level: number) => (hud.damage >= level ? "#e74c3c" : "#2a2a2a");
  return (
    <div className="flex h-full w-[240px] shrink-0 flex-col gap-3 overflow-y-auto bg-[#141414] p-[18px_16px] text-white">
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">SCORE</div>
        <div className="text-[15px] text-[#ffd23f]">{pad(hud.score, 6)}</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">LAP</div>
        <div className="text-[13px]">{hud.lap} / 8</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">SPEED</div>
        <div className="text-[13px]">
          {pad(hud.speed, 3)} <span className="text-[8px] text-[#888]">KM/H</span>
        </div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">POS</div>
        <div className="text-[13px]">{hud.pos || "--"}</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">TIME</div>
        <div className="text-[13px]">{formatTime(hud.time)}</div>
      </div>
      <div>
        <div className="mb-[6px] text-[9px] text-[#888]">DAMAGE</div>
        <div className="flex gap-[6px]">
          <div className="h-[14px] w-[14px] border border-[#444]" style={{ background: dmgColor(1) }} />
          <div className="h-[14px] w-[14px] border border-[#444]" style={{ background: dmgColor(2) }} />
          <div className="h-[14px] w-[14px] border border-[#444]" style={{ background: dmgColor(3) }} />
        </div>
      </div>

      <div className="mt-2 border-t border-[#2a2a2a] pt-[14px]">
        <div className="mb-[10px] text-[9px] text-[#888]">CONTROLS</div>
        <div className="mb-[6px] grid grid-cols-3 gap-1">
          <div />
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ▲
          </div>
          <div />
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ◀
          </div>
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ▼
          </div>
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-[#444] bg-[#2a2a2a] text-[11px]">
            ▶
          </div>
        </div>
        <div className="mb-3 text-[7px] leading-[1.6] text-[#999]">STEER / ACCEL / BRAKE</div>
        <div className="flex items-center gap-2">
          <div className="rounded-[3px] border border-[#444] bg-[#2a2a2a] px-2 py-[5px] text-[8px]">
            P
          </div>
          <div className="text-[7px] text-[#999]">PAUSE</div>
        </div>
      </div>

      <div className="mt-auto text-[8px] text-[#555]">BEST {pad(hud.best, 6)}</div>
    </div>
  );
}

export function PausedOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 text-white">
      <div className="text-[16px] text-[#ffd23f]">PAUSED</div>
      <div className="animate-[blink_1s_step-start_infinite] text-[8px] text-[#aaa]">
        PRESS P TO RESUME
      </div>
    </div>
  );
}

export function FinishedOverlay({
  podium,
  resultLine,
  score,
  best,
}: {
  podium: { label: string; name: string; isPlayer: boolean }[];
  resultLine: string;
  score: string;
  best: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-5 text-center text-white">
      <div className="text-[16px] text-[#ffd23f]">CHECKERED FLAG</div>
      <div className="flex items-end gap-4">
        {podium.map((slot) => (
          <div
            key={slot.label}
            className="min-w-[100px] rounded p-[12px_16px]"
            style={{
              background: slot.isPlayer ? "#2a2a2a" : "#1a1a1a",
              border: `2px solid ${slot.isPlayer ? "#ffd23f" : "#333"}`,
            }}
          >
            <div className="text-[8px]">{slot.label}</div>
            <div className="mt-[6px] text-[7px]">{slot.name}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[9px]">{resultLine}</div>
      <div className="text-[9px] text-white">SCORE {score}</div>
      <div className="text-[9px] text-[#6ab04c]">BEST {best}</div>
      <div className="animate-[blink_1s_step-start_infinite] text-[9px] text-[#ffd23f]">
        PRESS ENTER TO RACE AGAIN
      </div>
    </div>
  );
}

export function GameOverOverlay({ score, best }: { score: string; best: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[14px] bg-black/85 p-5 text-center text-white">
      <div className="text-[16px] text-[#ff3b3b]">DNF</div>
      <div className="text-[9px] text-white">SCORE {score}</div>
      <div className="text-[9px] text-[#6ab04c]">BEST {best}</div>
      <div className="animate-[blink_1s_step-start_infinite] text-[9px] text-[#ffd23f]">
        PRESS ENTER TO PICK A TEAM
      </div>
    </div>
  );
}
