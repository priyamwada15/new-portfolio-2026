/** DialKit slider tuple (default, min, max). */
function dialRange(
  defaultValue: number,
  min: number,
  max: number
): [number, number, number] {
  return [defaultValue, min, max];
}

export const HOME_LISTENING_DIAL_CONFIG = {
  spacing: {
    artToTextGap: dialRange(16, 0, 48),
    labelToTrackGap: dialRange(8, 0, 32),
    trackToProgressGap: dialRange(4, 0, 32),
    sectionGap: dialRange(24, 0, 64),
    earlierTodayGap: dialRange(8, 0, 32),
    thumbnailGap: dialRange(12, 0, 32),
    captionGap: dialRange(12, 0, 32),
  },
};

export type HomeListeningDialValues = {
  spacing: {
    artToTextGap: number;
    labelToTrackGap: number;
    trackToProgressGap: number;
    sectionGap: number;
    earlierTodayGap: number;
    thumbnailGap: number;
    captionGap: number;
  };
};

export function homeListeningCssVars(values: HomeListeningDialValues) {
  const { spacing } = values;

  return {
    "--listening-art-to-text-gap": `${spacing.artToTextGap}px`,
    "--listening-label-to-track-gap": `${spacing.labelToTrackGap}px`,
    "--listening-track-to-progress-gap": `${spacing.trackToProgressGap}px`,
    "--listening-section-gap": `${spacing.sectionGap}px`,
    "--listening-earlier-today-gap": `${spacing.earlierTodayGap}px`,
    "--listening-thumbnail-gap": `${spacing.thumbnailGap}px`,
    "--listening-caption-gap": `${spacing.captionGap}px`,
  } as Record<string, string>;
}
