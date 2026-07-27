// Appendix D — Falsifiability Conditions for the Two Terminal Theorems
//
// Source: Paper/chapters_src/26_falsifiability_conditions_for_the_two_te.tex
// Adapted prose is derived from that slice only. The formal blocks preserve
// the theorem claims and their specified empirical defeat conditions.
import type { ChapterContent } from '../types';

const apxD: ChapterContent = {
  meta: {
    id: 'apxD',
    slug: 'falsifiability',
    number: 29,
    title: 'Falsifiability Conditions for the Two Terminal Theorems',
    era: 'Reference',
    hook: 'The evidence that would defeat the Concession and Haitian Theorems.',
    accentColor: '#64748b',
  },

  scenes: [
    {
      id: 'reference-standard',
      title: 'A Reference Standard for Defeat',
      prose: [
        'This appendix specifies the empirical conditions that would falsify the Concession Theorem and the Haitian Theorem.',
        'Readers can use these conditions to test proposed counterexamples and assess future evidence as the historical record develops past 2026.',
      ],
      keyConcepts: [
        {
          term: 'Falsification',
          definition:
            'A documented counterexample that satisfies every specified defeat condition for the theorem under examination.',
        },
        {
          term: 'Kernel-level change',
          definition:
            'Permanent structural change to the extraction capacity located at the system apex.',
        },
      ],
    },

    {
      id: 'concession-theorem',
      title: 'The Concession Theorem',
      prose: [
        'The theorem covers every non-kinetic reform in the 1450–2026 dataset. Its claim is that no such reform has permanently reduced the Elite’s extraction share at the system apex.',
        'A counterexample must satisfy all three durability conditions simultaneously. The adoption environment does not alter the result of this test.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Claim',
          paragraphs: [
            'For every non-kinetic reform Rᵢ in the 1450–2026 dataset, Δmax(Rᵢ) = 0.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 1 — Structural reduction in extraction share',
          paragraphs: [
            'The reform must produce a measurable, permanent decline in the top decile’s share of total national wealth. The absolute decrease in E’s extraction share must persist for a minimum of three decades. A slower growth rate for inequality does not satisfy this condition.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 2 — No compensatory extraction elsewhere',
          paragraphs: [
            'The measured reduction cannot be offset through capital flight to offshore jurisdictions, expansion of the extraction base to new populations, or substitution of financial extraction for labor extraction. Aggregate extraction by the apex must decline in real terms across all channels.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 3 — Sustained across threat cycles',
          paragraphs: [
            'The reduction must persist through later periods of low kinetic threat. Erosion after the threat subsides counts as evidence for the theorem.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The theorem predicts that concessions arise as class resistance approaches the threat threshold, scale with the threat level, and decay as the threat retreats. The Great Compression supplies the cleanest measured instance: it rose with the kinetic convergence of 1932–1945 and decayed after 1973.',
            'The New Deal, the Civil Rights Act, OSHA, and the Voting Rights Act produced partial and temporary movement on the first condition. Each failed the second condition, the third condition, or both. In every case, Δmax returned to zero within two to three decades.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Concrete defeat test',
          paragraphs: [
            'Post-2026 evidence would require revision or scope restriction if the United States top 10% wealth share declined from approximately 70% at the 2020 baseline to below 60%, remained there for thirty or more years after a non-kinetic reform, and showed no measurable compensatory extraction in other jurisdictions or asset classes.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Kinetic precondition',
          definition:
            'The elevated class-resistance environment predicted to govern the adoption, magnitude, and durability of concessions.',
        },
        {
          term: 'Compensatory extraction',
          definition:
            'Extraction shifted into another jurisdiction, population, mechanism, or asset class.',
        },
      ],
    },

    {
      id: 'haitian-theorem',
      title: 'The Haitian Theorem',
      prose: [
        'The strong-form test applies to a society with an operative intra-national racial partition and a functioning ψ mechanism. A valid counterexample must document kernel termination achieved without kinetic threat.',
        'All five conditions must hold in the same historical case.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'theorem',
          label: 'Claim',
          paragraphs: [
            'For all non-kinetic interventions Rᵢ in the dataset, Δmax(Rᵢ) = 0. At least one kinetic action Kⱼ exists for which max(tₚₒₛₜ) = 0 locally.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 1 — Intra-national racial partition',
          paragraphs: [
            'The society must have an installed, operative racial partition with a functioning ψ mechanism: a buffer class holding status wages against a racially defined out-group.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 2 — Absence of kinetic precondition',
          paragraphs: [
            'The liberation must occur with no credible kinetic threat in the background: no armed wing, imminent insurrection, defection within Fₑₙfₒᵣcₑ, or external military force capable of enforcing a transition. Kinetic potential in any listed form places the case under the weak form of threat without discharge.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 3 — Kernel-level liberation',
          paragraphs: [
            'The outcome must terminate the prior extraction kernel. The prior Elite’s extraction capacity must fall structurally to zero in the material apparatus, including the plantation, corporation, financial system, or other extraction mechanism, independently of a legal or political face change.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 4 — Durable outcome',
          paragraphs: [
            'The liberation must persist through at least one full threat cycle without new kinetic pressure to maintain it.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Condition 5 — No Elite class substitution',
          paragraphs: [
            'The outcome cannot install a new extraction kernel under a replacement Elite. The Zimbabwe pattern describes kinetic liberation followed by kernel transplant with the extraction topology intact. Falsification requires permanent architectural dismantlement.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'No case in the 1450–2026 dataset satisfies all five conditions. South Africa, Scandinavia, India, and Zimbabwe each fail at least one condition.',
          ],
        },
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Concrete defeat test',
          paragraphs: [
            'A documented society with an operative intra-national racial partition comparable to the American 1705–2026 architecture would falsify the strong form if it permanently dismantled the extraction kernel through moral argument, electoral politics, litigation, or nonviolent civil disobedience while no kinetic threat operated in any form.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Threat without discharge',
          definition:
            'Kinetic potential that operates in the background without overt kinetic action.',
        },
        {
          term: 'Elite class substitution',
          definition:
            'Replacement of one Elite by another while the extraction topology remains intact.',
        },
      ],
    },

    {
      id: 'counterexample-burden',
      title: 'The Counterexample Burden',
      prose: [
        'Both specifications require permanent, kernel-level structural change in a society with an installed racial partition. The framework attributes the empty counterexample set to a self-reinforcing, closed-loop extraction kernel whose Lyapunov stability absorbs perturbations into the system’s energy descent.',
        'The architectural explanation remains a testable hypothesis. It fails when a historical counterexample satisfies the relevant conditions.',
        'No qualifying counterexample has been identified in the 1450–2026 dataset. A critic can defeat either theorem by supplying one case that meets its complete specification.',
      ],
      keyConcepts: [
        {
          term: 'Invariant set',
          definition:
            'The control region within which a non-kinetic intervention is absorbed as a perturbation.',
        },
        {
          term: 'Spanning-tree topology',
          definition:
            'The extraction architecture whose severance would produce the structural change required by the falsification tests.',
        },
      ],
    },
  ],
};

export default apxD;
