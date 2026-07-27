// Chapter 14 — The Kinetic Guarantee: Arms Asymmetry, the Second Amendment,
// and the Disarmament Timeline
//
// Source: Paper/chapters_src/15_the_kinetic_guarantee_arms_asymmetry_the.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch14: ChapterContent = {
  meta: {
    id: 'ch14',
    slug: 'kinetic-guarantee',
    number: 14,
    title:
      'The Kinetic Guarantee: Arms Asymmetry, the Second Amendment, and the Disarmament Timeline',
    era: 'Arms Asymmetry',
    hook: 'Arms asymmetry, the Second Amendment, and the disarmament timeline.',
    accentColor: '#5d44a6',
    heroVisual: {
      kind: 'equation',
      latex: 'L_E \\gg L_O \\implies \\text{Extraction feasible}',
      label: 'eq. 11.1',
      caption: 'The lethal-capacity precondition for extraction.',
    },
  },

  scenes: [
    {
      id: 'the-load-bearing-variable',
      title: 'The Load-Bearing Variable',
      prose: [
        'The extraction systems traced across the book share one physical precondition. The extracting class holds a monopoly, or near-monopoly, on organized lethal capacity. Chattel slavery, convict leasing, redlining, and the carceral state all rely on that asymmetry.',
        'The chapter follows this variable from Portuguese firearms superiority on the West African coast through constitutional exclusion, economic filters, bureaucratic gates, and post-Bruen state restrictions. Disarmament supplies the hard-power companion to cognitive control. It preserves compulsion when a population begins to reject the system’s ideological premises.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: 'TRACING THE DISARMAMENT VARIABLE ACROSS THE FULL TIMELINE',
          lines: [
            {
              field: 'System Origin',
              value:
                'Portuguese firearms superiority (1440s) — technological asymmetry in lethal capacity enables mass extraction.',
            },
            {
              field: 'Feedback Loop Detected',
              value:
                'Arms-for-slaves trade creates exponential demand. Firearms → military advantage → captives → currency for more firearms.',
            },
            {
              field: 'Interference State',
              value:
                '(Φ_load, proximity to τ): MODERATE-HIGH — disarmament operates as kinetic adjunct to identity-fragmentation controls. Estimated Φ_load ∈ [0.60, 0.85], ρ_τ ∈ [0.70, 0.95].',
            },
            {
              field: 'Constitutional Encoding',
              value:
                'Second Amendment (1791) — kinetic guarantee installed as dead man’s switch. Racial and gendered exclusions baked into source code.',
            },
            {
              field: 'Disarmament Protocol',
              value:
                'Sullivan Law (1911) → NFA (1934) → Mulford Act (1967) → GCA (1968) → Hughes Amendment (1986) → Brady/AWB (1993–94) → Post-Bruen state responses (2022–present).',
            },
            {
              field: 'Agenda Routing',
              value:
                'Under elevated Φ_load, policy moves from targeted controls on the racialized Out-group to generalized controls on the Buffer Class through cumulative jurisprudential precedent.',
            },
            {
              field: 'Pattern',
              value:
                'Federal gun control laws correlate with the racialized Out-group approaching kinetic parity or members of the Puppet Class being kinetically corrected.',
            },
          ],
        },
        {
          kind: 'pullquote',
          text: 'Asymmetric lethal capacity precedes every other variable in the extraction apparatus.',
        },
      ],
      keyConcepts: [
        {
          term: 'Lethal asymmetry',
          definition:
            'The gap between the organized lethal capacity of the extracting class and that of the targeted population.',
        },
        {
          term: 'Kinetic guarantee',
          definition:
            'The retained physical capacity of the governed to enforce rights and resist coercive power.',
        },
      ],
    },

    {
      id: 'firearms-and-the-diaspora',
      title: 'Firearms and the Extraction Pipeline',
      prose: [
        'Portuguese contact with West African kingdoms in the mid-15th century introduced a decisive military-technological gap. European warfare during the Hundred Years’ War (1337–1453), the Italian Wars, the Reconquista, the Hussite Wars, and the Wars of the Roses had driven rapid development in gunpowder weapons, naval armaments, siege technology, and military logistics.',
        'The gap was narrow and temporary. West African kingdoms possessed sophisticated metallurgy, agriculture, urban systems, and trade networks. European firearms supplied the operational advantage for early coastal raids, while racial superiority, cultural destiny, and divine mandate supplied ideological defenses.',
        'The mature trade converted firearms into a coercive currency. A kingdom with guns gained an advantage over its neighbors. Neighboring kingdoms then needed guns for survival, and European traders accepted enslaved people as payment. By the late 18th century, European traders imported an estimated 283,000 to 394,000 firearms per year into West Africa.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The coercive feedback loop',
          paragraphs: [
            'European traders controlled both inputs: the supply of firearms and the demand for captives. Each armed node increased pressure on adjacent nodes to enter the same trade. The cycle propagated inland and sustained the extraction pipeline after the first window of direct European superiority closed.',
          ],
        },
      ],
      deepDive: {
        label: 'The self-reinforcing mathematics',
        passages: [
          {
            paragraphs: [
              'The mathematics are self-reinforcing. Once a single node in the system acquires firearms, every adjacent node must acquire them for defensive purposes. The only available currency is human bodies. The European Elite controlled the supply of firearms and the demand for slaves—they were both the arms dealer and the slave buyer, sitting at the apex of a system that forced African kingdoms into a coercive arms race whose fuel was their own population.',
            ],
          },
        ],
      },
    },

    {
      id: 'constitutional-encoding',
      title: 'The Constitutional Guarantee and Its Exclusions',
      prose: [
        'The Second Amendment (1791) encoded a physical enforcement mechanism into the constitutional order. Its original protection was bounded by racial and gendered exclusions. The category called “the people” excluded Black Americans, and the founding language of armament repeatedly centered men capable of bearing arms.',
        'District of Columbia v. Heller (2008) confirmed an individual right to possess and carry weapons for traditionally lawful purposes such as self-defense. Justice Scalia’s 5–4 majority defined the militia as all males physically capable of acting together for the common defense and read “well-regulated” as properly disciplined and trained.',
        'McDonald v. City of Chicago (2010) extended the Second Amendment to the states through the Fourteenth Amendment’s Due Process Clause. The Court’s historical record centered the postwar Black Codes, the Freedmen’s Bureau Act of 1866, the Civil Rights Act of 1866, and the 39th Congress’s effort to protect freed people from targeted disarmament.',
      ],
      blocks: [
        {
          kind: 'source',
          heading: 'The Hamburg Massacre (July 8, 1876)',
          paragraphs: [
            'On July 4, 1876—the centennial of American independence—a Black militia company in Hamburg, South Carolina, led by Captain D.L. “Doc” Adams, paraded through town in a lawful exercise of precisely the right the 39th Congress had constitutionally guaranteed eight years earlier. Two white farmers demanded the militia yield the road. The militia complied. The farmers filed a complaint anyway.',
            'At the resulting hearing on July 8, former Confederate General Matthew C. Butler arrived with several hundred armed white men—members of “rifle clubs,” the Red Shirt paramilitary that served as the post-war successor to the slave patrols. Butler had no legal authority. He issued a single demand: the Black militia must disband and surrender their weapons to him personally.',
            'The militia refused. They retreated to a stone armory. Butler’s forces surrounded the building. When the militia’s ammunition ran low, the Red Shirts brought a cannon across the river from Augusta, Georgia, and blew a hole in the armory wall. As the defenders fled, the white paramilitaries captured approximately 25 to 30 Black men. They formed a “Dead Ring”—a circle of armed white men—and executed five prisoners one by one: Allan Attaway, David Phillips, Hampton Stephens, Albert Myniart, and Town Marshal James Cook.',
            'A coroner’s jury indicted 94 white men. Not one was ever prosecuted.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Constitutional incorporation',
          definition:
            'The application of the Second Amendment to state and local governments through the Fourteenth Amendment.',
        },
        {
          term: 'Variable Swap',
          definition:
            'The replacement of an explicit racial restriction with a facially neutral proxy that preserves the same structural result.',
        },
      ],
    },

    {
      id: 'prohibition-manufactures-the-crisis',
      title: 'Prohibition Manufactures the Crisis',
      prose: [
        'The Eighteenth Amendment and the Volstead Act (1920) criminalized the production, transportation, and sale of alcohol while public demand remained. The legal supply chain moved into an illicit market where violence became the mechanism for contract enforcement, debt collection, and territorial control.',
        'The market professionalized fragmented street gangs into syndicates capable of managing international smuggling, fleets, breweries, armored transport, thousands of speakeasies, money laundering, and armed enforcement. By 1925, New York City alone held an estimated 30,000 to 100,000 speakeasies.',
        'The national homicide rate rose from a pre-Prohibition range of 4.5 to 6 deaths per 100,000 to approximately 9.8 per 100,000 in 1933, a 78 percent increase. The Chicago Historical Homicide Project recorded 11,018 homicides between 1870 and 1930 and found a 21 percent rise in total homicides during Prohibition while alcohol-influenced homicides remained statistically unchanged.',
        'Repeal supplied a controlled comparison. Between 1933 and 1940, homicide fell by 66.3 percent in Detroit, 56.6 percent in New Orleans, 41.8 percent in New York City, and 33.1 percent in Chicago. The enforcement institutions created during the crisis retained their authority after the market re-regulated.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The Prohibition–Crack Isomorphism',
          paragraphs: [
            'The Prohibition era and the crack era execute the same five-stage sequence: commodity prohibition, illicit-market formation, competitive violence, public panic, and permanent state expansion. The NFA (1934) and the Violent Crime Control Act (1994) are outputs of the same substance-invariant algorithm.',
          ],
        },
      ],
    },

    {
      id: 'taxation-as-disarmament',
      title: 'The NFA and the Economic Filter',
      prose: [
        'The National Firearms Act of 1934 used Congress’s taxing power to regulate machine guns, short-barreled rifles and shotguns, and silencers. Attorney General Homer S. Cummings described the constitutional strategy during congressional testimony: taxation supplied an available legal route around the constitutional question raised by direct prohibition.',
        'The law imposed a $200 transfer and making tax. A new Thompson submachine gun cost approximately $175, so the tax more than doubled its price. A $25 sawed-off shotgun faced an 800 percent increase. The price filter restricted working-class access while leaving wealthy buyers with a route through registration and payment.',
        'Sonzinsky v. United States (1937) upheld the taxing mechanism. United States v. Miller (1939) held that the Second Amendment did not protect weapons lacking a “reasonable relationship to the preservation or efficiency of a well regulated militia.” The NFA supplied the constitutional template later used by the Marihuana Tax Act of 1937.',
        'Congress reduced the NFA tax on suppressors and short-barreled rifles to $0 in 2025. The source identifies a resulting constitutional challenge: the registration and restriction apparatus remains after elimination of the tax that supplied its stated constitutional foundation.',
      ],
      keyConcepts: [
        {
          term: 'Economic filter',
          definition:
            'A price mechanism that preserves formal eligibility while making practical access contingent on wealth.',
        },
        {
          term: 'Taxing-power foundation',
          definition:
            'The enumerated constitutional authority used to support the NFA’s registration and transfer regime.',
        },
      ],
    },

    {
      id: 'the-mulford-proof',
      title: 'The Mulford Proof and the Federal Ratchet',
      prose: [
        'The Black Panther Party for Self-Defense formed in Oakland in 1966 and organized armed monitoring of police interactions with Black residents. The Panthers’ lawful open carry created a visible kinetic counterweight to the Oakland Police Department.',
        'Governor Ronald Reagan signed the Mulford Act in 1967 with support from the National Rifle Association. The law prohibited open carry of loaded firearms in California. The response followed the framework’s predicted sequence: visible Out-group parity triggered a rule change that restored lethal asymmetry.',
        'The Gun Control Act of 1968 established the Federal Firearms License system and prohibited mail-order firearm sales. The Hughes Amendment to the Firearm Owners Protection Act of 1986 barred civilian ownership of machine guns manufactured after May 19, 1986, freezing the transferable supply.',
        'The frozen market converted existing machine guns into scarce assets. A transferable M16 listed in the source at $1,000 in 1986 later commanded $30,000–$50,000. Legal access to comparable hardware became an economic caste boundary.',
      ],
      keyConcepts: [
        {
          term: 'Mulford proof',
          definition:
            'The documented policy reversal that followed the Black Panthers’ lawful exercise of armed monitoring.',
        },
        {
          term: 'Supply freeze',
          definition:
            'A grandfathered market in which legal supply remains fixed and price becomes the primary access barrier.',
        },
      ],
    },

    {
      id: 'brady-awb-and-bruen',
      title: 'The Database, the Ban, and the State Response',
      prose: [
        'The Brady Handgun Violence Prevention Act (1993) created the National Instant Criminal Background Check System. The Federal Assault Weapons Ban (1994–2004) prohibited civilian manufacture of specified semiautomatic firearms and magazines exceeding ten rounds. Its ten-year sunset took effect in 2004, and the source reports no measurable crime-rate effect during the federal ban.',
        'New York State Rifle & Pistol Association v. Bruen (2022) invalidated New York’s discretionary permit structure and recognized an individual right to carry firearms in public. State responses used sensitive-place designations, insurance requirements, training mandates, and grandfather clauses to rebuild restriction through other mechanisms.',
        'Caetano v. Massachusetts (2016) held that the Second Amendment extends prima facie to bearable arms absent at the founding. Commonwealth v. Canjura (2024) applied the Bruen framework to switchblade knives. The source places those rulings against an estimated 24.4 million AR-15-platform rifles in civilian hands.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Adaptive restriction',
          paragraphs: [
            'A judicial ruling can remove one control mechanism while leaving the statutory floor and administrative apparatus intact. The subsequent policy sequence routes through available substitutes.',
          ],
        },
      ],
    },

    {
      id: 'the-doctrinal-pincer',
      title: 'The Doctrinal Pincer',
      prose: [
        'United States v. Miller (1939) tied constitutional protection to a weapon’s reasonable relationship with militia preservation or efficiency. Modern assault-weapons bans defend exclusion through the same weapons’ military character. The two rules assign opposite constitutional consequences to military suitability.',
        'District of Columbia v. Heller (2008) used the conjunctive phrase “dangerous and unusual weapons” and protected arms in common lawful use. The source identifies Worman v. Healey, 922 F.3d 26 (1st Cir. 2019) and Capen v. Campbell, No. 23-cv-11009 (1st Cir. 2025) as decisions that operationalized a disjunctive or compound “unusually dangerous” test.',
        'New York State Rifle & Pistol Association v. Bruen (2022) requires a historical tradition supporting a challenged regulation. The source treats this requirement as the circuit breaker for rarity created by a modern ban: a restriction cannot manufacture uncommonness and then use that result as its own constitutional justification.',
        'United States v. Rahimi, 602 U.S. 680, 702 (2024) (Roberts, C.J.) upheld temporary disarmament of a person adjudicated to pose a credible threat to physical safety. The 8–1 majority explicitly reaffirmed Bruen’s historical-tradition test, and Justice Thomas, the author of Bruen, dissented.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'proof',
          label: 'The internal doctrinal chain',
          paragraphs: [
            'Miller places militia-suitable arms within the Second Amendment’s field.',
            'Heller protects arms in common lawful use and excludes weapons that are both dangerous and unusual.',
            'Bruen requires historical analogues for modern regulation.',
            'The source concludes that consistent application of all three propositions creates a direct challenge to modern military-character exclusions.',
          ],
        },
      ],
    },

    {
      id: 'the-jurisprudential-boomerang',
      title: 'The Jurisprudential Boomerang',
      prose: [
        'The disarmament sequence begins with controls directed at racialized and immigrant populations. Each restriction deposits a precedent into doctrine. Later administrations and legislatures apply the accumulated machinery to broader civilian populations.',
        'The source distinguishes three event classes. Acts of Congress create the durable federal floor. Administrative rules reclassify property without a congressional vote. Supreme Court decisions can reduce a specific restriction while leaving the federal statutory floor intact.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'A Wave-Test of the Timeline',
          paragraphs: [
            'The agenda advances through discrete steps. Precedents accumulate as a set. The target scope expands from the racialized Out-group to the racialized Out-group together with the Buffer Class.',
          ],
        },
      ],
      deepDive: {
        label: 'The three equations of target expansion',
        passages: [
          {
            heading: 'The Jurisprudential Boomerang: A Wave-Test of the Timeline',
            paragraphs: [
              'What begins as racialized disarmament returns as generalized disarmament. The same jurisprudence co-signed under racial fear is later applied to the Buffer Class itself.',
            ],
          },
        ],
        equations: [
          {
            latex: 'x_0 \\rightarrow x_1 \\rightarrow \\cdots \\rightarrow x_m',
            label: 'eq. 11.2',
            note: 'The disarmament agenda path.',
          },
          {
            latex: '\\mathcal{R}_{t+1}=\\mathcal{R}_t \\cup \\{r_t\\}',
            label: 'eq. 11.3',
            note: 'Restriction precedents accumulate in doctrine.',
          },
          {
            latex:
              '\\operatorname{Target}(r_t): O_{\\text{racialized}} \\;\\rightarrow\\; O_{\\text{racialized}} \\cup I_{\\text{buffer}}',
            label: 'eq. 11.4',
            note: 'The target set expands.',
          },
        ],
      },
    },

    {
      id: 'the-restriction-floor',
      title: 'The Restriction Floor, 1911–2024',
      prose: [
        'The source dataset contains 16 events spanning 113 years. Federal legislation rose from zero active statutes to five by 1994, then fell to four when the Federal Assault Weapons Ban expired in 2004. The NFA, GCA, Hughes Amendment, and Brady Act remain active as the federal floor.',
        'Heller (2008), McDonald (2010), and Bruen (2022) reduced the net restriction count from seven to four by invalidating specific state and local restrictions. The Acts of Congress floor remained at four.',
        'Administrative action then raised the count. The bump stock ban (2018) affected 500,000 devices. The ghost-gun rule (2022) covered unfinished frames and parts kits. The pistol-brace rule (2023) exposed an estimated 10–40 million owners to NFA liability. Cargill (2024) vacated the bump stock rule, and Rahimi (2024) upheld a narrow restriction. The terminal net restriction count is six.',
      ],
      visual: {
        kind: 'timeline',
        data: [
          {
            year: 1911,
            event: 'Sullivan Law creates discretionary handgun licensing.',
            outgroup: ['Italian immigrants', 'Jewish immigrants'],
          },
          {
            year: 1934,
            event: 'National Firearms Act establishes the federal tax-and-registration layer.',
            outgroup: ['Working class', 'Italian-American communities', 'Jewish communities'],
          },
          {
            year: 1967,
            event: 'Mulford Act prohibits loaded open carry in California.',
            outgroup: ['Black Panther Party', 'Black Californians'],
          },
          {
            year: 1968,
            event: 'Gun Control Act creates the federal licensing gate.',
            outgroup: ['Racialized Out-group', 'Lower Buffer Class'],
          },
          {
            year: 1986,
            event: 'Hughes Amendment freezes the transferable machine-gun supply.',
            outgroup: ['Working class'],
          },
          {
            year: 1993,
            event: 'Brady Act establishes federal transaction verification.',
            outgroup: ['Civilian firearm purchasers'],
          },
          {
            year: 1994,
            event: 'Federal Assault Weapons Ban adds a ten-year hardware restriction.',
            outgroup: ['Buffer Class', 'Civilian firearm owners'],
          },
          {
            year: 2004,
            event: 'The federal assault-weapons restriction expires through its sunset.',
            outgroup: ['Civilian firearm owners'],
          },
          {
            year: 2008,
            event: 'Heller invalidates a local restriction and confirms an individual right.',
            outgroup: ['District firearm owners'],
          },
          {
            year: 2010,
            event: 'McDonald applies the Second Amendment to the states.',
            outgroup: ['Otis McDonald', 'State and local firearm owners'],
          },
          {
            year: 2022,
            event: 'Bruen invalidates New York’s discretionary carry standard.',
            outgroup: ['Public-carry applicants'],
          },
          {
            year: 2024,
            event: 'Cargill vacates the bump stock rule; Rahimi upholds a narrow restriction.',
            outgroup: ['Buffer Class', 'Adjudicated dangerous persons'],
          },
        ],
        caption:
          'Selected events from the source’s 16-event sequence. The federal statutory floor persists across rights-expanding rulings.',
      },
      keyConcepts: [
        {
          term: 'Restriction floor',
          definition:
            'The set of active Acts of Congress that remains after state, local, and administrative restrictions change.',
        },
        {
          term: 'Felony-overnight mechanism',
          definition:
            'Administrative reclassification that subjects previously lawful possession to federal criminal liability without a new congressional vote.',
        },
      ],
    },

    {
      id: 'the-solidarity-vector',
      title: 'The Solidarity Vector',
      prose: [
        'The chapter presents gun control as an entry point for communicating the framework to the armed Buffer Class. Economic filters, bureaucratic friction, spatial proxies, and grandfather clauses now govern populations beyond the racialized groups first targeted by the architecture.',
        'The common interest becomes visible when Black firearm owners and white firearm owners identify the same institutional sequence operating across their experiences. The source locates a possible cross-racial solidarity vector in shared resistance to containment.',
        'The framework offers no prediction that this coalition will form. It identifies conditions that make the shared material interest legible: the same statutory machinery, the same administrative apparatus, and the same asymmetry between civilian and enforcement capacity.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The bridge',
          paragraphs: [
            'The jurisprudential boomerang gives the Buffer Class direct evidence of target expansion. Rights surrendered under racial fear return as restrictions on the population that supported the original precedent.',
          ],
        },
      ],
    },

    {
      id: 'the-tvs-diode',
      title: 'The TVS Diode and the Abort Threshold',
      prose: [
        'A transient voltage suppressor diode sits in parallel with vulnerable circuitry and activates during a destructive voltage spike. The chapter maps an armed Out-group onto this protective component. Daily operation remains peaceful and high-resistance. A kinetic strike crosses the activation threshold and encounters physical resistance.',
        'The deterrence model treats enforcement as a cost calculation. Resistance raises the heat and physical loss imposed on the enforcement apparatus. A strike is aborted when projected loss exceeds the apparatus’s maximum sustainable cost.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The Armed Node as TVS Diode',
          paragraphs: [
            'Normal State (High Resistance): Under daily, steady-state extraction, the TVS diode exhibits near-infinite resistance. It does not initiate current or execute violence. It remains entirely defensive and idle. This maps to the Out-group existing peacefully, building decentralized networks and local infrastructure.',
            'The Breakdown Voltage (V_br): The specific voltage threshold at which the TVS diode activates. By utilizing legal firmware exploits, including the Bruen decision, to amass arms and training, the Out-group exponentially increases its V_br.',
            'The Clamping Action: When the Elite attempts a kinetic strike that exceeds V_br, the TVS diode instantly drops its resistance and clamps the voltage. It physically absorbs the lethal kinetic energy, short-circuiting the state’s attack before it can destroy the community grid.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Kinetic Abort Threshold',
          paragraphs: [
            'R_kinetic is the physical resistance and deterrent capacity of the Out-group.',
            'P_loss is the thermodynamic heat and physical destruction that enforcement nodes will suffer during the strike.',
            'C_max is the maximum thermodynamic cost the enforcement apparatus can sustain without permanent structural damage.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'P_{\\text{loss}} = I_{\\text{strike}}^2 \\cdot R_{\\text{kinetic}} > C_{\\text{max}}\n\\implies \\text{Strike Aborted}',
            label: 'eq. 13.tvs-abort',
            caption: 'The kinetic abort threshold.',
          },
        },
      ],
      deepDive: {
        label: 'The physical deterrence model',
        passages: [
          {
            paragraphs: [
              "If executing the strike threatens to permanently burn out the Elite's own logic gates and transmission lines, the algorithm mathematically defaults to the Kinetic Abort Threshold. The strike is canceled out of strict physical self-preservation. Physical deterrence is the mathematical prerequisite for peaceful decoupling.",
            ],
          },
        ],
      },
    },
  ],
};

export default ch14;
