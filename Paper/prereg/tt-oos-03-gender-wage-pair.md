# TT-OOS-03 — Does Each Gendered Branch Carry a Material Wage?

**Status:** pre-registered, untested at time of commit
**Registered:** 2026-08-09
**Precedents:** `tt-oos-01-suppression-conservation.md` (`d032213`),
`tt-oos-02-gender-branch-trajectory.md` (`d6976d6`)

## 1. The arithmetic constraint that shapes this test

Emmanuel's hypothesis: both gendered branches receive a material and psychological wage
pair, so neither is a clean `I_buffer`.

Measured **within the axis**, this is not testable — it is arithmetically excluded. If
income shares sum to one and labour-contribution shares sum to one, then
(income − contribution) across the two branches sums to exactly zero. One branch is
positive and the other negative, necessarily. Net-of-contribution accumulation is
zero-sum inside a closed two-branch accounting.

The hypothesis is coherent only against a reference **outside** the gender axis. This
test uses productivity as that reference, which is the manuscript's own extraction
measure — `Paper/data/eq10_18_wage_asset_divergence.csv` carries productivity and
compensation as its central columns.

## 2. The buffer signature in this measure

`I_buffer` has `P_real = 0`: no net real power, compensated in `Q_reactive` alone. In this
measure a pure buffer's **real** material wage is flat — its earnings do not grow, while
the system's output per hour does. A load being extracted from has earnings that grow but
grow *below* productivity, the gap being the extraction.

    flat real earnings, rising productivity   -> buffer signature (r ~ 0)
    rising earnings, below productivity        -> load, extracted from (r > 0)
    earnings at or above productivity          -> net accumulator

## 3. Data

- `LES1252881900Q` — median usual weekly **real** earnings, men, full-time wage and
  salary workers, quarterly 1979 Q1 – 2026 Q2
- `LES1252882800Q` — the same for women
- `OPHNFB` — nonfarm business sector real output per hour, quarterly

All from FRED, no key required. Series are already in constant dollars, so no deflation
is applied.

**Confound registered in advance.** Median usual weekly earnings covers full-time wage
and salary workers only. It excludes part-time work, self-employment, and non-participants,
and its composition shifts as women's full-time participation rises. Composition change
inflates or deflates *level* comparisons between branches. This test therefore reads
**growth rates and productivity ratios within each branch**, and treats between-branch
level differences as uninterpretable.

## 4. Analysis choices, fixed now

- Window 1979 Q1 – 2025 Q4, dropping any partial final year.
- Index each series to 100 at 1979 Q1.
- Growth measured as the log ratio of the last four-quarter mean to the first four-quarter
  mean, so no single quarter drives a result.
- `productivity ratio` for a branch = (branch earnings index) / (productivity index) at the
  end of the window.
- Newey-West standard errors, 8 lags, on a linear trend fit to each branch's log
  earnings-to-productivity ratio.
- No re-windowing, no alternative deflator, no switch to mean earnings if the result is
  null.

## 5. Registered predictions

**P1 — Both branches carry a material wage.** Real earnings growth is strictly positive
for **both** men and women over the window.
*Falsified if* either branch's growth is zero or negative. A flat branch is the buffer
signature and would identify that branch as `I_buffer` in the theorem's sense.

**P2 — Both branches are extracted from.** Real earnings growth is **below** productivity
growth for both branches.
*Falsified if* either branch meets or exceeds productivity growth, which would make that
branch a net accumulator rather than a load.

**P3 — The buffer position is shifting toward women.** Women's earnings-to-productivity
ratio improves relative to men's across the window, with the trend coefficient on the
difference positive and its Newey-West interval excluding zero.
*Falsified if* the difference trends the other way, or if its interval contains zero.

## 6. What each outcome means

- **P1 holds, P2 holds** — both branches are loads with `r > 0`, neither is a pure buffer,
  and the contested-axis reading is supported on the material component. The psychological
  component is not measured here and is not claimed.
- **P1 fails for men** — men's real material wage is flat against rising productivity,
  which is the `I_buffer` signature. That supports the *classical* assignment the
  manuscript already uses on the racial axis, transposed to gender, and cuts against a
  shift.
- **P1 fails for women** — the buffer signature sits on the women's branch instead.
- **P2 fails for either branch** — that branch accumulates net of contribution against an
  external reference, which falsifies Buffer Matching for it under
  `apx_extraction_chart.tex:471`.
- **P3 alone** decides direction of travel. P1 and P2 describe the present state.

A null is committed and reported as a null.
