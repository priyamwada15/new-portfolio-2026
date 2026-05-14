/**
 * Convert Rocket slider PNGs in /public to AVIF (Before.avif / After.avif).
 * Place sources as `Before new.png` and `After new.png`, then run:
 *   node scripts/convert-rm-slider-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const jobs = [
  { input: "Before new.png", output: "Before.avif" },
  { input: "After new.png", output: "After.avif" },
];

for (const { input, output } of jobs) {
  const inPath = path.join(publicDir, input);
  const outPath = path.join(publicDir, output);
  if (!fs.existsSync(inPath)) {
    console.error(`Missing input: ${inPath}`);
    process.exit(1);
  }
  await sharp(inPath)
    .avif({ quality: 72, effort: 6, chromaSubsampling: "4:2:0" })
    .toFile(outPath);
  const inStat = fs.statSync(inPath);
  const outStat = fs.statSync(outPath);
  console.log(`${input} → ${output} (${inStat.size} B → ${outStat.size} B)`);
}
