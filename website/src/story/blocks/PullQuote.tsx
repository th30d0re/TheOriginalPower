import type { ContentBlock } from '../../content/types';

type PullQuoteBlock = Extract<ContentBlock, { kind: 'pullquote' }>;

const PullQuote = ({ block }: { block: PullQuoteBlock }) => (
  <figure className="pull-quote">
    <blockquote>{block.text}</blockquote>
    {block.attribution && <figcaption>{block.attribution}</figcaption>}
  </figure>
);

export default PullQuote;
