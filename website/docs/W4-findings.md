# W4 — Catalog input expansion and sourced symbol coverage

## Catalog rebuild

`equation_explorer/build_data.py` now expands `\input{...}` recursively before extracting display-equation environments. Include paths resolve from `Paper/`, first exactly and then with `.tex` appended. The traversal retains the physical source file and physical line for every emitted equation, caps recursion at 32 levels, detects active-stack cycles, skips unresolved inputs, and records skipped edges in `build.skippedIncludes`.

Two consecutive builds produced the same SHA-256 digest:

`be21b42ed7d62ecbcde0fc0637e1b05c522a1cb59aa16dc9def93bf1f419eb67`

| catalog measure | before | after | change |
|---|---:|---:|---:|
| equations | 239 | 319 | +80 |
| chapters/headings represented | 22 | 40 | +18 |

The 80 newly visible equations are distributed as follows:

| physical source file | newly visible |
|---|---:|
| `Paper/chapter_geopolitical_patch.tex` | 29 |
| `Paper/apx_extraction_chart.tex` | 15 |
| `Paper/chapter_german_extraction_algorithm.tex` | 11 |
| `Paper/chapter_environmental_racism.tex` | 9 |
| `Paper/chapter_pipeline_scaffolding.tex` | 7 |
| `Paper/ch21_section_21.6.tex` | 4 |
| `Paper/apx_theodore_transform.tex` | 2 |
| `Paper/The_Original_Power.tex` | 3 |

The three main-file additions are unlabeled display equations at physical lines 2006, 2010, and 13398 that were absent from the legacy audit chunks. The two Theodore Transform examples are now cataloged as `E318` / `eq:tt.1-transform` at `Paper/apx_theodore_transform.tex:62` and `E319` / `eq:tt.2-invariance` at `Paper/apx_theodore_transform.tex:86`.

### Skipped includes

None. The commented usage example in `Paper/empirical_index.tex` is ignored as a comment. The catalog records an empty `build.skippedIncludes` array.

## Story join

The join normalization is unchanged: decode TypeScript string escapes, remove `\label{...}` and `\tag{...}`, remove whitespace, and require exact equality. No equation was manually associated with a registry entry.

| enrichment | before | after | change |
|---|---:|---:|---:|
| full | 46 | 46 | 0 |
| partial | 31 | 57 | +26 |
| none | 26 | 0 | −26 |

All 26 previously unmatched visuals now have exact catalog matches. They comprise 3 Appendix H visuals, 6 Chapter 11 visuals, 5 Chapter 12 visuals, 7 Chapter 13 visuals, and 5 Chapter 17 visuals. Their registry provenance now carries the physical `sourceFile` and line, and partial cards expose that provenance while withholding tier, falsification, and validation-source claims.

Two story visuals remain collision-limited:

- `apxE_geometric_algebra.ts` occurrence 1: `E021`, `E233`.
- `ch25_conclusion.ts` occurrence 2: `E118`, `E213`.

Both were already collision-limited. Expansion adds two normalized collision groups inside the catalog:

- `E261` / `eq:gp6b-continuum` and `E272` / `eq:gp13b-continuum`.
- `E276` / `eq:gp15b-un-diagnostic-2` and `E278` / `eq:gp15b-un-diagnostic`.

Neither new group is used by a story visual. The join surfaces 13 duplicate-candidate pairs across 11 normalized collision groups and resolves none by file order. The complete collision list remains in `website/docs/W2-story-equation-join.md`.

### Remaining unmatched equations

None.

## Symbol coverage

Coverage means that an enriched story visual has at least one glossary term selected by `symbolsForLatex`.

| coverage measure | before | after |
|---|---:|---:|
| enriched visuals with at least one gloss | 52 / 77 | 79 / 103 |
| newly enriched visuals with at least one gloss | 0 / 26 | 26 / 26 |

The registry gained 20 sourced entries and one existing extraction entry was widened from `\mathcal{E}(t)` to the sourced `\mathcal{E}` family. Longer exact symbols suppress overlapping generic entries. This prevents `\beta_{\text{bio}}` from receiving the pre-existing `\beta` gloss and prevents `\tau_{\text{age}}` from receiving the pre-existing crash-threshold gloss.

| symbol | gloss | source |
|---|---|---|
| `\mathcal{E}` | Extraction output routed toward the Elite | `Paper/The_Original_Power.tex:9397–9400` |
| `F_{\text{enforce}}` | Enforcement Class; physical actuator of the partition | `Paper/The_Original_Power.tex:408–410` |
| `P_{\text{lead}}` | Environmental lead policy variable | `Paper/The_Original_Power.tex:7801–7805` |
| `\beta_{\text{bio}}` | Biological depletion coefficient | `Paper/chapter_environmental_racism.tex:50–68` |
| `E(t)` | Environmental toxicant concentration vector; μg/dL blood equivalent or ambient ppm | `Paper/chapter_environmental_racism.tex:59–78` |
| `T(t)` | Cumulative exposure time; years | `Paper/chapter_environmental_racism.tex:59–82` |
| `A(t)` | Age-dependent absorption rate | `Paper/chapter_environmental_racism.tex:61–86` |
| `\tau_{\text{age}}` | Developmental lag; 21–23 years | `Paper/chapter_environmental_racism.tex:324–334` |
| `O_{\text{bio}}` | Biological capacity diminished by accumulated toxicant load | `Paper/chapter_environmental_racism.tex:88–103` |
| `L_{\text{loop}}` | Property-tax lead feedback loop | `Paper/chapter_environmental_racism.tex:154–169` |
| `M_{\text{lifetime}}` | Lifetime menstrual-product metal exposure integral | `Paper/chapter_environmental_racism.tex:436–445` |
| `C_{\text{shadow}}` | Shadow capital injection | `Paper/chapter_geopolitical_patch.tex:26–42` |
| `\alpha_{\text{kinetic}}` | Direct kinetic clearance | `Paper/chapter_geopolitical_patch.tex:68–78` |
| `\alpha_{\text{terror}}` | Aerosolized terror | `Paper/chapter_geopolitical_patch.tex:68–78` |
| `\alpha_{\text{admin}}` | Administrative erasure | `Paper/chapter_geopolitical_patch.tex:68–78` |
| `\mathcal{L}_{\text{display}}` | Observable legal constraint | `Paper/chapter_geopolitical_patch.tex:365–372` |
| `\mathcal{L}_{\text{backend}}` | Actual operational constraint on Elite capital | `Paper/chapter_geopolitical_patch.tex:365–372` |
| `\Phi_{\text{s2p}}` | School-to-prison pipeline throughput | `Paper/chapter_pipeline_scaffolding.tex:96–105` |
| `H_{\text{cascade}}` | Cascade transfer function | `Paper/chapter_pipeline_scaffolding.tex:194–203` |
| `O_{\text{target}}` | Target population sorted between liquidation and forced-labor preservation | `Paper/chapter_german_extraction_algorithm.tex:200–208` |
| `P_{\text{abs}}` | Power absorbed by the load | `Paper/apx_extraction_chart.tex:82–96` |

### Deliberately unglossed generic tokens

- Bare `E` has incompatible uses across the enriched set: Elite node, environmental concentration in `E(t)`, and commodity exposure in `E_{\text{commodity}}`.
- Bare `S` denotes state output, socioeconomic stress, strategy sets, and signal families.
- Generic `\Phi` denotes phase in existing equations and school-to-prison throughput in the new include. The exact `\Phi_{\text{s2p}}` form is glossed.
- Generic `\rho` spans threshold ratios and density-like quantities.
- Generic `\mathcal{L}` spans a Lagrangian, legal constraints, and named cycle indices. The display/backend legal forms are glossed exactly.
- Generic `\psi` spans aggregate, material, status, and historically specific wage allocations. Existing exact `\psi_m` and `\psi_s` entries remain; no generic family meaning was added.
- `\mathcal{A}` has a manuscript definition at `Paper/The_Original_Power.tex:14806`, with no occurrence in the 103 enriched story visuals. It was not added because it changes no requested coverage.

Existing sourced entries already cover `\tau`, `O_{\text{racialized}}`, `I_{\text{buffer}}`, and `W`. Every omitted generic token remains plain when no exact registered form applies.

## Verification

- Catalog builder: 319 equations on two runs; byte-identical SHA-256 shown above.
- Story join: `46 full / 57 partial / 0 none` on two runs; byte-identical outputs.
- TypeScript strict check: pass.
- Production build: pass with the existing Vite dynamic/static import and chunk-size warnings.
- Test suite: pass after updating the obsolete `none` fixture to exercise a genuinely missing join entry.
- Verbatim checker: pass.
- Browser: unavailable in this environment. The preferred in-app controller failed to initialize because its bundled native dependency has no Apple Silicon build for the active Node runtime; the alternate installed controller reported that no browser was available. A final reachability check also found no listener at `localhost:5199` (`HTTP 000`). No browser-verification claim is made. React interaction tests cover the post-click render tick and partial-provenance DOM.
