#!/usr/bin/env python3
"""
Extract training examples from The_Original_Power.tex LaTeX source.

Generates prompt-completion pairs from:
- Definitions (\begin{definition})
- Theorems (\begin{theorem})
- Conjectures (\begin{conjecture})
- Section/subsection content (\section, \subsection)
- Key equations and notation
- Frontmatter concepts (Preface, Empirical Methodology)

Output: JSONL with {"prompt": ..., "completion": ...} entries.
"""

import json
import re
import sys
from pathlib import Path
from dataclasses import dataclass
from typing import List, Tuple

# --- Configuration ---
LATEX_FILE = Path("Paper/The_Original_Power.tex")
OUTPUT_FILE = Path("training/data/from_latex.jsonl")
MIN_COMPLETION_LEN = 80
MAX_COMPLETION_LEN = 4096

# --- Prompt templates ---
DEFINITION_PROMPTS = [
    "Define {term} in the Root Ledger framework.",
    "What is {term}?",
    "Explain the concept of {term}.",
    "In the physics-of-oppression framework, what does {term} mean?",
]

THEOREM_PROMPTS = [
    "State and explain the {name}.",
    "What does the {name} establish?",
    "Explain the {name} and its implications.",
]

CONCEPT_PROMPTS = [
    "Explain {topic} in the systemic extraction framework.",
    "What is {topic} and how does it function?",
    "Describe {topic} within the Root Ledger model.",
    "How does {topic} operate in systems of oppression?",
]

NOTATION_PROMPTS = [
    "What does the notation {notation} represent?",
    "Explain the symbol {notation} in the framework.",
    "Define {notation} and its role in the extraction model.",
]


def strip_latex_macros(text: str) -> str:
    """Remove common LaTeX macros for cleaner training text."""
    # Remove comments
    text = re.sub(r'(?<!\\)%.*$', '', text, flags=re.MULTILINE)
    # Remove \cite{...}
    text = re.sub(r'\\cite\{[^}]+\}', '', text)
    # Remove \label{...}
    text = re.sub(r'\\label\{[^}]+\}', '', text)
    # Remove \ref{...}
    text = re.sub(r'\\ref\{[^}]+\}', '', text)
    # Remove \pageref{...}
    text = re.sub(r'\\pageref\{[^}]+\}', '', text)
    # Remove \footnote{...}
    text = re.sub(r'\\footnote\{[^}]*\}', '', text)
    # Remove \index{...}
    text = re.sub(r'\\index\{[^}]+\}', '', text)
    # Remove \emph, \textbf, \textit (keep content)
    text = re.sub(r'\\(emph|textbf|textit|textsl)\{([^}]*)\}', r'\2', text)
    # Remove \medskip, \noindent, etc.
    text = re.sub(r'\\(medskip|noindent|bigskip|smallskip|vspace\{[^}]*\})', '', text)
    # Remove \begin/end environments we don't want
    text = re.sub(r'\\begin\{(equation|align|figure|table|enumerate|itemize|tikzpicture)\}.*?\\end\{\1\}', '', text, flags=re.DOTALL)
    # Remove \item
    text = re.sub(r'\\item\s*', '- ', text)
    # Clean up multiple spaces/newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()


def extract_brace_content(text: str, start_idx: int) -> Tuple[str, int]:
    """Extract content inside matching braces starting at start_idx."""
    assert text[start_idx] == '{'
    depth = 1
    i = start_idx + 1
    while i < len(text) and depth > 0:
        if text[i] == '{' and (i == 0 or text[i-1] != '\\'):
            depth += 1
        elif text[i] == '}' and (i == 0 or text[i-1] != '\\'):
            depth -= 1
        i += 1
    return text[start_idx+1:i-1], i


def extract_environment(latex: str, env_name: str) -> List[Tuple[str, str]]:
    """Extract all occurrences of \begin{env_name}...\end{env_name}.
    Returns list of (title/content, body) tuples."""
    results = []
    pattern = re.compile(
        rf'\\begin\{{{env_name}\}}(?:\[(.*?)\])?(.*?)\\end\{{{env_name}\}}',
        re.DOTALL
    )
    for match in pattern.finditer(latex):
        title = match.group(1) or ""
        body = match.group(2)
        results.append((title.strip(), body.strip()))
    return results


def extract_sections(latex: str) -> List[Tuple[str, str, str]]:
    """Extract sections with their content.
    Returns list of (level, title, body) where level is section/subsection."""
    results = []
    # Pattern matches \section*{?}{title} or \section{title}
    sec_pattern = re.compile(
        r'\\(section|subsection|subsubsection)(\*)?\{([^}]+)\}'
    )
    
    matches = list(sec_pattern.finditer(latex))
    for i, match in enumerate(matches):
        level = match.group(1)
        title = match.group(3)
        start = match.end()
        end = matches[i+1].start() if i + 1 < len(matches) else len(latex)
        body = latex[start:end]
        results.append((level, title, body.strip()))
    return results


def clean_body(body: str) -> str:
    """Clean section body for training."""
    body = strip_latex_macros(body)
    # Remove remaining \begin/\end of boxes
    body = re.sub(r'\\begin\{(definition|keyinsight|historicalsource)\}(?:\[.*?\])?(.*?)\\end\{\1\}', r'\2', body, flags=re.DOTALL)
    # Remove equation environments
    body = re.sub(r'\\begin\{equation\*?\}.*?\\end\{equation\*?\}', '', body, flags=re.DOTALL)
    body = re.sub(r'\\begin\{align\*?\}.*?\\end\{align\*?\}', '', body, flags=re.DOTALL)
    # Inline math: keep it, it's valuable
    # Remove \[ ... \] display math (often too complex for text completion)
    body = re.sub(r'\\\[.*?\\\]', '', body, flags=re.DOTALL)
    return body.strip()


def make_examples() -> List[dict]:
    """Generate all training examples from the LaTeX source."""
    examples = []
    latex = LATEX_FILE.read_text()
    
    # --- 1. Definitions ---
    defs = extract_environment(latex, "definition")
    for title, body in defs:
        term = title if title else "this concept"
        body_clean = strip_latex_macros(body)
        if len(body_clean) < MIN_COMPLETION_LEN:
            continue
        for template in DEFINITION_PROMPTS:
            prompt = template.format(term=term)
            examples.append({"prompt": prompt, "completion": body_clean})
    print(f"  Definitions: {len(defs)} extracted → {len([e for e in examples if 'Define' in e['prompt'] or 'What is' in e['prompt']])} examples")
    
    # --- 2. Theorems ---
    theorems = extract_environment(latex, "theorem")
    for title, body in theorems:
        name = title if title else "this theorem"
        body_clean = strip_latex_macros(body)
        if len(body_clean) < MIN_COMPLETION_LEN:
            continue
        for template in THEOREM_PROMPTS:
            prompt = template.format(name=name)
            examples.append({"prompt": prompt, "completion": body_clean})
    print(f"  Theorems: {len(theorems)} extracted")
    
    # --- 3. Conjectures ---
    conjectures = extract_environment(latex, "conjecture")
    for title, body in conjectures:
        name = title if title else "this conjecture"
        body_clean = strip_latex_macros(body)
        if len(body_clean) < MIN_COMPLETION_LEN:
            continue
        examples.append({"prompt": f"State and explain the {name}.", "completion": body_clean})
    print(f"  Conjectures: {len(conjectures)} extracted")
    
    # --- 4. Sections and Subsections ---
    sections = extract_sections(latex)
    sec_count = 0
    for level, title, body in sections:
        body_clean = clean_body(body)
        if len(body_clean) < MIN_COMPLETION_LEN:
            continue
        # Truncate very long sections
        if len(body_clean) > MAX_COMPLETION_LEN:
            body_clean = body_clean[:MAX_COMPLETION_LEN].rsplit('.', 1)[0] + '.'
        
        for template in CONCEPT_PROMPTS:
            prompt = template.format(topic=title)
            examples.append({"prompt": prompt, "completion": body_clean})
            sec_count += 1
    print(f"  Sections/subsections: {len(sections)} extracted → {sec_count} examples")
    
    # --- 5. Key Notation / Equations ---
    # Extract named equations with labels
    equation_blocks = re.findall(
        r'\\begin\{equation\}.*?\\label\{([^}]+)\}(.*?)\\end\{equation\}',
        latex, re.DOTALL
    )
    eq_examples = 0
    for label, eq_body in equation_blocks:
        eq_clean = strip_latex_macros(eq_body).strip()
        if len(eq_clean) < 20:
            continue
        # Map labels to human names
        label_map = {
            'eq:extraction': 'the extraction equation',
            'eq:vector': 'the vector equation of racism',
            'eq:reparations': 'the reparations integral',
            'eq:buffer_work': 'the Buffer-Class Work Theorem',
            'eq:compounding': 'the compounding harm equation',
        }
        name = label_map.get(label, label.replace('_', ' '))
        examples.append({
            "prompt": f"Write the equation for {name}.",
            "completion": f"The equation for {name} is:\n\n\\[{eq_clean}\\]"
        })
        examples.append({
            "prompt": f"Explain the mathematical form of {name}.",
            "completion": f"The {name} is expressed as:\n\n\\[{eq_clean}\\]\n\nThis equation captures..."
        })
        eq_examples += 2
    print(f"  Equations: {len(equation_blocks)} extracted → {eq_examples} examples")
    
    # --- 6. Notation glossary ---
    notation_pairs = [
        (r"E_\{?\\text\{ Elite \}\}?|\\mathbf\{E\}", "E (the Elite)"),
        (r"O_\{?\\text\{racialized\}\}?|O_\{\\text\{out\}\}", "O_racialized (the Out-group)"),
        (r"I_\{?\\text\{buffer\}\}?", "I_buffer (the Buffer Class)"),
        (r"P_\{?\\text\{uppet\}\}?", "P_puppet (the Puppet Class)"),
        (r"F_\{?\\text\{enforce\}\}?", "F_enforce (the Enforcement Class)"),
        (r"\\psi|\\Psi", "ψ (the psychological wage)"),
        (r"\\rho_\\tau|\\rho_\{\\tau\}", "ρ_τ (kinetic resistance)"),
        (r"V_\{?cc\}?", "V_cc (the power supply voltage)"),
    ]
    for pattern, human_name in notation_pairs:
        if re.search(pattern, latex):
            examples.append({
                "prompt": f"What does {human_name} represent in the framework?",
                "completion": f"{human_name} is a key variable in the Root Ledger framework. It represents..."
            })
    print(f"  Notation entries: {len(notation_pairs)}")
    
    # --- 7. Chapter overviews ---
    chapters = re.findall(r'\\chapter\*?\{([^}]+)\}', latex)
    for ch_title in chapters:
        if "Preface" in ch_title or "Empirical" in ch_title:
            continue
        examples.append({
            "prompt": f"Summarize the chapter '{ch_title}' from The Original Power.",
            "completion": f"The chapter '{ch_title}' develops..."
        })
    print(f"  Chapter overviews: {len(chapters)}")
    
    return examples


def main():
    print(f"Reading {LATEX_FILE} ({LATEX_FILE.stat().st_size:,} bytes)...")
    examples = make_examples()
    
    # Deduplicate by prompt
    seen = set()
    unique = []
    for ex in examples:
        key = ex["prompt"]
        if key not in seen:
            seen.add(key)
            unique.append(ex)
    
    print(f"\nTotal examples: {len(examples)}")
    print(f"After dedup: {len(unique)}")
    
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        for ex in unique:
            f.write(json.dumps(ex) + '\n')
    
    print(f"Wrote {len(unique)} examples to {OUTPUT_FILE}")
    print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
