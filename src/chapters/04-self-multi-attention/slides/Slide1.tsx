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

  // step 4 时显示多头并行计算
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

      {/* 步骤卡片容器 - 步骤0-2 和 步骤3 共用布局，避免位置跳跃 */}
      <div className="mha-split-content">
        {/* 0, 1, 2 内容区域 - step < 4 时显示 */}
        <AnimatePresence mode="wait">
          {step < 4 ? (
            <motion.div
              key="steps-0-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 0: 维度拆分 */}
              {showDimSplit && (
                <motion.div
                  className="mha-step-card-lg mha-card-lg-purple"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mha-step-header-lg">
                    <div className="mha-step-badge-lg mha-badge-lg-purple">0</div>
                    <h3 className="mha-step-title-lg">维度拆分</h3>
                    <span className="mha-step-subtitle-lg">Dimension Split</span>
                  </div>

                  <div className="mha-dim-split-lg">
                    <div className="mha-dim-bar-lg">768</div>
                    <span className="mha-dim-eq-lg">=</span>
                    <div className="mha-dim-formula-lg">
                      <Latex>{`$12 \\times 64$`}</Latex>
                    </div>
                    <span className="mha-dim-arrow-lg">→</span>
                    <div className="mha-heads-lg">
                      <div className="mha-head-chunk-lg">
                        {[0, 1, 2, 3].map(i => (
                          <motion.div
                            key={i}
                            className="mha-head-dot-lg"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                          >
                            H{i}
                          </motion.div>
                        ))}
                      </div>
                      <span className="mha-ellipsis-lg">...</span>
                      <div className="mha-head-chunk-lg">
                        {[9, 10, 11].map(i => (
                          <motion.div
                            key={i}
                            className="mha-head-dot-lg"
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
                  className="mha-step-card-lg mha-card-lg-blue"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="mha-step-header-lg">
                    <div className="mha-step-badge-lg mha-badge-lg-blue">1</div>
                    <h3 className="mha-step-title-lg">QKV 生成</h3>
                    <span className="mha-step-subtitle-lg">QKV Generation</span>
                  </div>

                  <div className="mha-qkv-gen-lg">
                    <div className="mha-input-lg">
                      <div className="mha-input-text-lg">小 猫 好 可 爱</div>
                      <div className="mha-tensor-box-lg">
                        <div className="mha-tensor-row-lg"></div>
                        <div className="mha-tensor-row-lg"></div>
                        <div className="mha-tensor-row-lg"></div>
                        <div className="mha-tensor-row-lg"></div>
                        <div className="mha-tensor-row-lg"></div>
                      </div>
                      <span className="mha-tensor-label-lg">X (5, 768)</span>
                    </div>

                    <span className="mha-op-lg">×</span>

                    <div className="mha-weight-lg">
                      <Latex>{`$W^{QKV}$`}</Latex>
                      <span className="mha-weight-shape-lg">(768, 2304)</span>
                    </div>

                    <span className="mha-eq-lg">=</span>

                    <div className="mha-qkv-result-lg">
                      <div className="mha-qkv-single-lg mha-qkv-lg-q">
                        <span className="mha-qkv-letter-lg">Q</span>
                        <span className="mha-qkv-label-lg">Query</span>
                      </div>
                      <div className="mha-qkv-single-lg mha-qkv-lg-k">
                        <span className="mha-qkv-letter-lg">K</span>
                        <span className="mha-qkv-label-lg">Key</span>
                      </div>
                      <div className="mha-qkv-single-lg mha-qkv-lg-v">
                        <span className="mha-qkv-letter-lg">V</span>
                        <span className="mha-qkv-label-lg">Value</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2: 多头拆分 */}
              {showMultiSplit && (
                <motion.div
                  className="mha-step-card-lg mha-card-lg-green"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="mha-step-header-lg">
                    <div className="mha-step-badge-lg mha-badge-lg-green">2</div>
                    <h3 className="mha-step-title-lg">多头拆分</h3>
                    <span className="mha-step-subtitle-lg">Multi-Head Split</span>
                  </div>

                  <div className="mha-split-lg">
                    <div className="mha-split-unit-lg">
                      <div className="mha-source-lg mha-source-lg-q">Q</div>
                      <span className="mha-source-dim-lg">(5, 768)</span>
                      <span className="mha-op-tag-lg">view+permute</span>
                      <div className="mha-split-chips-lg">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="mha-chip-lg mha-chip-lg-q"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                          >
                            Q{i}
                          </motion.span>
                        ))}
                        <span className="mha-chip-ellipsis-lg">...</span>
                        <motion.span
                          className="mha-chip-lg mha-chip-lg-q"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                        >
                          Q11
                        </motion.span>
                      </div>
                      <div className="mha-split-shape-label">Q₀ ~ Q₁₁ (5, 64)</div>
                    </div>

                    <div className="mha-split-unit-lg">
                      <div className="mha-source-lg mha-source-lg-k">K</div>
                      <span className="mha-source-dim-lg">(5, 768)</span>
                      <span className="mha-op-tag-lg">view+permute</span>
                      <div className="mha-split-chips-lg">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="mha-chip-lg mha-chip-lg-k"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                          >
                            K{i}
                          </motion.span>
                        ))}
                        <span className="mha-chip-ellipsis-lg">...</span>
                        <motion.span
                          className="mha-chip-lg mha-chip-lg-k"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                        >
                          K11
                        </motion.span>
                      </div>
                      <div className="mha-split-shape-label">K₀ ~ K₁₁ (5, 64)</div>
                    </div>

                    <div className="mha-split-unit-lg">
                      <div className="mha-source-lg mha-source-lg-v">V</div>
                      <span className="mha-source-dim-lg">(5, 768)</span>
                      <span className="mha-op-tag-lg">view+permute</span>
                      <div className="mha-split-chips-lg">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="mha-chip-lg mha-chip-lg-v"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                          >
                            V{i}
                          </motion.span>
                        ))}
                        <span className="mha-chip-ellipsis-lg">...</span>
                        <motion.span
                          className="mha-chip-lg mha-chip-lg-v"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                        >
                          V11
                        </motion.span>
                      </div>
                      <div className="mha-split-shape-label">V₀ ~ V₁₁ (5, 64)</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* 3: 多头并行计算 - step >= 4 时显示 - 详细版 */
            <motion.div
              key="step-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mha-parallel-detailed">
                {/* 头部 */}
                <div className="mha-parallel-header">
                  <div className="mha-step-badge-lg mha-badge-lg-orange">3</div>
                  <h3 className="mha-step-title-lg">多头并行计算</h3>
                  <span className="mha-step-subtitle-lg">Multi-Head Attention</span>
                </div>

                {/* 整体公式 */}
                <div className="mha-parallel-main-formula">
                  <div className="mha-formula-box">
                    <Latex>{`$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, ..., \\text{head}_h) W^O$`}</Latex>
                  </div>
                  <div className="mha-formula-note">其中 head_i = Attention(Q_i, K_i, V_i)</div>
                </div>

                {/* 计算流程区域 */}
                <div className="mha-compute-flow">
                  {/* 左侧：三个Head的计算 */}
                  <div className="mha-heads-section">
                    <div className="mha-heads-title">各头 Attention 计算</div>
                    <div className="mha-heads-grid-detailed">
                      {/* Head 0 */}
                      <motion.div
                        className="mha-head-compute-detailed mha-head-h0"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <div className="mha-head-title-row">
                          <span className="mha-head-badge">Head₀</span>
                          <span className="mha-head-dim-label">(5, 64)</span>
                        </div>
                        <div className="mha-head-calc-flow">
                          <div className="mha-calc-step">
                            <span className="mha-calc-mat mha-mat-q">Q₀</span>
                            <span className="mha-calc-op">×</span>
                            <span className="mha-calc-mat mha-mat-k">K₀ᵀ</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-label">÷√64</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-op-badge">Softmax</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-mat mha-mat-v">V₀</span>
                            <span className="mha-calc-op">=</span>
                            <span className="mha-calc-mat mha-mat-out">O₀</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Head 1 */}
                      <motion.div
                        className="mha-head-compute-detailed mha-head-h1"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                      >
                        <div className="mha-head-title-row">
                          <span className="mha-head-badge">Head₁</span>
                          <span className="mha-head-dim-label">(5, 64)</span>
                        </div>
                        <div className="mha-head-calc-flow">
                          <div className="mha-calc-step">
                            <span className="mha-calc-mat mha-mat-q">Q₁</span>
                            <span className="mha-calc-op">×</span>
                            <span className="mha-calc-mat mha-mat-k">K₁ᵀ</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-label">÷√64</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-op-badge">Softmax</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-mat mha-mat-v">V₁</span>
                            <span className="mha-calc-op">=</span>
                            <span className="mha-calc-mat mha-mat-out">O₁</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Head 2 */}
                      <motion.div
                        className="mha-head-compute-detailed mha-head-h2"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <div className="mha-head-title-row">
                          <span className="mha-head-badge">Head₂</span>
                          <span className="mha-head-dim-label">(5, 64)</span>
                        </div>
                        <div className="mha-head-calc-flow">
                          <div className="mha-calc-step">
                            <span className="mha-calc-mat mha-mat-q">Q₂</span>
                            <span className="mha-calc-op">×</span>
                            <span className="mha-calc-mat mha-mat-k">K₂ᵀ</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-label">÷√64</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-op-badge">Softmax</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-mat mha-mat-v">V₂</span>
                            <span className="mha-calc-op">=</span>
                            <span className="mha-calc-mat mha-mat-out">O₂</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* 省略号 */}
                      <motion.div
                        className="mha-head-ellipsis-detailed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                      >
                        <span>...</span>
                        <span className="mha-ellipsis-note">Head₃ ~ Head₁₁</span>
                      </motion.div>

                      {/* Head 11 */}
                      <motion.div
                        className="mha-head-compute-detailed mha-head-h11"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <div className="mha-head-title-row">
                          <span className="mha-head-badge">Head₁₁</span>
                          <span className="mha-head-dim-label">(5, 64)</span>
                        </div>
                        <div className="mha-head-calc-flow">
                          <div className="mha-calc-step">
                            <span className="mha-calc-mat mha-mat-q">Q₁₁</span>
                            <span className="mha-calc-op">×</span>
                            <span className="mha-calc-mat mha-mat-k">K₁₁ᵀ</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-label">÷√64</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-op-badge">Softmax</span>
                            <span className="mha-calc-arrow">→</span>
                            <span className="mha-calc-mat mha-mat-v">V₁₁</span>
                            <span className="mha-calc-op">=</span>
                            <span className="mha-calc-mat mha-mat-out">O₁₁</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* 右侧：拼接和输出 */}
                  <div className="mha-concat-section">
                    <div className="mha-heads-title">拼接与输出</div>

                    {/* 拼接操作 */}
                    <motion.div
                      className="mha-concat-flow"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.35 }}
                    >
                      <div className="mha-concat-label">Concat 拼接</div>
                      <div className="mha-concat-visual">
                        <div className="mha-concat-inputs">
                          <div className="mha-concat-block mha-concat-o0">O₀</div>
                          <div className="mha-concat-block mha-concat-o1">O₁</div>
                          <div className="mha-concat-block mha-concat-o2">O₂</div>
                          <div className="mha-concat-block mha-concat-dots">...</div>
                          <div className="mha-concat-block mha-concat-o11">O₁₁</div>
                        </div>
                        <div className="mha-concat-arrow">→</div>
                        <div className="mha-concat-output">
                          <div className="mha-concat-matrix">
                            <div className="mha-matrix-row">
                              <span></span><span></span><span></span><span></span>
                            </div>
                            <div className="mha-matrix-row">
                              <span></span><span></span><span></span><span></span>
                            </div>
                            <div className="mha-matrix-row">
                              <span></span><span></span><span></span><span></span>
                            </div>
                          </div>
                          <span className="mha-matrix-shape">(5, 768)</span>
                        </div>
                      </div>
                      <div className="mha-concat-dim-note">
                        <span className="mha-dim-tag">12个头 × 64维 = 768维</span>
                      </div>
                    </motion.div>

                    {/* 乘 WO */}
                    <motion.div
                      className="mha-wo-flow"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="mha-wo-label">× Wᴼ 输出投影</div>
                      <div className="mha-wo-visual">
                        <div className="mha-wo-matrix">
                          <div className="mha-wo-shape">768 × 768</div>
                          <div className="mha-wo-grid"></div>
                        </div>
                        <span className="mha-wo-op">=</span>
                        <div className="mha-wo-result">
                          <div className="mha-wo-output-box">
                            <span className="mha-wo-output-label">最终输出</span>
                            <span className="mha-wo-output-mat">MultiHead</span>
                          </div>
                          <span className="mha-wo-shape-label">(5, 768)</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* 并行说明 */}
                    <motion.div
                      className="mha-parallel-summary"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.45 }}
                    >
                      <span className="mha-summary-icon">⚡</span>
                      <span>12个注意力头<strong>并行</strong>计算后再<strong>拼接</strong>，捕获多维度语义关系</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
