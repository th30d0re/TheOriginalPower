"""TT-OOS-03: does each gendered branch carry a material wage?

Executes exactly the analysis registered in
Paper/prereg/tt-oos-03-gender-wage-pair.md (commit 7e8f151), committed before
this script was written and before the data was examined.
"""

import numpy as np
import pandas as pd
import statsmodels.api as sm

SCRATCH = ("/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-"
           "TheOriginalPower/2077377a-a6a6-40a2-b095-44bbe011b549/scratchpad")
SERIES = {"men": "t_LES1252881900Q", "women": "t_LES1252882800Q", "prod": "OPHNFB"}


def load(name):
    df = pd.read_csv(f"{SCRATCH}/{name}.csv")
    df.columns = ["date", "value"]
    df["date"] = pd.to_datetime(df["date"])
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    return df.dropna().set_index("date")["value"]


s = {k: load(v) for k, v in SERIES.items()}
start, end = "1979-01-01", "2025-12-31"
s = {k: v[(v.index >= start) & (v.index <= end)] for k, v in s.items()}
idx = s["men"].index.intersection(s["women"].index).intersection(s["prod"].index)
s = {k: v.reindex(idx) for k, v in s.items()}
print(f"window {idx.min().date()} .. {idx.max().date()}   n = {len(idx)} quarters\n")

# index to 100 at first observation
ix = {k: 100 * v / v.iloc[0] for k, v in s.items()}


def growth(v):
    """log ratio of last 4-quarter mean to first 4-quarter mean"""
    return np.log(v.iloc[-4:].mean() / v.iloc[:4].mean())


g = {k: growth(v) for k, v in s.items()}

print("REAL GROWTH over window (log ratio, 4-qtr means)")
for k in ("men", "women", "prod"):
    print(f"  {k:6s}  {g[k]:+.4f}   ({100*(np.exp(g[k])-1):+.1f}%)"
          f"   index end = {ix[k].iloc[-1]:.1f}")

p1 = (g["men"] > 0) and (g["women"] > 0)
p2 = (g["men"] < g["prod"]) and (g["women"] < g["prod"])

print(f"\n  P1 both branches carry a material wage : "
      f"men {'+' if g['men']>0 else '-'}, women {'+' if g['women']>0 else '-'}"
      f"   -> {'HOLDS' if p1 else 'FAILS'}")
print(f"  P2 both grow below productivity        : "
      f"prod {g['prod']:+.4f}   -> {'HOLDS' if p2 else 'FAILS'}")

# P3: trend on difference of log earnings-to-productivity ratios
r_men = np.log(ix["men"] / ix["prod"])
r_women = np.log(ix["women"] / ix["prod"])
diff = (r_women - r_men).values
t = np.arange(len(diff), dtype=float)
X = sm.add_constant(t)
fit = sm.OLS(diff, X).fit(cov_type="HAC", cov_kwds={"maxlags": 8})
coef = fit.params[1]
lo, hi = fit.conf_int()[1]

print(f"\n  P3 women's ratio improves vs men's")
print(f"     trend per quarter = {coef:+.6f}   95% CI [{lo:+.6f}, {hi:+.6f}]"
      f"   (Newey-West, 8 lags)")
print(f"     over {len(diff)} quarters = {coef*len(diff):+.4f} log points")
p3 = (coef > 0) and (lo > 0)
print(f"     -> {'HOLDS' if p3 else 'FAILS'}")

print(f"\n  earnings/productivity ratio at window end:")
print(f"     men   = {ix['men'].iloc[-1]/ix['prod'].iloc[-1]:.4f}")
print(f"     women = {ix['women'].iloc[-1]/ix['prod'].iloc[-1]:.4f}")

print(f"\n{'=' * 60}")
print(f"P1 = {'HOLDS' if p1 else 'FAILS'}   "
      f"P2 = {'HOLDS' if p2 else 'FAILS'}   P3 = {'HOLDS' if p3 else 'FAILS'}")
print(f"{'=' * 60}")
