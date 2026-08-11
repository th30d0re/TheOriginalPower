# Tier-Definition Reconciliation

Model: GPT-5 Codex

## What Was Requested

Reconcile every manuscript confidence-tier definition to the operational specification in `Paper/The_Original_Power.tex`, while preserving every claim, equation, figure, and table assignment.

## Definitions Found

- `Paper/The_Original_Power.tex:243` — frontmatter parenthetical gloss; reconciled.
- `Paper/The_Original_Power.tex:306` — methodology introductory one-line gloss; reconciled.
- `Paper/The_Original_Power.tex:309` — authoritative Tier 1 operational definition; unchanged.
- `Paper/The_Original_Power.tex:312` — authoritative Tier 2 operational definition; unchanged.
- `Paper/The_Original_Power.tex:315` — authoritative Tier 3 operational definition; unchanged.
- `Paper/The_Original_Power.tex:14842` — Era-Level Calibration Matrix legend; reconciled.
- `Paper/empirical_index.tex:5` — generated-index comment legend; reconciled.

The appendix confidence-tier passages at `Paper/apx_extraction_chart.tex:23` and `Paper/apx_theodore_transform.tex:16` classify their respective apparatuses. They do not define or paraphrase the tier system and were left unchanged. Claim-level tier descriptions throughout the chapters likewise state individual assignments and their bases; they were outside the definition-only edit scope.

## What I Changed

Each short form now states that Tier 1 covers a result directly reported or transparently derivable from a peer-reviewed source or public dataset without an undisclosed analytical step; Tier 2 covers a public dataset with disclosed author operationalisation; and Tier 3 covers an ordinal or structural claim with no quantitative calibration attempted and a stated basis.

The full operational specification at `Paper/The_Original_Power.tex:308-320` remained byte-for-byte unchanged against `HEAD`.

## Assignment Verification

No confidence-tier assignment moved. A `git diff --unified=0` review showed changes only to the three manuscript definition lines and the empirical-index comment legend. Separate comparisons extracted every assignment-bearing `Tier 1`, `Tier 2`, `Tier 3`, `T1`, `T2`, and `T3` line from `HEAD` and the working files while excluding the reconciled definition lines; both comparisons returned empty diffs.

The existing mismatch candidates remain documented in `Paper/audit/empirical-provenance-audit.md`, especially its equation rows 22-56 and figure rows 102-119. This definition-focused review identified no additional mismatch beyond that audit. No assignment was changed.

## Build Verification

`make pdf-from-tex` passed with pdfTeX 3.141592653-2.6-1.40.25 and latexmk 4.79, producing the tracked `Paper/The_Original_Power.pdf` at 1,138 pages. The generated PDF changed because it contains the reconciled definitions. Latexmk reported existing warnings about unavailable characters and document layout; it reported no compilation error.

## Challenges Encountered

1. The manuscript contains many claim-level tier labels that resemble definitions in broad searches; contextual review separated classifications from system-wide glosses.
2. `Paper/empirical_index.tex` is generated and warns against manual editing, while the task expressly places its legend in scope and forbids edits outside the named files.
3. The required Obsidian session-log directory lies outside the writable sandbox. This findings file records the session within the authorized repository scope.
4. The repository had pre-existing untracked paths, `outreach/` and `videolab/docs/ANALYSIS-REPORT.md`; they were left untouched.
5. The PDF build emits extensive pre-existing warnings, so validation used the command exit status and latexmk completion summary.

## Next Ideas (6 Ideas)

1. Move the canonical tier wording into one LaTeX macro and render all manuscript glosses from that source.
2. Update `Paper/scripts/generate_index.py` in a separately authorized task so index regeneration preserves the reconciled legend.
3. Add a CI check that rejects legacy phrases such as `peer-reviewed quantitative` and `mixed quantitative + structural diagnostics` in tier definitions.
4. Add a CI snapshot of equation and figure tier assignments to detect unauthorized re-tiering.
5. Resolve the mismatch candidates already catalogued in `Paper/audit/empirical-provenance-audit.md` through author-directed review.
6. Triage the current LaTeX missing-character warnings and duplicate-destination warnings in an independent build-cleanup task.
