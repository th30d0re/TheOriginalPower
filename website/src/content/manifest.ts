// The whole book, declared up front.
//
// The manifest lists every chapter and appendix in manuscript order, whether or
// not its interactive content has been authored yet. The story index renders
// from this file, so the full shape of the book is visible from day one and
// chapters light up as their modules land in content/chapters/index.ts.
//
// Source of truth for ordering: Paper/The_Original_Power.tex, sliced by
// tools/slice_chapters.py into Paper/chapters_src/ (gitignored, regenerable).
// `sourceFile` names each entry's slice.
//
// Ids do NOT follow the stale chapters/*.pdf filenames from May 2026; those
// predate several restructurings of the manuscript.

export type Part =
  | 'Foundations'
  | 'Origins'
  | 'Mechanism'
  | 'The Present'
  | 'Horizon'
  | 'Reference';

export interface ManifestEntry {
  /** Canonical route id: /story/:id */
  id: string;
  slug: string;
  /** Display number. Appendices continue the sequence but render as letters. */
  number: number;
  /** Appendix letter, when this entry is an appendix. */
  appendixLetter?: string;
  /** Full manuscript chapter title. */
  title: string;
  /** Card-length title. */
  shortTitle: string;
  era: string;
  hook: string;
  accentColor: string;
  part: Part;
  /** Filename under Paper/chapters_src/. */
  sourceFile: string;
}

/**
 * Accent colors trace one continuous hue rotation across the book — gold at the
 * formal foundations, through rust and magenta in the historical mechanism,
 * into violet and blue in the present, resolving to teal at the horizon. The
 * index page reads as a spectrum, which is the book's own governing metaphor.
 */
export const manifest: ManifestEntry[] = [
  {
    id: 'ch00',
    slug: 'system-initialization',
    number: 0,
    title: 'System Initialization: The Geometry of Extraction',
    shortTitle: 'System Initialization',
    era: 'Foundations',
    hook: 'Sets, axes, and the extraction operator the rest of the book runs on.',
    accentColor: '#e0b34c',
    part: 'Foundations',
    sourceFile: '01_system_initialization_the_geometry_of_ex.tex',
  },
  {
    id: 'ch01',
    slug: 'dynamical-systems',
    number: 1,
    title: 'Dynamical Systems Formulation of the Extraction Architecture',
    shortTitle: 'Dynamical Systems Formulation',
    era: 'Foundations',
    hook: 'The architecture restated as a dynamical system: state, control input, and who has one.',
    accentColor: '#d9a441',
    part: 'Foundations',
    sourceFile: '02_dynamical_systems_formulation_of_the_ext.tex',
  },
  {
    id: 'ch02',
    slug: 'redefining-racism',
    number: 2,
    title: 'Redefining Racism',
    shortTitle: 'Redefining Racism',
    era: 'The Definition',
    hook: 'Racism as an elite extraction algorithm rather than individual prejudice.',
    accentColor: '#e08a3c',
    part: 'Foundations',
    sourceFile: '03_redefining_racism.tex',
  },
  {
    id: 'ch03',
    slug: 'version-1-0',
    number: 3,
    title: 'Version 1.0: Initializing the Vector (15th-Century Portugal)',
    shortTitle: 'Version 1.0',
    era: '15th-Century Portugal',
    hook: 'Lisbon compiles the first racial vector.',
    accentColor: '#d2703a',
    part: 'Origins',
    sourceFile: '04_version_1_0_initializing_the_vector_15th.tex',
  },
  {
    id: 'ch04',
    slug: 'bacons-rebellion',
    number: 4,
    title:
      "The Application: Bacon's Rebellion, the Buffer Class, and the Constitutional Patch",
    shortTitle: "Bacon's Rebellion",
    era: '1676–1787',
    hook: 'A multiracial rebellion produces the buffer class and a constitutional patch.',
    accentColor: '#c85a34',
    part: 'Origins',
    sourceFile: '05_the_application_bacon_s_rebellion_the_bu.tex',
  },
  {
    id: 'ch05',
    slug: 'constitutional-kernel',
    number: 5,
    title: 'The Constitutional Kernel: Firmware, Bootloader, and Power Supply',
    shortTitle: 'The Constitutional Kernel',
    era: '1787–1791',
    hook: 'Firmware, bootloader, and power supply of the American system.',
    accentColor: '#bf4a35',
    part: 'Origins',
    sourceFile: '06_the_constitutional_kernel_firmware_bootl.tex',
  },
  {
    id: 'ch06',
    slug: 'haitian-export',
    number: 6,
    title:
      'The Haitian Export: Hemispheric Liberation, Vexillological Contagion, and the Firmin Protocol',
    shortTitle: 'The Haitian Export',
    era: '1803–1915',
    hook: 'Hemispheric liberation, vexillological contagion, and the Firmin Protocol.',
    accentColor: '#c2453f',
    part: 'Origins',
    sourceFile: '07_the_haitian_export_hemispheric_liberatio.tex',
  },
  {
    id: 'ch07',
    slug: 'architecture-of-kinship',
    number: 7,
    title:
      'The Architecture of Kinship: Pre-Colonial African Intimacy and the Colonial Extraction of Family',
    shortTitle: 'The Architecture of Kinship',
    era: 'Pre-colonial → 1950',
    hook: 'Pre-colonial African intimacy and the colonial extraction of family.',
    accentColor: '#b83f4e',
    part: 'Origins',
    sourceFile: '08_the_architecture_of_kinship_pre_colonial.tex',
  },
  {
    id: 'ch08',
    slug: 'gendered-axis',
    number: 8,
    title: 'The Gendered Axis: Coverture, Eugenics, and the Reproductive Extraction Kernel',
    shortTitle: 'The Gendered Axis',
    era: 'Coverture → Eugenics',
    hook: 'Coverture, eugenics, and the reproductive extraction kernel.',
    accentColor: '#ad3a5c',
    part: 'Origins',
    sourceFile: '09_the_gendered_axis_coverture_eugenics_and.tex',
  },
  {
    id: 'ch09',
    slug: 'enforcement-engine',
    number: 9,
    title:
      'The Enforcement Engine: Slave Patrols, the 13th Amendment, and the Compounding Model',
    shortTitle: 'The Enforcement Engine',
    era: '1704–1865',
    hook: 'Slave patrols, the 13th Amendment, and the compounding model.',
    accentColor: '#a3356b',
    part: 'Mechanism',
    sourceFile: '10_the_enforcement_engine_slave_patrols_the.tex',
  },
  {
    id: 'ch10',
    slug: 'the-containment',
    number: 10,
    title: 'The Containment: Pullman, Redlining, and the Wages of Whiteness',
    shortTitle: 'The Containment',
    era: '1894–1965',
    hook: 'Pullman, redlining, and the wages of whiteness.',
    accentColor: '#97327a',
    part: 'Mechanism',
    sourceFile: '11_the_containment_pullman_redlining_and_th.tex',
  },
  {
    id: 'ch11',
    slug: 'tweedism',
    number: 11,
    title: 'Tweedism and the Puppet Class: The Algorithmic Filter on Democracy',
    shortTitle: 'Tweedism and the Puppet Class',
    era: 'The Filter',
    hook: 'The algorithmic filter that decides which candidates reach the ballot.',
    accentColor: '#8a3488',
    part: 'Mechanism',
    sourceFile: '12_tweedism_and_the_puppet_class_the_algori.tex',
  },
  {
    id: 'ch12',
    slug: 'the-recompile',
    number: 12,
    title: 'The Recompile: COINTELPRO, the Variable Swap, and the War on Drugs',
    shortTitle: 'The Recompile',
    era: '1968–1994',
    hook: 'COINTELPRO, the variable swap, and the War on Drugs.',
    accentColor: '#7b3894',
    part: 'Mechanism',
    sourceFile: '13_the_recompile_cointelpro_the_variable_sw.tex',
  },
  {
    id: 'ch13',
    slug: 'full-algorithm',
    number: 13,
    title:
      'The Full Algorithm: Demographic Paradox, Cannibalization, and the 5-Tier Reveal',
    shortTitle: 'The Full Algorithm',
    era: '1994–Present',
    hook: 'Demographic paradox, cannibalization, and the five-tier reveal.',
    accentColor: '#6c3d9e',
    part: 'Mechanism',
    sourceFile: '14_the_full_algorithm_demographic_paradox_c.tex',
  },
  {
    id: 'ch14',
    slug: 'kinetic-guarantee',
    number: 14,
    title:
      'The Kinetic Guarantee: Arms Asymmetry, the Second Amendment, and the Disarmament Timeline',
    shortTitle: 'The Kinetic Guarantee',
    era: 'Arms Asymmetry',
    hook: 'Arms asymmetry, the Second Amendment, and the disarmament timeline.',
    accentColor: '#5d44a6',
    part: 'The Present',
    sourceFile: '15_the_kinetic_guarantee_arms_asymmetry_the.tex',
  },
  {
    id: 'ch15',
    slug: 'the-contradiction',
    number: 15,
    title: 'The Contradiction: Why Reform Serves the Algorithm',
    shortTitle: 'The Contradiction',
    era: 'Why Reform Fails',
    hook: 'Reform as a subroutine the algorithm calls on itself.',
    accentColor: '#4f4bab',
    part: 'The Present',
    sourceFile: '16_the_contradiction_why_reform_serves_the.tex',
  },
  {
    id: 'ch16',
    slug: 'global-containment',
    number: 16,
    title: 'The Global Containment Field: Scaling the Algorithm',
    shortTitle: 'The Global Containment Field',
    era: 'Global Scale',
    hook: 'The algorithm scaled past the nation-state.',
    accentColor: '#4455ae',
    part: 'The Present',
    sourceFile: '17_the_global_containment_field_scaling_the.tex',
  },
  {
    id: 'ch17',
    slug: 'algorithmic-epoch',
    number: 17,
    title:
      'The Algorithmic Epoch: Real-Time Subjugation and the Necessity of the Counter-Virus',
    shortTitle: 'The Algorithmic Epoch',
    era: 'Present → Near Future',
    hook: 'Real-time subjugation and the necessity of the counter-virus.',
    accentColor: '#3b62b0',
    part: 'The Present',
    sourceFile: '18_the_algorithmic_epoch_real_time_subjugat.tex',
  },
  {
    id: 'ch18',
    slug: 'spectral-carrier',
    number: 18,
    title: 'The Spectral Carrier: Electoral Cycles and the Interference Engine',
    shortTitle: 'The Spectral Carrier',
    era: 'Electoral Cycles',
    hook: 'Electoral cycles as a carrier wave, and the interference engine that rides it.',
    accentColor: '#3572ae',
    part: 'Horizon',
    sourceFile: '19_the_spectral_carrier_electoral_cycles_an.tex',
  },
  {
    id: 'ch19',
    slug: 'post-kinetic-horizon',
    number: 19,
    title: 'The Post-Kinetic Horizon: The Open-Source Republic and the Perpetual Battle',
    shortTitle: 'The Post-Kinetic Horizon',
    era: 'The Horizon',
    hook: 'The open-source republic and the perpetual battle.',
    accentColor: '#3184a6',
    part: 'Horizon',
    sourceFile: '20_the_post_kinetic_horizon_the_open_source.tex',
  },
  {
    id: 'ch20',
    slug: 'single-issue-trap',
    number: 20,
    title:
      'The Single-Issue Trap and Multi-Axis Noise Cancellation: A Boston Case Study',
    shortTitle: 'The Single-Issue Trap',
    era: 'Case Study: Boston',
    hook: 'Multi-axis noise cancellation, tested on one city.',
    accentColor: '#2f9599',
    part: 'Horizon',
    sourceFile: '21_the_single_issue_trap_and_multi_axis_noi.tex',
  },
  {
    id: 'ch21',
    slug: 'conclusion',
    number: 21,
    title: 'Conclusion',
    shortTitle: 'Conclusion',
    era: 'Terminus',
    hook: 'What the algorithm implies, and what remains available.',
    accentColor: '#35a58c',
    part: 'Horizon',
    sourceFile: '22_conclusion.tex',
  },

  // ─── Reference ───────────────────────────────────────────────────────────
  {
    id: 'apxA',
    slug: 'statutory-sources',
    number: 22,
    appendixLetter: 'A',
    title: 'Primary Statutory Sources (United States Code)',
    shortTitle: 'Primary Statutory Sources',
    era: 'Reference',
    hook: 'The statutes cited throughout, collected for uninterrupted reading.',
    accentColor: '#64748b',
    part: 'Reference',
    sourceFile: '23_primary_statutory_sources_united_states.tex',
  },
  {
    id: 'apxB',
    slug: 'equation-registry',
    number: 23,
    appendixLetter: 'B',
    title: 'Equation Registry and Era-Level Calibration',
    shortTitle: 'Equation Registry',
    era: 'Reference',
    hook: 'Every numbered equation, with its tier and calibration.',
    accentColor: '#64748b',
    part: 'Reference',
    sourceFile: '24_equation_registry_and_era_level_calibrat.tex',
  },
  {
    id: 'apxC',
    slug: 'compiled-runtime-log',
    number: 24,
    appendixLetter: 'C',
    title: 'Compiled Runtime Log',
    shortTitle: 'Compiled Runtime Log',
    era: 'Reference',
    hook: 'Five centuries of execution trace, in one chronological sequence.',
    accentColor: '#64748b',
    part: 'Reference',
    sourceFile: '25_compiled_runtime_log.tex',
  },
  {
    id: 'apxD',
    slug: 'falsifiability',
    number: 25,
    appendixLetter: 'D',
    title: 'Falsifiability Conditions for the Two Terminal Theorems',
    shortTitle: 'Falsifiability Conditions',
    era: 'Reference',
    hook: 'The evidence that would defeat the Concession and Haitian Theorems.',
    accentColor: '#64748b',
    part: 'Reference',
    sourceFile: '26_falsifiability_conditions_for_the_two_te.tex',
  },
  {
    id: 'apxE',
    slug: 'geometric-algebra',
    number: 26,
    appendixLetter: 'E',
    title: 'Geometric Algebra and the N-Dimensional Wage',
    shortTitle: 'Geometric Algebra',
    era: 'Reference',
    hook: 'A formal language for non-additive compounding across axes.',
    accentColor: '#64748b',
    part: 'Reference',
    sourceFile: '27_geometric_algebra_and_the_n_dimensional.tex',
  },
  {
    id: 'apxF',
    slug: 'photon-model',
    number: 27,
    appendixLetter: 'F',
    title: 'The Photon Model of Polarizing Information',
    shortTitle: 'The Photon Model',
    era: 'Reference',
    hook: 'Discrete information packets as carriers of polarization.',
    accentColor: '#64748b',
    part: 'Reference',
    sourceFile: '28_the_photon_model_of_polarizing_informati.tex',
  },
  {
    id: 'apxG',
    slug: 'universality',
    number: 28,
    appendixLetter: 'G',
    title: 'Universality and the Finite Topology of Power',
    shortTitle: 'Universality',
    era: 'Reference',
    hook: 'The conjecture that the topology of power is finite.',
    accentColor: '#64748b',
    part: 'Reference',
    sourceFile: '29_universality_and_the_finite_topology_of.tex',
  },
];

export const PART_ORDER: Part[] = [
  'Foundations',
  'Origins',
  'Mechanism',
  'The Present',
  'Horizon',
  'Reference',
];

export function getManifestEntry(id: string): ManifestEntry | undefined {
  return manifest.find((e) => e.id === id);
}

/** Display label for a card: '07' for chapters, 'A' for appendices. */
export function displayNumber(entry: ManifestEntry): string {
  return entry.appendixLetter ?? String(entry.number).padStart(2, '0');
}
