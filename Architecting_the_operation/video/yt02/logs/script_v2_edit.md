# YT02 v2 script edit pass report

**File edited:** `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`  
**Authority:** `Paper/The_Original_Power.tex`, `Paper/The_Original_Power.aux` (rendered equation numbers), `Architecting_the_operation/video/yt02/archive/SOURCES.md`  
**Date:** 2026-10-18

## Summary

- Inserted narrator **why-questions** (and allied short prompts) before major claims, tests, and segment opens; restated the **ask why** through-line in the close.
- **Five-tier introduction:** kept the single full walkthrough in SEG 05; shortened SEG 06 re-list to back-references.
- **Claim fixes:** duplicate production lines, wrong segment cross-reference, corrective-contrast wording in one new question.
- Spot-checked equation and quote labels against the built manuscript (`.aux`); spoken numbers already matched for sampled equations (2.1–2.7, 3.5, 4.1–4.4, 0.3).

---

## Why-questions

| Metric | Value |
|--------|------:|
| Narrator lines opening with Why / So why / What / How / Where / When | **59** |
| `?` characters in script (all lines) before pass | **10** |
| `?` characters after pass | **50** |
| **Why-questions added (estimate)** | **~41** |

Cold open already stated the through-line (L16). Close now restates it (L2328–L2331).

---

## Five-tier introductions

### Kept — full introduction (SEG 05)

| Lines | Content |
|------:|---------|
| **506–524** | Elite, Puppet Class, Enforcement Class, Buffer Class, racialized Out-group (canonical one-time tier walkthrough) |

### Consolidated — SEG 06 set ladder (was second full re-introduction)

| | Line range | Summary |
|---|------------|---------|
| **Before** | **661–687** | Re-stated Eq 2.2 tier list and re-explained Elite / Puppet / Enforcement / Buffer roles and payoffs |
| **After** | **661–674** | Back-reference to Segment five; Eq 2.2 + Eq 0.3 payoff ordering only |

### Other tier mentions (back-references only; no change required)

| Lines | Role |
|------:|------|
| 300, 2144 | “across all five tiers” (systems vocabulary; not a re-intro) |
| 527 | modules alongside tiers (SEG 05) |
| 768–772 | orthographic illusion (Segment five hierarchy) |
| 2003 | Interference Engine setup question |
| 2192 | reverse-racism / tier position back-reference |
| 2241 | close recap |

---

## Fix and deletion log

| Script line | Old text | New text | Book / source |
|------------:|----------|----------|----------------|
| 1269 | Duplicate `Emmanuel Theodore (49:15)` speaker line | Removed duplicate | editorial |
| 1313 | `Emmanuel Theodore (50:49)` (second of two at same timestamp) | `Emmanuel Theodore (50:55)` | editorial |
| 2043 | `…Equation two point four in Segment 03…` | `…in Segment six…` | `Paper/The_Original_Power.tex` §2.1 Eq 2.4 (`eq:recursive-local-partition` → **2.4** in Ch. 2) |
| 221 | `Why treat discrimination as a third construct rather than folding it into prejudice?` | `Why does Fiske treat discrimination as its own modality beside stereotyping and prejudice?` | `Paper/The_Original_Power.tex` Preface / §2.2 (Fiske tripartite); antithesis grep |
| 661–687 | Full tier re-list and role re-explanation (see above) | Back-reference block (661–674) | `Paper/The_Original_Power.tex` §2.1 Eq 2.2; Ch. 0 Eq 0.3 (`eq:0.2-tier-voltage-drop` → **0.3**) |
| 768–772 | Binary / “five-tier hierarchy” openers | Why-question + “Segment five hierarchy” | Ch. 0 orthographic illusion |
| 2192 | `Furthermore, the five tiers are structural positions…` | `Why can phenotype alone not flip the force vector? The five tiers from Segment five…` | Ch. 0; Ch. 21; MANUSCRIPT_GAP §1 |

**Claims removed:** none (no unsupported factual sentences identified that required deletion).

**Equation spot-check (no script change):** Examples verified via `Paper/The_Original_Power.aux` — Eq 2.5/2.6 causal arrows (`eq:1.3` / `eq:1.4` → **2.5** / **2.6**); Eq 4.2 boundary (`eq:3.2-boundary-enforcement-1691` → **4.2**); complex wage **3.5** (`eq:2.2b-complex-wage-def`); Fields quote at `Paper/The_Original_Power.tex` ~L1803 (`fields1990` p. 106).

---

## Antithesis self-check

Command:

```bash
grep -n -i -E "not (just|merely|only)|rather than|isn't (just|about)| but (rather|instead)" \
  Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md
```

**Output:** *(empty — exit 0)*

`python3 tools/check_antithesis.py` on the script: **no banned constructions found.**

---

## Style brief compliance

- Markup preserved: `<!-- SEG -->`, `<!-- [book …] -->`, `[clip:…]`, speaker lines.
- Numbers remain spoken words (no digit-dot equation forms in grep).
- “cannabis” retained (SEG 11 ACLU passage).
- “tiers” used for the five positions (not “jobs”).
