import * as THREE from 'three';
import {
  PALETTE, makeGrid, makeTextSprite, makePoint, makeLine, makeArrow, makeCurveTube, makeCurtain,
} from './common.js';

function complexPlaneFloor(group) {
  const grid = makeGrid(16, 16);
  grid.position.y = 0;
  group.add(grid);
  const re = makeTextSprite('Re', { color: '#64748b', size: 1.8 });
  re.position.set(8.6, 0.1, 0);
  const im = makeTextSprite('Im', { color: '#64748b', size: 1.8 });
  im.position.set(0.2, 0.1, 8.6);
  group.add(re, im);
  // axes
  group.add(makeLine([new THREE.Vector3(-8, 0, 0), new THREE.Vector3(8, 0, 0)], PALETTE.dim, 0.8));
  group.add(makeLine([new THREE.Vector3(0, 0, -8), new THREE.Vector3(0, 0, 8)], PALETTE.dim, 0.8));
}

/* E220 — W = ψ_m + jψ_s : extraction as a complex vector. */
export function buildE220(params) {
  const group = new THREE.Group();
  const am = params.psi_m, as = params.psi_s;
  complexPlaneFloor(group);

  const W = new THREE.Vector3();
  const arrow = makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, PALETTE.warn);
  const compM = makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, PALETTE.cyan);
  const compS = makeArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1, PALETTE.magenta);
  group.add(arrow, compM, compS);

  const lW = makeTextSprite('W', { color: '#fbbf24', size: 2.2 });
  const lM = makeTextSprite('ψ_m', { color: '#22d3ee', size: 1.9 });
  const lS = makeTextSprite('jψ_s', { color: '#f472b6', size: 1.9 });
  group.add(lW, lM, lS);

  return {
    group,
    update(t) {
      const m = am * (2.2 + 1.4 * Math.sin(t * 0.7));
      const s = as * (2.2 + 1.4 * Math.cos(t * 0.5));
      W.set(m, 0, s);
      arrow.setDirection(W.clone().normalize());
      arrow.setLength(W.length(), 0.5, 0.32);
      compM.setLength(m, 0.4, 0.24);
      compS.position.set(m, 0, 0);
      compS.setLength(s, 0.4, 0.24);
      lW.position.set(W.x / 2, 0.9, W.z / 2);
      lM.position.set(m / 2, 0.7, 0);
      lS.position.set(m, 0.7, s / 2);
    },
  };
}

/* E221 — W + W* = 2ψ_m : the conjugate cancels the imaginary. */
export function buildE221(params) {
  const group = new THREE.Group();
  const r = params.radius;
  complexPlaneFloor(group);

  const W = makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, PALETTE.warn);
  const Wc = makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, PALETTE.cyan);
  const Sum = makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, PALETTE.good);
  group.add(W, Wc, Sum);
  const lW = makeTextSprite('W', { color: '#fbbf24', size: 2 });
  const lC = makeTextSprite('W*', { color: '#22d3ee', size: 2 });
  const lS = makeTextSprite('W + W* = 2ψ_m', { color: '#4ade80', size: 2.2 });
  group.add(lW, lC, lS);
  // unit circle guide
  const circ = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    circ.push(new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)));
  }
  group.add(makeLine(circ, PALETTE.dim, 0.4));

  return {
    group,
    update(t) {
      const th = t * 0.6;
      const v = new THREE.Vector3(r * Math.cos(th), 0, r * Math.sin(th));
      W.setDirection(v.clone().normalize());
      W.setLength(r, 0.45, 0.28);
      const vc = new THREE.Vector3(v.x, 0, -v.z);
      Wc.setDirection(vc.clone().normalize());
      Wc.setLength(r, 0.45, 0.28);
      Sum.setLength(Math.max(2 * v.x, 0.001), 0.5, 0.3);
      lW.position.set(v.x + 0.6, 0.6, v.z);
      lC.position.set(vc.x + 0.7, 0.6, vc.z);
      lS.position.set(v.x, 1.2, 0);
    },
  };
}

/* E225 — S = V·I* = P + jQ : the power triangle. */
export function buildE225(params) {
  const group = new THREE.Group();
  const theta = params.theta;
  complexPlaneFloor(group);

  const P = 5;
  const Q = P * Math.tan(theta);
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0, P, 0, 0, P, 0, Q,
  ], 3));
  tri.setIndex([0, 1, 2]);
  tri.computeVertexNormals();
  group.add(new THREE.Mesh(tri, new THREE.MeshBasicMaterial({
    color: PALETTE.accent, transparent: true, opacity: 0.25, side: THREE.DoubleSide,
  })));
  group.add(makeLine([new THREE.Vector3(), new THREE.Vector3(P, 0, 0)], PALETTE.good, 1));
  group.add(makeLine([new THREE.Vector3(P, 0, 0), new THREE.Vector3(P, 0, Q)], PALETTE.magenta, 1));
  const S = makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, PALETTE.warn);
  S.setDirection(new THREE.Vector3(P, 0, Q).normalize());
  S.setLength(Math.hypot(P, Q), 0.5, 0.3);
  group.add(S);

  const lP = makeTextSprite(`P_real = ${P.toFixed(1)}`, { color: '#4ade80', size: 2 });
  lP.position.set(P / 2, 0.8, 0);
  const lQ = makeTextSprite(`Q_reactive = ${Q.toFixed(1)}`, { color: '#f472b6', size: 2 });
  lQ.position.set(P + 1.4, 0.8, Q / 2);
  const lS = makeTextSprite(`|S| = ${Math.hypot(P, Q).toFixed(1)}`, { color: '#fbbf24', size: 2.2 });
  lS.position.set(P / 2, 1.1, Q / 2);
  const lT = makeTextSprite(`θ = ${(theta * 180 / Math.PI).toFixed(0)}°`, { color: '#94a3b8', size: 1.8 });
  lT.position.set(1.6, 0.6, 0.8);
  group.add(lP, lQ, lS, lT);

  return { group, update(t) { group.rotation.y = 0.1 * Math.sin(t * 0.2); } };
}

/* E228 — R = ∫ Re[V_state I*] dt : what phase lag costs. */
export function buildE228(params) {
  const group = new THREE.Group();
  const th = params.theta;
  group.add(makeGrid(20, 20));

  const V = x => 2.4 * Math.sin(0.7 * x);
  const I = x => 1.6 * Math.sin(0.7 * x - th);
  const P = x => V(x) * I(x) / 2; // Re[V I*] envelope

  group.add(makeCurveTube(V, { color: PALETTE.cyan, x0: -10, x1: 10, z: -2.5 }));
  group.add(makeCurveTube(I, { color: PALETTE.magenta, x0: -10, x1: 10, z: -2.5 }));
  group.add(makeCurveTube(P, { color: PALETTE.good, x0: -10, x1: 10 }));
  group.add(makeCurtain(P, { color: PALETTE.good, x0: -10, x1: 10, y0: -3.5, opacity: 0.22 }));

  // accumulated integral
  const acc = [];
  let s = -3;
  for (let i = 0; i <= 200; i++) {
    const x = -10 + 20 * (i / 200);
    s += P(x) * 0.02;
    acc.push(new THREE.Vector3(x, -3.2 + s * 0.35, 2.5));
  }
  group.add(makeLine(acc, PALETTE.warn, 1));

  const lV = makeTextSprite('V_state', { color: '#22d3ee', size: 1.9 });
  lV.position.set(8, V(8) + 0.9, -2.5);
  const lI = makeTextSprite('I (lags by θ)', { color: '#f472b6', size: 1.9 });
  lI.position.set(8, I(8) - 1.1, -2.5);
  const lP = makeTextSprite('Re[V I*]', { color: '#4ade80', size: 1.9 });
  lP.position.set(-8, 3.4, 0);
  const lR = makeTextSprite('R(t₀, t)', { color: '#fbbf24', size: 1.9 });
  lR.position.set(8.4, acc[acc.length - 1].y + 0.8, 2.5);
  group.add(lV, lI, lP, lR);

  return { group, update() {} };
}

export const COMPLEX_VIZ = {
  E220: {
    title: 'The Complex Wage',
    blurb: 'W = ψ_m + jψ_s: the material wage on the real axis, the status wage on the imaginary axis. The vector W is what the buffer class actually receives.',
    params: {
      psi_m: { label: 'ψ_m amplitude', min: 0.3, max: 2, step: 0.05, value: 1 },
      psi_s: { label: 'ψ_s amplitude', min: 0.3, max: 2, step: 0.05, value: 1 },
    },
    build: buildE220,
    camera: [8, 9, 8],
  },
  E221: {
    title: 'The Conjugate Identity',
    blurb: 'Add W to its mirror image and the status component cancels: W + W* = 2ψ_m. What survives every conjugation is the material term.',
    params: {
      radius: { label: '|W| radius', min: 2, max: 6, step: 0.2, value: 4 },
    },
    build: buildE221,
    camera: [7, 9, 9],
  },
  E225: {
    title: 'Real and Reactive Power',
    blurb: 'S = V·I* splits into P_real, which does work, and Q_reactive, which circulates back. The phase θ decides how much of the apparent power is real.',
    params: {
      theta: { label: 'phase θ', min: 0, max: 1.4, step: 0.02, value: 0.6 },
    },
    build: buildE225,
    camera: [8, 8, 10],
  },
  E228: {
    title: 'The Accumulated Extraction',
    blurb: 'R integrates Re[V_state·I*] over the era. Phase lag θ between state voltage and the current response shrinks the integrand and flattens the accumulation.',
    params: {
      theta: { label: 'phase lag θ', min: 0, max: 1.5, step: 0.02, value: 0.5 },
    },
    build: buildE228,
    camera: [0, 4, 20],
  },
};
