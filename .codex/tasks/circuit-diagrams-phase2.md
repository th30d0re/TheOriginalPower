# Task: six more figures — cover parity for the electrodynamic formalism

Phase 2 of `.codex/tasks/circuit-diagrams-phase1.md`. Same ground rules, same house
style. `circuitikz` is now loaded in the preamble.

## Why

The book's covers carry thirteen labelled diagram layers and the back cover explains
four of them under the heading "WHAT IS ON THE COVER". Every diagram on the covers is
supposed to have a counterpart in the text. After phase 1, these six still have none.

## Ground rule on claims — read again

Each figure **renders a specification the text already states**. None introduces a new
claim, parameter, or calibration. Each caption says so in one sentence. Invent no
values, no ratios, no relationships. Where the text underdetermines something, keep it
symbolic and say so in your findings.

## The six figures

Work them in this order. **Build once, at the end.**

### In `Paper/apx_theodore_transform.tex` (currently zero figures)

**1. The transform operator.** Source: the appendix's own definitions — domains
$\{D_\alpha\}$, each with vocabulary $\mathcal{V}_\alpha$ and claim set
$\mathcal{C}_\alpha$, and the structural correspondence
$\sigma_{\alpha\beta}: \mathcal{V}_\alpha \to \mathcal{V}_\beta$. Draw two domain boxes
with their vocabularies, the operator carrying one to the other, and the structure
preserved across. The appendix's own analogy is the Laplace transform carrying a
function from the time domain to the frequency domain; mirror that shape. Label
`fig:tt_operator`.

**2. The two worked transpositions.** Source: the appendix states two uses — the
Haitian Theorem projected from the racial axis onto the gendered axis, and the entire
social-mechanical framework transposed into electrodynamics. Draw them as two
applications of the same operator, with the invariance condition named. Label
`fig:tt_applications`.

### In `Paper/The_Original_Power.tex`

**3. The 3-D pyramid.** Source: line ~489, "The hierarchy is therefore a 3-D pyramid.
$E$ occupies the apex along the vertical $z$-axis; $P_{\text{uppet}}$,
$F_{\text{enforce}}$, and $I_{\text{buffer}}$ form descending structural layers beneath
it; $O$ is enclosed at the base." Also on the cover as `layer-pyramid`. Draw the pyramid
with all five tiers placed as the text specifies. Place near that passage. Label
`fig:tier_pyramid`.

**4. The unified Lorentz force.** Source: `eq:0.1-unified-lorentz-force` (line ~371),
$F = QE + Q(v \times \sum_k \rho_k B_k)$, described as the governing equation of the
substrate-independent dynamical homology. Draw the force decomposition: the electric
term, the magnetic cross-product term with its summation over axes $k$, and the
resultant. Label `fig:unified_lorentz`.

**5. The social capacitor.** Source: `subsec:capacitor` (line ~838), token-reform
absorption capacity; the cover carries $C = \varepsilon A / d$.
**Handle this one carefully.** The book's epistemology note states a
substrate-independent *dynamical homology* — the claim concerns the equations, and the
units are explicitly not the point. A drawing that shows charge carriers beside people
can be read as claiming humans *are* charges, which is the misreading that note exists
to prevent. Draw the capacitor formally: plates, separation $d$, area $A$, the stored
field, $C = \varepsilon A/d$, with the social quantities named as the roles the text
assigns them. Do not draw people, crowds, or figures. Caption must state that the
correspondence is one of governing equations, not of substance. Label
`fig:social_capacitor`.

**6. The reparations integral.** Source: `eq:0.16-reparations-integral` (line ~1192) and
the sentence following it: "the time integral of the real-power flow into the Elite node
from the Out-group node over the historical interval during which that flow has been
operating." The cover shows it as an area under a curve over 1948–2022. Draw
$\mathcal{R} = \int \mathrm{Re}[V \cdot I^*]\,d\tau$ as a shaded area under a
real-power curve against time. **The curve shape is illustrative and must be labelled
as such in the caption**, exactly as the existing `fig:backlash_oscillator` caption does
for its own parameters. Do not imply calibrated values. Label `fig:reparations_integral`.

## Verification — this part changed

Phase 1 was returned twice because the findings reported figures as clean when rendering
showed label collisions. This round:

1. `make pdf-from-tex` then `make check-tex`. Both must pass. Report the page count.
2. For **each** of the six figures, render its page at 200 dpi **and save a tight crop
   of the figure itself** to `/tmp/phase2-<label>.png`. List the six file paths in your
   findings. They will be inspected here.
3. In your findings, for each figure, state explicitly whether any label box touches or
   crosses any wire, symbol, axis, or other label. If one does, fix it before finishing.
   Do not report a figure as clean without having looked at its crop.
4. Confirm the List of Figures gained six entries and that no pre-existing figure changed
   number, except where inserting a figure earlier in a chapter necessarily shifts later
   numbers in that chapter — note any such shift explicitly.

## Rules

- **Run no `git` command** except the recovery-only
  `git show HEAD:Paper/The_Original_Power.pdf > Paper/The_Original_Power.pdf`.
- Change only `Paper/apx_theodore_transform.tex` and `Paper/The_Original_Power.tex`.
- Build once, at the end, after all six figures are written. Two concurrent LaTeX builds
  corrupt the shared aux state; see `AGENTS.md`, "Build Hazards".
- Findings to `/tmp/circuit-diagrams-phase2.findings.md`.
