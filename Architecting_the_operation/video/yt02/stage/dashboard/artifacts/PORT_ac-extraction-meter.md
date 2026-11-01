# Port Report: AC Extraction Meter (`ac-extraction-meter`)

## Port Summary

- Component: `AcExtractionMeterView`
- Helper function: `acExtractionMeterFromEra`
- File: `Architecting_the_operation/video/yt02/stage/dashboard/artifacts/AcExtractionMeterView.tsx`
- Source artifact: `Architecting_the_operation/video/yt02/stage/artifacts/ac-extraction-meter.html`
- Catalogue reference: `Architecting_the_operation/video/yt02/stage/artifacts/CATALOGUE.md` (Item 9)

## Ported Functions and Formulas

The mathematical model and rendering functions from `ac-extraction-meter.html` were ported into deterministic TypeScript:

1. **Phasor Power Calculations**:
   - Complex power: $S = V \cdot I^* = P + jQ$
   - Real power: $P = \psi_m = |V||I| \cos \theta$
   - Reactive power: $Q = \psi_s = |V||I| \sin \theta$
   - Apparent power: $|S| = |W| = |V||I|$
   - Power factor: $\cos \theta$
   - Wage plane clock orientation: $h = ((6 - \theta/30) \pmod{12} + 12) \pmod{12}$

2. **Waveform Carrier Split**:
   - State voltage: $v(t) = |V| \cos \omega t$
   - Labor current: $i(t) = |I| \cos(\omega t - \theta)$
   - Real power component: $p_{\text{real}}(t) = |V||I| \cos \theta (1 + \cos 2\omega t)$
   - Reactive power component: $p_{\text{reac}}(t) = |V||I| \sin \theta \sin 2\omega t$
   - Module-level memoized carrier integration over two cycles confirms that the net work of the reactive component evaluates to zero, representing the Buffer-Class Work Theorem (eq. 0.15).

3. **Reparations Integral**:
   - $\mathcal{R} = \int_{1619}^{2026} \text{Re}[V \cdot I^*] \, dt$ (eq. 0.16)
   - 1619–1865 (DC era): $P(t) = \text{dc}$
   - 1865–1965 (Rectified era): $P(t) = \text{dc} \cdot (\text{hw} + (1 - \text{hw}) \cos \theta)$
   - 1965–2026 (AC era): $P(t) = \text{ac} \cos \theta$
   - Numeric integration over 815 points produces cumulative running integral $\mathcal{R}$ and era share percentages.

4. **Regime Diagnostic Text**:
   - $\theta = 0^\circ$: DC limit, $W = \psi_m$ (eq. 0.7a). Open, unidirectional extraction.
   - $|\theta| < 88^\circ$: AC mode, covert extraction where real power flows and reactive power obscures direction.
   - $88^\circ \le |\theta| \le 92^\circ$: Pure reactive power, zero net work transfer.
   - $|\theta| > 92^\circ$: Quadrant II reversal where $\cos \theta < 0$.
   - $\theta < -2^\circ$: Status inversion and negative status wage $\psi_s$.

## Compact Readout

The compact view fills the $177 \times 80$ pixel content box:
- Left: A $62 \times 62$ pixel mini-phasor diagram depicting the unit coordinate frame, vertical axis ($+\psi_m$ in green downward, $-\psi_m$ in red upward), horizontal axis ($\pm\psi_s$ in bronze), reference voltage vector $V$ (ivory wire), current vector $I$ (teal), and complex power vector $S$ (accent orange).
- Right: A mono text column presenting an 11 px uppercase title (`AC EXTRACTION`), a 13 px tabular primary reading (`cos θ <value>`), and an 11 px secondary clock reading (`<H:MM>`).

## Era Mapping and Model Defaults

The `acExtractionMeterFromEra` function implements the specifications defined in `CATALOGUE.md`:
- Era logs map chronologically to regimes: logs 3 and 5 fall within the DC era (1619–1865), log 9 falls within the rectified era (1865–1965), and logs 14, 15, and 17 fall within the AC era (1965–2026). Log 2 (1486) precedes the 1619 baseline.
- `dashboard_eras.json` contains no numeric fields configuring $\theta$, voltage, current, or era extraction shares.
- The function returns `modelDefault: true` alongside default model inputs ($\theta = 55^\circ$, $|V| = 1.0$, $|I| = 1.0$, $\text{dc} = 1.0$, $\text{hw} = 0.60$, $\text{ac} = 1.0$).
- When `modelDefault` is true, the settings view renders the designated statement: "Model default: this log does not set this instrument."

## Omissions and Architecture

1. **State Isolation**: Interactive controls (`<input type="range">`, `<button>`) exist exclusively in `InteractiveAcExtractionMeterView` under `interactive = true`. Non-interactive SSR mode uses static indicator tracks and plain text spans.
2. **Hook Trapping**: Non-interactive render paths contain no React state or lifecycle hooks (`useState`, `useEffect`, `useRef`, `useReducer`), ensuring compatibility with Remotion static generation.
3. **Data File**: `data/ac-extraction-meter.json` was omitted. The original HTML artifact contains no embedded JSON or CSV datasets; all constants and era definitions are defined directly in the source model.

## Data Provenance

- Era boundaries (1619, 1865, 1965, 2026) derive from manuscript specifications (`Paper/The_Original_Power.tex:1240–:1275`, `:1385`).
- Mathematical equations (eqs. 0.7, 0.7a, 0.8, 0.9, 0.13, 0.14, 0.15, 0.16) follow manuscript definitions.
- External economic estimates cited in artifact annotations (Craemer $14–17 trillion; Darity and Mullen $10–12 trillion) are recorded as illustrative references from cited literature.

## Verification Output

### 1. TypeScript Diagnostic Gate

```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage 2>&1 | grep -i 'AcExtractionMeterView' || echo "no errors in AcExtractionMeterView"
```

Output:
```
no errors in AcExtractionMeterView
```

### 2. Static SSR Smoke Test

The smoke test bundled the view with esbuild following the configuration in `stage/tools/check_dashboard.mjs`, invoked `renderToStaticMarkup` across all three modes with `interactive: false` and the log 2 era, and asserted byte-for-byte identical output over consecutive executions.

Output:
```
PASS: mode=compact rendered identically twice (1985 bytes).
PASS: mode=expanded rendered identically twice (90294 bytes).
PASS: mode=settings rendered identically twice (7836 bytes).
ALL MODES PASS STATIC SSR PURITY CHECKS.
```
