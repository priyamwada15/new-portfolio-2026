/**
 * One-shot: JPG/JPEG in public/new-about-page-assets → AVIF, then remove sources.
 * Run: node scripts/convert-new-about-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetDir = path.join(__dirname, "..", "public", "new-about-page-assets");

const sources = fs
  .readdirSync(assetDir)
  .filter((name) => /\.jpe?g$/i.test(name));

for (const name of sources) {
  const src = path.join(assetDir, name);
  const dest = path.join(assetDir, name.replace(/\.jpe?g$/i, ".avif"));
  await sharp(src)
    .avif({ quality: 72, effort: 5, chromaSubsampling: "4:2:0" })
    .toFile(dest);
  fs.unlinkSync(src);
  console.log(`${name} → ${path.basename(dest)}`);
}

console.log(`Done: ${sources.length} file(s).`);
