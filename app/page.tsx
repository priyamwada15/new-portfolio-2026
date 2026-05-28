import { HOME_V2_PAGE_BG } from "./lib/caseStudy";
import { SunlightEffect } from "./components/SunlightEffect";
import Image from "next/image";
import { aboutAssets } from "./about/aboutAssets";
import { HomeV2SnippetsSection } from "./home-v2/HomeV2SnippetsSection";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { HomeV2PlayableCard } from "./home-v2/HomeV2PlayableCard";
import { HomeV2VideoProvider } from "./home-v2/HomeV2VideoProvider";
import { LazyVideo } from "./home-v2/LazyVideo";
import { ScrollReveal } from "@/app/components/ScrollReveal";

const HOME_V2_TOP_PX = 92;
const HOME_V2_RM_CARD_H_PX = 637;
const HOME_V2_ROW_GAP_PX = 56;
const HOME_V2_ROW_H_PX = 450;
const HOME_V2_CENTRAL_BLOCK_H_PX = 956;
const HOME_V2_ROW2_H_PX = 450;
const HOME_V2_FOOTER_SAFE_SPACE_PX = 96;

const HOME_V2_SECOND_ROW_TOP_PX =
  HOME_V2_TOP_PX + HOME_V2_RM_CARD_H_PX + HOME_V2_ROW_GAP_PX;
const HOME_V2_CENTRAL_BLOCK_TOP_PX =
  HOME_V2_SECOND_ROW_TOP_PX + HOME_V2_ROW_H_PX + HOME_V2_ROW_GAP_PX;
const HOME_V2_ROW2_TOP_PX =
  HOME_V2_CENTRAL_BLOCK_TOP_PX + HOME_V2_CENTRAL_BLOCK_H_PX + HOME_V2_ROW_GAP_PX;
const HOME_V2_SNIPPETS_GAP_PX = 64;
const HOME_V2_SNIPPETS_H_PX = 577;
const HOME_V2_SNIPPETS_TOP_PX =
  HOME_V2_ROW2_TOP_PX + HOME_V2_ROW2_H_PX + HOME_V2_SNIPPETS_GAP_PX;

const ARDUINO_ROBOT_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952719/20250416_201134_2_vimbv1.mp4";
const ROCKET_LISA_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779388469/Screen_Recording_2026-05-21_143314_cenlai.mp4";
const SUNLIGHT_SHADER_CARD_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779835178/Sunlight_q0djya.mp4";
/** Same as homepage Play tab ASCII Run card (`playPortfolio.ts`). */
const ASCII_LANE_GAME_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1778784207/Screen_Recording_2026-05-13_235432_gyusng.mp4";
const WATER_SHADER_CARD_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779834787/Water_shader_mzsc0k.mp4";

const SUNLIGHT_SHADER_GITHUB_HREF =
  "https://github.com/priyamwada15/sunlight-effect";
const STELLAR_SCAN_HREF = "https://stellar-scan-eta.vercel.app/";
const ASCII_GAME_GITHUB_HREF =
  "https://github.com/priyamwada15/ASCII-race-game-with-Pixelact-and-shadcn-UI";
const WATER_SHADER_GITHUB_HREF = "https://github.com/priyamwada15/water-glint-shader";

const cardFooterFont = {
  fontFamily: "var(--font-hind), sans-serif",
  fontStyle: "normal" as const,
  fontWeight: 400,
};

const INTRO_PARAGRAPHS = [
  "Product Designer who has worked on products across fintech, edtech and enterprise tools.",
  "Whether it's a first-time homebuyer navigating a mortgage or a student figuring out what to study, I design for moments where the product has to get it right.",
  "Outside of work, I tinker and try to build something every now and then to exercise my design muscles. Recent projects include a water shader, a LISA GUI fintech dashboard and an ASCII racing game.",
] as const;

export default function HomeV2Page() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: HOME_V2_PAGE_BG }}>
      <SunlightEffect className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" />

      <div className="relative z-[2] min-h-screen">
        <HomeV2VideoProvider>
        {/* Align page content to nav inner container edges */}
        <div
          className="relative mx-auto w-[86%] max-w-[1008px]"
          style={{
            minHeight: `${
              HOME_V2_TOP_PX +
              HOME_V2_RM_CARD_H_PX +
              HOME_V2_ROW_GAP_PX +
              HOME_V2_ROW_H_PX +
              HOME_V2_ROW_GAP_PX +
              HOME_V2_CENTRAL_BLOCK_H_PX +
              HOME_V2_ROW_GAP_PX +
              HOME_V2_ROW2_H_PX +
              HOME_V2_SNIPPETS_GAP_PX +
              HOME_V2_SNIPPETS_H_PX +
              HOME_V2_FOOTER_SAFE_SPACE_PX
            }px`,
          }}
        >
          {/* Left: intro text (aligned with nav left edge) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: `${HOME_V2_TOP_PX}px`,
              width: "594px",
              zIndex: 1,
            }}
          >
          <ScrollReveal revealOnMount>
            <div
              style={{
                fontFamily: "var(--font-hind), sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "160%",
                color: "#555555",
              }}
            >
              {INTRO_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph} style={{ margin: 0, marginBottom: "24px" }}>
                  {paragraph}
                </p>
              ))}

            {/* About snippets block (56px below text) */}
            <div style={{ marginTop: "56px", display: "flex", gap: "64px" }}>
              {/* Reading */}
              <div style={{ width: "300px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-hind), sans-serif",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "130%",
                    color: "#555555",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <span aria-hidden>📚</span>
                  <span>Reading</span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  {/* Devil's Advocate with hover reveal */}
                  <div className="group relative h-[150px] w-[92.92px] shrink-0 cursor-default">
                    <div
                      className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-white box-border transition-opacity duration-300 group-hover:opacity-0"
                      style={{ boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.12)" }}
                    >
                      <Image
                        src={aboutAssets.bookDevilsAdvocate}
                        alt="The Devil's Advocate book cover"
                        fill
                        sizes="93px"
                        className="object-cover"
                      />
                    </div>
                    <div
                      className="pointer-events-none absolute left-0 top-1/2 z-40 h-[250px] w-[250px] -translate-y-1/2 scale-[0.96] opacity-0 overflow-hidden rounded-2xl border-4 border-white box-border transition-[opacity,transform] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
                      style={{ boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.12)" }}
                      aria-hidden
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={aboutAssets.bookHoverCat}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Culture Map with hover reveal */}
                  <div className="group relative h-[150px] w-[98.63px] shrink-0 cursor-default">
                    <div
                      className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-white box-border transition-opacity duration-300 group-hover:opacity-0"
                      style={{ boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.12)" }}
                    >
                      <Image
                        src={aboutAssets.bookCultureMap}
                        alt="The Culture Map book cover"
                        fill
                        sizes="99px"
                        className="object-cover"
                      />
                    </div>
                    <div
                      className="pointer-events-none absolute right-0 top-1/2 z-40 h-[250px] w-[250px] -translate-y-1/2 scale-[0.96] opacity-0 overflow-hidden rounded-2xl border-4 border-white box-border transition-[opacity,transform] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
                      style={{ boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.12)" }}
                      aria-hidden
                    >
                      <Image
                        src={aboutAssets.bookHoverOffice}
                        alt=""
                        fill
                        sizes="250px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Listening + Learning */}
              <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "40px" }}>
                {/* Listening */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-hind), sans-serif",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "130%",
                      color: "#555555",
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <span aria-hidden>🎵</span>
                    <span>Listening</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", height: "50px" }}>
                    <div
                      style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "2px solid #FFFFFF",
                        boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Image
                        src={aboutAssets.listeningAlbum}
                        alt="Peaches album art"
                        fill
                        sizes="50px"
                        className="object-cover"
                      />
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-hind), sans-serif",
                        fontStyle: "normal",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "130%",
                        color: "#333333",
                      }}
                    >
                      Peaches <span style={{ fontWeight: 400, color: "#555555" }}>by The Black Keys</span>
                    </div>
                  </div>
                </div>

                {/* Learning */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-hind), sans-serif",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "130%",
                      color: "#555555",
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <span aria-hidden>✏️</span>
                    <span>Learning</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        gap: "8px",
                        height: "40px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: "#F3F5F6",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-hidden
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/jMyKrhKKXqpc15qYqC3A0pZELw%201.png"
                          alt="Rive logo"
                          style={{ width: "16px", height: "16px", objectFit: "contain" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-hind), sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "130%",
                          color: "#555555",
                        }}
                      >
                        Rive
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        gap: "8px",
                        height: "40px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: "#F3F5F6",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-hidden
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/Vector.svg"
                          alt="Unicorn Studio logo"
                          style={{ width: "16px", height: "16px", objectFit: "contain" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-hind), sans-serif",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "130%",
                          color: "#555555",
                        }}
                      >
                        Unicorn Studio
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </ScrollReveal>
          </div>

          {/* Right: card (aligned with nav right edge) */}
          <div style={{ position: "absolute", right: 0, top: `${HOME_V2_TOP_PX}px` }}>
          <ScrollReveal revealOnMount>
            <HomeV2CardLink
              href="/rocket-mortgage"
              ariaLabel="Read Rocket Mortgage case study"
              className="cursor-hover-dark"
              style={{
                width: "350px",
                height: "637px",
                background: "#FAFAFA",
                borderRadius: "24px",
                overflow: "hidden",
              }}
            >
            {/* Video region */}
            <div
              style={{
                position: "absolute",
                width: "350px",
                height: "524px",
                left: 0,
                top: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  top: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  zIndex: 2,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/rocket-mortgage.svg"
                  alt="Rocket Mortgage"
                  style={{ width: "86.5px", height: "24px" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/rocket-assist-full.svg"
                  alt="Rocket Assist"
                  style={{ height: "24px", width: "auto" }}
                />
              </div>

              <LazyVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295116/RM_Onboarding_new_case_study_and_hero_video_biuj2w.mp4"
                poster="/Rocket Mortgage Poster.png"
                ariaLabel="Rocket Mortgage onboarding video"
                style={{
                  position: "absolute",
                  height: "452px",
                  width: "auto",
                  left: "50%",
                  top: "72px",
                  transform: "translateX(-50%)",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Text */}
            <div
              style={{
                position: "absolute",
                width: "302px",
                height: "65px",
                left: "24px",
                top: "548px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
                gap: "8px",
                fontFamily: "var(--font-hind), sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              <div
                style={{
                  width: "302px",
                  height: "40px",
                  fontSize: "14px",
                  lineHeight: "140%",
                  display: "flex",
                  alignItems: "flex-end",
                  color: "#555555",
                }}
              >
                Redesigned an AI assistant that knows where you are in your homebuying journey.
              </div>

              <div
                style={{
                  width: "302px",
                  height: "17px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                  color: "#989898",
                  fontSize: "12px",
                  lineHeight: "140%",
                }}
              >
                <span>#ai-assistant</span>
                <span>#fintech</span>
                <span>#product design</span>
              </div>
            </div>
            </HomeV2CardLink>
          </ScrollReveal>
          </div>

          {/* Second row (56px below RM card) */}
          <div style={{ position: "absolute", left: 0, top: `${HOME_V2_SECOND_ROW_TOP_PX}px`, width: "1008px", height: "450px" }}>
          <ScrollReveal>
            <div
              style={{
                width: "1008px",
                height: "450px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 0,
                gap: "64px",
              }}
            >
            {/* Salesforce */}
            <HomeV2CardLink
              href="/salesforce"
              ariaLabel="Read Salesforce case study"
              className="cursor-hover-dark"
              style={{
                position: "relative",
                width: "594px",
                height: "450px",
                background: "#FAFAFA",
                borderRadius: "24px",
                overflow: "hidden",
                flex: "none",
              }}
            >
              {/* Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/salesforce.svg"
                alt="Salesforce"
                style={{
                  position: "absolute",
                  width: "auto",
                  height: "32px",
                  left: "24px",
                  top: "24px",
                  zIndex: 2,
                  objectFit: "contain",
                }}
              />

              {/* Video */}
              <LazyVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295117/Salesforce_new_case_study_card_and_hero_fx5vpe.mp4"
                poster="/Salesforce Poster.png"
                ariaLabel="Salesforce case study preview video"
                style={{
                  position: "absolute",
                  width: "546px",
                  height: "285px",
                  left: "24px",
                  top: "72px",
                  objectFit: "contain",
                  backgroundColor: "#FAFAFA",
                  borderRadius: "16px",
                }}
              />

              {/* Text */}
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  right: "24px",
                  bottom: "24px",
                  height: "45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 0,
                  gap: "8px",
                  fontFamily: "var(--font-hind), sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "140%",
                    display: "flex",
                    alignItems: "flex-end",
                    color: "#555555",
                  }}
                >
                  Designing an AI planning tool that helps students figure out what to study and why.
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    lineHeight: "140%",
                    color: "#989898",
                  }}
                >
                  <span>#ai-planning</span>
                  <span>#systems design</span>
                  <span>#product design</span>
                </div>
              </div>
            </HomeV2CardLink>

            {/* Rocket Money LISA */}
            <HomeV2PlayableCard
              videoSrc={ROCKET_LISA_VIDEO_SRC}
              videoLabel="Rocket Money LISA"
              className="cursor-hover-eye-dark"
              style={{
                position: "relative",
                width: "350px",
                height: "450px",
                background: "#FAFAFA",
                borderRadius: "24px",
                overflow: "hidden",
                flex: "none",
              }}
            >
              {/* Video */}
              <LazyVideo
                src={ROCKET_LISA_VIDEO_SRC}
                poster="/play/Rocket LISA Poster Image.png"
                ariaLabel="Rocket Money LISA preview video"
                style={{
                  position: "absolute",
                  width: "350px",
                  height: "337px",
                  left: 0,
                  top: 0,
                  objectFit: "cover",
                }}
              />

              {/* Text */}
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  right: "24px",
                  bottom: "24px",
                  height: "65px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 0,
                  gap: "8px",
                  fontFamily: "var(--font-hind), sans-serif",
                  fontStyle: "normal",
                  fontWeight: 400,
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "140%",
                    display: "flex",
                    alignItems: "flex-end",
                    color: "#555555",
                  }}
                >
                  Redesigned Rocket Money&apos;s dashboard in the 1984 Apple Macintosh GUI style.
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    lineHeight: "140%",
                    color: "#989898",
                  }}
                >
                  <span>#figma</span>
                  <span>#claude-code</span>
                  <span>#nano-banana-2</span>
                </div>
              </div>
            </HomeV2PlayableCard>
            </div>
          </ScrollReveal>
          </div>

          {/* Central block (56px below second row) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: `${HOME_V2_CENTRAL_BLOCK_TOP_PX}px`,
              width: "1008px",
              height: `${HOME_V2_CENTRAL_BLOCK_H_PX}px`,
              zIndex: 3,
            }}
          >
          <ScrollReveal>
            <div
              style={{
                width: "1008px",
                height: `${HOME_V2_CENTRAL_BLOCK_H_PX}px`,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 0,
                gap: "64px",
              }}
            >
            {/* Block left */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
                gap: "56px",
                width: "350px",
                height: `${HOME_V2_CENTRAL_BLOCK_H_PX}px`,
                flex: "none",
              }}
            >
              {/* Arduino Robot */}
              <HomeV2PlayableCard
                videoSrc={ARDUINO_ROBOT_VIDEO_SRC}
                videoLabel="Arduino robot arm duet"
                className="cursor-hover-eye-dark"
                style={{
                  position: "relative",
                  width: "350px",
                  height: "532px",
                  background: "#FAFAFA",
                  borderRadius: "24px",
                  overflow: "hidden",
                  flex: "none",
                }}
              >
                <LazyVideo
                  src={ARDUINO_ROBOT_VIDEO_SRC}
                  poster="/Robo Poster Image.png"
                  ariaLabel="Arduino robot arm duet prototype"
                  style={{
                    position: "absolute",
                    width: "350px",
                    height: "419px",
                    left: 0,
                    top: 0,
                    objectFit: "cover",
                    backgroundColor: "#FAFAFA",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    right: "24px",
                    bottom: "24px",
                    height: "65px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 0,
                    gap: "8px",
                    ...cardFooterFont,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: "140%",
                      display: "flex",
                      alignItems: "flex-end",
                      color: "#555555",
                    }}
                  >
                    A two-player game where each person controls one arm of the same body.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      lineHeight: "140%",
                      color: "#989898",
                    }}
                  >
                    <span>#arduino</span>
                    <span>#python</span>
                    <span>#processing</span>
                  </div>
                </div>
              </HomeV2PlayableCard>

              {/* Sunlight Shader */}
              <HomeV2CardLink
                href={SUNLIGHT_SHADER_GITHUB_HREF}
                ariaLabel="View Sunlight shader on GitHub"
                className="cursor-hover-dark"
                style={{
                  position: "relative",
                  width: "350px",
                  height: "368px",
                  background: "#FAFAFA",
                  borderRadius: "24px",
                  overflow: "hidden",
                  flex: "none",
                }}
              >
                <LazyVideo
                  src={SUNLIGHT_SHADER_CARD_VIDEO_SRC}
                  poster="/sunlight poster.png"
                  ariaLabel="Sunlight shader effect preview"
                  style={{
                    position: "absolute",
                    width: "350px",
                    height: "255px",
                    left: 0,
                    top: 0,
                    objectFit: "cover",
                    backgroundColor: "#FAFAFA",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    right: "24px",
                    bottom: "24px",
                    height: "65px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 0,
                    gap: "8px",
                    ...cardFooterFont,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: "140%",
                      display: "flex",
                      alignItems: "flex-end",
                      color: "#555555",
                    }}
                  >
                    A React component with CSS-driven shadow bands and a glow that read as sunlight.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      lineHeight: "140%",
                      color: "#989898",
                    }}
                  >
                    <span>#cursor</span>
                    <span>#react component</span>
                    <span>#CSS</span>
                  </div>
                </div>
              </HomeV2CardLink>
            </div>

            {/* Block right */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
                gap: "56px",
                width: "594px",
                height: `${HOME_V2_CENTRAL_BLOCK_H_PX}px`,
                flex: "none",
              }}
            >
              {/* Debug Tars */}
              <HomeV2CardLink
                href="/tars-debug-mode"
                ariaLabel="Read TARS debug mode case study"
                className="cursor-hover-dark"
                style={{
                  position: "relative",
                  width: "594px",
                  height: "450px",
                  background: "#FAFAFA",
                  borderRadius: "24px",
                  overflow: "hidden",
                  flex: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/tars.svg"
                  alt="TARS"
                  style={{
                    position: "absolute",
                    width: "auto",
                    height: "24px",
                    left: "24px",
                    top: "24px",
                    zIndex: 2,
                    objectFit: "contain",
                  }}
                />
                <LazyVideo
                  src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295525/Debug_Mode_new_case_study_and_hero_video_kuliwm.mp4"
                  poster="/Debug Video Poster.png"
                  ariaLabel="TARS debug mode preview video"
                  style={{
                    position: "absolute",
                    width: "546px",
                    height: "285px",
                    left: "24px",
                    top: "72px",
                    objectFit: "contain",
                    backgroundColor: "#FAFAFA",
                    borderRadius: "16px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    right: "24px",
                    bottom: "24px",
                    height: "45px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 0,
                    gap: "8px",
                    ...cardFooterFont,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: "140%",
                      display: "flex",
                      alignItems: "flex-end",
                      color: "#555555",
                    }}
                  >
                    Designed a debugging tool that catches where enterprise AI agents break.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      lineHeight: "140%",
                      color: "#989898",
                    }}
                  >
                    <span>#for developers</span>
                    <span>#internal tool</span>
                    <span>#product design</span>
                  </div>
                </div>
              </HomeV2CardLink>

              {/* Stellar Scan */}
              <HomeV2CardLink
                href={STELLAR_SCAN_HREF}
                ariaLabel="Open Stellar Scan website"
                className="cursor-hover-light"
                style={{
                  position: "relative",
                  width: "594px",
                  height: "450px",
                  background: "#FAFAFA",
                  borderRadius: "24px",
                  overflow: "hidden",
                  flex: "none",
                }}
              >
                <LazyVideo
                  src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1778784179/Stellar_Scan_Video_wghj5o.mp4"
                  poster="/Stellar scan poster image.png"
                  ariaLabel="Stellar Scan preview video"
                  style={{
                    position: "absolute",
                    width: "594px",
                    height: "337px",
                    left: 0,
                    top: 0,
                    objectFit: "cover",
                    backgroundColor: "#FAFAFA",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    right: "24px",
                    bottom: "24px",
                    height: "65px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 0,
                    gap: "8px",
                    ...cardFooterFont,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: "140%",
                      display: "flex",
                      alignItems: "flex-end",
                      color: "#555555",
                    }}
                  >
                    A retro-futuristic star mapping tool. Enter a date, get the dominant
                    constellation, download a playing card.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      lineHeight: "140%",
                      color: "#989898",
                    }}
                  >
                    <span>#Google Stitch</span>
                    <span>#Google AI Studio</span>
                  </div>
                </div>
              </HomeV2CardLink>
            </div>
            </div>
          </ScrollReveal>
          </div>

          {/* Row 2 (56px below central block) */}
          <div style={{ position: "absolute", left: 0, top: `${HOME_V2_ROW2_TOP_PX}px`, width: "1008px", height: `${HOME_V2_ROW2_H_PX}px` }}>
          <ScrollReveal>
            <div
              style={{
                width: "1008px",
                height: `${HOME_V2_ROW2_H_PX}px`,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 0,
                gap: "64px",
              }}
            >
            {/* ASCII */}
            <HomeV2CardLink
              href={ASCII_GAME_GITHUB_HREF}
              ariaLabel="View ASCII Run on GitHub"
              className="cursor-hover-light"
              style={{
                position: "relative",
                width: "594px",
                height: "450px",
                background: "#FAFAFA",
                borderRadius: "24px",
                overflow: "hidden",
                flex: "none",
              }}
            >
              <LazyVideo
                src={ASCII_LANE_GAME_VIDEO_SRC}
                poster="/ASCII game poster.png"
                ariaLabel="ASCII lane dodge game preview"
                style={{
                  position: "absolute",
                  width: "594px",
                  height: "337px",
                  left: 0,
                  top: 0,
                  objectFit: "cover",
                  backgroundColor: "#FAFAFA",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  right: "24px",
                  bottom: "24px",
                  height: "65px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 0,
                  gap: "8px",
                  ...cardFooterFont,
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "140%",
                    display: "flex",
                    alignItems: "flex-end",
                    color: "#555555",
                  }}
                >
                  A fast scroll-linked lane dodge game, navigate using arrow keys, ramping speed every
                  5s and a chance to listen to my favorite song.
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    lineHeight: "140%",
                    color: "#989898",
                  }}
                >
                  <span>#cursor</span>
                </div>
              </div>
            </HomeV2CardLink>

            {/* Water Shader */}
            <HomeV2CardLink
              href={WATER_SHADER_GITHUB_HREF}
              ariaLabel="View Water shader on GitHub"
              className="cursor-hover-light"
              style={{
                position: "relative",
                width: "350px",
                height: "450px",
                background: "#FAFAFA",
                borderRadius: "24px",
                overflow: "hidden",
                flex: "none",
              }}
            >
              <LazyVideo
                src={WATER_SHADER_CARD_VIDEO_SRC}
                poster="/water shader poster.png"
                ariaLabel="Water shader WebGL2 demo preview"
                style={{
                  position: "absolute",
                  width: "350px",
                  height: "337px",
                  left: 0,
                  top: 0,
                  objectFit: "cover",
                  backgroundColor: "#FAFAFA",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  right: "24px",
                  bottom: "24px",
                  height: "65px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 0,
                  gap: "8px",
                  ...cardFooterFont,
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "140%",
                    display: "flex",
                    alignItems: "flex-end",
                    color: "#555555",
                  }}
                >
                  A tiny demo that renders sunlight on rippling water using a WebGL2 fragment shader.
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    lineHeight: "140%",
                    color: "#989898",
                  }}
                >
                  <span>#cursor</span>
                  <span>#webGL2</span>
                </div>
              </div>
            </HomeV2CardLink>
            </div>
          </ScrollReveal>
          </div>

          {/* Snippets of my life (64px below row 2) */}
          <div style={{ position: "absolute", left: 0, top: `${HOME_V2_SNIPPETS_TOP_PX}px`, width: "1008px", height: `${HOME_V2_SNIPPETS_H_PX}px` }}>
          <ScrollReveal>
            <HomeV2SnippetsSection />
          </ScrollReveal>
          </div>
        </div>
        </HomeV2VideoProvider>
      </div>
    </div>
  );
}

