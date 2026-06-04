/** DialKit slider tuple (default, min, max). */
function dialRange(
  defaultValue: number,
  min: number,
  max: number,
): [number, number, number] {
  return [defaultValue, min, max];
}

/** DialKit slider tuple with step (default, min, max, step). */
function dialRangeStep(
  defaultValue: number,
  min: number,
  max: number,
  step: number,
): [number, number, number, number] {
  return [defaultValue, min, max, step];
}

export const HOME_SCROLL_REVEAL_DIAL_CONFIG = {
  sheet: {
    bottomRadius: dialRange(48, 0, 64),
    shadowY: dialRange(48, 0, 64),
    shadowBlur: dialRange(54, 0, 96),
    shadowSpread: dialRange(1, -32, 24),
    shadowOpacity: dialRangeStep(0.45, 0, 0.6, 0.01),
  },
};

export type HomeScrollRevealDialValues = {
  sheet: {
    bottomRadius: number;
    shadowY: number;
    shadowBlur: number;
    shadowSpread: number;
    shadowOpacity: number;
  };
};

export function homeScrollRevealCssVars(values: HomeScrollRevealDialValues) {
  const { sheet } = values;

  return {
    "--home-scroll-sheet-radius-bl": `${sheet.bottomRadius}px`,
    "--home-scroll-sheet-radius-br": `${sheet.bottomRadius}px`,
    "--home-scroll-sheet-shadow": `0 ${sheet.shadowY}px ${sheet.shadowBlur}px ${sheet.shadowSpread}px rgba(0, 0, 0, ${sheet.shadowOpacity})`,
  } as Record<string, string>;
}

export const HOME_SCROLL_REVEAL_CSS_DEFAULTS = homeScrollRevealCssVars({
  sheet: {
    bottomRadius: 48,
    shadowY: 48,
    shadowBlur: 54,
    shadowSpread: 1,
    shadowOpacity: 0.45,
  },
});
