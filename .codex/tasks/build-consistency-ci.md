# Task: CI guards for PDF/builder consistency

Repo: `/Users/emmanuel/Documents/Theory/TheOriginalPower` (branch `main`).

## Background

`Paper/The_Original_Power.pdf` is tracked in git and must be regenerated and committed
whenever `Paper/**.tex` changes. Two builders produce it:

1. `make pdf-from-tex` — pins `SOURCE_DATE_EPOCH=1704067200`, `FORCE_SOURCE_DATE=1`,
   `TZ=UTC` (see `Makefile` vars `PDF_BUILD_EPOCH`, `LATEXMK_FLAGS`), and passes
   `-e '$biber=q{.tooling/biber %O %S}'`.
2. The VS Code / Cursor LaTeX Workshop recipe in `.vscode/settings.json`, bound to
   Cmd+Opt+B.

On 2026-09-04 these diverged: the editor recipe lacked the biber shim, resolved TeX
Live's broken macOS `biber` (it prints a `lipo` usage error instead of a version), and
left a truncated `.bcf`/`.bbl` that made a later `make pdf-from-tex` die with a runaway
`\abx@aux@segm` argument naming a citation key. Fixed in commit `1863c1a` by putting
`${workspaceFolder}/.tooling` first on the recipe's PATH. Full write-up is in
`AGENTS.md`, section "Build Hazards".

The goal now is CI that catches both this drift and a stale committed PDF.

## Hard constraint, read first

**Byte-comparing the PDF in CI is impossible and must not be attempted.** A
byte-identical rebuild only holds on the exact local TeX Live; the GitHub runner uses a
different distribution and produces a different page count and different font glyphs.
`.github/workflows/verify-pdf.yml` and the `check-tex` target in `Makefile` both say this
explicitly. `make verify-pdf` stays a local-only command. Do not add it to any workflow.

## Deliverables

### 1. `tools/check_build_consistency.py` (new file, you own it)

A dependency-free Python 3 script, exit 0 on pass and 1 on failure, printing a clear
diagnosis on failure. It performs the **builder drift** check:

- Parse `PDF_BUILD_EPOCH` from `Makefile` (currently `1704067200`).
- Parse `.vscode/settings.json` as JSON and locate the `latexmk` entry in
  `latex-workshop.latex.tools`.
- Assert its `env` block has:
  - `SOURCE_DATE_EPOCH` equal to the Makefile's `PDF_BUILD_EPOCH`
  - `FORCE_SOURCE_DATE == "1"` and `TZ == "UTC"`
  - a `PATH` whose first entry ends in `/.tooling`
- Assert `latex-workshop.latex.rootFile` equals `Paper/The_Original_Power.tex`.

Each failure message must say what drifted, what the two values are, and point at
`AGENTS.md` "Build Hazards". Do not hardcode `1704067200`; read it from the Makefile so
the check keeps working if the epoch is bumped.

### 2. `Makefile` — add one target

Add `check-build-consistency` running the script above, and add it to `.PHONY`. Do not
modify any existing target or variable.

### 3. `.github/workflows/build-consistency.yml` (new file, you own it)

Two jobs on `pull_request` and `push`. Neither installs LaTeX; both must finish in well
under a minute.

**Job `builder-drift`** — runs `python3 tools/check_build_consistency.py`. Triggers on
changes to `Makefile`, `.vscode/settings.json`, `tools/check_build_consistency.py`, or
the workflow file.

**Job `stale-pdf`** — triggers on changes to `Paper/**.tex`. Checks out with
`fetch-depth: 0`. For the push or PR diff range, fail when any `Paper/**.tex` file
changed and `Paper/The_Original_Power.pdf` did not change in the same range. The failure
message must say: regenerate with `make pdf-from-tex`, verify locally with
`make verify-pdf`, and commit the PDF alongside the source. Handle the PR case using the
base and head SHAs rather than assuming a linear history.

### 4. Failure reporting

When either job fails on a push to `main`, open a GitHub issue carrying the failing job
name, the diagnosis text, and the commit SHA. Use `actions/github-script` with the
built-in `GITHUB_TOKEN` and `issues: write` permission. Reuse a single open issue by
searching for a fixed marker string in the title instead of opening a duplicate on every
failure. Do not use a third-party action.

Add, commented out and clearly labeled opt-in, a step showing how to hand the failure to
an automated fixer via the Claude Code GitHub Action, noting it needs an
`ANTHROPIC_API_KEY` repository secret and bills per run. Leave it disabled.

## Rules

- **Do not run any `git` command.** No add, no commit, no branch. Leave changes in the
  working tree; they will be reviewed and committed by the orchestrator.
- Do not modify `Paper/`, `AGENTS.md`, `CLAUDE.md`, or `.github/workflows/verify-pdf.yml`.
- Do not add dependencies. Standard library only.
- Verify your script both ways before finishing: it must exit 0 against the current
  tree, and exit 1 with a useful message if you temporarily corrupt a value (restore it
  afterwards).
- Validate the workflow YAML parses (`python3 -c "import yaml,sys;yaml.safe_load(open(...))"`
  if PyYAML is present, otherwise check structure by eye).

## Findings file

Write `.codex/tasks/build-consistency-ci.findings.md` recording: what you built, the
exact commands you ran to verify, anything in the brief that was wrong or impossible,
and any additional drift risk you noticed between the two builders that this check does
not cover.
