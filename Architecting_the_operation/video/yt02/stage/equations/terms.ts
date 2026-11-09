export const EQUATION_TERMS = {
  X: {show: 'X', meaning: 'raw sensory input', slot: 0},
  T: {show: 'T', meaning: 'threat/status interpretation', slot: 2},
  PiRace: {show: 'PiRace', math: 'Π_{race}', meaning: 'the installed racial prior', slot: 1},
  i: {show: 'i', math: '_i', meaning: 'the individual', slot: 9},
  IndividualPrejudice: {show: 'Individual Prejudice', meaning: 'Eq. 2.5, term 1', slot: 13},
  DiscriminatoryActions: {show: 'Discriminatory Actions', meaning: 'Eq. 2.5, term 2', slot: 5},
  SystemicOutcomes: {show: 'Systemic Outcomes', meaning: 'Eq. 2.5, term 3', slot: 4},
  // Eq. 2.11 (RLC governing equation), STORYBOARD_MIN7_12.md. Derivative forms of q use the token-level math override.
  L: {show: 'L', meaning: 'inductance; cultural inertia and institutional entrenchment', slot: 3},
  R: {show: 'R', meaning: 'resistance; bureaucratic and carceral friction', slot: 6},
  C: {show: 'C', meaning: 'capacitance; token-reform absorption capacity', slot: 7},
  q: {show: 'q(t)', meaning: 'equality-surplus charge', slot: 8},
  V: {show: 'V(t)', meaning: 'reform-shock driving voltage', slot: 10},
  // Eq. 3.1 (conceptual racism vector), introduced in YT02 turns 63–67.
  RacismVector: {show: 'R', math: 'R_{racism}', meaning: 'the conceptual racism vector', slot: 11},
  Magnitude: {show: 'M', math: 'M_{force}', meaning: 'emotional and material magnitude', slot: 12},
  StateDirection: {show: 'd̂', math: 'd̂_{state}', meaning: 'unit direction of state and institutional enforcement', slot: 13},
  // Eq. 2.1 (coarse binary partition), introduced in YT02 turns 124–140. Operators are
  // spelled as words in the scene because IBM Plex Mono has no union/intersection glyphs.
  U: {show: 'U', meaning: 'total population (Eq. 2.1)', slot: 2},
  I: {show: 'I', meaning: 'dominant racial in-group (Eq. 2.1)', slot: 0},
  O: {show: 'O', meaning: 'marginalized out-group (Eq. 2.1)', slot: 1},
  // Eq. 2.1 (disjoint partition), introduced in YT02 turns 141–143. Slots 2 and 1 are reused
  // because the 14-slot palette is full; StateDirection already reuses slot 13.
  Universe: {show: 'U', meaning: 'population universe (Eq. 2.1)', slot: 9},
  InGroupSet: {show: 'I', meaning: 'In-group set I (Eq. 2.1)', slot: 2},
  OutGroupSet: {show: 'O', meaning: 'Out-group set O (Eq. 2.1)', slot: 1},
  // Eq. 2.2 (vertical refinement into four functional tiers) and Eq. 0.3 (benefit ordering),
  // introduced in YT02 turns 169–180. The 14-slot palette is full, so each tier reuses the
  // slot nearest its cone color: E orange, P gold, F red, I_buffer teal, O green.
  Elite: {show: 'E', meaning: 'Elite tier; designs the rules, captures the net surplus (Eq. 2.2)', slot: 5},
  Puppet: {show: 'P', math: 'P_{uppet}', meaning: 'Puppet Class tier; translates Elite priorities into statutes (Eq. 2.2)', slot: 2},
  Enforce: {show: 'F', math: 'F_{enforce}', meaning: 'Enforcement Class tier; carries out the legal code by force (Eq. 2.2)', slot: 13},
  IBuffer: {show: 'I_buffer', math: 'I_{buffer}', meaning: 'Buffer Class tier; defends the hierarchy for status and material allocation (Eq. 2.2)', slot: 0},
  ORacialized: {show: 'O_racialized', math: 'O_{racialized}', meaning: 'racialized Out-group at the cone base (Eq. 2.2)', slot: 3},
  // Eq. 4.2 (1691 Boundary Enforcement Act), YT02 turn 182. Slots are reused because the
  // 14-slot palette is full; no shared scene mixes these with the earlier slot owners.
  BufferClassSet: {show: 'I_buffer', math: 'I_{buffer}', meaning: 'Buffer Class set (Eq. 4.2)', slot: 7},
  // Delta-max rule (Concession Theorem, Chapter 15), YT02 turns 186–187.
  DeltaMax: {show: 'Δmax', math: 'Δ_{max}', meaning: "change in the Elite's maximum extraction share across a policy reform", slot: 2},
  // Eq. 2.7 (kernel optimization objective), YT02 turns 189–190.
  ExtractionE: {show: 'E(t)', math: 'E(t)', meaning: 'extraction output (Eq. 2.7)', slot: 5},
  CoherenceM: {show: 'M(t)', math: 'M(t)', meaning: 'cross-group class coherence (Eq. 2.7)', slot: 12},
  Tau: {show: 'τ', math: 'τ', meaning: 'critical revolutionary threshold (Eq. 2.7)', slot: 13},
  // Eq. 2.3 / Eq. 2.4 refinements, introduced in YT02 turns 197–204.
  OAdjacent: {show: 'O adjacent', math: 'O_{adjacent}', meaning: 'adjacent out-group subset sequence', slot: 7},
  XLocal: {show: 'X', meaning: 'any tier or subset under local partition', slot: 3},
  XPlusAlpha: {show: 'X plus alpha', math: 'X_{+alpha}', meaning: 'locally advantaged half on alpha', slot: 0},
  XMinusAlpha: {show: 'X minus alpha', math: 'X_{-alpha}', meaning: 'locally disadvantaged half on alpha', slot: 6},
  // Eq. 3.2 (Portuguese domestic-status allocation), introduced in YT02 turns 267–269.
  StatusInGroup: {show: 'S in', math: 'S_{in}', meaning: 'status of the in-group', slot: 2},
  BaseHumanity: {show: 'B', meaning: 'base humanity', slot: 7},
  SuppressionPsi: {show: 'psi(t)', math: 'ψ(t)', meaning: 'suppression allocation', slot: 1},
  PsychologicalStatusWage: {show: 'W psych', math: 'W_{psych}', meaning: 'psychological status wage', slot: 12},
  MaterialConcessions: {show: 'M', meaning: 'material concessions', slot: 8},
} as const;

export type EquationTermId = keyof typeof EQUATION_TERMS;

export const equationTermIds = Object.keys(EQUATION_TERMS) as EquationTermId[];
