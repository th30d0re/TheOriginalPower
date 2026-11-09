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
  RacismVector: {show: 'R', math: 'R⃗_{racism}', meaning: 'the conceptual racism vector', slot: 11},
  Magnitude: {show: 'M', math: 'M_{force}', meaning: 'emotional and material magnitude', slot: 12},
  StateDirection: {show: 'd̂', math: 'd̂_{state}', meaning: 'unit direction of state and institutional enforcement', slot: 13},
  // Eq. 2.1 (coarse binary partition), introduced in YT02 turns 124–140. Operators are
  // spelled as words in the scene because IBM Plex Mono has no union/intersection glyphs.
  U: {show: 'U', meaning: 'total population (Eq. 2.1)', slot: 2},
  I: {show: 'I', meaning: 'dominant racial in-group (Eq. 2.1)', slot: 0},
  O: {show: 'O', meaning: 'marginalized out-group (Eq. 2.1)', slot: 1},
} as const;

export type EquationTermId = keyof typeof EQUATION_TERMS;

export const equationTermIds = Object.keys(EQUATION_TERMS) as EquationTermId[];
