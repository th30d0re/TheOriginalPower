// Chapter 21 — Conclusion
//
// Source: Paper/chapters_src/22_conclusion.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch21: ChapterContent = {
  meta: {
    id: 'ch21',
    slug: 'conclusion',
    number: 21,
    title: 'Conclusion',
    era: 'Terminus',
    hook: 'What the algorithm implies, and what remains available.',
    epigraph: {
      text: 'The math lands where it lands. The system’s trajectory is clear.',
    },
    accentColor: '#35a58c',
    heroVisual: {
      kind: 'equation',
      latex:
        '\\vec{R}_{\\text{systemic}} = \\left\\| F_{\\text{institutional}} \\right\\| \\cdot \\hat{d}_{\\text{hierarchy}} \\quad \\neq \\quad \\left| \\text{prejudice}_{\\text{individual}} \\right|',
      label: 'The institutional vector',
    },
  },

  scenes: [
    {
      id: 'final-output',
      title: 'Final Output',
      prose: [
        'Five centuries of domestic and global operation end in a consolidated output. Reforms repeatedly altered the interface. The extraction kernel recompiled around those changes, including the civil-rights legal breach.',
        'The final diagnostic records an expanding Out-group, a global containment field, and an interference load near design limits. The complete variable set now resolves into a revised definition, a vector equation, and one unresolved variable.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: 'FINAL OUTPUT',
          lines: [
            {
              field: 'System Stress',
              value:
                'min: class resistance — The Predatory Min-Max Function has operated for five centuries, domestically and globally. Most reforms targeted the interface; the kernel recompiled around them. The civil rights legal strategy breached the kernel; the system adapted. The Concession Theorem holds across the full dataset: Δmax = 0 for every non-kinetic reform Rᵢ.',
            },
            {
              field: 'Capital',
              value:
                'max: extraction output — The algorithm continues to extract. O expands domestically toward Everyone ∖ E, while O_global bears five centuries of compounding. The containment field of embargo, debt, and global enforcement neutralizes peripheral liberation.',
            },
            {
              field: 'Interference State',
              value:
                'Φ_load, proximity to τ — TERMINAL SATURATION. Compound phase-shifting approaches design limits. Estimated Φ_load ∈ [0.85, 0.97], ρ_τ ∈ [0.95, 1.08].',
            },
            {
              field: 'Variables Deployed',
              value:
                'Complete — E/E_global, P_puppet/P_puppet_global, F_enforce/F_enforce_global, I_buffer/I_buffer_global, O_racialized/O_global, W (Complex Wage), QI, P_criminal, P_spatial, P_retroactive, P_debt, P_embargo.',
            },
            {
              field: 'Executing Function',
              value:
                'Consolidating revised definition. Outputting the vector equation of racism. Reporting the unresolved variable.',
            },
            {
              field: 'Status',
              value: 'return R⃗_acism',
            },
          ],
        },
      ],
    },

    {
      id: 'revised-definition',
      title: 'The Revised Definition',
      prose: [
        'The book’s central output defines racism as an extraction system organized through racial categorization. Historical practices of enslavement and colonialism supply its roots. Social, economic, and political policy perpetuate inequalities between groups assigned to racial categories.',
        'The system presents benefits to a racial In-group at the expense of an Out-group. Its primary beneficiary is an Elite class within the In-group. Racial division blocks cross-racial solidarity and maintains a subjugated labor class.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Revised Definition of Racism',
          paragraphs: [
            'Racism is a system of oppression predicated on categorizing human beings into “races” with perceived inherent differences. It uses social, economic, and political policies to perpetuate and intensify inequality between racially defined groups. Its structure serves an Elite class within the racial In-group. That class uses racial division to prevent cross-racial solidarity and maintain a subjugated labor class.',
            'The targeted Out-group expands over time and progressively encompasses members of the nominal In-group. This movement places Elite economic interests ahead of the broader In-group’s interests. Racism operates as psycho-legal social software: legal, economic, cultural, and affective code that installs racial priors into institutions and predictive human cognition.',
            'The extraction system generates a fractal mind virus. It reproduces the same partition across institutional, spatial, familial, political, and interpersonal scales. Hosts perceive engineered hierarchy as common sense. Spurious scientific, cultural, and moral claims obscure the underlying extraction dynamic.',
          ],
        },
        {
          kind: 'insight',
          heading: 'Direction and replication',
          paragraphs: [
            'The vector definition supplies the direction of force. Psycho-legal social software names the mechanism that installs the direction inside institutions and human cognition. The fractal mind virus names its recursive reproduction across scales.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Psycho-legal social software',
          definition:
            'Legal, economic, cultural, and affective code that installs racial priors into institutions and predictive human cognition.',
        },
        {
          term: 'Fractal mind virus',
          definition:
            'The extraction system’s self-reproducing partition, repeated at institutional, spatial, familial, political, and interpersonal scales.',
        },
      ],
    },

    {
      id: 'institutional-vector',
      title: 'The Institutional Vector',
      prose: [
        'Systemic racism possesses magnitude and a specific, irreversible direction. Emotional weight and individual bias supply scalar magnitude. Institutional force supplies the direction required for systemic harm.',
        'The vector runs from the Elite and Enforcement Class, through the Puppet Class and Buffer Class, onto the racialized Out-group. Its magnitude consists of policing, legislation, capital allocation, and carceral infrastructure. Its unit direction points downward through the five-tier hierarchy.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\vec{R}_{\\text{systemic}} = \\left\\| F_{\\text{institutional}} \\right\\| \\cdot \\hat{d}_{\\text{hierarchy}} \\quad \\neq \\quad \\left| \\text{prejudice}_{\\text{individual}} \\right|',
            label: 'eq. 17.1',
            caption:
              'Systemic racism equals institutional force multiplied by the hierarchy’s direction.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'A marginalized person’s anger, resentment, or hostility has real emotional magnitude. The Out-group lacks control of the Elite’s capital, the Puppet Class, and the Enforcement Class by definition. Its prejudice therefore has no institutional direction and cannot produce systemic racism within this framework.',
            'The distinction resolves the category error embedded in claims of “reverse racism.” Any person can generate bias. Redlining, police deployment, sentencing rules, and capital management require an institutional apparatus. That apparatus can generate a destructive racial vector even when its individual operators express no personal prejudice.',
            'The causal direction begins in Elite economic interests. Those interests produce systemic racialization and cultivate interpersonal prejudice as a maintenance loop. The hierarchy supplies institutional direction from above. Individual bias circulates inside the resulting field.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Scalar prejudice',
          definition:
            'Emotional magnitude without control of the institutional apparatus that directs systemic force.',
        },
        {
          term: 'Institutional vector',
          definition:
            'The magnitude of institutional force directed from the Elite through the hierarchy toward the racialized Out-group.',
        },
      ],
      deepDive: {
        label: 'The full category-error argument',
        passages: [
          {
            heading: 'Vector Properties',
            paragraphs: [
              'Equating the localized anger of the Out-group with the institutional vector of the Elite is a mathematical category error: it conflates a scalar with a vector. A Black citizen who harbors resentment toward white people possesses a scalar quantity: real emotional magnitude with zero institutional direction. That resentment cannot redline a neighborhood, cannot deploy a police force, cannot write a sentencing guideline, cannot patent a medicine while criminalizing its use. The Elite’s racial apparatus—even when operated by individuals who harbor no personal prejudice—generates a vector of devastating magnitude because the institutional direction is structurally guaranteed by the five-tier hierarchy documented in Chapter (ref).',
            ],
          },
        ],
      },
    },

    {
      id: 'terminal-findings',
      title: 'Three Terminal Findings',
      prose: [
        'The historical trajectory begins with Portuguese racialization in the 1450s and passes through Bacon’s Rebellion in 1676, the invention of whiteness in 1705, the 13th Amendment loophole in 1865, redlining in 1934, and the War on Drugs in 1968. Each crisis produced a revised interface while the extraction kernel persisted. Bacon’s Rebellion preceded rigid racial categories. Brown v. Board preceded the Variable Swap. The present phase extends extraction into the Buffer Class.',
        'Three theorems define the framework’s boundary conditions for liberation: the Concession Theorem, the Haitian Theorem, and the Imperial Core Theorem.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'The Concession Theorem',
          paragraphs: [
            'Every non-kinetic reform in the historical dataset was absorbed as management of class resistance. The system calibrates concessions to prevent kinetic threshold while preserving extraction capacity. A reduction in one group’s load triggers reassignment elsewhere while aggregate extraction remains intact.',
            'Policy sequence compounds the result. Each reform acts upon an Out-group already diminished by prior shocks. The extraction kernel determines the trajectory’s terminal product.',
          ],
          equations: [
            {
              latex: '\\Delta\\max = 0',
              label: 'Constraint stated in the source',
            },
          ],
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'The Haitian Theorem',
          paragraphs: [
            'Across the historical dataset from 1450 through 2026, confirmed structural liberation at the local level occurred exclusively through kinetic action. The five-century disarmament architecture records the system’s sustained optimization against the variable it cannot absorb.',
          ],
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'The Imperial Core Theorem',
          paragraphs: [
            'Kinetic liberation in a peripheral node requires economic self-sufficiency to survive. Embargo, debt, and global enforcement can neutralize a liberated peripheral node. Structural liberation therefore requires disruption within the imperial core or an insulated regional bloc capable of surviving the containment field indefinitely.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Together, the findings describe absorption, local rupture, and global containment. Reform within the system preserves a zero change in extraction. Kinetic action has produced local kernel termination in the confirmed cases. The global kernel can reimpose extraction through debt, embargo, and military force after local liberation.',
          ],
        },
      ],
    },

    {
      id: 'four-part-arc',
      title: 'The Four-Part Arc Closes',
      prose: [
        'Specification and Origins traces the racial vector from 15th-century Portugal through Bacon’s Rebellion and into the constitutional source code at Philadelphia in 1787. The template arrived before the American machine. The United States installed it.',
        'The Installation follows the physical machinery from 1619 through 1865. Plantation kinship extraction, the coverture-and-eugenics reproductive kernel, and the slave-patrol genealogy each have documented components and operating histories. The 13th Amendment carried the exception “except as a punishment for crime” into the Constitution.',
        'Scaling and Runtime follows execution from 1865 to the present. The Capture Variable absorbed Reconstruction and civil-rights legal victories. The Tweedism Filter shaped which candidates reached the ballot. The Variable Swap moved the interface from race to carcerality after the 1954 Brown breach. The Demographic Paradox then marked the cannibalization of the Buffer Class as the racialized Out-group approached its extraction ceiling.',
        'Diagnostics and Output identifies the machinery of reform absorption, proxy discrimination, kinetic containment, and global enforcement. The closing definition joins these mechanisms into one vector-valued account of racism operating as psycho-legal software and reproducing as a fractal mind virus.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Kernel deletion',
          paragraphs: [
            'A victory along one partition axis can preserve domination along another axis. Permanent deletion requires simultaneous termination of every partition axis. A surviving axis retains the installer.',
          ],
        },
      ],
      deepDive: {
        label: 'The runtime and diagnostic machinery',
        passages: [
          {
            heading: 'Scaling and Runtime',
            paragraphs: [
              'The Capture Variable absorbed Reconstruction and the Civil Rights Movement’s legal victories. The Tweedism Filter industrialized the Puppet Class so that the franchise could be open and the ballot still never reach the kernel. The Variable Swap recompiled the interface from race to carcerality after the 1954 Brown kernel breach. The Demographic Paradox (Equations (ref)–(ref)) marked the algorithm’s entry into terminal cannibalization of the Buffer Class it was built to protect: as O_racialized approached its extraction ceiling, the system expanded the Out-group boundary to encompass former members of I_buffer (Equation (ref)), turning the machine’s teeth upon its own defenders.',
              'The ψ erosion function (Equation (ref)) formalized the generational load-balancing mechanism: as temporal extraction E_X_temporal compounds, the material wage ψ_m degrades continuously, and the saeculum’s four-turning cycle manages the resulting friction by conditioning each generation to absorb the breach without crystallizing into cross-class solidarity. And the five-century disarmament timeline (Equations (ref)–(ref)) revealed the one variable the algorithm has consistently optimized against—because it is the one variable the algorithm cannot absorb.',
            ],
          },
          {
            heading: 'Diagnostics and Output',
            paragraphs: [
              'The Judicial Double-Agent Architecture (Equation (ref)) explained why the courts can detect systemic oppression in Second Amendment cases while systematically protecting the extraction kernel in civil-rights and voting cases. The Judicial Discrimination Detection equation (Equation (ref)) and the Proxy Discrimination Equivalence (Equation (ref)) formalized why facially neutral proxies produce identical extraction geometry to explicit racial classification: D(P_proxy) = 0 while outcomes remain racially structured.',
              'The Kernel Deletion Condition (Equation (ref)) clarified that partial liberation—a racial-axis victory that preserves patriarchal domination, or a gender-axis victory that preserves racial hierarchy—preserves the virus; it leaves the installer on disk. Permanent kernel deletion requires the termination of all partition axes simultaneously.',
            ],
          },
        ],
      },
    },

    {
      id: 'terminal-expansion',
      title: 'The Out-group Expands',
      prose: [
        'The domestic architecture has entered its terminal phase. The system is cannibalizing the Buffer Class. The material wages of whiteness are bankrupt, and the class-resistance variable is failing. The disarmament sequence advances through spatial proxies, universal latent criminality, financial surveillance, and ex post facto criminalization.',
        'The system’s survival depends on continued separation between the Buffer Class and the racialized Out-group. Their recognition of aligned interests would direct resistance toward the Elite instead of across the partition.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex: 'O_{\\text{final}} = \\text{Everyone} \\setminus E',
            label: 'eq. 17.2',
            caption: 'The terminal trajectory of Out-group expansion.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'The source’s illustrative data align with this ordinal trajectory. U.S. Census Bureau projections place the non-Hispanic white population below 50 percent by approximately 2045. The Piketty-Saez-Zucman top-0.1-percent wealth share rises from approximately 7 percent in 1978 to approximately 20 percent in 2024.',
            'Federal Reserve Survey of Consumer Finances data place Black median household wealth at approximately $24,100 and white median household wealth at approximately $189,100 in the 2022 survey. The ratio is approximately 0.13 and remains below 0.15 across the post-Reconstruction period described in the source. The opioid crisis, student debt crisis, and gig-economy wage compression mark the concurrent absorption of former Buffer Class members into the Out-group.',
            'The source classifies this evidence as Tier 2. The demographic projections and distributional national accounts support an ordinal expansion claim. They do not assign a cardinal date to completion.',
          ],
        },
      ],
    },

    {
      id: 'unresolved-variable',
      title: 'The Unresolved Variable',
      prose: [
        'The framework leaves one question open: whether cross-racial, cross-national solidarity reaches kinetic threshold before the Elite completes the disarmament protocol. The civilian population possesses world-historical kinetic capacity. The containment sequence seeks completion before the Buffer Class recognizes its alignment with the racialized Out-group against the Elite.',
        'The global field carries the same uncertainty. The AES bloc is testing the Imperial Core Theorem’s second condition. On March 25, 2026, 123 nations voted on UN reparations in a pattern the framework reads as the global Out-group naming the extraction kernel, the imperial core protecting it, and the colonial Buffer Class abstaining. Structural action remains exposed to the containment field.',
        'Five centuries of racial division sustained Elite supremacy by preserving separation across the same equation. The terminal Out-group contains everyone outside the Elite. The system’s continuation depends on the population learning that fact after containment closes. Its termination depends on learning it before.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'The only unresolved variable is whether the population reaches the kinetic threshold before or after the Elite completes its containment. That variable is human.',
        },
      ],
    },
  ],
};

export default ch21;
