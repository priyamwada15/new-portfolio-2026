/** Copy + media for the homepage Work / Play tab (Play pane). */

export type PlayPortfolioItem = {
  id: string;
  title: string;
  /** Body copy on home Play cards; `homeDescription` overrides when set. */
  description: string;
  /** When set, the home Play tab uses this longer body instead of `description`. */
  homeDescription?: string;
  /** Meta row on home Play cards only (chips + * separators). */
  tagParts: readonly string[];
  /** Filled liquid pill (arrow or X icon). */
  filledCta?: {
    label: string;
    href: string;
    ariaLabel: string;
    icon: "arrow" | "x";
  };
  /** Underline + arrow link (e.g. Play Game, View Shader). */
  experienceCta?: { label: string; href: string; ariaLabel: string };
  /** Resume-style pill: GitHub icon + “View on GitHub”. */
  githubLiquidCta?: { href: string; ariaLabel: string };
  secondaryCta?: { label: string; href: string };
  videoSrc?: string;
  posterSrc?: string;
  embedSrc?: string;
  /** Static preview when there is no video or embed. */
  imageSrc?: string;
  /** CSS `aspect-ratio` for the media panel (default `16 / 9`). */
  mediaAspectRatio?: string;
  /**
   * When set, the media shell uses this fixed height (px) like homepage case-study grey panels.
   * Video fills that height, keeps aspect ratio, and sits left (extra width clips on the right).
   */
  mediaPanelFixedHeightPx?: number;
  /**
   * Optional stills on the left and right of the video (same fixed-height row).
   * When set, the row is centered; flank assets are width-led and scaled (see `PlayTabAutoVideo`).
   */
  mediaFlankImages?: {
    left: { src: string; alt: string };
    right: { src: string; alt: string };
  };
  /** When true, the media shell has no grey gradient overlay (crisp rounded rect). */
  mediaPanelOmitGradient?: boolean;
  /** `aria-label` on `<video>`; `title` on `<iframe>`. */
  mediaAlt: string;
};

const PROFILE_X_HREF = "https://x.com/PriymwadaPandey";

const ASCII_GAME_GITHUB_HREF =
  "https://github.com/priyamwada15/ASCII-race-game-with-Pixelact-and-shadcn-UI";
const SUNLIGHT_SHADER_GITHUB_HREF =
  "https://github.com/priyamwada15/sunlight-effect";

/** AVIF assets under `public/play/` — regenerate with `npm run optimize:play-images`. */
const PLAY_AVIF = "/play";

const ASCII_GAME_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1778784207/Screen_Recording_2026-05-13_235432_gyusng.mp4";
const ASCII_GAME_POSTER_SRC = `${PLAY_AVIF}/ascii-game-poster.avif`;
const STELLAR_SCAN_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1778784179/Stellar_Scan_Video_wghj5o.mp4";
const STELLAR_SCAN_POSTER_SRC = `${PLAY_AVIF}/stellar-scan-poster.avif`;
const AI_INTELLIGENCER_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1776089764/Screen_Recording_2026-04-13_101501_ls24dq.mp4";
const AI_INTELLIGENCER_POSTER_SRC = `${PLAY_AVIF}/ai-intelligencer-poster.avif`;
const ROCKET_LISA_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779388469/Screen_Recording_2026-05-21_143314_cenlai.mp4";
const ROCKET_LISA_POSTER_SRC = `${PLAY_AVIF}/rocket-lisa-poster.avif`;
const ROBOT_DUET_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952719/20250416_201134_2_vimbv1.mp4";
const ROBOT_DUET_POSTER_SRC = `${PLAY_AVIF}/robo-poster.avif`;
const ROBO_FLANK_LEFT_SRC = `${PLAY_AVIF}/robo1.avif`;
const ROBO_FLANK_RIGHT_SRC = `${PLAY_AVIF}/robo2.avif`;

export const PLAY_PORTFOLIO_ITEMS: PlayPortfolioItem[] = [
  {
    id: "ascii-run",
    title: "ASCII Run",
    tagParts: ["Cursor", "May 2026"],
    description:
      "A fast scroll-linked lane dodge game, navigate using arrow keys, ramping speed every 5s and a chance to listen to my favorite song.",
    experienceCta: {
      label: "Play Game",
      href: "/ascii-game",
      ariaLabel: "Play the ASCII lane game",
    },
    githubLiquidCta: {
      href: ASCII_GAME_GITHUB_HREF,
      ariaLabel: "View ASCII Run on GitHub",
    },
    videoSrc: ASCII_GAME_VIDEO_SRC,
    posterSrc: ASCII_GAME_POSTER_SRC,
    mediaAlt: "Screen recording of the ASCII lane game",
  },
  {
    id: "sunlight-effect",
    title: "Sunlight Effect",
    tagParts: ["React Component", "CSS", "May 2026"],
    description:
      "A React component with CSS-driven shadow bands and a soft radial glow that read as sunlight. The shader is applied on my homepage.",
    experienceCta: {
      label: "View Shader",
      href: "/sunlight",
      ariaLabel: "Open the Sunlight shader page",
    },
    githubLiquidCta: {
      href: SUNLIGHT_SHADER_GITHUB_HREF,
      ariaLabel: "View Sunlight effect on GitHub",
    },
    mediaAlt: "Sunlight shader effect on the homepage background",
  },
  {
    id: "rocket-lisa",
    title: "Rocket LISA",
    tagParts: ["Figma", "Claude Code", "Nano Banana 2", "April 2026"],
    description:
      "Dawn of Man. Dawn of personal finance. Redesigned Rocket Money's dashboard in the 1984 Apple Macintosh GUI style. The apes are reacting to my spending report.",
    videoSrc: ROCKET_LISA_VIDEO_SRC,
    posterSrc: ROCKET_LISA_POSTER_SRC,
    mediaAlt: "Rocket LISA screen recording",
  },
  {
    id: "robot-duet",
    title: "Robot Arm Duet",
    tagParts: ["Arduino", "Python", "Processing", "Apr 2025"],
    description:
      "Two people each control one arm from a laptop touchpad, left, right, up, down. Built the entire system across three environments, Arduino handling the hardware, Python bridging the communication and audio output, Processing handling the touch input.",
    filledCta: {
      label: "Chat with me about it",
      href: PROFILE_X_HREF,
      ariaLabel: "Chat on X about Robot Arm Duet",
      icon: "x",
    },
    mediaPanelFixedHeightPx: 500,
    mediaPanelOmitGradient: true,
    mediaFlankImages: {
      left: { src: ROBO_FLANK_LEFT_SRC, alt: "Robot arm duet hardware, left of video" },
      right: { src: ROBO_FLANK_RIGHT_SRC, alt: "Robot arm duet hardware, right of video" },
    },
    videoSrc: ROBOT_DUET_VIDEO_SRC,
    posterSrc: ROBOT_DUET_POSTER_SRC,
    mediaAlt: "Robot arms duet prototype screen recording",
  },
  {
    id: "stellar-scan",
    title: "Stellar Scan",
    tagParts: ["Google Stitch", "Google AI Studio", "Mar 2026"],
    description:
      "A retro-futuristic star map from one line in Stitch—enter a date, see the dominant constellation, export a playing card.",
    homeDescription:
      "A retro-futuristic star mapping tool. Enter a date, get the dominant constellation, download a playing card. Used Stitch for the design system, AI Studio to build.",
    filledCta: {
      label: "Open Website",
      href: "https://stellar-scan-eta.vercel.app/",
      ariaLabel: "Open Stellar Scan website",
      icon: "arrow",
    },
    videoSrc: STELLAR_SCAN_VIDEO_SRC,
    posterSrc: STELLAR_SCAN_POSTER_SRC,
    mediaAlt: "Stellar Scan constellation UI",
  },
  {
    id: "ai-intelligencer",
    title: "AI Intelligencer",
    tagParts: ["Claude Code", "Mar 2026"],
    description:
      "Designed and built a newspaper-style widget that pulls live AI news into a vintage broadsheet layout.",
    filledCta: {
      label: "Open Widget",
      href: "https://ai-intelligencer.vercel.app/",
      ariaLabel: "Open AI Intelligencer widget",
      icon: "arrow",
    },
    videoSrc: AI_INTELLIGENCER_VIDEO_SRC,
    posterSrc: AI_INTELLIGENCER_POSTER_SRC,
    mediaAlt: "AI Intelligencer newspaper-style layout",
  },
];

/** Homepage Play tab order. */
export const HOME_PLAY_TAB_ITEM_IDS = [
  "ascii-run",
  "sunlight-effect",
  "rocket-lisa",
  "robot-duet",
  "stellar-scan",
  "ai-intelligencer",
] as const;

export function getHomePlayTabItems(): PlayPortfolioItem[] {
  return HOME_PLAY_TAB_ITEM_IDS.map((id) => {
    const item = PLAY_PORTFOLIO_ITEMS.find((p) => p.id === id);
    if (!item) throw new Error(`Missing play portfolio item: ${id}`);
    return item;
  });
}
