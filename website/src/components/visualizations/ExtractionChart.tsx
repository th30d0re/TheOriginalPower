import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ExtractionChart.css';

/**
 * The Extraction Chart — the reflection-coefficient plane of the extraction line.
 * Appendix H of The Original Power.
 *
 * Gamma = (z - 1) / (z + 1) maps every passive load onto the unit disk.
 * Center  (Gamma = 0)  -> perfect match -> total enclosure, S_enc -> 1.
 * Rim     (|Gamma| = 1) -> total reflection -> withdrawn compliance, zero absorbed power.
 */

const SIZE = 520;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 224;

const R_LOCI = [0.2, 0.5, 1, 2, 5];
const X_LOCI = [0.2, 0.5, 1, 2, 5];

type Complex = { re: number; im: number };

function gammaToZ({ re, im }: Complex): Complex {
  const nr = 1 + re;
  const ni = im;
  const dr = 1 - re;
  const di = -im;
  const den = dr * dr + di * di;
  if (den < 1e-9) return { re: Infinity, im: Infinity };
  return { re: (nr * dr + ni * di) / den, im: (ni * dr - nr * di) / den };
}

function zToGamma({ re, im }: Complex): Complex {
  const nr = re - 1;
  const ni = im;
  const dr = re + 1;
  const di = im;
  const den = dr * dr + di * di;
  if (den < 1e-9) return { re: -1, im: 0 };
  return { re: (nr * dr + ni * di) / den, im: (ni * dr - nr * di) / den };
}

/** Identity sub-bands from Chapter 22, placed via z_k = r_k[1 + j Q_k d_k], Q_k = 3. */
const AXES = [
  { id: 'race', label: 'Race', z: { re: 0.1, im: -0.063 }, color: '#ef4444', period: '3.6 yr', detune: '−0.211' },
  { id: 'gender', label: 'Gender', z: { re: 0.5, im: 1.25 }, color: '#f59e0b', period: '6.0 yr', detune: '+0.833' },
  { id: 'sexuality', label: 'Sexuality', z: { re: 0.25, im: 0.3 }, color: '#a855f7', period: 'threshold', detune: 'small, +' },
];

const PRESETS = [
  { label: 'Total enclosure', hint: 'Γ = 0', gamma: { re: 0, im: 0 } },
  { label: 'Total refusal', hint: 'short, Γ = −1', gamma: { re: -0.985, im: 0 } },
  { label: 'Withdrawn / open', hint: 'open, Γ = +1', gamma: { re: 0.985, im: 0 } },
];

export default function ExtractionChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loadGamma, setLoadGamma] = useState<Complex>({ re: -0.6, im: 0.35 });
  const [lineLength, setLineLength] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }, []);

  // Rotation toward the generator: Gamma(l) = Gamma_L * e^{-2j*beta*l}
  const gamma = useMemo(() => {
    const phi = -4 * Math.PI * lineLength;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    return {
      re: loadGamma.re * c - loadGamma.im * s,
      im: loadGamma.re * s + loadGamma.im * c,
    };
  }, [loadGamma, lineLength]);

  const mag = Math.hypot(gamma.re, gamma.im);
  const z = gammaToZ(gamma);
  const vswr = mag >= 0.999 ? Infinity : (1 + mag) / (1 - mag);
  const sEnc = 1 - mag;
  const pAbs = 1 - mag * mag;

  const toSvg = useCallback((g: Complex) => ({ x: CX + R * g.re, y: CY - R * g.im }), []);

  const handlePointer = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = SIZE / rect.width;
      const px = (e.clientX - rect.left) * scale;
      const py = (e.clientY - rect.top) * scale;
      let gre = (px - CX) / R;
      let gim = -(py - CY) / R;
      const m = Math.hypot(gre, gim);
      if (m > 0.995) {
        gre = (gre / m) * 0.995;
        gim = (gim / m) * 0.995;
      }
      const phi = 4 * Math.PI * lineLength;
      const c = Math.cos(phi);
      const s = Math.sin(phi);
      setLoadGamma({ re: gre * c - gim * s, im: gre * s + gim * c });
    },
    [lineLength],
  );

  const pt = toSvg(gamma);
  const fmt = (v: number, d = 3) =>
    !Number.isFinite(v) ? '∞' : Math.abs(v) < 1e-3 ? '0.000' : v.toFixed(d);

  return (
    <div className="xc-root">
      <div className="xc-stage">
        <svg
          ref={svgRef}
          className="xc-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          onPointerDown={(e) => {
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
            handlePointer(e);
          }}
          onPointerMove={(e) => dragging && handlePointer(e)}
          onPointerUp={(e) => {
            setDragging(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
        >
          <defs>
            <clipPath id="xc-disk">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
            <radialGradient id="xc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0b1a2e" />
              <stop offset="100%" stopColor="#050a14" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={R} fill="url(#xc-glow)" />

          <g clipPath="url(#xc-disk)">
            {R_LOCI.map((r) => (
              <circle
                key={`r${r}`}
                cx={CX + (R * r) / (1 + r)}
                cy={CY}
                r={R / (1 + r)}
                className="xc-locus"
              />
            ))}
            {X_LOCI.map((x) => (
              <g key={`x${x}`}>
                <circle cx={CX + R} cy={CY - R / x} r={R / x} className="xc-locus" />
                <circle cx={CX + R} cy={CY + R / x} r={R / x} className="xc-locus" />
              </g>
            ))}
            <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} className="xc-axis" />
            <circle cx={CX} cy={CY} r={R * mag} className="xc-vswr-circle" />
          </g>

          <circle cx={CX} cy={CY} r={R} className="xc-rim" />

          <circle cx={CX} cy={CY} r={3} className="xc-terminal" />
          <text x={CX} y={CY + 18} className="xc-terminal-label">
            Γ=0 · total enclosure
          </text>
          <text x={CX - R + 4} y={CY - 10} className="xc-edge-label xc-anchor-start">
            short · Γ=−1
          </text>
          <text x={CX + R - 4} y={CY - 10} className="xc-edge-label xc-anchor-end">
            open · Γ=+1
          </text>
          <text x={CX} y={CY - R - 12} className="xc-rim-label">
            |Γ| = 1 · withdrawn compliance · zero absorbed power
          </text>

          {AXES.map((a) => {
            const g = zToGamma(a.z);
            const p = toSvg(g);
            return (
              <g key={a.id}>
                <circle cx={p.x} cy={p.y} r={5} fill={a.color} opacity={0.9} />
                <text x={p.x + 10} y={p.y + 4} className="xc-axis-label" fill={a.color}>
                  {a.label}
                </text>
              </g>
            );
          })}

          {lineLength > 0 && (
            <path
              className="xc-rot-arc"
              d={describeArc(CX, CY, R * mag, angleOf(loadGamma), angleOf(gamma))}
            />
          )}

          <line x1={CX} y1={CY} x2={pt.x} y2={pt.y} className="xc-gamma-vector" />
          <circle cx={pt.x} cy={pt.y} r={9} className="xc-load" />
        </svg>
      </div>

      <header className="xc-hud xc-title">
        <h1>The Extraction Chart</h1>
        <p>
          Reflection-coefficient plane of the extraction line · Appendix&nbsp;H. Drag the load, or
          advance ℓ/λ to rotate it toward the generator.
        </p>
      </header>

      <button
        type="button"
        className="xc-hud xc-fs-btn"
        onClick={toggleFullscreen}
        title={isFull ? 'Exit full screen' : 'Enter full screen'}
      >
        {isFull ? '⤡ Exit full screen' : '⤢ Full screen'}
      </button>

      <button
        type="button"
        className={`xc-hud xc-panel-toggle ${panelOpen ? 'is-open' : ''}`}
        onClick={() => setPanelOpen((o) => !o)}
        title={panelOpen ? 'Hide readouts' : 'Show readouts'}
      >
        {panelOpen ? '›' : '‹'}
      </button>

      <aside className={`xc-hud xc-panel ${panelOpen ? '' : 'is-hidden'}`}>
        <div className="xc-readout">
          <Row k="Γ" v={`${fmt(gamma.re)} ${gamma.im >= 0 ? '+' : '−'} j${fmt(Math.abs(gamma.im))}`} />
          <Row k="|Γ|" v={fmt(mag)} />
          <Row k="z = r + jx" v={`${fmt(z.re)} ${z.im >= 0 ? '+' : '−'} j${fmt(Math.abs(z.im))}`} />
          <Row k="VSWR" v={fmt(vswr, 2)} />
          <Row k="S_enc = 1 − |Γ|" v={fmt(sEnc)} accent />
          <Row k="P_abs / |a|²" v={fmt(pAbs)} accent />
        </div>

        <table className="xc-axis-table">
          <thead>
            <tr>
              <th>Axis</th>
              <th>Period</th>
              <th>δₖ</th>
            </tr>
          </thead>
          <tbody>
            {AXES.map((a) => (
              <tr key={a.id}>
                <td>
                  <span className="xc-swatch" style={{ background: a.color }} />
                  {a.label}
                </td>
                <td>{a.period}</td>
                <td>{a.detune}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>

      <footer className="xc-hud xc-controls">
        <div className="xc-presets">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setLoadGamma(p.gamma);
                setLineLength(0);
              }}
            >
              {p.label}
              <span>{p.hint}</span>
            </button>
          ))}
        </div>
        <div className="xc-slider">
          <label htmlFor="xc-len">
            ℓ / λ <strong>{lineLength.toFixed(3)}</strong>
          </label>
          <input
            id="xc-len"
            type="range"
            min={0}
            max={0.5}
            step={0.005}
            value={lineLength}
            onChange={(e) => setLineLength(parseFloat(e.target.value))}
          />
          <span className="xc-slider-hint">
            One revolution per λ/2. From <em>total refusal</em>, ℓ/λ = 0.25 puts the short circuit at
            the open-circuit point (Theorem H.3).
          </span>
        </div>
      </footer>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={`xc-row ${accent ? 'xc-row-accent' : ''}`}>
      <span>{k}</span>
      <code>{v}</code>
    </div>
  );
}

function angleOf(g: Complex) {
  return Math.atan2(g.im, g.re);
}

/** Arc swept clockwise (toward the generator) from a0 to a1 at the given radius. */
function describeArc(cx: number, cy: number, r: number, a0: number, a1: number) {
  if (r < 0.5) return '';
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy - r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy - r * Math.sin(a1);
  let delta = a0 - a1;
  while (delta < 0) delta += 2 * Math.PI;
  const largeArc = delta > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1}`;
}
