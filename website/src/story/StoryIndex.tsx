// Route "/" — the story landing page. Lists every chapter in the registry as
// a card linking to /story/:chapterId. Reads progress from localStorage via
// getAllProgress() to render a summary and per-card state badges.
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { chapters } from '../content/chapters';
import { getAllProgress } from './progress';
import type { ChapterProgress } from './progress';
import './StoryIndex.css';

const TOTAL_CHAPTERS = 23;

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
  const readCount = chapters.filter((c) => progress[c.meta.id] === 'completed').length;

  return (
    <div className="story-index">
      <header className="story-index-hero">
        <p className="story-index-kicker">An interactive reading of the extraction algorithm</p>
        <h1 className="story-index-title">The Original Power</h1>
        {readCount > 0 && (
          <p className="story-index-progress-summary">
            {readCount} of {chapters.length} chapters read
          </p>
        )}
      </header>

      <div className="chapter-grid">
        {chapters.map((chapter, index) => {
          const state = progress[chapter.meta.id] ?? 'unread';
          return (
            <motion.div
              key={chapter.meta.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="chapter-card-wrapper"
              style={{ '--card-accent': chapter.meta.accentColor } as CSSProperties}
            >
              <Link to={`/story/${chapter.meta.id}`} className="chapter-card">
                <span className="chapter-card-number" aria-hidden="true">
                  {String(chapter.meta.number).padStart(2, '0')}
                </span>
                <div className="chapter-card-body">
                  <h2 className="chapter-card-title">{chapter.meta.title}</h2>
                  <p className="chapter-card-era">{chapter.meta.era}</p>
                  <p className="chapter-card-hook">{chapter.meta.hook}</p>
                </div>
                {badgeFor(state)}
              </Link>
            </motion.div>
          );
        })}

        {chapters.length < TOTAL_CHAPTERS && (
          <div className="chapter-card-wrapper">
            <div className="chapter-card chapter-card-muted">
              <div className="chapter-card-body">
                <p className="chapter-card-hook">More chapters are on the way.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryIndex;
