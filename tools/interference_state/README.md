# Interference State

An instrument that reads the manuscript's Compiled Runtime Log (`Paper/The_Original_Power.tex`,
`\label{sec:runtime_log}`). For each log it shows the interference state: the phase-loading
Φ_load on a range bar from 0 to 1, and the proximity to τ, ρ_τ = M(t)/τ, on a dial from 0 to 1.2
with τ = 1.0 marked.

- Published page (private until shared): https://claude.ai/artifact/LGooxw2CeLGYkK6P78bkas
- Local copy: open `interference_state.html` in a browser. The data is embedded in the page.
- Link to one log with `#log<number>`, for example `#log15`.

## What the page shows

- **Instrument card.** The Φ_load range as an orange pill, the ρ_τ range as an orange band on the dial,
  and a needle at the middle of the range (or at the single value where a log gives one).
- **The log's words.** The Interference State line of the selected log, converted from TeX to plain
  text, with its source line in the manuscript.
- **Field chart.** Every log with both values as a box: Φ_load range across, ρ_τ range up, τ as an
  red line. Logs with only a single ρ_τ value (6, Haiti; 13, 1966) sit in a separate column. Select
  a box to read that log.

Logs 1, 4, 7, 12, and 16 give no numbers; the page shows their text only. Three logs carry notes
the text states in words: log 3 (ρ_τ above 1.00 at the 1676 crash), log 6 (the Haitian Theorem at
ρ_τ = 1.0; the range covers adjacent Caribbean zones), and log 13 (ρ_τ → 0.95).

## Reading the numbers

Across the 14 logs with both ranges, the midpoints of Φ_load and ρ_τ correlate at r = 0.63. The ranges
of logs 15, 17, 19, and 21 reach past τ = 1.0. These values are the author's estimates (Tier 2 and
Tier 3 in the manuscript's scheme), so the correlation describes how the estimates relate; it is not
a measurement.

## Rebuilding

```bash
python3 tools/interference_state/scripts/build_runtime_log.py \
  Paper/The_Original_Power.tex tools/interference_state/data/runtime_log.json \
  --embed tools/interference_state/interference_state.html
```

Run it after any change to the runtime log in the manuscript. It reproduces the committed
`data/runtime_log.json` and the embedded data byte for byte from the current manuscript.

## Design

Same identity as `tools/complex_wage_plane`: navy field (#0D1B2A), bronze line art (#8A6A45, lighter
bronze #B8956A for small labels), and accent orange (#E08A3C) for the reading. τ is red (#FF7A6B), as in
the mockup this instrument follows. (On the wage plane τ is ivory, because there it is drawn from the
Buffer's side as a threshold whose outcome is open.)
