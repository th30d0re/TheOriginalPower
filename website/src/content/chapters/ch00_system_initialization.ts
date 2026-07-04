// PLACEHOLDER FIXTURE — exercises the engine while the real ch00 content is produced.
// Replaced during the pilot-chapter phase.
import type { ChapterContent } from '../types';

const ch00: ChapterContent = {
  meta: {
    id: 'ch00',
    slug: 'system-initialization',
    number: 0,
    title: 'System Initialization: The Geometry of Extraction',
    era: 'Foundations',
    hook: 'The formal machinery: sets, axes, and the extraction operator.',
    epigraph: {
      text: 'Oppression follows patterns. Patterns have architecture.',
    },
    accentColor: '#e0b34c',
  },
  scenes: [
    {
      id: 'placeholder-opening',
      title: 'The Geometry of Extraction',
      prose: [
        'This is placeholder scene copy. The pilot phase replaces it with adapted manuscript narrative.',
        'A second paragraph verifies multi-paragraph rendering and scroll-driven scene transitions.',
      ],
      visual: {
        kind: 'equation',
        latex: 'S = (I, O, E),\\quad E \\subset I',
        label: 'The system triple',
      },
      keyConcepts: [
        { term: 'In-group (I)', definition: 'The class granted full autonomy and systemic protection.' },
        { term: 'Out-group (O)', definition: 'The class subjected to restricted autonomy and systemic harm.' },
      ],
      deepDive: {
        passages: [
          {
            heading: 'Placeholder manuscript excerpt',
            paragraphs: [
              'Verbatim manuscript text will appear here once extraction runs.',
            ],
          },
        ],
        equations: [
          { latex: '|O(t)| \\text{ is nondecreasing in } t', label: 'Out-group expansion' },
        ],
      },
    },
    {
      id: 'placeholder-venn',
      title: 'Three Sets',
      prose: ['Placeholder scene demonstrating the Venn visual kind.'],
      visual: {
        kind: 'venn',
        data: {
          inGroup: { label: 'In-group (I)', members: ['Full autonomy'] },
          outGroup: { label: 'Out-group (O)', members: ['Restricted autonomy'] },
          elite: { label: 'Elite (E ⊂ I)', members: ['Extract value'] },
        },
      },
    },
    {
      id: 'placeholder-manim',
      title: 'Motion Check',
      prose: ['Placeholder scene demonstrating the Manim video visual kind.'],
      visual: {
        kind: 'manim',
        src: '/animations/ComplexWage.mp4',
        caption: 'Complex wage animation (placeholder placement).',
      },
    },
  ],
};

export default ch00;
