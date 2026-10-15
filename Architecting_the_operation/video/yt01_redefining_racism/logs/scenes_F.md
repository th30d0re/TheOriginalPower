# Group F scene findings (revision pass)

Metal render: OK (`.venv-manimgx`, 960x540@15). Sheets: `/tmp/S*-sheet.png` via `edit16x9.py sheet`.

| Run | Class · file | Status | Revision changes |
|-----|----------------|--------|------------------|
| S17-01 | FractalExecution · `fractal16x9.py` | rendered · layout clean | (unchanged this pass) |
| S17-25 | FractalExecution · `fractal16x9.py` | rendered · layout clean | (unchanged this pass) |
| S17-39 | FractalExecution · `fractal16x9.py` | rendered · layout clean | (unchanged this pass) |
| S17-52 | PhaseLoading · `interference16x9.py` | rendered · layout clean | Large phasor ring (r≈2.35) beside equation column; per-shot formula beats; alignment/cancellation/1968–1990 axis injection |
| S17-65 | PhaseLoading · `interference16x9.py` | rendered · layout clean | Scaled π phasor panel and Tier 3 labels |
| S18-01 | LexicalFractal · `lexical16x9.py` | rendered · layout clean | (unchanged this pass) |
| S19-01 | CorruptedFirewall · `corrupted_firewall16x9.py` | rendered · layout clean | Full-width OS stack (w≈10.8), 36–44 px tier labels |
| S20-23 | EliteWealthFig29 · `elite_wealth_fig29_16x9.py` | rendered · layout clean | Rebuilt Figure 2.9 from tex coordinates: bands, 25% reference, animated line, event markers, 1929/2020 labels below chart |
| S21-01 | ThreeModes · `three_modes16x9.py` | rendered · layout clean | Larger lanes; cue-driven lane focus + distinct example strip each shot |
| S22-02 | EqRecapClose · `eq_recap_close16x9.py` | rendered · layout clean | Equation panel 54 px math, wider panel |

## Contract / port notes

- Wealth series coordinates copied from `fig:elite_wealth_accumulation` TikZ in manuscript (read-only).
- Phasor layout follows `uef/interference.py` phase language; 16:9 uses ring geometry not vertical waves.

## Cue words

- Unchanged from first pass (`installed` S19-01, `recovery` S20-23).

## Unfinished

- None for group F primary runs.
