// Figure 2.1 · Zooming the Binary (tex 1745-1768), OV turn 214 (2e5ed107beeff5fb), shot S07-71.
// Run as g_head.js + this file. Beats are seconds from the start of turn 214. The layout
// follows the book's TikZ: two macro-boxes I and O, the four In-group tiers inside I, the three
// Out-group layers inside O, the boundary projection between them, and the recursive partitions below.
const B = { boxes: 3.76, I: 5.24, O: 5.74, zoom: 6.64, tiers: 7.98, alpha: 9.62, focus: 12.26, end: 13.78 };
const { F, head } = await frame("g-fig2.1 zooming the binary", "Figure 2.1 · Zooming the Binary", 4);
await captions(F, [[0.5, "THE COARSE BINARY · TWO FLAT BOXES"], [B.zoom, "ZOOM IN · THE TIERS INSIDE EACH BOX"], [B.tiers, "FIVE TIERS · FOUR INSIDE THE IN-GROUP, THEN THE OUT-GROUP"],
  [B.alpha, "LOCAL IN-GROUP AND OUT-GROUP SPLITS INSIDE EVERY TIER, ON A NARROWER AXIS α"], [B.focus, "THE BINARY STAYS THE FIRST PROJECTION · THE TIERS LIVE INSIDE IT"]]);
await source(F, "The Original Power, Ch. 2, Figure 2.1 and Table 2.1");
const BLUE = "#7FA3E0";
const BW = 660, BH = 470, CY = 555, IX = 960 - 34 - BW, OX = 960 + 34;
// the zoom: everything below the headline sits in a rig centred on the stage, scaled 0.84 → 1
const Z = rig(F, "zoom rig", 960, CY, 960);
const L = (x, y) => [x - (960 - 960), y - (CY - 960)];   // frame → rig coordinates
const box = async (name, x, col, letter, tag) => {
  const r = figma.createRectangle(); Z.appendChild(r); r.name = "box " + name; r.resize(BW, BH); [r.x, r.y] = L(x, CY - BH / 2);
  r.cornerRadius = 18; r.fills = solid(col, 0.07); r.strokes = solid(col); r.strokeWeight = 4;
  const big = math(Z, "big " + name, letter, 150, col); [big.x, big.y] = L(x + BW / 2 - big.width / 2, CY - 130);
  const t = await txt(Z, "title " + name, tag, "Label/Mono Small", col, 0, 0, BW, 22); t.textAlignHorizontal = "CENTER"; [t.x, t.y] = L(x, CY - BH / 2 - 40);
  const tl = math(Z, "title math " + name, letter, 34, col); [tl.x, tl.y] = L(x + BW / 2 - 168 - tl.width, CY - BH / 2 - 58);
  return { r, big, t, tl };
};
const bI = await box("I", IX, BLUE, "I", "coarse In-group"), bO = await box("O", OX, RED, "O", "coarse Out-group");
for (const [b, t] of [[bI, B.boxes], [bO, B.boxes + 0.3]]) { show(b.r, t); show(b.big, t + 0.1); show(b.t, t + 0.2); show(b.tl, t + 0.2); }
// "labeled I" / "and O": the letters pulse on their word
// SCALE_XY pivots on the node's centre, so the rig scales about the middle of the stage
const scaleAbout = (n, pts, ease) => n.applyManualKeyframeTrack({ type: "PROPERTY", name: "SCALE_XY" }, { keyframes: pts.map(([a, v]) => ({ timelinePosition: a, value: { type: "VECTOR", value: { x: v, y: v } }, easing: { type: ease } })) });
const pulse = (n, t) => scaleAbout(n, [[0, 1], [t, 1], [t + 0.25, 1.12], [t + 0.8, 1]], "EASE_OUT");
pulse(bI.big, B.I); pulse(bO.big, B.O);
kf(bI.r, "STROKE_WEIGHT", [[0, 4], [B.I, 4], [B.I + 0.25, 8], [B.I + 0.9, 4]], "EASE_OUT"); kf(bO.r, "STROKE_WEIGHT", [[0, 4], [B.O, 4], [B.O + 0.25, 8], [B.O + 0.9, 4]], "EASE_OUT");
scaleAbout(Z, [[0, 0.84], [B.zoom, 0.84], [B.tiers, 1]], "EASE_IN_AND_OUT");
for (const b of [bI, bO]) kf(b.big, "OPACITY", [[0, 0], [B.boxes + 0.1, 0], [B.boxes + 0.5, 1], [B.zoom, 1], [B.zoom + 0.6, 0]]);
// the boundary between the boxes: the first projection
const bd = line(Z, "boundary projection", [L(960, CY - BH / 2 - 10), L(960, CY + BH / 2 + 10)], INK, 3, { dash: [12, 10] }); show(bd, B.boxes + 0.6);
const bdT = await txt(Z, "boundary tag", "boundary projection", "Label/Mono Small", INK, 0, 0, 260, 18); bdT.textAlignHorizontal = "CENTER"; [bdT.x, bdT.y] = L(830, CY - BH / 2 - 40); show(bdT, B.boxes + 0.6);
// tiers: label math + a one-line role, the book's wording
const TW = 572, TH = 88;
const tier = async (x, cy, col, a, sym, role) => {
  const g = figma.createFrame(); Z.appendChild(g); g.name = "tier " + role; g.resize(TW, TH); [g.x, g.y] = L(x + (BW - TW) / 2, cy - TH / 2);
  g.cornerRadius = 8; g.fills = solid(col, a); g.strokes = solid(col, 0.9); g.strokeWeight = 2; g.clipsContent = false;
  const m = math(g, "symbol", sym, 34, INK, 22, TH / 2 - 34 * 0.8);
  await txt(g, "role", role, "Body/Default", C.text, 250, TH / 2 - 13, TW - 270, 20);
  return g;
};
const IT = [["E", "Elite extraction beneficiary"], ["P_{uppet}", "legal and political interface"], ["F_{enforce}", "kinetic enforcement tier"], ["I_{buffer}", "status-wage buffer class"]];
const OT = [["O_{racialized}", "primary extraction layer"], ["O_{adjacent, j}", "adjacent and reclassified layers"], ["O^{+}_α ⊍ O^{−}_α", "local ranking inside O"]];
const iT = [], oT = [];
for (let k = 0; k < 4; k++) iT.push(await tier(IX, CY - 162 + k * 108, BLUE, 0.30 - k * 0.05, IT[k][0], IT[k][1]));
for (let k = 0; k < 3; k++) oT.push(await tier(OX, CY - 108 + k * 108, RED, 0.28 - k * 0.07, OT[k][0], OT[k][1]));
// "the five vertical tiers": the four In-group tiers top to bottom, then the Out-group as the fifth
iT.forEach((g, k) => show(g, B.tiers - 0.9 + k * 0.28));
const five = figma.createRectangle(); Z.appendChild(five); five.name = "fifth tier · the Out-group"; five.resize(BW + 16, BH + 16); [five.x, five.y] = L(OX - 8, CY - BH / 2 - 8); five.cornerRadius = 22; five.fills = []; five.strokes = solid(STAT); five.strokeWeight = 4;
windows(five, [[B.tiers + 0.4, B.alpha]]);
const tierRing = figma.createRectangle(); Z.appendChild(tierRing); tierRing.name = "In-group tiers ring"; tierRing.resize(TW + 24, 4 * 108 + 4); [tierRing.x, tierRing.y] = L(IX + (BW - TW) / 2 - 12, CY - 162 - TH / 2 - 14); tierRing.cornerRadius = 14; tierRing.fills = []; tierRing.strokes = solid(STAT); tierRing.strokeWeight = 4;
windows(tierRing, [[B.tiers - 0.2, B.alpha]]);
// "internal alpha-axis subdivisions": the Out-group layers, and a local split inside every In-group tier
oT.forEach((g, k) => show(g, B.alpha - 0.2 + k * 0.25));
iT.forEach((g, k) => { const s = line(g, "local split", [[248 - 18, 10], [248 - 18, TH - 10]], STAT, 2, { dash: [6, 6] }); show(s, B.alpha + 0.4 + k * 0.15);
  const pm = math(g, "local ±α", "X^{+}_α | X^{−}_α", 24, STAT, TW - 160, -8); show(pm, B.alpha + 0.5 + k * 0.15); });
const rec = figma.createVector(); Z.appendChild(rec); rec.name = "recursive arrow";
rec.vectorNetwork = { vertices: [{ x: 0, y: 0 }, { x: 260, y: 0, strokeCap: "ARROW_EQUILATERAL" }], segments: [{ start: 0, end: 1, tangentStart: { x: 90, y: 44 }, tangentEnd: { x: -90, y: 44 } }], regions: [] };
[rec.x, rec.y] = L(830, CY + BH / 2 + 22); rec.strokes = solid(STAT); rec.strokeWeight = 4; draw(rec, B.alpha + 0.3, B.alpha + 1.1);
const recT = await txt(Z, "recursive tag", "recursive partitions inside every tier", "Label/Mono Small", STAT, 0, 0, 560, 18); recT.textAlignHorizontal = "CENTER"; [recT.x, recT.y] = L(680, CY + BH / 2 + 70); show(recT, B.alpha + 0.8);
// "sharp focus": the set equations the figure draws, under the headline
const eqs = math(F, "U = I ⊍ O", "U = I ⊍ O", 40, INK, IX + 20, CY + BH / 2 + 8); show(eqs, B.focus - 0.2);
const eqx = math(F, "X = X+ ⊍ X−", "X = X^{+}_α ⊍ X^{−}_α", 40, STAT, OX + BW - 300, CY + BH / 2 + 8); show(eqx, B.focus + 0.2);
for (const g of [...iT, ...oT]) kf(g, "STROKE_WEIGHT", [[0, 2], [B.focus, 2], [B.focus + 0.3, 4], [B.focus + 1.1, 2]], "EASE_OUT");
finish(head, B.end);
return { id: F.id, rig: Z.id, nodes: F.findAll(() => true).length, head: [head.y, head.height] };
