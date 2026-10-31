// RLC tail · OV turn 617 (dadea92f605fe012): Equation 2.12 taken apart. The decay envelope ± Q₀e^(−αt),
// the swing cos(ω_d t) + (α/ω_d) sin(ω_d t), their product q(t); then α, ω₀ and ω_d, each with a sweep
// keyed to the line that names it. Run as g_head.js + this file. Beats are seconds from the start of
// turn 617. Every curve is Equation 2.12 evaluated in this script; parameter values are illustrative.
const B = { Q0: 3.02, exp: 4.42, cos: 8.02, sin: 11.0, scaled: 13.11, decay: 16.36, swing: 18.58, alpha: 20.96, natural: 26.14, damped: 32.08, minus: 35.62, end: 38.94 };
const { F, head } = await frame("g-rlc tail 617", "Equation 2.12 · Decay and Swing", 7);
await captions(F, [[0.5, "THE SOLUTION · INITIAL CHARGE × A DECAYING EXPONENTIAL × AN OSCILLATION"], [B.decay, "THE EXPONENTIAL CONTROLS THE DECAY · THE SINE AND COSINE CONTROL THE SWING"],
  [B.alpha, "SWEEP · A LARGER DECAY CONSTANT α TIGHTENS THE ENVELOPE"], [B.natural, "SWEEP · A HIGHER NATURAL FREQUENCY ω₀ QUICKENS THE SWING"], [B.damped, "SWEEP · RAISING α LOWERS THE DAMPED FREQUENCY AND STRETCHES EACH SWING"]]);
await source(F, "The Original Power, Ch. 2, Eq. 2.12 · curves evaluated from Eq. 2.12, illustrative parameters");
// ── Equation 2.12, one piece per part ──
const EY = 276, SZ = 50;
const p0 = math(F, "q(t) =", "q(t) =", SZ, INK, 190, EY);
const pQ = math(F, "Q0", "Q_0", SZ, STAT, p0.x + p0.width + 14, EY);
const pE = math(F, "exp", "e^{−αt}", SZ, RED, pQ.x + pQ.width + 10, EY);
const pC = math(F, "cos part", "[cos(ω_d t)", SZ, MAT, pE.x + pE.width + 12, EY);
const pS = math(F, "sin part", "+ (α/ω_d) sin(ω_d t)]", SZ, MAT, pC.x + pC.width + 10, EY);
[p0, pQ, pE, pC, pS].forEach((n, k) => show(n, 0.3 + k * 0.15));
const R_ = n => ringAround(F, n, n === pQ ? STAT : n === pE ? RED : MAT, 4);
windows(R_(pQ), [[B.Q0, B.exp - 0.1]]); windows(R_(pE), [[B.exp, B.cos - 0.3], [B.decay, B.swing - 0.1]]);
windows(R_(pC), [[B.cos, B.sin - 0.1], [B.swing, B.alpha - 0.2]]); windows(R_(pS), [[B.sin, B.decay - 0.3], [B.swing, B.alpha - 0.2]]);
// ── the plot ──
const PL = { x: 190, y: 430, w: 940, h: 420 }, TE = 30;
const y0 = PL.y + PL.h / 2, TX = t => PL.x + t / TE * PL.w, QY = q => y0 - q * PL.h / 2.3;
const pts = f => Array.from({ length: 181 }, (_, i) => { const t = i * TE / 180; return [TX(t), QY(f(t))]; });
const S = stage(F, "plot");
const yAx = line(S, "q axis", [[PL.x, PL.y + PL.h], [PL.x, PL.y - 16]], INK, 3, { arrow: true }), tAx = line(S, "t axis", [[PL.x, y0], [PL.x + PL.w + 12, y0]], INK, 3, { arrow: true });
const ql = math(S, "q label", "q(t)", 34, INK, PL.x + 14, PL.y - 44), tl = math(S, "t label", "t", 30, INK, PL.x + PL.w - 6, y0 + 4);
[yAx, tAx, ql, tl].forEach(n => show(n, 0.5));
const q0d = figma.createEllipse(); S.appendChild(q0d); q0d.name = "Q0 dot"; q0d.resize(20, 20); q0d.x = TX(0) - 10; q0d.y = QY(1) - 10; q0d.fills = solid(STAT); show(q0d, B.Q0 + 0.3);
const q0l = math(S, "Q0 label", "Q_0", 30, STAT, PL.x - 64, QY(1) - 28); show(q0l, B.Q0 + 0.3);
const env = (a, s) => pts(t => s * Math.exp(-a * t)), sw = (a, w) => { const wd = Math.sqrt(w * w - a * a); return t => Math.cos(wd * t) + a / wd * Math.sin(wd * t); };
const qq = (a, w) => { const f = sw(a, w); return t => Math.exp(-a * t) * f(t); };
// base pieces, built up on the narration
const e0p = curve(S, "envelope + · base", env(0.2, 1), RED, 3, [10, 8]), e0n = curve(S, "envelope − · base", env(0.2, -1), RED, 3, [10, 8]);
const swing = curve(S, "swing · base", pts(sw(0.2, 1)), MAT, 3);
const envT = math(S, "envelope label", "± Q_0 e^{−αt}", 32, RED, TX(7.4), QY(Math.exp(-1.48)) - 66); show(envT, B.exp + 1.2, B.alpha);
const swT = await txt(S, "swing tag", "the swing · constant amplitude", "Label/Mono Small", MAT, TX(17), QY(1.25) - 6, 360, 18); show(swT, B.cos + 1.6, B.alpha);
kf(swing, "PATH_TRIM_END", [[0, 0.001], [B.cos + 0.2, 0.001], [B.sin + 0.6, 1]], "EASE_IN_AND_OUT");
op(swing, [[B.cos + 0.15, 0], [B.cos + 0.2, 0.9], [B.swing + 2.2, 0.9], [B.alpha, 0]]);
kf(swing, "STROKE_WEIGHT", [[0, 3], [B.swing, 3], [B.swing + 0.3, 6], [B.alpha - 0.3, 3]], "EASE_OUT");
// states: [α, ω₀, on]; the first is drawn on as the product of envelope and swing
const STATES = [[0.2, 1, B.swing + 0.6], [0.35, 1, B.alpha + 1.6], [0.5, 1, B.alpha + 2.4], [0.35, 1, B.alpha + 3.6], [0.2, 1, B.alpha + 4.4],
  [0.2, 1.5, B.natural + 1.4], [0.2, 2, B.natural + 2.2], [0.2, 1.5, B.natural + 4.2], [0.2, 1, B.natural + 5.0], [0.6, 1, B.minus], [0.9, 1, B.minus + 1.0]];
const RP = await panel(F, "panel readout", 1210, 430, 520, 112, "READOUT · ILLUSTRATIVE VALUES"); show(RP, B.swing + 0.6);
for (let i = 0; i < STATES.length; i++) {
  const [a, w, on] = STATES[i], off = (STATES[i + 1] || [0, 0, B.end + 1])[2], last = i === STATES.length - 1;
  const win = d => [[on - 0.01, 0], [on + d, 1], ...(last ? [] : [[off, 1], [off + 0.2, 0]])];
  const q = curve(S, `q · α ${a} ω0 ${w}`, pts(qq(a, w)), STAT, 5);
  if (i === 0) { kf(q, "PATH_TRIM_END", [[0, 0.001], [on, 0.001], [on + 1.6, 1]], "EASE_IN_AND_OUT"); op(q, [[on - 0.01, 0], [on, 1], [off, 1], [off + 0.2, 0]]); } else op(q, win(0.2));
  if (i > 0) { const ep = curve(S, `envelope + · α ${a}`, env(a, 1), RED, 3, [10, 8]), en = curve(S, `envelope − · α ${a}`, env(a, -1), RED, 3, [10, 8]); op(ep, win(0.2)); op(en, win(0.2)); }
  const wd = Math.sqrt(w * w - a * a);
  const r = math(RP, `readout ${i}`, `α = ${a}   ω_0 = ${w}   ω_d = ${wd.toFixed(2)}`, 30, INK, 20, 44); op(r, win(0.2));
}
// the base envelope draws on the exponential and holds until the first state takes over
// dashed strokes cannot trim, so the base envelope fades in on the exponential
for (const e of [e0p, e0n]) { op(e, [[B.exp + 0.15, 0], [B.exp + 0.8, 1], [STATES[1][2], 1], [STATES[1][2] + 0.2, 0]]); }
kf(e0p, "STROKE_WEIGHT", [[0, 3], [B.decay, 3], [B.decay + 0.3, 6], [B.swing, 3]], "EASE_OUT");
// ── the three rates, each in a panel on its word ──
const RATES = [["panel α", "DECAY CONSTANT", "α = R/(2L)", B.alpha], ["panel ω0", "NATURAL FREQUENCY", "ω_0 = 1/√(LC)", B.natural], ["panel ωd", "DAMPED FREQUENCY", "ω_d = √(ω_0^2 − α^2)", B.damped]];
for (let k = 0; k < 3; k++) { const [nm, tag, src, t] = RATES[k]; const p = await panel(F, nm, 1210, 560 + k * 112, 520, 100, tag); math(p, "formula", src, 38, k === 2 ? MAT : k === 1 ? INK : RED, 20, 36); show(p, t); }
finish(head, B.end);
return { id: F.id, nodes: F.findAll(() => true).length, eqRight: pS.x + pS.width };
