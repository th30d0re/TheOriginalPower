import { Fragment, useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexProseProps {
  text: string;
}

function InlineMath({ latex }: { latex: string }) {
  const rendered = useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode: false, throwOnError: true });
    } catch {
      return null;
    }
  }, [latex]);

  return rendered === null ? (
    <code className="vl-math-fallback">{latex}</code>
  ) : (
    <span className="vl-inline-math" dangerouslySetInnerHTML={{ __html: rendered }} />
  );
}

export default function LatexProse({ text }: LatexProseProps) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('$') && part.endsWith('$') ? (
          <InlineMath key={index} latex={part.slice(1, -1)} />
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
