# Task: add a List of Tables to the front matter

Repo: `/Users/emmanuel/Documents/Theory/TheOriginalPower`, branch `main`, clean tree.

## The change

`Paper/The_Original_Power.tex` line 130-131 currently reads:

```latex
\tableofcontents
\listoffigures
```

Add `\listoftables` immediately after `\listoffigures`.

Rationale, so you can sanity-check the result: the manuscript has 113 `figure`
environments and 14 `table` environments, but only a list of figures. The Chicago
Manual of Style front matter order places the list of tables directly after the list of
illustrations, and 14 tables is enough to warrant one. Everything else about the front
matter stays as it is.

## What to check after adding it

1. **Build it.** `make pdf-from-tex`. This takes 10-15 minutes; let it finish.
2. **`make check-tex` must pass.** It fails on any LaTeX error or unresolved
   cross-reference or citation. Report the page count it prints.
3. **Confirm the list rendered.** Extract the PDF text and verify a "List of Tables"
   heading exists and is followed by numbered entries:
   ```bash
   pdftotext Paper/The_Original_Power.pdf /tmp/top.txt
   grep -n -A 20 "List of Tables" /tmp/top.txt | head -30
   ```
4. **Inspect the entries for damage.** A list of tables surfaces caption problems that
   were invisible before, because captions now have to typeset in a second context.
   Look specifically for entries that are extremely long (a full paragraph caption
   dumped into the list), entries containing math that may not render in the list, and
   entries that are empty or duplicated. Report any you find, with the table's line
   number in the `.tex`. **Do not fix them** — report them.
5. **Page count.** Note whether the front matter grew by more or less than two pages.

## Rules

- **Run no `git` command.** No add, no commit, no branch, no tag. The orchestrator
  reviews and commits.
- Change **only** `Paper/The_Original_Power.tex`, and only by adding that one line. Do
  not reformat, do not touch captions, do not reorder front matter.
- `Paper/The_Original_Power.pdf` is a tracked build artifact; the build will modify it.
  That is expected. Leave it as the build leaves it.
- If `make pdf-from-tex` fails with a runaway argument mentioning `\abx@aux@segm` and a
  citation key, that is stale aux state from another builder, not your change. Run
  `make clean` first, then rebuild. Note that `make clean` deletes the tracked PDF;
  restore it with
  `git show HEAD:Paper/The_Original_Power.pdf > Paper/The_Original_Power.pdf`
  before rebuilding. See `AGENTS.md`, "Build Hazards".

## Findings file

Write `.codex/tasks/add-list-of-tables.findings.md`: the diff you made, the exact
commands run, the `check-tex` result and page count, the first ten entries of the
rendered List of Tables verbatim, and any caption problems found with their line
numbers.
