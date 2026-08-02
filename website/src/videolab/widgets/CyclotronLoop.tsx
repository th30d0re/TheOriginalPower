import './widgets.css';

export interface CyclotronLoopProps {
  eMagnitude: number;
  bMagnitude: number;
}

export default function CyclotronLoop({ eMagnitude, bMagnitude }: CyclotronLoopProps) {
  const normalizedDrift = Math.max(0, eMagnitude - bMagnitude * 0.1);
  const displacement = normalizedDrift * 118;
  const radius = 48 + bMagnitude * 20;
  const cx = 178;
  const startY = 214;
  const points: string[] = [];
  for (let step = 0; step <= 80; step += 1) {
    const t = (step / 80) * Math.PI * 2;
    const x = cx + radius * Math.sin(t);
    const y = startY - radius * (1 - Math.cos(t)) - displacement * (step / 80);
    points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const path = points.join(' ');
  const endY = startY - displacement;

  return (
    <div className="vlw-root">
      <svg viewBox="0 0 420 280" role="img" aria-label={`Cyclotron trajectory with net vertical displacement ${normalizedDrift.toFixed(2)}`}>
        <defs>
          <marker id="cyclotron-y-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" />
          </marker>
        </defs>
        <line className="vlw-guide" x1="64" y1="230" x2="64" y2="32" markerEnd="url(#cyclotron-y-arrow)" />
        <text className="vlw-axis-label" x="72" y="36">+y</text>
        <path id="cyclotron-path" d={path} className="vlw-orbit" />
        <circle cx={cx} cy={startY} r="5" fill="#fbbf24" />
        <circle cx={cx} cy={endY} r="5" fill="#22d3ee" />
        <circle r="4" fill="#ffffff" className="vlw-traveller">
          <animateMotion className="vlw-motion" dur="6s" repeatCount="indefinite" path={path} />
        </circle>
        <line x1="304" y1={startY} x2="304" y2={endY} className="vlw-displacement" />
        <line x1="296" y1={startY} x2="312" y2={startY} className="vlw-displacement" />
        <line x1="296" y1={endY} x2="312" y2={endY} className="vlw-displacement" />
        <text className="vlw-value" x="322" y={(startY + endY) / 2 + 4}>Δy = {normalizedDrift.toFixed(2)}</text>
        <text className="vlw-muted-label" x="24" y="260">E {eMagnitude.toFixed(2)}</text>
        <text className="vlw-muted-label" x="104" y="260">B {bMagnitude.toFixed(2)}</text>
        {normalizedDrift === 0 ? <text className="vlw-zero" x="255" y="260">closed loop · zero progress</text> : null}
      </svg>
    </div>
  );
}
