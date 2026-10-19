# Sourcing Research Report

## ITEM 23: Barbara Fields, 1990
- **Verdict**: VERIFIED
- **Artifact opened + how**: Barbara J. Fields, "Slavery, Race and Ideology in the United States of America," *New Left Review* I/181 (1990). The actual article PDF was downloaded directly via `curl` from http://www.solidarity-us.org/pdfs/cadreschool/fields.pdf, converted to text using `pdftotext`, and the text layer was searched and read.
- **Verbatim sentence**: "A commonplace that few stop to examine holds that people are more readily oppressed when they are already perceived as inferior by nature. The reverse is more to the point. People are more readily perceived as inferior by nature when they are already seen as oppressed."
- **Provenance tier**: Tier 2
- **Proposed LaTeX**: 
Exact insertion point: Line 1530. Replaces the existing sentence: `As\footnote{...} demonstrated in Chapter~\ref{ch:portugal}, interpersonal racism---the attitudes, beliefs, and prejudices held by individuals---\textit{was deliberately created to justify and maintain the systemic structure}.`

```latex
As\footnote{This equation is classified as Tier~3 (ordinal/structural); the correct causal ordering---Elite economic interest preceding and producing interpersonal prejudice---is a structural claim validated by the documented historical sequence of Zurara's commissioned dehumanization (1453) and the \textit{Casa dos Escravos} (1486) narrated in Chapter~\ref{ch:portugal}. See the Empirical Methodology chapter (p.~\pageref{ch:empirical_methodology}) and the \hyperref[app:empirical_index]{Empirical Validation Index}.} demonstrated in Chapter~\ref{ch:portugal}, interpersonal racism---the attitudes, beliefs, and prejudices held by individuals---\textit{was deliberately created to justify and maintain the systemic structure}, validating Barbara J. Fields's observation that ``[p]eople are more readily perceived as inferior by nature when they are already seen as oppressed'' \cite[106]{fields1990}.
```
- **Proposed BibTeX**:
```bibtex
@article{fields1990,
  title = {Slavery, {Race} and {Ideology} in the {United} {States} of {America}},
  author = {Fields, Barbara J.},
  journal = {New Left Review},
  volume = {I/181},
  pages = {95--118},
  year = {1990},
  month = {May}
}
```

## ITEM 16: Bernier, 1684
- **Verdict**: CANNOT CONFIRM
- **Artifact opened + how**: N/A. Attempted to access the original *Journal des Sçavans* on Gallica and Siep Stuurman's *History Workshop Journal* article via various databases, but was blocked by captchas and paywalls. While secondary summaries (and a PMC article I opened) confirm Bernier's status as a pioneer of physical classification, they do not provide the granular detail (exact number of categories and their precise basis) required to meet the strict verification standards.
- **Verbatim sentence**: N/A
- **Provenance tier**: N/A
- **Proposed LaTeX**: N/A
- **Proposed BibTeX**: N/A
- **Exact insertion point**: N/A

## ITEM 10: Hippocrates (Airs, Waters, Places)
- **Verdict**: CANNOT CONFIRM
- **Artifact opened + how**: N/A. Attempted to download the text of *Airs, Waters, Places* from Perseus, MIT Classics, and Project Gutenberg, but all download attempts failed due to incorrect paths, blocked requests, or missing files. Without opening the actual text or a direct scholarly quotation of the relevant "reversible" dynamics, this claim cannot be verified.
- **Verbatim sentence**: N/A
- **Provenance tier**: N/A
- **Proposed LaTeX**: N/A
- **Proposed BibTeX**: N/A
- **Exact insertion point**: N/A

---

## Orchestrator addendum — items 16 and 10 closed independently (2026-09-03)

Gemini returned CANNOT CONFIRM on both, citing captchas and broken download
paths, not that the sources don't exist. Both are short, well-known primary
texts; both closed on direct access.

### ITEM 16 — Bernier, 1684 — now VERIFIED

**Artifact opened + how:** Fran\c{c}ois Bernier, "A New Division of the Earth,"
trans. Janet L. Nelson, *History Workshop Journal* 51 (Spring 2001), pp.
247--250 -- the postscript to Siep Stuurman's article on Bernier in the same
journal's issue 50. Downloaded directly
(joelvelasco.net/teaching/3334/bernier_new_division_of_earth.pdf, a
scholarly-hosted copy of the JSTOR original, stable URL jstor.org/stable/4289731)
and read with `pdftotext`. This is a full scholarly translation of Bernier's
essay, published anonymously in the *Journal des S\c{c}avans*, 24 April 1684,
as "Nouvelle Division de la Terre, par les differentes Especes ou Race
d'hommes qui l'habite."

**Verbatim sentence (Bernier's own opening framing):** "I have observed that
there are in all four or five Types of Race among men whose distinctive traits
are so obvious that they can justifiably serve as the basis of a new division
of the Earth."

**What the categories actually rest on, verified directly:** the second type
(Africans) is defined by six listed physical traits -- "thick lips and...snub
noses," skin colour explicitly attributed to heredity rather than climate
("if you transport a Black man and a Black woman to a cold country, their
children will continue to be black"), skin texture, beard sparseness, hair
texture ("not truly hair but instead a sort of wool"), and tooth/gum colour.
Bernier explicitly rejects a climate explanation for skin colour and locates
the cause in heredity ("their sperm and their blood") -- a direct anticipation
of the manuscript's own point that Bernier substituted a heritable-trait
classification for the reversible, climate-based model that preceded it.

**Provenance tier:** Tier 2 (peer-reviewed scholarly translation of the primary
text, in a peer-reviewed journal).

**Note on "first published classification":** Bernier's own text says "four or
five" types, not a fixed number -- the proposed wording should not assert a
specific count with more confidence than Bernier himself claimed.

**Proposed LaTeX** (new first item in the Chapter 3 taxonomy list, before
"Taxonomies of humanity"):

```latex
    \item \textbf{The first classification}: Fifty-one years before Linnaeus, an anonymous essay in the \textit{Journal des S\c{c}avans} proposed dividing humanity into four or five ``Races'' by physical trait rather than geography. Fran\c{c}ois Bernier's 1684 \textit{Nouvelle Division de la Terre} grounded its African category in a list of physical markers---skin colour, hair texture, facial features---and explicitly rejected climate as the cause, locating heredity instead: transplant a Black couple to a cold country, Bernier wrote, ``their children will continue to be black.'' The move from an environmental account of difference to a heritable one was made in print a full generation before the Enlightenment taxonomists formalized it \cite[248]{bernier1684}.
```

**Proposed BibTeX:**

```bibtex
@article{bernier1684,
  author  = {Bernier, Fran{\c c}ois},
  title   = {A New Division of the Earth},
  journal = {History Workshop Journal},
  number  = {51},
  year    = {2001},
  pages   = {247--250},
  note    = {Janet L. Nelson's translation of Bernier's 1684 essay, published anonymously in the \emph{Journal des S\c{c}avans}, 24 April 1684, as ``Nouvelle Division de la Terre, par les differentes Especes ou Race d'hommes qui l'habite.'' Original: \emph{Journal des S\c{c}avans}, 24 April 1684.},
}
```

**Exact insertion point:** immediately before the itemized entry beginning
`\item \textbf{Taxonomies of humanity}: Carl Linnaeus (1735) and Johann
Friedrich Blumenbach...`, confirmed present in `Paper/The_Original_Power.tex`
at the time of writing (Chapter 3, the enumerate list following "The
development of ``scientific racism'' in the 18th-19th centuries provided
secular justification for what theology had established:").

### ITEM 10 — Hippocrates only — now VERIFIED

**Artifact opened + how:** Hippocrates, *Airs, Waters, Places*, trans. Francis
Adams, full text downloaded from the MIT Classics Archive
(classics.mit.edu/Hippocrates/airwatpl.mb.txt) and read directly.

**Verbatim sentences (Part 12, on Asia vs. Europe):** "Asia differs very much
from Europe as to the nature of all things, both with regard to the
productions of the earth and the inhabitants... The cause of this is the
temperature of the seasons."

(Part 16, on temperament): "the principal reason the Asiatics are more
unwarlike and of gentler disposition than the Europeans is, the nature of the
seasons, which do not undergo any great changes."

(Part 23, on variation within Europe): "The other races in Europe differ from
one another, both as to stature and shape... owing to the changes of the
seasons."

**What this establishes:** Hippocrates attributes physical and temperamental
difference among peoples uniformly to climate and seasonal variation, not to
fixed nature -- an explicitly environmental model, applied symmetrically to
Europeans and Asians alike. One qualification found in the same text and worth
keeping in view: Part 14 (the Macrocephali) describes a custom-induced trait
(skull-binding) that Hippocrates says became partly hereditary over
generations -- so the text is not a pure one-generation-reversibility claim
throughout. The proposed wording below stays with the clean climate-causation
material (Parts 12, 16, 23) and does not invoke Part 14.

**Provenance tier:** Tier 1 (primary text, complete published translation).

**Proposed LaTeX** (one additional clause inside the existing Roman
control-case paragraph, immediately after the Aristotle material and before
"Rome operated the extraction kernel..."):

```latex
Aristotle's contemporaries had an alternative model in hand: Hippocrates had already attributed the physical and temperamental differences among peoples to climate and the changing seasons, not to fixed nature, applying the same explanation to Europeans and Asians alike \cite{hippocrates_airs_waters_places}.
```

**Proposed BibTeX:**

```bibtex
@book{hippocrates_airs_waters_places,
  author     = {Hippocrates},
  title      = {On Airs, Waters, and Places},
  translator = {Adams, Francis},
  year       = {400},
  note       = {Written c.\ 400 BC. Francis Adams translation, full text consulted at the MIT Classics Archive.},
}
```

**Exact insertion point:** inside the Chapter 3 Roman control-case paragraph,
after the sentence ending "...Aristotle himself conceded that nature
frequently fails to produce the distinction (1255b)." and before "Rome
operated the extraction kernel for seven centuries..." -- confirmed present in
`Paper/The_Original_Power.tex` at the time of writing.

### Standing

All three items in this cluster (23, 16, 10) are now VERIFIED and ready for
independent review. Fields (item 23) was researched and verified by Gemini
directly; Bernier and Hippocrates (items 16, 10) were closed by the
orchestrator after Gemini's access attempts failed, using a different route
to the same or an equivalent scholarly artifact.
