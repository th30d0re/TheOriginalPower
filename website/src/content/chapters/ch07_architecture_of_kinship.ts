// Chapter 7 — The Architecture of Kinship: Pre-Colonial African Intimacy and
// the Colonial Extraction of Family
//
// Source: Paper/chapters_src/08_the_architecture_of_kinship_pre_colonial.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped.
import type { ChapterContent } from '../types';

const ch07: ChapterContent = {
  meta: {
    id: 'ch07',
    slug: 'architecture-of-kinship',
    number: 7,
    title:
      'The Architecture of Kinship: Pre-Colonial African Intimacy and the Colonial Extraction of Family',
    era: 'Pre-colonial → 1950',
    hook: 'Pre-colonial African intimacy and the colonial extraction of family.',
    accentColor: '#d5447c',
  },

  scenes: [
    {
      id: 'west-africa-runtime',
      title: 'The Baseline and the Overwrite',
      prose: [
        'The extraction engine requires a population divided into ranked and mutually hostile groups. In the Igbo, Yoruba, and Akan cases documented here, it encountered kinship systems that distributed obligation, economic cooperation, and political authority across extended social networks.',
        'The runtime begins with this pre-colonial evidentiary base. It then traces two successive disruptions: the demographic shock of the transatlantic slave trade and the colonial installation of missionary, administrative, and legal controls.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title:
            'WEST AFRICA (PRE-COLONIAL BASELINE → COLONIAL OVERWRITE, 1450–1950 CE)',
          lines: [
            {
              field: 'System Stress',
              value:
                'MINIMAL — Communal kinship networks distribute resilience across extended clans. Dual-sex governance and female economic autonomy prevent unilateral partition. Algorithm cannot compile on unpartitioned population. (min: class resistance)',
            },
            {
              field: 'Capital',
              value:
                'BLOCKED — Matrilineal inheritance, independent female trading guilds, and distributed bridewealth networks constitute structural antibodies against the standard atomization subroutine. (max: extraction output)',
            },
            {
              field: 'Interference State',
              value:
                'NEAR-ZERO — Gender complementarity and indigenous gender fluidity deny the extraction kernel its required binary input variable. Divide-and-conquer function fails to compile. (Φ_load)',
            },
            {
              field: 'Active Patch',
              value:
                'DEPLOYING — (1) Transatlantic slave trade initiates demographic cataclysm: male-biased extraction collapses regional sex ratios, forcing polygyny universalization. (2) Colonial overwrite begins: missionary vanguard, warrant chiefs, coverture, repugnancy clauses.',
            },
            {
              field: 'Variables Targeted',
              value:
                'O_racialized ∩ O_gendered — Maximum extraction coefficient α_r,g requires destruction of communal kinship baseline prior to diaspora-phase execution.',
            },
            {
              field: 'Executing Function',
              value:
                'Replacing distributed intimacy with the atomized nuclear unit. Installing patriarchal binary. Criminalizing gender complementarity and matrilineal inheritance.',
            },
            {
              field: 'Result',
              value:
                '[POLICY] Warrant chiefs installed; women’s councils dissolved (Igboland, 1900s). [POLICY] Coverture imported via English common law in British Nigeria and Gold Coast. [POLICY] Repugnancy clauses criminalize woman-to-woman marriage and indigenous gender fluidity. [TRIGGER] 1929 Igbo Women’s War (Ogu Umunwanyi): coordinated cross-community female kinetic resistance. Colonial response: lethal. Partition installed by force.',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Distributed intimacy',
          definition:
            'A kinship architecture that spreads affection, care, economic cooperation, dispute resolution, and social security across multiple relationships and institutions.',
        },
        {
          term: 'Colonial overwrite',
          definition:
            'The missionary, administrative, and legal program that displaced indigenous kinship authority with the patriarchal nuclear household.',
        },
      ],
    },

    {
      id: 'distributed-intimacy',
      title: 'Distributed Intimacy as Structural Immunity',
      prose: [
        'Pre-colonial West African societies distributed affection, childcare, economic cooperation, dispute resolution, and social security across co-wives, maternal uncles, lineage elders, and trading partners. Each relationship carried part of the social load.',
        'The network absorbed the death, failure, or departure of an individual member by redistributing obligations among the remaining nodes. This structure reduced the risk of total destitution and preserved collective capacity during household disruption.',
        'Atomization concentrated support inside a single pair and increased dependence on purchased childcare, eldercare, food preparation, and emotional support. Colonial administration targeted extended kinship because communal resilience raised the cost of sustained extraction.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Structural immunity',
          paragraphs: [
            'Multiple caregivers, economic partners, lineage authorities, and political institutions gave individuals several routes to support and redress. That redundancy limited the reach of any single household authority.',
          ],
        },
      ],
    },

    {
      id: 'igbo-lineage-alliance',
      title: 'The Igbo Configuration: Lineage Alliance',
      prose: [
        'The Igbo of southeastern Nigeria organized descent patrilineally and residence virilocally. Wives moved to a husband’s ancestral compound, while marriage bound two extended families through bridewealth.',
        'Bridewealth legitimized the union, assigned children to the father’s lineage, and created mutual accountability between families. Divorce triggered an obligation to return the bridewealth, giving the bride’s family a continuing material interest in her welfare.',
        'Polygynous compounds pooled agricultural labor. The senior wife, or iyom, mediated among co-wives, managed compound resources, and conducted independent market activity.',
      ],
      deepDive: {
        label: 'The lineage-preservation mechanisms',
        passages: [
          {
            heading: 'Bridewealth',
            paragraphs: [
              'Bridewealth has been systematically misread by colonial observers as the “purchase” of women—a framing that both flattens the institution and projects European property logic onto a fundamentally different social technology. Within the Igbo framework, bridewealth performed three structural functions. First, it legitimized the union and assigned lineage membership to children: they belonged to the father’s compound, carrying his ancestral line forward. Second, it created a system of mutual accountability: the bride’s family retained a vested interest in her welfare, since dissolution of the marriage triggered an obligation to return the bridewealth—making mistreatment of the wife a financial liability for the husband. Third, it established inter-family bonds of obligation that distributed resources and responsibilities across two lineages—the precise opposite of the isolated nuclear household the colonial state would later impose.',
            ],
          },
        ],
      },
    },

    {
      id: 'igbo-gender-functions',
      title: 'The Igbo Configuration: Gender as a Legal Function',
      prose: [
        'Igbo institutions could assign social and legal roles according to lineage needs. A daughter could become an okpara nwanyi, or male daughter, when a man died without a male heir. She inherited property, continued the compound, and occupied the social status of a son.',
        'Woman-to-woman marriage supplied another lineage-preservation mechanism. A wealthy woman could pay bridewealth for a younger woman and become her legal husband. Children conceived with a selected male genitor belonged legally to the female husband and carried her lineage.',
        'These institutions treated gender roles as operative positions within genealogy and property. Their flexibility preserved lineages under demographic pressure and prevented a rigid gender partition from governing every legal function.',
      ],
      deepDive: {
        label: 'Verbatim account of the two institutions',
        passages: [
          {
            heading: 'The male daughter',
            paragraphs: [
              'The first is the male daughter (okpara nwanyi). Under strict patrilineal rules, a man who died without male heirs faced the extinction of his lineage: his compound would dissolve, his property would be redistributed, and his ancestors would receive no descendants to perform the necessary rituals. To prevent this, a daughter could be socially reclassified as a “male daughter,” assuming the legal and social status of a son—inheriting property, perpetuating the compound, and being addressed in the masculine social register. The reclassification was legally operative.',
            ],
          },
          {
            heading: 'Woman-to-woman marriage',
            paragraphs: [
              'The second is woman-to-woman marriage (igba ohu or inyomdi). A wealthy woman—a barren wife seeking to extend her lineage, a prosperous trader seeking to expand her household’s labor force, or a wealthy widow seeking heirs—could pay bridewealth for a younger woman, becoming her legal husband. The female husband then selected a male genitor (biological father) to impregnate her wife; all children born from the union legally belonged to the female husband, carrying her lineage. The female husband exercised the full social and legal authority of a husband within the household.',
            ],
          },
        ],
      },
    },

    {
      id: 'yoruba-autonomy',
      title: 'The Yoruba Configuration: Economic and Political Authority',
      prose: [
        'Yoruba women dominated local and regional trade, including market operations, craft guilds, and long-distance commercial routes. They generated, retained, and managed wealth independently of their husbands, preserving leverage and a credible exit from marriage.',
        'Dual-sex governance gave this economic position an institutional form. The Iyalode represented women’s collective interests, regulated markets, mediated disputes, levied fines, exercised judicial authority, and could challenge the Oba and his council.',
        'The Yoruba institution of àlè recognized an intimate relationship outside the formal marriage contract. Its distinct name preserved a social distinction between lineage alliance, procreation, and the wider field of intimacy.',
      ],
      deepDive: {
        label: 'Women’s economic autonomy',
        passages: [
          {
            paragraphs: [
              'Yoruba women completely dominated local and regional trading networks, controlling market operations, craft guilds, and long-distance commercial routes. They generated, managed, and retained their own wealth independently of their husbands. Because women arrived in marriage as independent economic agents and remained so throughout, they retained substantial leverage within intra-household bargaining. The husband’s authority was bounded by the wife’s economic independence, which provided a credible exit option. This was the structural output of a kinship system in which the wife’s economic identity was never subsumed into her husband’s.',
            ],
          },
        ],
      },
    },

    {
      id: 'akan-matrilineality',
      title: 'The Akan Configuration: The Abusua and the Ohemaa',
      prose: [
        'The Akan, including the Asante and Fante of modern-day Ghana, organized descent through the abusua, or maternal clan. Blood, civic belonging, property, titles, and ritual obligations passed through the maternal line.',
        'A child belonged permanently to the mother’s clan, and the maternal uncle, or wofa, served as the principal male authority within that shared bloodline. Women retained their children, property, and social standing after divorce because their security remained grounded in the abusua.',
        'The Ohemaa, or Queen Mother, co-ruled with the king, nominated male successors to the stool, maintained royal genealogy, and censured violations of custom. The Asantehemma held decisive authority over succession and lineage.',
      ],
      deepDive: {
        label: 'Matrilineal security',
        passages: [
          {
            paragraphs: [
              'The practical consequence was that Akan marriages were notably more fluid than in patrilineal societies: divorce was relatively common, serial monogamy and serial polygyny coexisted, and a woman who dissolved an unsatisfactory marriage did not lose her children, her property, or her social standing. Her security was grounded in her abusua. This structural independence was the system functioning as designed, distributing the risk of any single relationship’s failure across a durable matrilineal network.',
            ],
          },
        ],
      },
    },

    {
      id: 'scope-of-the-baseline',
      title: 'The Evidentiary Boundary',
      prose: [
        'The Igbo, Yoruba, and Akan cases contained patriarchy, hierarchy, co-wife friction, and status competition. The evidence supports a bounded structural claim about the distribution of authority, risk, and exit capacity.',
        'Lineages, markets, women’s councils, and dual-sex offices created multiple jurisdictions. Divorce, social reclassification, independent commerce, and durable clan membership preserved forms of mobility within those jurisdictions.',
        'These features kept communal capacity, economic mobility, and epistemic autonomy comparatively open. Indigenous power remained present, while total enclosure inside a single market-dependent nuclear household remained incomplete.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The pre-colonial baseline used in this chapter',
          paragraphs: [
            'A set of distinct kinship configurations in which social support and governing authority were distributed across several institutions.',
            'A comparative baseline for measuring the later effects of demographic extraction, coverture, male-only colonial administration, and the repugnancy clause.',
          ],
        },
      ],
    },

    {
      id: 'demographic-cataclysm',
      title: 'The Slave Trade Re-engineers the Sex Ratio',
      prose: [
        'Between 1500 and 1900, European powers forcibly deported approximately 12.5 million Africans to the Americas. Plantation demand placed a premium on adult male labor, producing a heavily male-biased extraction from West Africa over four centuries.',
        'Heavily affected regions experienced estimates of women outnumbering men by ratios approaching two to one during peak extraction. Male scarcity increased male bargaining power, intensified co-wife competition, and expanded women’s agricultural burdens.',
        'Polygyny had previously operated as an ideal constrained by wealth. The demographic crisis drove its expansion beyond older, wealthier men as communities sought recognized households, fertility, and agricultural capacity amid sustained population loss.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'timeline',
            data: [
              {
                year: 1500,
                event:
                  'Opening of the documented four-century interval in which European powers forcibly deported approximately 12.5 million Africans to the Americas.',
                outgroup: ['West African populations in the primary extraction zones'],
              },
              {
                year: 1900,
                event:
                  'Closing of the documented deportation interval; British colonial administration was installing male Warrant Chiefs in Igboland during the 1900s.',
                outgroup: ['Extended kinship networks', 'Women’s councils'],
              },
              {
                year: 1929,
                event:
                  'The Igbo Women’s War mobilized traditional councils and trading networks against colonial taxation and Warrant Chiefs.',
                outgroup: ['Igbo women under colonial administration'],
              },
            ],
            caption:
              'Demographic extraction, colonial administration, and organized resistance.',
          },
        },
      ],
      deepDive: {
        label: 'The demographic mechanism',
        passages: [
          {
            paragraphs: [
              'The demographic consequence was a severe and enduring shortage of adult males across the West African subcontinent, producing a massive surplus of women in the remaining populations. It was a sustained, multi-generational distortion of the sex ratio across the primary extraction zones. In heavily affected regions, women are estimated to have outnumbered men by ratios approaching 2:1 during peak extraction periods.',
              'A society facing this demographic crisis must adapt its core institutions or collapse. In West Africa, the adaptive response was the radical intensification and universalization of polygyny. Prior to the slave trade, polygyny was the cultural ideal but was functionally constrained by economic reality: only older, wealthier men commanded the resources to maintain multiple wives. The sudden scarcity of men inverted this logic. In order to absorb the surplus female population, ensure that all women had a socially recognized household structure, maintain the fertility rates necessary to prevent total demographic collapse, and preserve the agricultural labor capacity of the compound, polygyny had to expand beyond the wealthy elite and become a nearly universal practice.',
            ],
          },
        ],
      },
    },

    {
      id: 'east-african-control',
      title: 'The East African Control Case',
      prose: [
        'The Indian Ocean and Red Sea slave trades extracted a different demographic profile. Buyers sought women for domestic service and concubinage, producing female-biased extraction and a surplus of men in the remaining East African populations.',
        'The regional pattern follows the demographic difference. Modern econometric analysis finds significantly lower historical and contemporary polygyny in East Africa than in West Africa.',
        'The east-west divergence serves as the dataset’s internal control. Different extraction profiles produced different sex ratios, and those ratios map onto different marital outcomes.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Causal leverage',
          paragraphs: [
            'The comparison isolates the demographic composition of extraction as the mechanism associated with the regional polygyny gap.',
          ],
        },
      ],
    },

    {
      id: 'arms-for-slaves-loop',
      title: 'The Arms-for-Slaves Feedback Loop',
      prose: [
        'European traders exchanged muskets for enslaved people. A coastal kingdom that acquired firearms gained a military advantage over neighboring societies, and those neighbors then faced conquest or participation in the same exchange.',
        'The demand for enslaved people as the accepted currency for firearms propagated the cycle inland. Local decisions occurred inside coercive parameters established by European capital, naval power, and weapons asymmetry.',
        'The Atlantic system recruited local elite supply chains through firearms, textiles, and political survival. European legislatures and admiralty courts supplied the downstream legal property form and moral authorization used in the Americas.',
      ],
      keyConcepts: [
        {
          term: 'Externally imposed prisoner’s dilemma',
          definition:
            'A coercive structure in which individually rational defensive choices generate an aggregate outcome that participating societies lacked the power to set.',
        },
        {
          term: 'Interface recruitment',
          definition:
            'The incorporation of local suppliers into an extraction architecture whose global parameters and downstream legal form were established elsewhere.',
        },
      ],
    },

    {
      id: 'colonial-overwrite',
      title: 'Colonial Overwrite and Organized Resistance',
      prose: [
        'Mission schools tied literacy, colonial employment, and institutional access to heterosexual monogamy. Converts had to renounce all wives except the first and abandon indigenous kinship obligations as conditions of entry.',
        'British rule imported English common law into Nigeria, the Gold Coast, and Sierra Leone. Coverture subsumed a married woman’s property, legal rights, and economic identity under her husband, directly constraining Yoruba market autonomy and Akan matrilineal property holding.',
        'Colonial law favored patrilineal inheritance, routed authority through male chiefs, and ignored women’s councils. The repugnancy clause made European magistrates the judges of which indigenous customs satisfied “natural justice, equity, and good conscience.”',
        'In November 1929, tens of thousands of Igbo women organized through council and trading-guild networks against colonial taxation and the Warrant Chief system. British troops opened fire at Opobo and Utu-Etim-Ekpo, killing more than fifty women.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Repugnancy clause',
          paragraphs: [
            'A provision in British colonial jurisprudence that recognized indigenous customary law only when European magistrates found it consistent with “natural justice, equity, and good conscience.”',
            'The standard subjected woman-to-woman marriage to legal challenge and eventual criminalization and imposed Victorian moral premises on indigenous gender institutions.',
          ],
        },
        {
          kind: 'pullquote',
          text: 'The women’s councils functioned as resistance infrastructure.',
        },
      ],
      deepDive: {
        label: 'The administrative overwrite and Ogu Umunwanyi',
        passages: [
          {
            heading: 'Male-only colonial administration',
            paragraphs: [
              'In matrilineal Akan societies, colonial laws systematically favored patrilineal inheritance, empowering men to bypass the abusua and bequeath property directly to biological children. The economic foundation of the Ohemaa’s authority—rooted in matrilineal property transmission—was eroded by statute. In Igboland, the British colonial administration appointed exclusively male “Warrant Chiefs” (akam) to administer local regions. Women’s councils, which had exercised autonomous judicial and administrative authority within the Igbo system, were simply ignored. The gendered extraction template developed in Europe—coverture, male-only political authority, female domestic containment—was copy-pasted onto a social terrain it was precisely designed to overwrite.',
            ],
          },
          {
            heading: 'The 1929 Igbo Women’s War',
            paragraphs: [
              'The response was the Igbo Women’s War (Ogu Umunwanyi), one of the largest anti-colonial uprisings in West African history. Tens of thousands of women, organized through the traditional communication networks of their councils and trading guilds, coordinated a campaign of sustained collective action across multiple provinces simultaneously—gathering in protest, singing, and forcing the resignation of Warrant Chiefs who had participated in the census. The scale, coordination, and geographic spread of the uprising demonstrated precisely what the structural analysis predicts: a population with functional, institutionalized communal networks can mobilize collective resistance at a scale that atomized nuclear households cannot. The women’s councils functioned as resistance infrastructure.',
            ],
          },
        ],
      },
    },

    {
      id: 'surviving-architecture',
      title: 'The Surviving Architecture',
      prose: [
        'Contemporary Nigeria and Ghana retain friction between statutory monogamy and customary recognition of polygyny and extended kinship. Urban economic pressure has reduced formal co-residential polygyny while elite men maintain informal relationships and children in separate households through “private polygyny,” or the outside wife.',
        'Woman-to-woman marriage remains in rural use for inheritance, burial rights, and lineage continuation while facing intensified religious and legal stigma. The pre-colonial baseline remains the reference point for measuring the colonial transformation of family, property, and gender authority.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Hardware Reading: The Distributed Capacitor',
          paragraphs: [
            'Pre-colonial kinship stored care, obligation, and reciprocity across elders, spouses, siblings, and children. The failure of one relationship left other parts of the network available to carry the load.',
            'Colonial extraction targeted that distributed capacity and reorganized intimate life around individualized dependency. The surviving friction records an overwrite that altered the architecture without fully erasing it.',
          ],
        },
      ],
    },
  ],
};

export default ch07;
