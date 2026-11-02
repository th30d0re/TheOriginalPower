export const EQUATION_TERMS = {
  X: {show: 'X', meaning: 'raw sensory input', slot: 0},
  T: {show: 'T', meaning: 'threat/status interpretation', slot: 2},
  PiRace: {show: 'PiRace', math: 'Π_{race}', meaning: 'the installed racial prior', slot: 1},
  i: {show: 'i', math: '_i', meaning: 'the individual', slot: 9},
  IndividualPrejudice: {show: 'Individual Prejudice', meaning: 'Eq. 2.5, term 1', slot: 13},
  DiscriminatoryActions: {show: 'Discriminatory Actions', meaning: 'Eq. 2.5, term 2', slot: 5},
  SystemicOutcomes: {show: 'Systemic Outcomes', meaning: 'Eq. 2.5, term 3', slot: 4},
} as const;

export type EquationTermId = keyof typeof EQUATION_TERMS;

export const equationTermIds = Object.keys(EQUATION_TERMS) as EquationTermId[];
