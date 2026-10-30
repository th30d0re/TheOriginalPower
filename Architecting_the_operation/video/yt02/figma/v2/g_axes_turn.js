// G32 · turn 350 (6f57987c14083560): the textbook plane, then the whole cross of axes turns a quarter
// turn clockwise with W on it. Beats are seconds from the start of turn 350. Geometry matches
// "wage S10-06" (origin 640,575; axis half-length 270; |W| = 250; θ = 35° from the ψ_m axis), so the
// end state is the S10-06 plane: ψ_m positive down, ψ_s right, W at the same tip.
// Motion: everything that turns sits in a transparent rig frame centred on the origin, so ROTATION
// pivots there; the axis labels inside it counter-rotate to stay upright.
const B = { textbook: 0.1, real: 1.26, horizontal: 2.1, imaginary: 3.74, vertical: 5.06, episode: 6.66, rotate: 7.84, turned: 9.84,
  status: 10.78, material: 12.08, handoff: 13.8, end: 14.4 };
const { F, head } = await frame("g-S10-08 axes quarter turn", "Equation 3.5 · The Complex Wage", 3);
await captions(F, [[B.textbook, "THE TEXTBOOK LAYOUT · REAL HORIZONTAL, IMAGINARY VERTICAL"], [B.episode, "THIS EPISODE · A QUARTER TURN CLOCKWISE · W × (−j)"],
  [B.status, "STATUS RUNS RIGHT · DELIVERED MATERIAL VALUE RUNS DOWN"]]);
await source(F, "The Original Power, Ch. 3, Eq. 3.5");
const OX = 640, OY = 575, R = 270, L = 250, TH = 35 * Math.PI / 180, H = 320;
const cm = L * Math.cos(TH), cs = L * Math.sin(TH);

// ── right column, as S10-06 leaves it at the end of turn 349 ──
const Pj = await panel(F, "panel j", 1180, 300, 550, 96, "A PERPENDICULAR DIRECTION"); const jv = svg(Pj, "j", "w35.j", 40); jv.x = 20; jv.y = 44;
const Pe = await panel(F, "panel eq 3.5", 1180, 412, 550, 168, "EQUATION 3.5 · CH. 3"); const ev = svg(Pe, "eq", "w35.eq", 48); ev.x = 20; ev.y = 40;
await txt(Pe, "gloss", "Material and psychological components share one magnitude and one phase.", "Body/Default", C.text, 20, 104, 510, 20);
const Ps = await panel(F, "panel screen", 1180, 596, 550, 96, "SCREEN COORDINATES · W × (−j)"); const sv = svg(Ps, "screen", "w35.screen", 36, INK); sv.x = 20; sv.y = 46;
show(Ps, B.episode + 0.4);

// ── the rig: axes, components, projections and W turn together ──
const G = rig(F, "plane rig", OX, OY, H);
const re = line(G, "axis real (horizontal)", [[H - R, H], [H + R, H]], INK, 3, { arrow: true });
const im = line(G, "axis imaginary (vertical)", [[H, H + R], [H, H - R]], INK, 3, { arrow: true });
const reL = svg(G, "Re", "w35.re", 30, INK); reL.x = H + R - reL.width; reL.y = H + 14;
const imL = svg(G, "Im", "w35.im", 30, INK); imL.x = H + 14; imL.y = H - R - 4;
const mC = line(G, "psi_m component (real)", [[H, H], [H + cm, H]], MAT, 10);
const sC = line(G, "psi_s component (imaginary)", [[H, H], [H, H - cs]], STAT, 10);
const pjA = line(G, "projection to real", [[H + cm, H - cs], [H + cm, H]], DIMC, 2, { dash: [10, 8] });
const pjB = line(G, "projection to imaginary", [[H + cm, H - cs], [H, H - cs]], DIMC, 2, { dash: [10, 8] });
const W = line(G, "W arrow", [[H, H], [H + cm, H - cs]], STAT, 6, { arrow: true });
const Wl = svg(G, "W label", "w35.W", 40, STAT); Wl.x = H + 1.13 * cm - Wl.width / 2; Wl.y = H - 1.13 * cs - Wl.height / 2;
// textbook build: real part along the horizontal, imaginary part up the vertical, then W
for (const n of [re, im, reL, imL]) n.opacity = 1;
const glow = (n, t, base, peak) => kf(n, "STROKE_WEIGHT", [[0, base], [t, base], [t + 0.35, peak], [t + 1.3, base]], "EASE_OUT");
glow(re, B.real, 3, 7); glow(im, B.imaginary, 3, 7);
draw(mC, B.real + 0.2, B.horizontal); draw(sC, B.imaginary + 0.2, B.vertical - 0.4);
show(pjA, B.vertical - 0.3); show(pjB, B.vertical - 0.2);
draw(W, B.vertical, B.vertical + 0.7); show(Wl, B.vertical + 0.6);
// the quarter turn: −90° is clockwise on screen; the labels turn back +90° and stay upright
kf(G, "ROTATION", [[0, 0], [B.rotate, 0], [B.turned, -90]], "EASE_IN_AND_OUT");
for (const n of [reL, imL, Wl]) kf(n, "ROTATION", [[0, 0], [B.rotate, 0], [B.turned, 90]], "EASE_IN_AND_OUT");
kf(reL, "OPACITY", [[0, 1], [B.turned, 1], [B.turned + 0.5, 0]]); kf(imL, "OPACITY", [[0, 1], [B.turned, 1], [B.turned + 0.5, 0]]);
// the turn indicator in the empty quadrant, with W·(−j)
const arc = figma.createVector(); F.appendChild(arc); arc.name = "turn arc";
arc.vectorNetwork = { vertices: [{ x: 0, y: 150 }, { x: 150, y: 0, strokeCap: "ARROW_EQUILATERAL" }], segments: [{ start: 0, end: 1, tangentStart: { x: 0, y: -83 }, tangentEnd: { x: -83, y: 0 } }], regions: [] };
arc.x = OX - 150; arc.y = OY - 150; arc.strokes = solid(STAT); arc.strokeWeight = 4;
kf(arc, "OPACITY", [[0, 0], [B.episode, 0], [B.episode + 0.4, 1], [B.turned + 0.4, 1], [B.turned + 0.9, 0]], "EASE_OUT");
const rot = svg(F, "rot", "w35.rot", 40, STAT); // placed outside the circle the axis tips sweep (radius R) so the turning axes never cross it
rot.x = 190; rot.y = 300; const rotT = await txt(F, "rot tag", "quarter turn\nclockwise", "Label/Mono Small", STAT, 190, 350, 190, 20);
for (const n of [rot, rotT]) kf(n, "OPACITY", [[0, 0], [B.episode, 0], [B.episode + 0.4, 1], [B.turned + 0.4, 1], [B.turned + 0.9, 0]], "EASE_OUT");
// after the turn: the episode's names for the two directions, worded as S10-06 words them
const psis = svg(F, "psi_s label", "w35.psis", 40, STAT); psis.x = OX + R + 14; psis.y = OY - psis.height / 2;
const psisT = await txt(F, "psi_s tag", "status (+)", "Label/Mono Small", STAT, OX + R + 14 + psis.width + 8, OY - 10);
const psim = svg(F, "psi_m label", "w35.psim", 40, MAT); psim.x = OX + 14; psim.y = OY + R + 18;
const psimT = await txt(F, "psi_m tag", "material delivered down (+)", "Label/Mono Small", MAT, OX + 14 + psim.width + 10, OY + R + 34);
show(psis, B.status); show(psisT, B.status + 0.2); show(psim, B.material); show(psimT, B.material + 0.2);
glow(sC, B.status, 10, 18); glow(mC, B.material + 0.4, 10, 18);
// hand-off: S10-06 draws W itself at turn 352 ("Draw the wage as an arrow"), so W and its parts clear
// before the cut and the last frame is the rotated, labelled plane S10-06 shows at turn 351
for (const n of [W, Wl, mC, sC, pjA, pjB]) { const k = n.manualKeyframeTracks.OPACITY.keyframes.map(f => [f.timelinePosition, f.value.value]); op(n, [...k.slice(1), [B.handoff, 1], [B.handoff + 0.5, 0]]); }
finish(head, B.end);
return { id: F.id, rig: G.id, nodes: F.findAll(() => true).length };
