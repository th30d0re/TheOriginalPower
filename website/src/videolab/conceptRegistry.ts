import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export type WidgetKey = 'phasor' | 'interference' | 'extraction' | 'outgroup';

export interface ConceptDefinition {
  title: string;
  description: string;
  widget?: WidgetKey;
}

export const widgetRegistry: Record<WidgetKey, LazyExoticComponent<ComponentType<Record<string, unknown>>>> = {
  phasor: lazy(() => import('../components/visualizations/PhasorResonance')),
  interference: lazy(() => import('../components/visualizations/InterferenceEngine3D')),
  extraction: lazy(() => import('../components/visualizations/ExtractionChart')),
  outgroup: lazy(() => import('../components/visualizations/OutgroupExpansion')),
};

export const conceptRegistry: Record<string, ConceptDefinition> = {
  demographic_charge: { title: 'Demographic charge', description: 'Charge assigned to a person at the social software layer.' },
  institutional_field: { title: 'Institutional field', description: 'The institutional electric field that produces material force.' },
  lorentz_force: { title: 'Lorentz force', description: 'Racism represented as the vector force F = qE.' },
  thermal_velocity: { title: 'Thermal velocity', description: 'Undirected prejudice represented as thermal motion.' },
  complex_wage: { title: 'Complex wage', description: 'The phasor separates material and status wages.', widget: 'phasor' },
  phase_angle: { title: 'Phase angle', description: 'The phasor angle shows the material-to-status wage ratio.', widget: 'phasor' },
  fascism_threshold: { title: 'Fascism threshold', description: 'Quadrant II begins when the material component turns negative.', widget: 'phasor' },
  squaring_property: { title: 'Squaring property', description: 'The imaginary status term squares into a negative quantity.', widget: 'phasor' },
  conjugate_solidarity: { title: 'Conjugate solidarity', description: 'Conjugation cancels status and doubles the material term.', widget: 'phasor' },
  quaternion_intersection: { title: 'Quaternion intersection', description: 'Intersecting demographic axes combine multiplicatively.' },
  demographic_weight: { title: 'Demographic weight', description: 'Field coupling changes with demographic weight.' },
  orthogonal_deflection: { title: 'Orthogonal deflection', description: 'The magnetic term redirects motion without material work.', widget: 'interference' },
  cyclotron_trap: { title: 'Cyclotron trap', description: 'The phasor shows high symbolic energy with no material displacement.', widget: 'phasor' },
  interference_engine: { title: 'Interference engine', description: 'Phased cultural fields jam vertical solidarity.', widget: 'interference' },
  extraction_kernel: { title: 'Extraction kernel', description: 'The chart locates actors that capture material value.', widget: 'extraction' },
  buffer_class: { title: 'Buffer class', description: 'Out-group expansion shows the intermediary class stabilising extraction.', widget: 'outgroup' },
  psychological_wage: { title: 'Psychological wage', description: 'Status compensation appears as the imaginary wage component.', widget: 'phasor' },
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
