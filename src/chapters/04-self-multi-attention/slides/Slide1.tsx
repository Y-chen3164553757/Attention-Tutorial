import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';

interface Slide1Props {
  step: number;
}

export default function Slide1({ step }: Slide1Props) {
  const showParams = step >= 0;
  const showDimSplit = step >= 1;
  const showQKVGen = step >= 2;
  const showMultiSplit = step >= 3;
  const showParallelCompute = step >= 4;

  // step 4 时 0,1,2 消失，显示 3
  const showOldSteps = step < 4;
  const showParallel = step >= 4;

  return (
    <div className="mha-slide-container mha-slide-animated">
      {/* 标题区域 - 始终显示 */}
      <div className="sma-header-area sma-header-large">
        <motion.h1
          className="sma-main-title sma-title-large"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="sma-title-row">
            <span>多头注意力机制</span>
            <span className="sma-title-en">Multi-Head Attention</span>
          </span>
        </motion.h1>
      </div>

      {/* 模型参数 - 右上角 */}
      {showParams && (
        <motion.div
          className="mha-params-corner"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mha-board-mini mha-board-compact">
            <div className="mha-board-note-compact">
              <div className="mha-note-title">GPT-2</div>
            </div>
            <div className="mha-params-compact">
              <div className="mha-param-row-compact">
                <div className="mha-param-item-compact">
                  <span className="mha-param-val-compact">12</span>
                  <span className="mha-param-label-compact">Layers</span>
                </div>
                <div className="mha-param-item-compact">
                  <span className="mha-param-val-compact">12</span>
                  <span className="mha-param-label-compact">Heads</span>
                </div>
                <div className="mha-param-item-compact">
                  <span className="mha-param-val-compact">768</span>
                  <span className="mha-param-label-compact">d_model</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 0, 1, 2 内容区域 - step < 3 时显示 */}
      <AnimatePresence>
        {showOldSteps && (
          <motion.div
            className="mha-split-content"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            
            {/* 0: 维度拆分 */}
            {showDimSplit && (
              <motion.div
                className="mha-step-card mha-card-purple"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mha-step-header">
                  <div className="mha-step-badge-custom mha-badge-purple">0</div>
                  <h3 className="mha-step-title">维度拆分</h3>
                  <span className="mha-step-subtitle">Dimension Split</span>
                </div>
                
                <div className="mha-dim-split-compact">
                  <div className="mha-dim-bar-purple">768</div>
                  <span className="mha-dim-eq">=</span>
                  <div className="mha-dim-formula-purple">
                    <Latex>{`$12 \\times 64$`}</Latex>
                  </div>
                  <span className="mha-dim-arrow">→</span>
                  <div className="mha-heads-compact">
                    <div className="mha-head-chunk">
                      {[0, 1, 2, 3].map(i => (
                        <motion.div
                          key={i}
                          className="mha-head-dot"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                        >
                          H{i}
                        </motion.div>
                      ))}
                    </div>
                    <span className="mha-ellipsis-text">...</span>
                    <div className="mha-head-chunk">
                      {[9, 10, 11].map(i => (
                        <motion.div
                          key={i}
                          className="mha-head-dot"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          H{i}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1: QKV 生成 */}
            {showQKVGen && (
              <motion.div
                className="mha-step-card mha-card-blue"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mha-step-header">
                  <div className="mha-step-badge-custom mha-badge-blue">1</div>
                  <h3 className="mha-step-title">QKV 生成</h3>
                  <span className="mha-step-subtitle">QKV Generation</span>
                </div>
                
                <div className="mha-qkv-gen-compact">
                  <div className="mha-input-mini">
                    <div className="mha-input-text-mini">小 猫 好 可 爱</div>
                    <div className="mha-tensor-mini-box">
                      <div className="mha-tensor-row-mini"></div>
                      <div className="mha-tensor-row-mini"></div>
                      <div className="mha-tensor-row-mini"></div>
                      <div className="mha-tensor-row-mini"></div>
                      <div className="mha-tensor-row-mini"></div>
                    </div>
                    <span className="mha-tensor-label-mini">X (5, 768)</span>
                  </div>

                  <span className="mha-op-mini">×</span>

                  <div className="mha-weight-mini">
                    <Latex>{`$W^{QKV}$`}</Latex>
                    <span className="mha-weight-shape">(768, 2304)</span>
                  </div>

                  <span className="mha-eq-mini">=</span>

                  <div className="mha-qkv-result">
                    <div className="mha-qkv-single mha-qkv-q">
                      <span className="mha-qkv-letter-sm">Q</span>
                      <span className="mha-qkv-label-sm">Query</span>
                    </div>
                    <div className="mha-qkv-single mha-qkv-k">
                      <span className="mha-qkv-letter-sm">K</span>
                      <span className="mha-qkv-label-sm">Key</span>
                    </div>
                    <div className="mha-qkv-single mha-qkv-v">
                      <span className="mha-qkv-letter-sm">V</span>
                      <span className="mha-qkv-label-sm">Value</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2: 多头拆分 */}
            {showMultiSplit && (
              <motion.div
                className="mha-step-card mha-card-green"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mha-step-header">
                  <div className="mha-step-badge-custom mha-badge-green">2</div>
                  <h3 className="mha-step-title">多头拆分</h3>
                  <span className="mha-step-subtitle">Multi-Head Split</span>
                </div>
                
                <div className="mha-split-compact">
                  <div className="mha-split-unit">
                    <div className="mha-source-sm mha-source-q">Q</div>
                    <span className="mha-source-dim-sm">(5, 768)</span>
                    <span className="mha-op-tag-sm">view+permute</span>
                    <div className="mha-split-chips-compact">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="mha-chip-sm mha-chip-q"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                        >
                          Q{i}
                        </motion.span>
                      ))}
                      <span className="mha-chip-ellipsis">...</span>
                      <motion.span
                        className="mha-chip-sm mha-chip-q"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                      >
                        Q11
                      </motion.span>
                    </div>
                  </div>

                  <div className="mha-split-unit">
                    <div className="mha-source-sm mha-source-k">K</div>
                    <span className="mha-source-dim-sm">(5, 768)</span>
                    <span className="mha-op-tag-sm">view+permute</span>
                    <div className="mha-split-chips-compact">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="mha-chip-sm mha-chip-k"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                        >
                          K{i}
                        </motion.span>
                      ))}
                      <span className="mha-chip-ellipsis">...</span>
                      <motion.span
                        className="mha-chip-sm mha-chip-k"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                      >
                        K11
                      </motion.span>
                    </div>
                  </div>

                  <div className="mha-split-unit">
                    <div className="mha-source-sm mha-source-v">V</div>
                    <span className="mha-source-dim-sm">(5, 768)</span>
                    <span className="mha-op-tag-sm">view+permute</span>
                    <div className="mha-split-chips-compact">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="mha-chip-sm mha-chip-v"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                        >
                          V{i}
                        </motion.span>
                      ))}
                      <span className="mha-chip-ellipsis">...</span>
                      <motion.span
                        className="mha-chip-sm mha-chip-v"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                      >
                        V11
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3: 多头并行计算 - step >= 3 时显示 */}
      <AnimatePresence>
        {showParallel && (
          <motion.div
            className="mha-split-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="mha-step-card mha-card-orange"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mha-step-header">
                <div className="mha-step-badge-custom mha-badge-orange">3</div>
                <h3 className="mha-step-title">多头并行计算</h3>
                <span className="mha-step-subtitle">Parallel Multi-Head Attention</span>
              </div>

              <div className="mha-parallel-flow">
                {/* 公式 */}
                <div className="mha-parallel-formula">
                  <Latex>{`$\\text{head}_i = \\text{Attention}(Q_i, K_i, V_i) = \\text{softmax}\\left(\\frac{Q_i K_i^T}{\\sqrt{64}}\\right)V_i$`}</Latex>
                </div>

                {/* 三个头的并行计算 */}
                <div className="mha-heads-compute">
                  {/* Head 0 */}
                  <motion.div
                    className="mha-head-compute-unit"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="mha-head-label mha-head-label-0">Head 0</div>
                    <div className="mha-head-flow">
                      <div className="mha-head-tensor mha-tensor-q">Q<sub>0</sub></div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-k">K<sub>0</sub><sup>T</sup></div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge">÷√64</div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge mha-softmax-badge">Softmax</div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-v">V<sub>0</sub></div>
                      <span className="mha-flow-op-small">=</span>
                      <div className="mha-head-tensor mha-tensor-out">O<sub>0</sub></div>
                    </div>
                    <div className="mha-head-dim">(5, 64)</div>
                  </motion.div>

                  {/* Head 1 */}
                  <motion.div
                    className="mha-head-compute-unit"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <div className="mha-head-label mha-head-label-1">Head 1</div>
                    <div className="mha-head-flow">
                      <div className="mha-head-tensor mha-tensor-q">Q<sub>1</sub></div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-k">K<sub>1</sub><sup>T</sup></div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge">÷√64</div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge mha-softmax-badge">Softmax</div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-v">V<sub>1</sub></div>
                      <span className="mha-flow-op-small">=</span>
                      <div className="mha-head-tensor mha-tensor-out">O<sub>1</sub></div>
                    </div>
                    <div className="mha-head-dim">(5, 64)</div>
                  </motion.div>

                  {/* Head 2 */}
                  <motion.div
                    className="mha-head-compute-unit"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <div className="mha-head-label mha-head-label-2">Head 2</div>
                    <div className="mha-head-flow">
                      <div className="mha-head-tensor mha-tensor-q">Q<sub>2</sub></div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-k">K<sub>2</sub><sup>T</sup></div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge">÷√64</div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge mha-softmax-badge">Softmax</div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-v">V<sub>2</sub></div>
                      <span className="mha-flow-op-small">=</span>
                      <div className="mha-head-tensor mha-tensor-out">O<sub>2</sub></div>
                    </div>
                    <div className="mha-head-dim">(5, 64)</div>
                  </motion.div>

                  {/* 省略号 */}
                  <motion.div
                    className="mha-head-ellipsis"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <span>...</span>
                  </motion.div>

                  {/* Head 11 */}
                  <motion.div
                    className="mha-head-compute-unit"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <div className="mha-head-label mha-head-label-11">Head 11</div>
                    <div className="mha-head-flow">
                      <div className="mha-head-tensor mha-tensor-q">Q<sub>11</sub></div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-k">K<sub>11</sub><sup>T</sup></div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge">÷√64</div>
                      <span className="mha-flow-op-small">→</span>
                      <div className="mha-head-op-badge mha-softmax-badge">Softmax</div>
                      <span className="mha-flow-op-small">×</span>
                      <div className="mha-head-tensor mha-tensor-v">V<sub>11</sub></div>
                      <span className="mha-flow-op-small">=</span>
                      <div className="mha-head-tensor mha-tensor-out">O<sub>11</sub></div>
                    </div>
                    <div className="mha-head-dim">(5, 64)</div>
                  </motion.div>
                </div>

                {/* 并行计算说明 */}
                <motion.div
                  className="mha-parallel-note"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <span className="mha-note-icon">⚡</span>
                  <span>12 个注意力头同时并行计算</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
