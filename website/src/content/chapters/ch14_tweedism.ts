// Chapter 11 — Tweedism and the Puppet Class: The Algorithmic Filter on Democracy
//
// Source: Paper/chapters_src/12_tweedism_and_the_puppet_class_the_algori.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch14: ChapterContent = {
  meta: {
    id: 'ch14',
    slug: 'tweedism',
    number: 14,
    title: 'Tweedism and the Puppet Class: The Algorithmic Filter on Democracy',
    era: 'The Filter',
    hook: 'The algorithmic filter that decides which candidates reach the ballot.',
    epigraph: {
      text: 'I don’t care who does the electing, as long as I get to do the nominating.',
      attribution: 'Boss Tweed, as quoted through Lawrence Lessig’s formulation of Tweedism',
    },
    accentColor: '#833acb',
    heroVisual: {
      kind: 'equation',
      latex: 'x_0 \\rightarrow x_1 \\rightarrow x_2 \\rightarrow \\cdots \\rightarrow x_m',
      label: 'eq. 8.18',
      caption:
        'The agenda-setting path. Each transition can win a local majority. The terminal policy moves away from cross-class material alignment.',
    },
  },

  scenes: [
    {
      id: 'political-front-end',
      title: 'The Political Front-End Scales',
      prose: [
        'Formal enfranchisement creates a direct systems problem for an extraction hierarchy. A larger electorate can theoretically vote against concentrated wealth. The architecture responds by moving control upstream, from the act of voting to the production of viable candidates.',
        'Tweedism preserves the democratic interface and insulates the extraction kernel from electoral pressure. The ballot presents choice after capital, party institutions, and agenda control have already narrowed the executable menu. The Puppet Class operates inside that menu as the political, judicial, and executive interface.',
        'The candidate filter forms the chapter’s central mechanism. The Green Primary pre-selects candidates through capital dependence. The Interference Engine suppresses class coherence among voters. Agenda control converts fragmented preferences into Elite-compatible policy. Institutional correction disciplines candidates who evade the first filter.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: '1890s–PRESENT (SCALING THE POLITICAL FRONT-END)',
          lines: [
            {
              field: 'System Stress',
              value:
                'min: class resistance — HIGH. Franchise expanded to non-landowners, women, and formally to the Out-group. Cross-racial coalition mathematically possible.',
            },
            {
              field: 'Capital',
              value:
                'max: extraction output — STABLE. Industrial and financial capital consolidated into trusts, foundations, and campaign-finance pipelines.',
            },
            {
              field: 'Interference State',
              value: 'Φ_load proximity to τ: [0.62, 0.81]; ρ_τ in [0.60, 0.78].',
            },
            {
              field: 'Variables Loaded',
              value:
                'E, P_puppet v1.0 (Constitutional prototype), F_enforce, I_buffer, O_racialized.',
            },
            {
              field: 'Variables Deployed This Cycle',
              value:
                'P_puppet v2.0 (industrialized), Tweedism Filter (Green/White Primary), Interference Engine, Capture Variable, Agenda-Setter Trap.',
            },
            {
              field: 'Executing Function',
              value:
                'Upgrade the property-based filter to a continuously variable capital-based filter. Pre-select P_puppet before the general electorate is consulted. Load intersectional interference to suppress class coherence. Intimidate P_puppet members who attempt to defect.',
            },
            {
              field: 'Result',
              value:
                'Full 5-tier hierarchy assembled. Democratic interface preserved; extraction kernel insulated from electoral pressure. Gilens–Page (2014) reports a near-zero effect of average-citizen preferences on policy.',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Tweedism Filter',
          definition:
            'The upstream selection process that determines which candidates become electorally viable before the general electorate votes.',
        },
        {
          term: 'Green Primary',
          definition:
            'The campaign-finance stage in which access to concentrated capital determines candidate viability.',
        },
      ],
    },

    {
      id: 'nomination-before-election',
      title: 'Nomination Before Election',
      prose: [
        'The Puppet Class emerged as a distinct interface when the expansion of the franchise weakened the old property qualification. Non-landowners, minorities, and women entered the electorate. Candidate selection became the durable control point.',
        'A citizen seeking office must first survive an electoral phase in which viability depends on capital. The Green Primary binds the candidate to the funding sources that make campaigning possible. By the time the general election begins, the available candidates have already passed through the same financial dependency.',
        'The electorate then chooses between pre-approved interface operators. Their rivalry can govern the surface of policy, party identity, and public debate. Their continued viability remains tethered to the capital of the Elite. Funding withdrawal, primary challengers, capture, and intimidation operate as correction mechanisms when a candidate or officeholder approaches the extraction kernel.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'The Puppet Class',
          paragraphs: [
            'The Puppet Class is the political, judicial, and executive shield within the Buffer Class. It writes laws, sets the agenda, and acts as the system’s interface. Its survival and power remain tethered to Elite capital. The manuscript locates its prototype at the Constitutional Convention and its industrialization in the Gilded Age through Tweedism.',
          ],
        },
        {
          kind: 'pullquote',
          text: 'The Green Primary precompiles the political menu before the electorate touches the screen.',
        },
      ],
      keyConcepts: [
        {
          term: 'Puppet Class',
          definition:
            'The political, judicial, and executive interface whose institutional survival depends on Elite capital.',
        },
        {
          term: 'Algorithmic correction',
          definition:
            'Funding, institutional, reputational, or coercive pressure used to return a defecting interface operator to compliance.',
        },
      ],
    },

    {
      id: 'white-primary-prototype',
      title: 'The White Primary Prototype',
      prose: [
        'The original American implementation filtered voters through race. Beginning in the 1890s, Southern Democratic parties described themselves as private voluntary associations and restricted primary membership to white voters. The one-party structure of the post-Reconstruction South made the Democratic primary decisive and reduced the general election to a formality.',
        'Black voters retained legal access to general elections. The selection of governors, senators, sheriffs, judges, and school board members occurred in whites-only primaries. The interface registered a ballot. The nominating process had already fixed the result.',
        'Grovey v. Townsend (1935) upheld the arrangement unanimously by treating the Democratic Party as a private organization outside the state-action limits of the Fourteenth and Fifteenth Amendments. Smith v. Allwright (1944) rejected that classification by an 8–1 vote because the state regulated, funded, and delegated electoral authority to political parties. Thurgood Marshall argued the case for the NAACP.',
        'The White Primary’s decisive innovation survived its legal defeat. Control over the pre-election selection process could render formal voting politically weak. The modern Green Primary transferred the filter from racial membership to campaign capital.',
      ],
    },

    {
      id: 'leader-follower-graph',
      title: 'The Candidate Filter as a Directed Graph',
      prose: [
        'The formal containment model represents political society as a directed leader-follower graph. A directed edge records the direction of influence. The Elite occupy the leader set. The Puppet, Enforcement, Buffer, and racialized Out-group tiers occupy the follower set.',
        'This mapping clarifies the Green Primary’s position in the hierarchy. Capital transmits viability constraints from the leader set into the political interface. The Puppet Class then transmits policy, enforcement, status, and agenda constraints through the lower tiers. The graph requires a directed path from a leader to every follower and requires no reverse edge.',
        'Candidate selection is therefore an edge in a rooted spanning tree. A voter can update a Puppet-Class node only within the menu that the upstream funding edge permits. The leader state receives no user-level input under the model. The filter acts before public choice enters the graph.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\mathcal{V}_L \\longleftrightarrow E, \\qquad \\mathcal{V}_F \\longleftrightarrow P_{\\text{uppet}} \\cup F_{\\text{enforce}} \\cup I_{\\text{buffer}} \\cup O_{\\text{racialized}}.',
        label: 'eq. 8.2',
        caption: 'The five-tier hierarchy mapped onto the leader-follower partition.',
      },
      keyConcepts: [
        {
          term: 'Directed spanning tree',
          definition:
            'A graph with a directed path from the leader set into every follower node.',
        },
        {
          term: 'Stationary leader',
          definition:
            'A leader whose state does not update in response to follower inputs.',
        },
      ],
    },

    {
      id: 'historical-memory',
      title: 'The Filter Inherits Historical Memory',
      prose: [
        'Fractional-order dynamics give the graph a memory kernel. Each present state depends on the weighted history of prior states. When the order equals 1, the equation reduces to standard integer-order dynamics. Values between 0 and 1 encode a power-law memory whose influence decays across the entire past trajectory.',
        'This memory formalizes compounding. Earlier policy applications remain embedded in present political capacity. The candidate filter therefore acts on an electorate whose access to wealth, mobility, institutions, and coalition infrastructure already carries accumulated constraints.',
        'The Green Primary compounds this inherited asymmetry. Groups with depleted capital approach the nomination stage with diminished capacity to finance candidates independently. Concentrated capital enters the same stage with accumulated control over trusts, foundations, and campaign-finance pipelines.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '{}_{\\,0}D_t^{\\alpha}\\, q_i(t) = u_i(t), \\qquad \\alpha \\in (0,1],',
        label: 'eq. 8.3',
        caption:
          'Fractional-order agent dynamics. The order α encodes historical memory in the present state.',
      },
    },

    {
      id: 'preserved-containment',
      title: 'Preserved Edges, Bounded Outcomes',
      prose: [
        'The navigation function drives each follower toward neighboring states and preserves the existing communication edges. The control law protects the rooted spanning tree as its local connections change. Media, policy, institutions, and sorting behavior can alter the surface topology. The direction of containment remains stable.',
        'The psychological wage functions as an edge-preservation mechanism between the Buffer Class and Elite-adjacent reference groups. Status, cross-class identification, and selective material concession keep that alignment within the admissible region. Simultaneous phase loading pushes Buffer-Class and Out-group states away from the solidarity threshold.',
        'The candidate filter supplies the political relay for this containment system. The Elite set the admissible boundary. Puppet-Class candidates translate the boundary into legislation and agenda sequence. Followers converge toward the convex hull defined by stationary leaders.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Spanning-Tree Preservation',
          paragraphs: [
            'If the graph at the initial time contains a directed spanning tree rooted at the leader set, the control law preserves that spanning-tree property for all subsequent time.',
          ],
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Integer-Order Convergence to the Convex Hull',
          paragraphs: [
            'For order α equal to 1, every follower converges to the convex hull spanned by the stationary leaders.',
          ],
          equations: [
            {
              latex:
                'q_i(t) \\longrightarrow \\operatorname{Co}(q^L) \\qquad \\text{as } t \\to \\infty, \\quad i \\in \\mathcal{V}_F.',
              label: 'eq. 8.10',
            },
          ],
        },
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Mittag-Leffler Asymptotic Stability',
          paragraphs: [
            'For order α between 0 and 1, the containment set is Mittag-Leffler asymptotically stable. Deviation from containment decays slowly under the historical-memory regime.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Convex hull',
          definition:
            'The bounded region of social-economic state space spanned by stationary leaders.',
        },
        {
          term: 'Reform Paradox',
          definition:
            'The absorption of a local reform into closed-loop dynamics that continue toward the containment set.',
        },
      ],
    },

    {
      id: 'attention-after-selection',
      title: 'Attention Control After Candidate Selection',
      prose: [
        'The Green Primary controls entry into the Puppet Class. The Interference Engine controls political attention after approved candidates enter the public contest. Its updated model separates a low-frequency class carrier, multiple identity frequencies, and a broadband noise floor.',
        'The engine depresses power in the class band and elevates power across distinct identity bands. Finite institutional attention moves among those bands. Candidate rivalry can intensify across identity interfaces. Both parties remain inside Elite-compatible class constraints.',
        'This division of labor stabilizes the filter. Pre-screening narrows who can compete. Spectral redistribution weakens the coalition that could demand candidates outside that range. The Puppet Class and adjacent media systems can execute both functions through incentive-compatible competition.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: 'v5.1 (HYBRID TEMPORAL–SPECTRAL INTERFERENCE ENGINE)',
          lines: [
            {
              field: 'Constraint',
              value:
                'A single-frequency phase-offset model preserves total class-band energy and cannot represent redistribution from low-frequency class cycles into higher-frequency identity modes.',
            },
            {
              field: 'Executed Function',
              value:
                'Upgrade to a multi-frequency spectral decomposition: carrier signal at f_class, identity mode spectrum {f_k} from 1 through K, and a broadband noise floor.',
            },
            {
              field: 'Interference State',
              value:
                'Class-band power P_class(t) depressed; identity-band power P_id(t) elevated across K distinct axis frequencies; noise floor η(t) absorbs residual attention.',
            },
            {
              field: 'Diagnostic Output',
              value:
                'S_total(t) = S_class(t) + Σ S_k(t) + η(t); spectral redistribution tested through FFT of political-attention proxies.',
            },
            {
              field: 'Result',
              value:
                'Total variance conserved under the institutional Parseval test; class-band coherence suppressed; kernel stable.',
            },
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'S_{\\text{total}}(t) = S_{\\text{class}}(t) + S_{\\text{id}}(t) + \\eta(t)\n = A_{\\text{class}}(t)\\sin(2\\pi f_{\\text{class}} t + \\varphi_{\\text{class}})\n + \\sum_{k=1}^{K} A_k(t)\\sin(2\\pi f_k t + \\varphi_k)\n + \\eta(t)',
            label: 'eq. 8.14',
            caption:
              'The observed political-attention signal: class carrier, identity-mode spectrum, and noise.',
          },
        },
      ],
    },

    {
      id: 'measured-redistribution',
      title: 'The Measured Redistribution',
      prose: [
        'The manuscript tests the spectral model with Google Trends, the Congressional Record, ANES, GDELT, and a corpus of Supreme Court opinions. These sources operate at different sampling rates and institutional layers. Their combined purpose is to test whether class-band coherence falls as political attention spreads across distinct identity frequencies.',
        'Across the 2004–2024 Google Trends window, class-band power measures 4.85 and identity-band power measures 53.4, a factor of 11.0. Across rolling 10-year windows ending from 2014 through 2024, class-band power falls from 2.28 to 0.55. The class share of total spectral power falls from 0.073 to 0.016.',
        'The institutional conservation test produces a qualified result. The Congressional Record yields a total-power coefficient of variation of 0.162, below the 0.30 threshold. Google Trends yields 0.578. The manuscript interprets fixed congressional floor time as a bounded system and public search attention as an open system capable of class and identity co-spikes.',
        'The phase-load proxy rises in two steps: 0.078 during 1948–1964, 0.214 during 1965–1980, and 0.403 during 1981–2020. The first increase is 0.136, or 174%. The sequence coincides with the activation of gender, nationality, sexuality, and religion axes alongside race.',
      ],
      visual: {
        kind: 'series',
        series: [
          {
            label: 'Class share of total spectral power',
            points: [
              { x: 2014, y: 0.073 },
              { x: 2024, y: 0.016 },
            ],
          },
        ],
        xLabel: 'Rolling-window end year',
        yLabel: 'Class-band share',
        area: true,
        caption:
          'The two reported endpoints of the rolling Google Trends analysis. No intermediate values are interpolated.',
      },
    },

    {
      id: 'suppression-substitution',
      title: 'Suppression Changes Components',
      prose: [
        'The interference system expands when kinetic repression becomes costly. COINTELPRO operated from 1956–1971 against the Black Panther Party, the American Indian Movement, and the antiwar left. The Church Committee investigation in 1971 raised the legitimacy cost of explicit repression.',
        'The suppression envelope then shifted toward phase loading and status wages. From 1956–1971 to 1972–1985, the kinetic-repression proxy falls from 0.97 to 0.38. The phase-load proxy rises from 0.27 to 0.60, and the status-wage proxy rises from 0.19 to 0.52. The composite remains stable with a coefficient of variation below 0.10.',
        'The same substitution logic protects the candidate filter. A system facing resistance at one control point can move pressure into party coordination, media framing, status incentives, agenda sequence, or direct intimidation. Candidate finance remains the first gate. The surrounding mechanisms preserve its output under stress.',
        'The shock-response analysis reports accelerating correction. Natural periods contract from approximately 20.9 years for the 1865 shock to 12.0 years for 1964, 5.8 years for 2008, and 0.94 years for 2020. The fitted response bandwidth expands across the sequence.',
      ],
      keyConcepts: [
        {
          term: 'Suppression envelope',
          definition:
            'The combined capacity of status wage, material wage, kinetic repression, and phase loading to hold class resistance below the failure threshold.',
        },
        {
          term: 'Component substitution',
          definition:
            'The transfer of suppression capacity into other components when one component becomes costly or loses legitimacy.',
        },
      ],
    },

    {
      id: 'agenda-setter',
      title: 'The Agenda-Setter Trap',
      prose: [
        'Candidate pre-selection governs who enters office. Agenda setting governs what those officeholders allow the electorate and legislature to decide. The Puppet Class controls the sequence of policy alternatives after the Green Primary has defined the viable personnel.',
        'The McKelvey–Schofield result supplies the voting geometry. In a Euclidean policy space of dimension at least 2 with at least 3 voters, majority preferences can cycle across the policy space. An agenda setter can choose a sequence in which each transition defeats the current baseline. The terminal position serves a different objective.',
        'The Interference Engine makes this sequence reliable by fragmenting cross-class coordination before voting begins. Buffer-Class and Out-group blocs can each receive a temporary local gain. The complete path moves away from their shared material interest. The psychological wage blocks the advance commitment required to reject those locally attractive steps.',
        'The candidate filter and agenda path operate as one pipeline. Capital screens the interface operators. Fragmentation produces exploitable voting cycles. The installed operators choose the sequence. The final policy can remain inside the Elite-defined convex hull. Every intermediate vote retains a democratic form.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The structural defense',
          paragraphs: [
            'Cross-class coordination requires Buffer-Class and Out-group voters to commit in advance against locally majority-winning steps that move the sequence away from the class-optimal terminal position. The manuscript identifies this commitment as the defense against agenda-setter cycling.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Agenda Setter',
          definition:
            'The Puppet-Class operator who controls the order and pairing of policy alternatives.',
        },
        {
          term: 'Sequential manipulation',
          definition:
            'A path of locally majority-winning votes that carries policy toward a terminal outcome selected by the agenda setter.',
        },
      ],
    },

    {
      id: 'policy-output-test',
      title: 'The Policy-Output Test',
      prose: [
        'Gilens and Page test the endpoint of the filter with 1,779 policy proposals from 1981 to 2002. Their multivariate model compares the independent effects of median-voter preferences, economic-elite preferences, business interest groups, and mass-based organizations on policy adoption.',
        'The median-voter coefficient is 0.03 with a standard error of 0.04 and a p-value of 0.43. The economic-elite coefficient is 0.76 with a standard error of 0.08 and a p-value below 0.001. Business interest groups register 0.52 with a standard error of 0.07 and a p-value below 0.001. Mass-based organizations register −0.04 with a standard error of 0.05 and a p-value of 0.45.',
        'Elite-preferred policies show an adoption rate of 45.2%, compared with 30.8% for median-voter-preferred policies, a difference of 14.4 percentage points. The elite-to-median-voter coefficient ratio is approximately 25 times. The manuscript reads economic elites and organized business interests as co-aligned channels within the extraction layer.',
        'These results test the terminal output of the candidate-filter pipeline. Median-voter preference has a near-zero independent effect after preference overlap is controlled. Elite and business signals dominate the adopted policy path. The democratic interface remains active. The policy output tracks the upstream selection and agenda-setting structure.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'conjecture',
          label: 'Falsification criterion for the agenda path',
          paragraphs: [
            'The agenda-path claim fails if median-voter preferences predict policy outcomes as strongly as top-quintile preferences in multivariate regression across the full 1,779-proposal dataset. The reported coefficients remain widely separated.',
          ],
        },
      ],
    },

    {
      id: 'bypass-correction-capture',
      title: 'Bypass, Correction, Capture',
      prose: [
        'Decentralized campaign finance exposes the Green Primary’s principal vulnerability. Aggregated micro-donations from the Buffer Class and Out-group can rival concentrated Elite funding and create a candidate whose viability does not depend on the standard capital gate.',
        'Bernie Sanders’s presidential campaigns in 2016 and 2020 supplied the manuscript’s stress test. Crowdsourced funding carried a candidate who proposed wealth taxes and universal healthcare into the upper levels of the political interface. The anomaly connected campaign viability directly to a working-class donor base.',
        'The correction moved into the institutional layer. The manuscript cites leaked DNC communications as evidence of institutional bias in 2016. In 2020, approved candidates suspended their campaigns within 48 hours before Super Tuesday and consolidated behind one candidate. Party coordination replaced capital starvation as the active filter.',
        'Capture followed electoral defeat. A contained institutional role, including the Chairmanship of the Senate Budget Committee, brought the anomaly back inside the approved interface. The sequence completes the filter’s adaptive cycle: finance screens candidates, institutions block an evasion, and capture redirects the surviving coalition into established channels.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The candidate-filter cycle',
          paragraphs: [
            'The Green Primary is the default gate. Institutional consolidation acts when decentralized capital bypasses that gate. Political capture absorbs the blocked anomaly and reuses its credibility inside the existing interface.',
          ],
        },
      ],
    },

    {
      id: 'solidarity-and-compliance',
      title: 'The Filter’s Boundary Condition',
      prose: [
        'The complete mechanism begins before nomination and ends with compliance. Capital determines viability. Party institutions coordinate the candidate field. Identity-band competition suppresses class coherence. Agenda setters sequence policy. Policy output tracks Elite and business preferences. Correction mechanisms discipline interface operators who approach the kernel.',
        'Judicial and political correction can include financial absorption, targeted harassment, violent threats, and pressure directed at families. The manuscript describes these actions as notifications that Puppet-Class autonomy remains conditional. International corrections can escalate to kinetic violence when a political interface demands reparations or attempts to nationalize resources.',
        'Cross-class coordination supplies the stated boundary condition. Buffer-Class and Out-group voters must recognize the agenda path and commit against marginal gains that divide their shared material position. This commitment also requires decentralized political capacity capable of carrying candidates through the nomination gate.',
        'The candidate filter remains the spine because every downstream mechanism protects its pre-selected menu. Solidarity threatens that menu at both ends: it can aggregate capital before nomination and refuse sequential division after election. Fragmented political capacity preserves the hierarchy.',
      ],
      keyConcepts: [
        {
          term: 'Class solidarity',
          definition:
            'Advance coordination across Buffer-Class and Out-group blocs around shared material alignment.',
        },
        {
          term: 'Compliance boundary',
          definition:
            'The limit beyond which an interface operator encounters financial, institutional, reputational, psychological, or kinetic correction.',
        },
      ],
    },
  ],
};

export default ch14;
