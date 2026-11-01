# Artifact Port Report: Interference Engine

This document reports the port of the `interference-engine` artifact into the dashboard instrument component `InterferenceEngineView`.

## 1. Port Summary

- **Slug**: `interference-engine`
- **Pascal name**: `InterferenceEngine`
- **Camel name**: `interferenceEngine`
- **Source Artifact**: `Architecting_the_operation/video/yt02/stage/artifacts/interference-engine.html`
- **Catalogue Reference**: `Architecting_the_operation/video/yt02/stage/artifacts/CATALOGUE.md` (Section 4)
- **Target Files**:
  - `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/InterferenceEngineView.tsx`
  - `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/data/interference-engine.json`
  - `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/PORT_interference-engine.md`

## 2. Functions and Strings Ported

The port implements all core Part 1 functions and visual elements from `interference-engine.html`:

- **Mathematical Model**:
  - `pclassOf(u, n, on)`: Computes attention remaining in the class band, $P_{\text{class}} = (1 - \eta)(1 - u)$.
  - `rhoOf(m0, u, n, phi, on)`: Calculates the joint distance measure $\rho_\tau = M_0 \cdot P_{\text{class}} \cdot (1 - \Phi_{\text{load}})^2$.
  - `meanR(a)`: Calculates resultant vector length across $N = 24$ subgroup phasors.
  - `ampFor(phi)`: Inverts the dispersion relationship through binary search (50 iterations) to find the angular spread $a$ corresponding to $\Phi_{\text{load}}$. Memoized at module level using an input-keyed Map.
  - `needM0(e, u, n, on)`: Calculates the required raw class pressure $M_0$ implied by an era box midpoint under the current lever positions.
  - `fmt(v)`: Formats numeric readings across dynamic ranges with tabular precision.
  - `computeVerdict(...)`: Evaluates proximity to the $\tau$ threshold, producing clinical diagnostic strings regarding kernel safety and lever displacements required for boundary breach.

- **Visualizations**:
  - **Phase Coherence Circle**: Semicircular coordinate system depicting 24 subgroup phasors. Employs a pre-calculated, deterministic array of 24 offsets `UO` derived from the artifact's seed PRNG. Plots individual subgroup dots in teal (`#4CC2C2`) and renders the mean resultant vector with directional arrow pointing along the ensemble phase angle.
  - **$\rho_\tau$ Semicircular Dial**: Half-circle dial spanning 0 to 2.0 with the critical $\tau = 1.0$ boundary marker, danger zone backdrop, needle indicator, and numeric readout.
  - **$\Phi_{\text{load}}$ Bar**: Horizontal track spanning 0 to 1.0 with discrete subdivisions and real-time fill level.
  - **Interference State Field Plane**: 900 × 470 coordinate space mapping $\Phi_{\text{load}}$ across the horizontal axis and $\rho_\tau$ across the vertical axis. Renders all 16 historical runtime log boxes with era identifiers, the continuous parametric curve $\rho_\tau(\Phi)$, and the active operating coordinate.
  - **Strings and Annotations**: Manuscript equations, explanatory commentary, and line references are ported verbatim from the source HTML.

## 3. Compact Readout (177 × 80)

The compact readout satisfies all layout and dimension specifications:

- **Dimensions**: Content box 177 × 80 px without panel chrome.
- **Title**: 11 px monospace title `INTERFERENCE ENGINE` with superscripted/subscripted $\rho_\tau$ indicator.
- **Primary Metric**: Large tabular monospace display of $\rho_\tau$ (22 px, 600 weight). The value renders in ivory text during kernel-safe states and switches to coral (`#FF7A6B`) when $\rho_\tau \ge 1.0$.
- **Crash Annotation**: Displays a coral `crash > 1.00` badge for eras characterized by boundary breach (log 3).
- **Proportional Bar**: Scaled from 0 to 1.2 with an explicit coral tick line at $\tau = 1.0$ (83.3% of bar width).
- **Mini-Graphic**: A 44 × 44 px phase coherence circle positioned on the right flank, displaying the 24 subgroup dots and the resultant mean phase arrow.

## 4. Era Mapping and Model Defaults

The mapping function `interferenceEngineFromEra(era)` adheres to the specification in `CATALOGUE.md`:

- **Active Era Ingestion**:
  - Reads `phi_load` and `rho_tau` ranges from `era.fields.interference_state`.
  - Calculates coordinate midpoints:
    $$\Phi_{\text{load}} = \frac{\phi_{\text{load}}[0] + \phi_{\text{load}}[1]}{2}, \quad \rho_{\text{mid}} = \frac{\rho_\tau[0] + \rho_\tau[1]}{2}$$
  - Retains default values for the unconstrained parameters ($u = 0.6$, $\eta = 0.1$, and the default active axis configuration).
  - Determines implied class pressure $M_0$ by executing the artifact's fit step:
    $$M_0 = \frac{\rho_{\text{mid}}}{P_{\text{class}} \cdot (1 - \Phi_{\text{load}})^2}$$
    clamped to the allowable parameter interval $[0.2, 1000]$.
  - Records `rho_tau_crash` when present in the era record (e.g., log 3, value 1.0).
  - Returns `modelDefault: false`.

- **Tested Historical Eras**:
  - Log 2 (1486): $\Phi_{\text{load}} = 0.150$, $M_0 = 2.98$, $\rho_\tau = 0.78$
  - Log 3 (1676–1787): $\Phi_{\text{load}} = 0.350$, $M_0 = 4.44$, $\rho_\tau = 0.68$, `rhoCrash = 1.0`
  - Log 5 (1704–1865): $\Phi_{\text{load}} = 0.525$, $M_0 = 6.77$, $\rho_\tau = 0.55$
  - Log 9 (1894–1965): $\Phi_{\text{load}} = 0.635$, $M_0 = 12.30$, $\rho_\tau = 0.59$
  - Log 14 (1968–1994): $\Phi_{\text{load}} = 0.835$, $M_0 = 90.81$, $\rho_\tau = 0.89$
  - Log 15 (1994–present): $\Phi_{\text{load}} = 0.885$, $M_0 = 206.89$, $\rho_\tau = 0.98$
  - Log 17 (2010s–present): $\Phi_{\text{load}} = 0.930$, $M_0 = 575.40$, $\rho_\tau = 1.01$

  These solved values conform directly to the manuscript's runtime log ranges: early eras (logs 1–5) require $M_0 \approx 3\text{--}7$, while late eras (log 14 onward) require $M_0 \approx 91\text{--}575$.

- **Default State**:
  - When `era` is undefined, lacks `interference_state`, or provides non-numeric arrays, `interferenceEngineFromEra` returns the artifact defaults ($u = 0.6, \eta = 0.1, \Phi_{\text{load}} = 0.403, M_0 = 3, \log = 15$) with `modelDefault: true`.
  - In `settings` mode, this condition renders the exact required notification: `"Model default: this log does not set this instrument."`

## 5. Excluded Components and Rationale

Per the instructions in `CATALOGUE.md` section 4, components outside Part 1 remain excluded:

- **Part 2 (Model C Synthetic Signal and Spectrum)**: Excluded. Demonstrates Fourier periodograms and time-domain signal synthesis for validation analysis.
- **Part 3 (Measured Proxy Spectra)**: Excluded. Displays spectral density comparisons and rolling ten-year windows for Google Trends, Congressional Record, and ANES datasets.
- **Shock Response Panels**: Excluded. Handled by the dedicated `BacklashOscillator` instrument.
- **Runtime DFT Calculations**: Excluded. The O($N \cdot K$) Discrete Fourier Transform computations from Parts 2 and 3 remain outside the dashboard rendering path.

## 6. Data Provenance

- **Embedded Dataset**: `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/data/interference-engine.json`
- **Origin**: Copied verbatim from line 193 of `Architecting_the_operation/video/yt02/stage/artifacts/interference-engine.html`.
- **Contents**: The complete `DATA` object, comprising:
  - `gt`: Weekly Google Trends series for class and identity terms (2004–2024).
  - `cr`: Congressional Record term frequency counts (1965–2024).
  - `anes`: ANES issue salience series for economy, race, and cross-group solidarity (1948–2020).
  - `log`: 16 Compiled Runtime Log records with $\Phi_{\text{load}}$ and $\rho_\tau$ coordinate intervals.

## 7. Verification Results

### Check 1: TypeScript Diagnostics

```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'InterferenceEngineView' || echo "no errors in InterferenceEngineView"
```

**Output**:
```
no errors in InterferenceEngineView
```

### Check 2: Server-Render Smoke Test

The component was bundled with esbuild in the scratchpad (`smoke_entry.tsx`), mirroring `check_dashboard.mjs`. Static markup was generated via `renderToStaticMarkup` for all three modes using log 2 era data, evaluated twice to ensure determinism.

**Output**:
```
--- RUNNING SERVER-RENDER SMOKE TEST ---
MODE compact : PASS, length = 3891 bytes
MODE expanded: PASS, length = 29594 bytes
MODE settings: PASS, length = 10841 bytes
--- ALL MODES PASSED IDENTICAL RENDER CHECK ---
```

### Check 3: Rhetorical Constraint Verification

```bash
python3 tools/check_antithesis.py Architecting_the_operation/video/yt02/stage/dashboard/artifacts/InterferenceEngineView.tsx
python3 tools/check_antithesis.py Architecting_the_operation/video/yt02/stage/dashboard/artifacts/PORT_interference-engine.md
```

**Output**:
```
check-antithesis: no banned constructions found.
```
