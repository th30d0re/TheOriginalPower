# The Original Power

## The Physics of Oppression and the Engineering of Control

[![PDF](https://img.shields.io/badge/manuscript-PDF-8b1e1e?logo=adobeacrobatreader)](Paper/The_Original_Power.pdf)
[![EPUB](https://img.shields.io/badge/manuscript-EPUB-8b1e1e?logo=epub)](https://github.com/th30d0re/TheOriginalPower/releases/latest)
[![Release](https://img.shields.io/github/v/release/th30d0re/TheOriginalPower?label=release)](https://github.com/th30d0re/TheOriginalPower/releases)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-555555)](#license)

*The Original Power* is a book-length formal manuscript about systemic oppression as an
elite-extraction algorithm. The repository contains the canonical LaTeX source, its tracked
PDF, empirical validation materials, and the software subsystems used to study, present,
and extend the framework.

## What this is

The manuscript models racism as psycho-legal social software: legal, institutional,
cultural, and affective code running on human predictive cognition. Its set-theoretic
software layer formalizes partitions, incentives, extraction, and the movement of people
between structural positions.

An electrodynamic hardware layer represents the five-tier hierarchy as a circuit topology,
suppression allocation as a complex power signal, and reform shocks as inductive kickback.
The two layers express the same control architecture through different mathematical
representations.

The hierarchy contains five structural roles:

1. **Elite** (`E`) — extracts value and gates the system's control signals.
2. **Puppet Class** (`P_puppet`) — translates Elite preferences into law and policy.
3. **Enforcement Class** (`F_enforce`) — physically actuates those policies.
4. **Buffer Class** (`I_buffer`) — receives status, selective protection, or concessions in
   exchange for defending the partition.
5. **Out-group** (`O`) — bears the compounding burden of extraction.

The framework identifies four recurring architectural components:

1. Asymmetric autonomy restriction between In-groups and Out-groups.
2. Selective empathy that validates In-group suffering and dismisses Out-group harm.
3. Ideological justification through spurious claims.
4. Resistance to structural critique.

The historical argument tracks the expansion of the Out-group across time. Groups once
protected by the In-group boundary become available for extraction, while the system's
returns concentrate in an Elite subset `E ⊂ I`. The manuscript also describes the
partition logic as a fractal mind virus because it reproduces across institutional and
cognitive scales.

## The manuscript

[`Paper/The_Original_Power.tex`](Paper/The_Original_Power.tex) is the canonical source.
[`Paper/The_Original_Power.pdf`](Paper/The_Original_Power.pdf) is the tracked build; the
current release is 1,151 pages. An EPUB 3 edition (`The_Original_Power.epub`) is built from
the same source and attached to every [release](https://github.com/th30d0re/TheOriginalPower/releases);
build it locally with `make epub`.

The main text is organized into four parts:

- **Part I — Specification and Origins (1440s–1915):** establishes the formal geometry and
  traces the specification of the racial partition, Buffer Class, Puppet Class, and
  constitutional kernel.
- **Part II — The Installation (1619–1865):** examines kinship extraction, the gendered
  reproductive kernel, slave patrols, and the constitutional enforcement architecture.
- **Part III — Scaling and Runtime (1865–Present):** follows spatial containment, electoral
  filtering, institutional recompilation, cannibalization, and the kinetic guarantee.
- **Part IV — Diagnostics and Output:** develops the terminal theorems, global scaling,
  algorithmic systems, spectral dynamics, multi-axis interference, and the concluding
  definition.

The front matter contains **A Note on the Title**, **Author's Preface**, **Preface**, and
**Empirical Methodology**. The appendices collect:

- Primary Statutory Sources (United States Code)
- Equation Registry and Era-Level Calibration
- Compiled Runtime Log
- Falsifiability Conditions for the Two Terminal Theorems
- Geometric Algebra and the N-Dimensional Wage
- Empirical Validation Index
- The Photon Model of Polarizing Information
- Universality and the Finite Topology of Power

The **Empirical Validation Index** maps equations to confidence tiers, data sources, and
falsification criteria. The calibration uses 146 anchor cases spanning 146 historical
events.

## Empirical apparatus

Equation-level Jupyter notebooks live under [`Paper/scripts/`](Paper/scripts/). Files named
`eq<NN>_*` validate numbered equations or claims. The empirical pipeline runs the SCOTUS
semantic and spectral work, the spectral foundation notebooks, and then the equation-level
notebooks in dependency order:

```bash
make empirical
```

Numerical and structural claims use three confidence tiers:

- **Tier 1:** directly reported or transparently derived from a peer-reviewed source or
  public dataset, with no undisclosed analytical step.
- **Tier 2:** computed from a public dataset using a disclosed author operationalization.
- **Tier 3:** an ordinal or structural claim with no quantitative calibration attempted and
  an explicit statement of its basis and limits.

Each covered claim also receives a falsification criterion. The repository's mandatory
factual-verification protocol is defined in [`AGENTS.md`](AGENTS.md). Manuscript factual
edits require contact with the actual source artifact, provenance classification,
independent review with authority to reject the change, and inspection of the changed
passage in the rendered PDF before the edit lands.

## Repository layout

| Path | Purpose |
|---|---|
| [`Paper/`](Paper/) | Canonical LaTeX manuscript, bibliography, statutory-source material, empirical notebooks, processed data, and the tracked PDF. |
| [`training/`](training/) | MLX LoRA dataset construction, local-model fine-tuning, evaluation scripts, and a separate Rust chat-group TUI. |
| [`harness/`](harness/) | Python server for dataset curation, scoring, and training-job coordination. |
| [`voice_pipeline/`](voice_pipeline/) | Tested TTS and audio-production package with Logic, Ableton, and FCPXML export paths. |
| [`website/`](website/) | React and TypeScript interactive presentation using D3 and Framer Motion. |
| [`app/`](app/) | Swift iOS application, `decodingOppression`. |
| [`tools/`](tools/) | U.S. Code extraction and diffing, EPUB preparation, trademark search, and voice utilities. |
| [`podcast_prompts/`](podcast_prompts/) | Per-episode narration scripts used by the audio workflow. |
| [`experiments/`](experiments/) | Rigorous redos of two precursor studies: a race-specific mobility Markov model and a cross-vendor LLM hiring audit. |

## Building

Run all commands from the repository root.

### Prerequisites

- TeX Live 2023 or later
- `latexmk`
- `biber`
- Python 3 for empirical tooling
- `pandoc`, `pdflatex`, and `pdftoppm` for EPUB generation

### PDF

Rebuild the tracked PDF directly from the canonical TeX source:

```bash
make pdf-from-tex
```

Verify that a byte-stable rebuild matches the tracked PDF:

```bash
make verify-pdf
```

`make verify-pdf` fixes the build epoch and time zone and fails when the regenerated PDF
differs from the tracked copy. It is a local gate — a byte-stable rebuild holds only on the
exact local TeX Live. CI runs `make check-tex`, which compiles the manuscript and fails on a
LaTeX error or an unresolved cross-reference or citation.

Run the complete manuscript pipeline—index generation, empirical notebooks, SCOTUS audit,
and PDF compilation—with:

```bash
make pdf
```

### EPUB

Build the EPUB 3 edition in `dist/`:

```bash
make epub
```

The EPUB pipeline compiles and rasterizes TikZ and PDF figures, prepares cross-references
and counters, and writes MathML through Pandoc.

### Spatial notebook environment

The dedicated environment for `Paper/scripts/eq47_51_spatial_overlay.ipynb` remains
available:

```bash
conda env create -f Paper/scripts/spatial_env.yml
conda activate spatial_cs9
jupyter notebook Paper/scripts/eq47_51_spatial_overlay.ipynb
```

### Supporting environments

```bash
make venv          # empirical notebooks
make venv-voice    # voice and audio pipeline
make venv-harness  # training and data harness
make harness       # run the harness server
```

## Releases

The current release is [`v1.0.5`](https://github.com/th30d0re/TheOriginalPower/releases/tag/v1.0.5).
Six tagged releases are available from the
[`Releases`](https://github.com/th30d0re/TheOriginalPower/releases) page. Each release
includes `The_Original_Power.pdf` and `The_Original_Power.epub`.

## Website

[`website/`](website/) contains the interactive presentation of the framework. It uses
React, TypeScript, D3, and Framer Motion, with a chapter-by-chapter story mode and an
interactive dashboard.

```bash
cd website
npm install
npm run dev
```

## Questions and corrections

Open a GitHub issue for factual corrections, technical problems, or project questions.
Manuscript corrections should identify the source artifact and the exact passage at issue.

## License

**All Rights Reserved © 2026**

Contact the author through a GitHub issue for permissions concerning reproduction,
distribution, or derivative works.
