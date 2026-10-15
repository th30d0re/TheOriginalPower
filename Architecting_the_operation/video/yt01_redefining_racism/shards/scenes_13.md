# Scene inventory — SEG 13

## RLCTopology

- **File:** `yt01_redefining_racism/manim/rlc_topology16x9.py`
- **Shots:** S13-01, S13-06–S13-09
- **Beats:** Series loop assembles; voltage source labels kinetic supply; R/L/C receive sociological glosses; Figure 2.5 topology matches book circuitikz layout.
- **Port:** New scene (circuitikz-style build); reference `figures/fig2.5_p134.png` for label placement.

## BacklashOscillator

- **File:** `yt01_redefining_racism/manim/backlash_oscillator16x9.py`
- **Shots:** S13-14–S13-21, S13-22–S13-26, S13-33
- **Beats:** q = 0 baseline; 1865 and 1964 shock arrows; overshoot labels; illustrative-parameter badge; decay envelope and moral-universe caption; equality vs extraction zones.
- **Port:** `video/uef/driven_oscillator.py` (`DrivenOscillator`) — damped sinusoid, era annotations, inductive kickback callout.

## ResonanceSweep

- **File:** `yt01_redefining_racism/manim/resonance_sweep16x9.py`
- **Shots:** S13-27–S13-30
- **Beats:** ω sweeps to ω₀; impedance collapse; |q_res| and Q_f formulas; sustained frequency-matched coordination caption.
- **Port:** Partial reuse of `driven_oscillator.py` driving-frequency control.

## CardScene (existing)

- **File:** `manim/cards16x9.py`
- **Shots:** S13-02–S13-05, S13-10–S13-13, S13-28–S13-29, S13-31–S13-32
- **Beats:** Equations 2.11–2.12 term highlights; resonance amplitude card; Δmax scope and achievement timeline cards.
