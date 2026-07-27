// Route "/" — the story landing page.
//
// Renders from content/manifest.ts, so the entire book is visible from the
// start. An entry whose module exists in content/chapters links through to the
// chapter engine; the rest render as forthcoming. Progress comes from
// localStorage via getAllProgress().
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { chapters } from '../content/chapters';
import { manifest, PART_ORDER, displayNumber } from '../content/manifest';
import type { ManifestEntry, Part } from '../content/manifest';
import { getAllProgress } from './progress';
import type { ChapterProgress } from './progress';
import './StoryIndex.css';

function badgeFor(state: ChapterProgress) {
  if (state === 'completed') {
    return (
      <span className="chapter-card-badge completed">
        <span className="chapter-card-badge-icon" aria-hidden="true">
          &#10003;
        </span>
        Read
      </span>
    );
  }
  if (state === 'visited') {
    return (
      <span className="chapter-card-badge visited">
        <span className="chapter-card-badge-dot" aria-hidden="true" />
        In progress
      </span>
    );
  }
  return null;
}

const StoryIndex = () => {
  const progress = getAllProgress();
  const liveIds = new Set(chapters.map((c) => c.meta.id));
  const readCount = chapters.filter((c) => progress[c.meta.id] === 'completed').length;

  const byPart = PART_ORDER.map((part) => ({
    part,
    entries: manifest.filter((e) => e.part === part),
  })).filter((group) => group.entries.length > 0);

  let cardIndex = 0;

  const renderCard = (entry: ManifestEntry, index: number) => {
    const isLive = liveIds.has(entry.id);
    const state = progress[entry.id] ?? 'unread';

    const inner = (
      <>
        <span className="chapter-card-number" aria-hidden="true">
          {displayNumber(entry)}
        </span>
        <div className="chapter-card-body">
          <h3 className="chapter-card-title">{entry.shortTitle}</h3>
          <p className="chapter-card-era">{entry.era}</p>
          <p className="chapter-card-hook">{entry.hook}</p>
        </div>
        {isLive ? (
          badgeFor(state)
        ) : (
          <span className="chapter-card-badge forthcoming">Soon</span>
        )}
      </>
    );

    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.6), ease: 'easeOut' }}
        whileHover={isLive ? { y: -6 } : undefined}
        className="chapter-card-wrapper"
        style={{ '--card-accent': entry.accentColor } as CSSProperties}
      >
        {isLive ? (
          <Link to={`/story/${entry.id}`} className="chapter-card">
            {inner}
          </Link>
        ) : (
          <div className="chapter-card chapter-card-muted" aria-disabled="true">
            {inner}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="story-index">
      <header className="story-index-hero">
        <p className="story-index-kicker">An interactive reading of the extraction algorithm</p>
        <h1 className="story-index-title">The Original Power</h1>
        <p className="story-index-progress-summary">
          {liveIds.size} of {manifest.length} chapters interactive
          {readCount > 0 && <> &middot; {readCount} read</>}
        </p>
      </header>

      {byPart.map(({ part, entries }) => (
        <section className="story-part" key={part}>
          <h2 className="story-part-heading">
            <span className="story-part-label">{part as Part}</span>
            <span className="story-part-rule" aria-hidden="true" />
          </h2>
          <div className="chapter-grid">{entries.map((entry) => renderCard(entry, cardIndex++))}</div>
        </section>
      ))}
    </div>
  );
};

export default StoryIndex;
