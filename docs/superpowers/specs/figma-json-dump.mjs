// Node port of figma-json-dump.py, for machines without Python.
// Turns a Figma REST node JSON (from the user's Figma Tool) into a readable layer dump.
// Usage: node figma-json-dump.mjs <node.json> [content-column-x] > dump.txt
import { readFileSync } from "node:fs";

const d = JSON.parse(readFileSync(process.argv[2], "utf8"));
const X0 = Number(process.argv[3] ?? 0);
const hex = (c, op = 1) => {
  const a = (c.a ?? 1) * op;
  const h = "#" + ["r", "g", "b"].map((k) => Math.round(c[k] * 255).toString(16).padStart(2, "0").toUpperCase()).join("");
  return a >= 0.999 ? h : `${h}@${a.toFixed(2)}`;
};
const paints = (ps) =>
  (ps ?? [])
    .filter((p) => p.visible !== false)
    .map((p) => (p.type === "SOLID" ? hex(p.color, p.opacity ?? 1) : p.type === "IMAGE" ? `IMG(${(p.imageRef ?? "").slice(0, 10)},${p.scaleMode})` : p.type));
const out = [];
const walk = (n, depth = 0, hidden = false) => {
  const h = hidden || n.visible === false;
  const bb = n.absoluteBoundingBox ?? {};
  const pad = "  ".repeat(depth);
  const parts = [`${n.type} "${n.name}" ${n.id}`, `@${Math.round((bb.x ?? 0) - X0)},${Math.round(bb.y ?? 0)} ${Math.round(bb.width ?? 0)}x${Math.round(bb.height ?? 0)}`];
  if (h) parts.push("[HIDDEN]");
  if (n.layoutMode && n.layoutMode !== "NONE") {
    const p = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].map((k) => n[k] ?? 0);
    parts.push(`${n.layoutMode} gap${n.itemSpacing ?? 0} pad[${p}] main:${n.primaryAxisAlignItems ?? "MIN"} cross:${n.counterAxisAlignItems ?? "MIN"}${n.layoutWrap === "WRAP" ? " WRAP" : ""}`);
  }
  if (n.layoutGrow) parts.push("grow");
  if (n.layoutPositioning === "ABSOLUTE") parts.push("ABS");
  const f = paints(n.fills);
  if (f.length && n.type !== "TEXT") parts.push("fill=" + f.join(","));
  const s = paints(n.strokes);
  if (s.length) parts.push(`stroke=${s.join(",")} w${n.strokeWeight}`);
  if (n.cornerRadius) parts.push(`r${n.cornerRadius}`);
  if (n.rectangleCornerRadii) parts.push(`radii[${n.rectangleCornerRadii}]`);
  if (n.clipsContent) parts.push("clip");
  if ((n.opacity ?? 1) < 1) parts.push(`op${n.opacity.toFixed(2)}`);
  for (const e of n.effects ?? []) {
    if (e.visible !== false) parts.push(`${e.type}(${e.offset?.x ?? 0},${e.offset?.y ?? 0},${e.radius},${e.spread ?? 0},${e.color ? hex(e.color) : ""})`);
  }
  if (n.rotation) parts.push(`rot${n.rotation.toFixed(3)}`);
  if (n.type === "TEXT") {
    const st = n.style ?? {};
    parts.push(`${st.fontFamily} ${st.fontWeight}${st.italic ? " italic" : ""} ${st.fontSize}px lh${st.lineHeightPx ? Math.round(st.lineHeightPx * 10) / 10 : ""} ls${Math.round((st.letterSpacing ?? 0) * 100) / 100} ${st.textAlignHorizontal ?? ""} color=${f.join(",")}`);
    out.push(pad + parts.join("  "), pad + "   > " + (n.characters ?? "").replace(/\n/g, " / "));
    for (const [k, v] of Object.entries(n.styleOverrideTable ?? {})) {
      const keep = Object.fromEntries(
        Object.entries(v)
          .filter(([a]) => ["fontWeight", "fontSize", "fills", "italic", "fontFamily", "textDecoration"].includes(a))
          .map(([a, b]) => [a, a === "fills" ? paints(b) : b]),
      );
      out.push(pad + `   override ${k}: ${JSON.stringify(keep)}`);
    }
    return;
  }
  out.push(pad + parts.join("  "));
  for (const c of n.children ?? []) walk(c, depth + 1, h);
};
walk(d);
process.stdout.write(out.join("\n") + "\n");
