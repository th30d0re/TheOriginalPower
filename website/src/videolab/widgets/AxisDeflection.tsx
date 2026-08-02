import './widgets.css';

export interface AxisDeflectionProps {
  axes: string[];
  eAmplitude: number;
  bAmplitude: number;
}

const AXIS_COLOURS: Record<string, string> = {
  race: '#f97316',
  gender: '#a855f7',
  sexuality: '#ec4899',
  class: '#fbbf24',
  disability: '#14b8a6',
  religion: '#84cc16',
  age: '#60a5fa',
  nationality: '#ef4444',
  neurodivergence: '#c084fc',
};

function wavePath(index: number, amplitude: number) {
  const centerX = 126 + index * 34;
  const points: string[] = [];
  for (let step = 0; step <= 48; step += 1) {
    const y = 218 - step * 3.45;
    const x = centerX + Math.sin((step / 48) * Math.PI * 6) * (5 + amplitude * 13);
    points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

export default function AxisDeflection({ axes, eAmplitude, bAmplitude }: AxisDeflectionProps) {
  const deflection = 54 + bAmplitude * 82;
  const fieldTop = 204 - eAmplitude * 142;
  return (
    <div className="vlw-root">
      <svg viewBox="0 0 420 260" role="img" aria-label={`Material field deflected by ${axes.join(', ')}`}>
        <defs>
          <marker id="axis-e-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" />
          </marker>
          <marker id="axis-force-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
          </marker>
        </defs>
        <line className="vlw-guide" x1="84" y1="224" x2="84" y2="32" />
        <line x1="84" y1="218" x2="84" y2={fieldTop} className="vlw-vector" markerEnd="url(#axis-e-arrow)" />
        <text className="vlw-label" x="25" y="46">E⃗ material</text>
        <text className="vlw-axis-label" x="92" y="32">+y</text>
        {axes.map((axis, index) => {
          const colour = AXIS_COLOURS[axis];
          const labelY = 238 - index * 17;
          return <g key={axis}>
            <path d={wavePath(index, bAmplitude)} fill="none" stroke={colour} strokeWidth="2.5" />
            <line x1={148 + index * 34} y1={labelY - 4} x2={170 + index * 34} y2={labelY - 4} stroke={colour} strokeWidth="2.5" />
            <text className="vlw-label" x={176 + index * 34} y={labelY}>{axis}</text>
          </g>;
        })}
        <circle cx="84" cy="102" r="5" fill="#fbbf24" />
        <line x1="90" y1="102" x2={90 + deflection} y2="102" className="vlw-force" markerEnd="url(#axis-force-arrow)" />
        <text className="vlw-force-label" x="100" y="88">v⃗ × B⃗</text>
        <text className="vlw-muted-label" x="260" y="122">horizontal deflection</text>
      </svg>
    </div>
  );
}
