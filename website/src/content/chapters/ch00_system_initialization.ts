// Chapter 0 — System Initialization: The Geometry of Extraction
//
// PILOT CHAPTER. This module is the reference implementation for every other
// chapter: scene granularity, block usage, deep-dive sourcing, and voice.
//
// Source: Paper/chapters_src/01_system_initialization_the_geometry_of_ex.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch00: ChapterContent = {
  meta: {
    id: 'ch00',
    slug: 'system-initialization',
    number: 0,
    title: 'System Initialization: The Geometry of Extraction',
    era: 'Foundations',
    hook: 'Sets, axes, and the extraction operator the rest of the book runs on.',
    epigraph: {
      text: 'The shape of the machine, specified before the history traces its execution.',
    },
    accentColor: '#deb54f',
    heroVisual: {
      kind: 'equation',
      latex:
        '\\vec{F}_{\\text{total}} = \\mathbf{Q}\\,\\sum_{j=1}^{M}\\vec{\\mathcal{E}}_{\\text{mat}}^{(j)} + \\mathbf{Q}\\left(\\vec{v} \\times \\sum_{k=1}^{N} \\rho_k \\vec{B}_k\\right)',
      label: 'The Unified Lorentz Force',
    },
  },

  scenes: [
    {
      id: 'two-resolutions',
      title: 'Two Resolutions of One Machine',
      prose: [
        'Before the book loads racism as its primary dataset, it compiles the abstract geometry of the trap. This chapter specifies the hierarchy, the enclosure, and the perceptual illusion that every later historical chapter instantiates.',
        'The architecture appears at two resolutions. The software layer tracks how the system recompiles its interface while preserving its kernel. The hardware layer supplies the electrodynamic formalism that unifies every equation in the book into one coherent system.',
        'Both layers describe the same machine. The software layer makes the history legible. The hardware layer makes the mathematics derivable from first principles.',
      ],
      keyConcepts: [
        {
          term: 'Kernel',
          definition:
            'The extraction function itself, preserved across every recompile of the system’s public interface.',
        },
        {
          term: 'Interface',
          definition:
            'The visible, revisable surface — law, custom, vocabulary — that the system rewrites while the kernel persists.',
        },
      ],
    },

    {
      id: 'lorentz-force',
      title: 'The Governing Equation',
      prose: [
        'The hardware layer runs on a single primary equation. An intersectional charge multivector meets two fields: a material-wage electric field that performs real economic work, and a superposition of cultural magnetic fields that deflect class momentum without transferring energy.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\vec{F}_{\\text{total}} = \\mathbf{Q}\\,\\sum_{j=1}^{M}\\vec{\\mathcal{E}}_{\\text{mat}}^{(j)} + \\mathbf{Q}\\left(\\vec{v} \\times \\sum_{k=1}^{N} \\rho_k \\vec{B}_k\\right)',
            label: 'eq. 0.1',
            caption: 'The Unified Lorentz Force.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'The cross product carries the whole argument. A force orthogonal to velocity does zero work. That is the mathematical signature of the psychological wage: it moves people without paying them.',
            'The magnetic fields are self-excited, funded by a feedback tap off the material extraction circuit. The field that divides the masses is paid for by the extraction it protects.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\frac{\\partial \\vec{B}_k}{\\partial t} = \\eta_k \\left( \\mathbf{Q} \\cdot \\sum_{j=1}^{M}\\vec{\\mathcal{E}}_{\\text{mat}}^{(j)} \\right) - \\lambda_k \\vec{B}_k',
            label: 'eq. 0.1a',
            caption:
              'The self-exciting generator. Sever the extraction and the cultural field decays exponentially.',
          },
        },
      ],
      deepDive: {
        label: 'The substrate-independence argument',
        passages: [
          {
            heading: 'The Reversal: Oppression Came First',
            paragraphs: [
              'Humans were enacting these dynamics on each other for millennia before Volta built the first battery. The mathematics of power belongs to any system with potential gradients, conducting pathways, and resistance.',
              'The electromagnetic vocabulary — current, resistance, potential, field, force, power, conductor, ground, charge — was borrowed from the pre-existing social-power vocabulary.',
            ],
          },
        ],
      },
    },

    {
      id: 'five-nodes',
      title: 'The Five Nodes',
      prose: [
        'The familiar two-set picture, in-group against out-group, describes unequal outcomes. It cannot explain who benefits from the inequality, why the nominal in-group receives status while material power concentrates above it, or why outrage so reliably strikes the wrong target.',
        'The minimum stable architecture requires five structural nodes.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'tierLadder',
            tiers: [
              {
                symbol: 'E',
                name: 'Elite',
                description:
                  'The apex and the extraction beneficiary. The node the architecture is optimized to protect from visibility and cost.',
              },
              {
                symbol: 'P',
                name: 'Puppet Class',
                description:
                  'The legal and political interface. Officials, executives, judges, and figureheads who translate extraction into policy while absorbing blame that would otherwise travel upward.',
              },
              {
                symbol: 'F',
                name: 'Enforcement Class',
                description:
                  'The physical actuator of the partition. The coercive layer that makes law, property, borders, debt, and discipline executable.',
              },
              {
                symbol: 'I',
                name: 'Buffer Class',
                description:
                  'The broader in-group layer recruited to defend the partition in exchange for a suppression allocation: status wages by default, material concessions when kinetic pressure requires them.',
              },
              {
                symbol: 'O',
                name: 'Out-group',
                description:
                  'The population positioned as extractable, controllable, disposable, or enclosure-bearing within a given partition.',
              },
            ],
            caption: 'The five structural nodes, apex to base.',
          },
        },
        {
          kind: 'insight',
          heading: 'Positions, not essences',
          paragraphs: [
            'These nodes are structural positions. The model tracks the role a node is made to perform inside the architecture, independent of any moral essence assigned to the person occupying it. A person can occupy a relatively protected position along one axis and an extractable position along another.',
          ],
        },
      ],
      deepDive: {
        label: 'Definition: Capital and Capitalism',
        passages: [
          {
            heading: 'Capital',
            paragraphs: [
              'Capital: the accumulated, alienable surplus extracted from labor and natural resources, held as private property and deployed to generate further extraction. In this framework, capital constitutes the convertible reserve that the Elite accumulates and reinvests to maintain and expand the extraction kernel. Capital includes land, infrastructure, financial instruments, institutional control, and the monopolized means of production. Its defining operational property is that it circulates: it passes through the hierarchy as wages, debt, status wages, and concessions, but its net flow is always upward toward the Elite.',
            ],
          },
          {
            heading: 'Capitalism',
            paragraphs: [
              'Capitalism: an economic system organized around three structural invariants: private ownership of the means of production by the Elite, competitive accumulation of capital as the system’s optimization objective, and the conversion of labor into commodified wage input. Under capitalism, the extraction kernel becomes the system’s designed output: profit is the residual value remaining after labor has been paid less than the value it produces.',
              'The framework treats capitalism as the host operating system on which racialized extraction runs as a privileged process. It is distinct from feudalism, where extraction is territorial and hereditary, and from slave capitalism, where labor is legally property, though the latter is a subtype that shares capitalism’s accumulation logic.',
            ],
          },
        ],
      },
    },

    {
      id: 'voltage-drop',
      title: 'The Hardware Mapping',
      prose: [
        'The electrodynamic formalism maps each structural node onto a distinct circuit element. The same extraction function that appears in software as a kernel appears in hardware as a power-distribution network.',
        'The foundational inequality is an ordinal voltage drop.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\text{Benefit}(E) \\gg \\text{Benefit}(P_{\\text{uppet}}) > \\text{Benefit}(F_{\\text{enforce}}) > \\text{Benefit}(I_{\\text{buffer}}) > \\text{Benefit}(O)',
            label: 'eq. 0.2',
            caption:
              'The control gate sets the highest potential gradient; each node below drops voltage.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'The first relation is a strict dominance, not a gradient. The gap between the Elite and the Puppet Class exceeds every other gap in the ordering combined. That asymmetry is what makes the Puppet Class useful: close enough to power to be mistaken for it, far enough below to absorb the cost of being seen.',
          ],
        },
      ],
    },

    {
      id: 'tri-modal-enclosure',
      title: 'The Tri-Modal Enclosure Model',
      prose: [
        'The enclosure model measures the degree to which an out-group is denied all practical routes of escape, resilience, and structural self-perception. Systemic oppression restricts action by blocking the outlets through which a targeted population could coordinate, exit, recover, or correctly model the enclosure that contains it.',
        'Each mode is a continuous variable between zero and one, where zero denotes a fully open outlet and one denotes complete obstruction.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The three enclosure modes',
          paragraphs: [
            'Communal Capacity: the obstruction of internal economic, social, educational, kinship, and mutual-aid infrastructure.',
            'Geographic and Economic Mobility: the obstruction of external movement, market access, property access, employment pathways, and the ability to exit the local control field.',
            'Psychological and Epistemic Autonomy: the obstruction of the population’s capacity to name the enclosure, model its contingency, and perceive the architecture beyond its local symptoms.',
          ],
          equations: [
            {
              latex:
                '\\mathcal{S}_{\\text{mat}} = \\frac{e_1 + e_2}{2}, \\qquad \\mathcal{S}_{\\text{psych}} = e_3',
              label: 'eq. 0.4',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The three modes decompose into two electrodynamic channels. The material modes map to the electric field and perform the real work of extraction. The psychological mode maps to the magnetic field and sustains the system by deflecting resistance without transferring energy.',
            'The composite Enclosure Score is the apparent-power magnitude of that decomposition.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\mathcal{S}_{\\text{enc}} = \\frac{1}{\\sqrt{2}}\\sqrt{\\,\\mathcal{S}_{\\text{mat}}^{2} + \\mathcal{S}_{\\text{psych}}^{2}\\,} = \\frac{1}{\\sqrt{2}}\\sqrt{\\left(\\frac{e_1 + e_2}{2}\\right)^{\\!2} + e_3^{2}}',
            label: 'eq. 1.1',
            caption: 'The Enclosure Score.',
          },
        },
        {
          kind: 'insight',
          heading: 'Why the epistemic mode carries more weight',
          paragraphs: [
            'The two material modes are averaged into a single channel before squaring. The psychological mode enters the norm at full amplitude. That weighting encodes a structural claim: without epistemic autonomy, a population cannot coordinate to escape enclosure, which renders material interventions structurally insufficient regardless of their magnitude.',
          ],
        },
      ],
      deepDive: {
        label: 'The quarter-disk hull',
        passages: [
          {
            paragraphs: [
              'Geometrically, the electrodynamic decomposition collapses the three enclosure modes into a two-dimensional complex plane: the real axis is material enclosure and the imaginary axis is psychological enclosure. The Enclosure Score is the Euclidean norm of that vector, normalized to the unit interval. As either component approaches one, the vector lengthens; when both are maximal, the norm reaches the unit circle.',
              'In computational geometry this structure is the quarter-disk hull: the tightest enclosure in the first quadrant whose interior offers no escape vector. The intuition is the rubber-band pegboard. Tightening material enclosure collapses the feasible region; tightening psychological enclosure rotates any escape velocity into orthogonal, non-extractive motion.',
            ],
          },
        ],
        equations: [
          {
            latex:
              '\\mathcal{S}_{\\text{enc}}(O) = \\frac{1}{\\sqrt{2}}\\sqrt{\\left(\\frac{1+1}{2}\\right)^{\\!2} + 1^{2}} = \\frac{1}{\\sqrt{2}}\\sqrt{1 + 1} = 1.0',
            label: 'eq. 1.2 — Absolute Subjugation',
          },
        ],
      },
    },

    {
      id: 'why-reforms-fail',
      blocks: [
        {
          kind: 'pullquote',
          text: 'A policy that improves external mobility while leaving internal destruction and epistemic erasure intact lowers one channel of the score. The subject remains enclosed.',
        },
        {
          kind: 'prose',
          paragraphs: [
            'The Predatory Min-Max Function requires the Enclosure Score to approach unity to ensure maximum extraction at minimum friction. Partial relief along a single channel leaves that requirement satisfied.',
          ],
        },
      ],
    },

    {
      id: 'orthographic-illusion',
      title: 'Elite Obscuration and the Orthographic Illusion',
      prose: [
        'The pyramid is three-dimensional, and that third dimension is operational. An observer enclosed at the base looks upward through the structure. By the laws of orthographic projection, the apex disappears behind the lower layers.',
        'The observer sees only the flat ceiling of the Buffer Class pressing downward. This is the Square Ceiling: the optical illusion that society is simply oppressor against oppressed.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'A self-concealing trap',
          paragraphs: [
            'Enclosure prevents the observer from stepping outside the pyramid. Projection makes the apex invisible from inside it. Together they make the structure self-concealing.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Four terms for one geometry',
          paragraphs: [
            'Projection, or the Square Ceiling: the collapse of the three-dimensional pyramid into a plane from the out-group’s vantage point, causing the Buffer Class to appear as the whole system.',
            'Obscuration: the engineered alignment of the Puppet, Enforcement, and Buffer classes along the observer’s line of sight, making the Elite optically indistinguishable from its proxies.',
            'Deflection: vertical class momentum aimed at the apex is stripped of its vertical component and projected onto the horizontal plane, where the out-group and the Buffer Class collide with each other.',
            'Decoy: the functional role the Buffer Class plays in absorbing kinetic energy that would otherwise travel upward. Policy gaslighting is the institutional face of the decoy, encoding the misdirection in law and discourse so it outlasts any single enforcement event.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Square Ceiling',
          definition:
            'The two-set illusion produced when a three-dimensional hierarchy is viewed from inside its base.',
        },
        {
          term: 'Deflection',
          definition:
            'The operator that converts vertical momentum aimed at the apex into horizontal conflict between adjacent tiers.',
        },
      ],
      deepDive: {
        label: 'Scholar pins',
        passages: [
          {
            paragraphs: [
              'Du Bois’s account of the public and psychological wage documents the suppression allocation paid to the Buffer Class to keep it aligned with the Elite against the out-group. Fanon documents the kinetic and psychological fracturing produced by colonial enforcement.',
            ],
          },
        ],
      },
    },

    {
      id: 'what-follows',
      title: 'What the Rest of the Book Does',
      prose: [
        'Every chapter that follows instantiates this architecture at a different scale and in a different century. The nodes acquire names, the enclosure modes acquire statutes, and the governing equation acquires calibration data.',
        'The machine specified here is the one whose execution log the history traces.',
      ],
    },
  ],
};

export default ch00;
