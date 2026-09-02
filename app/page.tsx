import {
  HOME_V2_PAGE_BG,
  HOME_V2_SECTION_GAP_PX,
  homeCardFooterFont,
  homeCardFooterTagsStyle,
  homeCardFooterTitleStyle,
  homeIntroCopyStyle,
} from "@/design-system";
import { HomeV2CardLink } from "./home-v2/HomeV2CardLink";
import { HomeV2WidgetBento } from "./home-v2/HomeV2WidgetBento";
import { getListeningWidgetData } from "@/app/lib/spotify";
import { HomeV2PlayableCard } from "./home-v2/HomeV2PlayableCard";
import { HomeV2VideoProvider } from "./home-v2/HomeV2VideoProvider";
import { LazyVideo } from "./home-v2/LazyVideo";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { DebugFlowPreview } from "@/app/components/DebugFlowPreview";

const ARDUINO_ROBOT_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1775952719/20250416_201134_2_vimbv1.mp4";
const ROCKET_LISA_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779388469/Screen_Recording_2026-05-21_143314_cenlai.mp4";
const SUNLIGHT_SHADER_CARD_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779835178/Sunlight_q0djya.mp4";
const ASCII_LANE_GAME_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1778784207/Screen_Recording_2026-05-13_235432_gyusng.mp4";
const WATER_SHADER_CARD_VIDEO_SRC =
  "https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779834787/Water_shader_mzsc0k.mp4";
const STELLAR_SCAN_HREF    = "https://stellar-scan-eta.vercel.app/";
const SUNLIGHT_SHADER_HREF = "https://github.com/priyamwada15/sunlight-effect";
const WATER_SHADER_HREF    = "https://github.com/priyamwada15/water-glint-shader";
const ASCII_GAME_HREF      = "https://www.priyamwada.me/ascii-game";
const NEWS_WIDGET_HREF     = "https://www.priyamwada.me/the-intelligencer";

const introProjLinkStyle = {
  color: "#858585",
  textDecoration: "underline",
  textDecorationStyle: "dotted" as const,
  textUnderlineOffset: "3px",
};

/** Desktop (>=1280px) intro copy — 3 separate paragraphs. */
const INTRO_PARAGRAPHS = [
  "Hi, I'm Priyamwada. An Architect turned Product Designer.",
  "I design internal tools, agentic interfaces and explainable AI across B2B SaaS and B2C fintech.",
  "Outside of work, I tinker and try to build something every now and then to exercise my design muscles. Recent projects include a water shader, a news app and a time-of-the-day constellation app.",
] as const;

/** <1280px intro copy — first two sentences flow into one paragraph. */
const INTRO_PARAGRAPHS_COMPACT = [
  `${INTRO_PARAGRAPHS[0]} ${INTRO_PARAGRAPHS[1]}`,
  INTRO_PARAGRAPHS[2],
] as const;

function IntroPara3() {
  return (
    <>
      Outside of work, I tinker and try to build something every now and then to exercise my design muscles. Recent projects include a{" "}
      <a href={WATER_SHADER_HREF} target="_blank" rel="noreferrer" className="cursor-hover-pointer" style={introProjLinkStyle}>water shader</a>
      , a{" "}
      <a href={NEWS_WIDGET_HREF} target="_blank" rel="noreferrer" className="cursor-hover-pointer" style={introProjLinkStyle}>news app</a>
      {" "}and a time-of-the-day{" "}
      <a href={STELLAR_SCAN_HREF} target="_blank" rel="noreferrer" className="cursor-hover-pointer" style={introProjLinkStyle}>constellation app</a>
      .
    </>
  );
}

/** Pill-style tag chip used on case study cards (video overlay layout). */
const homeCardTagPillStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 12px",
  background: "var(--ds-surface-page)",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "140%",
  color: "var(--ds-text-secondary)",
};

/** Small "category" badge used on Creative Coding / prototyping cards (icon + label). */
function CardCategoryBadge({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", flex: "none" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Icons/creative-coding-badge.svg" alt="" style={{ width: "24px", height: "24px" }} />
      <span style={{ ...homeCardFooterFont, fontSize: "14px", color: "var(--ds-text-ink)" }}>{label}</span>
    </div>
  );
}

export default async function HomeV2Page() {
  const listeningData = await getListeningWidgetData().catch(() => null);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: HOME_V2_PAGE_BG }}>
      <div className="relative z-[2] min-h-screen">
        <HomeV2VideoProvider>
        {/* Align page content to nav inner container edges */}
        <div
          className="home-v2-layout relative mx-auto flex w-[86%] max-w-[1008px] flex-col overflow-visible pt-[32px] xl:pt-[72px]"
          style={{
            gap: `${HOME_V2_SECTION_GAP_PX}px`,
          }}
        >
          {/* Hero: intro text + widget bento (left) / Rocket Mortgage card (right) */}
          <div
            className="home-v2-section home-v2-hero home-v2-row"
            style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "64px" }}
          >
          <ScrollReveal revealOnMount className="flex-1 min-w-0">
            <div className="home-v2-intro-copy" style={{ ...homeIntroCopyStyle }}>
              {/* >=1280px: 3 separate paragraphs */}
              <div className="hidden xl:flex xl:w-[594px] xl:flex-col xl:items-start hero-intro hero-intro--text">
                {INTRO_PARAGRAPHS.map((paragraph, index) => (
                  <p key={index} style={{ margin: 0, marginTop: index === 0 ? 0 : "24px" }}>
                    {index === 2 ? <IntroPara3 /> : paragraph}
                  </p>
                ))}
              </div>

              {/* <1280px: first two sentences flow into one paragraph */}
              <div className="flex w-full flex-col items-start xl:hidden hero-intro hero-intro--text">
                {INTRO_PARAGRAPHS_COMPACT.map((paragraph, index) => (
                  <p key={index} style={{ margin: 0, marginTop: index === 0 ? 0 : "24px" }}>
                    {index === 1 ? <IntroPara3 /> : paragraph}
                  </p>
                ))}
              </div>

            {/* Widget bento (32px below text on mobile, 56px at xl+) */}
            <div
              className="home-v2-intro-snippets mt-[32px] xl:mt-[56px] hero-intro hero-intro--bento"
              style={{ display: "flex", gap: "64px" }}
            >
              <HomeV2WidgetBento data={listeningData} />
            </div>
            </div>
          </ScrollReveal>
          <ScrollReveal revealOnMount className="shrink-0 hero-intro hero-intro--card">
            <HomeV2CardLink
              href="/rocket-mortgage"
              ariaLabel="Read Rocket Mortgage case study"
              className="cursor-hover-dark"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
                gap: "16px",
                width: "350px",
              }}
            >
              {/* Video region (logos overlaid top-left) */}
              <div
                style={{
                  position: "relative",
                  boxSizing: "border-box",
                  width: "100%",
                  aspectRatio: "302 / 452",
                  flex: "none",
                  alignSelf: "stretch",
                  padding: "80px 56px 24px",
                  background: "var(--ds-surface-page)",
                  borderRadius: "var(--ds-radius-container)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="home-v2-card-media-logo-group"
                  style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    zIndex: 1,
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
                  className="home-v2-rm-video"
                  src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295116/RM_Onboarding_new_case_study_and_hero_video_biuj2w.mp4"
                  poster="/Rocket Mortgage Poster.png"
                  ariaLabel="Rocket Mortgage onboarding video"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Text */}
              <div
                className="home-v2-card-footer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  width: "100%",
                  flex: "none",
                  ...homeCardFooterFont,
                }}
              >
                <div style={homeCardFooterTitleStyle}>
                  Personalizing AI guidance across 6.8M+ client conversations
                </div>
                <div style={homeCardFooterTagsStyle}>
                  <span style={homeCardTagPillStyle}>B2C Fintech</span>
                  <span style={homeCardTagPillStyle}>AI Assistant</span>
                  <span style={homeCardTagPillStyle}>Trust Design</span>
                </div>
              </div>
            </HomeV2CardLink>
          </ScrollReveal>
          </div>

          {/* Asimov */}
          <div className="home-v2-section home-v2-asimov">
          <ScrollReveal>
            <HomeV2CardLink
              href="/tars-asimov"
              ariaLabel="Read Asimov for Tars case study"
              className="cursor-hover-dark"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
                gap: "16px",
                width: "100%",
              }}
            >
              {/* Video region (logo overlaid top-left) */}
              <div
                style={{
                  position: "relative",
                  boxSizing: "border-box",
                  width: "100%",
                  aspectRatio: "1008 / 575",
                  flex: "none",
                  alignSelf: "stretch",
                  padding: "56px 56px 24px",
                  background: "var(--ds-surface-page)",
                  borderRadius: "var(--ds-radius-container)",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/tars.svg"
                  alt="TARS"
                  className="home-v2-card-media-logo"
                  style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    height: "24px",
                    width: "auto",
                    objectFit: "contain",
                    zIndex: 1,
                  }}
                />
                <LazyVideo
                  src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1785952405/Asimov_Hero_Video_jkk4zq.mp4"
                  poster="/Asimov Video Poster.png"
                  ariaLabel="Asimov for Tars preview video"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div
                className="home-v2-card-footer"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "56px",
                  width: "100%",
                  alignSelf: "stretch",
                  flex: "none",
                  ...homeCardFooterFont,
                }}
              >
                <div style={{ ...homeCardFooterTitleStyle, flex: "1 0 0" }}>
                  Scaling an AI agent to 82% pilot adoption through configurable workflows
                </div>
                <div style={{ ...homeCardFooterTagsStyle, flex: "none" }}>
                  <span style={homeCardTagPillStyle}>B2B SaaS</span>
                  <span style={homeCardTagPillStyle}>0→1</span>
                  <span style={homeCardTagPillStyle}>Workflow Design</span>
                </div>
              </div>
            </HomeV2CardLink>
          </ScrollReveal>
          </div>

          {/* Tars Debug */}
          <div className="home-v2-section home-v2-tars">
          <ScrollReveal>
            <HomeV2CardLink
              href="/tars-debug-mode"
              ariaLabel="Read TARS debug mode case study"
              className="cursor-hover-dark"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
                gap: "16px",
                width: "100%",
              }}
            >
              {/* Video region (logo overlaid top-left) */}
              <div
                style={{
                  position: "relative",
                  boxSizing: "border-box",
                  width: "100%",
                  aspectRatio: "1008 / 575",
                  flex: "none",
                  alignSelf: "stretch",
                  padding: "56px 56px 24px",
                  background: "var(--ds-surface-page)",
                  borderRadius: "var(--ds-radius-container)",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/tars.svg"
                  alt="TARS"
                  className="home-v2-card-media-logo"
                  style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    height: "24px",
                    width: "auto",
                    objectFit: "contain",
                    zIndex: 1,
                  }}
                />
                <DebugFlowPreview />
              </div>

              <div
                className="home-v2-card-footer"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "56px",
                  width: "100%",
                  alignSelf: "stretch",
                  flex: "none",
                  ...homeCardFooterFont,
                }}
              >
                <div style={{ ...homeCardFooterTitleStyle, flex: "1 0 0" }}>
                  Designing an internal debugger that cut troubleshooting time by ~70%
                </div>
                <div style={{ ...homeCardFooterTagsStyle, flex: "none" }}>
                  <span style={homeCardTagPillStyle}>B2B SaaS</span>
                  <span style={homeCardTagPillStyle}>Complex Workflows</span>
                  <span style={homeCardTagPillStyle}>Internal Tools</span>
                </div>
              </div>
            </HomeV2CardLink>
          </ScrollReveal>
          </div>

          {/* Salesforce */}
          <div className="home-v2-section home-v2-salesforce">
          <ScrollReveal>
            <HomeV2CardLink
              href="/salesforce"
              ariaLabel="Read Salesforce case study"
              className="cursor-hover-dark"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 0,
                gap: "16px",
                width: "100%",
              }}
            >
              {/* Video region (logo overlaid top-left) */}
              <div
                style={{
                  position: "relative",
                  boxSizing: "border-box",
                  width: "100%",
                  aspectRatio: "1008 / 575",
                  flex: "none",
                  alignSelf: "stretch",
                  padding: "56px 56px 24px",
                  background: "var(--ds-surface-page)",
                  borderRadius: "var(--ds-radius-container)",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/salesforce.svg"
                  alt="Salesforce"
                  className="home-v2-card-media-logo"
                  style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    width: "56px",
                    height: "40px",
                    objectFit: "contain",
                    zIndex: 1,
                  }}
                />
                <LazyVideo
                  src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1779295117/Salesforce_new_case_study_card_and_hero_fx5vpe.mp4"
                  poster="/Salesforce Poster.png"
                  ariaLabel="Salesforce case study preview video"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Text */}
              <div
                className="home-v2-card-footer"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "56px",
                  width: "100%",
                  alignSelf: "stretch",
                  flex: "none",
                  ...homeCardFooterFont,
                }}
              >
                <div style={{ ...homeCardFooterTitleStyle, flex: "1 0 0" }}>
                  Designing a 0→1 AI platform for fragmented academic data
                </div>
                <div style={{ ...homeCardFooterTagsStyle, flex: "none" }}>
                  <span style={homeCardTagPillStyle}>B2B2C</span>
                  <span style={homeCardTagPillStyle}>0→1</span>
                  <span style={homeCardTagPillStyle}>AI Product Design</span>
                </div>
              </div>
            </HomeV2CardLink>
          </ScrollReveal>
          </div>

          {/* Stellar Scan + Arduino robot arm duet — hidden for now */}
          {false && (
          <div id="creative-projects" className="home-v2-section home-v2-frame-9">
          <ScrollReveal>
            <div
              className="home-v2-row"
              style={{
                width: "1008px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 0,
                gap: "64px",
              }}
            >
            {/* Stellar Scan */}
            <HomeV2CardLink
              href={STELLAR_SCAN_HREF}
              ariaLabel="Open Stellar Scan website"
              className="cursor-hover-light"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "24px",
                gap: "24px",
                width: "594px",
                height: "550px",
                background: "var(--ds-surface-page)",
                borderRadius: "var(--ds-radius-container)",
                flex: "none",
              }}
            >
              <CardCategoryBadge label="Creative Coding" />

              <LazyVideo
                src="https://res.cloudinary.com/dh9rvf2hh/video/upload/v1778784179/Stellar_Scan_Video_wghj5o.mp4"
                poster="/Stellar scan poster image.png"
                ariaLabel="Stellar Scan preview video"
                style={{
                  width: "100%",
                  aspectRatio: "546 / 349",
                  flex: "none",
                  alignSelf: "stretch",
                  objectFit: "cover",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                }}
              />

              <div
                className="home-v2-card-footer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  width: "100%",
                  height: "65px",
                  flex: "none",
                  ...homeCardFooterFont,
                }}
              >
                <div style={homeCardFooterTitleStyle}>
                  A retro-futuristic star mapping tool. Enter a date, get the dominant
                  constellation, download a playing card.
                </div>
                <div style={homeCardFooterTagsStyle}>
                  <span>#Google Stitch</span>
                  <span>#Google AI Studio</span>
                </div>
              </div>
            </HomeV2CardLink>

            {/* Arduino robot arm duet */}
            <HomeV2PlayableCard
              videoSrc={ARDUINO_ROBOT_VIDEO_SRC}
              videoLabel="Arduino robot arm duet"
              className="cursor-hover-eye-dark"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "24px",
                gap: "24px",
                width: "350px",
                height: "550px",
                background: "var(--ds-surface-page)",
                borderRadius: "var(--ds-radius-container)",
                flex: "none",
              }}
            >
              <CardCategoryBadge label="Tangible Prototyping" />

              <LazyVideo
                src={ARDUINO_ROBOT_VIDEO_SRC}
                poster="/Robo Poster Image.png"
                ariaLabel="Arduino robot arm duet prototype"
                style={{
                  width: "100%",
                  aspectRatio: "302 / 349",
                  flex: "none",
                  alignSelf: "stretch",
                  objectFit: "cover",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                }}
              />

              <div
                className="home-v2-card-footer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  width: "100%",
                  height: "65px",
                  flex: "none",
                  ...homeCardFooterFont,
                }}
              >
                <div style={homeCardFooterTitleStyle}>
                  A two-player game where each person controls one arm of the same body.
                </div>
                <div style={homeCardFooterTagsStyle}>
                  <span>#arduino</span>
                  <span>#python</span>
                  <span>#processing</span>
                </div>
              </div>
            </HomeV2PlayableCard>
            </div>
          </ScrollReveal>
          </div>
          )}

          {/* Frame 10: Sunlight + Water shaders / ASCII Lane Dodge / Rocket Money LISA (GUI Reimagining) — no links yet — hidden for now */}
          {false && (
          <div className="home-v2-section home-v2-frame-10">
          <ScrollReveal>
            <div
              className="home-v2-row"
              style={{
                width: "1008px",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                padding: 0,
                gap: "64px",
              }}
            >
            {/* Sunlight + Water shaders */}
            <div
              className="home-v2-main-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "24px",
                gap: "24px",
                width: "350px",
                background: "var(--ds-surface-page)",
                borderRadius: "var(--ds-radius-container)",
                flex: "none",
              }}
            >
              <CardCategoryBadge label="Creative Coding" />
              <a href={SUNLIGHT_SHADER_HREF} target="_blank" rel="noopener noreferrer" className="cursor-hover-pointer" style={{ display: "block" }}>
                <LazyVideo
                  src={SUNLIGHT_SHADER_CARD_VIDEO_SRC}
                  poster="/sunlight poster.png"
                  ariaLabel="Sunlight shader effect — view on GitHub"
                  style={{ width: "100%", aspectRatio: "1 / 1", flex: "none", objectFit: "cover", backgroundColor: "#ffffff", borderRadius: "12px" }}
                />
              </a>
              <a href={WATER_SHADER_HREF} target="_blank" rel="noopener noreferrer" className="cursor-hover-pointer" style={{ display: "block" }}>
                <LazyVideo
                  src={WATER_SHADER_CARD_VIDEO_SRC}
                  poster="/water shader poster.png"
                  ariaLabel="Water shader WebGL2 demo — view on GitHub"
                  style={{ width: "100%", aspectRatio: "1 / 1", flex: "none", objectFit: "cover", backgroundColor: "#ffffff", borderRadius: "12px" }}
                />
              </a>
              <div
                className="home-v2-card-footer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  width: "100%",
                  height: "65px",
                  flex: "none",
                  ...homeCardFooterFont,
                }}
              >
                <div style={homeCardFooterTitleStyle}>
                  A pair of WebGL2 shader experiments simulating the way light behaves on natural surfaces.
                </div>
                <div style={homeCardFooterTagsStyle}>
                  <span>#webgl2</span>
                  <span>#glsl</span>
                  <span>#cursor</span>
                </div>
              </div>
            </div>

            {/* ASCII Lane Dodge + Rocket Money LISA (GUI Reimagining) */}
            <div
              className="home-v2-col"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "64px",
                width: "594px",
                flex: "none",
              }}
            >
              {/* ASCII Lane Dodge */}
              <HomeV2CardLink
                href={ASCII_GAME_HREF}
                ariaLabel="Open ASCII Lane Dodge game"
                className="cursor-hover-light"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "24px",
                  gap: "24px",
                  width: "594px",
                  background: "var(--ds-surface-page)",
                  borderRadius: "var(--ds-radius-container)",
                  flex: "none",
                }}
              >
                <CardCategoryBadge label="Creative Coding" />
                <LazyVideo
                  src={ASCII_LANE_GAME_VIDEO_SRC}
                  poster="/ASCII game poster.png"
                  ariaLabel="ASCII lane dodge game preview"
                  style={{ width: "100%", aspectRatio: "546 / 349", flex: "none", objectFit: "cover", backgroundColor: "#ffffff", borderRadius: "12px" }}
                />
                <div
                  className="home-v2-card-footer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    width: "100%",
                    height: "65px",
                    flex: "none",
                    ...homeCardFooterFont,
                  }}
                >
                  <div style={homeCardFooterTitleStyle}>
                    A fast scroll-linked lane dodge game, navigate using arrow keys, ramping speed every
                    5s and a chance to listen to my favorite song.
                  </div>
                  <div style={homeCardFooterTagsStyle}>
                    <span>#cursor</span>
                  </div>
                </div>
              </HomeV2CardLink>

              {/* Rocket Money LISA — GUI Reimagining */}
              <HomeV2PlayableCard
                videoSrc={ROCKET_LISA_VIDEO_SRC}
                videoLabel="Rocket Money LISA GUI Reimagining"
                className="cursor-hover-eye-dark"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "24px",
                  gap: "24px",
                  width: "594px",
                  background: "var(--ds-surface-page)",
                  borderRadius: "var(--ds-radius-container)",
                  flex: "none",
                }}
              >
                <CardCategoryBadge label="GUI Reimagining" />
                <LazyVideo
                  src={ROCKET_LISA_VIDEO_SRC}
                  poster="/play/Rocket LISA Poster Image.png"
                  ariaLabel="Rocket Money LISA preview video"
                  style={{ width: "100%", aspectRatio: "546 / 349", flex: "none", objectFit: "cover", backgroundColor: "#ffffff", borderRadius: "12px" }}
                />
                <div
                  className="home-v2-card-footer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    width: "100%",
                    height: "45px",
                    flex: "none",
                    ...homeCardFooterFont,
                  }}
                >
                  <div style={homeCardFooterTitleStyle}>
                    Redesigned Rocket Money&apos;s dashboard in the 1984 Apple Macintosh GUI style.
                  </div>
                  <div style={homeCardFooterTagsStyle}>
                    <span>#figma</span>
                    <span>#claude-code</span>
                    <span>#nano-banana-2</span>
                  </div>
                </div>
              </HomeV2PlayableCard>
            </div>
            </div>
          </ScrollReveal>
          </div>
          )}
        </div>
        </HomeV2VideoProvider>
      </div>
    </div>
  );
}

