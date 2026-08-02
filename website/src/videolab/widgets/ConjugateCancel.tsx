import './widgets.css';

export interface ConjugateCancelProps {
  psiM: number;
  psiS: number;
}

export default function ConjugateCancel({ psiM, psiS }: ConjugateCancelProps) {
  const cx = 200;
  const cy = 130;
  const realScale = 72;
  const imaginaryScale = 86;
  const vectorX = cx + psiM * realScale;
  const upperY = cy - psiS * imaginaryScale;
  const lowerY = cy + psiS * imaginaryScale;
  const sumX = cx + 2 * psiM * realScale;
  const atOrigin = psiM === 0;

  return (
    <div className="vlw-root">
      <svg viewBox="0 0 420 280" role="img" aria-label={atOrigin ? 'Conjugate vectors cancel and their sum lands at the origin' : `Conjugate vectors sum to ${2 * psiM} on the real axis`}>
        <defs>
          <marker id="conjugate-up-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#22d3ee" />
          </marker>
          <marker id="conjugate-down-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#a855f7" />
          </marker>
          <marker id="conjugate-sum-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#fbbf24" />
          </marker>
        </defs>
        <line className="vlw-axis" x1="24" y1={cy} x2="396" y2={cy} />
        <line className="vlw-axis" x1={cx} y1="22" x2={cx} y2="238" />
        <text className="vlw-axis-label" x="370" y="120">ψₘ</text>
        <text className="vlw-axis-label" x="210" y="34">jψₛ</text>
        <line x1={cx} y1={cy} x2={vectorX} y2={upperY} className="vlw-vector" markerEnd="url(#conjugate-up-arrow)" />
        <line x1={cx} y1={cy} x2={vectorX} y2={lowerY} className="vlw-conjugate" markerEnd="url(#conjugate-down-arrow)" />
        <text className="vlw-label" x={vectorX + 10} y={upperY - 4}>W</text>
        <text className="vlw-label" x={vectorX + 10} y={lowerY + 14}>W*</text>
        <line x1={vectorX} y1={upperY} x2={vectorX} y2={cy} className="vlw-cancel" />
        <line x1={vectorX} y1={lowerY} x2={vectorX} y2={cy} className="vlw-cancel" />
        <text className="vlw-muted-label" x={vectorX + 8} y={cy - 10}>+jψₛ − jψₛ = 0</text>
        {atOrigin ? <circle cx={cx} cy={cy} r="10" className="vlw-origin" /> : <line x1={cx} y1={cy} x2={sumX} y2={cy} className="vlw-sum" markerEnd="url(#conjugate-sum-arrow)" />}
        <text className={atOrigin ? 'vlw-zero' : 'vlw-value'} x="24" y="264">
          {atOrigin ? '2ψₘ = 0 · sum lands at the origin' : `W + W* = 2ψₘ = ${(2 * psiM).toFixed(2)}`}
        </text>
      </svg>
    </div>
  );
}
