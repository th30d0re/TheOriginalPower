import type { ContentBlock } from '../../content/types';

type RuntimeLogBlock = Extract<ContentBlock, { kind: 'runtimeLog' }>;

const RuntimeLog = ({ block }: { block: RuntimeLogBlock }) => (
  <section className="runtime-log" aria-label={`Runtime log: ${block.title}`}>
    <header className="runtime-log-title">RUNTIME LOG: {block.title}</header>
    <dl className="runtime-log-lines">
      {block.lines.map((line, index) => (
        <div className="runtime-log-line" key={`${line.field}-${index}`}>
          <dt>{line.field}</dt>
          <dd>{line.value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

export default RuntimeLog;
