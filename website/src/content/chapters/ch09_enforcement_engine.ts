// Chapter 9 — The Enforcement Engine: Slave Patrols, the 13th Amendment,
// and the Compounding Model
//
// Source: Paper/chapters_src/10_the_enforcement_engine_slave_patrols_the.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch09: ChapterContent = {
  meta: {
    id: 'ch09',
    slug: 'enforcement-engine',
    number: 9,
    title:
      'The Enforcement Engine: Slave Patrols, the 13th Amendment, and the Compounding Model',
    era: '1704–1865',
    hook: 'Slave patrols, the 13th Amendment, and the compounding model.',
    accentColor: '#a3356b',
    heroVisual: {
      kind: 'equation',
      latex:
        'O_{1971}^{\\text{capacity}} = O_{1450}^{\\text{capacity}} \\cdot (1-\\alpha\\, P_{\\text{enslavement}})(1-\\beta\\, P_{\\text{13thAmendment}})(1-\\gamma\\, P_{\\text{redlining}})(1-\\delta\\, P_{\\text{WarOnDrugs}})',
      label: 'eq. 6.12',
      caption: 'The full capacity-compounding chain.',
    },
  },

  scenes: [
    {
      id: 'enforcement-cycle',
      title: 'The Enforcement Cycle Executes',
      prose: [
        'The racial partition had pacified the Buffer Class and installed the Puppet Class as a political interface. Slave capitalism still required a dedicated apparatus capable of turning classification into physical force.',
        'The Enforcement Class supplies that kinetic layer. A private racial prior becomes actionable when a patrol, caller, judge, jailer, or militia converts it into force. The resulting violence feeds evidence back into the prior and stabilizes the enforcement loop.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: '1704–1865 (AMERICAN SOUTH)',
          lines: [
            {
              field: 'System Stress',
              value:
                'MODERATE — Buffer Class pacified by jψ_s. Racial partition holding. Physical enforcement of extraction requires a dedicated apparatus. (min: class resistance)',
            },
            {
              field: 'Capital',
              value:
                'EXPANDING — Slave capitalism scaling. Human bodies classified as mortgageable assets. Cotton economy driving global markets. (max: extraction output)',
            },
            {
              field: 'Interference State',
              value:
                'STABLE — race-dominant phase management with low dimensionality. Estimated Φ_load ∈ [0.45, 0.60], ρ_τ ∈ [0.45, 0.65]. (Φ_load, proximity to τ)',
            },
            {
              field: 'Variables Loaded',
              value:
                'E, O_racialized, I, I_buffer, P_puppet (prototype).',
            },
            {
              field: 'Variables Deployed This Cycle',
              value:
                'F_enforce (Enforcement Class), QI (Qualified Immunity—latent).',
            },
            {
              field: 'Executing Function',
              value:
                'Deploy physical enforcement tier. Convert slave patrols into permanent state apparatus. Embed extraction loophole into 13th Amendment.',
            },
            {
              field: 'Result',
              value:
                'Four-tier hierarchy operational. [POLICY] Fugitive Slave Act (1850) merges enforcement tracks. [POLICY] 13th Amendment (1865) loophole maps O_incarcerated to forced labor and ensures extraction survives abolition. max secured indefinitely.',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Enforcement Class',
          definition:
            'The specialized kinetic arm that physically actuates the extraction algorithm.',
        },
        {
          term: 'Enforcement loop',
          definition:
            'The feedback sequence in which a racial prior produces force and that force supplies new evidence for the prior.',
        },
      ],
    },

    {
      id: 'dual-genealogy',
      title: 'Property Management Becomes Policing',
      prose: [
        'Southern slave patrols operated as Elite property management within a legal order that classified human beings as capital and collateral. Capturing a runaway prevented capital flight. Northern commercial police protected warehouses and shipping docks; Southern patrols protected biological, mobile property.',
        'The Fugitive Slave Act of 1850 fused those enforcement tracks. Federal law compelled enforcement across state boundaries and optimized the state’s violence for the protection of Elite capital.',
        'The patrol system also exposed the limits of formal records. Between 1632 and 1962, Black women constituted 55 percent of executed women. The documented total of 356 executions omits extensive extrajudicial violence against enslaved and free Black women.',
      ],
      visual: {
        kind: 'timeline',
        data: [
          {
            year: 1704,
            event:
              'Southern slave patrols organize racialized population control.',
            outgroup: ['Enslaved people'],
          },
          {
            year: 1850,
            event:
              'The Fugitive Slave Act federalizes the patrol function and fuses both mandates.',
            outgroup: ['Freedom seekers', 'Free-state residents'],
          },
        ],
        caption:
          'From organized slave patrols to their federalization. The Northern commercial-police track the chapter describes alongside them carries no date in the source and is left off the axis.',
      },
      deepDive: {
        label: 'Slave patrols as capital management',
        passages: [
          {
            paragraphs: [
              'When F_enforce (the early slave patrols) was deployed to capture a runaway, they were preventing catastrophic capital flight for E. The Northern commercial police protected static property (warehouses, shipping docks). The Southern patrols protected biological, mobile property.',
            ],
          },
        ],
      },
    },

    {
      id: 'fourth-variable',
      title: 'The Fourth Variable',
      prose: [
        'The Elite cannot personally perform extraction without accepting the physical risks of direct rule. The Buffer Class supplies ideological cover and lacks institutional authority. The architecture therefore recruits a dedicated enforcement tier from the lower classes and compensates it with distinct privileges.',
        'Qualified Immunity shields state agents from civil liability for constitutional violations unless a victim can cite a prior case with nearly identical facts. The Law Enforcement Officers Safety Act gives active and retired enforcement agents nationwide concealed-carry privileges that supersede state and local restrictions.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The Enforcement Class',
          paragraphs: [
            'The Enforcement Class is the kinetic arm of the algorithm. It comprises the military, domestic police forces, and carceral agents who physically actuate extraction.',
            'Its privileges remain conditional on physical usefulness. The system can return a former agent to the Buffer Class or the Out-group when that usefulness ends.',
          ],
          equations: [
            {
              latex:
                '\\text{Lethal Autonomy}(F_{\\text{enforce}}) \\gg \\text{Lethal Autonomy}(I_{\\text{buffer}}) \\gg \\text{Lethal Autonomy}(O) = 0',
              label: 'eq. 6.1',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Qualified Immunity',
          definition:
            'The judicial doctrine that shields state agents from civil liability unless prior case law presents nearly identical facts.',
        },
        {
          term: 'Lethal autonomy',
          definition:
            'The legally and institutionally recognized capacity to possess and deploy force.',
        },
      ],
    },

    {
      id: 'benefit-hierarchy',
      title: 'Protection Runs Up the Hierarchy',
      prose: [
        'Supreme Court doctrine assigns the police no constitutional obligation to protect an individual from private violence. DeShaney v. Winnebago County reached that holding in 1989. Town of Castle Rock v. Gonzales applied the same structure in 2005 despite a mandatory-arrest restraining order.',
        'The legal allocation follows the model’s benefit hierarchy. The Enforcement Class receives immunity, enhanced lethal autonomy, and broad discretion. The populations below it bear the concentrated exposure to enforcement lethality.',
        'Mapping Police Violence data for 2013–2024 record average annual police-killing rates per million of 7.00 for Black people, 6.55 for Native Americans, 2.89 for Hispanic people, 2.33 for white people, and 0.91 for Asian people. The Black-to-white ratio averages 3.01 across the period.',
      ],
      deepDive: {
        label: 'The police-killing test',
        passages: [
          {
            heading: 'Numerical computation',
            paragraphs: [
              'Averaging across the full 2013–2024 period, the notebook yields the following per-capita killing rates (per million population): Black, 7.00; Native American, 6.55; Hispanic, 2.89; White, 2.33; Asian, 0.91. The Black-to-White per-capita ratio averages 3.01 across the period. The Native American-to-White ratio averages 2.81. The O_racialized tier average (Black and Native American combined) is 6.78 per million; the I_buffer tier average (Hispanic and White combined) is 2.61 per million—a ratio of approximately 2.6:1. At peak years (2015–2016), the Black per-capita rate exceeded 8 per million, while the White rate remained below 2.9 per million.',
            ],
          },
        ],
      },
    },

    {
      id: 'lethal-autonomy',
      title: 'The Recognition Domain',
      prose: [
        'The chapter separates the natural right to kinetic self-defense from state recognition of that right. The constitutional order asserted a universal natural right and operationalized recognition for a bounded class of propertied white men in 1791.',
        'The Haitian Revolution executed the anti-tyranny principle from 1791 to 1804 through an armed, subjugated population. Christiana reproduced the principle on American soil in 1851 when William Parker’s community resisted federal slave catchers. The federal government charged 41 Black and white defendants with treason.',
        'Dred Scott supplied the judicial statement of the system’s security logic in 1857. Chief Justice Roger Taney treated Black citizenship as dangerous because it would include the right to keep and carry arms. The legal system continued this disarmament sequence through Black Codes, white-terror disarmament sweeps, and the Mulford Act of 1967.',
      ],
      deepDive: {
        label: 'The Christiana proof',
        passages: [
          {
            heading: 'September 11, 1851',
            paragraphs: [
              'On September 11, 1851, Maryland slaveholder Edward Gorsuch arrived at the farmhouse of William Parker—a formerly enslaved man living free in Christiana, Pennsylvania—accompanied by a deputy U.S. Marshal, his son, and several slave catchers. They came to recapture four men who had escaped from Gorsuch’s plantation, armed with the full legal authority of the Fugitive Slave Act of 1850, which compelled citizens of free states to assist in the capture of escaped enslaved people and denied the accused any right to trial by jury.',
              'Parker refused to comply. His wife Eliza sounded a horn from the upper window, alerting the surrounding community. Within the hour, dozens of free Black residents—joined by several white Quaker neighbors—surrounded Gorsuch’s party with firearms, corn cutters, and clubs. When Gorsuch refused to withdraw, a firefight erupted. Edward Gorsuch was killed. His son was badly wounded. The deputy U.S. Marshal fled. The four freedom seekers escaped to Canada through the Underground Railroad. Parker followed them.',
            ],
          },
        ],
      },
    },

    {
      id: 'general-strike-and-patch',
      title: 'Kinetic Rupture, Legal Patch',
      prose: [
        'W. E. B. Du Bois identified mass self-emancipation during the Civil War as a general strike. From 1861 through 1864, approximately 500,000 enslaved people left plantations, entered Union lines, supplied intelligence, and withdrew the labor supporting Confederate agriculture, fortifications, transport, and military logistics.',
        'The Emancipation Proclamation of 1863 recognized conditions that collective Out-group action had already created. The 13th Amendment followed the rupture with a legal recompile in 1865.',
        'Its punishment exception converted slavery from a fixed legal identity into a conditional criminal status. The Black Codes supplied the mapping mechanism, allowing the system to route targeted people back into forced labor through criminalization.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\text{If} \\quad \\text{Status}(x) = \\text{Criminal}(C) \\quad \\rightarrow \\quad \\text{Status}(x) \\in S \\text{ (Slave)}',
            label: 'eq. 6.3',
            caption:
              'The punishment exception expressed as a state-transition rule.',
          },
        },
        {
          kind: 'pullquote',
          text: 'The legal interface changed after the Out-group had already breached the kernel.',
        },
      ],
      deepDive: {
        label: 'Du Bois’s general strike',
        passages: [
          {
            paragraphs: [
              'The strategic consequences were irreversible. The Confederacy’s war machine depended on enslaved labor for agriculture, fortification-building, supply transport, and the full logistics of fielding an army. As the general strike scaled, Confederate productive capacity collapsed faster than Union military operations could have achieved.',
            ],
          },
        ],
      },
    },

    {
      id: 'consumptive-extraction',
      title: 'The Replacement Cost Falls to Zero',
      prose: [
        'Chattel slavery placed a financial constraint on the destruction of an enslaved worker because the enslaver owned the body as capital. Convict leasing transferred replacement costs to the state. Lessees could maximize labor in minimum time and draw another body from the criminal pipeline.',
        'Annual mortality in some mining and railroad camps reached 30 to 40 percent. The same removal of replacement cost produced higher output per worker and higher mortality in Alabama coal mines, railroad construction, turpentine camps, and phosphate extraction.',
        'Convict leasing also performed a regional transition function. The formerly enslaved built railroads, mines, levees, roads, and industrial infrastructure that moved the Southern economy from human-body capital toward infrastructure capital.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Consumptive extraction',
          paragraphs: [
            'State-supplied replacement bodies removed the biological constraint from the lessee’s optimization. Maximum throughput and extreme mortality became simultaneous outputs of the same economic rule.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Interface swap',
          definition:
            'The transition from chattel ownership to state-mediated convict leasing under the punishment exception.',
        },
        {
          term: 'Consumptive extraction',
          definition:
            'An extraction function that treats the worker as a replaceable input and permits complete biological consumption.',
        },
      ],
      deepDive: {
        label: 'The transition function',
        passages: [
          {
            paragraphs: [
              'Convict leasing solved this transition problem. Through the Black Codes and the 13th Amendment’s exception clause, the system re-captured the same population that had been the assets of the agrarian economy and forced them to perform the manual labor of dismantling that economy and constructing its industrial replacement. The formerly enslaved were compelled to build the very infrastructure that would transition the extraction model away from their own bodies as capital—while simultaneously remaining the primary extraction target under conditions documented above as more lethal than chattel slavery itself.',
            ],
          },
        ],
      },
    },

    {
      id: 'multiplicative-harm',
      title: 'From Policy Burden to Compounding Capacity',
      prose: [
        'An additive policy ledger records separate burdens. The temporal model tracks the residual capacity on which every later policy acts. Capacity includes accumulated capital, power, and resources.',
        'Each extractive policy multiplies the capacity remaining from the previous period. Historical sequence therefore determines the state inherited by the next policy.',
        'Enslavement strips wealth and autonomy. The punishment exception re-encodes subjugation through criminalization. Redlining blocks homeownership for a population with little inherited capital. The War on Drugs applies asymmetric enforcement to communities already geographically concentrated and economically diminished.',
      ],
      visual: {
        kind: 'equation',
        latex:
          'O_t^{\\text{capacity}} = O_{t-1}^{\\text{capacity}} \\cdot (1 - \\alpha P_t)',
        label: 'eq. 6.5',
        caption:
          'Every policy shock acts on the capacity retained after the preceding shock.',
      },
      keyConcepts: [
        {
          term: 'Capacity',
          definition:
            'The Out-group’s accumulated capital, power, and resources at a given time.',
        },
        {
          term: 'Extractive intensity',
          definition:
            'The coefficient that measures how strongly a policy reduces retained capacity.',
        },
      ],
      deepDive: {
        label: 'The temporal model',
        passages: [
          {
            paragraphs: [
              'Each dated factor is not interchangeable—the order matters. Enslavement strips initial wealth and autonomy; the 13th Amendment’s exception clause re-encodes subjugation through criminalization; redlining blocks the primary vehicle of American wealth accumulation for a group already without generational capital; and the War on Drugs applies asymmetric enforcement to a population already geographically concentrated by redlining and economically precarious from centuries of extraction. The same formula that appears abstract at time t becomes a specific, falsifiable indictment at time 1971: the present condition of the racialized Out-group is a mathematical inevitability given the policy sequence.',
            ],
          },
        ],
      },
    },

    {
      id: 'measured-compounding',
      title: 'The Measured Compounding Chain',
      prose: [
        'The manuscript assigns independently sourced retention factors to four policy shocks. A normalized pre-racialization capacity of 1.0 falls to 0.09 after enslavement, 0.055 after the punishment exception and convict leasing, 0.026 after HOLC redlining, and 0.019 after the War on Drugs.',
        'The cumulative product is 1.0 multiplied by 0.09, 0.61, 0.48, and 0.73. The terminal value represents retained unconstrained latent capacity. The source distinguishes that quantity from observed wealth after transfers, adaptation, public support, informal economies, and partial institutional recovery.',
        'The 2022 Federal Reserve Survey of Consumer Finances reports Black median family wealth at 15.75 percent of white median family wealth: $44.89 thousand compared with $285.01 thousand. That observed ratio is an output transform of the latent-capacity sequence.',
      ],
      visual: {
        kind: 'series',
        series: [
          {
            label: 'Retained Out-group capacity',
            color: '#a3356b',
            points: [
              { x: 1450, y: 1.0 },
              { x: 1619, y: 0.09 },
              { x: 1865, y: 0.055 },
              { x: 1934, y: 0.026 },
              { x: 1971, y: 0.019 },
            ],
          },
        ],
        xLabel: 'Policy stage',
        yLabel: 'Normalized retained capacity',
        area: true,
        caption:
          'The source’s verbatim numerical sequence: 1.0 → 0.09 → 0.055 → 0.026 → 0.019. No intermediate values are interpolated.',
      },
      deepDive: {
        label: 'Factor calibration and falsification',
        passages: [
          {
            heading: 'Operationalization',
            paragraphs: [
              'Each policy variable is mapped to an empirically measured capacity-retention factor (1 - factor): α = 0.91 wealth stripped by chattel enslavement (Darity & Mullen $14T reparations baseline); β = 0.39 capacity reduction via convict leasing mortality (≈40% over 10-year sentences, Blackmon) and re-incarceration rates; γ = 0.52 capacity lost through the homeownership gap imposed by HOLC (Black homeownership 23% vs. White 46% in 1940, widening to 28% vs. 65% by 1968); δ = 0.27 asymmetric enforcement burden (Black cannabis arrest rate 3.73× White at equal usage rates, ACLU 2020). The cumulative product: O_1971 = 1.0 × 0.09 × 0.61 × 0.48 × 0.73 ≈ 0.019.',
            ],
          },
          {
            heading: 'Falsification criteria',
            paragraphs: [
              'This equation would be falsified if any one policy shock (α, β, γ, δ) is shown to have zero marginal effect on subsequent Black wealth accumulation in longitudinal data. Specifically: if controlling for the HOLC redlining shock eliminates the observed homeownership gap in difference-in-differences analysis, the γ term collapses to zero and the compounding model fails. The existing literature (Rothstein 2017, Mapping Inequality geospatial data) finds the opposite: HOLC grade independently predicts present-day homeownership rates and neighborhood wealth levels after controlling for income, education, and other covariates.',
            ],
          },
        ],
      },
    },

    {
      id: 'asymmetric-multiplier',
      title: 'Equal Behavior, Unequal Enforcement',
      prose: [
        'Cannabis use supplies a behavioral control for the enforcement multiplier. SAMHSA measures past-year use at approximately 14.0 percent for Black Americans and 14.5 percent for white Americans.',
        'The ACLU records a national Black-to-white cannabis arrest ratio of 3.73 in 2010 and 3.64 in 2018. All 40 states in the curated dataset show a ratio above 1.0. The disparity increased in 31 states between 2010 and 2018.',
        'Each arrest reduces later capacity through employment loss, housing exclusion, disenfranchisement, and family disruption. A policy application therefore changes the baseline exposed to the next policy application.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'proof',
          label: 'The asymmetric enforcement multiplier',
          paragraphs: [
            'Usage parity holds the behavioral variable approximately constant. Persistent arrest disparity identifies the enforcement coefficient as the source of the unequal policy load.',
          ],
          equations: [
            {
              latex:
                '\\alpha_{O} P_t \\approx 3.73 \\cdot \\alpha_{I \\setminus E} P_t',
              label: 'eq. 6.6',
            },
          ],
        },
      ],
      deepDive: {
        label: 'The national enforcement test',
        passages: [
          {
            heading: 'Numerical computation',
            paragraphs: [
              'The notebook computes the following results. National average Black/White cannabis arrest ratio: 3.73× (2010) and 3.64× (2018). State-level distribution: ratios range from approximately 2.1× (least disparate) to 9.6× (most disparate, Montana). All 40 curated states show positive disparity (ratio > 1.0). In 31 states, the disparity increased between 2010 and 2018 despite cannabis legalization in several states. The usage rate gap between Black and White Americans is 0.5 percentage points—insufficient to explain a 3.73× enforcement differential.',
            ],
          },
        ],
      },
    },

    {
      id: 'body-to-bond',
      title: 'The Body-to-Bond Pipeline',
      prose: [
        'Antebellum finance converted enslaved bodies into mortgage collateral. Bonnie Martin’s analysis of nearly 9,000 mortgages found that 47 percent involved enslaved people as collateral. Citizens Bank and Canal Bank of Louisiana collectively accepted approximately 13,000 enslaved people as collateral and directly owned more than 1,200.',
        'Louisiana issued state-backed bonds against slave mortgages in 1836 and marketed them in London, Amsterdam, and Paris. The cash flow ran from body to labor, revenue, bond, and investor. Slave patrols recovered lost assets and protected the portfolio.',
        'The modern carceral pipeline converts captivity into per-diem revenue, corporate bonds, real-estate investment trusts, and equity. The source reports typical private-prison occupancy guarantees of 80 to 90 percent, per-diem payments of $50 to $150, CoreCivic revenue of $1.99 billion in 2022, and GEO Group revenue of $2.42 billion.',
        'Incarcerated workers generate at least $2 billion in goods and $9 billion in prison-maintenance services each year. The same body also supplies institutional maintenance and census weight while remaining politically powerless in the place of confinement.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The triple conversion',
          paragraphs: [
            'The carceral subject becomes labor input, institutional subsidy, and census weight. Economic, administrative, and representational value accrue while citizenship remains severed from the confined person.',
          ],
        },
      ],
      deepDive: {
        label: 'The old and new cash-flow strings',
        passages: [
          {
            heading: 'The old string',
            paragraphs: [
              'The cash flow is: Body → Labor → Revenue → Bond → Investor. The state guarantees the instrument. The Enforcement Class protects the asset. E in Europe sips tea while the return-on-investment is generated by the lash.',
            ],
          },
          {
            heading: 'The new string',
            paragraphs: [
              'The cash flow is identical: Body → Incarceration → Revenue → Bond → Investor. The state guarantees the instrument. The Enforcement Class acquires the asset. The variable names changed; the string remained continuous.',
            ],
          },
        ],
      },
    },

    {
      id: 'current-source',
      title: 'The Current Source',
      prose: [
        'The enforcement engine fixes the direction and magnitude of coercive flow across changing legal interfaces. Slave patrols, militias, police, and prisons form successive institutional topologies for the same current.',
        'The Fugitive Slave Act prevented states from blocking federal enforcement. The 13th Amendment punishment exception preserved a conductive path into forced labor after chattel property law ceased to supply that path.',
        'The compounding model records the accumulated result. Each enforcement regime operates on the capacity left by its predecessors, while the financial return travels upward through the hierarchy.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Hardware Reading: The Current Source and the One-Way Diode',
          paragraphs: [
            'The Enforcement Engine is the current source of the extraction circuit: it dictates the direction and magnitude of enforcement flow, independent of the load’s resistance.',
            'The 13th Amendment’s exception clause installed a one-way path into the carceral state at the moment chattel slavery was discharged. The compounding sequence—patrols to militias to police to prisons—keeps the kinetic labor, tax base, and physical output of the Out-group and Buffer Class connected to the same supply rail.',
          ],
        },
      ],
    },
  ],
};

export default ch09;
