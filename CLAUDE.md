# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is primarily a **research manuscript** — a book-length LaTeX work titled *The Original Power*
(originally *Redefining Racism*) that develops a set-theoretic / discrete-math framework modeling
systemic oppression as an elite-extraction algorithm. The repo also contains several auxiliary
subsystems that support the manuscript: empirical validation notebooks, a local-model fine-tuning
pipeline, an audio/podcast production pipeline, an interactive website, and an iOS app.

The canonical manuscript source is `Paper/The_Original_Power.tex`. The committed PDF is
gitignored and rebuilt from source. Prose-level chapter sources live under `chapters/`; standalone
chapter `.tex` patches live in `Paper/` (e.g. `chapter_*.tex`, `ch21_section_21.6.tex`).

## Operating rules (from AGENTS.md — read it)

`AGENTS.md` defines two non-negotiable project rules that override default behavior:

1. **Rhetorical constraint** — when writing manuscript prose, use direct, affirmative declarative
   statements. Eliminate formulaic antithesis and corrective contrasts ("It is not merely X, it is
   Y", "More than just X..."). This is a hard style requirement for all `.tex`/prose edits.
2. **Commit-before-destroy** — commit (clean checkpoint) BEFORE any batch edit (>10 lines or >1
   file), any scripted/regex/sed transformation of `.tex` sources, any history-rewriting git
   operation, or any script that writes into `Paper/`, `figures/`, or `data/`. If uncommitted work
   exists, never run `git checkout --`, `git reset`, or destructive scripts — commit first.

Use the commit message template in `AGENTS.md` (`[<scope>] summary` with WHAT/WHY/BUILD/RISK).
Recent history shows the scope convention: `[training]`, `[manuscript]`, `[ch1]`, `[tools]`, `[chat_group]`.

## Build & common commands

All build orchestration is in the root `Makefile`. Key targets:

```bash
make pdf-from-tex   # rebuild Paper/The_Original_Power.pdf from TeX (latexmk)
make pdf            # full pipeline: index → empirical notebooks → SCOTUS audit → pdf-from-tex
make verify-pdf     # rebuild and fail if committed PDF differs (enforced in CI)
make empirical      # execute Paper/scripts notebooks (scotus → spectral → eq*) in order
make clean          # remove LaTeX aux files
```

`verify-pdf` pins `SOURCE_DATE_EPOCH`/`TZ=UTC` for byte-stable rebuilds; do not introduce
timestamp drift into the TeX build.

### Virtual environments

Each subsystem has its own venv, all bootstrapped via `make`:

| venv | target | purpose |
|------|--------|---------|
| `.venv` | `make venv` | empirical notebooks (`Paper/scripts/requirements.txt`) |
| `.venv-voice` | `make venv-voice` | audio/voice pipeline + MLX training (`voice_pipeline/requirements.txt`) |
| `.venv-harness` | `make venv-harness` | training/data harness (`harness/requirements.txt`) |
| `.venv-notebooklm` | — | NotebookLM batch scripts at repo root |

`make harness` runs the harness server (`python -m harness.server`).

### Tests

The maintained test suite is in `voice_pipeline/` (pytest). Run with the voice venv:

```bash
source .venv-voice/bin/activate
python -m pytest voice_pipeline/                 # all voice-pipeline tests
python -m pytest voice_pipeline/test_parser.py   # a single module
python -m pytest voice_pipeline/test_parser.py::test_name   # a single test
```

Note: `find . -name 'test_*.py'` returns thousands of hits — almost all are inside `.venv*/` and
`app/.../mlx-swift/` checkouts. Ignore those; the real tests are `voice_pipeline/test_*.py` and the
`training/test_*.py` evaluation scripts (run directly, not via pytest).

## Subsystem map

- **`Paper/`** — LaTeX manuscript and empirical work.
  - `The_Original_Power.tex` is the root document; `references.bib` is the bibliography; `usc_macros.sty` + `usc_snippets/` hold U.S. Code citations.
  - `Paper/scripts/*.ipynb` are equation-level empirical notebooks named `eq<NN>_*` — each validates a numbered equation/claim and is executed in dependency order by `make empirical` (scotus → spectral → eq*). Notebooks consume processed data from `Paper/data/`; `make data-refresh` regenerates processed datasets from `Paper/data/raw/` (curatorial — not run by `make empirical`).
  - `Paper/research/` holds the SCOTUS opinion corpus (PDFs are gitignored, local-only).

- **`training/`** — MLX LoRA fine-tuning of local LLMs (Mac arm64, Apple Silicon) on the framework. `train.py` wraps `mlx_lm.lora`; `build_dataset*.py` builds JSONL datasets under `training/data/`; `test_framework_depth.py` / `compare_models.py` score how well models reproduce the framework. Adapters (`training/adapters/`) and fused models (`training/fused_models/`) are gitignored. `training/chat_group/` is a separate Rust TUI (`cargo` — has its own `README.md`).

- **`harness/`** — Python server (`server.py`) coordinating dataset curation (`curator.py`), scoring (`scorer.py`), and training jobs (`train_worker.py`, `job_runner.py`). Runtime artifacts under `harness/data/` are gitignored.

- **`voice_pipeline/`** — TTS / audio production package (run as `python -m voice_pipeline`). Parses marked-up scripts and exports to Logic/Ableton/FCPXML. Fully unit-tested.

- **`website/`** — React + TypeScript + D3.js + Framer Motion interactive visualization of the framework.

- **`app/`** — Swift iOS app (`decodingOppression`). Contains large vendored `mlx-swift` checkouts under derived-data — do not edit those.

- **`tools/`** — utilities: U.S. Code extraction/diffing (`usc_extract.py`, `usc_diff.sh`, run via `make usc-all`), trademark search, voice helpers.

- **`podcast_prompts/`** — per-episode narration scripts; root-level `*_notebooklm.py` scripts batch-generate NotebookLM audio. `export_to_obsidian.py` and `tools/` exporters sync content into an external Obsidian vault.

## Conventions

- Dates in this project are written in the future-dated convention seen in commits and filenames (e.g. `2026`); follow surrounding files rather than wall-clock.
- `.cursor/`, `.gemini/`, `.kimi/`, `.foundation/`, `.antigravitycli/` are other assistants' configs/plans and are gitignored — treat `.cursor/plans/*.plan.md` as historical planning context, not active rules.
- Secrets live in `.env` (gitignored); `.env.example` documents required keys (NYT API, optional GCP).
