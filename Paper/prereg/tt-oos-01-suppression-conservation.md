# TT-OOS-01 — Suppression Conservation and the Extraction Surcharge

**Status:** pre-registered, untested at time of commit
**Registered:** 2026-08-09
**Purpose:** An out-of-sample test of the Theodore Transform. A theorem is derived in the
electrodynamic image, its pre-image is computed, the pre-image is verified absent from the
historical chapters, and the prediction is registered here *before* the data is examined.

This document exists to answer one question: has the framework predicted a structure that was
not used to build it?

---

## 1. Why this theorem

Appendix `apx_theodore_transform.tex` §Use II claims the cross-domain transform does real work,
and cites four theorems — Buffer Matching, Reform Monotonicity, Quarter-Wave Co-optation,
Cultural Bias — whose pre-images "match claims the historical chapters had already established"
(line 224). Those are retrodictions. The correspondence was built against the record and then
confirmed against the record.

The transform earns explanatory status only if a theorem derived in the image yields a pre-image
that is **absent** from the record, and that pre-image then survives contact with data.

Verified absent from the manuscript (`grep -ril` over `Paper/**.tex`, `chapters/**.tex`):
`Friis`, `noise figure`, `sensitivity integral`, `waterbed`, `reactance theorem`, `group delay`.
The only `Bode` occurrences are Bode–**Fano** (`apx_extraction_chart.tex:305–321`), a different
theorem — see §4.

## 2. Derivation in the image domain

The manuscript already supplies the loop. Appendix `app:universality`,
Eq. `app-universality-objective`:

    max_u  E(t)   subject to   M(t) < tau,   qdot = f(q,u),   q(0) = q0

This is a regulation problem: the architecture applies control `u` (the phase-loading law
`rho_k(t)`) to hold coherence `M(t)` below threshold `tau`. Linearize about the operating point
and let `L(s)` be the open-loop transfer of plant and controller in series. The closed-loop map
from exogenous disturbance `d` to regulated coherence `y = M` is the **sensitivity function**

    S(s) = 1 / (1 + L(s)),        y = S(s) d

`|S(jw)| < 1` is suppression at frequency `w`; `|S(jw)| > 1` is amplification.

**Bode's sensitivity integral.** For rational `L(s)` of relative degree >= 2, with right-half-plane
poles `{p_k}` and a stable closed loop:

    integral_0^inf  ln|S(jw)|  dw  =  pi * sum_k Re(p_k)                     (BSI)

For an open-loop *stable* plant the right-hand side is exactly zero: total log-sensitivity is
conserved. Suppression at one frequency is repaid, exactly, by amplification at others.

**The framework's own condition forces the poles to be unstable.** Conjecture `conj:universality`
condition 2 (`The_Original_Power.tex:15276`) states that a subset of nodes amplifies its own
resource share by altering the rules of distribution. A self-amplifying loop with gain above unity
is an open-loop right-half-plane pole: `Re(p) > 0`. The extraction kernel is open-loop unstable by
construction — that instability is what the word *extraction* denotes dynamically. Therefore the
right-hand side of (BSI) is **strictly positive**.

> **Theorem (Suppression Conservation and the Extraction Surcharge).**
> The extraction architecture cannot reduce coherence at all timescales simultaneously. Its total
> log-sensitivity is conserved and strictly positive, equal to `pi` times the sum of its own
> extraction growth rates. Suppression bought at one timescale is repaid with amplification at
> others, and the repayment strictly exceeds the purchase by an amount the extraction rate itself
> fixes.

## 3. Pre-image under TT^-1

Two social-domain claims, obtained by substitution along the correspondence of
`apx_theodore_transform.tex` §Use II:

**(a) Waterbed.** Unrest damped at one timescale is relocated in frequency, not removed. An
architecture that succeeds at suppressing short-cycle coherence necessarily amplifies coherence at
some other period.

**(b) Surcharge.** The architecture is net-amplifying, and the surcharge scales with the extraction
rate. Faster extraction forces strictly more total unrest. The system's own success sets the floor
on the unrest it must contain.

## 4. Verification that the pre-image is absent from the record

| Existing result | Quantity | Index | Claim |
|---|---|---|---|
| Reform Monotonicity (`xc.7`) | absorbed power vs `\|Gamma\|` | single frequency | direction of one intervention |
| Bode–Fano (`xc.13`) | **match** `\|Gamma\|`, upper bound | **axes** | matching budget is capped |
| Cannibalization (ch. `full_algo`) | ordinal | **axes** | axes activate sequentially |
| **This theorem** | **sensitivity `\|S\|`, conserved lower bound** | **timescales** | **suppression is conserved and net-amplifying** |

Bode–Fano bounds how well a load can be *matched* across a band. This theorem bounds how well a
disturbance can be *rejected* across a band. Different quantity, different index set, opposite
direction of bound. Neither the conservation-across-timescales claim nor the extraction-surcharge
claim appears anywhere in the manuscript.

## 5. Registered predictions

**Series.** `Paper/data/congressional_record_word_freq.csv`, 1965–2024, n = 60 annual points.
`y(t) = class_share`, taken as the observable of cross-group coherence `M(t)`. Justification is
internal to the framework: Eq. `3.3-race-destroys-class` states the racial partition dissipates
class coherence, so class-band share is the regulated output the architecture works against.

**Empirical sensitivity.** Control authority rises monotonically across the series
(`identity_share` runs 0.066 → 0.718). Treat the early epoch as low control authority and the late
epoch as high. The frequency-wise gain the intensified regime applied to coherence is

    Shat(f) = sqrt( P_late(f) / P_early(f) )

**P1 — Waterbed sign change.** `ln|Shat(f)|` changes sign across the resolved band: at least one
bin with `Shat < 1` and at least one with `Shat > 1`.
*Falsified if* `ln|Shat|` holds constant sign across all non-DC bins — that is uniform rescaling,
not a waterbed.

**P2 — Net amplification (the risky one).** `integral_0^0.5 ln|Shat(f)| df > 0`.
*Falsified if* the integral is `<= 0`. An open-loop-stable architecture gives exactly 0; a
suppression regime that genuinely reduces coherence at every scale gives a negative value. Only an
open-loop-unstable extractor gives a positive value.

**P3 — Carrier suppression with conserved log-integral.** Band power at the 4-yr electoral carrier
(`f = 0.25` cyc/yr) declines between epochs, `Δ ln P(0.25) < 0`, while the geometric-mean power
does not decline as much: `Δ ln GM >= Δ ln P(0.25)`.
*Falsified if* the geometric mean falls by at least as much as the carrier band.

**Analysis choices, fixed now.**
- Epoch split at the series midpoint: 1965–1994 (n = 30), 1995–2024 (n = 30).
- Linear detrend of `class_share` within each epoch separately, then mean-remove. The secular
  decline is a trend, not a spectral feature.
- Hann taper, periodogram via `numpy.fft.rfft`. Resolved band 1/30 … 0.5 cyc/yr.
- Integral: mean of `ln Shat` over all non-DC bins, times the 0.5 cyc/yr bandwidth.
- Carrier band: the single bin nearest `f = 0.25`.
- No re-splitting, no alternative detrending, no bin exclusion if the result comes out null.

**Reported but not registered pass/fail** (robustness only): Welch estimate with `nperseg = 20`
and 50% overlap; alternative epoch splits at 1990 and 2000.

## 6. What each outcome means

- **P1, P2, P3 all hold** — the transform produced a structure absent from the record that then
  survived data. That is the out-of-sample result the appendix currently lacks.
- **P2 fails, sign negative** — the architecture is net-suppressing, which contradicts the
  positive-feedback condition of `conj:universality`. That is a hit on the conjecture, and it is
  falsification condition 3 of `app:universality` arriving by a new route.
- **P1 fails** — no waterbed; the regime rescales coherence uniformly. The control-loop reading of
  the architecture is wrong and §Use II loses its strongest instance.
- **Null or underpowered** — 30 points per epoch resolves the 4-yr band at roughly 7.5 bins. A null
  is reported as a null. It is not re-cut.

A null result gets committed and reported exactly as a positive one does. That is the whole point
of registering first.
