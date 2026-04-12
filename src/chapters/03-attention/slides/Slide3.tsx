import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import type { Slide3Props } from '../types/attention.types';
import { S3_MATRIX_BASE, S3_STEP_BASE } from '../types/attention.types';
import { SABase, SAH1, SAH2, SAH3 } from '../utils/attention-constants';

export default function Slide3({ step }: Slide3Props) {
  // matrixPhase 控制分步动画
  // 0: 基础矩阵公式
  // 1: 矩阵显示 + Head1
  // 2: Head2
  // 3: Head3
  // 4: 合并结果
  const [matrixPhase, setMatrixPhase] = useState(0);

  useEffect(() => {
    if (step < S3_STEP_BASE) { setMatrixPhase(0); return; }
    if (step === S3_STEP_BASE) {
      setMatrixPhase(1);
      const t = setTimeout(() => setMatrixPhase(2), 800);
      return () => clearTimeout(t);
    }
    if (step === S3_STEP_BASE + 1) {
      setMatrixPhase(2);
      const t = setTimeout(() => setMatrixPhase(3), 800);
      return () => clearTimeout(t);
    }
    if (step === S3_STEP_BASE + 2) {
      setMatrixPhase(3);
      const t = setTimeout(() => setMatrixPhase(4), 800);
      return () => clearTimeout(t);
    }
    if (step >= S3_STEP_BASE + 3) { setMatrixPhase(4); return; }
    setMatrixPhase(0);
  }, [step]);

  const getM = () => {
    if (matrixPhase === 2) return { d: SAH1, r: 3, c: 2, cl: 'a-hl-color-1', id: 1 };
    if (matrixPhase === 3) return { d: SAH2, r: 1, c: 2, cl: 'a-hl-color-2', id: 2 };
    if (matrixPhase === 4) return { d: SAH3, r: 5, c: 2, cl: 'a-hl-color-3', id: 3 };
    return { d: SABase, r: -1, c: -1, cl: '', id: 0 };
  };
  const { d, r: hR, c: hC, cl, id } = getM();
  const words = ['有', '一只', '小猫', '它', '好', '可爱'];

  return (
    <div className='a-slide a-active' id='a-s3'>
      <div className='a-s3-layout a-show'>
        <div className='a-eyebrow'>The Paradigm</div>
        <h2 className='a-display-title' style={{ textAlign: 'center', marginBottom: 0 }}>大一统模型基石：<span className='a-grad'>自注意力与多头协同</span></h2>

        <div className='a-s3-grid'>
          {/* 左侧：自注意力矩阵 */}
          <div className='a-s3-panel'>
            <div className='a-s3-p-title'><span style={{ width: 16, height: 16, background: 'var(--ink)', borderRadius: 4, display: 'inline-block' }} />Self-Attention</div>

            {/* 公式区域 - 先公式后结果 */}
            <motion.div
              className='a-s3-formula-area'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: step >= S3_MATRIX_BASE ? 1 : 0, y: step >= S3_MATRIX_BASE ? 0 : -10 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <Latex>{`$$ \\text{Attn}(Q,K,V) = \\text{softmax}(\\frac{QK^T}{\\sqrt{d_k}})V $$`}</Latex>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 10, fontSize: 'clamp(0.7rem,1vw,1.15rem)' }}>
                合并单句：<strong>"有 一只 小猫 它 好 可爱"</strong>产生全局矩阵。
              </p>
            </motion.div>

            {/* 矩阵展示区域 - 先左图后右结果 */}
            <div className='a-s3-matrix-area'>
              {/* 左侧：矩阵运算示意图 */}
              <motion.div
                className='a-s3-matrix-figure'
                initial={{ opacity: 0, x: -20, scale: 0.92 }}
                animate={{ opacity: matrixPhase >= 1 ? 1 : 0, x: matrixPhase >= 1 ? 0 : -20, scale: matrixPhase >= 1 ? 1 : 0.92 }}
                transition={{ duration: 0.5 }}
              >
                <div className='a-s3-mini-viz'>
                  <div className='a-s3-mini-header'>
                    {matrixPhase === 1 && '注意力矩阵生成'}
                    {matrixPhase === 2 && 'Head 1: 指代关联'}
                    {matrixPhase === 3 && 'Head 2: 数量修饰'}
                    {matrixPhase === 4 && 'Head 3: 情感属性'}
                    {matrixPhase >= 4 && '多头合并'}
                  </div>
                  <div className='a-s3-mini-grid'>
                    {Array.from({ length: 36 }).map((_, i) => {
                      const row = Math.floor(i / 6);
                      const col = i % 6;
                      const isHighlighted = id > 0 && row === hR && col === hC;
                      return (
                        <motion.span
                          key={i}
                          className={`a-s3-mini-cell ${isHighlighted ? 'a-s3-mini-cell--hl' : ''}`}
                          animate={isHighlighted ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* 右侧：结果矩阵 */}
              <motion.div
                className='a-s3-matrix-result'
                initial={{ opacity: 0, x: 18, scale: 0.95, filter: 'blur(4px)' }}
                animate={{ opacity: matrixPhase >= 2 ? 1 : 0, x: matrixPhase >= 2 ? 0 : 18, scale: matrixPhase >= 2 ? 1 : 0.95, filter: matrixPhase >= 2 ? 'blur(0px)' : 'blur(4px)' }}
                transition={{ duration: 0.5 }}
              >
                <div className={`a-sa-matrix-wrap ${matrixPhase >= 1 ? 'a-show' : ''}`}>
                  <div className='a-sa-cell a-header' />
                  {words.map((w, i) => <div key={i} className='a-sa-cell a-header'>{w}</div>)}
                  {words.map((rW, rr) => (
                    <React.Fragment key={rr}>
                      <div className='a-sa-cell a-header' style={{ justifyContent: 'flex-end', color: id > 0 && rr === hR ? (id === 1 ? 'var(--Q)' : id === 2 ? 'var(--K)' : 'var(--V)') : 'var(--muted)' }}>{rW}</div>
                      {words.map((_, cc) => {
                        const v = d[rr][cc];
                        const hl = rr === hR && cc === hC;
                        return <div key={`${rr}-${cc}`} className={`a-sa-cell a-val a-show-cell ${hl ? 'a-hl ' + cl : ''}`} style={{ background: hl ? undefined : (v > 0.4 ? `rgba(15,23,42,${v * 0.4})` : '#f8fafc') }}>{v.toFixed(2)}</div>;
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 说明文字 */}
            <motion.div
              className='a-s3-desc-text'
              initial={{ opacity: 0 }}
              animate={{ opacity: matrixPhase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {matrixPhase === 1 && '自注意力让每个词都可以关注到序列中的所有其他词，建立全局依赖关系。'}
              {matrixPhase === 2 && 'Head 1 学习到了"它"与"小猫"的指代关联。'}
              {matrixPhase === 3 && 'Head 2 捕捉到了"一只"与"小猫"的数量修饰关系。'}
              {matrixPhase === 4 && '多头注意力将多个Head的注意力模式合并，捕捉更丰富的语义关系。'}
            </motion.div>
          </div>

          {/* 右侧：多头注意力 */}
          <div className='a-s3-panel'>
            <div className='a-s3-p-title' style={{ color: 'var(--a2)' }}><span style={{ width: 16, height: 16, background: 'var(--a2)', borderRadius: 4, display: 'inline-block' }} />Multi-Head</div>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <Latex>{`$$ \\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O $$`}</Latex>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: 10 }}>特征投射至多个低维子空间：</p>
            <div className='a-mh-stage'>
              <div className={`a-mh-head ${matrixPhase >= 1 ? 'a-show' : ''} ${id === 1 ? 'a-focus' : ''}`} style={id !== 1 ? {} : { borderLeftColor: 'var(--Q)' }}>
                <div className='a-mh-title' style={{ color: id === 1 ? 'var(--Q)' : undefined }}>Head 1: 倾向指代关联</div>
                <motion.div className='a-mh-conn' style={{ background: id === 1 ? 'rgba(2,132,199,.1)' : undefined }} animate={{ scale: id === 1 ? [1, 1.05, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.5 }}>它 ➜ 小猫</motion.div>
              </div>
              <div className={`a-mh-head ${matrixPhase >= 2 ? 'a-show' : ''} ${id === 2 ? 'a-focus' : ''}`} style={id !== 2 ? {} : { borderLeftColor: 'var(--K)' }}>
                <div className='a-mh-title' style={{ color: id === 2 ? 'var(--K)' : undefined }}>Head 2: 倾向数量修饰</div>
                <motion.div className='a-mh-conn' style={{ background: id === 2 ? 'rgba(5,150,105,.1)' : undefined }} animate={{ scale: id === 2 ? [1, 1.05, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.5 }}>一只 ➜ 小猫</motion.div>
              </div>
              <div className={`a-mh-head ${matrixPhase >= 3 ? 'a-show' : ''} ${id === 3 ? 'a-focus' : ''}`} style={id !== 3 ? {} : { borderLeftColor: 'var(--V)' }}>
                <div className='a-mh-title' style={{ color: id === 3 ? 'var(--V)' : undefined }}>Head 3: 倾向情感属性</div>
                <motion.div className='a-mh-conn' style={{ background: id === 3 ? 'rgba(225,29,72,.1)' : undefined }} animate={{ scale: id === 3 ? [1, 1.05, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.5 }}>可爱 ➜ 小猫</motion.div>
              </div>
            </div>

            {/* 合并公式 - 最后一步显示 */}
            <motion.div
              className='a-mh-formula-banner'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: matrixPhase === 4 ? 1 : 0, y: matrixPhase === 4 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <Latex>{`$$ \\text{MultiHead} = \\text{Concat}(\\text{head}_1, \\text{head}_2, \\text{head}_3) W^O $$`}</Latex>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
