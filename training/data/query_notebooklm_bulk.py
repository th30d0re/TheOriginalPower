#!/usr/bin/env python3
"""
Bulk-query NotebookLM to generate training examples efficiently.

Instead of 40+ individual queries (~50s each), asks for 10 Q&A pairs
per query (~60s each) — 4x faster.
"""

import json
import subprocess
import sys
import time
from pathlib import Path

NOTEBOOK_ID = "3768683a-e0be-447e-bd59-36cea2e6e9ee"
OUTPUT_FILE = Path("training/data/from_notebooklm.jsonl")
NLM_BIN = ".venv-notebooklm/bin/nlm"

BULK_PROMPTS = [
    """Generate 10 detailed question-and-answer pairs about the Root Ledger framework's core concepts: the five-tier hierarchy (Elite, Puppet Class, Enforcement Class, Buffer Class, Out-group), the Tri-Modal Enclosure Model, and the electrodynamic circuit analogy. Each Q&A should be substantive (at least 3 sentences in the answer). Format as a JSON array with "prompt" and "completion" fields.""",
    
    """Generate 10 detailed question-and-answer pairs about historical mechanisms in systemic racism: Bacon's Rebellion, the Constitutional Patch of 1787, the Haitian Catalyst, the 13th Amendment loophole, redlining, the War on Drugs as Variable Swap, and the Tweedism Filter. Each Q&A should be substantive. Format as a JSON array with "prompt" and "completion" fields.""",
    
    """Generate 10 detailed question-and-answer pairs about the mathematical/formal aspects of the framework: the extraction equation, the Reparations Integral, the Buffer-Class Work Theorem, kinetic resistance ρ_τ, the Johnson Theorem, the Concession Theorem, and the Complex Power signal ψ. Format as a JSON array with "prompt" and "completion" fields.""",
    
    """Generate 10 detailed question-and-answer pairs about empirical validation, QuantCrit, algorithmic bias, Signal Inflation, Iterated Audits, Racecraft, colorblind racism, and the Racialized Social System. Format as a JSON array with "prompt" and "completion" fields.""",
    
    """Generate 10 detailed question-and-answer pairs about the framework's metatheory: psycho-legal social software, the fractal mind virus, Elite Obscuration, the Square Ceiling, DC vs AC mode oppression, and why racism is an engineering problem. Format as a JSON array with "prompt" and "completion" fields.""",
]


def query_bulk(prompt: str) -> list:
    """Query NotebookLM and extract JSON Q&A pairs."""
    cmd = [NLM_BIN, "query", "notebook", NOTEBOOK_ID, prompt]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        if result.returncode != 0:
            print(f"  Error: {result.stderr[:200]}")
            return []
        
        # Parse the JSON response
        data = json.loads(result.stdout)
        answer = data.get("answer", "")
        
        # Extract JSON array from markdown code block if present
        if "```json" in answer:
            json_text = answer.split("```json")[1].split("```")[0].strip()
        elif "```" in answer:
            json_text = answer.split("```")[1].split("```")[0].strip()
        else:
            json_text = answer.strip()
        
        pairs = json.loads(json_text)
        if isinstance(pairs, list):
            return pairs
        return []
    except subprocess.TimeoutExpired:
        print("  Timeout")
        return []
    except Exception as e:
        print(f"  Exception: {e}")
        return []


def main():
    print(f"Bulk-querying NotebookLM notebook {NOTEBOOK_ID}")
    print(f"Batches: {len(BULK_PROMPTS)}")
    
    all_examples = []
    for i, prompt in enumerate(BULK_PROMPTS, 1):
        print(f"\n[{i}/{len(BULK_PROMPTS)}] Querying batch...")
        pairs = query_bulk(prompt)
        print(f"  Got {len(pairs)} pairs")
        
        for p in pairs:
            if "prompt" in p and "completion" in p:
                all_examples.append({
                    "prompt": p["prompt"].strip(),
                    "completion": p["completion"].strip()
                })
        
        time.sleep(3)  # Rate limit
    
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        for ex in all_examples:
            f.write(json.dumps(ex) + '\n')
    
    print(f"\nWrote {len(all_examples)} examples to {OUTPUT_FILE}")
    if OUTPUT_FILE.exists():
        print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
