# Empirical provenance audit

Audit date: 2026-08-10. Method: static, read-only trace. No producer was run because every located producer writes into `Paper/data/` or `Paper/figures/`. `make data-refresh` was not run. No producer was assigned from filename similarity or obsolete equation numbering.

## Summary

Scope audited: all 72 indexed T1/T2 equations (33 T1, 39 T2), 90 data/model-output figures, and all 113 files under `Paper/data/` (111 empirical artifacts plus `.gitkeep` and `README.md`). The four defects named in the brief remain in the tables as confirmed baselines.

| scope | OK | MISLABELLED | UNTRACEABLE | DOES-NOT-REPRODUCE | total |
|---|---:|---:|---:|---:|---:|
| T1/T2 equations | 0 | 45 | 27 | 0 | 72 |
| data/model-output figures | 33 | 18 | 36 | 3 | 90 |
| empirical data files | 10 | 37 | 62 | 2 | 111 |
| **Total empirical artifacts** | **43** | **100** | **125** | **5** | **273** |

`tier_supported` applies the index legend literally: T1 = peer-reviewed quantitative; T2 = public dataset; T3 = ordinal/structural. `UNKNOWN` records insufficient committed evidence. A tier mismatch is `MISLABELLED`; a trace break with an otherwise supportable label is `UNTRACEABLE`.

## Tier 1 and Tier 2 equations

| artifact | producer | input | reproduces | nature | tier_claimed | tier_supported | verdict |
|---|---|---|---|---|---|---|---|
| `eq:1.7-interface-optimizer` | UNKNOWN | Dudziak (2000) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:10.12-o-final-construction` | UNKNOWN | BJS public data; no construction producer | NOT RUN — producer unknown | modelled | T1 | T2 | MISLABELLED |
| `eq:10.16-financial-repression-condition` | UNKNOWN | FRED GS10 plus inflation series; no current-label producer | NOT RUN — producer unknown | measured | T1 | T2 | MISLABELLED |
| `eq:10.17-temporal-extraction-rate` | UNKNOWN | FRED debt/GDP and rate/growth series; no current-label producer | NOT RUN — producer unknown | modelled | T1 | T2 | MISLABELLED |
| `eq:10.18-psi-degradation-function` | UNKNOWN | FRED compensation plus productivity/assets; no current-label producer | NOT RUN — producer unknown | modelled | T1 | T2 | MISLABELLED |
| `eq:10.19-saeculum-phase-map` | UNKNOWN | Strauss & Howe (1997) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:10.2-buffer-class-shrinkage` | UNKNOWN | Pew report; no dataset or derivation committed | NOT RUN — producer unknown | measured | T2 | T3 | MISLABELLED |
| `eq:11.1-extraction-precondition` | UNKNOWN | primary legislation texts | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:11.2-disarmament-agenda-path` | UNKNOWN | 11 legislation/ruling texts | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:11.3-restriction-precedent-accumulation` | UNKNOWN | 11 legislation/ruling texts | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:11.4-restriction-scope-expansion` | UNKNOWN | legislation and enforcement records | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:12.2-concession-theorem` | UNKNOWN | Piven & Cloward (1977) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:12.5-haitian-theorem-nonkinetic` | UNKNOWN | James (1938); no exhaustive event producer | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:12.6-haitian-theorem-kinetic` | UNKNOWN | James (1938); no exhaustive event producer | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:12.9-multiplicative-intersection-compounding` | UNKNOWN | AAUW pay-gap report; no multiplicative estimator | NOT RUN — producer unknown | modelled | T2 | T3 | MISLABELLED |
| `eq:13.10-asymmetric-leverage-ratio` | UNKNOWN | Firmin (1885) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:13.14-imperial-core-collapse` | UNKNOWN | World Bank/SIPRI/IMF public series; no current-label producer | NOT RUN — producer unknown | modelled | T1 | T2 | MISLABELLED |
| `eq:13.15-interface-swap-trigger` | UNKNOWN | Federal Reserve H.4.1 public data; no current-label producer | NOT RUN — producer unknown | measured | T1 | T2 | MISLABELLED |
| `eq:13.16-polymorphic-reboot-operator` | UNKNOWN | Gowa (1983) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:14.1-algo-prior-inheritance` | UNKNOWN | Angwin et al. (2016) report | NOT RUN — producer unknown | exploratory | T2 | T3 | MISLABELLED |
| `eq:14.20-defection-cascade` | UNKNOWN | James (1938), Polish Legion episode | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:14.21-empathy-permeability` | UNKNOWN | James (1938) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:3.1-bacon-solidarity-condition` | UNKNOWN | Morgan (1975), no committed derivation | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:3.5-kinetic-necessary-condition` | UNKNOWN | Morgan (1975), no committed derivation | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:5.1-compliance-differential` | UNKNOWN | Baptist (2014) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:6.1-lethal-autonomy-gradient` | UNKNOWN | 18 U.S.C. §926B text plus MPV reference | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:6.10-capacity-chain-1934` | `Paper/scripts/eq_hist3_redlining_capacity.ipynb:10` | `Paper/data/eq_hist3_redlining_capacity.csv` | NOT RUN — writes data/figures | modelled | T1 | T2 | MISLABELLED |
| `eq:6.11-capacity-chain-1971` | `Paper/scripts/eq_hist4_war_on_drugs_capacity.ipynb:10` | `Paper/data/eq_hist4_war_on_drugs_capacity.csv` | NOT RUN — writes data/figures | modelled | T1 | T2 | MISLABELLED |
| `eq:6.12-capacity-compounding-full` | UNKNOWN | ACLU report plus author-set capacity factors | NOT RUN — producer unknown | modelled | T1 | T3 | MISLABELLED |
| `eq:6.5-compounding-temporal-model` | UNKNOWN | Hamilton & Darity (2017) | NOT RUN — producer unknown | modelled | T2 | T3 | MISLABELLED |
| `eq:6.6-asymmetric-enforcement-multiplier` | `Paper/scripts/eq31_asymmetric_enforcement.ipynb:10` | `Paper/data/eq31_asymmetric_enforcement.csv` | NOT RUN — writes data/figures | measured | T1 | T2 | MISLABELLED |
| `eq:6.8-capacity-chain-1619` | UNKNOWN | Darity & Mullen (2020) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:6.9-capacity-chain-1865` | UNKNOWN | Blackmon (2008) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:8.12-class-alignment-base-waves` | UNKNOWN | Google Trends; `Paper/data/google_trends_class_identity.csv` is a possible consumer input only | NOT RUN — producer unknown | exploratory | T1 | T2 | MISLABELLED |
| `eq:8.14-net-solidarity-signal` | UNKNOWN | Google Trends; no derivation found | NOT RUN — producer unknown | modelled | T1 | T2 | MISLABELLED |
| `eq:8.15-solidarity-collapse-condition` | UNKNOWN | Google Trends; no calibrated threshold producer found | NOT RUN — producer unknown | modelled | T1 | T3 | MISLABELLED |
| `eq:8.16-interference-control-objective` | UNKNOWN | Google Trends; no objective calibration producer found | NOT RUN — producer unknown | modelled | T1 | T3 | MISLABELLED |
| `eq:9.10-highway-lead-spatial-concentration` | UNKNOWN | spatial layer includes modeled/synthetic EJScreen, GVA, CDC, and PPI proxies | NOT RUN — producer unknown | modelled | T1 | T3 | MISLABELLED |
| `eq:9.2-epistemic-suppression-variable` | UNKNOWN | Kitman (2000) | NOT RUN — producer unknown | ordinal | T2 | T3 | MISLABELLED |
| `eq:9.3-multi-vector-lead-exposure` | UNKNOWN | EPA public monitoring data; no committed extraction | NOT RUN — producer unknown | measured | T1 | T2 | MISLABELLED |
| `eq:9.4-redlining-containment-field` | UNKNOWN | Mapping Inequality public data; no equation producer | NOT RUN — producer unknown | modelled | T1 | T2 | MISLABELLED |
| `eq:9.5-school-funding-property-value` | UNKNOWN | NCES public survey; curated summary only | NOT RUN — producer unknown | measured | T1 | T2 | MISLABELLED |
| `eq:9.7-school-lead-exposure-inverse` | UNKNOWN | EPA 3Ts guidance, not a quantitative calibration | NOT RUN — producer unknown | ordinal | T1 | T3 | MISLABELLED |
| `eq:9.8-community-capacity-lead-reduction` | UNKNOWN | Aizer & Currie (2019) | NOT RUN — producer unknown | measured | T2 | T1 | MISLABELLED |
| `eq:9.9-property-value-capacity-feedback` | UNKNOWN | Mapping Inequality + ACS public data; no derivation | NOT RUN — producer unknown | modelled | T1 | T2 | MISLABELLED |
| `eq:1.10-effective-coherence` | UNKNOWN | ANES; no coherence/threshold producer | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:1.5-kernel-optimization` | UNKNOWN | Piketty citation; no named derivation | NOT RUN — producer unknown | modelled | T1 | T1 | UNTRACEABLE |
| `eq:1.8-suppression-envelope` | UNKNOWN | BLS union series; no envelope producer | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:10.14-kinetic-power-distribution` | UNKNOWN | Pew 2017 gun-ownership survey | NOT RUN — producer unknown | measured | T2 | T2 | UNTRACEABLE |
| `eq:10.20-dalio-extraction-bound` | UNKNOWN | Maddison Project plus author-composed factor series | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:10.5-kernel-objective-canonical` | `Paper/scripts/eq56_kernel_objective.ipynb:9` | `Paper/data/eq56_kernel_objective.csv` (no producer header) | NOT RUN — writes figure | modelled | T1 | T1 | UNTRACEABLE |
| `eq:10.7-suppression-envelope-canonical` | UNKNOWN | index source is `(pending)` | NOT RUN — producer/input unknown | modelled | T2 | UNKNOWN | UNTRACEABLE |
| `eq:12.4a-judicial-double-agent` | UNKNOWN | local SCOTUS markdown corpus | NOT RUN — producer unknown | exploratory | T2 | T2 | UNTRACEABLE |
| `eq:13.1-global-compounding-capacity` | UNKNOWN | World Bank WDI; no fitted trajectory producer | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:13.17-elite-asset-continuity-invariant` | UNKNOWN | WID.world/Piketty series; no current-label producer | NOT RUN — producer unknown | measured | T1 | T1 | UNTRACEABLE |
| `eq:14.10-sustained-siege-cost` | UNKNOWN | index source is `(pending)` | NOT RUN — producer/input unknown | modelled | T2 | UNKNOWN | UNTRACEABLE |
| `eq:14.12-inclusion-predicate` | UNKNOWN | BLS contingent-worker survey | NOT RUN — producer unknown | measured | T2 | T2 | UNTRACEABLE |
| `eq:14.15-noise-spectrum-index` | UNKNOWN | ACLED 2011–2020; no spectrum producer | NOT RUN — producer unknown | exploratory | T2 | T2 | UNTRACEABLE |
| `eq:14.17-botnet-load-theorem` | UNKNOWN | ACLED 2020; no load/Γ estimator | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:14.19-zugzwang-payoff-function` | UNKNOWN | index source is `(pending)` | NOT RUN — producer/input unknown | modelled | T2 | UNKNOWN | UNTRACEABLE |
| `eq:14.2-realtime-proximity-estimate` | UNKNOWN | unspecified Twitter/X academic dataset | NOT RUN — producer/input unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:14.6-decoy-transfer-coefficient` | UNKNOWN | index source is `(pending)` | NOT RUN — producer/input unknown | modelled | T2 | UNKNOWN | UNTRACEABLE |
| `eq:14.7-ddos-bandwidth-ceiling` | UNKNOWN | ACLED US protests; no ceiling estimator | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:14.8-armed-swarm-bandwidth` | UNKNOWN | index source is `(pending)` | NOT RUN — producer/input unknown | modelled | T2 | UNKNOWN | UNTRACEABLE |
| `eq:14.9-kinetic-capital-asymmetry` | UNKNOWN | Pew 2017 gun-ownership survey | NOT RUN — producer unknown | measured | T2 | T2 | UNTRACEABLE |
| `eq:17.2-o-terminal-expansion` | UNKNOWN | Census 2020 projections; no set-construction producer | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:8.13-subgroup-compound-phase` | UNKNOWN | Google Trends; no subgroup-phase producer | NOT RUN — producer unknown | exploratory | T2 | T2 | UNTRACEABLE |
| `eq:8.17-circular-dispersion-operator` | UNKNOWN | ANES; no phase-value construction | NOT RUN — producer unknown | exploratory | T2 | T2 | UNTRACEABLE |
| `eq:8.18-tweedism-agenda-path` | UNKNOWN | Gilens & Page (2014) | NOT RUN — producer unknown | measured | T1 | T1 | UNTRACEABLE |
| `eq:8.4-compounding-chain-formal` | UNKNOWN | Federal Reserve SCF; no derivation | NOT RUN — producer unknown | modelled | T2 | T2 | UNTRACEABLE |
| `eq:9.1-lead-crime-compounding` | UNKNOWN | Reyes (2007); current-label derivation not found | NOT RUN — producer unknown | measured | T1 | T1 | UNTRACEABLE |
| `eq:9.6-infrastructure-quality-funding` | UNKNOWN | NCES facility survey; no estimator | NOT RUN — producer unknown | measured | T2 | T2 | UNTRACEABLE |

## Figures that plot data or model output

| artifact | producer | input | reproduces | nature | tier_claimed | tier_supported | verdict |
|---|---|---|---|---|---|---|---|
| `fig:scotus_class_identity_ratio` | `Paper/scripts/scotus_corpus_analysis.ipynb:29-35` | `Paper/data/scotus_keyword_counts.csv` | NO — upstream raw-to-processed chain is confirmed non-reproducing | exploratory | no explicit figure tier | T3 | DOES-NOT-REPRODUCE (upstream confirmed baseline) |
| `fig:scotus_lomb_scargle` | `Paper/scripts/scotus_corpus_analysis.ipynb:29-35` | `Paper/data/scotus_keyword_counts.csv` | NO — upstream raw-to-processed chain is confirmed non-reproducing | exploratory | no explicit figure tier | T3 | DOES-NOT-REPRODUCE (upstream confirmed baseline) |
| `fig:scotus_majority_dissent` | `Paper/scripts/scotus_corpus_analysis.ipynb:29-35` | `Paper/data/scotus_keyword_counts.csv` | NO — upstream raw-to-processed chain is confirmed non-reproducing | exploratory | caption says pilot, n=2 | T3 | DOES-NOT-REPRODUCE (upstream confirmed baseline) |
| `fig:cs9_overlay_baltimore_md` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | `Paper/data/spatial/*baltimore_md*`; modeled/synthetic layers | NOT RUN — writes panels/data | modelled | empirical overlay; linked T1 | T3 | MISLABELLED |
| `fig:cs9_overlay_detroit_mi` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | `Paper/data/spatial/*detroit_mi*`; modeled/synthetic layers | NOT RUN — writes panels/data | modelled | empirical overlay; linked T1 | T3 | MISLABELLED |
| `fig:cs9_overlay_memphis_tn` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | `Paper/data/spatial/*memphis_tn*`; GVA/EJScreen/PPI/CDC layers are modeled or synthetic | NOT RUN — writes panels/data | modelled | GVA-derived empirical overlay; linked T1 | T3 | MISLABELLED |
| `fig:cs9_overlay_milwaukee_wi` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | `Paper/data/spatial/*milwaukee_wi*`; modeled/synthetic layers | NOT RUN — writes panels/data | modelled | empirical overlay; linked T1 | T3 | MISLABELLED |
| `fig:cs9_overlay_nashville_tn` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | `Paper/data/spatial/*nashville_tn*`; modeled/synthetic layers | NOT RUN — writes panels/data | modelled | empirical overlay; linked T1 | T3 | MISLABELLED |
| `fig:cs9_overlay_washington_dc` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | `Paper/data/spatial/*washington_dc*`; modeled/synthetic layers; no HOLC file committed | NOT RUN — writes panels/data | modelled | empirical overlay; linked T1 | T3 | MISLABELLED |
| `fig:cs9_pooled_stats` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | six modeled/synthetic city panels; notebook contains archived errors at lines 638-648, 998 | NOT RUN — writes panels/data | modelled | pooled effect-size forest plot; linked T1 | T3 | MISLABELLED |
| `fig:eq_funding_propval_feedback` | `Paper/scripts/eq_funding_propval_feedback.ipynb:603-613` | `Paper/data/eq_funding_propval_feedback.csv` curated summaries | NOT RUN — writes figures | modelled | linked T1/T2 equations | T2/T3 | MISLABELLED |
| `fig:eq33_cannabis` | `Paper/scripts/eq33_cannabis_redlining.ipynb` (filename/output linkage; no current label) | `Paper/data/eq33_cannabis_redlining.csv` author-set capacity factors | NOT RUN — writes data/figures | modelled | linked T1 `eq:6.12` | T3 | MISLABELLED |
| `fig:eq47_51_lead_crime` | `Paper/scripts/eq47_51_lead_crime.ipynb` (figure path explicit in manuscript only; current-label link absent) | three curated CSV summaries | NOT RUN — writes figures | modelled | linked T1/T2 equations | T1/T2/T3 mixed | MISLABELLED |
| `fig:eq63_mass_incarceration` | `Paper/scripts/eq63_mass_incarceration.ipynb` (filename linkage only) | `Paper/data/eq63_mass_incarceration.csv` | NOT RUN — writes data/figures | measured | linked T1 `eq:10.12` | T2 | MISLABELLED |
| `fig:eq65_68_2a_case_law` | `Paper/scripts/eq65_68_2a_case_law.ipynb:843` | manually curated net-restriction scoring | NOT RUN — writes figures | ordinal | linked T1 equations | T3 | MISLABELLED |
| `fig:eq65_68_fig_a` | `Paper/scripts/eq65_68_2a_case_law.ipynb:578` | manually curated statute/ruling ledger | NOT RUN — writes figures | ordinal | linked T1 equations | T3 | MISLABELLED |
| `fig:eq73_74_haitian_theorem` | `Paper/scripts/eq73_74_haitian_theorem.ipynb` (filename linkage only) | curated liberation cases and estimated elite shares | NOT RUN — writes data/figures | modelled | linked T1 equations | T3 | MISLABELLED |
| `fig:eq91_imperial_core_collapse` | `Paper/scripts/eq91_imperial_core_collapse.ipynb` (filename linkage only) | author-composed capacity indices from WDI/SIPRI/IMF | NOT RUN — writes data/figures | modelled | linked T1 equation | T2/T3 | MISLABELLED |
| `fig:extraction_chart` | UNKNOWN | 57-case SCOTUS Lomb–Scargle peaks embedded in `Paper/apx_extraction_chart.tex:376-462` | NOT RUN — producer unknown | exploratory | markers labelled “measured” | T3 | MISLABELLED (confirmed baseline) |
| `fig:impulse_responses` | `Paper/scripts/spectral_laplace.ipynb:32-36` | `historical_shocks.json`; heterogeneous min-max-scaled backlash proxies | NOT RUN — writes figures | exploratory | “observed vs. fitted” | T3 | MISLABELLED |
| `fig:per_axis_spectral` | `Paper/scripts/eq_fourier_per_axis.py:3-47` | `Paper/data/congressional_record_word_freq.csv`; logistic/Gaussian event mixture | NOT RUN — writes data/figures | modelled | presented as decomposition | T3 | MISLABELLED (confirmed baseline) |
| `fig:axis_activation` | UNKNOWN | hand-coded activation years at `Paper/The_Original_Power.tex:6791-6845` | NOT RUN — no script/notebook | ordinal | no explicit tier | T3 | UNTRACEABLE |
| `fig:backlash_oscillator` | UNKNOWN | schematic response generated in TeX at `Paper/The_Original_Power.tex:1934-1996` | NOT RUN — no script/notebook | modelled | no explicit tier | T3 | UNTRACEABLE |
| `fig:bf_gf_divergence_rr` | UNKNOWN | embedded relationship-type IPH series at `Paper/The_Original_Power.tex:8519-8570` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:bf_iph_lead_rr` | UNKNOWN | embedded IPH/lead series at `Paper/The_Original_Power.tex:8455-8510` | NOT RUN — producer unknown | exploratory | no explicit tier | T3 | UNTRACEABLE |
| `fig:blood_lead_children` | UNKNOWN | embedded NHANES/EPA points at `Paper/The_Original_Power.tex:8053-8088` | NOT RUN — producer unknown | measured | T1-linked | T2 | UNTRACEABLE |
| `fig:cannibalization_phase` | UNKNOWN | model curve generated in TeX at `Paper/The_Original_Power.tex:9588-9637` | NOT RUN — no script/notebook | modelled | no explicit tier | T3 | UNTRACEABLE |
| `fig:carceral_expansion_comparison` | UNKNOWN | embedded normalized carceral scale at `Paper/The_Original_Power.tex:10628-10679` | NOT RUN — producer unknown | modelled | no explicit tier | T3 | UNTRACEABLE |
| `fig:chicago-decomposition` | UNKNOWN | embedded Chicago 11,018-case summary at `Paper/The_Original_Power.tex:10548-10579` | NOT RUN — producer unknown | measured | no explicit tier | T1 | UNTRACEABLE |
| `fig:crime_decline` | UNKNOWN | embedded contribution estimates at `Paper/The_Original_Power.tex:8953-8986` | NOT RUN — producer unknown | exploratory | no explicit tier | T3 | UNTRACEABLE |
| `fig:deindustrialization` | UNKNOWN | embedded city manufacturing/homicide/lead values at `Paper/The_Original_Power.tex:8752-8787` | NOT RUN — producer unknown | exploratory | no explicit tier | T3 | UNTRACEABLE |
| `fig:deltamax_invariant` | UNKNOWN | embedded approximate wealth-share points at `Paper/The_Original_Power.tex:11305-11369` | NOT RUN — producer unknown | measured | T1-linked | T1 | UNTRACEABLE |
| `fig:drug_spending` | UNKNOWN | embedded ONDCP budget shares at `Paper/The_Original_Power.tex:8903-8936` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:dual_era_homicide` | UNKNOWN | embedded normalized era trajectories at `Paper/The_Original_Power.tex:10587-10623` | NOT RUN — producer unknown | exploratory | no explicit tier | T3 | UNTRACEABLE |
| `fig:elite_wealth_accumulation` | UNKNOWN | approximate Piketty–Saez–Zucman points embedded at `Paper/The_Original_Power.tex:2298-2402` | NOT RUN — producer unknown | measured | T1-linked | T1 | UNTRACEABLE |
| `fig:enforcement-asymmetry` | UNKNOWN | embedded enforcement/economy values at `Paper/The_Original_Power.tex:10689-10727` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:fractal-oscilloscope` | UNKNOWN | schematic signals generated in TeX at `Paper/The_Original_Power.tex:6621-6701` | NOT RUN — no script/notebook | modelled | no explicit tier | T3 | UNTRACEABLE |
| `fig:goldilocks_zone` | UNKNOWN | model curve generated in TeX at `Paper/The_Original_Power.tex:6033-6093` | NOT RUN — no script/notebook | modelled | no explicit tier | T3 | UNTRACEABLE |
| `fig:historical_compounding` | UNKNOWN | hand-coded capacity-retention bars at `Paper/The_Original_Power.tex:5096-5148` | NOT RUN — no script/notebook | modelled | T1-linked | T3 | UNTRACEABLE |
| `fig:highway_displacement` | UNKNOWN | embedded city displacement estimates at `Paper/The_Original_Power.tex:8319-8352` | NOT RUN — producer unknown | measured | T1-linked | T2 | UNTRACEABLE |
| `fig:homicide_surge` | UNKNOWN | embedded FBI UCR coordinates at `Paper/The_Original_Power.tex:7755-7798` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:homicide-rate` | UNKNOWN | embedded national homicide series at `Paper/The_Original_Power.tex:10478-10538` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:iph_race_gender` | UNKNOWN | embedded IPH series at `Paper/The_Original_Power.tex:8385-8450` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:iron-law` | UNKNOWN | embedded potency estimates at `Paper/The_Original_Power.tex:10396-10446` | NOT RUN — producer unknown | exploratory | no explicit tier | T3 | UNTRACEABLE |
| `fig:karate_club` | UNKNOWN | Zachary network simulation embedded/rendered in TeX | NOT RUN — no script/notebook located | modelled | caption says simulation | T3 | UNTRACEABLE |
| `fig:kehoe_vs_patterson` | UNKNOWN | embedded threshold values at `Paper/The_Original_Power.tex:7987-8032` | NOT RUN — producer unknown | ordinal | no explicit tier | T3 | UNTRACEABLE |
| `fig:laplace-pole-plot` | UNKNOWN | fitted pole values embedded in TeX | NOT RUN — no script/notebook linked | modelled | caption says schematic | T3 | UNTRACEABLE |
| `fig:lead_crime` | UNKNOWN | embedded gasoline-lead/crime coordinates at `Paper/The_Original_Power.tex:7826-7898` | NOT RUN — producer unknown | measured | T1-linked | T1 | UNTRACEABLE |
| `fig:lyapunov_ceiling` | UNKNOWN | model curve generated in TeX at `Paper/The_Original_Power.tex:6210-6270` | NOT RUN — no script/notebook | modelled | no explicit tier | T3 | UNTRACEABLE |
| `fig:memory_gap` | UNKNOWN | model curves generated in TeX at `Paper/The_Original_Power.tex:5048-5091` | NOT RUN — no script/notebook | modelled | no explicit tier | T3 | UNTRACEABLE |
| `fig:nfa-tax` | UNKNOWN | embedded NFA tax/base-cost values at `Paper/The_Original_Power.tex:10778-10821` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:nhanes_disparity_rr` | UNKNOWN | embedded NHANES racial BLL values at `Paper/The_Original_Power.tex:8093-8137` | NOT RUN — producer unknown | measured | T1-linked | T2 | UNTRACEABLE |
| `fig:parallel_decline_rr` | UNKNOWN | embedded IPH/crime series at `Paper/The_Original_Power.tex:8577-8634` | NOT RUN — producer unknown | exploratory | no explicit tier | T3 | UNTRACEABLE |
| `fig:philly_redline` | UNKNOWN | `Paper/Philadelphia_gun_red.jpeg`; no source/producer found | NOT RUN — producer unknown | measured | T1-linked | UNKNOWN | UNTRACEABLE |
| `fig:post-repeal-decline` | UNKNOWN | embedded city homicide changes at `Paper/The_Original_Power.tex:10836-10865` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:suppression_substitution` | UNKNOWN | hand-coded normalized estimates at `Paper/The_Original_Power.tex:6861-6921` | NOT RUN — no script/notebook | ordinal | caption says estimates | T3 | UNTRACEABLE |
| `fig:youth_homicide` | UNKNOWN | embedded age-specific homicide series at `Paper/The_Original_Power.tex:8804-8872` | NOT RUN — producer unknown | measured | no explicit tier | T2 | UNTRACEABLE |
| `fig:band_power_tradeoff` | `Paper/scripts/spectral_fourier.ipynb:18-25` | `google_trends_class_identity.csv` | NOT RUN — writes figures | exploratory | caption states processing | T3 | OK |
| `fig:black_gun_ownership_mt` | `Paper/scripts/_gen_black_gun_fig.py:268-269` | NSSF/GSS/NAAGA estimates embedded by producer | NOT RUN — writes figures | exploratory | caption discloses estimates/uncertainty | T3 | OK |
| `fig:eq01c_recompile_signature` | `Paper/scripts/eq01c_recompile_signature.py:1-20` | `eq08_10_backlash_wave.csv` plus embedded approximate segregation/wealth series | NOT RUN — writes figure | ordinal | script explicitly says T3 | T3 | OK |
| `fig:eq05_kernel` | `Paper/scripts/eq05_kernel_optimization.ipynb:234` | `Paper/data/eq05_antebellum_cotton.csv` | NOT RUN — writes figure | measured/modelled | T1-linked | T1 | OK |
| `fig:eq08_backlash` | `Paper/scripts/eq08_10_backlash_wave.ipynb` | `Paper/data/eq08_10_backlash_wave.csv` | NOT RUN — writes figure | measured | T2-linked | T2 | OK |
| `fig:eq10_15_17_repression` | `Paper/scripts/eq10_15_17_financial_repression.ipynb` | FRED/OECD series summarized in `eq10_15_17_repression_ledger.csv` | NOT RUN — writes data/figure | measured | T2-supported | T2 | OK |
| `fig:eq13_16_swap1` | `Paper/scripts/eq13_16_interface_swap_matrix.ipynb:272` | `eq13_16_swap_matrix.csv` | NOT RUN — writes data/figures | measured | T2-linked | T2 | OK |
| `fig:eq13_16_swap2` | `Paper/scripts/eq13_16_interface_swap_matrix.ipynb:351` | `eq13_16_swap_matrix.csv` | NOT RUN — writes data/figures | measured | T2-linked | T2 | OK |
| `fig:eq13_16_swap3` | `Paper/scripts/eq13_16_interface_swap_matrix.ipynb:423` | `eq13_16_swap_matrix.csv` | NOT RUN — writes data/figures | measured | T2-linked | T2 | OK |
| `fig:eq27_police` | `Paper/scripts/eq27_police_killings.ipynb` | `Paper/data/eq27_police_killings.csv` | NOT RUN — writes figure | measured | T2-linked | T2 | OK |
| `fig:eq31_enforcement` | `Paper/scripts/eq31_asymmetric_enforcement.ipynb:10` | `Paper/data/eq31_asymmetric_enforcement.csv` | NOT RUN — writes figure | measured | T2-supported | T2 | OK |
| `fig:eq46_gilens` | `Paper/scripts/eq46_gilens_page.ipynb` | `Paper/data/eq46_gilens_page.csv` | NOT RUN — writes figure | measured | T1-linked | T1 | OK |
| `fig:eq56_kernel_objective` | `Paper/scripts/eq56_kernel_objective.ipynb:9,235` | `Paper/data/eq56_kernel_objective.csv` | NOT RUN — writes figure | measured/modelled | T1-linked | T1 | OK |
| `fig:eq75_76_hispaniola_panel_a` | `Paper/scripts/eq75_76_hispaniola_control.ipynb:21-23` | `eq75_76_hispaniola_control.csv` | NOT RUN — writes data/figures | modelled | caption states natural-experiment construction | T3 | OK |
| `fig:eq75_76_hispaniola_panel_b` | `Paper/scripts/eq75_76_hispaniola_control.ipynb:21-23` | `eq75_76_hispaniola_control.csv`, `eq75_76_double_debt_flow.csv` | NOT RUN — writes data/figures | modelled | caption states comparison | T3 | OK |
| `fig:eq75_76_hispaniola_panel_c` | `Paper/scripts/eq75_76_hispaniola_control.ipynb:21-23` | `eq75_76_hispaniola_control.csv` | NOT RUN — writes data/figures | modelled | caption states trajectory | T3 | OK |
| `fig:great_recession_asset_composition` | `Paper/scripts/eq10_great_recession_charts.py:3-9` | Federal Reserve DFA zip | NOT RUN — writes data/figure | measured | no explicit tier | T2 | OK |
| `fig:great_recession_debt_floor` | `Paper/scripts/eq10_great_recession_charts.py:3-9` | Federal Reserve DFA zip | NOT RUN — writes data/figure | measured | no explicit tier | T2 | OK |
| `fig:great_recession_racial_wealth` | `Paper/scripts/eq10_great_recession_charts.py:3-9` | Pew-reported SCF figures | NOT RUN — writes data/figure | measured | no explicit tier | T2 | OK |
| `fig:great_recession_wealth_shares` | `Paper/scripts/eq10_great_recession_charts.py:3-9` | Federal Reserve DFA zip | NOT RUN — writes data/figure | measured | no explicit tier | T2 | OK |
| `fig:hierarchy_wealth_brackets` | `Paper/scripts/eq10_great_recession_charts.py:85-189` | Federal Reserve DFA zip | NOT RUN — writes data/figure | measured | caption says proxy brackets | T2 | OK |
| `fig:hierarchy_wealth_brackets_over_time` | `Paper/scripts/eq10_great_recession_charts.py:3-9` | Federal Reserve DFA zip | NOT RUN — writes data/figure | measured | caption says proxy brackets | T2 | OK |
| `fig:hist3_redlining` | `Paper/scripts/eq_hist3_redlining_capacity.ipynb:10` | `Paper/data/eq_hist3_redlining_capacity.csv` | NOT RUN — writes figure | modelled proxy | caption names capacity factor | T2 | OK |
| `fig:hist4_war_drugs` | `Paper/scripts/eq_hist4_war_on_drugs_capacity.ipynb:10` | `Paper/data/eq_hist4_war_on_drugs_capacity.csv` | NOT RUN — writes figure | modelled proxy | caption names capacity factor | T2 | OK |
| `fig:parseval_conservation` | `Paper/scripts/eq40_45_interference_engine.ipynb:33-47` | Google Trends and Congressional Record processed CSVs | NOT RUN — writes figures | exploratory | caption states test | T3 | OK |
| `fig:per_axis_psd` | `Paper/scripts/eq40_45_interference_engine.ipynb:33-47` | `gdelt_per_axis.csv` | NOT RUN — writes figures | exploratory | caption describes computed PSD | T2 | OK |
| `fig:phi_load_trajectory` | `Paper/scripts/eq40_45_interference_engine.ipynb:33-47` | `anes_issue_salience.csv` | NOT RUN — writes figures | exploratory | caption says proxy | T3 | OK |
| `fig:power_spectrum` | `Paper/scripts/spectral_fourier.ipynb:18-25` | Google Trends, Congressional Record, ANES processed CSVs | NOT RUN — writes figures | exploratory | caption says proxy signals | T3 | OK |
| `fig:scotus_judicial_semantics_group` | `Paper/scripts/scotus_judicial_semantics.py:10-15` | markdown cases and case index | NOT RUN — writes data/figures | exploratory | T2-linked | T2 | OK |
| `fig:shock_acceleration` | `Paper/scripts/eq40_45_interference_engine.ipynb:33-47` | fitted shock results from spectral pipeline | NOT RUN — writes figures | exploratory | caption says fitted | T3 | OK |
| `fig:spectral_coherence` | `Paper/scripts/eq_fourier_electoral_cycle.py:399-400` | `congressional_record_word_freq.csv` | NOT RUN — writes figures | exploratory | caption states cross-spectral analysis | T3 | OK |
| `fig:spectral_main` | `Paper/scripts/eq_fourier_electoral_cycle.py:10-37` | `congressional_record_word_freq.csv` | NOT RUN — writes data/figures | exploratory | caption states spectral analysis | T3 | OK |
| `fig:suppression_substitution_data` | `Paper/scripts/eq40_45_interference_engine.ipynb:33-47` | `eq40_45_suppression_proxies.csv` | NOT RUN — writes figures | ordinal | caption explicitly says ordinal proxies | T3 | OK |

## Files in `Paper/data/`

| artifact | producer | input | reproduces | nature | tier_claimed | tier_supported | verdict |
|---|---|---|---|---|---|---|---|
| `Paper/data/scotus_keyword_counts.csv` | `Paper/scripts/preprocess_spectral_data.py:303-344` | `Paper/data/raw/scotus_keyword_counts_raw.csv` | NO — confirmed baseline; not rerun | exploratory | T2-linked | T2 | DOES-NOT-REPRODUCE (confirmed: 59 committed rows vs 74 regenerated; 64/78 merged total-word changes) |
| `Paper/data/scotus_spectral_results.json` | `Paper/scripts/scotus_corpus_analysis.ipynb` (named by `source`) | `scotus_keyword_counts.csv` | NO — provenance chain inherits confirmed upstream mismatch | exploratory | T2-linked | T2 | DOES-NOT-REPRODUCE (inherits bad processed input) |
| `Paper/data/congressional_record_word_freq_per_axis.csv` | `Paper/scripts/eq_fourier_per_axis.py:3-47` | `congressional_record_word_freq.csv`; hand-centered logistic/Gaussian mixture | NOT RUN — producer writes committed data or producer unknown | modelled | downstream used as measurement | T3 | MISLABELLED (confirmed baseline) |
| `Paper/data/eq05_antebellum_cotton.csv` | UNKNOWN | cited Census series plus extrapolated patrol expenditures | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T3 | MISLABELLED |
| `Paper/data/eq10_20_empire_index_components.csv` | `Paper/scripts/eq10_20_dalio_empire_index.ipynb:335` | inline factor anchors + interpolation | NOT RUN — producer writes committed data or producer unknown | modelled | T2-linked | T3 | MISLABELLED |
| `Paper/data/eq33_cannabis_redlining.csv` | UNKNOWN | literature plus author-set capacity-retention factors | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T3 | MISLABELLED |
| `Paper/data/eq73_74_haitian_theorem.csv` | UNKNOWN | four curated cases and estimated elite shares | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T3 | MISLABELLED |
| `Paper/data/eq91_imperial_core_collapse.csv` | UNKNOWN | WDI/SIPRI/IMF plus author capacity index | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T3 | MISLABELLED |
| `Paper/data/spatial/cdc_wonder_firearm_baltimore_md.csv` | `Paper/scripts/fetch_spatial_data.py:830-858` | static pre-2013 modeled rates | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/cdc_wonder_firearm_detroit_mi.csv` | `Paper/scripts/fetch_spatial_data.py:830-858` | static pre-2013 modeled rates | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/cdc_wonder_firearm_memphis_tn.csv` | `Paper/scripts/fetch_spatial_data.py:830-858` | static pre-2013 modeled rates | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/cdc_wonder_firearm_milwaukee_wi.csv` | `Paper/scripts/fetch_spatial_data.py:830-858` | static pre-2013 modeled rates | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/cdc_wonder_firearm_nashville_tn.csv` | `Paper/scripts/fetch_spatial_data.py:830-858` | static pre-2013 modeled rates | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/cdc_wonder_firearm_washington_dc.csv` | `Paper/scripts/fetch_spatial_data.py:830-858` | static pre-2013 modeled rates | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ejscreen_baltimore_md.csv` | `Paper/scripts/fetch_spatial_data.py:609-634` | deterministic seeded tract proxy, explicitly not EPA EJScreen | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ejscreen_detroit_mi.csv` | `Paper/scripts/fetch_spatial_data.py:609-634` | deterministic seeded tract proxy, explicitly not EPA EJScreen | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ejscreen_memphis_tn.csv` | `Paper/scripts/fetch_spatial_data.py:609-634` | deterministic seeded tract proxy, explicitly not EPA EJScreen | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ejscreen_milwaukee_wi.csv` | `Paper/scripts/fetch_spatial_data.py:609-634` | deterministic seeded tract proxy, explicitly not EPA EJScreen | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ejscreen_nashville_tn.csv` | `Paper/scripts/fetch_spatial_data.py:609-634` | deterministic seeded tract proxy, explicitly not EPA EJScreen | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ejscreen_washington_dc.csv` | `Paper/scripts/fetch_spatial_data.py:609-634` | deterministic seeded tract proxy, explicitly not EPA EJScreen | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/gva_incidents_baltimore_md.csv` | `Paper/scripts/fetch_spatial_data.py:721-760` | seeded synthetic incidents, explicitly not GVA | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/gva_incidents_detroit_mi.csv` | `Paper/scripts/fetch_spatial_data.py:721-760` | seeded synthetic incidents, explicitly not GVA | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/gva_incidents_memphis_tn.csv` | `Paper/scripts/fetch_spatial_data.py:721-760` | seeded synthetic incidents, explicitly not GVA | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/gva_incidents_milwaukee_wi.csv` | `Paper/scripts/fetch_spatial_data.py:721-760` | seeded synthetic incidents, explicitly not GVA | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/gva_incidents_nashville_tn.csv` | `Paper/scripts/fetch_spatial_data.py:721-760` | seeded synthetic incidents, explicitly not GVA | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/gva_incidents_washington_dc.csv` | `Paper/scripts/fetch_spatial_data.py:721-760` | seeded synthetic incidents, explicitly not GVA | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/merged_tract_panel_baltimore_md.parquet` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | HOLC/ACS/TIGER plus synthetic/modelled layers | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/merged_tract_panel_detroit_mi.parquet` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | HOLC/ACS/TIGER plus synthetic/modelled layers | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/merged_tract_panel_memphis_tn.parquet` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | HOLC/ACS/TIGER plus synthetic/modelled layers | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/merged_tract_panel_milwaukee_wi.parquet` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | HOLC/ACS/TIGER plus synthetic/modelled layers | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/merged_tract_panel_nashville_tn.parquet` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | HOLC/ACS/TIGER plus synthetic/modelled layers | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/merged_tract_panel_washington_dc.parquet` | `Paper/scripts/eq47_51_spatial_overlay.ipynb:43-49` | HOLC/ACS/TIGER plus synthetic/modelled layers | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/pooled_panel.parquet` | `Paper/scripts/test_overlay.py:190` | six merged panels including synthetic/modelled layers | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ppi_baltimore_md.csv` | `Paper/scripts/fetch_spatial_data.py:878-902` | seeded modeled incarceration rates, explicitly not PPI | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ppi_detroit_mi.csv` | `Paper/scripts/fetch_spatial_data.py:878-902` | seeded modeled incarceration rates, explicitly not PPI | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ppi_memphis_tn.csv` | `Paper/scripts/fetch_spatial_data.py:878-902` | seeded modeled incarceration rates, explicitly not PPI | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ppi_milwaukee_wi.csv` | `Paper/scripts/fetch_spatial_data.py:878-902` | seeded modeled incarceration rates, explicitly not PPI | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ppi_nashville_tn.csv` | `Paper/scripts/fetch_spatial_data.py:878-902` | seeded modeled incarceration rates, explicitly not PPI | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/spatial/ppi_washington_dc.csv` | `Paper/scripts/fetch_spatial_data.py:878-902` | seeded modeled incarceration rates, explicitly not PPI | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked spatial analysis | T3 | MISLABELLED |
| `Paper/data/eq_fourier_australian_parliament_results.csv` | `Paper/scripts/eq_fourier_australian_parliament.py:28-29` | Australian Parliament counts; no output provenance header | NOT RUN — producer writes committed data or producer unknown | exploratory | none | T3 | UNTRACEABLE |
| `Paper/data/eq_fourier_electoral_cycle_google_trends_results.csv` | `Paper/scripts/eq_fourier_electoral_cycle_google_trends.py:9-32` | Google Trends processed data; no output provenance header | NOT RUN — producer writes committed data or producer unknown | exploratory | none | T3 | UNTRACEABLE |
| `Paper/data/eq_fourier_electoral_cycle_ols_trends.csv` | `Paper/scripts/eq_fourier_electoral_cycle_robustness.py:14-19` | Congressional Record files; no output provenance header | NOT RUN — producer writes committed data or producer unknown | exploratory | none | T3 | UNTRACEABLE |
| `Paper/data/eq_fourier_electoral_cycle_results.csv` | `Paper/scripts/eq_fourier_electoral_cycle.py:10-37` | Congressional Record processed data; no output provenance header | NOT RUN — producer writes committed data or producer unknown | exploratory | none | T3 | UNTRACEABLE |
| `Paper/data/eq_funding_propval_feedback.csv` | UNKNOWN | curated report values; no producer header | NOT RUN — producer writes committed data or producer unknown | modelled | T1/T2-linked | T3 | UNTRACEABLE |
| `Paper/data/eq_hist3_redlining_capacity.csv` | UNKNOWN | curated Census/HOLC values; no producer header | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T2 | UNTRACEABLE |
| `Paper/data/eq_hist4_war_on_drugs_capacity.csv` | UNKNOWN | curated BJS/ACLU values; no producer header | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T2 | UNTRACEABLE |
| `Paper/data/eq_scotus_electromagnetic_conversion.csv` | `Paper/scripts/eq_scotus_electromagnetic_conversion.py:57` | `scotus_spectral_results.json`; no output header | NOT RUN — producer writes committed data or producer unknown | modelled | none | T3 | UNTRACEABLE |
| `Paper/data/eq_wavelet_amplitude_modulation_results.csv` | `Paper/scripts/eq_wavelet_amplitude_modulation.py:24-28` | Congressional Record; no output header | NOT RUN — producer writes committed data or producer unknown | exploratory | none | T3 | UNTRACEABLE |
| `Paper/data/eq08_10_backlash_wave.csv` | UNKNOWN | cited BLS/WID/BJS series | NOT RUN — producer writes committed data or producer unknown | measured | T2-linked | T2 | UNTRACEABLE |
| `Paper/data/eq10_15_17_repression_ledger.csv` | `Paper/scripts/eq10_15_17_financial_repression.ipynb:342` | FRED/OECD values, no file provenance header | NOT RUN — producer writes committed data or producer unknown | measured | T2-linked | T2 | UNTRACEABLE |
| `Paper/data/eq10_18_wage_asset_divergence.csv` | `Paper/scripts/eq10_18_psi_degradation.ipynb:363` | inline/cited series, no file provenance header | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T2 | UNTRACEABLE |
| `Paper/data/eq10_great_recession_asset_composition.csv` | `Paper/scripts/eq10_great_recession_charts.py:74-76` | Federal Reserve DFA zip, no file provenance header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/eq10_great_recession_debt_floor.csv` | `Paper/scripts/eq10_great_recession_charts.py:74-76` | Federal Reserve DFA zip, no file provenance header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/eq10_great_recession_racial_wealth.csv` | `Paper/scripts/eq10_great_recession_charts.py:3-9` | Pew reported figures, no file provenance header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/eq10_great_recession_wealth_shares.csv` | `Paper/scripts/eq10_great_recession_charts.py:74-76` | Federal Reserve DFA zip, no file provenance header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/eq10_hierarchy_wealth_brackets_over_time.csv` | `Paper/scripts/eq10_great_recession_charts.py` | Federal Reserve DFA zip, no file provenance header | NOT RUN — producer writes committed data or producer unknown | modelled proxy mapping | none | T3 | UNTRACEABLE |
| `Paper/data/eq10_hierarchy_wealth_brackets.csv` | `Paper/scripts/eq10_great_recession_charts.py:85-140` | Federal Reserve DFA zip, no file provenance header | NOT RUN — producer writes committed data or producer unknown | modelled proxy mapping | none | T3 | UNTRACEABLE |
| `Paper/data/eq13_15_17_gold_cover_1949_1971.csv` | `Paper/scripts/eq13_15_17_nixon_cover_ratio.ipynb:282` | inline/cited Fed series; no file provenance header | NOT RUN — producer writes committed data or producer unknown | measured | T1-linked | T2 | UNTRACEABLE |
| `Paper/data/eq13_16_swap_matrix.csv` | `Paper/scripts/eq13_16_interface_swap_matrix.ipynb:504` | inline WID series; no file provenance header | NOT RUN — producer writes committed data or producer unknown | measured | T2-linked | T2 | UNTRACEABLE |
| `Paper/data/eq20_24_bacons_rebellion.csv` | UNKNOWN | cited historical estimates; source header names no producer | NOT RUN — producer writes committed data or producer unknown | ordinal | none | T3 | UNTRACEABLE |
| `Paper/data/eq27_police_killings.csv` | UNKNOWN | MPV + Census; source header names no producer | NOT RUN — producer writes committed data or producer unknown | measured | T2-linked | T2 | UNTRACEABLE |
| `Paper/data/eq31_asymmetric_enforcement.csv` | UNKNOWN | ACLU/SAMHSA/FBI/Census; source header names no producer | NOT RUN — producer writes committed data or producer unknown | measured | T2-linked | T2 | UNTRACEABLE |
| `Paper/data/eq40_45_suppression_proxies.csv` | UNKNOWN | author-constructed ordinal estimates | NOT RUN — producer writes committed data or producer unknown | ordinal | none | T3 | UNTRACEABLE |
| `Paper/data/eq46_gilens_page.csv` | UNKNOWN | Gilens & Page aggregates; no producer header | NOT RUN — producer writes committed data or producer unknown | measured | T1-linked | T1 | UNTRACEABLE |
| `Paper/data/eq47_51_lead_crime_aizer.csv` | UNKNOWN | Aizer & Currie summary values; no producer header | NOT RUN — producer writes committed data or producer unknown | measured | T1-linked | T1 | UNTRACEABLE |
| `Paper/data/eq47_51_lead_crime_highway.csv` | UNKNOWN | Rothstein/Mapping Inequality/EPA summaries; no producer header | NOT RUN — producer writes committed data or producer unknown | modelled | T1-linked | T3 | UNTRACEABLE |
| `Paper/data/eq47_51_lead_crime_reyes.csv` | UNKNOWN | Reyes summary values; no producer header | NOT RUN — producer writes committed data or producer unknown | measured | T1-linked | T1 | UNTRACEABLE |
| `Paper/data/eq56_kernel_objective.csv` | UNKNOWN | WID/DINA values; no producer header | NOT RUN — producer writes committed data or producer unknown | measured | T1-linked | T1 | UNTRACEABLE |
| `Paper/data/eq63_mass_incarceration.csv` | UNKNOWN | BJS/Sentencing Project estimates; no producer header | NOT RUN — producer writes committed data or producer unknown | measured | T1-linked | T2 | UNTRACEABLE |
| `Paper/data/eq65_68_2a_case_law.csv` | UNKNOWN | manually curated statutes/rulings; no producer header | NOT RUN — producer writes committed data or producer unknown | ordinal | T1-linked | T3 | UNTRACEABLE |
| `Paper/data/eq75_76_double_debt_flow.csv` | UNKNOWN | NYT Ransom reconstruction; no producer header | NOT RUN — producer writes committed data or producer unknown | modelled | none | T3 | UNTRACEABLE |
| `Paper/data/eq75_76_hispaniola_control.csv` | UNKNOWN | curated historical/WDI estimates; no producer header | NOT RUN — producer writes committed data or producer unknown | modelled | none | T3 | UNTRACEABLE |
| `Paper/data/historical_shocks.json` | `Paper/scripts/preprocess_spectral_data.py:165-172` | `raw/historical_shocks_raw.json`; JSON has no provenance wrapper | NOT RUN — producer writes committed data or producer unknown | ordinal | none | T3 | UNTRACEABLE |
| `Paper/data/raw/anes_momp_raw.csv` | UNKNOWN | ANES source header; no retrieval producer | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/raw/backlash_proxies_intermediate_raw.csv` | UNKNOWN | literature-curated proxies; no producer | NOT RUN — producer writes committed data or producer unknown | modelled | none | T3 | UNTRACEABLE |
| `Paper/data/raw/backlash_proxies_raw.csv` | UNKNOWN | literature-curated proxies; no producer | NOT RUN — producer writes committed data or producer unknown | modelled | none | T3 | UNTRACEABLE |
| `Paper/data/raw/congressional_record_raw.csv` | UNKNOWN | GovInfo/ProQuest header; no retrieval producer | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/raw/google_trends_raw.csv` | UNKNOWN | Google Trends header; no retrieval producer | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/raw/historical_shocks_raw.json` | UNKNOWN | author timeline; no provenance header | NOT RUN — producer writes committed data or producer unknown | ordinal | none | T3 | UNTRACEABLE |
| `Paper/data/raw/nyt_per_axis_raw.csv` | UNKNOWN | bare zero-filled CSV; no header/producer | NOT RUN — producer writes committed data or producer unknown | modelled placeholder | none | UNKNOWN | UNTRACEABLE |
| `Paper/data/scotus_annual_fft_results.json` | `Paper/scripts/scotus_annual_fft.py:7-9` | annual counts; JSON has no producer field | NOT RUN — producer writes committed data or producer unknown | exploratory | none | T3 | UNTRACEABLE |
| `Paper/data/scotus_annual_keyword_counts.csv` | `Paper/scripts/scotus_annualize.py:25` | SCOTUS corpus; header omits producer | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/scotus_judicial_semantics_summary.json` | `Paper/scripts/scotus_judicial_semantics.py:892` | semantic rows; JSON omits producer | NOT RUN — producer writes committed data or producer unknown | exploratory | T2-linked | T2 | UNTRACEABLE |
| `Paper/data/scotus_lomb_scargle_results.json` | `Paper/scripts/scotus_lomb_scargle.py:8-10` | annual counts; JSON omits producer | NOT RUN — producer writes committed data or producer unknown | exploratory | none | T3 | UNTRACEABLE |
| `Paper/data/spatial/_holc_national_cache.geojson` | `Paper/scripts/fetch_spatial_data.py:293-317` | American Panorama URL; file metadata names no producer | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/acs_baltimore_md.csv` | `Paper/scripts/fetch_spatial_data.py:541-571` | Census API; bare CSV has no producer header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/acs_detroit_mi.csv` | `Paper/scripts/fetch_spatial_data.py:541-571` | Census API; bare CSV has no producer header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/acs_memphis_tn.csv` | `Paper/scripts/fetch_spatial_data.py:541-571` | Census API; bare CSV has no producer header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/acs_milwaukee_wi.csv` | `Paper/scripts/fetch_spatial_data.py:541-571` | Census API; bare CSV has no producer header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/acs_nashville_tn.csv` | `Paper/scripts/fetch_spatial_data.py:541-571` | Census API; bare CSV has no producer header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/acs_washington_dc.csv` | `Paper/scripts/fetch_spatial_data.py:541-571` | Census API; bare CSV has no producer header | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/holc_baltimore_md.geojson` | `Paper/scripts/fetch_spatial_data.py:374-445` | American Panorama national cache; metadata names source, not producer | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/holc_detroit_mi.geojson` | `Paper/scripts/fetch_spatial_data.py:374-445` | American Panorama national cache; metadata names source, not producer | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/holc_memphis_tn.geojson` | `Paper/scripts/fetch_spatial_data.py:374-445` | American Panorama national cache; metadata names source, not producer | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/holc_milwaukee_wi.geojson` | `Paper/scripts/fetch_spatial_data.py:374-445` | American Panorama national cache; metadata names source, not producer | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/holc_nashville_tn.geojson` | `Paper/scripts/fetch_spatial_data.py:374-445` | American Panorama national cache; metadata names source, not producer | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/tiger_tracts_11.parquet` | `Paper/scripts/fetch_spatial_data.py:467-511` | Census TIGER/Line; parquet has no provenance header | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/tiger_tracts_24.parquet` | `Paper/scripts/fetch_spatial_data.py:467-511` | Census TIGER/Line; parquet has no provenance header | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/tiger_tracts_26.parquet` | `Paper/scripts/fetch_spatial_data.py:467-511` | Census TIGER/Line; parquet has no provenance header | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/tiger_tracts_47.parquet` | `Paper/scripts/fetch_spatial_data.py:467-511` | Census TIGER/Line; parquet has no provenance header | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/spatial/tiger_tracts_55.parquet` | `Paper/scripts/fetch_spatial_data.py:467-511` | Census TIGER/Line; parquet has no provenance header | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | UNTRACEABLE |
| `Paper/data/anes_issue_salience.csv` | `Paper/scripts/preprocess_spectral_data.py:143-162` | `Paper/data/raw/anes_momp_raw.csv` | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | OK |
| `Paper/data/backlash_proxies.csv` | `Paper/scripts/preprocess_spectral_data.py:175-200` | `Paper/data/raw/backlash_proxies_raw.csv` | NOT RUN — producer writes committed data or producer unknown | modelled normalized proxy | none | T3 | OK |
| `Paper/data/congressional_record_word_freq.csv` | `Paper/scripts/preprocess_spectral_data.py:79-102` | `Paper/data/raw/congressional_record_raw.csv` | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | OK |
| `Paper/data/gdelt_per_axis.csv` | `Paper/scripts/preprocess_spectral_data.py:203-247` | `Paper/data/raw/gdelt_per_axis_raw.csv` | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | OK |
| `Paper/data/google_trends_class_identity.csv` | `Paper/scripts/preprocess_spectral_data.py:55-76` | `Paper/data/raw/google_trends_raw.csv` | NOT RUN — producer writes committed data or producer unknown | measured/processed | none | T2 | OK |
| `Paper/data/raw/gdelt_per_axis_raw.csv` | `Paper/scripts/gdelt_fetch_fileserver.py` (named in header) | GDELT 1.0 daily GKG public file server | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | OK |
| `Paper/data/raw/scotus_keyword_counts_raw.csv` | `Paper/scripts/scotus_text_extract.py` (named in header) | Internet Archive SCOTUS PDFs | NOT RUN — producer writes committed data or producer unknown | measured | none | T2 | OK |
| `Paper/data/scotus_judicial_case_scores.csv` | `Paper/scripts/scotus_judicial_semantics.py:873-875` | `scotus_judicial_semantics.csv` | NOT RUN — producer writes committed data or producer unknown | exploratory | T2-linked | T2 | OK |
| `Paper/data/scotus_judicial_semantics.csv` | `Paper/scripts/scotus_judicial_semantics.py:865` | markdown cases + case index | NOT RUN — producer writes committed data or producer unknown | exploratory | T2-linked | T2 | OK |
| `Paper/data/scotus_judicial_validation.csv` | `Paper/scripts/scotus_judicial_semantics.py:883-885` | case scores + hand coding | NOT RUN — producer writes committed data or producer unknown | exploratory | T2-linked | T2 | OK |

### Administrative files

| artifact | producer | input | reproduces | nature | tier_claimed | tier_supported | verdict |
|---|---|---|---|---|---|---|---|
| `Paper/data/.gitkeep` | N/A | N/A | NOT RUN — administrative placeholder | N/A | N/A | N/A | OK |
| `Paper/data/README.md` | manually maintained | repository data inventory | NOT RUN — documentation | N/A | N/A | N/A | UNTRACEABLE — it contains stale provenance claims |

## Findings

1. **The brief’s index count is stale.** `Paper/empirical_index.tex` currently contains 33 T1 and 39 T2 rows, for 72 total. The stated 34 T1 / 39 T2 / 73 total is wrong.
2. **The spatial empirical layer is substantially synthetic.** `fetch_spatial_data.py:15-16,609-634,721-760,830-858,878-902` generates modeled EJScreen-like values, synthetic firearm incidents, static modeled CDC rates, and modeled PPI-like incarceration rates. These inputs feed six city maps, six merged panels, a pooled panel, and T1-linked spatial claims. The file headers disclose much of this; the manuscript’s empirical statistics and GVA-derived language do not consistently carry that disclosure.
3. **Provenance headers are exceptional.** Most curated equation CSVs, result CSV/JSON files, raw exports, ACS files, and parquet files omit a producer even where a likely writer exists elsewhere. This audit records the writer only when a direct output statement or an in-file producer field was found; missing self-provenance still breaks the file-level chain.
4. **Current-label traceability is sparse.** Only `eq:6.6`, `eq:6.10`, `eq:6.11`, and `eq:10.5` have explicit current equation labels inside a producer notebook. Similar notebook filenames and old labels were not treated as proof.
5. **SCOTUS corpus cardinalities disagree.** The data README says 57 PDFs/opinions in several places, `scotus_keyword_counts.csv` says 55 opinions, `scotus_spectral_results.json` says 55 PDFs, and the manuscript’s Lomb–Scargle caption says 57 PDFs. The known raw-to-processed non-reproduction propagates to three manuscript figures and `scotus_spectral_results.json`.
6. **GDELT’s CSV header is corrected, while the data README remains stale.** `gdelt_per_axis.csv` and its raw header name GDELT 1.0’s public file server. `Paper/data/README.md` still describes GKG v2/BigQuery and calls the committed file a placeholder. The brief is correct about the CSV header and incomplete about the remaining documentation conflict.
7. **The NYT path is incomplete.** `Paper/data/raw/nyt_per_axis_raw.csv` is a bare zero-filled table with no provenance header, and the processed `Paper/data/nyt_per_axis.csv` named in the README and preprocessor is absent.
8. **No reproduction claim was inferred from static code.** Every producer capable of a fresh equality test writes into tracked data or figure directories. Each untested row is `NOT RUN`. `NO` is limited to the confirmed SCOTUS mismatch and artifacts whose provenance chain directly inherits it; none was rerun.
9. **Figure scope judgment.** The figure table includes all 87 labeled figure environments containing `includegraphics`, PGFPlots, or embedded coordinates, plus the fitted-pole plot, Zachary-network simulation, and hand-coded historical-compounding bars. Pure flowcharts, set diagrams, maps without plotted empirical layers, and decorative figures are excluded.
10. **Systemic pattern.** The dominant failure is an absent transformation layer between source citation and committed number. A bibliography entry identifies an authority; it does not identify the selection, transcription, interpolation, normalization, scoring, or aggregation that created the artifact.
