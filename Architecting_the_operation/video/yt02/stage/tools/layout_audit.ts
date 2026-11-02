// Layout audit for Stage scenes rendered to static markup.
//
// Static markup carries no layout, so every audited element declares its own absolute box
// (1920 × 1080 frame coordinates) with data attributes. Scenes derive these values from the
// same layout constants that position the element, so the declaration and the drawing agree.
//
//   data-text="<id>"    a text box. Optional data-fit="<mono|sans> <px> <letterSpacing> <lineHeight>"
//                       lets the audit estimate whether the element's text fits its box.
//   data-shape="<id>"   a drawn shape. data-role picks the collision rule:
//                         frame  an outline or panel. Text and marks sit fully inside or fully outside.
//                         mark   a solid glyph or node cluster. Text never overlaps it; marks of a
//                                different data-layer never overlap it.
//                         line   a stroke. data-points="x,y x,y …" gives its polyline; no text box
//                                may be crossed. A leader may touch a label edge (2 px tolerance).
//   data-box="x y w h"  the absolute box (required on both kinds).
//
// Effective opacity is the product of every ancestor's style opacity and SVG opacity attribute,
// with display:none and visibility:hidden as zero. Rules apply to elements above the threshold.

export type AuditRole = 'text' | 'frame' | 'mark' | 'line';
export type AuditBox = {x: number; y: number; w: number; h: number};
export type AuditItem = AuditBox & {
  id: string;
  role: AuditRole;
  layer: string;
  opacity: number;
  text: string;
  points?: [number, number][];
  fit?: {family: 'mono' | 'sans'; size: number; letterSpacing: number; lineHeight: number};
};

export const SAFE_AREA = {x0: 60, y0: 70, x1: 1860, y1: 1010} as const;
export const NOTCH_ZONES: readonly AuditBox[] = [
  {x: 880, y: 0, w: 160, h: 90},
  {x: 880, y: 990, w: 160, h: 90},
];
export const AUDIT_OPACITY_THRESHOLD = 0.05;

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const decode = (value: string) => value
  .replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

function attributes(source: string) {
  const out: Record<string, string> = {};
  for (const match of source.matchAll(/([^\s=/]+)(?:="([^"]*)")?/g)) out[match[1]] = decode(match[2] ?? '');
  return out;
}

function ownOpacity(attrs: Record<string, string>) {
  let value = 1;
  const style = attrs.style ?? '';
  const styleOpacity = style.match(/(?:^|;)\s*opacity:\s*([-0-9.eE+]+)/);
  if (styleOpacity) value *= Number(styleOpacity[1]);
  if (/(?:^|;)\s*display:\s*none/.test(style) || /(?:^|;)\s*visibility:\s*hidden/.test(style)) value = 0;
  if (attrs.opacity !== undefined) value *= Number(attrs.opacity);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1;
}

function parseBox(value: string | undefined, id: string): AuditBox {
  const parts = (value ?? '').trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isFinite(part))) throw new Error(`layout audit: element "${id}" has no valid data-box`);
  return {x: parts[0], y: parts[1], w: parts[2], h: parts[3]};
}

/** Returns every data-text and data-shape element of the markup with its absolute box and effective opacity. */
export function auditItems(html: string): AuditItem[] {
  const items: AuditItem[] = [];
  const stack: {tag: string; opacity: number; item?: AuditItem}[] = [];
  const token = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g;
  for (const match of html.matchAll(token)) {
    if (match[5] !== undefined) {
      const text = decode(match[5]);
      for (const entry of stack) if (entry.item) entry.item.text += text;
      continue;
    }
    const [, closing, rawTag, rawAttrs, selfClosing] = match;
    const tag = rawTag.toLowerCase();
    if (closing) {
      for (let index = stack.length - 1; index >= 0; index--) if (stack[index].tag === tag) { stack.length = index; break; }
      continue;
    }
    const attrs = attributes(rawAttrs);
    const opacity = (stack.length ? stack[stack.length - 1].opacity : 1) * ownOpacity(attrs);
    let item: AuditItem | undefined;
    const textId = attrs['data-text'], shapeId = attrs['data-shape'];
    if (textId !== undefined || shapeId !== undefined) {
      const id = textId ?? shapeId!;
      const role = (textId !== undefined ? 'text' : (attrs['data-role'] ?? 'mark')) as AuditRole;
      if (!['text', 'frame', 'mark', 'line'].includes(role)) throw new Error(`layout audit: "${id}" has unknown role ${role}`);
      item = {id, role, layer: attrs['data-layer'] ?? id, opacity, text: '', ...parseBox(attrs['data-box'], id)};
      if (attrs['data-points']) item.points = attrs['data-points'].trim().split(/\s+/).map(pair => pair.split(',').map(Number) as [number, number]);
      if (role === 'line' && !item.points) throw new Error(`layout audit: line "${id}" has no data-points`);
      if (attrs['data-fit']) {
        const [family, size, letterSpacing, lineHeight] = attrs['data-fit'].split(/\s+/);
        item.fit = {family: family === 'sans' ? 'sans' : 'mono', size: Number(size), letterSpacing: Number(letterSpacing), lineHeight: Number(lineHeight)};
      }
      items.push(item);
    }
    if (!selfClosing && !VOID.has(tag)) stack.push({tag, opacity, item});
  }
  for (const item of items) item.text = item.text.replace(/\s+/g, ' ').trim();
  return items;
}

const intersects = (a: AuditBox, b: AuditBox, tolerance = 0) =>
  a.x + tolerance < b.x + b.w && a.x + a.w - tolerance > b.x && a.y + tolerance < b.y + b.h && a.y + a.h - tolerance > b.y;
const contains = (outer: AuditBox, inner: AuditBox, tolerance = 0.5) =>
  inner.x >= outer.x - tolerance && inner.y >= outer.y - tolerance &&
  inner.x + inner.w <= outer.x + outer.w + tolerance && inner.y + inner.h <= outer.y + outer.h + tolerance;

function segmentCrossesBox(a: [number, number], b: [number, number], box: AuditBox) {
  // Liang–Barsky clip against the open box.
  let t0 = 0, t1 = 1;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const edges: [number, number][] = [[-dx, a[0] - box.x], [dx, box.x + box.w - a[0]], [-dy, a[1] - box.y], [dy, box.y + box.h - a[1]]];
  for (const [p, q] of edges) {
    if (p === 0) { if (q <= 0) return false; continue; }
    const r = q / p;
    if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
    else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return t1 - t0 > 1e-6;
}

const shrink = (box: AuditBox, by: number): AuditBox => ({x: box.x + by, y: box.y + by, w: Math.max(0, box.w - 2 * by), h: Math.max(0, box.h - 2 * by)});
const lineCrosses = (line: AuditItem, box: AuditBox) => {
  const points = line.points!, inner = shrink(box, 2);
  for (let index = 1; index < points.length; index++) if (segmentCrossesBox(points[index - 1], points[index], inner)) return true;
  return false;
};

/** Estimated line count and the height the text needs, for an element that declares data-fit. */
export function fitEstimate(item: AuditItem) {
  if (!item.fit) return undefined;
  const advance = (item.fit.family === 'mono' ? 0.6 : 0.56) * item.fit.size + item.fit.letterSpacing;
  const maxChars = Math.max(1, Math.floor((item.w + 1) / advance));
  let lines = 1, current = 0, overflow = false;
  for (const word of item.text.split(' ').filter(Boolean)) {
    const length = [...word].length;
    if (length > maxChars) overflow = true;
    if (current === 0) current = length;
    else if (current + 1 + length <= maxChars) current += 1 + length;
    else { lines += 1; current = length; }
  }
  const needed = lines * item.fit.size * item.fit.lineHeight;
  return {lines, needed, overflow: overflow || needed > item.h + 1};
}

const name = (item: AuditItem) => `${item.role} "${item.id}"`;

/** Returns every rule violation in the markup; an empty list means the frame passes. */
export function auditLayout(html: string, threshold = AUDIT_OPACITY_THRESHOLD): string[] {
  const visible = auditItems(html).filter(item => item.opacity > threshold);
  const problems: string[] = [];
  for (const item of visible) {
    if (item.x < SAFE_AREA.x0 || item.y < SAFE_AREA.y0 || item.x + item.w > SAFE_AREA.x1 || item.y + item.h > SAFE_AREA.y1)
      problems.push(`${name(item)} [${item.x} ${item.y} ${item.w} ${item.h}] leaves the safe area`);
    for (const notch of NOTCH_ZONES) if (intersects(item, notch)) problems.push(`${name(item)} enters a border-notch zone`);
    const fit = fitEstimate(item);
    if (fit?.overflow) problems.push(`${name(item)} "${item.text}" needs about ${fit.lines} line(s), ${Math.ceil(fit.needed)} px, in a ${item.w} × ${item.h} box`);
  }
  for (let i = 0; i < visible.length; i++) for (let j = i + 1; j < visible.length; j++) {
    const a = visible[i], b = visible[j];
    const pair = (role: AuditRole) => a.role === role ? [a, b] : [b, a];
    const roles = new Set([a.role, b.role]);
    if (a.role === 'text' && b.role === 'text') {
      if (intersects(a, b, 0.5)) problems.push(`${name(a)} overlaps ${name(b)}`);
    } else if (roles.has('text') && roles.has('line')) {
      const [text, line] = pair('text');
      if (lineCrosses(line, text)) problems.push(`${name(line)} crosses ${name(text)}`);
    } else if (roles.has('text') && roles.has('mark')) {
      if (intersects(a, b, 0.5)) problems.push(`${name(a)} overlaps ${name(b)}`);
    } else if (roles.has('text') && roles.has('frame')) {
      const [text, frame] = pair('text');
      if (intersects(text, frame, 0.5) && !contains(frame, text)) problems.push(`${name(text)} crosses the edge of ${name(frame)}`);
    } else if (a.role === 'mark' && b.role === 'mark') {
      if (a.layer !== b.layer && intersects(a, b, 0.5)) problems.push(`${name(a)} overlaps ${name(b)}`);
    } else if (roles.has('mark') && roles.has('frame')) {
      const [mark, frame] = pair('mark');
      if (intersects(mark, frame, 0.5) && !contains(frame, mark)) problems.push(`${name(mark)} crosses the edge of ${name(frame)}`);
    }
  }
  return problems;
}

/** Proves that the audit detects each rule on known-bad markup. Throws when a rule goes undetected. */
export function auditSelfTest() {
  const text = (id: string, box: string, extra = '') => `<div data-text="${id}" data-box="${box}"${extra}>${id}</div>`;
  const cases: [string, string, RegExp][] = [
    ['text over text', text('a', '100 100 200 40') + text('b', '150 120 200 40'), /overlaps text "b"/],
    ['line through text', text('a', '100 100 200 40') + '<path data-shape="l" data-role="line" data-box="0 0 400 400" data-points="50,120 400,120"/>', /crosses text "a"/],
    ['text under a mark', text('a', '100 100 200 40') + '<i data-shape="m" data-role="mark" data-box="120 90 30 30"></i>', /overlaps mark "m"|mark "m"/],
    ['mark cut by a frame edge', '<i data-shape="m" data-role="mark" data-box="100 100 40 40"></i><div data-shape="f" data-role="frame" data-box="120 50 300 300"></div>', /crosses the edge of frame "f"/],
    ['marks of two layers', '<i data-shape="m" data-role="mark" data-layer="p" data-box="100 100 40 40"></i><i data-shape="n" data-role="mark" data-layer="q" data-box="120 110 40 40"></i>', /overlaps mark/],
    ['safe area', text('a', '40 100 200 40'), /leaves the safe area/],
    ['notch zone', text('a', '900 75 100 30'), /border-notch/],
    ['text fit', `<div data-text="a" data-box="100 100 60 30" data-fit="mono 20 0 1.25">TOO LONG FOR BOX</div>`, /needs about/],
  ];
  for (const [label, html, expected] of cases) {
    const found = auditLayout(html).join('\n');
    if (!expected.test(found)) throw new Error(`layout audit self-test "${label}" was not detected: ${found || '(none)'}`);
  }
  const faded = `<div style="opacity:0.04">${text('a', '100 100 200 40')}</div>` + text('b', '150 120 200 40');
  if (auditLayout(faded).length) throw new Error('layout audit self-test: an ancestor at opacity 0.04 must exempt its children');
  const nested = `<div style="opacity:0.5"><svg opacity="0.5">${text('a', '100 100 200 40')}</svg></div>`;
  if (Math.abs(auditItems(nested)[0].opacity - 0.25) > 1e-9) throw new Error('layout audit self-test: opacity is not multiplied through ancestors');
  return cases.length + 2;
}
