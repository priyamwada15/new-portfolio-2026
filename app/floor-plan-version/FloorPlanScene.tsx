import Link from "next/link";
import "./floor-plan-tilt.css";
import { CreativeLicenseCard } from "./CreativeLicenseCard";
import { FloorPlanMailbox } from "./FloorPlanMailbox";
import { FloorPlanTooltipContent } from "./FloorPlanTooltipContent";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/app/components/animate-ui/tooltip";

const ASSET = (name: string) => `/new-homepage-plan/${encodeURIComponent(name)}`;
const WALL_ASSET = (name: string) => `/new-homepage-plan/Walls/${encodeURIComponent(name)}`;
const WINDOW_ASSET = (name: string) => `/new-homepage-plan/Windows/${encodeURIComponent(name)}`;

const ROOT_W = 1728;
const ROOT_H = 1117;

export { ROOT_W, ROOT_H };

const HOUSE_W = 1059;
const HOUSE_H = 1090;
const HOUSE_LEFT = (ROOT_W - HOUSE_W) / 2;
const HOUSE_TOP = 27;

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
  bg: string;
};

/**
 * Positions/sizes are the visual bounding boxes verified against the Figma screenshot (matching the
 * original code-gen export). Note: Figma's raw node metadata reports the PRE-rotation origin for the
 * 90°-rotated wall/window rects, which is offset from the true visual position by exactly that rect's
 * own width or height depending on rotation direction — so metadata x/y could not be used directly here.
 * File names map to the exported "Rectangle N" SVG layers via name/size matching against that metadata.
 */
/** svgW/svgH are each file's native canvas size (rect + stroke overflow) — slightly larger than width/height, which is the plain fill size used for layout math elsewhere. */
const WALLS = [
  { file: "Rectangle 1.svg", left: 65, top: 51, width: 249, height: 14, svgW: 250, svgH: 16 },
  { file: "Rectangle 5.svg", left: 182, top: 298, width: 58, height: 14, svgW: 59, svgH: 16 },
  { file: "Rectangle 51.svg", left: 65, top: 298, width: 52, height: 14, svgW: 53, svgH: 16 },
  { file: "Rectangle 40.svg", left: 817, top: 407, width: 175, height: 14, svgW: 176, svgH: 16 },
  { file: "Rectangle 44.svg", left: 760, top: 51, width: 232, height: 14, svgW: 233, svgH: 16 },
  { file: "Rectangle 42.svg", left: 760, top: 748, width: 232, height: 14, svgW: 233, svgH: 16 },
  { file: "Rectangle 15.svg", left: 182, top: 748, width: 58, height: 14, svgW: 59, svgH: 16 },
  { file: "Rectangle 50.svg", left: 65, top: 748, width: 52, height: 14, svgW: 53, svgH: 16 },
  { file: "Rectangle 23.svg", left: 313, top: 748, width: 88, height: 14, svgW: 89, svgH: 16 },
  { file: "Rectangle 52.svg", left: 313, top: 298, width: 172, height: 14, svgW: 173, svgH: 16 },
  { file: "Rectangle 54.svg", left: 485, top: 298, width: 90, height: 14, svgW: 91, svgH: 15 },
  { file: "Rectangle 53.svg", left: 575, top: 298, width: 172, height: 14, svgW: 173, svgH: 16 },
  { file: "Rectangle 31.svg", left: 658, top: 748, width: 88, height: 14, svgW: 89, svgH: 16 },
  { file: "Rectangle 16.svg", left: 65, top: 991, width: 248, height: 14, svgW: 249, svgH: 16 },
  { file: "Rectangle 32.svg", left: 760, top: 991, width: 68, height: 14, svgW: 69, svgH: 16 },
  { file: "Rectangle 33.svg", left: 924, top: 991, width: 68, height: 14, svgW: 69, svgH: 16 },
  { file: "Rectangle 2.svg", left: 51, top: 51, width: 14, height: 97, svgW: 16, svgH: 98 },
  { file: "Rectangle 19.svg", left: 299, top: 65, width: 14, height: 247, svgW: 16, svgH: 248 },
  { file: "Rectangle 3.svg", left: 51, top: 212, width: 14, height: 100, svgW: 16, svgH: 101 },
  { file: "Rectangle 8.svg", left: 226, top: 312, width: 14, height: 77, svgW: 16, svgH: 78 },
  { file: "Rectangle 9.svg", left: 226, top: 673, width: 14, height: 75, svgW: 16, svgH: 76 },
  { file: "Rectangle 13.svg", left: 51, top: 748, width: 14, height: 100, svgW: 16, svgH: 101 },
  { file: "Rectangle 27.svg", left: 409, top: 992, width: 14, height: 61, svgW: 16, svgH: 62 },
  { file: "Rectangle 29.svg", left: 636, top: 992, width: 14, height: 61, svgW: 16, svgH: 62 },
  { file: "Rectangle 14.svg", left: 51, top: 913, width: 14, height: 92, svgW: 16, svgH: 93 },
  { file: "Rectangle 18.svg", left: 299, top: 748, width: 14, height: 243, svgW: 16, svgH: 244 },
  { file: "Rectangle 30.svg", left: 746, top: 748, width: 14, height: 257, svgW: 16, svgH: 258 },
  { file: "Rectangle 34.svg", left: 992, top: 913, width: 14, height: 92, svgW: 16, svgH: 93 },
  { file: "Rectangle 35.svg", left: 992, top: 726, width: 14, height: 126, svgW: 16, svgH: 127 },
  { file: "Rectangle 37.svg", left: 992, top: 341, width: 14, height: 100, svgW: 16, svgH: 101 },
  { file: "Rectangle 38.svg", left: 992, top: 51, width: 14, height: 192, svgW: 16, svgH: 193 },
  { file: "Rectangle 39.svg", left: 746, top: 51, width: 14, height: 370, svgW: 16, svgH: 371 },
  { file: "Rectangle 54-1.svg", left: 51, top: 312, width: 14, height: 436, svgW: 16, svgH: 438 },
];

const WINDOWS = [
  { file: "Window 1.svg", left: 51, top: 147, width: 14, height: 65, svgW: 15, svgH: 67 },
  { file: "Window 2.svg", left: 51, top: 848, width: 14, height: 65, svgW: 15, svgH: 67 },
  { file: "Window 3.svg", left: 117, top: 748, width: 65, height: 14, svgW: 67, svgH: 15 },
  { file: "Window 4.svg", left: 117, top: 298, width: 65, height: 14, svgW: 67, svgH: 15 },
  { file: "Window 5.svg", left: 992, top: 852, width: 14, height: 61, svgW: 15, svgH: 63 },
  { file: "Window 6.svg", left: 992, top: 441, width: 14, height: 95, svgW: 15, svgH: 97 },
  { file: "Window 7.svg", left: 992, top: 536, width: 14, height: 95, svgW: 15, svgH: 97 },
  { file: "Window 8.svg", left: 992, top: 631, width: 14, height: 95, svgW: 15, svgH: 97 },
  { file: "Window 9.svg", left: 992, top: 243, width: 14, height: 98, svgW: 15, svgH: 100 },
  { file: "Window 10.svg", left: 226, top: 481, width: 14, height: 95, svgW: 15, svgH: 97 },
  { file: "Window 11.svg", left: 226, top: 389, width: 14, height: 92, svgW: 15, svgH: 94 },
  { file: "Window 12.svg", left: 226, top: 576, width: 14, height: 97, svgW: 15, svgH: 99 },
  { file: "Window 13.svg", left: 313, top: 991, width: 96, height: 14, svgW: 98, svgH: 15 },
  { file: "Window 14.svg", left: 650, top: 991, width: 96, height: 14, svgW: 98, svgH: 15 },
  { file: "Window 15.svg", left: 828, top: 991, width: 96, height: 14, svgW: 98, svgH: 15 },
];

const FRAMES: Rect[] = [
  { left: 328, top: 292, width: 50, height: 5, bg: "#f4af30" },
  { left: 585, top: 292, width: 50, height: 5, bg: "#f4af30" },
  { left: 392, top: 292, width: 15, height: 5, bg: "#f4af30" },
  { left: 649, top: 292, width: 30, height: 5, bg: "#f4af30" },
  { left: 421, top: 292, width: 51, height: 5, bg: "#f4af30" },
  { left: 693, top: 292, width: 51, height: 5, bg: "#f4af30" },
];

export function FloorPlanScene() {
  return (
    <TooltipProvider openDelay={150} closeDelay={150}>
    <div className="relative" style={{ width: ROOT_W, height: ROOT_H }}>
      <div className="absolute left-0 top-0 h-[1117px] w-[1728px] bg-[#bfb74c]" />

      <div
        className="absolute overflow-clip bg-[rgba(245,233,207,0.8)] shadow-[0px_0px_52px_16px_rgba(0,0,0,0.15)]"
        style={{ left: HOUSE_LEFT, top: HOUSE_TOP, width: HOUSE_W, height: HOUSE_H }}
      >
        {/* Tars room */}
        <Tooltip side="top" sideOffset={8}>
          <TooltipTrigger asChild>
            <Link
              href="/tars-debug-mode"
              aria-label="View Tars case study"
              className="absolute block cursor-hover-pointer"
              style={{ left: 65, top: 65, width: 234, height: 246 }}
            >
              <div className="absolute inset-0 bg-[rgba(129,78,168,0.3)]" />
              <img
                src={ASSET("Tars Image Asset.png")}
                alt="Tars"
                data-fp-key="tars"
                className="fp-tilt absolute object-contain"
                style={{ left: 11.5, top: 5.72, width: 214.5, height: 217.775 }}
              />
            </Link>
          </TooltipTrigger>
          <FloorPlanTooltipContent>Tars case study</FloorPlanTooltipContent>
        </Tooltip>

        {/* Rocket Mortgage room */}
        <Tooltip side="top" sideOffset={8}>
          <TooltipTrigger asChild>
            <Link
              href="/rocket-mortgage"
              aria-label="View Rocket Mortgage case study"
              className="absolute block cursor-hover-pointer"
              style={{ left: 760, top: 65, width: 232, height: 356 }}
            >
              <div className="absolute inset-0 bg-[rgba(223,76,80,0.3)]" />
              <img
                src={ASSET("Rocket Mortgage Image Asset.png")}
                alt="Rocket Mortgage"
                data-fp-key="rocket-mortgage"
                className="fp-tilt absolute object-contain"
                style={{ left: -7, top: 1.3, width: 241.125, height: 351.922 }}
              />
            </Link>
          </TooltipTrigger>
          <FloorPlanTooltipContent>Rocket Mortgage case study</FloorPlanTooltipContent>
        </Tooltip>

        {/* Salesforce room */}
        <Tooltip side="top" sideOffset={8}>
          <TooltipTrigger asChild>
            <Link
              href="/salesforce"
              aria-label="View Salesforce case study"
              className="absolute block cursor-hover-pointer"
              style={{ left: 65, top: 748, width: 234, height: 243 }}
            >
              <div className="absolute inset-0 bg-[rgba(39,169,213,0.3)]" />
              <img
                src={ASSET("Salesforce Image Asset.png")}
                alt="Salesforce"
                data-fp-key="salesforce"
                className="fp-tilt absolute object-contain"
                style={{ left: 13, top: 13, width: 228.503, height: 218.249 }}
              />
            </Link>
          </TooltipTrigger>
          <FloorPlanTooltipContent>Salesforce case study</FloorPlanTooltipContent>
        </Tooltip>

        {/* Playground / Gallery of Experiments */}
        <div className="absolute left-[313px] top-[139px] h-[159px] w-[433px] bg-[rgba(158,151,63,0.2)]" />
        <img
          src={ASSET("Stairs Playground.svg")}
          alt=""
          className="absolute"
          style={{ left: 314, top: 106, width: 432, height: 34 }}
        />
        {FRAMES.map((frame, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: frame.left, top: frame.top, width: frame.width, height: frame.height, background: frame.bg }}
          />
        ))}
        <img
          src={ASSET("Furniture.png")}
          alt=""
          data-fp-key="furniture"
          className="fp-tilt absolute object-contain"
          style={{ left: 461, top: 149, width: 117, height: 88 }}
        />
        <p
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-label text-[16px] text-[#6f680d]"
          style={{ left: 525.5, top: 261.5 }}
        >
          Gallery of Experiments
        </p>

        {/* Walls */}
        {WALLS.map((wall) => (
          <img
            key={wall.file}
            src={WALL_ASSET(wall.file)}
            alt=""
            className="absolute"
            style={{
              left: wall.left + wall.width / 2 - wall.svgW / 2,
              top: wall.top + wall.height / 2 - wall.svgH / 2,
              width: wall.svgW,
              height: wall.svgH,
            }}
          />
        ))}

        {/* Under construction room */}
        <Tooltip side="top" sideOffset={8}>
          <TooltipTrigger asChild>
            <div
              tabIndex={0}
              aria-label="Project under construction"
              className="absolute size-[232px]"
              style={{ left: 760, top: 762 }}
            >
              <img
                src={ASSET("Under Construction Tape.png")}
                alt=""
                className="absolute inset-0 size-full opacity-50"
              />
            </div>
          </TooltipTrigger>
          <FloorPlanTooltipContent>Project under construction</FloorPlanTooltipContent>
        </Tooltip>

        {/* Windows */}
        {WINDOWS.map((w) => (
          <img
            key={w.file}
            src={WINDOW_ASSET(w.file)}
            alt=""
            className="absolute"
            style={{
              left: w.left + w.width / 2 - w.svgW / 2,
              top: w.top + w.height / 2 - w.svgH / 2,
              width: w.svgW,
              height: w.svgH,
            }}
          />
        ))}

        {/* Profile photo's white border and tilt are already baked into the PNG — render at the original (rotated) bounding box, no added transform. */}
        <img
          src={ASSET("Self Image.png")}
          alt="Priyamwada"
          data-fp-key="self-image"
          className="fp-tilt absolute object-contain"
          style={{ left: 807.64, top: 485.17, width: 150.202, height: 168.028 }}
        />

        {/* Foyer */}
        <FloorPlanMailbox style={{ left: 671, top: 797, width: 62.733, height: 173 }} />
        {/* Resume's white card + shadow are baked into the PNG — no extra border/clip needed. */}
        <img
          src={ASSET("Pandey_Priyamwada_Resume-1 1.png")}
          alt="Resume"
          data-fp-key="resume"
          className="fp-tilt absolute object-contain"
          style={{
            left: 537.15,
            top: 725.74,
            width: 90.713,
            height: 117.394,
            transformOrigin: "center",
          }}
        />
        {/* LinkedIn icon's white border and tilt are already baked into the SVG — render at native size, no added transform. */}
        <Tooltip side="top" sideOffset={8}>
          <TooltipTrigger asChild>
            <a
              href="https://www.linkedin.com/in/priyamwadapandey"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="absolute block cursor-hover-pointer"
              style={{ left: 402.025, top: 797.025, width: 41, height: 41 }}
            >
              <img
                src={ASSET("LinkedIn Logo.svg")}
                alt="LinkedIn"
                data-fp-key="linkedin"
                className="fp-tilt absolute"
                style={{ left: 0, top: 0, width: 41, height: 41 }}
              />
            </a>
          </TooltipTrigger>
          <FloorPlanTooltipContent>LinkedIn</FloorPlanTooltipContent>
        </Tooltip>
        <Tooltip side="top" sideOffset={8}>
          <TooltipTrigger asChild>
            <a
              href="https://x.com/PriymwadaPandey"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="absolute block cursor-hover-pointer"
              style={{ left: 336, top: 792, width: 36, height: 35.5 }}
            >
              <img
                src={ASSET("Twitter.svg")}
                alt="X / Twitter"
                data-fp-key="twitter"
                className="fp-tilt absolute"
                style={{ left: 0, top: 0, width: 36, height: 35.5 }}
              />
            </a>
          </TooltipTrigger>
          <FloorPlanTooltipContent>X</FloorPlanTooltipContent>
        </Tooltip>
        <Tooltip side="top" sideOffset={8}>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/priyamwada15"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="absolute block cursor-hover-pointer"
              style={{ left: 461, top: 748, width: 49.135, height: 49.135 }}
            >
              <img
                src={ASSET("GitHub.svg")}
                alt="GitHub"
                data-fp-key="github"
                className="fp-tilt absolute"
                style={{ left: 0, top: 0, width: 49.135, height: 49.135 }}
              />
            </a>
          </TooltipTrigger>
          <FloorPlanTooltipContent>GitHub</FloorPlanTooltipContent>
        </Tooltip>
        <img
          src={ASSET("Boombox.png")}
          alt=""
          data-fp-key="boombox"
          className="fp-tilt absolute object-contain"
          style={{ left: 330, top: 861, width: 93.5, height: 80 }}
        />
        <img
          src={ASSET("Stairs Foyer.svg")}
          alt=""
          className="absolute"
          style={{ left: 423, top: 1004, width: 213, height: 50 }}
        />
        <CreativeLicenseCard style={{ left: 457, top: 866, width: 172.583, height: 125.192 }} />

        {/* Hero copy */}
        <p
          className="absolute -translate-y-1/2 whitespace-nowrap font-label text-[16px] font-medium text-[rgba(149,6,44,0.5)]"
          style={{ left: `calc(50% - 263.5px)`, top: 508 }}
        >
          Hi, I&rsquo;m Priyamwada. An Architect turned Product Designer.
        </p>
        <p
          className="absolute font-label text-[36px] font-semibold leading-[1.3] text-[#95062c]"
          style={{ left: `calc(50% - 263.5px)`, top: 528, width: 521 }}
        >
          I design for enterprise systems, AI and SaaS products from 0→1.
        </p>
      </div>

      {/* Trees */}
      <img
        src={ASSET("Bottom Right Trees.svg")}
        alt=""
        className="absolute"
        style={{ left: 1362, top: 889, width: 426.621, height: 270.094 }}
      />
      <img
        src={ASSET("Top Right Trees.svg")}
        alt=""
        className="absolute"
        style={{ left: ROOT_W - 301.058, top: 0, width: 301.058, height: 325.357 }}
      />
      <img
        src={ASSET("Bottom Left Trees.svg")}
        alt=""
        className="absolute"
        style={{ left: -64, top: 880, width: 379.55, height: 263.764 }}
      />
      <img
        src={ASSET("Top Left Trees.svg")}
        alt=""
        className="absolute"
        style={{ left: -44, top: 0, width: 311, height: 437 }}
      />
    </div>
    </TooltipProvider>
  );
}
