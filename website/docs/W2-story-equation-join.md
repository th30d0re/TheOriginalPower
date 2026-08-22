# W2 — Story-mode equation join to the equation registry

Join key: LaTeX content, normalised on both sides (decode source-only newline/tab escapes and doubled backslashes, drop `\label{...}` and `\tag{...}`, strip all whitespace). Exact match required; no fuzzy matching. Inputs: `website/src/content/chapters/*.ts`, `equation_explorer/data/equations.json` (319 registry equations), `Paper/empirical_validations/eq_*.md` (146 validation records, joined on the registry label).

## Counts

| | count |
|---|---:|
| equation visuals parsed | 103 |
| exact registry match (normalised LaTeX) | 103 |
| of those, with an empirical-validation record | 46 |
| tier 1 / tier 2 / tier 3 | 10 / 7 / 29 |
| matched, no record | 57 |
| unresolved collision matches | 2 |
| unmatched | 0 |

## Comparison with the reference table in the task brief

| | reference (task brief) | this run |
|---|---:|---:|
| equation visuals parsed | 103 | 103 |
| exact registry match (normalised LaTeX) | 77 | 103 |
| of those, with an empirical-validation record | 46 | 46 |
| matched, no record | 31 | 57 |
| unmatched | 26 | 0 |
| tier 1 / tier 2 / tier 3 | 10 / 7 / 29 | 10 / 7 / 29 |

Recursive input expansion adds 26 exact registry matches. The full count is unchanged; partial enrichment rises by 26 and unmatched falls by 26.

Registry note: 13 normalised-LaTeX collisions exist inside the registry itself. A matching story entry records every candidate id, receives no registry or validation record, and is limited to partial enrichment. Colliding ids: `E047` vs `E046`, `E272` vs `E261`, `E278` vs `E276`, `E113` vs `E036`, `E213` vs `E118`, `E215` vs `E112`, `E216` vs `E036`, `E217` vs `E114`, `E218` vs `E115`, `E220` vs `E046`, `E223` vs `E009`, `E224` vs `E010`, `E233` vs `E021`.

## Unresolved collision matches (2)

- `apxE_geometric_algebra.ts` occurrence 1: `E021`, `E233`. Registry-derived tier, falsification, and sources are withheld.
- `ch25_conclusion.ts` occurrence 2: `E118`, `E213`. Registry-derived tier, falsification, and sources are withheld.

## Unmatched equations (0)

Each entry: chapter file, occurrence index, story label, and the verbatim LaTeX as it appears in the module source. The assessment line is deterministic: when the story label names a manuscript equation number (`eq. N.M`) and the registry holds an entry under the same number, the two normalised LaTeX strings are compared and the first divergence is shown — these are the near-miss candidates. When no registry entry carries the number, the entry is either a web-only adaptation or a registry gap; the data alone does not say which, and the report says so rather than guessing.

## Matched but unvalidated (55)

Registry labels of equations the book displays that have no empirical-validation record (listed in story order):

- `eq:19.5-unified-lorentz-force-registry` (E219) — `apxB_equation_registry.ts` occurrence 2, story label: eq. 19.5
- `eq:19.13-buffer-work-theorem-registry` (E227) — `apxB_equation_registry.ts` occurrence 3, story label: eq. 19.13
- `eq:ga.quaternion` (E230) — `apxE_geometric_algebra.ts` occurrence 0, story label: (no story label)
- `eq:ga.transphobia-paradox` (E234) — `apxE_geometric_algebra.ts` occurrence 2, story label: (no story label)
- `eq:ga.bivector` (E235) — `apxE_geometric_algebra.ts` occurrence 3, story label: (no story label)
- `eq:app-photon-spectral-density` (E237) — `apxF_photon_model.ts` occurrence 0, story label: (no story label)
- `eq:app-photon-field-power` (E236) — `apxF_photon_model.ts` occurrence 1, story label: (no story label)
- `eq:app-photon-spectral-density` (E237) — `apxF_photon_model.ts` occurrence 2, story label: (no story label)
- `eq:app-photon-optimization` (E238) — `apxF_photon_model.ts` occurrence 3, story label: (no story label)
- `eq:app-universality-objective` (E239) — `apxG_universality.ts` occurrence 0, story label: (no story label)
- `eq:xc.3-absorbed-power` (E305) — `apxH_extraction_chart.ts` occurrence 0, story label: eq. XC.3
- `eq:xc.12-active-condition` (E314) — `apxH_extraction_chart.ts` occurrence 1, story label: eq. XC.12
- `eq:xc.13-bode-fano` (E315) — `apxH_extraction_chart.ts` occurrence 2, story label: eq. XC.13
- `eq:0.1-unified-lorentz-force` (E001) — `ch00_system_initialization.ts` occurrence 0, story label: The Unified Lorentz Force
- `eq:0.1-unified-lorentz-force` (E001) — `ch00_system_initialization.ts` occurrence 1, story label: eq. 0.1
- `eq:0.1a-self-exciting-generator` (E002) — `ch00_system_initialization.ts` occurrence 2, story label: eq. 0.1a
- `eq:0.2-tier-voltage-drop` (E003) — `ch00_system_initialization.ts` occurrence 3, story label: eq. 0.2
- `eq:lag-augmented` (E023) — `ch01_dynamical_systems.ts` occurrence 0, story label: The augmented Lagrangian
- `eq:lag-euler-lagrange` (E022) — `ch01_dynamical_systems.ts` occurrence 1, story label: eq. 1.1
- `eq:lag-augmented` (E023) — `ch01_dynamical_systems.ts` occurrence 2, story label: eq. 1.2
- `eq:1.7a-rlc-governing` (E034) — `ch02_redefining_racism.ts` occurrence 4, story label: eq. 1.7a
- `eq:awb_dualtrack` (E060) — `ch08_gendered_axis.ts` occurrence 1, story label: (no story label)
- `eq:german-liquidation-reclass` (E242) — `ch11_german_extraction.ts` occurrence 0, story label: eq:german-liquidation-reclass
- `eq:german-liquidation-reclass` (E242) — `ch11_german_extraction.ts` occurrence 1, story label: eq:german-liquidation-reclass
- `eq:german-variable-swap` (E243) — `ch11_german_extraction.ts` occurrence 2, story label: eq:german-variable-swap
- `eq:german-aryan-status` (E244) — `ch11_german_extraction.ts` occurrence 3, story label: eq:german-aryan-status
- `eq:german-depletion-rate` (E247) — `ch11_german_extraction.ts` occurrence 4, story label: eq:german-depletion-rate
- `eq:german-net-extraction` (E252) — `ch11_german_extraction.ts` occurrence 5, story label: eq:german-net-extraction
- `eq:gp0-bootstrap` (E253) — `ch12_geopolitical_patch.ts` occurrence 0, story label: (no story label)
- `eq:gp0b-shadow-decomposition` (E254) — `ch12_geopolitical_patch.ts` occurrence 1, story label: (no story label)
- `eq:gp2-clearance-function` (E256) — `ch12_geopolitical_patch.ts` occurrence 2, story label: (no story label)
- `eq:gp8-retroactive-legitimization` (E264) — `ch12_geopolitical_patch.ts` occurrence 3, story label: (no story label)
- `eq:gp14-formal-backend-separation` (E274) — `ch12_geopolitical_patch.ts` occurrence 4, story label: (no story label)
- `eq:biodepletion-coeff` (E283) — `ch13_biological_extraction.ts` occurrence 0, story label: The biological depletion coefficient
- `eq:bio-compound` (E284) — `ch13_biological_extraction.ts` occurrence 1, story label: Biological compounding model
- `eq:biodepletion-coeff` (E283) — `ch13_biological_extraction.ts` occurrence 2, story label: Biological depletion coefficient
- `eq:latency-crime` (E287) — `ch13_biological_extraction.ts` occurrence 3, story label: Lead–crime latency
- `eq:property-tax-loop` (E285) — `ch13_biological_extraction.ts` occurrence 4, story label: Property-tax lead feedback loop
- `eq:tampon-integral` (E289) — `ch13_biological_extraction.ts` occurrence 5, story label: Lifetime menstrual exposure
- `eq:total-extraction` (E290) — `ch13_biological_extraction.ts` occurrence 6, story label: Total extraction rate
- `eq:pipeline-throughput` (E291) — `ch17_pipeline_architecture.ts` occurrence 0, story label: eq. pipeline-throughput
- `eq:cascade-transfer` (E292) — `ch17_pipeline_architecture.ts` occurrence 1, story label: eq. cascade-transfer
- `eq:commodity-exposure` (E294) — `ch17_pipeline_architecture.ts` occurrence 2, story label: eq. commodity-exposure
- `eq:denial-extraction` (E295) — `ch17_pipeline_architecture.ts` occurrence 3, story label: eq. denial-extraction
- `eq:unified-pipeline` (E296) — `ch17_pipeline_architecture.ts` occurrence 4, story label: eq. unified-pipeline
- `eq:13.tvs-abort` (E132) — `ch18_kinetic_guarantee.ts` occurrence 1, story label: eq. 13.tvs-abort
- `eq:14.2c-medium-gain` (E176) — `ch21_algorithmic_epoch.ts` occurrence 1, story label: eq. 14.2c
- `eq:15.qed-photon-energy` (E197) — `ch21_algorithmic_epoch.ts` occurrence 4, story label: eq. 15 — QED photon energy
- `eq:21.1-interference-spectral-form` (E203) — `ch22_spectral_carrier.ts` occurrence 0, story label: eq. 21.1
- `eq:21.2-phase-dispersion` (E204) — `ch22_spectral_carrier.ts` occurrence 1, story label: eq. 21.2
- `eq:21.3-share-definitions` (E205) — `ch22_spectral_carrier.ts` occurrence 2, story label: eq. 21.3
- `eq:21.4-fft-definition` (E206) — `ch22_spectral_carrier.ts` occurrence 3, story label: eq. 21.4
- `eq:21.7-parseval` (E209) — `ch22_spectral_carrier.ts` occurrence 4, story label: eq. 21.7
- `eq:15.1-temporal-firearm-proxy` (E210) — `ch24_single_issue_trap.ts` occurrence 0, story label: eq. 15.1
- `eq:15.2-geographic-interface-swap` (E211) — `ch24_single_issue_trap.ts` occurrence 1, story label: eq. 15.2
