#!/usr/bin/env python3
"""
Extract text from PDF sources and convert to training examples.

Processes PDFs in Sources/ and chapters/ directories.
Chunks long documents and creates Q&A-style prompts.
"""

import json
import sys
from pathlib import Path
from typing import List, Tuple
import pdfplumber

PDF_DIRS = [Path("Sources"), Path("chapters")]
OUTPUT_FILE = Path("training/data/from_pdfs.jsonl")
CHUNK_SIZE = 2000      # chars per chunk
CHUNK_OVERLAP = 200
MIN_CHUNK_LEN = 300
MAX_EXAMPLES_PER_PDF = 20

# Map filenames to descriptive topics
FILENAME_TOPICS = {
    "Fanon": "Frantz Fanon's analysis of colonialism and racism",
    "housing": "racial housing covenants and segregation",
    "Discrimination": "systemic discrimination and accountability",
    "judicial": "judicial ideology and bias",
    "redlining": "redlining and its effects",
    "Algorithmic": "algorithmic bias and fairness",
    "Mass": "mass incarceration",
    "Incarceration": "incarceration and the prison system",
    "QuantCrit": "Quantitative Critical Race Theory",
    "capital": "racial capitalism",
    "slavery": "chattel slavery and its economics",
    "policing": "policing and law enforcement",
    "13th": "the 13th Amendment and its loophole",
    "Voting": "voting rights and suppression",
    "Wealth": "racial wealth gap",
    "Education": "educational inequality",
    "Health": "health disparities",
    "Criminal": "criminal justice system",
    "Constitution": "Constitutional racism",
    "Reconstruction": "Reconstruction era",
    "Jim_Crow": "Jim Crow laws",
    "Civil_Rights": "Civil Rights Movement",
    "Immigration": "immigration and racism",
    "Labor": "labor and race",
    "Gender": "gender and intersectionality",
    "Psychology": "psychology of racism",
    "Critical": "Critical Race Theory",
    "Colorblind": "colorblind racism",
    "Whiteness": "whiteness studies",
    "Indigenous": "Indigenous oppression",
    "Colonialism": "colonialism",
}


def guess_topic(filepath: Path) -> str:
    """Guess a topic description from the filename."""
    name = filepath.stem.replace('_', ' ')
    for key, topic in FILENAME_TOPICS.items():
        if key.lower() in name.lower():
            return topic
    return name


def extract_pdf_text(filepath: Path) -> str:
    """Extract text from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"  Error reading {filepath}: {e}")
        return ""
    return text


def chunk_text(text: str, size: int, overlap: int) -> List[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + size, len(text))
        # Try to end at a sentence boundary
        if end < len(text):
            for sep in ['. ', '\n\n', '\n']:
                pos = text.rfind(sep, start + size - 200, end)
                if pos != -1:
                    end = pos + len(sep)
                    break
        chunk = text[start:end].strip()
        if len(chunk) >= MIN_CHUNK_LEN:
            chunks.append(chunk)
        start = end - overlap
        if start >= len(text) - overlap:
            break
    return chunks


def make_examples_from_pdf(filepath: Path) -> List[dict]:
    """Generate training examples from a single PDF."""
    print(f"  Processing: {filepath.name}")
    text = extract_pdf_text(filepath)
    if not text or len(text) < MIN_CHUNK_LEN:
        print(f"    Too short or empty ({len(text)} chars)")
        return []
    
    topic = guess_topic(filepath)
    chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
    
    examples = []
    templates = [
        "Analyze {topic} in the context of systemic oppression.",
        "What does the research say about {topic}?",
        "Summarize the key findings on {topic}.",
        "How does {topic} relate to the Root Ledger framework?",
    ]
    
    for i, chunk in enumerate(chunks[:MAX_EXAMPLES_PER_PDF]):
        prompt = templates[i % len(templates)].format(topic=topic)
        examples.append({"prompt": prompt, "completion": chunk})
    
    print(f"    {len(text)} chars → {len(examples)} examples")
    return examples


def main():
    pdfs = []
    for directory in PDF_DIRS:
        if directory.exists():
            pdfs.extend(sorted(directory.glob("*.pdf")))
    
    print(f"Found {len(pdfs)} PDFs")
    
    all_examples = []
    for pdf in pdfs:
        examples = make_examples_from_pdf(pdf)
        all_examples.extend(examples)
    
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        for ex in all_examples:
            f.write(json.dumps(ex) + '\n')
    
    print(f"\nWrote {len(all_examples)} examples to {OUTPUT_FILE}")
    if OUTPUT_FILE.exists():
        print(f"  File size: {OUTPUT_FILE.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
