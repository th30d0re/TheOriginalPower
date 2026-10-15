# Quote card fixes (YT01 · Chapter 2 verbatim gate)

Model: Composer. Scope: all failing quote cards except **S10-19** (owned elsewhere).  
Verification: `python3 Architecting_the_operation/video/yt01_redefining_racism/check_quotes.py` → **0** failures.  
Renders: `edit16x9.py render … --only <primary> --force -j 1` → **layout: no problems** on every primary below.

---

## S06-34

| Field | Before | After |
|-------|--------|-------|
| kind | quote | **source** |
| quote | Racism is a system of oppression. | *(removed — source items)* |
| attribution | The Original Power · Chapter 2 | *(removed)* |
| items | Architecture / Purpose rows | Two **detail** rows with book verbatim (§2.2 definition passage) |

**Reason:** Paraphrase failed `check_quotes`. Full book definition fits verbatim, but multi-turn holds use narration that does not match the tex substring; quote-mode callouts overlapped the footer. **source** rows keep book wording without faux quotation marks.

---

## S08-20

| Field | Before | After |
|-------|--------|-------|
| quote | a long train of abuses and usurpations | **long train of abuses and usurpations** |

**Reason:** Jefferson’s line in the manuscript omits the leading article; the card now matches the tex substring (Declaration attribution unchanged).

---

## S12-29

| Field | Before | After |
|-------|--------|-------|
| quote | Explicit racial appeals become coded policy terms and apparently neutral economic or public-order language. | **explicit racial appeals become coded policy terms, then apparently neutral economic or public-order language whose effects remain racially structured** |
| attribution | Lee Atwater · 1981 interview (via The Nation, 2012) | **The Original Power · §2.3.5** |

**Reason:** The spoken line is the book’s summary of Atwater’s layer, not a verified Atwater pull-quote in Chapter 2. Verbatim book text; attribution to the manuscript.

---

## S18-05

| Field | Before | After |
|-------|--------|-------|
| kind | quote | **source** |
| quote | Gill described the auxiliary timekeeping device as the slave clock. | *(removed)* |
| items | [] | Gill 1904 row + pre-WWII row (book verbatim) |

**Reason:** Paraphrase failed `check_quotes`. Tex slice with `\cite{…}` is required for a single quote string; hold narration still paraphrases. **source** preserves Gill / WWII beats without layout-breaking callouts.

---

## S18-07

| Field | Before | After |
|-------|--------|-------|
| quote | Master and slave still appeared in quotation marks with gloss. | **introduced the master-slave pair in quotation marks with an explanatory gloss** |

**Reason:** Matches the 1959 patent sentence in §2.3.8 (Eglash attribution unchanged).

---

## S18-13

| Field | Before | After |
|-------|--------|-------|
| kind | quote | **source** |
| quote | Master and slave are poorly chosen; drives are equals in most respects. | *(removed)* |
| items | [] | PC Guide / peer-device rows (verbatim from §2.3.8) |

**Reason:** Paraphrase failed `check_quotes`. IDE hold narration is VO paraphrase; **source** keeps PC Guide wording and clears layout on holds.

---

## S18-15

| Field | Before | After |
|-------|--------|-------|
| kind | quote | **source** |
| quote | No amplification; master latch is input-driven like the slave. | *(removed)* |
| items | [] | Engineer flip-flop row + book partition-metaphor row |

**Reason:** Paraphrase failed `check_quotes`. Engineer + following book sentence need the `\cite{…}` gap for a single quote string; **source** splits them with verbatim details.

---

## S18-17

| Field | Before | After |
|-------|--------|-------|
| quote | A runaway user program in the slave computer cannot damage the executive. | **it is thus impossible for an erroneous or runaway user program in the slave computer to `damage' the executive program and thereby bring the whole system to a halt. \cite{kemeny_kurtz}. The system's designers almost certainly had no conscious intention of evoking antebellum discourse on runaway enslaved persons.** |

**Reason:** Kemeny & Kurtz wording plus the following book sentence (one tex slice, including cite token for `check_quotes` normalization). Hold S18-18 underlines “designers almost certainly…”.

---

## S18-22

| Field | Before | After |
|-------|--------|-------|
| kind | quote | **source** |
| quote | Mumbling master-slave terms before sixty students; term has to go. | *(removed)* |
| items | [] | Professor 1992 / gatekeeping / family-history rows (book + embedded interview verbatim) |

**Reason:** Paraphrase failed `check_quotes`. Long paragraph needs multiple `\cite{…}` gaps for one quote string; multi-hold VO does not match a single substring. **source** covers S18-23–S18-26 beats.

---

## S19-13

| Field | Before | After |
|-------|--------|-------|
| quote | ψ_m is always funded by ΔO > 0 | **One-line summary: psi_m is always funded by Delta O > 0** |
| attribution | The Original Power · Δmax footnote | **The Original Power · §2.3.9** |

**Reason:** Footnote one-liner normalizes with spelled-out Greek ops, not Unicode ψ/Δ in the checker.

---

## S21-09

| Field | Before | After |
|-------|--------|-------|
| kind | quote | **source** |
| quote | Millions of locally rational decisions reproduce the hierarchy without centralized coordination. | *(removed)* |
| items | [] | Steering / incentive-gradient / Mode 2 runtime rows (§2.3.11 verbatim) |

**Reason:** Missing **collectively** and **that** failed `check_quotes`. Three-turn run uses VO paraphrase; **source** rows align holds without callout overlap.

---

## S21-16

| Field | Before | After |
|-------|--------|-------|
| kind | quote | **source** |
| quote | Lee Atwater's description of the transition from explicit racial slurs to abstract economic policy | *(split into items)* |
| attribution | Lee Atwater · via Perlstein 2012 | *(removed — book attribution via sources)* |
| items | [] | Interface Swap row (§2.3.11) + **target geometry** row (§2.3.5 book sentence) |

**Reason:** Card text was book narration about Atwater, not Atwater’s words (user fix). Hold S21-17 needs “target geometry”; second item is manuscript verbatim from the optimizer paragraph.

---

## S22-10

| Field | Before | After |
|-------|--------|-------|
| quote | A kernel that extracts, fragments resistance, recompiles its interface, and recovers energy from the collapse of each obsolete form. | **The reform is absorbed. The kernel recompiles. The file name changes. The extraction continues.** |
| attribution | The Original Power · Chapter 2 | **The Original Power · §2.3.10** |

**Reason:** Original line is not in Chapter 2 tex. Replaced with the diagnostic-implication sentence block that is verbatim in §2.3.10.

---

## S10-19

**Not edited** (other worker).
