import { motion } from 'framer-motion';
import Latex from 'react-latex-next';

interface Slide0Props {
  step: number;
}

export default function Slide0({ step }: Slide0Props) {
  const showTitle = step >= 0;
  const showRow1 = step >= 1;
  const showRow2 = step >= 2;
  const showRow3 = step >= 3;

  return (
    <div className="sma-slide-container sma-slide-animated">
      {/* 第一步：标题 */}
      {showTitle && (
        <motion.div
          className="sma-header-area sma-header-large"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h1
            className="sma-main-title sma-title-large"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            自注意力机制
          </motion.h1>
        </motion.div>
      )}

      {/* 第二步：参数配置 */}
      {showRow1 && (
        <motion.div
          className="sma-row-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="sma-board-mini sma-board-with-note">
            <div className="sma-board-note">
              <div className="sma-note-title">GPT-2 中文模型</div>
              <div className="sma-gpt-letters">
                <motion.span className="sma-gpt-g" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>G</motion.span>
                <motion.span className="sma-gpt-p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>P</motion.span>
                <motion.span className="sma-gpt-t" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>T</motion.span>
              </div>
              <div className="sma-note-desc">Generative Pre-trained Transformer</div>
            </div>
            <div className="sma-board-content">
              <div className="sma-param-row">
                <motion.div className="sma-param-mini sma-param-layers" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 }}>
                  <span className="sma-param-val">12</span>
                  <span className="sma-param-label">Layers</span>
                </motion.div>
                <motion.div className="sma-param-mini sma-param-heads" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.6 }}>
                  <span className="sma-param-val">12</span>
                  <span className="sma-param-label">Heads</span>
                </motion.div>
                <motion.div className="sma-param-mini sma-param-d" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.7 }}>
                  <span className="sma-param-val">768</span>
                  <span className="sma-param-label">d_model</span>
                </motion.div>
              </div>
              <motion.div className="sma-formula-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.8 }}>
                <Latex>{`$ W^Q, W^K, W^V \\in \\mathbb{R}^{768 \\times 768} $`}</Latex>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 第三步：QKV 生成 */}
      {showRow2 && (
        <motion.div
          className="sma-row-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="sma-board-mini sma-board-split">
            <div className="sma-split-center">
              <div className="sma-split-left">
                <motion.div className="sma-flow-mini" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                  <div className="sma-node-mini sma-node-text">
                    <span className="sma-text-chinese">小 猫 好 可 爱</span>
                  </div>
                  <motion.div className="sma-arrow-box" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
                    <span className="sma-arrow-line">→</span>
                    <span className="sma-arrow-label">张量化</span>
                  </motion.div>
                  <motion.div className="sma-tensor-mini sma-t-x" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    <div className="sma-tensor-box">
                      <div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div>
                    </div>
                    <div className="sma-tensor-info">
                      <span className="sma-tensor-label">X</span>
                      <span className="sma-tensor-shape">(5, 768)</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              <div className="sma-split-right">
                <div className="sma-qkv-grid">
                  <motion.div className="sma-qkv-item" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                    <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.35 }}>×</motion.span>
                    <motion.div className="sma-node-mini sma-node-matrix" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.4 }}>
                      <div className="sma-matrix-info">
                        <Latex>{`$W^Q$`}</Latex>
                        <span className="sma-matrix-shape">(768, 768)</span>
                      </div>
                    </motion.div>
                    <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.45 }}>=</motion.span>
                    <motion.div className="sma-tensor-mini sma-t-q" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 }}>
                      <div className="sma-tensor-box"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                      <div className="sma-tensor-info">
                        <span className="sma-tensor-label">Q</span>
                        <span className="sma-tensor-shape">(5, 768)</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  <motion.div className="sma-qkv-item" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.55 }}>
                    <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }}>×</motion.span>
                    <motion.div className="sma-node-mini sma-node-matrix" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.65 }}>
                      <div className="sma-matrix-info">
                        <Latex>{`$W^K$`}</Latex>
                        <span className="sma-matrix-shape">(768, 768)</span>
                      </div>
                    </motion.div>
                    <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.7 }}>=</motion.span>
                    <motion.div className="sma-tensor-mini sma-t-k" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.75 }}>
                      <div className="sma-tensor-box"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                      <div className="sma-tensor-info">
                        <span className="sma-tensor-label">K</span>
                        <span className="sma-tensor-shape">(5, 768)</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  <motion.div className="sma-qkv-item" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
                    <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.85 }}>×</motion.span>
                    <motion.div className="sma-node-mini sma-node-matrix" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.9 }}>
                      <div className="sma-matrix-info">
                        <Latex>{`$W^V$`}</Latex>
                        <span className="sma-matrix-shape">(768, 768)</span>
                      </div>
                    </motion.div>
                    <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.95 }}>=</motion.span>
                    <motion.div className="sma-tensor-mini sma-t-v" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 1.0 }}>
                      <div className="sma-tensor-box"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                      <div className="sma-tensor-info">
                        <span className="sma-tensor-label">V</span>
                        <span className="sma-tensor-shape">(5, 768)</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 第四步：矩阵运算 */}
      {showRow3 && (
        <motion.div
          className="sma-row-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="sma-board-mini">
            <motion.div className="sma-formula-mini sma-formula-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Latex>{`$ \\text{Self-Attention} = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} \\right) V $`}</Latex>
            </motion.div>
            <div className="sma-flow-mini">
              <motion.div className="sma-tensor-mini sma-t-q" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                <div className="sma-tensor-box"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                <div className="sma-tensor-info">
                  <span className="sma-tensor-label">Q</span>
                  <span className="sma-tensor-shape">(5, 768)</span>
                </div>
              </motion.div>
              <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>×</motion.span>
              <motion.div className="sma-tensor-mini sma-t-k" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.25 }}>
                <div className="sma-tensor-box sma-tensor-square"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                <div className="sma-tensor-info">
                  <span className="sma-tensor-label">K^T</span>
                  <span className="sma-tensor-shape">(768, 5)</span>
                </div>
              </motion.div>
              <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>=</motion.span>
              <motion.div className="sma-tensor-mini sma-t-score" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.35 }}>
                <div className="sma-tensor-box sma-tensor-square"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                <div className="sma-tensor-info">
                  <span className="sma-tensor-label">Score</span>
                  <span className="sma-tensor-shape">(5, 5)</span>
                </div>
              </motion.div>
              <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>→</motion.span>
              <motion.div className="sma-node-mini sma-node-scale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }}>
                <Latex>{`$\\div\\sqrt{768}$`}</Latex>
              </motion.div>
              <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>→</motion.span>
              <motion.div className="sma-node-mini sma-node-softmax" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.55 }}>
                <span>Softmax</span>
              </motion.div>
              <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }}>×</motion.span>
              <motion.div className="sma-tensor-mini sma-t-v" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.65 }}>
                <div className="sma-tensor-box"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                <div className="sma-tensor-info">
                  <span className="sma-tensor-label">V</span>
                  <span className="sma-tensor-shape">(5, 768)</span>
                </div>
              </motion.div>
              <motion.span className="sma-op-mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.7 }}>=</motion.span>
              <motion.div className="sma-tensor-mini sma-t-out" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.75 }}>
                <div className="sma-tensor-box"><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div><div className="sma-tensor-cell"></div></div>
                <div className="sma-tensor-info">
                  <span className="sma-tensor-label">Output</span>
                  <span className="sma-tensor-shape">(5, 768)</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
