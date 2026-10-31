// Inline math as live Figma text for the second batch of G explainers (Fig 2.1, the Bayesian prior,
// the RLC tail). Runs after g_prelude.js. Real sub- and superscripts: "P_i(T | X, Π_{race})",
// "e^{−αt}", "ω_d". Single letters set in STIX Two Text Italic, function words and multi-letter
// subscripts upright, operators from STIX Two Math, as in the LaTeX outlines the first batch used.
const MF = { it: { family: "STIX Two Text", style: "Italic" }, up: { family: "STIX Two Text", style: "Regular" }, sym: { family: "STIX Two Math", style: "Regular" } };
for (const f of Object.values(MF)) await figma.loadFontAsync(f);
const UPRIGHT = new Set(["cos", "sin", "as", "race", "res", "uppet", "enforce", "buffer", "racialized", "adjacent", "max", "and"]);
const SYMS = "∝⊍√∞→±∣";
function mathRuns(src) {
  const segs = []; let i = 0, cur = "";
  const flush = lvl => { if (cur) segs.push([cur, lvl]); cur = ""; };
  while (i < src.length) {
    const c = src[i];
    if (c === "_" || c === "^") { flush(0); const lvl = c === "_" ? -1 : 1; i++;
      if (src[i] === "{") { const j = src.indexOf("}", i); segs.push([src.slice(i + 1, j), lvl]); i = j + 1; } else { segs.push([src[i], lvl]); i++; } }
    else { cur += c; i++; }
  }
  flush(0);
  // split each segment into font runs
  const runs = [];
  for (const [s, lvl] of segs) {
    const toks = s.match(/[A-Za-z]+|[Ͱ-Ͽ]|[^A-Za-zͰ-Ͽ]+/g) || [];
    for (const t of toks) {
      if (/^[A-Za-z]+$/.test(t)) { if (UPRIGHT.has(t)) runs.push([t, lvl, "up"]); else for (const ch of t) runs.push([ch, lvl, "it"]); }
      else if (/^[Ͱ-Ͽ]$/.test(t)) runs.push([t, lvl, t === t.toUpperCase() && t !== t.toLowerCase() ? "up" : "it"]);
      else { let buf = ""; for (const ch of t) { if (SYMS.includes(ch)) { if (buf) runs.push([buf, lvl, "up"]); buf = ""; runs.push([ch, lvl, "sym"]); } else buf += ch; } if (buf) runs.push([buf, lvl, "up"]); }
    }
  }
  return runs;
}
// math(parent, name, "q(t) = Q_0 e^{−αt}", 48, INK, x, y) → a frame of text runs on one baseline
function math(parent, name, src, size, color, x = 0, y = 0) {
  const g = figma.createFrame(); parent.appendChild(g); g.name = name; g.fills = []; g.clipsContent = false;
  let cx = 0, prevIt = false;
  for (const [s, lvl, f] of mathRuns(src)) {
    const sz = lvl ? size * 0.64 : size, t = figma.createText(); g.appendChild(t);
    t.fontName = MF[f]; t.fontSize = sz; t.lineHeight = { unit: "PIXELS", value: sz * 1.25 }; t.characters = s.replace(/ /g, "\u00A0");  // no-break spaces keep their width
    t.fills = typeof color === "string" ? solid(color) : bp(color); t.textAutoResize = "WIDTH_AND_HEIGHT";
    if (prevIt && f !== "it" && lvl === 0) cx += size * 0.05;          // italic overhang before an upright run
    // baseline sits about 0.92 em below the top of a 1.25 em line box; subscripts drop 0.3 em, superscripts rise 0.42 em
    t.x = cx; t.y = size * 0.3 + 0.92 * size + (lvl === -1 ? 0.3 * size : lvl === 1 ? -0.42 * size : 0) - 0.92 * sz;
    cx += t.width + (lvl ? size * 0.02 : 0); prevIt = f === "it";
  }
  g.resize(Math.max(1, cx), size * 1.6); g.x = x; g.y = y; return g;
}
// a highlight box around a node, in frame F coordinates
function ringAround(F, n, color, pad = 10, name) {
  const b = n.absoluteBoundingBox, fb = F.absoluteBoundingBox, r = figma.createRectangle(); F.appendChild(r);
  r.name = name || "ring · " + n.name; r.resize(b.width + 2 * pad, b.height + 2 * pad); r.x = b.x - fb.x - pad; r.y = b.y - fb.y - pad;
  r.cornerRadius = 10; r.fills = solid(color, 0.08); r.strokes = solid(color); r.strokeWeight = 3; return r;
}
// a polyline path from frame-pixel points, as one vector placed at (0,0) of its parent stage
function curve(parent, name, pts, color, w, dash) {
  const v = figma.createVector(); parent.appendChild(v); v.name = name;
  const x0 = Math.min(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1]));
  v.vectorPaths = [{ windingRule: "NONE", data: "M " + pts.map(p => `${(p[0] - x0).toFixed(1)} ${(p[1] - y0).toFixed(1)}`).join(" L ") }];
  v.x = x0; v.y = y0; v.strokes = solid(color); v.strokeWeight = w; v.strokeJoin = "ROUND"; v.strokeCap = "ROUND"; if (dash) v.dashPattern = dash; return v;
}
function stage(F, name) { const s = figma.createFrame(); F.appendChild(s); s.name = name; s.fills = []; s.clipsContent = false; s.resize(1920, 1080); return s; }
