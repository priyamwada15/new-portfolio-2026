/**
 * One-shot encoder: raster play assets → AVIF under `public/play/`.
 * Run: `npm run optimize:play-images`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const outDir = path.join(publicDir, "play");

fs.mkdirSync(outDir, { recursive: true });

/** @type {readonly [string, string][]} */
const jobs = [
  ["ROBO1.jpg", "robo1.avif"],
  ["ROBO2.jpg", "robo2.avif"],
  ["ASCII game poster.png", "ascii-game-poster.avif"],
  ["AI Intelligencer poster image.png", "ai-intelligencer-poster.avif"],
  ["Stellar scan poster image.png", "stellar-scan-poster.avif"],
  ["Robo Poster Image.png", "robo-poster.avif"],
];

for (const [srcName, destName] of jobs) {
  const src = path.join(publicDir, srcName);
  const dest = path.join(outDir, destName);
  if (!fs.existsSync(src)) {
    console.warn(`skip (missing): ${srcName}`);
    continue;
  }
  await sharp(src)
    .avif({ quality: 72, effort: 5, chromaSubsampling: "4:2:0" })
    .toFile(dest);
  console.log(`wrote ${path.relative(publicDir, dest)}`);
}
