// Chapter 18 — The Spectral Carrier: Electoral Cycles and the Interference Engine
//
// Source: Paper/chapters_src/19_the_spectral_carrier_electoral_cycles_an.tex
// Adapted prose is derived from that slice only. Deep-dive passages are
// verbatim manuscript text with LaTeX markup stripped. Equations are lifted
// verbatim from the slice's inventory (see the eq: labels noted per block).
import type { ChapterContent } from '../types';

const ch18: ChapterContent = {
  meta: {
    id: 'ch18',
    slug: 'spectral-carrier',
    number: 18,
    title: 'The Spectral Carrier: Electoral Cycles and the Interference Engine',
    era: 'Electoral Cycles',
    hook: 'Electoral cycles as a carrier wave, and the interference engine that rides it.',
    accentColor: '#3572ae',
    heroVisual: {
      kind: 'interference',
      caption:
        'Electoral timing supplies the carrier while demographic field weights disperse class-solidarity phase.',
    },
  },

  scenes: [
    {
      id: 'phase-locked-hypothesis',
      title: 'The Phase-Locked Hypothesis',
      prose: [
        'This chapter treats political-attention time series as signals. Its empirical test asks whether identity-band discourse carries a phase-locked periodicity at the frequency of the electoral cycle.',
        'The Interference Engine monitors class-coherence threat and shifts the demographic weights of cultural magnetic fields. Its spectral objective drives class-band power below the crash threshold while routing attentional energy into the identity band.',
        'The framework predicts a periodic identity-band signal synchronized to the electoral clock. The corresponding class-band signal should remain absent or comparatively flat at the same frequency.',
      ],
      blocks: [
        {
          kind: 'formal',
          variant: 'definition',
          label: 'Epistemological Status of This Chapter',
          paragraphs: [
            'The chapter presents an empirical validation of the interference-engine formalism. It assigns confidence tiers and falsification criteria to claims drawn from political-attention time series.',
          ],
        },
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              '\\hat{S}_{\\text{total}}(f,t) = \\hat{S}_{\\text{class}}(f,t) + \\hat{S}_{\\text{identity}}(f,t).',
            label: 'eq. 21.1',
            caption:
              'The Engine redistributes the total political signal across class and identity bands.',
          },
        },
      ],
      keyConcepts: [
        {
          term: 'Spectral carrier',
          definition:
            'A periodic signal at an electoral frequency concentrated in the identity band.',
        },
        {
          term: 'Class-coherence threat',
          definition:
            'The monitored quantity that rises as constructive interference develops between the Buffer Class and the Out-group.',
        },
      ],
      deepDive: {
        label: 'The chapter’s empirical claim',
        passages: [
          {
            paragraphs: [
              'This chapter is an empirical validation of the interference-engine formalism developed in Chapter (ref). It treats political-attention time series as signals and applies spectral analysis to test whether the Interference Engine imposes a phase-locked periodicity on identity-band discourse at the frequency of the electoral cycle. All claims are assigned confidence tiers and falsification criteria consistent with the Empirical Methodology chapter (p. (ref)).',
            ],
          },
        ],
      },
    },

    {
      id: 'phase-dispersion',
      title: 'The Phase-Dispersion Operator',
      prose: [
        'The phase-dispersion operator measures how completely political energy has been distributed across competing identity conflicts. Each identity axis contributes a phase angle to the population-level signal.',
        'A value approaching one marks maximal phase dispersion across the active axes. Class solidarity then loses the coherent amplitude required to cross the crash threshold.',
        'Electoral synchronization makes the hypothesis testable. The expected modulation follows fixed electoral periods, which permits a frequency-domain search for concentrated power.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\Phi_{\\text{load}}(t) = 1 - \\left| \\frac{1}{N} \\sum_{j=1}^{N} e^{i\\phi_j(t)} \\right|.',
        label: 'eq. 21.2',
        caption:
          'Phase loading rises as the identity-axis phases lose collective alignment.',
      },
      keyConcepts: [
        {
          term: 'Phase loading',
          definition:
            'The dispersion of class-solidarity phase angles across multiple identity axes.',
        },
        {
          term: 'Constructive interference',
          definition:
            'Coherent alignment between the Buffer Class and the Out-group that raises class-band amplitude.',
        },
      ],
      deepDive: {
        label: 'Six predictions and their failure conditions',
        passages: [
          {
            heading: 'Predictions',
            paragraphs: [
              'The power spectral density of identity-band language in the Congressional Record shows a peak at the 4-year presidential cycle frequency (f = 0.25 cyc/yr).',
              'The power spectral density of identity-band language shows elevated power at the 2-year midterm cycle frequency (f = 0.50 cyc/yr).',
              'The power spectral density of class-band language is flat or 1/f at the 4-year and 2-year frequencies; it does not exhibit a corresponding peak.',
              'The ratio of identity-band power to class-band power at f = 0.25 cyc/yr is significantly greater than 1 (> 2.0).',
              'In the time domain, identity-band word frequencies are higher in presidential election years than in non-election years.',
              "Parseval's theorem is satisfied: the total energy in the time-domain signal equals the total energy in the frequency-domain representation.",
            ],
          },
          {
            heading: 'Falsification',
            paragraphs: [
              'Falsification criteria: If P1 and P4 fail—if the identity band shows no 4-year peak or if the identity/class ratio at 4 years is ≤ 1.2—the interference-engine spectral hypothesis is falsified for the Congressional Record substrate. If P3 fails—if the class band shows a 4-year peak of comparable magnitude—the prediction that the Engine selectively amplifies identity while suppressing class is falsified. If P6 fails, the spectral computation contains a methodological error.',
            ],
          },
        ],
      },
    },

    {
      id: 'signal-construction',
      title: 'Building the Two Signals',
      prose: [
        'The primary dataset is the U.S. Congressional Record, the official record of congressional floor speeches and debates. The analysis covers 1965–2024, producing 60 annual observations from GovInfo bulk XML downloads.',
        'Annual volumes were concatenated and counted through two keyword baskets. The class basket tracks economic-extraction discourse through terms including union, strike, labor, wages, collective bargaining, pension, income inequality, and wealth gap. The identity basket tracks status-wage discourse through terms including race, racism, gender, immigration, religion, sexuality, abortion, affirmative action, border, and deportation.',
        'The count in each basket becomes a share of the combined attention signal. The two shares sum to one by construction.',
      ],
      blocks: [
        {
          kind: 'visual',
          spec: {
            kind: 'equation',
            latex:
              's_{\\text{class}}(t) = \\frac{C(t)}{C(t) + I(t)}, \\qquad s_{\\text{identity}}(t) = \\frac{I(t)}{C(t) + I(t)}.',
            label: 'eq. 21.3',
            caption: 'Annual class-band and identity-band attention shares.',
          },
        },
        {
          kind: 'insight',
          heading: 'Exact alignment at the target carrier',
          paragraphs: [
            'Annual sampling places the 4-year presidential cycle at 0.25 cycles per year. Across 60 years, that frequency lands exactly on FFT bin 15. The 6-year Senate cycle lands on bin 10.',
            'The 2-year midterm cycle lands at the Nyquist limit on bin 30. The chapter therefore treats the annual estimate at that frequency with caution.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Sampling rate',
          definition:
            'One annual observation per year in the Congressional Record dataset.',
        },
        {
          term: 'Nyquist limit',
          definition:
            'The 0.5-cycle-per-year boundary imposed by annual sampling.',
        },
      ],
      deepDive: {
        label: 'Why the annual series resolves the carrier',
        passages: [
          {
            heading: 'Why Annual Sampling Is Sufficient for the 4-Year Carrier',
            paragraphs: [
              'The 4-year presidential cycle (T = 4 yr) corresponds to f = 0.25 cyc/yr. With N = 60 years, this frequency falls exactly on FFT bin 15: f_k = k/N implies k = f_k · N = 0.25 × 60 = 15.',
              'The 6-year Senate cycle (f = 0.1667 cyc/yr) falls exactly on bin 10. These are not interpolated estimates; they are exact frequency-bin alignments, giving the FFT maximum resolution at the target frequencies. The 2-year midterm cycle (f = 0.50 cyc/yr) falls at the Nyquist limit (bin 30) and is therefore reported with appropriate caution. A quarterly extraction pipeline using the free GovInfo API has been constructed (see Section (ref)) to raise the Nyquist limit to 2.0 cyc/yr and resolve the 2-year cycle cleanly.',
            ],
          },
        ],
      },
    },

    {
      id: 'spectral-estimation',
      title: 'Turning Annual Counts into Spectral Power',
      prose: [
        'The primary estimator applies a discrete Fourier transform to linearly detrended absolute word-frequency series. Detrending removes secular drift before the transformation.',
        'The 4-year and 6-year targets align with integer frequency bins. This alignment eliminates spectral leakage at those frequencies and gives the FFT periodogram primary status in the analysis.',
        'Welch’s method supplies a robustness check through Hann-windowed averaged periodograms. Segment lengths of 20 and 12 produce limited independent segments, so the smoother estimate carries high variance and reduced frequency resolution.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\hat{X}[k] = \\sum_{n=0}^{N-1} x[n] \\, e^{-j 2\\pi k n / N}, \\qquad k = 0, 1, \\ldots, N-1.',
        label: 'eq. 21.4',
        caption: 'The discrete Fourier transform used by the primary estimator.',
      },
      keyConcepts: [
        {
          term: 'FFT periodogram',
          definition:
            'The primary estimate of power at each positive frequency after linear detrending.',
        },
        {
          term: 'Welch’s method',
          definition:
            'A Hann-windowed averaged periodogram used as a robustness check.',
        },
      ],
      deepDive: {
        label: 'Estimator details',
        passages: [
          {
            heading: 'FFT Periodogram',
            paragraphs: [
              'The discrete Fourier transform of the linearly detrended absolute word-frequency time series was computed via:',
              'Linear detrending was applied to remove secular drift before transformation. The FFT is the primary estimator because the target frequencies (4-year and 6-year cycles) align exactly with integer frequency bins, eliminating spectral leakage.',
            ],
          },
          {
            heading: "Welch's Method",
            paragraphs: [
              "Welch's averaged periodogram with a Hann window was computed at two segment lengths (n_perseg = 20 and n_perseg = 12) to test stability across the frequency-resolution versus variance-reduction tradeoff. With N = 60, these segment lengths yield 3–5 and 5–9 independent segments, respectively. Welch's method is reported as a robustness check but is not the primary estimator due to limited segment count.",
            ],
          },
        ],
        equations: [
          {
            latex:
              '\\text{PSD}[k] = \\frac{|\\hat{X}[k]|^2}{N}, \\qquad k = 1, 2, \\ldots, N/2.',
            label: 'eq. 21.5',
          },
          {
            latex:
              'C_{xy}(f) = \\frac{|S_{xy}(f)|^2}{S_{xx}(f) \\, S_{yy}(f)},',
            label: 'eq. 21.6',
          },
        ],
      },
    },

    {
      id: 'four-year-carrier',
      title: 'The Four-Year Carrier',
      prose: [
        'The underlying annual series contains a strong secular transition. Class-band language falls from approximately 2,500 annual occurrences in 1965 to approximately 900 in 2024. Identity-band language rises from approximately 200 to approximately 2,200. The two series cross around 2008.',
        'Detrended spectral power reveals the periodic structure beneath that transition. At 0.25 cycles per year, identity-band language holds a 24:1 power advantage over class-band language. Class-band power at the same frequency sits at the 72nd percentile of its spectrum and shows no comparable concentration.',
        'The presidential result confirms the first, third, and fourth predictions. The observed ratio exceeds the prespecified threshold of 2.0.',
      ],
      blocks: [
        {
          kind: 'pullquote',
          text: 'The 4-year peak is a dominant mode of the identity-band spectrum.',
        },
        {
          kind: 'prose',
          paragraphs: [
            'The 6-year Senate cycle carries a 21:1 identity-to-class ratio. The 8-year two-term cycle carries a 13:1 ratio. These electoral periodicities concentrate in the identity band while remaining suppressed in the class band.',
            'The annual 2-year result remains indeterminate. Its 0.58 ratio sits at the Nyquist limit, where only two samples describe each cycle.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Power ratio',
          definition:
            'Identity-band spectral power divided by class-band spectral power at a selected frequency.',
        },
        {
          term: 'Electoral periodicity',
          definition:
            'A repeated 4-year, 6-year, or 8-year interval represented as a frequency-domain peak.',
        },
      ],
      deepDive: {
        label: 'The primary results',
        passages: [
          {
            heading: 'FFT Periodogram',
            paragraphs: [
              'P1 is confirmed: The 4-year presidential cycle shows a 24:1 power advantage for identity-band language. This is a dominant spectral mode.',
              'P2 is indeterminate: The 2-year midterm cycle falls at the Nyquist limit, where the FFT has only 2 samples per cycle. The ratio of 0.58 suggests class-band dominance at this frequency, but the estimate is unreliable. Higher-frequency data (monthly or quarterly) are required to resolve the 2-year cycle cleanly.',
              'P3 is confirmed: The class-band power at f = 0.25 cyc/yr sits at the 72nd percentile of all class-band frequencies—relatively flat. The class spectrum shows no corresponding concentration at the electoral frequency.',
              'P4 is confirmed: The 24:1 ratio far exceeds the framework threshold of 2.0.',
            ],
          },
        ],
      },
    },

    {
      id: 'robustness-and-substrates',
      title: 'Robustness Across Tests and Substrates',
      prose: [
        'Parseval consistency supplies the computational check. Time-domain and frequency-domain energy agree within 0.04 percent, with a ratio of 0.9996.',
        'The time-domain election-year test does not confirm the fifth prediction. Presidential election years and non-election years yield a t statistic of 0.479 and a p value of 0.634. Variable amplitude across cycles defeats a comparison of raw means while the Fourier transform retains the underlying phase-locked clock.',
        'Cross-spectral coherence stays below 0.3 across most frequencies. At low frequencies the bands approach 180 degrees of anti-phase; at the 4-year frequency the phase is approximately negative 60 degrees.',
      ],
      visual: {
        kind: 'equation',
        latex:
          '\\sum_{n=0}^{N-1} |x[n]|^2 = \\frac{1}{N} \\sum_{k=0}^{N-1} |\\hat{X}[k]|^2.',
        label: 'eq. 21.7',
        caption: 'Parseval’s equality checks conservation across representations.',
      },
      deepDive: {
        label: 'What the failed mean test reveals',
        passages: [
          {
            heading: 'Time-Domain Election-Year Test',
            paragraphs: [
              'P5 is not confirmed. A two-sample t-test comparing identity-band word frequencies in presidential election years (N = 15) versus non-election years (N = 30) yields t = 0.479, p = 0.634—no significant difference in raw means.',
              'This apparent failure is methodologically instructive. The spectral carrier is a phase-locked oscillation whose amplitude varies by cycle. The identity spike in presidential years is coherent in phase but variable in amplitude: some cycles (1988, 2016) produce massive racial or immigration spikes, while others (1976, 1996) do not. The Fourier transform detects the underlying 4-year clock regardless of which specific B_k is active in a given cycle. The time-domain t-test, which ignores phase, cannot detect this structure. This is precisely why spectral analysis is the appropriate tool for testing the Interference Engine hypothesis.',
            ],
          },
          {
            heading: 'Cross-Spectral Coherence and Phase',
            paragraphs: [
              'Figure (ref) presents the magnitude-squared coherence and cross-spectral phase between identity-band and class-band frequencies. Coherence is low (< 0.3) across most frequencies, indicating that the two bands carry independent spectral information. The phase relationship varies with frequency: at very low frequencies (long periods), the bands are in anti-phase (φ ≈ +180°), consistent with their secular complementarity. At the 4-year frequency, the phase is intermediate (φ ≈ -60°), suggesting a lag structure that warrants further investigation with higher-resolution data.',
            ],
          },
          {
            heading: 'Parseval Consistency',
            paragraphs: [
              'For the detrended absolute frequencies, the time-domain energy and frequency-domain energy (corrected for positive-frequency summation) agree to within 0.04% (ratio = 0.9996). The spectral energy is conserved; the Engine redistributes it.',
            ],
          },
        ],
      },
    },

    {
      id: 'multi-channel-engine',
      title: 'A Multi-Channel Electoral Engine',
      prose: [
        'Per-axis decomposition assigns different 4-year responses to race, gender, and sexuality. Race carries an 11.0 ratio against class, an impedance near 0.10, and a natural frequency of 3.6 years. Gender carries a 0.05 ratio and a natural frequency near 6 years. Sexuality activates after 2003 and carries a 2.3 ratio.',
        'Higher-frequency data resolve the midterm cycle on a second substrate. Weekly Google Trends data from 2004–2024 yield a Welch-estimated 12.8:1 identity-to-class ratio at the 2-year frequency. The same substrate yields 1.6:1 at the 4-year frequency.',
        'The Congressional Record concentrates identity-band power at the 4-year institutional carrier. Google Trends concentrates it at the 2-year public-search carrier. The framework treats the divergence as substrate-specific modulation within a multi-channel control system.',
      ],
      blocks: [
        {
          kind: 'insight',
          heading: 'Phase coherence becomes a design requirement',
          paragraphs: [
            'A reform movement requires aligned resistance signals at the structural frequency of the extraction kernel. Local capacitance and parallel routing provide material infrastructure; phase coherence preserves collective amplitude through the electoral cycle.',
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'The remaining tests concern directionality, amplitude modulation, cross-national validity, and historical depth. Proposed controls include media cross-spectra, wavelet analysis around 1968, 1994, and 2020, electoral frequencies in the UK Parliament and German Bundestag, and the 19th-century Congressional Record.',
            'The established result is the carrier’s presence: an electoral-frequency signal dominates the identity band of American political discourse across the measured six-decade record.',
          ],
        },
      ],
      keyConcepts: [
        {
          term: 'Substrate',
          definition:
            'The measured channel in which a carrier appears, including congressional speech or public search interest.',
        },
        {
          term: 'Phase coherence',
          definition:
            'The deliberate alignment of resistance signals at the structural frequency of the kernel.',
        },
      ],
      deepDive: {
        label: 'The second substrate and the open empirical program',
        passages: [
          {
            heading: 'High-Frequency Validation',
            paragraphs: [
              'The annual Congressional Record dataset cannot resolve the 2-year midterm cycle because f = 0.50 cyc/yr sits at the Nyquist limit of f_s = 1 yr−1 sampling. Two high-frequency validation strategies address this limitation.',
              'Strategy 1: Quarterly Congressional Record via GovInfo API. A pipeline has been constructed to extract quarterly document-count proxies from the GovInfo API (free registration at https://www.govinfo.gov/api-signup). The script Paper/scripts/govinfo_crec_quarterly_query.py searches the CREC collection for class-band and identity-band keyword baskets per quarter, returning document-match counts. With f_s = 4 yr−1, the 2-year cycle moves to FFT bin 30—well below the new Nyquist limit of 2.0 cyc/yr—while preserving the 60-year baseline. Preprocessing and spectral analysis scripts have been updated to consume quarterly output. This strategy awaits API-key activation.',
              'Strategy 2: Weekly Google Trends (2004–2024). Google Trends supplies weekly search-interest indices (f_s = 52 yr−1) for the same keyword baskets. The baseline is shorter (N ≈ 21 years) and the metric is relative public-search interest, a different quantity from institutional word frequency, but the Nyquist frequency of 26 cyc/yr provides ample headroom to resolve the midterm cycle without interpolation artifacts.',
              "The Google Trends spectral analysis yields a striking result (Table (ref)). At the 2-year midterm frequency, the identity band dominates with a Welch-estimated power ratio of 12.8:1—comparable in magnitude to the Congressional Record's 4-year presidential ratio of 24.1:1. At the 4-year presidential frequency, the ratio is 1.6:1 (near parity), suggesting that public search interest in identity topics does not spike during presidential cycles to the same degree that Congressional floor speech does.",
            ],
          },
          {
            heading: 'Synthesis and Open Questions',
            paragraphs: [
              'The open questions are:',
              'Directionality: Does the carrier originate in media and propagate to Congress, or vice versa? Cross-spectral phase analysis with media data (Chapter (ref)) can answer this.',
              "Amplitude modulation: Does the carrier's amplitude vary with class-coherence threat? Wavelet analysis can test whether the 4-year peak strengthens during high-threat periods (1968, 1994, 2020) and weakens during low-threat periods.",
              'Cross-national validity: Does the UK Parliament show a 5-year peak? Does the German Bundestag show a 4-year peak? These control cases can falsify or confirm the electoral-carrier hypothesis.',
              'Historical depth: Does the carrier exist in the 19th-century Congressional Record, or did it emerge with the Variable Swap of 1968?',
            ],
          },
        ],
      },
    },
  ],
};

export default ch18;
