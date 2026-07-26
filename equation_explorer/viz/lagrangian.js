import * as THREE from 'three';
import {
  PALETTE, makeGrid, makeSurface, makeTextSprite, makePoint, makeLine,
} from './common.js';

/* E229 — L* = T − V − D + λ(τ − M_eff) : damped motion in a constrained potential. */
export function buildE229(params) {
  const group = new THREE.Group();
  const damping = params.damping, x0 = params.x0;
  const wallX = params.wall;

  const V = (x, z) => 0.08 * (x * x + z * z) - 2.2 * Math.exp(-0.3 * (x * x + z * z)) + 1.2 * Math.exp(-0.5 * ((x - 3.5) ** 2 + z * z));
  group.add(makeSurface(V, { x0: -7, x1: 7, z0: -7, z1: 7, nx: 50, nz: 50, color: PALETTE.accent, opacity: 0.45 }));
  group.add(makeGrid(14, 14));

  // constraint wall: the bead may not cross x = wall
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 5),
    new THREE.MeshBasicMaterial({ color: PALETTE.warn, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false })
  );
  wall.rotation.y = Math.PI / 2;
  wall.position.set(wallX, 1.2, 0);
  group.add(wall);
  const lW = makeTextSprite('constraint λ(τ − M_eff)', { color: '#fbbf24', size: 2 });
  lW.position.set(wallX, 4.2, 0);
  group.add(lW);

  const bead = makePoint(0xffffff, 0.32);
  group.add(bead);
  const trailPts = [];
  const trail = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: PALETTE.warn, transparent: true, opacity: 0.8 })
  );
  group.add(trail);

  // leapfrog integrator on the 1-D potential with viscous D and a hard wall
  let x = x0, v = 0, tPrev = 0;
  const dV = x => (V(x + 0.02, 0) - V(x - 0.02, 0)) / 0.04;

  return {
    group,
    update(t) {
      const dt = Math.min(t - tPrev, 0.05);
      tPrev = t;
      if (dt <= 0) return;
      const steps = 4;
      for (let i = 0; i < steps; i++) {
        const h = dt / steps;
        const a = -dV(x) - damping * v;
        v += a * h;
        x += v * h;
        if (x > wallX - 0.3) { x = wallX - 0.3; v = -Math.abs(v) * 0.35; }
        if (x < -6.8) { x = -6.8; v = Math.abs(v) * 0.35; }
      }
      const y = V(x, 0) + 0.35;
      bead.position.set(x, y, 0);
      trailPts.push(new THREE.Vector3(x, y + 0.02, 0));
      if (trailPts.length > 400) trailPts.shift();
      trail.geometry.setFromPoints(trailPts);
    },
  };
}

export const LAGRANGIAN_VIZ = {
  E229: {
    title: 'The Damped, Constrained Lagrangian',
    blurb: 'L* = T − V − D + λ(τ − M_eff): the bead falls into the potential well, the dissipation D bleeds its motion, and the constraint wall turns it back before resistance clears τ.',
    params: {
      damping: { label: 'dissipation D', min: 0.05, max: 1.2, step: 0.05, value: 0.35 },
      x0: { label: 'initial displacement', min: -6, max: 2, step: 0.2, value: -4 },
      wall: { label: 'constraint wall', min: 1, max: 6, step: 0.2, value: 3.5 },
    },
    build: buildE229,
    camera: [9, 8, 12],
  },
};
