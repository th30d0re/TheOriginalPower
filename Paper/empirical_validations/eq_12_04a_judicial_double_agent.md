---
label: eq:12.4a-judicial-double-agent
new_label: eq:12.4a-judicial-double-agent
chapter: 12
chapter_title: "The Contradiction: Why Reform Serves the Algorithm"
line: 9969
statement: |
  P_{\text{jud}}(P)=
  \begin{cases}
  D_{\text{sem}}(P_{\text{proxy}})=0 & \text{software-layer civil-rights and voting claims},\\
  D_{\text{hist}}(P_{\text{kinetic}})>0 & \text{hardware-layer Second Amendment claims}.
  \end{cases}
type: computational-corpus
tier: 2
status: complete
existing_case_study: true
phase3_headline: false
target_events:
  - "SCOTUS civil-rights and voting cases in Paper/research/markdown_cases/"
  - "SCOTUS Second Amendment cases: Heller, McDonald, Caetano, Bruen, Rahimi"
data_sources:
  - {name: "Local SCOTUS markdown corpus", type: "primary-source corpus", url: ""}
  - {name: "Paper/research/case_index.yaml", type: "metadata index", url: ""}
  - {name: "Truscott and Romano 2026", type: "methodological source", url: "https://doi.org/10.1017/jlc.2025.10004"}
  - {name: "Cope 2025", type: "methodological source", url: "https://doi.org/10.1017/pan.2025.10009"}
difficulty: M
notebook: "Paper/scripts/scotus_judicial_semantics.py"
case_study_line: 10000
falsification: Falsified if the SCOTUS corpus does not separate civil-rights/voting cases from Second Amendment cases on either the anchored judicial-language baskets or the latent semantic axis, or if expert-coded high-value cases consistently fall on the opposite pole from their doctrinal posture.
---

# Notes

**Description**: Judicial double-agent architecture: the Court's written language shifts between a formalist/proxy-screen register for civil-rights and voting claims and a historical/kinetic register for Second Amendment claims.

**Method**: `Paper/scripts/scotus_judicial_semantics.py` reads `Paper/research/case_index.yaml`, loads markdown cases from `Paper/research/markdown_cases/`, strips OCR boilerplate, attempts majority/concurrence/dissent splits, computes anchored semantic baskets, and derives a latent case-level text axis using SVD over normalized term frequencies.

**Outputs**:
- `Paper/data/scotus_judicial_semantics.csv`
- `Paper/data/scotus_judicial_case_scores.csv`
- `Paper/data/scotus_judicial_validation.csv`
- `Paper/data/scotus_judicial_semantics_summary.json`
- `Paper/figures/spectral/scotus_judicial_semantic_axis.pdf`
- `Paper/figures/spectral/scotus_civil_rights_vs_second_amendment.pdf`

**Current result**: The full run loads 101 indexed cases and produces 190 scored text units. Civil-rights/voting cases average negative on the oriented latent axis; Second Amendment cases average positive. The 13-case expert-coded validation sample agrees with the anchored basket pole for all coded cases.

**Limitations**:
- This is a case-level corpus study, not a justice-level Wordshoal or JuDJIS replication.
- Some markdown files contain records, briefs, or OCR noise in addition to opinions.
- The latent axis is exploratory and should be read together with the anchored semantic baskets.
