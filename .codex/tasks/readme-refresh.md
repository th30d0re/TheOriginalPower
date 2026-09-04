# Task — rewrite README.md to the current state of the project

## DO NOT COMMIT / BUILD / TOUCH GIT. Edit only `README.md`. Notes to
`Sources/readme-refresh_FINDINGS.md`.

## Why

`README.md` was last touched 2026-05-27. It describes an 8-chapter / 6-section paper using
"set theory, discrete mathematics, and historical analysis". The manuscript is now a
~1,151-page work in four parts plus front matter and appendices, with an electrodynamic
"hardware layer" alongside the set-theoretic "software layer", a 146-anchor-case empirical
apparatus, a mandatory factual-verification protocol, several code subsystems, and five
tagged releases. The README needs to match.

## Read first (authoritative sources — do not invent anything not in these)

- `CLAUDE.md` — the authoritative subsystem map and build-command list. The README's
  "what this repository is" and subsystem descriptions must agree with it.
- `AGENTS.md` — the rhetorical constraint (applies to the README too: no "Powered by
  Mathematical Rigor" / "Grounded in Historical Truth" flourishes, no pseudo-profundity),
  the commit-safety rule, and the factual-claims verification protocol (worth a short
  mention in the README).
- `Paper/The_Original_Power.tex` lines 133–345 — "A Note on the Title", "Author's Preface",
  "Preface", "Empirical Methodology". This is where the accurate framework description
  lives: psycho-legal social software; the electrodynamic hardware layer (circuit topology,
  complex power signal, inductive kickback); the five-tier hierarchy (Elite $E$, Puppet
  Class, Enforcement Class, Buffer Class $I_\text{buffer}$, Out-group $O$); the four
  architectural components; the fractal mind virus; the through-line that the Out-group
  expands over time and the system serves an Elite $E \subset I$; the 146 anchor cases,
  three confidence tiers, and falsification criteria.
- `Paper/The_Original_Power.tex` — grep `^\\part{` and `^\\chapter{` for the real structure:
  four parts — **Specification and Origins (1440s–1915)**, **The Installation (1619–1865)**,
  **Scaling and Runtime (1865–Present)**, **Diagnostics and Output** — plus front matter
  (A Note on the Title, two prefaces, Empirical Methodology) and appendices (statutory
  sources, Equation Registry, Compiled Runtime Log, Falsifiability Conditions, Geometric
  Algebra / N-Dimensional Wage, Photon Model, Universality, Empirical Validation Index).
  Summarize the parts; do not paste all 22 chapter titles.
- `Makefile` — real targets: `make pdf-from-tex`, `make verify-pdf`, `make pdf` (full
  pipeline: index → empirical notebooks → SCOTUS audit → pdf), `make empirical`,
  `make epub`, `make clean`, and the venvs (`make venv`, `make venv-voice`,
  `make venv-harness`, `make harness`). `make readme` is a stub — do not mention it.
- Run `gh release list` and `gh release view v1.0.5` for the release history.

## What the new README should contain

Keep it a **clean GitHub README, ~150–220 lines**. Markdown, section headers, a small badge
row is fine. Suggested sections:

1. **Title + one-line description** — "The Original Power: The Physics of Oppression and the
   Engineering of Control". Badges: build/PDF, releases, license.
2. **What this is** — a book-length formal manuscript (LaTeX, ~1,151 pp.) plus the
   subsystems that support it. State the dual-layer framing (set-theoretic software layer +
   electrodynamic hardware layer), the five-tier hierarchy, the four architectural
   components, and the Out-group-expansion / Elite-extraction through-line. Two or three
   short paragraphs. No incantation.
3. **The manuscript** — the four parts (one line each), front matter, appendices. Point at
   `Paper/The_Original_Power.tex` as the canonical source and `Paper/The_Original_Power.pdf`
   as the tracked build. Mention the companion **Empirical Validation Index** and the
   146-anchor-case / three-tier / falsification-criterion standard.
4. **Empirical apparatus** — `Paper/scripts/*.ipynb` equation-level notebooks, `make
   empirical`, the confidence-tier scheme, and the `AGENTS.md` factual-verification protocol
   (artifact contact, independent review, PDF regression gate).
5. **Repository layout** — a table from `CLAUDE.md`: `Paper/`, `training/`, `harness/`,
   `voice_pipeline/`, `website/`, `app/`, `tools/`, `podcast_prompts/`, and **`experiments/`**
   (new — rigorous redos of two precursor studies: a race-specific mobility Markov model and
   a cross-vendor LLM hiring audit; see `experiments/PLAN.md`). Do not enumerate the scratch
   directories at repo root.
6. **Building** — prerequisites (TeX Live 2023+, `latexmk`, `biber`; `pandoc` + `pdflatex` +
   `pdftoppm` for the epub), then `make pdf-from-tex`, `make verify-pdf` (note it is CI-
   enforced and byte-stable), `make epub`. Keep the spatial-notebook conda note if it is
   still accurate; drop it if `Paper/scripts/spatial_env.yml` no longer exists (check).
7. **Releases** — link `https://github.com/th30d0re/TheOriginalPower/releases`; note the
   current tag and that each release carries `The_Original_Power.pdf` and
   `The_Original_Power.epub`.
8. **Website** — keep a short pointer to `website/` (React + TypeScript + D3 + Framer
   Motion). If the story mode is no longer "8-chapter", say "chapter-by-chapter" instead.
9. **License** — All Rights Reserved © 2026, contact via issue. Keep.

Cut: the ASCII "Core Definitions" block and the "Out-group Expansion" LaTeX theorem block
(they misstate the current formalism), the "Visual Components" section, the "Related Work"
list, the centered footer flourish.

## Findings file

- The old vs new section map (what you kept, changed, cut).
- Every factual claim in the new README and which source line it came from.
- Anything in `CLAUDE.md` / the manuscript you could not resolve.
- Confirm no git/make/build run.
