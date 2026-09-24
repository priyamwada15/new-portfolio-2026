# Salesforce (Galileo) case study — September 2026 redesign spec

Source of truth captured from Figma so we don't need to re-open it.

- Figma: `September-Case-Study-2026`, file key `2EAQtgQB9OQgKZ5WehI5Hd`, frame **"New SF"** node `2:13` (1512 × 11458)
- Captured: 2026-09-24
- Assets downloaded to `docs/superpowers/specs/assets/2026-09-24-salesforce-redesign/` (Figma asset URLs expire after 7 days)
- Full-frame reference screenshot: `assets/2026-09-24-salesforce-redesign/full-frame-screenshot.png`
- Current implementation: `app/salesforce/page.tsx` (+ `BeforeAfterCarousel.tsx`, `DesignApproachImages.tsx`, `TabbedSections.tsx`)

Status: **design captured, open questions pending** (see bottom). No code written yet.

---

## 1. Global layout

| Thing | Value |
|---|---|
| Frame width | 1512 |
| Content column | **1008px**, starts x=252 (i.e. 252px side margins) — matches `RESPONSIVE_CONTENT_WIDTH_CLASS` desktop cap |
| TOC sidebar | **None** in Figma (current page has a 160px TOC + 768px column) |
| Nav | y=32, height 60 — unchanged from current site nav |
| Breadcrumb | y=148: `Home` / `Salesforce- Galileo` (14px-ish, 17px line boxes, 8px gaps) |
| Main starts | y=229 (Breadcrumb bottom 181 → 48px gap) |
| Intro → Content gap | 120px (Intro ends 912, Content starts 1032) |
| Gap between content sections | **184px**, consistent across every section |
| Page bg | `surface/dark` #FAFAFA |

### Recurring pattern A — "two-column section header"
Used by: What is Galileo?, My role, Problem, Where should we focus?, AI principles, Course Details, Academic Trajectory, Reflections.

```
[optional eyebrow, full width, 14px SemiBold #032C5F, lh 21px]   (8px gap)
[Header col: flex 1 (480)] —48px gap— [Body col: flex 1 (480), pt 8px, paragraphs gap 16px]
```
- H2: Figtree **SemiBold 40px**, lh 1.45, #333
- Exception: "Where should we focus?" is a sub-heading — Figtree **Medium 24px**, lh 1.45, #333, body has no pt
- Body: Figtree Regular **18px**, lh 1.6, #555; paragraph gap 16px (Reflections uses 24px)
- Inline emphasis: Figtree SemiBold, #032C5F (used in My role)

### Recurring pattern B — "numbered/label card row"
- Row: flex, gap 24px, cards flex 1 (3-up = 320px each; 4-up = 234px each)
- Dark variant: bg + border `brand/sf/dark` #032C5F, radius **24px** (Figma's AI principle cards show 16px by mistake; build all at 24), padding 40px vertical / 24px horizontal
  - Label: Figtree Regular 14px, lh 28px, `rgba(250,250,250,0.5)`
  - Text: Figtree Medium 18px, lh 28px, #FAFAFA
  - Label → text gap 12px
- Light variant (Problem cards): bg `brand/sf/light` **#E5F6FC**, radius 24, padding 40 / 32, 2-up with gap **48px**
  - Label: Figtree SemiBold 14px lh 28 #032C5F
  - Text: Figtree Regular 18px lh 28 #555, paragraphs gap 8px

### Recurring pattern C — "text + cropped screenshot row"
Used in Course Details and Academic Trajectory.
- Row: flex, gap **40px**, 1008 wide, rows stacked with gap **48px**, sides alternate (text left / image right, then flipped)
- Text col: fixed **300px** (max 500): title Figtree SemiBold 18px lh 1.6 #333; paragraphs Figtree Regular 18px lh 1.6 #555; gap 16px
- Image card: flex 1 (668px), height ~346–350, bg #FAFAFA, 1px border #E8E8E8, radius 24, `overflow: clip`
  - Screenshot inside positioned absolutely at ~24px inset, **intentionally larger than the card so it bleeds/crops** off the right or bottom edge; screenshot has 1px #E8E8E8 border, radius 16, shadow `0 0 16px 3px rgba(0,0,0,0.04)`

### Recurring pattern D — "eyebrow"
14px Figtree SemiBold, lh 21px, #032C5F — "Problem Space", "Solution", "Reflections".

---

## 2. Tokens used in Figma (vs. current code)

| Figma variable | Value | In code today |
|---|---|---|
| `brand/sf/dark` | #032C5F | `--ds-color-brand-salesforce` #032c5f ✅ |
| `brand/sf/light` | **#E5F6FC** | `--ds-color-brand-salesforce-light` is **#bad4eb** ❗ mismatch |
| `surface/dark` | #FAFAFA | page surface ✅ |
| `surface/light` | #FEFEFE | ? |
| `border` | #E8E8E8 | ? |
| `text/dark/500` | #333 | used as hex |
| `text/dark/300` | #555 | used as hex |
| Before badge | bg #FFEBEB, border #E59597, text #CB2A2F, DM Mono Medium 12px uppercase, px 12 py 6, radius 4 | same as existing `BEFORE_SLIDES` ✅ |
| After badge | bg #EBFAEB, border #94BD9D, text #297A3A | same as existing `AFTER_SLIDES` ✅ |
| Screenshot shadow | `0 0 16px 3px rgba(0,0,0,0.04)` | — |

Research Areas component uses its own palette (Inter font): Academic bg rgba(189,227,255,0.3)/label #0D99FF; Career bg #EBFFF4/#14AE5C; Social bg #FFF9F2/#DE7D02; Health bg #F7F1FF/#8A38F5; General Direction bg #FFF1F1/#E03E1A; card text #505050; label 12.08px, text 13.81px, radius 10, padding 17.26, card height 108.75, column gap 12, row gap 17.26.

---

## 3. Sections (in order), with verbatim copy

### 3.0 Intro (node `2:61`, gap 8px between rows)
- Salesforce logo 57×40 (existing `/logos/salesforce.svg`)
- H1 (py 8px): Figtree **Medium 40px**, lh 1.4, #333 — "Designing a 0→1 AI platform for fragmented academic data"
- Hero video container: py 32px, video 1008 × 567, radius **24px**, bg #FAFAFA (existing `SALESFORCE_HERO_VIDEO` presumably)
- Meta row: pt 24px, 4 columns flex-1 with gap 40px
  - Label: Figtree SemiBold 14px lh 21 **#032C5F**; Value: Figtree Regular 14px lh 20 #333, pt 4
  - `Handed off` → Dec 2025
  - `Industry` → EdTech / Higher Education  *(current code: "EdTech / Higher Education, B2B2C")*
  - `Role` → Lead Product Designer
  - `Team` → 7 Student Designers, Salesforce Experience Design Team  *(current code says **8**)*
- No TL;DR block (the hidden "TL;DR" eyebrows in Figma are hidden layers)

### 3.1 What is Galileo? (node `16:10`, gaps 48px)
- Pattern A. H2 "What is Galileo?"
- Body: "Galileo acts as a companion layer to the university's course enrollment portal helping students explore, plan, reflect on emerging academic directions and carry finalized courses into enrollment."
- Pattern B dark, 3-up (radius 24):
  - 01 — Shows a student where their coursework already points
  - 02 — Pulls everything about a course onto one page
  - 03 — Carries the finalized plan into enrollment when they're ready
- **UI Bento** (1008 × 504, grid 2 cols × 2 rows, gap 16):
  - Left, spans both rows (496×504): `about-bento-1-academic-progress.png` at left/top 31px, 1131×827 → bleeds off right + bottom
  - Top right (496×244): `about-bento-2-course-details.png` at 23/23, 596×367 → bleeds right + bottom
  - Bottom right (496×244): `about-bento-3-finalized-courses.png` horizontally centred, top 23, 365.5×676 → bleeds bottom
  - Each tile: bg #FAFAFA, 1px #E8E8E8 border, radius 24, overflow clip; image border #E8E8E8, radius 16, shadow

### 3.2 My role (node `19:143`, gap 48px)
- Pattern A. H2 "My role". Body (3 paragraphs, gap 16):
  1. "I owned the information architecture and designed 3 of Galileo's 5 product areas."
  2. "**Academic Trajectory** is the four-lens view of where a student's coursework points. **Course Details** is the consolidated course page built around a personalized summary."
  3. "I also shaped how **AI interaction patterns** will be used across the product, led visual design and evaluation of Galileo."
  (bold = SemiBold #032C5F)
- **Design Flow / IA diagram** (1008 × 602, bg #FAFAFA, overflow clip). Absolute layout:
  - Legend at (69, 32): 16px #032C5F dot + "features I owned" (Figtree Regular 14px #555), gap 6
  - Root node "Academic Overview" — dark (#032C5F bg, #FAFAFA text), 220w, p 24, radius 16, centred at top 32
  - Dashed connector (`role-flow-connector.svg`, 670×387.5 at 156.5,108) fans to 4 level-1 nodes at y=140 (h76, p 24, radius 16, Figtree Medium 18 lh 28):
    - "Browse Courses" (x69, plain: bg #FAFAFA, #555, no border)
    - "Shortlisted Courses" (x272, plain)
    - "Semester Planner" (x504, plain)
    - "Academic Trajectory" (x719, 220w, **dark = owned**)
  - Level-2 pills (bg #FEFEFE, 1px #E8E8E8 border, p 16, radius 16, Figtree Medium 18 #555), stacked 76px apart at y≈248/324/400 with dashed vertical lines (`role-flow-vertical-line.svg`) at x=108 and x=316:
    - Under Browse Courses: "Discovery", "Course Catalogue", "**Course Details**" (dark = owned)
    - Under Shortlisted Courses: "All Shortlisted", "Scheduler", "Compare Courses"
  - Under Semester Planner: dashed line down through label chip "enrollment plugin" (bg #FEFEFE, p 4, 14px #555) at (541,340) to "iGPS" node at (547,494): 48px circle bg #E5F6FC with `role-flow-puzzle-piece.svg` 24px, then "iGPS" (Medium 18 #555) + "university portal" (Regular 14 #555), centred

### 3.3 Problem (node `34:1198`, gap 72px between the two sub-blocks)
**Block One** (gap 48):
- Eyebrow "Problem Space" + Pattern A, H2 "Where academic planning breaks down"
- Body: "Interviews with students surfaced two problems that outweighed everything else we heard."
- Pattern B light, 2-up, gap 48:
  - **01** — "Academic planning lives across the course catalog, an advisor, peer group chats and whatever review site a student trusts that week." / "Putting together a real picture of one course means stitching all of it together yourself."
  - **02** — "Most students can list the courses they'd taken but few can say what those courses were actually building toward." / "Choices are reactive instead of directed, with no clear sense of where the coursework was pointing."

**Block Two** (gap 48):
- Pattern A with 24px Medium sub-heading "Where should we focus?"
- Body:
  1. "Interviews also touched career exploration, social life, mental health and we built an Importance x Opportunity matrix to weigh where our effort could do the most good."
  2. "We chose depth over coverage. Building one core academic planning experience end to end mattered more than spreading across every part of a student's life."
- **Research Areas** grid (870 × 613, centred in 1008), 5 columns (see palette in §2):
  - Academic: Fragmented Information · Already need to know what to search · Generic guidance and advising · Choice Overload
  - Career: Late career guidance · Disjointed from academics · No mentorship for transition
  - Social: Value peer insights · Low Event Visibility · Networking anxiety · FOMO · Scattered communication
  - Health: Burnout & stress · Need emotional resilience · Loss of support systems
  - General Direction: No goal setting · Student Interests + Expert opinions

### 3.4 AI interaction design principles (node `34:1954`, gap 48)
- Pattern A. H2 "AI interaction design principles used", with a **32px sparkle icon** (`ai-sparkle-32.svg`) rotated −14.85°, absolutely positioned top-left of the heading (left −35.6, top −26.6) — hangs outside the column
- Body:
  1. "An AI system that makes choices for a student can build dependency instead of judgment, the last thing a student needs while they're still figuring out who they are academically."
  2. "This ruled out the conversational AI pattern, a chat window where you ask and the system answers back. Galileo needed the opposite instinct."
- Pattern B dark, 3-up, **radius 16**, label row = 16px sparkle (`ai-sparkle-16.svg`) + 8px gap + label:
  - PRINCIPLE 01 — AI works in the background, not as an active chat window
  - PRINCIPLE 02 — Every AI-generated element gets labelled clearly
  - PRINCIPLE 03 — Keep paths open beyond what AI suggests
- (A "UI Bento" with 4 images exists but is **hidden** in Figma → not built)

### 3.5 Solution — Course Details (node `49:8159`, inner gap 32)
- Eyebrow "Solution" + Pattern A, H2 "Course Details"
- Body:
  1. "iGPS had the mechanics, Reddit had the unfiltered and anonymous reviews, RateMyProfessor had how the professor taught."
  2. "Students had to check three different platforms, including offline reviews from peers to decide on a course."
- **Before carousel**: horizontal row of 790 × 535 slides, gap 24, overflowing to the right (first slide full + next slide peeking). Slide: bg #F5F5F5, radius 24 (slides 3–4 also have 1px #E8E8E8 border). Header at 24/24: BEFORE badge + 16px gap + title (Figtree Medium 14px lh 22.4 #333). Screenshot 656×372 centred at top 92 (1px border, radius 8, shadow). Caption centred at top 488: Figtree Regular 12px lh 22.4 #555.
  - All 4 slides in Figma are placeholders using the same iGPS image/copy ("Platform 1: iGPS portal of IUB for enrollment into classes" / "Limited and scattered information"); slide 2's header is hidden.
- **After video**: 1008 × 800 container, bg #FAFAFA, radius 24, AFTER badge at 24/24 (hidden caption: "Course Details, built from all three"). Video source not specified.
- Pattern C rows:
  - **Overview** (text left, image right) — "At the top sits a summary generated for the student reading it, pulled from their course history Academic Trajectory already surfaced." / "The summary says how this specific course connects to where they're already headed." — image `course-details-overview.png` 622×580 centred, top 23 (bleeds bottom), radius 11.19
  - **Peer Insights** (image left, text right) — "This information can help students understand course difficulty, workload expectations, and overall experiences with professors and classes." / "The tags above each review provide a quick understanding of what the professor or course may be like." — image `course-details-peer-insights.png` 630×331 centred, **top −10** (bleeds top)
- Hidden: "AI Integration" eyebrows above each row title; a centred 750px caption above rows.

### 3.6 Solution — Academic Trajectory (node `104:1030`, gap 48)
- Eyebrow "Solution" + Pattern A, H2 "Academic Trajectory"
- Body: "Academic Trajectory takes the same course history and asks four different questions of it."
- Pattern B dark, **4-up** (radius 24, cards stretch to equal height 260):
  - By Year — Tracks pace by semester, credits completed against credits left, so a slow one gets caught early.
  - By Potential Major — Checks whether coursework already points toward a major, grouped so the pattern is visible.
  - By Career Pathways — Shows how coursework connects to different careers so student can choose to go deep into one.
  - By Course Themes — For students not ready to choose yet, groups courses around a broader interest so they can still explore.
- **Video**: 1008 × 800, bg #FAFAFA, radius 24, no badge (source not specified; existing Academic Trajectory Cloudinary video is a candidate)
- Pattern C rows:
  - **Overview** (text left) — "The majors/careers cards are the actual AI-generated read on a student's direction, so that's where transparency has to show up." / "A summarize icon marks each card as AI-generated, and disclosure copy underneath states what the suggestion is based on." — `trajectory-overview-cards.png` 1024×341 at 23/23 (bleeds right)
  - **How can this section help me?** (image left) — "The "How can this section help me?" prompt reframes the whole thing as a thinking tool instead of a verdict on who the student is." — `trajectory-how-can-this-help.png` 822×357, anchored **right 23**, top 23 (bleeds left + bottom); card height 350
  - **By Potential Major and By Career Pathways** (text left) — "Both lenses run the same AI logic as the cards above, applied at the course level." / "Each lens reads a student's coursework and places it under a major or a career and a single course can surface under more than one lens since the logic isn't sorting into a single fixed bucket." — `trajectory-major-career-lenses.png` 924×399 at 23/23 (bleeds right + bottom)

### 3.7 Reflections (node `125:2147`)
- Eyebrow "Reflections" + Pattern A, H2 "Setting boundaries for AI across the product"; body paragraph gap **24px**
  1. "AI suggestions can still come off as prescriptive, as copy alone doesn't guarantee behavior change. If I extended this project, I'd want to test whether the disclosure language actually changes how a student weighs a recommendation."
  2. "One student we interviewed worked part-time for the university's Advising office. They pushed hardest on keeping a person in that relationship." *(8px)* "It's part of why we considered a standalone Advisor section and chose not to build it, with AI already taking over so many jobs, that judgment felt too important to risk."
- Hidden UI Bento → not built.

---

## 4. What the redesign removes vs. the current page
- TOC sidebar and 768px column → 1008px full-width column
- TL;DR block
- "Before and After" section (both carousels + insight grids) — Before carousel moves into Course Details
- "Design Approach" section (4 approach cards + `DesignApproachImages`)
- "Overview: cutting everything that wasn't a next step" (dashboard video)
- "Enrollment Plugin" section (Plugin View / add-to-cart images)
- "In Hindsight" + `Illustration.png`
- Prescriptive vs Assistive comparison in Reflections

## 5. Asset map
| Figma layer | Local file | Existing public file (possible match) |
|---|---|---|
| About bento 1 (image 12) | `about-bento-1-academic-progress.png` | — |
| About bento 2 (image 14) | `about-bento-2-course-details.png` | — |
| About bento 3 (image 15) | `about-bento-3-finalized-courses.png` | — |
| iGPS view | `course-details-igps-view.png` | `public/new-salesforce/iGPS view.png` |
| CD Overview (image 16) | `course-details-overview.png` | `5. Course Details.png`? |
| CD Peer Insights (image 20) | `course-details-peer-insights.png` | `Professor Reviews.png`? |
| AT Overview (image 25) | `trajectory-overview-cards.png` | `Academic Trajectory- Overview.png`? |
| AT help prompt (image 27) | `trajectory-how-can-this-help.png` | — |
| AT lenses (image 28) | `trajectory-major-career-lenses.png` | `Academic Trajectory- 4 lenses.png`? |
| Sparkles, puzzle piece, connectors, legend dot | `*.svg` | — |

## 6. Decisions (answered 2026-09-24)
1. **New layout applies to all 4 case studies.** No TOC. Heading/body type values are identical across all 4 → build them as shared type-scale tokens in the design system.
2. Keep the Before carousel assets (iGPS, Degree Requirements, Reddit, RateMyProfessor) for the Course Details carousel. **Remove everything else** from the current page that isn't in the new frame.
3. Hidden layers in Figma = don't build.
4. Course Details Before carousel uses the 4 real slides with the new styling.
5. Videos: add **placeholders** for the Course Details "after" video and the Academic Trajectory video. New links coming later, and the hero video gets a new link too.
6. My role IA diagram: **export as an image** (not HTML).
7. Research Areas grid: switch to **Figtree**. Add an animation: **after 1.5s**, the non-highlighted cells fade to **20% opacity**. Cells that stay at 100%: all 4 Academic cells, Social "Value peer insights", both General Direction cells. Career and Health cells, plus the other 4 Social cells, fade to 20% (see the user's reference image of the end state).
8. `--ds-color-brand-salesforce-light` → update to **#E5F6FC**. It was only fed into CaseStudyLayout's `--accent-light` variable, which nothing reads, so nothing changes on the live site.
9. Team = 7 and no "B2B2C" are intentional.
10. **All cards use 24px radius**, including the AI principle cards (Figma's 16px was a mistake).
11. Fix copy: "so **a** student can choose" (By Career Pathways card); "Course Catalogue" → "Course Catalog" in the IA diagram; "will be used" → "were used" in My role (confirm wording at build time).
12. **Mobile: on hold.** The user will share an updated mobile frame. Build desktop only for now.

### Video links (received 2026-09-24)
- **Hero** and **Academic Trajectory** section: `https://res.cloudinary.com/dh9rvf2hh/video/upload/v1790270207/acadtrajnew_s2agio.mp4` (hero set via `SALESFORCE_HERO_VIDEO` in `design-system/layout.ts`; the homepage card hard-codes its own URL and is unaffected)
- **Course Details** "after" video: `https://res.cloudinary.com/dh9rvf2hh/video/upload/v1790270244/Course_Overview_qyfzvy.mp4`

### Assets
- All page images are served as AVIF from `public/new-salesforce/galileo/`.
- My role diagram = the user's corrected export (`Design Flow 2.png`, 4×; level-1 nodes now sit in white boxes), converted to `role-design-flow.avif` at 2×. The earlier export was deleted. It still reads "Course Catalogue".
- Before-carousel slides (iGPS, Degree Requirements, Reddit 1/2, RateMyProfessor) are AVIF in `public/new-salesforce/`.
- Rule: **every image asset on the site is served as AVIF.**
- The user's `image 12/14/15.png` tile exports are archived in the assets folder (as `user-export-image-*.png`). They're unused because the page crops the full screenshots in code.

### Build notes
- **Site-wide pointer cursor:** a base-layer rule in `app/globals.css` gives `cursor: pointer` to every enabled interactive element (links, buttons, summary, selects, labels, interactive ARIA roles, clickable inputs). Tailwind v4's preflight resets buttons to `cursor: default`. The rule is layered, so cursor utilities and the custom-cursor rules still override it.
- **Card rows top-align their content** (no vertical centering), so labels line up when cards wrap to different line counts at narrower widths.
- Academic Trajectory: the video reuses `SALESFORCE_HERO_VIDEO` (same file as the hero, natural 1434×944 aspect). The three screenshots are AVIF at 2× their display width.
- **Cropped-screenshot tiles scale proportionally.** `MediaTile` takes the tile's Figma `frame` size and converts the image's px offsets to percentages. The tile containers keep the Figma aspect ratio (the bento grid is `aspect-[2/1]`, `MediaRow` tiles default to 668:346). This keeps the crop identical at any desktop width. Fixed px offsets had shifted the crop in the 1190px browser pane.
- Course Details:
  - The Before carousel (`BeforeAfterCarousel.tsx`, rewritten) is a horizontal scroll-snap track of fixed 790×535 slides with a 24px gap, clipped to the 1008px column so the next slide peeks in. Arrow buttons step one slide (814px). It also scrolls natively with a trackpad or touch. Slides have no border (Figma slides 3–4 had one, but slides 1–2 didn't).
  - The "after" video renders at its natural 1434×930 aspect (1008×654). The AFTER badge sits **16px above** the video, not over it (the overlay covered the Galileo logo).
  - The rows use the shared `MediaRow` (300px text column + `MediaTile`).
- AI principles: the sparkle icons stay **SVG**, since they're vector icons and AVIF would blur them. The AVIF rule covers raster images. The heading sparkle is positioned via `SectionHeader`'s `titleAdornment`, and the card icons via `CardRow`'s `icon`.
- Research Areas (`app/salesforce/ResearchAreas.tsx`): **loops**, switching between the full grid and the narrowed state (non-kept cells at 20%) every **1.5s** while at least half the grid is visible (checked with `intersectionRatio`, not `isIntersecting`). It pauses off-screen and uses a 700ms opacity transition. Reduced-motion users get the static narrowed state. Category colours are `--ds-research-*` tokens. Card text uses `text-secondary` (#555) instead of Figma's #505050.

Build order: section by section, starting with **What is Galileo?**
