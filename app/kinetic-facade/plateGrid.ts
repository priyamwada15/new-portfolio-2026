export type PlateDefinition = {
  id: string;
  col: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PlateGridConfig = {
  columns: number;
  rows: number;
  plateWidth: number;
  plateHeight: number;
  gapX: number;
  gapY: number;
};

export const DEFAULT_GRID_CONFIG: PlateGridConfig = {
  columns: 14,
  rows: 7,
  plateWidth: 0.55,
  plateHeight: 0.8,
  gapX: 0.02,
  gapY: 0.02,
};

export function buildPlateGrid(
  config: PlateGridConfig = DEFAULT_GRID_CONFIG,
): PlateDefinition[] {
  const { columns, rows, plateWidth, plateHeight, gapX, gapY } = config;
  const cellWidth = plateWidth + gapX;
  const cellHeight = plateHeight + gapY;
  const totalWidth = columns * cellWidth;
  const totalHeight = rows * cellHeight;
  const plates: PlateDefinition[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = col * cellWidth - totalWidth / 2 + cellWidth / 2;
      const y = totalHeight / 2 - row * cellHeight - cellHeight / 2;
      plates.push({
        id: `${row}-${col}`,
        col,
        row,
        x,
        y,
        width: plateWidth,
        height: plateHeight,
      });
    }
  }

  return plates;
}

export type GapFiller = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Static, non-rotating fillers for the thin seams between plates. Sized to
 * exactly the resting gap (never a plate's own footprint), so they hide the
 * gap-level leak-through at rest without ever covering the much larger area
 * a plate's swing exposes.
 */
export function buildGapFillers(
  config: PlateGridConfig = DEFAULT_GRID_CONFIG,
): GapFiller[] {
  const { columns, rows, plateWidth, plateHeight, gapX, gapY } = config;
  const cellWidth = plateWidth + gapX;
  const cellHeight = plateHeight + gapY;
  const totalWidth = columns * cellWidth;
  const totalHeight = rows * cellHeight;
  const fillers: GapFiller[] = [];

  for (let row = 0; row < rows; row++) {
    const y = totalHeight / 2 - row * cellHeight - cellHeight / 2;
    for (let col = 0; col < columns - 1; col++) {
      const x = (col + 1) * cellWidth - totalWidth / 2;
      fillers.push({
        id: `v-${row}-${col}`,
        x,
        y,
        width: gapX,
        height: plateHeight + gapY,
      });
    }
  }

  for (let col = 0; col < columns; col++) {
    const x = col * cellWidth - totalWidth / 2 + cellWidth / 2;
    for (let row = 0; row < rows - 1; row++) {
      const y = totalHeight / 2 - (row + 1) * cellHeight;
      fillers.push({
        id: `h-${row}-${col}`,
        x,
        y,
        width: plateWidth + gapX,
        height: gapY,
      });
    }
  }

  return fillers;
}
