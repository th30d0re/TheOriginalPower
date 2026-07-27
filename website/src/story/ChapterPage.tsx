// Chapter engine: renders one full chapter from content/chapters as a
// cinematic, scroll-driven reading experience.
// Contract: default export, no props; reads :chapterId route param itself.
import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useInView, useScroll, useReducedMotion } from 'framer-motion';
import type { ChapterContent } from '../content/types';
import { getAdjacent, getChapter } from '../content/chapters';
import { getManifestEntry } from '../content/manifest';
import { markCompleted, markVisited } from './progress';
import SceneVisual from './visuals/SceneVisual';
import SceneRenderer from './SceneRenderer';
import './ChapterPage.css';

/** "04. The Haitian Export" for chapters, "A. Primary Statutory Sources" for appendices. */
function navLabel(chapter: ChapterContent): string {
  const letter = getManifestEntry(chapter.meta.id)?.appendixLetter;
  return `${letter ?? chapter.meta.number}. ${chapter.meta.title}`;
}

const ChapterPage = () => {
  const { chapterId } = useParams();
  const chapter = chapterId ? getChapter(chapterId) : undefined;
  const scrollRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const footerInView = useInView(footerRef, { once: true, margin: '0px 0px -20% 0px' });

  useEffect(() => {
    if (chapter) {
      markVisited(chapter.meta.id);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [chapter]);

  useEffect(() => {
    if (chapter && footerInView) {
      markCompleted(chapter.meta.id);
    }
  }, [chapter, footerInView]);

  if (!chapter) {
    return <Navigate to="/" replace />;
  }

  const { meta, scenes } = chapter;
  const { prev, next } = getAdjacent(meta.id);
  // Appendices continue the manifest's numbering but read as letters.
  const appendixLetter = getManifestEntry(meta.id)?.appendixLetter;
  const eyebrow = appendixLetter ? `Appendix ${appendixLetter}` : `Chapter ${meta.number}`;

  return (
    <div
      className="chapter-page"
      ref={scrollRef}
      style={{ '--chapter-accent': meta.accentColor } as React.CSSProperties}
    >
      <div className="chapter-progress-rail" aria-hidden="true">
        <motion.div
          className="chapter-progress-fill"
          style={{ scaleY: prefersReducedMotion ? undefined : scrollYProgress }}
        />
      </div>

      <header className="chapter-hero">
        <div className="chapter-hero-inner">
          <p className="chapter-hero-number">{eyebrow}</p>
          <h1 className="chapter-hero-title">{meta.title}</h1>
          <p className="chapter-hero-era">{meta.era}</p>
          {meta.epigraph && (
            <figure className="chapter-hero-epigraph">
              <blockquote>&ldquo;{meta.epigraph.text}&rdquo;</blockquote>
              {meta.epigraph.attribution && (
                <figcaption>&mdash; {meta.epigraph.attribution}</figcaption>
              )}
            </figure>
          )}
          {meta.heroVisual && (
            <div className="chapter-hero-visual">
              <SceneVisual spec={meta.heroVisual} />
            </div>
          )}
        </div>
        <div className="chapter-hero-fade" aria-hidden="true" />
      </header>

      <main className="chapter-scenes">
        {scenes.map((scene) => (
          <SceneRenderer key={scene.id} scene={scene} />
        ))}
      </main>

      <footer className="chapter-footer" ref={footerRef}>
        <nav className="chapter-footer-nav">
          <Link to="/" className="chapter-footer-index-link">
            Back to the index
          </Link>
          <div className="chapter-footer-cards">
            {prev && (
              <Link to={`/story/${prev.meta.id}`} className="chapter-nav-card chapter-nav-prev">
                <span className="chapter-nav-card-label">Previous</span>
                <span className="chapter-nav-card-title">{navLabel(prev)}</span>
              </Link>
            )}
            {next && (
              <Link
                to={`/story/${next.meta.id}`}
                className="chapter-nav-card chapter-nav-next chapter-nav-card-primary"
              >
                <span className="chapter-nav-card-label">Next</span>
                <span className="chapter-nav-card-title">{navLabel(next)}</span>
              </Link>
            )}
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default ChapterPage;
