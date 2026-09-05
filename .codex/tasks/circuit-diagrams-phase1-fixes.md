# Task: fix four defects in the phase-1 circuit diagrams

Follow-on to `.codex/tasks/circuit-diagrams-phase1.md`. The four figures are in the tree
and the build passes. Four defects were found by rendering each page at 110 dpi and
looking at it. **Your previous findings reported "no elements colliding" and that the
feedback annotation "remains visible in grayscale". Both are incorrect.** Inspect more
closely this round: render at 150 dpi or higher and examine the label bounding boxes
against the symbols, not just the overall composition.

Do not touch `fig:complex_wage_phasor`. It is correct and well composed.

## Defect 1 — `fig:extraction_circuit` prints as "Figure 1"

Every numbered figure in this book prints as `N.M` (1.1, 2.1, 2.5, 2.6). This one prints
as bare **"Figure 1"**, which reads as the first figure of the whole book and collides
conceptually with "Figure 1.1" three pages later. Its `.lof` anchor is already
`figure.0.1`, so only the printed label is wrong.

It is the only figure in Chapter 0. Find why `\thefigure` drops the chapter component
there and make it print `0.1`. **Change no other figure's numbering** — verify by
diffing the `.lof` before and after: every other entry must be byte-identical.

## Defect 2 — `fig:parasitic_transistor`, three problems

Rendered page 62, printed folio lx.

- **`$I_b$ (control current)` overlaps the transistor symbol.** The label runs into the
  base terminal. Move it clear.
- **The feedback annotation is too light to print.** "feedback: portion of output powers
  the interference engine" is set in a grey that will disappear in greyscale printing,
  and the feedback path lines have the same problem. This book is printed. Use black or
  a grey no lighter than 40% for any line or text that carries meaning.
- **The composition is sparse and unbalanced.** The diagram sits high and left with large
  empty regions to the right and below, and the feedback loop hangs well below the
  transistor stage. Tighten it so the figure reads as one object.

## Defect 3 — `fig:rlc_topology`, label collision

Rendered page 131, printed page 59. The `kinetic supply $V(t)$` label on the left
overlaps the AC source symbol; "supply" runs into the circle. Move it clear. Everything
else about this figure is good, including its placement immediately before the response
waveform.

## Defect 4 — `fig:extraction_circuit`, crowding and one fidelity problem

Rendered page 78, printed page 6.

- **Right-side labels crowd.** "dielectric/insulator" and "voltage source" sit almost on
  top of each other and the first runs toward the $E$ source symbol. Space them.
- **$P_{\text{uppet}}$ is drawn as a single resistor but the text specifies a potential
  divider.** A potential divider is two elements in series with a tap between them; a
  lone resistor does not render that. Either draw an actual divider with the tap
  labelled, or, if the surrounding text does not specify enough to place the tap
  honestly, keep the single element and label it exactly as the source table does
  without implying a division the drawing does not show. Do not invent a tap point the
  text does not support. Say in your findings which you chose and why.

## Rules

Unchanged from the previous brief. **Run no `git` command** except the recovery-only
`git show` for a clobbered PDF. Change only `Paper/The_Original_Power.tex`. Do not modify
existing prose, equations, captions, or any figure other than the three named here.
`make pdf-from-tex` and `make check-tex` must both pass; report the page count.

## Findings

Write `/tmp/circuit-diagrams-phase1-fixes.findings.md`: what you changed per defect, the
`.lof` diff proving no other figure renumbered, the build result, and — for each of the
three figures — the dpi you rendered at and what you actually saw, specifically at the
label positions named above.
