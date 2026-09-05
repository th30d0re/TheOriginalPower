# Task: four circuit diagrams for the electrodynamic formalism

Repo: `/Users/emmanuel/Documents/Theory/TheOriginalPower`, branch `main`, clean tree.

## Why this exists

The book specifies a circuit in prose and never draws it. The back cover states "This is
the circuit diagram" and carries thirteen labelled diagram layers; the interior has 131
figure captions and not one circuit schematic. The one RLC figure
(`Paper/The_Original_Power.tex`, caption "Racism as a Damped RLC Circuit") is a pgfplots
waveform of the circuit's *response* — the reader sees the output of a topology they were
never shown.

`circuitikz` is installed at
`/usr/local/texlive/2023/texmf-dist/tex/latex/circuitikz/circuitikz.sty`.

## Ground rule on claims

Every figure here **renders a specification the text already states**. None introduces a
new claim, a new parameter, or a new calibration. Each caption must say so explicitly,
in one sentence, e.g. "This schematic renders the mapping stated in
Section~\ref{sec:hardware_mapping} and introduces no new calibration." Invent no
component values, no numbers, and no relationships that are not already written down.
Where the text does not specify something (a resistance value, a topology detail), leave
it symbolic rather than inventing it.

## The four figures

### 1. The five-tier extraction circuit
Source: the node/element table at `Paper/The_Original_Power.tex:475-487`, which is
already a netlist. It maps: $E$ voltage source, $P_{\text{uppet}}$ potential divider,
$F_{\text{enforce}}$ current source, $I_{\text{buffer}}$ dielectric/insulator, $O$
sink/ground. Draw that as a single schematic with each element labelled by both its tier
symbol and its circuit role. Place it immediately after that table, inside
Section~\ref{sec:hardware_mapping}. Label `fig:extraction_circuit`.

### 2. The Elite as parasitic control layer
Source: the Preface paragraph beginning "A critical architectural clarification: the
Elite ($E$) \textit{gate} the energy that drives this system" (search for
"parasitic control layer"). It describes a transistor: the Elite as a base receiving a
trickle of control current while the labor of $O$ and $I_{\text{buffer}}$ supplies
$V_{cc}$, and the system self-exciting by feeding part of its own output back. Draw it
as a transistor stage with $I_b$, $V_{cc}$, and the feedback path labelled. Place it in
that Preface section. Label `fig:parasitic_transistor`.

### 3. The series RLC topology
Source: Section~\ref{subsec:resistor}, `subsec:capacitor`, `subsec:inductor`, and the
governing equation `eq:1.7a-rlc-governing`. Draw R, L and C in series with the kinetic
supply, each labelled with both its electrical symbol and its social role (R
bureaucratic and carceral friction, L cultural inertia and institutional entrenchment,
C token-reform absorption capacity). Place it **immediately before** the existing
`fig:backlash_oscillator` figure so topology precedes response. Label `fig:rlc_topology`.

### 4. The complex wage phasor
Source: `eq:2.2a-complex-suppression-allocation` at `Paper/The_Original_Power.tex:2557`,
and the real/reactive power decomposition ($P_{\text{real}} = |V||I|\cos\theta = \psi_m$,
$Q_{\text{reactive}} = |V||I|\sin\theta = \psi_s$). Draw $W = \psi_m + j\psi_s$ on the
complex plane: real axis $\psi_m$, imaginary axis $j\psi_s$, the resultant $W$, and the
angle $\theta$. This mirrors the cover's phasor layer, which carries exactly these
labels. Place it near that equation. Label `fig:complex_wage_phasor`.

## Style

Match the book. Look at the existing tikzpicture in `Paper/apx_extraction_chart.tex`
(the Extraction Chart) and follow its conventions: sober line weights, `\scriptsize`
labels, restrained colour, `\caption[Short form]{Full caption.}` so the List of Figures
stays readable. Every figure gets `[htbp]`, `\centering`, a `\caption[short]{long}` and a
`\label`. Greyscale-legible: this book is printed.

## Verification

1. Add `\usepackage{circuitikz}` near the existing `\usepackage{tikz}` at line 15.
   **Check it does not conflict** with the loaded tikz libraries or pgfplots. If the
   build breaks on the package alone, stop and report; do not start disabling things.
2. `make pdf-from-tex`, then `make check-tex`. Both must pass. Report the page count.
3. Extract the PDF text and confirm all four captions appear, and that the List of
   Figures gained four entries.
4. Render each new figure's page to PNG and **look at it**:
   `pdftoppm -f N -l N -r 150 -png Paper/The_Original_Power.pdf /tmp/fig`
   Confirm no overfull boxes, no elements colliding, nothing running off the page.
   Report what you actually saw on each.

## Rules

- **Run no `git` command.** No add, commit, branch, tag. The orchestrator reviews.
- Change only `Paper/The_Original_Power.tex`. Do not modify existing figures, captions,
  equations, or prose. You are adding four figure environments and one package line.
- If a build fails with a runaway argument naming a citation key and `\abx@aux@segm`,
  that is stale aux state from another builder. `make clean`, then restore the tracked
  PDF with `git show HEAD:Paper/The_Original_Power.pdf > Paper/The_Original_Power.pdf`,
  then rebuild. See `AGENTS.md`, "Build Hazards". (That `git show` is a file read, and is
  the one exception to the no-git rule.)
- Write findings to `/tmp/circuit-diagrams-phase1.findings.md` — `.codex/` is mounted
  read-only in your sandbox and previous runs could not write there.

## Findings file

The diff, the commands run, `check-tex` result and page count, the four captions as
rendered, and your visual inspection of each figure's page. Note anything you could not
source from the text and left symbolic.
