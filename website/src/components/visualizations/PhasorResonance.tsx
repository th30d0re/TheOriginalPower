import { useEffect, useRef, useState } from 'react';
import './PhasorResonance.css';

const WIDTH = 360;
const HEIGHT = 360;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = 110;

export default function PhasorResonance() {
  const svgRef = useRef<SVGSVGElement>(null);
  const requestRef = useRef<number | null>(null);
  const [omega, setOmega] = useState(1.2);
  const [damping, setDamping] = useState(0.15);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let last = performance.now();
    const animate = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setPhase((p) => p + omega * dt * 60 * 0.02);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [omega]);

  const theta = phase % (Math.PI * 2);
  const psiM = RADIUS * Math.cos(theta);
  const psiS = RADIUS * Math.sin(theta);
  const tipX = CX + psiM;
  const tipY = CY - psiS;

  // Resonance curve: amplitude A(ω_d) = 1 / sqrt((ω_0^2 - ω_d^2)^2 + (2ζω_0ω_d)^2)
  // Normalize so peak is near resonance
  const omega0 = 2.0;
  const resonancePoints: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const wd = 0.2 + (i / 120) * 3.8;
    const num = 1;
    const den = Math.sqrt((omega0 * omega0 - wd * wd) ** 2 + (2 * damping * omega0 * wd) ** 2);
    const A = num / (den || 1);
    const x = 40 + (i / 120) * 280;
    const y = 180 - A * 90;
    resonancePoints.push(`${x},${y}`);
  }
  const driveX = 40 + ((omega - 0.2) / 3.8) * 280;
  const driveY =
    180 -
    (1 / Math.sqrt((omega0 * omega0 - omega * omega) ** 2 + (2 * damping * omega0 * omega) ** 2) || 1) *
      90;

  // Arc for the counterclockwise rotation arrow outside the unit circle
  const arrowRadius = RADIUS + 28;
  const arrowStart = -Math.PI / 6; // near positive real axis, CCW toward imaginary
  const arrowEnd = Math.PI / 3;
  const arrowX1 = CX + arrowRadius * Math.cos(arrowStart);
  const arrowY1 = CY - arrowRadius * Math.sin(arrowStart);
  const arrowX2 = CX + arrowRadius * Math.cos(arrowEnd);
  const arrowY2 = CY - arrowRadius * Math.sin(arrowEnd);
  const largeArc = arrowEnd - arrowStart > Math.PI ? 1 : 0;

  // Arrowhead points along the tangent at arrowEnd (CCW direction)
  const tangentAngle = arrowEnd + Math.PI / 2;
  const headLen = 8;
  const headX = arrowX2 - headLen * Math.cos(tangentAngle - Math.PI / 6);
  const headY = arrowY2 + headLen * Math.sin(tangentAngle - Math.PI / 6);
  const headX2 = arrowX2 - headLen * Math.cos(tangentAngle + Math.PI / 6);
  const headY2 = arrowY2 + headLen * Math.sin(tangentAngle + Math.PI / 6);

  return (
    <div className="pr-root">
      <div className="pr-header">
        <h2>Complex Phasor &amp; Resonance</h2>
        <p>
          A rotating wage phasor <code>W = ψₘ + jψₛ</code> and the driven-oscillator amplitude curve.
          The phasor spins counterclockwise through the quadrant cycle IV → I → II → III → IV.
        </p>
      </div>

      <div className="pr-stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="pr-svg"
          role="img"
          aria-label="Animated complex phasor"
        >
          {/* Axes */}
          <line x1={0} y1={CY} x2={WIDTH} y2={CY} stroke="#334155" strokeWidth={1} />
          <line x1={CX} y1={0} x2={CX} y2={HEIGHT} stroke="#334155" strokeWidth={1} />

          {/* Unit circle */}
          <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#1e293b" strokeWidth={2} />

          {/* Quadrant backgrounds */}
          <path d={`M ${CX} ${CY} L ${CX} 0 A ${RADIUS} ${RADIUS} 0 0 1 ${CX - RADIUS} ${CY} Z`} fill="#ef4444" opacity={0.08} />
          <path d={`M ${CX} ${CY} L ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX} ${CY + RADIUS} Z`} fill="#7f1d1d" opacity={0.06} />
          <path d={`M ${CX} ${CY} L ${CX} ${CY + RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY} Z`} fill="#22d3ee" opacity={0.05} />

          {/* Quadrant labels */}
          <text x={CX + 70} y={CY - 70} fill="#94a3b8" fontSize={13} fontWeight={600}>I</text>
          <text x={CX - 82} y={CY - 70} fill="#ef4444" fontSize={13} fontWeight={600}>II</text>
          <text x={CX - 88} y={CY + 82} fill="#7f1d1d" fontSize={13} fontWeight={600}>III</text>
          <text x={CX + 70} y={CY + 82} fill="#22d3ee" fontSize={13} fontWeight={600}>IV</text>

          {/* Rotation direction arrow */}
          <path
            d={`M ${arrowX1} ${arrowY1} A ${arrowRadius} ${arrowRadius} 0 ${largeArc} 1 ${arrowX2} ${arrowY2}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={2}
            strokeDasharray="4 3"
            opacity={0.9}
          />
          <polygon points={`${arrowX2},${arrowY2} ${headX},${headY} ${headX2},${headY2}`} fill="#fbbf24" />
          <text x={CX + 16} y={CY - arrowRadius - 8} fill="#fbbf24" fontSize={11}>CCW</text>

          {/* Phasor */}
          <line x1={CX} y1={CY} x2={tipX} y2={tipY} stroke="#22d3ee" strokeWidth={3} />

          {/* Projections */}
          <line
            x1={CX}
            y1={CY}
            x2={tipX}
            y2={CY}
            stroke="#22d3ee"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.7}
          />
          <line
            x1={tipX}
            y1={CY}
            x2={tipX}
            y2={tipY}
            stroke="#a855f7"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.7}
          />

          {/* Tip */}
          <circle cx={tipX} cy={tipY} r={6} fill="#22d3ee" />

          {/* Labels */}
          <text x={WIDTH - 48} y={CY - 8} fill="#22d3ee" fontSize={12}>Re ψₘ</text>
          <text x={CX + 8} y={16} fill="#a855f7" fontSize={12}>Im ψₛ</text>
        </svg>

        <svg
          viewBox="0 0 360 200"
          className="pr-svg pr-resonance"
          role="img"
          aria-label="Resonance amplitude curve"
        >
          {/* Axes */}
          <line x1={40} y1={180} x2={320} y2={180} stroke="#334155" strokeWidth={1} />
          <line x1={40} y1={20} x2={40} y2={180} stroke="#334155" strokeWidth={1} />

          {/* Resonance curve */}
          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
            points={resonancePoints.join(' ')}
          />

          {/* Drive marker */}
          <circle cx={driveX} cy={driveY} r={5} fill="#fbbf24" />

          {/* Labels */}
          <text x={320} y={195} fill="#94a3b8" fontSize={11}>ωd</text>
          <text x={20} y={20} fill="#94a3b8" fontSize={11}>A</text>
          <text x={44} y={195} fill="#94a3b8" fontSize={10}>0</text>
        </svg>
      </div>

      <div className="pr-controls">
        <label>
          Drive frequency ω: <strong>{omega.toFixed(2)}</strong>
          <input
            type="range"
            min={0.2}
            max={4.0}
            step={0.05}
            value={omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Damping ζ: <strong>{damping.toFixed(2)}</strong>
          <input
            type="range"
            min={0.05}
            max={0.5}
            step={0.01}
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div className="pr-readout">
        <div>
          ψₘ = <span>{Math.cos(theta).toFixed(2)}</span> · R
        </div>
        <div>
          ψₛ = <span>{Math.sin(theta).toFixed(2)}</span> · R
        </div>
      </div>

      <div className="pr-legend">
        <div className="pr-legend-title">Quadrant cycle</div>
        <div className="pr-legend-grid">
          <div><span className="pr-q" style={{ color: '#22d3ee' }}>IV</span> → <span className="pr-q" style={{ color: '#94a3b8' }}>I</span></div>
          <div className="pr-legend-desc">Reparative transition → cooperative benefit</div>

          <div><span className="pr-q" style={{ color: '#94a3b8' }}>I</span> → <span className="pr-q" style={{ color: '#ef4444' }}>II</span></div>
          <div className="pr-legend-desc">Fascist inversion: status rises as material turns negative</div>

          <div><span className="pr-q" style={{ color: '#ef4444' }}>II</span> → <span className="pr-q" style={{ color: '#7f1d1d' }}>III</span></div>
          <div className="pr-legend-desc">Collapse: both wages become negative</div>

          <div><span className="pr-q" style={{ color: '#7f1d1d' }}>III</span> → <span className="pr-q" style={{ color: '#22d3ee' }}>IV</span></div>
          <div className="pr-legend-desc">Material recovery begins before status is restored</div>
        </div>
      </div>
    </div>
  );
}
