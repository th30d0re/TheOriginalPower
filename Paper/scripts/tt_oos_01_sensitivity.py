"""TT-OOS-01: empirical test of Suppression Conservation.

Executes exactly the analysis registered in
Paper/prereg/tt-oos-01-suppression-conservation.md (commit d032213), which was
committed before this script was written and before the data was examined.

No analysis choice here may be changed in response to the result.
"""

import numpy as np
import pandas as pd
from scipy.signal import detrend, welch

CSV = "Paper/data/congressional_record_word_freq.csv"
SPLIT = 1994  # registered: series midpoint, early <= 1994 < late


def spectrum(x):
    """Registered estimator: linear detrend, mean-remove, Hann taper, periodogram."""
    x = detrend(np.asarray(x, dtype=float), type="linear")
    x = x - x.mean()
    w = np.hanning(len(x))
    P = np.abs(np.fft.rfft(x * w)) ** 2
    f = np.fft.rfftfreq(len(x), d=1.0)
    return f, P


def report(early, late, label):
    f, Pe = spectrum(early)
    _, Pl = spectrum(late)

    nz = f > 0  # drop DC, as registered
    f, Pe, Pl = f[nz], Pe[nz], Pl[nz]

    ln_S = 0.5 * np.log(Pl / Pe)          # ln|Shat| = 0.5 ln(P_late/P_early)
    integral = ln_S.mean() * 0.5          # mean over bins x 0.5 cyc/yr bandwidth

    # P3: carrier bin nearest f = 0.25
    k = int(np.argmin(np.abs(f - 0.25)))
    d_ln_carrier = np.log(Pl[k]) - np.log(Pe[k])
    d_ln_gm = np.log(Pl).mean() - np.log(Pe).mean()

    print(f"\n{'=' * 66}\n{label}   (n_early={len(early)}, n_late={len(late)})\n{'=' * 66}")
    print(f"  resolved band: {f[0]:.4f} .. {f[-1]:.4f} cyc/yr, {len(f)} non-DC bins")
    print(f"  carrier bin   : f = {f[k]:.4f} cyc/yr (index {k}); |f-0.25| = {abs(f[k]-0.25):.4f}")

    n_supp = int((ln_S < 0).sum())
    n_ampl = int((ln_S > 0).sum())
    p1 = n_supp > 0 and n_ampl > 0
    p2 = integral > 0
    p3 = (d_ln_carrier < 0) and (d_ln_gm >= d_ln_carrier)

    print(f"\n  P1 waterbed sign change : {n_supp} bins suppressed, {n_ampl} amplified"
          f"   -> {'HOLDS' if p1 else 'FAILS'}")
    print(f"  P2 net amplification    : integral ln|S| df = {integral:+.4f}"
          f"   -> {'HOLDS' if p2 else 'FAILS'}")
    print(f"  P3 carrier vs log-integral")
    print(f"       d ln P(carrier)    = {d_ln_carrier:+.4f}")
    print(f"       d ln GM (log-int)  = {d_ln_gm:+.4f}"
          f"   -> {'HOLDS' if p3 else 'FAILS'}")

    print("\n  per-bin ln|Shat|:")
    for fi, s in zip(f, ln_S):
        bar = "#" * min(int(abs(s) * 6), 34)
        print(f"    f={fi:.4f} ({1/fi:5.1f} yr)  {s:+7.3f}  {'' if s < 0 else '  '}{bar}")

    return p1, p2, p3, integral


df = pd.read_csv(CSV, comment="#")
df = df.sort_values("year").reset_index(drop=True)
y = df.set_index("year")["class_share"]
print(f"loaded {CSV}: {y.index.min()}-{y.index.max()}, n={len(y)}")

early = y[y.index <= SPLIT].values
late = y[y.index > SPLIT].values
res = report(early, late, "REGISTERED TEST — split 1994, periodogram")

# ---- robustness only; reported, not registered pass/fail ----
print(f"\n\n{'#' * 66}\nROBUSTNESS (reported, not registered pass/fail)\n{'#' * 66}")

def welch_check(early, late, label, nperseg=20):
    """Welch keeps the frequency grid identical across unequal-length epochs."""
    fe, Pe = welch(detrend(early, type="linear"), fs=1.0, nperseg=nperseg, noverlap=nperseg // 2)
    _, Pl = welch(detrend(late, type="linear"), fs=1.0, nperseg=nperseg, noverlap=nperseg // 2)
    nz = fe > 0
    ln_S = 0.5 * np.log(Pl[nz] / Pe[nz])
    integral = ln_S.mean() * 0.5
    print(f"\n  {label}  (n_early={len(early)}, n_late={len(late)})")
    print(f"    integral ln|S| df = {integral:+.4f}"
          f"   |  {int((ln_S < 0).sum())} suppressed, {int((ln_S > 0).sum())} amplified")
    for fi, s in zip(fe[nz], ln_S):
        print(f"      f={fi:.4f} ({1/fi:5.1f} yr)  {s:+7.3f}")
    return integral


welch_check(early, late, "Welch, registered split 1994")
for s in (1990, 2000):
    welch_check(y[y.index <= s].values, y[y.index > s].values, f"Welch, split {s}")

print(f"\n{'=' * 66}")
print(f"REGISTERED VERDICT: P1={'HOLDS' if res[0] else 'FAILS'}  "
      f"P2={'HOLDS' if res[1] else 'FAILS'}  P3={'HOLDS' if res[2] else 'FAILS'}")
print(f"{'=' * 66}")
