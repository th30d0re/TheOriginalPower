import { equationSymbols, type EquationSymbolKey } from './symbols';

export interface DecoderSpan {
  text: string;
  symbolId?: string;
}

export interface VerbatimDecoder {
  source: string;
  sourceLine: number;
}

export interface ValidationSource {
  name: string;
  type: string;
  url: string;
}

export interface EquationValidation {
  tier: 1 | 2 | 3;
  type: string;
  status: string;
  dataSources: readonly ValidationSource[];
  falsification: string;
  targetEvents: readonly string[];
  caseStudyLine: string | number;
  notebook: string;
}

export interface EquationCard {
  id: string;
  label: string;
  latex: string;
  title: string;
  category: string;
  chapter: string;
  chapterIndex: number;
  section: string;
  line: number;
  symbolKeys: readonly EquationSymbolKey[];
  decoder: {
    adapted: readonly DecoderSpan[];
    verbatim: VerbatimDecoder | null;
  };
  context: {
    background: string;
    significance: string;
  };
  validation?: EquationValidation;
}

export const equationCards: readonly EquationCard[] = [
  {
    id: 'E142',
    label: 'eq:12.5-haitian-theorem-nonkinetic',
    latex: '\\forall\\; R_i \\in \\mathcal{R}: \\quad \\Delta\\max(R_i) = 0',
    title: 'Haitian Theorem: Non-Kinetic Reform',
    category: 'Quantitative',
    chapter: 'The Contradiction: Why Reform Serves the Algorithm',
    chapterIndex: 12,
    section: 'The Haitian Theorem: Kinetic Action as the Only Historically Validated Liberation Mechanism',
    line: 11810,
    symbolKeys: ['reform', 'reformSet', 'deltaMax', 'zero'],
    decoder: {
      adapted: [
        { text: 'For ', symbolId: 'reform-set' },
        { text: 'each non-kinetic reform', symbolId: 'reform' },
        { text: ', the measured ', symbolId: 'reform-set' },
        { text: 'change in the extraction ceiling', symbolId: 'delta-max' },
        { text: ' is ', symbolId: 'reform' },
        { text: 'zero', symbolId: 'zero' },
        { text: '.' },
      ],
      verbatim: {
        sourceLine: 11852,
        source: String.raw`Across the historical dataset of the Predatory Min-Max Function (1450--2026), structural liberation of the Out-group ($O$) from the extraction kernel has been achieved \textit{exclusively} through kinetic action---the physical destruction or overthrow of the enforcement apparatus ($F_{\text{enforce}}$) and its commanding Elite ($E$). Within this dataset, every non-kinetic reform examined---every legislative, judicial, or policy concession---was integrated into the algorithm as $\min$-management, preserving $\max$ and extending the system's operational lifespan. Formally, let $\mathcal{R}$ denote the set of non-kinetic reforms in the 1450--2026 dataset:`,
      },
    },
    context: {
      background: 'The theorem compares non-kinetic reforms with cases of kinetic rupture across the framework’s historical dataset.',
      significance: 'The equality states the framework’s strongest claim about reform absorption: the extraction ceiling remains unchanged across the defined reform set.',
    },
    validation: {
      tier: 1,
      type: 'quantitative',
      status: 'complete',
      dataSources: [
        { name: 'James (1938) The Black Jacobins', type: 'peer-reviewed', url: '' },
        { name: 'NYT Ransom investigation (2022)', type: 'investigative-journalism', url: 'https://www.nytimes.com/2022/05/20/world/americas/haiti-france-ransom.html' },
        { name: 'Firestone Liberia concession records (Chalk 1967)', type: 'peer-reviewed', url: '' },
        { name: 'Evian Accords primary text (1962)', type: 'primary-source', url: '' },
        { name: 'Fanon (1961) The Wretched of the Earth', type: 'peer-reviewed', url: '' },
        { name: 'Moyo (2009) Dead Aid', type: 'peer-reviewed', url: '' },
      ],
      falsification: 'Falsified if any documented non-kinetic reform achieves Δmax < 0 (sustained reduction in Elite extraction share) in the 1450–2026 dataset.',
      targetEvents: ['Liberia independence (1847) — Firestone concession preserved extraction apparatus', 'Algeria independence (1962) — Evian Accords preserved French economic interests', 'Zimbabwe liberation (1980) — Lancaster House Agreement preserved white agricultural ownership', 'Civil Rights Act 1964, Reconstruction Amendments 1865–1870 (covered in manuscript prose)'],
      caseStudyLine: 8507,
      notebook: 'Paper/scripts/eq73_74_haitian_theorem.ipynb',
    },
  },
  {
    id: 'E072',
    label: 'eq:6.12-capacity-compounding-full',
    latex: 'O_{1971}^{\\text{capacity}} = O_{1450}^{\\text{capacity}} \\cdot (1-\\alpha\\, P_{\\text{enslavement}})(1-\\beta\\, P_{\\text{13thAmendment}})(1-\\gamma\\, P_{\\text{redlining}})(1-\\delta\\, P_{\\text{WarOnDrugs}})',
    title: 'Full Capacity-Compounding Chain',
    category: 'Quantitative',
    chapter: 'The Enforcement Engine: Slave Patrols, the 13th Amendment, and the Compounding Model (1704--1865)',
    chapterIndex: 6,
    section: 'Case Study: The Asymmetric Enforcement Multiplier --- Cannabis Arrests, 2010--2018',
    line: 4899,
    symbolKeys: ['capacity1971', 'capacity1450', 'alpha', 'enslavementPolicy', 'beta', 'amendmentPolicy', 'gamma', 'redliningPolicy', 'delta', 'drugsPolicy'],
    decoder: {
      adapted: [
        { text: 'Capacity after the War on Drugs', symbolId: 'capacity-1971' },
        { text: ' equals ', symbolId: 'capacity-1971' },
        { text: 'the 1450 baseline', symbolId: 'capacity-1450' },
        { text: ' multiplied by the retained capacity after ', symbolId: 'capacity-1450' },
        { text: 'enslavement', symbolId: 'policy-enslavement' },
        { text: ', the ', symbolId: 'alpha' },
        { text: 'Thirteenth Amendment exception', symbolId: 'policy-amendment' },
        { text: ', ', symbolId: 'beta' },
        { text: 'redlining', symbolId: 'policy-redlining' },
        { text: ', and the ', symbolId: 'gamma' },
        { text: 'War on Drugs', symbolId: 'policy-drugs' },
        { text: '.' },
      ],
      verbatim: {
        sourceLine: 4944,
        source: String.raw`Each dated factor is not interchangeable---the \textit{order} matters. Enslavement ($\alpha$) strips initial wealth and autonomy; the 13th Amendment's exception clause ($\beta$) re-encodes subjugation through criminalization; redlining ($\gamma$) blocks the primary vehicle of American wealth accumulation for a group \textit{already} without generational capital; and the War on Drugs ($\delta$) applies asymmetric enforcement to a population \textit{already} geographically concentrated by redlining and economically precarious from centuries of extraction. The same formula that appears abstract at time $t$ becomes a specific, falsifiable indictment at time 1971: the present condition of $O_{\text{racialized}}$ is a \textit{mathematical inevitability} given the policy sequence.`,
      },
    },
    context: {
      background: 'The model treats four historical policy shocks as successive capacity-retention factors applied to the residual left by the preceding shock.',
      significance: 'The multiplicative form makes cumulative path dependence visible and exposes each factor to separate empirical challenge.',
    },
    validation: {
      tier: 1,
      type: 'quantitative',
      status: 'complete',
      dataSources: [
        { name: 'ACLU (2020) — A Tale of Two Countries', type: 'report', url: 'https://www.aclu.org/report/tale-two-countries-racially-targeted-arrests-era-marijuana-reform' },
        { name: 'Mapping Inequality — HOLC Redlining Maps', type: 'public-dataset', url: 'https://dsl.richmond.edu/panorama/redlining/' },
        { name: 'Rothstein (2017) — The Color of Law', type: 'peer-reviewed', url: '' },
        { name: 'Darity & Mullen (2020) — From Here to Equality', type: 'peer-reviewed', url: '' },
      ],
      falsification: 'Falsified if any one policy shock (α, β, γ, δ) is shown to have zero marginal effect on subsequent Black wealth accumulation in longitudinal data.',
      targetEvents: ['ACLU cannabis arrests 2010–2018', 'HOLC redlining maps 1934', 'Mass incarceration 1971–present'],
      caseStudyLine: 3169,
      notebook: 'Paper/scripts/eq33_cannabis_redlining.ipynb',
    },
  },
  {
    id: 'E091',
    label: 'eq:8.16-interference-control-objective',
    latex: 'P_{\\text{class}}(t) \\ll \\tau, \\qquad\n\\text{subject to}\\quad P_{\\text{class}}(t) + P_{\\text{id}}(t) + P_{\\eta} = \\mathrm{const.}',
    title: 'Interference Control Objective',
    category: 'Structural',
    chapter: 'Tweedism and the Puppet Class: The Algorithmic Filter on Democracy',
    chapterIndex: 8,
    section: 'The Interference Engine: How Identity Debates Cancel Class Solidarity',
    line: 6426,
    symbolKeys: ['classPower', 'threshold', 'identityPower', 'noisePower', 'constantTotal'],
    decoder: {
      adapted: [
        { text: 'Keep ', symbolId: 'class-power' },
        { text: 'class-coherence power', symbolId: 'class-power' },
        { text: ' far below ', symbolId: 'threshold' },
        { text: 'the structural-response threshold', symbolId: 'threshold' },
        { text: ' while ', symbolId: 'identity-power' },
        { text: 'identity-band attention', symbolId: 'identity-power' },
        { text: ' and ', symbolId: 'noise-power' },
        { text: 'unstructured attention', symbolId: 'noise-power' },
        { text: ' preserve ', symbolId: 'constant-total' },
        { text: 'total political variance', symbolId: 'constant-total' },
        { text: '.' },
      ],
      verbatim: {
        sourceLine: 6472,
        source: String.raw`The equality constraint in eq.~\ref{eq:8.16-interference-control-objective} is the Parseval conservation law formalised below: total political variance is conserved, only its spectral distribution shifts. This is the same control requirement formalised in Chapter~\ref{ch:redefining} --- preserve $\max \mathcal{E}(t)$ by keeping class-coherence pressure below failure threshold --- now stated in the frequency domain.`,
      },
    },
    context: {
      background: 'The interference model decomposes political attention into class, identity, and broadband-noise bands.',
      significance: 'The objective predicts redistribution between bands while total variance remains fixed under the model’s Parseval constraint.',
    },
    validation: {
      tier: 1,
      type: 'structural',
      status: 'complete',
      dataSources: [
        { name: 'Google Trends', type: 'public-dataset', url: 'https://trends.google.com/' },
        { name: 'GovInfo Congressional Record', type: 'public-dataset', url: 'https://www.govinfo.gov/app/collection/crec' },
        { name: 'Suppression proxies (Church Committee, Carter 1996)', type: 'secondary-dataset', url: '' },
        { name: 'GDELT Global Knowledge Graph v2 (BigQuery public dataset)', type: 'public-dataset', url: 'https://console.cloud.google.com/bigquery?p=gdelt-bq' },
      ],
      falsification: 'Falsified if observed interference engine output increases S_class rather than decreasing it in any documented post-reform period. Operationalized: falsified if Φ_load does not rise during the 1965–1980 multi-axis activation window.',
      targetEvents: ['Parseval conservation test: P_class + P_id + P_noise = const (eq:44 constraint)', 'Suppression substitution (1956–1985): Σ_sup stable while components shift', 'Φ_load step increase 1965–1980: +0.114 (+101%) consistent with P_class suppression'],
      caseStudyLine: 4968,
      notebook: 'eq40_45_interference_engine.ipynb',
    },
  },
  {
    id: 'E097',
    label: 'eq:8.17-circular-dispersion-operator',
    latex: '\\overline{e^{i\\Phi}} = \\frac{1}{N}\\sum_{j=1}^{N} e^{i\\Phi_j}, \\qquad\n\\Phi_{\\text{load}}(t) = 1 - \\left|\\,\\overline{e^{i\\Phi}}\\,\\right| \\in [0,1]',
    title: 'Circular Dispersion Operator',
    category: 'Quantitative',
    chapter: 'Tweedism and the Puppet Class: The Algorithmic Filter on Democracy',
    chapterIndex: 8,
    section: 'Phase-Loading Algebra: Formal Definitions and Historical Calibration',
    line: 6678,
    symbolKeys: ['circularMean', 'sampleCount', 'sampleIndex', 'phaseValue', 'phaseLoad', 'zero'],
    decoder: {
      adapted: [
        { text: 'Average ', symbolId: 'circular-mean' },
        { text: 'the unit phase vectors', symbolId: 'circular-mean' },
        { text: ' across ', symbolId: 'sample-count' },
        { text: 'all subgroups', symbolId: 'sample-count' },
        { text: '; ', symbolId: 'sample-index' },
        { text: 'each indexed subgroup', symbolId: 'sample-index' },
        { text: ' contributes ', symbolId: 'phase-value' },
        { text: 'its phase', symbolId: 'phase-value' },
        { text: '. Subtract the mean vector magnitude from one to obtain ', symbolId: 'phase-load' },
        { text: 'phase fragmentation', symbolId: 'phase-load' },
        { text: ' on a zero-to-one scale', symbolId: 'zero' },
        { text: '.' },
      ],
      verbatim: {
        sourceLine: 6724,
        source: String.raw`When all $\Phi_j = 0$ (no phase injection), $|\overline{e^{i\Phi}}| = 1$ and $\Phi_{\text{load}} = 0$: the solidarity waves add constructively and $S_{\text{total}}$ is maximized. When the $\Phi_j$ are uniformly distributed across $[-\pi,\pi]$ (maximum fragmentation), the mean vector magnitude approaches zero and $\Phi_{\text{load}} \to 1$: the solidarity waves cancel. The system's control objective is therefore to drive $\Phi_{\text{load}}$ toward 1 by injecting diverse, incoherent phase offsets across the subgroup distribution.`,
      },
    },
    context: {
      background: 'The operator applies directional statistics to phase values that wrap around a circle.',
      significance: 'It maps perfect phase coherence to zero and maximal dispersion toward one, providing an operational phase-load measure.',
    },
    validation: {
      tier: 2,
      type: 'quantitative',
      status: 'complete',
      dataSources: [
        { name: 'ANES Time Series — cross-group solidarity items', type: 'public-dataset', url: 'https://electionstudies.org/' },
        { name: 'Google Trends', type: 'public-dataset', url: 'https://trends.google.com/' },
        { name: 'Mardia & Jupp (2000) Directional Statistics', type: 'reference', url: '' },
        { name: 'GDELT Global Knowledge Graph v2 (BigQuery public dataset)', type: 'public-dataset', url: 'https://console.cloud.google.com/bigquery?p=gdelt-bq' },
      ],
      falsification: 'Falsified if circular dispersion of phase values fails to predict cross-group political mobilization in ANES solidarity data. Operationalized: falsified if Φ_load does not show a positive step increase during 1965–1980.',
      targetEvents: ['Rolling Φ_load estimation (1948–2020): 8-yr centered mean from ANES solidarity proxy', 'Step increase 1948–1964 → 1965–1980: +0.136 (+174%)', 'Φ_load era means: 0.078 (pre) → 0.214 (activation) → 0.403 (post)', 'Identity fragmentation correlated with multi-axis activation events (STOP ERA, Moral Majority)'],
      caseStudyLine: 4968,
      notebook: 'eq40_45_interference_engine.ipynb',
    },
  },
  {
    id: 'E071',
    label: 'eq:6.8-capacity-chain-1619',
    latex: '\\begin{aligned}\nO_{1619}^{\\text{capacity}} &= O_{1450}^{\\text{capacity}} \\cdot (1 - \\alpha\\, P_{\\text{enslavement}}) \\\\[4pt]\nO_{1865}^{\\text{capacity}} &= O_{1619}^{\\text{capacity}} \\cdot (1 - \\beta\\, P_{\\text{13thAmendment}}) \\\\[4pt]\nO_{1934}^{\\text{capacity}} &= O_{1865}^{\\text{capacity}} \\cdot (1 - \\gamma\\, P_{\\text{redlining}}) \\\\[4pt]\nO_{1971}^{\\text{capacity}} &= O_{1934}^{\\text{capacity}} \\cdot (1 - \\delta\\, P_{\\text{WarOnDrugs}}) \n\\end{aligned}',
    title: 'Dated Capacity Chain',
    category: 'Quantitative',
    chapter: 'The Enforcement Engine: Slave Patrols, the 13th Amendment, and the Compounding Model (1704--1865)',
    chapterIndex: 6,
    section: 'Case Study: The Asymmetric Enforcement Multiplier --- Cannabis Arrests, 2010--2018',
    line: 4892,
    symbolKeys: ['capacity1619', 'capacity1450', 'alpha', 'enslavementPolicy', 'capacity1865', 'beta', 'amendmentPolicy', 'capacity1934', 'gamma', 'redliningPolicy', 'capacity1971', 'delta', 'drugsPolicy'],
    decoder: {
      adapted: [
        { text: 'Begin with ', symbolId: 'capacity-1450' },
        { text: 'the 1450 capacity baseline', symbolId: 'capacity-1450' },
        { text: '. Apply the ', symbolId: 'alpha' },
        { text: 'enslavement factor', symbolId: 'policy-enslavement' },
        { text: ', then the ', symbolId: 'beta' },
        { text: 'Thirteenth Amendment factor', symbolId: 'policy-amendment' },
        { text: ', the ', symbolId: 'gamma' },
        { text: 'redlining factor', symbolId: 'policy-redlining' },
        { text: ', and the ', symbolId: 'delta' },
        { text: 'War on Drugs factor', symbolId: 'policy-drugs' },
        { text: '. Each dated state becomes the baseline for the next reduction.', symbolId: 'capacity-1971' },
      ],
      verbatim: {
        sourceLine: 4946,
        source: String.raw`\noindent\textit{Illustrative instantiation (Tier~2): eq.~\ref{eq:6.8-capacity-chain-1619} --- Capacity Chain Step 1 (1619).} The first factor $\alpha$ represents the fraction of generational wealth stripped by the chattel enslavement system. Darity \& Mullen (2020) estimate cumulative extraction from chattel slavery at approximately \$14 trillion in 2020 dollars \cite{darity_mullen}. When normalized to a pre-contact baseline of $O_{1450}^{\text{capacity}} = 1.0$, the capacity-retention factor $(1-\alpha) \approx 0.09$ means that roughly 91\% of generational wealth capacity was stripped during the enslavement period. The 1619 link in the chain is therefore a directly quantified extraction: $O_{1619}^{\text{capacity}} \approx 0.09 \cdot O_{1450}^{\text{capacity}}$. \textbf{Confidence tier: Tier~2} --- single-source reparations estimate from peer-reviewed literature; no continuous time-series; $\rho_\tau = 0.6$.`,
      },
    },
    context: {
      background: 'The aligned equation expands the compounding model into four dated capacity states.',
      significance: 'The intermediate states expose the sequence and the residual base on which each later policy factor operates.',
    },
    validation: {
      tier: 2,
      type: 'quantitative',
      status: 'complete',
      dataSources: [{ name: 'Darity & Mullen (2020) — From Here to Equality (reparations calculations)', type: 'peer-reviewed', url: '' }],
      falsification: 'Falsified if O_1619 capacity is non-significantly different from O_1450 after controlling for pre-existing African economic structures.',
      targetEvents: ['Transatlantic slave trade 1619 — first enslaved Africans in Virginia'],
      caseStudyLine: '~3193',
      notebook: '',
    },
  },
  {
    id: 'E005',
    label: 'eq:1.1-enclosure-score',
    latex: '\\mathcal{S}_{\\text{enc}} = \\frac{1}{\\sqrt{2}}\\sqrt{\\,\\mathcal{S}_{\\text{mat}}^{2} + \\mathcal{S}_{\\text{psych}}^{2}\\,} = \\frac{1}{\\sqrt{2}}\\sqrt{\\left(\\frac{e_1 + e_2}{2}\\right)^{\\!2} + e_3^{2}}',
    title: 'Composite Enclosure Score',
    category: 'Structural',
    chapter: 'System Initialization: The Geometry of Extraction',
    chapterIndex: 0,
    section: 'The Tri-Modal Enclosure Model',
    line: 499,
    symbolKeys: ['enclosureScore', 'normalization', 'materialScore', 'psychologicalScore', 'communalObstruction', 'mobilityObstruction', 'epistemicObstruction'],
    decoder: {
      adapted: [
        { text: 'The ', symbolId: 'enclosure-score' },
        { text: 'composite enclosure score', symbolId: 'enclosure-score' },
        { text: ' is the joint magnitude of ', symbolId: 'normalization' },
        { text: 'material enclosure', symbolId: 'material-score' },
        { text: ' and ', symbolId: 'normalization' },
        { text: 'psychological enclosure', symbolId: 'psychological-score' },
        { text: ', normalized by ', symbolId: 'normalization' },
        { text: 'one over the maximum two-channel norm', symbolId: 'normalization' },
        { text: '. Material enclosure averages ', symbolId: 'material-score' },
        { text: 'communal obstruction', symbolId: 'communal-obstruction' },
        { text: ' and ', symbolId: 'mobility-obstruction' },
        { text: 'mobility obstruction', symbolId: 'mobility-obstruction' },
        { text: '; psychological enclosure equals ', symbolId: 'psychological-score' },
        { text: 'epistemic obstruction', symbolId: 'epistemic-obstruction' },
        { text: '.' },
      ],
      verbatim: {
        sourceLine: 539,
        source: String.raw`\noindent\textit{Electrodynamic weighting.}\footnote{This equation is classified as Tier~3 (ordinal/structural); the electrodynamic weighting derives from the AC power analogy (real power = material extraction, reactive power = psychological deflection). The normalization factor $1/\sqrt{2}$ ensures $\mathcal{S}_{\text{enc}} \in [0,1]$. See the Empirical Methodology chapter (p.~\pageref{ch:empirical_methodology}) and Appendix~\ref{app:empirical_index} for the full per-equation index.}`,
      },
    },
    context: {
      background: 'The Tri-Modal Enclosure Model combines two material outlet measures with a psychological and epistemic outlet measure.',
      significance: 'The reciprocal normalization preserves the derivation from the maximum attainable two-channel norm and fixes complete enclosure at 1.0.',
    },
    validation: {
      tier: 3,
      type: 'structural',
      status: 'complete',
      dataSources: [],
      falsification: 'Falsified if a population with all three outlets blocked (e_i=1) shows sustained autonomous mobilization without external support.',
      targetEvents: ['Colonial-era slave societies 1619–1865'],
      caseStudyLine: 241,
      notebook: '',
    },
  },
  {
    id: 'E073',
    label: 'eq:7.1-pullman-corollary',
    latex: 'j\\psi_s \\uparrow \\implies \\text{Solidarity}(I_{\\text{buffer}}, O_{\\text{racialized}}) \\downarrow \\implies \\text{Vulnerability}(I_{\\text{buffer}}) \\uparrow \\implies \\mathcal{E}(t) \\uparrow',
    title: 'Pullman Corollary',
    category: 'Structural',
    chapter: 'The Containment: Pullman, Redlining, and the Wages of Whiteness (1894--1965)',
    chapterIndex: 7,
    section: 'The Theorem the Buffer Class Refused to Learn',
    line: 5415,
    symbolKeys: ['imaginaryUnit', 'statusWage', 'solidarity', 'bufferClass', 'racializedOutgroup', 'vulnerability', 'extraction'],
    decoder: {
      adapted: [
        { text: 'As ', symbolId: 'status-wage' },
        { text: 'the psychological status wage', symbolId: 'status-wage' },
        { text: ' rises in its ', symbolId: 'imaginary-unit' },
        { text: 'orthogonal channel', symbolId: 'imaginary-unit' },
        { text: ', ', symbolId: 'solidarity' },
        { text: 'solidarity', symbolId: 'solidarity' },
        { text: ' between ', symbolId: 'buffer-class' },
        { text: 'the Buffer Class', symbolId: 'buffer-class' },
        { text: ' and ', symbolId: 'racialized-outgroup' },
        { text: 'the racialized Out-group', symbolId: 'racialized-outgroup' },
        { text: ' falls. ', symbolId: 'vulnerability' },
        { text: 'Buffer Class vulnerability', symbolId: 'vulnerability' },
        { text: ' rises, followed by higher ', symbolId: 'extraction' },
        { text: 'Elite extraction', symbolId: 'extraction' },
        { text: '.' },
      ],
      verbatim: {
        sourceLine: 5460,
        source: String.raw`Equation~\ref{eq:7.1-pullman-corollary} states the corollary as an ordinal chain. The complex-wage algebra states it exactly. The ARU's 1893 charter fixed the union's wage allocation on the imaginary axis: the exclusion of $O_{\text{racialized}}$ delivered status alone, and the charter carried zero material concession, so $\psi_m = 0$ and`,
      },
    },
    context: {
      background: 'The corollary formalizes the Pullman case, in which racial exclusion reduced the coalition available to organized labor.',
      significance: 'The ordinal chain links status allocation, reduced solidarity, increased Buffer Class vulnerability, and increased extraction.',
    },
    validation: {
      tier: 3,
      type: 'structural',
      status: 'complete',
      dataSources: [{ name: 'Roediger (1991) — The Wages of Whiteness', type: 'peer-reviewed', url: '' }],
      falsification: 'Falsified if a documented case shows I_buffer achieving collective gains through exclusion of O without subsequent Elite weaponization.',
      targetEvents: ['Pullman Strike 1894 — Strikebreaker recruitment from Black workers', 'AFL exclusion policies 1881–1935'],
      caseStudyLine: '~3624',
      notebook: '',
    },
  },
  {
    id: 'E047',
    label: 'eq:2.2b-complex-wage-def',
    latex: 'W = \\psi_m + j\\psi_s',
    title: 'Complex Wage',
    category: 'Framework definition',
    chapter: 'Version 1.0: Initializing the Vector (15th-Century Portugal)',
    chapterIndex: 3,
    section: 'The Electrodynamic Reframing: $\\psi$ as Complex Power',
    line: 2522,
    symbolKeys: ['complexWage', 'materialWage', 'imaginaryUnit', 'statusWage'],
    decoder: {
      adapted: [
        { text: 'The ', symbolId: 'complex-wage' },
        { text: 'total suppression allocation', symbolId: 'complex-wage' },
        { text: ' combines ', symbolId: 'material-wage' },
        { text: 'material concessions', symbolId: 'material-wage' },
        { text: ' with ', symbolId: 'imaginary-unit' },
        { text: 'an orthogonal ', symbolId: 'imaginary-unit' },
        { text: 'psychological status wage', symbolId: 'status-wage' },
        { text: '.' },
      ],
      verbatim: {
        sourceLine: 2549,
        source: String.raw`where $j = \sqrt{-1}$ signals that $\psi_s$ operates in a domain
\emph{orthogonal} to material reality. The relation follows the exact
mapping used in electrical engineering to distinguish \textbf{real power}
(Watts, performs physical work) from \textbf{reactive power} (VARs, sustains the
field but does zero work).`,
      },
    },
    context: {
      background: 'The definition applies the electrical-engineering distinction between real and reactive power to the framework’s two wage channels.',
      significance: 'The complex form preserves the material and status components as orthogonal quantities with different operational effects.',
    },
  },
];

export const symbolsForCard = (card: EquationCard) => card.symbolKeys.map((key) => equationSymbols[key]);
