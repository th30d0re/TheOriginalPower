// G30 · complex-wage warm-up, turns 341–342: two wage channels → a pair → the real line → the
// imaginary line → one point → the phasor. Beats are seconds from the start of turn 341
// (de291b853c123795); turn 342 (1a8b00ba21498d95) starts at +10.74. Axis convention is the episode's:
// ψ_m positive points down (extraction points up), ψ_s points right, Quadrant II is upper-right.
const B = { two: 0.16, pair: 1.04, pairSay: 1.54, material: 3.38, real: 4.88, status: 6.12, imag: 7.16, producing: 8.22, complex: 9.14,
  ee: 10.74, phasor: 14.36, path: 16.56, plot: 18.8, end: 20.6 };
const { F, head } = await frame("g-complex wage warm-up", "Building the Complex Wage", 2);
await captions(F, [[0.5, "TWO WAGE CHANNELS FORM ONE PAIR"], [B.material, "THE REAL LINE · MATERIAL WAGE · POSITIVE POINTS DOWN"],
  [B.status, "THE IMAGINARY LINE · STATUS WAGE · POSITIVE POINTS RIGHT"], [B.producing, "ONE POINT · ONE PAIR · ONE COMPLEX NUMBER"],
  [B.ee, "THE SAME NUMBER DRAWN AS AN ARROW · A PHASOR"]]);
await source(F, "The Original Power, Ch. 3, Eq. 3.5 · Du Bois (1935)");
const OX = 640, OY = 510, U = 80;

// ── right column: the two channels, the pair, Equation 3.5, the phasor ──
const P1 = await panel(F, "panel channels", 1180, 300, 550, 196, "DU BOIS · TWO WAGE CHANNELS"); show(P1, B.two);
const chip = async (y, label, col, name) => { const c = figma.createFrame(); P1.appendChild(c); c.name = name; c.x = 20; c.y = y; c.resize(240, 44); c.cornerRadius = 22; c.fills = solid(col, 0.14); c.strokes = solid(col); c.strokeWeight = 2;
  const t = await txt(c, "label", label, "Label/Mono Small", col, 0, 11, 240, 20); t.textAlignHorizontal = "CENTER"; return c; };
const cM = await chip(48, "material wage", MAT, "chip material"), cS = await chip(104, "status wage", STAT, "chip status");
show(cM, B.two); show(cS, B.two + 0.3);
// "form a pair": the chips slide right and the bracketed pair appears beside them
for (const c of [cM, cS]) kf(c, "TRANSLATION_X", [[0, 0], [B.pair, 0], [B.pair + 0.6, -6]], "EASE_OUT");
const pr = svg(P1, "pair", "g.pair", 46, INK); pr.x = 300; pr.y = 74; show(pr, B.pairSay);
const brace = line(P1, "bracket", [[272, 54], [284, 54], [284, 142], [272, 142]], DIMC, 3); show(brace, B.pair + 0.3);
const P2 = await panel(F, "panel eq 3.5", 1180, 512, 550, 120, "EQUATION 3.5 · ONE COMPLEX NUMBER"); show(P2, B.producing);
const eqv = svg(P2, "eq", "w35.eq", 48, INK); eqv.x = 20; eqv.y = 48; show(eqv, B.complex);
const P3 = await panel(F, "panel phasor", 1180, 648, 550, 120, "ELECTRICAL ENGINEERING · THE PHASOR"); show(P3, B.ee);
const p3 = await txt(P3, "line", "One arrow from the origin carries both parts: its length and its angle.", "Body/Default", C.text, 20, 44, 510, 22); show(p3, B.phasor);

// ── the real line: vertical, positive down (material delivered), negative up (extraction) ──
const real = line(F, "real line", [[OX, OY - 2.4 * U], [OX, OY + 3.4 * U]], INK, 3, { arrow: true }); draw(real, B.material, B.material + 0.9);
const ticks = figma.createFrame(); F.appendChild(ticks); ticks.name = "real ticks"; ticks.fills = []; ticks.clipsContent = false; ticks.resize(1920, 1080); show(ticks, B.material + 0.5);
for (let k = -2; k <= 3; k++) { line(ticks, "tick " + k, [[OX - 10, OY + k * U], [OX + 10, OY + k * U]], k < 0 ? RED : INK, 3);
  const n = await txt(ticks, "num " + k, k < 0 ? "−" + -k : String(k), "Label/Mono Small", k < 0 ? RED : k === 0 ? INK : MAT, OX - 64, OY + k * U - 13, 44, 22); n.textAlignHorizontal = "RIGHT"; }
const psim = svg(F, "psi_m label", "w35.psim", 40, MAT); psim.x = OX + 16; psim.y = OY + 3.4 * U - 10; show(psim, B.material + 0.6);
const realT = await txt(F, "real tag", "the real line · material value delivered down", "Label/Mono Small", MAT, OX + 16 + psim.width + 10, OY + 3.4 * U, 500, 18); show(realT, B.material + 0.6);
const extA = line(F, "extraction up", [[OX - 100, OY - 0.6 * U], [OX - 100, OY - 2.2 * U]], RED, 4, { arrow: true });
const extT = await txt(F, "extraction tag", "extraction\n→ Elite", "Label/Mono Small", RED, OX - 300, OY - 2.2 * U, 184, 18); extT.textAlignHorizontal = "RIGHT";
show(extA, B.material + 1.0); show(extT, B.material + 1.0);
// a real number is one position on that line
const dM = figma.createEllipse(); F.appendChild(dM); dM.name = "dot material"; dM.resize(24, 24); dM.x = OX - 12; dM.y = OY - 12; dM.fills = solid(MAT); dM.strokes = bp(C.field); dM.strokeWeight = 3;
show(dM, B.real - 0.4); kf(dM, "TRANSLATION_Y", [[0, 0], [B.real, 0], [B.real + 0.9, 2 * U]], "EASE_IN_AND_OUT");
const dMT = await txt(F, "dot material tag", "2 on the real line", "Label/Mono Small", MAT, OX - 250, OY + 2 * U - 12, 190, 18); dMT.textAlignHorizontal = "RIGHT"; show(dMT, B.real + 0.9, B.producing);

// ── the imaginary line: horizontal, the j direction, status to the right ──
const imag = line(F, "imaginary line", [[OX - 1.2 * U, OY], [OX + 4.2 * U, OY]], INK, 3, { arrow: true }); draw(imag, B.status, B.status + 0.9);
const iticks = figma.createFrame(); F.appendChild(iticks); iticks.name = "imaginary ticks"; iticks.fills = []; iticks.clipsContent = false; iticks.resize(1920, 1080); show(iticks, B.status + 0.5);
for (let k = 1; k <= 4; k++) { line(iticks, "tick j" + k, [[OX + k * U, OY - 10], [OX + k * U, OY + 10]], INK, 3);
  const n = await txt(iticks, "num j" + k, (k === 1 ? "" : k) + "j", "Label/Mono Small", STAT, OX + k * U - 30, OY - 44, 60, 22); n.textAlignHorizontal = "CENTER"; }
const psis = svg(F, "psi_s label", "w35.psis", 40, STAT); psis.x = OX + 4.2 * U + 14; psis.y = OY - 20; show(psis, B.status + 0.6);
const imagT = await txt(F, "imaginary tag", "the imaginary line\n× j · status →", "Label/Mono Small", STAT, OX + 3 * U, OY + 26, 230, 18); show(imagT, B.status + 0.6);
const dS = figma.createEllipse(); F.appendChild(dS); dS.name = "dot status"; dS.resize(24, 24); dS.x = OX - 12; dS.y = OY - 12; dS.fills = solid(STAT); dS.strokes = bp(C.field); dS.strokeWeight = 3;
show(dS, B.imag - 0.4); kf(dS, "TRANSLATION_X", [[0, 0], [B.imag, 0], [B.imag + 0.9, 2.5 * U]], "EASE_IN_AND_OUT");

// ── one point, one pair: the projections meet at W ──
const PX = OX + 2.5 * U, PY = OY + 2 * U;
const prH = line(F, "projection from material", [[OX, PY], [PX, PY]], DIMC, 2, { dash: [10, 8] });
const prV = line(F, "projection from status", [[PX, OY], [PX, PY]], DIMC, 2, { dash: [10, 8] });
show(prH, B.producing); show(prV, B.producing + 0.2);
const P = figma.createEllipse(); F.appendChild(P); P.name = "point W"; P.resize(30, 30); P.x = PX - 15; P.y = PY - 15; P.fills = solid(INK); P.strokes = solid(STAT); P.strokeWeight = 4; await P.setEffectStyleIdAsync(ES["Glow/Accent"]);
show(P, B.producing + 0.5);
const Wl = svg(F, "W label", "w35.W", 40, STAT); Wl.x = PX + 22; Wl.y = PY + 4; show(Wl, B.complex);
const prL = svg(F, "pair at W", "g.pair", 34, INK); prL.x = PX + 22 + Wl.width + 14; prL.y = PY + 8; show(prL, B.complex + 0.3);
// ── the phasor: the same number as an arrow from the origin ──
const W = line(F, "phasor W", [[OX, OY], [PX - 10, PY - 8]], STAT, 6, { arrow: true }); draw(W, B.phasor - 0.2, B.phasor + 0.8);
const ph = await txt(F, "phasor tag", "phasor", "Label/Mono Small", STAT, OX + 18, OY + 1.2 * U, 160, 20); show(ph, B.phasor + 0.6);
// "the path from Du Bois's two-part wage": the chips and their dots pulse together
for (const n of [dM, dS]) n.applyManualKeyframeTrack({ type: "PROPERTY", name: "SCALE_XY" }, { keyframes: [[0, 1], [B.path, 1], [B.path + 0.35, 1.5], [B.path + 1.0, 1]].map(([t, v]) => ({ timelinePosition: t, value: { type: "VECTOR", value: { x: v, y: v } }, easing: { type: "EASE_OUT" } })) });
const glow = figma.createRectangle(); P1.appendChild(glow); glow.name = "highlight channels"; glow.resize(530, 120); glow.x = 10; glow.y = 40; glow.cornerRadius = 14; glow.fills = []; glow.strokes = solid(STAT); glow.strokeWeight = 3;
windows(glow, [[B.path, B.path + 1.8]]);
// "the plot you are about to see": a faint preview of Quadrant II, upper-right
const q2 = figma.createRectangle(); F.appendChild(q2); q2.name = "quadrant II preview"; q2.resize(3 * U, 2.2 * U); q2.x = OX + 4; q2.y = OY - 2.2 * U - 4; q2.fills = solid(RED, 0.10); q2.strokes = solid(RED, 0.5); q2.strokeWeight = 1;
const q2T = await txt(F, "quadrant II tag", "Quadrant II", "Label/Mono Small", RED, OX + 20, OY - 2.2 * U + 10, 200, 18);
show(q2, B.plot); show(q2T, B.plot + 0.2);
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length };
