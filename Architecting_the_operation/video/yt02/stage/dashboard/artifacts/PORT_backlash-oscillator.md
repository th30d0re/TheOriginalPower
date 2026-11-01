# Port Report: Backlash Oscillator (`backlash-oscillator`)

## 1. Ported Implementation

The artifact `backlash-oscillator.html` is ported into `BacklashOscillatorView.tsx` with its companion data file `data/backlash-oscillator.json`.

### Mathematical Model and Functions
- **Governing Differential Equation:** Equation 1.7a ($L \ddot{q} + R \dot{q} + q/C = V(t)$), modeling reform shock displacement of the equality-surplus charge $q(t)$ above the extraction baseline, with reactive pull past zero into the backlash extraction zone.
- **Physical Parameter Derivations:**
  - Decay rate $\alpha = R / (2L)$
  - Undamped natural frequency $\omega_0 = 1 / \sqrt{LC}$
  - Damping ratio $\zeta = \alpha / \omega_0$
  - Damped natural frequency $\omega_d = \omega_0 \sqrt{1 - \zeta^2}$ (for $\zeta < 1$)
  - Quality factor $Q = \sqrt{L/C} / R$
  - Settling time $4/\alpha$
  - Natural period $2\pi/\omega_0$
- **Numerical Integration:** 4th-order Runge-Kutta (RK4) integrator (`getSimulation`) over an adaptive horizon $T$, running $N = 700$ evaluation points with sub-stepped precision ($h = \Delta t / \text{sub}$).
- **Module-Level Memoization:** Module-level cache (`simCache`) indexes simulation runs by parameter signature (`${R}_${L}_${C}_${V0}_${mode}_${w}_${N}`), preventing redundant re-computation across re-renders.
- **Feature Detection:** Identification of first displacement peak (`pk`), first backlash trough (`tr`), overshoot depth ratio ($-\text{tr}/\text{pk}$), and initial zero-crossing time.
- **Circuit Schematic:** Vector schematic mapping source $V(t)$, resistor $R$, inductor $L$, and capacitor $C$ with equation display.
- **Verbatim Prose and Formulas:** Complete preservation of all on-screen strings, labels, formulas, and verbatim citation paragraphs.

## 2. Compact Readout

The compact view satisfies the target box dimensions of 177 × 80 px:
- **Title:** 11 px mono uppercase header (`BACKLASH OSCILLATOR`).
- **Mini-Graphic:** 165 × 34 px vector sparkline showing the baseline zero line, dark shaded backlash zone below zero, and the damped response trace colored in accent orange above zero and red below zero.
- **Readout Line:** 11 px mono value display indicating the active shock year, damping ratio $\zeta$, and natural period (for example, `1865 · ζ 0.17 · 20.9 yr`).

## 3. Era Mapping and Model Defaults

The era mapping function `backlashOscillatorFromEra(era)` implements the mapping specification defined in `CATALOGUE.md`:
- **Log 5 (1704–1865):** Maps to preset 0 (1865 Reconstruction: $\zeta = 0.17, \omega_n = 0.30\text{ rad/yr}$), setting $R = 0.102, L = 1, C = 11.111, V_0 = 1, \text{year} = 1865$, with `modelDefault: false`.
- **Log 9 (1894–1965):** Maps to preset 0 (1865 Reconstruction), with `modelDefault: false`.
- **Log 14 (1968–1994):** Maps to preset 1 (1964 Civil Rights Act: $\zeta = 0.59, \omega_n = 0.52\text{ rad/yr}$), setting $R = 0.6136, L = 1, C = 3.698, V_0 = 1, \text{year} = 1964$, with `modelDefault: false`.
- **Log 15 (1994–present):** Maps to preset 2 (2008 Obama election: $\zeta = 0.70, \omega_n = 1.08\text{ rad/yr}$), setting $R = 1.512, L = 1, C = 0.857, V_0 = 1, \text{year} = 2008$, with `modelDefault: false`.
- **Log 17 (2010s–present):** Maps to preset 3 (2020 George Floyd protests: $\zeta = 0.97, \omega_n = 6.65\text{ rad/yr}$), setting $R = 12.901, L = 1, C = 0.0226, V_0 = 1, \text{year} = 2020$, with `modelDefault: false`.
- **Logs 2 and 3 (and undefined eras):** Return the default model (preset 0) with `modelDefault: true`.
- **Settings Mode Indicator:** When `modelDefault: true`, the settings mode renders the required notice: `"Model default: this log does not set this instrument."`

## 4. Architectural Separation and Scope

- **Static vs. Interactive Boundary:**
  - When `interactive: false`, the view renders through `StaticBacklashOscillatorView` without React state hooks (`useState`, `useEffect`, `useReducer`, `useRef`). Interactive controls render as non-clickable visual displays (static range level bars and non-button containers).
  - When `interactive: true`, the view delegates to `InteractiveBacklashOscillatorView`, enabling dynamic parameter manipulation via sliders, shock preset selectors, and drive mode buttons.
- **Styling and Tokens:** Colors and fonts derive directly from `useTokens()` and dashboard tokens in `stage/tokens.ts`. Text maps to `color('color/text/primary')`, gold elements map to `color('color/fill/gold')`, and mathematical symbols leverage `MathText` from `@stage`.

## 5. Data Provenance

The four shock calibration records are extracted verbatim from the artifact and stored in `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/data/backlash-oscillator.json`:
- **1865:** Abolition / Reconstruction ($\zeta = 0.17, \omega_n = 0.30\text{ rad/yr}$), proxy: Klan and vigilante membership, 1865–1920.
- **1964:** Civil Rights Act ($\zeta = 0.59, \omega_n = 0.52\text{ rad/yr}$), proxy: Southern-strategy polling, 1964–1985.
- **2008:** Obama election ($\zeta = 0.70, \omega_n = 1.08\text{ rad/yr}$), proxy: Tea Party favourability, 2008–2020.
- **2020:** George Floyd protests ($\zeta = 0.97, \omega_n = 6.65\text{ rad/yr}$), proxy: Militia membership, 2020–2024.

Source parameters are derived from fit routines in `Paper/scripts/spectral_laplace.ipynb` with data in `Paper/data/backlash_proxies.csv`, citing manuscript lines `Paper/The_Original_Power.tex:2208`, `:2316`, `:2319`, `:7029`–`:7034`, and `:2390`.

## 6. Verification and Check Results

### Check 1: TypeScript Diagnostics
Command executed:
```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'BacklashOscillatorView' || echo "no errors in BacklashOscillatorView"
```
Output:
```
no errors in BacklashOscillatorView
```

### Check 2: Server-Render Smoke Test
Throwaway test script bundled with esbuild and executed with Node.js in `/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/ports/backlash-oscillator/`.

Results with log 2 era and `interactive: false`:
- **Compact mode (177 × 80 px):** 3,937 bytes
- **Expanded mode (1368 × 828 px):** 37,313 bytes
- **Settings mode (1368 × 828 px):** 6,248 bytes

Verification assertions:
- Identical output across two consecutive `renderToStaticMarkup` passes for each mode.
- Hook invocation traps confirmed zero calls to `useState`, `useEffect`, `useLayoutEffect`, or `useReducer`.
- Output confirmed free of `NaN` or invalid numeric artifacts.
- Settings mode confirmed inclusion of `"Model default: this log does not set this instrument."` for log 2.
