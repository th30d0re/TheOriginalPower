// Renders a single Scene: optional title, prose paragraphs, optional visual,
// optional key-concept cards, optional trailing DeepDive.
import { motion, useReducedMotion } from 'framer-motion';
import type { ContentBlock, Scene } from '../content/types';
import BlockRenderer from './blocks/BlockRenderer';
import SceneVisual from './visuals/SceneVisual';
import DeepDive from './DeepDive';

interface SceneRendererProps {
  scene: Scene;
  chapterFile?: string;
  equationOccurrenceStart: number;
}

const SceneRenderer = ({ scene, chapterFile, equationOccurrenceStart }: SceneRendererProps) => {
  const prefersReducedMotion = useReducedMotion();
  const bodyBlocks: ContentBlock[] = [
    ...(scene.prose && scene.prose.length > 0
      ? [{ kind: 'prose' as const, paragraphs: scene.prose }]
      : []),
    ...(scene.blocks ?? []),
  ];

  // With reduced motion the hidden state is fully opaque: content must never be
  // gated behind an animation that the user has asked not to run.
  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: 'easeOut' as const,
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.section
      className="scene"
      id={scene.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
      variants={containerVariants}
    >
      {scene.title && (
        <motion.p className="scene-title" variants={itemVariants}>
          {scene.title}
        </motion.p>
      )}

      {bodyBlocks.length > 0 && (
        <BlockRenderer blocks={bodyBlocks} chapterFile={chapterFile} equationOccurrenceStart={equationOccurrenceStart} />
      )}

      {scene.visual && (
        <motion.div className="scene-visual-wrap" variants={itemVariants}>
          <SceneVisual
            spec={scene.visual}
            chapterFile={chapterFile}
            equationOccurrence={equationOccurrenceStart + bodyBlocks.filter((block) => block.kind === 'visual' && block.spec.kind === 'equation').length}
          />
        </motion.div>
      )}

      {scene.keyConcepts && scene.keyConcepts.length > 0 && (
        <motion.dl className="key-concepts-grid" variants={itemVariants}>
          {scene.keyConcepts.map((concept) => (
            <div className="key-concept-card" key={concept.term}>
              <dt className="key-concept-term">{concept.term}</dt>
              <dd className="key-concept-definition">{concept.definition}</dd>
            </div>
          ))}
        </motion.dl>
      )}

      {scene.deepDive && (
        <motion.div variants={itemVariants}>
          <DeepDive data={scene.deepDive} />
        </motion.div>
      )}
    </motion.section>
  );
};

export default SceneRenderer;
