import './widgets.css';

export interface WagePhasorProps {
  thetaDeg: number;
  psiM: number;
  psiS: number;
}

export default function WagePhasor({ thetaDeg, psiM, psiS }: WagePhasorProps) {
  const cx = 180;
  const cy = 130;
  const scale = 92;
  const tipX = cx + psiM * scale;
  const tipY = cy - psiS * scale;
  const angle = (thetaDeg * Math.PI) / 180;
  const arcRadius = 35;
  const arcX = cx + arcRadius * Math.cos(angle);
  const arcY = cy - arcRadius * Math.sin(angle);
  const largeArc = thetaDeg > 180 ? 1 : 0;

  return (
    <div className="vlw-root">
      <svg viewBox="0 0 360 260" role="img" aria-label={`Wage phasor at ${thetaDeg} degrees`}>
        <defs>
          <marker id="wage-phasor-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" />
          </marker>
        </defs>
        <rect x="20" y="20" width="160" height="110" fill="#ef4444" opacity=".07" />
        <rect x="20" y="130" width="160" height="110" fill="#7f1d1d" opacity=".07" />
        <rect x="180" y="20" width="160" height="110" fill="#94a3b8" opacity=".045" />
        <rect x="180" y="130" width="160" height="110" fill="#22d3ee" opacity=".045" />
        <line className="vlw-axis" x1="20" y1={cy} x2="340" y2={cy} />
        <line className="vlw-axis" x1={cx} y1="20" x2={cx} y2="240" />
        <text className="vlw-axis-label" x="306" y="120">ψₘ</text>
        <text className="vlw-axis-label" x="190" y="34">jψₛ</text>
        <text className="vlw-quadrant" x="294" y="54">I</text>
        <text className="vlw-quadrant" x="52" y="54">II</text>
        <text className="vlw-quadrant" x="52" y="220">III</text>
        <text className="vlw-quadrant" x="294" y="220">IV</text>
        <path
          d={`M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcX} ${arcY}`}
          className="vlw-angle"
        />
        <text className="vlw-value" x={cx + 42} y={cy - 16}>{thetaDeg.toFixed(0)}°</text>
        <line x1={cx} y1={cy} x2={tipX} y2={tipY} className="vlw-vector" markerEnd="url(#wage-phasor-arrow)" />
        <line x1={tipX} y1={cy} x2={tipX} y2={tipY} className="vlw-projection" />
        <line x1={cx} y1={cy} x2={tipX} y2={cy} className="vlw-projection" />
        <circle cx={tipX} cy={tipY} r="4" fill="#22d3ee" />
        <text className="vlw-value" x="24" y="254">W = {psiM.toFixed(2)} + j{psiS.toFixed(2)}</text>
      </svg>
    </div>
  );
}
