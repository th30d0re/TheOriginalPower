import { motion, useReducedMotion } from 'framer-motion';
import type { ContentBlock } from '../../content/types';
import SceneVisual from '../visuals/SceneVisual';
import Callout from './Callout';
import FormalBox from './FormalBox';
import PullQuote from './PullQuote';
import RuntimeLog from './RuntimeLog';
import './blocks.css';

interface BlockRendererProps {
  blocks: ContentBlock[];
  chapterFile?: string;
  equationOccurrenceStart: number;
}

const BlockRenderer = ({ blocks, chapterFile, equationOccurrenceStart }: BlockRendererProps) => {
  const prefersReducedMotion = useReducedMotion();
  const itemVariants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        const equationOccurrence = equationOccurrenceStart + blocks.slice(0, index)
          .filter((candidate) => candidate.kind === 'visual' && candidate.spec.kind === 'equation').length;

        switch (block.kind) {
          case 'prose':
            return (
              <div className="content-block-prose" key={key}>
                {block.paragraphs.map((paragraph, paragraphIndex) => (
                  <motion.p key={paragraphIndex} variants={itemVariants}>
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            );
          case 'runtimeLog':
            return (
              <motion.div className="content-block" key={key} variants={itemVariants}>
                <RuntimeLog block={block} />
              </motion.div>
            );
          case 'insight':
          case 'source':
            return (
              <motion.div className="content-block" key={key} variants={itemVariants}>
                <Callout block={block} />
              </motion.div>
            );
          case 'formal':
            return (
              <motion.div className="content-block" key={key} variants={itemVariants}>
                <FormalBox block={block} />
              </motion.div>
            );
          case 'pullquote':
            return (
              <motion.div className="content-block" key={key} variants={itemVariants}>
                <PullQuote block={block} />
              </motion.div>
            );
          case 'visual':
            return (
              <motion.div
                className="content-block content-block-visual"
                key={key}
                variants={itemVariants}
              >
                <SceneVisual spec={block.spec} chapterFile={chapterFile} equationOccurrence={equationOccurrence} />
              </motion.div>
            );
          default: {
            const _exhaustive: never = block;
            return _exhaustive;
          }
        }
      })}
    </div>
  );
};

export default BlockRenderer;
