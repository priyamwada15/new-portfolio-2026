export const FLIP_BOARD_THEME_DEFAULTS = {
  displayBgColor: "#ffffff",
  displayBgOpacity: 0.04,
  displayBlur: 2,
  cellGap: 3,
  rowGap: 16,
  textCellColor: "#333333",
  fontColor: "#ffffff",
  fontColorDim: "#888888",
  flapAccentColor: "#2e2e2e",
  flapAccentHeight: 0.5,
} as const;

export type FlipBoardThemeValues = {
  displayBgColor: string;
  displayBgOpacity: number;
  displayBlur: number;
  cellGap: number;
  rowGap: number;
  textCellColor: string;
  fontColor: string;
  fontColorDim: string;
  flapAccentColor: string;
  flapAccentHeight: number;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(normalized)) return null;

  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

export function displayBackgroundCss(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

export function flipBoardCssVars(
  values: FlipBoardThemeValues,
  backgroundImageUrl?: string,
) {
  return {
    ...(backgroundImageUrl
      ? { "--flip-footer-bg-image": `url(${backgroundImageUrl})` }
      : {}),
    "--flip-footer-display-background": displayBackgroundCss(
      values.displayBgColor,
      values.displayBgOpacity,
    ),
    "--flip-footer-display-blur": `${values.displayBlur}px`,
    "--flip-footer-cell-gap": `${values.cellGap}px`,
    "--flip-footer-row-gap": `${values.rowGap}px`,
    "--flip-footer-text-cell-color": values.textCellColor,
    "--flip-footer-flap-bg-top": values.textCellColor,
    "--flip-footer-flap-bg-bottom": values.textCellColor,
    "--flip-footer-flap-fg": values.fontColor,
    "--flip-footer-flap-fg-dim": values.fontColorDim,
    "--flip-footer-flap-accent-color": values.flapAccentColor,
    "--flip-footer-flap-accent-height": `${values.flapAccentHeight}px`,
  } as Record<string, string>;
}
