// Appendix E — Geometric Algebra and the N-Dimensional Wage
//
// Source: Paper/chapters_src/27_geometric_algebra_and_the_n_dimensional.tex
// Adapted prose is derived from that slice only. Equations are lifted
// verbatim from the slice's inventory.
import type { ChapterContent } from '../types';

const apxE: ChapterContent = {
  meta: {
    id: 'apxE',
    slug: 'geometric-algebra',
    number: 30,
    title: 'Geometric Algebra and the N-Dimensional Wage',
    era: 'Reference',
    hook: 'A formal language for non-additive compounding across axes.',
    accentColor: '#64748b',
  },

  scenes: [
    {
      id: 'formal-language',
      title: 'A Speculative Formal Language',
      prose: [
        'This appendix extends the two-dimensional Complex Wage across multiple simultaneous, orthogonal axes of oppression. It gives readers a formal language for describing non-additive intersectional compounding.',
        'The extension has Tier 3 status throughout and carries no calibrated measurement content. Its role is directional and structural, with empirical authority resting on the historical chapters and tier-tagged case studies.',
      ],
      keyConcepts: [
        {
          term: 'Scope',
          definition:
            'A speculative higher-dimensional encoding offered as a formal language for future development.',
        },
        {
          term: 'Calibration status',
          definition:
            'Tier 3 ordinal and structural mathematics with no calibrated measurement content.',
        },
      ],
    },

    {
      id: 'quaternion-stage',
      title: 'The Quaternion Stage',
      prose: [
        'Three primary axes—race, gender, and sexuality—extend the standard complex number into a quaternion. Each axis carries a material wage and a psychological wage. The real component is the sum of the three material wages. The imaginary components are the psychological wages on race, gender, and sexuality.',
        'The distinct imaginary units supply orthogonal directions. Their multiplication encodes an intersection as a distinct vector with its own direction.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex: 'W_Q = a + bi + cj + dk',
            caption: 'The quaternion extension of the Complex Wage.',
          },
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Multiplicative Intersection Compounding (Misogynoir)',
          paragraphs: [
            'Because the three imaginary units are mathematically orthogonal and multiply according to quaternion rules, the racial wage axis and gendered wage axis produce a distinct third vector.',
            'For a Black woman, this vector specifies a unique plane of systemic extraction that requires both axes. The theorem formalizes Kimberlé Crenshaw’s theory of intersectionality as a quaternion multiplication law.',
          ],
          equations: [
            {
              latex: 'i \\times j = k, \\quad j \\times i = -k',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Quaternion',
          definition:
            'A four-component algebraic structure with one real component and three distinct imaginary components.',
        },
      ],
    },

    {
      id: 'weighted-summation',
      title: 'The N-Dimensional Weighted Summation',
      prose: [
        'Beyond three axes, Geometric Algebra uses N orthogonal imaginary bases. Each axis carries a material wage and a psychological wage. The full Complex Wage is the weighted sum of those pairs.',
        'The Demographic Weight Coefficient on an axis scales that axis’s pair. The coefficient is the proportion of the population for whom the axis is a primary axis of marginalization, scaled by the institutional bandwidth devoted to that axis. The material wages add on the real line. Each psychological wage lies on its own imaginary basis.',
      ],
      visual: {
        kind: 'equation',
        latex: 'W = \\sum_{k=1}^{N} \\rho_k \\left(\\psi_{m,k} + j_k \\psi_{s,k}\\right)',
        caption: 'The N-dimensional Complex Wage. Each axis contributes a material and psychological pair.',
      },
      keyConcepts: [
        {
          term: 'ψₘ,ₖ',
          definition: 'The material wage on axis k, the real component of that axis’s pair.',
        },
        {
          term: 'jₖ',
          definition:
            'The kth imaginary basis, including race, gender, ability, sexuality, neurology, and height or physicality. It holds the psychological wage of axis k orthogonal to that axis’s material wage.',
        },
        {
          term: 'ψₛ,ₖ',
          definition: 'The psychological wage on axis k.',
        },
        {
          term: 'ρₖ',
          definition: 'The Demographic Weight Coefficient for axis k. It scales the material and psychological pair on that axis.',
        },
      ],
    },

    {
      id: 'high-voltage-low-current',
      title: 'High Voltage, Low Current',
      prose: [
        'The electrical analog treats reactive power as voltage multiplied by current, with current representing population size. A small demographic coefficient paired with a large required reactive power produces a high required voltage.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex: 'P_k = V_k \\cdot I_k \\implies V_k = \\frac{P_k}{\\rho_k}',
            caption: 'Required voltage rises as the demographic coefficient approaches zero.',
          },
        },
        {
          kind: 'insight',
          heading: 'The Transphobia Paradox',
          paragraphs: [
            'As the demographic coefficient approaches zero, the required voltage approaches infinity. The framework predicts disproportionate legislative, media, and political bandwidth directed toward a statistically small demographic node.',
            'The model describes hyper-inflated ideological voltage applied to trans individuals as a means of generating reactive power and distracting the Buffer Class from macro-level material extraction.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Reactive power',
          definition:
            'The product of voltage and current in the electrical analog, used here to model pacification of the Buffer Class.',
        },
      ],
    },

    {
      id: 'bivector-space',
      title: 'Bivectors and Fractal Consistency',
      prose: [
        'Geometric Algebra multiplies two basis vectors into a bivector, a distinct two-dimensional plane. When the first basis is Race and the fourth is Disability, their bivector describes the extraction plane of a Black disabled person.',
        'This plane encodes accelerated extraction, compounded enforcement violence, and multiplicatively intensified systemic neglect. Its geometry differs qualitatively from either constituent axis.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex: 'e_1 \\wedge e_4 = e_{14}',
            caption: 'Two basis vectors produce a distinct intersectional plane.',
          },
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Fractal Consistency of Geometric Algebra',
          paragraphs: [
            'At the single-axis level, the magnetic cross-product produces Orthogonal Deflection and turns the Buffer Class horizontally through the psychological wage field.',
            'At the multi-axis level, the superposition of N cultural magnetic fields produces the same deflection, with each field weighted by its demographic coefficient. The same mathematics operates at different dimensional resolutions.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Bivector',
          definition:
            'A distinct two-dimensional plane produced by multiplying two basis vectors.',
        },
        {
          term: 'Fractal consistency',
          definition:
            'The reproduction of the same extraction geometry at single-axis and multi-axis resolutions.',
        },
      ],
    },
  ],
};

export default apxE;
