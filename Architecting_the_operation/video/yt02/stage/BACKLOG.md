# YT02 Stage backlog

## Equations: explain slowly, colour-code terms, pulse on the spoken word (author, 2026-11-01)

Do this once the worker quotas refresh.

- **Pacing.** Give the key equations (Eq. 2.5, Eq. 2.8a, and later the complex wage) time on
  screen. Introduce the terms first, then the equation.
- **Colour.** Reuse the website's colour coding: `website/src/components/EquationCards.tsx`.
  - `colorizeLatex` gives each symbol a fixed palette slot through KaTeX `\htmlClass`.
  - The term detail cards carry units and source notes.
  - Use the same colours in the video and on the site.
- **Pulse.** Each term pulses at the word cue where the narration says it. The cues come from
  `word_timings.json`, through `stage_ov.yaml`.
- **Build.** Write a deterministic Stage `EquationTerms` component, with no DOM measurement in the
  render path, driven by a term→cue map.
- **Order of application:**
  1. `InstalledRacialPrior` (Eq. 2.8a).
  2. The Eq. 2.5 chain in turns 1 and 11–12.
  3. Every later equation scene.
