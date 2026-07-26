import * as THREE from 'three';

/* Shared helpers for the equation visualization scenes.
 * Scene convention: units roughly in [-10, 10], camera placed by the caller.
 */

export const PALETTE = {
  accent: 0x8ab4ff,
  good: 0x4ade80,
  bad: 0xf87171,
  warn: 0xfbbf24,
  magenta: 0xf472b6,
  cyan: 0x22d3ee,
  dim: 0x334155,
};

export function disposeGroup(group) {
  group.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      for (const m of Array.isArray(obj.material) ? obj.material : [obj.material]) {
        if (m.map) m.map.dispose();
        m.dispose();
      }
    }
  });
  group.clear();
}

export function makeTextSprite(text, { color = '#8ab4ff', size = 1, font = 42 } = {}) {
  const pad = 12;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `600 ${font}px Menlo, monospace`;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  canvas.width = w;
  canvas.height = font + pad * 2;
  const c2 = canvas.getContext('2d');
  c2.font = `600 ${font}px Menlo, monospace`;
  c2.fillStyle = color;
  c2.textBaseline = 'middle';
  c2.fillText(text, pad, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  const aspect = canvas.height / canvas.width;
  sprite.scale.set(size, size * aspect, 1);
  return sprite;
}

export function makeGrid(size = 20, div = 20, color = 0x1e293b) {
  const g = new THREE.GridHelper(size, div, color, color);
  g.material.transparent = true;
  g.material.opacity = 0.5;
  return g;
}

export function makeArrow(dir, origin, length, color, headScale = 1) {
  const arrow = new THREE.ArrowHelper(
    dir.clone().normalize(), origin, length, color,
    0.35 * headScale * Math.min(length, 1.5), 0.2 * headScale * Math.min(length, 1.5)
  );
  arrow.line.material.transparent = true;
  arrow.cone.material.transparent = true;
  return arrow;
}

/* Ribbon surface: y = fn(x) extruded down to y0, as a glowing curtain. */
export function makeCurveTube(fn, { x0 = -10, x1 = 10, n = 200, color = PALETTE.accent, radius = 0.06, z = 0 } = {}) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * (i / n);
    pts.push(new THREE.Vector3(x, fn(x), z));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, n, radius, 6, false);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
  return new THREE.Mesh(geo, mat);
}

/* Vertical curtain dropping from a curve y=fn(x) to y0. */
export function makeCurtain(fn, { x0 = -10, x1 = 10, n = 120, y0 = -4, color = PALETTE.accent, opacity = 0.18, z = 0 } = {}) {
  const verts = [];
  const idx = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * (i / n);
    verts.push(x, fn(x), z, x, y0, z);
    if (i < n) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mat = new THREE.MeshBasicMaterial({
    color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

/* Parametric surface z=f(x,zgrid) -> y up. fn(x, z) => y. */
export function makeSurface(fn, { x0 = -8, x1 = 8, z0 = -8, z1 = 8, nx = 60, nz = 60, color = PALETTE.accent, opacity = 0.55 } = {}) {
  const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0, nx, nz);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color(color);
  let minY = Infinity, maxY = -Infinity;
  const ys = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const y = fn(pos.getX(i), pos.getZ(i));
    ys[i] = y;
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, ys[i]);
    const k = maxY > minY ? (ys[i] - minY) / (maxY - minY) : 0.5;
    colors[i * 3] = c.r * (0.35 + 0.65 * k);
    colors[i * 3 + 1] = c.g * (0.35 + 0.65 * k);
    colors[i * 3 + 2] = c.b * (0.35 + 0.65 * k);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const wire = new THREE.Mesh(geo.clone(), new THREE.MeshBasicMaterial({
    color, wireframe: true, transparent: true, opacity: 0.12,
  }));
  const g = new THREE.Group();
  g.add(mesh, wire);
  return g;
}

export function makePoint(color = 0xffffff, size = 0.3) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(size, 16, 12),
    new THREE.MeshBasicMaterial({ color })
  );
}

export function makeLine(points, color, opacity = 0.9) {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geo, new THREE.LineBasicMaterial({
    color, transparent: true, opacity,
  }));
}

/* Time cursor: a vertical bar that sweeps the x range in update(). */
export function makeSweepCursor({ x0 = -10, x1 = 10, height = 12, color = 0xffffff } = {}) {
  const geo = new THREE.PlaneGeometry(0.08, height);
  const mat = new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.y = height / 2 - 4;
  return {
    mesh: m,
    set(frac) { m.position.x = x0 + (x1 - x0) * (frac % 1); },
  };
}
