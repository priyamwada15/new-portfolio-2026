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

## Source frames

_Waiting on the user's node JSON exports: the knowledge management list with its rows and status chips, the upload modal or drop zone, and the sync states (Uploading, Syncing, Synced, Failed if designed)._
