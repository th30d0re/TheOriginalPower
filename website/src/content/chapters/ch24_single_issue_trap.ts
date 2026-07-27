// Chapter 20 — The Single-Issue Trap and Multi-Axis Noise Cancellation:
// A Boston Case Study
//
// Source: Paper/chapters_src/21_the_single_issue_trap_and_multi_axis_noi.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch24: ChapterContent = {
  meta: {
    id: 'ch24',
    slug: 'single-issue-trap',
    number: 24,
    title:
      'The Single-Issue Trap and Multi-Axis Noise Cancellation: A Boston Case Study',
    era: 'Case Study: Boston',
    hook: 'Multi-axis noise cancellation, tested on one city.',
    accentColor: '#38b0a7',
    heroVisual: {
      kind: 'interference',
      caption:
        'A secondary identity signal changes the alignment of a coalition forming around one issue.',
    },
  },

  scenes: [
    {
      id: 'noise-cancellation',
      title: 'The Coalition Fracture',
      prose: [
        'Multi-axis noise cancellation describes a coalition-defense mechanism. A movement aligns around one primary issue. Polarizing identity signals then load secondary axes, increase repulsion among potential allies, and neutralize the movement’s kinetic force. The same partition logic appears across empire, slavery, redlining, and the War on Drugs.',
        'The mechanism works through existing ideological terrain. MAGA and BLM identification carry genuine preference distances with historical roots. The extraction operator selectively amplifies those distances during coalition formation, when their salience imposes the highest cost on a possible alliance. An engine that exploits existing ideological topography sustains itself through preferences already present in the population.',
        'The Boston case places this process at human scale: a rally, a microphone, a plastic training rifle, a police call, and a coalition that fails to consolidate. The scale contracts while the payload remains identical. A secondary identity prior makes potential allies unreadable to one another and routes fear into enforcement.',
        'The sequence occurred on September 27, 2023, in the Boston Common.',
      ],
      keyConcepts: [
        {
          term: 'Multi-axis noise cancellation',
          definition:
            'The injection of polarizing identity politics into a unified movement, causing potential allies to repel along secondary axes.',
        },
        {
          term: 'Preference distance',
          definition:
            'A genuine ideological separation that can be selectively amplified at the moment of coalition formation.',
        },
      ],
    },

    {
      id: 'parkman-bandstand',
      title: 'The Rally Against HD 4420',
      prose: [
        'The Gun Owners’ Action League, or GOAL, organized a rally at the Parkman Bandstand against Massachusetts House Docket 4420, an omnibus gun control bill. Most attendees were white. A significant portion of the crowd displayed MAGA flags and affiliated iconography. Black gun owners had almost no substantial presence. Their Second Amendment rights are historically the most aggressively policed and structurally denied.',
        'A prominent Black speaker addressed that isolation directly. The one stage voice arguing for a cross-racial coalition came from a demographic largely absent from the crowd. He called for defense of the Second Amendment as a single-issue camp.',
        'His proposed discipline excluded both MAGA flags and Black Lives Matter flags. The movement would remove the identity signals that media and the Puppet Class use to frame the event. Cameras trained on a field of polarizing flags would broadcast a partisan identity and alienate people required for a broad coalition.',
        'The speaker identified the operational sequence. A secondary axis attaches to the primary issue. Existing distances gain immediate salience. The coalition fractures during formation, before it can pool force across racial and partisan lines. The timing supplies the diagnostic claim: the system prioritizes a fracture at the location and moment where activation costs the forming coalition the most.',
      ],
      keyConcepts: [
        {
          term: 'Single-issue camp',
          definition:
            'A coalition organized around one primary kinetic issue while suppressing identity signals that activate secondary divisions.',
        },
        {
          term: 'Puppet Class',
          definition:
            'The political interface that uses visible identity signals to frame and isolate the movement.',
        },
      ],
    },

    {
      id: 'microphone-and-muskets',
      title: 'A Cut Microphone and Firing Muskets',
      prose: [
        'The speaker’s microphone was cut while he advocated for a unified coalition across racial and partisan lines. The interruption silenced the rally’s direct structural critique at the moment of delivery. The organizers and the surrounding environment enacted the mechanism he had described. The movement preserved the identity framework that kept its constituency isolated.',
        'Colonial reenactors supplied the physical backdrop. Mere yards away in the Common, actors in period clothing marched with real long guns and fired blank cannons during a ceremonial progression honoring anti-tyrannical revolution.',
        'Boston maintained strict ordinances on carrying long guns in public while the ceremony proceeded. The state celebrated white actors reenacting armed rebellion and advanced HD 4420/Chapter 135 against comparable conduct by current citizens.',
        'The source draws the comparison through the weapons themselves. The musket carried by the reenactor becomes the historical counterpart of the AR-15. A diverse group marching on the capitol with that modern counterpart would encounter kinetic force from the state.',
      ],
    },

    {
      id: 'blue-trainer',
      title: 'The Blue Trainer and the Police Call',
      prose: [
        'After the address, the author and his brother joined the speaker and nearby attendees in an extended debate about building a broader coalition. The author and his brother were the only Black men in their immediate vicinity. The speaker carried a blue plastic AR-15 training replica, a solid and brightly colored object incapable of firing.',
        'The group later moved to a nearby open-air bar in the Common and continued the discussion. Boston Police arrived from every direction, surrounded the table, and kept hands on their weapons.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'The officers had received a call reporting someone “armed with a loaded gun.”',
        },
        {
          kind: 'prose',
          paragraphs: [
            'The caller processed a Black man near a blue plastic training tool through a racialized threat prior. The visible object was solid, brightly colored, and incapable of firing. The prior converted those observations into a lethal-threat judgment and activated the enforcement apparatus against the Out-group. The Bayesian Defense and the Racialization Differential describe that conversion.',
            'The police response brought actual loaded firearms into a peaceful discussion. Individuals claiming fear of gun violence generated a massive influx of armed enforcement. The call created the volatile environment the caller feared. Internalized racial priors, a report, and armed enforcement completed the causal chain.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Bayesian Defense',
          definition:
            'A threat judgment produced by conditioned epistemic priors acting on an observed person and object.',
        },
        {
          term: 'Racialization Differential',
          definition:
            'The racial prior that changes how the same observed object is processed and escalated.',
        },
      ],
    },

    {
      id: 'temporal-proxy',
      title: 'Grandfather Clauses as Temporal Access Control',
      prose: [
        'Grandfather clauses protect accumulated assets held inside a legal boundary and criminalize later acquisition outside it. In gun legislation, that structure preserves the kinetic capital of the Elite and Buffer Class while closing the gate to future entrants. The temporal proxy assigns legal status through the acquisition timestamp. The object and the user’s dangerousness remain constant across the cutoff.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'P_{\\text{temporal}}(x,o,t) =\n\\begin{cases}\n0 & \\text{if subject } x \\text{ possessed object } o \\text{ before cutoff } t_c,\\\\\n1 & \\text{if subject } x \\text{ seeks the same object } o \\text{ after cutoff } t_c.\n\\end{cases}',
            label: 'eq. 15.1',
            caption:
              'The temporal proxy creates different legal outcomes around the same object.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'Massachusetts Chapter 135 expands the Commonwealth’s firearm restrictions and preserves date-sensitive possession categories for weapons held before operative cutoffs. A Bruen-style challenge can therefore examine whether temporal priority permits the state to create two legal classes around the same object.',
            'Bruen places the burden on government to justify covered firearm regulations through the Nation’s historical tradition of firearm regulation. Heller preserves the “dangerous and unusual” category. Rahimi accepts a historically grounded match in burden and justification as the analogue inquiry.',
            'The constitutional claim belongs to litigants. The structural diagnosis treats the temporal proxy as asymmetric access control. Existing kinetic capital remains legal for those already inside the boundary, and later acquisition becomes contraband for those outside it. Removal of grandfather clauses, including the emerging legislative battles described in Rhode Island, applies disarmament pressure to both the Buffer Class and the Out-group. That equal application revokes the psychological wage and exposes the policy’s asymmetric allocation of kinetic force.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Temporal proxy',
          definition:
            'An access-control operator that changes legal status according to possession before or acquisition after a cutoff.',
        },
        {
          term: 'Grandfather clause',
          definition:
            'A date-sensitive rule that preserves existing possession while restricting later acquisition.',
        },
      ],
    },

    {
      id: 'geographic-interface',
      title: 'A La Carte Rights Across State Lines',
      prose: [
        'Geographic fragmentation distributes components of autonomy across incompatible jurisdictions. A person crosses a state line to recover one component and enters a legal environment where another component is degraded. State borders function as interface selectors. The rights vector records biological autonomy, kinetic autonomy, movement, speech, and further components. This a la carte topology places fragments of sovereignty in separate jurisdictions and leaves the complete bundle unavailable in any single state.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\mathcal{R}(s)=\n\\bigl(r_{\\text{bio}}(s), r_{\\text{kin}}(s), r_{\\text{move}}(s), r_{\\text{speech}}(s), \\ldots\\bigr),\n\\qquad\n\\mathcal{R}(s) \\neq \\vec{1} \\;\\; \\forall s .',
            label: 'eq. 15.2',
            caption:
              'The geographic interface distributes autonomy across separate legal components.',
          },
        },
        {
          kind: 'prose',
          paragraphs: [
            'Massachusetts protects abortion and reproductive-health access through state law and shield-law mechanisms. Chapter 135 expands firearm controls through serialization requirements and restrictions on privately made, untraceable, unfinished, or regulated frames and receivers.',
            'New Hampshire presents the inverse profile described in the source. Its firearms chapter reflects the post-2017 permitless-carry environment. RSA 329:44 prohibits most abortions after probable gestational age reaches 24 weeks, subject to statutory exceptions.',
            'The doctrinal details differ between the states. The combined topology places biological autonomy and kinetic autonomy in separate jurisdictions. Movement can reduce one legal exposure and increase another. Geographic fragmentation keeps the subject mobile, legally anxious, and dependent on the border for selection among incomplete bundles of autonomy.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Rights vector',
          definition:
            'The set of autonomy components available within one state’s legal architecture.',
        },
        {
          term: 'Geographic interface swap',
          definition:
            'The recovery of one autonomy component through movement into a jurisdiction that degrades another component.',
        },
      ],
    },
  ],
};

export default ch24;
