// Shared helpers for the G explainers (G5, G11, G30, G32) on page "YT02v2 · Explainers G".
// Run through use_figma as g_prelude.js + one builder (g_fig22.js, g_rlc.js, g_warmup.js, g_axes_turn.js).
// Styling follows "wage S10-06": field colour, border ornament 3:119, Heading/H1 headline with the accent
// rule, Label/Mono Small captions, Source/Citation line, surface panels with Elevation/1 Panel.
// Math labels are outline SVGs (real sub- and superscripts): w35.* on "YT02 · Assets", g.* in "g assets".
const page = await figma.getNodeByIdAsync("143:23372"); await figma.setCurrentPageAsync(page);
const V = async id => figma.variables.getVariableByIdAsync(id);
const C = { field: await V("VariableID:1:18"), chart: await V("VariableID:1:20"), text: await V("VariableID:1:22"), textAccent: await V("VariableID:1:23"), textDim: await V("VariableID:1:24"), fillAccent: await V("VariableID:1:25"), s1: await V("VariableID:9:490") };
const bp = v => [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", v)];
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h, o) => [{ type: "SOLID", color: rgb(h), ...(o === undefined ? {} : { opacity: o }) }];
const MAT = "#5FC27E", STAT = "#D9A441", RED = "#E2573F", INK = "#F4EAD2", DIMC = "#9FB0CF", SURF = "#16264A";
const TS = Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s => [s.name, s]));
for (const s of Object.values(TS)) await figma.loadFontAsync(s.fontName);
const ES = Object.fromEntries((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s.id]));
const ST = Object.fromEntries(figma.motion.figmaAnimationStyles().map(s => [s.styleId, s.styleId]));
const border = await figma.getNodeByIdAsync("3:119");
const ap = figma.root.children.find(p => p.name === "YT02 · Assets"); await ap.loadAsync();
const hold = page.findOne(n => n.name === "g assets" && n.parent === page);
const ASSET = Object.fromEntries([...ap.children, ...hold.children].map(n => [n.name, n]));
async function txt(parent, name, s, style, fill, x, y, w, size) { const t = figma.createText(); parent.appendChild(t); t.name = name; await t.setTextStyleIdAsync(TS[style].id); t.characters = s; if (size) t.fontSize = size; t.fills = typeof fill === "string" ? solid(fill) : bp(fill); if (w) { t.resize(w, t.height); t.textAutoResize = "HEIGHT"; } t.x = x; t.y = y; return t; }
function svg(parent, name, key, h, tint) { const n = ASSET[key].clone(); parent.appendChild(n); n.name = name; n.visible = true; n.fills = []; n.rescale(h / n.height); if (tint) n.findAll(c => "fills" in c && c.type !== "FRAME" && c.type !== "GROUP").forEach(c => c.fills = solid(tint)); return n; }
const kf = (n, name, pts, ease = "LINEAR") => n.applyManualKeyframeTrack({ type: "PROPERTY", name }, { keyframes: pts.map(([t, v]) => ({ timelinePosition: t, value: { type: "FLOAT", value: v }, easing: { type: ease } })) });
const op = (n, pts) => kf(n, "OPACITY", [[0, 0], ...pts], "EASE_OUT");
const show = (n, on, off, d = 0.4) => op(n, off ? [[on, 0], [on + d, 1], [off, 1], [off + 0.35, 0]] : [[on, 0], [on + d, 1]]);
// draw a stroke on: PATH_TRIM_END 0 → 1 between t0 and t1
const draw = (n, t0, t1) => { kf(n, "PATH_TRIM_END", [[0, 0.001], [t0, 0.001], [t1, 1]], "EASE_IN_AND_OUT"); kf(n, "OPACITY", [[0, 0], [t0, 0], [t0 + 0.05, 1]]); };
// highlight windows: [[on, off], …] → opacity 0 ↔ 1
const windows = (n, ws, d = 0.3) => { const pts = []; for (const [a, b] of ws) pts.push([a, 0], [a + d, 1], [b, 1], [b + d, 0]); op(n, pts); };
function line(parent, name, pts, color, w, { arrow = false, dash = null } = {}) {
  const v = figma.createVector(); parent.appendChild(v); v.name = name;
  const x0 = Math.min(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1]));
  v.vectorNetwork = { vertices: pts.map((p, i) => ({ x: p[0] - x0, y: p[1] - y0, ...(arrow && i === pts.length - 1 ? { strokeCap: "ARROW_EQUILATERAL" } : {}) })), segments: pts.slice(1).map((_, i) => ({ start: i, end: i + 1 })), regions: [] };
  v.x = x0; v.y = y0; v.strokes = solid(color); v.strokeWeight = w; v.strokeJoin = "ROUND"; if (!arrow) v.strokeCap = "ROUND"; if (dash) v.dashPattern = dash; return v; }
// a transparent square frame centred on (cx, cy): rotating or scaling it pivots on that point
function rig(parent, name, cx, cy, half) { const r = figma.createFrame(); parent.appendChild(r); r.name = name; r.resize(2 * half, 2 * half); r.x = cx - half; r.y = cy - half; r.fills = []; r.clipsContent = false; return r; }
async function panel(parent, name, x, y, w, h, tag) { const p = figma.createFrame(); parent.appendChild(p); p.name = name; p.x = x; p.y = y; p.fills = bp(C.s1); p.cornerRadius = 14; p.strokes = bp(C.chart); p.strokeWeight = 1; await p.setEffectStyleIdAsync(ES["Elevation/1 Panel"]); p.resize(w, h); p.clipsContent = false;
  if (tag) await txt(p, "tag", tag, "Label/Mono Small", C.textDim, 20, 12, w - 40); return p; }
async function frame(name, headline, slot) {
  const old = page.findOne(n => n.name === name && n.parent === page); if (old) old.remove();
  const F = figma.createFrame(); F.name = name; F.resize(1920, 1080); F.fills = bp(C.field); F.clipsContent = true; F.x = slot * 2100; F.y = 0;
  const b = border.createInstance(); F.appendChild(b); b.name = "border";
  const head = await txt(F, "headline", headline, "Heading/H1", C.text, 190, 168, 1540);
  const rule = figma.createRectangle(); F.appendChild(rule); rule.name = "rule"; rule.resize(220, 4); rule.x = 190; rule.y = head.y + head.height + 14; rule.fills = bp(C.fillAccent); rule.cornerRadius = 2;
  head.applyAnimationStyle(ST.Opacity, { duration: 0.5, timelineOffset: 0.1, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } });
  rule.applyAnimationStyle(ST.Opacity, { duration: 0.5, timelineOffset: 0.3, props: { type: "fadeIn", easing: { type: "EASE_OUT" } } });
  return { F, head };
}
// captions under the stage: [[t, text], …], each holds until the next
async function captions(F, list) { for (let i = 0; i < list.length; i++) { const c = await txt(F, "caption · " + list[i][1], list[i][1], "Label/Mono Small", STAT, 190, 922, 1540, 24); show(c, list[i][0], list[i + 1] ? list[i + 1][0] : null); } }
async function source(F, s) { const t = await txt(F, "source", s, "Source/Citation", C.textDim, 190, 968, 1540); t.fontSize = 18; show(t, 0.4); return t; }
const finish = (head, dur) => head.setTimelineDuration(head.timelines[0].id, dur);
