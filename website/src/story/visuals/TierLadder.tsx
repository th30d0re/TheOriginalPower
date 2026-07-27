import { motion, useReducedMotion } from 'framer-motion';
import type { Tier } from '../../content/types';

interface TierLadderProps {
  tiers: Tier[];
}

const TierLadder = ({ tiers }: TierLadderProps) => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.14,
      },
    },
  };

  const rungVariants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : 20,
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
    <motion.ol
      className="tier-ladder"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
      variants={containerVariants}
      aria-label="Extraction hierarchy, most power to least power"
    >
      {tiers.map((tier, index) => (
        <motion.li
          className="tier-ladder-rung"
          key={`${tier.symbol}-${tier.name}`}
          variants={rungVariants}
          style={{ width: `${Math.max(68, 100 - index * 8)}%` }}
        >
          <span className="tier-ladder-rank" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="tier-ladder-symbol">{tier.symbol}</span>
          <span className="tier-ladder-copy">
            <strong>{tier.name}</strong>
            <span>{tier.description}</span>
          </span>
        </motion.li>
      ))}
    </motion.ol>
  );
};

export default TierLadder;
