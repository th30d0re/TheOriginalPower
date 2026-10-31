// The Bayesian defense (tex 2130-2133), OV turns 613 (e875559eff0b3eeb) and 614 (b4001513cacd6e39,
// from +60.05). Run as g_head.js + this file. Beats are seconds from the start of turn 613.
// Visualization: Gaussian likelihood (the evidence X) and prior (the installed racial prior), posterior
// from their product. Sweeping the prior's precision moves the posterior off the evidence toward the
// prior. The Gaussian shapes and the numbers are illustrative; the book states the proportionality only.
// The book numbers it Equation 2.8a (label eq:1.5b-bayesian-prior).
const T2 = 60.05;
const B = { arch: 0.12, defense: 7.96, eq: 11.34, evidence: 16.74, prior: 19.42, post: 21.68, prop: 26.1, lik: 29.72, pri: 31.72,
  excess: 34.68, malicious: 39.82, reinforce: 44.98, input: 50.3, plain: 51.64, outweigh: 57.08,
  proxies: T2 + 1.24, override: T2 + 5.14, filters: T2 + 6.7, empathy: T2 + 11.7, coding: T2 + 16.66, end: 83.4 };
const { F, head } = await frame("g-eq bayesian prior", "The Bayesian Defense · The Installed Prior", 5);
await captions(F, [[B.arch, "THE ELITE'S EPISTEMIC ARCHITECTURE · A BAYESIAN DEFENSE OF THE RACIAL PARTITION"], [B.eq, "EQUATION 2.8a · EVIDENCE COMBINES WITH THE INSTALLED RACIAL PRIOR"],
  [B.excess, "RAISE THE PRIOR'S PRECISION · THE READING MOVES OFF THE EVIDENCE TOWARD THE PRIOR"], [B.malicious, "THE MALICIOUS INPUT · EXCESSIVE PRECISION FROM REPEATED INSTITUTIONAL REINFORCEMENT"],
  [B.plain, "A HEAVILY REINFORCED EXPECTATION OUTWEIGHS THE EVIDENCE IN FRONT OF THE OBSERVER"], [T2, "PROXIES FEED THE PRIOR · PHENOTYPE, NAME, NEIGHBORHOOD, PROXY STATUS"],
  [B.filters, "THE PRIOR FILES OUT-GROUP HARM AS NATURAL OR IRRELEVANT"], [B.empathy, "SELECTIVE EMPATHY · THE CHAPTER'S NEUROBIOLOGICAL ACCOUNT"],
  [B.coding, "PREDICTIVE CODING FILTERS OUT-GROUP HARM ONCE THE PRIOR HAS CATEGORIZED IT"]]);
await source(F, "The Original Power, Ch. 2, The Bayesian Defense · Friston (2010), Clark (2013) · Gaussian shapes illustrative");

// ── the equation, one piece per factor ──
const EY = 280, ES_ = 52;
const post = math(F, "posterior", "P_i(T ∣ X, Π_{race})", ES_, STAT, 190, EY);
const prop = math(F, "proportional", "∝", ES_, INK, post.x + post.width + 26, EY);
const lik = math(F, "likelihood", "P(X ∣ T)", ES_, MAT, prop.x + prop.width + 26, EY);
const pri = math(F, "prior", "P_i(T ∣ Π_{race})", ES_, RED, lik.x + lik.width + 110, EY);
const pieceTag = async (n, s, col) => { const t = await txt(F, "tag " + n.name, s, "Label/Mono Small", col, n.x, EY + 92, Math.max(300, n.width), 18); return t; };
const tags = [await pieceTag(post, "posterior · the reading of T", STAT), await pieceTag(lik, "likelihood · the evidence", MAT), await pieceTag(pri, "the installed racial prior", RED)];
[post, prop, lik, pri].forEach((n, k) => show(n, B.eq + 0.2 + k * 0.25)); tags.forEach((t, k) => show(t, B.eq + 1.2 + k * 0.25));
const eqNo = await txt(F, "eq number", "EQUATION 2.8a · CH. 2", "Label/Mono Small", C.textDim, 1400, EY + 30, 330, 20); eqNo.textAlignHorizontal = "RIGHT"; show(eqNo, B.eq + 0.2);
const ring = { post: ringAround(F, post, STAT, 4), prop: ringAround(F, prop, INK, 4), lik: ringAround(F, lik, MAT, 4), pri: ringAround(F, pri, RED, 4) };
windows(ring.post, [[B.post, B.prop - 0.2], [B.outweigh, B.end - 26]]); windows(ring.prop, [[B.prop, B.lik - 0.3]]);
windows(ring.lik, [[B.lik, B.pri - 0.1], [B.input, B.plain + 1.5]]); windows(ring.pri, [[B.pri, B.excess + 3.4], [B.malicious + 2.5, B.reinforce + 2.2]]);

// ── the plot: T runs from what the evidence shows (left) to what the prior expects (right) ──
const PX = 190, PY = 460, PW = 940, PH = 360, MU_X = -1.2, SX = 0.7, MU_P = 1.4;
const X = t => PX + (t + 3) / 6.5 * PW, Y = v => PY + PH - 0.9 * PH * v;
const g = (mu, s) => Array.from({ length: 131 }, (_, i) => { const t = -3 + i * 0.05; return [X(t), Y(Math.exp(-((t - mu) ** 2) / (2 * s * s)))]; });
const S = stage(F, "plot");
const ax = line(S, "T axis", [[PX - 10, PY + PH], [PX + PW + 16, PY + PH]], INK, 3, { arrow: true }); show(ax, B.defense);
const tl = math(S, "T label", "T", 36, INK, PX + PW - 10, PY + PH + 6); show(tl, B.defense);
const axT = await txt(S, "axis tag", "interpretation of the input X · each curve scaled to its own peak", "Label/Mono Small", DIMC, PX, PY + PH + 52, 760, 18); show(axT, B.defense);
const lk = curve(S, "likelihood curve", g(MU_X, SX), MAT, 5); draw(lk, B.evidence, B.evidence + 1.2);
const xm = line(S, "evidence mark", [[X(MU_X), PY + PH], [X(MU_X), PY - 4]], MAT, 2, { dash: [8, 8] }); show(xm, B.evidence + 0.8);
const xT = await txt(S, "evidence tag", "what X shows", "Label/Mono Small", MAT, X(MU_X) + 10, PY + PH - 84, 280, 18); show(xT, B.evidence + 0.8, B.filters);
const xT2 = await txt(S, "evidence tag · harm", "harm, as X shows it", "Label/Mono Small", MAT, X(MU_X) + 10, PY + PH - 84, 340, 18); show(xT2, B.filters + 0.3);
const pm = line(S, "prior mark", [[X(MU_P), PY + PH], [X(MU_P), PY - 4]], RED, 2, { dash: [8, 8] }); show(pm, B.prior + 0.8);
const pT = await txt(S, "prior tag", "what the prior expects", "Label/Mono Small", RED, X(MU_P) + 104, PY + PH - 84, 320, 18); show(pT, B.prior + 0.8, B.filters);
const pT2 = await txt(S, "prior tag · natural", "natural or irrelevant", "Label/Mono Small", RED, X(MU_P) + 104, PY + PH - 84, 320, 18); show(pT2, B.filters + 0.3);
const xl = math(S, "X at evidence", "X", 30, MAT, X(MU_X) + 8, PY + PH - 46); show(xl, B.evidence + 0.8);
const pl = math(S, "Π at prior", "Π_{race}", 30, RED, X(MU_P) + 104, PY + PH - 46); show(pl, B.prior + 0.8);

// precision states: r = prior precision ÷ evidence precision; each state is its own prior and posterior curve
const RS = [0.25, 0.5, 1, 2, 4, 8, 16];
const ON = [B.prior, B.excess + 0.6, B.excess + 1.3, B.excess + 2.0, B.excess + 2.9, B.reinforce + 0.5, B.reinforce + 1.2];
const pmu = r => (MU_X + r * MU_P) / (1 + r);
const P = await panel(F, "panel precision", 1210, 430, 520, 256, "PRIOR PRECISION · r × THE EVIDENCE'S"); show(P, B.prior);
const TX0 = 1240, TW = 460, TY = 476, rx = r => TX0 + TW * Math.log(r / 0.25) / Math.log(64);
line(F, "slider track", [[TX0, TY], [TX0 + TW, TY]], DIMC, 3); const knob = figma.createEllipse(); F.appendChild(knob); knob.name = "slider knob"; knob.resize(26, 26); knob.x = rx(0.25) - 13; knob.y = TY - 13; knob.fills = solid(RED); knob.strokes = bp(C.field); knob.strokeWeight = 3;
const trk = F.findOne(n => n.name === "slider track"); show(trk, B.prior); show(knob, B.prior);
const ends = [await txt(F, "slider low", "weak prior", "Label/Mono Small", DIMC, TX0, TY + 18, 200, 16), await txt(F, "slider high", "excessive precision", "Label/Mono Small", RED, TX0 + TW - 240, TY + 18, 240, 16)];
ends[1].textAlignHorizontal = "RIGHT"; ends.forEach(e => show(e, B.prior));
const kpts = [];
const pmark = line(S, "posterior mark", [[0, PY + PH + 14], [0, PY - 4]], STAT, 3); pmark.x = X(pmu(RS[0])) - 1.5; show(pmark, B.post + 0.6);
for (let i = 0; i < RS.length; i++) {
  const r = RS[i], on = ON[i], off = ON[i + 1] || B.end + 1, last = i === RS.length - 1;
  const fade = (n, a0) => op(n, [[on - 0.01, 0], [on + 0.25, a0], ...(last ? [] : [[off, a0], [off + 0.25, 0]])]);
  const pc = curve(S, `prior curve · r ${r}`, g(MU_P, SX / Math.sqrt(r)), RED, 5); fade(pc, 1);
  if (i === 0) kf(pc, "PATH_TRIM_END", [[0, 0.001], [B.prior, 0.001], [B.prior + 1.2, 1]], "EASE_IN_AND_OUT");
  const qc = curve(S, `posterior curve · r ${r}`, g(pmu(r), SX / Math.sqrt(1 + r)), STAT, 6);
  op(qc, [[Math.max(on, B.post) - 0.01, 0], [Math.max(on, B.post) + 0.3, 1], ...(last ? [] : [[off, 1], [off + 0.25, 0]])]);
  if (i === 0) kf(qc, "PATH_TRIM_END", [[0, 0.001], [B.post, 0.001], [B.post + 1.4, 1]], "EASE_IN_AND_OUT");
  const w = r / (1 + r);
  const rd = await txt(P, `readout r ${r}`, `r = ${r} · weight on the prior ${Math.round(100 * w)}%\nthe reading sits ${Math.round(100 * w)}% of the way\nfrom X toward the prior`, "Body/Default", C.text, 30, 132, 460, 22);
  op(rd, [[on - 0.01, 0], [on + 0.25, 1], ...(last ? [] : [[off, 1], [off + 0.25, 0]])]);
  kpts.push([on + 0.25, rx(r) - rx(0.25)]);
}
kf(knob, "TRANSLATION_X", [[0, 0], ...kpts], "EASE_IN_AND_OUT");
kf(pmark, "TRANSLATION_X", [[0, 0], ...RS.map((r, i) => [ON[i] + 0.25, X(pmu(r)) - X(pmu(RS[0]))])], "EASE_IN_AND_OUT");
const pmT = await txt(S, "posterior tag", "the reading", "Label/Mono Small", STAT, 0, PY + PH + 18, 160, 18); pmT.x = X(pmu(RS[0])) - 80; pmT.textAlignHorizontal = "CENTER"; show(pmT, B.post + 0.8);
kf(pmT, "TRANSLATION_X", [[0, 0], ...RS.map((r, i) => [ON[i] + 0.25, X(pmu(r)) - X(pmu(RS[0]))])], "EASE_IN_AND_OUT");
const badge = await panel(F, "derived badge", 1210, 698, 520, 64); badge.strokes = solid(STAT); await txt(badge, "derived", "ILLUSTRATIVE · GAUSSIAN SHAPES ASSUMED · THE BOOK STATES THE PROPORTIONALITY", "Label/Mono Small", STAT, 18, 12, 484, 18); show(badge, B.excess);

// "repeated institutional reinforcement": each repetition pushes the precision knob
const RF = ["statute", "ruling", "policy", "media"];
for (let k = 0; k < RF.length; k++) { const c = await panel(P, "reinforcement · " + RF[k], 30 + k * 118, 92, 108, 34); c.cornerRadius = 17; c.strokes = solid(RED); c.fills = solid(RED, 0.12);
  const t = await txt(c, "label", RF[k], "Label/Mono Small", RED, 0, 8, 108, 16); t.textAlignHorizontal = "CENTER"; show(c, B.reinforce - 0.3 + k * 0.38); }
// glows on the curves when the equation names their factor
kf(lk, "STROKE_WEIGHT", [[0, 5], [B.lik, 5], [B.lik + 0.3, 9], [B.pri - 0.2, 5], [B.input, 5], [B.input + 0.3, 9], [B.plain + 1, 5]], "EASE_OUT");
// "evidence in front of the observer" → the gap the prior opens
const gap = line(S, "gap arrow", [[X(MU_X), PY - 22], [X(pmu(16)) - 6, PY - 22]], STAT, 4, { arrow: true }); draw(gap, B.outweigh - 0.6, B.outweigh + 0.6);
const gapT = await txt(S, "gap tag", "the prior pulls the reading off the evidence", "Label/Mono Small", STAT, X(MU_X), PY - 56, 520, 18); show(gapT, B.outweigh);

// ── turn 614: the proxies that feed the prior, the evidence overridden ──
const P2 = await panel(F, "panel proxies", 1210, 776, 520, 128, "PRIOR INPUTS · PROXIES"); show(P2, B.proxies - 0.6);
const PXS = [["phenotype", B.proxies], ["name", T2 + 2.0], ["neighborhood", T2 + 2.78], ["proxy status", T2 + 3.74]];
// two rows, each chip sized to its word
const PW_ = PXS.map(([w]) => w.length * 11 + 30), PXY = [44, 84], PXX = [20, 20 + PW_[0] + 10, 20, 20 + PW_[2] + 10];
for (let k = 0; k < PXS.length; k++) { const c = await panel(P2, "proxy · " + PXS[k][0], PXX[k], PXY[k >> 1], PW_[k], 32); c.cornerRadius = 16; c.strokes = solid(RED); c.fills = solid(RED, 0.12);
  const t = await txt(c, "label", PXS[k][0], "Label/Mono Small", RED, 0, 7, PW_[k], 16); t.textAlignHorizontal = "CENTER"; show(c, PXS[k][1]); }
kf(lk, "OPACITY", [[0, 0], [B.evidence, 0], [B.evidence + 0.05, 1], [B.override, 1], [B.override + 0.6, 0.3], [B.coding, 0.3], [B.coding + 0.4, 0.15]]);
kf(xm, "OPACITY", [[0, 0], [B.evidence + 0.8, 0], [B.evidence + 1.2, 1], [B.override, 1], [B.override + 0.6, 0.35]]);
const last = S.findOne(n => n.name === "posterior curve · r 16");
kf(last, "STROKE_WEIGHT", [[0, 6], [B.override, 6], [B.override + 0.3, 11], [B.override + 1.4, 6], [B.coding + 1.2, 6], [B.coding + 1.5, 11], [B.coding + 2.6, 6]], "EASE_OUT");
const ovT = await txt(S, "override tag", "the reading overrides the evidence", "Label/Mono Small", STAT, X(pmu(16)) - 360, PY + 26, 320, 18); ovT.textAlignHorizontal = "RIGHT"; show(ovT, B.override + 0.3);
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length, eqRight: pri.x + pri.width, eqNo: eqNo.id };
