# W2 — Story-mode equation join to the equation registry

Join key: LaTeX content, normalised on both sides (unescape doubled backslashes, drop `\label{...}` and `\tag{...}`, strip all whitespace). Exact match required; no fuzzy matching. Inputs: `website/src/content/chapters/*.ts`, `equation_explorer/data/equations.json` (239 registry equations), `Paper/empirical_validations/eq_*.md` (146 validation records, joined on the registry label).

## Counts

| | count |
|---|---:|
| equation visuals parsed | 103 |
| exact registry match (normalised LaTeX) | 67 |
| of those, with an empirical-validation record | 41 |
| tier 1 / tier 2 / tier 3 | 10 / 7 / 24 |
| matched, no record | 26 |
| unmatched | 36 |

## Comparison with the reference table in the task brief

| | reference (task brief) | this run |
|---|---:|---:|
| equation visuals parsed | 102 | 103 |
| exact registry match (normalised LaTeX) | 66 | 67 |
| of those, with an empirical-validation record | 40 | 41 |
| matched, no record | 26 | 26 |
| unmatched | 36 | 36 |
| tier 1 / tier 2 / tier 3 | 10 / 7 / 23 | 10 / 7 / 24 |

Every cell is exactly one higher in the full-match column chain (103 vs 102 parsed, 67 vs 66 matched, 41 vs 40 validated, 24 vs 23 tier 3), while `matched, no record` and `unmatched` agree exactly. The difference is fully accounted for by one visual: `ch19_the_contradiction.ts` occurrence 1 (story label `eq. 12.1`, registry `eq:12.1-reform-absorption-mechanism`, tier 3). It is the only equation visual in the corpus whose `latex` is a double-quoted TS string — it contains an unescaped apostrophe (`P'|`), so it cannot be single-quoted. A parser that recognises only single-quoted string literals misses this one visual and reproduces the reference table exactly. The script handles both quote styles, so it counts the visual. The reference numbers are consistent with a single-quote-only extraction; no input was adjusted to force either result.

Registry note: 11 normalised-LaTeX collisions exist inside the registry itself; the first entry in `equations.json` order was kept. Colliding ids: `E047` vs `E046`, `E113` vs `E036`, `E213` vs `E118`, `E215` vs `E112`, `E216` vs `E036`, `E217` vs `E114`, `E218` vs `E115`, `E220` vs `E046`, `E223` vs `E009`, `E224` vs `E010`, `E233` vs `E021`.

## Unmatched equations (36)

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

### `ch02_redefining_racism.ts` — occurrence 5 — eq. 1.11

Caption: Phase loading approaches zero under alignment and one under maximum dispersion.

```latex
\\Phi_j = \\sum_{k=1}^{K} \\phi_{k,j}, \\qquad\n\\Phi_{\\text{load}}(t) = \\operatorname{Dispersion}\\!\\left(\\{\\Phi_j\\}_{j=1}^{N}\\right) = 1 - \\left|\\frac{1}{N}\\sum_{j=1}^{N} e^{i\\Phi_j}\\right| \\in [0,1]
```

Assessment: registry holds `eq:1.11-phase-loading` (E042) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 39: story `...=1}^{K}\phi_{k,j},\qquad\>>>n\Phi_{\text{load}}(t)=\o...` vs registry `...=1}^{K}\phi_{k,j},\qquad\>>>Phi_{\text{load}}(t)=\ope...`.

### `ch03_version_1_0.ts` — occurrence 4 — eq. 2.8

Caption: The institutional feedback loop.

```latex
\\begin{aligned}\n&\\text{Exploitation} \\rightarrow \\text{Observed disparities} \\rightarrow \\text{Theological/Scientific ``explanation\'\'} \\\\\n&\\rightarrow \\text{Naturalization} \\rightarrow \\text{Expanded exploitation}\n\\end{aligned}
```

Assessment: registry holds `eq:2.8-church-science-feedback-loop` (E055) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 15: story `...\begin{aligned}>>>\n&\text{Exploitation}\ri...` vs registry `...\begin{aligned}>>>&\text{Exploitation}\righ...`.

### `ch08_gendered_axis.ts` — occurrence 1 — (no story label)

Caption: The dual-track statutory status described in the chapter.

```latex
\\text{Second Amendment Status}(\\text{arms},\\, x) =\n\\begin{cases}\n\\text{constitutionally protected} & x \\in I_{\\text{buffer}} \\\\\n\\text{felony prosecution} & x \\in O_{\\text{racialized}}\n\\end{cases}
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

### `ch14_tweedism.ts` — occurrence 3 — eq. 8.14

Caption: The observed political-attention signal: class carrier, identity-mode spectrum, and noise.

```latex
S_{\\text{total}}(t) = S_{\\text{class}}(t) + S_{\\text{id}}(t) + \\eta(t)\n = A_{\\text{class}}(t)\\sin(2\\pi f_{\\text{class}} t + \\varphi_{\\text{class}})\n + \\sum_{k=1}^{K} A_k(t)\\sin(2\\pi f_k t + \\varphi_k)\n + \\eta(t)
```

Assessment: registry holds `eq:8.14-net-solidarity-signal` (E089) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 64: story `...+S_{\text{id}}(t)+\eta(t)>>>\n=A_{\text{class}}(t)\si...` vs registry `...+S_{\text{id}}(t)+\eta(t)>>>=A_{\text{class}}(t)\sin(...`.

### `ch16_full_algorithm.ts` — occurrence 3 — eq. 10.13

Caption: Classification changes when kinetic capacity exceeds tolerance or compliance fails.

```latex
\\mathcal{R}(x_i) = \\begin{cases} I_{\\text{buffer}} & \\text{if } K(x_i) \\leq K_{\\text{tolerated}} \\text{ and } \\mathrm{comply}(x_i) = 1 \\\\ O_{\\text{final}} & \\text{if } K(x_i) > K_{\\text{tolerated}} \\text{ or } \\mathrm{comply}(x_i) = 0 \\end{cases}
```

Assessment: registry holds `eq:10.13-reclassification-operator` (E119) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 120: story `...d}\mathrm{comply}(x_i)=1\>>>\O_{\text{final}}&\text{i...` vs registry `...d}\mathrm{comply}(x_i)=1\>>>O_{\text{final}}&\text{if...`.

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

### `ch18_kinetic_guarantee.ts` — occurrence 1 — eq. 13.tvs-abort

Caption: The kinetic abort threshold.

```latex
P_{\\text{loss}} = I_{\\text{strike}}^2 \\cdot R_{\\text{kinetic}} > C_{\\text{max}}\n\\implies \\text{Strike Aborted}
```

Assessment: no manuscript equation number in the story label to cross-reference — either a web-only adaptation or a registry gap; the data does not say which.

### `ch19_the_contradiction.ts` — occurrence 2 — eq. 12.3

Caption: The judiciary’s discrimination-detection function.

```latex
D(P) = \\begin{cases}\n1 & \\text{if } P \\text{ explicitly invokes racial classification} \\\\\n0 & \\text{if } P \\text{ uses proxy variable } x \\text{ where } \\operatorname{Corr}(x, \\text{race}) \\to 1\n\\end{cases}
```

Assessment: registry holds `eq:12.3-judiciary-discrimination-detection` (E137) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 18: story `...D(P)=\begin{cases}>>>\n1&\text{if}P\text{expli...` vs registry `...D(P)=\begin{cases}>>>1&\text{if}P\text{explici...`.

### `ch20_global_containment.ts` — occurrence 1 — eq. 13.13

Caption: The manuscript maps the observed vote distribution onto the international hierarchy.

```latex
\\text{Vote}_{\\text{UN}}(x) = \\begin{cases} \\text{No} & \\text{if } x \\in E_{\\text{imperial}} \\\\[4pt] \\text{Abstain} & \\text{if } x \\in I_{\\text{buffer}}^{\\text{global}} \\\\[4pt] \\text{Yes} & \\text{if } x \\in O_{\\text{global}} \\end{cases}
```

Assessment: registry holds `eq:13.13-un-vote-distribution` (E165) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 83: story `...}x\inE_{\text{imperial}}\>>>\[4pt]\text{Abstain}&\tex...` vs registry `...}x\inE_{\text{imperial}}\>>>[4pt]\text{Abstain}&\text...`.

### `ch24_single_issue_trap.ts` — occurrence 0 — eq. 15.1

Caption: The temporal proxy creates different legal outcomes around the same object.

```latex
P_{\\text{temporal}}(x,o,t) =\n\\begin{cases}\n0 & \\text{if subject } x \\text{ possessed object } o \\text{ before cutoff } t_c,\\\\\n1 & \\text{if subject } x \\text{ seeks the same object } o \\text{ after cutoff } t_c.\n\\end{cases}
```

Assessment: registry holds `eq:15.1-temporal-firearm-proxy` (E210) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 28: story `...\text{temporal}}(x,o,t)=\>>>n\begin{cases}\n0&\text{i...` vs registry `...\text{temporal}}(x,o,t)=\>>>begin{cases}0&\text{ifsub...`.

### `ch24_single_issue_trap.ts` — occurrence 1 — eq. 15.2

Caption: The geographic interface distributes autonomy across separate legal components.

```latex
\\mathcal{R}(s)=\n\\bigl(r_{\\text{bio}}(s), r_{\\text{kin}}(s), r_{\\text{move}}(s), r_{\\text{speech}}(s), \\ldots\\bigr),\n\\qquad\n\\mathcal{R}(s) \\neq \\vec{1} \\;\\; \\forall s .
```

Assessment: registry holds `eq:15.2-geographic-interface-swap` (E211) under this equation number, but the normalised LaTeX differs — near-miss, manuscript/web drift or a normalisation gap. first difference at normalised char 16: story `...\mathcal{R}(s)=\>>>n\bigl(r_{\text{bio}}(s),...` vs registry `...\mathcal{R}(s)=\>>>bigl(r_{\text{bio}}(s),r_...`.

## Matched but unvalidated (26)

Registry labels of equations the book displays that have no empirical-validation record (listed in story order):

- `eq:19.5-unified-lorentz-force-registry` (E219) — `apxB_equation_registry.ts` occurrence 2, story label: eq. 19.5
- `eq:19.13-buffer-work-theorem-registry` (E227) — `apxB_equation_registry.ts` occurrence 3, story label: eq. 19.13
- `eq:ga.quaternion` (E230) — `apxE_geometric_algebra.ts` occurrence 0, story label: (no story label)
- `eq:0.ga-ndim` (E021) — `apxE_geometric_algebra.ts` occurrence 1, story label: (no story label)
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
- `eq:14.2c-medium-gain` (E176) — `ch21_algorithmic_epoch.ts` occurrence 1, story label: eq. 14.2c
- `eq:15.qed-photon-energy` (E197) — `ch21_algorithmic_epoch.ts` occurrence 4, story label: eq. 15 — QED photon energy
- `eq:21.1-interference-spectral-form` (E203) — `ch22_spectral_carrier.ts` occurrence 0, story label: eq. 21.1
- `eq:21.2-phase-dispersion` (E204) — `ch22_spectral_carrier.ts` occurrence 1, story label: eq. 21.2
- `eq:21.3-share-definitions` (E205) — `ch22_spectral_carrier.ts` occurrence 2, story label: eq. 21.3
- `eq:21.4-fft-definition` (E206) — `ch22_spectral_carrier.ts` occurrence 3, story label: eq. 21.4
- `eq:21.7-parseval` (E209) — `ch22_spectral_carrier.ts` occurrence 4, story label: eq. 21.7
