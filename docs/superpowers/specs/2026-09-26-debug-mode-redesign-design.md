# Tars Debug Mode case study — September 2026 redesign spec

- Figma: `September-Case-Study-2026` (`2EAQtgQB9OQgKZ5WehI5Hd`), frame **"New Debug"** node `171:6037` (1512 × 7726)
- Source: the user's Figma Tool (REST API) export → `assets/2026-09-26-debug-mode-redesign/figma-node.json`. The readable layer dump is `figma-layer-dump.txt` (made with `docs/superpowers/specs/figma-json-dump.py`, column x = 2336).
- Current implementation: `app/tars-debug-mode/page.tsx` (+ `DebugChatPreview`, `ScaleToFit`, `VisibilityMount`, `AutoPauseVideo`)
- Shared layout: see the Salesforce, Rocket Mortgage and Asimov specs (`sept2026Layout`, `SectionHeader`, `CardRow`, `caseStudy*` tokens).

Status: **desktop complete (2026-09-24).** Built section by section on `debug-mode-redesign`.

---

## 1. Global
- 1008 column, no TOC, intro ends 1125 → content 1233 (120 incl. the meta pt), sections **184** apart.
- Accent: eyebrows **#40156E** (`brands.tars.dark`). Figma uses #6D33AA for the meta labels and the Impact stat label (see Q1).
- Type: same tokens as SF/RM/Asimov. **Type scale changed 2026-09-24 for all 4 case studies (overrides Figma):** H1 40 Medium; section H2 **24** SemiBold (lh 1.45); sub-heading **18** Medium; body **16**/1.6; card text **16**/28px; row title 18 SemiBold; big numbers **24**; eyebrow 14 SemiBold. Figma's 40/24/18 values below are superseded.
- Image panels: **#FAFAFA fill + 1px #E8E8E8 border, r24, clip** (Asimov used #F5F5F5 without a border). Video panels: #FAFAFA, r24, no border.

## 2. Sections

### 2.0 Intro
- Breadcrumb `Home / Tars Debug Mode`; TARS logo 76×24
- H1: "Designing an internal debugger that cut troubleshooting time by ~70%"
- Hero 1008×567 r18 → **existing hero video**
- Meta (pt 24, 4 × 234): Shipped → Oct 2022 · Industry → B2B SaaS · Role → Product Designer · Team → **CS Team, Developers** (current: "CS Team, CTO, CEO, Developers")
- No TL;DR (eyebrow hidden)

### 2.1 About (Pattern A, no eyebrow)
- H2 "What is Debug Mode?"; body (pt 8, gap 16):
  1. "Debug Mode is a testing tool inside Tars, where teams build AI agents as visual flowcharts. It runs a conversation through the flow and stops on the node where it breaks."
  2. "Before it, the CS team traced 500+ nodes by hand to find one broken link. I designed and shipped it within a month."
- No stat cards.

### 2.2 Core Features (gap 48)
- Eyebrow "Core Features", H2 "The canvas follows the run and stops where it breaks". Right column (pt 8) = two blocks 48 apart, each gap 12: title 18 SemiBold #333 + body (same shape as Asimov Reflections):
  1. **The active node stays in focus** — "The canvas tracks the debugger node by node, so the CS team doesn't lose their place in a 500 node flow."
  2. **Failures surface on their own** — "When a connection breaks, the run pauses on that node and the canvas zooms straight to it in red."
- Video panel **1008×658**, #FAFAFA, r24 → `New_Debug_Video` (its own ratio is 768:524 = 1008×688)
- Row: text left 480 (24 Medium title, gap 16, body) | panel right 480×460 (#FAFAFA, border, r24, pad 40/40/0/40, content bottom-aligned 400×420):
  - **Three controls that anyone can run** — "Play/pause, stop and restart. I kept the set small enough that a client with no dev background could use it once Debug Mode shipped for them."
  - Figma shows a static "Simple Controls" screenshot; the current page shows the live `DebugChatPreview` here.

### 2.3 Impact
- Eyebrow "Impact", H2 "Debug Mode became part of every chatbot update". Right column (pt 8, gap 24):
  - Body: "On the release call, Tars' CEO described a CS team member starting a run and moving on to other work."
  - Stat (gap 16): label "Troubleshooting Time" 14 SemiBold (#6D33AA in Figma); then (gap 8) "~70%" Figtree Bold 48 lh 48 #111; caption "Time that used to go into tracing broken flows by hand." 16/25.6 #555.

### 2.4 Iterations (one section; the two iterations are 120 apart)
**Iteration 1** (header → rows 56, rows 56 apart; rows are 300 text | 40 gap | 668 media, alternating)
- Eyebrow "Iterations", H2 "Iteration 1: Three status colors down to one signal" (left half only, no body)
- Row text: title 18 SemiBold, gap 16, paragraphs 16 apart.
  1. Text left — **Before** — "The canvas I was designing for had 500+ nodes and all of them had the same visual treatment." | `Before Gambit Canvas` 668×387 (image's own ratio), border, r24
  2. Media left — `Color Coded States` 668×478 panel (image 666×476, own ratio) | **Design Iteration** — "My first idea was to color code every node by status. I soon realized while testing that adding three more colors on top of all that blue made the one failing node harder to find." / "It also made the canvas more chaotic, which was something I wanted to avoid."
  3. Text left — **Shipped Design** — "I dropped the status colors and made the active node the only thing that stands out. It stays at full opacity while the rest of the canvas fades to 40%." / "The failure node still needed to stand out from the other nodes, so I retained the standard ‘red-failure’ treatment for it." | panel 668×526, border, r24 → `Shipped_Details` video (own ratio 720:524 → cover)

**Iteration 2** (no eyebrow; H2 "Iteration 2: Dropping the code editor conventions"; header → rows 56, rows 56 apart, gap 40)
  1. Text 420 left — **Design Iteration** — "My first version borrowed from code editors: play/pause, stop, step into, step out, step over and logs. The CS team could work with it." / "However, clients were going to use this tool next, and for anyone without a dev background the step controls are where they'd get stuck." | panel 548×447 (pad 40/40/0/40): `Complex Controls` 466×405, top-cropped, top corners r30, shadow `0 0 12px 2.25px rgba(0,0,0,.04)`
  2. Panel 548×447 left: "Simple Controls" 466×405, same treatment | text 420 — **Shipped Design** — "I kept play/pause, stop and restart, with a status line that says what the debugger is doing at any moment." / "Within a couple of months, 90% of the errors the CS team ran into came from small control changes or API and custom code issues that were reported via the debugger. These three basic controls covered all of them."
  3. Text 472 left — **Shelved Design** — "The debugging console was never shipped. I had designed it as a way to surface deeper error reports, but once V1 launched, the CS team found the simpler interface handled nearly every issue." / "Since engineering support was rarely needed, the console was shelved." | panel 496×506 (pad 0/40/40/40, bottom-aligned): `ChatbotPreview Console Window New` 414×855 → only its bottom ~466px shows

### 2.5 Reflections
- Eyebrow "Reflections", H2 "Runs should call people back"; body (pt 8, gap 16):
  1. "Once the CS team started leaving runs on their own, they still had to keep checking the canvas to see if one had paused."
  2. "I'd add sound and desktop notifications so Debug Mode could tell them."
- Hidden: "UI Bento" (4 images), "AI Integration" eyebrows, the iteration header bodies (Asimov leftovers) → not built.

## 3. Removed vs current page
TOC, TL;DR, Context section (its canvas image moves to Iteration 1 "Before"), the "two users" constraint, the Impact sub-items, `IterationBadge`/`EvolutionCard`, Scope Decisions (the "shipping in phases" paragraph goes; the console becomes Iteration 2 row 3), In Hindsight's "Surface run health" item and its `Debug Mode Test Run Prototype` iframe.

## 4. Decisions (answered 2026-09-24)
1. Dark purple `brands.tars.dark` (#40156E) everywhere: eyebrows, meta labels, the Impact stat label.
2. Keep the live `DebugChatPreview` in both "Simple Controls" spots (Core Features row, Iteration 2 Shipped Design), sized to the Figma boxes.
3. Hero, Core Features video and the Shipped Details video are unchanged. The Core Features video keeps its own ratio (1008×688, not Figma's 658).
4. Use `ChatbotPreview Console Window New.png`, converted to AVIF; delete the old console PNG.
5. Follow Figma's panel style: #FAFAFA + 1px #E8E8E8 border, r24.
6. Complex Controls: top 405px crop, top corners r30, soft shadow.
7. Drop the Context section, the phases paragraph, the badges and the run-health item. Delete the files that become unused (`Debug Mode Test Run Prototype/`, `VisibilityMount` if nothing else uses it, the old PNGs once converted to AVIF).
8. Copy stays as in Figma ("500 node flow"). The Team meta keeps the current "CS Team, CTO, CEO, Developers".
9. Search description: "I designed and shipped Debug Mode, an internal debugger for Tars that cut troubleshooting time by ~70%."
10. Branch `debug-mode-redesign` from `asimov-redesign`. Build order: Intro + About → Core Features → Impact → Iterations → Reflections.

### Build notes
- Intro + About: `sept2026Layout`, `accentDark={brands.tars.dark}`, `accentLight={brands.tars.light}` (same #E2D6EE as the old hex), `caseStudyTitle`, breadcrumb "Tars Debug Mode". Measured at 1512: H1 40/500, hero 1008×567, meta labels #40156E, About 168 tall (Figma 169). Meta label → About is 165 vs Figma's 173, because Figma's meta frame has a fixed 65px height. Asimov has the same 165, so it's left as is for consistency.
- Core Features: header reuses `SectionHeader bodyClassName="gap-12 pt-2"` with `caseStudyRowTitle` h3s (as Asimov Reflections). Video panel `aspect-[768/524]` (1008×688), `bg-surface-page`, r24, no border. Image panels use a local `imagePanel` class (`bg-surface-page border border-border`, r24). The live preview sits in an absolutely positioned box (`inset-x-[8.33%] top-10 bottom-0`), because percentage padding would resolve against the row, not the panel. Measured at 1512: header 282 (Figma 283), video 688, row 460, panel 480×460, preview 400 wide at top 40, 184 on both sides.
- Impact: `SectionHeader bodyClassName="gap-6 pt-2"`; stat label uses `caseStudyEyebrow`, "~70%" is 24 Bold `text-ink` (new type scale), caption inherits body. Measured: section 218 tall, gaps 24/16/8 as Figma, 184 on both sides.
- Iterations: local `IterationRow` (fixed text width 300/420/472, 40 gap, media fills the rest, top-aligned). Screenshots converted to AVIF at 2× (Before 1336w, Color Coded 1332w, Complex Controls 932w, console 828w, saved as `ChatbotPreview Console Window.avif`); all five PNGs deleted. Complex Controls: 85.04% wide at top 8.95%, top corners r30, shadow. Live preview: `inset-x-[7.48%]` at top 8.95%. Console: 83.47% wide, bottom 7.91%. Measured at 1512: rows 388/477/526 and 447/447/506, all offsets land on Figma's 40px, 56 between rows, 120 between iterations, 184 on both sides. Old Context, Design Evolutions and Scope Decisions sections and their helpers removed.
- Reflections: `SectionHeader` with the two paragraphs. Old In Hindsight section removed; deleted `VisibilityMount.tsx` (only this page used it) and `public/new-debug-mode/Debug Mode Test Run Prototype/` (the homepage `DebugFlowPreview` only names it in a comment). Full page at 1512: About 152, Core Features 1514, Impact 218, Iterations 3416, Reflections 155, every section 184 apart, no broken images.

## 5. Asset map
| Figma | File | Size | Figma display |
|---|---|---|---|
| Before Gambit Canvas | `public/new-debug-mode/Before Gambit Canvas.png` | 4040×2344 | 668×387 |
| Color Coded States | `Color Coded States.png` | 4256×3040 | 666×476 |
| Complex Controls | `Complex Controls.png` | 1472×2768 | 466 wide, top 405 |
| Console (new) | `ChatbotPreview Console Window New.png` (untracked) | 1472×3040 | 414×855, bottom 466 |
| Console (old) | `ChatbotPreview Console Window.png` | 1472×3040 | not in Figma |
| Simple Controls | live `DebugChatPreview` on the current page | — | 400×420 / 466×405 |
