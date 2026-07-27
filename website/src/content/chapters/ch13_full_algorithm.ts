// Chapter 13 — The Full Algorithm: Demographic Paradox, Cannibalization, and the 5-Tier Reveal
//
// Source: Paper/chapters_src/14_the_full_algorithm_demographic_paradox_c.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch13: ChapterContent = {
  meta: {
    id: 'ch13',
    slug: 'full-algorithm',
    number: 13,
    title:
      'The Full Algorithm: Demographic Paradox, Cannibalization, and the 5-Tier Reveal',
    era: '1994–Present',
    hook: 'Demographic paradox, cannibalization, and the five-tier reveal.',
    accentColor: '#6c3d9e',
    heroVisual: {
      kind: 'equation',
      latex:
        '\\max_{\\{P_i\\}}\\; \\mathcal{E}(t) \\quad \\text{subject to} \\quad M_{\\text{eff}}(t) < \\tau',
      label: 'The kernel objective',
    },
  },

  scenes: [
    {
      id: 'terminal-runtime',
      title: 'Terminal Runtime',
      prose: [
        'The full five-tier hierarchy has become visible. The carceral apparatus operates at industrial scale while the Buffer Class detects the erosion of its own material position.',
        'The extraction boundary now moves through a population that was recruited to defend the partition. The system continues to route status downward and value upward as the protected zone contracts.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: '1994–PRESENT (TERMINAL RUNTIME)',
          lines: [
            {
              field: 'System Stress',
              value:
                'min, class resistance: CRITICAL — Out-group demographic deficit engineered. Buffer Class detecting contract breach.',
            },
            {
              field: 'Capital',
              value:
                'max, extraction output: PEAK — Carceral industry, private prisons, and financialized debt instruments running at design throughput.',
            },
            {
              field: 'Interference State',
              value:
                'Phi load, proximity to tau: [0.82, 0.95]; rho tau in [0.92, 1.05].',
            },
            {
              field: 'Variables Loaded',
              value:
                'ALL 5 TIERS OPERATING VISIBLY — E, P puppet, F enforce, I buffer, O racialized.',
            },
            {
              field: 'Variables Deployed This Cycle',
              value:
                'P spatial (Sensitive Places), P gaslight (kernel denial), P toxin (biological degradation), Universal Latent Criminality, P fetal personhood.',
            },
            {
              field: 'Executing Function',
              value:
                'Cannibalization subroutine active. Extraction zone expanding into I buffer as O racialized supply contracts.',
            },
            {
              field: 'WARNING',
              value:
                'min VARIABLE FAILING. System entering terminal phase. Geopolitical override routines on standby.',
            },
          ],
        },
        {
          kind: 'insight',
          heading: 'Conditional protection',
          paragraphs: [
            'Buffer-Class membership persists while identification with the partition remains useful and the extraction system can fund its suppression allocation. Terminal runtime exposes the conditional structure of that position.',
          ],
        },
      ],
    },

    {
      id: 'demographic-paradox',
      title: 'The Demographic Paradox',
      prose: [
        'The source identifies a demographic contradiction inside the extraction system. Before the ratification of the 13th Amendment, the legal treatment of Black bodies as capital made biological expansion economically valuable to the Elite.',
        'Legal reclassification changed the political meaning of population. The source traces a subsequent inversion through the eugenics movement and population-control institutions aimed at suppressing the Black birth rate.',
        'The demand for extraction continued as the primary extraction pool contracted. The algorithm responded by widening the broader Out-group and absorbing former members of the Buffer Class.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'I_{\\text{buffer}}(t) \\subset I_{\\text{buffer}}(t-1) \\quad \\text{and} \\quad O(t) \\supset O(t-1)',
            label: 'eq. 10.2',
            caption:
              'The Buffer Class contracts as the broader extraction pool expands.',
          },
        },
        {
          kind: 'visual',
          spec: {
            kind: 'expansion',
            caption: 'The extraction boundary widens as former members of the Buffer Class are absorbed into the broader Out-group.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'The source uses the shrinking middle class as an illustrative measure. The share of adults in middle-income households fell from 61% in 1971 to 50% in 2015, and median real household wealth for the middle quintile declined 20% from 2001 to 2016.',
            'Cannibalization remains falsifiable within the chapter’s framework. A sustained improvement in Buffer-Class wealth, health, and incarceration outcomes, accompanied by gains for the racialized Out-group and a loss at the apex, would violate the proposed invariant.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Demographic Paradox',
          definition:
            'The contradiction produced when the system suppresses the reproduction of its primary extraction pool while preserving an accumulation requirement that demands continued expansion.',
        },
        {
          term: 'Cannibalization',
          definition:
            'The expansion of the extraction boundary into the Buffer Class after the established Out-group can no longer satisfy the system’s accumulation requirement.',
        },
      ],
    },

    {
      id: 'immigration-safety-valve',
      title: 'Immigration as a Safety Valve',
      prose: [
        'Immigration supplies a temporary supplement to the extraction pool. New arrivals enter an economically precarious and politically marginal position parallel to the racialized Out-group.',
        'European immigrant groups historically converted probationary status into Buffer-Class membership through participation in anti-Black exclusion. The chapter names labor displacement, trade-union exclusion, party politics, the GI Bill, and the FHA mortgage apparatus as mechanisms of admission and differentiation.',
        'Black immigrants provide a test of the compounding model. Their racialization operates immediately, while lineage-specific exposure to enslavement, the 13th Amendment exception, redlining, and the War on Drugs differs from the exposure accumulated by native-born Black Americans.',
        'The reported outcomes occupy an intermediate position. In 2019, 31% of Black immigrants aged 25 and older held a bachelor’s degree or higher, Black immigrant-headed households had a median income of $57,200, 14% lived below the poverty line, and Black immigrant-headed households had a 42% homeownership rate.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Path-dependent extraction',
          paragraphs: [
            'Phenotype routes a person into the racialized field. Lineage-specific historical operators determine the depth of the accumulated extraction burden.',
          ],
        },
      ],
    },

    {
      id: 'family-execution',
      title: 'The Family as an Extraction Surface',
      prose: [
        'The five-tier architecture reaches the intimate scale through partnership, parenting, and kinship. Revenue flows through private prisons, child-support debt, court fees, redevelopment, and media systems that monetize racial stigma.',
        'The Puppet Class translates the extraction preference into child-support orders, welfare marriage penalties, and ideological programs. The Enforcement Class removes parents through incarceration and reduces subsequent contact, earnings, and support.',
        'The Buffer Class receives a moral status wage through family-stability comparisons. The chapter places that narrative beside CDC measures showing high daily involvement among Black fathers who live with their children and weekly contact among many nonresident Black fathers.',
        'The racialized Out-group bears the combined effects of incarceration, unemployment, housing segregation, lead exposure, child-support debt, and punitive welfare policy. Black men and Black women encounter these forces through distinct gendered pathways that converge on family instability.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Five-tier execution at family scale',
          paragraphs: [
            'Elite: preserves the extraction invariant through revenue generated around incarceration, debt, housing, and stigma.',
            'Puppet Class: writes and administers the policy interface governing support, welfare, and family ideology.',
            'Enforcement Class: actuates removal through the carceral system.',
            'Buffer Class: receives the psychological wage of family morality.',
            'Out-group: bears the compounding burden across household, labor, health, and housing systems.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Epistemic enclosure',
          definition:
            'A constraint on the population’s capacity to identify the architecture producing the observed family outcomes.',
        },
        {
          term: 'Intersectional coefficient',
          definition:
            'The amplified extraction produced where the racialized and gendered axes intersect.',
        },
      ],
    },

    {
      id: 'closed-feedback-loop',
      title: 'A Closed Feedback Loop',
      prose: [
        'Housing policy concentrates Black families in older housing stock. Lead exposure damages neurodevelopment. Criminal enforcement converts the resulting vulnerability into incarceration, debt, and household removal.',
        'Family dissolution then returns the next generation to poverty and unstable housing. The cycle reproduces its spatial input and renews the same extraction conditions.',
        'Media framing supplies the epistemic layer. Cultural-pathology narratives obscure the policy sequence and restrict collective capacity to identify the enclosure.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Recursive policy output',
          paragraphs: [
            'Spatial containment feeds lead exposure; lead exposure feeds enforcement contact; enforcement contact feeds carceral containment; carceral containment renews spatial containment.',
          ],
        },
        {
          kind: 'pullquote',
          text: 'The tension between Black men and women is the scar tissue left by shared structural violence.',
        },
      ],
      deepDive: {
        label: 'The manuscript’s diagnostic conclusion',
        passages: [
          {
            paragraphs: [
              'Black family instability in America results from policy violence directed at both sexes. The same state mechanisms—mass incarceration, environmental racism, predatory child support, and punitive welfare policy—attack Black men and Black women from different angles, producing outcomes that are then misread as individual moral failures. The "tension" between Black men and women is the scar tissue left by shared structural violence.',
            ],
          },
        ],
      },
    },

    {
      id: 'proxy-boundaries',
      title: 'Proxy Boundaries and Selective Enforcement',
      prose: [
        'Modern policy shifts the extraction interface toward bureaucratic, economic, and spatial variables. Licensing discretion, restricted locations, fees, and complex classifications determine who can exercise autonomy without entering the carceral system.',
        'New York State Rifle & Pistol Association, Inc. v. Bruen (2022) disrupted the subjective “proper cause” requirement. The chapter traces the subsequent use of “Sensitive Places” as a spatial proxy that can turn ordinary movement through a city into legal exposure.',
        'Statutory exemptions preserve autonomy for active and retired members of the Enforcement Class and for protected people who can obtain armed security. Financial barriers convert access into a price-gated privilege.',
        'Universal Latent Criminality completes the mechanism. Broad, overlapping statutes place much of the population within reach of enforcement discretion, and target selection determines who enters the degraded Out-group.',
      ],
      keyConcepts: [
        {
          term: 'Spatial proxy',
          definition:
            'A geographic restriction that changes legal classification as a person crosses a boundary.',
        },
        {
          term: 'Universal Latent Criminality',
          definition:
            'A condition in which broad and overlapping criminal rules make legal exposure widespread while selective enforcement determines actual subjugation.',
        },
      ],
    },

    {
      id: 'five-tier-reveal',
      title: 'The Complete Five-Tier Hierarchy',
      prose: [
        'The chapter consolidates the historical architecture into five operational positions. Each position performs a distinct function in the downward transmission of control and the upward routing of extracted value.',
        'The hierarchy remains set-theoretic and relational. Its intermediate tiers receive conditional benefits calibrated to secure compliance, absorb friction, and protect the apex from direct exposure.',
      ],
      visual: {
        kind: 'tierLadder',
        tiers: [
          {
            symbol: 'E',
            name: 'Elite',
            description:
              'Extracts value and receives the dominant benefit generated by the architecture.',
          },
          {
            symbol: 'P',
            name: 'Puppet Class',
            description:
              'Legislates the interface and translates the extraction objective into policy.',
          },
          {
            symbol: 'F',
            name: 'Enforcement Class',
            description:
              'Physically actuates extraction and receives compensation that binds enforcement capacity to the apex.',
          },
          {
            symbol: 'I',
            name: 'Buffer Class',
            description:
              'Absorbs kinetic friction and receives status wages by default, with material wages deployed under elevated class-coherence threat.',
          },
          {
            symbol: 'O',
            name: 'Out-group',
            description:
              'Bears the primary compounding burden across the system’s extraction channels.',
          },
        ],
        caption:
          'Control moves downward through the five tiers while extracted value moves upward.',
      },
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The Predatory Min-Max Function',
          paragraphs: [
            'The Predatory Min-Max Function is the governing optimization algorithm of the five-tier extraction architecture.',
          ],
          equations: [
            {
              latex:
                'E \\;\\subset\\; P_{\\text{uppet}} \\;\\subset\\; I_{\\text{buffer}} \\;\\subset\\; I, \\qquad O_{\\text{racialized}} \\cap I = \\emptyset',
              label: 'eq. 10.4',
            },
          ],
        },
      ],
    },

    {
      id: 'predatory-min-max',
      title: 'The Predatory Min-Max Function',
      prose: [
        'The Max variable tracks extraction of capital, labor, and autonomy. The Min variable tracks the risk of unified class resistance against the Elite.',
        'The policy set supplies the execution layer. The Puppet Class writes policy, the Enforcement Class actuates it, the Buffer Class receives suppression allocations, and the racialized Out-group bears the accumulated burden.',
        'Effective resistance equals class-coherence threat after damping from compound phase loading. The suppression envelope combines status wages, material wages, kinetic repression, and identity-fragmentation load to keep effective resistance below the crash threshold.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\max_{\\{P_i\\}}\\; \\mathcal{E}(t) \\quad \\text{subject to} \\quad M_{\\text{eff}}(t) < \\tau',
            label: 'eq. 10.5',
            caption:
              'Extraction is maximized while effective class resistance remains below the crash threshold.',
          },
        },
        {
          kind: 'insight',
          heading: 'Tier benefit ordering',
          paragraphs: [
            'The source orders benefit from the Elite through the Puppet, Enforcement, and Buffer classes to the racialized Out-group. The dominant gap separates the Elite from every tier below it.',
          ],
        },
      ],
    },

    {
      id: 'kernel-invariance',
      title: 'The Apex Recovers',
      prose: [
        'The chapter tests the kernel objective against long-run income and wealth data. Top 1% pre-tax income share moved from 18.9% in 1913 to 10.5% in 1978 and 19.1% in 2019. Top 0.1% wealth share moved from 25.1% in 1929 to 7.3% in 1978 and 17.4% in 2019.',
        'The Great Recession supplies a modern balance-sheet test. The bottom 50% share of aggregate household net worth fell from 1.7% in 2007:Q4 to 0.4% in 2011:Q4, while the top 10% share rose from 67.1% to 68.8%.',
        'Debt persistence sharpened the asymmetry. Average bottom-half net worth fell from roughly $19,000 in 2007:Q4 to about $4,200 in 2010:Q4 while average liabilities remained near $86,000.',
        'The source interprets the crash as a recompile in which lower tiers absorbed balance-sheet destruction, debt claims persisted, and asset-market restoration favored the tiers already positioned in financial assets.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The material wage becomes an extraction surface',
          paragraphs: [
            'Homeownership had supplied a material wage to much of the Buffer Class and a narrow asset channel to many racialized households. A housing-led crash converted that same channel into a mechanism for routing loss downward.',
          ],
        },
      ],
    },

    {
      id: 'cannibalization-phase',
      title: 'Cannibalizing the Buffer Class',
      prose: [
        'Terminal phase names a set-theoretic endpoint. The extraction boundary reaches everyone outside the Elite and the system begins consuming intermediate tiers that previously enforced its partition.',
        'The chapter identifies the Great Recession as a domestic transition signal. Home equity disappeared across the lower strata of the Buffer Class, debt claims survived, and the recovery concentrated gains among households already holding equities, bonds, and institutional real estate.',
        'The same expansion appears in criminal enforcement. Total incarceration grew from approximately 503,586 in 1980 to approximately 2,307,504 at its 2008 peak, while the Black-to-White per-capita incarceration ratio remained between 3.92 and 6.11 across 1980–2024.',
        'The racialized Out-group remains at the compounding floor as the broader extraction pool grows. Cannibalization adds new targets without erasing the inherited ordering inside the expanded Out-group.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'expansion',
            caption: 'The expanding carceral boundary absorbs additional non-Elite groups while preserving the racialized ordering within the extraction pool.',
          },
        },
        {
          kind: 'formal',
          variant: 'conjecture',
          label: 'Terminal endpoint',
          paragraphs: [
            'The terminal extraction boundary contains everyone outside the Elite.',
          ],
        },
      ],
    },

    {
      id: 'reclassification-operator',
      title: 'The Reclassification Operator',
      prose: [
        'Ruby Ridge and Waco provide earlier cases of Buffer-Class reclassification. The source treats the National Firearms Act of 1934 as a legal proxy that enabled federal force against rural, armed populations outside the racialized Out-group.',
        'At Ruby Ridge, the source traces an informant’s induced shotgun sale, a misstated trial date, a bench warrant, surveillance, and rules of engagement that the Department of Justice later found unconstitutional. At Waco, a firearms investigation escalated into a dynamic entry and a 51-day siege.',
        'The formal operator evaluates kinetic capacity and compliance. Buffer-Class status persists below the tolerated kinetic threshold while procedural and ideological compliance holds.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\mathcal{R}(x_i) = \\begin{cases} I_{\\text{buffer}} & \\text{if } K(x_i) \\leq K_{\\text{tolerated}} \\text{ and } \\mathrm{comply}(x_i) = 1 \\\\ O_{\\text{final}} & \\text{if } K(x_i) > K_{\\text{tolerated}} \\text{ or } \\mathrm{comply}(x_i) = 0 \\end{cases}',
            label: 'eq. 10.13',
            caption:
              'Classification changes when kinetic capacity exceeds tolerance or compliance fails.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'Once the operator assigns an individual to the final Out-group, the status wage falls away and enforcement applies the reclassified rules. The episode-specific pretext varies while the threshold function remains available.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Kinetic capacity',
          definition:
            'Armament multiplied by demonstrated willingness to deploy against the Enforcement Class.',
        },
        {
          term: 'Tolerated threshold',
          definition:
            'The level of Buffer-Class kinetic capacity permitted by the Elite under the current runtime.',
        },
      ],
    },

    {
      id: 'temporal-enclosure',
      title: 'The Enclosure of Future Labor',
      prose: [
        'The household debt structure visible in the Great Recession extends into a temporal enclosure. Future wages remain pledged after the underlying asset has lost value, preserving the liability claim across the crash.',
        'Sovereign debt generalizes the same mechanism. The chapter defines a class of instruments that discounts the future labor capacity of the Out-group and Buffer Class into present claims routed toward the Elite.',
        'Financial repression operates through real interest rates below zero. Wage-earners, savers, and pension holders lose purchasing power in nominal instruments while holders of hard assets, equities, and real estate retain inflation-sensitive claims.',
        'This channel closes the chapter’s full algorithm. Extraction expands across demographic, spatial, carceral, biological, financial, and temporal surfaces while the hierarchy preserves the direction of control and benefit.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Temporal Enclosure',
          paragraphs: [
            'A Temporal Enclosure is the algorithmic securitization of future human labor.',
          ],
          equations: [
            {
              latex:
                'X_{\\text{temporal}} := \\left\\{ D_{\\text{sovereign}} \\;\\middle|\\; D_{\\text{sovereign}} \\text{ securitizes } L_{\\text{future}}\\bigl(O \\cup I_{\\text{buffer}}\\bigr) \\;\\text{and}\\; \\frac{d}{dt}\\bigl[\\mathrm{PV}(L_{\\text{future}})\\bigr] \\xrightarrow{\\;\\delta_E\\;} E \\right\\}',
              label: 'eq. 10.15',
            },
          ],
        },
        {
          kind: 'insight',
          heading: 'Low-friction extraction',
          paragraphs: [
            'Temporal enclosure transfers claims through the price of money and the structure of debt. Its operation produces no single physical seizure point around which resistance can readily organize.',
          ],
        },
      ],
    },
  ],
};

export default ch13;
