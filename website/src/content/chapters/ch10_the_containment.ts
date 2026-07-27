// Chapter 10 — The Containment: Pullman, Redlining, and the Wages of Whiteness
//
// Source: Paper/chapters_src/11_the_containment_pullman_redlining_and_th.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory.
import type { ChapterContent } from '../types';

const ch10: ChapterContent = {
  meta: {
    id: 'ch10',
    slug: 'the-containment',
    number: 10,
    title: 'The Containment: Pullman, Redlining, and the Wages of Whiteness',
    era: '1894–1965',
    hook: 'Pullman, redlining, and the wages of whiteness.',
    epigraph: {
      text: 'Spatial policy became cognitive firmware.',
    },
    accentColor: '#97327a',
    heroVisual: {
      kind: 'equation',
      latex:
        'j\\psi_s \\uparrow \\implies \\text{Solidarity}(I_{\\text{buffer}}, O_{\\text{racialized}}) \\downarrow \\implies \\text{Vulnerability}(I_{\\text{buffer}}) \\uparrow \\implies \\mathcal{E}(t) \\uparrow',
      label: 'The Pullman Corollary',
    },
  },

  scenes: [
    {
      id: 'containment-runtime',
      title: 'Post-Emancipation Containment',
      prose: [
        'The 13th Amendment terminated direct slavery. Extraction continued through indirect systems of convict leasing, sharecropping, and spatial containment.',
        'The containment architecture joined labor partition, geospatial targeting, and political capture. It concentrated the racialized Out-group while preserving the extraction kernel behind a revised legal interface.',
        'Redlining, sundown towns, school boundaries, restrictive covenants, and urban-renewal clearance made race, risk, poverty, policing, and property value appear to share one geography. The learned map became evidence inside the host’s perception.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: '1894–1965 (POST-EMANCIPATION CONTAINMENT)',
          lines: [
            {
              field: 'System Stress',
              value:
                'HIGH — 13th Amendment reclassified the racialized Out-group as citizens with voting rights. Parallel Out-group economy emerging. Civil Rights Movement breaching the legal interface.',
            },
            {
              field: 'Capital',
              value:
                'RESTRUCTURING — Direct slavery terminated. System transitioning to indirect extraction via convict leasing, sharecropping, and spatial containment.',
            },
            {
              field: 'Interference State',
              value: 'Load phase in [0.55, 0.72]; threshold proximity in [0.50, 0.68].',
            },
            {
              field: 'Variables Loaded',
              value:
                'Elite, racialized Out-group, in-group, Buffer Class, Enforcement Class.',
            },
            {
              field: 'Variables Deployed This Cycle',
              value: 'Complex Wage, spatial partition through redlining, Capture Variable.',
            },
            {
              field: 'Executing Function',
              value:
                'Terminate the Out-group’s parallel economy through Tulsa 1921 and East St. Louis 1917. Build the spatial containment field through the National Housing Act 1934. Absorb the Civil Rights Movement’s legal victories into two-party loyalty.',
            },
            {
              field: 'Result',
              value:
                'HOLC Redlining 1934 concentrates the racialized Out-group. The Civil Rights Act 1964 and Voting Rights Act 1965 dismantle the legal interface while the extraction kernel persists.',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Containment field',
          definition:
            'A spatial and institutional architecture that holds a population inside an extraction zone.',
        },
        {
          term: 'Cognitive firmware',
          definition:
            'A learned geography that makes engineered racial risk appear natural and locally observable.',
        },
      ],
    },

    {
      id: 'pullman-partition',
      title: 'Pullman: The Partition Inside Labor',
      prose: [
        'The Pullman Palace Car Company cut wages by 25 percent while maintaining rents in its company town. Some workers earning $9 per week received $0.07 after rent deductions.',
        'Eugene V. Debs and the American Railway Union organized a national boycott that halted rail traffic across 27 states. The union’s racial boundary created a channel for capital to defeat the action.',
        'The ARU had restricted membership to white railroad employees at its 1893 founding convention. The General Managers’ Association, a consortium of 24 railroad companies, recruited excluded Black workers as strikebreakers.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The Pullman Corollary',
          paragraphs: [
            'When the Buffer Class excludes the racialized Out-group from collective action to preserve the psychological wage, the Elite can weaponize the excluded population against the Buffer Class. The partition becomes a structural vulnerability that destroys the Buffer Class’s material power.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'j\\psi_s \\uparrow \\implies \\text{Solidarity}(I_{\\text{buffer}}, O_{\\text{racialized}}) \\downarrow \\implies \\text{Vulnerability}(I_{\\text{buffer}}) \\uparrow \\implies \\mathcal{E}(t) \\uparrow',
            label: 'eq. 7.1',
            caption:
              'A rising psychological wage suppresses solidarity and increases vulnerability to extraction.',
          },
        },
      ],
      deepDive: {
        label: 'The material result',
        passages: [
          {
            paragraphs: [
              'The white railroad workers of 1894 chose the psychological wage and lost their material wages. The Elite extracted maximum value from both populations: Black workers received temporary strikebreaking employment with no union protections and no long-term security, while white workers lost the strike, lost their union, and lost their leader to a federal prison. Only E won.',
            ],
          },
        ],
        equations: [
          {
            latex:
              'W_{\\text{ARU}} = j\\psi_s, \\qquad W_{\\text{ARU}}^2 = (j\\psi_s)^2 = -\\psi_s^2 < 0.',
            label: 'eq. 7.2',
            note: 'A pure status allocation compounds into a negative material result.',
          },
        ],
      },
    },

    {
      id: 'mail-car-pretext',
      title: 'The Mail-Car Pretext',
      prose: [
        'Illinois Governor John Peter Altgeld refused to request federal intervention. The General Managers’ Association then attached Pullman cars to trains carrying U.S. mail, turning the boycott into an obstruction of federal mail delivery.',
        'Attorney General Richard Olney secured a blanket federal injunction under the Sherman Antitrust Act. Olney had served on railroad boards and continued to receive a Burlington Railroad retainer while serving as the nation’s chief law enforcement officer.',
        'President Grover Cleveland deployed approximately 12,000 federal troops to Chicago on July 3, 1894. The troops guarded railroad property, escorted strikebreakers, and cleared rail yards.',
        'Debs was convicted of contempt and imprisoned. In re Debs (1895) unanimously upheld federal intervention through the government’s authority over interstate commerce and mail delivery.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'The railroad managers manufactured the federal crisis they then asked the government to resolve.',
        },
      ],
      keyConcepts: [
        {
          term: 'Manufactured pretext',
          definition:
            'An engineered legal condition that converts capital protection into an authorized enforcement action.',
        },
      ],
    },

    {
      id: 'parallel-economy',
      title: 'The Parallel Economy',
      prose: [
        'Segregation placed Black communities outside the white financial system. Those communities built autonomous institutions inside the segregated space.',
        'Booker T. Washington founded the National Negro Business League in Boston in 1900. By 1915, it had more than 600 chapters across 34 states and affiliated banking, insurance, press, real-estate, and finance organizations.',
        'By 1913, Black Americans had established approximately 40,000 businesses and more than 500,000 Black-owned properties. Greenwood held more than 100 Black-owned businesses by 1921, while Washington’s Shaw corridor hosted more than 200 by 1910.',
        'Banks, insurers, fraternal orders, and mutual-aid societies created internal credit, risk pooling, pensions, loans, and welfare services. This infrastructure reduced dependence on institutions controlled by the Elite.',
      ],
      deepDive: {
        label: 'Economic escape velocity',
        passages: [
          {
            paragraphs: [
              'Within the framework, this autonomous infrastructure represented a system-level threat. The extraction kernel depends on the Out-group’s economic dependency on institutions controlled by E. When O racialized built banks that did not require white capital, insurance companies that did not require white actuarial approval, and commercial networks that circulated wealth internally, the Elite faced a structural crisis: the Out-group was approaching economic escape velocity—the point at which the extraction kernel would lose contact with them.',
            ],
          },
        ],
      },
    },

    {
      id: 'kinetic-destruction',
      title: 'Kinetic Destruction and the F.E.A.R. Signal',
      prose: [
        'The first containment phase attacked concentrated Black wealth through coordinated mob and enforcement violence. The manuscript’s catalog records at least 25 massacre events across at least 14 states over 57 years.',
        'The F.E.A.R. Score tracks four dimensions: frequency and geographic spread, economic annihilation, accountability void, and recursive terror. The final dimension measures the behavior changed in communities beyond the immediate site of violence.',
        'Tulsa’s Greenwood District covered 35 square blocks. The attack killed more than 300 people, displaced 10,000 Black residents, and destroyed property exceeding $1.8 million in 1921 dollars. Insurance companies denied Black claims through riot-exclusion clauses, and no white perpetrator was prosecuted.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Recursive Terror Signal',
          paragraphs: [
            'One kinetic event modifies behavior nationwide at zero marginal enforcement cost. Visible wealth, political organization, and labor organizing become risk signals for every community that receives the broadcast.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'F.E.A.R. Score',
          definition:
            'Frequency and geographic spread, economic annihilation, accountability void, and recursive terror signal.',
        },
      ],
    },

    {
      id: 'redlining-siege',
      title: 'Redlining as Economic Siege',
      prose: [
        'The Home Owners’ Loan Corporation created color-coded residential security maps for 239 American cities. Neighborhoods with significant Black populations received the “D” grade, labeled “Hazardous” and colored red regardless of their financial health.',
        'The Federal Housing Administration denied mortgage insurance in redlined areas and often required restrictive covenants in white neighborhoods. Local appraisers, realtors, lenders, developers, title offices, and deed restrictions extended the containment field through interoperable decisions.',
        'The El Paso record measures this distributed system. Racially and economically restrictive covenants covered 45.94 percent of platted land area from 1900–1950. Covenanted parcels represented 7.59 percent of HOLC-backed mortgages and 10.67 percent of total platted land area in the covenanted/HOLC-overlap category.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'series',
            series: [
              {
                label: 'HOLC-backed mortgages',
                points: [{ x: 7.59, y: 7.59 }],
              },
              {
                label: 'Covenanted/HOLC-overlap platted land',
                points: [{ x: 10.67, y: 10.67 }],
              },
              {
                label: 'Covenanted platted land',
                points: [{ x: 45.94, y: 45.94 }],
              },
            ],
            xLabel: 'Recorded share (%)',
            yLabel: 'Recorded share (%)',
            caption:
              'El Paso covenant and HOLC measures. Each marker plots its verbatim recorded percentage on both axes; no interpolation is added.',
          },
        },
        {
          kind: 'insight',
          heading: 'Three enclosure channels',
          paragraphs: [
            'Redlining tightened geographic and economic mobility. The destruction of banks, hospitals, mutual-aid societies, and commercial networks tightened communal capacity. Narratives of cultural deficiency tightened psychological and epistemic autonomy by recoding engineered destruction as behavior.',
          ],
        },
      ],
      deepDive: {
        label: 'The capital siege',
        passages: [
          {
            paragraphs: [
              'The effect was a capital siege. Black banks, which served redlined communities, were cut off from the federal liquidity that sustained white banks. The Reconstruction Finance Corporation (1932) and later the Federal Deposit Insurance Corporation (1933) disproportionately stabilized large, predominantly white institutions. Black banks—smaller, community-based, and serving populations the federal government had officially classified as “hazardous”—were denied the support that could have preserved them. They failed because the federal government had constructed a financial architecture in which their survival was structurally impossible.',
            ],
          },
        ],
      },
    },

    {
      id: 'new-deal-partition',
      title: 'The New Deal’s Two-Tier Labor System',
      prose: [
        'The National Labor Relations Act (1935) protected collective bargaining while excluding agricultural and domestic workers. The Social Security Act (1935) and Fair Labor Standards Act (1938) carried the same occupational exclusions.',
        'Those categories employed the vast majority of Black Americans. White industrial workers gained organizing, bargaining, minimum-wage, and overtime protections while Black workers in fields and kitchens remained outside those systems.',
        'Federal banking policy restricted Black financial institutions. Federal labor policy withheld organizing rights. Federal housing policy blocked subsidized homeownership. The combined structure converted segregated autonomy into segregated dependency.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The containment field is polymorphic',
          paragraphs: [
            'Banking rules, labor exclusions, mortgage insurance, restrictive covenants, and local market actors preserved one segregation geometry through several interfaces.',
          ],
        },
      ],
    },

    {
      id: 'detroit-proof',
      title: 'Detroit: Labor Demand Meets the Containment Field',
      prose: [
        'The War Manpower Commission recruited tens of thousands of Black workers to Detroit. The city’s Black population rose from approximately 149,000 in 1940 to more than 300,000 by the mid-1940s while federal housing policy maintained segregation.',
        'At Packard Motor Car Company, 25,000 white workers walked out in June 1943 after three Black employees received promotions. The psychological wage redirected labor competition through the racial partition.',
        'Violence from June 20–22, 1943 killed 34 people: 25 Black and 9 white. Police killed 17 of the Black victims and none of the white victims. Approximately 1,800 people were arrested, and 85 percent were Black residents.',
        'President Roosevelt deployed 6,000 federal troops under the Insurrection Act of 1807. A subsequent committee blamed Black leaders and the Black press while exonerating the Detroit Police Department.',
      ],
      deepDive: {
        label: 'The self-reinforcing field',
        passages: [
          {
            paragraphs: [
              'Detroit in 1943 proved that the containment field was self-reinforcing: it created the conditions for conflict, then used the conflict to justify its own perpetuation. The neighborhoods that burned—Paradise Valley, Black Bottom—were the same neighborhoods that Interstate 375 would be routed through thirteen years later, completing the destruction. The riot provided the pretext; the highway poured the concrete.',
            ],
          },
        ],
      },
    },

    {
      id: 'voting-interface',
      title: 'From Suppression to Capture',
      prose: [
        'Williams v. Mississippi (1898) validated facially neutral voter suppression. Mississippi’s 1890 constitution used poll taxes, literacy tests, and understanding clauses without naming race.',
        'Henry Williams challenged the resulting all-white grand jury under the Fourteenth and Fifteenth Amendments. The Supreme Court ruled 9–0 against him. Black voter registration in Louisiana later fell from more than 130,000 to fewer than 1,342 by 1904.',
        'The Voting Rights Act of 1965 ended the suppression architecture described in the source. The Capture Variable then shifted the system toward political loyalty secured through legal concessions while the economic extraction structure persisted.',
        'A modern carceral backdoor continues this interface logic. Research using quasi-random assignment to harsher bail judges in Miami-Dade County finds that pretrial incarceration reduces voting by roughly seven percentage points, with concentrated effects among Black and Hispanic defendants.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Hardware Reading: The Capacitor Bank',
          paragraphs: [
            'Redlining and segregation let the Buffer Class accumulate generational wealth while holding the Out-group at ground potential. Stored wealth smooths recessions, deindustrialization, and foreclosure shocks through housing stability, consumption, and educational continuity. The Out-group experiences the full voltage drop.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Variable Swap',
          definition:
            'A facially neutral mechanism that preserves a racially targeted output after explicit racial language leaves the interface.',
        },
        {
          term: 'Capture Variable',
          definition:
            'Political absorption through legal concession while the extraction structure remains in place.',
        },
      ],
    },
  ],
};

export default ch10;
