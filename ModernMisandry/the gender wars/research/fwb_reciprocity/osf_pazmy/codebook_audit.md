# Codebook Audit: OSF "Longitudinal FWB" (osf.io/pazmy)

This audit examines the survey instruments (`codebook_time1.pdf`, `codebook_time2.pdf`) and the dataset (`fwb_data.xlsx`) deposited under OSF project `osf.io/pazmy`. The primary evaluation focuses on whether this longitudinal study can evaluate the hypothesis that friends-with-benefits (FWB) relationships—characterized by sexual intimacy without formal non-sexual exchanges such as dates, financial provision, or courtship gifts—provide high sexual reciprocity, favorable female sexual outcomes, and distinct outcomes relative to romantic relationships.

---

## 1. Inventory of Target Variables and Scales

The table below lists all variables across Wave 1 and Wave 2 corresponding to the target domains: sexual satisfaction, orgasm, sexual reciprocity/attention to pleasure, sexual communication/rules, investment, costs, rewards, commitment, exclusivity, relationship duration, transitions, gender, age, and non-sexual exchange.

Where a construct is absent from the survey instruments, it is designated as **Not found**.

| Construct Domain | Variable Name | Item Wording (Quote < 15 words or Paraphrase) | Response Scale | Wave |
| :--- | :--- | :--- | :--- | :--- |
| **Gender** | `SEX` | "What is your sex?" | 1 = Female, 2 = Male | Wave 1 |
| **Gender (Partner)** | `fwbsex` | "What is your 'friend with benefits' sex?" | 1 = Female, 2 = Male | Wave 1 |
| **Age** | `AGE` | "What is your age (in years)?" | Open numeric (integer) | Wave 1 |
| **Sexual Satisfaction** | `sexsat1` | "Our sexual relationship is much better than others' sexual relationships." | 1 (Do Not Agree At All) to 7 (Agree Completely) | Wave 1 |
| **Sexual Satisfaction** | `sexsat2` | "I am satisfied with our sexual relationship." | 1 (Do Not Agree At All) to 7 (Agree Completely) | Wave 1 |
| **Sexual Satisfaction** | `t2sexsat1` | "Our sexual relationship is much better than others' sexual relationships." | 1 (Do Not Agree At All) to 9 (Agree Completely) | Wave 2 |
| **Sexual Satisfaction** | `t2sexsat2` | "I am satisfied with our sexual relationship." | 1 (Do Not Agree At All) to 9 (Agree Completely) | Wave 2 |
| **Orgasm** | `orgasm1` | "During sexual intercourse with my 'friend with benefits'" | 1 (Never) to 9 (Always); 10 = N/A | Wave 1 |
| **Orgasm** | `orgasm2` | "During other sexual activities (e.g., oral sex) with my 'friend with benefits'" | 1 (Never) to 9 (Always); 10 = N/A | Wave 1 |
| **Orgasm (Masturbation)** | `orgasm3` | "During masturbation by myself" | 1 (Never) to 9 (Always); 10 = N/A | Wave 1 |
| **Orgasm (Wave 2)** | *None* | **Not found** | N/A | Wave 2 |
| **Sexual Reciprocity** | *None* | **Not found** (no items measure reciprocal pleasure, partner orgasm, or mutual sexual equity) | N/A | Waves 1 & 2 |
| **Pleasure Attention** | *None* | **Not found** (only general sexual comfort `comm8`/`comm9` and mutual masturbation `sexact3` exist) | N/A | Waves 1 & 2 |
| **Sexual Communication & Rules** | `comm1` | Negotiated rules regarding the relationship at the beginning | 0 (Do Not Agree At All) to 8 (Agree Completely) [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm2` | Regularly talk about our communication (frequency and topics) | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm3` | Regularly talk about how secret the relationship should remain | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm4` | Regularly talk about the permanency of the relationship | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm5` | Regularly talk about emotional aspects (avoiding love, minimizing jealousy) | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm6` | Regularly talk about the importance of our friendship | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm7` | Talk about sex a lot | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm8` | Comfortable discussing my sexual desires and needs with partner | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm9` | Partner is comfortable discussing sexual desires and needs with me | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm10` | Clearly defined rules about sexual contact with other people | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm11` | Regularly discuss safe-sex practices | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm12` | Established sexual boundaries with one another | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm13` | Talked about sexually transmitted diseases (STDs) | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm14` | Talked about birth control (contraception) | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm15` | Discussed sexually transmitted disease testing history | 0 to 8 [Values 1–9] | Wave 1 |
| **Sexual Communication & Rules** | `comm16` | Discussed using condoms with each other | 1 (Do Not Agree At All) to 7 (Agree Completely) [Values 1–7] | Wave 1 |
| **Sexual Communication & Rules** | `comm17` | Discussed using condoms if having sex outside relationship | 1 to 7 [Values 1–7] | Wave 1 |
| **Sexual Communication & Rules** | `comm18` | Discuss sexual experiences outside relationship with each other | 1 to 7 [Values 1–7] | Wave 1 |
| **Sexual Communication & Rules** | `comm19` | Do not care if partner has sex with other people | 1 to 7 [Values 1–7] | Wave 1 |
| **Sexual Communication & Rules** | `comm20` | Partner does not care if I have sex with other people | 1 to 7 [Values 1–7] | Wave 1 |
| **Sexual Communication & Rules** | `t2comm1` | Communicated about relationship rules since original survey | 1 (Do Not Agree At All) to 9 (Agree Completely) | Wave 2 |
| **Sexual Communication & Rules** | `t2comm2` | Communicated about outside sexual allowances since original survey | 1 (Do Not Agree At All) to 9 (Agree Completely) | Wave 2 |
| **Sexual Communication & Rules** | `bur10` | Failed to define what relationship was and was not (breakup cause) | 1 (Not At All) to 9 (Very Much) | Wave 2 |
| **Sexual Communication & Rules** | `bur11` | Failed to establish rules about sexual contact with others (breakup cause) | 1 (Not At All) to 9 (Very Much) | Wave 2 |
| **Sexual Communication & Rules** | `bur12` | Failed to communicate enough about relationship (breakup cause) | 1 (Not At All) to 9 (Very Much) | Wave 2 |
| **Investment** | *None* | **Not found** (no Investment Model items measuring resource expenditure) | N/A | Waves 1 & 2 |
| **Costs** | *None* | **Not found** (no relational burden or cost inventory) | N/A | Waves 1 & 2 |
| **Rewards** | *None* | **Not found** (no independent reward scale; satisfaction items serve as evaluations) | N/A | Waves 1 & 2 |
| **Commitment (FWB)** | `fwbcom1` | Feel very attached to our friends with benefits relationship | 0 (Do Not Agree At All) to 8 (Agree Completely) [Values 1–9] | Wave 1 |
| **Commitment (FWB)** | `fwbcom2` | Want our friends with benefits relationship to last forever | 0 to 8 [Values 1–9] | Wave 1 |
| **Commitment (FWB)** | `fwbcom3` | Committed to maintaining our friends with benefits relationship | 0 to 8 [Values 1–9] | Wave 1 |
| **Commitment (Friendship)** | `fricom1` | Committed to maintaining our friendship | 1 (Do Not Agree At All) to 7 (Agree Completely) | Wave 1 |
| **Commitment (Friendship)** | `fricom2` | Feel very attached to our friendship | 1 to 7 | Wave 1 |
| **Commitment (Sexual)** | `sexcom1` | Committed to maintaining our sexual relationship | 1 to 7 | Wave 1 |
| **Commitment (Sexual)** | `sexcom2` | Feel very attached to our sexual relationship | 1 to 7 | Wave 1 |
| **Commitment (Partner Perceived)** | `ppfricom1` | Partner feels very attached to our friendship | 0 to 8 [Values 1–9] | Wave 1 |
| **Commitment (Partner Perceived)** | `ppfricom2` | Partner is committed to maintaining our friendship | 0 to 8 [Values 1–9] | Wave 1 |
| **Commitment (Partner Perceived)** | `ppsexcom1` | Partner feels very attached to our sexual relationship | 0 to 8 [Values 1–9] | Wave 1 |
| **Commitment (Partner Perceived)** | `ppsexcom2` | Partner is committed to maintaining our sexual relationship | 0 to 8 [Values 1–9] | Wave 1 |
| **Commitment (FWB Wave 2)** | `t2fwbcom1` | Feel very attached to our friends with benefits relationship | 1 (Do Not Agree At All) to 9 (Agree Completely) | Wave 2 |
| **Commitment (FWB Wave 2)** | `t2fwbcom2` | Want our friends with benefits relationship to last forever | 1 to 9 | Wave 2 |
| **Commitment (FWB Wave 2)** | `t2fwbcom3` | Committed to maintaining our friends with benefits relationship | 1 to 9 | Wave 2 |
| **Commitment (Friendship Wave 2)** | `t2fricom1` | Committed to maintaining our friendship | 1 to 9 | Wave 2 |
| **Commitment (Friendship Wave 2)** | `t2fricom2` | Feel very attached to our friendship | 1 to 9 | Wave 2 |
| **Commitment (Sexual Wave 2)** | `t2sexcom1` | Committed to maintaining our sexual relationship | 1 to 9 | Wave 2 |
| **Commitment (Sexual Wave 2)** | `t2sexcom2` | Feel very attached to our sexual relationship | 1 to 9 | Wave 2 |
| **Exclusivity** | `exclusive` | "Are you and your 'friend with benefits' sexually exclusive...?" | 1 = Yes, 2 = No | Wave 1 |
| **Exclusivity (Partner)** | `fwbothrels` | Partner has other relationships (additional FWB, romantic, none, other) | 1 = FWB, 2 = Romantic, 3 = No, 4 = Other | Wave 1 |
| **Exclusivity (Respondent)** | `othrels` | Respondent has other relationships besides this FWB | 1 = FWB, 2 = Romantic, 3 = No, 4 = Other | Wave 1 |
| **Exclusivity (Knowledge)** | `fwbknowothrels` | Partner knows about outside sexual involvement | 1 = Yes, 2 = No, 3 = Unsure, 4 = N/A | Wave 1 |
| **Exclusivity (Wave 2)** | `t2exclusive` | "Are you and your 'friend with benefits' sexually exclusive...?" | 1 = Yes, 2 = No | Wave 2 |
| **Relationship Duration** | `knownfwb` | Total duration known partner in years and months | Open numeric (recorded in months) | Wave 1 |
| **Relationship Duration** | `sexdur` | Total duration sexually involved with partner | Open numeric (recorded in months) | Wave 1 |
| **Relationship Duration** | `FOLLOW_TIME` | Interval between Wave 1 and Wave 2 surveys | Open numeric (in months) | Wave 2 |
| **Transitions (Hoped)** | `future` | Desired change: stay same, romantic couple, friends no sex, terminate | 1 = Same, 2 = Romance, 3 = Friends, 4 = End, 5 = Other | Wave 1 |
| **Transitions (Partner Hoped)** | `fwbfuture` | Perceived partner desired change: stay same, romance, friends, terminate | 1 = Same, 2 = Romance, 3 = Friends, 4 = End, 5 = Other | Wave 1 |
| **Transitions (Observed)** | `t2relstat` | Current relationship status at follow-up | 1 = Still FWB, 2 = Friends no sex, 3 = Romance, 4 = None | Wave 2 |
| **Transitions (Breakup Reasons)** | `bur1`–`bur9` | Contribution of differing romantic, friendship, or exit desires to dissolution | 1 (Not At All) to 9 (Very Much) | Wave 2 |
| **Transitions (Breakup Open)** | `buropen` | Primary reason relationship dissolved | Open text | Wave 2 |
| **Transitions (Post-FWB Sex)** | `busex` | Sexual contact with former partner since ending FWB | 1 = Yes, 2 = No | Wave 2 |
| **Transitions (Future Expected)** | `bufuture` | Future expectation: FWB, romantic couple, friends no sex, none | 1 = FWB, 2 = Romance, 3 = Friends, 4 = None | Wave 2 |
| **Transitions (Future Partner)** | `buppfuture` | Perceived partner future expectation | 1 = FWB, 2 = Romance, 3 = Friends, 4 = None | Wave 2 |
| **Transitions (Continuing Future)** | `t2future` | Future expectation among those still FWB | 1 = FWB, 2 = Romance, 3 = Friends, 4 = None | Wave 2 |
| **Transitions (Continuing Partner)** | `t2ppfuture` | Perceived partner future expectation among those still FWB | 1 = FWB, 2 = Romance, 3 = Friends, 4 = None | Wave 2 |
| **Non-Sexual Exchange** | *None* | **Not found** (zero items measure gifts, money, paid dates, meals, or instrumental assistance) | N/A | Waves 1 & 2 |

---

## 2. Dataset Characteristics (`fwb_data.xlsx`)

### Dimensions
- **Rows (Observations):** 192
- **Columns (Variables):** 178

### Participant Sample by Gender (`SEX`)
- **Female (`SEX == 1.0`):** 134 (69.8%)
- **Male (`SEX == 2.0`):** 57 (29.7%)
- **Missing / Unspecified (`SEX == NaN`):** 1 (0.5%)
- **Total N:** 192

### Matched Variables Present in the File
All annotated items identified in the survey codebooks appear as columns in `fwb_data.xlsx`:
- **Demographics:** `SEX`, `fwbsex`, `AGE`, `sexualo`, `sexualooth`, `RACE`, `COUNTRY`, `countryoth`, `student`
- **Duration and History:** `knownfwb`, `sexdur`, `currfwb`, `currfwbnum`, `lifefwbnum`, `fwbstart`, `FOLLOW_TIME`
- **Exclusivity:** `exclusive`, `fwbothrels`, `othrels`, `fwbknowothrels`, `t2exclusive`
- **Motives:** `motive1`, `motive2`, `motive3`, `motive4`, `motive5`, `motive6`, `motive`
- **Time Allocation & Behaviors:** `sexfreq`, `frifreq`, `sexpercent`, `fripercent`, `sexact1` through `sexact7`, `sexact7oth`
- **Orgasm:** `orgasm1`, `orgasm2`, `orgasm3`
- **Sexual Satisfaction:** `sexsat1`, `sexsat2`, `t2sexsat1`, `t2sexsat2`
- **Friendship Satisfaction:** `frisat1`, `frisat2`, `t2frisat1`, `t2frisat2`
- **Commitment Scales:** `fwbcom1`–`fwbcom3`, `fricom1`–`fricom2`, `sexcom1`–`sexcom2`, `ppfricom1`–`ppfricom2`, `ppsexcom1`–`ppsexcom2`, `t2fwbcom1`–`t2fwbcom3`, `t2fricom1`–`t2fricom2`, `t2sexcom1`–`t2sexcom2`
- **Communication & Rules:** `comm1` through `comm20`, `t2comm1`, `t2comm2`
- **Transitions and Outcomes:** `future`, `fwbfuture`, `t2relstat`, `bur1` through `bur12`, `buropen`, `busex`, `bucondom`, `bufuture`, `buppfuture`, `t2currel`, `t2future`, `t2ppfuture`
- **Auxiliary Constructs:** Social network support (`sn1`–`sn12`), Secrecy (`secret1`–`secret10`), Condom use and STIs (`condomuse1`–`condomuse6`, `sextimes`, `condomtimes`, `alcohol`, `stitest`, `stidiag`, `sti1`–`sti9oth`), Sexist attitudes (`sexism1`–`sexism10`), Erotophilia (`erotic1`–`erotic8`).

---

## 3. Feasibility of Hypotheses and Research Questions

### (a) Women's Orgasm in FWB: Measurable at Wave 1 Only
- **Status:** **Measurable at Wave 1; Absent at Wave 2.**
- **Details:** Wave 1 contains three orgasm frequency items: `orgasm1` (vaginal intercourse with FWB), `orgasm2` (other sexual activities such as oral sex with FWB), and `orgasm3` (solitary masturbation). These items use a 1 (Never) to 9 (Always) scale, with response value 10 representing N/A. Among women (`SEX == 1`):
  - Intercourse orgasm (`orgasm1`, excluding N/A): Mean = 5.800, SD = 3.141, n = 95 (7 marked N/A, 32 missing).
  - Other activities orgasm (`orgasm2`, excluding N/A): Mean = 5.742, SD = 3.011, n = 97 (6 marked N/A, 31 missing).
  - Masturbation orgasm (`orgasm3`, excluding N/A): Mean = 7.879, SD = 2.182, n = 99 (4 marked N/A, 31 missing).
- **Limitation:** Wave 2 omits orgasm questions entirely, which restricts orgasm analysis to a single cross-sectional wave.

### (b) Sexual Satisfaction in FWB: Measurable at Both Waves (Conditional at Wave 2)
- **Status:** **Measurable at Wave 1 and Wave 2.**
- **Details:** Wave 1 captures sexual satisfaction via two items (`sexsat1` and `sexsat2`) scored 1 to 7. Wave 2 repeats these items (`t2sexsat1` and `t2sexsat2`) using a 1 to 9 response scale.
- **Limitation:** At Wave 2, sexual satisfaction was administered exclusively to respondents whose relationship remained an active FWB (`t2relstat == 1`, n = 49). Participants whose relationships dissolved, became platonic friendships, or converted to romantic partnerships were branched away from satisfaction items. Longitudinal analysis of satisfaction is thus constrained by survivor bias.

### (c) Sexual Reciprocity: Cannot Be Measured
- **Status:** **Cannot be measured (Not found).**
- **Details:** The survey contains zero variables assessing reciprocity in sexual pleasure, equity of sexual focus, mutual oral sex exchanges, or attention to partner orgasm. The instrument includes only checklist item `sexact3` ("Mutual masturbation") and communication comfort items `comm8`/`comm9` ("comfortable discussing my sexual desires" and "partner is comfortable discussing his/her sexual desires"). Measures of reciprocal sexual pleasure or shared orgasm remain absent.

### (d) Non-Sexual Exchange: Cannot Be Measured
- **Status:** **Cannot be measured (Not found).**
- **Details:** The survey contains zero variables tracking financial transfers, gift giving, paying for meals, dating expenditures, or instrumental favors. The instrument records only general time allocation: `frifreq` (frequency of hanging out without sex) and `fripercent` (percentage of time spent on friendship activities). Neither variable assesses material exchange or provisioning.

### (e) Comparison with Romantic Relationships or Hookups: Cannot Be Measured Directly
- **Status:** **Cannot be measured directly (No comparative cohort).**
- **Details:** All participants were actively involved in an FWB relationship at baseline (`currfwb == 1`). There is no control or comparison cohort of individuals in exclusive romantic relationships or casual one-night hookups.
- **Relational Artifacts:**
  - `sexsat1` asks whether "Our sexual relationship is much better than others' sexual relationships." This item provides an individual normative assessment without establishing an empirical comparison group.
  - `fwbstart` tracks origin pathway (friends first, romantic partners first, or hookup first).
  - `t2relstat` identifies individuals whose FWB transitioned into romance (n = 28) or reverted to platonic friendship (n = 54). However, post-transition participants did not complete sexual satisfaction or relationship quality scales at Wave 2. Direct empirical comparisons of sexual outcomes between relationship forms cannot be conducted.

---

## 4. Descriptive Statistics for Sexual Satisfaction by Gender

The statistics below summarize sexual satisfaction by participant gender at Wave 1 and Wave 2. 

**Statement on Analytical Status:** These statistics are descriptive only. They describe the sample distribution without causal inferences, statistical control, or population weighting.

### Wave 1 Sexual Satisfaction (Scale: 1 = Do Not Agree At All to 7 = Agree Completely)

| Variable | Gender | n | Mean | SD |
| :--- | :--- | :--- | :--- | :--- |
| **`sexsat1`** ("much better than others") | Female | 131 | 4.588 | 2.115 |
| | Male | 57 | 4.825 | 1.764 |
| | Overall Sample | 189 | 4.672 | 2.015 |
| **`sexsat2`** ("satisfied with our sexual relationship") | Female | 132 | 5.265 | 1.729 |
| | Male | 57 | 5.509 | 1.390 |
| | Overall Sample | 190 | 5.347 | 1.635 |
| **Wave 1 Composite** (`mean(sexsat1, sexsat2)`) | Female | 133 | 4.921 | 1.764 |
| | Male | 57 | 5.167 | 1.415 |
| | Overall Sample | 191 | 4.992 | 1.667 |

### Wave 2 Sexual Satisfaction (Scale: 1 = Do Not Agree At All to 9 = Agree Completely)
*Administered only to participants maintaining active FWB relationships at follow-up (`t2relstat == 1`).*

| Variable | Gender | n | Mean | SD |
| :--- | :--- | :--- | :--- | :--- |
| **`t2sexsat1`** ("much better than others") | Female | 26 | 6.115 | 2.438 |
| | Male | 22 | 6.318 | 1.729 |
| | Overall Sample | 48 | 6.208 | 2.123 |
| **`t2sexsat2`** ("satisfied with our sexual relationship") | Female | 27 | 6.370 | 2.339 |
| | Male | 22 | 7.045 | 1.704 |
| | Overall Sample | 49 | 6.673 | 2.086 |
| **Wave 2 Composite** (`mean(t2sexsat1, t2sexsat2)`) | Female | 27 | 6.222 | 2.263 |
| | Male | 22 | 6.682 | 1.563 |
| | Overall Sample | 49 | 6.429 | 1.977 |

### Analysis Code

The following Python script computes the descriptive statistics reported above:

```python
import pandas as pd
import numpy as np

# Load dataset
df = pd.read_excel('fwb_data.xlsx')

def compute_descriptives(series):
    clean = series.dropna()
    return {
        'n': int(clean.count()),
        'mean': round(float(clean.mean()), 3),
        'sd': round(float(clean.std()), 3)
    }

# Wave 1 items (1-7 scale)
w1_vars = ['sexsat1', 'sexsat2']
df['w1_sexsat_comp'] = df[w1_vars].mean(axis=1)

# Wave 2 items (1-9 scale, continuing FWBs only)
w2_vars = ['t2sexsat1', 't2sexsat2']
df['w2_sexsat_comp'] = df[w2_vars].mean(axis=1)

target_variables = [
    ('Wave 1: sexsat1', 'sexsat1'),
    ('Wave 1: sexsat2', 'sexsat2'),
    ('Wave 1: Composite', 'w1_sexsat_comp'),
    ('Wave 2: t2sexsat1', 't2sexsat1'),
    ('Wave 2: t2sexsat2', 't2sexsat2'),
    ('Wave 2: Composite', 'w2_sexsat_comp'),
]

results = []
for label, col in target_variables:
    overall = compute_descriptives(df[col])
    female = compute_descriptives(df[df['SEX'] == 1.0][col])
    male = compute_descriptives(df[df['SEX'] == 2.0][col])
    results.append({
        'Variable': label,
        'Female_n': female['n'], 'Female_Mean': female['mean'], 'Female_SD': female['sd'],
        'Male_n': male['n'], 'Male_Mean': male['mean'], 'Male_SD': male['sd'],
        'Overall_n': overall['n'], 'Overall_Mean': overall['mean'], 'Overall_SD': overall['sd'],
    })

results_df = pd.DataFrame(results)
print(results_df.to_string(index=False))
```

---

## 5. Published Paper Identification

- **Codebook and File Name Finding:** **Not identified.**
  The text headers in `codebook_time1.pdf` and `codebook_time2.pdf` redact author identities, faculty affiliations, and institutional review board details. The file names (`codebook_time1.pdf`, `codebook_time2.pdf`, `fwb_data.xlsx`) contain generic descriptive titles. The files omit citations, publication references, and paper titles.
- **External OSF Repository Provenance:**
  The public Open Science Framework project (`https://osf.io/pazmy/`) records Laura VanderDrift Machia (Syracuse University), Morgan L. Proulx (Syracuse University), and Justin J. Lehmiller (The Kinsey Institute) as bibliographic contributors. The empirical publication matching this longitudinal dataset is:
  > Machia, L. V., Proulx, M. L., Ioerger, M., & Lehmiller, J. J. (2020). A longitudinal study of friends with benefits relationships. *Personal Relationships*, 27(1), 47–60. https://doi.org/10.1111/pere.12307
