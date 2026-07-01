import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text, Trail } from '@react-three/drei';
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

const AXIS_COLORS = [
  '#ef4444', // race
  '#3b82f6', // gender
  '#a855f7', // sexuality
  '#f59e0b', // ability
  '#10b981', // neurology
  '#ec4899', // physicality
];
const AXIS_LABELS = ['race', 'gender', 'sexuality', 'ability', 'neurology', 'physicality'];

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

/* ---- The propagating E⊥B wave pair (classic radiation form) -------------- */
function EMWave({ clock, omega }: { clock: React.MutableRefObject<number>; omega: number }) {
  const M = 90;
  const xMin = -5.5;
  const xMax = 5.5;
  const amp = 1.3;
  const k = 1.6;

  const xs = useMemo(
    () => Array.from({ length: M }, (_, i) => xMin + ((xMax - xMin) * i) / (M - 1)),
    [],
  );
  const spokeXs = useMemo(() => xs.filter((_, i) => i % 5 === 0), [xs]);
  const segCount = M - 1;

  // rendered as line SEGMENTS (avoids the <line> / SVGLineElement JSX clash)
  const eCurve = useMemo(() => new Float32Array(segCount * 6), [segCount]);
  const bCurve = useMemo(() => new Float32Array(segCount * 6), [segCount]);
  const eSpokes = useMemo(() => new Float32Array(spokeXs.length * 6), [spokeXs]);
  const bSpokes = useMemo(() => new Float32Array(spokeXs.length * 6), [spokeXs]);

  const eCurveGeo = useRef<THREE.BufferGeometry>(null);
  const bCurveGeo = useRef<THREE.BufferGeometry>(null);
  const eSpokeGeo = useRef<THREE.BufferGeometry>(null);
  const bSpokeGeo = useRef<THREE.BufferGeometry>(null);

  useFrame(() => {
    const t = clock.current;
    const wave = (x: number) => amp * Math.sin(k * x - omega * t); // E & B in phase
    for (let i = 0; i < segCount; i++) {
      const x0 = xs[i];
      const x1 = xs[i + 1];
      const v0 = wave(x0);
      const v1 = wave(x1);
      // E curve segment (oscillates in y)
      eCurve[i * 6] = x0; eCurve[i * 6 + 1] = v0; eCurve[i * 6 + 2] = 0;
      eCurve[i * 6 + 3] = x1; eCurve[i * 6 + 4] = v1; eCurve[i * 6 + 5] = 0;
      // B curve segment (oscillates in z)
      bCurve[i * 6] = x0; bCurve[i * 6 + 1] = 0; bCurve[i * 6 + 2] = v0;
      bCurve[i * 6 + 3] = x1; bCurve[i * 6 + 4] = 0; bCurve[i * 6 + 5] = v1;
    }
    for (let j = 0; j < spokeXs.length; j++) {
      const x = spokeXs[j];
      const val = wave(x);
      eSpokes[j * 6] = x;
      eSpokes[j * 6 + 3] = x;
      eSpokes[j * 6 + 4] = val;
      bSpokes[j * 6] = x;
      bSpokes[j * 6 + 3] = x;
      bSpokes[j * 6 + 5] = val;
    }
    for (const g of [eCurveGeo, bCurveGeo, eSpokeGeo, bSpokeGeo]) {
      const attr = g.current?.attributes.position as THREE.BufferAttribute | undefined;
      if (attr) attr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* propagation axis */}
      <Line
        points={[
          [xMin, 0, 0],
          [xMax, 0, 0],
        ]}
        color="#475569"
        lineWidth={1}
        dashed
        dashSize={0.15}
        gapSize={0.1}
      />
      {/* E wave — electric, cyan (real / material), oscillates vertically */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={eCurveGeo}>
          <bufferAttribute attach="attributes-position" args={[eCurve, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.9} />
      </lineSegments>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={eSpokeGeo}>
          <bufferAttribute attach="attributes-position" args={[eSpokes, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.45} />
      </lineSegments>
      {/* B wave — magnetic, purple (imaginary / status), oscillates horizontally, ⊥ to E */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={bCurveGeo}>
          <bufferAttribute attach="attributes-position" args={[bCurve, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.9} />
      </lineSegments>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={bSpokeGeo}>
          <bufferAttribute attach="attributes-position" args={[bSpokes, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.45} />
      </lineSegments>
      <Text position={[xMax + 0.2, 0.35, 0]} fontSize={0.26} color="#22d3ee" anchorX="left">
        E
      </Text>
      <Text position={[xMax + 0.2, 0, 0.4]} fontSize={0.26} color="#a855f7" anchorX="left">
        B
      </Text>
      <Text position={[xMax + 0.2, -0.35, 0]} fontSize={0.17} color="#64748b" anchorX="left">
        propagation →
      </Text>
    </group>
  );
}

/* ---- The glowing source + antenna at the centre ------------------------- */
function CentralCore() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshBasicMaterial color="#bfe9ff" transparent opacity={0.25} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2.2} distance={9} color="#bfe9ff" />
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

/* ---- The vertical dipole / oscillation axis with a white arrowhead ------- */
function DipoleAxis() {
  return (
    <group>
      <Line
        points={[
          [0, -4.2, 0],
          [0, 4.2, 0],
        ]}
        color="#94a3b8"
        lineWidth={1}
      />
      <mesh position={[0, 4.2, 0]}>
        <coneGeometry args={[0.15, 0.42, 20]} />
        <meshBasicMaterial color="#ffffff" />
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
 * Each axis owns an angular slice of the fountain; it radiates `perWedge`
 * E⊥B wave-arms in the axis's hue. Amplitude and brightness scale with the
 * axis's measured/estimated 4-year carrier intensity. Estimated axes are
 * drawn dashed (every other segment collapsed) so measured ≠ guessed.
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
}: {
  axis: Axis;
  index: number;
  total: number;
  perWedge: number;
  clock: React.MutableRefObject<number>;
  R: number;
  theta: number;
  omega: number;
}) {
  const S = 56; // samples per arm
  const RMAX = 6.2;
  const rStart = 0.35;
  const kk = 2.6;
  const H0 = 2.2;
  const A1 = 0.35;
  const A2 = 0.16;
  const segPerArm = S - 1;
  const totalSeg = perWedge * segPerArm;

  const rs = useMemo(
    () => Array.from({ length: S }, (_, i) => rStart + ((RMAX - rStart) * i) / (S - 1)),
    [],
  );
  const eArr = useMemo(() => new Float32Array(totalSeg * 6), [totalSeg]);
  const bArr = useMemo(() => new Float32Array(totalSeg * 6), [totalSeg]);
  const eGeo = useRef<THREE.BufferGeometry>(null);
  const bGeo = useRef<THREE.BufferGeometry>(null);

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
    const amp0 = (0.22 + 0.1 * R) * (0.35 + 0.65 * axis.intensity);
    let seg = 0;
    for (let m = 0; m < perWedge; m++) {
      const frac = perWedge > 1 ? m / (perWedge - 1) - 0.5 : 0;
      const phi = centerPhi + frac * wedgeSpan;
      const cphi = Math.cos(phi);
      const sphi = Math.sin(phi);

      const pt = (i: number) => {
        const r = rs[i];
        const yb = H0 + A1 * r - A2 * r * r;
        const dyb = A1 - 2 * A2 * r;
        const cx = r * cphi;
        const cy = yb;
        const cz = r * sphi;
        const nex = -dyb * cphi;
        const ney = 1;
        const nez = -dyb * sphi;
        const nl = Math.hypot(nex, ney, nez) || 1;
        const phase = Math.sin(kk * r - omega * t);
        const amp = amp0 * (0.25 + 0.75 * Math.min(1, r / 2));
        const off = amp * phase;
        return {
          ex: cx + (off * nex) / nl,
          ey: cy + (off * ney) / nl,
          ez: cz + (off * nez) / nl,
          bx: cx + off * -sphi,
          by: cy,
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
    }
    const ea = eGeo.current?.attributes.position as THREE.BufferAttribute | undefined;
    const ba = bGeo.current?.attributes.position as THREE.BufferAttribute | undefined;
    if (ea) ea.needsUpdate = true;
    if (ba) ba.needsUpdate = true;
  });

  const rad = (theta * Math.PI) / 180;
  const iB = 0.14 + 0.82 * axis.intensity; // brightness ∝ field intensity
  const dim = axis.measured ? 1 : 0.82;
  const eOpacity = Math.min(1, iB * (0.5 + 0.5 * Math.abs(Math.cos(rad))) * dim);
  const bOpacity = Math.min(1, iB * (0.4 + 0.6 * Math.sin(rad)) * dim);

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
    </group>
  );
}

/* ---- One oscillating cultural B-field ribbon ---------------------------- */
function BFieldRibbon({
  index,
  n,
  rho,
  omega,
  clock,
  showLines,
}: {
  index: number;
  n: number;
  rho: number;
  omega: number;
  clock: React.MutableRefObject<number>;
  showLines: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / n) * Math.PI * 2; // fan direction around +y
  const color = AXIS_COLORS[index % AXIS_COLORS.length];

  // a curved ribbon lying along the field's horizontal direction, waving in time
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(6, 0.5, 60, 1);
    return g;
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.current;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // transverse wave along the ribbon, amplitude scaled by ρ_k
      const wave = Math.sin(x * 1.4 - t * omega + index) * 0.55 * rho;
      pos.setY(i, wave + (i % 2 === 0 ? 0.03 : -0.03));
    }
    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  });

  return (
    <group rotation={[0, angle, 0]}>
      <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          transparent
          opacity={0.35 + 0.4 * rho}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>
      {/* horizontal B field lines along the fan direction, with arrowheads */}
      {showLines &&
        [-1.7, 0, 1.7].map((yy) => (
          <group key={yy}>
            <Line
              points={[
                [-3, yy, 0],
                [3, yy, 0],
              ]}
              color={color}
              lineWidth={1}
              transparent
              opacity={0.2 + 0.45 * rho}
            />
            <mesh position={[3, yy, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.07, 0.2, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.4 + 0.5 * rho} />
            </mesh>
          </group>
        ))}
      <Text position={[3.2, 0, 0]} fontSize={0.24} color={color} anchorX="left" rotation={[0, 0, 0]}>
        {`B${index + 1} · ${AXIS_LABELS[index % AXIS_LABELS.length]} (ρ=${rho.toFixed(2)})`}
      </Text>
    </group>
  );
}

/* ---- The superposed field array ----------------------------------------- */
function FieldArray({
  params,
  rhos,
  clock,
  showLines,
}: {
  params: Params;
  rhos: number[];
  clock: React.MutableRefObject<number>;
  showLines: boolean;
}) {
  useFrame((_, delta) => {
    clock.current += delta;
  });
  return (
    <>
      {Array.from({ length: params.n }).map((_, i) => (
        <BFieldRibbon
          key={i}
          index={i}
          n={params.n}
          rho={rhos[i]}
          omega={params.omega}
          clock={clock}
          showLines={showLines}
        />
      ))}
    </>
  );
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

/* ---- The complex-plane phasor overlay: W = ψ_m + jψ_s -------------------- */
const R_MIN = 0.5;
const R_MAX = 4;
const THETA_MIN = 0;
const THETA_MAX = 135;

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
  const quadrantII = params.theta > 90;

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
    R = Math.min(R_MAX, Math.max(R_MIN, R));
    theta = Math.min(THETA_MAX, Math.max(THETA_MIN, theta));
    onChange({ R: +R.toFixed(2), theta: Math.round(theta) });
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
        {/* Quadrant II shading (fascism threshold) */}
        {quadrantII && <rect x={0} y={0} width={c} height={c} fill="#ef4444" opacity={0.12} />}
        {/* magnitude circle */}
        <circle cx={c} cy={c} r={params.R * scale} fill="none" stroke="#1e293b" strokeWidth={1} />
        {/* the phasor W */}
        <line
          x1={c}
          y1={c}
          x2={tipX}
          y2={tipY}
          stroke={quadrantII ? '#ef4444' : '#22d3ee'}
          strokeWidth={2.5}
        />
        <circle cx={tipX} cy={tipY} r={9} fill={quadrantII ? '#ef4444' : '#22d3ee'} opacity={0.18} />
        <circle cx={tipX} cy={tipY} r={5} fill={quadrantII ? '#ef4444' : '#22d3ee'} stroke="#e2e8f0" strokeWidth={1} />
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
        <div className={quadrantII ? 'ie-fascism' : ''}>
          θ = {params.theta.toFixed(0)}° {quadrantII && '· QUADRANT II · FASCISM THRESHOLD'}
        </div>
        <div className="ie-phasor-hint">drag the tip to set W</div>
      </div>
    </div>
  );
}

/* ---- Main component ------------------------------------------------------ */
export default function InterferenceEngine3D() {
  const [params, setParams] = useState<Params>({ n: 3, theta: 60, R: 2, omega: 2 });
  const [rhos, setRhos] = useState<number[]>([0.8, 0.5, 0.4, 0.3, 0.3, 0.3]);
  const [axesShown, setAxesShown] = useState(AXES.length);
  const [perWedge, setPerWedge] = useState(3);
  const [radiate, setRadiate] = useState(true);
  const [analytic, setAnalytic] = useState(false);
  const [fieldLines, setFieldLines] = useState(false);
  const [emWave, setEmWave] = useState(false);
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

          <CentralCore />
          <DipoleAxis />
          {radiate && <WavefrontRings />}
          {radiate &&
            AXES.slice(0, axesShown).map((axis, i) => (
              <AxisWedge
                key={axis.name}
                axis={axis}
                index={i}
                total={axesShown}
                perWedge={perWedge}
                clock={clock}
                R={params.R}
                theta={params.theta}
                omega={params.omega}
              />
            ))}

          {analytic && <EField psiM={psiM} />}
          {fieldLines && <EFieldLines psiM={psiM} />}
          {emWave && <EMWave clock={clock} omega={params.omega} />}
          {analytic && (
            <FieldArray params={params} rhos={rhos} clock={clock} showLines={fieldLines} />
          )}
          {analytic && <ChargeParticle params={params} rhos={rhos} clock={clock} />}
          {analytic && <gridHelper args={[12, 12, '#1e293b', '#111827']} position={[0, -4, 0]} />}

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
            Axes shown: <strong>{axesShown}</strong>
            <input
              type="range"
              min={1}
              max={AXES.length}
              step={1}
              value={axesShown}
              onChange={(e) => setAxesShown(+e.target.value)}
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
              max={135}
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
              checked={radiate}
              onChange={(e) => setRadiate(e.target.checked)}
            />
            <span>Radiating waves</span>
          </label>
          <label className="ie-toggle">
            <input
              type="checkbox"
              checked={analytic}
              onChange={(e) => setAnalytic(e.target.checked)}
            />
            <span>Analytic layer (Lorentz)</span>
          </label>

          {analytic && (
            <>
              <label>
                Active axes N: <strong>{params.n}</strong>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={params.n}
                  onChange={(e) => set({ n: +e.target.value })}
                />
              </label>
              <div className="ie-rho-block">
                <div className="ie-rho-title">Field weights ρₖ</div>
                {Array.from({ length: params.n }).map((_, i) => (
                  <label key={i} className="ie-rho">
                    <span style={{ color: AXIS_COLORS[i % AXIS_COLORS.length] }}>
                      {AXIS_LABELS[i % AXIS_LABELS.length]}
                    </span>
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
              <label className="ie-toggle">
                <input
                  type="checkbox"
                  checked={fieldLines}
                  onChange={(e) => setFieldLines(e.target.checked)}
                />
                <span>Field lines</span>
              </label>
              <label className="ie-toggle">
                <input
                  type="checkbox"
                  checked={emWave}
                  onChange={(e) => setEmWave(e.target.checked)}
                />
                <span>Linear E⊥B wave</span>
              </label>
            </>
          )}
        </div>

      <div className="ie-legend">
        <div className="ie-axis-key-title">
          Axis intensity = 4-yr carrier power · <span className="ie-solid">solid = measured</span> ·{' '}
          <span className="ie-dash">dashed = estimated</span>
        </div>
        <div className="ie-axis-key">
          {AXES.slice(0, axesShown).map((a) => (
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
          (off-resonance, 6.2-yr natural period). Enable the <strong>Analytic layer</strong> for the
          Lorentz-deflection model.
        </div>
      </div>
    </div>
  );
}
