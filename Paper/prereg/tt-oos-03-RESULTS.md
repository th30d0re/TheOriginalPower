# TT-OOS-03 — Results

**Registration:** `Paper/prereg/tt-oos-03-gender-wage-pair.md`, commit `7e8f151`,
committed before the script was written and before the data was examined.
**Executed:** 2026-08-09, `Paper/scripts/tt_oos_03_gender_wage_pair.py`
**Data:** FRED `LES1252881900Q`, `LES1252882800Q`, `OPHNFB`. 187 quarters,
1979 Q1 – 2025 Q3.

## Verdict as registered

| | Prediction | Result |
|---|---|---|
| **P1** | both branches show positive real earnings growth | **HOLDS** |
| **P2** | both grow below productivity | **HOLDS** |
| **P3** | women's earnings/productivity ratio improves vs men's | **HOLDS** |

    real growth 1979-2025, log ratio of 4-quarter means
      men           +0.0258   ( +2.6%)
      women         +0.3021   (+35.3%)
      productivity  +0.8621   (+136.8%)

    earnings/productivity ratio at window end
      men    0.4235
      women  0.5570

    P3 trend on log(women/men) ratio difference
      +0.001404 per quarter, 95% CI [+0.001142, +0.001667], Newey-West 8 lags
      +0.2626 log points over the window

## What holds, and how strongly

**P2 is the robust result.** Both branches capture a fraction of productivity growth —
men 42%, women 56%. Neither branch is a net accumulator against the external reference,
so **Buffer Matching is not falsified for either branch** under
`apx_extraction_chart.tex:471`. Both are loads. Both are extracted from.

**P1 holds on the letter and is nearly a null for men.** Men's real median weekly earnings
grew 2.6% across forty-seven years — roughly 0.05% a year, statistically a flat line. The
registration defined "flat real earnings against rising productivity" as the `I_buffer`
signature. Men's branch does not meet the falsification threshold, and it sits close
enough to it that the honest description is *near-flat*, not *growing*.

**P3 holds decisively on its own terms** — the interval is tight and far from zero.

## The finding runs opposite to the hypothesis it was built to test

The hypothesis was that the Buffer Class position is shifting from men toward women. On
this measure the buffer signature is a flat material wage, and it is **men's branch** that
approximates it — while women's branch moved *away* from that signature over the window,
toward being a better-compensated load.

So the material component supports "contested" — both branches carry a material wage, both
are extracted from, neither is purely reactive — and simultaneously cuts against "shifting
toward women." The direction of travel is women's branch becoming *less* buffer-like, not
more.

## The confound this design cannot exclude

Women's full-time labour force participation rose enormously across this window, and the
composition of full-time women workers changed with it — more educated, more
professional-track. That alone would produce a rising women's earnings series and a
positive P3 trend with no structural change whatsoever.

The registration flagged composition change and protected against it for *level*
comparisons only. P3 compares trends rather than levels, which reduces the exposure without
removing it. **P3 should not be read as evidence of structural movement until it is
replicated on a composition-controlled series** — cohort-fixed, or within-occupation, or
hours-adjusted.

P1 and P2 are far less exposed, because each reads a single branch against productivity
rather than against the other branch.

## What remains unmeasured

The hypothesis is about a **pair**: material *and* psychological wage. This test measures
`ψ_m` only. `ψ_s` — status compensation, the reactive component `x`, the quantity the
Buffer Work Theorem says performs zero net work — appears nowhere in earnings data and is
not touched here.

A branch can carry a material wage and still be the buffer if its `x/r` ratio is high, and
nothing in this result speaks to `x`. Claiming the wage-pair hypothesis confirmed on the
strength of P1 would be claiming half a result.

## Bottom line

Three registered predictions, three holds, on the first clean sweep of the three tests run
in this session. Read conservatively:

- Both gendered branches are loads under extraction. That is real and robustly measured.
- Neither is a pure buffer on the material component.
- The relative movement favours women's material capture, with a live alternative
  explanation this design cannot rule out.
- The psychological half of the wage pair is unmeasured, so the hypothesis as stated is
  supported in part and untested in part.
