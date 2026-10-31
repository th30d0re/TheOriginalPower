// RLC tail · OV turns 615 (bfdc46d6110f5831) and 616 (713ab93e1d7c25db, from +58.05): Equation 2.11,
// the series circuit of Figure 2.5, the meaning of each element, then Equation 2.12 with its decay
// envelope. Run as g_head.js + this file. Circuit and scope geometry match g-eq2.11 (g_rlc.js); the
// response is Equation 2.12 evaluated at L = 1, R = 0.4, C = 1 (illustrative, as in g_rlc.js).
const T2 = 58.05;
const B = { series: 2.84, backlash: 8.6, eq: 11.6, L: 20.76, R: 24.62, C: 27.33, V: 29.1, q: 30.0, positive: 34.98, drive: 40.16, impulse: 43.68,
  fig: 47.88, three: 50.88, supply: 53.6, eR: T2 + 0.1, eL: T2 + 9.57, eC: T2 + 17.26, eq212: T2 + 24.7, decays: T2 + 30.34, end: 94.35 };
const { F, head } = await frame("g-rlc tail 615", "Equation 2.11 · The Series RLC Circuit", 6);
await captions(F, [[0.5, "THE HARDWARE LAYER · A SERIES RLC CIRCUIT"], [B.backlash, "INTENSITY AND RECURRENCE OF BACKLASH AFTER MAJOR REFORMS"], [B.eq, "EQUATION 2.11 · THE CIRCUIT'S RESPONSE TO A REFORM SHOCK"],
  [B.q, "q(t) · EQUALITY-SURPLUS CHARGE · POSITIVE MEANS REFORM DISPLACEMENT"], [B.drive, "V(t) · THE REFORM-SHOCK DRIVING VOLTAGE · A LEGISLATIVE VICTORY OR MASS UPRISING"],
  [B.fig, "FIGURE 2.5 · THREE PASSIVE ELEMENTS IN SERIES WITH THE KINETIC SUPPLY"], [B.eR, "THE RESISTOR R · BUREAUCRATIC AND CARCERAL FRICTION · DISSIPATES REFORM ENERGY"],
  [B.eL, "THE INDUCTOR L · CULTURAL INERTIA AND INSTITUTIONAL ENTRENCHMENT · RESISTS SUDDEN CHANGE"], [B.eC, "THE CAPACITOR C · TOKEN-REFORM ABSORPTION CAPACITY · STORES REFORM CHARGE"],
  [B.eq212, "EQUATION 2.12 · THE UNDERDAMPED SOLUTION · AN OSCILLATION WHOSE AMPLITUDE DECAYS TO BASELINE"]]);
await source(F, "The Original Power, Ch. 2, Eq. 2.11, Eq. 2.12, Figure 2.5 · response at L = 1, R = 0.4, C = 1 (illustrative)");
const COL = { L: MAT, R: RED, C: INK };
// ── circuit, as in g-eq2.11 ──
const cir = stage(F, "circuit");
const XL = 230, XR = 770, YT = 386, YB = 626, SY = 506, SR = 36;
const wires = [[[XL, SY - SR], [XL, YT], [305, YT]], [[415, YT], [460, YT]], [[580, YT], [672, YT]], [[688, YT], [XR, YT], [XR, YB], [XL, YB], [XL, SY + SR]]];
wires.forEach((w, i) => draw(line(cir, "wire " + i, w, INK, 3), B.series - 0.2, B.series + 1.2));
const zz = [[305, YT]]; for (let i = 0; i < 6; i++) zz.push([313 + i * 17.5, YT + (i % 2 ? 16 : -16)]); zz.push([415, YT]);
const part = { R: [line(cir, "resistor", zz, RED, 4)] };
const coil = figma.createVector(); cir.appendChild(coil); coil.name = "inductor";
coil.vectorPaths = [{ windingRule: "NONZERO", data: "M 0 40 " + [0, 1, 2, 3].map(i => `C ${i * 30} 0 ${i * 30 + 30} 0 ${i * 30 + 30} 40`).join(" ") }];
coil.x = 460; coil.y = YT - 30; coil.strokes = solid(MAT); coil.strokeWeight = 4; coil.strokeCap = "ROUND"; part.L = [coil];
part.C = [line(cir, "capacitor plate 1", [[672, YT - 32], [672, YT + 32]], INK, 5), line(cir, "capacitor plate 2", [[688, YT - 32], [688, YT + 32]], INK, 5)];
const src = figma.createEllipse(); cir.appendChild(src); src.name = "source"; src.resize(2 * SR, 2 * SR); src.x = XL - SR; src.y = SY - SR; src.fills = bp(C.field); src.strokes = solid(STAT); src.strokeWeight = 4;
const sq = figma.createVector(); cir.appendChild(sq); sq.name = "source wave"; sq.vectorPaths = [{ windingRule: "NONZERO", data: "M 0 10 C 8 -6 14 -6 20 10 C 26 26 32 26 40 10" }]; sq.x = XL - 20; sq.y = SY - 9; sq.strokes = solid(STAT); sq.strokeWeight = 3;
part.V = [src, sq];
const vl = svg(cir, "label V(t)", "g.V", 40, STAT); vl.x = XL + SR + 14; vl.y = SY - 20;
const vT = await txt(cir, "tag V", "kinetic supply", "Label/Mono Small", STAT, XL + SR + 14, SY + 24, 200, 18);
const CX = { R: 360, L: 520, C: 680 }, NAME = { R: "bureaucratic and carceral friction", L: "cultural inertia · institutional entrenchment", C: "token-reform absorption capacity" };
const lab = {}, tag = {}, ring = {};
for (const k of ["R", "L", "C"]) {
  lab[k] = svg(cir, "label " + k, "g." + k, 44, COL[k]); lab[k].x = CX[k] - lab[k].width / 2; lab[k].y = YT - 104;
  // one wide role tag at a time, inside the loop, while turn 616 names that element
  tag[k] = await txt(cir, "tag " + k, k + " · " + NAME[k], "Label/Mono Small", COL[k] === INK ? STAT : COL[k], 350, 470, 410, 16); tag[k].textAlignHorizontal = "CENTER";
  ring[k] = figma.createRectangle(); cir.appendChild(ring[k]); ring[k].name = "highlight " + k; ring[k].resize(150, 190); ring[k].x = CX[k] - 75; ring[k].y = YT - 116; ring[k].cornerRadius = 14; ring[k].fills = solid(STAT, 0.08); ring[k].strokes = solid(STAT); ring[k].strokeWeight = 3;
}
for (const k of ["R", "L", "C", "V"]) for (const n of part[k]) show(n, B.series + { V: 0, R: 0.15, L: 0.3, C: 0.45 }[k]);
for (const k of ["R", "L", "C"]) show(lab[k], B.series + 0.4);
show(vl, B.series);
kf(vT, "OPACITY", [[0, 0], [B.supply, 0], [B.supply + 0.4, 1]]);
const tagOn = { R: [B.eR + 0.5, B.eL - 0.4], L: [B.eL + 0.8, B.eC - 0.4], C: [B.eC + 0.6, B.eq212 - 0.3] };
for (const k of ["R", "L", "C"]) show(tag[k], ...tagOn[k]);
const RW = { R: [[B.three, B.three + 0.7], [B.eR, B.eL - 0.4]], L: [[B.three + 0.6, B.three + 1.3], [B.eL, B.eC - 0.4]], C: [[B.three + 1.2, B.three + 1.9], [B.eC, B.eq212 - 0.4]] };
for (const k of ["R", "L", "C"]) windows(ring[k], RW[k]);
const figRing = figma.createRectangle(); cir.appendChild(figRing); figRing.name = "Figure 2.5 ring"; figRing.resize(XR - XL + 120, YB - YT + 180); figRing.x = XL - 70; figRing.y = YT - 128; figRing.cornerRadius = 18; figRing.fills = []; figRing.strokes = solid(STAT); figRing.strokeWeight = 3;
windows(figRing, [[B.fig, B.three - 0.1]]);
const srcGlow = (t0, t1) => [[t0, 4], [t0 + 0.3, 9], [t1, 9], [t1 + 0.3, 4]];
kf(src, "STROKE_WEIGHT", [[0, 4], ...srcGlow(B.drive, B.impulse + 2.4), ...srcGlow(B.supply, B.supply + 2.2)], "EASE_OUT");

// ── Equation 2.11 with term rings; Equation 2.12 below it ──
const eq = svg(F, "Equation 2.11", "g.eq211", 78, INK); eq.x = 250; eq.y = 664; show(eq, B.eq);
const leaves = eq.findAll(n => n.type === "VECTOR" || n.type === "RECTANGLE");
const termBox = idx => { const bb = idx.map(i => leaves[i].absoluteBoundingBox), fb = F.absoluteBoundingBox; const x0 = Math.min(...bb.map(b => b.x)), x1 = Math.max(...bb.map(b => b.x + b.width)), y0 = Math.min(...bb.map(b => b.y)), y1 = Math.max(...bb.map(b => b.y + b.height)); return [x0 - fb.x - 8, y0 - fb.y - 8, x1 - x0 + 16, y1 - y0 + 16]; };
const TERM = { L: [0, 1, 2], R: [4, 5, 6], C: [8, 9, 10, 11], V: leaves.map((_, i) => i).slice(-4) };
const EW = { L: [[B.L, B.R - 0.2]], R: [[B.R, B.C - 0.2]], C: [[B.C, B.V - 0.1]], V: [[B.V, B.q - 0.1], [B.drive, B.impulse]] };
for (const k of ["L", "R", "C", "V"]) { const [x, y, w, h] = termBox(TERM[k]); const r = figma.createRectangle(); F.appendChild(r); r.name = "eq term " + k; r.resize(w, h); r.x = x; r.y = y; r.cornerRadius = 8; r.fills = []; r.strokes = solid(k === "V" ? STAT : (COL[k] === INK ? STAT : COL[k])); r.strokeWeight = 3; windows(r, EW[k]); }
const e212 = math(F, "Equation 2.12", "q(t) = Q_0 e^{−αt} [cos(ω_d t) + (α/ω_d) sin(ω_d t)]", 44, STAT, 190, 776); show(e212, B.eq212 + 1.6);
const e212T = await txt(F, "eq 2.12 tag", "EQUATION 2.12 · UNDERDAMPED", "Label/Mono Small", C.textDim, 190, 760, 400, 16); show(e212T, B.eq212 + 1.6);

// ── scope: Equation 2.12 at α = 0.2, ω_d = 0.98 ──
const PL = { x: 860, y: 330, w: 860, h: 420 }, TE = 30, a = 0.2, wd = Math.sqrt(1 - a * a);
const y0 = PL.y + PL.h / 2, TX = t => PL.x + t / TE * PL.w, QY = q => y0 - q * PL.h / 2;
const qf = t => Math.exp(-a * t) * (Math.cos(wd * t) + a / wd * Math.sin(wd * t));
const pts = f => Array.from({ length: 151 }, (_, i) => { const t = i * TE / 150; return [TX(t), QY(f(t))]; });
const sc = stage(F, "scope");
const eqz = figma.createRectangle(); sc.appendChild(eqz); eqz.name = "equality zone"; eqz.resize(PL.w, PL.h / 2); eqz.x = PL.x; eqz.y = PL.y; eqz.fills = solid(MAT, 0.08);
const exz = figma.createRectangle(); sc.appendChild(exz); exz.name = "extraction zone"; exz.resize(PL.w, PL.h / 2); exz.x = PL.x; exz.y = y0; exz.fills = solid(RED, 0.07);
const yAx = line(sc, "q axis", [[PL.x, PL.y + PL.h + 10], [PL.x, PL.y - 24]], INK, 3, { arrow: true });
const tAx = line(sc, "t axis", [[PL.x, y0], [PL.x + PL.w + 12, y0]], INK, 3, { arrow: true });
const ql = svg(sc, "label q(t)", "g.q", 40, INK); ql.x = PL.x + 16; ql.y = PL.y - 52;
const tl = svg(sc, "label t", "g.t", 34, INK); tl.x = PL.x + PL.w - 10; tl.y = y0 + 14;
const bT = await txt(sc, "tag baseline", "q = 0 · extraction baseline", "Label/Mono Small", INK, PL.x + PL.w - 330, y0 - 30, 330, 18); bT.textAlignHorizontal = "RIGHT";
for (const n of [exz, yAx, tAx, ql, tl, bT]) show(n, B.backlash);
const zT = await txt(sc, "tag equality", "q > 0 · reform displacement away from the baseline", "Label/Mono Small", MAT, PL.x + 16, PL.y + 10, 560, 18);
show(eqz, B.positive); show(zT, B.positive + 0.3);
kf(ql, "OPACITY", [[0, 0], [B.backlash, 0], [B.backlash + 0.4, 1]]);
const qRing = ringAround(F, ql, STAT, 8, "ring q(t)"); windows(qRing, [[B.q, B.positive]]);
const shock = line(sc, "shock arrow", [[PL.x + 8, y0], [PL.x + 8, QY(1) + 4]], STAT, 5, { arrow: true }); draw(shock, B.impulse - 0.2, B.impulse + 0.4);
const resp = curve(sc, "response · Eq 2.12", pts(qf), STAT, 4);
kf(resp, "PATH_TRIM_END", [[0, 0.001], [B.impulse + 0.3, 0.001], [B.impulse + 3.2, 1]], "EASE_IN_AND_OUT"); kf(resp, "OPACITY", [[0, 0], [B.impulse + 0.3, 0], [B.impulse + 0.35, 1]]);
const envP = curve(sc, "envelope +", pts(t => Math.exp(-a * t)), RED, 3, [10, 8]), envN = curve(sc, "envelope −", pts(t => -Math.exp(-a * t)), RED, 3, [10, 8]);
show(envP, B.decays + 0.8); show(envN, B.decays + 1.0);
const envL = math(sc, "envelope label", "± Q_0 e^{−αt}", 34, RED, TX(6.5), QY(Math.exp(-a * 6.5)) - 62); show(envL, B.decays + 1.4);
kf(resp, "STROKE_WEIGHT", [[0, 4], [B.decays, 4], [B.decays + 0.3, 7], [B.decays + 2.6, 4]], "EASE_OUT");
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length, leaves: leaves.length, e212w: e212.width };
