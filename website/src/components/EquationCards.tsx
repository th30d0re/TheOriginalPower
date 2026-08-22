import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { equationCards, symbolsForCard, type DecoderSpan, type EquationCard } from '../content/equations/cards';
import type { EquationSymbol } from '../content/equations/symbols';
import { isStandaloneSymbol, symbolsForLatex, type StoryEquationJoinEntry, type StoryValidationSource } from '../content/equations/story';
import './EquationCards.css';

type DecoderMode = 'adapted' | 'manuscript';

const DECODER_MODE_KEY = 'uef-equation-decoder-mode';
const PALETTE_SIZE = 14;

const readDecoderMode = (): DecoderMode => {
  try {
    return localStorage.getItem(DECODER_MODE_KEY) === 'manuscript' ? 'manuscript' : 'adapted';
  } catch {
    return 'adapted';
  }
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const colorizeLatex = (latex: string, symbols: readonly EquationSymbol[], activeId: string) => {
  const indexed = symbols.map((item, index) => ({ item, colorIndex: index % PALETTE_SIZE }));
  const byLatex = new Map(indexed.map(({ item, colorIndex }) => [item.latex, { item, colorIndex }]));
  const pattern = [...byLatex.keys()].sort((left, right) => right.length - left.length).map(escapeRegex).join('|');

  if (pattern.length === 0) return latex;

  return latex.replace(new RegExp(pattern, 'g'), (matched, offset: number, source: string) => {
    if (!isStandaloneSymbol(source, offset, matched)) return matched;
    const entry = byLatex.get(matched);
    if (entry === undefined) return matched;
    const selectedClass = entry.item.id === activeId ? ' is-selected' : '';
    return `\\htmlClass{equation-symbol equation-symbol-color-${entry.colorIndex}${selectedClass}}{${matched}}`;
  });
};

const renderEquation = (latex: string) => {
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      trust: true,
      strict: false,
    });
  } catch {
    return '';
  }
};

const stripProseLatex = (source: string) => source
  .replace(/\\(?:textit|textbf|emph|noindent|footnote)\{/g, '')
  .replace(/(?:Equation|Chapter|Appendix)?~?\\(?:ref|pageref)\{[^}]+\}/g, '')
  .replace(/\\cite\{[^}]+\}/g, '')
  .replace(/\\&/g, '&')
  .replace(/\\\$/g, '$')
  .replace(/\\%/g, '%')
  .replace(/---/g, '—')
  .replace(/--/g, '–')
  .replace(/``|''/g, '“')
  .replace(/~/g, ' ')
  .replace(/[{}]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const renderManuscript = (source: string): ReactNode[] => source.split('$').map((part, index) => {
  if (index % 2 === 0) return <span key={`prose-${index}`}>{stripProseLatex(part)}</span>;

  try {
    const html = katex.renderToString(part, { displayMode: false, throwOnError: false });
    return <span key={`math-${index}`} className="manuscript-math" dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span key={`math-${index}`}>{part}</span>;
  }
});

const TermDetail = ({ detailId, symbol, colorIndex }: { detailId: string; symbol: EquationSymbol; colorIndex: number }) => (
  <section
    id={detailId}
    className={`equation-term-detail equation-symbol-color-${colorIndex}`}
    aria-live="polite"
  >
    <div className="term-detail-symbol" dangerouslySetInnerHTML={{ __html: renderEquation(symbol.latex) }} />
    <div>
      <p className="equation-section-label">Selected term</p>
      <h3>{symbol.name}</h3>
      <p>{symbol.meaning}</p>
      {symbol.units ? <p className="term-meta"><strong>Units:</strong> {symbol.units}</p> : null}
      {symbol.sourceNote ? <p className="term-source-note">{symbol.sourceNote}</p> : null}
    </div>
  </section>
);

const AdaptedDecoder = ({ decoderId, spans, activeId, symbolColors }: {
  decoderId: string;
  spans: readonly DecoderSpan[];
  activeId: string;
  symbolColors: ReadonlyMap<string, number>;
}) => (
  <p id={decoderId} className="decoder-copy">
    {spans.map((span, index) => {
      const colorIndex = span.symbolId === undefined ? undefined : symbolColors.get(span.symbolId);
      const className = colorIndex === undefined
        ? undefined
        : `decoder-symbol equation-symbol-color-${colorIndex}${span.symbolId === activeId ? ' is-selected' : ''}`;
      return <span key={`${span.text}-${index}`} className={className}>{span.text}</span>;
    })}
  </p>
);

const SourceChips = ({ sources }: { sources: readonly StoryValidationSource[] }) => {
  if (sources.length === 0) return null;

  return (
    <div className="equation-sources">
      <p className="equation-section-label">Sources</p>
      <ol>
        {sources.map((source, index) => (
          <li key={`${source.name ?? 'source'}-${index}`}>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer" aria-label={`Source ${index + 1}: ${source.name ?? 'Unnamed source'} (${source.type ?? 'untyped'})`}>
                <span aria-hidden="true">{index + 1}</span>{source.name ?? 'Unnamed source'}
              </a>
            ) : (
              <span className="citation-chip" aria-label={`Source ${index + 1}: ${source.name ?? 'Unnamed source'} (${source.type ?? 'untyped'}); no repository URL`}>
                <span aria-hidden="true">{index + 1}</span>{source.name ?? 'Unnamed source'}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export const EquationCardView = ({ card, mode, setMode, number }: {
  card: EquationCard;
  mode: DecoderMode;
  setMode: (mode: DecoderMode) => void;
  number: number;
}) => {
  const symbols = symbolsForCard(card);
  const [selectedId, setSelectedId] = useState(symbols[0]?.id ?? '');
  const selectedSymbol = symbols.find((item) => item.id === selectedId) ?? symbols[0];
  const symbolColors = useMemo(() => new Map(symbols.map((item, index) => [item.id, index % PALETTE_SIZE])), [symbols]);
  const coloredLatex = useMemo(() => colorizeLatex(card.latex, symbols, selectedId), [card.latex, selectedId, symbols]);
  const equationHtml = useMemo(() => renderEquation(coloredLatex), [coloredLatex]);
  const hasManuscript = card.decoder.verbatim !== null;
  const displayedMode = mode === 'manuscript' && hasManuscript ? 'manuscript' : 'adapted';

  if (selectedSymbol === undefined) return null;

  return (
    <article className="equation-card" aria-labelledby={`${card.id}-title`}>
      <header className="equation-card-header">
        <div>
          <p className="equation-card-number">Equation {number} · Chapter {card.chapterIndex}</p>
          <h2 id={`${card.id}-title`}>{card.title}</h2>
          <p className="equation-provenance">{card.chapter} · registry line {card.line}</p>
        </div>
        <div className="equation-badges" aria-label="Classification and provenance">
          <span className="status-badge equation-category">{card.category}</span>
          {card.validation ? <span className={`status-badge equation-tier tier-${card.validation.tier}`}>Tier {card.validation.tier}</span> : null}
        </div>
      </header>

      <div
        className="equation-display"
        role="img"
        aria-label={`${card.title}: ${card.latex}`}
        aria-describedby={`${card.id}-decoder ${card.id}-term-detail`}
      >
        {equationHtml ? <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: equationHtml }} /> : <code>{card.latex}</code>}
      </div>

      <section className="equation-terms" aria-labelledby={`${card.id}-terms-heading`}>
        <p id={`${card.id}-terms-heading`} className="equation-section-label">Terms</p>
        <div className="term-chip-list">
          {symbols.map((item, index) => {
            const colorIndex = index % PALETTE_SIZE;
            const selected = selectedId === item.id;
            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                className={`term-chip equation-symbol-color-${colorIndex}${selected ? ' is-selected' : ''}`}
                aria-pressed={selected}
                aria-controls={`${card.id}-term-detail ${card.id}-decoder`}
                onClick={() => setSelectedId(item.id)}
              >
                <span className="term-chip-index" aria-hidden="true">{index + 1}</span>
                <span className="term-chip-symbol" dangerouslySetInnerHTML={{ __html: katex.renderToString(item.latex, { throwOnError: false }) }} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="equation-decoder" aria-labelledby={`${card.id}-decoder-heading`}>
        <div className="decoder-heading-row">
          <div>
            <p className="equation-section-label">Plain English Decoder</p>
            <h3 id={`${card.id}-decoder-heading`}>{displayedMode === 'adapted' ? 'Adapted explanation' : 'Manuscript passage'}</h3>
          </div>
          <div className="decoder-toggle" role="group" aria-label={`Decoder text for ${card.title}`}>
            <button type="button" aria-pressed={displayedMode === 'adapted'} onClick={() => setMode('adapted')}>Adapted</button>
            <button type="button" aria-pressed={displayedMode === 'manuscript'} disabled={!hasManuscript} onClick={() => setMode('manuscript')}>Manuscript</button>
          </div>
        </div>
        {!hasManuscript ? <p className="decoder-disabled-reason">No contiguous manuscript gloss is available for this equation.</p> : null}
        {displayedMode === 'adapted' ? (
          <AdaptedDecoder decoderId={`${card.id}-decoder`} spans={card.decoder.adapted} activeId={selectedId} symbolColors={symbolColors} />
        ) : (
          <blockquote id={`${card.id}-decoder`} className="decoder-copy manuscript-copy">
            {renderManuscript(card.decoder.verbatim?.source ?? '')}
            <cite>Manuscript line {card.decoder.verbatim?.sourceLine}</cite>
          </blockquote>
        )}
      </section>

      <TermDetail detailId={`${card.id}-term-detail`} symbol={selectedSymbol} colorIndex={symbolColors.get(selectedSymbol.id) ?? 0} />

      <section className="equation-context">
        <div>
          <p className="equation-section-label">Context</p>
          <p>{card.context.background}</p>
        </div>
        <div>
          <p className="equation-section-label">Why it matters</p>
          <p>{card.context.significance}</p>
        </div>
        {card.validation ? (
          <aside className="falsification-box">
            <p className="equation-section-label">Falsification condition</p>
            <p>{card.validation.falsification}</p>
          </aside>
        ) : null}
        <SourceChips sources={card.validation?.dataSources ?? []} />
      </section>
    </article>
  );
};

export const StoryEquationCard = ({ entry, latex, label, caption }: {
  entry: StoryEquationJoinEntry;
  latex: string;
  label?: string;
  caption?: string;
}) => {
  const symbols = symbolsForLatex(latex);
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState(symbols[0]?.id ?? '');
  const [mode, setMode] = useState<DecoderMode>('adapted');
  const selectedSymbol = symbols.find((item) => item.id === selectedId) ?? symbols[0];
  const symbolColors = useMemo(() => new Map(symbols.map((item, index) => [item.id, index % PALETTE_SIZE])), [symbols]);
  const coloredLatex = useMemo(() => colorizeLatex(latex, symbols, selectedId), [latex, selectedId, symbols]);
  const equationHtml = useMemo(() => renderEquation(coloredLatex), [coloredLatex]);
  const card = entry.registry === null
    ? undefined
    : equationCards.find((candidate) => candidate.label === entry.registry?.label);
  const hasManuscript = card?.decoder.verbatim !== null && card?.decoder.verbatim !== undefined;
  const displayedMode = mode === 'manuscript' && hasManuscript ? 'manuscript' : 'adapted';
  const baseId = `story-equation-${entry.chapterId}-${entry.occurrence}`;
  const title = label ?? entry.storyLabel ?? 'Equation';

  return (
    <figure className="story-equation-card" data-enrichment={entry.enrichment} aria-labelledby={`${baseId}-title`}>
      <div className="story-equation-summary">
        <div className="story-equation-heading-row">
          <span id={`${baseId}-title`} className="equation-label">{title}</span>
          {entry.enrichment === 'full' && entry.validation ? (
            <span className={`status-badge equation-tier tier-${entry.validation.tier}`}>Tier {entry.validation.tier}</span>
          ) : null}
        </div>
        <div className="equation-display" role="img" aria-label={`${title}: ${latex}`}>
          {equationHtml ? <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: equationHtml }} /> : <code>{latex}</code>}
        </div>
        {caption ? <figcaption className="visual-caption">{caption}</figcaption> : null}
        <button
          type="button"
          className="story-equation-expand"
          aria-expanded={expanded}
          aria-controls={`${baseId}-details`}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? 'Collapse equation details' : 'Expand equation details'}
        </button>
      </div>

      {expanded ? (
        <div id={`${baseId}-details`} className="story-equation-details">
          {symbols.length > 0 ? (
            <section className="equation-terms" aria-labelledby={`${baseId}-terms-heading`}>
              <p id={`${baseId}-terms-heading`} className="equation-section-label">Terms</p>
              <div className="term-chip-list">
                {symbols.map((item, index) => {
                  const selected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`term-chip equation-symbol-color-${index % PALETTE_SIZE}${selected ? ' is-selected' : ''}`}
                      aria-pressed={selected}
                      aria-controls={`${baseId}-term-detail`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <span className="term-chip-index" aria-hidden="true">{index + 1}</span>
                      <span className="term-chip-symbol" dangerouslySetInnerHTML={{ __html: katex.renderToString(item.latex, { throwOnError: false }) }} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {selectedSymbol ? (
            <TermDetail detailId={`${baseId}-term-detail`} symbol={selectedSymbol} colorIndex={symbolColors.get(selectedSymbol.id) ?? 0} />
          ) : null}

          {entry.enrichment === 'full' ? (
            <section className="story-equation-provenance" aria-label="Equation decoder and provenance">
              <div className="decoder-heading-row">
                <div>
                  <p className="equation-section-label">Plain English Decoder</p>
                  <h3>{displayedMode === 'adapted' ? 'Adapted explanation' : 'Manuscript passage'}</h3>
                </div>
                <div className="decoder-toggle" role="group" aria-label={`Decoder text for ${title}`}>
                  <button type="button" aria-pressed={displayedMode === 'adapted'} onClick={() => setMode('adapted')}>Adapted</button>
                  <button type="button" aria-pressed={displayedMode === 'manuscript'} disabled={!hasManuscript} onClick={() => setMode('manuscript')}>Manuscript</button>
                </div>
              </div>
              {displayedMode === 'manuscript' && card?.decoder.verbatim ? (
                <blockquote id={`${baseId}-decoder`} className="decoder-copy manuscript-copy">
                  {renderManuscript(card.decoder.verbatim.source)}
                  <cite>Manuscript line {card.decoder.verbatim.sourceLine}</cite>
                </blockquote>
              ) : card ? (
                <AdaptedDecoder decoderId={`${baseId}-decoder`} spans={card.decoder.adapted} activeId={selectedId} symbolColors={symbolColors} />
              ) : (
                <p id={`${baseId}-decoder`} className="decoder-copy">{caption ?? entry.storyCaption}</p>
              )}
              {!hasManuscript ? <p className="decoder-disabled-reason">No curated contiguous manuscript gloss is available for this equation.</p> : null}
              {entry.registry ? <p className="story-equation-registry">{entry.registry.label} · manuscript registry line {entry.registry.line}</p> : null}
              {entry.validation?.falsification ? (
                <aside className="falsification-box">
                  <p className="equation-section-label">Falsification condition</p>
                  <p>{entry.validation.falsification}</p>
                </aside>
              ) : null}
              <SourceChips sources={entry.validation?.dataSources ?? []} />
            </section>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
};

const EquationCards = () => {
  const [mode, setModeState] = useState<DecoderMode>(readDecoderMode);

  useEffect(() => {
    try {
      localStorage.setItem(DECODER_MODE_KEY, mode);
    } catch {
      // Storage can be blocked without affecting the decoder.
    }
  }, [mode]);

  const setMode = (nextMode: DecoderMode) => setModeState(nextMode);
  const pageStyle = { '--equation-card-count': equationCards.length } as CSSProperties;

  return (
    <div className="equations-page" style={pageStyle}>
      <header className="equations-hero">
        <p className="equation-section-label">Framework equation pilot</p>
        <h1>Eight equations, decoded</h1>
        <p>Each card links its notation to a term glossary, a direct-language explanation, and a contiguous manuscript passage. Validation fields appear only where an empirical registry record exists.</p>
      </header>
      <div className="equation-card-stack">
        {equationCards.map((card, index) => <EquationCardView key={card.label} card={card} number={index + 1} mode={mode} setMode={setMode} />)}
      </div>
    </div>
  );
};

export default EquationCards;
