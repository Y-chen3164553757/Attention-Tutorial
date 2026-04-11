import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import type { ChapterComponentProps } from '../catalog';
import '../02-origin/OriginChapter.css';
import './AttentionChapter.css';

// ============================================================
// 步骤常量定义
// ============================================================
const PAGE_COUNT = 4;
const STEPS = [8, 5, 8, 7]; // 每页的步骤数：Slide2 有 8 步 (0-7)
const S2_PROJ_STEP = 2;       // 投影步骤索引
const S2_MATRIX_BASE = 3;    // 矩阵运算起始步骤
const S2_PROJ_SUBSTEPS_MAX = 4;

// ============================================================
// 矩阵数据
// ============================================================
const MRaw = [[1.2,0.5,1.8,2.0,12.6],[1.0,2.5,1.2,1.5,0.8],[0.5,1.0,5.0,2.0,1.5],[1.5,2.2,4.5,8.5,3.0]];
const SRaw = [[0.02,0.03,0.05,0.10,0.80],[0.10,0.50,0.10,0.20,0.10],[0.05,0.10,0.65,0.15,0.05],[0.10,0.15,0.20,0.45,0.10]];
const ORaw = [[0.85, 0.62], [0.72, 0.88], [0.58, 0.75], [0.68, 0.82]]; // 加权输出矩阵
const ORawPrime = [[1.42, 1.08], [1.28, 1.45], [1.15, 1.22], [1.25, 1.35]]; // 残差链接结果

const cellVars = {
  hidden:  { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 1, 0.4, 1] as const } },
};

// ============================================================
// Slide 0: 引入页
// ============================================================
const Slide0 = ({ step }: { step: number }) => {
  return (
    <div className={`a-slide a-active ${step > 0 ? 'a-moved' : ''}`} id='a-s0'>
      <div className={`a-s0-center ${step > 0 ? 'a-moved' : ''}`}>
        <div className='a-s0-desc' style={{ marginTop: step > 0 ? 0 : '35vh' }}>
          人类在面对海量信息时，并不会平均分配大脑算力。<br/>
          而是带着目标，将目光聚焦于关键的"特征线索"，过滤无关背景。
        </div>
      </div>
      {step === 0 && <div className='a-s0-hint'>按 [空格] 或 [→] 键步进推演</div>}

      <div className={`a-s0-content ${step > 0 ? 'a-show' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='a-paper-card'>
            <div className='a-paper-body'>
              "2024年，深度求索发布了新一代大语言模型 DeepSeek-V3。为突破长上下文推理的内存瓶颈，
              <span className={`a-hl-base ${step === 2 || step >= 6 ? 'a-hl-k-active' : ''}`}>该模型全面采用了
                <strong className={`a-hl-base ${step === 3 || step >= 7 ? 'a-hl-v-active' : ''}`}>多头潜在注意力（MLA）</strong>架构。
              </span>
              测试表明，DeepSeek-V3 在数学和代码能力上全面对标顶尖闭源模型，同时保持了极高的训练效率。"
            </div>
            <div style={{ borderTop: '1px dashed rgba(15,23,42,.1)', margin: '25px 0' }} />
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--a1)', fontWeight: 700, marginBottom: '10px', fontSize: '1rem' }}>Q: 用户提问</div>
            <div className='a-paper-q-body'>
              <span className={`a-hl-base ${step === 1 || step >= 5 ? 'a-hl-q-active' : ''}`}>DeepSeek-V3 解决显存瓶颈的架构是什么？</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className={`a-fade-panel ${step >= 4 ? 'a-hidden-panel' : ''}`}>
            <h3 className='a-step-title'>人类认知本能：目标导向</h3>
            <div className='a-step-list'>
              <div className={`a-step-item ${step === 1 ? 'a-item-active a-q-mode' : ''}`}><span className='a-step-num'>01</span><span className='a-step-text'>阅读问题，建立寻找目标（Query）。</span></div>
              <div className={`a-step-item ${step === 2 ? 'a-item-active a-k-mode' : ''}`}><span className='a-step-num'>02</span><span className='a-step-text'>扫读原文，定位匹配特征（Key）。</span></div>
              <div className={`a-step-item ${step === 3 ? 'a-item-active a-v-mode' : ''}`}><span className='a-step-num'>03</span><span className='a-step-text'>锁定线索，提取核心实体（Value）。</span></div>
            </div>
          </div>

          <div className={`a-fade-panel ${step < 4 ? 'a-hidden-panel' : ''}`}>
            <div style={{ opacity: step >= 5 ? 1 : 0, transition: 'opacity .5s' }}>
              <h3 className='a-step-title' style={{ color: 'var(--muted)', fontFamily: 'var(--mono)' }}>机器注意力：高维映射</h3>
              <div className='a-step-list'>
                <div className={`a-step-item ${step >= 5 ? 'a-item-active a-q-mode' : ''}`} style={{ padding: '10px 16px' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 700, color: 'var(--Q)', fontSize: '1.05rem', marginBottom: '2px', fontFamily: 'var(--mono)' }}>Query (Q)</div>
                    <div className='a-step-text' style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>「我要找什么信息？」</div>
                  </div>
                </div>
                <div className={`a-step-item ${step >= 6 ? 'a-item-active a-k-mode' : ''}`} style={{ padding: '10px 16px' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 700, color: 'var(--K)', fontSize: '1.05rem', marginBottom: '2px', fontFamily: 'var(--mono)' }}>Key (K)</div>
                    <div className='a-step-text' style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>「我有什么特征？」</div>
                  </div>
                </div>
                <div className={`a-step-item ${step >= 7 ? 'a-item-active a-v-mode' : ''}`} style={{ padding: '10px 16px' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 700, color: 'var(--V)', fontSize: '1.05rem', marginBottom: '2px', fontFamily: 'var(--mono)' }}>Value (V)</div>
                    <div className='a-step-text' style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>「我能提供的内容。」</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Slide 1: 张量化
// ============================================================
const Slide1 = ({ step }: { step: number }) => {
  return (
    <div className='a-slide a-active' id='a-s1'>
      <div className='a-s1-header' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto', opacity: step >= 1 ? 1 : 0, transition: 'all 0.8s var(--spring)', transform: step >= 1 ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className='a-eyebrow'>PRE-COMPUTATION</div>
        <h1 className='a-display-title'>驶入矩阵前：<span className='a-grad'>文本的张量化</span></h1>
        <p style={{ fontSize: 'clamp(0.9rem,1.3vw,1.3rem)', color: 'var(--muted)', lineHeight: '1.6' }}>我们以序列 <strong style={{ color: 'var(--ink)' }}>"有一只小猫"</strong> 为例，计算机如何理解？</p>
      </div>
      <div className='a-s1-body'>
        <div className={`a-s1-card ${step >= 2 ? 'a-active' : ''}`}>
          <h3 className='a-s1-h'>Tokenization</h3><div className='a-s1-sub'>离散切分</div>
          <div className='a-tensor-box'><span className='a-tensor-label'>Text</span>"有一只小猫"</div>
          <div className='a-arr-down'>↓</div>
          <div className='a-tensor-box a-highlight a-hl-blue'><span className='a-tensor-label'>Token IDs</span>[ 15, 23, 89, 44, 91 ]</div>
          <div className="a-s1-detail" style={{marginTop:'10px', fontSize:'0.85rem', color:'var(--desc)'}}>将句子切分为词元(Token)并分配对应ID，是语言数字化的最小单位。</div>
        </div>
        <div className={`a-s1-card ${step >= 3 ? 'a-active' : ''}`}>
          <h3 className='a-s1-h'>Embedding</h3><div className='a-s1-sub'>查表获取语义向量</div>
          <div className='a-tensor-box'><span className='a-tensor-label'>Input</span>IDs</div>
          <div className='a-arr-down'>× W_emb (权重表) ↓</div>
          <div className='a-tensor-box a-highlight a-hl-purple' style={{ fontFamily: "'Times New Roman',serif", fontStyle: 'italic', fontSize: 'clamp(.9rem,1.2vw,1.5rem)' }}>
            <span className='a-tensor-label'>Word Matrix</span>X ∈ ℝ⁵ˣᵈ
          </div>
          <div className="a-s1-detail" style={{marginTop:'10px', fontSize:'0.85rem', color:'var(--desc)'}}>通过映射矩阵赋予离散词元高维连续空间的数学语义。</div>
        </div>
        <div className={`a-s1-card ${step >= 4 ? 'a-active' : ''}`}>
          <h3 className='a-s1-h'>Positional Enc</h3><div className='a-s1-sub'>注入时序位置信息</div>
          <div className='a-tensor-box'><span className='a-tensor-label'>Context</span>X</div>
          <div className='a-arr-down'>+ P_E (sin/cos编码) ↓</div>
          <div className='a-tensor-box a-highlight a-hl-dark' style={{ fontFamily: "'Times New Roman',serif", fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.8rem)' }}>
            <span className='a-tensor-label'>Final Tensor</span>X ∈ ℝ⁵ˣᵈ
          </div>
          <div className="a-s1-detail" style={{marginTop:'10px', fontSize:'0.85rem', color:'var(--desc)'}}>引入位置编码信号保留人类语言中语法先后构成的时序图谱。</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 矩阵单元格组件
// ============================================================
const MatrixCells = ({ matrixStep }: { matrixStep: number }) => {
  const isScaled = matrixStep === 0;
  const isSoftmax = matrixStep === 1;
  const isOutput = matrixStep === 2;     // 步骤5: 加权输出 O
  const isResidual = matrixStep === 3;  // 步骤6: 残差链接 O'
  const COLS = 5;

  const getCell = (r: number, c: number) => {
    if (isOutput) {
      const v = ORaw[r][c];
      return { val: v.toFixed(2), cls: v > 0.7 ? 'a-softmax-hl' : '' };
    }
    if (isResidual) {
      const v = ORawPrime[r][c];
      return { val: v.toFixed(2), cls: v > 1.2 ? 'a-softmax-hl' : '' };
    }
    if (isSoftmax) {
      const v = SRaw[r][c];
      return { val: v.toFixed(2), cls: v > 0.4 ? 'a-softmax-hl' : '' };
    }
    if (isScaled) {
      const v = MRaw[r][c] / 2;
      return { val: v.toFixed(1), cls: v > 5 ? 'a-hl-cross' : 'a-hl-row' };
    }
    const v = MRaw[r][c];
    return { val: v.toFixed(1), cls: v > 10 ? 'a-hl-cross' : 'a-hl-row' };
  };

  // 残差链接步骤：显示 O' 结果矩阵（4×2）
  if (isResidual) {
    return (
      <>
        <div className='a-m-cell a-header a-show-cell' style={{borderBottom:'2px solid rgba(16,185,129,.3)'}}/>
        {['d₁', 'd₂'].map((v,i)=>(
          <div key={i} className='a-m-cell a-header a-show-cell' style={{color:'var(--a3)'}}>
            <span className='a-token-tag' style={{background:'rgba(16,185,129,.1)',borderColor:'rgba(16,185,129,.3)',color:'var(--a3)'}}>{v}</span>
          </div>
        ))}
        {['它','好','可','爱'].map((ch,r)=>(
          <React.Fragment key={ch}>
            <div className='a-m-cell a-header a-show-cell' style={{justifyContent:'flex-end'}}>
              <span className={`a-token-tag a-q-tag`}>{ch}</span>
            </div>
            {Array.from({length: 2},(_,c)=>{
              const info = getCell(r, c);
              return (
                <motion.div
                  key={`${r}-${c}`}
                  className={`a-m-cell a-val ${info ? info.cls : ''}`}
                  initial={false}
                  animate='visible'
                  variants={cellVars}
                  style={{ borderColor:'rgba(16,185,129,.2)' }}
                >
                  {info ? info.val : ''}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </>
    );
  }

  // 加权输出步骤：显示 O 结果矩阵（4×2）
  if (isOutput) {
    return (
      <>
        <div className='a-m-cell a-header a-show-cell' style={{borderBottom:'2px solid rgba(225,29,72,.3)'}}/>
        {['d₁', 'd₂'].map((v,i)=>(
          <div key={i} className='a-m-cell a-header a-show-cell' style={{color:'var(--V)'}}>
            <span className='a-token-tag' style={{background:'rgba(225,29,72,.1)',borderColor:'rgba(225,29,72,.3)',color:'var(--V)'}}>{v}</span>
          </div>
        ))}
        {['它','好','可','爱'].map((ch,r)=>(
          <React.Fragment key={ch}>
            <div className='a-m-cell a-header a-show-cell' style={{justifyContent:'flex-end'}}>
              <span className={`a-token-tag a-q-tag`}>{ch}</span>
            </div>
            {Array.from({length: 2},(_,c)=>{
              const info = getCell(r, c);
              return (
                <motion.div
                  key={`${r}-${c}`}
                  className={`a-m-cell a-val ${info ? info.cls : ''}`}
                  initial={false}
                  animate='visible'
                  variants={cellVars}
                  style={{ borderColor:'rgba(225,29,72,.2)' }}
                >
                  {info ? info.val : ''}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </>
    );
  }

  // 其他步骤：显示 4×5 矩阵
  return (
    <>
      <div className='a-m-cell a-header a-show-cell'/>
      {['有','一','只','小','猫'].map((v,i)=>(
        <div key={i} className='a-m-cell a-header a-show-cell'>
          <span className='a-token-tag a-k-tag'>{v}</span>
        </div>
      ))}
      {['它','好','可','爱'].map((ch,r)=>(
        <React.Fragment key={ch}>
          <div className='a-m-cell a-header a-show-cell' style={{justifyContent:'flex-end'}}>
            <span className={`a-token-tag a-q-tag a-hl-active`}>{ch}</span>
          </div>
          {Array.from({length: COLS},(_,c)=>{
            const info = getCell(r, c);
            return (
              <motion.div
                key={`${r}-${c}`}
                className={`a-m-cell a-val ${info ? info.cls : ''}`}
                initial={false}
                animate='visible'
                variants={cellVars}
              >
                {info ? info.val : ''}
              </motion.div>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

// ============================================================
// 左侧矩阵运算可视化组件
// ============================================================
const MatMulFigureViz = ({ matrixStep }: { matrixStep: number }) => {
  const flowPulse = { opacity: [0.72, 1, 0.72], transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' as const } };
  const scalePulse = { scale: [1, 1.06, 1], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const } };

  // matrixStep: -1=step3 Q·Kᵀ, 0=step4 缩放, 1=step5 归一化, 2=step6 加权输出, 3=step7 残差链接

  // 步骤3: Q · Kᵀ 图解
  if (matrixStep === -1) {
    return (
      <div className='a-mviz a-mviz--mat'>
        <div className='a-mviz-flow-single'>
          <motion.div
            key='dot'
            className='a-mviz-stage-card a-mviz-stage-card--on'
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.4, 1] }}
          >
            <div className='a-mviz-stage-h'>① Q · Kᵀ → 4×5 得分矩阵</div>
            <div className='a-mviz-mini-mul'>
              <motion.div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--q'>
                <span className='a-mviz-mat-lbl'>Q</span>
                <div className='a-mviz-grid a-mviz-grid--4x2'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.span key={i} className='a-mviz-cell a-mviz-cell--q' animate={{ scale: [1, 1.18, 1], opacity: [1, 0.8, 1] }} transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.09 }} />
                  ))}
                </div>
                <span className='a-mviz-dim'>4×d</span>
              </motion.div>
              <motion.span className='a-mviz-times a-mviz-times--lg' animate={flowPulse}>×</motion.span>
              <motion.div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--k'>
                <span className='a-mviz-mat-lbl'>Kᵀ</span>
                <div className='a-mviz-grid a-mviz-grid--2x5'>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.span key={i} className='a-mviz-cell a-mviz-cell--k' animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.06 }} />
                  ))}
                </div>
                <span className='a-mviz-dim'>d×5</span>
              </motion.div>
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
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className='a-mviz a-mviz--mat'>
      <div className='a-mviz-flow-single'>
        <AnimatePresence mode='wait'>

          {/* 步骤4: ÷ √dₖ 缩放 */}
          {matrixStep === 0 && (
            <motion.div
              key='scale'
              className='a-mviz-stage-card a-mviz-stage-card--on'
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.4, 1] }}
            >
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
            </motion.div>
          )}

          {/* 步骤5: softmax 归一化 */}
          {matrixStep === 1 && (
            <motion.div
              key='softmax'
              className='a-mviz-stage-card a-mviz-stage-card--on'
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.4, 1] }}
            >
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
            </motion.div>
          )}

          {/* 步骤6: α · V → O 加权输出 */}
          {matrixStep === 2 && (
            <motion.div
              key='output'
              className='a-mviz-stage-card a-mviz-stage-card--on'
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.4, 1] }}
            >
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
            </motion.div>
          )}

          {/* 步骤7: O + X_pos → O' 残差链接 */}
          {matrixStep === 3 && (
            <motion.div
              key='residual'
              className='a-mviz-stage-card a-mviz-stage-card--on'
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.4, 1] }}
            >
              <div className='a-mviz-stage-h'>O + X<sub>pos</sub> → O′ 残差链接</div>
              <div className='a-mviz-mini-mul'>
                <motion.div className='a-mviz-mat a-mviz-mat--tiny' animate={{ x: [0, -4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  <span className='a-mviz-mat-lbl'>O</span>
                  <div className='a-mviz-grid a-mviz-grid--4x2'>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.span key={i} className='a-mviz-cell a-mviz-cell--o' animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.05 }} />
                    ))}
                  </div>
                  <span className='a-mviz-dim'>4×d</span>
                </motion.div>
                <motion.span className='a-mviz-plus' animate={{ color: ['#94a3b8', '#10b981', '#94a3b8'] }} transition={{ duration: 1.4, repeat: Infinity }}>+</motion.span>
                <motion.div className='a-mviz-mat a-mviz-mat--tiny' animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  <span className='a-mviz-mat-lbl'>X<sub>pos</sub></span>
                  <div className='a-mviz-grid a-mviz-grid--4x2'>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.span key={i} className='a-mviz-cell a-mviz-cell--res' animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.04 }} />
                    ))}
                  </div>
                  <span className='a-mviz-dim'>4×d</span>
                </motion.div>
                <span className='a-mviz-eq'>=</span>
                <motion.div className='a-mviz-mat a-mviz-mat--tiny a-mviz-mat--o' animate={scalePulse}>
                  <span className='a-mviz-mat-lbl'>O′</span>
                  <div className='a-mviz-grid a-mviz-grid--4x2'>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.span key={i} className='a-mviz-cell a-mviz-cell--o' animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.06 }} />
                    ))}
                  </div>
                  <span className='a-mviz-dim'>4×d</span>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================================
// 张量化卡片组件
// ============================================================
const TensorizeCard = ({ tokens, resultMat, resultDim, side, delay }: {
  tokens: readonly string[];
  resultMat: string;
  resultDim: string;
  side: 'a' | 'b';
  delay: number;
}) => (
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

// ============================================================
// Slide 2: Attention 运算推演
// ============================================================
const Slide2 = ({ step, projStep }: { step: number; projStep: number }) => {
  // matrixStep: -1=step3 Q·Kᵀ, 0=step4 缩放, 1=step5 归一化, 2=step6 加权输出, 3=step7 残差链接
  const matrixStep = step > S2_MATRIX_BASE ? step - S2_MATRIX_BASE - 1 : -1;
  const SEQ_A = ['它', '好', '可', '爱'] as const;
  const SEQ_B = ['有', '一', '只', '小', '猫'] as const;

  // 获取右侧矩阵列数
  const getMatrixCols = () => {
    if (matrixStep === 2 || matrixStep === 3) return 2; // O 和 O' 矩阵是 4×2
    return 5;
  };

  // 获取底部说明文字
  const getFooterText = () => {
    if (step === S2_PROJ_STEP) {
      if (projStep < 2) return <><strong>Q</strong>（Query）代表「我要问什么」——A 侧每个词向量经训练好的权重 <strong>W<sub>Q</sub></strong> 投影后生成。</>;
      if (projStep >= 2 && projStep < 3) return <><strong>K</strong>（Key）代表「我有什么特征」——B 侧词向量经 <strong>W<sub>K</sub></strong> 投影。Q 与 Kᵀ 的点积将衡量 A 中每个词与 B 中每个词的相关程度。</>;
      return <><strong>V</strong>（Value）代表「我能提供什么内容」——经 <strong>W<sub>V</sub></strong> 投影，B 侧的原始语义被重新编码，等待被 <strong>α</strong> 加权后输出。</>;
    }
    if (step === S2_MATRIX_BASE + 3) return <>加权求和得到 <i>O</i>——每个词经 Attention 后的<strong>新向量表示</strong>，携带了目标侧最相关的语义信息。<i>O</i> 可作为<strong>下一层 Transformer</strong> 的输入，继续深度推理。</>;
    if (step === S2_MATRIX_BASE + 4) return <>残差连接将注意力输出 <i>O</i> 与输入 <i>X<sub>pos</sub></i> 相加，帮助梯度流动，使深层网络训练更稳定。</>;
    if (step >= S2_MATRIX_BASE) {
      if (step === S2_MATRIX_BASE) return <>A 侧 4 个词与 B 侧 5 个词做<strong>点积</strong>，得到 4×5 相似度矩阵。数值越大代表越相关，蓝色格点为相对得分最高区域。</>;
      if (step === S2_MATRIX_BASE + 1) return <>所有得分<strong>除以 √d<sub>k</sub></strong>（d 为向量维度）。防止 d 较大时点积值过大，导致 Softmax 梯度趋于零，利于训练稳定。</>;
      if (step === S2_MATRIX_BASE + 2) return <>每行经 <strong>Softmax</strong> 归一化（行和为 1），转化为<strong>概率 α</strong>。<strong>O = α · V</strong> 将作为<strong>下一层的输入</strong>，持续聚合语义。</>;
    }
    if (step === 0) return <>两侧<strong>原始序列</strong>已就位。下一步<strong>「张量化」</strong>将一步完成符号→向量的映射。</>;
    if (step === 1) return <><strong>张量化</strong>：将离散字词一步映射为高维连续向量，堆叠为词矩阵<strong>X<sub>A</sub></strong>（4×d）与 <strong>X<sub>B</sub></strong>（5×d）。</>;
    return null;
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
            <span className={`a-s2-gp${step >= S2_MATRIX_BASE ? ' vis hl-op' : ''}`}>softmax(</span>
            <div className={`a-s2-frac${step >= S2_PROJ_STEP + 1 ? ' vis-top' : ''} ${step >= S2_MATRIX_BASE ? 'vis-bot' : ''}`}>
              <div className='a-top'>
                <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis hl-q' : ''}`}>Q</span>
                <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis' : ''}`} style={{ margin: '0 4px' }}>·</span>
                <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis hl-k' : ''}`}>Kᵀ</span>
              </div>
              <div className='a-bot'>√d_k</div>
            </div>
            <span className={`a-s2-gp${step >= S2_MATRIX_BASE ? ' vis hl-op' : ''}`}>)</span>
            <span className={`a-s2-gp${step >= S2_PROJ_STEP ? ' vis hl-v' : ''}`}>V</span>
          </div>
        </div>

        {/* 左侧: 步骤列表 */}
        <div className='a-s2-g-steps'>
          <div className='a-s2-steps'>
            <div className={`a-s2-step ${step <= 1 ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>0. 序列与张量化</div>
              <div className='a-s2-step-desc'>A、B 序列就位后，经<strong>张量化</strong>一步转换为词矩阵。</div>
            </div>
            <div className={`a-s2-step ${step === S2_PROJ_STEP ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>1. 特征跨域投影</div>
              <div className='a-s2-step-desc'><i>X<sub>A</sub></i> <i>W<sub>Q</sub></i> → <i>Q</i>；<i>X<sub>B</sub></i> <i>W<sub>K</sub></i> → <i>K</i>，<i>X<sub>B</sub></i> <i>W<sub>V</sub></i> → <i>V</i>。</div>
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
            <div className={`a-s2-step ${step === S2_MATRIX_BASE + 4 ? 'a-active' : ''}`}>
              <div className='a-s2-step-title'>6. 残差链接</div>
              <div className='a-s2-step-desc'>O + X<sub>pos</sub> → O′，帮助梯度流动，使深层网络训练更稳定。</div>
            </div>
          </div>
        </div>

        {/* 右侧: 运算区域 */}
        <div className='a-s2-g-stage'>
          <div className='a-s2-stage' style={{ flex: 1, position: 'relative', minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

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

            {/* 步骤 2: 投影阶段 */}
            <div className={`a-mat-view ${step === S2_PROJ_STEP ? 'a-active' : ''}`}>
              <div className='a-s2-proj-stage'>
                <div className='a-s2-stage-main'>
                  <div className='a-s2-proj-flow'>
                    {/* A 侧: X_A × W_Q → Q */}
                    <div className='a-s2-proj-block'>
                      <div className='a-s2-proj-block-lbl'>
                        <motion.span className='a-s2-proj-block-tag' style={{ background:'rgba(2,132,199,.1)', color:'var(--Q)', borderColor:'rgba(2,132,199,.25)' }} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05, duration:0.35 }}>A 侧 → Query</motion.span>
                      </div>
                      <div className='a-s2-proj-mat-row'>
                        <motion.div className='a-s2-proj-xbox' initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1, duration:0.4 }}>
                          <div className='a-s2-proj-xmat'><div className='a-s2-proj-xmat-lbl'>X<sub>A</sub></div><div className='a-s2-proj-xmat-grid'>{[...Array(16)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.12+i*0.015, duration:0.2 }}/>)}</div><div className='a-s2-proj-xmat-dim'>4 × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-op' initial={{ opacity:0 }} animate={{ opacity:projStep>=1?1:0 }}>×</motion.span>
                        <motion.div className='a-s2-proj-wbox' initial={{ opacity:0, scale:0.7 }} animate={{ opacity:projStep>=1?1:0, scale:projStep>=1?1:0.7 }} style={{ opacity:projStep>=1?1:0, transform:projStep>=1?'none':'scale(0.7)' }}>
                          <div className='a-s2-proj-wmat'><div className='a-s2-proj-wmat-lbl'>W<sub>Q</sub></div><div className='a-s2-proj-wmat-grid'>{[...Array(12)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-wmat-dim'>d × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-eq-sym' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:projStep>=1?1:0, scale:projStep>=1?1:0.5 }}>=</motion.span>
                        <motion.div className='a-s2-proj-resbox' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:projStep>=1?1:0, scale:projStep>=1?1:0.5 }} style={{ opacity:projStep>=1?1:0, transform:projStep>=1?'none':'scale(0.5)' }}>
                          <div className='a-s2-proj-resmat' style={{ borderColor:'rgba(2,132,199,.3)', background:'rgba(2,132,199,.06)' }}><div className='a-s2-proj-resmat-lbl' style={{ color:'var(--Q)' }}>Q</div><div className='a-s2-proj-resmat-grid'>{[...Array(16)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-resmat-dim'>4 × d</div></div>
                        </motion.div>
                      </div>
                    </div>

                    {/* B 侧: X_B × W_K → K, X_B × W_V → V */}
                    <div className='a-s2-proj-block'>
                      <div className='a-s2-proj-block-lbl'>
                        <motion.span className='a-s2-proj-block-tag' style={{ background:'rgba(5,150,105,.1)', color:'var(--K)', borderColor:'rgba(5,150,105,.25)' }} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.35 }}>B 侧 → Key & Value</motion.span>
                      </div>
                      <div className='a-s2-proj-bx-row'>
                        <motion.div className='a-s2-proj-xbox' initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.35, duration:0.4 }}>
                          <div className='a-s2-proj-xmat'><div className='a-s2-proj-xmat-lbl'>X<sub>B</sub></div><div className='a-s2-proj-xmat-grid'>{[...Array(25)].map((_,i)=><motion.span key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.37+i*0.01, duration:0.2 }}/>)}</div><div className='a-s2-proj-xmat-dim'>5 × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-op' initial={{ opacity:0 }} animate={{ opacity:projStep>=2?1:0 }}>×</motion.span>
                        <motion.div className='a-s2-proj-wbox' initial={{ opacity:0, scale:0.6 }} animate={{ opacity:projStep>=2?1:0, scale:projStep>=2?1:0.6 }} style={{ opacity:projStep>=2?1:0, transform:projStep>=2?'none':'scale(0.6)' }}>
                          <div className='a-s2-proj-wmat'><div className='a-s2-proj-wmat-lbl'>W<sub>K</sub></div><div className='a-s2-proj-wmat-grid'>{[...Array(12)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-wmat-dim'>d × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-eq-sym' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:projStep>=2?1:0, scale:projStep>=2?1:0.5 }}>=</motion.span>
                        <motion.div className='a-s2-proj-resbox' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:projStep>=2?1:0, scale:projStep>=2?1:0.5 }} style={{ opacity:projStep>=2?1:0, transform:projStep>=2?'none':'scale(0.5)' }}>
                          <div className='a-s2-proj-resmat' style={{ borderColor:'rgba(5,150,105,.3)', background:'rgba(5,150,105,.06)' }}><div className='a-s2-proj-resmat-lbl' style={{ color:'var(--K)' }}>K</div><div className='a-s2-proj-resmat-grid'>{[...Array(25)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-resmat-dim'>5 × d</div></div>
                        </motion.div>
                        <motion.div className='a-s2-proj-or' aria-hidden initial={{ opacity:0 }} animate={{ opacity:projStep>=3?0.7:0 }}>|</motion.div>
                        <motion.span className='a-s2-proj-op' initial={{ opacity:0 }} animate={{ opacity:projStep>=3?1:0 }}>×</motion.span>
                        <motion.div className='a-s2-proj-wbox' initial={{ opacity:0, scale:0.6 }} animate={{ opacity:projStep>=3?1:0, scale:projStep>=3?1:0.6 }} style={{ opacity:projStep>=3?1:0, transform:projStep>=3?'none':'scale(0.6)' }}>
                          <div className='a-s2-proj-wmat'><div className='a-s2-proj-wmat-lbl'>W<sub>V</sub></div><div className='a-s2-proj-wmat-grid'>{[...Array(12)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-wmat-dim'>d × d</div></div>
                        </motion.div>
                        <motion.span className='a-s2-proj-eq-sym' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:projStep>=3?1:0, scale:projStep>=3?1:0.5 }}>=</motion.span>
                        <motion.div className='a-s2-proj-resbox' initial={{ opacity:0, scale:0.5 }} animate={{ opacity:projStep>=3?1:0, scale:projStep>=3?1:0.5 }} style={{ opacity:projStep>=3?1:0, transform:projStep>=3?'none':'scale(0.5)' }}>
                          <div className='a-s2-proj-resmat' style={{ borderColor:'rgba(225,29,72,.3)', background:'rgba(225,29,72,.06)' }}><div className='a-s2-proj-resmat-lbl' style={{ color:'var(--V)' }}>V</div><div className='a-s2-proj-resmat-grid'>{[...Array(25)].map((_,i)=><span key={i}/>)}</div><div className='a-s2-proj-resmat-dim'>5 × d</div></div>
                        </motion.div>
                      </div>
                    </div>

                    {/* 汇总提示 */}
                    <motion.div className='a-s2-proj-summary' initial={{ opacity:0, y:12 }} animate={{ opacity:projStep>=4?1:0, y:projStep>=4?0:12 }} style={{ opacity:projStep>=4?1:0, transform:`translateY(${projStep>=4?0:12}px)` }}>
                      <div className='a-s2-proj-summary-box'>
                        <span style={{ color:'var(--Q)', fontFamily:'var(--mono)', fontWeight:700 }}>Q</span>
                        <span style={{ color:'var(--muted)' }}> × </span>
                        <span style={{ color:'var(--K)', fontFamily:'var(--mono)', fontWeight:700 }}>Kᵀ</span>
                        <span style={{ color:'var(--muted)' }}> × </span>
                        <span style={{ color:'var(--V)', fontFamily:'var(--mono)', fontWeight:700 }}>V</span>
                        <span style={{ color:'var(--muted)', marginLeft:8 }}>→ softmax(QKᵀ/√d_k) V</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* 步骤 3-7: 矩阵运算 */}
            <div className={`a-mat-view ${step >= S2_MATRIX_BASE ? 'a-active' : ''}`}>
              <div className='a-s2-dot-stage'>
                <div className='a-s2-dot-split'>
                  <MatMulFigureViz matrixStep={matrixStep} />
                  <div className='a-s2-dot-detail'>
                    <motion.div key={matrixStep} className='a-s2-dot-main' initial={{ opacity: 0, x: 18, filter: 'blur(4px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5 }}>
                      <div className='a-matrix-wrap a-matrix-wrap-wide a-matrix-wrap--split' style={{ gridTemplateColumns: `auto repeat(${getMatrixCols()},clamp(44px,5vw,88px))` }}>
                        <MatrixCells matrixStep={matrixStep} />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部说明栏: 仅在右侧 */}
        <footer className='a-s2-derive-foot'>
          <p className='a-s2-derive-foot-text'>{getFooterText()}</p>
        </footer>
      </div>
    </div>
  );
};

// ============================================================
// Slide 3: 自注意力与多头
// ============================================================
const SABase = [[0.6,0.2,0.05,0.05,0.05,0.05],[0.1,0.5,0.2,0.1,0.05,0.05],[0.05,0.15,0.5,0.15,0.05,0.1],[0.05,0.05,0.6,0.2,0.05,0.05],[0.05,0.05,0.1,0.1,0.6,0.1],[0.05,0.05,0.5,0.1,0.1,0.2]];
const SAH1 = [[0.2,0.2,0.2,0.2,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1],[0.1,0.1,0.3,0.3,0.1,0.1],[0,0,0.9,0.1,0,0],[0.2,0.2,0.2,0.2,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1]];
const SAH2 = [[0.2,0.2,0.2,0.2,0.1,0.1],[0.05,0.15,0.7,0.05,0.05,0],[0.1,0.1,0.3,0.3,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1]];
const SAH3 = [[0.2,0.2,0.2,0.2,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1],[0.1,0.1,0.3,0.3,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1],[0.2,0.2,0.2,0.2,0.1,0.1],[0,0,0.85,0,0.1,0.05]];

const Slide3 = ({ step }: { step: number }) => {
  const getM = () => {
    if(step===3) return {d:SAH1, r:3, c:2, cl:'a-hl-color-1', id:1};
    if(step===4) return {d:SAH2, r:1, c:2, cl:'a-hl-color-2', id:2};
    if(step===5) return {d:SAH3, r:5, c:2, cl:'a-hl-color-3', id:3};
    if(step===6) return {d:SABase, r:3, c:2, cl:'a-hl-color-1', id:4};
    return {d:SABase, r:-1, c:-1, cl:'', id:0};
  };
  const { d, r:hR, c:hC, cl, id } = getM();
  const words = ['有','一只','小猫','它','好','可爱'];

  return (
    <div className='a-slide a-active' id='a-s3'>
      <div className='a-s3-layout a-show'>
        <div className='a-eyebrow'>The Paradigm</div>
        <h2 className='a-display-title' style={{textAlign:'center',marginBottom:0}}>大一统模型基石：<span className='a-grad'>自注意力与多头协同</span></h2>
        
        <div className='a-s3-grid'>
          <div className='a-s3-panel'>
            <div className='a-s3-p-title'><span style={{width:16,height:16,background:'var(--ink)',borderRadius:4,display:'inline-block'}}/>Self-Attention</div>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <Latex>{`$$ \\text{Attn}(Q,K,V) = \\text{softmax}(\\frac{QK^T}{\\sqrt{d_k}})V $$`}</Latex>
            </div>
            <p style={{textAlign:'center',color:'var(--muted)',marginBottom:10,fontSize:'clamp(0.7rem,1vw,1.15rem)'}}>
              合并单句：<strong>"有 一只 小猫 它 好 可爱"</strong>产生全局矩阵。
            </p>
            <div className={`a-sa-matrix-wrap ${step>=1?'a-show':''}`}>
              <div className='a-sa-cell a-header'/>
              {words.map((w,i)=><div key={i} className='a-sa-cell a-header'>{w}</div>)}
              {words.map((rW, rr)=>(
                <React.Fragment key={rr}>
                  <div className='a-sa-cell a-header' style={{justifyContent:'flex-end',color:id>0&&rr===hR?(id===1?'var(--Q)':id===2?'var(--K)':'var(--V)'):'var(--muted)'}}>{rW}</div>
                  {words.map((_, cc)=>{
                    const v = d[rr][cc];
                    const hl = rr===hR && cc===hC;
                    return <div key={`${rr}-${cc}`} className={`a-sa-cell a-val a-show-cell ${hl?'a-hl '+cl:''}`} style={{background:hl?undefined:(v>0.4?`rgba(15,23,42,${v*0.4})`:'#f8fafc')}}>{v.toFixed(2)}</div>
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='a-s3-panel'>
            <div className='a-s3-p-title' style={{color:'var(--a2)'}}><span style={{width:16,height:16,background:'var(--a2)',borderRadius:4,display:'inline-block'}}/>Multi-Head</div>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <Latex>{`$$ \\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O $$`}</Latex>
            </div>
            <p style={{textAlign:'center',color:'var(--muted)',marginBottom:10}}>特征投射至多个低维子空间：</p>
            <div className='a-mh-stage'>
              <div className={`a-mh-head ${step>=2?'a-show':''} ${id===1?'a-focus':''}`} style={id!==1?{}:{borderLeftColor:'var(--Q)'}}><div className='a-mh-title' style={{color:id===1?'var(--Q)':undefined}}>Head 1: 倾向指代关联</div><div className='a-mh-conn' style={{background:id===1?'rgba(2,132,199,.1)':undefined}}>它 ➜ 小猫</div></div>
              <div className={`a-mh-head ${step>=2?'a-show':''} ${id===2?'a-focus':''}`} style={id!==2?{}:{borderLeftColor:'var(--K)'}}><div className='a-mh-title' style={{color:id===2?'var(--K)':undefined}}>Head 2: 倾向数量修饰</div><div className='a-mh-conn' style={{background:id===2?'rgba(5,150,105,.1)':undefined}}>一只 ➜ 小猫</div></div>
              <div className={`a-mh-head ${step>=2?'a-show':''} ${id===3?'a-focus':''}`} style={id!==3?{}:{borderLeftColor:'var(--V)'}}><div className='a-mh-title' style={{color:id===3?'var(--V)':undefined}}>Head 3: 倾向情感属性</div><div className='a-mh-conn' style={{background:id===3?'rgba(225,29,72,.1)':undefined}}>可爱 ➜ 小猫</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 主组件
// ============================================================
export default function AttentionChapter({
  showHints, onRequestChapterNav, requestedPageIndex = 0, onPageChange
}: ChapterComponentProps) {
  const [page, setPage] = useState(requestedPageIndex);
  const [step, setStep] = useState(0);
  const [projStep, setProjStep] = useState(0);
  const prevStepRef = useRef(0);

  useEffect(() => {
    if (page !== 2) setProjStep(0);
  }, [page]);

  useEffect(() => {
    if (page === 2 && step === S2_PROJ_STEP && prevStepRef.current === S2_PROJ_STEP - 1) {
      setProjStep(0);
    }
    prevStepRef.current = step;
  }, [page, step]);

  const getWatermarkText = () => {
    if (page === 1) {
      if (step === 1) return 'Tokenization';
      if (step === 2) return 'Embedding Matrix / High Dimensional Space';
      if (step >= 3) return 'Positional Encoding (Sin/Cos)';
    } else if (page === 2) {
      if (step <= 1) return 'Sequence A / B → Tensorization → X_A, X_B';
      if (step === S2_PROJ_STEP) return 'Cross-Attention Projection Q, K, V';
      if (step === S2_MATRIX_BASE) return 'Inner Product Q·Kᵀ';
      if (step === S2_MATRIX_BASE + 1) return 'Scaled logits / √d_k';
      if (step === S2_MATRIX_BASE + 2) return 'Softmax → probability α';
      if (step === S2_MATRIX_BASE + 3) return 'Attention Weighted Output (α·V)';
      if (step === S2_MATRIX_BASE + 4) return 'Residual Connection (O + X_pos → O′)';
    } else if (page === 3) {
      return 'Self-Attention / Multi-Head Paradigm';
    }
    return 'Attention Mechanism';
  };

  useEffect(() => { setPage(requestedPageIndex); setStep(0); }, [requestedPageIndex]);
  useEffect(() => { onPageChange?.(page); }, [onPageChange, page]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    particlesRef.current = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx; 
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148, 163, 184, 0.15)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
          if (distSq < 15000) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${(15000 - distSq) / 15000 * 0.1})`;
            ctx.stroke();
          }
        }
      }
      requestRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const advance = useCallback(() => {
    if (page === 2 && step === S2_PROJ_STEP && projStep < S2_PROJ_SUBSTEPS_MAX) {
      setProjStep(p => p + 1);
      return;
    }
    if (step < STEPS[page] - 1) setStep(s => s + 1);
    else if (page < PAGE_COUNT - 1) { setPage(p => p + 1); setStep(0); }
    else onRequestChapterNav();
  }, [page, step, projStep, onRequestChapterNav]);

  const retreat = useCallback(() => {
    if (page === 2 && step === S2_PROJ_STEP && projStep > 0) {
      setProjStep(p => p - 1);
      return;
    }
    if (step > 0) setStep(s => s - 1);
    else if (page > 0) { setPage(p => p - 1); setStep(STEPS[page - 1] - 1); }
  }, [page, step, projStep]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(); }
      if(e.key === 'ArrowLeft') { e.preventDefault(); retreat(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advance, retreat]);

  return (
    <div className="tl-root">
      <div className="attention-grid-bg" />
      <div className="ambient-glow" id="glow-nlp"></div>
      <div className="ambient-glow" id="glow-cv"></div>
      <canvas ref={canvasRef} className="tl-canvas" />

      <div className='a-s1-watermark' style={{ opacity: (page === 1 || page === 2 || page === 3) ? 0.06 : 0, position: 'fixed' }}>
        <span style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.06), rgba(15,23,42,0.03))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>{getWatermarkText()}</span>
      </div>

      <div className={`a-global-header ${(page === 0 && step === 0) ? 'is-centered' : ''}`} style={{ opacity: page === 0 ? 1 : 0, pointerEvents: 'none' }}>
        <div className='a-global-title-box' style={{ marginLeft: (page === 0 && step === 0) ? 0 : '8vw', pointerEvents: 'auto', transition: 'all 0.8s var(--spring)' }}>
          <h1 className='a-global-title' style={{ display: 'flex', alignItems: 'center' }}>什么是 <span className='a-grad' style={{marginLeft: '10px'}}>Attention</span>？</h1>
        </div>
        <div className='a-global-formula-wrap' style={{ opacity: (page === 0 && step === 0) ? 0 : 1, marginRight: (page === 0 && step === 0) ? 0 : '8vw', transition: 'all 0.8s var(--spring) 0.1s', transform: (page === 0 && step === 0) ? 'translateX(50px) scale(0.95)' : 'translateX(0) scale(1)', pointerEvents: (page === 0 && step === 0) ? 'none' : 'auto' }}>
          <div className="a-g-formula">
            <Latex>{`$ \\text{Attention}(Q,K,V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} \\right) V $`}</Latex>
          </div>
        </div>
      </div>

      <div className="a-deck">
        <AnimatePresence mode='wait'>
          <motion.div key={page} initial={{opacity:0, scale:0.98, y: 30}} animate={{opacity:1, scale:1, y: 0}} exit={{opacity:0, scale:0.98, y: -30}} transition={{duration:0.8, ease: [0.4, 0, 0.2, 1]}} style={{width:'100%',height:'100%',position:'absolute'}}>
            {page===0 && <Slide0 step={step}/>}
            {page===1 && <Slide1 step={step}/>}
            {page===2 && <Slide2 step={step} projStep={projStep} />}
            {page===3 && <Slide3 step={step}/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
