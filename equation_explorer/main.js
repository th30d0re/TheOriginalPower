import * as THREE from 'three';
import { OrbitControls } from './vendor/three/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from './vendor/three/CSS3DRenderer.js';
import { VIZ } from './viz/registry.js';
import { disposeGroup } from './viz/common.js';

/* ---------------------------------------------------------- constants */

const RING_RADIUS = 150;        // radius of the chapter ring
const CLUSTER_RADIUS = 16;      // base radius of a chapter helix
const HELIX_STEP_Y = 3.4;       // vertical spacing inside a chapter helix
const CARD_SCALE = 0.02;        // CSS px -> world units
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/* ---------------------------------------------------------- state */

let chapters = [];
let equations = [];
const cards = new Map();        // equation id -> { object, element, eq, worldPos }
const chapterGroups = [];       // { center, color, index }
let focused = null;             // focused equation id
let drift = true;               // slow rotation of the whole field
let tween = null;               // active camera tween

/* ---------------------------------------------------------- renderers */

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05070d, 0.0016);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 4000);
camera.position.set(0, 52, 198);

const webgl = new THREE.WebGLRenderer({ antialias: true });
webgl.setPixelRatio(devicePixelRatio);
webgl.setSize(innerWidth, innerHeight);
document.getElementById('webgl').appendChild(webgl.domElement);

const css3d = new CSS3DRenderer();
css3d.setSize(innerWidth, innerHeight);
document.getElementById('css3d').appendChild(css3d.domElement);

const controls = new OrbitControls(camera, webgl.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 4;
controls.maxDistance = 900;

const field = new THREE.Group();
scene.add(field);

const chapterTagEls = [];   // DOM elements of chapter tags (hidden in viz mode)

/* ---------------------------------------------------------- helpers */

function chapterColor(i) {
  return `hsl(${(i * 137.508) % 360}, 70%, 62%)`;
}

function renderMath(el, latex, displayMode) {
  try {
    katex.render(latex, el, { displayMode, throwOnError: true, strict: false });
    return true;
  } catch {
    el.textContent = latex;
    el.closest('.eq-card')?.classList.add('raw-fallback');
    return false;
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function flyTo(camPos, target, done) {
  tween = {
    t: 0,
    fromPos: camera.position.clone(),
    toPos: camPos.clone(),
    fromTarget: controls.target.clone(),
    toTarget: target.clone(),
    done,
  };
}

/* ---------------------------------------------------------- starfield */

function buildStars() {
  const n = 1600;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 550 + Math.random() * 700;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x8ab4ff, size: 1.6, sizeAttenuation: true,
    transparent: true, opacity: 0.75, fog: false,
  });
  scene.add(new THREE.Points(geo, mat));
}

/* ---------------------------------------------------------- layout */

function buildField() {
  const nCh = chapters.length;
  const byChapter = new Map();
  for (const eq of equations) {
    if (!byChapter.has(eq.chapterIndex)) byChapter.set(eq.chapterIndex, []);
    byChapter.get(eq.chapterIndex).push(eq);
  }

  // outer guide ring
  const ringPts = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(a) * RING_RADIUS, 0, Math.sin(a) * RING_RADIUS));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(ringPts),
    new THREE.LineBasicMaterial({ color: 0x8ab4ff, transparent: true, opacity: 0.1 })
  );
  field.add(ring);

  for (const ch of chapters) {
    const i = ch.index;
    const angle = (i / nCh) * Math.PI * 2;
    const center = new THREE.Vector3(
      Math.cos(angle) * RING_RADIUS,
      Math.sin(i * 2.3) * 22,
      Math.sin(angle) * RING_RADIUS
    );
    const color = new THREE.Color(chapterColor(i));
    chapterGroups.push({ center, color, index: i });

    const eqs = byChapter.get(i) || [];
    const pts = [];

    eqs.forEach((eq, j) => {
      const a = j * GOLDEN_ANGLE;
      const r = CLUSTER_RADIUS * (0.55 + 0.45 * (j / Math.max(eqs.length - 1, 1)));
      const local = new THREE.Vector3(
        Math.cos(a) * r,
        (j - (eqs.length - 1) / 2) * HELIX_STEP_Y,
        Math.sin(a) * r
      );
      const p = center.clone().add(local);
      pts.push(p);

      const el = document.createElement('div');
      el.className = 'eq-card';
      el.style.setProperty('--accent', chapterColor(i));
      el.innerHTML = `<div class="eq-id">${eq.id} · ${escapeHtml(eq.label || 'unlabeled')}</div><div class="eq-math"></div>`;
      renderMath(el.querySelector('.eq-math'), eq.latex, true);
      shrinkToFit(el.querySelector('.eq-math'));

      const obj = new CSS3DObject(el);
      obj.position.copy(p);
      obj.scale.setScalar(CARD_SCALE);
      field.add(obj);

      cards.set(eq.id, { object: obj, element: el, eq, home: p });
      attachCardEvents(el, eq);
    });

    // constellation lines through the chapter's equations
    if (pts.length > 1) {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })
      );
      field.add(line);
    }

    // chapter ground ring
    const ringC = [];
    for (let k = 0; k <= 48; k++) {
      const a = (k / 48) * Math.PI * 2;
      ringC.push(new THREE.Vector3(
        center.x + Math.cos(a) * (CLUSTER_RADIUS + 4),
        center.y - (eqs.length * HELIX_STEP_Y) / 2 - 6,
        center.z + Math.sin(a) * (CLUSTER_RADIUS + 4)
      ));
    }
    field.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ringC),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 })
    ));

    // chapter tag
    const tag = document.createElement('div');
    tag.className = 'chapter-tag';
    tag.style.setProperty('--accent', chapterColor(i));
    tag.innerHTML = `<div class="tag-index">CHAPTER ${String(i + 1).padStart(2, '0')}</div><div class="tag-title">${escapeHtml(shortTitle(ch.title))}</div>`;
    tag.addEventListener('click', () => flyToChapter(i));
    chapterTagEls.push(tag);
    const tagObj = new CSS3DObject(tag);
    tagObj.position.copy(center).add(new THREE.Vector3(0, (eqs.length * HELIX_STEP_Y) / 2 + 14, 0));
    tagObj.scale.setScalar(CARD_SCALE * 2);
    field.add(tagObj);
  }
}

function shrinkToFit(mathEl) {
  const katexEl = mathEl.querySelector('.katex');
  if (!katexEl) return;
  // scrollWidth is layout space: immune to the CSS3D transform ancestors.
  // KaTeX ink overhangs the layout box (negative margins on sub/superscripts),
  // so scale with headroom instead of to the exact measured width.
  const w = katexEl.scrollWidth;
  const cs = getComputedStyle(mathEl);
  const max = (mathEl.clientWidth || 340)
    - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2;
  if (w > max) {
    const s = Math.max(max / (w * 1.12), 0.3);
    katexEl.style.transform = `scale(${s})`;
    katexEl.style.transformOrigin = 'center center';
    const h = katexEl.offsetHeight || katexEl.scrollHeight;
    if (h > 0) mathEl.style.height = `${h * s}px`;
    // cards clip (fixed size); the detail panel keeps its scroll fallback
    if (mathEl.closest('.eq-card')) mathEl.style.overflow = 'hidden';
  }
}

function shortTitle(title) {
  return title.length > 64 ? title.slice(0, 61) + '…' : title;
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/* ---------------------------------------------------------- interaction */

function attachCardEvents(el, eq) {
  let downX = 0, downY = 0;
  el.addEventListener('pointerdown', e => { downX = e.clientX; downY = e.clientY; });
  el.addEventListener('pointerup', e => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) < 6) focusEquation(eq.id);
  });
}

function cardWorldPos(id) {
  const c = cards.get(id);
  const v = new THREE.Vector3();
  c.object.getWorldPosition(v);
  return v;
}

function focusEquation(id, pushHash = true) {
  drift = false;
  focused = id;
  for (const [cid, c] of cards) c.element.classList.toggle('focused', cid === id);

  const target = cardWorldPos(id);
  // face normal of the card in world space: local +Z through the world quaternion
  const normal = new THREE.Vector3(0, 0, 1)
    .applyQuaternion(cards.get(id).object.getWorldQuaternion(new THREE.Quaternion()));
  const camPos = target.clone().add(normal.multiplyScalar(30)).add(new THREE.Vector3(0, 3, 0));
  flyTo(camPos, target);
  showDetail(id);
  if (pushHash) history.replaceState(null, '', `#${id}`);
}

function flyToChapter(i) {
  drift = false;
  const g = chapterGroups[i];
  const out = g.center.clone().setY(0).normalize();
  const camPos = g.center.clone().add(out.multiplyScalar(70)).add(new THREE.Vector3(0, 26, 0));
  flyTo(camPos, g.center.clone());
  document.querySelectorAll('#chapter-list li').forEach((li, k) => li.classList.toggle('active', k === i));
}

function unfocus() {
  focused = null;
  drift = true;
  document.getElementById('detail').classList.add('hidden');
  for (const c of cards.values()) c.element.classList.remove('focused');
  history.replaceState(null, '', location.pathname);
}

/* ---------------------------------------------------------- detail panel */

function showDetail(id) {
  const c = cards.get(id);
  const eq = c.eq;
  const accent = chapterColor(eq.chapterIndex);
  const panel = document.getElementById('detail');
  panel.classList.remove('hidden');
  panel.style.setProperty('--accent', accent);

  document.getElementById('detail-id').textContent = eq.id;
  document.getElementById('detail-chapter').textContent = eq.chapter;
  document.getElementById('detail-section').textContent = eq.section;
  document.getElementById('detail-label').textContent = eq.label ? `\\label{${eq.label}}` : '';
  document.getElementById('detail-raw').textContent = eq.latex;
  document.getElementById('open-viz').style.display = VIZ[eq.id] ? '' : 'none';

  const mathEl = document.getElementById('detail-math');
  mathEl.innerHTML = '';
  renderMath(mathEl, eq.latex, true);
  shrinkToFit(mathEl);
  // KaTeX fonts load asynchronously; re-measure once they are in
  document.fonts?.ready.then(() => shrinkToFit(mathEl));
}

function stepEquation(dir) {
  const idx = equations.findIndex(e => e.id === focused);
  const next = equations[(idx + dir + equations.length) % equations.length];
  focusEquation(next.id);
}

/* ---------------------------------------------------------- sidebar + search */

function buildSidebar() {
  const list = document.getElementById('chapter-list');
  for (const ch of chapters) {
    const count = equations.filter(e => e.chapterIndex === ch.index).length;
    const li = document.createElement('li');
    li.style.setProperty('--accent', chapterColor(ch.index));
    li.innerHTML = `<span class="dot"></span><span>${escapeHtml(shortTitle(ch.title))}</span><span class="n">${count}</span>`;
    li.addEventListener('click', () => flyToChapter(ch.index));
    list.appendChild(li);
  }
  document.getElementById('stat-count').textContent =
    `${equations.length} equations · ${chapters.length} chapters`;

  const vlist = document.getElementById('viz-list');
  for (const [id, def] of Object.entries(VIZ)) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="dot"></span><span>${escapeHtml(id)} · ${escapeHtml(def.title)}</span>`;
    li.addEventListener('click', () => enterViz(id));
    vlist.appendChild(li);
  }
}

function applyFilter(q) {
  const query = q.trim().toLowerCase();
  let hits = 0;
  for (const c of cards.values()) {
    const eq = c.eq;
    const match = !query ||
      eq.latex.toLowerCase().includes(query) ||
      eq.id.toLowerCase().includes(query) ||
      eq.label.toLowerCase().includes(query) ||
      eq.section.toLowerCase().includes(query) ||
      eq.chapter.toLowerCase().includes(query);
    c.element.classList.toggle('dimmed', !match);
    if (match) hits++;
  }
  document.getElementById('search-count').textContent = query ? `${hits} shown` : '';
}

/* ---------------------------------------------------------- viz mode */

const vizScene = new THREE.Scene();
const vizCamera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 2000);
let vizControls = null;
let vizActive = null;          // { id, def, params, group, update }
let rebuildTimer = null;

function vizParamsDefaults(def) {
  const p = {};
  for (const [k, v] of Object.entries(def.params)) p[k] = v.value;
  return p;
}

function setFieldDomVisible(visible) {
  for (const c of cards.values()) c.element.style.display = visible ? '' : 'none';
  for (const el of chapterTagEls) el.style.display = visible ? '' : 'none';
}

function enterViz(id) {
  const def = VIZ[id];
  if (!def) return;
  drift = false;
  tween = null;
  setFieldDomVisible(false);

  vizScene.clear();
  vizActive = { id, def, params: vizParamsDefaults(def), group: null, update: null };

  // the equation itself, floating over its visualization
  const eq = equations.find(e => e.id === id);
  const plaque = document.createElement('div');
  plaque.className = 'eq-card viz-plaque';
  plaque.style.setProperty('--accent', '#fbbf24');
  plaque.innerHTML = `<div class="eq-id">${id} · ${escapeHtml(eq.label || '')}</div><div class="eq-math"></div>`;
  renderMath(plaque.querySelector('.eq-math'), eq.latex, true);
  const plaqueObj = new CSS3DObject(plaque);
  plaqueObj.position.set(0, -8.2, 0);
  plaqueObj.scale.setScalar(0.02);
  vizScene.add(plaqueObj);
  vizActive.plaque = plaqueObj;

  buildVizGroup();

  const [cx, cy, cz] = def.camera;
  vizCamera.position.set(cx, cy, cz);
  if (vizControls) vizControls.dispose();
  vizControls = new OrbitControls(vizCamera, webgl.domElement);
  vizControls.enableDamping = true;
  vizControls.dampingFactor = 0.06;
  controls.enabled = false;

  document.getElementById('detail').classList.add('hidden');
  showVizOverlay(def);
  history.replaceState(null, '', `#viz=${id}`);
}

function buildVizGroup() {
  if (!vizActive) return;
  const { def, params } = vizActive;
  if (vizActive.group) {
    vizScene.remove(vizActive.group);
    disposeGroup(vizActive.group);
  }
  const built = def.build(params);
  vizActive.group = built.group;
  vizActive.update = built.update || (() => {});
  vizScene.add(vizActive.group);
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(buildVizGroup, 140);
}

function showVizOverlay(def) {
  const ov = document.getElementById('viz-overlay');
  ov.classList.remove('hidden');
  document.getElementById('viz-title').textContent = def.title;
  document.getElementById('viz-blurb').textContent = def.blurb;
  const box = document.getElementById('viz-params');
  box.innerHTML = '';
  for (const [key, p] of Object.entries(def.params)) {
    const row = document.createElement('div');
    row.className = 'param-row';
    row.innerHTML = `<label>${escapeHtml(p.label)}</label>` +
      `<input type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}">` +
      `<span>${p.value}</span>`;
    const input = row.querySelector('input');
    const val = row.querySelector('span');
    input.addEventListener('input', () => {
      vizActive.params[key] = parseFloat(input.value);
      val.textContent = input.value;
      scheduleRebuild();
    });
    box.appendChild(row);
  }
}

function exitViz() {
  if (!vizActive) return;
  vizActive = null;
  vizScene.clear();
  document.getElementById('viz-overlay').classList.add('hidden');
  if (vizControls) { vizControls.dispose(); vizControls = null; }
  controls.enabled = true;
  setFieldDomVisible(true);
  if (focused) {
    document.getElementById('detail').classList.remove('hidden');
    history.replaceState(null, '', `#${focused}`);
  } else {
    drift = true;
    history.replaceState(null, '', location.pathname);
  }
}

/* ---------------------------------------------------------- events */

document.getElementById('search').addEventListener('input', e => applyFilter(e.target.value));
document.getElementById('detail-close').addEventListener('click', unfocus);
document.getElementById('prev-eq').addEventListener('click', () => stepEquation(-1));
document.getElementById('next-eq').addEventListener('click', () => stepEquation(1));
document.getElementById('open-viz').addEventListener('click', () => { if (focused) enterViz(focused); });
document.getElementById('viz-back').addEventListener('click', exitViz);
document.getElementById('copy-latex').addEventListener('click', async e => {
  if (!focused) return;
  await navigator.clipboard.writeText(cards.get(focused).eq.latex);
  e.target.textContent = 'Copied';
  setTimeout(() => { e.target.textContent = 'Copy LaTeX'; }, 1200);
});

addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'Escape') { vizActive ? exitViz() : unfocus(); return; }
  if (vizActive) return;
  if ((e.key === 'v' || e.key === 'V') && focused && VIZ[focused]) enterViz(focused);
  if (focused && e.key === 'ArrowRight') stepEquation(1);
  if (focused && e.key === 'ArrowLeft') stepEquation(-1);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  vizCamera.aspect = camera.aspect;
  vizCamera.updateProjectionMatrix();
  webgl.setSize(innerWidth, innerHeight);
  css3d.setSize(innerWidth, innerHeight);
});

addEventListener('hashchange', () => {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h.startsWith('viz=')) { enterViz(h.slice(4)); return; }
  if (vizActive) exitViz();
  if (h && cards.has(h)) focusEquation(h, false);
});

/* ---------------------------------------------------------- loop */

const clock = new THREE.Clock();
let tTotal = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  tTotal += dt;

  if (vizActive) {
    vizActive.update(tTotal, dt);
    vizActive.plaque?.lookAt(vizCamera.position);
    vizControls.update();
    webgl.render(vizScene, vizCamera);
    css3d.render(vizScene, vizCamera);
    return;
  }

  if (drift && !tween) field.rotation.y += dt * 0.012;

  if (tween) {
    tween.t = Math.min(tween.t + dt / 1.1, 1);
    const k = easeInOutCubic(tween.t);
    camera.position.lerpVectors(tween.fromPos, tween.toPos, k);
    controls.target.lerpVectors(tween.fromTarget, tween.toTarget, k);
    if (tween.t >= 1) { tween.done?.(); tween = null; }
  }

  controls.update();
  webgl.render(scene, camera);
  css3d.render(scene, camera);
}

/* ---------------------------------------------------------- boot */

async function boot() {
  const res = await fetch('./data/equations.json');
  const data = await res.json();
  chapters = data.chapters;
  equations = data.equations;

  buildStars();
  buildField();
  buildSidebar();
  animate();

  // re-measure card math once KaTeX fonts finish loading
  document.fonts?.ready.then(() => {
    document.querySelectorAll('.eq-math').forEach(shrinkToFit);
  });

  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith('viz=')) enterViz(hash.slice(4));
  else if (hash && cards.has(hash)) focusEquation(hash, false);
}

boot();
