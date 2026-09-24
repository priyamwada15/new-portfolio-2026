# Rocket Mortgage (Rocket Assist) case study — September 2026 redesign spec

Source of truth captured from Figma so we don't need to re-open it.

- Figma: `September-Case-Study-2026`, file key `2EAQtgQB9OQgKZ5WehI5Hd`, frame **"New RM"** node `125:6237` (1512 × 8745)
- Captured: 2026-09-24
- Assets: `docs/superpowers/specs/assets/2026-09-24-rocket-mortgage-redesign/` (Figma asset URLs expire after 7 days)
- Current implementation: `app/rocket-mortgage/RocketMortgageContent.tsx` (+ `app/components/RocketMortgageTripleVideos.tsx`, `SolutionShowcase`, `ImageZoomViewer`)
- Shared layout from the Salesforce build applies: see `2026-09-24-salesforce-redesign-design.md` §1 (patterns A–D), §6 decisions, and the build notes. Reuse `CaseStudyLayout sept2026Layout`, `SectionHeader`, `CardRow`, `MediaTile`, `MediaRow` and the `caseStudy*` type tokens.

**Capture completeness.** The Figma MCP Starter-plan call limit was hit partway through.
- Intro, Problem Space, Testimonial 1 and Core Flows: exact styles and assets, from Figma design context.
- Impact, Blocker, Testimonial 2 and Reflections: exact styles from CSS the user pasted, plus the user's screenshots (`user-screenshot-*.webp` in the assets folder).

Status: **spec complete, decisions recorded (§5).** No code written yet.

---

## 1. Global layout

Same as Salesforce: 1512 frame, 1008 column at x=252, nav unchanged, no TOC.

| Thing | Value |
|---|---|
| Breadcrumb | y=148: `Home` / `Rocket Mortgage` |
| Intro | y=229, height 975 |
| Intro → Content gap | 120px (Intro ends 1204, Content starts 1324) |
| Gap between content sections | **184px** everywhere |
| Accent | `brand/rm/dark` **#851F27** = `--ds-color-brand-rocket-dark` ✅ (eyebrows, meta labels, card numbers, `--accent-dark`) |
| Other tokens used | `text/dark/500` #333, `text/dark/300` #555, **`text/dark/100` #767676** (new in this frame: testimonial name/title, quote attribution), `border` #E8E8E8, `surface/dark` #FAFAFA, card bg #F5F5F5 (= `bg-surface-media`) |

Section order (content y offsets inside the 1008 column):

| # | Section | y | h |
|---|---|---|---|
| 1 | Problem Space | 0 | 1448 |
| 2 | Testimonial (Dana Lee) | 1632 | 208 |
| 3 | Core Flows | 2024 | 2804 |
| 4 | Impact | 5012 | 398 |
| 5 | Blocker | 5594 | 793 |
| 6 | Testimonial (Amanda Matzenbach) | 6571 | 208 |
| 7 | Reflections | 6963 | 370 |

### New pattern E — "centered testimonial" (used twice)
- Column, items centered, gap 24 between quote block and name block
- Eyebrow "Testimonial": 14 SemiBold lh 21 accent, centered
- Eyebrow → quote gap 8
- Quote: Figtree **Medium 24px**, lh 1.45, #333, centered, **max-w 800** (= `caseStudySubheading` + center). No quote marks.
- Name row: name Figtree SemiBold 16 lh 21 **#767676** + 8px gap + 20px LinkedIn icon (link, `linkedin-icon.svg` = blue "in" logo)
- Name → title gap 8. Title: Figtree Regular 14 lh 1.5 #767676 at **opacity 80%**, centered

### New pattern F — "text + phone video row" (Core Flows)
- Row: flex, gap **48**, two equal columns (480 / 480), top-aligned; sides alternate (text left, video left, text left)
- Text column: gap 16; title Figtree **Medium 24** lh 1.45 #333 (= `caseStudySubheading`); body 18 lh 1.6 #555, paragraph gap 16
- Video container: 480 × 747, radius 24, overflow clip, py 40, content centered
  - Background: the three original per-flow photos (decision 3; Figma uses one placeholder `core-flow-video-bg.png`) with an **rgba(0,0,0,0.35)** overlay
  - Phone video: **323 × 667**, radius **41.94**, centered
- Rows 112px apart; header → first row also **112px**

---

## 2. Sections, with verbatim copy

### 2.0 Intro (node `125:6285`, rows gap 8)
- Logo row h40 py8, gap 12: Rocket Mortgage logo 86×24 + Rocket Assist logo 106×24 (existing `/logos/rocket-mortgage.svg`, `/logos/rocket-assist-full.svg`)
- H1 (py 8): Medium 40 lh 1.4 #333 — "Personalizing AI guidance across 6.8M+ client conversations"
- Hero (py 32): **keep the current component unchanged** (decision 4). Figma: 1008 × 630, radius 18, three phone videos 325 wide with 16px gaps (= existing `RocketMortgageTripleVideos`, 16:10). Videos unchanged (`ROCKET_MORTGAGE_CARD_VIDEOS`).
- Meta (pt 24), 4 columns 234 wide, 24 gap (= Salesforce MetaGrid): label 14 SemiBold lh 21 #851F27; value 14 Regular lh 20 #333, pt 4
  - Handed off → Aug 2025
  - Industry → **B2C Fintech** (unchanged; Figma says "Fintech", user corrected)
  - Role → Product Design
  - Team → Conversational AI Designers, Product Designers
- No TL;DR block. The testimonials move out of the intro into their own sections.

### 2.1 Problem Space (node `125:7458`, gap 48)
- Pattern A with eyebrow "Problem Space", H2 "Rocket's AI assistant treated every homebuyer the same"
- Body (gap 16):
  1. "As an intern at Rocket Mortgage, I had to pick my own solo project. I went through the research team's reports, client reviews and chat transcripts looking for a gap and kept landing on Rocket Assist."
  2. "Clients were leaving the chat and calling support for questions it could have answered. I scoped the project around the three gaps that showed up most."
- **Old UI Bento** (1008 × 1144): two 496 columns, gap 16.
  - Common card: bg #F5F5F5, 1px #E8E8E8 border, radius 24, overflow clip, content centered column gap 40, padding 40 (cards 02/03: no top padding, so the phone is cropped at the top)
  - Card text block (gap 12, full width 414): title row = number Figtree **SemiBold 20** lh 28 #851F27 + 8px + title Figtree **Medium 20** lh 28 #333; description Figtree Regular **16** lh 24 #555
  - **Left column** (gap 21):
    - Card **01** (496 × 877, `justify-end`, p 40): phone screenshot `problem-01-everything-text.png` at **328 × 667**, full phone shown. "01 Everything was text" / "Answers came as paragraphs with nothing a client could act on."
    - **Quote card** (496 × 246, bg #FAFAFA, border, radius 24, p 40, centered, gap 16): Figtree Regular 20 lh 1.4 #333, with Black-weight “ ” marks — "“ It's an authenticated experience so it should have my data, but this chat history tells me otherwise. ”". Attribution right-aligned: "Rocket Mortgage Client", Regular 14 lh 24 #767676
  - **Right column** (gap 16):
    - Card **02** (496 × 564, pb 40 px 40): screenshot `problem-02-same-advice.png` in a 328 × 394 window, image 169.27% tall, **top −69.29%** (shows the lower part of the phone, cropped at the card top). "02 Every client got the same advice" / "The chat had their loan data but it still answered like a stranger, with no context retention."
    - Card **03** (496 × 564, same crop): `problem-03-person-nowhere.png`. "03 Asking for a person led nowhere" / "Clients got a name and a phone number instead of a connection in chat."
- Local files already in the repo (uncommitted, user-added): `public/new-rocket-mortgage-case-page/Probelm 1.png` (1300×2642 = card 01), `Problem 2.avif` + `Problem 3.avif` (1750×3557 = cards 02/03). Same pixel sizes as the Figma exports.

### 2.2 Testimonial 1 (node `151:11193`) — Pattern E
- Quote: "This was perhaps her most complex assignment, and Pri quickly mapped key friction points while collaborating with engineers and researchers. Her work helped influence product roadmap priorities."
- Name: **Dana Lee** (LinkedIn `https://www.linkedin.com/in/danayoo/`)
- Title: "Director of CXD & Digital Product Management" *(current: "Director of Conversational AI Design & Digital Product Management")*

### 2.3 Core Flows (node `125:7540`, gap 112)
- Pattern A with eyebrow "Core Flows", H2 "How I turned a generic experience into a guided mortgage journey"
- Body (gap 16):
  1. "The redesign runs from onboarding through in-chat guidance, with task cards scoped to each client's loan stage, recommendations that name their source and a handoff to a real person."
  2. "The interaction patterns I proposed influenced Rocket Assist's product roadmap beyond the internship."
- Pattern F rows (videos = the 3 existing Core Flows videos, same order):
  1. Text left / video right — **"Move 1: Reading the loan stage to know what's next"** — "I sat with engineers to see what data the chat could use without a big restructure. A live API already fed each client's loan stage to their dashboard, so Rocket Assist could read the same state and show only the tasks still open." — video `Onboarding_Flow_hm76na.mp4`
  2. Video left / text right — **"Move 2: Naming the source behind every recommendation"** — "Inspector suggestions named the realtor as the source, appraisal insights pointed to the report and insurance tips came from the home's own listing. Clients could open the files right in the chat." — video `Inspector_Recommendations_cvyuma.mp4`
  3. Text left / video right — **"Move 3: Handing off to a person before the client gets stuck"** — "Chat specialists handled these conversations every day, so I interviewed them on what clients kept asking and how they worked around Rocket Assist." / "A request for help or signs of frustration now route the client straight to their purchase specialist, with the conversation history carried over." — video `Human_Handover_xbhbj3.mp4`

### 2.4 Impact (node `158:11254`, gap 48; exact CSS supplied by the user)
- Pattern A with eyebrow "Impact", H2 "Validating the new experience with the clients" (trailing period dropped, decision 7)
- Right column = 3 stat rows instead of paragraphs. **No pt 8** on this column. Rows 480 wide, **48px apart**.
  - Row: flex, `items-center`, gap **24**
  - Number: **91 × 91 circle** (`border-radius: 999px`), bg **#851F27** (accent-dark), text Figtree **Bold 32**, lh 48, **#FAFAFA**, centered
  - Text column (flex 1, 365): gap **4**. Mini header Figtree **SemiBold 18**, lh 1.6, #333 (= `caseStudyRowTitle`). Body Figtree Regular 18, lh 1.6, #555 (= `caseStudyText`)
  - **92%** — Improved Experience — "of clients found the tailored responses were more helpful than the current guidance."
  - **75%** — Increased Trust — "of clients found sourced recommendations by AI more trustworthy."
  - **96%** — Reduced Frustration — "of clients noted the proposed handoff flow would reduce frustration."
- Reference: `assets/.../user-screenshot-impact.webp`

### 2.5 Blocker (node `162:296`, gap 48, items centered; exact CSS supplied by the user)
- Pattern A with eyebrow "Blocker", H2 "The inspector card feature tested well but got cut"
- Body (gap 16, pt 8), with the copy fixes from decision 7:
  1. "It scored high in usability testing, but the backend architecture needed to support it wasn't within the team's bandwidth that cycle. Building it would require multiple API integrations, not just within the Rocket Mortgage system but also Redfin's, which has been acquired by Rocket Companies."
  2. "It was an essential lesson in the gap between the simplicity of a feature design and the many pieces that had to fall into place in order to push it out the door."
- Content panel: **758 × 431**, centered, bg **#FAFAFA**, **1px #E8E8E8** border, radius **24**, padding **56 / 40**, row, centered, gap **58**
  - Two items (Front, Back): column, centered, gap **16**. Card image **310 × 280** (existing `General inspector-front.avif` / `-back.avif`, 620×560 = 2×). Label Figtree **Medium 14**, lh 22, **#555**, centered.
  - In Figma the cards are live components (white bg, #F2F2F2 border, radius 16, Inter). The existing AVIF exports are the same cards, so build as images.
- Reference: `assets/.../user-screenshot-blocker.webp`

### 2.6 Testimonial 2 (node `162:763`) — Pattern E (confirmed identical to Testimonial 1)
- Quote: "Driven by curiosity to understand client problems, Pri developed solutions that delivered business value. Her prototypes influenced product strategy, and she collaborated exceptionally across teams."
- Name: **Amanda Matzenbach** (LinkedIn `https://www.linkedin.com/in/amanda-matzenbach/`)
- Title: "Conversational AI Design Manager & Mentor"
- LinkedIn icon: 20px, #007EBB square with a white "in" (same as `linkedin-icon.svg`)
- Reference: `assets/.../user-screenshot-testimonial-2.webp`

### 2.7 Reflections (node `125:7768`; exact CSS supplied by the user)
- Pattern A with eyebrow "Reflections", H2 "What I'm taking with me from Rocket"
- Right column (pt 8): two titled blocks **48px apart**. Each block has gap **12**: title Figtree **SemiBold 18**, lh 1.6, #333 (= `caseStudyRowTitle`), then body 18/1.6 #555.
  1. **"No fallback path existed for a mismatched task"** — "Rocket Assist reflected the dashboard's state rather than owning it, so a correction path belonged to that system, not this surface."
  2. **"I went to engineers and specialists before anyone asked me to"** — "Seeking out engineers, researchers and chat specialists early got me into the conversations that shaped this work most. It's also how I found most of the edge cases."
- Hidden: "AI Integration" eyebrows and the 4-image "UI Bento" → not built.
- Reference: `assets/.../user-screenshot-reflections.webp`

---

## 3. What the redesign removes vs. the current page
- TOC, 768px column, TL;DR block, testimonial cards in the intro (they become sections)
- "Design Approach" (4 approach cards + zoom viewer: Happy Path, Human Handoff, Key Features, Iterations)
- "Final Solution" (6 Solution Type image cards)
- "In Hindsight" (its first card's copy moves into Reflections)
- Old Problem section (2 quote + image rows)
- Old Reflections copy ("Every feature is ten decisions…")

## 4. Asset map
| Figma layer | Downloaded reference | Repo file |
|---|---|---|
| Hero phones ×3 | `hero-phone-1/2/3.png` (video posters) | videos in `ROCKET_MORTGAGE_CARD_VIDEOS` |
| Problem 3 (card 01) | `problem-01-everything-text.png` | `Probelm 1.png` (→ AVIF) |
| Problem 2 (card 02) | `problem-02-same-advice.png` | `Problem 2.avif` |
| Problem 1 3 (card 03) | `problem-03-person-nowhere.png` | `Problem 3.avif` |
| Core flow video bg | `core-flow-video-bg.png` (904×1200, dark room photo) | current uses `/rm-bg-orientation|comprehension|resolution.avif` |
| Core flow phone poster | `core-flow-video-poster.png` | Cloudinary videos |
| LinkedIn icon | `linkedin-icon.svg` | `/logos/LinkedIn_icon.svg` |
| Inspector front/back | — | `General inspector-front/back.avif` |

## 5. Decisions (answered 2026-09-24)
1. The user supplied exact CSS and screenshots for Impact, Blocker, Testimonial 2 and Reflections (§2.4–2.7).
2. Problem images: convert `Probelm 1.png` to AVIF under a correctly spelled name, and use `Problem 2.avif` and `Problem 3.avif` for cards 02 and 03. Deleting the old `Problem 1.avif` was intentional.
3. Core Flows video containers: **keep the three original background photos** (`/rm-bg-orientation|comprehension|resolution.avif`), not Figma's single photo. The 35% overlay and 323×667 phone video still come from Figma.
4. Hero: **keep the current hero video component unchanged**, including its radius. Don't borrow from Figma.
5. Intended changes: Industry stays **"B2C Fintech"** (user corrected 2026-09-24; Figma's "Fintech" is wrong); Dana Lee's title "Director of CXD & Digital Product Management"; the new 96% stat copy.
6. Amanda Matzenbach's title: "Conversational AI Design Manager & Mentor".
7. Copy fixes: "Redfin's, which has been acquired"; "an essential lesson in the gap between…"; drop the trailing period on the Impact H2.
8. Cleanup: remove Design Approach, Final Solution, In Hindsight, the TL;DR block and their assets, plus the stray `Academic Trajectory- By Year.avif`. Remove `SolutionShowcase` and `ImageZoomViewer` if nothing else uses them.
9. Build order: Intro + Problem Space first, then down the page.
10. Mobile: on hold, same as Salesforce.

### Build notes
- Branch `rocket-mortgage-redesign`, created from `salesforce-redesign` (it needs the shared layout pieces). Merge all the case-study branches into `main` together once every case study is done.
- Removed the `.rm-dial-root` wrapper and its CSS-variable spacing overrides in `globals.css`, so `sept2026Layout` spacing applies. Also removed `ImageZoomViewer`, which only Design Approach used. `SolutionShowcase` stays until Core Flows is rebuilt.
- New text token `text-tertiary` (#767676), defined in primitives, semantic and theme.
- Problem Space: phone windows are 79.23% of the padded card width (328/414) with the phone pinned to the bottom, so the crop holds at any width. The quote card fills the rest of its column, so both columns end level (246px at 1512).
- Testimonial (pattern E) is a shared `Testimonial` component in `CaseStudySections.tsx`, available to every case study. It uses the existing `/logos/LinkedIn_icon.svg`, which is the same icon as Figma's.
- Core Flows reuses `SolutionShowcase` through a new `videoClassName` prop. The container keeps the Figma 480:747 shape. The phone video fills 89.29% × 67.29% of it, with `object-cover` and 41.94px corners (the 546×1080 video loses about 4% of its width, the same crop as Figma). The playback logic is unchanged.
- `SectionHeader` gained a `bodyClassName` prop that replaces the body column's default gap and top padding. Impact uses `gap-12` with no top padding; Reflections uses `gap-12 pt-2`.
- Blocker: Figma's front/back cards (310 + 58 + 310 = 678) are 2px wider than the panel's inner width (676), so the flex layout shrinks each card to 309px. The difference isn't visible.
- Desktop page complete (2026-09-24). Measured at 1512px: every section 184px apart, heights within 2px of Figma.
