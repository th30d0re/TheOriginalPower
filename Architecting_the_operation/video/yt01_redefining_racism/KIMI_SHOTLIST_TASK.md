# Shot list, SEG 09–22, swarm task

**Never run git. Do not touch `Paper/`. Do not edit `Architecting_the_operation/video/YT01_shotlist.md`,
the script, or any existing card JSON. Write only the shard files named below and new
card JSON for your segment. No helper scripts.**

Segments 00–08 of the YT01 shot list are done. Finish segments 09 through 22.

**Use your AgentSwarm tool: one worker per segment, 14 workers (SEG 09 … SEG 22).**
Each worker owns exactly one segment, so no two workers write the same file.

## What each worker reads

1. `Architecting_the_operation/video/yt01_redefining_racism/SHOTLIST_TASK.md` — the
   rules. They are binding.
2. `Architecting_the_operation/video/yt01_redefining_racism/BRIEF.md` — the visual
   system and the segment table row for its segment.
3. `Architecting_the_operation/video/yt01_redefining_racism/logs/shotlist_findings.md`
   — the card JSON schema at the top. Follow it exactly.
4. `Architecting_the_operation/video/YT01_shotlist.md` — the finished SEG 00–08 shots,
   as the model for format, tone of the Notes, hold grouping and provenance quotes.
   Look at three or four existing files in `.../yt01_redefining_racism/cards/` for
   each `kind` you use.
5. The script `Architecting_the_operation/podcasts/YT01_what_racism_really_is.md`:
   only the turns between its segment's `<!-- SEG NN` marker and the next marker.
6. `Paper/The_Original_Power.tex` lines 1621–2735 for provenance quotes, and
   `Paper/references.bib` for DOIs and URLs (never invent one).

## What each worker writes (NN = its segment)

- `.../yt01_redefining_racism/shards/SEG_NN.md` — starts with the segment's
  `<!-- SEG NN · ... -->` line copied from the script, then one `## SNN-xx` shot per
  turn, in order, same fields as the finished segments. Anchors copy the turn headers
  exactly. Every turn gets one shot.
- `.../yt01_redefining_racism/cards/SNN-xx.json` for every card, equation and figure
  shot.
- `.../yt01_redefining_racism/shards/scenes_NN.md` — each manimgx scene the segment
  needs: class name, file name, shots covered, cue words, and the `video/uef/*.py`
  scene it ports if any. Reuse an existing scene name when the same visual continues
  from an earlier segment. Existing names include `CardScene` (cards16x9.py),
  `Orthographic16x9`, `CausalReversal`, `StatusWage`, `PredatoryMinMax`,
  `KernelAndUserSpace`, `ResourceMiningRootkit`, `StationaryLeaders`, `MinimumForcing`.
  Ports BRIEF names: `uef/complex_wage.py`, `uef/lorentz_force.py`,
  `uef/driven_oscillator.py` (RLC, SEG 13), `uef/interference.py` (phase loading,
  SEG 17).
- `.../yt01_redefining_racism/shards/citations_NN.md` — table rows `| On screen | Source |`
  for every source shown in the segment, with full reference and URL when the bib has
  one.
- `.../yt01_redefining_racism/shards/findings_NN.md` — counts (turns, shots, cards,
  manim shots, figures), any turn it could not illustrate, any source key missing from
  references.bib.

## Segment-specific musts

- SEG 09: Figure 2.4 is `figures/eq05_kernel_optimization.png` as a `figure` card with
  callouts on the three Census years.
- SEG 10 and SEG 17: content-warning card before the Middle Passage /
  `biological_extraction.exe` material; plain, no imagery of violence.
- SEG 13: Figures 2.5 and 2.6 as manimgx rebuilds (circuit, damped wave with era labels);
  page stills `figures/fig2.5_p134.png`, `figures/fig2.6_p135.png` as fallback.
- SEG 15: Figure 2.7 panels a–d (`figures/eq08_10_backlash_wave_panel_{a,b,c,d}.png`),
  one panel per turn as the narration names each series; Figure 2.8 rebuild, curves
  marked illustrative.
- SEG 20: Figure 2.9 rebuild from the coordinates in the tex figure (top 0.1% wealth
  share 1913–2020, shaded 1935–1973 and post-1973, event markers).
- SEG 22: end card with the book QR
  `https://github.com/th30d0re/TheOriginalPower/releases` and the AI-voice disclosure.

Before finishing, the orchestrating agent checks that every shard exists and that each
SEG_NN.md has exactly as many `## S` shots as its segment has turns, and reports the
counts.
