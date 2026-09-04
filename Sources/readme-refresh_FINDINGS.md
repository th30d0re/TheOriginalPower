# README Refresh Findings

Date: 2026-09-04  
Model: GPT-5.6

## Scope and result

The repository README was rewritten from the current authoritative sources named in
`.codex/tasks/readme-refresh.md`. The result is a 218-line GitHub README covering the
manuscript, formal framework, empirical apparatus, repository subsystems, build entry
points, releases, website, and license.

Files written:

- `README.md`
- `Sources/readme-refresh_FINDINGS.md`

No manuscript source was edited.

## Old-to-new section map

| Old README section | New treatment | Reason and source |
|---|---|---|
| Title and subtitle | Kept; badges reduced to PDF, release, and license | Required by task lines 49–50. |
| Interactive Website | Shortened and moved near the end | Required by task lines 75–76; stack checked against `CLAUDE.md` line 90. |
| Abstract | Replaced by “What this is” | Current framework description comes from `Paper/The_Original_Power.tex` lines 168–182 and 240–245. |
| Key Insight | Removed as a separate rhetorical callout | The substantive expansion and Elite-extraction claim now appears directly in “What this is”; task lines 19–20 and `AGENTS.md` lines 3–5 prohibit the old flourish. |
| Research Contributions | Removed | Its claims were stale and duplicated the framework summary. |
| Document Structure | Replaced by “The manuscript” | The new section uses the actual `\part` and appendix declarations rather than the old six-section outline. |
| Building the Document | Replaced by “Building” | Commands and prerequisites now follow the root `Makefile`, EPUB script, and task brief. The invalid manual build from inside `Paper/` was removed. |
| Spatial Case Study Environment | Kept in compact form | `Paper/scripts/spatial_env.yml` exists; task lines 68–71 directed retention when present. |
| Visual Components | Cut | Explicitly required by task lines 79–81. |
| Theoretical Framework / Core Definitions | Replaced by prose and a five-role list | The old ASCII block misstated the current five-tier formalism; task lines 79–80 required removal. |
| Key Theorem / Out-group Expansion block | Cut | The old monotonic theorem statement misstated the current formalism; task lines 79–80 required removal. |
| Historical Case Studies | Replaced by four-part summary | Current structure comes from the manuscript’s `\part` and `\chapter` declarations. |
| Contributing | Replaced by “Questions and corrections” | Keeps the issue route and adds the artifact-identification expectation from `AGENTS.md`. |
| License | Kept | Required by task line 77. |
| Related Work | Cut | Explicitly required by task line 80. |
| Contact | Folded into “Questions and corrections” and “License” | Avoids duplicate issue instructions. |
| Centered footer flourish | Cut | Explicitly required by task line 81 and inconsistent with `AGENTS.md` lines 3–5. |
| Empirical apparatus | Added | Required by task lines 58–62 and supported by the manuscript, `CLAUDE.md`, and `Makefile`. |
| Repository layout | Added | Required by task lines 63–67 and based on `CLAUDE.md` lines 77–96 plus `experiments/PLAN.md`. |
| Releases | Added | Required by task lines 72–74 and checked with GitHub CLI. |

## Claim-to-source register

The ranges below refer to the rewritten `README.md`. Descriptive Markdown links and command
examples are included with the factual statements they support.

| README lines | Factual claim | Authoritative source |
|---|---|---|
| 1–7 | Title, subtitle, PDF location, release location, and All Rights Reserved status | `.codex/tasks/readme-refresh.md` lines 49–50 and 77; existing repository paths. |
| 9–12 | Book-length formal manuscript; elite-extraction algorithm; canonical source, tracked PDF, empirical materials, and supporting software | `CLAUDE.md` lines 7–17. |
| 16–19 | Racism as psycho-legal social software running on predictive cognition; set-theoretic formalization of partitions and extraction | `Paper/The_Original_Power.tex` lines 168, 176, and 242. |
| 21–24 | Electrodynamic hardware layer; circuit topology, complex power signal, inductive kickback; shared dynamical architecture | `Paper/The_Original_Power.tex` lines 168 and 171. |
| 26–33 | Five structural roles and their functions | `Paper/The_Original_Power.tex` lines 173, 180, and 182. |
| 35–40 | Four recurring architectural components | `Paper/The_Original_Power.tex` line 182. |
| 42–46 | Out-group expansion, Elite subset `E ⊂ I`, and fractal mind virus operating across institutional and cognitive scales | `Paper/The_Original_Power.tex` lines 178 and 240. |
| 50–52 | Canonical TeX path, tracked PDF, and 1,151-page current release | `CLAUDE.md` lines 13–16; `gh release view v1.0.5`, Assets table and asset list. |
| 54–65 | Four-part structure, date ranges, and thematic summaries | `Paper/The_Original_Power.tex` part declarations at lines 339, 3464, 5398, and 11206; chapter declarations at lines 343–14437; task lines 31–37. |
| 67–68 | Front matter contents | `Paper/The_Original_Power.tex` lines 133, 141, 164, and 248. |
| 70–77 | Appendix titles | `Paper/The_Original_Power.tex` lines 14529–15300, specifically chapter declarations at 14530, 14645, 14871, 15104, 15157, 15235, 15242, and 15300. |
| 79–81 | Empirical Validation Index mapping; 146 anchor cases and events | `Paper/The_Original_Power.tex` line 245 and lines 320–334. |
| 85–88 | Equation-level notebooks, naming convention, and execution order | `CLAUDE.md` lines 79–82; `Makefile` lines 158–180. |
| 90–92 | `make empirical` entry point | `Makefile` line 158; task lines 38–41. |
| 94–100 | Three confidence-tier definitions | `Paper/The_Original_Power.tex` lines 245 and 306–320. |
| 102–106 | Falsification criteria and mandatory factual-edit protocol: artifact contact, provenance, independent review, rendered-PDF gate | `Paper/The_Original_Power.tex` lines 245 and 334; `AGENTS.md` lines 73–78, 97–106, 129–138, 147–167. |
| 112 | `Paper/` contents and role | `CLAUDE.md` lines 13–17 and 79–82. |
| 113 | `training/` contents and role | `CLAUDE.md` line 84. |
| 114 | `harness/` contents and role | `CLAUDE.md` line 86. |
| 115 | `voice_pipeline/` contents, exports, and test status | `CLAUDE.md` lines 64–75 and 88. |
| 116 | Website stack and purpose | `CLAUDE.md` line 90. |
| 117 | Swift iOS app and name | `CLAUDE.md` line 92. |
| 118 | `tools/` functions | `CLAUDE.md` line 94; `tools/epub_build.sh` lines 1–67 for EPUB preparation. |
| 119 | `podcast_prompts/` role | `CLAUDE.md` line 96. |
| 120 | Two experiment redos and their subjects | `experiments/PLAN.md` lines 1–6, 14–17, and 57–61. |
| 124 | Commands run from repository root | `.codex/tasks/readme-refresh.md` lines 38–41; `AGENTS.md` lines 198–201 specifically confirm the PDF-root requirement. |
| 128–132 | TeX Live 2023+, `latexmk`, `biber`, Python, Pandoc, `pdflatex`, and `pdftoppm` prerequisites | `.codex/tasks/readme-refresh.md` lines 68–71; `Makefile` lines 21–22 and 84–95; `tools/epub_build.sh` lines 21–23. |
| 136–140 | `make pdf-from-tex` rebuilds the tracked PDF from TeX | `Makefile` lines 18–22 and 61–62; `CLAUDE.md` line 39. |
| 142–149 | `make verify-pdf`, fixed epoch/time zone, byte comparison, and CI enforcement | `Makefile` lines 23–28 and 64–68; `CLAUDE.md` lines 13–16 and 46–47. |
| 151–156 | `make pdf` dependency order: index, empirical, SCOTUS audit, PDF | `Makefile` line 59; `CLAUDE.md` line 40. |
| 160–167 | `make epub`, `dist/` output, figure compilation/rasterization, cross-reference preparation, and MathML | `Makefile` lines 70–76; `tools/epub_build.sh` lines 1–7, 19, 27–67. |
| 169–178 | Spatial notebook environment exists and uses the stated Conda name and dependencies | `.codex/tasks/readme-refresh.md` lines 68–71; `Paper/scripts/spatial_env.yml` lines 1–31; notebook path exists in `Paper/scripts/`. |
| 180–187 | Virtual-environment and harness targets | `CLAUDE.md` lines 49–60; `Makefile` lines 101–140. |
| 191–194 | Current tag `v1.0.5`, six tagged releases, PDF and EPUB release assets | `gh release list` returned `v1.0.0` through `v1.0.5`; `gh release view v1.0.5` identified `v1.0.5` as current and listed both assets; the all-release asset requirement is specified in `.codex/tasks/readme-refresh.md` lines 72–74. |
| 198–200 | Website purpose, React/TypeScript/D3/Framer Motion stack, chapter-by-chapter story mode, dashboard | `CLAUDE.md` line 90; `.codex/tasks/readme-refresh.md` lines 75–76; `website/src/story/StoryIndex.tsx` lines 41–113; old `website/README.md` lines 7–16 for the named dashboard. |
| 202–206 | Website installation and development commands | `website/README.md` lines 26–36; `website/package.json` lines 6–11. |
| 208–211 | GitHub issues as the correction route; source-artifact identification for factual corrections | `.codex/tasks/readme-refresh.md` line 77; `AGENTS.md` lines 97–106. |
| 213–218 | All Rights Reserved © 2026 and issue-based permission contact | `.codex/tasks/readme-refresh.md` line 77; prior README license/contact text. |

## Source conflicts and unresolved items

1. **Part I date range.** `Paper/The_Original_Power.tex` line 238 still calls Part I
   “1440s–1787,” while the actual `\part` declaration at line 339 says “1440s–1915.”
   `AGENTS.md` lines 61–71 explicitly establish 1440s–1915 as correct because *The Haitian
   Export* closes the part. The README uses 1440s–1915.
2. **Release count in the task rationale.** `.codex/tasks/readme-refresh.md` line 12 says
   five tagged releases. `gh release list` returned six tags, `v1.0.0` through `v1.0.5`, on
   2026-09-04. The README uses six.
3. **Confidence-track count.** `Paper/The_Original_Power.tex` line 253 says “all four of
   those tracks” and then describes three. Lines 324–332 enumerate exactly three tracks.
   The README describes the three confidence tiers and does not repeat the inconsistent
   track count.
4. **Website documentation is stale.** `website/README.md` line 8 says eight chapters and
   line 20 says React 18. `website/src/content/manifest.ts` describes twenty-six narrative
   chapters, and `website/package.json` line 22 specifies React 19. The root README avoids a
   chapter count and React version and uses “chapter-by-chapter,” as directed by the task.
5. **Release assets across all tags.** The requested `gh release view v1.0.5` command
   directly verified both assets for the current tag. Older tags were listed but not opened
   individually. The task itself states that every release carries both assets, so the
   README follows that authoritative instruction.
6. **Page count provenance.** The 1,151-page count comes from the v1.0.5 release notes. No
   PDF inspection or build was performed because the task prohibited builds.

No other unresolved item affected the README.

## Command and safety confirmation

- Ran the required `gh release list` and `gh release view v1.0.5` commands.
- Used read-only shell commands to inspect the specified sources and count README lines.
- Did **not** run `git`, any `make` target, LaTeX, Pandoc, a notebook, a test suite, or any
  build command.
- Did **not** commit.
- Did **not** modify `Paper/`, source data, generated artifacts, or release state.
