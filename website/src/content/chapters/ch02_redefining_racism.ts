// Chapter 2 — Redefining Racism
//
// Source: Paper/chapters_src/03_redefining_racism.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch02: ChapterContent = {
  meta: {
    id: 'ch02',
    slug: 'redefining-racism',
    number: 2,
    title: 'Redefining Racism',
    era: 'The Definition',
    hook: 'Racism as an elite extraction algorithm rather than individual prejudice.',
    accentColor: '#e08a3c',
    heroVisual: {
      kind: 'equation',
      latex:
        '\\text{Elite Economic Interests} \\rightarrow \\text{Systemic Racialization} \\rightarrow \\text{Interpersonal Prejudice}',
      label: 'The primary causal direction',
    },
  },

  scenes: [
    {
      id: 'the-central-definition',
      title: 'The System Is the Point',
      prose: [
        'Racism is a system of policies and structures that creates and maintains racial hierarchy for Elite economic benefit. Law and policy institutionalize the hierarchy. Ideological narratives naturalize it. Interpersonal prejudice reinforces it.',
        'Prejudice names individual attitudes, stereotypes, and discriminatory behaviors based on group membership. Racism weaponizes those phenomena through institutions, compounds their effects over time, and directs the resulting extraction toward a small Elite class.',
        'An individual can participate in a racist system without conscious racial animus. Institutional rules execute through ordinary compliance, professional incentives, and inherited procedures. The diagnostic target is the system that converts bias into durable power.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'Racism is a system of policies and structures that create and maintain racial hierarchies for Elite economic benefit.',
        },
      ],
      keyConcepts: [
        {
          term: 'Prejudice',
          definition:
            'Individual attitudes, stereotypes, or discriminatory behaviors based on group membership.',
        },
        {
          term: 'Racism',
          definition:
            'A system that institutionalizes racial hierarchy for extraction, control, and the prevention of working-class solidarity.',
        },
      ],
    },

    {
      id: 'resolve-the-binary',
      title: 'Increase the Resolution',
      prose: [
        'The In-group and Out-group partition identifies the first boundary imposed by an oppressive system. Higher resolution reveals the actors who design, administer, enforce, defend, and endure that boundary.',
        'The In-group contains four operational tiers. The Elite extracts value. The Puppet Class translates Elite interests into law and policy. The Enforcement Class actuates the boundary. The Buffer Class receives status or material compensation for defending a hierarchy it does not control.',
        'The racialized Out-group also contains internal rankings shaped by capital, phenotype, gender, geography, legal status, credentialing, and criminalized status. A person can occupy an advantaged position under one axis and an extractable position under another.',
      ],
      visual: {
        kind: 'tierLadder',
        tiers: [
          {
            symbol: 'E',
            name: 'Elite',
            description: 'Architects the system and receives the concentrated extraction yield.',
          },
          {
            symbol: 'P',
            name: 'Puppet Class',
            description: 'Translates Elite interests into law, policy, and institutional procedure.',
          },
          {
            symbol: 'F',
            name: 'Enforcement Class',
            description: 'Physically actuates the partition and its extraction rules.',
          },
          {
            symbol: 'I',
            name: 'Buffer Class',
            description: 'Defends the partition in exchange for status wages or material concessions.',
          },
          {
            symbol: 'O',
            name: 'Racialized Out-group',
            description: 'Bears the compounding burden of policy and supplies the extraction base.',
          },
        ],
        caption: 'The first binary resolved into its operational hierarchy.',
      },
      keyConcepts: [
        {
          term: 'Recursive partition',
          definition:
            'A local In-group and Out-group ranking induced inside any larger class by an operative social axis.',
        },
      ],
    },

    {
      id: 'causal-reversal',
      title: 'The Primary Causal Direction',
      prose: [
        'Conventional definitions place individual prejudice first and systemic outcomes last. The historical sequence in the manuscript places Elite economic interests first, systemic racialization second, and interpersonal prejudice third.',
        'Zurara’s 1453 racialization of Africans was commissioned work that justified unlimited exploitation. The system recruited existing phenotypic bias, assigned it a durable institutional function, and cultivated the prejudice required to maintain that function.',
        'Interpersonal prejudice subsequently feeds policy through hiring, sentencing, voting, and enforcement. That feedback loop strengthens the structure. The generative direction remains the system’s conversion of bias into institutional self-interest.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\text{Elite Economic Interests} \\rightarrow \\text{Systemic Racialization} \\rightarrow \\text{Interpersonal Prejudice}',
            label: 'eq. 1.4',
            caption: 'The generative direction of the racial system.',
          },
        },
        {
          kind: 'insight',
          heading: 'Policy consequence',
          paragraphs: [
            'Interventions aimed at interpersonal prejudice can reduce a reinforcing signal. Durable structural change reaches the economic and political architecture that makes racial prejudice useful to the Buffer Class and profitable to the Elite.',
          ],
        },
      ],
      deepDive: {
        label: 'The feedback loop',
        passages: [
          {
            paragraphs: [
              'A hiring manager’s implicit bias reduces Out-group employment; a jury’s racial priors produce harsher sentences; a voter’s racial resentment elects Puppet Class candidates who expand the carceral state. These are real causal pathways from interpersonal attitudes to systemic outcomes.',
              'The primary arrow—Elite economic interests to systemic racialization to interpersonal prejudice—is the generative direction: without it, the feedback loop does not exist.',
            ],
          },
        ],
      },
    },

    {
      id: 'virus-and-wetware',
      title: 'A Fractal Computer Virus',
      prose: [
        'The computational model describes racism as unauthorized code that hijacks resources, replicates across scales, and mutates its visible signature while preserving its extraction payload. Each historical era executes a module of the same architecture.',
        'Institutional code becomes durable through ordinary human cognition. Law supplies executable rules. Schools, churches, newspapers, courts, parties, and police distribute updates. Learned priors make each later policy feel familiar and locally rational.',
        'Chronic exposure also enters physiological state. Repeated policing, poverty, spatial containment, humiliation, and anticipatory threat accumulate in bodies through documented stress pathways.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Biological Embedding',
          paragraphs: [
            'Biological embedding names the process by which chronic social exposure becomes physiological system state.',
            'Law, policing, poverty, spatial containment, humiliation, and anticipatory threat repeatedly activate stress pathways until the body carries the history as allostatic load, inflammation, telomere shortening, DNA-methylation changes, accelerated epigenetic aging, and altered threat calibration.',
            'The extraction system can write itself into bodies without making the hierarchy natural.',
          ],
        },
        {
          kind: 'insight',
          heading: 'Evidence boundary',
          paragraphs: [
            'Human studies support biological embedding and intergenerational stress effects. The manuscript limits its race-specific claims to weathering, allostatic load, inflammation, telomere length, and methylation patterns under repeated discrimination.',
          ],
        },
      ],
    },

    {
      id: 'resource-mining-rootkit',
      title: 'The Core Payload',
      prose: [
        'The racial hierarchy operates as a resource-mining rootkit. It captures human labor, time, and bodies and routes accumulated value toward the Elite. The Predatory Min-Max Function names this uninterrupted extraction flow as the kernel objective.',
        'Class coherence creates the governing constraint. The system maximizes time-indexed extraction while keeping collective resistance below a crash threshold. Repeated extraction, humiliation, enclosure, and failed remedy accumulate toward a minimum forcing threshold.',
        'Constitutions, property rules, and the Thirteenth Amendment’s exception clause sit at the kernel layer in this model. Reforms operating within permissions granted by those structures reduce system stress while leaving the extraction objective available.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex: '\\max \\mathcal{E}(t) \\quad \\text{subject to} \\quad M(t) < \\tau',
            label: 'eq. 1.5',
            caption:
              'Extraction output is maximized while class-coherence risk remains below the crash threshold.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Extraction output',
          definition:
            'The time-indexed flow of value captured from the population and accumulated by the Elite.',
        },
        {
          term: 'Crash threshold',
          definition:
            'The point at which class coherence exceeds the system’s containment capacity.',
        },
      ],
    },

    {
      id: 'antebellum-calibration',
      title: 'The Constraint Scales with Extraction',
      prose: [
        'The antebellum cotton economy supplies a calibrated test from 1840 through 1860. Annual cotton revenue increased from approximately $74.1 million to $247 million. Militia and slave-patrol expenditure rose from approximately $2 million to $6.8 million.',
        'The suppression budget remained between 2.70 and 2.88 percent of cotton revenue across all three Census intervals. Its total band measured less than 0.2 percentage points while extraction more than tripled.',
        'The enslaved population grew from 2,487,455 in 1840 to 3,953,761 in 1860. The expansion of the extraction base carried a proportional expansion of suppression capacity.',
      ],
      visual: {
        kind: 'series',
        series: [
          {
            label: 'Annual cotton revenue',
            points: [
              { x: 1840, y: 74.1 },
              { x: 1850, y: 102.5 },
              { x: 1860, y: 247 },
            ],
          },
        ],
        xLabel: 'Census year',
        yLabel: 'Millions of nominal U.S. dollars',
        area: true,
        caption:
          'Cotton revenue rose 233 percent while the suppression ratio held within a 0.18 percentage-point band.',
      },
      deepDive: {
        label: 'Numerical computation',
        passages: [
          {
            paragraphs: [
              'The notebook computes the suppression budget ratio for the 1840, 1850, and 1860 Census intervals. Results are as follows: in 1840, cotton revenue stood at approximately $74.1M against militia/patrol expenditure of approximately $2.0M, yielding a suppression ratio of 2.70%. In 1850, revenue had grown to $102.5M with expenditure of $2.95M (ratio: 2.88%). By 1860, revenue reached approximately $247.0M while suppression expenditure scaled to approximately $6.8M (ratio: 2.75%). Across a period in which extraction tripled, the suppression ratio varied within a band of less than 0.2 percentage points—a coefficient of variation below 0.04. The slave population grew from 2,487,455 in 1840 to 3,953,761 in 1860, reflecting the simultaneous expansion of the extraction base.',
            ],
          },
        ],
      },
    },

    {
      id: 'zero-day-exploit',
      title: 'Race Written into Code',
      prose: [
        'The zero-day exploit was the industrialization of phenotype as a permanent, heritable, legally codified capital asset at transatlantic scale. Earlier societies marked phenotypic difference. Portugal’s juridical and commercial apparatus embedded phenotype in property law, inheritance law, and international commodity markets.',
        'Religion, nationality, and class allowed forms of conversion, movement, or mobility. The racial partition used visible phenotype as a persistent sorting key. Law transformed a superficial biological presentation into a durable institutional boundary.',
        'The transatlantic trade installed that partition across a global extraction network. Nearly two million people died during transport, a mortality rate of 15 percent. Plantation output in sugar, tobacco, cotton, and rice flowed into capital accumulation in Lisbon, London, Amsterdam, and eventually Wall Street.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Bayesian defense',
          paragraphs: [
            'The system repeatedly assigned high precision to a learned racial prior. Phenotype, name, neighborhood, and proxy status could then dominate direct evidence. Selective empathy became an output of institutional reinforcement acting through ordinary predictive cognition.',
          ],
        },
      ],
      deepDive: {
        label: 'The precision boundary',
        passages: [
          {
            paragraphs: [
              'The zero-day exploit was the industrialization of phenotype as a permanent, heritable, legally codified capital asset at transatlantic scale.',
              'Portugal’s juridical and commercial apparatus invented the mechanism by which phenotype could be simultaneously embedded in property law, inheritance law, and international commodity markets—converting a soft cultural variable into a wetware-anchored legal partition that no amount of individual behavior could override. The zero-day was race written into code.',
            ],
          },
        ],
      },
    },

    {
      id: 'interface-swap',
      title: 'The Interface Recompiles',
      prose: [
        'A polymorphic system changes its visible signature when reform raises the cost of the current interface. Chattel slavery recompiled into convict leasing and Black Codes after 1865. Jim Crow recompiled into the War on Drugs and mass incarceration after 1964 and 1965.',
        'The optimizer compares coercive cost, legitimacy cost, and economic cost across partition, integration, direct repression, and externalization. It selects the lowest-cost strategy that preserves extraction and keeps class coherence below threshold.',
        'The Jim Crow interface became increasingly expensive under federal litigation, Cold War scrutiny, and disciplined public confrontation. Facially neutral criminal and drug categories lowered legitimacy costs while preserving racialized target geometry in enforcement outcomes.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'S^\\ast(t) = \\arg\\min_{S} \\left[C_{\\text{coercive}}(S,t) + C_{\\text{legitimacy}}(S,t) + C_{\\text{economic}}(S,t)\\right]',
            label: 'eq. 1.7',
            caption: 'The interface optimizer.',
          },
        },
        {
          kind: 'insight',
          heading: 'The proxy playbook',
          paragraphs: [
            'Association leads to criminalization, enforcement, and media legitimation. Drug-law incarceration rose from 38,680 people in 1972 to 480,519 in 2002. The pre-Fair Sentencing Act crack and powder thresholds encoded a 100:1 disparity into federal sentencing practice.',
          ],
        },
      ],
    },

    {
      id: 'backlash-circuit',
      title: 'Backlash as a Damped Circuit',
      prose: [
        'The hardware model maps reform response onto a series RLC circuit. Bureaucratic and carceral friction acts as resistance. Cultural inertia and institutional entrenchment act as inductance. Token-reform absorption capacity acts as capacitance.',
        'A reform shock pushes equality-surplus charge above the extraction baseline. Stored institutional energy then drives the system through equilibrium and into an extraction overshoot. Abolition was followed by Black Codes, convict leasing, and Klan terror. Civil Rights legislation was followed by the War on Drugs, mass incarceration, and expanded enforcement capacity.',
        'Successive adaptation cycles increase carceral resistance and accelerate damping. Sustained, synchronized coordination supplies the forcing condition capable of exceeding the circuit’s absorption capacity.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex: 'L\\,\\ddot{q} + R\\,\\dot{q} + \\frac{1}{C}\\,q = V(t)',
            label: 'eq. 1.7a',
            caption: 'The governing equation for reform shock and systemic backlash.',
          },
        },
        {
          kind: 'insight',
          heading: 'Scope of the invariant',
          paragraphs: [
            'The model recognizes real gains produced by Black agency, litigation, organizing, legislation, and community formation. It tracks the structural response that restores Elite extraction share across the larger arc.',
          ],
        },
      ],
    },

    {
      id: 'post-1965-wave',
      title: 'The Suppression Envelope Expands',
      prose: [
        'The period from 1965 to 2020 supplies a 55-year test. Union density fell from 28.4 percent to 10.8 percent. Top-decile wealth share rose from 67.5 percent to 76.5 percent.',
        'The overall incarceration rate rose from 108 to 358 per 100,000. Black incarceration increased from an estimated 588 per 100,000 to a 2010 peak of 3,074 before reaching 1,821 in 2020.',
        'The composite suppression envelope expanded by more than 23 percent. By the 1994 Crime Bill, it had more than doubled its 1965 baseline. Solidarity contracted, incarceration expanded, and wealth concentrated in the directions predicted by the model.',
      ],
      visual: {
        kind: 'series',
        series: [
          {
            label: 'Union density',
            color: '#73b7d8',
            points: [
              { x: 1965, y: 28.4 },
              { x: 2020, y: 10.8 },
            ],
          },
          {
            label: 'Top-decile wealth share',
            color: '#e08a3c',
            points: [
              { x: 1965, y: 67.5 },
              { x: 2020, y: 76.5 },
            ],
          },
        ],
        xLabel: 'Year',
        yLabel: 'Percent',
        caption:
          'Two independently sourced components of the post-1965 suppression envelope.',
      },
      keyConcepts: [
        {
          term: 'Suppression envelope',
          definition:
            'The combined status wage, material wage, repression, and phase-loading capacity used to contain class coherence.',
        },
      ],
    },

    {
      id: 'fractal-execution',
      title: 'The Same Code at Every Scale',
      prose: [
        'The extraction architecture reproduces its tier structure across global, national, institutional, interpersonal, and internalized scales. Each scale contains an extractor, a policy interface, an enforcement mechanism, a friction absorber, and an extraction pool.',
        'At the global scale, imperial institutions route resources from debtor populations toward capital centers. At the national scale, redlining, gerrymandering, sentencing, and spatial proxies partition access. At the intimate scale, colorism causes members of the Out-group to execute the system’s sorting function within their own communities.',
        'Additional axes load each subgroup with a different phase position. Race, gender, orientation, ability, religion, and nationality can disperse class alignment and reduce coherent cross-group solidarity.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\Phi_j = \\sum_{k=1}^{K} \\phi_{k,j}, \\qquad\n\\Phi_{\\text{load}}(t) = \\operatorname{Dispersion}\\!\\left(\\{\\Phi_j\\}_{j=1}^{N}\\right) = 1 - \\left|\\frac{1}{N}\\sum_{j=1}^{N} e^{i\\Phi_j}\\right| \\in [0,1]',
            label: 'eq. 1.11',
            caption:
              'Phase loading approaches zero under alignment and one under maximum dispersion.',
          },
        },
      ],
      deepDive: {
        label: 'Lexical propagation',
        passages: [
          {
            paragraphs: [
              'The earliest documented technical use dates to 1904, when the astronomer David Gill described the auxiliary timekeeping device in his Cape Town sidereal clock as the “slave clock.”',
              'After 1960 the vocabulary spread rapidly. A Boolean search of U.S. patents from 1976 onward returns 19,708 patent documents containing both “master” and “slave.”',
              'The vocabulary arrived before them, was normalized before they arrived, and supplies the cognitive defaults they reach for when describing a new piece of hardware or a new API.',
            ],
          },
        ],
      },
    },

    {
      id: 'firewall-and-intervention',
      title: 'The Corrupted Firewall',
      prose: [
        'The Buffer Class absorbs resistance that would otherwise travel toward the Elite. Status wages provide deference, public advantages, and leniency. Material wages add land, credit, income, infrastructure, or legal immunity when collective resistance approaches threshold.',
        'The Buffer Class performs threat absorption, perimeter defense, and ideological misdirection. It redirects conflict toward the racialized Out-group and treats structural critique as a threat to social order.',
        'System operation follows three documented modes. Intentional design creates the architecture through identifiable policy decisions. Autonomous propagation reproduces it through incentive gradients and ordinary local choices. Conscious intervention repairs it at critical junctures when established routines no longer contain resistance.',
        'The diagnostic model directs intervention toward extraction rules, institutional permissions, enforcement channels, and the allocation that purchases Buffer Class alignment. The historical chapters that follow trace those processes through five centuries of execution.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Three operating modes',
          paragraphs: [
            'Intentional design writes the initial code. Autonomous propagation performs most routine replication. Conscious intervention pushes coordinated updates during systemic crises.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Status wage',
          definition:
            'A nonmaterial allocation of rank, deference, public advantage, or legal leniency paid to secure Buffer Class alignment.',
        },
        {
          term: 'Material wage',
          definition:
            'An economic concession deployed under elevated kinetic threat and sourced through continued Out-group extraction.',
        },
      ],
    },
  ],
};

export default ch02;
