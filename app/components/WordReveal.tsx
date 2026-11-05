"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type WordRevealTiming = {
  /** Seconds between one word starting and the next. */
  stagger: number;
  /** Pixels each word rises while it fades in. */
  rise: number;
  /** Seconds each word takes to settle. */
  duration: number;
  /** Seconds after the last word starts before the key phrases change colour. */
  keyPause: number;
  /** Seconds the key phrases take to change colour. */
  keyDuration: number;
  /** Share of the sentence (0 to 1) that must be on screen before it plays. */
  threshold: number;
};

export const WORD_REVEAL_TIMING: WordRevealTiming = {
  stagger: 0.035,
  rise: 6,
  duration: 0.5,
  keyPause: 0.25,
  keyDuration: 0.6,
  threshold: 0.6,
};

type Part = { text: string; key: boolean };
/** A word, plus any punctuation glued to it, so a full stop never wraps onto its own line. */
type Token = Part[] | " ";

function tokenize(text: string): Token[] {
  const out: Token[] = [];
  text.split("*").forEach((segment, i) => {
    segment.split(/(\s+)/).forEach((piece, j) => {
      if (!piece) return;
      if (/^\s+$/.test(piece)) return void out.push(" ");
      const glued = j === 0 && i > 0 && out.length > 0 && out[out.length - 1] !== " ";
      const part = { text: piece, key: i % 2 === 1 };
      if (glued) (out[out.length - 1] as Part[]).push(part);
      else out.push([part]);
    });
  });
  return out;
}

/**
 * A sentence that settles in word by word as it scrolls into view, then lets the
 * phrases wrapped in *asterisks* take their primary colour last. Words not
 * wrapped stay secondary. Shows plainly for visitors who prefer reduced motion.
 */
export function WordReveal({
  text,
  className,
  timing = WORD_REVEAL_TIMING,
}: {
  text: string;
  className?: string;
  timing?: WordRevealTiming;
}) {
  const reduced = useReducedMotion();
  const tokens = tokenize(text);
  const wordCount = tokens.filter((t) => t !== " ").length;
  const keyDelay = wordCount * timing.stagger + timing.keyPause;

  const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: timing.stagger } } };
  const word: Variants = {
    hidden: { opacity: 0, y: timing.rise },
    show: { opacity: 1, y: 0, transition: { duration: timing.duration, ease: EASE } },
  };
  const keyColor: Variants = {
    hidden: { color: "var(--ds-text-secondary)" },
    show: {
      color: "var(--ds-text-primary)",
      transition: { duration: timing.keyDuration, delay: keyDelay, ease: EASE },
    },
  };

  return (
    <motion.p
      className={className}
      variants={parent}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: timing.threshold }}
    >
      {tokens.map((token, i) =>
        token === " " ? (
          " "
        ) : (
          <motion.span key={i} variants={word} className="inline-block">
            {token.map((part, k) =>
              part.key ? (
                <motion.span key={k} variants={keyColor}>
                  {part.text}
                </motion.span>
              ) : (
                part.text
              ),
            )}
          </motion.span>
        ),
      )}
    </motion.p>
  );
}
