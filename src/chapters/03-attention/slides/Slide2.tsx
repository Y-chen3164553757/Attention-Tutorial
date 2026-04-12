import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Slide2Props } from '../types/attention.types';
import { S2_PROJ_STEP, S2_MATRIX_BASE, SEQ_A, SEQ_B } from '../types/attention.types';
import { MatrixCells } from '../components/MatrixCells';
import { MatMulFigureViz } from '../components/MatMulFigureViz';
import { TensorizeCard } from '../components/TensorizeCard';
import type { MatrixStep } from '../types/attention.types';

export default function Slide2({ step }: Slide2Props) {
  // matrixStep: -1=step5 Q·Kᵀ, 0=step6 缩放, 1=step7 归一化, 2=step8 加权输出
  const matrixStep: MatrixStep = (step > S2_MATRIX_BASE ? step - S2_MATRIX_BASE - 1 : -1) as MatrixStep;
  
  // matrixPhase 控制分步动画：
  // 0: 初始
  // 1-2: step 2 (Q投影)
  // 3-4: step 3 (K投影)
  // 5-6: step 4 (V投影)
  // 7: step 5 (Q·Kᵀ) - 左图立即显示
  // 8: 显示右结果
  // 9: step 6 (缩放) - 左图立即显示
  // 10: 显示右结果
  // 11: step 7 (归一化) - 左图立即显示
  // 12: 显示右结果
  // 13: step 8 (加权输出) - 左图立即显示
  // 14: 显示右结果
  const [matrixPhase, setMatrixPhase] = useState(0);

  useEffect(() => {
    if (step < 2) { setMatrixPhase(0); return; }
    if (step === 2) {
      setMatrixPhase(1);
      const t = setTimeout(() => setMatrixPhase(2), 700);
      return () => clearTimeout(t);
    }
    if (step === 3) {
      setMatrixPhase(3);
      const t = setTimeout(() => setMatrixPhase(4), 700);
      return () => clearTimeout(t);
    }
    if (step === 4) {
      setMatrixPhase(5);
      const t = setTimeout(() => setMatrixPhase(6), 700);
      return () => clearTimeout(t);
    }
    // 步骤5-8：左图立即显示，右结果延迟显示
    if (step === S2_MATRIX_BASE) {
      setMatrixPhase(7); // 左图立即显示
      const t = setTimeout(() => setMatrixPhase(8), 700); // 右结果
      return () => clearTimeout(t);
    }
    if (step === S2_MATRIX_BASE + 1) {
      setMatrixPhase(9); // 左图立即显示
      const t = setTimeout(() => setMatrixPhase(10), 700); // 右结果
      return () => clearTimeout(t);
    }
    if (step === S2_MATRIX_BASE + 2) {
      setMatrixPhase(11); // 左图立即显示
      const t = setTimeout(() => setMatrixPhase(12), 700); // 右结果
      return () => clearTimeout(t);
    }
    if (step === S2_MATRIX_BASE + 3) {
      setMatrixPhase(13); // 左图立即显示
      const t = setTimeout(() => setMatrixPhase(14), 700); // 右结果
      return () => clearTimeout(t);
    }
    setMatrixPhase(0);
  }, [step]);

  // 获取右侧矩阵列数
  const getMatrixCols = () => {
    if (matrixStep === 2) return 2; // O 矩阵是 4×2
    return 5;
  };

  return (
    <div className='a-slide a-active' id='a-s2'>
      <div className='a-s2-layout'>
        {/* 左上: Eyebrow */}
        <div className='a-s2-g-eyebrow'>
          <div className='a-eyebrow'>Attention Flow</div>
        </div>
        <div className='a-s2-g-spacer' aria-hidden />

        {/* 左中: 标题 */}
        <div className='a-s2-g-title'>
          <h2 className='a-display-title a-s2-main-title'>Attention运算推演</h2>
        </div>

        {/* 右中: 公式 */}
        <div className='a-s2-g-formula'>
          <div className='a-s2-formula'>
            <span className={`a-s2-gp a-s2-attn-prefix${step >= S2_PROJ_STEP ? ' vis' : ''}`}>
              <span className='a-s2-attn-word'>Attention</span>(Q, K, V) ={' '}
            </span>
            <span className={`a-s2-gp${step >= S2_MATRIX_BASE ? ' vis' : ''} ${step >= S2_MATRIX_BASE + 2 ? 'hl-op' : ''}`}>softmax(</span>
            <div className={`a-s2-frac${step >= S2_PROJ_STEP + 1 ? ' vis-top' : ''} ${step >= S2_MATRIX_BASE + 1 ? 'vis-bot' : ''}`}>
              <div className='a-top'>
                <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis' : ''} ${step >= S2_MATRIX_BASE ? 'hl-q' : ''}`}>Q</span>
                <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis' : ''}`} style={{ margin: '0 4px' }}>·</span>
                <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis' : ''} ${step >= S2_MATRIX_BASE ? 'hl-k' : ''}`}>Kᵀ</span>
              </div>
              <div className='a-bot'>√d_k</div>
            </div>
            <span className={`a-s2-gp${step >= S2_MATRIX_BASE ? ' vis' : ''} ${step >= S2_MATRIX_BASE + 2 ? 'hl-op' : ''}`}>)</span>
            <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis' : ''} ${step >= S2_MATRIX_BASE + 3 ? 'hl-v' : ''}`}>V</span>
          </div>
        </div>

        {/* 左侧: 步骤列表 */}
        <div className='a-s2-g-steps'>
          <div className='a-s2-steps'>
            <div className={`a-s2-step ${step <= 1 ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>0. 序列与张量化</div>
              <div className='a-s2-step-desc'>A、B 序列就位后，经<strong>张量化</strong>一步转换为词矩阵。</div>
            </div>
            <div className={`a-s2-step ${step === 2 || step === 3 || step === 4 ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>1. 特征跨域投影</div>
              <div className='a-s2-step-desc'>step=2: <i>X<sub>A</sub></i> <i>W<sub>Q</sub></i> → <i>Q</i>；step=3: <i>X<sub>B</sub></i> <i>W<sub>K</sub></i> → <i>K</i>；step=4: <i>X<sub>B</sub></i> <i>W<sub>V</sub></i> → <i>V</i>。</div>
            </div>
            <div className={`a-s2-step ${step === S2_MATRIX_BASE ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>2. 计算跨域内积</div>
              <div className='a-s2-step-desc'><i>Q · Kᵀ</i>：序列 A 逐词测评与序列 B 的匹配度。</div>
            </div>
            <div className={`a-s2-step ${step === S2_MATRIX_BASE + 1 ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>3. 缩放</div>
              <div className='a-s2-step-desc'>除以 √d<sub>k</sub>，防止点积值过大导致 Softmax 梯度消失。</div>
            </div>
            <div className={`a-s2-step ${step === S2_MATRIX_BASE + 2 ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>4. 归一化</div>
              <div className='a-s2-step-desc'>Softmax 将缩放后得分转化为概率 α（行和为 1）。</div>
            </div>
            <div className={`a-s2-step ${step === S2_MATRIX_BASE + 3 ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>5. 加权输出</div>
              <div className='a-s2-step-desc'>α · V → 最终输出向量 <i>O</i>，聚合最相关的语义信息。</div>
            </div>
          </div>
        </div>

        {/* 右侧区域：包含推演区和说明栏 */}
        <div className='a-s2-right-area'>
          <div className='a-s2-g-stage'>
            {/* 步骤 0-1: 序列展示 */}
            <div className={`a-mat-view ${step <= 1 ? 'a-active' : ''}`}>
              <div className='a-s2-embed-stage'>
                <div className='a-s2-stage-main'>
                  <AnimatePresence mode='wait'>
                    {step === 0 && (
                      <motion.div className='a-s2-seq-vertical' key='seq-raw' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: [0.25, 1, 0.4, 1] }}>
                        <div className='a-s2-sv-row'>
                          <div className='a-s2-sv-lbl' style={{ color: 'var(--Q)' }}>Sequence A</div>
                          <div className='a-s2-sv-quote'>「它好可爱」</div>
                          <div className='a-s2-sv-chips'>
                            {SEQ_A.map((t, i) => (
                              <motion.span key={i} className='a-tc2-tok a-tc2-tok--a' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}>{t}</motion.span>
                            ))}
                          </div>
                        </div>
                        <div className='a-s2-sv-divider' aria-hidden>
                          <div className='a-s2-sv-div-line' />
                          <span className='a-s2-sv-div-vs'>×</span>
                          <div className='a-s2-sv-div-line' />
                        </div>
                        <div className='a-s2-sv-row'>
                          <div className='a-s2-sv-lbl' style={{ color: 'var(--K)' }}>Sequence B</div>
                          <div className='a-s2-sv-quote'>「有一只小猫」</div>
                          <div className='a-s2-sv-chips'>
                            {SEQ_B.map((t, i) => (
                              <motion.span key={i} className='a-tc2-tok a-tc2-tok--b' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}>{t}</motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {step === 1 && (
                      <motion.div className='a-s2-seq-vertical' key='tensor' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        <TensorizeCard tokens={SEQ_A} resultMat='X_A' resultDim='∈ ℝ⁴ˣᵈ' side='a' delay={0.05} />
                        <div className='a-s2-sv-divider' aria-hidden>
                          <div className='a-s2-sv-div-line' />
                          <span className='a-s2-sv-div-vs'>×</span>
                          <div className='a-s2-sv-div-line' />
                        </div>
                        <TensorizeCard tokens={SEQ_B} resultMat='X_B' resultDim='∈ ℝ⁵ˣᵈ' side='b' delay={0.2} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 步骤 2-4: 投影阶段（先公式后结果，三行统一动画） */}
            <div className={`a-mat-view ${step >= S2_PROJ_STEP && step < S2_MATRIX_BASE ? 'a-active' : ''}`}>
              <motion.div className='a-s2-proj-stage'
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= 2 && step < S2_MATRIX_BASE ? 1 : 0 }}
                transition={{ duration: 0.5 }}>
                <div className='a-s2-proj-flow'>

                  {/* Q 投影行 */}
                  <div className='a-s2-proj-pair'>
                    <div className='a-s2-proj-left'>
                      <motion.span className='a-s2-proj-side-tag' style={{ color:'var(--Q)', borderColor:'rgba(2,132,199,.3)', background:'rgba(2,132,199,.08)' }}
                        initial={{ opacity:0, x:-10 }} animate={{ opacity:matrixPhase >= 1 ? 1 : 0, x:matrixPhase >= 1 ? 0 : -10 }}
                        transition={{ duration:0.4, ease:'easeOut' }}>A<br/>侧<br/>→<br/>Query</motion.span>
                    </div>
                    <div className='a-s2-proj-right'>
                      <div className='a-s2-proj-mat-row'>
                        <motion.div className='a-s2-proj-xbox'
                          initial={{ opacity:0, scale:0.6, y:10 }} animate={{ opacity:matrixPhase >= 1 ? 1 : 0, scale:matrixPhase >= 1 ? 1 : 0.6, y:matrixPhase >= 1 ? 0 : 10 }}
                          transition={{ duration:0.4, ease:'easeOut', delay:0.05 }}>
                          <div className='a-s2-proj-xmat'><div className='a-s2-proj-xmat-lbl'>X<sub>A</sub></div><div className='a-s2-proj-xmat-grid'>{[...Array(16)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:matrixPhase >= 1 ? 1 : 0 }} transition={{ delay:matrixPhase >= 1 ? 0.08+i*0.012 : 0, duration:0.25, ease:'easeOut' }}/>)}</div><div className='a-s2-proj-xmat-dim'>4 × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-op' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:matrixPhase >= 1 ? 1 : 0, scale:matrixPhase >= 1 ? 1 : 0.5 }} transition={{ duration:0.35, ease:'easeOut', delay:0.18 }}>×</motion.span>
                        <motion.div className='a-s2-proj-wbox'
                          initial={{ opacity:0, scale:0.5, y:10 }} animate={{ opacity:matrixPhase >= 1 ? 1 : 0, scale:matrixPhase >= 1 ? 1 : 0.5, y:matrixPhase >= 1 ? 0 : 10 }}
                          transition={{ duration:0.4, ease:'easeOut', delay:0.25 }}>
                          <div className='a-s2-proj-wmat'><div className='a-s2-proj-wmat-lbl'>W<sub>Q</sub></div><div className='a-s2-proj-wmat-grid'>{[...Array(12)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-wmat-dim'>d × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-eq-sym' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:matrixPhase >= 1 ? 1 : 0, scale:matrixPhase >= 1 ? 1 : 0.5 }} transition={{ duration:0.35, ease:'easeOut', delay:0.38 }}>=</motion.span>
                        <motion.div className='a-s2-proj-resbox'
                          initial={{ opacity:0, scale:0.4, y:10 }} animate={{ opacity:matrixPhase >= 2 ? 1 : 0, scale:matrixPhase >= 2 ? 1 : 0.4, y:matrixPhase >= 2 ? 0 : 10 }}
                          transition={{ duration:0.45, ease:'easeOut' }}>
                          <div className='a-s2-proj-resmat' style={{ borderColor:'rgba(2,132,199,.3)', background:'rgba(2,132,199,.06)' }}><div className='a-s2-proj-resmat-lbl' style={{ color:'var(--Q)' }}>Q</div><div className='a-s2-proj-resmat-grid'>{[...Array(16)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:matrixPhase >= 2 ? 1 : 0 }} transition={{ delay:matrixPhase >= 2 ? i*0.015 : 0, duration:0.3, ease:'easeOut' }}/>)}</div><div className='a-s2-proj-resmat-dim'>4 × d</div></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* K 投影行 */}
                  <div className='a-s2-proj-pair'>
                    <div className='a-s2-proj-left'>
                      <motion.span className='a-s2-proj-side-tag' style={{ color:'var(--K)', borderColor:'rgba(5,150,105,.3)', background:'rgba(5,150,105,.08)' }}
                        initial={{ opacity:0, x:-10 }} animate={{ opacity:matrixPhase >= 3 ? 1 : 0, x:matrixPhase >= 3 ? 0 : -10 }}
                        transition={{ duration:0.4, ease:'easeOut' }}>B<br/>侧<br/>→<br/>Key</motion.span>
                    </div>
                    <div className='a-s2-proj-right'>
                      <div className='a-s2-proj-mat-row'>
                        <motion.div className='a-s2-proj-xbox'
                          initial={{ opacity:0, scale:0.6, y:10 }} animate={{ opacity:matrixPhase >= 3 ? 1 : 0, scale:matrixPhase >= 3 ? 1 : 0.6, y:matrixPhase >= 3 ? 0 : 10 }}
                          transition={{ duration:0.4, ease:'easeOut', delay:0.05 }}>
                          <div className='a-s2-proj-xmat'><div className='a-s2-proj-xmat-lbl'>X<sub>B</sub></div><div className='a-s2-proj-xmat-grid'>{[...Array(25)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:matrixPhase >= 3 ? 1 : 0 }} transition={{ delay:matrixPhase >= 3 ? 0.08+i*0.008 : 0, duration:0.25, ease:'easeOut' }}/>)}</div><div className='a-s2-proj-xmat-dim'>5 × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-op' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:matrixPhase >= 3 ? 1 : 0, scale:matrixPhase >= 3 ? 1 : 0.5 }} transition={{ duration:0.35, ease:'easeOut', delay:0.18 }}>×</motion.span>
                        <motion.div className='a-s2-proj-wbox'
                          initial={{ opacity:0, scale:0.5, y:10 }} animate={{ opacity:matrixPhase >= 3 ? 1 : 0, scale:matrixPhase >= 3 ? 1 : 0.5, y:matrixPhase >= 3 ? 0 : 10 }}
                          transition={{ duration:0.4, ease:'easeOut', delay:0.25 }}>
                          <div className='a-s2-proj-wmat'><div className='a-s2-proj-wmat-lbl'>W<sub>K</sub></div><div className='a-s2-proj-wmat-grid'>{[...Array(12)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-wmat-dim'>d × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-eq-sym' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:matrixPhase >= 3 ? 1 : 0, scale:matrixPhase >= 3 ? 1 : 0.5 }} transition={{ duration:0.35, ease:'easeOut', delay:0.38 }}>=</motion.span>
                        <motion.div className='a-s2-proj-resbox'
                          initial={{ opacity:0, scale:0.4, y:10 }} animate={{ opacity:matrixPhase >= 4 ? 1 : 0, scale:matrixPhase >= 4 ? 1 : 0.4, y:matrixPhase >= 4 ? 0 : 10 }}
                          transition={{ duration:0.45, ease:'easeOut' }}>
                          <div className='a-s2-proj-resmat' style={{ borderColor:'rgba(5,150,105,.3)', background:'rgba(5,150,105,.06)' }}><div className='a-s2-proj-resmat-lbl' style={{ color:'var(--K)' }}>K</div><div className='a-s2-proj-resmat-grid'>{[...Array(25)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:matrixPhase >= 4 ? 1 : 0 }} transition={{ delay:matrixPhase >= 4 ? i*0.012 : 0, duration:0.3, ease:'easeOut' }}/>)}</div><div className='a-s2-proj-resmat-dim'>5 × d</div></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* V 投影行 */}
                  <div className='a-s2-proj-pair'>
                    <div className='a-s2-proj-left'>
                      <motion.span className='a-s2-proj-side-tag' style={{ color:'#dc2626', borderColor:'rgba(225,29,72,.3)', background:'rgba(225,29,72,.08)' }}
                        initial={{ opacity:0, x:-10 }} animate={{ opacity:matrixPhase >= 5 ? 1 : 0, x:matrixPhase >= 5 ? 0 : -10 }}
                        transition={{ duration:0.4, ease:'easeOut' }}>B<br/>侧<br/>→<br/>Value</motion.span>
                    </div>
                    <div className='a-s2-proj-right'>
                      <div className='a-s2-proj-mat-row'>
                        <motion.div className='a-s2-proj-xbox'
                          initial={{ opacity:0, scale:0.6, y:10 }} animate={{ opacity:matrixPhase >= 5 ? 1 : 0, scale:matrixPhase >= 5 ? 1 : 0.6, y:matrixPhase >= 5 ? 0 : 10 }}
                          transition={{ duration:0.4, ease:'easeOut', delay:0.05 }}>
                          <div className='a-s2-proj-xmat'><div className='a-s2-proj-xmat-lbl'>X<sub>B</sub></div><div className='a-s2-proj-xmat-grid'>{[...Array(25)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:matrixPhase >= 5 ? 1 : 0 }} transition={{ delay:matrixPhase >= 5 ? 0.08+i*0.008 : 0, duration:0.25, ease:'easeOut' }}/>)}</div><div className='a-s2-proj-xmat-dim'>5 × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-op' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:matrixPhase >= 5 ? 1 : 0, scale:matrixPhase >= 5 ? 1 : 0.5 }} transition={{ duration:0.35, ease:'easeOut', delay:0.18 }}>×</motion.span>
                        <motion.div className='a-s2-proj-wbox'
                          initial={{ opacity:0, scale:0.5, y:10 }} animate={{ opacity:matrixPhase >= 5 ? 1 : 0, scale:matrixPhase >= 5 ? 1 : 0.5, y:matrixPhase >= 5 ? 0 : 10 }}
                          transition={{ duration:0.4, ease:'easeOut', delay:0.25 }}>
                          <div className='a-s2-proj-wmat'><div className='a-s2-proj-wmat-lbl'>W<sub>V</sub></div><div className='a-s2-proj-wmat-grid'>{[...Array(12)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-wmat-dim'>d × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-eq-sym' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:matrixPhase >= 5 ? 1 : 0, scale:matrixPhase >= 5 ? 1 : 0.5 }} transition={{ duration:0.35, ease:'easeOut', delay:0.38 }}>=</motion.span>
                        <motion.div className='a-s2-proj-resbox'
                          initial={{ opacity:0, scale:0.4, y:10 }} animate={{ opacity:matrixPhase >= 6 ? 1 : 0, scale:matrixPhase >= 6 ? 1 : 0.4, y:matrixPhase >= 6 ? 0 : 10 }}
                          transition={{ duration:0.45, ease:'easeOut' }}>
                          <div className='a-s2-proj-resmat' style={{ borderColor:'rgba(225,29,72,.3)', background:'rgba(225,29,72,.06)' }}><div className='a-s2-proj-resmat-lbl' style={{ color:'#dc2626' }}>V</div><div className='a-s2-proj-resmat-grid'>{[...Array(25)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:matrixPhase >= 6 ? 1 : 0 }} transition={{ delay:matrixPhase >= 6 ? i*0.012 : 0, duration:0.3, ease:'easeOut' }}/>)}</div><div className='a-s2-proj-resmat-dim'>5 × d</div></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>

            {/* 步骤 3-9: 矩阵运算（矩阵运算立即显示，结果延迟显示） */}
            <div className={`a-mat-view ${step >= S2_MATRIX_BASE ? 'a-active' : ''}`}>
              <motion.div className='a-s2-dot-stage'
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= S2_MATRIX_BASE ? 1 : 0 }}
                transition={{ duration: 0.5 }}>
                <div className='a-s2-dot-split'>
                  {/* 左侧：矩阵运算示意图 - 立即显示，无过渡动画 */}
                  <div className='a-s2-dot-figure' style={{
                    opacity: matrixPhase >= 7 ? 1 : 0,
                    transform: matrixPhase >= 7 ? 'none' : 'translateX(-20px) scale(0.92)'
                  }}>
                    <MatMulFigureViz matrixStep={matrixStep} />
                  </div>

                  {/* 右侧：结果矩阵 - 延迟显示 */}
                  <div className='a-s2-dot-detail'>
                    <motion.div
                      key={matrixStep}
                      className='a-s2-dot-main'
                      initial={{ opacity: 0, x: 18, scale: 0.95, filter: 'blur(4px)' }}
                      animate={{
                        opacity: matrixPhase % 2 === 0 && matrixPhase >= 8 ? 1 : 0,
                        x: matrixPhase % 2 === 0 && matrixPhase >= 8 ? 0 : 18,
                        scale: matrixPhase % 2 === 0 && matrixPhase >= 8 ? 1 : 0.95,
                        filter: matrixPhase % 2 === 0 && matrixPhase >= 8 ? 'blur(0px)' : 'blur(4px)'
                      }}
                      transition={{ duration: 0.5, ease: [0.25, 1, 0.4, 1] }}>
                      <div className='a-matrix-wrap a-matrix-wrap--fit' style={{ gridTemplateColumns: `auto repeat(${getMatrixCols()},clamp(36px,4vw,60px))` }}>
                        <MatrixCells matrixStep={matrixStep} />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* 说明栏 */}
          <footer className='a-s2-derive-foot'>
            {step >= 2 && step < S2_MATRIX_BASE ? (
              <div className='a-s2-foot-lines'>
                {step >= 2 && (
                  <motion.div className='a-s2-foot-line' key='foot-q' initial={{ opacity:0, x:-14, filter:'blur(4px)' }} animate={{ opacity:1, x:0, filter:'blur(0px)' }} transition={{ duration:0.5, ease:'easeOut' }}>
                    <span className='a-s2-foot-line-dot' style={{ background:'rgba(2,132,199,.5)' }}/>
                    <span className='a-s2-derive-foot-text'>将序列 A 的词向量矩阵 <strong>X<sub>A</sub></strong> 与可学习权重 <strong>W<sub>Q</sub></strong> 相乘，得到 <strong>Query (Q)</strong>。</span>
                  </motion.div>
                )}
                {step >= 3 && (
                  <motion.div className='a-s2-foot-line' key='foot-k' initial={{ opacity:0, x:-14, filter:'blur(4px)' }} animate={{ opacity:1, x:0, filter:'blur(0px)' }} transition={{ duration:0.5, ease:'easeOut' }}>
                    <span className='a-s2-foot-line-dot' style={{ background:'rgba(5,150,105,.5)' }}/>
                    <span className='a-s2-derive-foot-text'>将序列 B 的词向量矩阵 <strong>X<sub>B</sub></strong> 与 <strong>W<sub>K</sub></strong> 相乘，得到 <strong>Key (K)</strong>。</span>
                  </motion.div>
                )}
                {step >= 4 && (
                  <motion.div className='a-s2-foot-line' key='foot-v' initial={{ opacity:0, x:-14, filter:'blur(4px)' }} animate={{ opacity:1, x:0, filter:'blur(0px)' }} transition={{ duration:0.5, ease:'easeOut' }}>
                    <span className='a-s2-foot-line-dot' style={{ background:'rgba(225,29,72,.5)' }}/>
                    <span className='a-s2-derive-foot-text'>同样将 <strong>X<sub>B</sub></strong> 与 <strong>W<sub>V</sub></strong> 相乘，得到 <strong>Value (V)</strong>。</span>
                  </motion.div>
                )}
              </div>
            ) : step >= S2_MATRIX_BASE && step < S2_MATRIX_BASE + 1 ? (
              <motion.div className='a-s2-foot-single' initial={{ opacity:0, x:-14, filter:'blur(4px)' }} animate={{ opacity:1, x:0, filter:'blur(0px)' }} transition={{ duration:0.5, ease:'easeOut' }}>
                <span className='a-s2-foot-line-dot' style={{ background:'rgba(2,132,199,.5)' }}/>
                <span className='a-s2-derive-foot-text'>A 侧 4 个词与 B 侧 5 个词做<strong>点积</strong>，得到 4×5 相似度矩阵。数值越大代表越相关。</span>
              </motion.div>
            ) : step >= S2_MATRIX_BASE + 1 && step < S2_MATRIX_BASE + 2 ? (
              <motion.div className='a-s2-foot-single' initial={{ opacity:0, x:-14, filter:'blur(4px)' }} animate={{ opacity:1, x:0, filter:'blur(0px)' }} transition={{ duration:0.5, ease:'easeOut' }}>
                <span className='a-s2-foot-line-dot' style={{ background:'rgba(5,150,105,.5)' }}/>
                <span className='a-s2-derive-foot-text'>所有得分<strong>除以 √d<sub>k</sub></strong>。防止 d 较大时点积值过大，导致 Softmax 梯度趋于零，利于训练稳定。</span>
              </motion.div>
            ) : step >= S2_MATRIX_BASE + 2 && step < S2_MATRIX_BASE + 3 ? (
              <motion.div className='a-s2-foot-single' initial={{ opacity:0, x:-14, filter:'blur(4px)' }} animate={{ opacity:1, x:0, filter:'blur(0px)' }} transition={{ duration:0.5, ease:'easeOut' }}>
                <span className='a-s2-foot-line-dot' style={{ background:'rgba(225,29,72,.5)' }}/>
                <span className='a-s2-derive-foot-text'>每行经 <strong>Softmax</strong> 归一化（行和为 1），转化为<strong>概率 α</strong>。</span>
              </motion.div>
            ) : step >= S2_MATRIX_BASE + 3 ? (
              <motion.div className='a-s2-foot-single' initial={{ opacity:0, x:-14, filter:'blur(4px)' }} animate={{ opacity:1, x:0, filter:'blur(0px)' }} transition={{ duration:0.5, ease:'easeOut' }}>
                <span className='a-s2-foot-line-dot' style={{ background:'rgba(124,58,237,.5)' }}/>
                <span className='a-s2-derive-foot-text'>加权求和得到 <strong>O</strong>——每个词经 Attention 后的<strong>新向量表示</strong>，携带了目标侧最相关的语义信息。</span>
              </motion.div>
            ) : (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={step}
                  className='a-s2-foot-single'
                  initial={{ opacity:0, y:8, filter:'blur(3px)' }}
                  animate={{ opacity:1, y:0, filter:'blur(0px)' }}
                  exit={{ opacity:0, y:-8, filter:'blur(3px)' }}
                  transition={{ duration:0.4, ease:'easeOut' }}
                >
                  {step === 0 && (
                    <>
                      <span className='a-s2-foot-line-dot' style={{ background:'rgba(100,116,139,.5)' }}/>
                      <span className='a-s2-derive-foot-text'>两侧<strong>原始序列</strong>已就位。接下来进入<strong>「张量化」</strong>，将离散字词一步映射为高维连续向量。</span>
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <span className='a-s2-foot-line-dot' style={{ background:'rgba(124,58,237,.5)' }}/>
                      <span className='a-s2-derive-foot-text'><strong>张量化</strong>完成：四个词映射为 <strong>X<sub>A</sub></strong>（4×d），五个词映射为 <strong>X<sub>B</sub></strong>（5×d），堆叠为词矩阵。</span>
                    </>
                  )}
                  {step === S2_MATRIX_BASE && (
                    <>
                      <span className='a-s2-foot-line-dot' style={{ background:'rgba(2,132,199,.5)' }}/>
                      <span className='a-s2-derive-foot-text'>A 侧 4 个词与 B 侧 5 个词做<strong>点积</strong>，得到 4×5 相似度矩阵。数值越大代表越相关，蓝色格点为相对得分最高区域。</span>
                    </>
                  )}
                  {step === S2_MATRIX_BASE + 1 && (
                    <>
                      <span className='a-s2-foot-line-dot' style={{ background:'rgba(5,150,105,.5)' }}/>
                      <span className='a-s2-derive-foot-text'>所有得分<strong>除以 √d<sub>k</sub></strong>（d 为向量维度）。防止 d 较大时点积值过大，导致 Softmax 梯度趋于零，利于训练稳定。</span>
                    </>
                  )}
                  {step === S2_MATRIX_BASE + 2 && (
                    <>
                      <span className='a-s2-foot-line-dot' style={{ background:'rgba(225,29,72,.5)' }}/>
                      <span className='a-s2-derive-foot-text'>每行经 <strong>Softmax</strong> 归一化（行和为 1），转化为<strong>概率 α</strong>。<strong>O = α · V</strong> 将作为<strong>下一层的输入</strong>，持续聚合语义。</span>
                    </>
                  )}
                  {step === S2_MATRIX_BASE + 3 && (
                    <>
                      <span className='a-s2-foot-line-dot' style={{ background:'rgba(124,58,237,.5)' }}/>
                      <span className='a-s2-derive-foot-text'>加权求和得到 <strong>O</strong>——每个词经 Attention 后的<strong>新向量表示</strong>，携带了目标侧最相关的语义信息，可作为<strong>下一层 Transformer</strong> 的输入。</span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
