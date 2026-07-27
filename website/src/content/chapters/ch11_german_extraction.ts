// Chapter 11 — The German Extraction Algorithm (1904–1945)
//
// Source: Paper/chapters_src/12_the_german_extraction_algorithm_1904_194.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch11: ChapterContent = {
  meta: {
    id: 'ch11',
    slug: 'german-extraction',
    number: 11,
    title: 'The German Extraction Algorithm (1904–1945)',
    era: '1904–1945',
    hook:
      'The same architecture, executed in German South-West Africa and inherited by the Reich.',
    accentColor: '#cc3ed0',
    heroVisual: {
      kind: 'equation',
      latex:
        'O_{\\text{racialized}}^{\\text{Herero}} \\; \\xrightarrow{\\;P_{\\text{kinetic}}\\;} \\; O_{\\text{liquidated}} \\quad \\text{where} \\quad \\mathcal{V}(O_{\\text{liquidated}}) = 0',
      label: 'eq:german-liquidation-reclass',
    },
  },

  scenes: [
    {
      id: 'execution-trace',
      title: 'Colonial Laboratory, Metropolitan Recompile',
      prose: [
        'The German iteration operated in two sequential phases. The German Empire first deployed population depletion, camp architecture, and racial-science research in Southwest Africa. The validated kernel was later recompiled against an internal European population.',
        'The metropolitan phase redirected economic distress toward a visible minority. The resulting liquidation consumed skilled labor, administrative capacity, and productive infrastructure inside the German economy.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: '1904–1945 (SOUTHWEST AFRICA → CENTRAL EUROPE)',
          lines: [
            {
              field: 'System Stress',
              value:
                'CRITICAL — Post-war reparations collapse. Weimar instability generating class-coherence threat. Hyperinflation breaching survival threshold.',
            },
            {
              field: 'Capital',
              value:
                'RESTRUCTURING — Colonial extraction laboratory yields a validated population-depletion subroutine. Internal buffer consumption liquidates middleman-minority assets.',
            },
            {
              field: 'Interference State',
              value:
                'HIGH-DIMENSIONAL — Obfuscation routes blame from the Elite to an internal buffer. Estimated load: [0.65, 0.85]; threshold proximity: [0.75, 0.95].',
            },
            {
              field: 'Active Patch',
              value: 'Colonial laboratory → internal recompile. Obfuscation algorithm deployed.',
            },
            {
              field: 'Variables Loaded',
              value:
                'Elite, Puppet Class, Enforcement Class, Buffer Class, colonial racialized Out-group, and reclassified internal Out-group.',
            },
            {
              field: 'Variables Deployed This Cycle',
              value:
                'Camp architecture, antisemitic interference, racial-hygiene research, and reparations debt.',
            },
            {
              field: 'Executing Function',
              value:
                'Test population depletion in the colonial zone. Reimport the validated subroutine to the metropolitan core under obfuscation cover.',
            },
            {
              field: 'Result',
              value:
                '[POLICY] Extermination Order (1904). [POLICY] Enabling Act (1933). [POLICY] Wannsee Protocol (1942). [SYSTEM ERROR] Internal consumption cannibalizes productive capacity.',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Colonial laboratory',
          definition:
            'The Namibian test cycle for direct liquidation, camp-based biological depreciation, and racial-science justification.',
        },
        {
          term: 'Fatal recursion',
          definition:
            'Application of the depletion subroutine to a load-bearing population inside the metropolitan economy.',
        },
      ],
    },

    {
      id: 'namibian-depletion',
      title: 'Namibia as Proving Ground',
      prose: [
        'Between 1884 and 1903, German settlers and the colonial administration seized approximately 25% of Indigenous-held territory in German South West Africa. Prime agricultural and grazing land was taken first, compressing Indigenous populations into marginal zones.',
        'The Herero population fell from an estimated 80,000 before the 1904 war to roughly 16,000, an 80% depletion. The Nama population fell from roughly 20,000 to approximately 10,000, a 50% depletion. These totals exclude later deaths from forced labor and disease in concentration camps.',
        'The chapter classifies the subsequent fertility collapse as second-order depletion. Malnutrition, trauma, land dispossession, and destroyed kinship networks reduced the capacity of survivors to sustain the next generation.',
      ],
    },

    {
      id: 'extermination-order',
      title: 'The Extermination Order',
      prose: [
        'On October 2, 1904, General Lothar von Trotha issued a direct liquidation instruction after forced labor, taxation, and spatial compression had failed to secure colonial control.',
        'German forces drove the Herero into the Omaheke Desert, sealed water holes, and used mounted patrols to prevent escape. Survivors who surrendered were sent to concentration camps.',
      ],
      blocks: [
        {
          kind: 'source',
          heading: 'Von Trotha’s Extermination Order, October 2, 1904',
          paragraphs: [
            '“Every Herero, with or without rifles, with or without cattle, will be shot. No women and children will be allowed in the territory; they will be driven back to their people or fired upon.”',
          ],
          attribution:
            'German Colonial Office records; documented in Gewald (1999) and Madley (2005).',
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'O_{\\text{racialized}}^{\\text{Herero}} \\; \\xrightarrow{\\;P_{\\text{kinetic}}\\;} \\; O_{\\text{liquidated}} \\quad \\text{where} \\quad \\mathcal{V}(O_{\\text{liquidated}}) = 0',
            label: 'eq:german-liquidation-reclass',
            caption:
              'The operational reclassification of the Herero population from extractable labor to a liquidation target.',
          },
        },
      ],
      deepDive: {
        label: 'The colonial cost calculation',
        passages: [
          {
            paragraphs: [
              'The economic output of the Namibian phase is analytically significant for what it reveals about E’s cost-benefit calculus. The land seized by German settlers between 1885 and 1903—approximately 25% of Indigenous territory—was not immediately productive. The German colonial administration operated at a net loss for most of the period, subsidized by the imperial treasury. The extraction was therefore not driven by immediate profit but by territial optionality: E was purchasing a future extraction zone at a discounted price, using Indigenous labor and land as the down payment. The framework classifies this as speculative colonialism, in which the present subsidy is rationalized by the anticipated future returns from a fully pacified periphery.',
            ],
          },
        ],
      },
    },

    {
      id: 'shark-island',
      title: 'Shark Island',
      prose: [
        'Between 1905 and 1907, thousands of Herero and Nama prisoners were held at Shark Island near Lüderitz. The camp combined forced construction work, rations below subsistence, lethal exposure, and scientific harvesting of bodies.',
        'The architecture had three linked functions: labor extraction, biological depreciation, and research harvesting. Colonial medical officers received corpses and living subjects for anatomical and anthropological study.',
        'The source estimates mortality at approximately 30% per month during peak operation. Camp conditions converted survival duration into a controlled variable within the labor regime.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Three-function architecture',
          paragraphs: [
            'Forced labor produced harbor infrastructure. Rations and exposure shortened survival. Postmortem and living subjects supplied the colonial research apparatus.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Biological depreciation',
          definition:
            'The calibrated reduction of a captive population’s survival through labor, exposure, and rations below subsistence.',
        },
      ],
    },

    {
      id: 'research-pipeline',
      title: 'Fischer’s Research Pipeline',
      prose: [
        'Eugen Fischer conducted medical experiments on mixed-race children in Namibia, measuring skull dimensions, skin pigmentation, and other phenotypic markers. His 1913 study, Die Rehobother Bastards, supplied empirical-looking material for later racial classification.',
        'Fischer later became director of the Kaiser Wilhelm Institute of Anthropology, Human Heredity, and Eugenics. His student Josef Mengele applied the same methodological framework at Auschwitz through experiments on living twins.',
        'The institute produced citations, data tables, and expert authority for legal, educational, and administrative partition. The research pipeline converted colonial subjects into data products for racial policy.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The Colonial Laboratory Theorem',
          paragraphs: [
            'The Namibian phase (1904–1908) validated direct population liquidation, camp-based biological depreciation, and racial science as an ideological cover. The source traces all three subroutines into the metropolitan phase between 1933 and 1945.',
          ],
        },
      ],
      deepDive: {
        label: 'Research as interference',
        passages: [
          {
            paragraphs: [
              'The research pipeline thus functioned as an Interference Engine: it generated spurious empirical noise that obscured the economic and political drivers of extraction, allowing E to present population liquidation as a scientific necessity rather than a capital-management decision.',
            ],
          },
        ],
      },
    },

    {
      id: 'weimar-recompile',
      title: 'The Weimar Recompile',
      prose: [
        'The Weimar Republic operated from 1919 to 1933 under severe post-war economic stress. In November 1923, the exchange rate reached 4.2 trillion marks to the US dollar. Fourteen years produced more than twenty coalition governments, and Heinrich Brüning’s austerity program of 1930–1932 compressed the material position of the Buffer Class further.',
        'The Nazi share of the vote reached 37.3% in July 1932 and 43.9% in March 1933. The Harzburg Front of 1931 and a January 1933 meeting between Hitler and industrialists including Krupp, Siemens, and IG Farben produced funding commitments tied to private property and anti-labor legislation.',
        'The recompile substituted racial status for material recovery. The Enabling Act then dissolved parliamentary constraints on the extraction strategy.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\psi_{\\text{Weimar}} = \\psi_m(t) + \\epsilon \\;\\;\\rightarrow\\;\\; \\psi_{\\text{Nazi}} = \\psi_s^{\\text{racial}}(t) + \\delta, \\quad \\text{where} \\quad \\delta \\ll \\psi_m^{\\text{pre-crash}}',
            label: 'eq:german-variable-swap',
            caption:
              'The Variable Swap replaces a material psychological wage with a racial-status wage at lower material cost.',
          },
        },
      ],
    },

    {
      id: 'status-and-obfuscation',
      title: 'Status Allocation and Blame Redirection',
      prose: [
        'The Nuremberg Laws of 1935 defined Jewishness through graded genealogical categories: full Jews, first-degree Mischlinge, and second-degree Mischlinge. The legal classification assigned status by ancestry and made reproductive crossing a basis for downgrading descendants.',
        'The “Law for the Protection of German Blood and German Honor” criminalized intermarriage and extramarital sexual relations between Jews and persons of “German or related blood.” The 1933 Law for the Prevention of Hereditarily Diseased Offspring extended compulsory sterilization to disabled people, Roma, and children classified as Rhineland Bastards. Approximately 400,000 Germans were sterilized under the law.',
        'The status wage recruited citizens into denunciation and lateral surveillance. Antisemitic propaganda redirected economic distress toward Jewish shops, synagogues, professional practices, and neighborhoods.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\psi_s^{\\text{Aryan}}(i) = \\begin{cases}\n\\psi_{\\text{base}} & \\text{if } G(i) \\in \\text{Aryan} \\\\\n\\psi_{\\text{base}} - \\lambda & \\text{if } G(i) \\in \\text{Mischling}_1 \\\\\n0 & \\text{if } G(i) \\in \\text{Jewish}\n\\end{cases}',
            label: 'eq:german-aryan-status',
            caption: 'The genealogical status gradient encoded by the legal partition.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'During the November 1938 Kristallnacht pogrom, Jewish property and lives were attacked while a one-billion-Reichsmark atonement fine transferred capital from the Jewish community to the state. Destruction, confiscation, and state revenue formed a self-reinforcing cycle.',
          ],
        },
      ],
    },

    {
      id: 'administrative-depletion',
      title: 'Administrative Depletion',
      prose: [
        'The Wannsee Conference of January 20, 1942 standardized a cross-ministerial protocol for rail schedules, census data, banking records, camp administration, and chemical supply. The Einsatzgruppen had already conducted mass shootings across occupied Eastern Europe.',
        'The Wannsee Protocol estimated the European Jewish population at approximately 11 million. Between 1941 and 1945, approximately six million Jews were killed, an average of roughly 1.5 million per year or approximately 4,100 per day. The peak at Auschwitz-Birkenau approached 12,000 per day during the Hungarian deportations of mid-1944.',
        'Selection preserved some young adults temporarily for forced labor while children, elderly people, and infirm people were killed immediately. Sterilization, family separation, and the killing of children extended depletion to the reproductive base.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\frac{dO_{\\text{target}}}{dt} = -\\mu(t) \\cdot O_{\\text{target}}(t) + \\nu(t) \\cdot L_{\\text{forced}}(t)',
            label: 'eq:german-depletion-rate',
            caption:
              'The target population changes through immediate liquidation and temporary preservation for forced labor.',
          },
        },
      ],
      deepDive: {
        label: 'The administrative interface',
        passages: [
          {
            paragraphs: [
              'Within the framework, this quantification is analytically significant because it reveals the algorithm’s self-understanding. The participants at Wannsee—SS officers, ministry officials, and legal experts—did not frame their task as revenge, punishment, or security. They framed it as logistics: rail capacity, camp throughput, labor sorting, and disposal. The language of the minutes is the language of operations research—a Predatory Min-Max Function executed by bureaucrats who understood their task as maximizing output per unit input.',
            ],
          },
        ],
      },
    },

    {
      id: 'fatal-recursion',
      title: 'Fatal Recursion',
      prose: [
        'Colonial extraction depleted a population in the territorial periphery while preserving metropolitan productive capacity. Internal buffer consumption removed physicians, engineers, merchants, scientists, financiers, accountants, and skilled craftspeople from the metropolitan economy.',
        'Aryanization, confiscated bank accounts, seized real estate, and liquidated businesses generated an immediate capital inflow. By 1943, the source assigns negative net extraction to the operation because lost skilled labor and replacement costs exceeded the seizure value.',
        'The war economy imported forced labor from occupied Poland and the Soviet Union. This labor required armed supervision, generated sabotage and escape, and lacked the linguistic and technical skills of the liquidated workforce. By 1944, the German war economy faced catastrophic skilled-labor shortages.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\Delta \\mathcal{E} = \\mathcal{E}_{\\text{liquidated}} - \\mathcal{E}_{\\text{lost}} \\quad \\text{where} \\quad \\mathcal{E}_{\\text{lost}} = \\int_{t_0}^{t_1} L_{\\text{skilled}}(t) \\cdot w_{\\text{eff}}(t) \\, dt',
            label: 'eq:german-net-extraction',
            caption:
              'Immediate asset seizure is offset by the discounted future value of lost skilled labor.',
          },
        },
        {
          kind: 'insight',
          heading: 'The Fatal Recursion Theorem',
          paragraphs: [
            'A depletion subroutine applied to a load-bearing internal population consumes the productive infrastructure required to sustain the Elite’s capital base. The chapter classifies the resulting operation as autophagy.',
          ],
        },
      ],
      deepDive: {
        label: 'Falsifiability conditions',
        passages: [
          {
            paragraphs: [
              'Colonial-to-metropolitan transferability. If empirical research demonstrated that the subroutines validated in Namibia (1904–1908) were not cited, referenced, or operationally echoed in the design of the Holocaust (1941–1945), the transferable-software claim would be falsified. The claim requires documented personnel continuity, methodological similarity, or institutional genealogy.',
              'Internal buffer consumption as negative net extraction. If wartime German economic records showed that the liquidation of Jewish skilled labor generated positive net economic output for E—that is, if the seized assets exceeded the lost productive capacity—the fatal recursion claim would be falsified. The claim requires that ΔE < 0 by 1943.',
            ],
          },
        ],
      },
    },
  ],
};

export default ch11;
