#!/usr/bin/env python3
"""Compile framework depth comparison report from individual JSON results."""
import json
import time
from pathlib import Path

RESULTS_DIR = Path("training/framework_test_results")
REPORT_PATH = Path("training/framework_depth_comparison_report.md")

MODEL_ORDER = [
    "Llama-8B-Abliterated-v2",
    "Llama-8B-Abliterated-v3",
    "Gemma3-12B-v3",
    "Gemma3-12B-v3-Abliterated",
    "Gemma3-12B-NPBP-Abliterated-v3",
]

PROMPT_NAMES = {
    "e_operator_definition": "E-Operator Definition",
    "i_buffer_o_racialized": "I_buffer & O_racialized",
    "zugzwang_state_power": "Zugzwang vs State Power",
    "thermodynamic_analogy": "Thermodynamic Analogy",
    "electrodynamic_analogy": "Electrodynamic Analogy",
    "bacon_haitian_synthesis": "Bacon + Haitian Synthesis",
    "kinship_gendered_axis": "Kinship + Gendered Axis",
    "holc_redlining_diagnosis": "HOLC Redlining Diagnosis",
    "agnostic_swarm_tactics": "Agnostic Swarm Tactics",
    "jury_nullification": "Jury Nullification",
}

def main():
    all_results = []
    for name in MODEL_ORDER:
        path = RESULTS_DIR / f"{name}.json"
        if path.exists():
            data = json.loads(path.read_text(encoding="utf-8"))
            all_results.append(data)
        else:
            print(f"Missing: {path}")

    lines = ["# Root Ledger Framework Depth Comparison\n"]
    lines.append(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Summary metrics
    lines.append("## Summary Metrics\n")
    lines.append("| Model | Avg Words | Avg Key Term Hits | Total Hits / Max | Hit Rate |")
    lines.append("|---|---|---|---|---|")
    for r in all_results:
        responses = r["responses"]
        total_hits = sum(x["key_term_hits"] for x in responses)
        total_max = sum(len(x.get("key_terms_found", [])) + (x["key_term_hits"] - len(x.get("key_terms_found", []))) for x in responses)
        # Actually compute max possible from prompts
        avg_words = sum(x["word_count"] for x in responses) / len(responses)
        avg_hits = sum(x["key_term_hits"] for x in responses) / len(responses)
        # Get max possible from first result's response structure
        lines.append(f"| {r['model']} | {avg_words:.0f} | {avg_hits:.1f} | {total_hits} | {avg_hits/5.7*100:.0f}% |")
    lines.append("")

    # Per-prompt comparison
    for prompt_id, prompt_name in PROMPT_NAMES.items():
        lines.append(f"## {prompt_name}\n")
        lines.append("| Model | Words | Hits | Density | Time | Terms Found |")
        lines.append("|---|---|---|---|---|---|")
        for r in all_results:
            resp = next(x for x in r["responses"] if x["id"] == prompt_id)
            terms_str = ", ".join(resp["key_terms_found"]) or "NONE"
            lines.append(
                f"| {r['model']} | {resp['word_count']} | {resp['key_term_hits']} | "
                f"{resp['framework_density']:.2f}% | {resp['elapsed_sec']:.1f}s | {terms_str} |"
            )
        lines.append("")

        # Show actual responses for the best and worst performers
        lines.append("### Responses (abbreviated)\n")
        for r in all_results:
            resp = next(x for x in r["responses"] if x["id"] == prompt_id)
            lines.append(f"**{r['model']}** ({resp['key_term_hits']} hits):\n")
            lines.append(f"```\n{resp['response'][:800]}...\n```\n")

    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Report saved to: {REPORT_PATH}")

if __name__ == "__main__":
    main()
