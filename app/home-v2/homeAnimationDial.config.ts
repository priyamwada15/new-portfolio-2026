/** DialKit slider tuple (default, min, max). */
function dialRange(
  defaultValue: number,
  min: number,
  max: number
): [number, number, number] {
  return [defaultValue, min, max];
}

/** DialKit slider tuple with step (default, min, max, step). */
function dialRangeStep(
  defaultValue: number,
  min: number,
  max: number,
  step: number
): [number, number, number, number] {
  return [defaultValue, min, max, step];
}

function easeSliders(defaults: { x1: number; y1: number; x2: number; y2: number }) {
  return {
    x1: dialRangeStep(defaults.x1, 0, 1, 0.01),
    y1: dialRangeStep(defaults.y1, -0.5, 1.5, 0.01),
    x2: dialRangeStep(defaults.x2, 0, 1, 0.01),
    y2: dialRangeStep(defaults.y2, -0.5, 1.5, 0.01),
  };
}

export const HOME_ANIMATION_DIAL_CONFIG = {
  cards: {
    hoverY: dialRange(-8, -24, 0),
    hoverScale: dialRangeStep(1, 1, 1.08, 0.001),
    durationMs: dialRange(250, 80, 800),
    easing: easeSliders({ x1: 0.3, y1: 0.6, x2: 0.32, y2: 1 }),
  },
  snippets: {
    durationMs: dialRange(500, 100, 800),
    restTransitionMs: dialRange(260, 80, 800),
    popYMid: dialRange(-14, -40, 0),
    popYEnd: dialRange(-10, -40, 0),
    popScaleMid: dialRangeStep(1.045, 1, 1.15, 0.001),
    popScaleEnd: dialRangeStep(1.015, 1, 1.15, 0.001),
    easing: easeSliders({ x1: 0.1, y1: 0.02, x2: 0.32, y2: 0.32 }),
  },
  books: {
    durationMs: dialRange(300, 100, 800),
    revealScaleRest: dialRangeStep(0.96, 0.8, 1, 0.001),
    revealScaleHover: dialRangeStep(1, 0.8, 1.2, 0.001),
    easing: easeSliders({ x1: 0.23, y1: 1, x2: 0.32, y2: 1 }),
  },
};

export type HomeAnimationEasing = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type HomeAnimationDialValues = {
  cards: {
    hoverY: number;
    hoverScale: number;
    durationMs: number;
    easing: HomeAnimationEasing;
  };
  snippets: {
    durationMs: number;
    restTransitionMs: number;
    popYMid: number;
    popYEnd: number;
    popScaleMid: number;
    popScaleEnd: number;
    easing: HomeAnimationEasing;
  };
  books: {
    durationMs: number;
    revealScaleRest: number;
    revealScaleHover: number;
    easing: HomeAnimationEasing;
  };
};

export function buildHomeCubicBezier(easing: HomeAnimationEasing): string {
  return `cubic-bezier(${easing.x1}, ${easing.y1}, ${easing.x2}, ${easing.y2})`;
}

export function homeAnimationCssVars(values: HomeAnimationDialValues) {
  const { cards, snippets, books } = values;

  return {
    "--home-card-hover-y": `${cards.hoverY}px`,
    "--home-card-hover-scale": String(cards.hoverScale),
    "--home-card-duration": `${cards.durationMs}ms`,
    "--home-card-easing": buildHomeCubicBezier(cards.easing),
    "--home-snippet-pop-duration": `${snippets.durationMs}ms`,
    "--home-snippet-rest-duration": `${snippets.restTransitionMs}ms`,
    "--home-snippet-pop-y-mid": `${snippets.popYMid}px`,
    "--home-snippet-pop-y-end": `${snippets.popYEnd}px`,
    "--home-snippet-pop-scale-mid": String(snippets.popScaleMid),
    "--home-snippet-pop-scale-end": String(snippets.popScaleEnd),
    "--home-snippet-easing": buildHomeCubicBezier(snippets.easing),
    "--home-book-duration": `${books.durationMs}ms`,
    "--home-book-reveal-scale-rest": String(books.revealScaleRest),
    "--home-book-reveal-scale-hover": String(books.revealScaleHover),
    "--home-book-easing": buildHomeCubicBezier(books.easing),
  } as Record<string, string>;
}
