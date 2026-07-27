// Chapter 1 — Dynamical Systems Formulation of the Extraction Architecture
//
// Source: Paper/chapters_src/02_dynamical_systems_formulation_of_the_ext.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory.
import type { ChapterContent } from '../types';

const ch01: ChapterContent = {
  meta: {
    id: 'ch01',
    slug: 'dynamical-systems',
    number: 1,
    title: 'Dynamical Systems Formulation of the Extraction Architecture',
    era: 'Foundations',
    hook: 'The architecture restated as a dynamical system: state, control input, and who has one.',
    accentColor: '#d9a441',
    heroVisual: {
      kind: 'equation',
      latex:
        '\\boxed{\\mathcal{L}^*(q, \\dot{q}, t) = T(\\dot{q}, t) - V(q, t) - \\mathcal{D}(q, \\dot{q}, t) + \\lambda\\bigl(\\tau - M_{\\text{eff}}(t)\\bigr)}',
      label: 'The augmented Lagrangian',
    },
  },

  scenes: [
    {
      id: 'epistemological-status',
      title: 'A Dynamical Homology',
      prose: [
        'The extraction architecture can be formalized as an optimal control problem governed by Lagrangian mechanics. Its hardware and software layers share one root equation.',
        'The model establishes a substrate-independent dynamical homology. Distinct systems exhibit equivalent governing equations after their state variables and constraints have been operationalized.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Epistemological status',
          paragraphs: [
            'The framework applies optimal control theory, fractional calculus, and circuitry to socioeconomic architectures that optimize energy, labor, and suppression under structural constraints. Its social quantities receive operational definitions. Volts and teslas retain their physical units.',
            'The empirical claims retain confidence tiers. The mathematical claim concerns shared dynamics across substrates.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Dynamical homology',
          definition:
            'Equivalent governing equations across distinct systems after their variables and constraints are operationalized.',
        },
        {
          term: 'Optimal control',
          definition:
            'The formal selection of system behavior that maximizes an objective while satisfying a constraint.',
        },
      ],
    },

    {
      id: 'state-and-potential',
      title: 'State, Capacity, and Constraint',
      prose: [
        'Lagrangian mechanics describes a system through kinetic energy and potential energy. The action integral is stationary along the path the system follows.',
        'The masses supply kinetic labor. The Elite configure the potential field. The resulting dynamics execute extraction through the engineered boundary conditions.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The state variables',
          paragraphs: [
            'Kinetic energy T is mobilized social capacity: class-solidarity energy, drift velocity, and the physical capacity of the Out-group and Buffer Class to resist or move upward.',
            'Potential energy V is the engineered constraint field: the Lyapunov energy ceiling, navigation function, legal barriers, spatial boundaries, and psychological potential well that trap momentum.',
          ],
        },
      ],
    },

    {
      id: 'rayleigh-dissipation',
      title: 'The Dissipative Equation of Motion',
      prose: [
        'The architecture contains non-conservative friction. Bureaucratic drag, redlining, policing, and administrative obstruction dissipate mobilized capacity as exhaustion, legal fees, and lost time.',
        'The Rayleigh dissipation function inserts that friction into the Euler–Lagrange equation. External coercive force enters through the Enforcement Class.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\frac{d}{dt}\\left(\\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial \\mathcal{L}}{\\partial q_i} + \\frac{\\partial \\mathcal{D}}{\\partial \\dot{q}_i} = Q_i',
            label: 'eq. 1.1',
            caption:
              'Euler–Lagrange dynamics with Rayleigh dissipation and external coercive force.',
          },
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Dissipation and coercion',
          paragraphs: [
            'The term D represents thermodynamic heat loss exacted by the state upon the Out-group. The term Qᵢ represents external coercive forces applied by the Enforcement Class.',
          ],
        },
      ],
    },

    {
      id: 'augmented-control-problem',
      title: 'The Augmented Control Problem',
      prose: [
        'The kernel maximizes Elite extraction while keeping effective mass and momentum below the rebellion threshold. The Lagrange multiplier measures the marginal cost of enforcing that boundary.',
        'The augmented Lagrangian compresses capacity, constraint, dissipation, and suppression expenditure into a single objective.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\boxed{\\mathcal{L}^*(q, \\dot{q}, t) = T(\\dot{q}, t) - V(q, t) - \\mathcal{D}(q, \\dot{q}, t) + \\lambda\\bigl(\\tau - M_{\\text{eff}}(t)\\bigr)}',
            label: 'eq. 1.2',
            caption: 'The extraction architecture as an augmented Lagrangian.',
          },
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The multiplier',
          paragraphs: [
            'The multiplier λ equals the systemic suppression cost W = ψₘ + jψₛ. Its real component is material-wage expenditure. Its imaginary component is psychological-wage expenditure stored in the cultural field to deflect class momentum.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Rebellion threshold',
          definition:
            'The boundary τ below which the system attempts to hold effective mass and momentum.',
        },
        {
          term: 'Marginal cost of suppression',
          definition:
            'The additional material and psychological expenditure required to enforce the threshold.',
        },
      ],
    },

    {
      id: 'least-action',
      title: 'Least Action and Autonomous Propagation',
      prose: [
        'Stationary action explains autonomous propagation. The Buffer Class follows the lowest-cost path through a socioeconomic potential well whose boundary conditions make solidarity prohibitively expensive.',
        'The Euler–Lagrange dynamics describe the motion of the Out-group and the default trajectory of the Buffer Class. The engineered potential field produces the extraction outcome without continuous coordination from the Elite at every node.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Autonomous propagation',
          paragraphs: [
            'The Elite set the potential field and the psychological-wage threshold. The system selects a stationary path through those constraints. That path directs Buffer-Class motion toward the extraction outcome.',
          ],
        },
      ],
    },

    {
      id: 'friction-and-threshold-tests',
      title: 'Two Direct Falsifiability Tests',
      prose: [
        'The first experiment compares cohorts with equivalent starting capital and labor participation across an abrupt increase in state friction. The predicted result is a proportional decline in upward mobility.',
        'The second experiment tracks suppression expenditure during the mobilization waves of 1968, 1992, and 2020. The predicted result is a spike in the multiplier as effective momentum approaches the rebellion threshold.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'conjecture',
          label: 'Rayleigh dissipation test',
          paragraphs: [
            'A massive increase in policing and bureaucratic friction accompanied by unchanged wealth accumulation and organizational momentum would falsify D as a physical friction in the model.',
          ],
        },
        {
          kind: 'formal',
          variant: 'conjecture',
          label: 'Lagrange multiplier test',
          paragraphs: [
            'A structural threat above the threshold accompanied by flat spending and control metrics would falsify the claim that the system actively optimizes the constraint.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Observed multiplier response',
          definition:
            'Suppression expenditure appeared through covert programs, legislative expansion, federal militarization grants, and ideological pacification.',
        },
      ],
    },

    {
      id: 'recompile-signature',
      title: 'The Recompile Signature',
      prose: [
        'The third experiment tests a mechanism transfer after the Civil Rights Act of 1964. It predicts that declining overt barriers in V will coincide with rising bureaucratic and carceral dissipation in D while net extraction persists.',
        'Residential dissimilarity fell from 0.78 in 1964 to 0.56 in 2020. Black incarceration rose 210 percent over the same period. Their correlation was −0.895, while the racial wealth gap remained approximately 6:1 to 8:1.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'conjecture',
          label: 'Mechanism-transfer test',
          paragraphs: [
            'Permanent closure of the racial wealth gap after removal of the overt legal barrier would falsify the Extraction Algorithm as a persistent dynamical law.',
          ],
        },
        {
          kind: 'insight',
          heading: 'Empirical synthesis',
          paragraphs: [
            'The three directional tests survive falsification for the available data. The recompile test supplies the strongest result. Business-cycle confounding makes the short-term incarceration-and-unemployment result the weakest.',
          ],
        },
      ],
    },

    {
      id: 'qed-bridge-and-limits',
      title: 'The Analogical Boundary',
      prose: [
        'The QED bridge models ideology as systemic photon exchange. A Systemic Photon is a discrete information packet whose energy depends on algorithmic refresh rate and transmission frequency; network cascades supply the model for stimulated emission.',
        'This extension is analogical and topological. The classical augmented Lagrangian and optimal control system perform the framework’s mathematical work.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Limits and scope',
          paragraphs: [
            'The augmented Lagrangian unifies existing circuit, control, and interaction components. Its empirical value lies in measurable parameters, observable time-series behavior, rival-model tests, and historical predictions.',
            'The framework claims dynamical homology. Electromagnetic ontology remains outside its scope.',
          ],
        },
      ],
    },
  ],
};

export default ch01;
