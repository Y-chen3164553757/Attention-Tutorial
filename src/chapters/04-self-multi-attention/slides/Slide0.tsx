import { motion } from 'framer-motion';
import Latex from 'react-latex-next';

interface Slide0Props {
  step: number;
}

export default function Slide0({ step }: Slide0Props) {
  const showTitle = step >= 0;
  const showParams = step >= 1;
  const showQKV = step >= 2;
  const showCompute = step >= 3;

  return (
    <div className="sma-slide-container sma-slide-animated">
      {/* 标题区域 */}
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
            <span className="sma-title-row">
              <span>自注意力机制</span>
              <span className="sma-title-en">Self-Attention</span>
            </span>
          </motion.h1>
        </motion.div>
      )}

      {/* 1. 模型参数 */}
      {showParams && (
        <motion.div
          className="mha-split-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mha-step-card mha-card-purple">
            <div className="mha-step-header">
              <div className="mha-step-badge-custom mha-badge-purple">0</div>
              <h3 className="mha-step-title">模型参数</h3>
              <span className="mha-step-subtitle">Model Parameters</span>
            </div>
            
            <div className="sa-params-compact">
              <div className="sa-gpt-logo">
                <span className="sa-gpt-g">G</span>
                <span className="sa-gpt-p">P</span>
                <span className="sa-gpt-t">T</span>
              </div>
              
              <div className="sa-params-row">
                <div className="sa-param-item">
                  <span className="sa-param-val sa-val-blue">12</span>
                  <span className="sa-param-label">Layers</span>
                </div>
                <div className="sa-param-item">
                  <span className="sa-param-val sa-val-green">12</span>
                  <span className="sa-param-label">Heads</span>
                </div>
                <div className="sa-param-item">
                  <span className="sa-param-val sa-val-red">768</span>
                  <span className="sa-param-label">d_model</span>
                </div>
              </div>
              
              <div className="sa-formula">
                <Latex>{`$W^Q, W^K, W^V \\in \\mathbb{R}^{768 \\times 768}$`}</Latex>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. QKV生成 */}
      {showQKV && (
        <motion.div
          className="mha-split-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mha-step-card mha-card-blue">
            <div className="mha-step-header">
              <div className="mha-step-badge-custom mha-badge-blue">1</div>
              <h3 className="mha-step-title">QKV 生成</h3>
              <span className="mha-step-subtitle">QKV Generation</span>
            </div>
            
            <div className="sa-qkv-flow">
              {/* 输入 */}
              <div className="sa-input-block">
                <div className="sa-text-row">小 猫 好 可 爱</div>
                <div className="sa-tensor-mini">
                  <div className="sa-tensor-box">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="sa-tensor-row"></div>
                    ))}
                  </div>
                  <span className="sa-tensor-label">X (5, 768)</span>
                </div>
              </div>

              {/* 三个运算 */}
              <div className="sa-qkv-ops">
                {/* Q */}
                <div className="sa-op-item">
                  <div className="sa-op-formula">
                    <span className="sa-op-symbol">×</span>
                    <div className="sa-weight-box">
                      <Latex>{`$W^Q$`}</Latex>
                      <span className="sa-weight-shape">(768, 768)</span>
                    </div>
                    <span className="sa-op-symbol">=</span>
                  </div>
                  <div className="sa-result-box sa-result-q">
                    <span className="sa-result-letter">Q</span>
                    <span className="sa-result-shape">(5, 768)</span>
                  </div>
                </div>

                {/* K */}
                <div className="sa-op-item">
                  <div className="sa-op-formula">
                    <span className="sa-op-symbol">×</span>
                    <div className="sa-weight-box">
                      <Latex>{`$W^K$`}</Latex>
                      <span className="sa-weight-shape">(768, 768)</span>
                    </div>
                    <span className="sa-op-symbol">=</span>
                  </div>
                  <div className="sa-result-box sa-result-k">
                    <span className="sa-result-letter">K</span>
                    <span className="sa-result-shape">(5, 768)</span>
                  </div>
                </div>

                {/* V */}
                <div className="sa-op-item">
                  <div className="sa-op-formula">
                    <span className="sa-op-symbol">×</span>
                    <div className="sa-weight-box">
                      <Latex>{`$W^V$`}</Latex>
                      <span className="sa-weight-shape">(768, 768)</span>
                    </div>
                    <span className="sa-op-symbol">=</span>
                  </div>
                  <div className="sa-result-box sa-result-v">
                    <span className="sa-result-letter">V</span>
                    <span className="sa-result-shape">(5, 768)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. 注意力计算 */}
      {showCompute && (
        <motion.div
          className="mha-split-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mha-step-card mha-card-green">
            <div className="mha-step-header">
              <div className="mha-step-badge-custom mha-badge-green">2</div>
              <h3 className="mha-step-title">注意力计算</h3>
              <span className="mha-step-subtitle">Attention Compute</span>
            </div>
            
            <div className="sa-attention-flow">
              {/* 公式 */}
              <div className="sa-formula-box">
                <Latex>{`$\\text{Attention} = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$`}</Latex>
              </div>
              
              {/* 计算流程 */}
              <div className="sa-compute-flow">
                {/* Q */}
                <div className="sa-tensor-display sa-tensor-q">
                  <div className="sa-tensor-cell-box">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="sa-cell"></div>
                    ))}
                  </div>
                  <span className="sa-tensor-name">Q</span>
                  <span className="sa-tensor-dim">(5, 768)</span>
                </div>

                <span className="sa-flow-op">×</span>

                {/* K^T */}
                <div className="sa-tensor-display sa-tensor-k">
                  <div className="sa-tensor-cell-box sa-cells-square">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="sa-cell"></div>
                    ))}
                  </div>
                  <span className="sa-tensor-name">K<sup>T</sup></span>
                  <span className="sa-tensor-dim">(768, 5)</span>
                </div>

                <span className="sa-flow-op">=</span>

                {/* Score */}
                <div className="sa-tensor-display sa-tensor-score">
                  <div className="sa-tensor-cell-box sa-cells-square">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="sa-cell"></div>
                    ))}
                  </div>
                  <span className="sa-tensor-name">Score</span>
                  <span className="sa-tensor-dim">(5, 5)</span>
                </div>

                <span className="sa-flow-op">→</span>

                {/* Scale */}
                <div className="sa-op-badge sa-scale-badge">
                  <Latex>{`$\\div\\sqrt{768}$`}</Latex>
                </div>

                <span className="sa-flow-op">→</span>

                {/* Softmax */}
                <div className="sa-op-badge sa-softmax-badge">Softmax</div>

                <span className="sa-flow-op">×</span>

                {/* V */}
                <div className="sa-tensor-display sa-tensor-v">
                  <div className="sa-tensor-cell-box">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="sa-cell"></div>
                    ))}
                  </div>
                  <span className="sa-tensor-name">V</span>
                  <span className="sa-tensor-dim">(5, 768)</span>
                </div>

                <span className="sa-flow-op">=</span>

                {/* Output */}
                <div className="sa-tensor-display sa-tensor-out">
                  <div className="sa-tensor-cell-box">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="sa-cell"></div>
                    ))}
                  </div>
                  <span className="sa-tensor-name">Output</span>
                  <span className="sa-tensor-dim">(5, 768)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
