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
  const driveY = 180 - (1 / Math.sqrt((omega0 * omega0 - omega * omega) ** 2 + (2 * damping * omega0 * omega) ** 2) || 1) * 90;

  return (
    <div className="pr-root">
      <div className="pr-header">
        <h2>Complex Phasor & Resonance</h2>
        <p>
          A rotating wage phasor <code>W = ψₘ + jψₛ</code> and the driven-oscillator amplitude curve.
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

          {/* Quadrant II warning region */}
          <path d={`M ${CX} ${CY} L ${CX} 0 A ${RADIUS} ${RADIUS} 0 0 1 ${CX - RADIUS} ${CY} Z`} fill="#ef4444" opacity={0.08} />

          {/* Phasor */}
          <line
            x1={CX}
            y1={CY}
            x2={tipX}
            y2={tipY}
            stroke="#22d3ee"
            strokeWidth={3}
          />

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
    </div>
  );
}
