# Asimov for Tars case study — September 2026 redesign spec

- Figma: `September-Case-Study-2026` (`2EAQtgQB9OQgKZ5WehI5Hd`), frame **"New Asimov"** node `165:3645` (1512 × 11344)
- Source: the user's Figma Tool (REST API) export → `assets/2026-09-25-asimov-redesign/figma-node.json`. The readable layer dump is `figma-layer-dump.txt`, made with `docs/superpowers/specs/figma-json-dump.py`.
- Current implementation: `app/tars-asimov/page.tsx` + `CoreFeatureVideo.tsx`, `KnowledgeSourcesDemo.tsx`, `WorkflowLoopGraphic.tsx`, `Dialkit.tsx`
- Shared layout: see the Salesforce and Rocket Mortgage specs (patterns A–F, `sept2026Layout`, `SectionHeader`, `CardRow`, `Testimonial`, `caseStudy*` tokens).

**Rule from the user: all media is unchanged.** Every video, image, live UI demo (`KnowledgeSourcesDemo`, `WorkflowLoopGraphic`) and the hero stay exactly as on the current site. Only layout and copy change. Figma's image and video frames are placeholders for the existing media.

Status: **decisions recorded (§4).** No code yet.

---

## 1. Global
- 1008 column, no TOC, intro → content **120** (intro ends 1113, content 1233), sections **184** apart.
- Accent in Figma: **#40156E** (eyebrows, meta labels, stat cards). The current page uses `#6D33AA` (`--ds-color-brand-tars`), which Figma keeps only for the logo and diagram dots.
- Type: same tokens as SF/RM (H2 40 SemiBold lh 1.45; body 18/1.6 #555; subheading 24 Medium lh 1.45; row title 18 SemiBold lh 1.6; eyebrow 14 SemiBold lh 21).

## 2. Sections

### 2.0 Intro
- Breadcrumb `Home / Asimov for Tars`
- TARS logo 76×24
- H1 (py 8): Figtree **Medium 36**, lh 1.4, #333 (SF/RM are 40) — "Designing the configuration hub for a Slack AI agent used by startup teams"
- Hero (py 32): Figma 1008×567, r18 placeholder → **existing hero video, unchanged**
- Meta (pt 24, 4 × 234 cols): labels 14 SemiBold #40156E; values 14/20 (Figma mixes #111 and #333)
  - Shipped (Beta) → Jan 2024 · Industry → B2B SaaS · Role → Product Designer · Team → Founders, Developers
- No TL;DR block (the TL;DR eyebrow is hidden)

### 2.1 About (gap 48)
- Pattern A, **no eyebrow**, H2 "What is Asimov?"; body (pt 8, gap 16):
  1. "Asimov is Tars' AI agent for Slack. Work kept starting in Slack threads and finishing somewhere else, so we wanted the agent to handle that second half."
  2. "I took it from a thread summarizer to an AI teammate inside Slack, creating experiences for knowledge management, app integrations and configuring automated workflows."
- **Stat cards**: 3-up, gap 24, each 320×180, bg + 1px border #40156E, r16 in Figma, padding 40/24, content vertically centered, gap 24
  - Number: Figtree **Regular 40**, lh 48, #FAFAFA at **80%**
  - Text: Figtree Medium 18, lh 28, #FAFAFA
  - "12 of 15" — beta teams kept using Asimov
  - "~74%" — fewer repetitive questions asked
  - "86%" — of responses rated helpful
  - (Figma text has stray leading tab characters → trim)

### 2.2 What I Designed (header → rows 88, rows 88 apart)
- Eyebrow "What I Designed", H2 "Expanding Asimov's role in Slack"; body: "The product began with a single capability: summarizing Slack threads. Each release expanded what Asimov could understand, connect to and eventually do on a team's behalf."
- 3 rows. Each row is a column with gap 48: a **two-column text row** (24 Medium title left, 18/1.6 body right, no pt; = `SectionHeader subheading`), then a **media panel 1008×658**, #F5F5F5, r24 (= current `CoreFeatureVideo`, same 768:501 shape, keeps click-to-expand)
  1. **Knowledge Dashboard** — "Teams connected sources like Notion and Google Drive so Asimov could answer from company docs, with sync status and refresh timing visible for each source." — `KB_Asimov`
  2. **Integrations Hub** — "One place to connect an app, see what it's linked to and what information Asimov is accessing from it." — `Integrations_Asimov`
  3. **Action Configuration** — "Teams configured third-party app actions and built custom ones that, combined with Slack context, enabled Asimov to automate recurring workflows." — `Actions_Asimov`

### 2.3 Opportunities & Research (header → rows 88, rows 112 apart)
- Eyebrow "Opportunities & Research", H2 "Finding useful roles for Asimov"; body:
  1. "I interviewed customer success, sales, engineering, design and marketing to understand how work moved across conversations, tools and teams."
  2. "Rather than validating a specific feature, I wanted to identify where an AI teammate could meaningfully participate in daily work and boost productivity."
- Rows: two equal columns (488 / 488), **gap 32**, top-aligned, alternating sides. Text column gap 16: title 24 Medium; body 18/1.6 paragraphs (gap 16 assumed).
  - Graphic panel **488×558**, #F5F5F5, r24, clip. Screenshot at top 48 with a 1px #E8E8E8 border, r ≈ 9. Caption 12/22.4 #555, centered, top ≈ 510.
  1. Text left — **"Opportunity 1: Work happened across multiple tools"** — "Slack conversations often triggered work elsewhere." / "Customer-facing teams moved from a discussion to updating HubSpot, writing reports or sharing project updates, often times carrying the same context across multiple tools." / "Summaries reduced reading time, but rarely reduced the work that followed." — `Slack 1` at 415×425, left 37 — caption "Example scenario of Asimov summarizing threads."
  2. Graphic left — **"Opportunity 2: Teams had different workflows"** — "Engineering wanted GitHub workflows, sales wanted CRM updates and marketing wanted content generation. The pattern that emerged was a need for flexibility." / "Instead of designing automations for every use case, we designed a system that let teams define their own actions on top of connected tools." — `Slack 2` at 378×435, left 55 — caption "Example scenario of Asimov integration with other apps."

### 2.4 Deep Dive (header → rows 88, rows 88 apart)
- Eyebrow "Deep Dive", H2 "Asimov's core system"; body:
  1. "Setup took three steps: connect Slack, add knowledge sources and choose what Asimov could access."
  2. "After that, teams worked with it directly inside Slack."
- The existing `WorkflowLoopGraphic`, full width **1008×262**, r24, 8px below the header text (it's inside the header frame). Figma shows the same 3 nodes, arrows and pause control.
- Rows (two-column 24px title + body, gap 48, then media):
  1. **Knowledge and access controls** — "Asimov was only as useful as the context it could reach. I designed the setup so teams could pick exactly which sources and Slack channels it used, and see what was syncing." — `KnowledgeSourcesDemo` in a 1008×656 #F5F5F5 panel (Figma shows no radius)
  2. **Tool integrations** — "I designed each integration to show what it was connected to, what data Asimov could read and where to manage permissions, so teams always knew what the AI could reach." — `Integrations_Preview` video, 1008×658 panel, r24
  3. **Configuring custom actions** — "No fixed set of actions could cover every team's workflow, so I designed a system where teams decided what Asimov could do." / "They could turn built-in actions on or off for connected tools and write their own through a configurable schema." — `Actions_Preview` video, 1008×658, r24

### 2.5 Blocker (gap 48, items centered)
- Eyebrow "Blocker", H2 "Permissions and access"; body:
  1. "Early versions focused on what Asimov could do. As it grew, the question became who should be allowed to configure it."
  2. "Full role-based permissions needed backend work beyond the beta timeline. I designed the future access model and used Slack's admin permissions in the meantime."
- Panel **768×481** centered, #F5F5F5, r24, clip. Admin modal image 505×635 centered, top 64, drop shadow `0 0 24px rgba(0,0,0,0.04)` (the same crop as the current page).

### 2.6 Reflections
- Eyebrow "Reflections", H2 "What I'd take into the next project"; body pt 8, blocks 48 apart, each block gap 12 (title 18 SemiBold lh 1.6 #333):
  1. **"Permissions should ship with the first action"** — "Once Asimov could act in other apps, who was allowed to configure it became the harder question. Today, I would design governance alongside the feature instead of treating it as a later phase."
  2. **"AI products become platforms faster than you expect"** — "Asimov went from one Slack capability to a system of knowledge, integrations and actions. I'd plan the structure for new capabilities before we needed them."
- Hidden: "AI Integration" eyebrows, 4-image UI Bento → not built.

## 3. Removed vs current page
TOC, TL;DR block and its 3 big stats (replaced by the About stat cards), `SectionLabel` eyebrows, 768 column, `data-dialkit` hooks (check `Dialkit.tsx` is still needed).

## 4. Decisions (answered 2026-09-25)
1. Add token **`--ds-color-brand-tars-dark` #40156E** (primitive → semantic → theme/brands). It becomes the Asimov accent (`--accent-dark`); Debug Mode will use it too. `#6D33AA` stays for the logo and diagram dots.
2. H1 uses the shared **40px** `caseStudyTitle`. **40px is the headline size across all case studies** (Figma's 36 is overridden).
3. Stat cards get **24px** corners. Update the page's search description to match the new stat (drop "82% pilot adoption").
4. Copy: "oftentimes"; caption "Example scenario of Asimov integrating with other apps."; Opportunity 2 keeps **"I designed"** (not Figma's "we").
5. Meta values all #333 (`text-primary`). The knowledge-sources panel gets 24px corners like the other panels.
6. Cleanup approved: TOC, TL;DR + big stats, `SectionLabel` usage, `data-dialkit` hooks, delete `Dialkit.tsx`, convert `Slack 1/2.png` and `Admin User Manage Settings Modal.png` to AVIF (same pictures).
7. Branch `asimov-redesign` from `rocket-mortgage-redesign`. Build section by section, starting with Intro + About.

### Build notes
- Token `--ds-color-brand-tars-dark` #40156E (primitive), exposed as `brands.tars.dark`, the same pattern as `brands.rocket.dark`. `brands.tars.accentDark` is unchanged (#6D33AA) because the Debug Mode page still uses it until its redesign.
- About stat cards use a new `CardRow variant="stat"`: the dark card with the label as a 40/48 number at 80% white, a 24px gap, vertically centered. It measures 320×180 at 1512.
- Deleted `Dialkit.tsx` (unused). The existing lint error in `WorkflowLoopGraphic.tsx` (`react-hooks/refs`) is left alone because that file is unchanged media.
- What I Designed: rows reuse `SectionHeader subheading` with a new `level={3}` prop (renders an h3), followed by the unchanged `CoreFeatureVideo` (768:501 = 1008×658, click to expand). Measured at 1512: header 152, rows 792/763/792, gaps 88, 184 to the next section.
- Opportunities: images converted to AVIF at 2× display width (Slack 1 830w, Slack 2 756w, Admin modal 1010w); the PNGs are deleted. Screenshots are centered, width as a % of the 488 panel, top 48/558, caption top 510/558. The paragraphs within an opportunity are 12px apart (Figma `paragraphSpacing: 12`). Slack 2 keeps its natural aspect (446 tall vs Figma's stretched 435), as on the current site.
- Deep Dive: the header text and `WorkflowLoopGraphic` share a wrapper (8px gap, as in Figma). The graphic is now 1008×262 (`aspect-[1008/262]`, the same shape as before) and its nodes land exactly at the Figma x/y. The preview videos use `aspect-[1008/658]`. `KnowledgeSourcesDemo` is unchanged and renders 669 tall versus Figma's 656 (its tab bar plus the video's own 768:460 ratio), so that row is 13px taller than Figma. Section 3193 versus 3183.
- Blocker and Reflections: the Blocker panel is 768×481, centered, with the admin modal at 505 wide / top 64 as percentages of the panel. Reflections uses `bodyClassName="gap-12 pt-2"` with 18px SemiBold h3 titles. Desktop page complete (2026-09-25): every section 184 apart, heights within 2px of Figma except Deep Dive (+10, from the knowledge demo).
