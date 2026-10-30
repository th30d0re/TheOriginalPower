# Backlash Oscillator

An instrument for the manuscript's series RLC circuit (`Paper/The_Original_Power.tex`, eq. 1.7a,
`:2208`):

$$L\,\ddot q + R\,\dot q + \tfrac{1}{C}\,q = V(t)$$

q(t) is the equality-surplus charge (positive values are reform displacement; q = 0 is the extraction
baseline). V(t) is the reform shock. R is bureaucratic and carceral friction, L is cultural inertia,
and C is token-reform absorption capacity.

- Published page (private until shared): https://claude.ai/artifact/4GPNJkMBbGKyHfv9KmuMXv
- Local copy: open `rlc_backlash.html` in a browser. It needs no data files.

## What the page does

- **The circuit is the control panel.** Select R, L, C, or the source to reach its slider. R moves on a
  linear scale; L and C move on log scales. Time runs in years.
- **Three drives.** An impulse shock (the reform impulse of the text and of the Laplace fits), an initial
  charge Q₀ (the undriven solution, eq. 1.7b), and a sustained drive V₀ cos ωt with ω/ω₀ adjustable (the
  resonance escape condition, `:2319`).
- **The response.** q(t) is integrated numerically (fourth-order Runge–Kutta). The curve is orange above
  the baseline and red below it, in the shaded backlash zone. The page marks the reform displacement and
  the first backlash.
- **Readouts.** Damping ratio ζ = α/ω₀, natural period 2π/ω₀, decay rate α = R/2L, settling time 4/α,
  first backlash depth (as a share of the peak), first crossing below zero, quality factor
  Q = (1/R)√(L/C), and the regime.
- **Four fitted shocks.** 1865, 1964, 2008, and 2020, from `Paper/scripts/spectral_laplace.ipynb` with
  proxies in `Paper/data/backlash_proxies.csv` (`:7029`–`:7034`). Each card draws its fitted impulse
  response on its own time window. Selecting a card loads it into the circuit.

## What the presets assume

The fits identify only ζ and ω_n. Each preset therefore fixes L = 1 and sets C = 1/ω_n² and R = 2ζω_n.
The manuscript states that R, L, and C are not read off the historical record; its supported claim is
ordinal: damping rises and the period shortens from shock to shock (`:2390`). The page reproduces the
manuscript's natural periods (20.9, 12.1, 5.8, and 0.9 years) and its damping ratios (0.17, 0.59, 0.70,
0.97). The first backlash depth falls from 58% of the peak (1865) to under 1% (2020).

## Design

Palette from the mockup: cream wires and axes (#ECE7DC), red R and backlash text (#E0604A), green L
(#7CC08A), gold source and impulse (#D4A84B), on the navy field (#0D1B2A) shared with
`tools/complex_wage_plane` and `tools/interference_state`.
