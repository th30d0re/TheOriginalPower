# TASK — Adapt one manuscript appendix into a Reference page

Follow `.codex/tasks/chapter-adaptation.md` in full. Everything there applies —
the read order, the source-material map, the output path and naming, the fidelity
rule, the AGENTS.md voice constraint, the block and equation mapping, the hard
constraints, and the verification step.

This file overrides the **Shape** section only.

## Shape for appendices

Appendices are reference material, not narrative. They run 300–2,400 words, so the
6–12 scene budget does not apply.

- **3–6 scenes.** A 300-word appendix gets 2–3. Do not pad to reach a count.
- Lead with one short orienting scene: what this appendix is for and what the
  reader can do with it. Two or three sentences.
- Prefer structure over prose. These appendices are mostly registries, tables,
  conditions, and enumerations — carry that shape across:
  - Statutes and citations → `formal` blocks with `variant: 'definition'`, or
    `source` blocks where the manuscript presents them as primary-source text.
  - Falsifiability conditions, theorems, conjectures → `formal` blocks with the
    matching `variant`. Preserve the manuscript's exact conditions; these are
    claims about what would defeat the theory and must not be softened.
  - Equation registries → `equation` visuals for the load-bearing entries only.
    A registry of 200 equations does not become 200 visuals; select the ones the
    appendix's own text singles out, and describe the rest in prose.
  - Runtime-log compilations → `runtimeLog` blocks. `apxC` is a chronological
    compilation of the boxes from across the book; render a representative
    sequence of them, not all thirty.
- `keyConcepts` are usually more useful here than `deepDive`. Use a `deepDive`
  only where the manuscript has a genuinely deeper layer to hide behind it.
- No `pullquote`. Reference pages do not need rhetorical emphasis.

## Accent color

Every appendix shares the neutral slate accent already set in the manifest. Do not
substitute a chapter color.

## Verification

Same as the chapter brief, plus:

```bash
python3 tools/verify_chapter_facts.py <your-id>
```

Every year you cite must appear in your own source slice. This must pass.
