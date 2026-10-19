"""Score a 12axes answer key offline and print the site's results URL.

Usage: python score.py answers.tsv
answers.tsv columns: id, answer (SA|A|N|D|SD). Extra columns are ignored.
Scoring mirrors 12axes.vercel.app: each answer maps to agreement 1/.75/.5/.25/0,
an item counts toward its axis's LEFT pole as agreement (agree_pole LEFT) or
1 - agreement (agree_pole RIGHT), and the axis score is the mean x 100.
"""
import csv
import sys
from pathlib import Path

HERE = Path(__file__).parent
AGREE = {"SA": 1.0, "A": 0.75, "N": 0.5, "D": 0.25, "SD": 0.0}
# (axis id, URL key, left pole, right pole), in the site's order
AXES = [
    ("estrutura", "est", "Federal", "Unitary"),
    ("representacao", "rep", "Democracy", "Autocracy"),
    ("poder", "pod", "Security", "Liberty"),
    ("imigracao", "imi", "Assimilation", "Multiculturalism"),
    ("diplomacia", "dip", "Militarist", "Pacifist"),
    ("intervencao", "int", "Non-interventionist", "Nationalist"),
    ("economia", "eco", "Public", "Private"),
    ("controle", "con", "Planning", "Free market"),
    ("comercio", "com", "Protectionism", "Globalism"),
    ("religiao", "rel", "Irreligious", "Religious"),
    ("moral", "mor", "Progressive", "Traditionalist"),
    ("tecnologia", "tec", "Technology", "Biology"),
]


def load(path, key):
    with open(path, newline="") as f:
        return {r[key]: r for r in csv.DictReader(f, delimiter="\t")}


def score(answers_path):
    questions = load(HERE / "questions.tsv", "id")
    answers = load(answers_path, "id")
    missing = sorted(set(questions) - set(answers))
    if missing:
        sys.exit(f"{len(missing)} unanswered, e.g. {missing[:5]}")
    totals = {a[0]: [] for a in AXES}
    for qid, q in questions.items():
        agree = AGREE[answers[qid]["answer"].strip().upper()]
        totals[q["axis"]].append(agree if q["agree_pole"] == "LEFT" else 1 - agree)
    return {axis: 100 * sum(v) / len(v) for axis, v in totals.items()}


if __name__ == "__main__":
    result = score(sys.argv[1])
    for axis, key, left, right in AXES:
        s = result[axis]
        print(f"{left:>20} {s:5.1f}%  {100 - s:5.1f}% {right}")
    params = "&".join(f"{key}={round(result[axis], 1):g}" for axis, key, _, _ in AXES)
    print(f"\nhttps://12axes.vercel.app/results?{params}")
