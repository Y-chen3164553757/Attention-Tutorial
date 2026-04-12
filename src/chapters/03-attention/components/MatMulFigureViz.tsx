import { motion } from 'framer-motion';
import type { MatrixStep } from '../types/attention.types';

interface MatMulFigureVizProps {
  matrixStep: MatrixStep;
}

export function MatMulFigureViz({ matrixStep }: MatMulFigureVizProps) {
  const flowPulse = { opacity: [0.72, 1, 0.72], transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' as const } };
  const scalePulse = { scale: [1, 1.06, 1], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const } };

  // 步骤2: Q · Kᵀ 图解
  if (matrixStep === -1) {
    return (
      <div className='a-mviz a-mviz--mat'>
        <div className='a-mviz-flow-single'>
          <div className='a-mviz-stage-card a-mviz-stage-card--on'>
            <div className='a-mviz-stage-h'>① Q · Kᵀ → 4×5 得分矩阵</div>
            <div className='a-mviz-mini-mul'>
              <div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--q'>
                <span className='a-mviz-mat-lbl'>Q</span>
                <div className='a-mviz-grid a-mviz-grid--4x2'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.span key={i} className='a-mviz-cell a-mviz-cell--q' animate={{ scale: [1, 1.18, 1], opacity: [1, 0.8, 1] }} transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.09 }} />
                  ))}
                </div>
                <span className='a-mviz-dim'>4×d</span>
              </div>
              <motion.span className='a-mviz-times a-mviz-times--lg' animate={flowPulse}>×</motion.span>
              <div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--k'>
                <span className='a-mviz-mat-lbl'>Kᵀ</span>
                <div className='a-mviz-grid a-mviz-grid--2x5'>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.span key={i} className='a-mviz-cell a-mviz-cell--k' animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.06 }} />
                  ))}
                </div>
                <span className='a-mviz-dim'>d×5</span>
              </div>
              <span className='a-mviz-eq'>=</span>
              <motion.div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--score' animate={scalePulse}>
                <span className='a-mviz-mat-lbl'>S</span>
                <div className='a-mviz-grid a-mviz-grid--4x5'>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.span key={i} className='a-mviz-cell a-mviz-cell--score' animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }} transition={{ duration: 1.0, repeat: Infinity, delay: (i % 5) * 0.06 + Math.floor(i / 5) * 0.04 }} />
                  ))}
                </div>
                <span className='a-mviz-dim'>4×5</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 步骤3: ÷ √dₖ 缩放
  if (matrixStep === 0) {
    return (
      <div className='a-mviz a-mviz--mat'>
        <div className='a-mviz-flow-single'>
          <div className='a-mviz-stage-card a-mviz-stage-card--on'>
            <div className='a-mviz-stage-h'>÷ √d<sub>k</sub> 方差归一</div>
            <div className='a-mviz-scale-row'>
              <motion.div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--score' animate={{ x: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <span className='a-mviz-mat-lbl'>S</span>
                <div className='a-mviz-grid a-mviz-grid--4x5'>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.span key={i} className='a-mviz-cell a-mviz-cell--score' animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.9, repeat: Infinity, delay: (i % 7) * 0.05 }} />
                  ))}
                </div>
                <span className='a-mviz-dim'>4×5</span>
              </motion.div>
              <motion.span className='a-mviz-div-op' animate={{ scale: [1, 1.2, 1], color: ['#64748b', '#7c3aed', '#64748b'] }} transition={{ duration: 1.1, repeat: Infinity }}>÷</motion.span>
              <motion.div className='a-mviz-sqrt' animate={{ boxShadow: ['0 0 0 0 rgba(124,58,237,0)', '0 0 0 6px rgba(124,58,237,.18)', '0 0 0 0 rgba(124,58,237,0)'] }} transition={{ duration: 1.2, repeat: Infinity }}>√d<sub>k</sub></motion.div>
              <span className='a-mviz-eq'>=</span>
              <div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--score'>
                <span className='a-mviz-mat-lbl'>S′</span>
                <div className='a-mviz-grid a-mviz-grid--4x5'>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.span key={i} className='a-mviz-cell a-mviz-cell--score' animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.85, repeat: Infinity, delay: (i % 9) * 0.04 }} />
                  ))}
                </div>
                <span className='a-mviz-dim'>4×5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 步骤4: softmax 归一化
  if (matrixStep === 1) {
    return (
      <div className='a-mviz a-mviz--mat'>
        <div className='a-mviz-flow-single'>
          <div className='a-mviz-stage-card a-mviz-stage-card--on'>
            <div className='a-mviz-stage-h'>softmax → 概率 α</div>
            <div className='a-mviz-softmax-row'>
              <motion.div className='a-mviz-softmax-pill' animate={scalePulse}>softmax</motion.div>
              <span className='a-mviz-eq'>→</span>
              <div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--alpha'>
                <span className='a-mviz-mat-lbl'>α</span>
                <div className='a-mviz-grid a-mviz-grid--4x5'>
                  {Array.from({ length: 20 }).map((_, i) => {
                    const isMax = i % 5 === 4;
                    return <motion.span key={i} className={`a-mviz-cell ${isMax ? 'a-mviz-cell--alpha-max' : 'a-mviz-cell--alpha'}`} animate={{ scale: isMax ? [1, 1.2, 1] : [1, 1.04, 1] }} transition={{ duration: 0.85, repeat: Infinity, delay: (i % 5) * 0.06 }} />;
                  })}
                </div>
                <span className='a-mviz-dim'>4×5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 步骤5: α · V → O 加权输出
  return (
    <div className='a-mviz a-mviz--mat'>
      <div className='a-mviz-flow-single'>
        <div className='a-mviz-stage-card a-mviz-stage-card--on'>
          <div className='a-mviz-stage-h'>α · V → 输出 O</div>
          <div className='a-mviz-mini-mul'>
            <div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--alpha'>
              <span className='a-mviz-mat-lbl'>α</span>
              <div className='a-mviz-grid a-mviz-grid--4x5'>
                {Array.from({ length: 20 }).map((_, i) => {
                  const isMax = i % 5 === 4;
                  return <motion.span key={i} className={`a-mviz-cell ${isMax ? 'a-mviz-cell--alpha-max' : 'a-mviz-cell--alpha'}`} animate={{ scale: isMax ? [1, 1.2, 1] : [1, 1.04, 1] }} transition={{ duration: 0.85, repeat: Infinity, delay: (i % 5) * 0.06 }} />;
                })}
              </div>
              <span className='a-mviz-dim'>4×5</span>
            </div>
            <motion.span className='a-mviz-times' animate={flowPulse}>×</motion.span>
            <div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--v'>
              <span className='a-mviz-mat-lbl'>V</span>
              <div className='a-mviz-grid a-mviz-grid--5x2'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.span key={i} className='a-mviz-cell a-mviz-cell--v' animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.05 }} />
                ))}
              </div>
              <span className='a-mviz-dim'>5×d</span>
            </div>
            <span className='a-mviz-eq'>=</span>
            <motion.div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--o' animate={scalePulse}>
              <span className='a-mviz-mat-lbl'>O</span>
              <div className='a-mviz-grid a-mviz-grid--4x2'>
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.span key={i} className='a-mviz-cell a-mviz-cell--o' animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.07 }} />
                ))}
              </div>
              <span className='a-mviz-dim'>4×d</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
