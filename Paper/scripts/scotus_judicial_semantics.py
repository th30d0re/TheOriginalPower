#!/usr/bin/env python3
"""Build a SCOTUS judicial-semantics case study from markdown case texts.

This is intentionally a case-level "Wordshoal-lite" workflow, not a
justice-level Wordshoal or JuDJIS replication. It uses the expanded local
markdown corpus as the primary source, computes anchored semantic baskets,
derives a latent text axis with SVD, and writes manuscript-ready figures.

Outputs:
    Paper/data/scotus_judicial_semantics.csv
    Paper/data/scotus_judicial_case_scores.csv
    Paper/data/scotus_judicial_validation.csv
    Paper/data/scotus_judicial_semantics_summary.json
    Paper/figures/spectral/scotus_judicial_semantic_axis.pdf
    Paper/figures/spectral/scotus_civil_rights_vs_second_amendment.pdf
"""

from __future__ import annotations

import json
import math
import os
import re
import unicodedata
from collections import Counter, OrderedDict
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/private/tmp/redefining_racism_mpl")

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import yaml


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "research" / "case_index.yaml"
MD_DIR = ROOT / "research" / "markdown_cases"
DATA_DIR = ROOT / "data"
FIG_DIR = ROOT / "figures" / "spectral"

SEMANTICS_CSV = DATA_DIR / "scotus_judicial_semantics.csv"
CASE_SCORES_CSV = DATA_DIR / "scotus_judicial_case_scores.csv"
VALIDATION_CSV = DATA_DIR / "scotus_judicial_validation.csv"
SUMMARY_JSON = DATA_DIR / "scotus_judicial_semantics_summary.json"
AXIS_FIG = FIG_DIR / "scotus_judicial_semantic_axis.pdf"
GROUP_FIG = FIG_DIR / "scotus_civil_rights_vs_second_amendment.pdf"

MIN_UNIT_WORDS = 250
MAX_VOCAB = 700


BASKETS: OrderedDict[str, list[str]] = OrderedDict(
    [
        (
            "structural_context",
            [
                "structural",
                "systemic",
                "institutional",
                "pattern",
                "patterns",
                "effects",
                "impact",
                "disparate impact",
                "disproportionate",
                "segregation",
                "subordination",
                "inequality",
                "racial discrimination",
                "racially discriminatory",
                "poverty",
                "exclusion",
                "history of discrimination",
            ],
        ),
        (
            "formalist_procedure",
            [
                "standing",
                "jurisdiction",
                "justiciable",
                "deference",
                "neutral",
                "facially neutral",
                "classification",
                "equal protection",
                "state action",
                "private action",
                "rational basis",
                "strict scrutiny",
                "compelling interest",
                "precedent",
                "burden",
                "proof",
                "administrative",
                "procedure",
            ],
        ),
        (
            "intent_doctrine",
            [
                "intent",
                "purpose",
                "purposeful",
                "discriminatory purpose",
                "invidious",
                "motive",
                "motivation",
                "because of",
                "disparate impact",
                "disproportionate impact",
                "foreseeable",
                "foreseeability",
                "intentional discrimination",
            ],
        ),
        (
            "historical_tradition",
            [
                "history",
                "historical",
                "tradition",
                "historical tradition",
                "founding",
                "founding era",
                "reconstruction",
                "common law",
                "english",
                "ratification",
                "original meaning",
                "text",
                "traditionally",
                "analogue",
                "analogical",
            ],
        ),
        (
            "kinetic_rights",
            [
                "arms",
                "bear arms",
                "keep arms",
                "firearm",
                "firearms",
                "gun",
                "guns",
                "handgun",
                "handguns",
                "pistol",
                "rifle",
                "weapon",
                "weapons",
                "self defense",
                "self defence",
                "carry",
                "militia",
                "ammunition",
            ],
        ),
        (
            "remedy_narrowing",
            [
                "remedy",
                "remedies",
                "relief",
                "damages",
                "injunction",
                "injunctive",
                "sovereign immunity",
                "qualified immunity",
                "no private right",
                "private right of action",
                "causation",
                "redressability",
                "limited",
                "narrow",
                "narrowly tailored",
                "actual damages",
            ],
        ),
    ]
)

TERM_PARTS: dict[str, list[tuple[str, ...]]] = {
    basket: [
        tuple(analysis_part for analysis_part in re.sub(r"[^a-z]+", " ", term.lower()).split())
        for term in terms
    ]
    for basket, terms in BASKETS.items()
}
MAX_TERM_LEN = max(len(parts) for parts_list in TERM_PARTS.values() for parts in parts_list)


STOPWORDS = {
    "about",
    "above",
    "after",
    "again",
    "against",
    "also",
    "although",
    "among",
    "another",
    "because",
    "been",
    "before",
    "being",
    "between",
    "both",
    "cannot",
    "could",
    "court",
    "courts",
    "decision",
    "defendant",
    "does",
    "each",
    "even",
    "from",
    "give",
    "given",
    "held",
    "here",
    "however",
    "into",
    "itself",
    "judge",
    "judges",
    "judgment",
    "justice",
    "justices",
    "made",
    "make",
    "many",
    "more",
    "most",
    "must",
    "only",
    "opinion",
    "other",
    "petitioner",
    "petitioners",
    "plaintiff",
    "respondent",
    "respondents",
    "shall",
    "should",
    "since",
    "some",
    "state",
    "states",
    "such",
    "than",
    "that",
    "their",
    "them",
    "then",
    "there",
    "these",
    "they",
    "this",
    "those",
    "through",
    "under",
    "united",
    "upon",
    "were",
    "when",
    "where",
    "which",
    "while",
    "with",
    "would",
}


CIVIL_RIGHTS_CLUSTERS = {
    "affirmative_action",
    "intent_doctrine",
    "jury_selection",
    "naacp_brown",
    "racial_classification",
    "reconstruction_amendments",
    "spatial_containment",
    "voting_rights",
    "white_primaries",
}

FOCUS_CLUSTERS = [
    "second_amendment",
    "voting_rights",
    "intent_doctrine",
    "affirmative_action",
    "racial_classification",
    "spatial_containment",
    "carceral_enforcement",
    "jury_selection",
    "gendered_kernel",
    "reconstruction_amendments",
]

VALIDATION_CASES = {
    "washington_v_davis_1976": (
        "semantic_formalism",
        "Intent gate for proxy discrimination claims",
    ),
    "village_of_arlington_heights_v_metropolitan_housing_development_corp_1977": (
        "semantic_formalism",
        "Intent-factor test for facially neutral land-use decisions",
    ),
    "mobile_v_bolden_1980": (
        "semantic_formalism",
        "Voting dilution routed through intent doctrine",
    ),
    "mccleskey_v_kemp_1987": (
        "semantic_formalism",
        "Statistical racial disparity rejected as constitutional proof",
    ),
    "shelby_county_v_holder_2013": (
        "semantic_formalism",
        "Voting-rights remedy narrowed through equal-sovereignty logic",
    ),
    "brnovich_v_democratic_national_committee_2021": (
        "semantic_formalism",
        "Section 2 burden filtered through administrative normality",
    ),
    "parents_involved_v_seattle_2007": (
        "semantic_formalism",
        "Colorblind symmetry applied to integration remedy",
    ),
    "students_for_fair_admissions_v_harvard_2023": (
        "semantic_formalism",
        "Colorblind symmetry applied to affirmative action",
    ),
    "district_of_columbia_v_heller_2008": (
        "hardware_due_diligence",
        "Second Amendment text-history-rights analysis",
    ),
    "mcdonald_v_city_of_chicago_2010": (
        "hardware_due_diligence",
        "Second Amendment incorporation and historical violence record",
    ),
    "caetano_v_massachusetts_2016": (
        "hardware_due_diligence",
        "Kinetic-rights rule applied to contemporary weapon",
    ),
    "new_york_state_rifle_pistol_association_v_bruen_2022": (
        "hardware_due_diligence",
        "Historical-tradition test for public carry",
    ),
    "united_states_v_rahimi_2024": (
        "hardware_due_diligence",
        "Second Amendment historical analogue analysis",
    ),
}


def tex_safe_header(lines: list[str]) -> list[str]:
    return [line.rstrip("\n") for line in lines]


def write_csv_with_header(df: pd.DataFrame, path: Path, header_lines: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        for line in tex_safe_header(header_lines):
            fh.write(line + "\n")
        df.to_csv(fh, index=False)


def ascii_normalize(text: str) -> str:
    text = text.replace("\x0c", "\n")
    text = unicodedata.normalize("NFKD", text)
    return text.encode("ascii", "ignore").decode("ascii")


def strip_boilerplate_lines(text: str) -> str:
    text = ascii_normalize(text)
    text = re.sub(r"([A-Za-z])-\s*\n\s*([a-z])", r"\1\2", text)
    keep: list[str] = []
    for raw in text.splitlines():
        line = re.sub(r"\s+", " ", raw).strip()
        if not line:
            continue
        lower = line.lower()
        if re.fullmatch(r"[\W\d_]{1,20}", line):
            continue
        if re.fullmatch(r"\d{1,4}", line):
            continue
        if lower.startswith("downloaded from https://www.cambridge.org"):
            continue
        if lower in {
            "supreme court of the united states",
            "syllabus",
            "opinion of the court",
            "appendix",
            "table of contents",
        }:
            continue
        if lower.startswith("october term,"):
            continue
        if lower.startswith("cite as:"):
            continue
        keep.append(line)
    return "\n".join(keep)


def analysis_text(text: str) -> str:
    text = ascii_normalize(text).lower()
    text = text.replace("self-defense", "self defense")
    text = text.replace("self-defence", "self defence")
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"[^a-z]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokens_for(text: str) -> list[str]:
    clean = analysis_text(text)
    return [tok for tok in clean.split() if len(tok) > 2]


def marker_for(line: str) -> str | None:
    line = re.sub(r"\s+", " ", line).strip()
    if len(line) > 150:
        return None
    lower = line.lower().rstrip(".")
    if re.search(r"\bdelivered the opinion of the court\b", lower):
        return "majority"
    if re.fullmatch(r"(mr\. )?justice [a-z]+.*,\s*concurring", lower):
        return "concurrence"
    if re.fullmatch(r"(mr\. )?justice [a-z]+.*,\s*dissenting", lower):
        return "dissent"
    if re.fullmatch(r"[a-z]+,\s*j\.,\s*concurring", lower):
        return "concurrence"
    if re.fullmatch(r"[a-z]+,\s*j\.,\s*dissenting", lower):
        return "dissent"
    if re.fullmatch(r"[a-z]+,\s*j\.,\s*concurring in part.*", lower):
        return "concurrence"
    if re.fullmatch(r"[a-z]+,\s*j\.,\s*dissenting in part.*", lower):
        return "dissent"
    return None


def split_opinion_units(text: str) -> dict[str, str]:
    """Return majority/concurrence/dissent text where markers are reliable."""
    buckets: dict[str, list[str]] = {"majority": [], "concurrence": [], "dissent": []}
    current: str | None = None

    for line in text.splitlines():
        marker = marker_for(line)
        if marker is not None:
            current = marker
            buckets[current].append(line)
            continue
        if current is not None:
            buckets[current].append(line)

    units = {
        unit: "\n".join(lines)
        for unit, lines in buckets.items()
        if len(tokens_for("\n".join(lines))) >= MIN_UNIT_WORDS
    }
    return units


def load_case_index() -> list[dict]:
    data = yaml.safe_load(INDEX_PATH.read_text(encoding="utf-8"))
    return data.get("cases", []) if data else []


def ngram_counts(tokens: list[str]) -> dict[int, Counter[tuple[str, ...]]]:
    counts: dict[int, Counter[tuple[str, ...]]] = {}
    for n in range(1, MAX_TERM_LEN + 1):
        if len(tokens) < n:
            counts[n] = Counter()
            continue
        counts[n] = Counter(tuple(tokens[i : i + n]) for i in range(len(tokens) - n + 1))
    return counts


def basket_count(counts: dict[int, Counter[tuple[str, ...]]], basket: str) -> int:
    total = 0
    for parts in TERM_PARTS[basket]:
        if not parts:
            continue
        total += counts[len(parts)].get(parts, 0)
    return total


def analyze_unit(case: dict, opinion_unit: str, text: str) -> tuple[dict, Counter[str]]:
    clean = analysis_text(text)
    tokens = [tok for tok in clean.split() if len(tok) > 2]
    word_count = len(tokens)
    counts = ngram_counts(tokens)
    row = {
        "case_name": case.get("case", ""),
        "year": case.get("year", ""),
        "slug": case.get("slug", ""),
        "cluster": case.get("cluster", ""),
        "tier": case.get("tier", ""),
        "opinion_unit": opinion_unit,
        "word_count": word_count,
    }
    for basket in BASKETS:
        count = basket_count(counts, basket)
        score = round(count / word_count * 1000.0, 4) if word_count else 0.0
        row[f"{basket}_count"] = count
        row[f"{basket}_per_1k"] = score
        row[f"{basket}_score"] = score

    row["semantic_formalism_index"] = round(
        row["formalist_procedure_per_1k"]
        + row["intent_doctrine_per_1k"]
        + row["remedy_narrowing_per_1k"]
        - row["structural_context_per_1k"],
        4,
    )
    row["hardware_due_diligence_index"] = round(
        row["historical_tradition_per_1k"] + row["kinetic_rights_per_1k"],
        4,
    )
    row["double_agent_basket_delta"] = round(
        row["hardware_due_diligence_index"] - row["semantic_formalism_index"],
        4,
    )

    counter = Counter(
        tok
        for tok in tokens
        if tok not in STOPWORDS and not tok.isdigit() and len(tok) > 2
    )
    return row, counter


def add_latent_axis(rows: list[dict], counters: list[Counter[str]]) -> dict:
    eligible = [
        i
        for i, row in enumerate(rows)
        if int(row.get("word_count") or 0) >= MIN_UNIT_WORDS and len(counters[i]) >= 20
    ]
    for row in rows:
        row["latent_semantic_axis_z"] = math.nan
        row["basket_anchor_delta_z"] = math.nan

    if len(eligible) < 4:
        return {"latent_component": None, "latent_docs": len(eligible), "latent_vocab": 0}

    basket_cols = [f"{name}_per_1k" for name in BASKETS]
    basket_frame = pd.DataFrame([{col: rows[i][col] for col in basket_cols} for i in eligible])
    z = (basket_frame - basket_frame.mean()) / basket_frame.std(ddof=0).replace(0, np.nan)
    z = z.fillna(0.0)
    target = (
        z["historical_tradition_per_1k"]
        + z["kinetic_rights_per_1k"]
        + 0.5 * z["structural_context_per_1k"]
        - z["formalist_procedure_per_1k"]
        - z["intent_doctrine_per_1k"]
        - z["remedy_narrowing_per_1k"]
    ).to_numpy()

    total_counts: Counter[str] = Counter()
    doc_counts: Counter[str] = Counter()
    for i in eligible:
        filtered = {
            tok: cnt
            for tok, cnt in counters[i].items()
            if cnt >= 2 and not re.fullmatch(r"[a-z]{1,2}", tok)
        }
        total_counts.update(filtered)
        doc_counts.update(filtered.keys())

    n_docs = len(eligible)
    vocab = [
        tok
        for tok, _ in total_counts.most_common()
        if 3 <= doc_counts[tok] <= max(3, int(n_docs * 0.85))
    ][:MAX_VOCAB]

    if len(vocab) < 5:
        return {"latent_component": None, "latent_docs": len(eligible), "latent_vocab": len(vocab)}

    vocab_index = {tok: j for j, tok in enumerate(vocab)}
    matrix = np.zeros((n_docs, len(vocab)), dtype=float)
    dfs = np.array([doc_counts[tok] for tok in vocab], dtype=float)
    idf = np.log((1.0 + n_docs) / (1.0 + dfs)) + 1.0

    for row_idx, source_idx in enumerate(eligible):
        word_count = max(float(rows[source_idx]["word_count"]), 1.0)
        for tok, cnt in counters[source_idx].items():
            col = vocab_index.get(tok)
            if col is not None:
                matrix[row_idx, col] = math.log1p(cnt / word_count * 1000.0) * idf[col]

    matrix -= matrix.mean(axis=0, keepdims=True)
    u, s, _vt = np.linalg.svd(matrix, full_matrices=False)
    k = min(3, u.shape[1])
    components = u[:, :k] * s[:k]
    target_std = float(np.std(target))
    if target_std > 1e-9:
        correlations = []
        for j in range(k):
            comp = components[:, j]
            comp_std = float(np.std(comp))
            if comp_std <= 1e-9:
                correlations.append(0.0)
            else:
                correlations.append(abs(float(np.corrcoef(comp, target)[0, 1])))
        component_idx = int(np.nanargmax(correlations))
    else:
        component_idx = 0

    axis = components[:, component_idx]
    if target_std > 1e-9 and np.std(axis) > 1e-9:
        if float(np.corrcoef(axis, target)[0, 1]) < 0:
            axis = -axis
    axis = (axis - axis.mean()) / max(axis.std(ddof=0), 1e-9)

    # Orient the final sign so Second Amendment cases sit on the historical /
    # kinetic side relative to civil-rights clusters when both are present.
    axis_by_idx = {source_idx: axis[pos] for pos, source_idx in enumerate(eligible)}
    second = [
        axis_by_idx[i]
        for i in eligible
        if rows[i].get("opinion_unit") == "full_case"
        and rows[i].get("cluster") == "second_amendment"
    ]
    civil = [
        axis_by_idx[i]
        for i in eligible
        if rows[i].get("opinion_unit") == "full_case"
        and rows[i].get("cluster") in CIVIL_RIGHTS_CLUSTERS
    ]
    if second and civil and np.mean(second) < np.mean(civil):
        axis = -axis
        axis_by_idx = {source_idx: axis[pos] for pos, source_idx in enumerate(eligible)}

    target_z = (target - target.mean()) / max(target.std(ddof=0), 1e-9)
    for pos, source_idx in enumerate(eligible):
        rows[source_idx]["latent_semantic_axis_z"] = round(float(axis[pos]), 4)
        rows[source_idx]["basket_anchor_delta_z"] = round(float(target_z[pos]), 4)

    return {
        "latent_component": component_idx + 1,
        "latent_docs": len(eligible),
        "latent_vocab": len(vocab),
    }


def build_rows() -> tuple[list[dict], list[Counter[str]], dict]:
    rows: list[dict] = []
    counters: list[Counter[str]] = []
    cases = load_case_index()
    loaded_cases = 0
    split_cases = 0

    for case in cases:
        slug = case.get("slug")
        md_path = MD_DIR / f"{slug}.md"
        if not slug or not md_path.exists():
            continue

        raw = md_path.read_text(encoding="utf-8", errors="ignore")
        cleaned = strip_boilerplate_lines(raw)
        if len(tokens_for(cleaned)) < MIN_UNIT_WORDS:
            continue

        loaded_cases += 1
        row, counter = analyze_unit(case, "full_case", cleaned)
        rows.append(row)
        counters.append(counter)

        split_units = split_opinion_units(cleaned)
        if split_units:
            split_cases += 1
            for unit_name in ["majority", "concurrence", "dissent"]:
                unit_text = split_units.get(unit_name)
                if not unit_text:
                    continue
                row, counter = analyze_unit(case, unit_name, unit_text)
                rows.append(row)
                counters.append(counter)

    summary = {
        "index_cases": len(cases),
        "loaded_cases": loaded_cases,
        "split_cases": split_cases,
        "total_rows": len(rows),
    }
    return rows, counters, summary


def build_validation(case_df: pd.DataFrame) -> pd.DataFrame:
    records: list[dict] = []
    for slug, (expected, rationale) in VALIDATION_CASES.items():
        subset = case_df[case_df["slug"] == slug]
        if subset.empty:
            records.append(
                {
                    "slug": slug,
                    "case_name": "",
                    "year": "",
                    "cluster": "",
                    "expert_expected_pole": expected,
                    "coding_rationale": rationale,
                    "latent_semantic_axis_z": math.nan,
                    "observed_pole": "missing",
                    "agreement": False,
                }
            )
            continue
        row = subset.iloc[0]
        axis = row.get("latent_semantic_axis_z")
        delta = row.get("double_agent_basket_delta")
        if pd.isna(delta):
            observed = "unscored"
            agreement = False
        else:
            observed = "hardware_due_diligence" if float(delta) >= 0 else "semantic_formalism"
            agreement = observed == expected
        records.append(
            {
                "slug": slug,
                "case_name": row["case_name"],
                "year": int(row["year"]),
                "cluster": row["cluster"],
                "expert_expected_pole": expected,
                "coding_rationale": rationale,
                "latent_semantic_axis_z": axis,
                "basket_anchor_delta_z": row.get("basket_anchor_delta_z"),
                "semantic_formalism_index": row.get("semantic_formalism_index"),
                "hardware_due_diligence_index": row.get("hardware_due_diligence_index"),
                "double_agent_basket_delta": row.get("double_agent_basket_delta"),
                "observed_pole": observed,
                "agreement": agreement,
            }
        )
    return pd.DataFrame.from_records(records)


def plot_axis_by_cluster(case_df: pd.DataFrame) -> None:
    plot_df = case_df[
        case_df["cluster"].isin(FOCUS_CLUSTERS)
        & case_df["latent_semantic_axis_z"].notna()
    ].copy()
    if plot_df.empty:
        return

    order = (
        plot_df.groupby("cluster")["latent_semantic_axis_z"]
        .median()
        .sort_values()
        .index.tolist()
    )

    fig, ax = plt.subplots(figsize=(8.5, 5.6))
    rng = np.random.default_rng(20260503)
    for y, cluster in enumerate(order):
        vals = plot_df.loc[plot_df["cluster"] == cluster, "latent_semantic_axis_z"].astype(float)
        jitter = rng.normal(0, 0.045, size=len(vals))
        ax.scatter(vals, np.full(len(vals), y) + jitter, s=26, alpha=0.55, color="#2f5d62")
        ax.scatter([vals.median()], [y], s=70, marker="D", color="#b23a48", zorder=3)

    ax.axvline(0, color="#555555", lw=1, ls="--")
    ax.set_yticks(range(len(order)))
    ax.set_yticklabels([c.replace("_", " ") for c in order])
    ax.set_xlabel("Latent judicial semantic-axis z-score")
    ax.set_title("SCOTUS Corpus: Case-Level Judicial Semantic Priors")
    ax.text(
        0.01,
        -0.15,
        "Higher values are oriented toward historical/kinetic language; lower values toward formalist/proxy-screen language.",
        transform=ax.transAxes,
        ha="left",
        va="top",
        fontsize=8.5,
    )
    ax.grid(axis="x", color="#dddddd", lw=0.7)
    fig.tight_layout()
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    fig.savefig(AXIS_FIG, bbox_inches="tight")
    plt.close(fig)


def plot_civil_vs_second(case_df: pd.DataFrame) -> None:
    records = []
    for _, row in case_df.iterrows():
        cluster = row.get("cluster")
        if cluster == "second_amendment":
            group = "Second Amendment"
        elif cluster in CIVIL_RIGHTS_CLUSTERS:
            group = "Civil-rights / voting"
        else:
            continue
        if pd.isna(row.get("latent_semantic_axis_z")):
            continue
        records.append({"group": group, "axis": float(row["latent_semantic_axis_z"])})

    plot_df = pd.DataFrame.from_records(records)
    if plot_df.empty:
        return

    groups = ["Civil-rights / voting", "Second Amendment"]
    fig, ax = plt.subplots(figsize=(6.8, 4.6))
    rng = np.random.default_rng(20260503)
    for x, group in enumerate(groups):
        vals = plot_df.loc[plot_df["group"] == group, "axis"].astype(float).to_numpy()
        if len(vals) == 0:
            continue
        jitter = rng.normal(0, 0.04, size=len(vals))
        ax.scatter(np.full(len(vals), x) + jitter, vals, s=30, color="#2f5d62", alpha=0.58)
        mean = float(np.mean(vals))
        sem = float(np.std(vals, ddof=1) / math.sqrt(len(vals))) if len(vals) > 1 else 0.0
        ax.errorbar([x], [mean], yerr=[sem], fmt="D", color="#b23a48", capsize=5, ms=7)
        ax.text(x, min(vals) - 0.18, f"n={len(vals)}", ha="center", va="top", fontsize=9)

    ax.axhline(0, color="#555555", lw=1, ls="--")
    ax.set_xticks(range(len(groups)))
    ax.set_xticklabels(groups)
    ax.set_ylabel("Latent judicial semantic-axis z-score")
    ax.set_title("Civil-Rights/Voting Corpus vs. Second Amendment Corpus")
    ax.grid(axis="y", color="#dddddd", lw=0.7)
    fig.tight_layout()
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    fig.savefig(GROUP_FIG, bbox_inches="tight")
    plt.close(fig)


def main() -> int:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    FIG_DIR.mkdir(parents=True, exist_ok=True)

    rows, counters, summary = build_rows()
    latent_summary = add_latent_axis(rows, counters)
    summary.update(latent_summary)

    df = pd.DataFrame(rows)
    df = df.sort_values(["year", "case_name", "opinion_unit"]).reset_index(drop=True)
    case_df = df[df["opinion_unit"] == "full_case"].copy().reset_index(drop=True)
    validation_df = build_validation(case_df)

    civil = case_df[case_df["cluster"].isin(CIVIL_RIGHTS_CLUSTERS)]
    second = case_df[case_df["cluster"] == "second_amendment"]
    summary["civil_rights_voting_cases"] = int(len(civil))
    summary["second_amendment_cases"] = int(len(second))
    summary["civil_rights_voting_axis_mean"] = (
        float(civil["latent_semantic_axis_z"].mean()) if len(civil) else None
    )
    summary["second_amendment_axis_mean"] = (
        float(second["latent_semantic_axis_z"].mean()) if len(second) else None
    )
    summary["validation_cases"] = int(len(validation_df))
    summary["validation_agreements"] = int(validation_df["agreement"].sum())

    write_csv_with_header(
        df,
        SEMANTICS_CSV,
        [
            "# processed: SCOTUS markdown judicial-semantics rows",
            "# source_upstream: Paper/research/markdown_cases/*.md and Paper/research/case_index.yaml",
            "# unit: full case plus majority/concurrence/dissent where markers are reliable",
            "# method: anchored semantic baskets plus SVD latent axis; not Wordshoal or JuDJIS replication",
            "# generated_by: Paper/scripts/scotus_judicial_semantics.py",
        ],
    )
    write_csv_with_header(
        case_df,
        CASE_SCORES_CSV,
        [
            "# processed: SCOTUS case-level judicial semantic scores",
            "# source_upstream: Paper/data/scotus_judicial_semantics.csv",
            "# orientation: higher latent_semantic_axis_z = historical/kinetic language pole",
            "# generated_by: Paper/scripts/scotus_judicial_semantics.py",
        ],
    )
    write_csv_with_header(
        validation_df,
        VALIDATION_CSV,
        [
            "# processed: expert-coded validation sample for SCOTUS judicial-semantics case study",
            "# source_upstream: Paper/data/scotus_judicial_case_scores.csv",
            "# coding: hand-coded doctrinal posture used to benchmark the text-derived axis",
            "# generated_by: Paper/scripts/scotus_judicial_semantics.py",
        ],
    )

    plot_axis_by_cluster(case_df)
    plot_civil_vs_second(case_df)

    SUMMARY_JSON.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    print(f"loaded cases: {summary['loaded_cases']} / {summary['index_cases']}")
    print(f"opinion-split cases: {summary['split_cases']}")
    print(f"rows: {summary['total_rows']} | latent docs: {summary['latent_docs']}")
    print(f"wrote {SEMANTICS_CSV}")
    print(f"wrote {CASE_SCORES_CSV}")
    print(f"wrote {VALIDATION_CSV}")
    print(f"wrote {SUMMARY_JSON}")
    print(f"wrote {AXIS_FIG}")
    print(f"wrote {GROUP_FIG}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
