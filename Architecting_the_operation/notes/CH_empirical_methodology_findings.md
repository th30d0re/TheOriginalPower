# Empirical Methodology: factual findings

Source audited: `chapter.tex`, lines 1–95. This brief reports what that chapter says; it does not validate the cited literature or import definitions from elsewhere.

## 1. Section map

### Sociological Estimation Legitimacy

The section says ordinal composite scoring is standard in empirical political science and sociology, then offers nine datasets or works as precedents. (lines 8–28)
It concludes that those precedents make the framework's Era-Level Interference Calibration Matrix and kinetic-resistance variable methodologically legitimate. (line 30)

### Anchor-and-Scale Methodology

The section places $\rho_\tau$ on $[0,1]$, defines its maximum as a kinetic threshold breach, and selects Bacon's Rebellion and the Haitian Revolution as maximum-value anchors. (lines 32–55)
It says every other $\rho_\tau$ estimate is a fraction of those anchors, with partial mobilisation below $1.0$ and no kinetic component near $0$. (line 57)

### Confidence Tier Scheme

The section says every numerical claim receives one of three confidence tiers, distinguished by source access, author computation, or an ordinal claim without quantitative calibration. (lines 59–70)
It makes tier assignment the claim-level reproducibility standard and points to an Empirical Validation Index for a tier-by-tier equation index. (line 73)

### Reproducibility Standard

The section lists three tracks: a peer-reviewed source, a public dataset with disclosed operationalisation, or a fully disclosed author-constructed estimate. (lines 75–85)
It says other claims are marked ordinal/Tier 3, identifies notebooks and a reproduction command, and sends the reader elsewhere for per-equation falsification criteria. (line 87)

## 2. Definitions stated verbatim

### $\rho_\tau$ and kinetic threshold breach

Lines 34–38:

```tex
The kinetic-resistance variable $\rho_\tau$ is defined on a normalised scale:
\[
  \rho_\tau \in [0, 1],
\]
where $\rho_\tau = 1.0$ denotes a \textbf{kinetic threshold breach}---the point at which the Out-group's organised resistance crosses from non-kinetic to kinetic action at a scale that forces a measurable structural response from the dominant system. All other values in the Era-Level Interference Calibration Matrix (Appendix~\ref{sec:runtime_log}) are calibrated as fractions of this maximum.
```

### Conditions used to identify maximum-value anchors

Lines 40 and 55 supply the chapter's operational criterion for the anchors:

```tex
The scale is anchored by two events, each of which satisfies all conditions for $\rho_\tau = 1.0$ simultaneously.
```

```tex
They are the only two events in the 1450--2026 dataset that satisfy all three conditions for $\rho_\tau = 1.0$---cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture---simultaneously, so their selection is forced by the data.
```

### Confidence tiers: one-line definitions

Line 61:

```tex
Tier 1 = directly reported or transparently derivable from a peer-reviewed source or public dataset, with no undisclosed analytical step; Tier 2 = public dataset with disclosed author operationalisation; Tier 3 = ordinal or structural claim with no quantitative calibration attempted and its basis stated
```

### Tier 1: expanded definition

Line 64:

```tex
A Tier 1 claim is calibrated against at least one peer-reviewed source or public dataset carrying a DOI or stable URL; the numerical result is either directly reported in that source or is directly and transparently derivable from its published figures. The reader can verify the number without performing any undisclosed analytical step.
```

### Tier 2: expanded definition

Line 67:

```tex
A Tier 2 claim uses a publicly accessible dataset, but the author performs the operationalisation and computation; the method is disclosed in the case study or footnote so that a reader possessing the same dataset can reproduce the result.
```

### Tier 3: expanded definition

Line 70:

```tex
A Tier 3 claim is an ordinal ordering or structural relationship for which no quantitative calibration is possible or is attempted. The ordinal basis and its limits are explicitly stated in the text.
```

### Tier assignment as the reproducibility standard

Line 73:

```tex
The tier assignment is the reproducibility standard for each numerical claim.
```

### The three reproducibility tracks

Lines 77–85:

```tex
Every numerical claim in this manuscript satisfies exactly one of three reproducibility tracks:

\begin{enumerate}
  \item \textbf{Peer-reviewed source.} A DOI or stable URL is cited; the claim is directly reported or directly derivable from the cited source without undisclosed analytical steps.

  \item \textbf{Public dataset with URL.} The dataset's public access URL is cited; the operationalisation method is disclosed in the relevant case study or footnote.

  \item \textbf{Author-constructed estimate.} The estimation method is disclosed in full---inputs, transformation, and output---so that a reader can replicate the estimate from the same inputs.
\end{enumerate}
```

### Treatment of claims outside those tracks

Line 87:

```tex
Claims not meeting any of these three tracks are flagged as ordinal (Tier 3) and are explicitly marked as such in the text.
```

No other explicit definitions occur in this chapter. In particular, the chapter uses but does not define the Haitian Theorem, its strong-form condition, the Buffer Class, $t_{\text{post}}$, $\Phi_{\text{load}}$, or the construction of the Era-Level Interference Calibration Matrix. (lines 38, 48–49, 57, 67, 70, 73)

## 3. Every number

The table includes digit forms, Roman/name numerals, and written quantities. Repeated tier labels are consolidated by use rather than given a separate row for every repetition. Citation-key suffixes such as `aclu2013` and `aclu2020` are identifiers, not dates stated in the prose; they are recorded in the production-token table below. There are no sample sizes, percentages, or explicit equation numbers in the chapter. (lines 1–95) The display at lines 35–37 is unnumbered.

| Number | What it measures or denotes | Exact source sentence or table entry | Line |
|---|---|---|---:|
| three | Claimed number of reproducibility tracks | “Every numerical claim in this book rests on one of three reproducibility tracks: a peer-reviewed source with a stable identifier, a public dataset whose operationalization is disclosed in full, or an author-constructed estimate whose inputs, transformations, and outputs are stated so that any reader can replicate the calculation from the same starting material.” | 6 |
| four | Claimed number of tracks governed by the chapter; this conflicts with “three” immediately before it | “This chapter documents the methodology that governs all four of those tracks: the sociological precedent that legitimises ordinal composite scoring, the anchor-and-scale procedure that grounds the kinetic-resistance variable $\rho_\tau$, the three-tier confidence scheme that labels every quantitative claim, and the reproducibility standard to which every claim is held.” | 6 |
| three-tier | Count of confidence tiers | “This chapter documents the methodology that governs all four of those tracks: the sociological precedent that legitimises ordinal composite scoring, the anchor-and-scale procedure that grounds the kinetic-resistance variable $\rho_\tau$, the three-tier confidence scheme that labels every quantitative claim, and the reproducibility standard to which every claim is held.” | 6 |
| IV | Roman numeral in the source name “Polity IV”; not a measurement | “\textbf{Polity IV / Polity5} \cite{polityiv}.\ Marshall and Gurr's Center for Systemic Peace assigns every country-year a composite democracy score on a $-10$ to $+10$ ordinal scale derived from five component indicators; this score is among the most widely cited empirical measures in comparative politics.” | 12 |
| 5 | Numeral in the source name “Polity5”; not a measurement | “\textbf{Polity IV / Polity5} \cite{polityiv}.\ Marshall and Gurr's Center for Systemic Peace assigns every country-year a composite democracy score on a $-10$ to $+10$ ordinal scale derived from five component indicators; this score is among the most widely cited empirical measures in comparative politics.” | 12 |
| $-10$ to $+10$ | Endpoints of the Polity democracy scale | “\textbf{Polity IV / Polity5} \cite{polityiv}.\ Marshall and Gurr's Center for Systemic Peace assigns every country-year a composite democracy score on a $-10$ to $+10$ ordinal scale derived from five component indicators; this score is among the most widely cited empirical measures in comparative politics.” | 12 |
| five | Number of component indicators said to underlie the Polity score | “\textbf{Polity IV / Polity5} \cite{polityiv}.\ Marshall and Gurr's Center for Systemic Peace assigns every country-year a composite democracy score on a $-10$ to $+10$ ordinal scale derived from five component indicators; this score is among the most widely cited empirical measures in comparative politics.” | 12 |
| dozens | Approximate count of peer-reviewed articles treating V-Dem decimal scores as findings; **illustrative/indefinite, not measured precisely here** | “\textbf{V-Dem (Varieties of Democracy)} \cite{vdem}.\ Coppedge et al.\ produce multi-dimensional democracy indices by aggregating expert-coded ordinal inputs through a Bayesian item-response model; dozens of peer-reviewed articles treat the resulting decimal scores as quantitative findings.” | 14 |
| 1972 | Starting year of the GSS longitudinal survey | “\textbf{General Social Survey (GSS)} \cite{gss_norc}.\ NORC at the University of Chicago has fielded a nationally representative longitudinal survey since 1972; the bulk of its social-attitude items are ordinal Likert scales whose aggregates appear as quantitative trend findings in thousands of peer-reviewed articles.” | 16 |
| thousands | Approximate count of peer-reviewed articles using GSS aggregates; **illustrative/indefinite, not measured precisely here** | “\textbf{General Social Survey (GSS)} \cite{gss_norc}.\ NORC at the University of Chicago has fielded a nationally representative longitudinal survey since 1972; the bulk of its social-attitude items are ordinal Likert scales whose aggregates appear as quantitative trend findings in thousands of peer-reviewed articles.” | 16 |
| 0–100 | Endpoints of ANES feeling-thermometer scores | “\textbf{American National Election Studies (ANES)} \cite{anes_cumulative}.\ The University of Michigan / Stanford ANES Time Series tracks issue-salience rankings and 0--100 feeling-thermometer scores; these ordinal and quasi-interval scales are routinely reported as empirical measures of political opinion.” | 18 |
| five-point | Number of levels on the Correlates of War hostility scale | “\textbf{Correlates of War} \cite{correlates_of_war}.\ Singer and Small's Militarized Interstate Dispute dataset codes conflict events on a five-point ordinal hostility-level scale (from threat to war); the ordinal values are used directly in quantitative analyses of interstate conflict.” | 20 |
| top-decile | Ranked population share used for WID wealth-share series; the chapter gives no numeric percentage | “\textbf{World Inequality Database (WID.world)} \cite{piketty_wid}.\ Piketty, Saez, and Zucman's distributional national accounts produce top-decile and top-percentile wealth-share time series; these shares are composite estimates derived from tax records, survey data, and national accounts adjustments---no single authoritative source yields them directly.” | 22 |
| top-percentile | Ranked population share used for WID wealth-share series; the chapter gives no numeric percentage | “\textbf{World Inequality Database (WID.world)} \cite{piketty_wid}.\ Piketty, Saez, and Zucman's distributional national accounts produce top-decile and top-percentile wealth-share time series; these shares are composite estimates derived from tax records, survey data, and national accounts adjustments---no single authoritative source yields them directly.” | 22 |
| no single | Count claim that no one authoritative source directly yields the WID estimates | “\textbf{World Inequality Database (WID.world)} \cite{piketty_wid}.\ Piketty, Saez, and Zucman's distributional national accounts produce top-decile and top-percentile wealth-share time series; these shares are composite estimates derived from tax records, survey data, and national accounts adjustments---no single authoritative source yields them directly.” | 22 |
| fourteen | Number of ordinal proxy variables said to compose Putnam's index | “\textbf{Putnam's \textit{Bowling Alone}} \cite{putnam_bowling}.\ Putnam measures the decline of American social capital through a composite of fourteen ordinal proxy variables (club membership, voting, survey trust items); the resulting index is presented as a quantitative empirical finding.” | 26 |
| $0$ | Lower endpoint of the normalized $\rho_\tau$ scale | “$\rho_\tau \in [0, 1],$” | 36 |
| $1$ | Upper endpoint of the normalized $\rho_\tau$ scale | “$\rho_\tau \in [0, 1],$” | 36 |
| $1.0$ | Maximum $\rho_\tau$ value and the value denoting a kinetic threshold breach | “where $\rho_\tau = 1.0$ denotes a \textbf{kinetic threshold breach}---the point at which the Out-group's organised resistance crosses from non-kinetic to kinetic action at a scale that forces a measurable structural response from the dominant system.” | 38 |
| two | Number of anchor events | “The scale is anchored by two events, each of which satisfies all conditions for $\rho_\tau = 1.0$ simultaneously.” | 40 |
| $1.0$ | Value each anchor is said to satisfy | “The scale is anchored by two events, each of which satisfies all conditions for $\rho_\tau = 1.0$ simultaneously.” | 40 |
| 1676 | Date of Bacon's Rebellion | “Bacon's Rebellion \cite{dubois,morgan_american_slavery} & 1676 & Unambiguous cross-racial armed uprising; forced the Virginia planter class to invent the Buffer Class ($I_{\text{buffer}}$) and enact the Virginia Slave Codes (1705)---a documented, measurable structural response.” | 48 |
| 1705 | Date attached to the Virginia Slave Codes | “Bacon's Rebellion \cite{dubois,morgan_american_slavery} & 1676 & Unambiguous cross-racial armed uprising; forced the Virginia planter class to invent the Buffer Class ($I_{\text{buffer}}$) and enact the Virginia Slave Codes (1705)---a documented, measurable structural response.” | 48 |
| 1791–1804 | Date range of the Haitian Revolution | “Haitian Revolution \cite{james_black_jacobins,dubois} & 1791--1804 & The only successful slave revolution in history; produced permanent kernel termination ($\max(t_{\text{post}}) = 0$ locally)---the only documented instance of the Haitian Theorem's strong-form condition being satisfied.” | 49 |
| only successful slave revolution | Counts the Haitian Revolution as one uniquely successful slave revolution | “Haitian Revolution \cite{james_black_jacobins,dubois} & 1791--1804 & The only successful slave revolution in history; produced permanent kernel termination ($\max(t_{\text{post}}) = 0$ locally)---the only documented instance of the Haitian Theorem's strong-form condition being satisfied.” | 49 |
| only documented instance | Counts the Haitian case as one unique documented strong-form instance | “Haitian Revolution \cite{james_black_jacobins,dubois} & 1791--1804 & The only successful slave revolution in history; produced permanent kernel termination ($\max(t_{\text{post}}) = 0$ locally)---the only documented instance of the Haitian Theorem's strong-form condition being satisfied.” | 49 |
| $0$ | Local value of $\max(t_{\text{post}})$ said to represent permanent kernel termination | “Haitian Revolution \cite{james_black_jacobins,dubois} & 1791--1804 & The only successful slave revolution in history; produced permanent kernel termination ($\max(t_{\text{post}}) = 0$ locally)---the only documented instance of the Haitian Theorem's strong-form condition being satisfied.” | 49 |
| both | Refers to the two anchor events | “Both events are \textit{unambiguous} kinetic threshold breaches with documented, measurable structural responses.” | 55 |
| only two | Claimed count of dataset events satisfying all maximum-anchor conditions | “They are the only two events in the 1450--2026 dataset that satisfy all three conditions for $\rho_\tau = 1.0$---cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture---simultaneously, so their selection is forced by the data.” | 55 |
| 1450–2026 | Date span of the asserted dataset | “They are the only two events in the 1450--2026 dataset that satisfy all three conditions for $\rho_\tau = 1.0$---cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture---simultaneously, so their selection is forced by the data.” | 55 |
| three | Count of conditions for a maximum anchor | “They are the only two events in the 1450--2026 dataset that satisfy all three conditions for $\rho_\tau = 1.0$---cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture---simultaneously, so their selection is forced by the data.” | 55 |
| $1.0$ | Maximum-anchor value | “They are the only two events in the 1450--2026 dataset that satisfy all three conditions for $\rho_\tau = 1.0$---cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture---simultaneously, so their selection is forced by the data.” | 55 |
| two | Number of anchors used to calibrate every other estimate | “Every other $\rho_\tau$ estimate in the Era-Level Interference Calibration Matrix is calibrated as a fraction of these two anchors.” | 57 |
| below $1.0$ | Qualitative upper relation assigned to partial kinetic mobilisation without a full structural response; **illustrative rule, not a measured value** | “An event that produced partial kinetic mobilisation without a full structural response receives a value below $1.0$; an event that produced no kinetic component receives a value near $0$.” | 57 |
| near $0$ | Qualitative value assigned to an event with no kinetic component; **illustrative rule, not a measured value** | “An event that produced partial kinetic mobilisation without a full structural response receives a value below $1.0$; an event that produced no kinetic component receives a value near $0$.” | 57 |
| three | Number of confidence tiers | “Every numerical claim in this manuscript is assigned one of three confidence tiers.” | 61 |
| one-line | Length characterization of the abbreviated tier definition; **descriptive, not a measured line count demonstrated here** | “The one-line definition that appears in the Era-Level Calibration Matrix---\textit{``Tier 1 = directly reported or transparently derivable from a peer-reviewed source or public dataset, with no undisclosed analytical step; Tier 2 = public dataset with disclosed author operationalisation; Tier 3 = ordinal or structural claim with no quantitative calibration attempted and its basis stated''}---is expanded here into a full, operationalisable specification.” | 61 |
| Tier 1 | First confidence category: directly reported or transparently derivable evidence without an undisclosed analytical step | “Tier 1 = directly reported or transparently derivable from a peer-reviewed source or public dataset, with no undisclosed analytical step” (line 61); “A Tier 1 claim is calibrated against at least one peer-reviewed source or public dataset carrying a DOI or stable URL; the numerical result is either directly reported in that source or is directly and transparently derivable from its published figures.” (line 64) | 61, 64 |
| at least one | Minimum number of peer-reviewed sources or public datasets in the expanded Tier 1 definition | “A Tier 1 claim is calibrated against at least one peer-reviewed source or public dataset carrying a DOI or stable URL; the numerical result is either directly reported in that source or is directly and transparently derivable from its published figures.” | 64 |
| Tier 2 | Second confidence category: public dataset plus disclosed author operationalisation/computation | “A Tier 2 claim uses a publicly accessible dataset, but the author performs the operationalisation and computation; the method is disclosed in the case study or footnote so that a reader possessing the same dataset can reproduce the result.” | 61, 67 |
| Tier 3 | Third confidence category: ordinal or structural claim without quantitative calibration | “A Tier 3 claim is an ordinal ordering or structural relationship for which no quantitative calibration is possible or is attempted.” | 61, 70 |
| pre-1700 | Era before 1700, offered as a Tier 3 example because records are said to be sparse; **illustrative example, not a measured result** | “\textit{Examples}: Global-scaling estimates where regional data is fragmented; pre-1700 era estimates where quantitative records are sparse (see the Global Scaling row in Appendix~\ref{sec:runtime_log}).” | 70 |
| exactly one of three | Required number of reproducibility tracks satisfied by each numerical claim | “Every numerical claim in this manuscript satisfies exactly one of three reproducibility tracks:” | 77 |
| 1 | Enumeration number for “Peer-reviewed source” | “\item \textbf{Peer-reviewed source.} A DOI or stable URL is cited; the claim is directly reported or directly derivable from the cited source without undisclosed analytical steps.” | 80 |
| 2 | Enumeration number for “Public dataset with URL” | “\item \textbf{Public dataset with URL.} The dataset's public access URL is cited; the operationalisation method is disclosed in the relevant case study or footnote.” | 82 |
| 3 | Enumeration number for “Author-constructed estimate” | “\item \textbf{Author-constructed estimate.} The estimation method is disclosed in full---inputs, transformation, and output---so that a reader can replicate the estimate from the same inputs.” | 84 |
| three | Number of tracks referenced by the outside-track rule | “Claims not meeting any of these three tracks are flagged as ordinal (Tier 3) and are explicitly marked as such in the text.” | 87 |
| Tier 3 | Category assigned to claims outside the three tracks | “Claims not meeting any of these three tracks are flagged as ordinal (Tier 3) and are explicitly marked as such in the text.” | 87 |
| Tier 1 | A tier whose computation notebooks are said to be available | “All Jupyter notebooks used for Tier 1 and Tier 2 computations are available in \texttt{Paper/scripts/} and are reproducible via \texttt{make empirical}.” | 87 |
| Tier 2 | A tier whose computation notebooks are said to be available | “All Jupyter notebooks used for Tier 1 and Tier 2 computations are available in \texttt{Paper/scripts/} and are reproducible via \texttt{make empirical}.” | 87 |
| 1440s–1915 | Date span in the following part title, not empirical-methodology evidence | “\part{Specification and Origins (1440s--1915)}” | 92 |

### Non-substantive numeric tokens in the source

| Number | Function | Exact source fragment | Line |
|---|---|---|---:|
| 3.2 cm | First LaTeX table-column width; not evidence | “\begin{tabular}{p{3.2cm} p{2.2cm} p{8.0cm}}” | 44 |
| 2.2 cm | Second LaTeX table-column width; not evidence | “\begin{tabular}{p{3.2cm} p{2.2cm} p{8.0cm}}” | 44 |
| 8.0 cm | Third LaTeX table-column width; not evidence | “\begin{tabular}{p{3.2cm} p{2.2cm} p{8.0cm}}” | 44 |
| 6 pt | LaTeX row spacing; not evidence | “\\[6pt]” | 48 |
| 2013 | Part of a bibliography key, not a date asserted by the prose | “\cite{aclu2013,aclu2020}” | 64 |
| 2020 | Part of a bibliography key, not a date asserted by the prose | “\cite{aclu2013,aclu2020}” | 64 |
| $-1$ | LaTeX chapter-counter setting after this chapter; not an empirical claim | “\setcounter{chapter}{-1}” | 95 |

## 4. Every procedure

### Sociological-legitimacy argument

1. Assert that ordinal composite scoring is a standard instrument of empirical political science and sociology. (line 10)
2. Present nine datasets or works whose ordinal or composite outputs are published or used as empirical findings. (lines 12–28)
3. Infer that because leading scholarship uses such scores, constructing the Era-Level Interference Calibration Matrix and $\rho_\tau$ with “the same methodology” fits established scientific practice. (line 30)

### Anchor-and-scale procedure

1. Put kinetic resistance on a normalized scale: “The kinetic-resistance variable $\rho_\tau$ is defined on a normalised scale” with $\rho_\tau \in [0,1]$. (lines 34–37)
2. Make $1.0$ the maximum and define it as a kinetic threshold breach: organised Out-group resistance becomes kinetic at a scale forcing a measurable structural response. (line 38)
3. Calibrate all other matrix values “as fractions of this maximum.” (line 38)
4. Anchor the scale with two events that satisfy all maximum conditions simultaneously. (line 40)
5. Use Bacon's Rebellion (1676) because the chapter characterizes it as a cross-racial armed uprising that forced creation of the Buffer Class and the Virginia Slave Codes (1705), producing a measurable structural response. (line 48)
6. Use the Haitian Revolution (1791–1804) because the chapter characterizes it as the only successful slave revolution and as producing local permanent kernel termination, $\max(t_{\text{post}})=0$. (line 49)
7. Require the three stated maximum conditions simultaneously: “cross-racial or system-wide kinetic mobilisation, documented structural counter-response, and a measurable, durable change in the system's institutional architecture.” (line 55)
8. Express every non-anchor $\rho_\tau$ estimate as a fraction of the two anchors. (line 57)
9. Give partial kinetic mobilisation without a full structural response a value below $1.0$; give no kinetic component a value near $0$. (line 57)
10. Consult the full calibrated matrix in Appendix `sec:runtime_log`; the chapter itself supplies no intermediate assignment rule or event-by-event calculation. (lines 38, 57)

### Confidence-tier assignment procedure

1. Assign every numerical claim one of three confidence tiers. (line 61)
2. Use Tier 1 when the result is directly reported by, or transparently derivable from, at least one peer-reviewed source or public dataset with a DOI or stable URL and no undisclosed analytical step. (line 64)
3. Use Tier 2 when a public dataset exists but the author performs the computation; disclose the operationalisation in the case study or footnote so a reader with the same dataset can reproduce it. (line 67)
4. Use Tier 3 for an ordinal ordering or structural relationship for which quantitative calibration is impossible or unattempted; state the ordinal basis and limitations. (line 70)
5. Tag every equation carrying a $\rho_\tau$ or $\Phi_{\text{load}}$ value with its tier in the surrounding text. (line 73)
6. Use the Empirical Validation Index for the claimed complete tier-by-tier equation index. (line 73)

### Reproducibility procedure

1. For a peer-reviewed-source claim, cite a DOI or stable URL and use a value directly reported or directly derivable without undisclosed steps. (line 80)
2. For a public-dataset claim, cite its public URL and disclose the operationalisation in the relevant case study or footnote. (line 82)
3. For an author-constructed estimate, disclose inputs, transformation, and output in full so the calculation can be repeated from the same inputs. (line 84)
4. Flag a claim meeting none of those tracks as ordinal/Tier 3 and mark it explicitly in the text. This instruction conflicts with the immediately preceding assertion that every numerical claim satisfies exactly one track. (lines 77, 87)
5. For Tier 1 and Tier 2 computations, obtain the claimed notebooks from `Paper/scripts/` and run `make empirical`. Those notebooks and that directory are not included in this supplied chapter or in the present directory. (line 87)
6. For falsification, consult the criterion attached to the individual equation in its case study and the framework in Appendix `app:falsifiability`; no such criterion is reproduced here. (line 87)

## 5. Every named external source

| Named source, author, institution, or borrowed method | What the chapter invokes it for | Citation key(s) | Line |
|---|---|---|---:|
| Polity IV / Polity5; Marshall and Gurr; Center for Systemic Peace | Composite democracy score on a $-10$ to $+10$ ordinal scale built from five indicators | `polityiv` | 12 |
| V-Dem (Varieties of Democracy); Coppedge et al.; Bayesian item-response model | Multi-dimensional democracy indices aggregating expert-coded ordinal inputs | `vdem` | 14 |
| General Social Survey (GSS); NORC at the University of Chicago; Likert scales | National longitudinal survey and aggregation of ordinal social-attitude items | `gss_norc` | 16 |
| American National Election Studies (ANES); University of Michigan; Stanford; feeling-thermometer scale | Issue-salience rankings and 0–100 ordinal/quasi-interval opinion measures | `anes_cumulative` | 18 |
| Correlates of War; Singer and Small; Militarized Interstate Dispute dataset | Five-level ordinal hostility coding; later also named as the basis for author-computed $\rho_\tau$ intervals | `correlates_of_war` | 20, 67 |
| World Inequality Database (WID.world); Piketty, Saez, and Zucman; distributional national accounts | Composite top-decile and top-percentile wealth-share estimates | `piketty_wid` | 22 |
| Gallup World Poll; Gallup; social-capital indices | Composite of trust, social-network, and volunteering items; later mapped by the author to $\Phi_{\text{load}}$ ranges | `gallup_social` | 24, 67 |
| Putnam, *Bowling Alone* | The clearest named sociological precedent: a social-capital index composed from fourteen ordinal proxy variables | `putnam_bowling` | 26 |
| Pew Research Center political-polarization studies | Composite ordinal measures of ideological consistency and partisan animosity | `pew_polarization` | 28 |
| Bacon's Rebellion | Historical maximum anchor | `dubois`, `morgan_american_slavery` | 48 |
| Haitian Revolution | Historical maximum anchor | `james_black_jacobins`, `dubois` | 49 |
| Piketty–Saez–Zucman top-decile wealth shares | Tier 1 example | `piketty` | 64 |
| Gilens–Page policy-responsiveness regression coefficients | Tier 1 example | `gilens` | 64 |
| ACLU cannabis-arrest disparity ratios | Tier 1 example | `aclu2013`, `aclu2020` | 64 |

This is the complete set of 16 unique `\cite{...}` keys in the chapter: `aclu2013`, `aclu2020`, `anes_cumulative`, `correlates_of_war`, `dubois`, `gallup_social`, `gilens`, `gss_norc`, `james_black_jacobins`, `morgan_american_slavery`, `pew_polarization`, `piketty`, `piketty_wid`, `polityiv`, `putnam_bowling`, and `vdem`. (lines 12–28, 48–49, 64, 67)

The chapter does not include bibliography entries. Consequently, where a table row supplies only a citation key—especially `dubois`, `morgan_american_slavery`, and `james_black_jacobins`—the exact author, title, edition, and publication details are absent and cannot be recovered from this chapter alone. (lines 48–49)

The methods said to be borrowed or normalized by precedent are ordinal composite scoring generally (lines 10, 30), Bayesian item-response aggregation (line 14), Likert-scale aggregation (line 16), issue-salience rankings and feeling thermometers (line 18), ordinal hostility coding (line 20), distributional national accounts combining tax, survey, and national-accounts data (line 22), and composite proxy indices for social capital or polarization (lines 24, 26, 28). The chapter does not identify a single source as the origin of the anchor-and-scale procedure itself. (lines 32–57)

## 6. The falsification story

The chapter does **not** state a substantive observation, threshold, statistical test, or failed prediction that would make the overall framework wrong. Its sole explicit falsification statement is procedural: “The per-equation falsification criteria in each case study follow the same framework established in Appendix~\ref{app:falsifiability}.” (line 87) Neither those per-equation criteria nor the appendix framework appears in this chapter. (line 87)

What a reader is told to do to check a claim depends on its track:

- For Tier 1 / a peer-reviewed-source claim, follow the DOI or stable URL and confirm that the number is reported or directly derivable without an undisclosed step. (lines 64, 80)
- For Tier 2 / a public-dataset claim, obtain the same public dataset, find the disclosed operationalisation in the case study or footnote, and reproduce the author's computation. (lines 67, 82)
- For an author-constructed estimate, start from the disclosed inputs and repeat the disclosed transformation to check the output. (line 84)
- Find the tier beside an equation carrying $\rho_\tau$ or $\Phi_{\text{load}}$, or use the claimed Empirical Validation Index. (line 73)
- Run the Tier 1/Tier 2 notebooks using `make empirical`, assuming the separately referenced `Paper/scripts/` materials are available. (line 87)
- Find the equation's actual falsification criterion in its case study and use the external appendix framework. (line 87)

The anchor claims are testable in an ordinary evidentiary sense—for example, the claims that only two events meet the three conditions and that the anchors forced particular structural responses—but the chapter never labels a contrary finding as a formal falsifier of the framework. (lines 48–49, 55) Treating those as framework-level falsification conditions would therefore be an inference, not the chapter's stated rule.

## 7. Anything a listener would need defined first

These terms are used without a definition adequate for a stand-alone episode:

| Term | What the chapter does say | What is missing here | Line(s) |
|---|---|---|---:|
| Ordinal scale; ordinal composite scoring | Calls it standard and supplies precedents | Meaning of “ordinal,” how a composite is constructed, and what arithmetic is permissible on ordinal values | 10–30 |
| Operationalisation | Makes disclosure of it central to Tiers 2 and the public-dataset track | A definition and a concrete worked example | 61, 67, 82 |
| Kinetic resistance, $\rho_\tau$ | Gives its range and maximum-threshold meaning | What the variable measures away from the endpoints, its units/indicators, and the meaning of subscript $\tau$ | 34–38, 57 |
| Out-group | Its organised resistance is part of the threshold definition | Who belongs to it and how membership is determined | 38 |
| Non-kinetic / kinetic action or mobilisation | A crossing from one to the other defines the threshold | The boundary between them and observable coding rules | 38, 55, 57 |
| Dominant system | It is forced to make a structural response | Its boundaries and how a system is identified | 38 |
| “Measurable,” “durable,” “full,” and “partial” structural response | These words separate anchors and submaximum cases | Metrics, duration, thresholds, and decision rules | 38, 55, 57 |
| Era-Level Interference Calibration Matrix / Era-Level Calibration Matrix | It contains calibrated values and the one-line tier definitions | Its rows, columns, event universe, data, and construction | 38, 57, 61 |
| Buffer Class, $I_{\text{buffer}}$ | Said to have been invented by the Virginia planter class after Bacon's Rebellion | Sociological meaning, membership, measurement, and the symbol's role | 48 |
| Permanent kernel termination, $\max(t_{\text{post}})=0$ locally | Said to have resulted from the Haitian Revolution | “Kernel,” $t_{\text{post}}$, the maximum operator, locality, and why zero means termination | 49 |
| Haitian Theorem and strong-form condition | The Haitian case is said to be its only documented strong-form instance | The theorem and its weak/strong conditions | 49 |
| $\Phi_{\text{load}}$ | Gallup indices are mapped to its ranges; equations containing it receive tiers | Meaning, range, units, mapping rule, and role in the framework | 67, 73 |
| Global Scaling | Named as a matrix row and Tier 3 example | What is being scaled and how | 70 |
| Tier versus reproducibility track | Both classify claims | Whether these are parallel schemes or mappings; the text does not map all three tiers cleanly to all three tracks | 61–70, 77–87 |
| DOI; stable URL; public dataset | Treated as reproducibility credentials | What persistence/access standard qualifies, and whether versioning or archived snapshots are required | 64, 80–84 |
| Directly/transparently derivable; undisclosed analytical step | Used as the Tier 1 boundary | What transformations remain “direct,” and what disclosure detail is sufficient | 61, 64, 80 |
| Bayesian item-response model | Named as V-Dem's aggregation method | How the method turns expert-coded ordinal inputs into decimal scores | 14 |
| Likert scale; quasi-interval scale; feeling thermometer | Named as precedents | How these scale types differ and why they support the chapter's own scoring | 16, 18 |
| Social capital; ideological consistency; partisan animosity | Named as constructs represented by composite scores | Construct definitions and how proxy validity is assessed | 24–28 |
| Distributional national accounts; top-decile/top-percentile wealth share | Named as a composite-estimation precedent | Construction details and why this is analogous to $\rho_\tau$ | 22 |
| Empirical Validation Index; `runtime_log`; falsifiability appendix | Named as locations of supporting material | Their contents are absent from the chapter | 38, 57, 70, 73, 87 |

## 8. Gaps and hazards

1. **The track count contradicts itself in one line.** The opening says “one of three reproducibility tracks,” then says the chapter governs “all four of those tracks.” The ensuing list contains three tracks. (lines 6, 77–85)

2. **The taxonomy is internally unstable.** Every numerical claim supposedly satisfies exactly one of three tracks, yet claims meeting none are assigned Tier 3. Tier 3 is defined as having no quantitative calibration, while the latter rule is phrased as a disposition for claims outside the tracks used by numerical claims. The chapter never gives a clean tier-to-track mapping. (lines 61, 70, 77, 87)

3. **Precedent is substituted for validation.** Showing that established fields publish ordinal or composite scores does not establish that this framework's indicators, aggregation, anchors, or resulting values are valid. The conclusion calls the framework “epistemologically legitimate” and says it fits established practice, but it presents no validation of this particular measure in this section. (lines 10–30)

4. **The cited precedents are methodologically heterogeneous.** Expert-coded Bayesian item-response estimates, Likert aggregates, feeling thermometers, ordinal conflict codes, distributional national accounts, and proxy composites are treated as instances of “the same methodology,” although the chapter itself describes materially different inputs and transformations. It does not explain which features are analogous to $\rho_\tau$. (lines 12–30)

5. **“Top-tier journals” is unsupported in the chapter.** The chapter says top-tier political-science and sociology journals routinely publish such scores, but it names no journals and provides no review establishing that frequency. Several listed precedents are datasets, organizations, or a book rather than journal articles. (lines 10–30)

6. **The actual scale-construction algorithm is missing.** Beyond anchoring $1.0$, “below $1.0$,” and “near $0$,” there are no bins, formulas, weights, indicators, coding instructions, interpolation rules, uncertainty intervals, or worked non-anchor example. A reader cannot reproduce an intermediate $\rho_\tau$ value from this chapter. (lines 34–57)

7. **The lower endpoint is not actually anchored.** The chapter names two maximum anchors but no event fixed at exactly $0$; it only says cases with no kinetic component receive a value “near $0$.” That leaves both the meaning of exact zero and the scale's lower calibration unresolved. (lines 36, 40–57)

8. **The anchor criteria are vague and potentially circular.** “System-wide,” “measurable,” “durable,” “structural,” “partial,” and “full” have no thresholds. The outcome—structural response—is built into both the definition of a kinetic threshold breach and the criteria used to select anchors, so mobilisation intensity cannot be separated from system response. (lines 38, 55, 57)

9. **“Forced by the data” cannot be checked here.** The chapter asserts that only two events in a 1450–2026 dataset meet all three conditions, but it does not provide the event universe, exclusions, coding sheet, evidence matrix, missing-data treatment, or comparison cases. The referenced full matrix is external to the chapter. (lines 55, 57)

10. **The two anchors represent different outcomes.** Bacon's Rebellion anchors a counter-response by the dominant system, while Haiti anchors local termination of the system. The chapter assigns both the same maximum without explaining why those different outcomes are commensurable on one resistance scale. (lines 38, 48–55)

11. **Several historical claims are exceptionally strong but not argued here.** The chapter says Bacon's Rebellion “forced” the planter class to invent a Buffer Class and enact the 1705 Slave Codes, and calls Haiti the only successful slave revolution and the only documented strong-form case. Citations are supplied, but definitions, evidence, rival interpretations, and causal identification are absent from this chapter. (lines 48–49)

12. **The time bounds are unexplained and inconsistent with the following part title.** The dataset is called “1450–2026,” while the next part begins “1440s–1915.” The chapter gives no reason for either starting bound or for their mismatch. (lines 55, 92)

13. **Tier 1 does not necessarily mean peer review despite its title.** Its heading is “Peer-reviewed quantitative alignment,” but its rule allows either a peer-reviewed source **or** a public dataset carrying a DOI or stable URL. A stable URL establishes location, not peer review or data quality. (line 64)

14. **Source stability and version control are underspecified.** “Stable URL” and “public access URL” do not require an archived version, retrieval date, checksum, dataset release, or immutable input. “Same dataset” may therefore be impossible to guarantee after revisions. (lines 64, 67, 80–84)

15. **“Directly derivable” is not operationalized.** The chapter bars undisclosed analytical steps but never defines which transformations count as direct, how much detail disclosure requires, or how discrepancies should be resolved. (lines 61, 64, 80)

16. **Tier 3's wording is ambiguous.** “No quantitative calibration is possible or is attempted” combines impossibility with author choice. It does not say how the ordinal basis is evaluated, who checks it, or what evidence would reject the ordering. (line 70)

17. **No reliability or sensitivity protocol is stated.** For author coding, the chapter supplies no second coder, inter-rater reliability, preregistration, robustness checks, alternative-anchor analysis, uncertainty propagation, or sensitivity analysis. None appears in the procedures at lines 34–87.

18. **The universal compliance claims are assertions, not demonstrations.** “Every numerical claim” is said to be tiered and to satisfy a reproducibility track, and every relevant equation is said to be tagged, but this chapter offers no audit totals or cross-check beyond pointing to an external index. (lines 61, 73, 77)

19. **Reproducibility depends on absent materials.** The notebooks, `Paper/scripts/`, full calibration matrix, case studies, Empirical Validation Index, and falsifiability appendix are not included in the chapter; in the supplied directory, only `chapter.tex`, `BRIEF.md`, and `codex.log` existed before this findings file was created. The chapter's claims cannot be executed or fully checked from the supplied material alone. (lines 38, 57, 67, 70, 73, 82, 87)

20. **The chapter does not deliver a framework-level falsifier.** It delegates per-equation falsification elsewhere but never states what empirical result would refute the framework as a whole. (line 87)
