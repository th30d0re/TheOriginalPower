# W1 Equation Cards Pilot — Findings

## Symbol registry schema

`website/src/content/equations/symbols.ts` defines one reusable record per semantic symbol:

```ts
interface EquationSymbol {
  id: string;
  latex: string;
  name: string;
  plainPhrase: string;
  meaning: string;
  units?: string;
  sourceNote?: string;
}
```

The `latex` field supplies the exact token matched inside an authoritative equation string. `plainPhrase` supplies decoder vocabulary. `meaning`, `units`, and `sourceNote` supply the selected-term panel. The only pilot symbol covered by `systemic_arbitrage/variables.yaml` is `tau`; its crash-threshold name, framework meaning, and units are reused in the registry. Colours remain presentation data. Each card assigns its ordered symbols to fourteen fixed palette slots at render time, with separate high-contrast dark and light values.

## Verbatim passage coverage

All eight equations have a usable contiguous manuscript passage:

| Card | Label | Source line | Stored bytes |
|---:|---|---:|---:|
| 1 | `eq:12.5-haitian-theorem-nonkinetic` | 11852 | 660 |
| 2 | `eq:6.12-capacity-compounding-full` | 4944 | 784 |
| 3 | `eq:8.16-interference-control-objective` | 6472 | 418 |
| 4 | `eq:8.17-circular-dispersion-operator` | 6724 | 535 |
| 5 | `eq:6.8-capacity-chain-1619` | 4946 | 923 |
| 6 | `eq:1.1-enclosure-score` | 539 | 489 |
| 7 | `eq:7.1-pullman-corollary` | 5460 | 340 |
| 8 | `eq:2.2b-complex-wage-def` | 2549 | 316 |

`website/scripts/check-verbatim-passages.mjs` reads every `String.raw` passage from `cards.ts`, searches the manuscript with exact string matching, and checks the recorded starting line. The script also compares all eight card LaTeX strings with `equation_explorer/data/equations.json`. Its final run reported:

```text
PASS all 8 verbatim passages are byte-exact contiguous substrings.
PASS all 8 equation LaTeX strings match the authoritative registry byte-for-byte.
```

LaTeX markup remains in every stored manuscript passage. `EquationCards.tsx` strips prose markup and renders inline mathematics only when the passage is displayed.

## Decoder modes in practice

Adapted mode provides a short declarative sentence assembled from symbol-addressable spans. Selecting a term adds a matching outline and background to the term chip, equation token, and adapted phrase. Numbered chips, pressed state, focus treatment, and ARIA relationships carry the connection independently of colour.

Manuscript mode provides a longer evidentiary gloss with the source line attached. The text retains the manuscript's terminology, qualifications, and citations present in the contiguous passage. The mode preference is global across the cards and persists in `localStorage`. The component supports a null passage by forcing that card to adapted mode, disabling its Manuscript button, and presenting the reason.

## Complex Wage degradation

Card 8 contains equation-registry fields, symbols, both decoder modes, and contextual explanation. Its card object has no `validation` property. The component gates the tier badge, falsification box, and citation section on the presence of that property. Card 8 therefore renders none of those three elements. It emits no fallback label, empty badge, placeholder source, or inferred tier.

## Data thinner than assumed

1. The `eq:6.8-capacity-chain-1619` equation registry contains the full four-row aligned chain. Its empirical record's `statement` contains only the 1619 row. The card preserves the full authoritative equation and applies the empirical record's Tier 2 provenance to the label supplied by that record.
2. The `eq:1.1-enclosure-score` empirical record contains the older arithmetic-mean statement `S_enc = (1/3) sum e_i`. The equation registry and current manuscript contain the normalized two-channel norm with `1/√2`. The card uses the registry formula and retains the empirical record's Tier 3 metadata.
3. The `eq:7.1-pullman-corollary` empirical statement begins with `psi`, while the equation registry and current manuscript begin with `j psi_s`. The card uses the registry formula.
4. Registry line fields do not consistently match the current manuscript line positions. Cards label these values as registry lines. Verbatim passages carry independently verified current manuscript lines.
5. Several `data_sources` entries have empty URLs. Those entries render as numbered citation chips without links. The implementation does not synthesize URLs.
6. The Enclosure Score record has an empty `data_sources` list. Its card omits the source section while retaining the available falsification condition and tier.
7. Notebook fields are blank for several records and use inconsistent path roots for the interference records. The pilot joins and retains these fields in card data without presenting empty notebook UI.
8. The Complex Wage has no empirical-validation record, as specified by the task.

## Verification

- `node scripts/check-verbatim-passages.mjs`: pass
- `npx tsc --noEmit -p tsconfig.app.json`: pass
- `npm run build`: pass; Vite reported existing chunk-size and mixed static/dynamic-import warnings
- `npm run test`: pass, 4 tests
- ESLint on the three new TypeScript files: pass
- Full-repository `npm run lint`: blocked by 10 pre-existing React hook immutability/ref errors in `src/components/visualizations/InterferenceEngine3D.tsx`
- Palette calculation: minimum 8.59:1 contrast on the dark card surface and 4.99:1 on white
- Browser inspection: unavailable because the managed sandbox rejected the local Vite listener with `EPERM`

## W1b interaction diagnosis

The current interaction component commits both state paths correctly. A cold Vite server compiled and served `src/content/equations/cards.ts` and `src/components/EquationCards.tsx` without an exception. A fresh headless Chrome page at `/equations` then produced these transitions on card 1:

- Adapted → Manuscript changed the rendered heading to `Manuscript passage` and wrote `"manuscript"` to `uef-equation-decoder-mode`.
- A page reload restored Manuscript mode; Manuscript → Adapted changed the rendered heading to `Adapted explanation` and wrote `"adapted"`.
- Clicking term chip 3 produced one selected color-2 chip, one selected color-2 equation symbol, one selected color-2 decoder phrase, and a color-2 detail panel.

The single cause supported by the available evidence is the rejected hot-reload module graph recorded by the earlier `String.raw(...) is not a function` exception. Vite retained the last accepted graph after the intermediate `cards.ts` module failed to evaluate. The obsolete line and column in that exception do not exist in the current module, and the failure cannot be reproduced after a cold load. This diagnosis applies to both controls because neither control's current React handler was executing in the stale runtime. No handler-specific patch was applied.

`tests/equation-cards.test.tsx` now renders the React component in a DOM, performs user clicks, and asserts the resulting render. It covers the mode round-trip and manuscript content, local-storage persistence and restoration on remount, the coordinated term selection across chip/equation/decoder/detail, and a null-verbatim card whose visible Manuscript control is disabled. The test suite statically imports `cards.ts`, while the TypeScript and Vite builds compile and evaluate the same module. A future unescaped backtick or `${` in a template literal will therefore fail before interaction assertions run. `scripts/check-verbatim-passages.mjs` continues to require eight complete raw passages and exact manuscript matches, adding a separate provenance failure for a truncated or interpolated passage.
