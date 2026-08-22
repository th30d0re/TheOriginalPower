# W2 — Story-mode equation join to the equation registry

Join key: LaTeX content, normalised on both sides (decode source-only newline/tab escapes and doubled backslashes, drop `\label{...}` and `\tag{...}`, strip all whitespace). Exact match required; no fuzzy matching. Inputs: `website/src/content/chapters/*.ts`, `equation_explorer/data/equations.json` (239 registry equations), `Paper/empirical_validations/eq_*.md` (146 validation records, joined on the registry label).

## Counts

| | count |
|---|---:|
| equation visuals parsed | 103 |
| exact registry match (normalised LaTeX) | 77 |
| of those, with an empirical-validation record | 46 |
| tier 1 / tier 2 / tier 3 | 10 / 7 / 29 |
| matched, no record | 31 |
| unresolved collision matches | 2 |
| unmatched | 26 |

## Comparison with the reference table in the task brief

| | reference (task brief) | this run |
|---|---:|---:|
| equation visuals parsed | 103 | 103 |
| exact registry match (normalised LaTeX) | 67 | 77 |
| of those, with an empirical-validation record | 41 | 46 |
| matched, no record | 26 | 31 |
| unmatched | 36 | 26 |
| tier 1 / tier 2 / tier 3 | 10 / 7 / 24 | 10 / 7 / 29 |

Decoding TypeScript string escapes before whitespace removal adds ten exact matches: six with validation records and four without them. One previously validated match is now withheld because its normalised form has multiple registry candidates. The net change is +10 exact matches, +5 unambiguous validated matches, +5 partial matches, and -10 unmatched.

Registry note: 11 normalised-LaTeX collisions exist inside the registry itself. A matching story entry records every candidate id, receives no registry or validation record, and is limited to partial enrichment. Colliding ids: `E047` vs `E046`, `E113` vs `E036`, `E213` vs `E118`, `E215` vs `E112`, `E216` vs `E036`, `E217` vs `E114`, `E218` vs `E115`, `E220` vs `E046`, `E223` vs `E009`, `E224` vs `E010`, `E233` vs `E021`.

## Unresolved collision matches (2)

- `apxE_geometric_algebra.ts` occurrence 1: `E021`, `E233`. Registry-derived tier, falsification, and sources are withheld.
- `ch25_conclusion.ts` occurrence 2: `E118`, `E213`. Registry-derived tier, falsification, and sources are withheld.

## Unmatched equations (26)

Each entry: chapter file, occurrence index, story label, and the verbatim LaTeX as it appears in the module source. The assessment line is deterministic: when the story label names a manuscript equation number (`eq. N.M`) and the registry holds an entry under the same number, the two normalised LaTeX strings are compared and the first divergence is shown — these are the near-miss candidates. When no registry entry carries the number, the entry is either a web-only adaptation or a registry gap; the data alone does not say which, and the report says so rather than guessing.

### `apxH_extraction_chart.ts` — occurrence 0 — eq. XC.3

Caption: Absorbed power increases as the magnitude of the reflected wave decreases.

```latex
P_{\\text{abs}} \\;=\\; |a|^2\\bigl(1 - |\\Gamma|^2\\bigr)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `apxH_extraction_chart.ts` — occurrence 1 — eq. XC.12

Caption: Crossing the unit-circle boundary requires negative resistance and source behavior.

```latex
|\\Gamma| > 1 \\quad \\Longleftrightarrow \\quad \\operatorname{Re}(z) < 0
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `apxH_extraction_chart.ts` — occurrence 2 — eq. XC.13

Caption: The finite matching budget for a load reducible to a parallel RC combination.

```latex
\\int_{0}^{\\infty} \\ln\\frac{1}{|\\Gamma(\\omega)|}\\, d\\omega \\;\\leq\\; \\frac{\\pi}{RC}
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch11_german_extraction.ts` — occurrence 0 — eq:german-liquidation-reclass

```latex
O_{\\text{racialized}}^{\\text{Herero}} \\; \\xrightarrow{\\;P_{\\text{kinetic}}\\;} \\; O_{\\text{liquidated}} \\quad \\text{where} \\quad \\mathcal{V}(O_{\\text{liquidated}}) = 0
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch11_german_extraction.ts` — occurrence 1 — eq:german-liquidation-reclass

Caption: The operational reclassification of the Herero population from extractable labor to a liquidation target.

```latex
O_{\\text{racialized}}^{\\text{Herero}} \\; \\xrightarrow{\\;P_{\\text{kinetic}}\\;} \\; O_{\\text{liquidated}} \\quad \\text{where} \\quad \\mathcal{V}(O_{\\text{liquidated}}) = 0
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch11_german_extraction.ts` — occurrence 2 — eq:german-variable-swap

Caption: The Variable Swap replaces a material psychological wage with a racial-status wage at lower material cost.

```latex
\\psi_{\\text{Weimar}} = \\psi_m(t) + \\epsilon \\;\\;\\rightarrow\\;\\; \\psi_{\\text{Nazi}} = \\psi_s^{\\text{racial}}(t) + \\delta, \\quad \\text{where} \\quad \\delta \\ll \\psi_m^{\\text{pre-crash}}
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch11_german_extraction.ts` — occurrence 3 — eq:german-aryan-status

Caption: The genealogical status gradient encoded by the legal partition.

```latex
\\psi_s^{\\text{Aryan}}(i) = \\begin{cases}\n\\psi_{\\text{base}} & \\text{if } G(i) \\in \\text{Aryan} \\\\\n\\psi_{\\text{base}} - \\lambda & \\text{if } G(i) \\in \\text{Mischling}_1 \\\\\n0 & \\text{if } G(i) \\in \\text{Jewish}\n\\end{cases}
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch11_german_extraction.ts` — occurrence 4 — eq:german-depletion-rate

Caption: The target population changes through immediate liquidation and temporary preservation for forced labor.

```latex
\\frac{dO_{\\text{target}}}{dt} = -\\mu(t) \\cdot O_{\\text{target}}(t) + \\nu(t) \\cdot L_{\\text{forced}}(t)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch11_german_extraction.ts` — occurrence 5 — eq:german-net-extraction

Caption: Immediate asset seizure is offset by the discounted future value of lost skilled labor.

```latex
\\Delta \\mathcal{E} = \\mathcal{E}_{\\text{liquidated}} - \\mathcal{E}_{\\text{lost}} \\quad \\text{where} \\quad \\mathcal{E}_{\\text{lost}} = \\int_{t_0}^{t_1} L_{\\text{skilled}}(t) \\cdot w_{\\text{eff}}(t) \\, dt
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch12_geopolitical_patch.ts` — occurrence 0 — (no story label)

Caption: The manuscript adds shadow capital to the standard state-formation model.

```latex
S(t) = R_{\\text{tax}}(t) + A_{\\text{foreign}}(t) + P_{\\text{domestic}}(t) + C_{\\text{shadow}}(t)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch12_geopolitical_patch.ts` — occurrence 1 — (no story label)

Caption: The three components of the manuscript’s shadow-capital term.

```latex
C_{\\text{shadow}}(t) = C_{\\text{kinetic}}(t) + C_{\\text{financial}}(t) + C_{\\text{logistical}}(t)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch12_geopolitical_patch.ts` — occurrence 2 — (no story label)

Caption: The manuscript’s three-channel clearance function.

```latex
\\mathcal{C}(t) = \\alpha_{\\text{kinetic}}(t) + \\alpha_{\\text{terror}}(t) + \\alpha_{\\text{admin}}(t)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch12_geopolitical_patch.ts` — occurrence 3 — (no story label)

Caption: The pardon activates after the manuscript’s legitimization delay.

```latex
\\Lambda(t, t_0, \\Delta t_{\\text{pardon}}) = \\Theta\\bigl(t - (t_0 + \\Delta t_{\\text{pardon}})\\bigr)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch12_geopolitical_patch.ts` — occurrence 4 — (no story label)

Caption: The manuscript’s interface–backend gap.

```latex
\\mathcal{L}_{\\text{display}}(t) \\neq \\mathcal{L}_{\\text{backend}}(t)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch13_biological_extraction.ts` — occurrence 0 — The biological depletion coefficient

```latex
\\beta_{\\text{bio}}(t) = E(t) \\cdot T(t) \\cdot A(t),
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch13_biological_extraction.ts` — occurrence 1 — Biological compounding model

Caption: Environmental toxicity enters the recursive operator as a persistent degradation term.

```latex
O_{\\text{bio}}(t) = O_{\\text{bio}}(t-1) \\cdot \\bigl(1 - \\alpha \\cdot P(t) - \\beta_{\\text{bio}}(t)\\bigr).
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch13_biological_extraction.ts` — occurrence 2 — Biological depletion coefficient

Caption: Concentration, duration, and absorption combine multiplicatively.

```latex
\\beta_{\\text{bio}}(t) = E(t) \\cdot T(t) \\cdot A(t),
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch13_biological_extraction.ts` — occurrence 3 — Lead–crime latency

Caption: The developmental lag is 21–23 years.

```latex
\\mathrm{Crime}(t) = \\int \\mathrm{Pb}(t - \\tau_{\\text{age}}) \\cdot D(\\text{population\\_density}) \\cdot S(\\text{socioeconomic\\_stress}) \\, d\\tau,
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch13_biological_extraction.ts` — occurrence 4 — Property-tax lead feedback loop

Caption: Redlining supplies the initial condition; fiscal allocation and infrastructure age propagate it.

```latex
L_{\\text{loop}}(t) = R_{\\text{redline}} \\cdot V_{\\text{property}}(t) \\cdot F_{\\text{funding}} \\cdot I_{\\text{infrastructure}}(t),
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch13_biological_extraction.ts` — occurrence 5 — Lifetime menstrual exposure

Caption: Metal concentration, absorption efficiency, and reproductive lifespan determine cumulative load.

```latex
M_{\\text{lifetime}} = \\int_{0}^{T} \\sum_{\\text{metal}} c_{\\text{metal}}(t) \\cdot a_{\\text{absorption}} \\, dt,
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch13_biological_extraction.ts` — occurrence 6 — Total extraction rate

Caption: Biological depletion joins labor and capital in the extraction accounting.

```latex
\\mathcal{E}_{\\text{total}}(t) = \\mathcal{E}_{\\text{labor}}(t) + \\mathcal{E}_{\\text{capital}}(t) + \\mathcal{E}_{\\text{biological}}(t),
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch17_pipeline_architecture.ts` — occurrence 0 — eq. pipeline-throughput

Caption: The multiplicative throughput of the school-to-prison pipeline.

```latex
\\Phi_{\\text{s2p}}(t) = D_{\\text{disparate}} \\cdot P_{\\text{police}} \\cdot Z_{\\text{zero-tol}} \\cdot T_{\\text{tracking}} \\cdot L_{\\text{lead}}(t)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch17_pipeline_architecture.ts` — occurrence 1 — eq. cascade-transfer

Caption: The cascade transfer function preserves and amplifies the routed signal.

```latex
H_{\\text{cascade}}(s) = H_{\\text{redline}}(s) \\cdot H_{\\text{funding}}(s) \\cdot H_{\\text{infrastructure}}(s) \\cdot H_{\\text{lead}}(s) \\cdot H_{\\text{discipline}}(s) \\cdot H_{\\text{incarceration}}(s)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch17_pipeline_architecture.ts` — occurrence 2 — eq. commodity-exposure

Caption: Lifetime exposure accumulated across products and routes.

```latex
E_{\\text{commodity}} = \\sum_{\\text{product}} \\left( \\int_{0}^{\\text{lifetime}} c_{\\text{toxicant}} \\cdot a_{\\text{absorption}} \\cdot f_{\\text{frequency}} \\, dt \\right)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch17_pipeline_architecture.ts` — occurrence 3 — eq. denial-extraction

Caption: Denied volume converts retained treatment cost into transferred mortality risk.

```latex
\\mathcal{E}_{\\text{denial}} = N_{\\text{claims}} \\cdot R_{\\text{denial}} \\cdot C_{\\text{treatment\\_cost}} \\cdot \\Delta_{\\text{mortality}}
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch17_pipeline_architecture.ts` — occurrence 4 — eq. unified-pipeline

Caption: Total extraction across the four active conduits.

```latex
\\mathcal{E}_{\\text{pipeline}}(t) = \\mathcal{E}_{\\text{s2p}}(t) + \\mathcal{E}_{\\text{food-health}}(t) + \\mathcal{E}_{\\text{commodity}}(t) + \\mathcal{E}_{\\text{healthcare}}(t)
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

## Matched but unvalidated (29)

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
- `eq:0.1-unified-lorentz-force` (E001) — `ch00_system_initialization.ts` occurrence 0, story label: The Unified Lorentz Force
- `eq:0.1-unified-lorentz-force` (E001) — `ch00_system_initialization.ts` occurrence 1, story label: eq. 0.1
- `eq:0.1a-self-exciting-generator` (E002) — `ch00_system_initialization.ts` occurrence 2, story label: eq. 0.1a
- `eq:0.2-tier-voltage-drop` (E003) — `ch00_system_initialization.ts` occurrence 3, story label: eq. 0.2
- `eq:lag-augmented` (E023) — `ch01_dynamical_systems.ts` occurrence 0, story label: The augmented Lagrangian
- `eq:lag-euler-lagrange` (E022) — `ch01_dynamical_systems.ts` occurrence 1, story label: eq. 1.1
- `eq:lag-augmented` (E023) — `ch01_dynamical_systems.ts` occurrence 2, story label: eq. 1.2
- `eq:1.7a-rlc-governing` (E034) — `ch02_redefining_racism.ts` occurrence 4, story label: eq. 1.7a
- `eq:awb_dualtrack` (E060) — `ch08_gendered_axis.ts` occurrence 1, story label: (no story label)
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
