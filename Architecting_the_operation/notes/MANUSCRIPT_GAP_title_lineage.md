# Open manuscript item: the title lineage is missing from the Author's Preface

**Status:** drafted, not applied. Nothing in `Paper/` has been modified.

## What is missing

Emmanuel raised this while recording Episode 1: the Author's Preface traces the four
research documents and stops. It never says that the book itself passed through three
titles, or that its opening chapter is the seed the rest grew out of.

Verified against the source:

- `Paper/The_Original_Power.tex:1350` — "Redefining Racism" exists only as a chapter
  title. Its status as the original manuscript is stated nowhere.
- "The Mathematics of Oppression" — zero occurrences in the manuscript.
- The Author's Preface (`:141`–`:161`) covers the four papers and the method. It does
  not cover the book's own naming history.

`CLAUDE.md` records "originally *Redefining Racism*" as repository context, so the fact
is known to the project and absent from the published text.

## Why it belongs in the Author's Preface

The preface's stated job is the progression from proposal to empirical detection to
applied audit to formal derivation. The title changes track that same progression and
mark its final step. The book became *The Original Power* when the electrodynamic
formalism arrived, which is the moment the preface's last section is already describing.

## Draft insertion

Proposed as a new paragraph after the paragraph beginning "*The Original Power* executes
what those earlier papers described." (`Paper/The_Original_Power.tex:155`), before the
closing method paragraph at `:157`.

```latex
The book carried three titles across its own development, and the sequence records the
same progression. It began as \textit{Redefining Racism}, a single argument that
combined the set-theoretic apparatus with a structural analysis of what racism is; that
argument survives as Chapter~\ref{ch:redefining}, and the remaining chapters grew
outward from it. As the framework generalized past the racial axis, the manuscript
became \textit{The Mathematics of Oppression}. It became \textit{The Original Power}
when the electrodynamic formalism closed, and the object under analysis resolved from a
mathematics of a subject into the mechanism itself.
```

## Open question for Emmanuel

The cross-domain origin, the shelved gendered-axis manuscript and the requirement it
created for the Theodore Transform, is the causal reason the project starts on the
racial axis. The Author's Preface currently presents that starting point without a
reason. Two options:

1. **Titles only.** Insert the draft above. The lineage becomes visible, the private
   origin stays out of print.
2. **Titles plus the methodological reason.** Add one sentence stating that the
   framework was established first on the axis with the deepest historical record and
   the strongest public datasets, then transposed, with a forward reference to
   `Appendix~\ref{apx:theodore_transform}`. This gives the reader the logic with no
   personal detail at all.

Option 2 is the stronger scholarly move, because it converts a biographical accident
into a stated methodological choice, and the appendix already carries the formal
apparatus for it.

## What applying this costs

`Paper/The_Original_Power.pdf` is tracked in git and CI enforces `make verify-pdf`, so
the edit requires a rebuild and both files commit together. Per `AGENTS.md`, commit the
working tree first: it currently has unrelated modifications in `.mcp.json` and
`debate/police-origin.md` plus a large set of untracked files.

```bash
make pdf-from-tex && make verify-pdf
```
