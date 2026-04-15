import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

import type { ChapterComponentProps } from '../catalog';
import { timelineData, TOTAL_STEPS } from './chapter-data';
import './OriginChapter.css';

const Stage1Visual = () => {
  const inputNodes = ['x₀', 'x₁', 'x₂'];
  const hiddenNodes = ['h₁', 'h₂', 'h₃', 'h₄'];
  const outputNodes = ['ŷ₁', 'ŷ₂'];

  // 节点位置配置
  const nodeSize = 50;
  const layerLeft = [30, 240, 470]; // 三层的left位置
  const inputTops = [50, 115, 180]; // 输入层节点top
  const hiddenTops = [50, 110, 170, 230]; // 隐藏层节点top
  const outputTops = [70, 190]; // 输出层节点top

  return (
    <motion.div
      className="v-s1-ann-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="v-s1-ann-title">Artificial Neural Network</div>

      <div className="v-s1-ann-network">
        {/* SVG连接线层 */}
        <svg className="v-s1-ann-svg" viewBox="0 0 560 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          {/* 输入层到隐藏层的连接线 */}
          {inputTops.map((inY, i) =>
            hiddenTops.map((hidY, j) => {
              const x1 = layerLeft[0] + nodeSize;
              const y1 = inY + nodeSize / 2;
              const x2 = layerLeft[1];
              const y2 = hidY + nodeSize / 2;
              return (
                <motion.line
                  key={`in-${i}-hid-${j}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="v-s1-ann-svg-line"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.1 + j * 0.05,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                />
              );
            })
          )}

          {/* 隐藏层到输出层的连接线 */}
          {hiddenTops.map((hidY, i) =>
            outputTops.map((outY, j) => {
              const x1 = layerLeft[1] + nodeSize;
              const y1 = hidY + nodeSize / 2;
              const x2 = layerLeft[2];
              const y2 = outY + nodeSize / 2;
              return (
                <motion.line
                  key={`hid-${i}-out-${j}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="v-s1-ann-svg-line"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 1.0 + i * 0.05 + j * 0.1,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                />
              );
            })
          )}
        </svg>

        {/* 输入层 */}
        <div className="v-s1-ann-layer">
          {inputNodes.map((node, i) => (
            <motion.div
              key={node}
              className="v-s1-ann-node v-s1-ann-input"
              style={{ left: layerLeft[0], top: inputTops[i] }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.2 }}
            >
              {node}
            </motion.div>
          ))}
          <div className="v-s1-ann-layer-label" style={{ left: layerLeft[0], top: inputTops[2] + nodeSize + 15 }}>
            输入层
          </div>
        </div>

        {/* 隐藏层 */}
        <div className="v-s1-ann-layer">
          {hiddenNodes.map((node, i) => (
            <motion.div
              key={node}
              className="v-s1-ann-node v-s1-ann-hidden"
              style={{ left: layerLeft[1], top: hiddenTops[i] }}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.2 }}
            >
              <motion.div
                className="v-s1-ann-node-glow"
                animate={{
                  boxShadow: [
                    '0 0 12px rgba(59, 130, 246, 0.5)',
                    '0 0 25px rgba(59, 130, 246, 0.8)',
                    '0 0 12px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              />
            </motion.div>
          ))}
          <div className="v-s1-ann-layer-label" style={{ left: layerLeft[1], top: hiddenTops[3] + nodeSize + 15 }}>
            隐藏层
          </div>
        </div>

        {/* 输出层 */}
        <div className="v-s1-ann-layer">
          {outputNodes.map((node, i) => (
            <motion.div
              key={node}
              className="v-s1-ann-node v-s1-ann-output"
              style={{ left: layerLeft[2], top: outputTops[i] }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
              whileHover={{ scale: 1.2 }}
            >
              <motion.div
                className="v-s1-ann-node-glow"
                animate={{
                  boxShadow: [
                    '0 0 12px rgba(239, 68, 68, 0.5)',
                    '0 0 25px rgba(239, 68, 68, 0.8)',
                    '0 0 12px rgba(239, 68, 68, 0.5)'
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5 }}
              />
            </motion.div>
          ))}
          <div className="v-s1-ann-layer-label" style={{ left: layerLeft[2], top: outputTops[1] + nodeSize + 15 }}>
            输出层
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="v-s1-ann-legend">
        <div className="v-s1-ann-legend-item">
          <div className="v-s1-ann-legend-dot v-s1-ann-legend-input"></div>
          <span>输入层</span>
        </div>
        <div className="v-s1-ann-legend-item">
          <div className="v-s1-ann-legend-dot v-s1-ann-legend-hidden"></div>
          <span>隐藏层</span>
        </div>
        <div className="v-s1-ann-legend-item">
          <div className="v-s1-ann-legend-dot v-s1-ann-legend-output"></div>
          <span>输出层</span>
        </div>
      </div>
    </motion.div>
  );
};

const Stage2Visual = () => {
  return (
    <motion.div
      className="v-s2-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="v-s2-evolution">
        {/* RNN 结构 */}
        <motion.div
          className="v-s2-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <svg viewBox="0 0 300 220" className="v-s2-svg">
            {/* 标题 */}
            <text x="150" y="22" textAnchor="middle" fill="#374151" fontSize="15" fontWeight="700">RNN</text>

            {/* 主循环框 */}
            <rect x="55" y="35" width="200" height="130" rx="14"
              fill="rgba(59, 130, 246, 0.06)" stroke="#3b82f6" strokeWidth="2.5"/>

            {/* 输入 x_t */}
            <rect x="8" y="85" width="48" height="36" rx="6"
              fill="#fff1f2" stroke="#f43f5e" strokeWidth="2"/>
            <text x="32" y="107" textAnchor="middle" fill="#be123c" fontSize="13" fontWeight="600">xₜ</text>
            <motion.line x1="56" y1="103" x2="75" y2="103"
              stroke="#6b7280" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }} markerEnd="url(#arr)"/>

            {/* tanh 激活 */}
            <rect x="95" y="70" width="70" height="52" rx="8"
              fill="#fef9c3" stroke="#ca8a04" strokeWidth="2"/>
            <text x="130" y="100" textAnchor="middle" fill="#a16207" fontSize="16" fontWeight="600">tanh</text>

            {/* h_t-1 循环输入 */}
            <rect x="8" y="135" width="48" height="36" rx="6"
              fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
            <text x="32" y="157" textAnchor="middle" fill="#1d4ed8" fontSize="12" fontWeight="600">hₜ₋₁</text>
            <motion.line x1="56" y1="153" x2="95" y2="115"
              stroke="#6b7280" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}/>

            {/* h_t 输出 */}
            <motion.path d="M 165 70 L 165 48 L 280 48"
              stroke="#10b981" strokeWidth="2" fill="none"
              strokeDasharray="6,3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}/>
            <polygon points="275,43 285,48 275,53" fill="#10b981"/>
            <text x="222" y="42" textAnchor="middle" fill="#059669" fontSize="12" fontWeight="600">hₜ</text>

            {/* y_t 输出 */}
            <rect x="255" y="85" width="42" height="32" rx="5"
              fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
            <text x="276" y="105" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="600">yₜ</text>
            <line x1="165" y1="96" x2="255" y2="101" stroke="#6b7280" strokeWidth="1.5"/>

            {/* 循环箭头 */}
            <motion.path
              d="M 255 110 Q 275 110 275 135 Q 275 155 255 155"
              fill="none" stroke="#8b5cf6" strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0.3, 1, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* 权重标注 */}
            <line x1="42" y1="153" x2="42" y2="115" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,2"/>
            <text x="37" y="138" textAnchor="middle" fill="#9ca3af" fontSize="9">W</text>

            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#6b7280"/>
              </marker>
            </defs>
          </svg>

          <div className="v-s2-caption">图 2.5 RNN 循环结构</div>
        </motion.div>

        {/* 中间箭头 */}
        <motion.div
          className="v-s2-arrow-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <div className="v-s2-arrow-line"></div>
          <span className="v-s2-arrow-text">1997</span>
        </motion.div>

        {/* LSTM 结构 */}
        <motion.div
          className="v-s2-card v-s2-card-lstm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <svg viewBox="0 0 300 220" className="v-s2-svg">
            {/* 标题 */}
            <text x="150" y="22" textAnchor="middle" fill="#374151" fontSize="15" fontWeight="700">LSTM</text>

            {/* 主框 */}
            <rect x="45" y="35" width="220" height="160" rx="14"
              fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" strokeWidth="2.5"/>

            {/* 细胞状态线 C_t */}
            <motion.line x1="55" y1="115" x2="255" y2="115"
              stroke="#10b981" strokeWidth="4" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}/>
            <text x="155" y="106" textAnchor="middle" fill="#059669" fontSize="12" fontWeight="600">Cₜ</text>

            {/* x_t 输入 */}
            <rect x="8" y="50" width="38" height="30" rx="5"
              fill="#fff1f2" stroke="#f43f5e" strokeWidth="2"/>
            <text x="27" y="69" textAnchor="middle" fill="#be123c" fontSize="12" fontWeight="600">xₜ</text>
            <line x1="46" y1="65" x2="60" y2="65" stroke="#6b7280" strokeWidth="1.5"/>

            {/* h_t-1 输入 */}
            <rect x="8" y="145" width="38" height="30" rx="5"
              fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
            <text x="27" y="164" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="600">hₜ₋₁</text>
            <line x1="46" y1="160" x2="60" y2="160" stroke="#6b7280" strokeWidth="1.5"/>

            {/* 输入汇聚虚线 */}
            <line x1="46" y1="65" x2="46" y2="160" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,2"/>

            {/* 遗忘门 */}
            <rect x="65" y="70" width="42" height="65" rx="7"
              fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="2"/>
            <text x="86" y="106" textAnchor="middle" fill="#dc2626" fontSize="17" fontWeight="700">σ</text>
            <motion.line x1="86" y1="135" x2="86" y2="115"
              stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}/>
            {/* × 运算 */}
            <line x1="74" y1="123" x2="98" y2="137" stroke="#ef4444" strokeWidth="2"/>
            <line x1="98" y1="123" x2="74" y2="137" stroke="#ef4444" strokeWidth="2"/>

            {/* 输入门 */}
            <rect x="115" y="70" width="42" height="42" rx="7"
              fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="2"/>
            <text x="136" y="95" textAnchor="middle" fill="#059669" fontSize="17" fontWeight="700">σ</text>

            {/* tanh */}
            <rect x="115" y="115" width="42" height="42" rx="7"
              fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeWidth="2"/>
            <text x="136" y="140" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="600">tanh</text>

            {/* + 运算 */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <circle cx="200" cy="115" r="13" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2"/>
              <line x1="193" y1="115" x2="207" y2="115" stroke="#10b981" strokeWidth="2"/>
              <line x1="200" y1="108" x2="200" y2="122" stroke="#10b981" strokeWidth="2"/>
            </motion.g>

            {/* 输出门 */}
            <rect x="172" y="78" width="42" height="38" rx="7"
              fill="rgba(59, 130, 246, 0.12)" stroke="#3b82f6" strokeWidth="2"/>
            <text x="193" y="100" textAnchor="middle" fill="#2563eb" fontSize="17" fontWeight="700">σ</text>
            <motion.line x1="193" y1="78" x2="193" y2="58"
              stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}/>

            {/* 输出 h_t */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <line x1="214" y1="97" x2="214" y2="48" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="214" y1="48" x2="275" y2="48" stroke="#3b82f6" strokeWidth="2"/>
              <text x="244" y="42" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="600">hₜ</text>
            </motion.g>

            {/* C_t-1 输入 */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <line x1="55" y1="115" x2="65" y2="115" stroke="#10b981" strokeWidth="2"/>
              <text x="60" y="108" textAnchor="middle" fill="#10b981" fontSize="9">Cₜ₋₁</text>
            </motion.g>

            {/* C_t 输出 */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <line x1="220" y1="115" x2="245" y2="115" stroke="#10b981" strokeWidth="2"/>
              <rect x="245" y="105" width="26" height="22" rx="4" fill="#10b981"/>
              <text x="258" y="120" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">Cₜ</text>
            </motion.g>
          </svg>

          <div className="v-s2-caption">图 2.6 LSTM 单元结构</div>
        </motion.div>
      </div>

      {/* 底部时间演进 */}
      <motion.div
        className="v-s2-timeline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="v-s2-time">1986</span>
        <div className="v-s2-time-line">
          <motion.div
            className="v-s2-time-progress"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.9 }}
          ></motion.div>
        </div>
        <span className="v-s2-time v-s2-time-active">1997</span>
      </motion.div>
    </motion.div>
  );
};

const Stage3Visual = () => (
  <motion.div
    className="v-s3-wrapper"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8, type: "spring" }}
  >
    <motion.div
      className="v-s3-grid"
      whileHover={{ rotateX: 20, rotateY: -15, scale: 1.05 }}
      style={{ transformStyle: 'preserve-3d', transition: 'all 0.4s ease' }}
    >
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="v-s3-cell"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.01 }}
          whileHover={{ backgroundColor: '#bfdbfe', scale: 1.2, zIndex: 10 }}
        />
      ))}
      <motion.div
        className="v-s3-scanner"
        animate={{
          x: [0, 36 * 7, 36 * 7, 0, 0],
          y: [0, 0, 36 * 4, 36 * 4, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', top: 8, left: 8, width: 32*3 + 8, height: 32*3 + 8, border: '3px solid #3b82f6', borderRadius: 6, background: 'rgba(59,130,246,0.1)', boxShadow: '0 0 30px rgba(59,130,246,0.4)', pointerEvents: 'none' }}
      />
    </motion.div>
    <motion.div
      className="v-s3-lbl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      Convolutional Window (Local Receptive Field)
    </motion.div>
  </motion.div>
);

const Stage4Visual = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20, mass: 1 };
  const smoothX = useSpring(mx, springConfig);
  const smoothY = useSpring(my, springConfig);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(xPct);
    my.set(yPct);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={wrapperRef}
      className="v-s4-wrapper"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="v-s4-paper"
        style={{ rotateX, rotateY }}
      >
        <div className="v-s4-conf">31st Conference on Neural Information Processing Systems (NIPS 2017), Long Beach, CA, USA.</div>
        <motion.div
          className="v-s4-p-title"
          animate={{ color: ["#000", "#1d4ed8", "#9333ea", "#000"] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          Attention Is All You Need
        </motion.div>
        <div className="v-s4-authors">
          <div className="v-s4-author-col">
            <strong>Ashish Vaswani*</strong><br/>Google Brain<br/>avaswani@google.com
          </div>
          <div className="v-s4-author-col">
            <strong>Noam Shazeer*</strong><br/>Google Brain<br/>noam@google.com
          </div>
          <div className="v-s4-author-col">
            <strong>Niki Parmar*</strong><br/>Google Research<br/>nikip@google.com
          </div>
          <div className="v-s4-author-col">
            <strong>Jakob Uszkoreit*</strong><br/>Google Research<br/>usz@google.com
          </div>
        </div>
        <div className="v-s4-abstract">
          <h4>Abstract</h4>
          <p>
            The dominant sequence transduction models are based on complex recurrent or
            convolutional neural networks that include an encoder and a decoder. The best
            performing models also connect the encoder and decoder through an attention
            mechanism. We propose a new simple network architecture, the Transformer,
            based solely on attention mechanisms, dispensing with recurrence and convolutions
            entirely...
          </p>
        </div>
        <motion.div
          className="v-s4-highlight"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }}
        />
      </motion.div>
      <motion.div
        className="v-s4-glow"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default function OriginChapter({
  showHints,
  onRequestChapterNav,
  requestedPageIndex = 0,
  onPageChange,
}: ChapterComponentProps) {
  const [step, setStep] = useState(() => Math.max(-1, Math.min(requestedPageIndex - 1, TOTAL_STEPS - 1)));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => { onPageChange?.(step + 1); }, [step, onPageChange]);
  useEffect(() => { setStep(Math.max(-1, Math.min(requestedPageIndex - 1, TOTAL_STEPS - 1))); }, [requestedPageIndex]);

  const advance = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), []);
  const retreat = useCallback(() => setStep((s) => Math.max(s - 1, -1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); retreat(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, retreat]);

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
        p1.x += p1.vx; p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, 0.15)`;
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

  const isIntro = step === -1;

  return (
    <div className="tl-root">
      <div className="attention-grid-bg" />
      <div className="ambient-glow"></div>
      <div className="ambient-glow-corner" id="glow-nlp"></div>
      <div className="ambient-glow-corner" id="glow-cv"></div>

      {timelineData.map((evt, i) => {
        const isActive = i === step;
        const years = evt.year.split('–').map(y => y.trim());
        let topYear = evt.year;
        let bottomYear = evt.year;

        if (years.length >= 2) {
          topYear = years[0];
          bottomYear = years[1] || years[0];
        }

        return (
          <div key={`watermark-${evt.id}`} className={`tl-watermark-layer ${isActive ? 'is-active' : ''}`}>
            <div className="tl-watermark-top-left">{topYear}</div>
            <div className="tl-watermark-bottom-right">{bottomYear}</div>
          </div>
        );
      })}

      <canvas ref={canvasRef} className="tl-canvas" />

      <div className="tls-viewport">
        <div className={`tls-stage tls-intro-stage ${isIntro ? 'is-active' : ''}`}>
          <div className="tls-intro-kicker">1950s — 2017</div>
          <h1 className="tls-intro-title">
            Attention<br/>的必然诞生
          </h1>
          <p className="tls-intro-sub">
            横跨半个世纪，解密大模型前传：机器是如何学会"抓重点"的？
          </p>
          <button className="tls-intro-btn" onClick={advance}>开启推演探索 ›</button>
        </div>

        {timelineData.map((evt, i) => {
          const isActive = i === step;
          return (
            <div key={evt.id} className={`tls-stage ${isActive ? 'is-active' : ''}`}>
              <div className="tls-left">
                <div className={`tls-badge tls-bdg-${evt.track}`}>{evt.badge} | {evt.year}</div>
                <h2 className="tls-title">{evt.title}</h2>
                <div className={`tls-causal tls-cs-${evt.causalType}`}>
                  <div className="tls-clbl">{evt.causalLabel}</div>
                </div>
                <div className="tls-content">{evt.content}</div>
                <div className="tls-desc">{evt.desc}</div>
                <motion.div className="tls-formula" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  {evt.formulaTag && <div className="tls-f-tag">{evt.formulaTag}</div>}
                  <div className="tls-latex">
                    <Latex>{`$$${evt.formula}$$`}</Latex>
                  </div>
                </motion.div>
              </div>
              <div className="tls-right">
                {i === 0 && isActive && <Stage1Visual />}
                {i === 1 && isActive && <Stage2Visual />}
                {i === 2 && isActive && <Stage3Visual />}
                {i === 3 && isActive && <Stage4Visual />}
              </div>
            </div>
          );
        })}
      </div>

      {showHints && (
        <>
          <div className="tl-ctrl">
            <button className="tl-cbtn" onClick={retreat} disabled={step < 0}>‹ 溯源</button>
            <button className="tl-cbtn" onClick={advance} disabled={step >= TOTAL_STEPS - 1}>演进 ›</button>
          </div>
          <div className="tl-hintbadge">Space / 左 右箭头</div>
          <button className="tl-navtopbtn" onClick={onRequestChapterNav}>
            章节目录
          </button>
        </>
      )}
    </div>
  );
}
