# Port Report: Snubber Circuit (`snubber-circuit`)

## 1. Ported Implementation Details

### Functions and Model
- **RK4 Differential Equation Solver (`simulate` / `runSimulation`)**:
  Integrated over $t \in [0, 6]$ with step size $dt = 4 \times 10^{-5}$ ($N = 150{,}000$ steps), recording 700 decimated points for waveform plotting. Circuit parameters:
  - Coil resistance $R_L = 0.05$
  - Stray capacitance $C_p = 0.002$
  - Elite diode path series resistance $R_h = 0.5$
  - Node voltage derivatives:
    $$\frac{di}{dt} = \frac{-v - R_L i}{L}$$
    $$\frac{dv}{dt} = \frac{i - i_h - i_s - i_t}{C_p}$$
    $$\frac{dv_h}{dt} = \frac{i_h}{C_{\text{next}}}$$
    $$\frac{dv_s}{dt} = \frac{i_s}{C_s}$$
  - Dynamic clamping by the bidirectional TVS node when $|v| \ge V_{br}$.
- **Module-Level Memoization**:
  Results of `runSimulation` are memoised via a module-scoped cache keyed by parameter values (`I0`, `L`, `Ch`, `Cs`, `Rs`, `Vbr`, `withH`, `withS`, `withT`), preventing redundant re-evaluations across render cycles.
- **Energy Accounting Ledger**:
  Partitioned across five channels:
  - Recovered by the Elite (`elite`): heat dissipated in $R_h$ plus potential energy stored in $C_{\text{next}}$.
  - Absorbed by the snubber grid (`grid`): heat dissipated in $R_s$ plus potential energy stored in $C_s$.
  - Clamped by the TVS node (`tvs`): $\int |v \cdot i_t| \, dt$.
  - Lost in the coil (`coil`): $\int R_L i^2 \, dt$.
  - Residual field energy (`field`): $\frac{1}{2} L i^2 + \frac{1}{2} C_p v^2$.
- **Circuit Schematic SVG**:
  Reconstructed with vector paths at 720 × 450 viewBox:
  - Inductor coil $L$ with vertical helical loops and filter glow.
  - Breach switch opening at $t = 0$.
  - Three parallel branch paths: Elite recovery path ($R_h$, $C_{\text{next}}$, ideal diode), snubber grid ($R_s$, $C_s$), and TVS breakdown clamp ($V_{br}$).
- **Surge Waveform Plot SVG**:
  Constructed at 980 × 470 viewBox with time grid lines ($t = 1 \dots 5$), zero-voltage baseline, y-axis terminal marker, dashed threshold lines for $\pm V_{br}$, and glow-filtered path geometry.
- **Verdict and Assumed Constraints**:
  Verbatim text branches for unprotected surge, elite-only recovery, and combined grid/TVS attenuation.

### Pre-defined Presets
- Preset 0: Unprotected ($h = \text{false}, s = \text{false}, t = \text{false}$)
- Preset 1: Elite recovery only ($h = \text{true}, s = \text{false}, t = \text{false}$, default)
- Preset 2: Snubber grid ($h = \text{true}, s = \text{true}, t = \text{false}$)
- Preset 3: Snubber + TVS ($h = \text{true}, s = \text{true}, t = \text{true}, V_{br} = 1.2$)
- Preset 4: Decoupled grid ($h = \text{false}, s = \text{true}, t = \text{true}, V_{br} = 1.2$)

---

## 2. Compact Readout

The compact readout occupies a content box of 177 × 80 px without exterior panel chrome:
- **Title and Peak Reading**: 11 px mono header displaying `SNUBBER` alongside `peak {f(peak, 1)}`.
- **Mini-Graphic**: A 177 × 34 px SVG sparkline plotting the back-EMF voltage transient $v(t)$ over time $t \in [0, 6]$ with an aligned zero-axis reference line.
- **Energy Bar**: A 6 px high segmented distribution bar displaying shares of elite recovery, grid absorption, TVS clamping, and residual dissipation.
- **Status Metrics**: 10 px tabular mono readout presenting the elite recovery percentage and total peak surge reduction percentage relative to the unprotected reference circuit.

---

## 3. Era Mapping and Model Defaults

As established in `CATALOGUE.md`, the artifact defines no runtime-log parameter mapping rule. The catalogue specifies:
> "A kernel breach is the page's trigger, and rho_tau_crash in log 3 (Bacon's Rebellion) marks one. Other eras carry no matching field. A driver could open the switch when rho_tau first passes 1.0 and select a path preset by era, but the page defines no such rule."

Per the contract instructions for unmapped instruments, `snubberCircuitFromEra` returns default circuit parameters with `modelDefault: true`:
- $I_0 = 1.0$
- $L = 1.0$
- $C_{\text{next}} = 0.1$
- $C_s = 0.1$
- $R_s = 1.0$
- $V_{br} = 3.0$
- $h = \text{true}, s = \text{false}, t = \text{false}$ (Preset 1)

In settings mode, the component renders the mandatory declarative notice:
`Model default: this log does not set this instrument.`

---

## 4. Omissions and Adaptations

- **DOM Event Listeners & Range Inputs in SSR**:
  The static rendering path (`interactive: false`) eliminates interactive input controls, mouse listeners, and keyboard event handlers. The interaction prompt `"Select a path in the drawing to switch it on or off."` is hidden when `interactive` is false.
- **Interactive Component Isolation**:
  Interactive state management (`useState`) is isolated within `InteractiveSnubberCircuitView`, instantiated only when `props.interactive === true`. The non-interactive rendering path (`StaticSnubberCircuitView`) executes without hooks.
- **Container Styling**:
  External HTML page chrome, background definitions (`--paper`), margins, and decorative panel wrappers were removed to allow the parent container to govern panel framing.
- **Subscript Typography**:
  All electrical indices ($I_0$, $C_{\text{next}}$, $C_s$, $R_s$, $R_h$, $R_L$, $C_p$, $V_{br}$) are rendered through `<MathText>` to produce typographic subscripts.

---

## 5. Data Provenance

The artifact contains no external empirical datasets or CSV files. All model constants and component characteristics represent theoretical parameters derived from equations 1.7d and 1.7e of the manuscript (`Paper/The_Original_Power.tex:2416–:2440`). Consequently, no companion data file (`snubber-circuit.json`) was generated.

---

## 6. Verification Checks

### Check 1: TypeScript Diagnostics
Command executed:
```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'SnubberCircuitView' || echo "no errors in SnubberCircuitView"
```
Output:
```
no errors in SnubberCircuitView
```

### Check 2: Server-Render Static Markup Smoke Test
The test script bundled `SnubberCircuitView` via esbuild and invoked `renderToStaticMarkup` twice across all three modes under `interactive: false` with the log 2 era payload (`dashboard_eras.json`). Deterministic byte-for-byte identity was verified with zero stateful hook invocations and no `NaN` or unhandled token occurrences.

Rendered markup sizes:
- **`compact` mode**: 8,811 bytes
- **`expanded` mode**: 28,744 bytes
- **`settings` mode**: 5,862 bytes
