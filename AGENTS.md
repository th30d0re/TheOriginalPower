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
