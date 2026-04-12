import { motion } from 'framer-motion';
import type { TensorizeCardProps } from '../types/attention.types';

export function TensorizeCard({ tokens, resultMat, resultDim, side, delay }: TensorizeCardProps) {
  return (
    <motion.div
      className={`a-tc2-card a-tc2-card--${side}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 1, 0.4, 1] }}
    >
      <div className='a-tc2-input'>
        {tokens.map((t, i) => (
          <motion.span key={i} className={`a-tc2-tok a-tc2-tok--${side}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: delay + i * 0.05, duration: 0.25 }}>
            {t}
          </motion.span>
        ))}
      </div>
      <div className='a-tc2-arrow'>
        <span className='a-tc2-txt'>张量化</span>
        <span className='a-tc2-arr'>→</span>
        <span className={`a-tc2-res a-tc2-res--${side}`}>{resultMat}</span>
        <span className='a-tc2-dim'>{resultDim}</span>
      </div>
    </motion.div>
  );
}
