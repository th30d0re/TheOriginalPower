# W3 — Story equation cards

## Match rate and exact-normalisation result

The join parses 103 story equation visuals. The revised run produces 77 exact registry matches, 46 unambiguous matches with validation records, 31 partial enrichments, and 26 unmatched visuals. The validated tier distribution is 10 tier 1, 7 tier 2, and 29 tier 3.

The prior run produced 67 exact matches and 41 validated matches. Decoding each TypeScript string literal before normalisation adds ten exact matches: six have validation records and four do not. One previously validated match is withheld after collision detection, producing a net gain of five unambiguous validated matches. Normalisation remains exact. It decodes TypeScript escape handling, removes `\label{...}` and `\tag{...}`, and removes whitespace. The join contains no similarity score, edit-distance check, fuzzy lookup, or fallback label match.

Two consecutive reruns produced byte-identical `story-join.json` and `W2-story-equation-join.md` files.

## Registry collisions

The registry contains 11 normalised-LaTeX collision pairs: `E047`/`E046`, `E113`/`E036`, `E213`/`E118`, `E215`/`E112`, `E216`/`E036`, `E217`/`E114`, `E218`/`E115`, `E220`/`E046`, `E223`/`E009`, `E224`/`E010`, and `E233`/`E021`.

Two story visuals match colliding forms:

- `apxE_geometric_algebra.ts`, occurrence 1: `E021` and `E233`.
- `ch25_conclusion.ts`, occurrence 2: `E118` and `E213`.

Each generated entry carries a `collision` array containing every candidate ID. Its `registry` and `validation` fields are null, and its enrichment is `partial`. The story card therefore withholds tier, falsification, sources, and registry provenance.

## Compact story presentation

`SceneVisual` resolves equation enrichment with the generated `chapterFile` and `occurrence` key. Chapter modules and `VisualSpec` remain unchanged. The chapter renderer supplies occurrence indices across hero visuals, visual blocks, and scene-level visuals.

The collapsed card contains the colour-linked equation, caption, tier badge for full entries, and an expansion control. Expanded full entries add term chips, selected-term detail, adapted/manuscript decoder controls when a curated W1 passage exists, registry provenance, falsification, and available source chips. Expanded partial entries contain only sourced symbols and term detail. Entries with `none` continue through the original `Equation` component.

The story component reuses the W1 `colorizeLatex`, palette classes, term-detail component, decoder renderer, manuscript renderer, and source-chip component. `/equations` retains its existing component and interaction tests.

## Symbol coverage

The shared symbol registry now contains 47 definitions. Thirty-five appear across the enriched story set. Conservative exact token detection supplies at least one glossary term for 52 of 77 enriched visuals; 25 enriched visuals remain plain where no sourced definition exists.

The additions are `T`, `V_E`, `O_x`, `P_{\text{real}}`, and `M_{\text{eff}}`, using names, meanings, and units from `systemic_arbitrage/variables.yaml`. The pre-existing `\tau` entry already covers the remaining registered engine variable. Single-character symbols require standalone math-token boundaries and are excluded inside `\text{...}` so letters in commands and prose do not acquire false chips.

Symbols without a definition traceable to the manuscript or variable registry remain unglossed. The component renders those tokens as ordinary KaTeX without a colour wrapper, chip, detail panel, or placeholder definition. The partial-state interaction test includes `Q_{\text{unknown}}` and confirms that only the two sourced terms receive chips and colour wrappers.

## Browser and interaction verification

Browser execution against `http://localhost:5199` could not be completed in this environment. The preferred in-app browser runtime failed during initialization because its bundled native storage module has no build for the active Node ABI. The second installed browser controller reported that no browser was available. A direct headless Chromium launch was then rejected by the macOS sandbox during Mach port registration, before a page opened. No route or interaction is claimed as browser-verified.

The equivalent DOM interaction coverage runs in Vitest with an explicit event-loop tick after every click:

- Full: `ch09_enforcement_engine.ts`, occurrence 0 (`eq. 6.12`), covering collapsed tier, expansion, falsification, sources, term chips, Manuscript selection, Adapted selection, and collapse.
- Partial: `ch00_system_initialization.ts`, occurrence 0 (`The Unified Lorentz Force`), covering expansion, sourced term chips and detail, unknown-symbol passthrough, and the absence of tier, provenance, falsification, and sources.
- None: `ch11_german_extraction.ts`, occurrence 0 (`eq:german-liquidation-reclass`), confirming the original `.equation-figure` and `.equation-katex` rendering path with no story card.

## Verification

- `npx tsc --noEmit -p tsconfig.app.json`: pass.
- `npm run build`: pass; Vite reports the pre-existing dynamic/static import and bundle-size warnings.
- `npm run test`: pass, including 3 new story-state tests and 4 existing equation-card tests.
- `node scripts/check-verbatim-passages.mjs`: pass for all 8 byte-exact manuscript passages and all 8 authoritative card LaTeX strings.
- Join determinism across two consecutive runs: pass for both generated files.
