// Appendix G — Universality and the Finite Topology of Power
//
// Source: Paper/chapters_src/29_universality_and_the_finite_topology_of.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory.
import type { ChapterContent } from '../types';

const apxG: ChapterContent = {
  meta: {
    id: 'apxG',
    slug: 'universality',
    number: 32,
    title: 'Universality and the Finite Topology of Power',
    era: 'Reference',
    hook: 'The conjecture that the topology of power is finite.',
    accentColor: '#64748b',
  },

  scenes: [
    {
      id: 'the-question',
      title: 'A Falsifiable Question',
      prose: [
        'This appendix asks whether the electrodynamic isomorphism reflects a finite set of structures for organizing complex systems of power and control. It frames the question as a falsifiable conjecture.',
        'The isomorphism maps social oppression onto circuit theory, thermodynamics, and control systems. The conjecture places the Predatory Min-Max Function within a universality class of hierarchical far-from-equilibrium extractors.',
      ],
      keyConcepts: [
        {
          term: 'Universality class',
          definition:
            'A set of physical systems that share critical exponents and scaling behavior across different microscopic details.',
        },
        {
          term: 'Hierarchical far-from-equilibrium extractor',
          definition:
            'A system that concentrates energy, matter, or information against a gradient while maintaining stability against internal dissipation.',
        },
      ],
    },

    {
      id: 'universality-conjecture',
      title: 'Universality of the Extraction Kernel',
      blocks: [
        {
          kind: 'formal',
          variant: 'conjecture',
          label: 'Universality of the Extraction Kernel',
          paragraphs: [
            'Any system satisfying the following three conditions will converge toward the five-node extraction topology of Elite, Puppet, Enforcement, Buffer, and racialized Out-group, together with the phase-loading control law rho sub k of t.',
            'Bounded resources: The system operates under a resource constraint that prevents uniform distribution to all nodes.',
            'Positive feedback: A subset of nodes can amplify its own resource share by altering the rules of distribution.',
            'Dissipation threat: The excluded nodes possess sufficient coherence capacity to threaten system stability if they mobilize.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The conjecture treats the solution topology as invariant: a small controlling node, an enforcement intermediary, a co-opted buffer, and an excluded sink.',
            'A fixed circuit topology carries culturally contingent identity axes across contexts.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Topology',
          definition:
            'The arrangement of controlling, intermediary, buffer, and excluded nodes proposed as invariant across instantiations.',
        },
        {
          term: 'Phase loading',
          definition:
            'The time-varying control law that assigns weight to specific identity axes.',
        },
      ],
    },

    {
      id: 'control-structure',
      title: 'The Control-Theory Structure',
      prose: [
        'The five-node topology is presented as the minimal control structure capable of solving a constrained optimization problem. The control input is u, and q is the state vector.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\max_{u} \\; \\mathcal{E}(t) \\quad \\text{subject to} \\quad M(t) < \\tau, \\; \\dot{q} = f(q, u), \\; q(0) = q_0',
            caption: 'The constrained optimization problem for the five-node topology.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'Under resource constraints and dissipation threats, the stated optimal solution takes the form of a hierarchical feedback structure: a leader node, a controller, an actuator, and a partitioned follower set.',
            'The structure requires a dissipation channel that converts the coherence threat into harmless thermal noise. Race, caste, religion, and nationality provide historically contingent channels. The channel requirement remains invariant across instantiations.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Dissipation channel',
          definition:
            'A path through which the coherence threat is converted into harmless thermal noise.',
        },
        {
          term: 'Hierarchical feedback structure',
          definition:
            'A leader, controller, actuator, and partitioned follower set organized around the constrained objective.',
        },
      ],
    },

    {
      id: 'falsification-and-design',
      title: 'Falsification and Design',
      blocks: [
        {
          kind: 'formal',
          variant: 'conjecture',
          label: 'Conditions that would falsify the conjecture',
          paragraphs: [
            'A complex society with bounded resources, positive feedback, and dissipation threat maintains stable egalitarian distribution for more than five generations without hierarchical partition.',
            'A hierarchical extractor society collapses into egalitarian equilibrium without kinetic intervention from the excluded population.',
            'A system with the three conditions converges on a non-hierarchical topology, such as pure anarchy, rotating leadership, or stochastic resource allocation, and maintains it stably.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'No society in the historical dataset satisfies any of these conditions. The conjecture remains consistent with the dataset, and the dataset supplies no proof.',
            'If the conjecture holds, the Open-Source Republic requires a different topology. Hard caps on extraction remove the positive-feedback condition, and universal baseline provisioning removes the dissipation-threat condition. Those design choices change the system’s universality class.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Hard caps on extraction',
          definition:
            'The proposed mechanism for removing the positive-feedback condition.',
        },
        {
          term: 'Universal baseline provisioning',
          definition:
            'The proposed mechanism for removing the dissipation-threat condition.',
        },
      ],
    },
  ],
};

export default apxG;
