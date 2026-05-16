const BASE = "/new-about-page-assets";

export const SNIPPETS_HEADING = "Snippets of my life";

export type SnippetPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  left: number;
  top: number;
  rotateDeg: number;
  tooltip?: string;
};

/** Positions from Figma photo-strip frame (1036.35 × 577.39). */
export const SNIPPET_PHOTOS: SnippetPhoto[] = [
  {
    src: `${BASE}/20260414_185734.avif`,
    alt: "Deer in the backyard behind a fence",
    width: 182,
    height: 250,
    left: 425.98,
    top: 88.59,
    rotateDeg: 7.32,
    tooltip: "Permanent neighbor",
  },
  {
    src: `${BASE}/20260325_133635.avif`,
    alt: "Shared meal on injera bread",
    width: 141,
    height: 250,
    left: 252.92,
    top: 75,
    rotateDeg: -3.77,
    tooltip: "Trying Ethiopian!",
  },
  {
    src: `${BASE}/20250716_132740.avif`,
    alt: "On the field at Ford Field",
    width: 141,
    height: 250,
    left: 468.92,
    top: 287,
    rotateDeg: -6.95,
    tooltip: "Visiting Detroit Ford Field",
  },
  {
    src: `${BASE}/20250429_133520.avif`,
    alt: "Hand-drawn sketch on grid paper",
    width: 190,
    height: 250,
    left: 597.92,
    top: 201,
    rotateDeg: 3.79,
    tooltip: "ilovesketching, if it wasn't clear",
  },
  {
    src: `${BASE}/20250116_195033.avif`,
    alt: "Polaroid-style portrait",
    width: 180,
    height: 250,
    left: 662.92,
    top: 0,
    rotateDeg: -5.96,
    tooltip: "just pri",
  },
  {
    src: `${BASE}/20241126_130402.avif`,
    alt: "Dexter Funko Pop in box",
    width: 141,
    height: 250,
    left: 766.92,
    top: 319,
    rotateDeg: -3.61,
    tooltip: "owe my grumpiness to him",
  },
  {
    src: `${BASE}/20241019_180259.avif`,
    alt: "Autumn trees with orange and yellow leaves",
    width: 199,
    height: 250,
    left: 798.63,
    top: 118,
    rotateDeg: 9.55,
    tooltip: "Beauty = Bloomington",
  },
  {
    src: `${BASE}/IMG-20241018-WA0001.avif`,
    alt: "Sketching on a whiteboard",
    width: 216,
    height: 250,
    left: 0,
    top: 145.2,
    rotateDeg: -6.74,
    tooltip: "Smiling the widest when sketching",
  },
  {
    src: `${BASE}/IMG-20260515-WA0001.avif`,
    alt: "Graduation day moment with a squirrel",
    width: 327,
    height: 250,
    left: 135.92,
    top: 245,
    rotateDeg: 7.43,
    tooltip: "Cute = IUB Squirrels",
  },
];
