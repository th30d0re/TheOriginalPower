# Exploratory re-analysis: OSF "Longitudinal FWB" (osf.io/pazmy)

Run by Claude on 2026-10-12, checking Gemini's `codebook_audit.md`. Data: `fwb_data.xlsx`, N = 192 people currently in an FWB (134 women, 57 men), Wave 1 plus a follow-up. **Exploratory, unpreregistered, small cells, multiple tests. Treat p-values as descriptive.** Orgasm items are 1 (never) to 9 (always), with 10 = N/A dropped. "Orgasm" = mean of intercourse and other-activities items. Sexual satisfaction = mean of `sexsat1` and `sexsat2` (1–7).

The audit's descriptives reproduce exactly (women `orgasm1` 5.80, SD 3.14, n = 95).

| Test | Result |
|---|---|
| Orgasm with FWB partner during intercourse, women vs. men | 5.80 vs. 7.48 out of 9: **the gap persists inside FWB** |
| Women: comfort discussing **own** sexual desires × orgasm | **r = .41**, n = 100, p < .001 |
| Women: **partner's** comfort discussing desires × her orgasm | **r = .36** |
| Men: communication comfort × own orgasm | r = .03, n.s. |
| Women who want the FWB to stay the same vs. women who want romance | Orgasm 6.06 vs. 5.74; satisfaction 5.33 vs. 5.26; **no difference** |
| Women who want romance **and** believe he wants it unchanged (the mismatch case) vs. "stay the same" | Orgasm 4.86 vs. 6.06 (n = 18/40, p = .19); satisfaction 4.90 vs. 5.33 (p = .31). **Direction fits, not significant** |
| Women who want to go back to just friends vs. "stay the same" | Satisfaction **3.67 vs. 5.33**, p = .001; orgasm 5.10 vs. 6.06, n.s. |
| Women's baseline orgasm by follow-up status | Still FWB 6.28; became friends 5.62; became romance 6.13; ended 5.41. Still FWB vs. ended, p = .32 |

## Reading

- **Communication carries the most weight in this dataset.** For women, being able to talk about what she wants, and having a partner who can, is the strongest correlate of orgasm here. For men it doesn't matter. This matches the "tell me, so I can calibrate" argument and the Mallory et al. (2019) meta-analysis.
- **Dissatisfied women want out.** Women whose FWB sex is unsatisfying want to revert to friendship. That's consistent with "if she isn't satisfied, she won't continue it."
- **The mismatch case** (she wants romance and he wants it unchanged, the extraction loop) points toward lower orgasm, but n = 18 can't confirm it.
- **The dataset cannot test** reciprocity directly, non-sexual exchange, or any comparison with romantic relationships or hookups (no such items or groups). Orgasm is Wave 1 only.

Code: inline in the session; re-run with pandas, scipy and openpyxl against `fwb_data.xlsx`.
