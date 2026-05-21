"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_TEXT = ">_ terminal";
const HOVER_PROMPT = "$";
const HOVER_COMMAND = " cd /design";
const CHAR_MS = 58;

type HeroTerminalWordProps = {
  className?: string;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function HeroTerminalWord({ className }: HeroTerminalWordProps) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const promptRef = useRef<HTMLSpanElement>(null);
  const commandRef = useRef<HTMLSpanElement>(null);
  const runIdRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const bumpRun = useCallback(() => {
    runIdRef.current += 1;
    return runIdRef.current;
  }, []);

  const isStale = useCallback((id: number) => runIdRef.current !== id, []);

  const backspace = useCallback(
    async (el: HTMLElement, text: string, id: number) => {
      for (let i = text.length; i >= 0; i--) {
        if (isStale(id)) return;
        el.textContent = text.slice(0, i);
        await wait(CHAR_MS);
      }
    },
    [isStale],
  );

  const type = useCallback(
    async (el: HTMLElement, text: string, id: number) => {
      for (let i = 0; i <= text.length; i++) {
        if (isStale(id)) return;
        el.textContent = text.slice(0, i);
        await wait(CHAR_MS);
      }
    },
    [isStale],
  );

  const showDefaultView = useCallback((text: string) => {
    const line = lineRef.current;
    const prompt = promptRef.current;
    const command = commandRef.current;
    if (!line || !prompt || !command) return;

    line.textContent = text;
    line.hidden = false;
    prompt.hidden = true;
    prompt.textContent = "";
    command.hidden = true;
    command.textContent = "";
    setHovered(false);
  }, []);

  const runHoverIn = useCallback(async () => {
    const id = bumpRun();
    const line = lineRef.current;
    const prompt = promptRef.current;
    const command = commandRef.current;
    if (!line || !prompt || !command) return;

    if (reducedMotionRef.current) {
      line.hidden = true;
      prompt.hidden = false;
      command.hidden = false;
      prompt.textContent = HOVER_PROMPT;
      command.textContent = HOVER_COMMAND;
      setHovered(true);
      return;
    }

    const current = line.textContent ?? DEFAULT_TEXT;
    await backspace(line, current, id);
    if (isStale(id)) return;

    line.hidden = true;
    prompt.hidden = false;
    command.hidden = false;
    prompt.textContent = "";
    command.textContent = "";
    setHovered(true);

    await type(prompt, HOVER_PROMPT, id);
    if (isStale(id)) return;
    await type(command, HOVER_COMMAND, id);
  }, [backspace, bumpRun, isStale, type]);

  const runHoverOut = useCallback(async () => {
    const id = bumpRun();
    const line = lineRef.current;
    const prompt = promptRef.current;
    const command = commandRef.current;
    if (!line || !prompt || !command) return;

    if (reducedMotionRef.current) {
      showDefaultView(DEFAULT_TEXT);
      return;
    }

    await backspace(command, command.textContent ?? HOVER_COMMAND, id);
    if (isStale(id)) return;
    await backspace(prompt, prompt.textContent ?? HOVER_PROMPT, id);
    if (isStale(id)) return;

    prompt.hidden = true;
    command.hidden = true;
    setHovered(false);
    line.hidden = false;
    line.textContent = "";

    await type(line, DEFAULT_TEXT, id);
    if (isStale(id)) return;
    showDefaultView(DEFAULT_TEXT);
  }, [backspace, bumpRun, isStale, showDefaultView, type]);

  return (
    <span
      className={cn(
        "hero-terminal-chip cursor-pointer",
        hovered && "hero-terminal-chip--hover",
        className,
      )}
      aria-label="terminal"
      onMouseEnter={() => void runHoverIn()}
      onMouseLeave={() => void runHoverOut()}
      onFocus={() => void runHoverIn()}
      onBlur={() => void runHoverOut()}
      tabIndex={0}
    >
      <span className="hero-terminal-chip__inner">
        <span ref={lineRef} className="hero-terminal-chip__text">
          {DEFAULT_TEXT}
        </span>
        <span ref={promptRef} className="hero-terminal-chip__prompt" hidden />
        <span ref={commandRef} className="hero-terminal-chip__command" hidden />
        <span className="hero-terminal-chip__cursor" aria-hidden />
      </span>
    </span>
  );
}
