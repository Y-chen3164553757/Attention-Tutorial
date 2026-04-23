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
  const showConcat = step >= 5;
  const showProjection = step >= 6;
  const showResidual = step >= 7;

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
            /* 3: 多头并行计算 - step >= 4 时显示 */
            <motion.div
              key="step-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mha-parallel-allinone">
                {/* 头部 */}
                <div className="mha-parallel-header">
                  <div className="mha-step-badge-lg mha-badge-lg-orange">3</div>
                  <h3 className="mha-step-title-lg">多头注意力机制</h3>
                  <span className="mha-step-subtitle-lg">Multi-Head Attention · 12 Heads</span>
                </div>

                {/* 主体布局：左侧公式 + 右侧各步骤 */}
                <div className="mha-allinone-body">
                  {/* 左侧：多头注意力公式 + 并行计算 + 层叠 */}
                  <div className="mha-allinone-left">
                    <div className="mha-formula-card">
                      <div className="mha-formula-title">多头注意力公式</div>
                      <div className="mha-mha-formula">
                        <div className="mha-formula-main">
                          <span className="mha-formula-key">MultiHead</span>
                          <span className="mha-formula-eq-sym">=</span>
                          <span className="mha-formula-concat">Concat</span>
                          <span className="mha-formula-paren">(</span>
                          <span className="mha-formula-head-list">head₁, head₂, ..., head₁₂</span>
                          <span className="mha-formula-paren">)</span>
                          <span className="mha-formula-wo">· Wᴼ</span>
                        </div>
                        <div className="mha-formula-detail">
                          <span className="mha-formula-where">其中</span>
                          <span className="mha-formula-head-i">headᵢ</span>
                          <span className="mha-formula-eq-sym">=</span>
                          <span className="mha-formula-attn-fn">Attention</span>
                          <span className="mha-formula-paren">(</span>
                          <span className="mha-formula-qkv">Qᵢ, Kᵢ, Vᵢ</span>
                          <span className="mha-formula-paren">)</span>
                        </div>
                      </div>
                    </div>

                    {/* 并行计算可视化 */}
                    {showParallelCompute && (
                      <motion.div
                        className="mha-parallel-compute-area"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="mha-allheads-title">各头并行计算 (12 × Attention)</div>
                        <div className="mha-allheads-list">
                          <motion.div className="mha-allhead-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
                            <span className="mha-allhead-badge mha-allhead-badge-0">Head₀</span>
                            <span className="mha-allhead-calc">
                              <span className="mha-allhead-mat mha-allhead-mat-q">Q₀</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-k">K₀ᵀ</span>
                              <span className="mha-allhead-shape">(64,5)</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag">÷√64</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag mha-allhead-softmax">Softmax</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-v">V₀</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-eq">=</span>
                              <span className="mha-allhead-mat mha-allhead-mat-o">O₀</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                            </span>
                          </motion.div>

                          <motion.div className="mha-allhead-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
                            <span className="mha-allhead-badge mha-allhead-badge-1">Head₁</span>
                            <span className="mha-allhead-calc">
                              <span className="mha-allhead-mat mha-allhead-mat-q">Q₁</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-k">K₁ᵀ</span>
                              <span className="mha-allhead-shape">(64,5)</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag">÷√64</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag mha-allhead-softmax">Softmax</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-v">V₁</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-eq">=</span>
                              <span className="mha-allhead-mat mha-allhead-mat-o">O₁</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                            </span>
                          </motion.div>

                          <motion.div className="mha-allhead-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.11 }}>
                            <span className="mha-allhead-badge mha-allhead-badge-2">Head₂</span>
                            <span className="mha-allhead-calc">
                              <span className="mha-allhead-mat mha-allhead-mat-q">Q₂</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-k">K₂ᵀ</span>
                              <span className="mha-allhead-shape">(64,5)</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag">÷√64</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag mha-allhead-softmax">Softmax</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-v">V₂</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-eq">=</span>
                              <span className="mha-allhead-mat mha-allhead-mat-o">O₂</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                            </span>
                          </motion.div>

                          <motion.div className="mha-allhead-row mha-allhead-ellipsis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.14 }}>
                            <span className="mha-allhead-badge mha-allhead-badge-dot">...</span>
                            <span className="mha-allhead-calc">
                              <span className="mha-allhead-ellipsis-text">Head₃ ~ Head₁₀ 并行计算中...</span>
                            </span>
                          </motion.div>

                          <motion.div className="mha-allhead-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.17 }}>
                            <span className="mha-allhead-badge mha-allhead-badge-11">Head₁₁</span>
                            <span className="mha-allhead-calc">
                              <span className="mha-allhead-mat mha-allhead-mat-q">Q₁₁</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-k">K₁₁ᵀ</span>
                              <span className="mha-allhead-shape">(64,5)</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag">÷√64</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op-tag mha-allhead-softmax">Softmax</span>
                              <span className="mha-allhead-arrow">→</span>
                              <span className="mha-allhead-op">×</span>
                              <span className="mha-allhead-mat mha-allhead-mat-v">V₁₁</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                              <span className="mha-allhead-eq">=</span>
                              <span className="mha-allhead-mat mha-allhead-mat-o">O₁₁</span>
                              <span className="mha-allhead-shape">(5,64)</span>
                            </span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* 12层 Transformer Block 堆叠 */}
                    {showResidual && (
                      <motion.div
                        className="mha-layers-note"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <div className="mha-layers-text-center">12 × Transformer Block 堆叠</div>
                        <div className="mha-layers-visual">
                          <div className="mha-layers-stack">
                            <span className="mha-layer-item">Block₁</span>
                            <span className="mha-layer-item">Block₂</span>
                            <span className="mha-layer-item mha-layer-highlight">···</span>
                            <span className="mha-layer-item">Block₁₂</span>
                          </div>
                          <div className="mha-layers-arch-tags">
                            <span className="mha-arch-tag mha-arch-tag-residual">Residual</span>
                            <span className="mha-arch-tag mha-arch-tag-ln">LayerNorm</span>
                            <span className="mha-arch-tag mha-arch-tag-ffn">FFN</span>
                            <span className="mha-arch-tag mha-arch-tag-mha">MultiHead</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 右侧：拼接 → 投影 → 残差/归一化/FFN */}
                  <div className="mha-allinone-right">
                    {/* 步骤1: 拼接 */}
                    {showConcat && (
                      <motion.div
                        className="mha-right-unit mha-right-concat"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="mha-right-label">步骤1: Concat 拼接</div>
                        <div className="mha-right-flow">
                          <div className="mha-concat-blocks">
                            <span className="mha-cb mha-cb-0">O₀</span>
                            <span className="mha-cb mha-cb-1">O₁</span>
                            <span className="mha-cb mha-cb-2">O₂</span>
                            <span className="mha-cb-dot">...</span>
                            <span className="mha-cb mha-cb-11">O₁₁</span>
                          </div>
                          <span className="mha-right-arrow">→</span>
                          <div className="mha-concat-result">
                            <div className="mha-concat-mat-icon"></div>
                            <div className="mha-concat-shape">(5, 768)</div>
                          </div>
                        </div>
                        <div className="mha-concat-dim-note">12 × 64 = 768 维</div>
                      </motion.div>
                    )}

                    {/* 步骤2: 投影 */}
                    {showProjection && (
                      <motion.div
                        className="mha-right-unit mha-right-wo"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="mha-right-label">步骤2: × Wᴼ 输出投影</div>
                        <div className="mha-right-flow">
                          <div className="mha-wo-icon">
                            <div className="mha-wo-grid"></div>
                            <div className="mha-wo-shape">768 × 768</div>
                          </div>
                          <span className="mha-right-arrow">→</span>
                          <div className="mha-wo-result">
                            <div className="mha-wo-output-box">
                              <div className="mha-wo-output-label">MultiHead Output</div>
                              <div className="mha-wo-output-mat">× Wᴼ</div>
                            </div>
                            <div className="mha-wo-shape">(5, 768)</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* 步骤3: 残差连接 + 归一化 + FFN */}
                    {showResidual && (
                      <motion.div
                        className="mha-right-unit mha-right-unit-final"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="mha-right-label">步骤3: 残差 · 归一化 · FFN</div>
                        <div className="mha-architectures-list">
                          <div className="mha-arch-item">
                            <div className="mha-arch-icon mha-arch-icon-residual"></div>
                            <div className="mha-arch-desc">
                              <div className="mha-arch-title">残差连接 Residual</div>
                              <div className="mha-arch-formula">X + SubLayer(X)</div>
                              <div className="mha-arch-note">梯度直传，避免深层网络退化</div>
                            </div>
                          </div>
                          <div className="mha-arch-item">
                            <div className="mha-arch-icon mha-arch-icon-ln"></div>
                            <div className="mha-arch-desc">
                              <div className="mha-arch-title">归一化 LayerNorm</div>
                              <div className="mha-arch-formula">γ · (x - μ)/√(σ²+ε) + β</div>
                              <div className="mha-arch-note">稳定激活分布，加速收敛</div>
                            </div>
                          </div>
                          <div className="mha-arch-item">
                            <div className="mha-arch-icon mha-arch-icon-ffn"></div>
                            <div className="mha-arch-desc">
                              <div className="mha-arch-title">前馈网络 FFN</div>
                              <div className="mha-arch-formula">FFN(x) = max(0, xW₁+b₁)W₂+b₂</div>
                              <div className="mha-arch-note">逐位置非线性变换，768→3072→768</div>
                            </div>
                          </div>
                        </div>
                        <div className="mha-arch-summary">
                          <div className="mha-arch-summary-text">
                            三者共同构成 Transformer Block 的基础组件
                          </div>
                        </div>
                      </motion.div>
                    )}
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
