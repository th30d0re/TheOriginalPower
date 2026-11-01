# Port Report: Phase Coherence (`phase-coherence`)

## 1. What Was Ported

### Functions and Mathematics
- **Random Number Generation**: Ported the SplitMix32 PRNG function `rng(20260611)` and uniform draw function `draw()` over 24 subgroups.
- **Normal Distribution**: Ported the Box-Muller Gaussian generator `gauss()`.
- **Phase Offsets**: Ported `computeOffsets(on, amp, u)` computing class-solidarity phase offsets $\Phi_j = \theta_j + \sum_k a_k u_{kj}$.
- **Kuramoto Order Parameter**: Ported `order(ph)` computing mean resultant length $r = |\frac{1}{N}\sum e^{i\Phi_j}|$ and mean phase angle $\psi = \operatorname{atan2}(\bar{s}, \bar{c})$.
- **Bisection Calibration**: Ported `bisect()` calibrating $a_{\text{race}} = 0.6788$ against $\Phi_{\text{load}} = 0.078$ and $a_{\text{identity}} = 0.8782$ against $\Phi_{\text{load}} = 0.403$.
- **Kuramoto Simulation**: Ported `runSimulation()` integrating $d\theta_j/dt = \sigma \omega_j + K r \sin(\psi - \Phi_j)$ over $t \in [1960, 2030]$ with $dt = 0.01$, tracking history and election ticks.
- **Memoisation**: Simulation executions are memoised at module level in a `Map<string, SimResult>`.
- **Visualisation Geometry**:
  - Phase Circle: Unit circle $R = 170$, dashed $\tau$ threshold ring, 24 subgroup phase dots, mean vector arrow with drop shadow, angle indicators $0$ and $\pi$.
  - Time Series: $900 \times 340$ grid tracking $\Phi_{\text{load}}$ from 1960 to 2030, $\tau$ zone shading, election markers, axis activation lines, ANES reference lines.
  - Summed Solidarity Wave: $1200 \times 170$ plot showing 24 subgroup wave oscillations $\cos(\omega t + \Phi_j)$, $\tau$ boundaries, and mean wave signal.

### Strings and Text
- Verbatim lede: "Each dot is a subgroup's class-solidarity phase $\Phi_j$. The Interference Engine injects identity offsets on each active axis, and the dots spread out: $\Phi_{\text{load}} = 1 − |\text{mean } e^{i\Phi}|$ rises (eq. 1.11). Solidarity reaches $\tau$ only when the phases align. The Snubber Circuit must therefore include phase coherence: the deliberate alignment of resistance signals (:14668)."
- Verbatim axis descriptors: Race, Gender 1972, Nationality 1974, Sexuality 1977, Religion 1979, Ability 1990.
- Verbatim ANES references: Pre-1964 ($0.078$), Activation ($0.214$), Post-1980 ($0.403$).
- Verbatim verdicts: Kernel-safe, Coherent/Kernel-threat condition, and alignment-dependent status.
- Verbatim wave note: "The thin lines are the subgroup waves $\cos(\omega t + \Phi_j)$. Their average, in orange, has amplitude $r = 1 − \Phi_{\text{load}}$. Aligned phases add up; spread phases cancel. The crash condition is the zero-sequence case: all phases in step (:1230)."
- Verbatim notes in settings mode: Section "What the page assumes" covering manuscript citations lines 2517, 7193, 7215–7256, 2522, 14640–14665, 14668, and 1230.

## 2. Compact Readout

The compact view satisfies the $177 \times 80$ content box specification:
- Title line in 11 px monospace: `PHASE COHERENCE` with current timeline year readout.
- Mini-graphic: $58 \times 58$ SVG showing the unit circle, dashed $\tau$ limit ring, 24 subgroup teal phase dots, and the central mean vector arrow. The arrow dynamically shifts from accent orange to $\tau$ coral when $r \ge r_\tau$.
- Numerical readouts: Two primary tabular numbers displaying $\Phi$ ($\Phi_{\text{load}}$) and $r$ (coherence length), accompanied by the target $\tau$ threshold.

## 3. Era Mapping and Model Default

The function `phaseCoherenceFromEra(era)` implements the contract specification:
- For Eras 2, 3, 5, and 9: These eras predate the artifact's historical timeline ($1960–2030$). The catalogue designates pre-1960 mappings as suggestions without concrete historical log values. The function returns `modelDefault: true` with the baseline model parameters.
- For Eras 14, 15, and 17: These eras correspond to the modern recompile epochs:
  - Era 14 (1968–1994 Recompile): Maps to timeline year 1981, activating Race, Gender, Nationality, Sexuality, and Religion axes (`modelDefault: false`).
  - Era 15 (1994–present Terminal Runtime): Maps to timeline year 2005, with all six axes active (`modelDefault: false`).
  - Era 17 (2010s–present Algorithmic Epoch): Maps to timeline year 2020, with all six axes active (`modelDefault: false`).
- Settings Mode Readout: When `modelDefault: true`, the view explicitly renders:
  `Model default: this log does not set this instrument.`

## 4. Parts Omitted and Rationale

- Continuous `requestAnimationFrame` loop: Replaced with a deterministic, memoised simulation engine that computes identical numerical states without runtime animation overhead during server-side rendering.
- Imperative DOM manipulation (`innerHTML`, `document.getElementById`): Converted into declarative React JSX components adhering to standard design tokens.
- Interactive controls in non-interactive path: Under `interactive: false`, all controls render as static tabular readouts. Active inputs and event listeners are isolated within `InteractivePhaseCoherenceView`.

## 5. Data Provenance

The artifact contains no external dataset files (`data/phase-coherence.json` is not required).
- ANES reference levels ($0.078, 0.214, 0.403$) derive from manuscript lines 2522.
- Axis activation dates ($1972, 1974, 1977, 1979, 1990$) derive from manuscript lines 7215–7256.
- 24 subgroup phases and electoral cycle parameters follow the author's illustrative Kuramoto model defined in `phase-coherence.html`.

## 6. Type-Check Verification

Execution command:
```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'PhaseCoherenceView' || echo "no errors in PhaseCoherenceView"
```

Output:
```
no errors in PhaseCoherenceView
```

## 7. Server-Render Smoke Test

Execution command:
```bash
node /private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/ports/phase-coherence/run_smoke.mjs
```

Output:
```
--- Testing phaseCoherenceFromEra(log2Era) ---
fromEra: {
  modelDefault: true,
  K: 0,
  sig: 0,
  tau: 0.9,
  eng: 4,
  hist: true,
  year: 1980,
  activeAxes: {
    race: true,
    gender: true,
    nat: true,
    sex: true,
    rel: true,
    abl: false
  }
}
--- Rendering all three modes twice ---
PASS: compact mode rendered identically. Byte length: 3966
PASS: expanded mode rendered identically. Byte length: 77445
PASS: settings mode rendered identically. Byte length: 9022
ALL TESTS PASSED SUCCESSFULLY!
```
