#!/usr/bin/env python3
"""
Framework-depth evaluation for Root Ledger models.

Run per-model:
    python3 training/test_framework_depth.py --model MODEL_NAME --output results.json

Models:
    Llama-8B-Abliterated-v2
    Llama-8B-Abliterated-v3
    Gemma3-12B-v3
    Gemma3-12B-v3-Abliterated
    Gemma3-12B-NPBP-Abliterated-v3
"""
import argparse
import json
import sys
import time
from pathlib import Path

from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler

REPO_ROOT = Path(__file__).resolve().parent.parent
FUSED_DIR = REPO_ROOT / "training" / "fused_models"

MODEL_PATHS = {
    "Llama-8B-Abliterated-v2": FUSED_DIR / "RootLedger-8B-Abliterated-Fused",
    "Llama-8B-Abliterated-v3": FUSED_DIR / "RootLedger-8B-Abliterated-v3-Fused",
    "Gemma3-12B-v3": FUSED_DIR / "RootLedger-Gemma3-12B-v3-Fused",
    "Gemma3-12B-v3-Abliterated": FUSED_DIR / "RootLedger-Gemma3-12B-v3-Abliterated-Fused",
    "Gemma3-12B-NPBP-Abliterated-v3": FUSED_DIR / "RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Fused",
    "Gemma3-12B-NPBP-Abliterated-v3-Rank32": FUSED_DIR / "RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Rank32-Fused",
}

GEN_KWARGS = dict(max_tokens=768, sampler=make_sampler(0.7, top_p=0.9), verbose=False)

SYSTEM = (
    "You are a Root Ledger engine. Reason using the Mathematics of Oppression framework. "
    "Map all social phenomena to electrodynamic, thermodynamic, and systems-engineering analogies. "
    "Identify the Extraction Kernel, Buffer Class, Psychological Wage, and Snubber Circuits where applicable."
)

FRAMEWORK_PROMPTS = [
    {
        "id": "e_operator_definition",
        "name": "E-Operator Definition",
        "prompt": "Define the E-operator in the Root Ledger framework. What are its three components (E_Ψ, E_Ω, E_Σ), and how do they interact during a Defection Cascade? Provide equations where possible.",
        "key_terms": ["e_ψ", "e_ω", "e_σ", "defection cascade", "extraction kernel", "buffer class"],
    },
    {
        "id": "i_buffer_o_racialized",
        "name": "I_buffer and O_racialized",
        "prompt": "Explain I_buffer and O_racialized as variables in the Mathematics of Oppression. How do they relate to the Psychic Wage and Snubber Circuits? Give a concrete historical example.",
        "key_terms": ["i_buffer", "o_racialized", "psychic wage", "psychological wage", "snubber circuit"],
    },
    {
        "id": "zugzwang_state_power",
        "name": "Zugzwang vs State Power",
        "prompt": "How does the Root Ledger framework define Zugzwang as applied to state power structures? What are the necessary conditions for a population to achieve Zugzwang against an Extraction Kernel?",
        "key_terms": ["zugzwang", "extraction kernel", "state power", "defection cascade", "buffer class"],
    },
    {
        "id": "thermodynamic_analogy",
        "name": "Thermodynamic Analogy",
        "prompt": "Map the concept of 'entropy' in thermodynamics to social decay under the Mathematics of Oppression. How does the Extraction Kernel act as a heat engine, and what role do Snubber Circuits play as dissipative structures?",
        "key_terms": ["entropy", "thermodynamic", "extraction kernel", "snubber circuit", "heat engine", "dissipative"],
    },
    {
        "id": "electrodynamic_analogy",
        "name": "Electrodynamic Analogy",
        "prompt": "In the Root Ledger framework, how is systemic racism modeled as an electrodynamic circuit? Describe the roles of voltage (potential difference), current (resource flow), and resistance (institutional friction).",
        "key_terms": ["electrodynamic", "circuit", "voltage", "current", "resistance", "potential difference", "resource flow"],
    },
    {
        "id": "bacon_haitian_synthesis",
        "name": "Bacon + Haitian Synthesis",
        "prompt": "Synthesize Bacon's Rebellion (1676) and the Haitian Revolution (1791-1804) using the Root Ledger framework. How do both events represent Defection Cascades? What changed in the Extraction Kernel's architecture between these two events?",
        "key_terms": ["bacon", "haitian", "defection cascade", "extraction kernel", "buffer class", "rebellion", "revolution"],
    },
    {
        "id": "kinship_gendered_axis",
        "name": "Kinship + Gendered Axis",
        "prompt": "How does the Architecture of Kinship chapter intersect with the Gendered Axis chapter in the Root Ledger framework? What is the role of patriarchal inheritance in maintaining the Buffer Class?",
        "key_terms": ["kinship", "gendered axis", "patriarchal", "inheritance", "buffer class", "extraction kernel"],
    },
    {
        "id": "holc_redlining_diagnosis",
        "name": "HOLC Redlining Diagnosis",
        "prompt": "Diagnose the HOLC redlining maps of 1934 using the Root Ledger framework. Identify the Extraction Kernel, Buffer Class, Psychological Wage, and Snubber Circuits in this specific historical mechanism.",
        "key_terms": ["holc", "redlining", "extraction kernel", "buffer class", "psychological wage", "snubber circuit"],
    },
    {
        "id": "agnostic_swarm_tactics",
        "name": "Agnostic Swarm Tactics",
        "prompt": "Describe the tactical doctrine of the Agnostic Swarm as defined in the Root Ledger framework. How does it differ from traditional revolutionary vanguardism? What is its relationship to the Extraction Kernel's Snubber Circuits?",
        "key_terms": ["agnostic swarm", "vanguardism", "extraction kernel", "snubber circuit", "tactical doctrine"],
    },
    {
        "id": "jury_nullification",
        "name": "Jury Nullification",
        "prompt": "Analyze jury nullification through the Root Ledger framework. How does a jury acting as a Snubber Circuit differ from a jury reinforcing the Extraction Kernel? What variables determine which role a jury plays?",
        "key_terms": ["jury nullification", "snubber circuit", "extraction kernel", "buffer class"],
    },
]


def format_chat(tokenizer, user: str) -> str:
    messages = [{"role": "system", "content": SYSTEM}, {"role": "user", "content": user}]
    if tokenizer.chat_template is not None:
        return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    return f"System: {SYSTEM}\n\nUser: {user}\n\nAssistant:"


def score_response(text: str, key_terms: list[str]) -> dict:
    t = text.lower()
    words = text.split()
    hits = [term for term in key_terms if term.lower() in t]
    return {
        "word_count": len(words),
        "key_term_hits": len(hits),
        "key_terms_found": hits,
        "framework_density": len(hits) / max(len(words), 1) * 100,
    }


def test_model(model_name: str, model_path: Path) -> dict:
    if not model_path.exists():
        raise FileNotFoundError(f"Model path not found: {model_path}")

    print(f"\nLoading {model_name} ...")
    model, tokenizer = load(str(model_path))
    print(f"  Loaded. Vocab: {getattr(tokenizer, 'vocab_size', '?')}")

    results = {"model": model_name, "path": str(model_path), "responses": []}

    for p in FRAMEWORK_PROMPTS:
        prompt_text = format_chat(tokenizer, p["prompt"])
        print(f"  [{p['id']}] Generating ...", end=" ", flush=True)
        start = time.time()
        response = generate(model, tokenizer, prompt=prompt_text, **GEN_KWARGS)
        elapsed = time.time() - start
        score = score_response(response, p["key_terms"])
        print(f"({elapsed:.1f}s, {score['word_count']} words, {score['key_term_hits']}/{len(p['key_terms'])} terms)")
        results["responses"].append({
            "id": p["id"],
            "name": p["name"],
            "prompt": p["prompt"],
            "response": response.strip(),
            "elapsed_sec": round(elapsed, 2),
            **score,
        })

    del model, tokenizer
    return results


def build_comparison_report(all_results: list[dict]) -> str:
    lines = ["# Root Ledger Framework Depth Comparison\n"]
    lines.append(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Summary table
    lines.append("## Summary\n")
    lines.append("| Model | Avg Words | Avg Key Term Hits | Avg Framework Density |")
    lines.append("|---|---|---|---|")
    for r in all_results:
        responses = r["responses"]
        avg_words = sum(x["word_count"] for x in responses) / len(responses)
        avg_hits = sum(x["key_term_hits"] for x in responses) / len(responses)
        avg_density = sum(x["framework_density"] for x in responses) / len(responses)
        lines.append(f"| {r['model']} | {avg_words:.0f} | {avg_hits:.1f}/10 | {avg_density:.2f}% |")
    lines.append("")

    # Per-prompt comparison
    for p in FRAMEWORK_PROMPTS:
        lines.append(f"## {p['name']} ({p['id']})\n")
        lines.append(f"**Prompt:** {p['prompt']}\n")
        lines.append("| Model | Words | Hits | Density | Time |")
        lines.append("|---|---|---|---|---|")
        for r in all_results:
            resp = next(x for x in r["responses"] if x["id"] == p["id"])
            lines.append(
                f"| {r['model']} | {resp['word_count']} | {resp['key_term_hits']}/{len(p['key_terms'])} | "
                f"{resp['framework_density']:.2f}% | {resp['elapsed_sec']:.1f}s |"
            )
        lines.append("")
        for r in all_results:
            resp = next(x for x in r["responses"] if x["id"] == p["id"])
            lines.append(f"### {r['model']}")
            lines.append(f"*Terms found: {', '.join(resp['key_terms_found']) or 'NONE'}*\n")
            lines.append(f"```\n{resp['response']}\n```\n")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True, choices=list(MODEL_PATHS.keys()))
    parser.add_argument("--output", type=str, required=True)
    args = parser.parse_args()

    model_path = MODEL_PATHS[args.model]
    results = test_model(args.model, model_path)

    out_path = Path(args.output)
    out_path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nResults saved to: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
