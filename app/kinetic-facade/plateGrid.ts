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
  rows: 9,
  plateWidth: 0.55,
  plateHeight: 0.8,
  gapX: 0.15,
  gapY: 0.15,
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
