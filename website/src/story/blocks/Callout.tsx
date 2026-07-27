import type { ContentBlock } from '../../content/types';

type CalloutBlock = Extract<ContentBlock, { kind: 'insight' | 'source' }>;

const Callout = ({ block }: { block: CalloutBlock }) => (
  <aside className={`callout callout-${block.kind}`}>
    {block.heading && <h3 className="callout-heading">{block.heading}</h3>}
    <div className="callout-copy">
      {block.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
    {block.kind === 'source' && block.attribution && (
      <p className="callout-attribution">{block.attribution}</p>
    )}
  </aside>
);

export default Callout;
