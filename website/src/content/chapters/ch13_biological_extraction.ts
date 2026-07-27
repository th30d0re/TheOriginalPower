// Chapter 13 — The Biological Extraction Kernel: Environmental Racism as Systemic Toxicity (1879–Present)
//
// Source: Paper/chapters_src/14_the_biological_extraction_kernel_environ.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory.
import type { ChapterContent } from '../types';

const ch13: ChapterContent = {
  meta: {
    id: 'ch13',
    slug: 'biological-extraction',
    number: 13,
    title:
      'The Biological Extraction Kernel: Environmental Racism as Systemic Toxicity (1879–Present)',
    era: '1879–Present',
    hook: 'Environmental racism as systemic toxicity, and the lead-to-prison feedback loop.',
    accentColor: '#9c3bcd',
    heroVisual: {
      kind: 'equation',
      latex: '\\beta_{\\text{bio}}(t) = E(t) \\cdot T(t) \\cdot A(t),',
      label: 'The biological depletion coefficient',
    },
  },

  scenes: [
    {
      id: 'biological-capacity',
      title: 'A Third Extraction Plane',
      blocks: [
        {
          kind: 'runtimeLog',
          title: 'biological_extraction_kernel',
          lines: [
            { field: 'SYSTEM ID', value: 'biological_extraction_kernel' },
            { field: 'VERSION', value: 'v3.2' },
            { field: 'STATUS', value: 'active' },
            { field: 'DEPLOYMENT', value: '1879–present' },
            { field: 'TARGET', value: 'biological_capacity(O_racialized)' },
            { field: 'METHOD', value: 'environmental_toxicity_vector' },
            {
              field: 'OUTPUT',
              value: 'neural_degradation, behavioral_routing, carceral_input',
            },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The extraction kernel operates on labor output and accumulated capital. Environmental toxicity adds biological capacity as a third plane: neural tissue, endocrine function, immune competence, reproductive viability, and lifespan become inputs to the degradation trajectory.',
            'Toxicants degrade the production function for every other capacity. Lead-induced cognitive impairment reduces labor value. Attention deficits reduce the accumulation of human capital. Cardiovascular damage reduces the viable years available for intergenerational resource transmission.',
            'The standard capacity equation gives each generation a reduced operational baseline through the pressure function and the extraction efficiency coefficient. The biological extension places physiological vulnerability inside the same recursive architecture.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'O_{\\text{bio}}(t) = O_{\\text{bio}}(t-1) \\cdot \\bigl(1 - \\alpha \\cdot P(t) - \\beta_{\\text{bio}}(t)\\bigr).',
            label: 'Biological compounding model',
            caption:
              'Environmental toxicity enters the recursive operator as a persistent degradation term.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Biological capacity',
          definition:
            'The physiological substrate on which labor output, learning, resource transmission, and collective function depend.',
        },
        {
          term: 'Persistent degradation',
          definition:
            'A toxicant load carried inside a recursive operator, reducing the operational baseline inherited by each generation.',
        },
      ],
    },

    {
      id: 'depletion-coefficient',
      title: 'The Biological Depletion Coefficient',
      prose: [
        'The biological depletion coefficient multiplies three channels: environmental toxicant concentration, cumulative exposure time, and age-dependent absorption. The concentration vector combines atmospheric loading from traffic and industry, waterborne loading from aging infrastructure, particulate loading from paint, and product-level loading.',
        'Exposure time encodes cumulative load. In districts with leaded water infrastructure, school exposure peaks on Monday mornings after water has remained stagnant in pipes over the weekend. Bone lead sequestration creates a secondary reservoir that remobilizes during pregnancy and lactation.',
        'Absorption peaks during developmental windows. Children under six absorb ingested lead at rates four to five times higher than adults. Gastrointestinal absorption reaches up to 50% in early childhood, compared with 10% in adults.',
      ],
      visual: {
        kind: 'equation',
        latex: '\\beta_{\\text{bio}}(t) = E(t) \\cdot T(t) \\cdot A(t),',
        label: 'Biological depletion coefficient',
        caption:
          'Concentration, duration, and absorption combine multiplicatively.',
      },
      deepDive: {
        label: 'The cumulative-load mechanism',
        passages: [
          {
            paragraphs: [
              'The concentration vector E(t) is a composite of atmospheric loading from traffic and industry, waterborne loading from aging infrastructure, particulate loading from paint, and product-level loading. Each sub-vector has distinct spatial and temporal signatures. The composite E(t) is therefore a superposition of waveforms, each with its own decay or growth constant.',
              'The exposure time function T(t) encodes cumulative load. For school-age children in districts with leaded water infrastructure, exposure peaks on Monday mornings when stagnant water has accumulated in pipes over the weekend. The age-dependent absorption rate A(t) peaks during the prenatal period and early childhood (gastrointestinal absorption up to 50% compared with 10% in adults), declining asymptotically afterward, though bone lead sequestration creates a secondary reservoir that remobilizes during pregnancy and lactation.',
            ],
          },
        ],
      },
    },

    {
      id: 'lead-crime-calibration',
      title: 'Lead Exposure on a Delayed Schedule',
      prose: [
        'The lead–crime literature calibrates the developmental delay. Nevin found that childhood gasoline lead exposure explains 90% of the variation in U.S. violent crime rates from 1960 to 1998, with a 23-year lag. Paint lead trends from 1879 to 1938 explain 70% of variation in U.S. murder rates from 1900 to 1960, with a 21-year lag.',
        'Reyes attributed a 56% drop in violent crime during the 1990s to reductions in lead exposure during the 1970s. Higney, Hanley, and Moro synthesized 542 estimates from 24 studies and concluded that lead abatement accounted for 7–28% of the fall in U.S. homicide.',
        'The latency integral places toxicant inputs and behavioral outputs decades apart. Population density amplifies the delayed input, and socioeconomic stress multiplies it. The delay weakens contemporaneous causal visibility while biological damage continues to accumulate.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\mathrm{Crime}(t) = \\int \\mathrm{Pb}(t - \\tau_{\\text{age}}) \\cdot D(\\text{population\\_density}) \\cdot S(\\text{socioeconomic\\_stress}) \\, d\\tau,',
        label: 'Lead–crime latency',
        caption: 'The developmental lag is 21–23 years.',
      },
      keyConcepts: [
        {
          term: 'Developmental latency',
          definition:
            'The 21–23-year interval between toxicant exposure and the measured behavioral output.',
        },
      ],
    },

    {
      id: 'property-tax-loop',
      title: 'Property Tax, Lead, Prison',
      prose: [
        'San Antonio Independent School District v. Rodriguez (1973) instantiated a national funding allocation keyed to local property valuations. Redlining had already depressed property values in racialized neighborhoods. The property-tax interface propagated that condition into per-pupil spending and deferred infrastructure maintenance.',
        'Infrastructure age determines the material composition of plumbing, paint, and the ambient environment. HOLC grades assigned the lowest classifications to Black and integrated neighborhoods, shaping mortgage availability and infrastructure replacement. Seventy years later, the same neighborhoods contained the oldest housing stock and the highest lead levels.',
        'The loop couples four state variables: redlining, property value, the funding transfer function, and infrastructure degradation. Each module passes its output to the next. Toxicant delivery emerges from the continued operation of the linked allocation system.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              'L_{\\text{loop}}(t) = R_{\\text{redline}} \\cdot V_{\\text{property}}(t) \\cdot F_{\\text{funding}} \\cdot I_{\\text{infrastructure}}(t),',
            label: 'Property-tax lead feedback loop',
            caption:
              'Redlining supplies the initial condition; fiscal allocation and infrastructure age propagate it.',
          },
        },
        {
          kind: 'insight',
          heading: 'The Property-Tax Lead Feedback Theorem',
          paragraphs: [
            'Redlining depresses biological capacity through the infrastructure toxicity vector. The property-tax interface concentrates the oldest, most lead-loaded built environment in jurisdictions with the least fiscal capacity for remediation.',
            'The loop coefficient functions as a biological degradation operator within a fiscal allocation mechanism. Its continued operation depends on the property-tax interface and the spatial sorting of populations by race and wealth.',
          ],
        },
      ],
      deepDive: {
        label: 'The coupled allocation system',
        passages: [
          {
            paragraphs: [
              'The spatial correlation between redlining maps and present-day blood lead levels is not coincidental. HOLC graded neighborhoods by racial composition, assigning the lowest grades to Black and integrated areas, determining mortgage availability and infrastructure replacement. Seventy years later, the same neighborhoods exhibit the oldest housing stock and highest lead levels, demonstrating that R_redline operates as a persistent state variable.',
            ],
          },
        ],
      },
    },

    {
      id: 'school-to-carceral-routing',
      title: 'School Water and Carceral Routing',
      prose: [
        'The Government Accountability Office reported in 2018 that 43% of U.S. school districts had tested drinking water for lead. Among the districts that tested, 37% found elevated levels. The Safe Drinking Water Act leaves school water outside EPA regulation because schools are not classified as public water systems. Testing remains voluntary in most states, and remediation remains unfunded.',
        'Schools built before 1986 contain lead solder and brass fixtures. First-draw concentrations rise after weekends as stagnant water leaches from aging pipes into drinking fountains. The fiscal architecture makes replacement least likely in redlined districts.',
        'Lead mimics calcium, crosses the immature blood–brain barrier, and damages the prefrontal cortex. The source records lowered IQ at 0.5 points per 1 microgram per deciliter, attention deficits, impulsivity, and aggression. School discipline systems classify these behavioral outputs as misconduct and activate zero-tolerance protocols.',
        'Needleman found adjudicated delinquents four times more likely to have bone lead levels above 25 ppm. Wright and colleagues associated each 5 micrograms per deciliter increase in prenatal blood lead with RR=1.70 for violent-crime arrests. The sequence runs from redlined geography through property value, school funding, infrastructure, exposure, injury, discipline, and juvenile justice entry.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'The output of neurotoxic injury becomes the input to disciplinary and carceral routing.',
        },
      ],
      keyConcepts: [
        {
          term: 'Behavioral routing',
          definition:
            'The classification of neurotoxic symptoms as misconduct within zero-tolerance disciplinary systems.',
        },
      ],
    },

    {
      id: 'racial-exposure-gradient',
      title: 'The Environmental Vector',
      prose: [
        'Zoning ordinances, highway placement, housing policy, and industrial siting distribute toxicant loads across space. During the 1970s, Black children encountered atmospheric lead concentrations approximately fifteen times higher than rural ambient levels. From 1966 through 1974, 62% of Black children under six lived in central cities, compared with 24% of white children.',
        'Air lead beside heavy traffic corridors reached as much as fifteen times the city average. Cities with populations above one million recorded ambient concentrations twice those of smaller cities. Black families occupied 56% of substandard central-city housing in 1960. Housing built before 1940 had an approximately 80% probability of containing lead paint; housing built from 1940 through 1959 had a 46% probability.',
        'Local calibrations reproduce the gradient. Prior to Katrina, 93.5% of children in New Orleans had blood lead at or above 2 micrograms per deciliter. Black residents averaged 5.4 micrograms per deciliter and white residents averaged 4.4. In East and Central Flint, African American populations comprised 76.8% and 67% of residents in areas with the highest water lead levels.',
        'Mielke and Zahran found that a 1% increase in air lead released 22 years earlier produced a 0.46% increase in the present aggravated-assault rate, with a 95% confidence interval of 0.28–0.64. Their model explained 90% of variation across six major U.S. cities.',
      ],
      deepDive: {
        label: 'Case study calibrations',
        passages: [
          {
            paragraphs: [
              'The New Orleans case study provides a high-resolution calibration. Prior to Katrina, 93.5% of children had blood lead at or above 2 μg/dL. Black residents averaged 5.4 μg/dL versus 4.4 for white residents, and were twice as likely to live in high-lead areas.',
              'In St. Louis, aggregate blood lead at the census-tract level predicts violent crime with risk ratios of 1.03 per unit increase for firearm crimes, assault, robbery, and homicide. In Flint, African American populations in East and Central Flint comprised 76.8% and 67% of residents in areas with the highest water lead levels.',
            ],
          },
        ],
      },
    },

    {
      id: 'product-level-granularity',
      title: 'Toxicity at Product-Level Granularity',
      prose: [
        'Consumer products deliver chronic micro-doses through routine ingestion and dermal exposure. Independent testing in 2025 found detectable lead, arsenic, mercury, or cadmium in 90% of 51 common toothpaste brands. More than 67 toothpaste and tooth-powder products were tested, and eight returned non-detect results for all four metals.',
        'Shearston and colleagues tested 30 tampons from 14 brands and 18 product lines in 2024. Twelve of sixteen metals appeared in 100% of samples above the method detection limit. Geometric means measured lead at 120 ng/g, cadmium at 6.74 ng/g, and arsenic at 2.56 ng/g; arsenic appeared in 95% of samples.',
        'Between 52% and 86% of U.S. menstruators use tampons, with estimated lifetime use of approximately 11,000. The 2024 study arrived ninety years after the tampon was patented in 1933. Heavy-metal testing remains absent from FDA requirements for menstrual products, and ISO TC 338 remains in development.',
        'Infant products and cookware extend the domestic vector. Tests in 2024 found detectable lead in painted prints on 91% of glass baby bottles, with at least 34% reaching recall levels. A 2024 enamelware test measured lead at 16–60 ppm, antimony at 192–1,686 ppm, and arsenic at 31 ppm on the food-contact surface.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'The Menstrual Extraction Integral',
          paragraphs: [
            'Products designed for biological necessity carry chronic toxicant loads through minimally regulated materials. The lifetime integral accumulates time-varying metal concentrations across the reproductive lifespan.',
            'The privatized and gendered exposure channel reduces regulatory visibility. The absence of testing mandates for ninety years permits exposure through a highly absorptive mucosal environment.',
          ],
        },
      ],
      visual: {
        kind: 'equation',
        latex:
          'M_{\\text{lifetime}} = \\int_{0}^{T} \\sum_{\\text{metal}} c_{\\text{metal}}(t) \\cdot a_{\\text{absorption}} \\, dt,',
        label: 'Lifetime menstrual exposure',
        caption:
          'Metal concentration, absorption efficiency, and reproductive lifespan determine cumulative load.',
      },
    },

    {
      id: 'total-extraction',
      title: 'The Expanded Accounting',
      prose: [
        'The biological channel adds degradation of neural development, reproductive health, immune function, and lifespan to the accounting of labor and capital extraction. Physiological capacity supplies the substrate for both economic channels.',
        'Lead persists in consumer products, school plumbing, and ceramic glazes. Testing remains voluntary across many product categories, recalls follow detected exposure, and acute poisoning receives greater regulatory visibility than chronic micro-dose degradation.',
        'The delivery vector changes across paint, gasoline, school water, toothpaste, tampons, and baby bottles. The recursive degradation term, the property-tax loop, and the developmental delay preserve the architecture across those interfaces.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\mathcal{E}_{\\text{total}}(t) = \\mathcal{E}_{\\text{labor}}(t) + \\mathcal{E}_{\\text{capital}}(t) + \\mathcal{E}_{\\text{biological}}(t),',
            label: 'Total extraction rate',
            caption:
              'Biological depletion joins labor and capital in the extraction accounting.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Biological extraction channel',
          definition:
            'The degradation of physiological capacity through environmental and consumer-product toxicant vectors.',
        },
        {
          term: 'Transferable kernel',
          definition:
            'A persistent extraction architecture whose delivery vector changes while its recursive operation continues.',
        },
      ],
    },
  ],
};

export default ch13;
