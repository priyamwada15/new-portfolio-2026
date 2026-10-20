# Asimov coded UI (homepage card)

Started 2026-10-20 on branch `case-study-coded-ui`. A live, coded moment from the Tars knowledge dashboard floats in the calm centre of the Asimov card's library scene (`public/case-study-scenes/asimov-scene.webp`), replacing the screen recording. It follows the pattern set by the Rocket Mortgage demo (see `2026-10-20-rocket-mortgage-coded-ui-design.md`).

## Why this moment

- Asimov is a Slack agent, so asking and inspecting answers happen in Slack's UI. That isn't the user's visual craft, so it's not the face of this card.
- Her visual craft is the Tars dashboard. She chose the **knowledge management screen: uploading a resource and watching it sync.**
- Geoff Keehan's note on the old thumbnail: if you show adding a resource, represent it with real care, the way you'd show it to someone you deeply respect, not just for the sake of having it. So this is staged, not a screen recording: no sidebar, full table or window chrome, only the pieces that tell the moment, given room on the scene.

## Decisions (2026-10-20)

1. **The flow:** an upload card floats in, a file drops in (for example "Refund policy.pdf"), it settles into a source row, and its status goes Uploading → Syncing (with progress) → Synced while a document count ticks up. One or two already-synced rows sit above it (for example #support and a Google Drive folder), so it reads as a live knowledge base.
2. **Keep the answer bubble at the end:** a small plain bubble (no Slack chrome) cites the new source, e.g. "From Refund policy", linking setup to a traceable answer.
3. **No Asimov intro pill.** The Asimov logo isn't strong enough to open on, so the demo starts straight with the upload. (Rocket keeps its intro, now the avatar only.)
4. **Same shared behaviour as Rocket:** plays only while on screen, slow pacing, desktop interaction stops the loop, restart button bottom-right, "Read" disc only beside the UI, a non-interactive loop on phones, the finished state for reduced motion.

## Source frames (captured 2026-10-20)

Exported with the user's Figma Tool; dumps made with `figma-json-dump.mjs`.
- `main-figma.json` — **"Main"** (`52260:12143`), the knowledge base page, 1232×862.
- `notion-knowledge-accordion-figma.json` — **"Notion Knowledge Accordion"** (`52401:6490`), one expanded Notion resource, 886×153.
- `training-status-figma.json` — **"Training Status"** component set (`52260:11477`), the status pill and its states.

There's no upload modal or drop zone in these exports. The page has an "Add Resource" button.

### Page ("Main")
White, padding 32/145, content column 910 wide, 32px gaps.
- **Knowledge base name row:** Notion icon (20px) + "Acme- Notion Knowledge" (Inter 500 16/24, ls 0.15, #404040) in a field (padding 10/12, r8), then a **workspace tag**: #FAFAFA fill, 0.5px #E3E3E3 border, r12, 24 tall, padding 0/12; a 6px gradient dot, a 16px green (#4CC86E, r2.67) square with a white "spa" icon, and "Acme" (Inter 500 12/24, ls 0.4, #404040).
- **Resources header:** "Resources uploaded (4)" (Inter 500 16/22.4, ls -0.16, #555555; the "(4)" in #979797). On the right, 8px apart:
  - **Sync split button:** "Sync" half (padding 4/12, white + #4F148D at 5%, radii 4/0/0/4, mdi:sync 14px + "Sync" Inter 500 12/20, #4F148D) and a 30px chevron half (radii 0/4/4/0, 1px #4F148D at 10% border).
  - **"Add Resource" button:** white, 1px #C4C4C4, r8, padding 8/16, add icon 16px + "Add Resource" Inter 500 12/16.8, ls -0.12, #404040.
- **Resource list:** 16px gap between accordions. Below it: "Last Sync:" + "21-Dec-2023 • 23:59 PM" (Inter 400 12/18, ls 0.15, #979797).

### Resource accordion
White, 1px #E9EAEB, r8, padding 12/16, 24px gap, clips content. Width 886.
- **Header (28 tall, space-between):** left: 20px source icon (Notion) + name (Inter 400 14/19.6, ls -0.14, #555555). Right, 12px apart: **training status pill**, a 20px chevron (#979797; points up when expanded, down when collapsed) and a 20px more-vert (#979797).
- **Details (expanded only):** a row of fields, 56px apart, each 160 wide: label (Inter 500 12/18, ls 0.15, #979797), 8px, value (Inter 400 14/21, ls 0.15, #404040), optional sub-line (Inter 400 12/18, #717684).
  - Notion page (from the accordion export): **Type** "Page"; **Location** "Acme › Product" ("Acme" #717684, 12px caret); **Pages synced** "214" + "Includes subpages"; **Last synced** "In progress" + "Started 2 min ago".
- Rows in the page: **Product Wiki** (expanded), **Sales Wiki** and **Enterprise Client Summary** (collapsed). The collapsed rows' hidden details are left over from a Slack variant (Channel ID, messages fetched) and aren't used.

### Training status pill (component set)
28 tall, r24, padding 4/16, 4px gap, 14px icon + Inter 500 12/20 label. 101 wide (Not Trained 112).
- **Not Trained:** white + #979797 at 10%, info icon, "Not Trained" in #979797, padding 4/12.
- **Syncing (stages 1–4):** white, 1px #4F148D at 10%, hourglass icon + "Syncing" in #4F148D. A #4F148D-at-10% fill grows from the left across the pill (1 → 44 → 86 → 112px, clipped): it's a progress bar inside the pill. Prototyped as smart-animate steps 0.8s apart, 1.02s "gentle" easing.
- **Done:** white + #F0FDF4, a green gradient border at 20% (#2BAE66 → #33CF78), check icon + **"Synched"** in #15803D.

### Add Knowledge modal (`add-kb-modal-figma.json`, "Add KB Modal" `52303:12819`)
460×410, white, 1px #E0E0E0, r16, padding 24, 24px gap.
- **Header:** "Add Knowledge" (Inter 500 16/25.6, #404040), centred; close icon 20px (#979797) top right. (A subtitle is hidden.)
- **Knowledge Type** (label Inter 500 14/21, ls 0.15, #404040), then 8px, then a **dropdown**: white, 1px #E9EAEB, r8, padding 8/12, Notion icon 20px + "Notion" (Inter 500 14/19.3) + expand-more 16px (#555555).
- 12px below, the **connected workspace card**: #FAFAFA, 1px #E9EAEB, r8, padding 16; a 44px Notion logo, 12px, then a 6px #979797 dot + "Not connected to Notion" (Inter 400 10/24, ls 0.4, #555555) over a **"Connect Notion"** pill (white, 1px #C4C4C4, r37, padding 8/16, open-in-new 16px + Inter 500 12/16.8). Hidden variants hold a connected workspace list.
- 20px, then **Name** (label as above) and an input: 1px #E9EAEB, r8, padding 8/12, "Notion Knowledge" (Inter 400 14/21, #404040).
- **Buttons** (right-aligned, 8px): "Cancel" text button (Inter 500 14/22, ls 0.46, #555555, r24, padding 6/24) and **"Add"** (#4F148D, r8, padding 6/24, Inter 500 14/24, ls 0.4, white), shown at 50% opacity (disabled) in the frame.

### Tokens in the frames
- Tars purple: #4F148D (status text, sync), #6D33AA (accents)
- Success: #15803D text on #F0FDF4
- Neutrals: #404040 values, #555555 names, #717684 secondary, #979797 labels and icons, #C4C4C4 button border, #E9EAEB card border, #EEEEEE dividers, #FAFAFA tag
- Font: Inter throughout (one hidden Sync variant uses Poppins; not used)

### Assets (in `public/asimov-demo/`)
- `notion.svg` — the user's Notion logo export (44px).
- Icons: Material Symbols Rounded, **weight 400**, unfilled (matching Tars' Material "rounded" icons): hourglass-empty, check, info, add, sync, expand-more, more-vert, open-in-new, close.

## Decisions, round 2 (2026-10-20)

- **The upload step is the Add Knowledge modal** (exported above).
- **Fields narrowed** so the panel fits the card: four detail fields in one row, about 120px each.
- **No knowledge base name row.**
- **Everything floats on the scene:** no white page behind it. The header line, buttons, resource rows and modal each sit on the library scene as their own surfaces.
- **Icons at weight 400.**
- **"Synched" → "Synced"** on the done pill (approved). ("Acme- Notion Knowledge" and "23:59 PM" are gone with the name row and the Last Sync line.)
- **Connected state wording:** green dot + "Connected to Acme" (approved; the frame only has the not-connected state).
- **Answer bubble (approved):** Q "What did we ship in the last release?" → A "Release 4.2 added custom actions and faster syncs for Notion pages." with "From Product Wiki · Notion".

## Storyboard (approved 2026-10-20), about 25s

1. The header line ("Resources uploaded (2)" + Add Resource) and two synced rows (Sales Wiki, Enterprise Client Summary) float in as separate cards.
2. A scripted click on Add Resource; the Add Knowledge modal floats up, and the list dims slightly.
3. Knowledge Type is Notion. A click on Connect Notion turns the grey dot and "Not connected to Notion" into a green dot and "Connected to Acme". Name types "Product Wiki", then Add goes from 50% to full and is clicked.
4. The modal closes, the count goes to (3), and Product Wiki slides in at the top as "Not Trained". The pill turns to Syncing and its purple fill moves through four stages.
5. The row expands: Type "Page", Location "Acme › Product", Pages synced counts up to 214, Last synced "In progress".
6. The pill turns green ("Synced"), and Last synced becomes "Just now".
7. The answer bubble appears beside the list.

Desktop: Add Resource and row expanders are clickable (stopping the loop), plus the restart button and the "Read" disc beside the UI. Phones: a non-interactive loop. Reduced motion: the finished list.
