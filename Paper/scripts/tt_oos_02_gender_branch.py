"""TT-OOS-02: does the gender branch move toward match on the Extraction Chart?

Executes exactly the analysis registered in
Paper/prereg/tt-oos-02-gender-branch-trajectory.md (commit d6976d6), committed
before this script was written and before the data was examined.

No analysis choice may be changed in response to the result.
"""

import numpy as np
import pandas as pd
from scipy.signal import detrend

CSV = "Paper/data/congressional_record_word_freq_per_axis.csv"
SPLIT = 1994
CARRIER = 0.25          # 4-yr electoral carrier, cyc/yr
BAND = (0.05, 0.50)     # registered search band for omega_0
rng = np.random.default_rng(20260809)


def omega0(x):
    """Registered estimator: detrend, mean-remove, Hann, periodogram, argmax in band."""
    x = detrend(np.asarray(x, dtype=float), type="linear")
    x = x - x.mean()
    P = np.abs(np.fft.rfft(x * np.hanning(len(x)))) ** 2
    f = np.fft.rfftfreq(len(x), d=1.0)
    m = (f >= BAND[0]) & (f <= BAND[1])
    return f[m][int(np.argmax(P[m]))]


def delta(w0, w=CARRIER):
    return w / w0 - w0 / w


def block_boot(x, L=5):
    n = len(x)
    out = []
    while len(out) < n:
        s = rng.integers(0, n)
        out.extend(np.take(x, range(s, s + L), mode="wrap"))
    return np.array(out[:n])


df = pd.read_csv(CSV, comment="#").sort_values("year").reset_index(drop=True)
df = df[df["identity_word_freq"] > 0].copy()
df["gender_share"] = df["gender_word_freq"] / df["identity_word_freq"]
df["race_share"] = df["race_word_freq"] / df["identity_word_freq"]

early = df[df["year"] <= SPLIT]
late = df[df["year"] > SPLIT]
print(f"loaded {CSV}: {df.year.min()}-{df.year.max()}, n={len(df)}"
      f"  (early {len(early)}, late {len(late)})")

res = {}
for axis in ("gender", "race"):
    col = f"{axis}_share"
    w0_e, w0_l = omega0(early[col].values), omega0(late[col].values)
    d_e, d_l = delta(w0_e), delta(w0_l)
    res[axis] = dict(w0_e=w0_e, w0_l=w0_l, d_e=d_e, d_l=d_l,
                     drop=abs(d_e) - abs(d_l))
    print(f"\n{axis.upper()}")
    print(f"  early: omega_0 = {w0_e:.4f} cyc/yr ({1/w0_e:4.1f} yr)   "
          f"delta = {d_e:+.4f}   |delta| = {abs(d_e):.4f}")
    print(f"  late : omega_0 = {w0_l:.4f} cyc/yr ({1/w0_l:4.1f} yr)   "
          f"delta = {d_l:+.4f}   |delta| = {abs(d_l):.4f}")
    print(f"  |delta| drop (early - late) = {res[axis]['drop']:+.4f}"
          f"   {'toward match' if res[axis]['drop'] > 0 else 'away from match'}")

# P2: admittance ratio by epoch
r_e = early["gender_share"].mean() / early["race_share"].mean()
r_l = late["gender_share"].mean() / late["race_share"].mean()

p1 = res["gender"]["drop"] > 0
p2 = r_l > r_e
p3 = res["gender"]["drop"] > res["race"]["drop"]

print(f"\nADMITTANCE RATIO  rho_gender/rho_race")
print(f"  early = {r_e:.4f}   late = {r_l:.4f}   change = {r_l - r_e:+.4f}")

# bootstrap on the primary quantity
boots = []
for _ in range(4000):
    de = delta(omega0(block_boot(early["gender_share"].values)))
    dl = delta(omega0(block_boot(late["gender_share"].values)))
    boots.append(abs(de) - abs(dl))
boots = np.array(boots)
lo, hi = np.percentile(boots, [2.5, 97.5])

print(f"\nBOOTSTRAP on |delta_gender| drop (4000 reps, 5-yr blocks)")
print(f"  observed = {res['gender']['drop']:+.4f}")
print(f"  95% CI   = [{lo:+.4f}, {hi:+.4f}]   contains 0? "
      f"{'YES' if lo < 0 < hi else 'NO'}")
print(f"  P(drop > 0) = {(boots > 0).mean():.3f}")

print(f"\n{'=' * 62}")
print(f"P1 gender moves toward match     : {'HOLDS' if p1 else 'FAILS'}")
print(f"P2 rho_gender/rho_race rises     : {'HOLDS' if p2 else 'FAILS'}")
print(f"P3 move exceeds race's           : {'HOLDS' if p3 else 'FAILS'}")
print(f"{'=' * 62}")
