# YT01 scene details, SEG 09–22

# SEG 09 · Scene inventory

## KernelOptimizationCase
- **File:** `manim/kerneloptimization16x9.py`
- **Class:** `KernelOptimizationCase`
- **Shots:** S09-01
- **Cue words:** antebellum cotton economy, kernel objective, enforcement scales with extraction
- **Port:** none (case-study frame; ties to Eq. 2.7 constraint from SEG 08)

## CardScene
- **File:** `manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** S09-02, S09-03, S09-05, S09-08, S09-11, S09-15, S09-17 and holds S09-04, S09-06–S09-07, S09-09–S09-10, S09-12, S09-18–S09-20
- **Cue words:** Census K 554–563, operationalization, three ratios, Figure 2.4, enslaved population, Jevons, falsification, Tier 1
- **Port:** `video/reel_reciprocity` card QR helper (existing `cards16x9.py` pattern)

## CottonGinConfound
- **File:** `manim/kerneloptimization16x9.py`
- **Class:** `CottonGinConfound`
- **Shots:** S09-13, S09-14
- **Cue words:** cotton gin, acreage expansion, enslaved labor demand
- **Port:** none

## MinimumForcing
- **File:** `manim/minimumforcing16x9.py`
- **Class:** `MinimumForcing`
- **Shots:** S09-16
- **Cue words:** Nat Turner 1831, slave codes tighten, tau management
- **Port:** existing `MinimumForcing` scene name from SEG 08 family

# SEG 10 · Scene inventory

## ZeroDayExploit
- **File:** `manim/zeroday16x9.py`
- **Class:** `ZeroDayExploit`
- **Shots:** S10-01
- **Cue words:** zero-day exploit, vulnerability unpatched, payload arrives
- **Port:** none

## ClineGradient / BinaryPartitionCut
- **File:** `manim/cline16x9.py`
- **Classes:** `ClineGradient`, `BinaryPartitionCut`
- **Shots:** S10-05, S10-10 (hold), S10-13, S10-21 (hold)
- **Cue words:** cline, continuous gradient, discrete binary legal partition
- **Port:** none

## TransatlanticBotnet
- **File:** `manim/botnet16x9.py`
- **Class:** `TransatlanticBotnet`
- **Shots:** S10-15, S10-16, S10-18, S10-23 (holds)
- **Cue words:** botnet, Middle Passage, Lisbon London Amsterdam Wall Street
- **Port:** none

## CardScene
- **File:** `manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** S10-02, S10-03, S10-06, S10-08, S10-09, S10-11, S10-12, S10-14, S10-17, S10-19, S10-22 and holds S10-04, S10-07, S10-20
- **Cue words:** Crawford, Jablonski, Lamason, ancient DNA, Yurco, content warning, mortality, Thistlewood, property law
- **Port:** existing card library

# SEG 11 · Scene inventory

## HostWetware
- **File:** `manim/bayesdefense16x9.py`
- **Class:** `HostWetware`
- **Shots:** S11-01, S11-02 (hold), S11-05 (hold)
- **Cue words:** pattern-recognition wetware, legally enforced racial partition
- **Port:** none

## BayesPriorSwamp
- **File:** `manim/bayesdefense16x9.py`
- **Class:** `BayesPriorSwamp`
- **Shots:** S11-09, S11-13, S11-14 (holds)
- **Cue words:** Bayesian defense, prior swamps likelihood, malicious input
- **Port:** none (prior-update animation; related cognitive motif to `uef/interference.py` phase loading in SEG 17)

## CardScene
- **File:** `manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** S11-03, S11-04, S11-06, S11-07, S11-10, S11-15, S11-16, S11-18, S11-21 and holds S11-08, S11-11, S11-12, S11-17, S11-19, S11-20
- **Cue words:** Tajfel, Friston, Clark, prior equation, IFAS, scheduling, Mode 2/3
- **Port:** existing card library

# SEG 12 · Scene inventory

## InterfaceSwapIntro
- **File:** `manim/interfaceswap16x9.py`
- **Class:** `InterfaceSwapIntro`
- **Shots:** S12-01, S12-02 (hold)
- **Cue words:** polymorphic virus, Interface Swap, payload unchanged
- **Port:** none

## ExeRecompile
- **File:** `manim/interfaceswap16x9.py`
- **Class:** `ExeRecompile`
- **Shots:** S12-05, S12-06, S12-07, S12-08 (holds)
- **Cue words:** Chattel_Slavery.exe, Jim_Crow.exe, War_on_Drugs.exe, Redlining.exe
- **Port:** none (.exe recompile animation per BRIEF)

## CostBarsOverTime
- **File:** `manim/interfaceswap16x9.py`
- **Class:** `CostBarsOverTime`
- **Shots:** S12-20, S12-21, S12-23, S12-24 (holds)
- **Cue words:** Jim Crow costs rising, Brown, swap, legitimacy falls
- **Port:** none (argmin cost bars over time per BRIEF)

## CardScene
- **File:** `manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** all card and equation shots S12-03 through S12-39 (including holds on cards)
- **Cue words:** Cartwright, Texas Observer, Equations 2.9–2.10, Ehrlichman, Atwater, incarceration stats, ACLU, Williams, Anslinger caution, Tier 2
- **Port:** existing card library

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

# Scene inventory — SEG 14

## SuppressionEnvelope

- **File:** `yt01_redefining_racism/manim/suppression_envelope16x9.py`
- **Shots:** S14-07–S14-09
- **Beats:** Stacked ψ_s, ψ_m, R, Φ_load components sum to Σ_sup; τ threshold line; ψ_m preemptive deployment animation; Buffer wealth fraction diverts coherence growth.
- **Port:** New stacked-envelope scene (no direct UEF port).

## CoherenceThreshold

- **File:** `yt01_redefining_racism/manim/coherence_threshold16x9.py`
- **Shots:** S14-16
- **Beats:** Illustrative M(t) and Σ_sup(t) curves; reform-shock vertical marker; dΣ_sup/dt ≥ dM/dt annotation; ILLUSTRATIVE CURVES badge.
- **Port:** TikZ coordinates from `fig:coherence_threshold` in chapter tex; fallback `figures/fig2.8_p140.png`.

## CardScene (existing)

- **File:** `manim/cards16x9.py`
- **Shots:** S14-01–S14-06, S14-10–S14-15
- **Beats:** Equations 2.13–2.15 term highlights; Bacon/1705 timeline card with ANES QR.

# Scene inventory — SEG 15

## CardScene (existing)

- **File:** `manim/cards16x9.py`
- **Shots:** S15-01–S15-09, S15-12–S15-19
- **Beats:** Title and source cards; operationalization table; Figure 2.7 panels a–d as figure cards with stat callouts; comparison and falsification cards; Tier 1 and ζ stat bars.

## BacklashWave

- **File:** `yt01_redefining_racism/manim/backlash_wave16x9.py`
- **Shots:** S15-10
- **Beats:** Four-panel layout matching `eq08_10_backlash_wave.png`; synchronized 1965–2020 axes; component labels ψ_s, R, Φ_load.
- **Port:** Data from `Paper/data/eq08_10_backlash_wave.csv`; panel PNGs in `figures/` as render reference.

## CoherenceThreshold (reuse)

- **File:** `yt01_redefining_racism/manim/coherence_threshold16x9.py`
- **Shots:** S15-11
- **Beats:** Figure 2.8 schematic with illustrative-curve badge for post-1965 directional comparison.
- **Port:** Same scene as SEG 14; card `S14-16.json`.

# Scene inventory — SEG 16

## ComplexWage

- **Class:** `ComplexWage`
- **File:** `yt01_redefining_racism/manim/complex_wage16x9.py`
- **Port:** `video/uef/complex_wage.py`
- **Shots:** S16-01, S16-08, S16-13 through S16-16
- **Beats:** tau threshold reminder; reactive jψ_s on imaginary axis; steady-state zero work along extraction axis; microaggression trickle-charge into U = ½LI² storage; kinetic mobilization forcing di/dt and field collapse setup.

## LorentzForce

- **Class:** `LorentzForce`
- **File:** `yt01_redefining_racism/manim/lorentz_force16x9.py`
- **Port:** `video/uef/lorentz_force.py`
- **Shots:** S16-10 through S16-12
- **Beats:** perpendicular deflection; kinetic energy unchanged; Buffer Class solidarity deflection mapped to charge trajectory.

## CoilGunInterface

- **Class:** `CoilGunInterface`
- **File:** `yt01_redefining_racism/manim/coil_gun16x9.py`
- **Port:** (new; extends coil-gun schematic in book §2.3.6.2)
- **Shots:** S16-31 through S16-36, S16-43 through S16-45, S16-52, S16-53 (partial holds)
- **Beats:** era coils (slavery → Jim Crow → incarceration → gig); vertical extraction projectile; orthogonal B-field; Civil Rights coil shutdown; field collapse; flyback vs Elite harvest; Southern Strategy and militarization routing; energy transfer to next stage.

## CardScene (equations and compare)

- **Class:** `CardScene`
- **File:** `yt01_redefining_racism/manim/cards16x9.py`
- **Shots:** S16-02 through S16-07, S16-18 through S16-29, S16-37 through S16-51, S16-54 through S16-56
- **Beats:** Equations 3.5, 2.16, 2.17, 2.18 term highlights; two-regime compare; post-1965 >23% stat bars.

# Scene inventory — SEG 17

## FractalExecution

- **Class:** `FractalExecution`
- **File:** `yt01_redefining_racism/manim/fractal16x9.py`
- **Port:** (new; fractal zoom / spanning-tree visualization)
- **Shots:** S17-01, S17-03, S17-21 through S17-24, S17-39, S17-51
- **Beats:** fractal virus; WAN→local replication; five-scale zoom; directed spanning tree rooted at E; differential-insertion diagram; local-rationalization veil.

## CardScene

- **Class:** `CardScene`
- **File:** `yt01_redefining_racism/manim/cards16x9.py`
- **Shots:** S17-02, S17-04, S17-09, S17-10, S17-26, S17-40, S17-46, S17-60
- **Beats:** base-code quote; five-scale table; content warning; biological subroutine source card; isomorphism table; 1965 INA source; self-similarity compare; ANES stat bars.

## PhaseLoading

- **Class:** `PhaseLoading`
- **File:** `yt01_redefining_racism/manim/interference16x9.py`
- **Port:** `video/uef/interference.py`
- **Shots:** S17-52 through S17-58, S17-65 through S17-67
- **Beats:** Equation 2.19; unit phasors dispersing; aligned vs cancelled mean; φ ≈ π illustration for I_buffer on race axis.

# Scene inventory — SEG 18

## LexicalFractal

- **Class:** `LexicalFractal`
- **File:** `yt01_redefining_racism/manim/lexical16x9.py`
- **Port:** (new; vocabulary propagation / Mode 2 lexical layer)
- **Shots:** S18-01 through S18-03, S18-19 through S18-22, S18-37
- **Beats:** lexical scale introduction; kernel-supplied technical vocabulary; Mode 2 propagation without central command; three-decade signal lag.

## CardScene

- **Class:** `CardScene`
- **File:** `yt01_redefining_racism/manim/cards16x9.py`
- **Shots:** Eglash source; Gill 1904 quote; 1959 patent quote; 19,708 patent stat; alternative-vocabulary table; IDE and flip-flop accuracy audits; Dartmouth quote; 1992 classroom quote; deprecation timeline; sixth lexical row; reflexive audit.
- **Beats:** full Eglash reconstruction arc; accuracy audit; pedagogical gatekeeping; 2003–2021 deprecation timeline; sixth isomorphism row; manuscript reflexive audit.

# Scene inventory — Segment 19

## CorruptedFirewall

- **File:** `yt01_redefining_racism/manim/corrupted_firewall16x9.py`
- **Class:** `CorruptedFirewall`
- **Shots:** S19-01 through S19-06
- **Cue words:** firewall, Buffer Class, Bacon's Rebellion, 1705, kernel-level rewrite, antivirus
- **Port:** none (new schematic: OS firewall layer with Elite patch and Buffer dielectric)

## StatusWage

- **File:** `yt01_redefining_racism/manim/complex_wage16x9.py`
- **Class:** `StatusWage`
- **Shots:** S19-14 through S19-17
- **Cue words:** complex wage, ψ_m, jψ_s, dielectric, redirect laterally
- **Port:** `video/uef/complex_wage.py`

## CardScene

- **File:** `yt01_redefining_racism/manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** S19-05, S19-07, S19-09, S19-11 (hold S04-07), S19-12, S19-13, S19-18, S19-22, S19-26, S19-33
- **Cue words:** Slave Codes, status wage, concessions, Δmax, SDO, RWA, three functions, rootkit
- **Port:** reciprocity reel card library pattern

# Scene inventory — Segment 20

## KernelUserSpace

- **File:** `yt01_redefining_racism/manim/kernel_userspace16x9.py`
- **Class:** `KernelUserSpace`
- **Shots:** S20-01, S20-05 through S20-09
- **Cue words:** kernel-level infection, user-space tools, permissions, min-management, recompile
- **Port:** none (layered OS stack: compromised kernel, desktop apps, permission gate)

## EliteWealthFig29

- **File:** `yt01_redefining_racism/manim/elite_wealth_fig29_16x9.py`
- **Class:** `EliteWealthFig29`
- **Shots:** S20-23 through S20-31
- **Cue words:** Figure 2.9, Great Compression, Kernel Recompile, 1929 peak, 2020 endpoint, event markers
- **Port:** none (rebuild TikZ coordinates from `Paper/The_Original_Power.tex` Figure 2.9: shaded 1935–1973 blue, 1973–2020 red, dashed 25% line, coordinate series 1913–2020, markers 1929/1965/1973/1994/2020)
- **Fallback still:** `figures/fig2.9_p158.png` (also `cards/S20-23.json` figure contract)

## CardScene

- **File:** `yt01_redefining_racism/manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** S20-02, S20-03, S20-10, S20-15, S20-16, S20-32, S20-33, S20-34
- **Cue words:** Malcolm X, user-space reforms, Piketty proxy, Great Compression, falsification, rewrite source code
- **Port:** reciprocity reel card library pattern

# Scene inventory — Segment 21

## ThreeModes

- **File:** `yt01_redefining_racism/manim/three_modes16x9.py`
- **Class:** `ThreeModes`
- **Shots:** S21-01, S21-03, S21-08, S21-12 through S21-14, S21-18, S21-19, S21-23 through S21-25
- **Cue words:** Mode 1 design, Mode 2 propagation, Mode 3 intervention, colorism fractal, Super Tuesday 2020, natural operation
- **Port:** none (three-lane flow diagram with hierarchical arrows)

## CardScene

- **File:** `yt01_redefining_racism/manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** S21-02, S21-04 through S21-07, S21-09 through S21-11, S21-15, S21-16, S21-17, S21-20 through S21-22, S21-26, S21-27
- **Cue words:** three modes table, Zurara, FHA steering, Ehrlichman, Atwater, hierarchical relationship, misreadings
- **Port:** reciprocity reel card library pattern

# Scene inventory — Segment 22

## EqRecapClose

- **File:** `yt01_redefining_racism/manim/eq_recap_close16x9.py`
- **Class:** `EqRecapClose`
- **Shots:** S22-02 through S22-09
- **Cue words:** Equation 2.1, 2.5–2.6, 2.8, 2.10, 2.12–2.19, Δmax century dataset
- **Port:** none (vertical equation rail with sequential gold highlights)

## CardScene

- **File:** `yt01_redefining_racism/manim/cards16x9.py`
- **Class:** `CardScene`
- **Shots:** S22-01, S22-10, S22-11, S22-12, S22-13
- **Cue words:** recap title, kernel summary, Chapter 3 teaser, podcast, book QR, AI voice disclosure
- **Port:** reciprocity reel card library pattern (`qr()` on S22-13)
