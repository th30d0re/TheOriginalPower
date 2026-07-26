import * as THREE from 'three';
import {
  PALETTE, makeGrid, makeTextSprite, makeLine, makeSweepCursor,
} from './common.js';

/* E226 — I_E(t) = Σ ρ_k A_k cos(ωt + φ_k) : the interference carrier. */
export function buildE226(params) {
  const group = new THREE.Group();
  const N = Math.round(params.N), w = params.omega;
  group.add(makeGrid(20, 20));

  const colors = [PALETTE.cyan, PALETTE.magenta, PALETTE.warn, PALETTE.good, 0xa78bfa, 0xfb923c];
  const comps = [];
  for (let k = 0; k < N; k++) {
    comps.push({
      rho: 1 - k * 0.12,
      A: 1.6 / (1 + k * 0.55),
      phi: k * 1.9,
      color: colors[k % colors.length],
    });
  }
  const spacing = 2.6;
  const topY = (comps.length - 1) * spacing * 0.5;

  const n = 320;
  const x0 = -10, x1 = 10;
  const compLines = [];
  comps.forEach((c, k) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((n + 1) * 3), 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: c.color, transparent: true, opacity: 0.75,
    }));
    const baseY = topY - k * spacing;
    line.userData = { baseY, comp: c };
    compLines.push(line);
    group.add(line);
    const lbl = makeTextSprite(`ρ${k + 1}A${k + 1}cos(ωt+φ${k + 1})`, {
      color: '#' + new THREE.Color(c.color).getHexString(), size: 1.5,
    });
    lbl.position.set(-13.4, baseY, 0);
    group.add(lbl);
  });

  // carrier sum
  const sumGeo = new THREE.BufferGeometry();
  sumGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((n + 1) * 3), 3));
  const sumLine = new THREE.Line(sumGeo, new THREE.LineBasicMaterial({ color: 0xffffff }));
  const sumY = -topY - 2.8;
  group.add(sumLine);
  const lSum = makeTextSprite('I_E(t) = Σ', { color: '#e2e8f0', size: 2.2 });
  lSum.position.set(-13, sumY, 0);
  group.add(lSum);

  const cursor = makeSweepCursor({ x0, x1, height: topY * 2 + 7 });
  cursor.mesh.position.y = 0.5;
  group.add(cursor.mesh);

  return {
    group,
    update(t) {
      for (const line of compLines) {
        const { baseY, comp } = line.userData;
        const pos = line.geometry.attributes.position;
        for (let i = 0; i <= n; i++) {
          const x = x0 + (x1 - x0) * (i / n);
          pos.setXYZ(i, x, baseY + comp.rho * comp.A * Math.cos(w * x + comp.phi + t * 1.2), 0);
        }
        pos.needsUpdate = true;
      }
      const pos = sumLine.geometry.attributes.position;
      for (let i = 0; i <= n; i++) {
        const x = x0 + (x1 - x0) * (i / n);
        let s = 0;
        for (const c of comps) s += c.rho * c.A * Math.cos(w * x + c.phi + t * 1.2);
        pos.setXYZ(i, x, sumY + s / Math.max(1, N * 0.55), 0);
      }
      pos.needsUpdate = true;
      cursor.set(t * 0.05);
    },
  };
}

export const WAVE_VIZ = {
  E226: {
    title: 'The Spectral Carrier',
    blurb: 'Each electoral cycle injects one weighted cosine; the white trace is their interference sum I_E(t). Phase offsets φₖ decide where the carrier reinforces and where it cancels.',
    params: {
      N: { label: 'components N', min: 2, max: 6, step: 1, value: 4 },
      omega: { label: 'ω tempo', min: 0.4, max: 2.2, step: 0.05, value: 1 },
    },
    build: buildE226,
    camera: [0, 5, 21],
  },
};
