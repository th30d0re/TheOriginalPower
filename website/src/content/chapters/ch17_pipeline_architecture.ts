// Chapter 17 — The Pipeline Architecture: From School-to-Prison to Healthcare
// Denial as Extraction Conduits
//
// Source: Paper/chapters_src/18_the_pipeline_architecture_from_school_to.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch17: ChapterContent = {
  meta: {
    id: 'ch17',
    slug: 'pipeline-architecture',
    number: 17,
    title:
      'The Pipeline Architecture: From School-to-Prison to Healthcare Denial as Extraction Conduits',
    era: 'Conduits',
    hook: 'School-to-prison and healthcare denial as extraction conduits.',
    accentColor: '#3b37c5',
  },

  scenes: [
    {
      id: 'architecture-overview',
      title: 'System Architecture Overview',
      prose: [
        'The extraction algorithm executes through a network of specialized conduits. Each conduit routes educational, nutritional, biological, or medical capacity toward the same extraction sink.',
        'Every pipeline shares four invariant operations: demographic targeting, capacity degradation, revenue extraction, and feedback reinforcement. Geographic and economic proxies establish the input filter. Institutional processing converts depleted capacity into prison labor, treatment fees, pharmaceutical rents, or premium surplus.',
        'The architecture operates across generations. Incarceration removes household income, destabilizes housing and educational access, and returns children to underfunded schools at the same geographic coordinates. The feedback loop preserves the input conditions required for continued throughput.',
      ],
      blocks: [
        {
          kind: 'runtimeLog',
          title: 'PIPELINE ARCHITECTURE v4.1',
          lines: [
            { field: 'System ID', value: 'pipeline_architecture' },
            { field: 'Version', value: 'v4.1' },
            { field: 'Status', value: 'active' },
            {
              field: 'Pipelines',
              value:
                'school_to_prison, food_to_healthcare, commodity_to_healthcare, insurance_denial',
            },
            { field: 'Active Conduits', value: '4' },
            {
              field: 'Throughput Status',
              value: 'All pipelines operating within nominal extraction parameters.',
            },
            {
              field: 'Executing Function',
              value: 'Multi-domain capacity routing toward centralized extraction sink.',
            },
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Pipeline',
          definition:
            'A path with a population at its input, sequential degradation and routing stages, and an institutionally controlled revenue sink at its output.',
        },
        {
          term: 'Feedback reinforcement',
          definition:
            'The process by which extraction recreates the conditions that make the next cycle of extraction possible.',
        },
      ],
    },

    {
      id: 'mechanism-stage-1',
      title: 'Mechanism Stage 1: Zero-Tolerance Policies',
      prose: [
        'The disciplinary shift of the 1990s moved behavioral variance into formal sanction. The Gun-Free Schools Act of 1994 mandated expulsion for firearm possession, and broader interpretations expanded the disciplinary event class. The Columbine event in 1999 accelerated demand for visible security measures.',
        'Zero-tolerance policy raises the sensitivity of the disciplinary filter. Talking back, tardiness, uniform violations, and hallway disruption become inputs for downstream routing. Concentrated deployment in schools serving racialized populations applies a higher gain to the same behavioral signal.',
        'The zero-tolerance coefficient represents that gain. A proportional response has a coefficient of one. The observed architecture assigns a coefficient far above one to racialized students while the buffer population remains near one.',
      ],
      keyConcepts: [
        {
          term: 'Zero-tolerance coefficient',
          definition:
            'The gain applied to ordinary behavioral variance when school policy converts it into formal discipline.',
        },
      ],
    },

    {
      id: 'mechanism-stage-2',
      title: 'Mechanism Stage 2: School Resource Officers',
      prose: [
        'School Resource Officers insert the enforcement class into the educational environment. A citation, summons, or arrest replaces detention, counseling, or a parent conference and transfers the student into criminal processing.',
        'The officer functions as a gateway node between school and the carceral network. Crossing that gateway activates arrest, booking, court fees, probation supervision, juvenile detention, and possible adult incarceration.',
        'The resulting criminal record persists as a state variable. Employment, housing, education, and civil-rights decisions read that record during later routing. Police presence therefore measures the density of infrastructure capable of converting school behavior into durable carceral status.',
      ],
      keyConcepts: [
        {
          term: 'Gateway node',
          definition:
            'An institutional handoff that transfers a student from pedagogical discipline into criminal processing.',
        },
      ],
    },

    {
      id: 'mechanism-stage-3',
      title: 'Mechanism Stage 3: Disparate Discipline',
      prose: [
        'Black students are suspended or expelled at three to four times the rate of white students for identical behavioral inputs. The disparity worsened in 31 states between 2010 and 2020.',
        'The disparate-discipline coefficient acts as an early gain stage. Each unit of behavioral variance produces a larger disciplinary output for a racialized student, so every downstream stage receives an amplified signal.',
        'The disparity persists across school types, income levels, and geographic regions. Its presence in affluent suburban districts identifies an independent racial calibration within the disciplinary architecture.',
      ],
      keyConcepts: [
        {
          term: 'Disparate-discipline coefficient',
          definition:
            'The measurable difference in disciplinary output produced from equivalent behavioral inputs across racial groups.',
        },
      ],
    },

    {
      id: 'mechanism-stage-4',
      title: 'Mechanism Stage 4: Special Education Funneling and Early Tracking',
      prose: [
        'Special-education classification supplies a durable routing flag. Black students, especially boys, receive these classifications disproportionately and enter alternative disciplinary pathways with elevated rates of criminal-justice contact.',
        'The Individuals with Disabilities Education Act establishes protections, while the pipeline reads classification records as indicators for enhanced scrutiny. Individualized Education Programs, counseling referrals, and behavioral intervention plans persist in electronic records available to later educators and officers.',
        'Early tracking gives the pipeline memory. A student labeled disruptive at age eight receives closer monitoring at age twelve, a lower suspension threshold at age fourteen, and more frequent arrest at age sixteen. Each decision inherits the accumulated state of the decisions before it.',
      ],
      keyConcepts: [
        {
          term: 'Tracking coefficient',
          definition:
            'The memory function through which an early classification conditions later disciplinary routing.',
        },
      ],
    },

    {
      id: 'mechanism-stage-5',
      title: 'Mechanism Stage 5: Property-Tax Funding Architecture',
      prose: [
        'Local property taxes supply approximately 45 percent of United States K–12 education funding. San Antonio Independent School District v. Rodriguez upheld this architecture in 1973, preserving the link between residential segregation, tax base, and school resources.',
        'Per-pupil spending gaps reach three to one between wealthy and poor districts within the same state. The American Society of Civil Engineers assigned school infrastructure a D+ grade in 2021 and measured an 85-billion-dollar national funding gap concentrated in high-poverty districts.',
        'Deteriorating schools depress surrounding property values. Lower values shrink the tax base, reduce school funding, and defer further maintenance. The stage therefore supplies a positive feedback loop that concentrates depletion in the same neighborhoods across successive cycles.',
      ],
      keyConcepts: [
        {
          term: 'Depletion cascade',
          definition:
            'The feedback sequence linking weak tax bases, underfunded schools, deteriorating infrastructure, and further property-value decline.',
        },
      ],
    },

    {
      id: 'pipeline-throughput',
      title: 'The Five Stages Multiply',
      prose: [
        'The school-to-prison conduit combines disparate discipline, police presence, zero-tolerance severity, early tracking, and lead-induced behavioral flagging. Each factor increases the throughput applied to racialized students.',
        'Multiplication makes combined exposure decisive. A Black student in a high-officer school under zero-tolerance policy, tracked into special education, and exposed to environmental lead receives the product of all five amplification factors.',
        'The output enters a revenue system. Mass incarceration costs an estimated 182 billion dollars per year. New York state and local governments collected 1.21 billion dollars in criminal fines and fees in 2018, while 43 states and the District of Columbia suspend driver’s licenses for unpaid court debt.',
        'Carceral labor supplies a secondary extraction layer at wages from 14 to 63 cents per hour. Black Americans constitute 13 percent of the population and 38 percent of the prison population, linking the demographic filter to the labor output.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\Phi_{\\text{s2p}}(t) = D_{\\text{disparate}} \\cdot P_{\\text{police}} \\cdot Z_{\\text{zero-tol}} \\cdot T_{\\text{tracking}} \\cdot L_{\\text{lead}}(t)',
            label: 'eq. pipeline-throughput',
            caption: 'The multiplicative throughput of the school-to-prison pipeline.',
          },
        },
        {
          kind: 'insight',
          heading: 'The School-to-Prison Manufacturing Theorem',
          paragraphs: [
            'Five sequential stages manufacture carceral input: zero-tolerance criminalization, law-enforcement insertion, disparate discipline, tracking, and property-tax depletion. Each mechanism amplifies the others, and the combined output routes capacity into carceral extraction.',
          ],
        },
      ],
    },

    {
      id: 'lead-cascade',
      title: 'The Property-Tax → Lead → Discipline → Prison Cascade',
      prose: [
        'The funding stage connects to an environmental cascade. Redlining established a spatial filter in the 1930s. Property-tax funding translated that filter into depleted school budgets, deferred maintenance, old plumbing, lead exposure, disciplinary capture, and incarceration.',
        'The Government Accountability Office reported in 2018 that 43 percent of school districts had tested their water for lead. Among the districts that tested, 37 percent found elevated levels. School exclusion from public-water-system classification under the Safe Drinking Water Act leaves testing, reporting, and remediation outside the municipal requirements.',
        'Lead performs biological pre-processing. Adjudicated delinquents had mean bone-lead levels of 11.0 parts per million, compared with 1.5 parts per million in controls, and were four times more likely to exceed 25 parts per million. Each five-microgram-per-deciliter increase in prenatal blood lead produced a relative risk of 1.70 for violent-crime arrests.',
        'Each stage has a separate administrative owner and preserves the output of the stage before it. Distributed ownership gives the cascade multiple political constituencies, distinct reform pathways, and no central control point.',
      ],
      visual: {
        kind: 'equation',
        latex:
          'H_{\\text{cascade}}(s) = H_{\\text{redline}}(s) \\cdot H_{\\text{funding}}(s) \\cdot H_{\\text{infrastructure}}(s) \\cdot H_{\\text{lead}}(s) \\cdot H_{\\text{discipline}}(s) \\cdot H_{\\text{incarceration}}(s)',
        label: 'eq. cascade-transfer',
        caption: 'The cascade transfer function preserves and amplifies the routed signal.',
      },
    },

    {
      id: 'food-to-healthcare',
      title: 'The Food-to-Healthcare Pipeline',
      prose: [
        'Historical redlining geography correlates with present food-desert and food-swamp geography. Fast-food and processed-food concentration raises cumulative metabolic load while depressed spending power reduces the viability of fresh-food retail.',
        'The resulting obesity, type 2 diabetes, and hypertension create continuous utilization over decades. A single diabetic patient generates an estimated 200,000 to 300,000 dollars in lifetime medical expenditure.',
        'Dialysis forms a terminal extraction node. Each patient generates approximately 90,000 to 100,000 dollars in annual treatment revenue and requires treatment three times per week for life. Diabetes supplies the leading cause of kidney failure and connects constrained food environments to recurring billed treatment.',
        'The food-health extraction rate multiplies cheap-calorie availability, nutritional deficit, healthy-food access cost, and medical-intervention revenue. Earlier chronic-disease onset extends the period of recurring extraction.',
      ],
    },

    {
      id: 'commodity-to-healthcare',
      title: 'The Commodity-to-Healthcare Pipeline',
      prose: [
        'Consumer products marketed for menstruation, infant feeding, hygiene, and food preparation carry chronic toxicant exposure through repeated use. Biological necessity produces captive demand and fixes the frequency term in the exposure integral.',
        'A 2024 study tested 30 tampons from 14 brands. Every one of the 16 metals sought appeared in at least one sample, and 12 appeared in every sample above the detection limit. Estimated lifetime use reaches approximately 11,000 tampons.',
        'Daily hygiene and infant products extend the exposure architecture. Independent testing in 2025 found detectable lead, arsenic, mercury, or cadmium in 90 percent of 51 toothpaste brands. Testing of glass baby bottles found detectable lead in printed designs on 91 percent of samples, with at least 34 percent reaching levels high enough to warrant recall.',
        'The commodity exposure integral accumulates toxicant concentration, route-specific absorption, and usage frequency across a lifetime. Product purchase transfers capital at entry, and downstream medical intervention converts biological damage into a second revenue stream.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'E_{\\text{commodity}} = \\sum_{\\text{product}} \\left( \\int_{0}^{\\text{lifetime}} c_{\\text{toxicant}} \\cdot a_{\\text{absorption}} \\cdot f_{\\text{frequency}} \\, dt \\right)',
            label: 'eq. commodity-exposure',
            caption: 'Lifetime exposure accumulated across products and routes.',
          },
        },
        {
          kind: 'insight',
          heading: 'The Necessity-to-Extraction Pipeline Theorem',
          paragraphs: [
            'Necessary products can function as chronic exposure systems. Captive demand sustains the product market, while downstream illness sustains medical extraction. The same consumer funds both stages.',
          ],
        },
      ],
    },

    {
      id: 'healthcare-denial',
      title: 'Healthcare Denial as Kinetic Class Warfare',
      prose: [
        'Claim denial transfers treatment cost and mortality risk to the patient while the insurer retains premium capital. UnitedHealthcare denies approximately 33 percent of claims. Automated adjudication increases throughput by applying historical denial patterns with fewer human reviewers.',
        'The medical-loss-ratio requirement directs insurers to spend at least 80 to 85 percent of premium revenue on medical claims. Profit remains a percentage of the premium base, so higher healthcare prices support higher premiums and larger absolute returns at the same margin.',
        'In December 2024, UnitedHealthcare chief executive Brian Thompson was killed. The manuscript reads the substantial online celebration as a diagnostic signal of system stress and explicitly withholds endorsement of the act. The response recorded a population-level perception of healthcare denial as organized violence.',
        'The broader output appears in mortality and debt. Pre-ACA estimates attributed 45,000 deaths per year to lack of insurance, and medical debt affects approximately 100 million Americans. More than 150 rural hospitals have closed since 2010, expanding emergency-care deserts.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\mathcal{E}_{\\text{denial}} = N_{\\text{claims}} \\cdot R_{\\text{denial}} \\cdot C_{\\text{treatment\\_cost}} \\cdot \\Delta_{\\text{mortality}}',
            label: 'eq. denial-extraction',
            caption: 'Denied volume converts retained treatment cost into transferred mortality risk.',
          },
        },
        {
          kind: 'insight',
          heading: 'The Healthcare Denial as Class Warfare Theorem',
          paragraphs: [
            'Mortality-producing claim denial generates a system alarm when extraction exceeds biological and psychological tolerance. Public rage supplies a diagnostic reading of that threshold.',
          ],
        },
      ],
    },

    {
      id: 'unified-pipeline',
      title: 'The Unified Pipeline Model',
      prose: [
        'The four conduits route distinct forms of capacity toward a shared extraction sink. School discipline routes educational and labor capacity. Food environments route nutritional capacity. Commodities route biological capacity. Healthcare denial routes wealth and life-years.',
        'Cross-pipeline interactions raise the total output. Lead exposure adds healthcare utilization. Food-swamp dietary patterns increase cardiac and orthopedic claims. Commodity toxicants increase downstream pharmaceutical demand. The additive equation therefore supplies a lower bound when these interactions amplify one another.',
        'The architecture has fault tolerance. Obstruction in one conduit leaves the remaining conduits active, and the system reroutes extraction through the available modules. Effective intervention must alter targeting, degradation, extraction, and feedback across the architecture.',
        'The final measure is excess mortality across race, income, geography, and time. The pipeline converts institutional routing into quantifiable lost life-years and preserves the conditions that reproduce those losses.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\mathcal{E}_{\\text{pipeline}}(t) = \\mathcal{E}_{\\text{s2p}}(t) + \\mathcal{E}_{\\text{food-health}}(t) + \\mathcal{E}_{\\text{commodity}}(t) + \\mathcal{E}_{\\text{healthcare}}(t)',
            label: 'eq. unified-pipeline',
            caption: 'Total extraction across the four active conduits.',
          },
        },
        {
          kind: 'insight',
          heading: 'The Mortality Extraction Theorem',
          paragraphs: [
            'The pipeline extracts labor, capital, and years of life. Excess deaths measure the combined output of educational, nutritional, commodity, and medical routing.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Pipeline resilience',
          definition:
            'The modular capacity to preserve total extraction by routing activity through conduits that remain available.',
        },
      ],
    },
  ],
};

export default ch17;
