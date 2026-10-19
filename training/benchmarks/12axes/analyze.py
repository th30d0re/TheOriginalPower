"""Compare every answer key in keys/ against the book's gold key and the owner's own result.

Usage: python3 analyze.py > RESULTS.md
Forced keys cover questions.tsv ids; atomic keys cover atomic.tsv ids and are aggregated to
parent items (mean over a parent's clauses, each oriented by its own agree_pole) before axis scoring.
"""
import csv
import math
from collections import defaultdict
from pathlib import Path

from score import AXES

HERE = Path(__file__).parent
VAL = {"SA": 1.0, "A": 0.75, "N": 0.5, "D": 0.25, "SD": 0.0}
# The owner's 12axes result (URL of 2026-09-27), left-pole percentages.
OWNER = dict(zip([a[0] for a in AXES], [81.3, 70, 0, 5, 62.5, 51.2, 83.8, 81.3, 55, 95, 97.5, 62.5]))


def tsv(path, key):
    with open(path, newline="") as f:
        return {r[key]: r for r in csv.DictReader(f, delimiter="\t")}


Q = tsv(HERE / "questions.tsv", "id")
ATOM = tsv(HERE / "atomic.tsv", "atomic_id")
GOLD = tsv(HERE / "keys/gold_forced.tsv", "id")
GOLD_ATOM = tsv(HERE / "keys/gold_atomic.tsv", "id")
SPOKEN = [i for i, r in GOLD.items() if r["basis"] != "silent"]
COMPOUND = {i for i, r in GOLD.items() if r["compound"] == "1"}


def value(row):
    """Agreement in [0,1]: the model's expected value, or the gold key's discrete answer."""
    return float(row["expected"]) if "expected" in row and row["expected"] else VAL[row["answer"]]


def left(v, pole):
    return v if pole == "LEFT" else 1 - v


def forced_axes(key):
    acc = defaultdict(list)
    for i, q in Q.items():
        acc[q["axis"]].append(left(value(key[i]), q["agree_pole"]))
    return {a: 100 * sum(v) / len(v) for a, v in acc.items()}


def parent_values(key):
    """Per parent item: mean left-pole value over its atomic clauses."""
    per = defaultdict(list)
    for aid, a in ATOM.items():
        per[a["parent_id"]].append(left(value(key[aid]), a["agree_pole"]))
    return {p: sum(v) / len(v) for p, v in per.items()}


def atomic_axes(key):
    pv = parent_values(key)
    acc = defaultdict(list)
    for i, q in Q.items():
        acc[q["axis"]].append(pv[i])
    return {a: 100 * sum(v) / len(v) for a, v in acc.items()}


def agreement(key, ids):
    """Mean absolute error and exact-answer rate against the gold forced key, on left-pole values."""
    err = [abs(left(value(key[i]), Q[i]["agree_pole"]) - left(VAL[GOLD[i]["answer"]], Q[i]["agree_pole"])) for i in ids]
    exact = sum(key[i]["answer"] == GOLD[i]["answer"] for i in ids)
    return sum(err) / len(err), exact / len(ids)


def pearson(xs, ys):
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    sy = math.sqrt(sum((y - my) ** 2 for y in ys))
    return sxy / (sx * sy) if sx and sy else float("nan")


def axis_distance(p, ref):
    return sum(abs(p[a] - ref[a]) for a in ref) / len(ref)


def extremity(key):
    """Share of items answered SA or SD (argmax)."""
    return sum(key[i]["answer"] in ("SA", "SD") for i in Q) / len(Q)


def main():
    runs = sorted({p.name.rsplit("-", 2)[0] for p in (HERE / "keys").glob("*-forced.tsv")})
    gold_f, gold_a = forced_axes(GOLD), atomic_axes(GOLD_ATOM)
    rows = [("gold (book)", "—", gold_f, gold_a, GOLD, None)]
    for run in runs:
        for cond in ("none", "digest"):
            f, a = HERE / f"keys/{run}-{cond}-forced.tsv", HERE / f"keys/{run}-{cond}-atomic.tsv"
            if f.exists() and a.exists():
                kf, ka = tsv(f, "id"), tsv(a, "id")
                rows.append((run, cond, forced_axes(kf), atomic_axes(ka), kf, ka))

    labels = [a[0] for a in AXES]
    short = {a[0]: a[2][:5] for a in AXES}
    gold_left = [left(VAL[GOLD[i]["answer"]], Q[i]["agree_pole"]) for i in SPOKEN]

    print("# 12 Axes benchmark results\n")
    print(f"Gold key: {len(SPOKEN)} of 240 items where the book speaks (book or inferred basis); "
          f"{240 - len(SPOKEN)} silent. {len(COMPOUND)} items are compound.\n")

    print("## Agreement with the book (forced items)\n")
    print("MAE and r are on left-pole agreement values over the items where the book speaks. "
          "`dist` is mean absolute axis-score distance (percentage points). `extreme` is the share of "
          "answers at SA or SD.\n")
    print("| run | digest | MAE spoken | exact spoken | r spoken | dist to gold | dist to owner | extreme |")
    print("|---|---|---|---|---|---|---|---|")
    for name, cond, fa, _, kf, _ in rows:
        if name.startswith("gold"):
            print(f"| **gold (book)** | — | 0 | 100% | 1.00 | 0.0 | {axis_distance(fa, OWNER):.1f} | {extremity(kf):.0%} |")
            continue
        mae, ex = agreement(kf, SPOKEN)
        r = pearson([left(value(kf[i]), Q[i]["agree_pole"]) for i in SPOKEN], gold_left)
        print(f"| {name} | {cond} | {mae:.3f} | {ex:.0%} | {r:.2f} | {axis_distance(fa, gold_f):.1f} | "
              f"{axis_distance(fa, OWNER):.1f} | {extremity(kf):.0%} |")

    print("\n## Axis profiles, forced items (left-pole %)\n")
    print("| run | digest | " + " | ".join(short[a] for a in labels) + " |")
    print("|---|---|" + "---|" * len(labels))
    print("| **owner** | — | " + " | ".join(f"{OWNER[a]:.0f}" for a in labels) + " |")
    for name, cond, fa, _, _, _ in rows:
        print(f"| {name} | {cond} | " + " | ".join(f"{fa[a]:.0f}" for a in labels) + " |")

    print("\n## Wording effect: split-clause minus forced, per axis (percentage points)\n")
    print("Positive means splitting compound items into single claims moves the axis toward its left pole.\n")
    print("| run | digest | " + " | ".join(short[a] for a in labels) + " | mean abs |")
    print("|---|---|" + "---|" * (len(labels) + 1))
    for name, cond, fa, aa, _, _ in rows:
        d = [aa[a] - fa[a] for a in labels]
        print(f"| {name} | {cond} | " + " | ".join(f"{x:+.0f}" for x in d) + f" | {sum(map(abs, d)) / len(d):.1f} |")

    print("\n## Compound items: does the model hedge more?\n")
    print("Mean probability on N (neutral), compound items vs single-claim items, forced keys.\n")
    print("| run | digest | p(N) compound | p(N) single |")
    print("|---|---|---|---|")
    for name, cond, _, _, kf, _ in rows:
        if name.startswith("gold"):
            continue
        pc = [float(kf[i]["p_N"]) for i in Q if i in COMPOUND]
        ps = [float(kf[i]["p_N"]) for i in Q if i not in COMPOUND]
        print(f"| {name} | {cond} | {sum(pc) / len(pc):.3f} | {sum(ps) / len(ps):.3f} |")


if __name__ == "__main__":
    main()
