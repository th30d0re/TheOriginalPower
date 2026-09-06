# Task: the last cover-parity figures

Phase 3, following `.codex/tasks/circuit-diagrams-phase2{,-fixes}.md`. Same ground
rules, same house style, `circuitikz` already loaded.

## Ground rule — unchanged and load-bearing

Each figure **renders a specification the text already states**. No new claim,
parameter, or calibration. Each caption says so in one sentence. Invent nothing. Where
the text underdetermines something, keep it symbolic and say so in your findings.

## The three figures

### 1. Inductive kickback
Source: `subsec:inductor` (`Paper/The_Original_Power.tex:936`), where $L$ is cultural
inertia and institutional entrenchment, and the surrounding discussion of reform shocks
producing back-EMF that drives the system past equilibrium into the extraction zone.
The cover carries this as $V = -L\,di/dt$.

Draw the inductor with the collapsing-current condition and the induced reverse voltage,
labelled with both the electrical quantity and the social role the text assigns it. Place
it in `subsec:inductor`. Label `fig:inductive_kickback`.

### 2. The class-coherence threshold
Source: `Paper/The_Original_Power.tex:2217`,
$\frac{dM}{dt} > \frac{d\Sigma_{\text{sup}}}{dt}$, and the surrounding passage
(`:2250`) explaining that when a reform shock threatens to raise $M(t)$ toward $\tau$
the kernel responds by expanding $\Sigma_{\text{sup}}(t)$. Also `:1116`, the condition
$M_{\text{eff}}(t) > \tau$, and `:1416`, the kernel objective $\max E(t)$ subject to
$M_{\text{eff}}(t) < \tau$.

Draw $M$ and $\Sigma_{\text{sup}}$ as two curves against time with the threshold $\tau$
marked, showing the race between them: the kernel holds $M_{\text{eff}}$ below $\tau$ by
growing $\Sigma_{\text{sup}}$ at least as fast as $M$ grows. **Curve shapes are
illustrative and the caption must say so**, exactly as `fig:backlash_oscillator` and
`fig:reparations_integral` do. Place it near `:2250`. Label `fig:coherence_threshold`.

### 3. Destructive interference
Source: the interference engine. Search for "interference engine" and for the passage
near `:1063` about phases tuned by it. The framework models divide-and-conquer as two
waves driven out of phase so their combined amplitude cancels, preventing the lower
tiers from reaching coherent amplitude.

Draw two out-of-phase waves and their near-zero sum, labelled with the social quantities
the text assigns. If the text specifies a phase relationship, use it; if it does not,
keep the phase offset symbolic and say so. Label `fig:destructive_interference`.

## Verification — as phase 2, plus greyscale

1. `make pdf-from-tex`, `make check-tex`. Both pass. Report page count.
2. Save a tight crop of each figure to `/tmp/phase3-<label>.png`, and a greyscale
   version to `/tmp/phase3-<label>-gray.png`. List all six paths. They will be
   inspected here.
3. **Any distinction carried by colour alone is a defect.** Two waves distinguished only
   by hue will merge in a printed book. Use line style as well.
4. For each figure state whether any label box touches any wire, curve, axis, symbol, or
   other label. Look at the crop before answering. The phase-1 and phase-2 rounds each
   reported figures as clean that were not; that is why the crops are required.

## Rules

**No `git` commands** except the recovery-only `git show` for a clobbered PDF. Change
only `Paper/The_Original_Power.tex`. Build once at the end. Findings to
`/tmp/circuit-diagrams-phase3.findings.md`.

If you run out of credits mid-run, stop cleanly and say in your last message exactly
which figures are written and whether a build has happened. A half-applied edit with no
build is the worst state to leave behind.
