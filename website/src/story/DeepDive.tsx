// Expandable "Go deeper" section for a Scene: verbatim manuscript passages
// plus formal equations, collapsed by default.
import { useState, useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { DeepDive as DeepDiveData } from '../content/types';
import Equation from './visuals/Equation';

interface DeepDiveProps {
  data: DeepDiveData;
}

const DeepDive = ({ data }: DeepDiveProps) => {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const prefersReducedMotion = useReducedMotion();
  const label = data.label ?? 'Go deeper';

  return (
    <div className="deep-dive">
      <button
        type="button"
        className="deep-dive-toggle"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="deep-dive-chevron"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          &#8250;
        </span>
        <span className="deep-dive-label">{label}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            className="deep-dive-content"
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeInOut' }
            }
            style={{ overflow: 'hidden' }}
          >
            <div className="deep-dive-inner">
              {data.passages.map((passage, i) => (
                <div className="deep-dive-passage" key={passage.heading ?? i}>
                  {passage.heading && (
                    <h4 className="deep-dive-passage-heading">{passage.heading}</h4>
                  )}
                  {passage.paragraphs.map((paragraph, j) => (
                    <p className="deep-dive-passage-text" key={j}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
              {data.equations && data.equations.length > 0 && (
                <div className="deep-dive-equations">
                  {data.equations.map((eq, i) => (
                    <div className="deep-dive-equation" key={eq.label ?? i}>
                      <Equation latex={eq.latex} label={eq.label} />
                      {eq.note && <p className="deep-dive-equation-note">{eq.note}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeepDive;
