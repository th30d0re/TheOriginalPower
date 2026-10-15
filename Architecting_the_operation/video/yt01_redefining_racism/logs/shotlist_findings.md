# YT01 shot-list findings

## Card JSON schema

Every card contract is a JSON object with `kind`, `headline`, `items`, `sources`, and `qrUrl`. `kind` is one of `title`, `stat_bars`, `quote`, `table`, `equation`, `figure`, `source`, `compare`, or `timeline`. `items` is an ordered array of objects with `title` and `detail`; kinds with a specialized visual may use an empty array. A source item may also carry its own `qrUrl` when one card presents several cited artifacts. `sources` is the exact on-screen source line. The card-level `qrUrl` is a bibliography-supplied DOI or stable URL, or `null` when links live on individual source items.

Equation cards also carry `latex`, `number`, and ordered `terms` objects with `latex` and `gloss`. Figure cards also carry `image` and `caption`. Quote cards also carry `quote` and `attribution`. These fields form the shared contract for `cards16x9.py`.

## Segment findings

### Segment 00

- Provisional count: 8 turns, 8 shots, 3 card JSON files, 8 manim shots, 0 figures.
- Every turn has a visual assignment.
- Source-key issues: none.

### Segment 01

- Provisional count: 29 turns, 29 shots, 7 card JSON files, 29 manim shots, 0 figures.
- Every turn has a visual assignment.
- Source-key issues: none.

### Segment 02

- Provisional count: 19 turns, 19 shots, 0 card JSON files, 19 manim shots, 0 figures.
- Every turn has a visual assignment.
- Source-key issues: none.

### Segment 03

- Provisional count: 51 turns, 51 shots, 6 card JSON files, 51 manim shots, 1 figure.
- Every turn has a visual assignment.
- Figure 2.1 is assigned a manimgx rebuild with `figures/fig2.1_table2.1_p109.png` as the page-still fallback.
- Source-key issues: none.

### Segment 04

- Provisional count: 18 turns, 18 shots, 5 card JSON files, 18 manim shots, 0 figures.
- Every turn has a visual assignment.
- `dubois` and `roediger` are present in `references.bib`. Their entries provide no DOI or stable URL, so the related cards carry no QR.
- Source-key issues: none.

### Segment 05

- Provisional count: 38 turns, 38 shots, 7 card JSON files, 38 manim shots, 1 figure.
- Every turn has a visual assignment.
- Figure 2.2 is assigned a manimgx rebuild with `figures/fig2.2_p112.png` as the page-still fallback.
- `biewen` supplies a stable URL and `sweet_iberian_roots_1997` supplies a DOI. `fields1990`, `zurara`, and `bethencourt_racisms_2013` supply no DOI or stable URL.
- Source-key issues: none.

### Segment 06

- Provisional count: 35 turns, 35 shots, 6 card JSON files, 35 manim shots, 1 figure.
- Every turn has a visual assignment.
- Figure 2.3 is assigned a manimgx rebuild with `figures/fig2.3_p116.png` as the page-still fallback.
- Source-key issues: none.

### Segment 07

- Provisional count: 31 turns, 31 shots, 9 card JSON files, 31 manim shots, 0 figures.
- Every turn has a visual assignment.
- Multi-source empirical cards place bibliography-derived DOI links on individual source items.
- All 15 newly shown bibliography entries supply DOI links.
- The script says Ruiz-Narváez 2024. `references.bib` records the journal issue as 2025 and carries a 2024 DOI suffix. The source card and citation table use the bibliography's 2025 publication year.
- Source-key issues: none.

### Segment 08

- Provisional count: 28 turns, 28 shots, 5 card JSON files, 28 manim shots, 0 figures.
- Every turn has a visual assignment.
- Equations 2.7 and 2.8 preserve the source LaTeX. Equation 2.8 is assigned a dedicated integral-fill scene.
- `declaration_independence_1776` supplies a stable URL. `acemoglu_robinson` supplies no DOI or stable URL.
- Source-key issues: none.

### Segment 09

- Provisional count: 20 turns, 20 shots, 7 card JSON files, 20 manim shots, 1 figure.
- Every turn has a visual assignment.
- Figure 2.4 uses `figures/eq05_kernel_optimization.png` with animated callouts.
- `census_1860` supplies a stable URL and `flachs_jevons_paradox` supplies a DOI. The other newly shown case-study entries supply no DOI or stable URL.
- Source-key issues: none.

### Segment 09


- **Turns:** 20
- **Shots:** 20
- **Card JSON files:** 7 (S09-02, S09-03, S09-05, S09-08, S09-11, S09-15, S09-17)
- **Manim shots (non-hold primary):** 5 (S09-01, S09-02, S09-03, S09-05, S09-08, S09-11, S09-13, S09-15, S09-16, S09-17 — 10 primary renders; 10 holds)
- **Figures:** 1 (Figure 2.4 via `figures/eq05_kernel_optimization.png`)
- **Turns without a visual:** none
- **Bibliography gaps:** `census_hist_stats`, `hadden_slave_patrols`, `beckert`, `baptist`, `jevons_coal_question`, `lakwete_cotton_gin` have no DOI or stable URL in `references.bib` (QR only on S09-11 via `census_1860` and item-level QR on Flachs in S09-15).

### Segment 10


- **Turns:** 23
- **Shots:** 23
- **Card JSON files:** 11 (S10-02, S10-03, S10-06, S10-08, S10-09, S10-11, S10-12, S10-14, S10-17, S10-19, S10-22)
- **Manim diagram shots:** 4 scene families (ZeroDayExploit, ClineGradient/BinaryPartitionCut, TransatlanticBotnet, CardScene)
- **Figures:** 0 (cline and botnet are manimgx rebuilds, not book figure numbers)
- **Turns without a visual:** none
- **Bibliography gaps:** `yurco_egyptians_1989` has no DOI or stable URL in `references.bib`. Huxley cline is spoken on S10-05 but shown only on the cline diagram (citation row included in `citations_10.md` for completeness).

### Segment 11


- **Turns:** 21
- **Shots:** 21
- **Card JSON files:** 9 (S11-03, S11-04, S11-06, S11-07, S11-10, S11-15, S11-16, S11-18, S11-21)
- **Manim diagram shots:** HostWetware, BayesPriorSwamp, CardScene
- **Figures:** 0
- **Turns without a visual:** none
- **Bibliography gaps:** `tajfel_turner_intergroup_conflict_1979` and `ifas_1966` have no DOI or stable URL in `references.bib`.

### Segment 12


- **Turns:** 39
- **Shots:** 39
- **Card JSON files:** 17 (S12-03, S12-09, S12-11, S12-12, S12-17, S12-22, S12-25, S12-26, S12-28, S12-29, S12-30, S12-31, S12-34, S12-35, S12-36, S12-37, S12-38)
- **Manim diagram shots:** InterfaceSwapIntro, ExeRecompile, CostBarsOverTime, CardScene
- **Figures:** 0
- **Equations:** 2.9 and 2.10 (card JSON)
- **Turns without a visual:** none
- **Bibliography gaps:** `woodard_delectable`, `cartwright_report`, `dudziak`, `baum`, `atwater`, `lopez`, `aclu2013`, `aclu2020`, and `Williams v. Mississippi` (cited in prose only) lack DOI or stable URL in `references.bib` except where noted in `citations_12.md`.

### Segment 13


- **Turns:** 33
- **Shots:** 33
- **Card JSON files:** 7 (S13-02, S13-06, S13-10, S13-22, S13-28, S13-31, S13-32)
- **Manim diagram/figure shots (non-hold):** 6 (S13-01, S13-06, S13-14, S13-22, S13-27, S13-28)
- **Figures:** Figure 2.5 (manim rebuild + `figures/fig2.5_p134.png` fallback); Figure 2.6 (manim rebuild + `figures/fig2.6_p135.png` fallback)
- **Turns without a dedicated visual:** none
- **Bibliography gaps:** segment cites book framework only; no new `references.bib` keys on screen

### Segment 14


- **Turns:** 16
- **Shots:** 16
- **Card JSON files:** 5 (S14-01, S14-05, S14-10, S14-12, S14-16)
- **Manim diagram/figure shots (non-hold):** 2 (S14-07, S14-16)
- **Figures:** Figure 2.8 manim rebuild with `figures/fig2.8_p140.png` fallback; illustrative-curve qualifier on card and shot Note
- **Turns without a dedicated visual:** none
- **Bibliography gaps:** `morgan_american_slavery` has no DOI or stable URL in `references.bib` (card QR uses `anes_cumulative` URL only for modern calibration line)

### Segment 15


- **Turns:** 19
- **Shots:** 19
- **Card JSON files:** 12 (S15-01, S15-02, S15-03, S15-05, S15-06, S15-07, S15-09, S15-10, S15-12, S15-14, S15-16, S15-17)
- **Manim figure shots (non-hold):** 2 (S15-10 full Figure 2.7 rebuild; S15-11 Figure 2.8 reuse)
- **Figures:** Figure 2.7 panels a–d (`figures/eq08_10_backlash_wave_panel_{a,b,c,d}.png`) on turns S15-05–S15-09; full Figure 2.7 on S15-10; Figure 2.8 illustrative rebuild on S15-11 (holds S14-16 card)
- **Turns without a dedicated visual:** none
- **Bibliography gaps:** Troy & Sheflin union historical compilation is named in script and chapter but has **no key** in `Paper/references.bib` (cited in `citations_15.md` without invented URL)

### Segment 16


- **Turns:** 56
- **Shots:** 56
- **Card JSON files:** 8 (S16-02, S16-04, S16-13, S16-18, S16-26, S16-37, S16-47, S16-54)
- **Manim shots (non-hold primary):** 6 (S16-01, S16-02, S16-04, S16-08, S16-10, S16-13, S16-18, S16-26, S16-31, S16-37, S16-47, S16-54 — count distinct scene entry points: ComplexWage, LorentzForce, CoilGunInterface, CardScene)
- **Figures:** 0
- **Turns without illustration:** none
- **Source keys missing from references.bib:** none (segment cites manuscript constructs only)

### Segment 17


- **Turns:** 67
- **Shots:** 67
- **Card JSON files:** 10 (S17-02, S17-04, S17-09, S17-10, S17-26, S17-40, S17-46, S17-52, S17-60, S17-65)
- **Manim shots:** FractalExecution, PhaseLoading, CardScene (see `scenes_17.md`)
- **Figures:** 0
- **Turns without illustration:** none
- **Source keys missing from references.bib:** none for on-screen citations (`anes_cumulative` supplies stable URL; no DOI required)

### Segment 18


- **Turns:** 44
- **Shots:** 44
- **Card JSON files:** 12 (S18-04, S18-05, S18-07, S18-08, S18-10, S18-13, S18-15, S18-17, S18-22, S18-26, S18-37, S18-42)
- **Manim shots:** LexicalFractal, CardScene (see `scenes_18.md`)
- **Figures:** 0
- **Turns without illustration:** none
- **Source keys:** `eglash_broken` has no DOI or URL in `references.bib` (QR omitted on Eglash cards). LA County / GitHub / Linux / IETF keys cited on timeline card source line; individual QR URLs not duplicated where bibliography entries lack stable links.

### Segment 19


- **Turns:** 33
- **Shots:** 33
- **Card JSON files:** 9 (S19-05, S19-07, S19-09, S19-12, S19-13, S19-18, S19-22, S19-26, S19-33); S19-11 holds existing S04-07.json
- **Manim shots:** 33 (CorruptedFirewall, StatusWage, CardScene)
- **Figures:** 0

Every turn has a visual assignment.

**Source-key issues:** none. Pratto, Altemeyer, and Duckitt entries supply DOIs used on the source card.

**Turns not illustrated:** none.

### Segment 20


- **Turns:** 35
- **Shots:** 35
- **Card JSON files:** 9 (S20-02, S20-03, S20-10, S20-15, S20-16, S20-23 figure contract, S20-32, S20-33, S20-34)
- **Manim shots:** 35 (KernelUserSpace, EliteWealthFig29, CardScene)
- **Figures:** 1 (Figure 2.9 manim rebuild; page still `figures/fig2.9_p158.png`)

Every turn has a visual assignment.

**Source-key issues:** Malcolm X has no `references.bib` key; quote card carries no QR. `piketty` supplies `https://wid.world`.

**Turns not illustrated:** none.

### Segment 21


- **Turns:** 27
- **Shots:** 27
- **Card JSON files:** 7 (S21-02, S21-04, S21-09, S21-15, S21-16, S21-20, S21-27)
- **Manim shots:** 27 (ThreeModes, CardScene)
- **Figures:** 0

Every turn has a visual assignment.

**Source-key issues:** `zurara`, `baum`, and `atwater` have no DOI or stable URL in `references.bib`; related cards carry no QR.

**Turns not illustrated:** none.

### Segment 22


- **Turns:** 13
- **Shots:** 13
- **Card JSON files:** 5 (S22-01, S22-10, S22-11, S22-12, S22-13)
- **Manim shots:** 13 (EqRecapClose, CardScene)
- **Figures:** 0

Every turn has a visual assignment.

**Source-key issues:** none. End-card QR uses the operator-specified releases URL (not a bibliography entry).

**Turns not illustrated:** none.
