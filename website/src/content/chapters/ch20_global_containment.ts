// Chapter 16 — The Global Containment Field: Scaling the Algorithm
//
// Source: Paper/chapters_src/17_the_global_containment_field_scaling_the.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch20: ChapterContent = {
  meta: {
    id: 'ch20',
    slug: 'global-containment',
    number: 20,
    title: 'The Global Containment Field: Scaling the Algorithm',
    era: 'Global Scale',
    hook: 'The algorithm scaled past the nation-state.',
    accentColor: '#3872bc',
    heroVisual: {
      kind: 'interference',
      caption:
        'The global containment field combines financial, institutional, military, and ideological force across national boundaries.',
    },
  },

  scenes: [
    {
      id: 'scaling-diagnostic',
      title: 'The Local Revolution Meets a Global Field',
      prose: [
        'The Haitian Revolution destroyed the extraction kernel on the island. Haiti then entered an international field capable of imposing debt, diplomatic isolation, military occupation, and external enforcement. Local liberation remained exposed to a system operating at a larger geographic scale.',
        'The Predatory Min-Max Function therefore extends across national borders. A peripheral revolt can remove its domestic extraction interface while the imperial architecture continues to control trade, currency, credit, and military access.',
        'The global field also carries an ideological layer. Debt, sanctions, military bases, currency dependency, and resource extraction enter diplomatic discourse as development, security, and stability. These terms install imperial assumptions as the neutral vocabulary of world order.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: 'SCALING DIAGNOSTIC TO IMPERIAL ARCHITECTURE',
          lines: [
            {
              field: 'System Stress',
              value:
                'Class resistance historically variable. Each system crash—Bacon’s Rebellion, Civil War, Civil Rights—temporarily spiked the minimum and forced emergency patches.',
            },
            {
              field: 'Capital',
              value:
                'Extraction output monotonically increasing across five centuries. Interface changes; kernel persists. Scope expanding from the confirmed domestic architecture to the global extraction field.',
            },
            {
              field: 'Interference State',
              value:
                'Region-dependent. The imperial core maintains high phase-loading; the periphery varies with bloc coordination. Estimated phase load in [0.50, 0.90] and threshold proximity in [0.55, 0.95].',
            },
            {
              field: 'Variables Loaded',
              value:
                'Full domestic architecture, sovereign debt, and Geographic Displacement.',
            },
            {
              field: 'Executing Function',
              value:
                'Extending the five-tier hierarchy to the international system and testing peripheral revolt against the global containment field.',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Global containment field',
          definition:
            'The international financial, diplomatic, and coercive architecture that can neutralize a successful local revolt through isolation and compounding capacity loss.',
        },
        {
          term: 'Scale constraint',
          definition:
            'The exposure created when liberation succeeds inside one territory while trade, currency, credit, and enforcement remain controlled outside it.',
        },
      ],
    },

    {
      id: 'international-hierarchy',
      title: 'The International Five-Tier Hierarchy',
      prose: [
        'The domestic five-tier hierarchy scales into an Atlantic-origin imperial system. Hyper-concentrated financial institutions establish extraction parameters. International institutions translate those parameters into rules. Military, covert, sanctions, and reserve-currency systems enforce compliance.',
        'Allied nations receive preferential trade, security guarantees, and institutional representation. Those material wages align them with an architecture designed at the imperial core. Resource-extraction zones, debtor nations, and formerly colonized territories absorb the compounded losses.',
        'The chapter limits this model to the Atlantic-origin architecture and its institutional successors. Ottoman, Chinese tributary, Mughal, and pre-colonial African systems operated through distinct arrangements. China enters the model as a country that experienced the Atlantic containment field and partially escaped it.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'tierLadder',
            tiers: [
              {
                symbol: 'E',
                name: 'Global Elite',
                description:
                  'Imperial capital centered in Wall Street, the City of London, and the Bretton Woods institutions.',
              },
              {
                symbol: 'P',
                name: 'Global Puppet Interface',
                description:
                  'IMF conditionality, World Bank lending requirements, WTO trade rules, and the UN Security Council veto.',
              },
              {
                symbol: 'F',
                name: 'Global Enforcement',
                description:
                  'NATO military projection, CIA covert operations, sanctions regimes, and weaponization of the US dollar.',
              },
              {
                symbol: 'I',
                name: 'Global Buffer',
                description:
                  'Allied nations receiving material benefits for alignment with the imperial architecture.',
              },
              {
                symbol: 'O',
                name: 'Global Out-group',
                description:
                  'Resource-extraction zones, debtor nations, and formerly colonized territories bearing compounded capacity loss.',
              },
            ],
            caption: 'The domestic hierarchy scaled to the international system.',
          },
        },
      ],
    },

    {
      id: 'imperial-extraction-archive',
      title: 'The Biological Ceiling Removed',
      prose: [
        'The Congo Free State and British India instantiate the extraction kernel at imperial scale. Both systems maximized value transferred to the imperial core while treating colonial survival as an expendable cost.',
        'King Leopold II acquired personal ownership of the Congo basin through the Berlin Conference in 1885. Rubber and ivory quotas were enforced by the Force Publique through hostage-taking, mutilation, starvation, and killing. An estimated 8 to 10 million Congolese died during the twenty-three years of Leopold’s personal rule. Belgian state control began in 1908 and retained the extraction kernel under a revised interface.',
        'British colonial India experienced catastrophic famines between 1769 and 1943 while grain exports continued. The Great Bengal Famine of 1770 killed an estimated 10 million people. The Madras Famine of 1876–1878 killed 5.5 million amid record grain exports. The Bengal Famine of 1943 killed 3 million while rice stocks were diverted to British soldiers and European stockpiles.',
        'The operating interfaces differed across these cases. Direct mutilation administered quotas in Congo. Revenue and export policy redirected food in India. Each interface executed extraction beyond the biological survival threshold.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\max \\mathcal{E}_{\\text{imperial}} - \\min(O_{\\text{colonial}}) \\quad \\text{where} \\quad \\min \\rightarrow \\text{biological death}',
            label: 'eq. 13.2',
            caption:
              'The imperial Predatory Min-Max Function continues extracting as colonial survival approaches biological death.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Consumptive Extraction Function',
          definition:
            'An extraction regime that bears no replacement cost for the laboring population and therefore permits extraction to exceed biological survival.',
        },
        {
          term: 'Ideological variable',
          definition:
            'A narrative that attributes system-produced famine and deprivation to the characteristics of the population absorbing the harm.',
        },
      ],
    },

    {
      id: 'haiti-containment',
      title: 'Haiti: Revolution Succeeded, Liberation Contained',
      prose: [
        'The Haitian Revolution of 1791–1804 destroyed plantation infrastructure, expelled the colonial Elite, and established the first free Black republic in the Western Hemisphere. France answered with a sovereign ransom of 150 million francs, later reduced to 90 million, to compensate slaveholders for their lost human property.',
        'The indemnity consumed up to 80 percent of Haiti’s national budget until 1947. The United States withheld recognition of Haitian sovereignty until 1862. The 1915 occupation seized gold reserves, commandeered customs houses, and reinstated forced labor through the corvée.',
        'Contemporary externalized enforcement preserves the same functional pattern. Domestic coercive capacity remains constrained while multinational missions, bilateral deployments, and contracted foreign contingents can expand the effective enforcement envelope.',
        'Haiti supplies the addendum to the Haitian Theorem: kinetic liberation remains vulnerable when debt, embargo, and imperial enforcement can reinstall the extraction kernel from outside the liberated territory.',
      ],
    },

    {
      id: 'firmin-protocol',
      title: 'The Firmin Protocol',
      prose: [
        'In 1891, Anténor Firmin used diplomatic procedure to block the United States from acquiring Môle Saint-Nicolas as a naval coaling station. Rear Admiral Bancroft Gherardi arrived with the White Squadron and attempted to negotiate directly with the Haitian government. Firmin requested the admiral’s credentials and exposed the absence of localized diplomatic authorization.',
        'Gherardi sought credentials from Washington on February 20, 1891. Firmin closed the negotiations on April 24. He cited the armed US warships in Haitian waters as a condition that prevented free negotiation. A peripheral state used the imperial system’s stated rules to obstruct an extraction attempt.',
        'The later Firminist Revolt established the boundary of that strategy. On September 6, 1902, Admiral Hammerton Killick destroyed the Crête-à-Pierrot and denied the German gunboat SMS Panther a captured vessel. The German intervention proceeded despite its later assessment by German advisors as illegal and excessive under international law.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The Legitimation Inversion Lemma (The Firmin Condition)',
          paragraphs: [
            'A predatory extraction attempt becomes Legitimation-Invertible when three conditions hold simultaneously.',
            'The global Elite has publicly committed to a legitimation constraint set. The minimum force required to compel compliance exceeds the maximum force compatible with a valid agreement. The targeted actor possesses enough procedural knowledge to invoke the constraint set.',
            'These conditions leave no strategy that can both extract value and preserve the agreement’s validity. The predatory actor must abandon extraction or violate its stated rules in public.',
          ],
          equations: [
            {
              latex:
                '\\nexists\\; S:\\quad \\mathcal{E}(S) > 0 \\;\\;\\wedge\\;\\; \\mathcal{L}(S) = \\text{valid} \\quad \\text{when } F^* > F^L',
              label: 'eq. 13.9',
            },
          ],
        },
        {
          kind: 'insight',
          heading: 'Asymmetric procedural leverage',
          paragraphs: [
            'Haiti’s investment in the Môle affair consisted of Firmin’s procedural knowledge. That knowledge blocked the extraction of a strategic coaling station. The leverage came from the imperial actor’s dependence on its own legitimation architecture.',
            'The leverage ends when extraction value exceeds legitimacy cost. The SMS Panther intervention records the point at which the imperial system abandoned the procedural constraint and deployed force.',
          ],
        },
      ],
    },

    {
      id: 'containment-stress-tests',
      title: 'Three Containment Stress Tests',
      prose: [
        'Cuba supplies the long-duration test. After the 1959 revolution nationalized foreign-owned industries and severed the local extraction interface, the United States imposed a comprehensive embargo in 1962. The embargo remained in place as of 2026. The UN General Assembly’s 187–2 condemnation in 2024 identified the containment mechanism through a non-binding resolution.',
        'The Roma, Ashkali, and Egyptian communities displaced after the Kosovo war supply the juridical test. UNMIK housed them on lead-contaminated land from 1999–2013. The UN Human Rights Advisory Panel found responsibility for human-rights violations and produced an incomplete reparations outcome. Legal recognition left the depleted node with an incomplete remedy.',
        'The Alliance of Sahel States supplies the live regional test. Niger, Mali, Burkina Faso, and Gabon expelled French military forces, rejected the CFA Franc system, and pursued resource nationalization during 2023–2024. The Alliance formed in September 2023 to pool military, economic, and diplomatic capacity.',
        'The regional bloc tests whether collective insulation can maintain food, energy, currency, and military capacity under debt, sanctions, and external enforcement pressure. The source records the outcome as unresolved.',
      ],
      keyConcepts: [
        {
          term: 'Containment strategy',
          definition:
            'The use of exclusion, debt, sanctions, and external force to compound capacity loss after a local extraction interface has been removed.',
        },
        {
          term: 'Regional insulation',
          definition:
            'Pooled military, economic, and diplomatic capacity intended to prevent the isolation of a single peripheral revolt.',
        },
      ],
    },

    {
      id: 'reparations-vote',
      title: 'The UN Reparations Vote',
      prose: [
        'On March 25, 2026, the United Nations General Assembly adopted a resolution declaring the transatlantic slave trade a crime against humanity and calling for reparatory justice. The vote was 123 in favor, 3 against, and 52 abstentions.',
        'The United States, Israel, and Argentina cast the three opposing votes. Portugal and a broader European bloc abstained. The distribution places the active imperial core in opposition, allied buffer states in abstention, and much of the Global South in support.',
        'The debt history fixes the direction of material transfer. France imposed reparations on Haiti in 1825 for liberation from slavery. Britain’s Slavery Abolition Act of 1833 authorized approximately £20 million, roughly 40 percent of annual government expenditure, for enslavers. In 2026, the General Assembly’s resolution called for transfer toward the victims and remained non-binding.',
        'The vote created a documentary record and no enforcement mechanism. Control of the Security Council, IMF, dollar system, and military infrastructure left the extraction architecture materially unchanged.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\text{Vote}_{\\text{UN}}(x) = \\begin{cases} \\text{No} & \\text{if } x \\in E_{\\text{imperial}} \\\\[4pt] \\text{Abstain} & \\text{if } x \\in I_{\\text{buffer}}^{\\text{global}} \\\\[4pt] \\text{Yes} & \\text{if } x \\in O_{\\text{global}} \\end{cases}',
            label: 'eq. 13.13',
            caption:
              'The manuscript maps the observed vote distribution onto the international hierarchy.',
          },
        },
      ],
    },

    {
      id: 'imperial-core-theorem',
      title: 'The Imperial Core Theorem',
      prose: [
        'Peripheral liberation remains exposed while the imperial core controls trade, currency, debt, sanctions, and military infrastructure. The chapter derives two possible conditions for durable structural liberation from that constraint.',
        'The first condition requires disruption of the enforcement and financial architecture inside the imperial core. The second requires a peripheral bloc to maintain collective capacity across food production, energy, currency, and military defense under containment pressure.',
        'The source tests the second condition against China, OPEC, South Korea, Taiwan, and Singapore. China’s composite sovereign-capacity score rises from 0.26 in 1978 to 0.55 in 2008 and 0.68 in 2024, crossing the 0.60 threshold approximately in 2015. OPEC peaks at 0.49 in 1973 and returns to 0.46 by 1975. South Korea reaches 0.44, Taiwan 0.52, and Singapore 0.46 in 2024.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'The Imperial Core Theorem',
          paragraphs: [
            'Structural liberation requires imperial core disruption or sufficient peripheral insulation.',
            'Imperial core disruption dismantles the enforcement architecture and financial infrastructure sustaining the global containment field.',
            'Sufficient peripheral insulation keeps a regional bloc above the threshold of sovereign viability through collective control of food, energy, currency, and military defense.',
          ],
          equations: [
            {
              latex:
                '\\text{Either} \\quad F_{\\text{enforce}}^{\\text{global}} \\rightarrow 0 \\quad \\text{or} \\quad O_{\\text{bloc}}^{\\text{capacity}}(t) > \\tau_{\\text{sovereign}} \\;\\;\\forall\\; t',
              label: 'eq. 13.14',
            },
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'series',
            series: [
              {
                label: 'China',
                points: [
                  { x: 1978, y: 0.26 },
                  { x: 2008, y: 0.55 },
                  { x: 2024, y: 0.68 },
                ],
              },
              {
                label: 'OPEC',
                points: [
                  { x: 1973, y: 0.49 },
                  { x: 1975, y: 0.46 },
                ],
              },
              {
                label: 'Sovereign threshold',
                points: [
                  { x: 1973, y: 0.6 },
                  { x: 2024, y: 0.6 },
                ],
              },
            ],
            xLabel: 'Year',
            yLabel: 'Composite sovereign capacity',
            caption:
              'Source-slice capacity values for China and OPEC against the 0.60 sovereign threshold.',
          },
        },
      ],
    },

    {
      id: 'polymorphic-interface-swaps',
      title: 'Polymorphic Interface Swaps',
      prose: [
        'The chapter defines an interface swap as a controlled transition from a failing extraction architecture to a new technological, legal, or monetary substrate. The governing invariant preserves or expands Elite assets across the transition.',
        'The first swap used Executive Order 6102 on April 5, 1933 and congressional nullification of gold clauses. Perry v. United States, 294 U.S. 330, 351 (1935), acknowledged limits on congressional repudiation of federal obligations while denying the bondholder cognizable damages under the existing monetary regime.',
        'The second swap installed the Bretton Woods architecture in 1944. The dollar-gold anchor stood at 35 dollars per ounce, and the IMF and World Bank became compliance institutions. The third swap suspended international gold convertibility on August 15, 1971 after the cover ratio fell from approximately 175 percent in 1949 to approximately 22 percent in July 1971.',
        'The top-0.1-percent wealth series supplies the empirical continuity test. The US share moved from 21.3 percent in 1929 to 18.1 percent in 1933 and recovered to 22.4 percent by 1940. It rose from 10.3 percent in 1944 to 13.2 percent in 1955, and from 7.1 percent in 1971 to 18.5 percent in 2024.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Polymorphic Interface Swap',
          paragraphs: [
            'A Polymorphic Interface Swap demolishes a failing extraction architecture and re-establishes the extraction algorithm on a new technological, legal, or monetary substrate.',
            'The swap activates when accumulated sovereign-debt load exceeds the architecture’s stability constraint. Its hard invariant requires Elite assets under the new architecture to equal or exceed Elite assets under the old architecture.',
            'The liabilities financing the swap flow from the Buffer Class and the Out-group. Hard assets, capital, and institutional power pass into the replacement architecture.',
          ],
          equations: [
            {
              latex:
                '\\forall\\; \\mathrm{SWAP} : \\quad \\Delta_E \\geq 0, \\quad \\text{where} \\quad \\Delta_E = \\mathrm{Assets}(E,\\, \\mathcal{A}_{\\text{new}}) - \\mathrm{Assets}(E,\\, \\mathcal{A}_{\\text{old}})',
              label: 'eq. 13.17',
            },
          ],
        },
        {
          kind: 'pullquote',
          text:
            'The extraction algorithm survives a monetary reboot when ownership of hard assets, capital, and institutional power crosses into the replacement architecture.',
        },
      ],
    },
  ],
};

export default ch20;
