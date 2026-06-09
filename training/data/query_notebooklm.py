#!/usr/bin/env python3
"""
Query NotebookLM notebook to generate training examples.

Uses the nlm CLI to ask framework-specific questions and saves
responses as prompt-completion pairs.

Notebook: 3768683a-e0be-447e-bd59-36cea2e6e9ee
"""

import json
import subprocess
import sys
import time
from pathlib import Path
from typing import List

NOTEBOOK_ID = "3768683a-e0be-447e-bd59-36cea2e6e9ee"
OUTPUT_FILE = Path("training/data/from_notebooklm.jsonl")
NLM_BIN = ".venv-notebooklm/bin/nlm"

# Framework-deep questions designed to elicit detailed, specific responses
QUESTIONS = [
    # Core definitions
    "What is the five-tier hierarchy in the Root Ledger framework? Name each tier and its function.",
    "Explain the Tri-Modal Enclosure Model. What are the three modes and how do they prevent the Out-group from perceiving the architecture?",
    "What is the Variable Swap in systemic racism? How does it function as a DC-to-AC migration?",
    "Define the Buffer Class I_buffer. What is the suppression allocation and how does it create complicity?",
    "What is the difference between DC mode and AC mode oppression in the electrodynamic formalism?",
    "Explain Elite Obscuration and the Square Ceiling. Why is the apex invisible from the base?",
    "What is the fractal mind virus? How does it reproduce at different scales?",
    "Define the Racialized Social System (RSS) and explain how colorblind racism functions within it.",
    "What is Racecraft? How does Karen Fields' concept differ from conventional race theory?",
    "Explain Signal Inflation and Iterated Audits in the context of algorithmic bias.",
    
    # Historical mechanisms
    "How did Bacon's Rebellion lead to the formalization of the Buffer Class?",
    "What was the Constitutional Patch of 1787? How did it prototype the Puppet Class?",
    "Explain the Haitian Catalyst and its effect on the algorithmic lockdown.",
    "What is the 13th Amendment loophole and how does it connect to the slave-patrol genealogy?",
    "How does redlining function as a diode in the extraction circuit?",
    "What is the War on Drugs as a Variable Swap? Explain the 1968-1994 recompile.",
    "Explain the Tweedism Filter and how it industrializes the Puppet Class.",
    "What is cannibalization in the terminal runtime? How does the 5-Tier Reveal work?",
    
    # Mathematical/formal
    "State the extraction equation and explain each variable.",
    "What is the Reparations Integral? How does it calculate systemic work?",
    "Explain the Buffer-Class Work Theorem. What does it prove about complicity?",
    "What is kinetic resistance ρ_τ and how is it measured?",
    "Explain the Johnson Theorem. What empirical confession does it extract from the algorithm?",
    "What is the Concession Theorem? What contradiction does it expose?",
    "Explain the electrodynamic analogy: how does the five-tier hierarchy map to a circuit?",
    "What is the Complex Power signal ψ and how does it relate to the psychological wage?",
    
    # Empirical validation
    "What evidence links 1930s HOLC redlining to modern health crises?",
    "How does QuantCrit support the framework's use of set theory?",
    "What are the three confidence tiers for empirical claims in the book?",
    "Explain the anchor-and-scale methodology used for kinetic resistance.",
    
    # Global and intersectional
    "How does the framework apply to modern supply chains and global extraction zones?",
    "What is the N-weighted phase AC model and how does it handle intersectionality?",
    "How does the framework explain the expansion of the Out-group over time?",
    "What is the global containment field and how does it enforce the algorithm internationally?",
    
    # Metatheoretical
    "Why is racism an engineering problem rather than a moral failing?",
    "What is psycho-legal social software and how does it run on human wetware?",
    "Explain the difference between identity-based and variable-based analysis of oppression.",
    "What does it mean that the Elite gate energy rather than supply it?",
    "How does the framework define racism in its final vector-valued form?",
]


def query_notebook(question: str) -> str:
    """Query the NotebookLM notebook via nlm CLI."""
    cmd = [NLM_BIN, "query", "notebook", NOTEBOOK_ID, question]
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0:
            print(f"  Error: {result.stderr[:200]}")
            return ""
        return result.stdout.strip()
    except subprocess.TimeoutExpired:
        print("  Timeout")
        return ""
    except Exception as e:
        print(f"  Exception: {e}")
        return ""


def main():
    print(f"Querying NotebookLM notebook {NOTEBOOK_ID}")
    print(f"Questions: {len(QUESTIONS)}")
    
    examples = []
    for i, question in enumerate(QUESTIONS, 1):
        print(f"\n[{i}/{len(QUESTIONS)}] {question[:60]}...")
        answer = query_notebook(question)
        if not answer or len(answer) < 100:
            print(f"  Skipping (too short or empty: {len(answer)} chars)")
            continue
        print(f"  Response: {len(answer)} chars")
        examples.append({"prompt": question, "completion": answer})
        # Rate limit: be nice to the API
        time.sleep(2)
    
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        for ex in examples:
            f.write(json.dumps(ex) + '\n')
    
    print(f"\nWrote {len(examples)} examples to {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
