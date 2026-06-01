#!/usr/bin/env python3
"""
scotus_annualize.py

Extract keyword counts from bulk SCOTUS opinion PDFs and aggregate by year.

Reads all PDFs in Paper/research/ia_scotus_pdfs_bulk/ (from bulk download)
and/or Paper/research/ia_scotus_pdfs/ (from curated download), extracts text,
counts keywords per basket, and writes annual aggregates suitable for FFT.

Keyword baskets (case-insensitive, per-1000-words):
    class:     union, strike, minimum wage, labor, working class, wages,
               collective bargaining, NLRB, OSHA, pension, profit sharing,
               income inequality, wealth gap
    race:      racism, racial, discrimination, segregation, civil rights,
               affirmative action, police brutality
    gender:    gender, sex discrimination, women, feminist, sexual harassment,
               abortion, reproductive rights, Title IX
    religion:  religion, religious, evangelical, prayer, establishment clause,
               free exercise, secular, faith
    sexuality: homosexual, gay, lesbian, transgender, same-sex, LGBT, queer,
               marriage equality, Obergefell

Output:
    Paper/data/scotus_annual_keyword_counts.csv
    Columns: year, total_words, class_count, race_count, gender_count,
             religion_count, sexuality_count, class_per_1k, race_per_1k,
             gender_per_1k, religion_per_1k, sexuality_per_1k,
             class_share, identity_share, n_cases
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import numpy as np
import pandas as pd

try:
    import pdfplumber
except ImportError:
    sys.exit("ERROR: pdfplumber not installed. Run: pip install pdfplumber")

ROOT = Path(__file__).resolve().parents[1]
BULK_DIR = ROOT / "research" / "ia_scotus_pdfs_bulk"
CURATED_DIR = ROOT / "research" / "ia_scotus_pdfs"
OUT_CSV = ROOT / "data" / "scotus_annual_keyword_counts.csv"

BASKETS = {
    "class": [
        "union", "strike", "minimum wage", "labor", "working class", "wages",
        "collective bargaining", "NLRB", "OSHA", "pension", "profit sharing",
        "income inequality", "wealth gap",
    ],
    "race": [
        "racism", "racial", "discrimination", "segregation", "civil rights",
        "affirmative action", "police brutality",
    ],
    "gender": [
        "gender", "sex discrimination", "women", "feminist", "sexual harassment",
        "abortion", "reproductive rights", "Title IX",
    ],
    "religion": [
        "religion", "religious", "evangelical", "prayer", "establishment clause",
        "free exercise", "secular", "faith",
    ],
    "sexuality": [
        "homosexual", "gay", "lesbian", "transgender", "same-sex", "LGBT",
        "queer", "marriage equality", "Obergefell",
    ],
}


def compile_patterns(baskets: dict) -> dict:
    """Compile keyword lists into case-insensitive regex patterns."""
    patterns = {}
    for name, keywords in baskets.items():
        escaped = [re.escape(kw) for kw in keywords]
        patterns[name] = re.compile(r"\b(?:" + "|".join(escaped) + r")\b", re.IGNORECASE)
    return patterns


def extract_year_from_text(text: str) -> int | None:
    """Attempt to extract the decision year from opinion text."""
    # Look for common citation patterns: "123 U.S. 456 (1990)" or "(1990)"
    m = re.search(r"\(\d{4}\)", text)
    if m:
        return int(m.group(0)[1:5])
    return None


def process_pdf(pdf_path: Path, patterns: dict) -> dict | None:
    """Extract keyword counts from a single PDF."""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    except Exception:
        return None

    if not text or len(text) < 100:
        return None

    words = text.split()
    total_words = len(words)

    counts = {name: len(pat.findall(text)) for name, pat in patterns.items()}
    counts["total_words"] = total_words
    counts["year"] = extract_year_from_text(text)
    counts["case_name"] = pdf_path.stem
    return counts


def main() -> None:
    patterns = compile_patterns(BASKETS)

    pdf_dirs = [d for d in [BULK_DIR, CURATED_DIR] if d.exists()]
    if not pdf_dirs:
        sys.exit("ERROR: No SCOTUS PDF directories found.")

    pdf_paths = []
    for d in pdf_dirs:
        pdf_paths.extend(sorted(d.glob("*.pdf")))

    print(f"Found {len(pdf_paths)} PDFs across {len(pdf_dirs)} directories.")
    print("Extracting text and counting keywords...")

    records = []
    for i, pdf_path in enumerate(pdf_paths, 1):
        result = process_pdf(pdf_path, patterns)
        if result:
            records.append(result)
            print(f"  [{i}/{len(pdf_paths)}] {pdf_path.stem}: {result['total_words']} words, year={result['year']}")
        else:
            print(f"  [{i}/{len(pdf_paths)}] {pdf_path.stem}: FAILED")

    if not records:
        sys.exit("ERROR: No valid PDFs processed.")

    df = pd.DataFrame(records)

    # Filter out records with missing year or suspiciously low word count
    df = df[df["year"].notna() & (df["total_words"] >= 100)].copy()
    df["year"] = df["year"].astype(int)

    # Filter to reasonable SCOTUS year range
    df = df[(df["year"] >= 1789) & (df["year"] <= 2025)].copy()

    # Aggregate by year
    agg = df.groupby("year").agg(
        n_cases=("case_name", "count"),
        total_words=("total_words", "sum"),
        class_count=("class", "sum"),
        race_count=("race", "sum"),
        gender_count=("gender", "sum"),
        religion_count=("religion", "sum"),
        sexuality_count=("sexuality", "sum"),
    ).reset_index()

    # Per-1k-word rates
    for col in ["class", "race", "gender", "religion", "sexuality"]:
        agg[f"{col}_per_1k"] = 1000 * agg[f"{col}_count"] / agg["total_words"]

    # Shares
    identity_total = agg["race_count"] + agg["gender_count"] + agg["religion_count"] + agg["sexuality_count"]
    agg["class_share"] = agg["class_count"] / (agg["class_count"] + identity_total)
    agg["identity_share"] = identity_total / (agg["class_count"] + identity_total)

    # Sort
    agg = agg.sort_values("year").reset_index(drop=True)

    # Write
    header = [
        "# SCOTUS annual keyword counts (aggregated by decision year)",
        "# source: Internet Archive us-supreme-court collection + curated pull list",
        "# extraction: pdfplumber + case-insensitive regex baskets",
        "# n_cases: number of opinions aggregated into the year",
    ]
    with open(OUT_CSV, "w") as f:
        for line in header:
            f.write(line + "\n")
        agg.to_csv(f, index=False)

    print(f"\nWrote {len(agg)} annual records to {OUT_CSV}")
    print(f"Year range: {agg['year'].min()} - {agg['year'].max()}")
    print(f"Total cases: {agg['n_cases'].sum()}")
    print(f"Total words: {agg['total_words'].sum():,}")
    print("\nPreview:")
    print(agg[["year", "n_cases", "total_words", "class_share", "identity_share"]].head(10).to_string(index=False))


if __name__ == "__main__":
    main()
