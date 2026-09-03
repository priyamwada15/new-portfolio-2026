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

// Grid callers used to size columns/rows directly off the viewport with no
// ceiling, so a wide/high-res screen could drive plate (and draw call)
// count arbitrarily high — heavy enough to crash the tab on weaker GPUs.
// These cap one axis at a time: below the cap, sizing is unchanged; at the
// cap, the (now fixed) count of plates is scaled up to still span the full
// viewport edge-to-edge, just as fewer, larger tiles.
export const MAX_GRID_COLUMNS = 18;
export const MAX_GRID_ROWS = 9;

export function resolveGridAxis(
  viewportSize: number,
  plateSize: number,
  gapSize: number,
  maxCount: number,
): { count: number; scale: number } {
  const idealCellSize = plateSize + gapSize;
  const idealCount = Math.ceil(viewportSize / idealCellSize);
  const count = Math.min(idealCount, maxCount);
  const scale = count < idealCount ? viewportSize / (count * idealCellSize) : 1;
  return { count, scale };
}

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
  plateIndexA: number;
  plateIndexB: number;
};

/**
 * Static, non-rotating fillers for the thin seams between plates. Sized to
 * exactly the resting gap (never a plate's own footprint), so they hide the
 * gap-level leak-through at rest without ever covering the much larger area
 * a plate's swing exposes. Each filler records the indices (into the
 * row-major array `buildPlateGrid` returns) of the two plates it sits
 * between, so a consumer can fade a filler based on whether either
 * neighboring plate has swung open.
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
        plateIndexA: row * columns + col,
        plateIndexB: row * columns + (col + 1),
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
        plateIndexA: row * columns + col,
        plateIndexB: (row + 1) * columns + col,
      });
    }
  }

  return fillers;
}
