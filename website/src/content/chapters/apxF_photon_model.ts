// Appendix F — The Photon Model of Polarizing Information
//
// Source: Paper/chapters_src/28_the_photon_model_of_polarizing_informati.tex
// Adapted prose is derived from that slice only. Equations are lifted verbatim
// from the slice's inventory.
import type { ChapterContent } from '../types';

const apxF: ChapterContent = {
  meta: {
    id: 'apxF',
    slug: 'photon-model',
    number: 27,
    title: 'The Photon Model of Polarizing Information',
    era: 'Reference',
    hook: 'Discrete information packets as carriers of polarization.',
    accentColor: '#64748b',
    heroVisual: {
      kind: 'equation',
      latex: 'P_k = N_{\\gamma} \\cdot E_{\\gamma} = N_{\\gamma} \\cdot h \\nu_k',
      caption: 'Polarizing power expressed as photon count times photon energy.',
    },
  },

  scenes: [
    {
      id: 'quantized-extension',
      title: 'Purpose and Scope',
      prose: [
        'This appendix extends the Interference Engine into a quantized regime. It gives readers a formal model for tracking discrete information packets as carriers of polarization across identity axes.',
        'The extension is speculative and has predictive value as an analogy. Social-media posts remain information packets within the model.',
      ],
      keyConcepts: [
        {
          term: 'Polarizing photon',
          definition:
            'A discrete tweet, meme, short-form video, or algorithmic recommendation carrying a polarization state along one or more identity axes.',
        },
      ],
    },

    {
      id: 'field-to-packets',
      title: 'From Field Power to Individual Exposure',
      prose: [
        'The continuous Interference Engine is a superposition of cultural magnetic fields with time-varying demographic weights. Its power on identity axis k depends on field magnitude and the effective volume of the exposed population.',
        'Physical reach bounded that volume in the analog regime. The digital regime expands it toward the entire network. Quantization distributes the total power across individual exposures.',
      ],
      visual: {
        kind: 'equation',
        latex: 'P_k = \\frac{1}{2\\mu_0} |B_k|^2 \\, V',
        caption:
          'Field power on identity axis k, with V as the effective volume of the exposed population.',
      },
      keyConcepts: [
        {
          term: 'Effective volume',
          definition:
            'The population exposed to the field, bounded by physical reach in the analog regime and approaching the entire network in the digital regime.',
        },
      ],
    },

    {
      id: 'photon-ansatz',
      title: 'The Photon Ansatz',
      prose: [
        'Each polarizing photon carries energy, polarization, propagation velocity, and a motion-dependent existence. These properties define how a packet enters an identity axis, produces a directional effect, travels through the network, and leaves active circulation.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Properties of a polarizing photon',
          paragraphs: [
            'Energy: E gamma equals h times nu. Nu is the refresh or repetition frequency of the axis, and h is the attention-economy constant. High-frequency transphobia cycles in 2023 carry higher photon energy than racial housing covenants operating on decadal cycles.',
            'Polarization: the spin state sigma k belongs to the set minus one, zero, plus one. The states encode Out-group extraction, neutral transmission, and Buffer Class alignment.',
            'Propagation velocity: c effective is network latency. Domestic propagation occurs in milliseconds and global propagation in seconds, which is effectively instantaneous at human perception scales.',
            'No rest mass: the photon exists in motion. Sharing initiates propagation until the packet is absorbed through viewing, processing, or emotional reaction, or decohered by competing signals.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Axis frequency',
          definition:
            'The refresh or repetition frequency that determines photon energy through E gamma equals h times nu.',
        },
        {
          term: 'Spin state',
          definition:
            'The packet state along an identity axis: plus one for Buffer Class alignment, minus one for Out-group extraction, or zero for neutral transmission.',
        },
      ],
    },

    {
      id: 'spectral-density',
      title: 'Spectral Density and Demographic Scale',
      prose: [
        'Total axis power equals photon count multiplied by the energy of each packet. The Engine can therefore redistribute power through photon number and axis frequency.',
        'A major axis such as race has a large population base. The Engine spreads power across many low-energy photons to limit Buffer Class burnout and legitimacy collapse. The resulting field is spatially diffuse.',
        'A minor axis such as transphobia has a population base of approximately 0.6%. Fewer high-energy photons can carry comparable power because patriarchal gender conditioning produces high magnetic susceptibility on this axis.',
      ],
      visual: {
        kind: 'equation',
        latex: 'P_k = N_{\\gamma} \\cdot E_{\\gamma} = N_{\\gamma} \\cdot h \\nu_k',
        caption:
          'Axis power as the product of packet count, the attention-economy constant, and axis frequency.',
      },
      keyConcepts: [
        {
          term: 'Small-demographic anomaly',
          definition:
            'A demographic of approximately 0.6% can command field energy comparable to a demographic of 13% because spectral efficiency decouples field share from population proportion.',
        },
        {
          term: 'Magnetic susceptibility',
          definition:
            'The pre-conditioned responsiveness that allows high-energy photons to achieve deflection with a lower packet count.',
        },
      ],
    },

    {
      id: 'optimization-and-filtering',
      title: 'Spectral Optimization and Counter-Engineering',
      prose: [
        'The Engine selects axis frequency and photon number to maximize deflection per unit cost under a digital budget constraint. Spectral efficiency determines how much field power a demographic receives.',
        'Resistance takes the form of polarization filtering. The Counter-AI attenuates high-frequency photons, rotates identity-axis deflections into class-aligned momentum, and constructively amplifies the class band.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\max_{k, N_{\\gamma}} \\; \\chi_{m,k} \\cdot N_{\\gamma} \\cdot h \\nu_k \\quad \\text{subject to} \\quad C_{\\text{engine}}^{\\text{digital}}(N_{\\gamma}, \\nu_k) \\leq C_{\\text{budget}}',
        caption: 'Deflection maximization under the Engine’s digital budget constraint.',
      },
      keyConcepts: [
        {
          term: 'Frequency-selective attenuation',
          definition:
            'Detection and suppression of packets whose frequency exceeds the natural frequency of organic political discourse, including high-frequency botnet and synthetic-media output.',
        },
        {
          term: 'Polarization rotation',
          definition:
            'Conversion of orthogonal identity deflections into class-aligned momentum by exposing how the Elite benefits from the same resentment.',
        },
        {
          term: 'Coherent amplification',
          definition:
            'Constructive expansion of class-band photon count until class-band power exceeds identity-band power.',
        },
      ],
    },
  ],
};

export default apxF;
