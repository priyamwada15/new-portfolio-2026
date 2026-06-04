import { CONTACT_EMAIL } from "@/app/lib/contact";
import { HOME_V2_ROW_GAP_PX } from "@/design-system";
import type { SocialSegment } from "./types";

/** Text rows: two headline lines + social links. */
export const FLIP_BOARD_ROWS = 3;

export const LINE_1_ROWS = ["LET'S MAKE BEAUTIFUL", "SOFTWARE TOGETHER"] as const;

export const SOCIAL_SEGMENTS: readonly SocialSegment[] = [
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/priyamwadapandey",
  },
  {
    label: "X",
    href: "https://x.com/PriymwadaPandey",
  },
  {
    label: "GITHUB",
    href: "https://github.com/priyamwada15",
  },
  {
    label: "EMAIL",
    href: `mailto:${CONTACT_EMAIL}`,
  },
] as const;

export const FLIP_BOARD_BACKGROUND_SRC =
  "/flip-board-footer/pench-jabalpur-marble-rocks-activity.jpg.imgw.1280.1280.jpeg_202606031550.jpeg";

export const FLIP_BOARD_SPIN_SOUND_SRC =
  "/flip-board-footer/victorabdo-spin-232536.mp3";

/** Wall-clock reveal — synced to spin SFX length. */
export const FLIP_BOARD_REVEAL_DURATION_S = 3;

/** Opaque gap below homepage snippets before the flip-board reveal (matches row gaps). */
export const FLIP_BOARD_REVEAL_SCROLL_GAP_PX = HOME_V2_ROW_GAP_PX;

/** How far the scroll sheet overlaps the top of the footer image (image hidden under the sheet). */
export const FLIP_BOARD_REVEAL_IMAGE_OVERLAP_PX = 44;
