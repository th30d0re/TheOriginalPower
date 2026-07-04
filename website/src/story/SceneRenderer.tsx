// Renders a single Scene: optional title, prose paragraphs, optional visual,
// optional key-concept cards, optional trailing DeepDive.
import { motion, useReducedMotion } from 'framer-motion';
import type { Scene } from '../content/types';
import SceneVisual from './visuals/SceneVisual';
import DeepDive from './DeepDive';

interface SceneRendererProps {
  scene: Scene;
}

const SceneRenderer = ({ scene }: SceneRendererProps) => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
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

      <div className="scene-prose">
        {scene.prose.map((paragraph, i) => (
          <motion.p key={i} variants={itemVariants}>
            {paragraph}
          </motion.p>
        ))}
      </div>

      {scene.visual && (
        <motion.div className="scene-visual-wrap" variants={itemVariants}>
          <SceneVisual spec={scene.visual} />
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
