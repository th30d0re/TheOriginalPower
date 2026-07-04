// Renders a display-mode LaTeX equation with KaTeX, matching the story mode's
// dark, cinematic-essay palette. Falls back to raw LaTeX in a <code> block if
// KaTeX cannot parse the input.
import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './visuals.css';

interface EquationProps {
  latex: string;
  label?: string;
  caption?: string;
}

const Equation = ({ latex, label, caption }: EquationProps) => {
  const { html, errored } = useMemo(() => {
    try {
      return {
        html: katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
        }),
        errored: false,
      };
    } catch {
      return { html: '', errored: true };
    }
  }, [latex]);

  return (
    <figure className="visual-figure equation-figure">
      <div className="equation-row">
        {errored ? (
          <pre className="equation-fallback">
            <code>{latex}</code>
          </pre>
        ) : (
          <div className="equation-katex" dangerouslySetInnerHTML={{ __html: html }} />
        )}
        {label ? <span className="equation-label">{label}</span> : null}
      </div>
      {caption ? <figcaption className="visual-caption">{caption}</figcaption> : null}
    </figure>
  );
};

export default Equation;
