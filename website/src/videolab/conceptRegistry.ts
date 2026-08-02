export interface ConceptDefinition {
  title: string;
  description: string;
}

export const conceptRegistry: Record<string, ConceptDefinition> = {
  demographic_charge: { title: 'Demographic charge', description: 'Charge assigned to a person at the social software layer.' },
  institutional_field: { title: 'Institutional field', description: 'The institutional electric field that produces material force.' },
  lorentz_force: { title: 'Lorentz force', description: 'Racism represented as the vector force F = qE.' },
  thermal_velocity: { title: 'Thermal velocity', description: 'Undirected prejudice represented as thermal motion.' },
  complex_wage: { title: 'Complex wage', description: 'The phasor separates material and status wages.' },
  phase_angle: { title: 'Phase angle', description: 'The phasor angle shows the material-to-status wage ratio.' },
  fascism_threshold: { title: 'Fascism threshold', description: 'Quadrant II begins when the material component turns negative.' },
  squaring_property: { title: 'Squaring property', description: 'The imaginary status term squares into a negative quantity.' },
  conjugate_solidarity: { title: 'Conjugate solidarity', description: 'Conjugation cancels status and doubles the material term.' },
  quaternion_intersection: { title: 'Quaternion intersection', description: 'Intersecting demographic axes combine multiplicatively.' },
  demographic_weight: { title: 'Demographic weight', description: 'Field coupling changes with demographic weight.' },
  orthogonal_deflection: { title: 'Orthogonal deflection', description: 'The magnetic term redirects motion without material work.' },
  cyclotron_trap: { title: 'Cyclotron trap', description: 'The phasor shows high symbolic energy with no material displacement.' },
  interference_engine: { title: 'Interference engine', description: 'Phased cultural fields jam vertical solidarity.' },
  extraction_kernel: { title: 'Extraction kernel', description: 'The chart locates actors that capture material value.' },
  buffer_class: { title: 'Buffer class', description: 'Out-group expansion shows the intermediary class stabilising extraction.' },
  psychological_wage: { title: 'Psychological wage', description: 'Status compensation appears as the imaginary wage component.' },
  snubber_circuit: { title: 'Snubber circuit', description: 'A social channel dissipates pressure before structural decoupling.' },
  inductive_kickback: { title: 'Inductive kickback', description: 'Abrupt change produces a reactionary voltage spike.' },
  enclosure_capacitance: { title: 'Enclosure capacitance', description: 'Generational wealth stores material charge across time.' },
  bureaucratic_resistance: { title: 'Bureaucratic resistance', description: 'Administrative friction limits material current.' },
  redlining_diode: { title: 'Redlining diode', description: 'A one-way junction permits extraction while blocking return flow.' },
  op_amp_media: { title: 'Op-amp media', description: 'Media systems amplify small social differences into large signals.' },
};

export function conceptDefinition(id: string): ConceptDefinition {
  return conceptRegistry[id] ?? {
    title: id.replaceAll('_', ' '),
    description: 'This declared concept does not have a registered visual yet.',
  };
}
