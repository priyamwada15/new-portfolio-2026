import { LINE_1_ROWS, SOCIAL_SEGMENTS } from "./constants";
import type { FlipBoardCellSpec, FlipBoardIcon } from "./types";

type LineToken =
  | { type: "char"; value: string; href?: string }
  | { type: "icon"; icon: FlipBoardIcon; href?: string };

function buildSocialLine(): LineToken[] {
  const tokens: LineToken[] = [];

  SOCIAL_SEGMENTS.forEach((segment) => {
    for (const char of segment.label) {
      tokens.push({ type: "char", value: char, href: segment.href });
    }
    tokens.push({ type: "icon", icon: "arrow-up-right", href: segment.href });
  });

  return tokens;
}

function tokensToSpecs(tokens: LineToken[], row: number): FlipBoardCellSpec[] {
  const specs: FlipBoardCellSpec[] = [];
  let col = 0;

  for (const token of tokens) {
    const id = `r${row}c${col}`;

    if (token.type === "icon") {
      specs.push({
        id,
        row,
        col,
        region: "message",
        kind: "icon",
        icon: token.icon,
        display: "↗",
        href: token.href,
        interactive: true,
      });
      col += 1;
      continue;
    }

    specs.push({
      id,
      row,
      col,
      region: "message",
      kind: "char",
      char: token.value,
      display: token.value,
      href: token.href,
      interactive: true,
    });
    col += 1;
  }

  return specs;
}

function headlineWordsToSpecs(line: string, row: number): FlipBoardCellSpec[] {
  const words = line.split(/\s+/).filter(Boolean);
  const specs: FlipBoardCellSpec[] = [];
  let col = 0;

  words.forEach((word, wordGroup) => {
    for (const value of word) {
      specs.push({
        id: `r${row}c${col}`,
        row,
        col,
        region: "message",
        kind: "char",
        char: value,
        display: value,
        interactive: true,
        wordGroup,
      });
      col += 1;
    }
  });

  return specs;
}

export function buildFlipBoardGrid(): FlipBoardCellSpec[] {
  const socialLine = buildSocialLine();

  return [
    ...headlineWordsToSpecs(LINE_1_ROWS[0], 0),
    ...headlineWordsToSpecs(LINE_1_ROWS[1], 1),
    ...tokensToSpecs(socialLine, 2),
  ];
}

/** Headline rows: group specs by word for flex spacing. */
export function groupSpecsByWord(
  specs: FlipBoardCellSpec[],
): FlipBoardCellSpec[][] {
  const groups: FlipBoardCellSpec[][] = [];

  for (const spec of specs) {
    const index = spec.wordGroup ?? 0;
    if (!groups[index]) groups[index] = [];
    groups[index].push(spec);
  }

  return groups;
}
