// Appendix H — The Extraction Chart: Impedance, Reflection, and the Matching Problem
//
// Source: Paper/chapters_src/34_the_extraction_chart_impedance_reflectio.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory.
import type { ChapterContent } from '../types';

const apxH: ChapterContent = {
  meta: {
    id: 'apxH',
    slug: 'extraction-chart',
    number: 33,
    title: 'The Extraction Chart: Impedance, Reflection, and the Matching Problem',
    era: 'Reference',
    hook: 'Impedance, reflection, and the matching problem, drawn as one chart.',
    accentColor: '#64748b',
  },

  scenes: [
    {
      id: 'orientation',
      title: 'One Geometry for the Matching Problem',
      prose: [
        'This appendix places resistance, capacitance, inductance, complex wage, and complex power on a single geometric object: the reflection-coefficient plane. The reader can use the Extraction Chart to locate enclosure, refusal, reform, co-optation, and active resistance within one bounded space.',
        'The apparatus is Tier 3 structural work. Its resistive per-axis placements inherit Tier 2 status from the spectral decomposition, while their reactive placements remain Tier 3 because the available dataset does not resolve the quality factors.',
      ],
    },

    {
      id: 'port-and-chart',
      title: 'Port Convention and the Unit Disk',
      prose: [
        'The model fixes the direction of propagation through a two-port extraction line. The incident wave travels downward as suppression, and the reflected wave returns upward as refusal, backlash, or non-compliance.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Extraction line convention',
          paragraphs: [
            'The extraction architecture is modeled as a two-port network terminated in a load. The incident wave a is the suppression signal injected downward from E. The reflected wave b is the component returned upward as refusal, backlash, or non-compliance.',
            'The load is the population upon which the suppression signal terminates. Real power absorbed by the load is the power the population takes on and cannot return, and this absorbed power is the extraction.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The characteristic impedance Z sub zero describes a population through which the suppression signal propagates without reflection. Normalization writes every load as a resistive component r plus a reactive component x. The material wage occupies the resistive coordinate and performs real work. The psychological wage occupies the reactive coordinate and performs no net work over a cycle.',
            'The reflection coefficient maps every passive load in the right half-plane onto the closed unit disk. Its center is a perfect match: all incident suppression is absorbed. Its rim is withdrawn compliance: a purely reactive termination absorbs zero real power. The Enclosure Score rises toward one as the reflection magnitude falls toward zero.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'extractionChart',
            caption:
              'The reflection-coefficient plane. The center is total enclosure; the rim is withdrawn compliance and zero absorbed power.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Characteristic impedance',
          definition:
            'The reference impedance presented when suppression propagates through a population without reflection.',
        },
        {
          term: 'Reflection coefficient',
          definition:
            'The transformed load coordinate whose magnitude measures the share of the incident signal returned by the population.',
        },
        {
          term: 'Perfect match',
          definition:
            'The center of the chart, where Gamma equals zero, normalized impedance equals one, and the load absorbs all incident power.',
        },
      ],
    },

    {
      id: 'buffer-and-reform',
      title: 'Buffer Matching and Reform Monotonicity',
      prose: [
        'A reactive element stores and returns energy during each cycle while dissipating zero time-averaged real power. The Buffer Class occupies that network position between the source and the racialized load.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Buffer Matching Theorem',
          paragraphs: [
            'I sub buffer occupies the structural position of a lossless impedance-matching network between E and O sub racialized. Its compensation is purely reactive: the time-averaged real power delivered to I sub buffer is zero, while the reactive power delivered to it is nonzero and sustained.',
          ],
        },
        {
          kind: 'formal',
          variant: 'proof',
          label: 'Argument',
          paragraphs: [
            'The psychological wage transfers no net energy. Complex power decomposes into time-averaged real dissipation and reactive power. An element with zero real power and nonzero reactive power is purely reactive.',
            'A purely reactive element placed in series or shunt transforms the impedance seen by the source without dissipating power. The five-tier topology positions the Buffer Class between E and O sub racialized.',
          ],
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Reform Monotonicity',
          paragraphs: [
            'Any intervention that strictly reduces the magnitude of Gamma strictly increases the real power absorbed by the load.',
            'Reforms that reduce friction, backlash, and refusal move the load inward toward a better match. Anti-extractive intervention moves outward toward deliberate mismatch and withdrawn compliance.',
          ],
          equations: [
            {
              latex:
                '\\frac{\\partial P_{\\text{abs}}}{\\partial |\\Gamma|} \\;=\\; -2\\,|a|^2\\,|\\Gamma| \\;<\\; 0\n\\qquad \\text{for } |\\Gamma| > 0',
              label: 'eq. XC.7',
            },
          ],
        },
      ],
      visual: {
        kind: 'equation',
        latex: 'P_{\\text{abs}} \\;=\\; |a|^2\\bigl(1 - |\\Gamma|^2\\bigr)',
        label: 'eq. XC.3',
        caption:
          'Absorbed power increases as the magnitude of the reflected wave decreases.',
      },
      keyConcepts: [
        {
          term: 'Reactive compensation',
          definition:
            'Compensation with sustained magnitude and zero time-averaged accumulation.',
        },
        {
          term: 'Deliberate mismatch',
          definition:
            'Movement toward the chart rim, where reflection rises and absorbed extraction falls.',
        },
      ],
    },

    {
      id: 'electoral-clock',
      title: 'Rotation, Co-optation, and Attenuation',
      prose: [
        'Displacement along a lossless line rotates the reflection coefficient around the chart without changing its magnitude. One full rotation corresponds to half a wavelength. Setting the wavelength equal to the four-year electoral cycle turns the chart into an electoral clock.',
        'The source slice reports a 24:1 power advantage for identity-band language at a frequency of 0.25 cycles per year. It predicts phase-locked periodicity in insurgent formations and identifies spectral analysis as the appropriate test.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Quarter-Wave Co-optation',
          paragraphs: [
            'A political formation presents the extraction line with a short circuit at normalized load impedance zero and Gamma equal to negative one: total refusal that draws the full suppression current and returns it inverted.',
            'A displacement of one quarter wavelength presents the same formation as an open circuit, with infinite input impedance and Gamma equal to positive one. A further quarter wavelength returns it to a short. The carrier fixes the recurrence of militancy and irrelevance while the load’s composition remains unchanged.',
          ],
          equations: [
            {
              latex:
                'z_{\\text{in}} \\;=\\; \\frac{1}{z_L} \\;\\longrightarrow\\; \\infty, \\qquad \\Gamma_{\\text{in}} = +1',
              label: 'eq. XC.9',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Loss adds an inward spiral to the rotation. An observer at electrical distance ell measures the reflection magnitude reduced by an exponential attenuation factor and reads the line as better matched. Historical distance can therefore produce an appearance of consent while the load remains unchanged.',
          ],
        },
      ],
    },

    {
      id: 'isolator-and-active-region',
      title: 'The Isolator and the Active Region',
      prose: [
        'The enforcement tier behaves as an isolator: force passes downward and returns upward with approximately zero transmission. Lorentz reciprocity would equalize the two directions in a linear medium with symmetric permittivity and permeability tensors.',
        'Non-reciprocity requires nonlinearity, time variance, or a static magnetic bias. The cultural magnetic field supplies the bias in this model and performs no work on the signal.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Cultural Bias and Non-Reciprocity',
          paragraphs: [
            'The cultural magnetic field B functions as the static bias that breaks reciprocity in the enforcement tier. Removing the bias restores S sub twelve equal to S sub twenty-one, allowing force applied downward to propagate upward with equal transmission.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Every passive load lies inside or on the unit disk and has a nonnegative real impedance. A point beyond the rim requires negative resistance and returns more power than it receives. The population functions as a source in this active region.',
            'The unit disk compactifies an infinite impedance half-plane into a bounded space with a fixed edge. Unlimited variation in passive impedance therefore occupies a finite topology.',
          ],
        },
      ],
      visual: {
        kind: 'equation',
        latex: '|\\Gamma| > 1 \\quad \\Longleftrightarrow \\quad \\operatorname{Re}(z) < 0',
        label: 'eq. XC.12',
        caption:
          'Crossing the unit-circle boundary requires negative resistance and source behavior.',
      },
      keyConcepts: [
        {
          term: 'Isolator',
          definition:
            'A two-port device with strong forward transmission and approximately zero reverse transmission.',
        },
        {
          term: 'Active region',
          definition:
            'The region beyond the unit disk, where negative resistance returns more power than it receives.',
        },
      ],
    },

    {
      id: 'simultaneous-axes-and-tests',
      title: 'Simultaneous Axes, Falsification, and Open Problems',
      prose: [
        'The Bode–Fano criterion supplies a finite matching budget across frequency. Improving the match over one band consumes budget that must be surrendered in another band. Sequential activation across race, gender, and sexuality follows from this bounded multi-band structure.',
        'The source places race at a natural period of 3.6 years and gender at approximately 6 years against the four-year carrier. Race presents capacitive reactance below the real axis; gender presents inductive reactance above it. Reactive magnitudes use an illustrative quality factor of 3 because the present dataset does not resolve the per-axis quality factors.',
        'Current divides among parallel identity branches in proportion to admittance. Race carries an impedance magnitude of approximately 0.10, the lowest of the three, and therefore receives the largest phase-loading coefficient, expressing the reported 11:1 resonance advantage as current division.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Falsification criteria',
          paragraphs: [
            'Buffer Matching Theorem: A longitudinal dataset falsifies the theorem if it shows the Buffer Class accumulating real material wealth attributable to the psychological wage, net of its own labor contribution, over a period exceeding one generation. Nonzero time-averaged real power delivered to the Buffer Class is the decisive condition.',
            'Reform Monotonicity: A documented intervention falsifies the result if it measurably reduces backlash, refusal, and non-compliance while simultaneously reducing the extraction rate.',
            'Quarter-Wave Co-optation: Spectral analysis falsifies the theorem if insurgent-formation activity shows no power concentration at the electoral carrier or its harmonics across a dataset comparable in length to the 60-year congressional series.',
            'Cultural Bias and Non-Reciprocity: A documented enforcement architecture falsifies the theorem if it exhibits the lethal-autonomy gradient in the absence of any cultural or psychological partition.',
            'Bode–Fano Limit: A historical period falsifies the claimed bound if enclosure tightens simultaneously and durably across all identity axes without compensating loosening on any axis.',
            'Phase loading as current division: Measurements falsify the identification if the phase-loading coefficients depart from the admittance ratio beyond the uncertainty of the per-axis impedance estimates.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Open problems',
          paragraphs: [
            'The characteristic impedance Z sub zero awaits a fitted value from the congressional-record spectral series. A fitted value would place per-axis impedances on an absolute scale and upgrade the placements from Tier 3 to Tier 2.',
            'The quality factors controlling reactive magnitudes remain illustrative. Their estimation requires higher-frequency data than the annual series supports.',
            'The Bode–Fano budget remains unevaluated numerically. A computed bound would state a maximum on the number of axes the architecture can hold matched at once.',
          ],
        },
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\int_{0}^{\\infty} \\ln\\frac{1}{|\\Gamma(\\omega)|}\\, d\\omega \\;\\leq\\; \\frac{\\pi}{RC}',
        label: 'eq. XC.13',
        caption: 'The finite matching budget for a load reducible to a parallel RC combination.',
      },
      keyConcepts: [
        {
          term: 'Matching budget',
          definition:
            'The bounded integral that limits how closely a reactive load can be matched across a finite bandwidth.',
        },
        {
          term: 'Phase loading',
          definition:
            'Current division among identity branches in proportion to each branch’s admittance.',
        },
      ],
    },
  ],
};

export default apxH;
