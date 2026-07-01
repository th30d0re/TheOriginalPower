import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text, Trail, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import './InterferenceEngine3D.css';

/*
 * The Interference Engine — Phased-Array Signal Jamming (UEF §V, §IX)
 * -------------------------------------------------------------------
 * A faithful 3D depiction of the Unified Lorentz Force:
 *
 *     F_total = q E  +  q ( v × Σ_k ρ_k B_k )
 *
 *   E  (vertical, +y)  = Material Wage ψ_m — the ONLY term that does real
 *                        work. Re(W) = R cos θ. Goes negative past θ = 90°.
 *   B_k (fanned, horiz) = the k-th Cultural/Ideological field — the status
 *                        wage jψ_{s,k}. Does zero work; only deflects.
 *   Σ_k ρ_k B_k        = the Interference Engine's phased-array superposition.
 *   q                  = the Buffer-Class worker's demographic charge.
 *
 * The worker tries to climb +y (toward life/wealth). The B-field array hits
 * its velocity perpendicularly (v × B) and spins it into cyclotron motion —
 * enormous kinetic energy, zero vertical progress (§5.1, the Fascist Trap).
 * Past θ = 90° the material term reverses (Quadrant II) and the worker is
 * dragged DOWN while the status field inflates: material cannibalization.
 *
 * The physics here is integrated, not scripted: the helix is emergent.
 */

/*
 * The intersectional axes, ordered so coupled substrate/overlay pairs sit adjacent
 * (race↔ethnicity, sex↔gender↔sexuality). `intensity` = normalized 4-year electoral-
 * carrier resonance — how hard the Interference Engine drives each field.
 *   measured  : from Congressional-Record FFT (Ch.21). race/class/gender/sexuality.
 *               (race/gender/sexuality are a Tier-2 mixture-model decomposition.)
 *   estimated : no spectral series yet — inferred from the impedance model, flagged.
 */
interface Axis {
  name: string;
  color: string;
  intensity: number; // 0..1 normalized 4-yr carrier power
  measured: boolean;
}
const AXES: Axis[] = [
  { name: 'Race', color: '#ef4444', intensity: 1.0, measured: true },
  { name: 'Ethnicity', color: '#fb7185', intensity: 0.85, measured: false },
  { name: 'Class', color: '#f59e0b', intensity: 0.6, measured: true },
  { name: 'Sex', color: '#ec4899', intensity: 0.18, measured: false },
  { name: 'Gender', color: '#a855f7', intensity: 0.15, measured: true },
  { name: 'Sexuality', color: '#d946ef', intensity: 0.72, measured: true },
  { name: 'Disability', color: '#10b981', intensity: 0.4, measured: false },
  { name: 'Neurodivergence', color: '#14b8a6', intensity: 0.3, measured: false },
  { name: 'Religion', color: '#eab308', intensity: 0.25, measured: false },
  { name: 'Age', color: '#f97316', intensity: 0.35, measured: false },
  { name: 'Body / height', color: '#3b82f6', intensity: 0.25, measured: false },
  { name: 'Nationality', color: '#06b6d4', intensity: 0.6, measured: false },
];

interface Params {
  n: number; // number of active cultural axes
  theta: number; // phase angle θ (degrees) of the complex wage W
  R: number; // |W| — magnitude of the suppression allocation
  omega: number; // temporal oscillation rate of the fields
}

/* ---- The vertical E-axis: the material wage ψ_m = R cos θ ---------------- */
function EField({ psiM }: { psiM: number }) {
  const dir = Math.sign(psiM) || 1;
  const len = Math.max(0.001, Math.abs(psiM)) * 3;
  const negative = psiM < 0;
  return (
    <group>
      {/* the drift axis */}
      <Line
        points={[
          [0, -4, 0],
          [0, 4, 0],
        ]}
        color={negative ? '#7f1d1d' : '#22d3ee'}
        lineWidth={1}
        dashed
        dashSize={0.15}
        gapSize={0.1}
      />
      {/* the active material-force arrow */}
      <mesh position={[0, (dir * len) / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, len, 12]} />
        <meshStandardMaterial
          color={negative ? '#ef4444' : '#22d3ee'}
          emissive={negative ? '#ef4444' : '#22d3ee'}
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, dir * len, 0]} rotation={[negative ? Math.PI : 0, 0, 0]}>
        <coneGeometry args={[0.11, 0.28, 16]} />
        <meshStandardMaterial
          color={negative ? '#ef4444' : '#22d3ee'}
          emissive={negative ? '#ef4444' : '#22d3ee'}
          emissiveIntensity={0.6}
        />
      </mesh>
      <Text position={[0.35, 4.15, 0]} fontSize={0.28} color={negative ? '#ef4444' : '#22d3ee'} anchorX="left">
        {negative ? 'E  (ψₘ < 0 · extraction)' : 'E  (ψₘ · material)'}
      </Text>
      <Text position={[0.3, -4.2, 0]} fontSize={0.2} color="#64748b" anchorX="left">
        +y : life / wealth  ·  −y : extraction
      </Text>
    </group>
  );
}

/* ---- E field lines: the uniform institutional field permeating space ---- */
function EFieldLines({ psiM }: { psiM: number }) {
  const negative = psiM < 0;
  const dir = negative ? -1 : 1;
  const color = negative ? '#ef4444' : '#22d3ee';
  const mag = Math.min(1, Math.abs(psiM) / 4);

  const points = useMemo(() => {
    const pts: [number, number][] = [];
    const half = 3.5;
    const step = 1.75;
    for (let x = -half; x <= half + 0.01; x += step) {
      for (let z = -half; z <= half + 0.01; z += step) {
        if (Math.hypot(x, z) < 0.9) continue; // keep centre clear for the main E arrow
        pts.push([x, z]);
      }
    }
    return pts;
  }, []);

  const yTop = 3;
  return (
    <group>
      {points.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Line
            points={[
              [0, -yTop, 0],
              [0, yTop, 0],
            ]}
            color={color}
            lineWidth={1}
            transparent
            opacity={0.22 + 0.28 * mag}
          />
          <mesh position={[0, dir * yTop, 0]} rotation={[negative ? Math.PI : 0, 0, 0]}>
            <coneGeometry args={[0.05, 0.16, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.45 + 0.45 * mag} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---- The glowing source + antenna at the centre ------------------------- *
 * The source charge is driven up and down the dipole: y(t) = A sin(ωt).
 * Every radiated arm carries the retarded copy of this motion, sin(ωt − kr),
 * so the whole field visibly emanates from the bobbing charge (3b1b-style).
 */
function CentralCore({
  clock,
  omega,
  R,
}: {
  clock: React.MutableRefObject<number>;
  omega: number;
  R: number;
}) {
  const src = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = src.current;
    if (g) g.position.y = (0.45 + 0.15 * R) * Math.sin(omega * clock.current);
  });
  return (
    <group>
      <group ref={src}>
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshBasicMaterial color="#bfe9ff" transparent opacity={0.25} />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={2.2} distance={9} color="#bfe9ff" />
      </group>
      {/* checkered dipole antenna */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 5.2, 28, 8, true]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ---- Concentric wavefront rings: intensity I ∝ r⁻² ---------------------- */
function WavefrontRings() {
  const ringPts = useMemo(() => {
    const pts: [number, number, number][] = [];
    const seg = 84;
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push([Math.cos(a), 0, Math.sin(a)]);
    }
    return pts;
  }, []);
  const count = 22;
  return (
    <group position={[0, -0.2, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const r = 0.7 + i * 0.42;
        const op = Math.max(0.025, 0.3 / (1 + r * 0.55)); // fade ∝ 1/r
        const col = i % 2 === 0 ? '#7f1d1d' : '#1e3a8a';
        return (
          <Line
            key={i}
            points={ringPts}
            color={col}
            lineWidth={1}
            transparent
            opacity={op}
            scale={[r, 1, r]}
          />
        );
      })}
    </group>
  );
}

/* ---- One axis's wedge of the radiating dipole --------------------------- *
 * Each axis owns an angular slice of the equatorial plane; it radiates
 * `perWedge` E⊥B wave-arms in the axis's hue. The motion follows the
 * oscillating-charge picture from 3b1b's optics series: the E strand is
 * displaced UP AND DOWN the dipole axis by the retarded source motion
 * sin(ωt − kr), the B strand swings azimuthally, and the envelope falls
 * off ~1/r. Amplitude and brightness scale with the axis's measured /
 * estimated 4-year carrier intensity. Estimated axes are drawn dashed
 * (every other segment collapsed) so measured ≠ guessed.
 */
function AxisWedge({
  axis,
  index,
  total,
  perWedge,
  clock,
  R,
  theta,
  omega,
  rho,
}: {
  axis: Axis;
  index: number;
  total: number;
  perWedge: number;
  clock: React.MutableRefObject<number>;
  R: number;
  theta: number;
  omega: number;
  rho: number; // live field weight ρ_k (defaults to the axis's measured intensity)
}) {
  const S = 56; // samples per arm
  const RMAX = 6.2;
  const rStart = 0.35;
  const kk = 2.6;
  const SPOKE_STEP = 5; // every 5th sample gets an E⊥B spoke pair
  const segPerArm = S - 1;
  const totalSeg = perWedge * segPerArm;
  const spokesPerArm = Math.ceil(S / SPOKE_STEP);
  const totalSpokes = perWedge * spokesPerArm;

  const rs = useMemo(
    () => Array.from({ length: S }, (_, i) => rStart + ((RMAX - rStart) * i) / (S - 1)),
    [],
  );
  const eArr = useMemo(() => new Float32Array(totalSeg * 6), [totalSeg]);
  const bArr = useMemo(() => new Float32Array(totalSeg * 6), [totalSeg]);
  const eSpk = useMemo(() => new Float32Array(totalSpokes * 6), [totalSpokes]);
  const bSpk = useMemo(() => new Float32Array(totalSpokes * 6), [totalSpokes]);
  const eGeo = useRef<THREE.BufferGeometry>(null);
  const bGeo = useRef<THREE.BufferGeometry>(null);
  const eSpkGeo = useRef<THREE.BufferGeometry>(null);
  const bSpkGeo = useRef<THREE.BufferGeometry>(null);

  // E strand = axis hue lightened; B strand = axis hue darkened. Estimated → desaturated.
  const eCol = useMemo(() => {
    const c = new THREE.Color(axis.color).offsetHSL(0, 0, 0.1);
    if (!axis.measured) c.offsetHSL(0, -0.28, 0);
    return c;
  }, [axis]);
  const bCol = useMemo(() => {
    const c = new THREE.Color(axis.color).offsetHSL(0, -0.05, -0.16);
    if (!axis.measured) c.offsetHSL(0, -0.28, 0);
    return c;
  }, [axis]);

  const centerPhi = (index / total) * Math.PI * 2;
  const wedgeSpan = (Math.PI * 2) / total * 0.72; // gap between wedges

  useFrame(() => {
    const t = clock.current;
    const amp0 = (0.5 + 0.25 * R) * (0.35 + 0.65 * rho);
    let seg = 0;
    for (let m = 0; m < perWedge; m++) {
      const frac = perWedge > 1 ? m / (perWedge - 1) - 0.5 : 0;
      const phi = centerPhi + frac * wedgeSpan;
      const cphi = Math.cos(phi);
      const sphi = Math.sin(phi);

      const pt = (i: number) => {
        const r = rs[i];
        const cx = r * cphi;
        const cz = r * sphi;
        // retarded copy of the bobbing source charge: sin(ωt − kr),
        // ramped out of the near zone and decaying ~1/r in the far field
        const ramp = Math.min(1, r / 1.4);
        const decay = 2.0 / (1.0 + r);
        const off = amp0 * ramp * decay * Math.sin(omega * t - kk * r);
        return {
          // E strand: displaced along the dipole axis (up/down, ⊥ r̂)
          ex: cx,
          ey: off,
          ez: cz,
          // B strand: displaced azimuthally (horizontal, ⊥ r̂ and ⊥ E)
          bx: cx - off * sphi,
          by: 0,
          bz: cz + off * cphi,
        };
      };

      for (let i = 0; i < S - 1; i++) {
        const p0 = pt(i);
        const o = seg * 6;
        // dashed for estimated axes: collapse every other segment to a point
        const gap = !axis.measured && i % 2 === 1;
        const p1 = gap ? p0 : pt(i + 1);
        eArr[o] = p0.ex; eArr[o + 1] = p0.ey; eArr[o + 2] = p0.ez;
        eArr[o + 3] = p1.ex; eArr[o + 4] = p1.ey; eArr[o + 5] = p1.ez;
        bArr[o] = p0.bx; bArr[o + 1] = p0.by; bArr[o + 2] = p0.bz;
        bArr[o + 3] = p1.bx; bArr[o + 4] = p1.by; bArr[o + 5] = p1.bz;
        seg++;
      }

      // per-axis E⊥B spokes: vertical ticks to the E strand, horizontal to the B strand
      for (let i = 0, s = 0; i < S; i += SPOKE_STEP, s++) {
        const p = pt(i);
        const r = rs[i];
        const cx = r * cphi;
        const cz = r * sphi;
        const o = (m * spokesPerArm + s) * 6;
        eSpk[o] = cx; eSpk[o + 1] = 0; eSpk[o + 2] = cz;
        eSpk[o + 3] = p.ex; eSpk[o + 4] = p.ey; eSpk[o + 5] = p.ez;
        bSpk[o] = cx; bSpk[o + 1] = 0; bSpk[o + 2] = cz;
        bSpk[o + 3] = p.bx; bSpk[o + 4] = p.by; bSpk[o + 5] = p.bz;
      }
    }
    for (const g of [eGeo, bGeo, eSpkGeo, bSpkGeo]) {
      const attr = g.current?.attributes.position as THREE.BufferAttribute | undefined;
      if (attr) attr.needsUpdate = true;
    }
  });

  const rad = (theta * Math.PI) / 180;
  const iB = 0.14 + 0.82 * rho; // brightness ∝ live field weight
  const dim = axis.measured ? 1 : 0.82;
  const eOpacity = Math.min(1, iB * (0.5 + 0.5 * Math.abs(Math.cos(rad))) * dim);
  const bOpacity = Math.min(1, iB * (0.4 + 0.6 * Math.abs(Math.sin(rad))) * dim);

  const labelR = RMAX + 0.45;
  return (
    <group>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={eGeo}>
          <bufferAttribute attach="attributes-position" args={[eArr, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={eCol} transparent opacity={eOpacity} />
      </lineSegments>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={bGeo}>
          <bufferAttribute attach="attributes-position" args={[bArr, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={bCol} transparent opacity={bOpacity} />
      </lineSegments>
      {/* E⊥B spokes, dimmer than the strands they tie to the propagation line */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={eSpkGeo}>
          <bufferAttribute attach="attributes-position" args={[eSpk, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={eCol} transparent opacity={eOpacity * 0.4} />
      </lineSegments>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={bSpkGeo}>
          <bufferAttribute attach="attributes-position" args={[bSpk, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={bCol} transparent opacity={bOpacity * 0.4} />
      </lineSegments>
      {/* the axis label, ported from the old near-field ribbons */}
      <Billboard position={[labelR * Math.cos(centerPhi), 0.2, labelR * Math.sin(centerPhi)]}>
        <Text fontSize={0.22} color={axis.color} anchorX="left" fillOpacity={Math.max(0.45, iB)}>
          {`B${index + 1} · ${axis.name}${axis.measured ? '' : '*'} (ρ=${rho.toFixed(2)})`}
        </Text>
      </Billboard>
    </group>
  );
}

/* ---- The shared scene clock (always mounted, whatever layers are on) ----- */
function ClockTicker({ clock }: { clock: React.MutableRefObject<number> }) {
  useFrame((_, delta) => {
    clock.current += delta;
  });
  return null;
}

/* ---- Compute the net instantaneous B vector (for the Lorentz force) ------ */
function netB(params: Params, rhos: number[], t: number): THREE.Vector3 {
  const b = new THREE.Vector3();
  for (let k = 0; k < params.n; k++) {
    const angle = (k / params.n) * Math.PI * 2;
    // each field points horizontally along its fan direction, oscillating in time
    const mag = rhos[k] * Math.sin(t * params.omega + k) * params.R;
    b.x += Math.cos(angle) * mag;
    b.z += Math.sin(angle) * mag;
  }
  return b;
}

/* ---- The Buffer-Class worker: a real Lorentz-force integration ---------- */
function ChargeParticle({
  params,
  rhos,
  clock,
}: {
  params: Params;
  rhos: number[];
  clock: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pos = useRef(new THREE.Vector3(1.2, -2.5, 0));
  const vel = useRef(new THREE.Vector3(0, 1.4, 0)); // trying to climb +y
  const q = 1; // demographic charge

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const delta = Math.min(rawDelta, 0.033);
    const t = clock.current;

    const psiM = params.R * Math.cos((params.theta * Math.PI) / 180);
    const E = new THREE.Vector3(0, psiM, 0); // material wage: does real work
    const B = netB(params, rhos, t); // phased-array superposition

    // Lorentz force  F = q ( E + v × B )
    const vxB = new THREE.Vector3().crossVectors(vel.current, B);
    const F = new THREE.Vector3().addVectors(E, vxB).multiplyScalar(q);

    // leapfrog-ish integration with light damping to keep it on-screen
    vel.current.addScaledVector(F, delta);
    vel.current.multiplyScalar(0.995);
    const speed = vel.current.length();
    if (speed > 6) vel.current.multiplyScalar(6 / speed);
    pos.current.addScaledVector(vel.current, delta);

    // soft containment: if it escapes the arena, re-inject at the bottom
    if (pos.current.length() > 6 || pos.current.y > 4.2 || pos.current.y < -4.2) {
      pos.current.set(1.2, -2.5, (Math.random() - 0.5) * 0.5);
      vel.current.set(0, 1.4, 0);
    }
    mesh.position.copy(pos.current);
  });

  return (
    <Trail width={2.5} length={6} color={'#fbbf24'} attenuation={(w) => w}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
    </Trail>
  );
}

/* ---- The complex-plane phasor overlay: W = ψ_m + jψ_s -------------------- *
 * Full 360° rotation through the quadrant cycle of the Oppression Clock
 * (matching the Complex Phasor & Resonance animation): CCW,
 *   I  cooperative → II fascist inversion → III collapse → IV reparative.
 */
const R_MIN = 0.5;
const R_MAX = 4;

const QUADRANTS = [
  { label: 'QI · COOPERATIVE', color: '#22d3ee' },
  { label: 'QII · FASCIST INVERSION', color: '#ef4444' },
  { label: 'QIII · COLLAPSE', color: '#b91c1c' },
  { label: 'QIV · REPARATIVE', color: '#38bdf8' },
];
function quadrantOf(theta: number) {
  const t = ((theta % 360) + 360) % 360;
  return QUADRANTS[Math.min(3, Math.floor(t / 90))];
}

function PhasorInset({
  params,
  onChange,
}: {
  params: Params;
  onChange: (w: { R: number; theta: number }) => void;
}) {
  const rad = (params.theta * Math.PI) / 180;
  const size = 150;
  const c = size / 2;
  const scale = (size / 2 - 18) / R_MAX; // fixed linear scale so |W| is visible
  const psiM = params.R * Math.cos(rad);
  const psiS = params.R * Math.sin(rad);
  const tipX = c + psiM * scale;
  const tipY = c - psiS * scale; // screen y is inverted
  const quadrant = quadrantOf(params.theta);
  const qIndex = QUADRANTS.indexOf(quadrant);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const updateFromPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = (clientX - rect.left - c) / scale;
    const dy = (c - (clientY - rect.top)) / scale; // invert screen y
    let R = Math.hypot(dx, dy);
    let theta = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (theta < 0) theta += 360; // full quadrant cycle, no clamp
    R = Math.min(R_MAX, Math.max(R_MIN, R));
    onChange({ R: +R.toFixed(2), theta: Math.round(theta) % 360 });
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId); // capture on the stable <svg>
    updateFromPoint(e.clientX, e.clientY);
    e.preventDefault();
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging.current) updateFromPoint(e.clientX, e.clientY);
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="ie-phasor">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="ie-phasor-svg"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* axes */}
        <line x1={0} y1={c} x2={size} y2={c} stroke="#334155" strokeWidth={1} />
        <line x1={c} y1={0} x2={c} y2={size} stroke="#334155" strokeWidth={1} />
        {/* active-quadrant shading (I top-right, II top-left, III bottom-left, IV bottom-right) */}
        <rect
          x={qIndex === 1 || qIndex === 2 ? 0 : c}
          y={qIndex === 0 || qIndex === 1 ? 0 : c}
          width={c}
          height={c}
          fill={quadrant.color}
          opacity={0.12}
        />
        {/* magnitude circle */}
        <circle cx={c} cy={c} r={params.R * scale} fill="none" stroke="#1e293b" strokeWidth={1} />
        {/* the phasor W */}
        <line x1={c} y1={c} x2={tipX} y2={tipY} stroke={quadrant.color} strokeWidth={2.5} />
        <circle cx={tipX} cy={tipY} r={9} fill={quadrant.color} opacity={0.18} />
        <circle cx={tipX} cy={tipY} r={5} fill={quadrant.color} stroke="#e2e8f0" strokeWidth={1} />
        {/* projections */}
        <line x1={c} y1={c} x2={tipX} y2={c} stroke="#22d3ee" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
        <line x1={tipX} y1={c} x2={tipX} y2={tipY} stroke="#a855f7" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
        <text x={size - 30} y={c - 6} fill="#22d3ee" fontSize={10}>Re ψₘ</text>
        <text x={c + 4} y={12} fill="#a855f7" fontSize={10}>Im ψₛ</text>
      </svg>
      <div className="ie-phasor-readout">
        <div><span>W = ψₘ + jψₛ</span></div>
        <div>ψₘ = {psiM.toFixed(2)} {psiM < 0 && <em>(extraction)</em>}</div>
        <div>ψₛ = {psiS.toFixed(2)}</div>
        <div>θ = {params.theta.toFixed(0)}°</div>
        {/* dedicated quadrant line: always rendered so the card never resizes */}
        <div className="ie-quadrant" style={{ color: quadrant.color }}>
          {quadrant.label}
        </div>
        <div className="ie-phasor-hint">drag the tip to set W</div>
      </div>
    </div>
  );
}

/* ---- Main component ------------------------------------------------------ */
export default function InterferenceEngine3D() {
  const [params, setParams] = useState<Params>({ n: AXES.length, theta: 60, R: 2, omega: 2 });
  // ρ_k defaults to each axis's 4-yr carrier intensity — one shared weight set
  const [rhos, setRhos] = useState<number[]>(AXES.map((a) => a.intensity));
  const [perWedge, setPerWedge] = useState(3);
  const [showArms, setShowArms] = useState(true);
  const [showWorker, setShowWorker] = useState(true);
  const [fieldLines, setFieldLines] = useState(false);
  const clock = useRef(0);
  const psiM = params.R * Math.cos((params.theta * Math.PI) / 180);

  const set = (patch: Partial<Params>) => setParams((p) => ({ ...p, ...patch }));
  const setRho = (i: number, v: number) =>
    setRhos((r) => {
      const next = [...r];
      next[i] = v;
      return next;
    });

  return (
    <div className="ie-root">
      <Canvas className="ie-canvas" camera={{ position: [7, 3.5, 8], fov: 50 }}>
          <color attach="background" args={['#02040a']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[8, 8, 8]} intensity={1.0} />
          <pointLight position={[-8, -4, -8]} intensity={0.35} color="#a855f7" />

          <ClockTicker clock={clock} />
          <CentralCore clock={clock} omega={params.omega} R={params.R} />
          <EField psiM={psiM} />
          {showArms && <WavefrontRings />}
          {showArms &&
            AXES.slice(0, params.n).map((axis, i) => (
              <AxisWedge
                key={axis.name}
                axis={axis}
                index={i}
                total={params.n}
                perWedge={perWedge}
                clock={clock}
                R={params.R}
                theta={params.theta}
                omega={params.omega}
                rho={rhos[i]}
              />
            ))}

          {fieldLines && <EFieldLines psiM={psiM} />}
          {showWorker && <ChargeParticle params={params} rhos={rhos} clock={clock} />}
          {showWorker && <gridHelper args={[12, 12, '#1e293b', '#111827']} position={[0, -4, 0]} />}

          <OrbitControls enablePan={false} minDistance={4} maxDistance={18} />
        </Canvas>

        <div className="ie-header">
          <h1>The Interference Engine</h1>
          <p>
            Radiating Suppression Field · <code>I ∝ r⁻²</code> ·{' '}
            <code>E⃗ ⊥ B⃗ ⊥ r̂</code>
          </p>
        </div>

        <PhasorInset params={params} onChange={(w) => set(w)} />

        <div className="ie-controls">
          <label>
            Active axes N: <strong>{params.n}</strong>
            <input
              type="range"
              min={1}
              max={AXES.length}
              step={1}
              value={params.n}
              onChange={(e) => set({ n: +e.target.value })}
            />
          </label>
          <label>
            Arms per axis: <strong>{perWedge}</strong>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={perWedge}
              onChange={(e) => setPerWedge(+e.target.value)}
            />
          </label>
          <label>
            Amplitude |W|: <strong>{params.R.toFixed(1)}</strong>
            <input
              type="range"
              min={0.5}
              max={4}
              step={0.1}
              value={params.R}
              onChange={(e) => set({ R: +e.target.value })}
            />
          </label>
          <label>
            Material↔Status θ: <strong>{params.theta}°</strong>
            <input
              type="range"
              min={0}
              max={359}
              step={1}
              value={params.theta}
              onChange={(e) => set({ theta: +e.target.value })}
            />
          </label>
          <label>
            Field rate ω: <strong>{params.omega.toFixed(1)}</strong>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.1}
              value={params.omega}
              onChange={(e) => set({ omega: +e.target.value })}
            />
          </label>

          <label className="ie-toggle">
            <input
              type="checkbox"
              checked={showArms}
              onChange={(e) => setShowArms(e.target.checked)}
            />
            <span>Radiating wave arms</span>
          </label>
          <label className="ie-toggle">
            <input
              type="checkbox"
              checked={showWorker}
              onChange={(e) => setShowWorker(e.target.checked)}
            />
            <span>Worker particle (Lorentz)</span>
          </label>
          <label className="ie-toggle">
            <input
              type="checkbox"
              checked={fieldLines}
              onChange={(e) => setFieldLines(e.target.checked)}
            />
            <span>Field lines</span>
          </label>

          <div className="ie-rho-block">
            <div className="ie-rho-title">Field weights ρₖ (drive wave arms & Lorentz force)</div>
            {AXES.slice(0, params.n).map((a, i) => (
              <label key={a.name} className="ie-rho">
                <span style={{ color: a.color }}>{a.name}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={rhos[i]}
                  onChange={(e) => setRho(i, +e.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

      <div className="ie-legend">
        <div className="ie-axis-key-title">
          Axis intensity = 4-yr carrier power · <span className="ie-solid">solid = measured</span> ·{' '}
          <span className="ie-dash">dashed = estimated</span>
        </div>
        <div className="ie-axis-key">
          {AXES.slice(0, params.n).map((a) => (
            <div className="ie-axis-row" key={a.name}>
              <span
                className={`ie-axis-swatch ${a.measured ? '' : 'ie-axis-swatch-est'}`}
                style={{ background: a.color, borderColor: a.color, color: a.color }}
              />
              <span className="ie-axis-name">{a.name}</span>
              <span className="ie-axis-bar-wrap">
                <span
                  className="ie-axis-bar"
                  style={{ width: `${Math.round(a.intensity * 100)}%`, background: a.color }}
                />
              </span>
              <span className="ie-axis-val">
                {a.intensity.toFixed(2)}
                {a.measured ? '' : '*'}
              </span>
            </div>
          ))}
        </div>
        <div className="ie-axis-note">
          * estimated (no spectral series yet). Race blazes (11× class @ 4 yr); gender is dim
          (off-resonance, 6.2-yr natural period). The <strong>ρₖ sliders</strong> weight each field
          everywhere at once: its labeled E⊥B wave arm and the Lorentz force deflecting the
          yellow worker.
        </div>
      </div>
    </div>
  );
}
