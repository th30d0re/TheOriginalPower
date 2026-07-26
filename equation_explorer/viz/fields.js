import * as THREE from 'three';
import {
  PALETTE, makeGrid, makeTextSprite, makePoint, makeLine, makeArrow, makeCurveTube,
} from './common.js';

/* E219 — F = Q·E + Q(v × ΣB_k) : a charge spiraling through crossed fields. */
export function buildE219(params) {
  const group = new THREE.Group();
  const E = params.E, B = params.B, Q = 1;
  group.add(makeGrid(18, 18));

  // field arrows: E along +x (cyan), B along +z (magenta)
  for (let i = -2; i <= 2; i++) {
    group.add(makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-8, 2.5, i * 3), 2.2 * E, PALETTE.cyan));
    group.add(makeArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(i * 3, -2.5, -8), 2.2 * B, PALETTE.magenta));
  }
  const lE = makeTextSprite('E⃗_mat', { color: '#22d3ee', size: 2 });
  lE.position.set(-5, 3.4, 0);
  const lB = makeTextSprite('Σ B⃗_k', { color: '#f472b6', size: 2 });
  lB.position.set(3, -3.6, -5);
  group.add(lE, lB);

  // trajectory: helix from v×B with E-driven drift along x
  const pts = [];
  const w = Q * B;
  for (let i = 0; i <= 400; i++) {
    const t = i * 0.05;
    pts.push(new THREE.Vector3(
      0.5 * Q * E * t * t * 0.05 - 9,
      2.2 * Math.cos(w * t),
      2.2 * Math.sin(w * t)
    ));
  }
  const traj = makeLine(pts, 0xffffff, 0.9);
  group.add(traj);

  const particle = makePoint(PALETTE.warn, 0.35);
  const force = makeArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.5, PALETTE.warn);
  group.add(particle, force);

  return {
    group,
    update(t) {
      const i = Math.floor((t * 40) % 380);
      const p = pts[i], p2 = pts[i + 1];
      particle.position.copy(p);
      const v = p2.clone().sub(p);
      const f = new THREE.Vector3(E, 0, 0).add(new THREE.Vector3().crossVectors(v, new THREE.Vector3(0, 0, B)));
      force.position.copy(p);
      force.setDirection(f.clone().normalize());
      force.setLength(Math.min(0.35 * f.length() + 0.4, 3));
    },
  };
}

/* E222 — R = mL / (n q² τ A) : Drude drift through a lattice. */
export function buildE222(params) {
  const group = new THREE.Group();
  const n = Math.round(params.n), tau = params.tau;
  group.add(makeGrid(20, 10));

  // wire
  const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 18, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: PALETTE.accent, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
  );
  wire.rotation.z = Math.PI / 2;
  group.add(wire);

  // lattice ions
  const ionGeo = new THREE.SphereGeometry(0.32, 10, 8);
  const ionMat = new THREE.MeshBasicMaterial({ color: PALETTE.dim, transparent: true, opacity: 0.9 });
  for (let x = -8; x <= 8; x += 2) {
    for (let a = 0; a < 5; a++) {
      const th = (a / 5) * Math.PI * 2 + x;
      const ion = new THREE.Mesh(ionGeo, ionMat);
      ion.position.set(x, 1.1 * Math.cos(th), 1.1 * Math.sin(th));
      group.add(ion);
    }
  }

  // electrons
  const electrons = [];
  const eGeo = new THREE.SphereGeometry(0.14, 8, 6);
  const eMat = new THREE.MeshBasicMaterial({ color: PALETTE.cyan });
  for (let i = 0; i < n; i++) {
    const e = new THREE.Mesh(eGeo, eMat);
    e.userData = {
      v: 0.8 + Math.random() * 0.8,
      th: Math.random() * Math.PI * 2,
      r: 0.4 + Math.random() * 0.9,
      jitter: 2.5 / tau,
    };
    e.position.set(-9 + Math.random() * 18, 0, 0);
    electrons.push(e);
    group.add(e);
  }
  const lbl = makeTextSprite(`R ∝ L / (n τ A) — ${n} carriers`, { color: '#cbd5f5', size: 2.4 });
  lbl.position.set(0, 3.2, 0);
  group.add(lbl);

  return {
    group,
    update(t, dt = 0.016) {
      for (const e of electrons) {
        const u = e.userData;
        e.position.x += u.v * dt * 2;
        u.th += u.jitter * dt * (Math.random() - 0.5) * 4;
        e.position.y = u.r * Math.cos(u.th);
        e.position.z = u.r * Math.sin(u.th);
        if (e.position.x > 9) e.position.x = -9;
      }
    },
  };
}

/* E223 — C = εA/d : parallel-plate capacitor. */
export function buildE223(params) {
  const group = new THREE.Group();
  const d = params.d, A = params.A;
  const side = Math.sqrt(A) * 2;
  group.add(makeGrid(20, 20));

  const plateGeo = new THREE.BoxGeometry(side, 0.15, side);
  const top = new THREE.Mesh(plateGeo, new THREE.MeshBasicMaterial({
    color: PALETTE.bad, transparent: true, opacity: 0.55,
  }));
  top.position.y = d / 2;
  const bot = new THREE.Mesh(plateGeo, new THREE.MeshBasicMaterial({
    color: PALETTE.cyan, transparent: true, opacity: 0.55,
  }));
  bot.position.y = -d / 2;
  group.add(top, bot);

  // field lines between plates
  const lines = Math.min(24, Math.round(A * 2.4));
  for (let i = 0; i < lines; i++) {
    const fx = (Math.random() - 0.5) * side * 0.8;
    const fz = (Math.random() - 0.5) * side * 0.8;
    group.add(makeLine(
      [new THREE.Vector3(fx, d / 2, fz), new THREE.Vector3(fx, -d / 2, fz)],
      PALETTE.warn, 0.35));
  }
  const lT = makeTextSprite('+', { color: '#f87171', size: 2.4, font: 72 });
  lT.position.set(0, d / 2 + 1, 0);
  const lB = makeTextSprite('−', { color: '#22d3ee', size: 2.4, font: 72 });
  lB.position.set(0, -d / 2 - 1, 0);
  const cap = makeTextSprite(`C = εA/d = ${(A / d).toFixed(2)}ε`, { color: '#fbbf24', size: 2.6 });
  cap.position.set(0, d / 2 + 2.6, 0);
  group.add(lT, lB, cap);

  return { group, update(t) { group.rotation.y = t * 0.1; } };
}

/* E224 — V = −L di/dt : inductor opposing the change. */
export function buildE224(params) {
  const group = new THREE.Group();
  const turns = Math.round(params.turns), freq = params.freq;
  group.add(makeGrid(20, 20));

  // coil helix
  const pts = [];
  for (let i = 0; i <= turns * 60; i++) {
    const th = (i / 60) * Math.PI * 2;
    pts.push(new THREE.Vector3(-7 + 14 * (i / (turns * 60)), 1.2 * Math.cos(th), 1.2 * Math.sin(th)));
  }
  const coil = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 60, 0.09, 6, false),
    new THREE.MeshBasicMaterial({ color: PALETTE.warn })
  );
  group.add(coil);

  const iFn = t => Math.sin(freq * t);
  const diFn = t => freq * Math.cos(freq * t);

  // current bead running the coil
  const bead = makePoint(PALETTE.cyan, 0.26);
  group.add(bead);
  // induced EMF arrow below
  const emf = makeArrow(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -2.6, 0), 2, PALETTE.bad);
  group.add(emf);
  const lI = makeTextSprite('i(t) →', { color: '#22d3ee', size: 2.2 });
  lI.position.set(8.6, 0, 0);
  const lV = makeTextSprite('V = −L di/dt', { color: '#f87171', size: 2.2 });
  lV.position.set(0, -4, 0);
  group.add(lI, lV);

  return {
    group,
    update(t) {
      const frac = (t * 0.25) % 1;
      const idx = Math.floor(frac * (pts.length - 1));
      bead.position.copy(pts[idx]);
      const di = diFn(t);
      const L = 1.5;
      const vLen = Math.max(-3, Math.min(3, -L * di));
      emf.setDirection(new THREE.Vector3(Math.sign(vLen) || 1, 0, 0));
      emf.setLength(Math.abs(vLen) + 0.001, 0.5, 0.3);
      emf.position.set(0, -2.6, 0);
    },
  };
}

/* E227 — W = ∫ Q(v × B)·dl : work accumulated along a path through B. */
export function buildE227(params) {
  const group = new THREE.Group();
  const B = params.B;
  group.add(makeGrid(20, 20));

  // B field arrows (uniform, +z)
  for (let x = -8; x <= 8; x += 4) {
    for (let y = -2; y <= 4; y += 3) {
      group.add(makeArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(x, y, -6), 1.6 * B, PALETTE.magenta));
    }
  }
  const lB = makeTextSprite('B⃗', { color: '#f472b6', size: 2 });
  lB.position.set(-9, 4.4, -4);

  // path
  const path = x => 2.4 * Math.sin(0.45 * x) + 0.5;
  group.add(makeCurveTube(path, { color: PALETTE.accent, x0: -9, x1: 9, radius: 0.07 }));

  // force vectors along path + accumulated work curtain
  const accPts = [];
  let W = 0;
  const fArrows = [];
  for (let i = 0; i <= 24; i++) {
    const x = -9 + 18 * (i / 24);
    const dx = 0.1;
    const v = new THREE.Vector3(dx, path(x + dx) - path(x), 0).normalize();
    const f = new THREE.Vector3().crossVectors(v, new THREE.Vector3(0, 0, B));
    W += f.dot(v) * 0.75;
    accPts.push(new THREE.Vector3(x, -3.5 + Math.max(0, W), 0));
    if (i % 3 === 0) {
      const a = makeArrow(f.clone().normalize(), new THREE.Vector3(x, path(x), 0), 0.9, PALETTE.warn, 0.7);
      fArrows.push(a);
      group.add(a);
    }
  }
  const acc = makeLine(accPts, PALETTE.good, 1);
  group.add(acc);
  const lW = makeTextSprite('W accumulated', { color: '#4ade80', size: 2 });
  lW.position.set(5, accPts[accPts.length - 1].y + 0.9, 0);
  group.add(lW);

  const particle = makePoint(0xffffff, 0.3);
  group.add(particle);
  return {
    group,
    update(t) {
      const x = -9 + 18 * ((t * 0.09) % 1);
      particle.position.set(x, path(x), 0.2);
    },
  };
}

export const FIELD_VIZ = {
  E219: {
    title: 'The Lorentz Extraction Force',
    blurb: 'A charge in crossed material E and summed B fields follows a cycloid: the electric term drives the drift, the magnetic terms curl the path. F = Q·E + Q(v × ΣBₖ).',
    params: {
      E: { label: 'E strength', min: 0, max: 2, step: 0.1, value: 0.8 },
      B: { label: 'B strength', min: 0.2, max: 2, step: 0.1, value: 1 },
    },
    build: buildE219,
    camera: [4, 6, 18],
  },
  E222: {
    title: 'Drude Resistance of the Channel',
    blurb: 'Carriers drift through the lattice with mean free time τ. Resistance rises with path length L and falls with carrier count n, cross-section A, and τ.',
    params: {
      n: { label: 'carriers n', min: 12, max: 90, step: 1, value: 40 },
      tau: { label: 'relaxation τ', min: 0.4, max: 3, step: 0.1, value: 1.4 },
    },
    build: buildE222,
    camera: [0, 7, 16],
  },
  E223: {
    title: 'Capacity of the Separation',
    blurb: 'C = εA/d: stored charge grows with plate area and collapses with separation. The field density between the plates tracks A; the gap d sets the price of storage.',
    params: {
      d: { label: 'separation d', min: 1.5, max: 7, step: 0.1, value: 3.5 },
      A: { label: 'plate area A', min: 4, max: 16, step: 0.5, value: 9 },
    },
    build: buildE223,
    camera: [10, 6, 12],
  },
  E224: {
    title: 'Back-EMF of the Coil',
    blurb: 'The inductor answers every change in current with an opposing voltage: V = −L di/dt. The red arrow fights the change, never the current itself.',
    params: {
      turns: { label: 'coil turns', min: 3, max: 12, step: 1, value: 7 },
      freq: { label: 'drive frequency', min: 0.5, max: 3, step: 0.1, value: 1.2 },
    },
    build: buildE224,
    camera: [0, 6, 16],
  },
  E227: {
    title: 'Psychic Work on the Buffer',
    blurb: 'The work extracted along the buffer-class path integrates Q(v × B) step by step. Amber vectors are the local force; the green trace is the running total.',
    params: {
      B: { label: 'B strength', min: 0.3, max: 2.5, step: 0.1, value: 1.2 },
    },
    build: buildE227,
    camera: [0, 4, 19],
  },
};
