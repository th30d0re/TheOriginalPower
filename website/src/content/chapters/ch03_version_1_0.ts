// Chapter 3 — Version 1.0: Initializing the Vector (15th-Century Portugal)
//
// Source: Paper/chapters_src/04_version_1_0_initializing_the_vector_15th.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch03: ChapterContent = {
  meta: {
    id: 'ch03',
    slug: 'version-1-0',
    number: 3,
    title: 'Version 1.0: Initializing the Vector (15th-Century Portugal)',
    era: '15th-Century Portugal',
    hook: 'Lisbon compiles the first racial vector.',
    accentColor: '#d2703a',
    heroVisual: {
      kind: 'equation',
      latex: '\\vec{R}_{\\text{acism}} = M_{\\text{agnitude}} \\cdot \\hat{d}_{\\text{state}}',
      label: 'The Vector Equation of Racism',
    },
  },

  scenes: [
    {
      id: 'lisbon-runtime',
      title: 'Compilation: Lisbon, 1486',
      blocks: [
        {
          kind: 'runtimeLog',
          title: '1486 (LISBON, PORTUGAL)',
          lines: [
            {
              field: 'System Stress',
              value:
                'HIGH — Domestic labor shortage threatening agricultural capital. Existing moral framework constrains exploitation of Christians. (min: class resistance)',
            },
            {
              field: 'Capital',
              value:
                'STAGNANT — Sugar trade demands labor the current moral economy cannot supply. (max: extraction output)',
            },
            {
              field: 'Interference State',
              value:
                'LOW — axis count; phenotype partition initializing. Estimated Φ_load ∈ [0.10, 0.20], ρ_τ = M(t)/τ ∈ [0.70, 0.85]. (proximity to τ)',
            },
            {
              field: 'Active Patch',
              value: 'Compiling Version 1.0...',
            },
            {
              field: 'Variables Deployed',
              value: 'The Elite Class (E), The Out-group (O_racialized), The In-group (I).',
            },
            {
              field: 'Executing Function',
              value: 'The Implicit Contract (Issuing the Psychological Wage).',
            },
            {
              field: 'Result',
              value:
                'Extraction Algorithm initialized. [POLICY] Dum Diversas (1452) and Romanus Pontifex (1455) authorize unlimited exploitation. [POLICY] Casa dos Escravos (1486) institutionalizes state-managed extraction. Vector established.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The Portuguese Crown faced a shortage of cheap domestic labor as the lucrative sugar trade expanded. Scaling the trade required a labor class exposed to indefinite extraction without wages, rights, or the protections available to Christian peasants.',
            'The Crown bifurcated the population and minted an Out-group alongside an In-group. Law, liturgy, trade records, and ordinary perception encoded a predictive rule: African meant extractable, while Christian-European meant protected.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Racial prior',
          definition:
            'A predictive social rule that classifies African people as extractable before any individual act is known.',
        },
        {
          term: 'Institutional legibility',
          definition:
            'The transmission of a legal partition through registries, proclamations, customs houses, notaries, and official narrative.',
        },
      ],
    },

    {
      id: 'vector-equation',
      title: 'Prejudice Acquires Direction',
      prose: [
        'Personal bias carries magnitude. Institutional power supplies direction. The chapter formalizes systemic racism as the product of prejudice magnitude and a state-directed unit vector.',
        'Susan Abulhawa articulated racism as a state-directed vector. This formalization specifies magnitude as M and state forcing as d-state. It functions as a conceptual model for the scalar-versus-vector distinction.',
      ],
      visual: {
        kind: 'equation',
        latex: '\\vec{R}_{\\text{acism}} = M_{\\text{agnitude}} \\cdot \\hat{d}_{\\text{state}}',
        label: 'eq. 2.1',
        caption:
          'Human prejudice becomes systemic racism when state power supplies institutional direction.',
      },
      deepDive: {
        label: 'The limits of the formalization',
        passages: [
          {
            paragraphs: [
              'Note on formalization. This equation is a conceptual formalization—a pedagogical device for establishing the scalar-vs-vector distinction and for making precise that individual prejudice (M, a scalar) produces systemic racism only when combined with the state-supplied directional force (d-state). It does not specify a vector space or basis vectors, and is not intended to function as a quantitative predictive formula.',
            ],
          },
        ],
      },
    },

    {
      id: 'elite-dilemma',
      title: 'The Labor Constraint',
      prose: [
        'Fifteenth-century Portuguese peasants and nobles belonged to a shared Christian moral community. Religious doctrine, legal standing, social cohesion, and demographic limits constrained the Crown’s treatment of domestic labor.',
        'The Elite sought a permanent slave class whose members could be worked to death, separated from their families, and treated as property. Existing gender subjugation supplied a template for enforcing a visible biological boundary. The trans-Saharan slave trade supplied phenotypic prejudice and the Curse of Ham doctrine as prior ideological material.',
        'Portugal assembled these precedents into a transnational legal and commercial system. Papal authorization, the Casa dos Escravos, hereditary status rules, and markets built around enslaved bodies made the partition durable and exportable.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'The zero-day compiled prejudice into a permanent, heritable, globally exportable operating system.',
        },
      ],
      deepDive: {
        label: 'The two precedents',
        passages: [
          {
            heading: 'Visible biological partition',
            paragraphs: [
              'The first was the European subjugation of women. This predates the invention of modern racial capitalism and provided the foundational architectural template for extracting labor through the enforcement of an easily identifiable biological boundary.',
            ],
          },
          {
            heading: 'The trans-Saharan trade',
            paragraphs: [
              'The second was the Islamic trans-Saharan slave trade. Centuries before the first Portuguese caravel reached West Africa, Arab and Berber merchants had operated documented trade routes moving enslaved sub-Saharan Africans across the Sahara to the Mediterranean and Middle East—a system historians estimate transported upward of eight million people between the 7th and 15th centuries.',
            ],
          },
        ],
      },
    },

    {
      id: 'zurara-and-the-raids',
      title: 'Moral Exclusion Becomes an Operational System',
      prose: [
        'Gomes de Zurara wrote a Crown-commissioned chronicle in the 1450s that portrayed diverse African peoples as one inferior, subhuman category. The narrative supplied moral and intellectual authorization for kidnapping and enslavement.',
        'On August 8, 1444, six ships led by Lançarote de Freitas returned to Lagos with 235 kidnapped Sanhaja Berbers. Prince Henry the Navigator collected the royal fifth as captives were divided into lots. Zurara witnessed families being separated and framed the event as divine deliverance.',
        'A fourteen-ship expedition met organized Wolof resistance in 1445–1446. Rising costs pushed Portugal toward a supply-chain model based on firearms and enslaved captives. Local elites entered that chain through locally rational incentives, while Portuguese law imposed ontological reclassification at its destinations.',
      ],
      deepDive: {
        label: 'Zurara’s operational record',
        passages: [
          {
            paragraphs: [
              'The conventional framing of the early slave trade as "trade" obscures its operational reality. The Portuguese did not begin by trading with West African kingdoms. They began by kidnapping. Zurara\'s own chronicle—the same text that invented the racial justification—is simultaneously the operational log of armed raiding expeditions.',
            ],
          },
        ],
      },
    },

    {
      id: 'implicit-contract',
      title: 'The Original Implicit Contract',
      prose: [
        'The racialized Out-group expanded the labor supply and created a domestic security problem. Portuguese peasants could recognize that the Crown retained the wealth generated by extraction. The implicit contract stabilized their position through a suppression allocation.',
        'Legal classification placed enslaved Africans below the boundary of recognized humanity. Portuguese peasants received the protected status of the In-group. This status wage required no transfer of capital from the Elite.',
        'The Casa dos Escravos, royal proclamations, customs records, notarial practice, and Zurara’s official narrative made the partition legible throughout Portugal. Physical proximity to an enslaved person was unnecessary.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Slave Capitalism',
          paragraphs: [
            'Slave capitalism combines capitalist accumulation with racialized slave labor. The Elite secures working-class complicity through an implicit contract that offers racial status in exchange for tolerating and enforcing the exclusion of an enslaved population from the moral community.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Psychological wage',
          definition:
            'A non-material guarantee of ontological superiority, deference, and racial privilege issued to the In-group.',
        },
        {
          term: 'Material wage',
          definition:
            'A material concession activated when class-coherence threat approaches the critical threshold and funded through deeper Out-group extraction.',
        },
      ],
    },

    {
      id: 'complex-wage',
      title: 'The Suppression Allocation as Complex Power',
      prose: [
        'The suppression allocation contains two orthogonal modes. The real component, psi-m, represents land, capital, healthcare, and other concessions that perform physical work. The imaginary component, j psi-s, represents status that sustains the field and transfers no material energy.',
        'The phase angle diagnoses the operating mode. Zero degrees represents a fully material wage. Ninety degrees represents complete pacification through symbolic status. Angles above ninety degrees represent active material extraction from the Buffer Class alongside an inflated psychological wage.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Complex Suppression Allocation W',
          paragraphs: [
            'The material wage belongs to the real domain and is sourced from deeper extraction of the racialized Out-group.',
            'The psychological wage belongs to the imaginary domain. It costs the Elite zero capital and deflects class momentum without transferring material energy.',
          ],
          equations: [
            {
              latex: 'W = \\psi_m + j\\psi_s',
              label: 'eq. 2.2b',
            },
          ],
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Solidarity as Imaginary Cancellation',
          paragraphs: [
            'The complex conjugate represents rejection of the psychological wage. Alignment between the Buffer Class and Out-group cancels the imaginary status component and doubles real material power.',
          ],
          equations: [
            {
              latex:
                'W + W^* = (\\psi_m + j\\psi_s) + (\\psi_m - j\\psi_s) = 2\\psi_m',
              label: 'eq. 2.2e',
            },
          ],
        },
      ],
      visual: {
        kind: 'manim',
        src: '/animations/ComplexWage.mp4',
        caption:
          'The complex wage separates material concessions from the orthogonal status allocation.',
      },
      deepDive: {
        label: 'The inaugural operating mode',
        passages: [
          {
            paragraphs: [
              'In its inaugural Portuguese deployment, psi-m = 0: the Elite pacified their working class without spending a single coin, buying their loyalty entirely through the distribution of optical superiority. The In-group accepted their economic subjugation because the system guaranteed them social supremacy over the Out-group.',
            ],
          },
        ],
      },
    },

    {
      id: 'control-cases',
      title: 'Partition Variables',
      prose: [
        'Roman slavery supplies a control case for extraction without racial coding. Enslaved people came from every ethnicity conquered by Rome. Membership followed conquest, debt, crime, or birth. Manumission, wealth, and political standing for descendants remained possible.',
        'Religious partition supplies a second control case. European elites had already divided populations through doctrine, sect, and heresy. Such boundaries required surveillance, oaths, informants, confessions, and visible markers because religious identity could be concealed or changed.',
        'Phenotype reduced identification cost. The racial partition made membership visible, involuntary, heritable, and continuously broadcast. The extraction engine selected this variable for its sorting efficiency.',
      ],
      visual: {
        kind: 'equation',
        latex:
          'O_{\\text{religious}}^{\\text{pre-1450}} = f(\\text{doctrine, sect, heresy}) \\quad \\longrightarrow \\quad O_{\\text{racialized}}^{\\text{post-1450}} = f(\\text{phenotype})',
        label: 'eq. 2.6',
        caption: 'The partition function changes its input variable.',
      },
      keyConcepts: [
        {
          term: 'Variable-based analysis',
          definition:
            'A diagnosis based on assigned structural roles, received allocations, and enforcement behavior.',
        },
      ],
    },

    {
      id: 'first-three-variables',
      title: 'The Embryonic Three-Tier System',
      prose: [
        'Portugal’s initial system contains three actors. The Elite directs extraction. The racialized Out-group bears its burden. The In-group receives a suppression allocation that secures complicity.',
        'The Elite constitutes approximately 0.002 percent of the population in the chapter’s formalization and sits within the In-group as a subset with distinct material interests. The Out-group supplies the primary extraction pool. The In-group receives status by default and material concessions when kinetic threat requires them.',
        'This embryonic ordering later acquires additional tiers as specific security failures force the system to add new functions.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'venn',
            data: {
              inGroup: { label: 'In-group (I)', members: ['Working-class population'] },
              outGroup: { label: 'Out-group (O-racialized)', members: ['African peoples and their descendants'] },
              elite: { label: 'True Elite (E)', members: ['Hyper-concentrated capital class', 'Approximately 0.002% of the population'] },
            },
            caption: 'The Elite sits inside the In-group while the racialized Out-group forms the primary extraction pool.',
          },
        },
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\text{Benefit}(E) \\gg \\text{Benefit}(I) > \\text{Benefit}(O_{\\text{racialized}})',
        label: 'eq. 2.7',
        caption:
          'Elite benefit strictly dominates the suppression allocation paid to the In-group.',
      },
      deepDive: {
        label: 'The chapter’s scope',
        passages: [
          {
            paragraphs: [
              'A Note on Scope and Specificity: This model is specifically designed to analyze racism as a unique system rooted in the 15th century racialization of African peoples for the purposes of enslavement and colonial exploitation. The notation O-racialized reflects this historical specificity.',
            ],
          },
        ],
      },
    },

    {
      id: 'legitimation-loop',
      title: 'Institutional Legitimation',
      prose: [
        'The Crown recruited authoritative institutions to naturalize exclusion. The Church supplied moral authorization through the Curse of Ham doctrine, Dum Diversas in 1452, Romanus Pontifex in 1455, baptism without liberation, and missionary claims of spiritual mercy.',
        'Scientific institutions later supplied secular authorization through racial taxonomy, craniology, phrenology, polygenism, Social Darwinism, and eugenics. Produced disparities entered these systems as evidence of inherent inferiority.',
        'Seminaries and universities reproduced the claims across generations. Exploitation generated disparities, legitimation explained those disparities as natural, and naturalization licensed expanded exploitation.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\begin{aligned}\n&\\text{Exploitation} \\rightarrow \\text{Observed disparities} \\rightarrow \\text{Theological/Scientific ``explanation\'\'} \\\\\n&\\rightarrow \\text{Naturalization} \\rightarrow \\text{Expanded exploitation}\n\\end{aligned}',
        label: 'eq. 2.8',
        caption: 'The institutional feedback loop.',
      },
      deepDive: {
        label: 'Anténor Firmin’s counter-signal',
        passages: [
          {
            paragraphs: [
              'A Haitian lawyer, diplomat, and self-taught anthropologist named Joseph Auguste Anténor Firmin published De l\'égalité des races humaines (anthropologie positive) in Paris. It was the world\'s first sustained, book-length, empirically grounded refutation of scientific racism.',
              'The cranial measurements, brain volume charts, and anthropometric tables that were supposed to prove racial hierarchy wildly overlapped across populations. There was no signal. Firmin concluded that the data was entirely "anarchic" and yielded no reliable indication of biological superiority.',
            ],
          },
        ],
      },
    },

    {
      id: 'atlantic-export',
      title: 'The Source Code Crosses the Atlantic',
      prose: [
        'Spanish and British colonies adopted Portugal’s legal, religious, and financial architecture. The system accumulated racial codes, insurance, banking, and enslaved people treated as mortgage collateral.',
        'In 1619, the English privateer White Lion intercepted the Portuguese slave ship São João Bautista and seized approximately twenty enslaved Africans. Their delivery to Point Comfort transferred a system that Portugal had operated for more than a century into British North America.',
        'American plantations placed enslaved Africans and indentured European servants under shared brutal conditions. Daily co-labor subjected the paper partition to a severe stress test and prepared the system’s first major crash.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Hardware Reading: The Initial Voltage Source',
          paragraphs: [
            'Portugal installed a complete electrodynamic extraction grid. The Elite operated as the control gate, while the labor of subjugated populations supplied the energy. Papal bulls established the extraction gradient, the African coast served as the source terminal, the Middle Passage carried the current, and plantations formed the load.',
            'The grid depended on continuous extraction from its source terminal. Colonial powers replicated this circuit topology across later deployments.',
          ],
        },
      ],
    },
  ],
};

export default ch03;
