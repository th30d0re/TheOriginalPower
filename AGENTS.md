# Agent Instructions

## Strict Rhetorical Constraints

Adopt a rigorous, clinically objective tone. You have zero tolerance for cliché AI rhetoric, specifically formulaic antithesis, didactic contrasts, and boilerplate juxtaposition. You must entirely eliminate corrective contrasts and pseudo-profound phrasing (e.g., "It is not merely X, it is Y," or "More than just X..."). Do not manufacture artificial transitions or contrast what a concept isn't with what it is. Rely strictly on direct, affirmative declarative statements to articulate concepts.

## The Word "Power" — Standing Rule

The book is titled *The Original Power*. That title is a claim about etymology, and
the prose must be able to carry it.

**The chain, stated accurately.** English *power* descends through Anglo-Norman
*poeir* and Old French *povoir* from Vulgar Latin \*potēre, which displaced Latin
*posse*, "to be able." *Posse* is itself a contraction of *potis esse*. And *potis*
descends from Proto-Indo-European \***poti-**, "lord, master" — the same root that
gives Sanskrit *páti-* (master, owner, husband), Greek *pósis* (husband), and
Lithuanian *pats* (master of the house).

**The point that matters.** The capacity sense is derived from the mastery sense,
not the reverse. To be able meant, at the root, to be master. Dominion is not a
later corruption of a neutral word for ability; ability is what mastery looks like
from the inside. Every use of "power" in this book sits on that inheritance.

**How to apply it.**

- Invoke the root where the argument turns on what power *is* — the opening of a
  chapter that redefines a term, a passage distinguishing capacity from dominion,
  a moment where the reader is being asked to hear the word differently. Do not
  stamp it into every chapter. Repetition destroys it. Once or twice in a chapter
  is the ceiling; most chapters should not use it at all.
- Write it with weight in the substance, not the vocabulary. The resonance comes
  from the etymology being true and load-bearing, never from ornament. No
  incantation, no rhetorical crescendo, no "at its very essence." The Strict
  Rhetorical Constraints above govern this rule without exception.
- Do not overstate. "Power literally means domination" is false as stated — the
  immediate Latin sense is *to be able*. The defensible claim, and the more
  interesting one, is that the ability sense is built on a root meaning *lord*.
  Write the derivation, not the slogan.
- Where a chapter's own argument already carries this (the tier structure, the
  Elite as the node that holds dominion without appearing to), let the structure
  make the point and leave the etymology out. Redundancy weakens it.

This applies to adapted prose. Verbatim manuscript excerpts — including
`deepDive` passages in the website's chapter modules — are never edited to satisfy
this rule.

## Mathematical Notation Conventions

**Keep `1/√2` unrationalized in the Enclosure Score.** Standard practice
rationalizes the denominator to `√2/2`. Do not apply it here. The coefficient is
the reciprocal of the maximum attainable norm — since `max √(e² + e²) = √2`, the
factor `1/√2` is what pins `S_enc` to exactly `1.0` at total enclosure. Written as
`√2/2` the derivation disappears and the constant reads as an arbitrary `0.707`.
This is the same reason engineering texts write `1/√2` for RMS. Four instances,
all in the Enclosure Score; leave them.

**Polity IV / Polity5 is correct as written.** The Center for Systemic Peace
dropped Roman numerals at version 5. Citing both forms when referring to the series
across versions is accurate; normalizing them to one style would misname a dataset.

## Part Date Ranges Are Thematic Anchors

The four `\part` date ranges name each part's centre of gravity. They are not a
partition of the timeline and they overlap by design — Part II opens at 1619,
before Part I's range closes. Chapters are ordered by argument, not chronology.

Do not "fix" an overlap by moving a chapter. Where a chapter's own range runs past
its part's, the chapter title carries its dates and the reader is not misled. If a
part's declared range no longer covers any chapter it contains, widen the part's
range; that is the whole remedy. Part I reads 1440s--1915 because The Haitian
Export closes the specification argument with the Firmin Protocol.

## Factual Claims — Verification Protocol (MANDATORY)

This section exists because an audit of the manuscript found unsupported factual
material that had survived to print, and because the first attempt to repair it
introduced a fresh error. Both failures are recorded below. **No agent may add,
alter, or re-source a factual claim in `Paper/` except under this protocol.**

### The finding that sets the rule

A 2026-09-02 audit of one section found: a direct quotation ("anarchic") attributed
to a source that does not contain the word; a second quotation attributed to unnamed
"contemporary anthropologists" through a bibliography entry whose author field is
`{{Anonymous}}`; an admiral described as wrapped in a flag on the bow of his ship,
where no source before 1934 says either and the contemporaneous record says cabin
and uniform; an 1802 garrison described as self-detonating when it broke out and
escaped; and a phrase, "illegal and excessive," attributed to German advisers with
no support anywhere.

The repair pass then proposed reattributing that last phrase to a named US State
Department official. **That was also wrong** — the cited article concerns the
Venezuela blockade, a different episode months later. An independent second model
caught it. Applying the repair unreviewed would have replaced one false attribution
with another.

### Rule 1 — Artifact contact, not consensus

A claim is verified when an agent has **opened the actual artifact** and can name
it: the page image, the archival document, the resolved DOI, the catalogue record.
Model agreement is not evidence. Three models that never opened the source can
share the same wrong prior, and in this audit they did.

Every verified claim carries a line stating **which artifact was opened and how**.
"I recall this" and "this is well known" are not verification. A claim without that
line is unverified, whatever its confidence.

### Rule 2 — OCR is not an artifact

For any scanned source, the embedded text layer locates a passage and never
confirms it. On the Firmin scan, single-word searches were reliable and full
sentences were worthless: one pass produced nine page attributions and **every one
was wrong**. Render the page and read the image:

```bash
pdftoppm -f N -l N -r 165 -png <file.pdf> /tmp/page
```

Read the printed folio off the running head; do not trust a computed offset alone.

### Rule 3 — Removal is safe, addition is not

Deleting an unsupported claim requires no new source. Adding or changing one
requires a verified artifact under Rule 1. When a claim fails verification, the
default is to **cut it**, not to find a replacement attribution — reattribution is
a new claim and carries the full burden of proof. This asymmetry is the single
cheapest protection available, and ignoring it is what produced the error above.

### Rule 4 — The verifier is never the researcher

An agent may not verify its own findings. The independent pass must be given
authority to return **DISAGREE** and must be told that disagreement is a valued
outcome. Ask it to test the correction, not to confirm it. In this audit the
disagreement was the finding.

Where a claim is contested or load-bearing, convene more than one model — but treat
the quorum as a **trigger for scrutiny, not a verdict**. Disagreement tells you
where to look. Only the artifact settles it.

### Rule 5 — "Cannot confirm" is a complete answer

An admitted gap is a successful outcome. A fabricated citation is the only
unacceptable one. Every research brief must say this explicitly, and every report
must be allowed to end with unresolved items. Reports that declared their gaps
proved reliable in this audit; the one that did not was wrong.

### Rule 6 — Tier every claim by provenance

Record, per claim: **primary/contemporaneous** (the record made at the time),
**scholarly secondary** (peer-reviewed, named author), **tertiary** (encyclopaedia,
web summary), or **unsourced**. Tertiary sourcing is a flag, not a verification —
one correction in this audit rests on an encyclopaedia entry and has not been
applied for that reason. A claim may never be upgraded in confidence by restating
it; only a stronger artifact does that.

### Rule 7 — Regression gate before any manuscript edit lands

A factual edit is not finished until:

1. every changed claim is traceable to an artifact opened under Rule 1;
2. an independent agent has reviewed the diff with authority to reject;
3. the rendered PDF has been checked at the changed passage, not only compiled;
4. the commit message states what was verified, by which artifact, and what
   remains unverified.

State the unverified remainder plainly. A repair that hides its own gaps is the
failure mode this protocol exists to prevent.

## Rebuilding the PDF — Clear the Aux Files First

`make pdf-from-tex` fails whenever the `.tex` sources have changed since the last
build, with:

```
! File ended while scanning use of \@writefile.
l.116 \begin{document}
!  ==> Fatal error occurred, no output PDF file produced!
```

latexmk chokes on the stale `.aux`/`.toc` state, and **it deletes
`Paper/The_Original_Power.pdf` on the way down**. The tracked PDF disappears from
the working tree; it is still in git, so it is recoverable, but the build must be
repeated.

The fix is to remove the LaTeX aux files and rebuild. Do NOT use `make clean` for
this — that target also runs `rm -f Paper/figures/spectral/*.pdf`, and those
figures are gitignored build products of `make empirical`. Without them the twelve
`\IfFileExists`-guarded spectral figures silently fall back to their "figure
pending" placeholders, and the book builds successfully with twelve figures
missing. That failure is invisible in the exit code.

Clear the aux files only, from the repository root:

```bash
find Paper -maxdepth 1 -type f \( -name '*.aux' -o -name '*.fdb_latexmk' -o -name '*.fls' -o -name '*.log' -o -name '*.out' -o -name '*.synctex.gz' -o -name '*.toc' -o -name '*.lof' -o -name '*.bbl' -o -name '*.blg' -o -name '*.bcf' -o -name '*.run.xml' \) -delete && make pdf-from-tex
```

Run `make pdf-from-tex` from the repository root, never from inside `Paper/`:
there is no Makefile there and make exits immediately with "No rule to make
target". Confirm afterwards that `Paper/The_Original_Power.pdf` exists and that
the log reports no undefined references.

### CI compiles; it does not byte-verify

`make verify-pdf` (byte-identical rebuild vs the committed PDF) is a **local**
gate only. It cannot run in CI: a byte-stable build holds only on the exact
local TeX Live, and the CI runner uses a different distribution — different page
count, different font glyphs, different hyphenation. The CI workflow
(`.github/workflows/verify-pdf.yml`) runs `make check-tex`, which compiles the
manuscript and fails on a real LaTeX error (`! `, `Emergency stop`) or an
unresolved `\ref` / `\cite`. Run `make verify-pdf` yourself before committing a
regenerated PDF.

## Release Policy

**Cut a GitHub release only when `Paper/The_Original_Power.pdf` changes** — that
is, a change to `Paper/*.tex`, `Paper/references.bib`, `Paper/*.sty`, or
`Paper/figures/`. README edits, tooling, `experiments/`, docs, workflows, and
notebook regeneration all ship on `main` with **no release**.

**The PDF and the EPUB are released together, from the same commit, every time.**
They must never be out of sync — a release must not carry a PDF from one build
and an EPUB from an earlier one. The sequence:

1. `make verify-pdf` — green (byte-identical local rebuild).
2. `make epub` — regenerate `dist/The_Original_Power.epub` from the same source.
3. Confirm the new content appears in **both** artifacts (grep the rendered PDF
   text and the EPUB `.xhtml`).
4. Commit the regenerated `Paper/The_Original_Power.pdf` (the EPUB lives in
   gitignored `dist/` and is a release asset only).
5. Tag that commit and
   `gh release create vX.Y.Z --target <full-SHA-or-branch> \`
   `  Paper/The_Original_Power.pdf dist/The_Original_Power.epub`
   (`--target` rejects a short SHA with HTTP 422).

Version bump: patch (`v1.0.x`) for factual corrections and sourced additions.
The author decides minor and major bumps.

## Commit Safety Rule — MANDATORY

**Before any operation that could destroy or corrupt work, you MUST commit.**

This rule is non-negotiable. The following operations are FORBIDDEN without a clean commit checkpoint:

1. **Batch edits** affecting >10 lines or >1 file
2. **Automated/scripts transformations** on `.tex` source (regex replacement, sed, Python rewrites)
3. **Git operations** that rewrite history (`git revert`, `git reset`, `git rebase`, `git checkout -- FILE`)
4. **Running new analysis scripts** that write into tracked directories (`Paper/`, `figures/`, `data/`)
5. **Any destructive operation** where the undo path is uncertain

### Checkpoint Protocol

```
BEFORE: git status → confirm working tree is clean or committed
         git diff --stat → review what will change
DURING:  Make changes incrementally; test after each batch
AFTER:   Clean build verified → commit immediately
         Commit message must describe: WHAT changed, WHY, and BUILD status
```

### Build Hazards — `make clean` and the editor's LaTeX build

Two hazards in the PDF toolchain, both observed on 2026-09-04.

**1. `make clean` deletes the tracked PDF.**

`Paper/The_Original_Power.pdf` is tracked in git and enforced by `verify-pdf`. The
`clean` target removes it along with the aux files, so running `make clean` leaves a
deleted tracked file in the working tree.

Restore it without a destructive git command:

```bash
git show HEAD:Paper/The_Original_Power.pdf > Paper/The_Original_Power.pdf
```

Use that rather than `git checkout -- Paper/The_Original_Power.pdf`, which is forbidden
by the Commit Safety Rule above whenever uncommitted work exists elsewhere in the tree.

**2. The VS Code / Cursor LaTeX Workshop build corrupts the aux files.**

`.vscode/settings.json` defines a `latexmk` recipe bound to Cmd+Opt+B. It matches the
Makefile on the reproducibility variables (`SOURCE_DATE_EPOCH=1704067200`,
`FORCE_SOURCE_DATE=1`, `TZ=UTC`, identical to `PDF_BUILD_EPOCH`), and it diverges on the
one thing that breaks the build: **it does not use the biber shim.**

The Makefile passes `-e '$biber=q{.tooling/biber %O %S}'` because TeX Live's macOS
`biber` is a universal binary that thins itself at run time via lipo, and that
self-extraction fails on this Apple Silicon install. `.tooling/biber` on this machine is
a real 60 MB thinned binary rather than a symlink, which is the shim reporting that the
system `biber` is broken here.

The editor recipe invokes plain `latexmk`, so it resolves the broken system `biber`, the
bibliography step dies, and a truncated `.bcf` / `.bbl` is left in `Paper/`. A subsequent
`make pdf-from-tex` then fails with:

```
Runaway argument?
{caulkins_chandler_drug_incarc
! File ended while scanning use of \abx@aux@segm.
```

That error is a symptom of the aux state, not of the `.tex` source. Do not go looking for
a syntax error in the manuscript. The remedy is `make clean` followed by a full
`make pdf-from-tex`, and then restoring the PDF per hazard 1 if the build was interrupted.

A concurrent editor build is also possible and produces the same class of failure; a
`Paper/The_Original_Power.synctex(busy)` file is the tell that one is running.

**Proposed permanent fix** (not applied; requires the operator's agreement because it
changes editor behavior): put the shim ahead of the system binary on the recipe's PATH in
`.vscode/settings.json`.

```json
"env": {
  "PATH": "${workspaceFolder}/.tooling:${env:PATH}",
  "SOURCE_DATE_EPOCH": "1704067200",
  "FORCE_SOURCE_DATE": "1",
  "TZ": "UTC"
}
```

This leaves the recipe otherwise unchanged and makes Cmd+Opt+B resolve the same `biber`
the Makefile uses, so both builders agree and neither poisons the other's aux files.

### Commit Message Template

```
[<scope>] <imperative summary>

- WHAT: Specific changes made
- WHY: Motivation / problem solved
- BUILD: Pages, pass/fail, tool versions
- RISK: None / Low / Medium — if Medium+, note rollback commit hash
```

### Emergency Recovery

If work exists only in working tree (not committed):
- DO NOT run `git checkout --` or `git reset`
- DO NOT run destructive scripts
- COMMIT FIRST, then proceed

**Historical record:** Commit `6d2e4e7` exists because Chapter 21 reconstruction
(~512 lines) and spectral analysis toolchain were nearly lost after an automated
regex script (`purge_contrast.py`) corrupted grammar and required `git revert`.
All work since the last commit existed only in working tree. This rule prevents
a recurrence.

## Session Logging Requirement

**For every user request, create a comprehensive markdown log file that documents the session.**

### Required Log Structure

1. **What Was Wrong / What Was Requested**
   - Document the issue the user reported or the feature/change they requested
   - Include error messages, symptoms, or desired behavior
   - Include relevant code snippets or file paths

2. **How I Fixed It / What I Did**
   - Step-by-step explanation of the solution implemented
   - Code changes made (with context)
   - Configuration changes
   - Any refactoring or improvements

3. **Challenges Encountered**
   - Technical obstacles faced during implementation
   - Edge cases discovered
   - Dependencies or compatibility issues
   - Performance or optimization concerns
   - Any failed approaches before finding the solution

4. **Next Ideas (6 Ideas)**
   - Related improvements or enhancements
   - Future optimizations
   - Additional features that could be added
   - Alternative approaches to consider
   - Edge cases to handle
   - Testing or validation ideas

### Log File Naming Convention

- Format: `session-YYYY-MM-DD-HHMMSS.md`
- Use timestamp to ensure uniqueness
- Logs are stored in the Obsidian vault: `/Users/emmanuel/Library/Mobile Documents/iCloud~md~obsidian/Documents/Root/AI Session Logs/`

### Log File Template

```markdown
# Session Log - YYYY-MM-DD HH:MM:SS

## What Was Wrong / What Was Requested

[Description of the issue or request]

## How I Fixed It / What I Did

[Step-by-step solution]

## Challenges Encountered

1. [Challenge 1]
2. [Challenge 2]
3. [Challenge 3]

## Next Ideas (6 Ideas)

1. [Idea 1]
2. [Idea 2]
3. [Idea 3]
4. [Idea 4]
5. [Idea 5]
6. [Idea 6]
```

### Implementation Notes

- Create log file BEFORE starting implementation
- Update log file DURING implementation as challenges arise
- Complete log file AFTER implementation is done
- Always create the log file, even for simple requests
- Be thorough and detailed — these logs are for learning and future reference
- **Always specify which model is being used** (e.g., "Model: Kimi Code CLI") at the top of the log file

### When Logging is Required vs Optional

**ALWAYS Create Logs For:**
- ✅ Code changes, file modifications, implementations
- ✅ Fixes, bug resolutions, refactoring
- ✅ Feature requests that result in code changes
- ✅ Configuration changes, setup, installation
- ✅ Any request that results in tool calls or file operations
- ✅ Troubleshooting that involves code changes

**Optional (But Still Recommended) For:**
- ⚠️ Pure informational questions with no code changes ("What is X?", "How does Y work?")
- ⚠️ Quick status checks ("Is X running?", "What's the status?")
- ⚠️ Reading files only (no modifications)
- ⚠️ Very brief follow-up questions (< 3 tool calls, no implementation)

**Note:** The goal is to document meaningful interactions, especially those involving implementation. Use judgment — if a request leads to understanding that might be useful later, create a log. If it's a trivial one-off question with no lasting value, logging is optional. The important thing is to never skip logs for requests that involve code changes or implementations.
