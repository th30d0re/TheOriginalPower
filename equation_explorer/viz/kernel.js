import * as THREE from 'three';
import {
  PALETTE, makeGrid, makeSurface, makeTextSprite, makePoint, makeLine,
  makeCurveTube, makeCurtain, makeSweepCursor,
} from './common.js';

/* E214 — max E(t) subject to M - λΦ_load < τ
 * Objective surface over (M, Φ); the constraint plane cuts a wall through it;
 * the optimum rides the wall at the highest feasible point. */
export function buildE214(params) {
  const group = new THREE.Group();
  const lam = params.lambda, tau = params.tau;

  const E = (m, phi) => 0.55 * m + 0.8 * phi - 0.02 * (m * m + phi * phi);
  group.add(makeSurface(E, { x0: -8, x1: 8, z0: -8, z1: 8, color: PALETTE.accent, opacity: 0.5 }));
  group.add(makeGrid(16, 16));

  // constraint wall: m - λφ = τ  →  m = τ + λφ
  const wallPts = [];
  for (let i = 0; i <= 40; i++) {
    const phi = -8 + 16 * (i / 40);
    const m = Math.max(-8, Math.min(8, tau + lam * phi));
    wallPts.push(new THREE.Vector3(m, 0, phi));
  }
  const wallGeo = new THREE.BufferGeometry();
  const wv = [];
  for (const p of wallPts) { wv.push(p.x, -4, p.z, p.x, 9, p.z); }
  const widx = [];
  for (let i = 0; i < wallPts.length - 1; i++) {
    const a = i * 2;
    widx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wv, 3));
  wallGeo.setIndex(widx);
  group.add(new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({
    color: PALETTE.warn, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false,
  })));

  // boundary curve on the surface + optimum marker
  const bPts = wallPts.map(p => new THREE.Vector3(p.x, E(p.x, p.z), p.z));
  group.add(makeLine(bPts, PALETTE.warn, 1));
  let best = bPts[0];
  for (const p of bPts) if (p.y > best.y) best = p;
  const opt = makePoint(PALETTE.warn, 0.4);
  opt.position.copy(best);
  group.add(opt);
  const optLabel = makeTextSprite('max E s.t. M − λΦ < τ', { color: '#fbbf24', size: 3.2 });
  optLabel.position.set(best.x, best.y + 1.6, best.z);
  group.add(optLabel);

  const axes = makeTextSprite('M →   Φ ↗   E ↑', { color: '#64748b', size: 2.6 });
  axes.position.set(0, -3.4, 9.5);
  group.add(axes);

  return { group, update(t) { opt.scale.setScalar(1 + 0.18 * Math.sin(t * 3)); } };
}

/* E215 — M_eff = M − λΦ_load
 * Two ribbons over time; connectors colored by the sign of M_eff − τ. */
export function buildE215(params) {
  const group = new THREE.Group();
  const lam = params.lambda, tau = params.tau;
  const M = x => 1.5 + 2.2 * Math.sin(0.45 * x) + 0.08 * x;
  const P = x => 0.5 + lam * (1.1 + 0.9 * Math.cos(0.3 * x + 1.3));

  group.add(makeGrid(20, 20));
  group.add(makeCurveTube(M, { color: PALETTE.good, x0: -10, x1: 10 }));
  group.add(makeCurtain(M, { color: PALETTE.good, x0: -10, x1: 10 }));
  group.add(makeCurveTube(P, { color: PALETTE.bad, x0: -10, x1: 10 }));
  group.add(makeCurtain(P, { color: PALETTE.bad, x0: -10, x1: 10 }));

  // threshold plane y = τ
  const thr = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 0.001),
    new THREE.MeshBasicMaterial({ color: PALETTE.warn, transparent: true, opacity: 0.8 })
  );
  thr.position.set(0, tau, 0.02);
  group.add(thr);

  // gap connectors, green where M_eff = M−P > τ
  const conn = [];
  for (let i = 0; i <= 40; i++) {
    const x = -10 + 20 * (i / 40);
    const ok = M(x) - P(x) > tau;
    conn.push(makeLine(
      [new THREE.Vector3(x, P(x), 0), new THREE.Vector3(x, M(x), 0)],
      ok ? PALETTE.good : PALETTE.bad, 0.55
    ));
  }
  conn.forEach(c => group.add(c));

  const lM = makeTextSprite('M(t)', { color: '#4ade80', size: 2.2 });
  lM.position.set(11, M(10), 0);
  const lP = makeTextSprite('λΦ_load(t)', { color: '#f87171', size: 2.2 });
  lP.position.set(11.6, P(10), 0);
  const lT = makeTextSprite('τ', { color: '#fbbf24', size: 2.2 });
  lT.position.set(10.7, tau, 0);
  group.add(lM, lP, lT);

  const cursor = makeSweepCursor({ x0: -10, x1: 10 });
  group.add(cursor.mesh);
  return { group, update(t) { cursor.set(t * 0.06); } };
}

/* E216 — Σ_sup = ψ_s + ψ_m + R + Φ_load : stacked suppression layers. */
export function buildE216(params) {
  const group = new THREE.Group();
  const lam = params.lambda;
  const layers = [
    { name: 'ψ_s', color: PALETTE.cyan, fn: x => 0.9 + 0.5 * Math.sin(0.5 * x) },
    { name: 'ψ_m', color: PALETTE.accent, fn: x => 0.7 + 0.4 * Math.cos(0.35 * x + 1) },
    { name: 'R', color: PALETTE.magenta, fn: x => 0.4 + 0.9 * Math.max(0, Math.sin(1.1 * x)) ** 3 },
    { name: 'Φ_load', color: PALETTE.bad, fn: x => 0.3 + lam * (0.6 + 0.3 * Math.sin(0.8 * x + 2)) },
  ];
  group.add(makeGrid(20, 20));
  const cum = x => layers.reduce((s, l) => s + l.fn(x), 0) - 4;

  let base = () => -4;
  for (const l of layers) {
    const prev = base;
    const top = x => prev(x) + l.fn(x);
    const n = 120;
    const verts = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const x = -10 + 20 * (i / n);
      verts.push(x, top(x), 0, x, prev(x), 0);
      if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: l.color, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false,
    })));
    const lbl = makeTextSprite(l.name, { color: '#' + new THREE.Color(l.color).getHexString(), size: 1.8 });
    lbl.position.set(11.2, top(10) - l.fn(10) / 2, 0);
    group.add(lbl);
    base = top;
  }
  group.add(makeCurveTube(cum, { color: 0xffffff, x0: -10, x1: 10, radius: 0.08 }));
  const tot = makeTextSprite('Σ_sup(t)', { color: '#e2e8f0', size: 2.4 });
  tot.position.set(-11.5, cum(-10) + 0.8, 0);
  group.add(tot);

  const cursor = makeSweepCursor({ x0: -10, x1: 10 });
  group.add(cursor.mesh);
  return { group, update(t) { cursor.set(t * 0.06); } };
}

/* E217 — dM/dt > dΣ_sup/dt ⟺ M_eff > τ : the rate race. */
export function buildE217(params) {
  const group = new THREE.Group();
  const w = params.omega;
  const M = x => 2 + 2.4 * Math.sin(0.4 * x) + 0.1 * x;
  const S = x => 1 + 2.0 * Math.sin(0.4 * w * x + 1.2);
  const tau = params.tau;

  group.add(makeGrid(20, 20));
  // segment-wise coloring by which derivative leads
  const n = 160;
  for (let i = 0; i < n; i++) {
    const x0 = -10 + 20 * (i / n), x1 = -10 + 20 * ((i + 1) / n);
    const dM = M(x1) - M(x0), dS = S(x1) - S(x0);
    const win = dM > dS;
    group.add(makeLine(
      [new THREE.Vector3(x0, M(x0), 0), new THREE.Vector3(x1, M(x1), 0)],
      win ? PALETTE.good : PALETTE.dim, 1));
    group.add(makeLine(
      [new THREE.Vector3(x0, S(x0), 0.05), new THREE.Vector3(x1, S(x1), 0.05)],
      win ? PALETTE.dim : PALETTE.bad, 1));
  }
  const thr = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 0.001),
    new THREE.MeshBasicMaterial({ color: PALETTE.warn, transparent: true, opacity: 0.8 })
  );
  thr.position.set(0, tau, 0.03);
  group.add(thr);

  // beads where M − S crosses τ
  for (let i = 0; i < n; i++) {
    const x0 = -10 + 20 * (i / n), x1 = -10 + 20 * ((i + 1) / n);
    const d0 = M(x0) - S(x0) - tau, d1 = M(x1) - S(x1) - tau;
    if (d0 * d1 < 0) {
      const xm = (x0 + x1) / 2;
      const bead = makePoint(PALETTE.warn, 0.22);
      bead.position.set(xm, M(xm), 0.1);
      group.add(bead);
    }
  }
  const lM = makeTextSprite('M(t)', { color: '#4ade80', size: 2.2 });
  lM.position.set(11, M(10), 0);
  const lS = makeTextSprite('Σ_sup(t)', { color: '#f87171', size: 2.2 });
  lS.position.set(11.6, S(10), 0);
  group.add(lM, lS);

  const cursor = makeSweepCursor({ x0: -10, x1: 10 });
  group.add(cursor.mesh);
  return { group, update(t) { cursor.set(t * 0.06); } };
}

/* E218 — Benefit(E) ≫ Benefit(P) > Benefit(F) > Benefit(I) > Benefit(O) */
export function buildE218(params) {
  const group = new THREE.Group();
  const gap = params.gap;
  const tiers = [
    ['E', PALETTE.warn], ['P_uppet', PALETTE.magenta], ['F_enforce', PALETTE.bad],
    ['I_buffer', PALETTE.accent], ['O', PALETTE.dim],
  ];
  group.add(makeGrid(16, 16));
  tiers.forEach(([name, color], i) => {
    const h = Math.pow(gap, tiers.length - 1 - i);
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, h, 1.6),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75 })
    );
    const x = (i - 2) * 3;
    bar.position.set(x, h / 2 - 3, 0);
    group.add(bar);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bar.geometry),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 })
    );
    edges.position.copy(bar.position);
    group.add(edges);
    const lbl = makeTextSprite(name, { color: '#' + new THREE.Color(color).getHexString(), size: 1.9 });
    lbl.position.set(x, h - 3 + 1.1, 0);
    group.add(lbl);
    const val = makeTextSprite(h >= 100 ? h.toFixed(0) : h.toFixed(1), { color: '#94a3b8', size: 1.4 });
    val.position.set(x, -3.7, 0);
    group.add(val);
  });
  const title = makeTextSprite('Benefit by tier (log staircase)', { color: '#cbd5f5', size: 2.6 });
  title.position.set(0, 5.4, 0);
  group.add(title);
  return { group, update(t) { group.rotation.y = 0.12 * Math.sin(t * 0.25); } };
}

/* E061 — Δ(x) = V_c(x) − V_r(x) : the compliance differential gap. */
export function buildE061(params) {
  const group = new THREE.Group();
  const k = params.steepness;
  const Vc = x => 4 * Math.exp(-0.12 * (x + 10) * k) + 0.3 * Math.sin(x);
  const Vr = x => 4 * Math.exp(-0.12 * (x + 10) * k * 0.45) - 0.8;

  group.add(makeGrid(20, 20));
  group.add(makeCurveTube(Vc, { color: PALETTE.cyan, x0: -10, x1: 10 }));
  group.add(makeCurveTube(Vr, { color: PALETTE.magenta, x0: -10, x1: 10 }));

  // gap curtain between the curves, hue follows sign of Δ
  const n = 120;
  const verts = [], cols = [], idx = [];
  const cPos = new THREE.Color(0x4ade80), cNeg = new THREE.Color(0xf87171);
  for (let i = 0; i <= n; i++) {
    const x = -10 + 20 * (i / n);
    const d = Vc(x) - Vr(x);
    const c = d >= 0 ? cPos : cNeg;
    verts.push(x, Vc(x), 0, x, Vr(x), 0);
    cols.push(c.r, c.g, c.b, c.r, c.g, c.b);
    if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  geo.setIndex(idx);
  group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false,
  })));

  const lC = makeTextSprite('V_c(x) compliance', { color: '#22d3ee', size: 2 });
  lC.position.set(0, Vc(0) + 1.2, 0);
  const lR = makeTextSprite('V_r(x) refusal', { color: '#f472b6', size: 2 });
  lR.position.set(2, Vr(2) - 1.4, 0);
  const lD = makeTextSprite('Δ(x)', { color: '#e2e8f0', size: 2.2 });
  lD.position.set(-9, (Vc(-9) + Vr(-9)) / 2, 0);
  group.add(lC, lR, lD);

  const bead = makePoint(0xffffff, 0.28);
  group.add(bead);
  return {
    group,
    update(t) {
      const x = -10 + 20 * ((t * 0.07) % 1);
      bead.position.set(x, (Vc(x) + Vr(x)) / 2, 0.15);
    },
  };
}

export const KERNEL_VIZ = {
  E214: {
    title: 'The Predatory Min-Max Function',
    blurb: 'Extraction E is maximized over the policy set while effective resistance M − λΦ_load is held below the tolerance threshold τ. The optimum rides the constraint wall.',
    params: {
      lambda: { label: 'λ load coupling', min: 0.2, max: 2, step: 0.05, value: 1 },
      tau: { label: 'τ tolerance', min: -3, max: 3, step: 0.1, value: 0.5 },
    },
    build: buildE214,
    camera: [15, 12, 17],
  },
  E215: {
    title: 'Effective Resistance Variable',
    blurb: 'M_eff is what remains of organized resistance M(t) after the load λΦ_load(t) is subtracted. Green gaps clear the threshold τ; red gaps fall below it.',
    params: {
      lambda: { label: 'λ load coupling', min: 0.2, max: 2.5, step: 0.05, value: 1 },
      tau: { label: 'τ tolerance', min: -2, max: 3, step: 0.1, value: 0.5 },
    },
    build: buildE215,
    camera: [0, 4, 19],
  },
  E216: {
    title: 'Suppression Envelope',
    blurb: 'Total suppression stacks four terms: structural ψ_s, memetic ψ_m, kinetic R, and the loaded burden Φ_load. The white trace is their sum.',
    params: {
      lambda: { label: 'λ on Φ_load', min: 0, max: 2.5, step: 0.05, value: 1 },
    },
    build: buildE216,
    camera: [0, 3, 20],
  },
  E217: {
    title: 'The Crash Condition',
    blurb: 'Resistance escapes exactly when it grows faster than suppression. Green segments: dM/dt leads. Amber beads: M_eff crossings of τ.',
    params: {
      omega: { label: 'suppression tempo', min: 0.5, max: 2, step: 0.05, value: 1 },
      tau: { label: 'τ tolerance', min: -1, max: 3, step: 0.1, value: 1 },
    },
    build: buildE217,
    camera: [0, 3, 20],
  },
  E218: {
    title: 'Benefit Extraction by Tier',
    blurb: 'The benefit ordering across the five tiers drops by orders of magnitude per step: the extracting class, the puppet class, enforcers, the buffer, and the extracted.',
    params: {
      gap: { label: 'tier gap factor', min: 2, max: 8, step: 0.5, value: 4 },
    },
    build: buildE218,
    camera: [0, 4, 18],
  },
  E061: {
    title: 'The Compliance Differential',
    blurb: 'Δ(x) measures the gap between the value of compliance V_c and the value of refusal V_r along the compounded-intersection axis. The differential closes first where intersection load is highest.',
    params: {
      steepness: { label: 'decay steepness', min: 0.4, max: 2, step: 0.05, value: 1 },
    },
    build: buildE061,
    camera: [0, 3, 19],
  },
};
