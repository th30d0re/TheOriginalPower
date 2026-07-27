import type { ContentBlock } from '../../content/types';
import Equation from '../visuals/Equation';

type FormalBlock = Extract<ContentBlock, { kind: 'formal' }>;

const FormalBox = ({ block }: { block: FormalBlock }) => {
  const variant = block.variant.charAt(0).toUpperCase() + block.variant.slice(1);

  return (
    <section className={`formal-box formal-box-${block.variant}`}>
      <header className="formal-box-heading">
        <span>{variant}</span>
        {block.label && <span className="formal-box-label">{block.label}</span>}
      </header>
      <div className="formal-box-copy">
        {block.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {block.equations && block.equations.length > 0 && (
        <div className="formal-box-equations">
          {block.equations.map((equation, index) => (
            <Equation
              key={equation.label ?? index}
              latex={equation.latex}
              label={equation.label}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FormalBox;
