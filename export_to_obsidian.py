#!/usr/bin/env python3
"""
Export Redefining_Racism repo contents to an Obsidian vault.
Approach: Comprehensive Conversion (Recommended)
"""

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

# ── Configuration ───────────────────────────────────────────────────────────
SOURCE_ROOT = Path("/Users/emmanuel/Documents/Theory/Redefining_racism")
TARGET_ROOT = Path("/Users/emmanuel/Library/Mobile Documents/iCloud~md~obsidian/Documents/Root/Original Power")
PAPER_DIR = SOURCE_ROOT / "Paper"

VAULT_DIRS = {
    "moc": "00 Maps of Content",
    "book": "01 The Book",
    "podcasts": "02 Podcast Episodes",
    "empirical": "03 Empirical Validations",
    "research": "04 Research & Case Law",
    "sources": "05 Sources",
    "supporting": "06 Supporting Material",
    "notebooks": "07 Analysis & Notebooks",
    "attachments": "99 Attachments",
}

# ── Helpers ─────────────────────────────────────────────────────────────────

def ensure_dirs():
    for d in VAULT_DIRS.values():
        (TARGET_ROOT / d).mkdir(parents=True, exist_ok=True)
    for sub in ("figures", "book-pdfs", "data"):
        (TARGET_ROOT / VAULT_DIRS["attachments"] / sub).mkdir(parents=True, exist_ok=True)


def slugify(text: str) -> str:
    text = text.strip()
    text = re.sub(r'[\\/:*?"<>|]', '', text)
    text = text.replace(' ', '_')
    return text


def check_tools():
    for tool in ("pandoc", "jupyter"):
        if shutil.which(tool) is None:
            print(f"Abort: required tool '{tool}' not found in PATH.")
            sys.exit(1)


# ── LaTeX Book Handling ─────────────────────────────────────────────────────

def split_latex_book(tex_path: Path):
    """Split The_Original_Power.tex into chapter chunks."""
    raw = tex_path.read_text(encoding="utf-8", errors="replace")
    lines = raw.splitlines()

    chapter_re = re.compile(r'^\\chapter(\*)?\{([^}]+)\}')

    chapters = []
    current_title = "Front Matter"
    current_lines = []
    in_document = False

    for line in lines:
        if not in_document:
            if line.strip() == r'\begin{document}':
                in_document = True
            continue

        m = chapter_re.match(line)
        if m:
            if current_lines:
                chapters.append((current_title, current_lines))
            current_title = m.group(2)
            current_lines = [line]
        else:
            current_lines.append(line)

    if current_lines:
        chapters.append((current_title, current_lines))

    return chapters


def inline_inputs(content: str, base_dir: Path) -> str:
    input_re = re.compile(r'\\input\{([^}]+)\}')

    def replacer(m):
        filename = m.group(1)
        if not filename.endswith('.tex'):
            filename += '.tex'
        filepath = base_dir / filename
        if filepath.exists():
            return filepath.read_text(encoding="utf-8", errors="replace")
        print(f"  Warning: input not found: {filepath}")
        return m.group(0)

    # Multi-pass for nested inputs
    for _ in range(5):
        new_content = input_re.sub(replacer, content)
        if new_content == content:
            break
        content = new_content
    return content


def convert_chapters():
    tex_path = PAPER_DIR / "The_Original_Power.tex"
    target_dir = TARGET_ROOT / VAULT_DIRS["book"]

    chapters = split_latex_book(tex_path)
    print(f"Found {len(chapters)} chapter-like sections.")

    wrapper_prefix = r"""\documentclass{article}
\usepackage{amsmath,amssymb,amsthm}
\usepackage{graphicx}
\usepackage{hyperref}
\usepackage{longtable,booktabs,array}
\usepackage{tikz}
\usepackage{pgfplots}
\begin{document}
"""
    wrapper_suffix = r"\end{document}"

    for idx, (title, lines) in enumerate(chapters):
        safe = slugify(title)
        if len(safe) > 60:
            safe = safe[:60]
        out_name = f"{idx:02d} {safe}.md"
        out_path = target_dir / out_name

        content = '\n'.join(lines)
        content = inline_inputs(content, PAPER_DIR)
        full_tex = wrapper_prefix + '\n' + content + '\n' + wrapper_suffix

        temp_tex = Path("/tmp") / f"_temp_{idx}.tex"
        temp_tex.write_text(full_tex, encoding="utf-8")

        try:
            subprocess.run(
                ["pandoc", "--from=latex", "--to=markdown", "--wrap=none",
                 "-o", str(out_path), str(temp_tex)],
                check=True, capture_output=True
            )
            md_text = out_path.read_text(encoding="utf-8")
            frontmatter = (
                f"---\n"
                f"title: \"{title}\"\n"
                f"tags: [book, chapter]\n"
                f"chapter-index: {idx}\n"
                f"source: Paper/The_Original_Power.tex\n"
                f"---\n\n"
            )
            out_path.write_text(frontmatter + md_text, encoding="utf-8")
            print(f"  OK: {out_name}")
        except subprocess.CalledProcessError as e:
            err = e.stderr.decode("utf-8", errors="replace")[:300]
            print(f"  FAIL: {out_name} — {err}")
        finally:
            if temp_tex.exists():
                temp_tex.unlink()


# ── Jupyter Notebooks ───────────────────────────────────────────────────────

def convert_notebooks():
    source_dir = SOURCE_ROOT / "Paper" / "scripts"
    target_dir = TARGET_ROOT / VAULT_DIRS["notebooks"]

    notebooks = [p for p in sorted(source_dir.glob("*.ipynb")) if not p.name.startswith('.')]
    print(f"Found {len(notebooks)} notebooks.")

    for nb in notebooks:
        try:
            subprocess.run(
                ["jupyter", "nbconvert", "--to", "markdown", "--output-dir", str(target_dir), str(nb)],
                check=True, capture_output=True
            )
            out_md = target_dir / (nb.stem + ".md")
            if out_md.exists():
                md_text = out_md.read_text(encoding="utf-8")
                frontmatter = (
                    f"---\n"
                    f"title: \"{nb.stem}\"\n"
                    f"tags: [notebook, analysis]\n"
                    f"source: Paper/scripts/{nb.name}\n"
                    f"---\n\n"
                )
                out_md.write_text(frontmatter + md_text, encoding="utf-8")
                print(f"  OK: {out_md.name}")
        except subprocess.CalledProcessError as e:
            err = e.stderr.decode("utf-8", errors="replace")[:300]
            print(f"  FAIL: {nb.name} — {err}")


# ── Existing Markdown Content ───────────────────────────────────────────────

def add_frontmatter(path: Path, text: str, tag: str, source_rel: str) -> str:
    if text.startswith('---'):
        return text
    title = path.stem.replace('_', ' ').replace('-', ' ')
    frontmatter = (
        f"---\n"
        f"title: \"{title}\"\n"
        f"tags: [{tag}]\n"
        f"source: {source_rel}\n"
        f"---\n\n"
    )
    return frontmatter + text


def copy_markdown_tree(source: Path, target: Path, tag: str, source_prefix: str):
    target.mkdir(parents=True, exist_ok=True)
    count = 0
    for md in sorted(source.rglob("*.md")):
        rel = md.relative_to(source)
        # Skip hidden dirs
        if any(part.startswith('.') for part in rel.parts):
            continue
        out = target / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        text = md.read_text(encoding="utf-8")
        text = add_frontmatter(md, text, tag, f"{source_prefix}/{rel}")
        out.write_text(text, encoding="utf-8")
        count += 1
    print(f"  Copied {count} markdown files from {source} -> {target}")


def copy_podcasts():
    source = SOURCE_ROOT / "podcast_prompts"
    target = TARGET_ROOT / VAULT_DIRS["podcasts"]
    target.mkdir(parents=True, exist_ok=True)
    count = 0
    for md in sorted(source.glob("*.md")):
        out = target / md.name
        text = md.read_text(encoding="utf-8")
        text = add_frontmatter(md, text, "podcast", f"podcast_prompts/{md.name}")
        out.write_text(text, encoding="utf-8")
        count += 1
    print(f"  Copied {count} podcast episodes.")


def copy_empirical_validations():
    source = SOURCE_ROOT / "Paper" / "empirical_validations"
    target = TARGET_ROOT / VAULT_DIRS["empirical"]
    target.mkdir(parents=True, exist_ok=True)

    for md in sorted(source.glob("*.md")):
        m = re.match(r'eq_(\d+)[a-z]?_.*', md.stem)
        if m:
            ch_num = int(m.group(1))
            ch_dir = target / f"Ch {ch_num:02d}"
        else:
            ch_dir = target / "Uncategorized"
        ch_dir.mkdir(parents=True, exist_ok=True)
        out = ch_dir / md.name
        text = md.read_text(encoding="utf-8")
        text = add_frontmatter(md, text, "empirical", f"Paper/empirical_validations/{md.name}")
        out.write_text(text, encoding="utf-8")
    print(f"  Copied empirical validations.")


# ── Assets ──────────────────────────────────────────────────────────────────

def copy_assets():
    fig_src = SOURCE_ROOT / "Paper" / "figures"
    fig_dst = TARGET_ROOT / VAULT_DIRS["attachments"] / "figures"
    for f in sorted(fig_src.glob("*.png")):
        shutil.copy2(f, fig_dst / f.name)
    for f in sorted(fig_src.glob("*.pdf")):
        shutil.copy2(f, fig_dst / f.name)
    print(f"  Figures -> {fig_dst}")

    pdf_src = SOURCE_ROOT / "chapters"
    pdf_dst = TARGET_ROOT / VAULT_DIRS["attachments"] / "book-pdfs"
    for f in sorted(pdf_src.glob("*.pdf")):
        shutil.copy2(f, pdf_dst / f.name)
    print(f"  Book PDFs -> {pdf_dst}")

    data_src = SOURCE_ROOT / "Paper" / "data"
    data_dst = TARGET_ROOT / VAULT_DIRS["attachments"] / "data"
    for f in sorted(data_src.glob("*.csv")):
        shutil.copy2(f, data_dst / f.name)
    for f in sorted(data_src.glob("*.json")):
        shutil.copy2(f, data_dst / f.name)
    print(f"  Data -> {data_dst}")


# ── MOCs ────────────────────────────────────────────────────────────────────

def generate_mocs():
    moc_dir = TARGET_ROOT / VAULT_DIRS["moc"]

    # Index
    index = ["# Original Power — Vault Index\n"]
    for key, dirname in VAULT_DIRS.items():
        if key in ("moc",):
            continue
        folder = TARGET_ROOT / dirname
        count = len(list(folder.rglob("*.md"))) if folder.exists() else 0
        label = dirname.split(" ", 1)[1]
        index.append(f"- [[MOC - {label}]] ({count} notes)")
    index.append("\n---\n_Generated from Redefining_Racism export._")
    (moc_dir / "Index.md").write_text("\n".join(index), encoding="utf-8")

    # Per-folder MOCs
    for key, dirname in VAULT_DIRS.items():
        if key in ("moc", "attachments"):
            continue
        folder = TARGET_ROOT / dirname
        if not folder.exists():
            continue
        label = dirname.split(" ", 1)[1]
        moc_name = f"MOC - {label}.md"
        lines = [f"# MOC — {label}\n"]
        for md in sorted(folder.rglob("*.md")):
            rel = md.relative_to(folder)
            # Use relative wikilink path for subdirs
            link_path = str(rel.with_suffix(""))
            lines.append(f"- [[{link_path}]]")
        (moc_dir / moc_name).write_text("\n".join(lines), encoding="utf-8")
    print("  Generated MOCs.")


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    if not str(TARGET_ROOT).startswith("/Users/emmanuel/Library/Mobile Documents/iCloud~md~obsidian/Documents/Root"):
        print("Abort: unexpected target path.")
        sys.exit(1)

    check_tools()

    if TARGET_ROOT.exists():
        print(f"Clearing existing target: {TARGET_ROOT}")
        shutil.rmtree(TARGET_ROOT)

    ensure_dirs()

    print("\n1. Converting LaTeX book chapters…")
    convert_chapters()

    print("\n2. Converting Jupyter notebooks…")
    convert_notebooks()

    print("\n3. Copying podcast episodes…")
    copy_podcasts()

    print("\n4. Copying empirical validations…")
    copy_empirical_validations()

    print("\n5. Copying research notes…")
    copy_markdown_tree(SOURCE_ROOT / "Paper" / "research",
                       TARGET_ROOT / VAULT_DIRS["research"],
                       "research", "Paper/research")

    print("\n6. Copying sources…")
    copy_markdown_tree(SOURCE_ROOT / "Sources",
                       TARGET_ROOT / VAULT_DIRS["sources"],
                       "source", "Sources")

    print("\n7. Copying supporting material…")
    copy_markdown_tree(SOURCE_ROOT / "supporting_material",
                       TARGET_ROOT / VAULT_DIRS["supporting"],
                       "supporting", "supporting_material")

    print("\n8. Copying assets…")
    copy_assets()

    print("\n9. Generating MOCs…")
    generate_mocs()

    print("\n✅ Export complete.")


if __name__ == "__main__":
    main()
