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

## Figure 0.3 scene: five-tier extraction circuit with the inductor (author, 2026-11-05)

Figure 0.3 has no scene yet. The narration names it around turn 121 of the older OV turn map
(`feedback/OV_turn_map_2026-10-29.md`, `feedback/G_visual_audit.md` line 149), beyond the current
plan range (turns 0–62). Check the turn number against the current OV before building.

- **Content.** Match the book figure at `Paper/The_Original_Power.tex:644` (commit `9dec92f`):
  current source `F_enforce`, two-resistor potential divider `P_uppet`, capacitor `I_buffer` in
  series with the inductor `L` ("cultural inertia"), transistor `E`, ground `O`.
- **Inductor.** The book figure now carries `L` on the buffer branch. The Stage scene must draw it
  too.
- **Printed numbers.** Read "Figure 0.3" from `Paper/*.aux`, not the label name.
