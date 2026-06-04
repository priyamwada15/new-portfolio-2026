export type FlipBoardIcon = "arrow-up-right";

export type FlipBoardCellRegion = "frame" | "message";

export type FlipBoardCellSpec = {
  id: string;
  row: number;
  col: number;
  /** Frame = outer border (striped). Message = inner text block (no horizontal stripes). */
  region: FlipBoardCellRegion;
  /** Image slice for idle state; interactive cells flip to `display`. */
  kind: "image" | "char" | "icon" | "space";
  char?: string;
  icon?: FlipBoardIcon;
  display?: string;
  href?: string;
  /** True when this cell should run the flip animation on reveal. */
  interactive: boolean;
  /** Headline rows: groups letters into words (gap between groups, not empty cells). */
  wordGroup?: number;
};

export type SocialSegment = {
  label: string;
  href: string;
};
