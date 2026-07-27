// Chapter 4 — The Application: Bacon's Rebellion, the Buffer Class, and the Constitutional Patch
//
// Source: Paper/chapters_src/05_the_application_bacon_s_rebellion_the_bu.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch04: ChapterContent = {
  meta: {
    id: 'ch04',
    slug: 'bacons-rebellion',
    number: 4,
    title:
      "The Application: Bacon's Rebellion, the Buffer Class, and the Constitutional Patch",
    era: '1676–1787',
    hook: 'A multiracial rebellion produces the buffer class and a constitutional patch.',
    accentColor: '#c85a34',
    heroVisual: {
      kind: 'equation',
      latex: '\\text{Buffer Created:} \\quad I_{poor} \\rightarrow \\text{Defender of } E',
      label: 'The Buffer-Class Patch',
    },
  },

  scenes: [
    {
      id: 'runtime-1676-1787',
      title: 'System Crash and Emergency Recompile',
      blocks: [
        {
          kind: 'runtimeLog',
          title: '1676–1787 (VIRGINIA COLONY → PHILADELPHIA)',
          lines: [
            {
              field: 'System Stress',
              value:
                'CRITICAL — Cross-racial labor solidarity detected. Jamestown burning. (min: class resistance)',
            },
            {
              field: 'Capital',
              value:
                'AT RISK — Plantation economy destabilized by unified revolt. (max: extraction output)',
            },
            {
              field: 'Interference State',
              value:
                'TRANSITIONING — coherence breach pre-patch, then rapid phase-loading through codified racial partition. Estimated Φ_load ∈ [0.15, 0.55]; ρ_τ > 1.00 at crash, then ρ_τ ∈ [0.60, 0.75] post-patch. (Φ_load, proximity to τ)',
            },
            {
              field: 'Active Patch',
              value: 'Emergency recompile. Partitioning the poor…',
            },
            {
              field: 'Variables Loaded',
              value: 'E, O_racialized, I.',
            },
            {
              field: 'Variables Deployed This Cycle',
              value:
                'I_buffer (Buffer Class), F_enforce^proto (Proto-Enforcement Class—I_buffer deputized to police the racial boundary), P_puppet^v1.0 (Puppet Class—prototype), W = jψ_s (formalized).',
            },
            {
              field: 'Executing Function',
              value:
                'Codify “Whiteness.” Weaponize the Implicit Contract into explicit law. Draft constitutional front-end.',
            },
            {
              field: 'Result',
              value:
                '[POLICY] Virginia Slave Codes (1705) partition the working class and deputize I_buffer as racial enforcers. [POLICY] Three-Fifths Compromise (1787) embeds extraction into federal architecture. [POLICY] Constitutional front-end/back-end separation prototypes P_puppet. The min variable temporarily stabilized.',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The colonial two-variable system placed the Elite above a racialized Out-group. Cross-racial labor solidarity exposed its instability. The emergency response added a Buffer Class, formalized the psychological wage, and separated the Elite’s constitutional front-end from its back-end.',
            'The patch preserved the Elite share. Concessions that stabilized the Buffer Class drew their funding from deeper extraction from the racialized Out-group. The invariant delta-max equals zero remained intact.',
          ],
        },
      ],
    },

    {
      id: 'shared-condition',
      title: 'A Working Class with a Common Enemy',
      prose: [
        'The colonial proto-working class combined European indentured servants and enslaved Africans. Shared fields, hunger, violence, and confinement supported alliances across the emerging racial line. Records document workers running away together, sharing food, hiding in forests, and planning rebellion.',
        'Between 300,000 and 500,000 British and Irish people were shipped to the colonies as indentured servants over roughly 150 years, many involuntarily. Approximately 30 percent died during the Atlantic voyage, and another 40 percent died during bondage. These conditions supplied the material basis for solidarity while the racial partition remained incomplete.',
        'Bacon’s Rebellion converted that solidarity into a direct threat in 1676. The united labor class burned Jamestown and demonstrated that coordinated workers could exceed Elite control.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\text{If} \\quad (L_{white} + L_{black}) > E \\quad \\rightarrow \\quad \\text{Revolution}',
            label: 'eq. 3.1',
            caption: 'The solidarity condition exposed by Bacon’s Rebellion.',
          },
        },
      ],
      deepDive: {
        label: 'The evidence of shared extraction',
        passages: [
          {
            paragraphs: [
              'Out of 5,000 servants arriving in one colony between 1670 and 1680, only 241 ever became landowners; approximately 3,500 died before completing their contracts. The Dutch trader David Pietersz de Vries observed English planters gambling away their servants at card games, “treating human lives as poker chips.” Colonial courts almost universally sided with planters on complaints of abuse; contracts could be extended on fabricated charges—breaking a tool, talking back, falling ill.',
              'Records document them running away together, sharing food, hiding in forests, and plotting rebellion. George Washington himself placed runaway advertisements in the Maryland Gazette and the Virginia Gazette offering identical rewards for the capture of both Black and white runaways—the same man, the same reward structure, the same system of human property management applied across racial lines.',
            ],
          },
        ],
      },
    },

    {
      id: 'john-punch',
      title: 'John Punch and Legal Differentiation',
      prose: [
        'The first documented legal operation of the racial partition in the source occurred in 1640. John Punch, a Black man, escaped from a Virginia enslaver with a Scotsman and a Dutchman. The court imposed four additional years of indenture on the two white servants and sentenced Punch to lifetime servitude.',
        'The ruling assigned temporal punishment to the white workers and categorical exclusion from eventual freedom to the Black worker. A single judicial act mapped phenotype onto legal status.',
        'The case also records interracial cooperation before the partition hardened. Colonial law answered that cooperation with differentiated punishment. Economic interests drove systemic racialization, which then supplied the conditions for interpersonal prejudice.',
      ],
      keyConcepts: [
        {
          term: 'Racial partition',
          definition:
            'The legal differentiation that assigned eventual freedom to the white workers and lifetime servitude to John Punch for the same escape.',
        },
      ],
      deepDive: {
        label: 'The 1640 ruling',
        passages: [
          {
            paragraphs: [
              'In 1640, three indentured servants—John Punch, a Black man; a Scotsman; and a Dutchman—ran away together from their Virginia enslaver. All three were recaptured. The court sentenced the two white servants to four additional years of indenture. John Punch was sentenced to servitude for life.',
            ],
          },
        ],
      },
    },

    {
      id: 'compilation-cycle',
      title: 'The Sixty-Five-Year Compilation Cycle',
      prose: [
        'The Virginia Slave Codes of 1705 completed a sequence of judicial and legislative patches extending across 65 years. Each measure closed a specific opening in the extraction system and hardened the racial boundary.',
        'Virginia made enslaved status hereditary through the maternal line in 1662. Maryland declared all people of African descent enslaved for life in 1664. Virginia removed felony liability when an enslaved person died “during correction” in 1669. The three measures secured reproduction, eliminated the contractual endpoint, and expanded enforcement power.',
        'The 1705 codes presented the accumulated system as a public legal interface. The underlying racial kernel had already been tested through the earlier decisions and statutes.',
      ],
      visual: {
        kind: 'timeline',
        data: [
          {
            year: 1640,
            event:
              'John Punch receives lifetime servitude while two white escape companions receive four additional years.',
            outgroup: ['John Punch'],
          },
          {
            year: 1662,
            event:
              'Virginia codifies hereditary slavery through the maternal line under partus sequitur ventrem.',
            outgroup: ['Children of enslaved women'],
          },
          {
            year: 1664,
            event: 'Maryland declares all persons of African descent enslaved for life.',
            outgroup: ['People of African descent'],
          },
          {
            year: 1669,
            event:
              'Virginia exempts the killing of an enslaved person “during correction” from felony treatment.',
            outgroup: ['Enslaved people'],
          },
          {
            year: 1676,
            event: 'Cross-racial rebels burn Jamestown during Bacon’s Rebellion.',
            outgroup: ['European indentured servants', 'Enslaved Africans'],
          },
          {
            year: 1691,
            event:
              'Virginia punishes a white woman and her child for crossing the racial boundary.',
            outgroup: ['Cross-racial families'],
          },
          {
            year: 1705,
            event:
              'Virginia Slave Codes codify whiteness and deputize the Buffer Class.',
            outgroup: ['Black population'],
          },
          {
            year: 1787,
            event:
              'The Three-Fifths Compromise embeds extraction into federal architecture.',
            outgroup: ['O_racialized'],
          },
        ],
        caption:
          'The racial partition compiled through judicial decisions, statutes, revolt, and constitutional architecture.',
      },
    },

    {
      id: 'boundary-enforcement',
      title: 'The Boundary Becomes a Policed Line',
      prose: [
        'Virginia extended the racial partition into reproduction in 1691. A white woman who bore a child with a Black man received five additional years of indenture, and the child received thirty years of indenture.',
        'The statute punished movement across the constructed boundary. Its unequal status for the child created a deterrent against cross-racial kinship and protected the separation required by the extraction architecture.',
        'The law’s coercive maintenance documented the fragility of the partition. Human relationships could dissolve the assigned categories, so the state imposed a penalty designed to keep the Buffer Class and racialized Out-group disjoint.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex: 'I_{\\text{buffer}} \\cap O_{\\text{racialized}} = \\emptyset',
            label: 'eq. 3.2',
            caption: 'The boundary condition maintained by the 1691 statute.',
          },
        },
      ],
      deepDive: {
        label: 'The legal lineage to Loving',
        passages: [
          {
            heading: 'The 276-Year Arc',
            paragraphs: [
              'Virginia’s 1924 Racial Integrity Act—a direct statutory descendant of the 1691 law—was the instrument under which Mildred and Richard Loving were arrested in 1958, convicted in 1959, and sentenced to one year in prison (suspended on the condition that they leave Virginia for twenty-five years). Mildred Loving was a Black woman. Richard Loving was a white man. They had married in Washington, D.C.—a jurisdiction without the prohibition—and returned to Caroline County, Virginia to live as husband and wife. The state treated their domestic arrangement as a felony.',
              'The Supreme Court unanimously reversed in Loving v. Virginia, 388 U.S. 1 (1967), striking the Racial Integrity Act as unconstitutional under both the Equal Protection and Due Process Clauses of the Fourteenth Amendment.',
            ],
          },
        ],
      },
    },

    {
      id: 'codifying-whiteness',
      title: 'The 1705 Release Version',
      prose: [
        'The Virginia Slave Codes of 1705 converted the racial boundary into an explicit legal wall. The codes assigned poor European workers to the category “White” and attached a psychological wage to that membership.',
        'The allocation included the right to police the Black population, the right to bear arms, and immunity from chattel slavery. These privileges recruited poor white workers into enforcement of the racial boundary.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'The poor white population became the Buffer Class: a legally codified human shield between the Elite and the racialized Out-group.',
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\text{Buffer Created:} \\quad I_{poor} \\rightarrow \\text{Defender of } E',
            label: 'eq. 3.3',
            caption: 'The structural transition produced by the 1705 patch.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Psychological wage',
          definition:
            'Racial status and legal privileges allocated to poor white workers in exchange for enforcement of the partition.',
        },
      ],
    },

    {
      id: 'buffer-class',
      title: 'Formalizing the Buffer Class',
      prose: [
        'Bacon’s Rebellion established the operational need for a third tier. The Buffer Class occupies the working-class In-group, produces economic reserves, supplies ideological cover for the state, and receives a suppression allocation and the appearance of democratic agency.',
        'The suppression allocation contains a status wage and a material wage. The status wage supplies racial privilege without a material transfer from the Elite. The material wage supplies calibrated concessions when system threat approaches its threshold.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The Buffer Class',
          paragraphs: [
            'The Buffer Class (I_buffer) is the remaining working-class In-group. It produces economic reserves and provides the ideological cover required to legitimize the state. The suppression allocation ψ = ψ_s + ψ_m and the illusion of democratic agency maintain its alignment.',
            'The status wage ψ_s(t) supplies a non-material guarantee of ontological superiority and racial privilege. Du Bois’s “public and psychological wage” includes symbolic status and public infrastructure advantages such as better schools, police protection, and court leniency.',
            'The material wage ψ_m(t) ≥ 0 supplies calibrated concessions such as land grants, welfare benefits, and subsidized homeownership when threat approaches the system threshold. Increased extraction from the racialized Out-group funds these concessions and preserves delta-max equals zero.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\text{Benefit}(E) \\gg \\text{Benefit}(I_{\\text{buffer}}) > \\text{Benefit}(O_{\\text{racialized}})',
            label: 'eq. 3.4',
            caption: 'The three-tier benefit ordering after the Bacon patch.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Status wage',
          definition:
            'The non-material racial privilege dispensed by the Elite as the default suppression allocation.',
        },
        {
          term: 'Material wage',
          definition:
            'A calibrated concession deployed under threat and funded through increased Out-group extraction.',
        },
      ],
    },

    {
      id: 'autonomy-wage',
      title: 'Autonomy as the Currency of Alignment',
      prose: [
        'The psychological wage also operates as Autonomy Sovereignty. Buffer-Class members experience their autonomy as a universal right and Out-group autonomy as a conditional privilege granted by the state.',
        'The Buffer Class holds little of the material capital concentrated by the Elite. Autonomy becomes its primary perceived wealth. An increase in Out-group voting rights or access to segregated spaces then registers as a reduction in relative status.',
        'This perception directs Buffer-Class enforcement toward the racial boundary. The resulting conflict suppresses resistance aimed at the Elite and supports continued extraction.',
      ],
      keyConcepts: [
        {
          term: 'Autonomy Sovereignty',
          definition:
            'The experienced guarantee that Buffer-Class autonomy is universal while Out-group autonomy remains conditional and revocable.',
        },
      ],
    },

    {
      id: 'constitutional-patch',
      title: 'The Constitutional Front-End',
      prose: [
        'The emergency recompile extended from Virginia law into federal architecture. The Three-Fifths Compromise of 1787 embedded extraction within the constitutional system.',
        'The constitutional separation between front-end and back-end produced a prototype Puppet Class.',
        'The completed cycle ran from the Jamestown crash to Philadelphia. Racial partition stabilized the Buffer Class, deputized a proto-Enforcement Class, and temporarily reduced class resistance while preserving the Elite share.',
      ],
    },
  ],
};

export default ch04;
