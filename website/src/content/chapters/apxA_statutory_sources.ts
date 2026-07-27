// Appendix A — Primary Statutory Sources (United States Code)
//
// Source: Paper/chapters_src/23_primary_statutory_sources_united_states.tex
// Adapted prose is derived from that slice only. The statutory entries preserve
// the source registry’s titles, section numbers, descriptors, and grouping.
import type { ChapterContent } from '../types';

const apxA: ChapterContent = {
  meta: {
    id: 'apxA',
    slug: 'statutory-sources',
    number: 26,
    title: 'Primary Statutory Sources (United States Code)',
    era: 'Reference',
    hook: 'The statutes cited throughout, collected for uninterrupted reading.',
    accentColor: '#64748b',
  },

  scenes: [
    {
      id: 'using-the-registry',
      title: 'Using the Registry',
      prose: [
        'This appendix collects the United States Code provisions cited throughout the narrative for uninterrupted reading.',
        'The entries retain the source registry’s organization by code title and subject.',
      ],
      keyConcepts: [
        {
          term: 'Statutory source',
          definition: 'A provision of the United States Code collected in this appendix.',
        },
        {
          term: 'Registry structure',
          definition: 'Code titles grouped by the subjects named in the source.',
        },
      ],
    },

    {
      id: 'title-18',
      title: 'Title 18',
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Firearms and related',
          paragraphs: [
            '§922(g) (excerpt)',
            '§922(o) (excerpt)',
            '§926B (LEOSA)',
            '§521 (criminal street gangs)',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Peonage, slavery, and trafficking in persons',
          paragraphs: ['§1581 (Peonage)', '§1589 (Forced labor)'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Civil rights (conspiracy and color of law)',
          paragraphs: ['§241', '§242'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Forfeiture',
          paragraphs: ['§981(a) (Civil forfeiture)'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Prison-made goods',
          paragraphs: ['§1761 (Transportation or importation)'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Sentencing',
          paragraphs: ['§3559(c) (Three-strikes mandatory life imprisonment)'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Wiretap and electronic surveillance',
          paragraphs: ['§2511 (Interception prohibition)'],
        },
      ],
    },

    {
      id: 'remaining-code-titles',
      title: 'Titles 8, 21, 42, 50, and 52',
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Title 8 — Aliens and nationality',
          paragraphs: ['§§262–297 (Exclusion of Chinese — Repealed)'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Title 21 — Drug abuse prevention and control',
          paragraphs: [
            '§812(b) (Controlled Substances scheduling criteria)',
            '§841(a) (Prohibited acts)',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Title 42 — Public health and welfare',
          paragraphs: ['§2000d (Title VI operative text)'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Title 50 — War and national defense',
          paragraphs: ['§1801 (FISA definitions, excerpt)'],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Title 52 — Voting and elections',
          paragraphs: ['§10301 (VRA enforcement)'],
        },
      ],
    },
  ],
};

export default apxA;
