export interface EquationSymbol {
  id: string;
  latex: string;
  name: string;
  plainPhrase: string;
  meaning: string;
  units?: string;
  sourceNote?: string;
}

const symbol = (entry: EquationSymbol): EquationSymbol => entry;

export const equationSymbols = {
  reform: symbol({ id: 'reform', latex: 'R_i', name: 'Reform', plainPhrase: 'each non-kinetic reform', meaning: 'One legislative, judicial, or policy intervention in the historical reform set.' }),
  reformSet: symbol({ id: 'reform-set', latex: '\\mathcal{R}', name: 'Reform set', plainPhrase: 'the set of non-kinetic reforms', meaning: 'The collection of non-kinetic reforms examined across the framework dataset.' }),
  deltaMax: symbol({ id: 'delta-max', latex: '\\Delta\\max', name: 'Change in extraction ceiling', plainPhrase: 'changes the extraction ceiling', meaning: 'The change in the Elite extraction share associated with an intervention.' }),
  zero: symbol({ id: 'zero', latex: '0', name: 'Zero change', plainPhrase: 'by zero', meaning: 'No sustained change in the measured quantity.' }),

  capacity1450: symbol({ id: 'capacity-1450', latex: 'O_{1450}^{\\text{capacity}}', name: '1450 capacity', plainPhrase: 'the pre-racialization capacity baseline', meaning: 'The modeled Out-group capacity baseline before the policy sequence.' }),
  capacity1619: symbol({ id: 'capacity-1619', latex: 'O_{1619}^{\\text{capacity}}', name: '1619 capacity', plainPhrase: 'capacity after enslavement', meaning: 'Residual Out-group capacity after the enslavement policy shock.' }),
  capacity1865: symbol({ id: 'capacity-1865', latex: 'O_{1865}^{\\text{capacity}}', name: '1865 capacity', plainPhrase: 'capacity after the Thirteenth Amendment exception', meaning: 'Residual Out-group capacity after the second policy shock.' }),
  capacity1934: symbol({ id: 'capacity-1934', latex: 'O_{1934}^{\\text{capacity}}', name: '1934 capacity', plainPhrase: 'capacity after redlining', meaning: 'Residual Out-group capacity after the third policy shock.' }),
  capacity1971: symbol({ id: 'capacity-1971', latex: 'O_{1971}^{\\text{capacity}}', name: '1971 capacity', plainPhrase: 'capacity after the War on Drugs', meaning: 'Residual Out-group capacity after all listed policy shocks.' }),
  alpha: symbol({ id: 'alpha', latex: '\\alpha', name: 'Enslavement effect', plainPhrase: 'the enslavement reduction factor', meaning: 'The modeled fraction of capacity removed through chattel enslavement.' }),
  beta: symbol({ id: 'beta', latex: '\\beta', name: 'Thirteenth Amendment effect', plainPhrase: 'the Thirteenth Amendment reduction factor', meaning: 'The modeled capacity reduction associated with the exception clause and its enforcement system.' }),
  gamma: symbol({ id: 'gamma', latex: '\\gamma', name: 'Redlining effect', plainPhrase: 'the redlining reduction factor', meaning: 'The modeled capacity reduction associated with redlining.' }),
  delta: symbol({ id: 'delta', latex: '\\delta', name: 'War on Drugs effect', plainPhrase: 'the War on Drugs reduction factor', meaning: 'The modeled capacity reduction associated with asymmetric drug enforcement.' }),
  enslavementPolicy: symbol({ id: 'policy-enslavement', latex: 'P_{\\text{enslavement}}', name: 'Enslavement policy', plainPhrase: 'enslavement policy', meaning: 'The historical policy regime that applies the enslavement capacity shock.' }),
  amendmentPolicy: symbol({ id: 'policy-amendment', latex: 'P_{\\text{13thAmendment}}', name: 'Thirteenth Amendment policy', plainPhrase: 'the Thirteenth Amendment exception policy', meaning: 'The post-emancipation policy regime associated with the exception clause.' }),
  redliningPolicy: symbol({ id: 'policy-redlining', latex: 'P_{\\text{redlining}}', name: 'Redlining policy', plainPhrase: 'redlining policy', meaning: 'The housing and credit policy regime that applies the redlining shock.' }),
  drugsPolicy: symbol({ id: 'policy-drugs', latex: 'P_{\\text{WarOnDrugs}}', name: 'War on Drugs policy', plainPhrase: 'War on Drugs policy', meaning: 'The enforcement regime that applies the final listed capacity shock.' }),

  classPower: symbol({ id: 'class-power', latex: 'P_{\\text{class}}(t)', name: 'Class-band power', plainPhrase: 'class-coherence power', meaning: 'Power in the low-frequency class-attention band at time t.' }),
  threshold: symbol({ id: 'threshold', latex: '\\tau', name: 'Crash threshold', plainPhrase: 'the structural-response threshold', meaning: 'Critical amplitude of effective threat at which the Elite mode-shifts from extraction maintenance to structural response.', units: 'dimensionless threshold score', sourceNote: 'Name, meaning, and units adapted from systemic_arbitrage/variables.yaml.' }),
  kineticMomentum: symbol({ id: 'kinetic-momentum', latex: 'T', name: 'Kinetic momentum', plainPhrase: 'class-coherence threat', meaning: 'Class-coherence threat or mobilized pressure from subordinate groups.', units: 'dimensionless z-score', sourceNote: 'Definition and units from systemic_arbitrage/variables.yaml.' }),
  enclosureVolts: symbol({ id: 'enclosure-volts', latex: 'V_E', name: 'Enclosure volts', plainPhrase: 'Elite suppression allocation', meaning: 'Elite suppression allocation directed against perceived threats to the extraction kernel.', units: 'dimensionless z-score', sourceNote: 'Definition and units from systemic_arbitrage/variables.yaml.' }),
  orthographicIllusion: symbol({ id: 'orthographic-illusion', latex: 'O_x', name: 'Orthographic illusion index', plainPhrase: 'identity-band noise ratio', meaning: 'Ratio of high-frequency identity-band noise to total spectral power.', units: 'ratio', sourceNote: 'Definition and units from systemic_arbitrage/variables.yaml.' }),
  realKineticMomentum: symbol({ id: 'real-kinetic-momentum', latex: 'P_{\\text{real}}', name: 'Real kinetic momentum', plainPhrase: 'low-frequency structural attention', meaning: 'Low-frequency structural component of collective attention reflecting durable economic anxiety and class-coherence pressure.', units: 'dimensionless z-score', sourceNote: 'Definition and units from systemic_arbitrage/variables.yaml.' }),
  effectiveThreat: symbol({ id: 'effective-threat', latex: 'M_{\\text{eff}}', name: 'Effective threat', plainPhrase: 'effective structural threat', meaning: 'Structural threat after discounting for psychological-wage interference.', units: 'dimensionless', sourceNote: 'Definition and units from systemic_arbitrage/variables.yaml.' }),
  identityPower: symbol({ id: 'identity-power', latex: 'P_{\\text{id}}(t)', name: 'Identity-band power', plainPhrase: 'identity-band attention', meaning: 'Power routed into higher-frequency identity-attention modes at time t.' }),
  noisePower: symbol({ id: 'noise-power', latex: 'P_{\\eta}', name: 'Noise power', plainPhrase: 'unstructured attention', meaning: 'Residual political attention carried by the broadband noise floor.' }),
  constantTotal: symbol({ id: 'constant-total', latex: '\\mathrm{const.}', name: 'Conserved total', plainPhrase: 'a conserved total variance', meaning: 'The fixed sum of class-band, identity-band, and noise power under the stated constraint.' }),

  circularMean: symbol({ id: 'circular-mean', latex: '\\overline{e^{i\\Phi}}', name: 'Circular mean vector', plainPhrase: 'the mean phase vector', meaning: 'The average of the unit vectors representing subgroup phase values.' }),
  sampleCount: symbol({ id: 'sample-count', latex: 'N', name: 'Subgroup count', plainPhrase: 'the number of subgroups', meaning: 'The number of phase observations included in the circular mean.', units: 'count' }),
  sampleIndex: symbol({ id: 'sample-index', latex: 'j', name: 'Subgroup index', plainPhrase: 'each subgroup index', meaning: 'The index identifying one subgroup in the phase distribution.' }),
  phaseValue: symbol({ id: 'phase-value', latex: '\\Phi_j', name: 'Subgroup phase', plainPhrase: 'each subgroup phase', meaning: 'The angular displacement assigned to subgroup j.', units: 'radians' }),
  phaseLoad: symbol({ id: 'phase-load', latex: '\\Phi_{\\text{load}}(t)', name: 'Phase load', plainPhrase: 'phase fragmentation', meaning: 'Circular dispersion at time t, ranging from perfect coherence to maximum cancellation.', units: '0–1 index' }),

  enclosureScore: symbol({ id: 'enclosure-score', latex: '\\mathcal{S}_{\\text{enc}}', name: 'Enclosure Score', plainPhrase: 'the composite enclosure score', meaning: 'The normalized magnitude of material and psychological enclosure.', units: '0–1 index' }),
  normalization: symbol({ id: 'normalization', latex: '\\frac{1}{\\sqrt{2}}', name: 'Normalization factor', plainPhrase: 'normalized by the maximum possible magnitude', meaning: 'The reciprocal of the maximum two-channel norm, which pins total enclosure to 1.0.' }),
  materialScore: symbol({ id: 'material-score', latex: '\\mathcal{S}_{\\text{mat}}', name: 'Material enclosure', plainPhrase: 'material enclosure', meaning: 'The composite of communal-capacity and mobility obstruction.', units: '0–1 index' }),
  psychologicalScore: symbol({ id: 'psychological-score', latex: '\\mathcal{S}_{\\text{psych}}', name: 'Psychological enclosure', plainPhrase: 'psychological enclosure', meaning: 'The obstruction of psychological and epistemic autonomy.', units: '0–1 index' }),
  communalObstruction: symbol({ id: 'communal-obstruction', latex: 'e_1', name: 'Communal-capacity obstruction', plainPhrase: 'communal-capacity obstruction', meaning: 'Obstruction of internal economic, social, educational, kinship, and mutual-aid infrastructure.', units: '0–1 index' }),
  mobilityObstruction: symbol({ id: 'mobility-obstruction', latex: 'e_2', name: 'Mobility obstruction', plainPhrase: 'mobility obstruction', meaning: 'Obstruction of movement, market access, property access, employment pathways, and exit.', units: '0–1 index' }),
  epistemicObstruction: symbol({ id: 'epistemic-obstruction', latex: 'e_3', name: 'Epistemic obstruction', plainPhrase: 'epistemic obstruction', meaning: 'Obstruction of the capacity to name and model the enclosure.', units: '0–1 index' }),

  imaginaryUnit: symbol({ id: 'imaginary-unit', latex: 'j', name: 'Imaginary unit', plainPhrase: 'the orthogonal status channel', meaning: 'The imaginary unit marking a component orthogonal to material reality.' }),
  statusWage: symbol({ id: 'status-wage', latex: '\\psi_s', name: 'Psychological/status wage', plainPhrase: 'the psychological status wage', meaning: 'A non-material allocation of status, deference, and relative social position.' }),
  bufferClass: symbol({ id: 'buffer-class', latex: 'I_{\\text{buffer}}', name: 'Buffer Class', plainPhrase: 'the Buffer Class', meaning: 'The population positioned between the Elite and the racialized Out-group.' }),
  racializedOutgroup: symbol({ id: 'racialized-outgroup', latex: 'O_{\\text{racialized}}', name: 'Racialized Out-group', plainPhrase: 'the racialized Out-group', meaning: 'The population positioned as the primary target of extraction and enclosure.' }),
  solidarity: symbol({ id: 'solidarity', latex: '\\text{Solidarity}', name: 'Cross-group solidarity', plainPhrase: 'cross-group solidarity', meaning: 'Collective alignment between the Buffer Class and the racialized Out-group.' }),
  vulnerability: symbol({ id: 'vulnerability', latex: '\\text{Vulnerability}', name: 'Buffer vulnerability', plainPhrase: 'Buffer Class vulnerability', meaning: 'Exposure of the Buffer Class to Elite extraction after coalition capacity falls.' }),
  extraction: symbol({ id: 'extraction', latex: '\\mathcal{E}(t)', name: 'Extraction', plainPhrase: 'Elite extraction', meaning: 'The system extraction function at time t.' }),

  complexWage: symbol({ id: 'complex-wage', latex: 'W', name: 'Complex Wage', plainPhrase: 'the total suppression allocation', meaning: 'The combined material and psychological allocation represented as a complex quantity.' }),
  materialWage: symbol({ id: 'material-wage', latex: '\\psi_m', name: 'Material wage', plainPhrase: 'material concessions', meaning: 'Real economic concessions that perform material work.' }),
} as const;

export type EquationSymbolKey = keyof typeof equationSymbols;
