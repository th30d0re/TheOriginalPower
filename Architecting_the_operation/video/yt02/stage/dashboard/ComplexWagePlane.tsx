import React, {useContext, useId, useRef, useState} from 'react';
import {ClockContext, MathText, type InstrumentMode, type Rect} from '@stage';
import {color, Tokens} from '../tokens';

// Centred in the 1856×968 map clip [x=32, y=84]:
// x = 32 + (1856 - 1400)/2 = 260, y = 84 + (968 - 860)/2 = 138
export const WAGE_EXPANDED_BOX: Rect = {
  x: 260,
  y: 138,
  width: 1400,
  height: 860,
};

export const WageModeControlContext = React.createContext<((mode: InstrumentMode | null) => void) | null>(null);

// Port of the supplied artifact: buildStatic, clipDanger, elite, safeArcs, regime, updateUI and render.
export type WageModel = {
  M0: number;
  tau: number;
  a: number;
  b: number;
  smax: number;
  m: number;
  s: number;
  q3?: string;
  q4?: string;
  zone?: boolean;
  ring?: boolean;
  elite?: boolean;
};

export const wageModel: WageModel = {
  M0: 60,
  tau: 40,
  a: 1,
  b: 0.7,
  smax: 80,
  m: 0,
  s: 60,
  q3: 'Buffer demotion',
  q4: 'Solidarity side',
  zone: true,
  ring: true,
  elite: true,
};

const R = 100;
const K = 3;
const CX = 400;
const CY = 450;
const ROMAN = ['', 'I', 'II', 'III', 'IV'] as const;

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function sx(s: number): number {
  return CX + s * K;
}

function sy(m: number): number {
  return CY + m * K;
}

function deg(r: number): number {
  return (r * 180) / Math.PI;
}

function rad(d: number): number {
  return (d * Math.PI) / 180;
}

function mag(m: number, s: number): number {
  return Math.hypot(m, s);
}

function theta(m: number, s: number): number {
  return deg(Math.atan2(s, m));
}

export function fmt(n: number, d = 0): string {
  const f = Math.pow(10, d);
  const v = Math.round(n * f) / f;
  return (v < 0 ? '−' : '') + Math.abs(v).toFixed(d);
}

function quad(m: number, s: number): 1 | 2 | 3 | 4 {
  if (m >= 0 && s >= 0) return 1;
  if (m < 0 && s >= 0) return 2;
  if (m < 0 && s < 0) return 3;
  return 4;
}

export function clock(th: number): string {
  let h = 6 - th / 30;
  h = ((h % 12) + 12) % 12;
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60) {
    mm = 0;
    hh = (hh + 1) % 12;
  }
  if (hh === 0) hh = 12;
  return `${hh}:${mm < 10 ? '0' : ''}${mm}`;
}

function Mof(m: number, s: number, model: WageModel = wageModel): number {
  return model.M0 - model.a * m - model.b * s;
}

function qName(q: number, model: WageModel = wageModel): string {
  if (q === 1) return 'Joint wage';
  if (q === 2) return 'Fascism zone';
  if (q === 3) return (model.q3 ?? 'Buffer demotion').trim() || 'Buffer demotion';
  return (model.q4 ?? 'Solidarity side').trim() || 'Solidarity side';
}

function qTag(q: number): string {
  return q <= 2 ? 'manuscript' : 'proposed';
}

export function clipDanger(model: WageModel = wageModel): {poly: number[][]; line: number[][]} {
  const k = model.M0 - model.tau;
  const poly = [
    [-R, -R],
    [R, -R],
    [R, R],
    [-R, R],
  ];
  const out: number[][] = [];
  const cross: number[][] = [];
  const f = (p: number[]) => model.a * p[1] + model.b * p[0] - k;
  for (let i = 0; i < 4; i++) {
    const A = poly[i];
    const B = poly[(i + 1) % 4];
    const fa = f(A);
    const fb = f(B);
    if (fa <= 0) out.push(A);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb);
      const P = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
      out.push(P);
      cross.push(P);
    }
  }
  return {poly: out, line: cross};
}

export function dangerPolygon(model: WageModel = wageModel): number[][] {
  return clipDanger(model).poly;
}

export function eliteOf(model: WageModel = wageModel): {m: number; s: number} {
  const k = model.M0 - model.tau;
  const m = (k - model.b * model.smax) / model.a;
  return {m: clamp(m, -R, R), s: model.smax};
}

export function safeArcs(
  r: number,
  model: WageModel = wageModel,
): {all?: boolean; none?: boolean; arcs?: [number, number][]} {
  const N = 360;
  const fl: boolean[] = [];
  for (let i = 0; i < N; i++) {
    const t = rad(-180 + i + 0.5);
    fl.push(Mof(r * Math.cos(t), r * Math.sin(t), model) <= model.tau);
  }
  const all = fl.every(Boolean);
  const any = fl.some(Boolean);
  if (all) return {all: true};
  if (!any) return {none: true};
  const arcs: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    if (fl[i] && !fl[(i - 1 + N) % N]) {
      let j = i;
      while (fl[(j + 1) % N]) j = (j + 1) % N;
      arcs.push([-180 + i, -180 + j + 1]);
    }
  }
  return {arcs};
}

export function regime(m: number, s: number, r: number, th: number, q: number): string {
  if (r < 3)
    return 'W is near zero. The Buffer has no wage of either kind. These are the conditions of Bacon’s Rebellion.';
  if (Math.abs(th) <= 8)
    return 'Almost all material. Manuscript: genuine economic investment in the Buffer (:2937).';
  if (Math.abs(th - 90) <= 8)
    return 'Almost all status. Manuscript: the default operating mode of the extraction kernel (:2939).';
  if (q === 1) return 'Quadrant I. A joint wage of material value and status (:5149).';
  if (q === 2)
    return 'Quadrant II. The Elite take material value from the Buffer and pay in status. Manuscript: the fascism threshold, θ > 90° (:2942).';
  if (q === 3)
    return 'Quadrant III (proposed). The Buffer loses material value and status. It is treated as part of O. This pushes M toward τ.';
  return 'Quadrant IV (proposed). The Buffer has material value and feels inferior in status. A negative ψs means a status inversion.';
}

export function ringNote(r: number, model: WageModel = wageModel): string {
  if (r < 3) return 'Move W away from the origin to see which angles stay inside τ.';
  const sa = safeArcs(r, model);
  if (sa.all) return `At |W| = ${fmt(r)}, every angle stays inside τ.`;
  if (sa.none) return `At |W| = ${fmt(r)}, no angle stays inside τ. Raise |W| or lower τ.`;
  return `At |W| = ${fmt(r)}, the safe arc runs counterclockwise from ${sa
    .arcs!.map(a => `${clock(a[0])} to ${clock(a[1])}`)
    .join(' and from ')}.`;
}

export const WAGE_STAT_LABELS = [
  'Angle θ',
  'Size |W|',
  'Clock position',
  'Quadrant',
  'Class-coherence risk M',
  'Margin to τ',
  'Material flow',
  'Safest angle at any |W|',
] as const;

export function wageReadings(model: WageModel = wageModel) {
  const {m, s, tau, a, b} = model;
  const r = mag(m, s);
  const th = theta(m, s);
  const q = quad(m, s);
  const M = Mof(m, s, model);
  const margin = tau - M;
  const near0 = r < 0.5;
  const sd = theta(a, b);
  const E = eliteOf(model);
  const eliteTh = theta(E.m, E.s);

  const angleStr = near0 ? '—' : `${fmt(th, 1)}°`;
  const magStr = fmt(r, 1);
  const clockStr = near0 ? '—' : clock(th);
  const quadStr = near0 ? 'origin' : `Q${ROMAN[q]} · ${qName(q, model)}`;
  const mStr = `${fmt(M, 1)} (τ = ${fmt(tau)})`;
  const marginStr = margin >= 0 ? `${fmt(margin, 1)} below τ` : `${fmt(-margin, 1)} above τ`;
  const flowStr =
    Math.abs(m) < 0.5 ? 'none' : m < 0 ? `taken from Buffer: ${fmt(-m)}` : `paid to Buffer: ${fmt(m)}`;
  const safestStr = `${clock(sd)} (θ = ${fmt(sd)}°)`;
  const bad = M > tau;
  const chipText = bad ? 'Past τ: breach' : 'Inside the τ limit';
  const mText = `M = ${fmt(M, 1)}   τ = ${fmt(tau)}`;
  const regimeText = regime(m, s, r, th, q);
  const ringText = ringNote(r, model);
  const eliteText = `Elite optimum: ψ_m = ${fmt(E.m)}, ψ_s = ${fmt(E.s)}, at ${clock(eliteTh)} (θ = ${fmt(eliteTh)}°). It takes the most material value from the Buffer while M stays at or below τ and ψ_s stays at or below its ceiling.`;

  return {
    theta: th,
    magnitude: r,
    clock: clockStr,
    quadrant: q,
    M,
    margin,
    elite: E,
    bad,
    chipText,
    mText,
    regimeText,
    ringText,
    eliteText,
    sliders: {
      psim: {value: m, output: fmt(m)},
      psis: {value: s, output: fmt(s)},
      theta: {value: near0 ? 0 : th, output: near0 ? '—' : `${fmt(th)}°`},
    },
    stats: [
      ['Angle θ', angleStr],
      ['Size |W|', magStr],
      ['Clock position', clockStr],
      ['Quadrant', quadStr],
      ['Class-coherence risk M', mStr],
      ['Margin to τ', marginStr],
      ['Material flow', flowStr],
      ['Safest angle at any |W|', safestStr],
    ] as [string, string][],
  };
}

const palette = {
  paper: '#0D1B2A',
  plane: '#0D1B2A',
  panel: '#132538',
  ink: '#ECE7DC',
  ink2: '#A9B6C4',
  rule: '#8A6A45',
  grid: '#8A6A45',
  labelSm: '#B8956A',
  red: '#FF7A6B',
  blue: '#7FAEFF',
  green: '#62CC9E',
  yellow: '#F0C940',
  tau: '#ECE7DC',
  tauIn: '#6F8AA6',
  accent: '#E08A3C',
  accentHi: '#F7C38E',
};

function polar(rr: number, th: number): [number, number] {
  return [sx(rr * Math.sin(rad(th))), sy(rr * Math.cos(rad(th)))];
}

function buildArcSegments(r: number, model: WageModel): {d: string; bad: boolean}[] {
  if (!(model.ring ?? true) || r < 3) return [];
  const N = 180;
  let cur: boolean | null = null;
  let pts: [number, number][] = [];
  const runs: {d: string; bad: boolean}[] = [];
  const pushRun = (points: [number, number][], state: boolean) => {
    if (points.length < 2) return;
    const d = points.map((p, idx) => `${idx ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
    runs.push({d, bad: state});
  };
  for (let i = 0; i < N; i++) {
    const t0 = -180 + i * 2;
    const t1 = t0 + 2;
    const tm = t0 + 1;
    const st = Mof(r * Math.cos(rad(tm)), r * Math.sin(rad(tm)), model) > model.tau;
    const a0: [number, number] = [sx(r * Math.sin(rad(t0))), sy(r * Math.cos(rad(t0)))];
    const a1: [number, number] = [sx(r * Math.sin(rad(t1))), sy(r * Math.cos(rad(t1)))];
    if (cur === null) {
      cur = st;
      pts = [a0];
    }
    if (st !== cur) {
      pushRun(pts, cur);
      pts = [a0];
      cur = st;
    }
    pts.push(a1);
  }
  if (cur !== null) pushRun(pts, cur);
  return runs;
}

function StaticSliderBar({
  min,
  max,
  value,
  interactive,
  onChange,
  ariaLabel,
}: {
  min: number;
  max: number;
  value: number;
  interactive: boolean;
  onChange?: (next: number) => void;
  ariaLabel: string;
}) {
  const pct = clamp(((value - min) / (max - min)) * 100, 0, 100);
  if (interactive && onChange) {
    return (
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={Math.round(value)}
        aria-label={ariaLabel}
        onChange={e => onChange(Number(e.target.value))}
        style={{width: '100%', accentColor: palette.blue, minWidth: 0, cursor: 'pointer'}}
      />
    );
  }
  return (
    <div
      style={{
        position: 'relative',
        height: 16,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 5,
          borderRadius: 99,
          background: palette.panel,
          border: `1px solid ${palette.rule}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct.toFixed(2)}%`,
            background: palette.blue,
            opacity: 0.75,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: `calc(${pct.toFixed(2)}% - 6px)`,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: palette.blue,
          border: `1.5px solid ${palette.ink}`,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function HeaderControls({
  mode,
  interactive,
  onSelectMode,
}: {
  mode: 'expanded' | 'settings';
  interactive: boolean;
  onSelectMode?: ((next: InstrumentMode | null) => void) | null;
}) {
  const gearTarget: InstrumentMode = mode === 'settings' ? 'expanded' : 'settings';
  const gearAction = mode === 'settings' ? 'open-expanded' : 'open-settings';
  const gearLabel = mode === 'settings' ? 'Back to Complex Wage Plane' : 'Open settings';
  const closeLabel = mode === 'settings' ? 'Close settings' : 'Close expanded view';
  const boxStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 6,
    border: `1.6px solid ${color('color/line/hairline-strong')}`,
    background: palette.panel,
    color: palette.ink,
    fontFamily: Tokens.fonts.mono,
    fontSize: 17,
    lineHeight: '26px',
    textAlign: 'center',
    boxSizing: 'border-box',
    cursor: interactive ? 'pointer' : 'default',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  if (interactive) {
    return (
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <button
          type="button"
          data-control="gear"
          data-action={gearAction}
          aria-label={gearLabel}
          onClick={e => {
            e.stopPropagation();
            onSelectMode?.(gearTarget);
          }}
          style={{
            ...boxStyle,
            borderColor: mode === 'settings' ? palette.accent : color('color/line/hairline-strong'),
            color: mode === 'settings' ? palette.accent : palette.ink,
          }}
        >
          ⚙
        </button>
        <button
          type="button"
          data-control="close"
          data-action="close"
          aria-label={closeLabel}
          onClick={e => {
            e.stopPropagation();
            onSelectMode?.('compact');
          }}
          style={boxStyle}
        >
          ×
        </button>
      </div>
    );
  }
  return (
    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
      <div
        data-control="gear"
        data-action={gearAction}
        aria-label={gearLabel}
        style={{
          ...boxStyle,
          borderColor: mode === 'settings' ? palette.accent : color('color/line/hairline-strong'),
          color: mode === 'settings' ? palette.accent : palette.ink,
        }}
      >
        ⚙
      </div>
      <div data-control="close" data-action="close" aria-label={closeLabel} style={boxStyle}>
        ×
      </div>
    </div>
  );
}

export function ComplexWagePlane({
  onSelectMode,
}: {
  onSelectMode?: (mode: InstrumentMode | null) => void;
} = {}) {
  const {interactive} = useContext(ClockContext);
  const ctxSelect = useContext(WageModeControlContext);
  const selectMode = onSelectMode ?? ctxSelect;
  return interactive ? (
    <InteractiveComplexWagePlane onSelectMode={selectMode} />
  ) : (
    <ComplexWagePlaneFrame model={wageModel} interactive={false} onSelectMode={selectMode} />
  );
}

function InteractiveComplexWagePlane({
  onSelectMode,
}: {
  onSelectMode?: ((mode: InstrumentMode | null) => void) | null;
}) {
  const [vec, setVec] = useState<{m: number; s: number}>({m: wageModel.m, s: wageModel.s});
  const draggingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const vx = ((clientX - rect.left) / rect.width) * 800;
    const vy = ((clientY - rect.top) / rect.height) * 830;
    const nextS = clamp(Math.round((vx - CX) / K), -R, R);
    const nextM = clamp(Math.round((vy - CY) / K), -R, R);
    setVec({m: nextM, s: nextS});
  };

  return (
    <ComplexWagePlaneFrame
      model={{...wageModel, m: vec.m, s: vec.s}}
      interactive
      onSelectMode={onSelectMode}
      svgRef={svgRef}
      onPlanePointerDown={e => {
        draggingRef.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPlanePointerMove={e => {
        if (!draggingRef.current) return;
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPlanePointerUp={() => {
        draggingRef.current = false;
      }}
      onPlaneKeyDown={e => {
        const st = e.shiftKey ? 10 : 2;
        let {m, s} = vec;
        if (e.key === 'ArrowRight') s += st;
        else if (e.key === 'ArrowLeft') s -= st;
        else if (e.key === 'ArrowDown') m += st;
        else if (e.key === 'ArrowUp') m -= st;
        else return;
        e.preventDefault();
        setVec({m: clamp(m, -R, R), s: clamp(s, -R, R)});
      }}
      onChangePsim={nextM => setVec(prev => ({m: clamp(nextM, -R, R), s: prev.s}))}
      onChangePsis={nextS => setVec(prev => ({m: prev.m, s: clamp(nextS, -R, R)}))}
      onChangeTheta={nextDeg => {
        let r = mag(vec.m, vec.s);
        if (r < 1) r = 40;
        const a = rad(nextDeg);
        setVec({
          m: clamp(Math.round(r * Math.cos(a)), -R, R),
          s: clamp(Math.round(r * Math.sin(a)), -R, R),
        });
      }}
    />
  );
}

function ComplexWagePlaneFrame({
  model,
  interactive,
  onSelectMode,
  svgRef,
  onPlanePointerDown,
  onPlanePointerMove,
  onPlanePointerUp,
  onPlaneKeyDown,
  onChangePsim,
  onChangePsis,
  onChangeTheta,
}: {
  model: WageModel;
  interactive: boolean;
  onSelectMode?: ((mode: InstrumentMode | null) => void) | null;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  onPlanePointerDown?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPlanePointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPlanePointerUp?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPlaneKeyDown?: (e: React.KeyboardEvent<SVGSVGElement>) => void;
  onChangePsim?: (m: number) => void;
  onChangePsis?: (s: number) => void;
  onChangeTheta?: (theta: number) => void;
}) {
  const id = useId().replace(/:/g, '');
  const c = palette;
  const rd = wageReadings(model);
  const {m, s} = model;
  const r = rd.magnitude;
  const th = rd.theta;
  const q = rd.quadrant;

  const danger = clipDanger(model);
  const dangerPath =
    danger.poly.length >= 3
      ? `${danger.poly.map((p, idx) => `${idx ? 'L' : 'M'}${sx(p[0]).toFixed(1)} ${sy(p[1]).toFixed(1)}`).join('')}Z`
      : '';
  let boundaryLine: {x1: number; y1: number; x2: number; y2: number; ang: number} | null = null;
  if (danger.line.length === 2) {
    const [A, B] = danger.line;
    const x1 = sx(A[0]);
    const y1 = sy(A[1]);
    const x2 = sx(B[0]);
    const y2 = sy(B[1]);
    let ang = deg(Math.atan2(y2 - y1, x2 - x1));
    if (ang > 90) ang -= 180;
    if (ang < -90) ang += 180;
    boundaryLine = {x1, y1, x2, y2, ang};
  }

  // Pyramid geometry from buildStatic()
  const apex = 40;
  const base = 128;
  const hw = 78;
  const half = (y: number) => (hw * (y - apex)) / (base - apex);
  const ys = [apex, apex + (base - apex) / 3, apex + (2 * (base - apex)) / 3, base];
  const pyrCols = [c.yellow, c.green, c.blue];
  const pyrLabs = ['E', 'P', 'F'];

  const arcSegments = buildArcSegments(r, model);
  const E = rd.elite;
  const ex = sx(E.s);
  const ey = sy(E.m);
  const eliteLeft = ex > CX + 170;

  const tx = sx(s);
  const ty = sy(m);
  const vl = Math.hypot(tx - CX, ty - CY);
  const ux = vl > 0 ? (tx - CX) / vl : 0;
  const uy = vl > 0 ? (ty - CY) / vl : 0;
  let nx = -uy;
  let ny = ux;
  if (nx + ny > 0) {
    nx = -nx;
    ny = -ny;
  }

  const ar = 34;
  const ex2 = CX + ar * Math.sin(rad(th));
  const ey2 = CY + ar * Math.cos(rad(th));
  const sweep = th > 0 ? 0 : 1;
  const mid = 90 - th / 2;
  const thetaLx = CX + (ar + 15) * Math.cos(rad(mid));
  const thetaLy = CY + (ar + 15) * Math.sin(rad(mid));

  const haloStyle: React.CSSProperties = {
    paintOrder: 'stroke',
    stroke: c.plane,
    strokeWidth: 4,
    strokeLinejoin: 'round',
  };

  const gaugeFillPct = clamp((rd.M / 150) * 100, 0, 100);
  const gaugeTauPct = clamp((model.tau / 150) * 100, 0, 100);

  return (
    <div
      data-artifact="Complex Wage Plane"
      style={{
        position: 'absolute',
        inset: 0,
        padding: '16px 22px 18px',
        boxSizing: 'border-box',
        fontFamily: Tokens.fonts.sans,
        color: c.ink,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          paddingBottom: 10,
          borderBottom: `1px solid rgba(138,106,69,0.45)`,
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 3px',
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: c.ink,
            }}
          >
            Complex Wage Plane
          </h1>
          <p style={{margin: 0, fontSize: 13.5, lineHeight: 1.4, color: c.ink2}}>
            <MathText>
              {
                "W = ψ_m + jψ_s, drawn as the sketch draws it. Down is +ψ_m. Right is +ψ_s. The angle θ starts at 6 o'clock and grows counterclockwise."
              }
            </MathText>
          </p>
        </div>
        <HeaderControls mode="expanded" interactive={interactive} onSelectMode={onSelectMode} />
      </header>

      {/* Main two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '720px minmax(0, 1fr)',
          gap: 28,
          alignItems: 'start',
          marginTop: 10,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left: sticky square plane + caption + legend */}
        <div style={{minWidth: 0}}>
          <svg
            ref={svgRef}
            data-plane-size="720"
            width={720}
            height={720}
            viewBox="0 0 800 830"
            tabIndex={interactive ? 0 : undefined}
            role="application"
            aria-label={interactive ? 'Wage plane. Use the arrow keys to move the wage vector W.' : 'Complex wage plane'}
            onPointerDown={onPlanePointerDown}
            onPointerMove={onPlanePointerMove}
            onPointerUp={onPlanePointerUp}
            onPointerCancel={onPlanePointerUp}
            onKeyDown={onPlaneKeyDown}
            style={{
              display: 'block',
              width: 720,
              height: 720,
              borderRadius: 4,
              touchAction: 'none',
              cursor: interactive ? 'crosshair' : 'default',
              fontFamily: Tokens.fonts.sans,
            }}
          >
            <defs>
              <pattern
                id={`${id}-hatch`}
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  stroke={c.tau}
                  strokeWidth="1.5"
                  strokeOpacity="0.22"
                />
              </pattern>
              <marker
                id={`${id}-arr-ink`}
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="14"
                markerHeight="14"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M0,0 L12,6 L0,12 z" fill={c.rule} />
              </marker>
              <marker
                id={`${id}-arr-acc`}
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="19"
                markerHeight="19"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M0,0 L12,6 L0,12 z" fill={c.accent} />
              </marker>
              <marker
                id={`${id}-arr-red`}
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="14"
                markerHeight="14"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M0,0 L12,6 L0,12 z" fill={c.red} />
              </marker>
              <marker
                id={`${id}-arr-green`}
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="14"
                markerHeight="14"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M0,0 L12,6 L0,12 z" fill={c.green} />
              </marker>
              <filter
                id={`${id}-w3d`}
                filterUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="800"
                height="830"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="sb" />
                <feOffset in="sb" dx="3" dy="5" result="so" />
                <feFlood floodColor="#000000" floodOpacity="0.6" />
                <feComposite in2="so" operator="in" result="shadow" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="gb" />
                <feColorMatrix
                  in="gb"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.75 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* g-back: square and grid */}
            <g data-layer="g-back">
              <rect
                x={CX - R * K}
                y={CY - R * K}
                width={2 * R * K}
                height={2 * R * K}
                fill={c.plane}
                stroke={c.rule}
                strokeWidth={1.5}
              />
              {[-75, -50, -25, 25, 50, 75].map(g => (
                <React.Fragment key={g}>
                  <line
                    x1={sx(g)}
                    y1={CY - R * K}
                    x2={sx(g)}
                    y2={CY + R * K}
                    stroke={c.grid}
                    strokeOpacity={0.55}
                  />
                  <line
                    x1={CX - R * K}
                    y1={sy(g)}
                    x2={CX + R * K}
                    y2={sy(g)}
                    stroke={c.grid}
                    strokeOpacity={0.55}
                  />
                </React.Fragment>
              ))}
            </g>

            {/* g-zone: tau zone polygon, hatch, boundary line and label */}
            <g data-layer="g-zone">
              {(model.zone ?? true) && dangerPath && (
                <>
                  <path d={dangerPath} fill={c.tau} opacity={0.05} />
                  <path d={dangerPath} fill={`url(#${id}-hatch)`} />
                </>
              )}
              {(model.zone ?? true) && boundaryLine && (
                <>
                  <line
                    x1={boundaryLine.x1.toFixed(1)}
                    y1={boundaryLine.y1.toFixed(1)}
                    x2={boundaryLine.x2.toFixed(1)}
                    y2={boundaryLine.y2.toFixed(1)}
                    stroke={c.tau}
                    strokeWidth={2.5}
                  />
                  <text
                    transform={`translate(${((boundaryLine.x1 + boundaryLine.x2) / 2).toFixed(1)} ${((boundaryLine.y1 + boundaryLine.y2) / 2).toFixed(1)}) rotate(${boundaryLine.ang.toFixed(1)})`}
                    dy={-9}
                    textAnchor="middle"
                    fontFamily={Tokens.fonts.mono}
                    fontSize={15}
                    fill={c.tau}
                    style={haloStyle}
                  >
                    τ boundary · M = τ
                  </text>
                </>
              )}
            </g>

            {/* g-front: clock face, axes, tick values, axis labels, extraction pyramid */}
            <g data-layer="g-front">
              <circle
                cx={CX}
                cy={CY}
                r={R * K}
                fill="none"
                stroke={c.rule}
                strokeWidth={1.2}
                strokeDasharray="2 6"
              />
              {Array.from({length: 12}, (_, i) => {
                const thTick = (6 - i) * 30;
                const p1 = polar(R - 6, thTick);
                const p2 = polar(R, thTick);
                const pn = polar(R + 8, thTick);
                return (
                  <React.Fragment key={i}>
                    <line
                      x1={p1[0].toFixed(1)}
                      y1={p1[1].toFixed(1)}
                      x2={p2[0].toFixed(1)}
                      y2={p2[1].toFixed(1)}
                      stroke={c.rule}
                      strokeWidth={1.5}
                    />
                    {i % 3 !== 0 && (
                      <text
                        x={pn[0].toFixed(1)}
                        y={pn[1].toFixed(1)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontFamily={Tokens.fonts.mono}
                        fontSize={15}
                        fill={c.labelSm}
                      >
                        {i === 0 ? 12 : i}
                      </text>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Axes */}
              <line
                x1={CX - R * K}
                y1={CY}
                x2={CX + R * K + 16}
                y2={CY}
                stroke={c.rule}
                strokeWidth={2}
                markerEnd={`url(#${id}-arr-ink)`}
              />
              <line
                x1={CX}
                y1={CY}
                x2={CX}
                y2={CY + R * K + 16}
                stroke={c.green}
                strokeWidth={2}
                markerEnd={`url(#${id}-arr-green)`}
              />
              <line
                x1={CX}
                y1={CY}
                x2={CX}
                y2={12}
                stroke={c.red}
                strokeWidth={2}
                markerEnd={`url(#${id}-arr-red)`}
              />

              {/* Tick values */}
              <text
                x={sx(50)}
                y={CY + 18}
                textAnchor="middle"
                fontFamily={Tokens.fonts.mono}
                fontSize={13}
                fill={c.labelSm}
              >
                50
              </text>
              <text
                x={sx(-50)}
                y={CY + 18}
                textAnchor="middle"
                fontFamily={Tokens.fonts.mono}
                fontSize={13}
                fill={c.labelSm}
              >
                −50
              </text>
              <text x={CX + 8} y={sy(50) + 4} fontFamily={Tokens.fonts.mono} fontSize={13} fill={c.labelSm}>
                50
              </text>
              <text x={CX + 8} y={sy(-50) + 4} fontFamily={Tokens.fonts.mono} fontSize={13} fill={c.labelSm}>
                −50
              </text>

              {/* Axis labels with real subscripts */}
              <text x={CX + R * K + 22} y={CY - 8} fill={c.rule} fontSize={17} fontWeight={600}>
                <MathText svg>{'ψ_s (+)'}</MathText>
              </text>
              <text x={CX + R * K + 22} y={CY + 12} fill={c.labelSm} fontSize={14}>
                3 o’clock
              </text>
              <text
                x={CX + R * K + 22}
                y={CY + 30}
                fontFamily={Tokens.fonts.mono}
                fill={c.labelSm}
                fontSize={14}
              >
                90°
              </text>

              <text
                x={CX - R * K - 22}
                y={CY - 8}
                textAnchor="end"
                fill={c.rule}
                fontSize={17}
                fontWeight={600}
              >
                <MathText svg>{'ψ_s (−)'}</MathText>
              </text>
              <text x={CX - R * K - 22} y={CY + 12} textAnchor="end" fill={c.labelSm} fontSize={14}>
                9 o’clock
              </text>
              <text
                x={CX - R * K - 22}
                y={CY + 30}
                textAnchor="end"
                fontFamily={Tokens.fonts.mono}
                fill={c.labelSm}
                fontSize={14}
              >
                −90°
              </text>

              <text
                x={CX}
                y={CY + R * K + 46}
                textAnchor="middle"
                fill={c.rule}
                fontSize={17}
                fontWeight={600}
              >
                <MathText svg>{'ψ_m (+)  ·  6 o’clock  ·  0°'}</MathText>
              </text>
              <text x={CX + 92} y={CY - R * K - 6} fill={c.labelSm} fontSize={14}>
                <MathText svg>{'ψ_m (−)  ·  12 o’clock  ·  180°'}</MathText>
              </text>

              {/* Extraction pyramid */}
              {[0, 1, 2].map(i => {
                const ya = ys[i];
                const yb = ys[i + 1];
                const ym = (ya + yb) / 2;
                const points = `${(CX - half(ya)).toFixed(1)},${ya.toFixed(1)} ${(CX + half(ya)).toFixed(1)},${ya.toFixed(1)} ${(CX + half(yb)).toFixed(1)},${yb.toFixed(1)} ${(CX - half(yb)).toFixed(1)},${yb.toFixed(1)}`;
                return (
                  <React.Fragment key={i}>
                    <polygon
                      points={points}
                      fill={pyrCols[i]}
                      fillOpacity={0.55}
                      stroke={c.rule}
                      strokeWidth={1.6}
                    />
                    <text
                      x={(CX - half(ym) - 18).toFixed(1)}
                      y={(ym + 9).toFixed(1)}
                      textAnchor="end"
                      fill={c.red}
                      fontSize={30}
                    >
                      {pyrLabs[i]}
                    </text>
                  </React.Fragment>
                );
              })}
              <line x1={CX} y1={apex} x2={CX} y2={base} stroke={c.rule} strokeWidth={1.6} />
              <text x={CX + 18} y={30} fill={c.red} fontSize={27}>
                Elite extraction
              </text>
            </g>

            {/* g-dyn: quadrant labels, arc at |W|, 6:00 ideal, elite optimum, W vector & handle */}
            <g data-layer="g-dyn">
              {(
                [
                  [1, 55, 66],
                  [2, 55, -66],
                  [3, -55, -66],
                  [4, -55, 66],
                ] as const
              ).map(([qIdx, qs, qm]) => {
                const on = qIdx === q && r >= 1;
                return (
                  <React.Fragment key={qIdx}>
                    <text
                      x={sx(qs)}
                      y={sy(qm)}
                      textAnchor="middle"
                      fontSize={25}
                      fill={on ? c.ink : c.rule}
                      style={haloStyle}
                    >
                      {qName(qIdx, model)}
                    </text>
                    <text
                      x={sx(qs)}
                      y={sy(qm) + 19}
                      textAnchor="middle"
                      fontFamily={Tokens.fonts.mono}
                      fontSize={13}
                      fill={on ? c.ink : c.labelSm}
                      style={haloStyle}
                    >
                      {`Q${ROMAN[qIdx]} · ${qTag(qIdx)}`}
                    </text>
                  </React.Fragment>
                );
              })}

              {/* Arc at current |W| */}
              {arcSegments.map((seg, idx) => (
                <path
                  key={idx}
                  d={seg.d}
                  fill="none"
                  stroke={seg.bad ? c.tau : c.tauIn}
                  strokeWidth={5}
                  opacity={0.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* 6 o'clock ideal */}
              {r >= 8 && (
                <>
                  <circle cx={sx(0)} cy={sy(r)} r={6} fill={c.green} stroke={c.plane} strokeWidth={2} />
                  <text
                    x={sx(0) + 11}
                    y={sy(r) + 5}
                    fontFamily={Tokens.fonts.mono}
                    fontSize={13}
                    fill={c.green}
                    style={haloStyle}
                  >
                    6:00 ideal
                  </text>
                </>
              )}

              {/* Elite optimum */}
              {(model.elite ?? true) && (
                <>
                  <path
                    d={`M${ex} ${ey - 10} L${ex + 10} ${ey} L${ex} ${ey + 10} L${ex - 10} ${ey}Z`}
                    fill={c.red}
                    stroke={c.plane}
                    strokeWidth={2}
                  />
                  <text
                    x={ex + (eliteLeft ? -15 : 15)}
                    y={ey + 5}
                    textAnchor={eliteLeft ? 'end' : 'start'}
                    fontFamily={Tokens.fonts.mono}
                    fontSize={14}
                    fill={c.red}
                    style={haloStyle}
                  >
                    {`Elite optimum ${clock(theta(E.m, E.s))}`}
                  </text>
                </>
              )}

              {/* Projections & glowing W vector */}
              {r >= 3 && (
                <>
                  <line
                    x1={tx}
                    y1={ty}
                    x2={CX}
                    y2={ty}
                    stroke={c.rule}
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                  />
                  <line
                    x1={tx}
                    y1={ty}
                    x2={tx}
                    y2={CY}
                    stroke={c.rule}
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                  />
                  {Math.abs(s) >= 14 && (
                    <text
                      x={(tx + CX) / 2}
                      y={ty + (m >= 0 ? -8 : 19)}
                      textAnchor="middle"
                      fontFamily={Tokens.fonts.mono}
                      fontSize={13}
                      fill={c.labelSm}
                      style={haloStyle}
                    >
                      <MathText svg>{`ψ_s = ${fmt(s)}`}</MathText>
                    </text>
                  )}
                  {Math.abs(m) >= 14 && (
                    <text
                      x={tx + (s >= 0 ? 9 : -9)}
                      y={(ty + CY) / 2 + 4}
                      textAnchor={s >= 0 ? 'start' : 'end'}
                      fontFamily={Tokens.fonts.mono}
                      fontSize={13}
                      fill={c.labelSm}
                      style={haloStyle}
                    >
                      <MathText svg>{`ψ_m = ${fmt(m)}`}</MathText>
                    </text>
                  )}
                  <g filter={`url(#${id}-w3d)`}>
                    <line
                      x1={CX}
                      y1={CY}
                      x2={tx}
                      y2={ty}
                      stroke={c.accent}
                      strokeWidth={5}
                      strokeLinecap="round"
                      markerEnd={`url(#${id}-arr-acc)`}
                    />
                  </g>
                  {vl > 24 && (
                    <line
                      x1={(CX + ux * 5 + nx * 1.3).toFixed(1)}
                      y1={(CY + uy * 5 + ny * 1.3).toFixed(1)}
                      x2={(tx - ux * 15 + nx * 1.3).toFixed(1)}
                      y2={(ty - uy * 15 + ny * 1.3).toFixed(1)}
                      stroke={c.accentHi}
                      strokeWidth={1.4}
                      strokeLinecap="round"
                      opacity={0.9}
                    />
                  )}
                </>
              )}

              {/* Theta angle arc */}
              {r >= 12 && Math.abs(th) > 1 && (
                <>
                  <path
                    d={`M${CX} ${CY + ar} A${ar} ${ar} 0 0 ${sweep} ${ex2.toFixed(1)} ${ey2.toFixed(1)}`}
                    fill="none"
                    stroke={c.rule}
                    strokeWidth={2}
                  />
                  <text
                    x={thetaLx.toFixed(1)}
                    y={(thetaLy + 5).toFixed(1)}
                    textAnchor="middle"
                    fontSize={22}
                    fill={c.rule}
                    style={haloStyle}
                  >
                    θ
                  </text>
                </>
              )}

              {/* Origin node */}
              <circle cx={CX} cy={CY} r={12} fill={c.plane} stroke={c.rule} strokeWidth={2} />
              <circle cx={CX} cy={CY} r={2.5} fill={c.rule} />
              <text
                x={CX - 18}
                y={CY - 16}
                textAnchor="end"
                fontSize={19}
                fill={c.rule}
                style={haloStyle}
              >
                Buffer class
              </text>

              {/* Handle & W label */}
              <circle
                cx={tx}
                cy={ty}
                r={16}
                fill={c.accent}
                fillOpacity={0.26}
                stroke={c.accent}
                strokeOpacity={0.8}
                strokeWidth={1.5}
              />
              <text
                x={tx + (s >= 0 ? 20 : -20)}
                y={ty + (m >= 0 ? 26 : -14)}
                textAnchor={s >= 0 ? 'start' : 'end'}
                fontSize={28}
                fill={c.accent}
                style={haloStyle}
              >
                W
              </text>
            </g>
          </svg>

          {/* Caption and legend under the plane */}
          {interactive && (
            <p style={{margin: '6px 0 0', fontSize: 12.5, color: c.ink2}}>
              Click or drag in the plane to move W. The arrow keys also work. Hold Shift for larger steps.
            </p>
          )}
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 18px',
              margin: '6px 0 0',
              padding: 0,
              listStyle: 'none',
              fontSize: 12.5,
              color: c.ink2,
            }}
          >
            <li style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 12,
                  background: `repeating-linear-gradient(45deg, ${c.tau} 0 1.5px, transparent 1.5px 5px)`,
                  border: `1px solid ${c.tau}`,
                }}
              />
              τ zone: M above τ
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 3,
                  background: c.accent,
                  boxShadow: `0 0 6px ${c.accent}`,
                }}
              />
              W
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 4,
                  background: `linear-gradient(90deg, ${c.tauIn} 0 55%, ${c.tau} 55%)`,
                }}
              />
              Arc at the current |W|
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <span
                style={{
                  display: 'inline-block',
                  width: 11,
                  height: 11,
                  background: c.red,
                  transform: 'rotate(45deg)',
                }}
              />
              Elite optimum
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <span
                style={{
                  display: 'inline-block',
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  background: c.green,
                }}
              />
              {"6 o'clock ideal"}
            </li>
          </ul>
        </div>

        {/* Right: Wage vector panel */}
        <div style={{minWidth: 0}}>
          <h2
            style={{
              fontFamily: Tokens.fonts.sans,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: c.ink2,
              margin: '0 0 12px',
            }}
          >
            Wage vector
          </h2>

          {/* Slider rows: psi_m, psi_s, theta */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '104px minmax(0, 1fr) 62px',
              gap: 10,
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div style={{fontSize: 14}}>
              <MathText>{'ψ_m'}</MathText>{' '}
              <span style={{color: c.ink2, fontSize: 12}}>material</span>
            </div>
            <StaticSliderBar
              min={-100}
              max={100}
              value={rd.sliders.psim.value}
              interactive={interactive}
              onChange={onChangePsim}
              ariaLabel="ψ_m material"
            />
            <output
              style={{
                fontFamily: Tokens.fonts.mono,
                fontSize: 13,
                fontWeight: 500,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {rd.sliders.psim.output}
            </output>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '104px minmax(0, 1fr) 62px',
              gap: 10,
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div style={{fontSize: 14}}>
              <MathText>{'ψ_s'}</MathText>{' '}
              <span style={{color: c.ink2, fontSize: 12}}>status</span>
            </div>
            <StaticSliderBar
              min={-100}
              max={100}
              value={rd.sliders.psis.value}
              interactive={interactive}
              onChange={onChangePsis}
              ariaLabel="ψ_s status"
            />
            <output
              style={{
                fontFamily: Tokens.fonts.mono,
                fontSize: 13,
                fontWeight: 500,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {rd.sliders.psis.output}
            </output>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '104px minmax(0, 1fr) 62px',
              gap: 10,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <div style={{fontSize: 14}}>
              θ <span style={{color: c.ink2, fontSize: 12}}>keeps |W|</span>
            </div>
            <StaticSliderBar
              min={-180}
              max={180}
              value={rd.sliders.theta.value}
              interactive={interactive}
              onChange={onChangeTheta}
              ariaLabel="θ keeps |W|"
            />
            <output
              style={{
                fontFamily: Tokens.fonts.mono,
                fontSize: 13,
                fontWeight: 500,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {rd.sliders.theta.output}
            </output>
          </div>

          {/* Stats grid (8 labels) */}
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '10px 18px',
              margin: '14px 0 14px',
            }}
          >
            {rd.stats.map(([label, val]) => (
              <div key={label} style={{minWidth: 0}}>
                <dt style={{fontSize: 12, color: c.ink2, marginBottom: 2}}>{label}</dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: Tokens.fonts.mono,
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: 1.35,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {val}
                </dd>
              </div>
            ))}
          </dl>

          {/* Status chip and M / tau readout */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px 12px',
              marginBottom: 8,
            }}
          >
            <span
              data-status-chip={rd.bad ? 'danger' : 'safe'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: 99,
                border: '1px solid currentColor',
                fontFamily: Tokens.fonts.sans,
                fontSize: 12.5,
                fontWeight: 500,
                color: rd.bad ? c.tau : c.tauIn,
              }}
            >
              {rd.chipText}
            </span>
            <span style={{fontFamily: Tokens.fonts.mono, fontSize: 13}}>{rd.mText}</span>
          </div>

          {/* Gauge of M against tau (0..150 scale) */}
          <div
            role="img"
            aria-label="Gauge of M against τ"
            data-gauge="M-against-tau"
            style={{
              position: 'relative',
              marginTop: 22,
              height: 10,
              background: c.panel,
              border: `1px solid ${c.rule}`,
              borderRadius: 2,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '0 auto 0 0',
                width: `${gaugeFillPct.toFixed(2)}%`,
                background: rd.bad ? c.tau : c.tauIn,
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -5,
                bottom: -5,
                left: `calc(${gaugeTauPct.toFixed(2)}% - 1px)`,
                width: 2,
                background: c.ink,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -17,
                  left: -4,
                  fontFamily: Tokens.fonts.mono,
                  fontSize: 12,
                  fontWeight: 500,
                  color: c.ink,
                }}
              >
                τ
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: Tokens.fonts.mono,
              fontSize: 11,
              color: c.ink2,
              marginTop: 3,
            }}
          >
            <span>0</span>
            <span>M</span>
            <span>150</span>
          </div>

          {/* Regime note and safe arc note */}
          <p style={{margin: '14px 0 0', fontSize: 14, lineHeight: 1.5, color: c.ink}}>
            {rd.regimeText}
          </p>
          <p style={{margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: c.ink2}}>
            {rd.ringText}
          </p>
        </div>
      </div>
    </div>
  );
}

export function WagePlaneSettings({
  data,
  onSelectMode,
}: {
  data: any;
  onSelectMode?: (mode: InstrumentMode | null) => void;
}) {
  const {interactive} = useContext(ClockContext);
  const ctxSelect = useContext(WageModeControlContext);
  const selectMode = onSelectMode ?? ctxSelect;
  const c = palette;
  const rd = wageReadings(wageModel);
  const content = data?.content ?? {
    title: 'SETTINGS · WAGE PLANE',
    source: 'W = ψ_{m} + jψ_{s} · Log 2 · ordinal',
    units:
      'ψ_{m}, ψ_{s}: ordinal, −100 to 100 · θ: degrees, 0° at 6 o’clock, counterclockwise · τ zone: M above τ',
    log: 'Buffer Class wage: θ = 90° · pure status · Implicit Contract issues the psychological wage',
  };

  const modelRows: {
    key: string;
    label: React.ReactNode;
    hint: string;
    min: number;
    max: number;
    value: number;
    output: string;
  }[] = [
    {
      key: 'M0',
      label: 'M₀',
      hint: 'risk at W = 0',
      min: 0,
      max: 100,
      value: wageModel.M0,
      output: fmt(wageModel.M0),
    },
    {
      key: 'tau',
      label: 'τ',
      hint: 'crash level',
      min: 0,
      max: 100,
      value: wageModel.tau,
      output: fmt(wageModel.tau),
    },
    {
      key: 'a',
      label: 'a',
      hint: 'material weight',
      min: 0.2,
      max: 2,
      value: wageModel.a,
      output: wageModel.a.toFixed(2),
    },
    {
      key: 'b',
      label: 'b',
      hint: 'status weight',
      min: 0.2,
      max: 2,
      value: wageModel.b,
      output: wageModel.b.toFixed(2),
    },
    {
      key: 'smax',
      label: (
        <>
          <MathText>{'ψ_s'}</MathText> ceiling
        </>
      ),
      hint: 'cap',
      min: 0,
      max: 100,
      value: wageModel.smax,
      output: fmt(wageModel.smax),
    },
  ];

  const chips = [
    {label: 'τ zone', on: true},
    {label: 'Arc at |W|', on: true},
    {label: 'Elite optimum', on: true},
  ];

  const quadrants = [
    {name: 'Quadrant I', value: 'Joint wage', tag: 'manuscript'},
    {name: 'Quadrant II', value: 'Fascism zone', tag: 'manuscript'},
    {name: 'Quadrant III', value: 'Buffer demotion', tag: 'proposed'},
    {name: 'Quadrant IV', value: 'Solidarity side', tag: 'proposed'},
  ];

  const h2Style: React.CSSProperties = {
    fontFamily: Tokens.fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: c.ink2,
    margin: '0 0 10px',
  };

  return (
    <div
      data-settings="Wage plane"
      style={{
        position: 'absolute',
        inset: 0,
        padding: '16px 22px 18px',
        boxSizing: 'border-box',
        fontFamily: Tokens.fonts.sans,
        color: c.ink,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          paddingBottom: 10,
          borderBottom: `1px solid rgba(138,106,69,0.45)`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: Tokens.fonts.mono,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 0.8,
              color: c.ink,
            }}
          >
            {content.title}
          </div>
          <div style={{fontSize: 12.5, color: c.ink2, marginTop: 2}}>
            Secondary configuration &amp; provenance · Complex Wage Plane
          </div>
          <div data-model-default="true" style={{fontSize: 12, color: c.accent, marginTop: 3}}>
            <MathText>{'Model default: log 2 predates the 1705 timeline; fix-pass-3 values remain ψ_m = 0 and ψ_s = 60.'}</MathText>
          </div>
        </div>
        <HeaderControls mode="settings" interactive={interactive} onSelectMode={selectMode} />
      </header>

      {/* Two-column body */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '620px minmax(0, 1fr)',
          gap: 28,
          alignItems: 'start',
          marginTop: 14,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left column: tau model + Quadrant names */}
        <div style={{minWidth: 0}}>
          <div>
            <h2 style={h2Style}>
              τ model{' '}
              <span
                style={{
                  textTransform: 'none',
                  letterSpacing: 0,
                  fontWeight: 400,
                  color: c.ink2,
                }}
              >
                (proposal)
              </span>
            </h2>
            <div
              style={{
                fontFamily: Tokens.fonts.mono,
                fontSize: 13,
                lineHeight: 1.5,
                background: c.panel,
                border: `1px solid ${c.rule}`,
                borderRadius: 4,
                padding: '8px 10px',
                marginBottom: 12,
              }}
            >
              <div>
                <MathText>{'M = M₀ − a·ψ_m − b·ψ_s'}</MathText>
              </div>
              <div>
                <MathText>{'τ zone: M > τ, so a·ψ_m + b·ψ_s < M₀ − τ'}</MathText>
              </div>
            </div>

            {modelRows.map(row => (
              <div
                key={row.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px minmax(0, 1fr) 56px',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <div style={{fontSize: 13.5}}>
                  {row.label} <span style={{color: c.ink2, fontSize: 11.5}}>{row.hint}</span>
                </div>
                <StaticSliderBar
                  min={row.min}
                  max={row.max}
                  value={row.value}
                  interactive={false}
                  ariaLabel={row.key}
                />
                <output
                  style={{
                    fontFamily: Tokens.fonts.mono,
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {row.output}
                </output>
              </div>
            ))}

            {/* Checkboxes as on/off chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px 12px',
                margin: '12px 0 8px',
              }}
            >
              {chips.map(ch => (
                <span
                  key={ch.label}
                  data-chip={ch.label}
                  data-chip-state={ch.on ? 'on' : 'off'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 99,
                    border: `1px solid ${ch.on ? c.blue : c.rule}`,
                    background: c.panel,
                    fontSize: 12.5,
                    color: ch.on ? c.ink : c.ink2,
                  }}
                >
                  <span style={{color: c.blue, fontFamily: Tokens.fonts.mono}}>
                    {ch.on ? 'ON' : 'OFF'}
                  </span>
                  <span>{ch.label}</span>
                </span>
              ))}
            </div>

            <p style={{margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.45, color: c.ink2}}>
              <MathText>{rd.eliteText}</MathText>
            </p>
          </div>

          {/* Quadrant names panel */}
          <div
            style={{
              borderTop: `1px solid ${c.rule}`,
              paddingTop: 14,
              marginTop: 16,
            }}
          >
            <h2 style={h2Style}>Quadrant names</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '110px minmax(0, 1fr)',
                gap: '7px 10px',
                alignItems: 'center',
              }}
            >
              {quadrants.map(qItem => (
                <React.Fragment key={qItem.name}>
                  <div style={{fontSize: 13, color: c.ink2}}>{qItem.name}</div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '5px 8px',
                      border: `1px solid ${c.rule}`,
                      borderRadius: 4,
                      background: c.plane,
                      fontSize: 13.5,
                    }}
                  >
                    <span>{qItem.value}</span>
                    <span style={{fontFamily: Tokens.fonts.mono, fontSize: 11, color: c.ink2}}>
                      {qItem.tag}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <p style={{margin: '8px 0 0', fontSize: 12.5, color: c.ink2}}>
              {"Quadrants I and II keep the manuscript's names."}
            </p>
          </div>
        </div>

        {/* Right column: What comes from where + existing source/units/log rows */}
        <div style={{minWidth: 0}}>
          <div>
            <h2 style={h2Style}>What comes from where</h2>
            <div style={{fontSize: 12.5, lineHeight: 1.48, color: c.ink2}}>
              <p style={{margin: '0 0 8px'}}>
                <strong style={{color: c.ink}}>Manuscript</strong> <MathText>{'(Paper/The_Original_Power.tex)'}</MathText>:
                the rotated Argand plane (:2876), the θ regimes (:2937–2945), the joint wage in
                Quadrant I (:5149), and the constraint M &lt; τ (:1531, :2059).
              </p>
              <p style={{margin: '0 0 8px'}}>
                <strong style={{color: c.ink}}>Proposed here</strong>: negative{' '}
                <MathText>{'ψ_s'}</MathText> as a status inversion, Quadrants III and IV, the
                formula for M, the <MathText>{'ψ_s'}</MathText> ceiling, and the Elite optimum. The
                manuscript gives no formula for M in terms of W.
              </p>
              <p style={{margin: '0 0 8px'}}>Wage units run from −100 to 100. They are arbitrary.</p>
              <p style={{margin: '0 0 8px'}}>
                <strong style={{color: c.ink}}>Proposed here, firearms</strong>: the indices B and
                O, the formulas for <MathText>{'ψ_m'}</MathText> and <MathText>{'ψ_s'}</MathText>,
                and every seed value. The model keeps <MathText>{'ψ_m'}</MathText> at or above zero,
                so it cannot show Quadrants II and III.
              </p>
              <p style={{margin: '0 0 8px'}}>
                <strong style={{color: c.ink}}>RAND data</strong>: State Firearm Law Database 6.0
                (TL-A243-2-v4, January 2026; laws as of September 1, 2025). Concealed-carry regimes
                and assault-weapon bans by state, 1979–2025.
              </p>
              <p style={{margin: 0}}>
                <strong style={{color: c.ink}}>Data from the repository</strong>:
                <MathText>{'Paper/data/eq65_68_2a_case_law.csv'}</MathText> (gun laws and rulings, 1911–2024),
                <MathText>{'eq63_mass_incarceration.csv'}</MathText> (F, 1980–2024), <MathText>{'historical_shocks.json'}</MathText> (shock years),
                and the <MathText>{'ρ_τ'}</MathText> ranges in the Compiled Runtime Log
                (:15361–:15515).
              </p>
            </div>
          </div>

          {/* Existing source / units / log lines */}
          <div
            style={{
              borderTop: `1px solid ${c.rule}`,
              paddingTop: 14,
              marginTop: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              {label: 'SOURCE', value: content.source, math: true},
              {label: 'UNITS & RANGES', value: content.units, math: true},
              {label: 'LOG 2 VALUE', value: content.log, math: false},
            ].map(row => (
              <div key={row.label}>
                <div
                  style={{
                    fontFamily: Tokens.fonts.mono,
                    fontSize: 11,
                    letterSpacing: 0.6,
                    color: c.ink2,
                    marginBottom: 4,
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    background: color('color/surface/well'),
                    borderRadius: 6,
                    padding: '7px 10px',
                    fontFamily: Tokens.fonts.mono,
                    fontSize: 12.5,
                    lineHeight: 1.4,
                    color: c.ink,
                  }}
                >
                  {row.math ? <MathText>{row.value}</MathText> : row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tray compact readout (177×80 content box), catalogue-suggested: mini plane with the hatched
// τ zone, clock ring and the orange W arrow at the log-2 state; clock reading and ρ_τ = M/τ
// beside it, the era year under them. Driven by the same model as the expanded card.
export function WagePlaneCompact({era}: {era?: {log: number; title?: string}}) {
  const year = (era?.title ?? '').split(' ')[0] || '';
  const rd = wageReadings(wageModel);
  const rho = rd.M / wageModel.tau;
  const id = useId().replace(/:/g, '');
  const S = 56;
  const pad = 4;
  const H = 24;
  const k = 0.24;
  const C = pad + H;
  const zone = dangerPolygon(wageModel)
    .map(([u, v]) => `${(C + u * k).toFixed(2)},${(C + v * k).toFixed(2)}`)
    .join(' ');
  const hatch: number[] = [];
  for (let d = -2 * H; d <= 2 * H; d += 6) hatch.push(d);
  const tip = C + 60 * k;
  const ah = 5;
  return (
    <div
      data-artifact="Complex Wage Plane"
      style={{position: 'absolute', inset: 0, fontFamily: Tokens.fonts.sans}}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1,
          fontFamily: Tokens.fonts.mono,
          fontSize: 11,
          letterSpacing: 0.6,
          color: color('color/text/dim'),
        }}
      >
        WAGE PLANE
      </div>
      <svg
        width={S}
        height={S}
        viewBox={`0 0 ${S} ${S}`}
        role="img"
        aria-label="Mini wage plane with the τ zone and the W vector"
        style={{position: 'absolute', left: 0, top: 21, display: 'block', overflow: 'visible'}}
      >
        <defs>
          <clipPath id={`${id}-zone`}>
            <polygon points={zone} />
          </clipPath>
        </defs>
        <rect
          x={pad}
          y={pad}
          width={2 * H}
          height={2 * H}
          fill={color('color/surface/well')}
          stroke={color('color/line/hairline-strong')}
          strokeWidth={1}
        />
        <polygon points={zone} fill={color('color/fill/red-faint')} />
        <g clipPath={`url(#${id}-zone)`}>
          {hatch.map(d => (
            <line
              key={d}
              x1={C - H}
              y1={C - H + d}
              x2={C + H}
              y2={C + H + d}
              stroke={color('color/line/hatch')}
              strokeWidth={0.8}
            />
          ))}
        </g>
        <circle
          cx={C}
          cy={C}
          r={H}
          fill="none"
          stroke={color('color/line/hairline-strong')}
          strokeWidth={0.8}
          strokeDasharray="2 3"
        />
        <path
          d={`M${C - H} ${C} H${C + H} M${C} ${C - H} V${C + H}`}
          stroke={color('color/line/wire')}
          strokeWidth={1}
        />
        <line
          x1={C}
          y1={C}
          x2={tip - ah * 0.6}
          y2={C}
          stroke={color('color/fill/accent')}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path d={`M${tip} ${C} l${-ah} ${-ah / 2} v${ah} Z`} fill={color('color/fill/accent')} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <span
          style={{
            fontFamily: Tokens.fonts.mono,
            fontSize: 16,
            fontWeight: 600,
            lineHeight: '18px',
            color: color('color/text/accent'),
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {rd.clock}
        </span>
        <span
          style={{
            fontFamily: Tokens.fonts.mono,
            fontSize: 10.5,
            lineHeight: '13px',
            color: rho >= 1 ? '#FF7A6B' : color('color/text/primary'),
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <MathText>{'ρ_τ'}</MathText> {rho.toFixed(2)}
        </span>
        <span
          style={{
            fontFamily: Tokens.fonts.mono,
            fontSize: 9,
            lineHeight: '11px',
            color: color('color/text/muted'),
          }}
        >
          {year}
        </span>
      </div>
    </div>
  );
}
