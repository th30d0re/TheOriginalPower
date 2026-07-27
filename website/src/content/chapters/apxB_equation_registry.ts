// Appendix B — Equation Registry and Era-Level Calibration
//
// Source: Paper/chapters_src/24_equation_registry_and_era_level_calibrat.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory and use the registry labels established there.
import type { ChapterContent } from '../types';

const apxB: ChapterContent = {
  meta: {
    id: 'apxB',
    slug: 'equation-registry',
    number: 27,
    title: 'Equation Registry and Era-Level Calibration',
    era: 'Reference',
    hook: 'Every numbered equation, with its tier and calibration.',
    accentColor: '#64748b',
    heroVisual: {
      kind: 'equation',
      latex:
        '\\max_{\\{P_i\\}}\\; \\mathcal{E}(t) \\quad \\text{subject to} \\quad M_{\\text{eff}}(t) = M(t) - \\lambda\\,\\Phi_{\\text{load}}(t) < \\tau',
      label: 'eq. 19.1',
    },
  },

  scenes: [
    {
      id: 'how-to-use-the-registry',
      title: 'How to Use This Registry',
      prose: [
        'This appendix collects the governing optimization algorithm, the Unified Electrodynamic Framework, the canonical symbol definitions, and the era-level calibration ranges in one reference.',
        'The entries connect kernel semantics to dynamic state variables. The calibration matrix then places those variables on a normalized scale for comparison across runtimes.',
      ],
      keyConcepts: [
        {
          term: 'Kernel objective',
          definition:
            'The time-indexed extraction output routed toward the Elite under a class-coherence threshold.',
        },
        {
          term: 'Calibration interval',
          definition:
            'A bounded internal range on a normalized [0,1] scale used for comparison across eras.',
        },
      ],
    },

    {
      id: 'predatory-min-max',
      title: 'The Predatory Min-Max Function',
      prose: [
        'The canonical entry defines the full hierarchy as Elite within Puppet Class, Puppet Class within Buffer Class, and Buffer Class within the in-group. The racialized Out-group remains disjoint from the in-group.',
        'The kernel maximizes time-indexed extraction while effective class coherence remains below the collapse threshold. The suppression envelope combines psychological wage, material wage, kinetic repression, and aggregate phase-dispersion load.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\max_{\\{P_i\\}}\\; \\mathcal{E}(t) \\quad \\text{subject to} \\quad M_{\\text{eff}}(t) = M(t) - \\lambda\\,\\Phi_{\\text{load}}(t) < \\tau',
            label: 'eq. 19.1',
            caption: 'Kernel objective under the effective-resistance constraint.',
          },
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Canonical kernel entry',
          paragraphs: [
            'Effective resistance subtracts the phase-dispersion load, weighted by lambda, from the class-coherence threat.',
            'The crash condition occurs when class coherence grows faster than the suppression envelope and effective coherence exceeds the threshold.',
            'The tier ordering places Elite benefit above Puppet, Enforcement, Buffer, and racialized Out-group benefit.',
          ],
          equations: [
            {
              latex: 'M_{\\text{eff}}(t) = M(t) - \\lambda\\,\\Phi_{\\text{load}}(t)',
              label: 'eq. 19.1a',
            },
            {
              latex:
                '\\Sigma_{\\text{sup}}(t) = \\psi_s(t) + \\psi_m(t) + R(t) + \\Phi_{\\text{load}}(t)',
              label: 'eq. 19.2',
            },
            {
              latex:
                '\\frac{dM}{dt} > \\frac{d\\Sigma_{\\text{sup}}}{dt} \\quad \\Longleftrightarrow \\quad M_{\\text{eff}}(t) > \\tau',
              label: 'eq. 19.3',
            },
            {
              latex:
                '\\text{Benefit}(E) \\gg \\text{Benefit}(P_{\\text{uppet}}) > \\text{Benefit}(F_{\\text{enforce}}) > \\text{Benefit}(I_{\\text{buffer}}) > \\text{Benefit}(O_{\\text{racialized}})',
              label: 'eq. 19.4',
            },
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Invariants and boundary dynamics',
          paragraphs: [
            'The Concession Invariant covers every non-kinetic reform in the 1450–2026 dataset: the change in the maximum remains zero.',
            'Material suppression allocation becomes positive only as class coherence approaches the threshold, with its source in increased racialized Out-group extraction.',
            'The reclassification operator executes when an individual’s kinetic capacity exceeds the tolerated level or the individual ceases to comply. It moves that individual from the Buffer Class to the final Out-group and removes the psychological wage instantaneously. The source identifies Christiana 1851, Hamburg 1876, Mulford 1967, Ruby Ridge 1992, Waco 1993, and Perdi 2026 as empirical instantiations.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Suppression envelope',
          definition:
            'The combined psychological, material, kinetic, and phase-dispersion controls applied to class coherence.',
        },
        {
          term: 'Crash condition',
          definition:
            'The state in which effective class coherence exceeds the domestic collapse threshold.',
        },
      ],
    },

    {
      id: 'electrodynamic-root',
      title: 'The Electrodynamic Root',
      prose: [
        'The Unified Electrodynamic Framework translates the set-theoretic and wave-physics formalisms into one hardware layer. Its root equation combines the material-wage electric field with the superposition of cultural magnetic fields.',
        'The intersectional charge multivector couples to both terms. The magnetic cross product remains orthogonal to velocity and performs zero work.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\vec{F}_{\\text{total}} = \\mathbf{Q}\\,\\vec{\\mathcal{E}}_{\\text{mat}} + \\mathbf{Q}\\left(\\vec{v} \\times \\sum_{k=1}^{N} \\rho_k \\vec{B}_k\\right)',
            label: 'eq. 19.5',
            caption: 'The Unified Lorentz Force.',
          },
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Complex suppression allocation',
          paragraphs: [
            'The material wage occupies the real axis and the psychological wage occupies the imaginary axis. The phase angle diagnoses the operating mode: 90° marks the purely psychological default, and an angle above 90° marks the Quadrant II fascism threshold.',
            'Complex-conjugate alignment between the Buffer Class and the Out-group cancels the imaginary status wage and doubles real material power.',
            'AC complex power decomposes into a real material wage and a reactive psychological wage. DC mode is the zero-angle limit.',
          ],
          equations: [
            {
              latex: 'W = \\psi_m + j\\psi_s',
              label: 'eq. 19.6',
            },
            {
              latex: 'W + W^* = 2\\psi_m',
              label: 'eq. 19.7',
            },
            {
              latex:
                'S = V \\cdot I^{*} = |V|\\,|I|\\,e^{j\\theta} = P_{\\text{real}} + jQ_{\\text{reactive}}',
              label: 'eq. 19.11',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Real power',
          definition: 'The material wage represented by the real component of complex power.',
        },
        {
          term: 'Reactive power',
          definition:
            'The psychological wage represented by the imaginary component of complex power.',
        },
      ],
    },

    {
      id: 'mechanisms-work-and-accounting',
      title: 'Mechanisms, Work, and Accounting',
      prose: [
        'The remaining electrodynamic entries specify resistance, enclosure, backlash, intersectional phase current, systemic work, historical accounting, and the extraction constraint.',
        'Each equation maps a physical quantity to an institutional mechanism defined in the source.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Resistance, capacitance, and kickback',
          paragraphs: [
            'Systemic resistance rises as mean free time between collisions falls. Stop-and-frisk, welfare audits, and algorithmic flags supply the modeled collisions with the state.',
            'Enclosure capacitance maps the legal dielectric to property rights, inheritance law, and FHA lending; plate area to geographic scope; and distance to redlining and segregation.',
            'Inductive kickback represents fascist backlash released from cultural inertia when reform attempts to break the oppressive current.',
          ],
          equations: [
            {
              latex: 'R = \\frac{m \\cdot L}{n \\cdot q^2 \\cdot \\tau \\cdot A}',
              label: 'eq. 19.8',
            },
            {
              latex: 'C = \\frac{\\epsilon A}{d}',
              label: 'eq. 19.9',
            },
            {
              latex: 'V = -L\\,\\frac{di}{dt}',
              label: 'eq. 19.10',
            },
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Phase current at the Elite node',
          paragraphs: [
            'The phase-current equation generalizes three-phase AC across N extraction axes. Population and coupling weights combine with amplitudes and interference-engine phase settings.',
            'Kirchhoff’s law preserves extraction-current conservation under axis dropout by rebalancing the remaining axes according to their population and coupling weights.',
          ],
          equations: [
            {
              latex:
                'I_E(t) = \\sum_{k=1}^{N} \\rho_k\\,A_k\\,\\cos\\!\\bigl(\\omega t + \\phi_k\\bigr)',
              label: 'eq. 19.12',
            },
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'W_{I_{\\text{buffer}}}^{\\text{psych}}(t_0, t_1) = \\int_{t_0}^{t_1} \\mathbf{Q}\\,(\\vec{v} \\times \\vec{B}) \\cdot \\vec{v}\\, d\\tau \\;\\equiv\\; 0',
            label: 'eq. 19.13',
            caption: 'The Buffer-Class Work Theorem.',
          },
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Work and reparations',
          paragraphs: [
            'The psychological wage performs zero systemic work on the Buffer Class over every interval because the magnetic cross product is orthogonal to velocity. The source identifies this as the formal proof of Du Bois’s public and psychological wage.',
            'The reparations integral accumulates real power flowing from the Out-group node to the Elite node. Its documented initialization dates are 1444 for the Portuguese system, 1492 for Hispaniola, and 1619 for the United States.',
            'Craemer’s compounded-labor calibration yields $14–17 trillion. Darity and Mullen’s wealth-gap-closure calibration yields $10–12 trillion. Coates supplies the public articulation through a housing, education, and credit survey. The registry assigns Tier 2 confidence based on multiple independent peer-reviewed calibrations.',
          ],
          equations: [
            {
              latex:
                '\\mathcal{R}(t_0, t_{\\text{now}}) = \\int_{t_0}^{t_{\\text{now}}} \\operatorname{Re}\\!\\Bigl[V_{\\text{state}}(\\tau)\\, I_{O}^{*}(\\tau)\\Bigr]\\, d\\tau',
              label: 'eq. 19.14',
            },
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Augmented Lagrangian root',
          paragraphs: [
            'Mobilized social capacity supplies kinetic energy. The engineered constraint landscape includes systemic diodes, redlining boundaries, and Lyapunov ceilings. Rayleigh dissipation represents bureaucratic friction, policing drag, and administrative heat loss.',
            'Lambda is the marginal cost of suppression represented by the Complex Wage. The effective-coherence constraint enforces the rebellion threshold.',
          ],
          equations: [
            {
              latex:
                '\\mathcal{L}^*(q,\\dot{q},t) = T(\\dot{q},t) - V(q,t) - \\mathcal{D}(q,\\dot{q},t) + \\lambda\\bigl(\\tau - M_{\\mathrm{eff}}(t)\\bigr)',
              label: 'Augmented Lagrangian root equation',
            },
          ],
        },
      ],
    },

    {
      id: 'symbols-and-calibration',
      title: 'Canonical Symbols and Era Calibration',
      prose: [
        'The canonical symbol registry separates the Elite set from the extraction output function and reserves psi for the psychological wage. Phase operations use phi and capital phi. The reclassification symbol is distinguished by arity: the argument-free form denotes the set of non-kinetic reforms, while the form with an individual argument denotes the boundary operator.',
        'The calibration matrix uses bounded intervals on a normalized [0,1] scale. Tier 1 marks multi-source quantitative alignment, Tier 2 marks mixed quantitative and structural diagnostics, and Tier 3 marks a structurally supported comparative estimate with fragmented data.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Core dynamic symbols',
          paragraphs: [
            'Extraction output is the time-indexed objective routed toward the Elite. Class-coherence threat is the dynamic analogue of minimum stress. Tau is the domestic collapse threshold.',
            'The suppression allocation combines a continuously active status wage with a nonnegative material wage deployed as class coherence approaches the threshold. Kinetic repression capacity enters through the Enforcement Class.',
            'Aggregate phase-dispersion load contributes to the suppression envelope. The net class-solidarity signal is tested against the threshold. The diagnostic ratio measures proximity as class coherence divided by the threshold.',
            'Temporal Enclosure comprises sovereign debt instruments that securitize future labor and transfer discounted future labor surplus to the Elite. The annual financial-repression increment is positive when inflation exceeds interest and the real rate is negative.',
            'The architecture variable identifies the legal, monetary, and institutional substrate active at a historical moment. Elite asset continuity requires the change in the Elite asset base across an Interface Swap to remain greater than or equal to zero.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Era-level interference calibration matrix',
          paragraphs: [
            'Lisbon: phase load [0.10, 0.20], threshold proximity [0.70, 0.85], Tier 2.',
            'Bacon crash through constitutional patch dynamics: phase load [0.15, 0.55], threshold proximity (1.00, 0.75], with the 1.0 Bacon anchor, Tier 1.',
            'Enforcement-class consolidation: phase load [0.45, 0.60], threshold proximity [0.45, 0.65], Tier 2.',
            'Gendered axis: phase load [0.35, 0.55], threshold proximity [0.40, 0.60], Tier 2.',
            '1870s–1960s: phase load [0.55, 0.72], threshold proximity [0.50, 0.68], Tier 1.',
            'Variable Swap through the present: phase load [0.75, 0.92], threshold proximity [0.80, 0.98], Tier 1.',
            'Great Recession Recompile: phase load [0.78, 0.90], threshold proximity [0.82, 0.96], Tier 1.',
            'Ruby Ridge, Waco, and OKC: phase load [0.70, 0.85], threshold proximity [0.72, 0.88], Tier 1.',
            'Disarmament timeline: phase load [0.60, 0.85], threshold proximity [0.70, 0.95], Tier 2.',
            'Prescriptive stress test: phase load [0.82, 0.95], threshold proximity [0.92, 1.05], Tier 2.',
            'Global scaling: phase load [0.50, 0.90], threshold proximity [0.55, 0.95], Tier 3.',
            'Final output: phase load [0.85, 0.97], threshold proximity [0.95, 1.08], Tier 2.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Phase load',
          definition: 'Aggregate phase-dispersion load across active subgroups.',
        },
        {
          term: 'Threshold proximity',
          definition: 'The ratio of class-coherence threat to the collapse threshold.',
        },
        {
          term: 'Confidence tier',
          definition:
            'The registry’s classification of quantitative alignment, structural diagnostics, and comparative-data completeness.',
        },
      ],
    },
  ],
};

export default apxB;
