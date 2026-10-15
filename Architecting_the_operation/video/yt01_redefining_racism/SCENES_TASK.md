# YT01 scene build — worker brief

You are building manimgx scenes for YT01 *What Racism Really Is*, a 1920×1080 YouTube video of
Chapter 2 of *The Original Power*, timed to a voiceover that already exists. Your dispatch line
names your **group letter**; the table at the bottom lists the files you own.

## Rules (read first, they are binding)

1. **Write only the files your group owns** (under `Architecting_the_operation/video/yt01_redefining_racism/manim/`)
   and your findings file `Architecting_the_operation/video/yt01_redefining_racism/logs/scenes_<letter>.md`.
   Write nothing anywhere else: no helper scripts, no test files, no files at the repo root, no
   scratch PNGs in the repo (use `/tmp`). Never run `git`. Never touch `Paper/`.
2. **Do not edit** `common16x9.py`, `edit16x9.py`, `cards16x9.py`, `causal_structure16x9.py`, the shot
   list, the cards, or another group's files. If the shared contract is wrong or missing something,
   write it in your findings file and work around it inside your own file.
3. On-screen text follows `yt01_redefining_racism/BRIEF.md` "Hard rules": **no antithesis or
   corrective contrast** ("not X but Y", "X, not Y", "more than just", "instead of", "rather than");
   the five positions are **tiers** (never jobs, roles, levels); evidence grades are
   **"confidence Tier 1/2/3"**. Use the book's names exactly (Elite, Puppet Class, Enforcement Class,
   Buffer Class, Out-group, status wage, material wage, Δmax = 0, …). Numbers come from the chapter
   (`Paper/The_Original_Power.tex` lines 1621–2735, read-only) and are copied exactly. Invent no facts.
4. Equations are `MathTex` copied **verbatim** from the tex (including `\dot\cup`, `\mathcal`,
   `\text{}`); manimgx renders real LaTeX. Find each by its `\label{eq:...}` or number.

## Read, in this order

1. `manim/common16x9.py` — the module docstring is the **run contract**. Palette (`INK` cream,
   `GOLD`, `DIM`, `BG` navy, `NAVY2`, `HER` red, `HIM` blue, `OK` green, `TEAL`), `T()` text helper
   (min 28 px), `M()` MathTex helper, `qr()`, `YTScene` / `YTScene3D` (3-D; pin overlays with `flat()`).
2. `manim/causal_structure16x9.py` — a finished exemplar of the contract. Copy its shape.
3. Your runs: `.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns <segs>`
   (run from the repo root) prints every run: its shots, each shot's start time, **the spoken words
   cues match against**, and the shot's `Note`, which is the visual spec for that shot. For SEG 09–22,
   `yt01_redefining_racism/scenes.md` adds cue words and ports per scene.
4. Ports named in your table: `Architecting_the_operation/video/uef/*.py` (vertical 1080×1920 reels,
   usable half-width 3.6) — re-lay them out for the 16:9 frame (half-width ~6.6). Book figure stills
   are in `yt01_redefining_racism/figures/` (look at them); rebuild the figure in manimgx from the
   TikZ in the tex.

## How a scene is built

- One render = one **run** = a primary shot plus its holds. Implement `def shot_S03_08(self):` for
  each primary your class owns (ids are in your table). `construct()` comes from the base: it calls
  `begin()`, your method, then waits to the run's end. Do not override `construct`.
- `self.at(k, "word")` = absolute time of a spoken word in the run's k-th shot (k=0 is the primary;
  prefix match on the words `turns` printed; `nth=` for repeats). `self.beat(k)` / `self.beat_end(k)`
  = that shot's window. `self.until(t)` waits to absolute time t. **Never hard-code seconds**: every
  beat waits on a spoken word, so a re-recorded turn re-times itself. A missing cue word raises
  `KeyError` at render: pick a word that is in that turn.
- Each shot's change happens inside its own window. A hold may **return after other shots** (its
  start time is later than the previous shot of the run plus one): while other shots are on screen
  your scene keeps running unseen, so put the returning shot's state in place by `beat(k)` — its
  first frame is what the viewer sees on the cut.
- Text: short labels (≤ ~6 words), keep everything inside x ∈ [−6.6, 6.6], y ∈ [−3.7, 3.7] (the
  frame is 14.2 × 8 units). Use only manimgx APIs used in the exemplar, `orthographic16x9.py`, or the
  `uef/` reels, or ones you verify exist in `.venv-manimgx/lib/python3.13/site-packages/manimgx/`
  (it follows the Manim CE API; `MarkupText` does not exist).

## Acceptance, per run (do it yourself)

From the repo root, outside any sandbox (manimgx needs Metal):

```
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render <seg> --only <primary id> -j 1
```

It writes `outputs/YT01/video/runs/960x540@15/<id>.mp4`, a `.log`, and storyboard PNGs. Pass =
`ok`, and the log's last line says `layout: no problems`. Look at the storyboard PNGs if you can view
images: no overlapping or clipped text, nothing off-frame, the picture matches each shot's Note. If
the render cannot launch Metal, say so in your findings and stop retrying.

## Findings file

`logs/scenes_<letter>.md`: one line per run (id, class, status: rendered / layout problems /
placeholder, and what it shows), then any contract problems, cue words you could not find, and
anything left unfinished and why. Write it even if you finish everything.

## Groups

| Group | Files you own (classes · primary ids) | Ports / figures |
|---|---|---|
| A | `orthographic16x9.py` (Orthographic16x9 · S01-02, S03-50 — **rewrite** its single `construct` into these two methods for the real turns; scale the cone up ~1.3×; S01-02 is the front view assembling and tier-by-tier focus, S03-50 is the camera under the Buffer looking up, the orthographic illusion, reusing the existing camera path), `four_components16x9.py` (FourComponentLoop · S01-19), `enclosure_specialization16x9.py` (EnclosureSpecialization · S01-28), `set_primer16x9.py` (SetTheoryPrimer · S02-01, 19 shots), `binary_refinement16x9.py` (BinaryRefinement · S03-01, S03-08, S03-17), `outgroup_axes16x9.py` (OutgroupAxes · S03-25), `recursive_partition16x9.py` (RecursivePartition · S03-31), `binary_zoom16x9.py` (ZoomingBinary · S03-46) | Figure 2.1 rebuild (`figures/fig2.1_table2.1_p109.png`) |
| B | `racial_test_case16x9.py` (RacialTestCase · S04-01), `status_wage16x9.py` (StatusWage · S04-05), `concession_funding16x9.py` (ConcessionFunding · S04-10), `predatory_minmax16x9.py` (PredatoryMinMax · S04-16), `causal_reversal16x9.py` (CausalReversal · S05-01, S05-21, S05-22), `maintenance_mechanisms16x9.py` (MaintenanceMechanisms · S05-33), `hierarchy_inversion16x9.py` (HierarchyInversion · S06-29) | Figure 2.2 (`fig2.2_p112.png`), Figure 2.3 (`fig2.3_p116.png`) |
| C | `virus_architecture16x9.py` (VirusArchitecture · S07-01), `mind_virus16x9.py` (MindVirus · S07-07), `rootkit16x9.py` (ResourceMiningRootkit · S08-11), `minimum_forcing16x9.py` (MinimumForcing · S08-17, Eq 2.8 integral fill), `kernel_userspace16x9.py` (KernelAndUserSpace · S08-22 **and** KernelUserSpace · S20-01), `stationary_leaders16x9.py` (StationaryLeaders · S08-25) | — |
| D | `kerneloptimization16x9.py` (KernelOptimizationCase · S09-01, CottonGinConfound · S09-13), `minimumforcing16x9.py` (MinimumForcing · S09-16), `zeroday16x9.py` (ZeroDayExploit · S10-01), `cline16x9.py` (ClineGradient · S10-05, BinaryPartitionCut · S10-13), `botnet16x9.py` (TransatlanticBotnet · S10-15), `bayesdefense16x9.py` (HostWetware · S11-01, BayesPriorSwamp · S11-09), `interfaceswap16x9.py` (InterfaceSwapIntro · S12-01, ExeRecompile · S12-05, CostBarsOverTime · S12-20) | Figure 2.4 is a card (not yours) |
| E | `rlc_topology16x9.py` (RLCTopology · S13-01, S13-06), `backlash_oscillator16x9.py` (BacklashOscillator · S13-14, S13-22), `resonance_sweep16x9.py` (ResonanceSweep · S13-27, S13-28), `suppression_envelope16x9.py` (SuppressionEnvelope · S14-07), `coherence_threshold16x9.py` (CoherenceThreshold · S14-16, S15-11), `backlash_wave16x9.py` (BacklashWave · S15-10), `complex_wage16x9.py` (ComplexWage · S16-01, S16-08, **and** StatusWage · S19-14), `lorentz_force16x9.py` (LorentzForce · S16-10), `coil_gun16x9.py` (CoilGunInterface · S16-31) | `uef/driven_oscillator.py`, `uef/complex_wage.py`, `uef/lorentz_force.py`; Figures 2.5, 2.6, 2.8 rebuilt; Figure 2.7 panels are PNGs `figures/eq08_10_backlash_wave_panel_[a-d].png` (use `m.ImageMobject`); Figure 2.6 and 2.8 curves are labelled **illustrative** on screen |
| F | `fractal16x9.py` (FractalExecution · S17-01, S17-25, S17-39), `interference16x9.py` (PhaseLoading · S17-52, S17-65), `lexical16x9.py` (LexicalFractal · S18-01), `corrupted_firewall16x9.py` (CorruptedFirewall · S19-01), `elite_wealth_fig29_16x9.py` (EliteWealthFig29 · S20-23), `three_modes16x9.py` (ThreeModes · S21-01), `eq_recap_close16x9.py` (EqRecapClose · S22-02) | `uef/interference.py`; Figure 2.9 rebuilt (`fig2.9_p158.png`) |

Some primaries carry a card JSON in their Render line (e.g. `ZoomingBinary cards/S03-46.json`):
`self.card()` returns it; use its headline and items as the on-screen copy.

The post-1965 case uses the operationalization paragraph's mapping (BRIEF rule 9): top-decile wealth
share → ψ_s, incarceration → R(t), inverse union density → phase load.
