import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

import type { ChapterComponentProps } from '../catalog';
import { scalingData } from './chapter-data';
import './Chapter05.css';

/* ══════════════════════════════════════════
   可靠图标组件：本地优先 + 错误 SVG 回退
══════════════════════════════════════════ */
const ICON_FALLBACKS: Record<string, string> = {
  'deepseek-color.png': 'DS',
  'qwen-color.png': '通',
  'kimi-color.png': 'K',
  'zhipu-color.png': '智',
  'doubao-color.png': '豆',
  'openai.png': 'OA',
  'claude-color.png': 'C',
  'gemini-color.png': 'G',
  'meta-color.png': 'M',
  'grok.png': 'x',
};

const ModelIcon = ({ icon, name }: { icon: string; name: string }) => {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fallback = ICON_FALLBACKS[icon] || name.charAt(0).toUpperCase();
  return (
    <div className="ch5-s3-icon-box">
      {errored ? (
        <div className="ch5-s3-icon-fallback">{fallback}</div>
      ) : (
        <img
          src={`/AI_tubiao/${icon}`}
          alt={name}
          style={{ opacity: loaded ? 1 : 0 }}
          onError={() => setErrored(true)}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   Stage 1 · 2018-2023 · 左右布局（保持原样）
══════════════════════════════════════════ */

/* OpenAI Logo */
const OpenAILogo = ({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.103 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.3927-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.5081 2.6002 1.5081v3.0204l-2.5955 1.5033-2.6067-1.5033z" />
  </svg>
);

/* 单个 GPT 模型卡片 */
const GPTModelCard = ({
  name, params, year, tag, desc, color, bg, border, glow,
  logo, highlight, delay,
}: {
  name: string; params: string; year: string; tag: string; desc: string;
  color: string; bg: string; border: string; glow: boolean;
  logo: React.ReactNode; highlight?: boolean; delay: number;
}) => (
  <motion.div
    className={`gpt-card ${highlight ? 'is-highlight' : ''}`}
    style={{ '--c': color, '--bg': bg, '--bd': border, '--glow': glow } as React.CSSProperties}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    whileHover={{ scale: 1.05, y: -4 }}
  >
    <div className="gpt-card-logo">{logo}</div>
    <div className="gpt-card-tag">{tag}</div>
    <div className="gpt-card-name">{name}</div>
    <div className="gpt-card-params">{params}</div>
    <div className="gpt-card-desc">{desc}</div>
    <div className="gpt-card-year">{year}</div>
    {highlight && <div className="gpt-card-pulse" />}
  </motion.div>
);

/* 右侧 GPT 演进可视化 */
const GPTEvolutionVisual = () => {
  const models = [
    {
      name: 'GPT-1', params: '1.17 亿参数', year: '2018', tag: '预训练验证',
      desc: '无监督预训练\n+ 有监督微调',
      color: '#94a3b8', bg: 'rgba(148,163,184,0.07)', border: 'rgba(148,163,184,0.25)',
      glow: false, logo: <OpenAILogo size={26} color="#94a3b8" />,
      highlight: false, delay: 0.1,
    },
    {
      name: 'GPT-2', params: '15 亿参数', year: '2019', tag: '泛化初现',
      desc: '无需微调\n提示即完成',
      color: '#818cf8', bg: 'rgba(129,140,248,0.07)', border: 'rgba(129,140,248,0.28)',
      glow: false, logo: <OpenAILogo size={26} color="#818cf8" />,
      highlight: false, delay: 0.2,
    },
    {
      name: 'GPT-3', params: '1750 亿参数', year: '2020', tag: '零样本涌现',
      desc: '语境学习\n举一反三',
      color: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.4)',
      glow: true, logo: <OpenAILogo size={26} color="#a855f7" />,
      highlight: true, delay: 0.3,
    },
    {
      name: 'ChatGPT', params: '+ RLHF', year: '2022', tag: '对齐突破',
      desc: '听懂指令\n有益且无害',
      color: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.38)',
      glow: true, logo: <OpenAILogo size={26} color="#10b981" />,
      highlight: true, delay: 0.4,
    },
  ];

  return (
    <motion.div
      className="gpt-evo-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <div className="gpt-evo-watermark">LLM</div>

      <motion.div className="gpt-evo-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="gpt-evo-header-title">大语言模型三代跃迁</div>
        <div className="gpt-evo-header-sub">Parameter Explosion · Emergence · Alignment</div>
      </motion.div>

      <motion.div className="gpt-evo-timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="gpt-evo-timeline-line">
          <motion.div className="gpt-evo-timeline-progress" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }} />
        </div>
        {['2018', '2019', '2020', '2022'].map((y, i) => (
          <motion.div key={y} className="gpt-evo-timeline-node" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}>
            <div className="gpt-evo-timeline-dot" />
            <div className="gpt-evo-timeline-label">{y}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="gpt-evo-cards-row">
        {models.map((m, idx) => (
          <div key={m.name} className="gpt-evo-card-wrapper">
            <GPTModelCard {...m} />
            {idx < models.length - 1 && (
              <motion.div className="gpt-evo-arrow-wrapper" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.5 + idx * 0.2, type: 'spring' }}>
                <svg width="28" height="12" viewBox="0 0 28 12">
                  <line x1="0" y1="6" x2="22" y2="6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeDasharray={idx === 2 ? 'none' : '4,3'} />
                  <polygon points="22,2 28,6 22,10" fill="#000000" />
                </svg>
                <div className="gpt-evo-arrow-label">
                  {idx === 0 ? '×14' : idx === 1 ? '×117' : '对齐'}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div className="gpt-evo-scale-facts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <div className="gpt-evo-scale-item">
          <div className="gpt-evo-scale-num" style={{ color: '#a855f7' }}>100×</div>
          <div className="gpt-evo-scale-desc">GPT-2 → GPT-3<br />参数增长倍数</div>
        </div>
        <div className="gpt-evo-scale-divider" />
        <div className="gpt-evo-scale-item">
          <div className="gpt-evo-scale-num" style={{ color: '#10b981' }}>5天</div>
          <div className="gpt-evo-scale-desc">ChatGPT 上线<br />用户破百万</div>
        </div>
        <div className="gpt-evo-scale-divider" />
        <div className="gpt-evo-scale-item">
          <div className="gpt-evo-scale-num" style={{ color: '#818cf8' }}>2个月</div>
          <div className="gpt-evo-scale-desc">达到 1 亿用户<br />人类历史最快</div>
        </div>
      </motion.div>

      <motion.div className="gpt-evo-rlhf" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, type: 'spring' }}>
        <div className="gpt-evo-rlhf-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div className="gpt-evo-rlhf-label">Alignment Breakthrough · 2022</div>
          <div className="gpt-evo-rlhf-name">RLHF：人类反馈强化学习</div>
          <div className="gpt-evo-rlhf-eq">预训练（预测下一个词） + 强化学习（对齐意图）= 听懂指令的 ChatGPT</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   Stage 2 · 2023-2026 · 辐射关系图
══════════════════════════════════════════ */

/* 图标组件映射 */
const IconComponent = ({ icon }: { icon: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'fa-solid fa-shapes': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    'fa-solid fa-brain': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a9 9 0 0 1 9 9c0 3.1-1.6 5.8-4 7.4V21a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2.6C4.6 16.8 3 14.1 3 11a9 9 0 0 1 9-9zm0 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V19h8v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z" />
      </svg>
    ),
    'fa-solid fa-magnifying-glass-chart': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
    'fa-solid fa-network-wired': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    'fa-solid fa-earth-americas': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    'fa-solid fa-microchip': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h12v16H6V4zm2 2v12h8V6H8zm2 2h4v2h-4V8zm0 4h4v2h-4v-2z"/>
      </svg>
    ),
  };
  return <>{iconMap[icon] || <span>{icon}</span>}</>;
};

/* 卫星节点卡片 */
const SatelliteNode = ({
  icon, title, subtitle, desc, metric, metricVal, targetX, targetY, delay,
  onLineRef,
}: {
  icon: string; title: string; subtitle: string; desc: string;
  metric: string; metricVal: string; targetX: number; targetY: number;
  delay: number;
  onLineRef: (el: SVGGElement | null, idx: number) => void;
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={nodeRef}
        className="ch5-s2-sat"
        style={{
          transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px))`,
        }}
        data-delay={delay}
        data-target-x={targetX}
        data-target-y={targetY}
      >
        <div className="ch5-s2-card-header">
          <div className="ch5-s2-card-icon">
            <IconComponent icon={icon} />
          </div>
          <div>
            <div className="ch5-s2-card-title">{title}</div>
            <div className="ch5-s2-card-sub">{subtitle}</div>
          </div>
        </div>
        <div className="ch5-s2-card-desc">{desc}</div>
        <div className="ch5-s2-card-metric">
          <span>{metric}</span>
          <span className="ch5-s2-metric-val">{metricVal}</span>
        </div>
      </div>
    </>
  );
};

/* Stage 2 主组件 */
const Stage2 = ({ year }: { year: string }) => {
  const [hubLoaded, setHubLoaded] = useState(false);
  const [linesLoaded, setLinesLoaded] = useState(false);
  const [satsLoaded, setSatsLoaded] = useState(false);
  const [lines, setLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; active: boolean; length: number }>>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const universeRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const satRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef<number>(0);

  const satNodes = scalingData[1].satNodes || [];

  // 阶段动画：中心 → 连线 → 卫星
  useEffect(() => {
    const t1 = setTimeout(() => setHubLoaded(true), 300);
    const t2 = setTimeout(() => setLinesLoaded(true), 700);
    const t3 = setTimeout(() => setSatsLoaded(true), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // 动态更新连线（当 hub 加载后才开始追踪位置）
  useEffect(() => {
    if (!hubLoaded) return;

    const updateLines = () => {
      if (!universeRef.current || !hubRef.current) {
        animRef.current = requestAnimationFrame(updateLines);
        return;
      }

      const uniRect = universeRef.current.getBoundingClientRect();
      const hubRect = hubRef.current.getBoundingClientRect();

      const hubX = hubRect.left + hubRect.width / 2 - uniRect.left;
      const hubY = hubRect.top + hubRect.height / 2 - uniRect.top;

      const newLines = satNodes.map((node, i) => {
        const satEl = satRefs.current[i];
        const x2 = satEl ? satEl.getBoundingClientRect().left + satEl.getBoundingClientRect().width / 2 - uniRect.left : hubX;
        const y2 = satEl ? satEl.getBoundingClientRect().top + satEl.getBoundingClientRect().height / 2 - uniRect.top : hubY;
        const dx = x2 - hubX;
        const dy = y2 - hubY;
        const length = Math.sqrt(dx * dx + dy * dy);

        return { x1: hubX, y1: hubY, x2, y2, active: hoveredIdx === i, length };
      });

      setLines(newLines);
      animRef.current = requestAnimationFrame(updateLines);
    };

    animRef.current = requestAnimationFrame(updateLines);
    return () => cancelAnimationFrame(animRef.current);
  }, [hubLoaded, satNodes, hoveredIdx]);

  return (
    <div className="ch5-s2-root">
      {/* 背景层：与 Stage 1 统一 */}
      <div className="ch5-grid-bg" />
      <div className="ch5-ambient" />
      <div className="ch5-ambient-center" />

      {/* 背景水印年份 */}
      <div className="ch5-watermark is-active">
        <div className="ch5-wm-tl">2023</div>
        <div className="ch5-wm-br">2026</div>
      </div>

      <canvas className="ch5-canvas" />

      {/* 顶部标题 */}
      <div className="ch5-s2-header">
        <div className="ch5-s2-eyebrow">ATTENTION ERA: {year}</div>
        <h1 className="ch5-s2-title">
          <span className="ch5-s2-title-grad">Attention</span> 的全维度衍生与底层重构
        </h1>
        <p className="ch5-s2-subtitle">
          自 2017 年 Transformer 论文发布后，Attention 机制持续演进：<br />
          多模态融合、超长上下文、稀疏计算、显存压缩等方向相继突破，<br />
          驱动大模型能力边界的不断扩展。
        </p>
      </div>

      {/* 宇宙中心区域 */}
      <div className="ch5-s2-universe" ref={universeRef}>
        {/* SVG 连线 */}
        <svg className="ch5-s2-svg" style={{ opacity: linesLoaded ? 1 : 0, transition: 'opacity 0.4s ease-out' }}>
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className={`ch5-s2-line ${line.active ? 'highlight' : ''}`}
              style={{
                strokeDasharray: line.length,
                strokeDashoffset: linesLoaded ? 0 : line.length,
                transition: `stroke-dashoffset 0.6s ${i * 80}ms ease-out, opacity 0.3s ease-out`,
              }}
            />
          ))}
        </svg>

        {/* 中心节点 */}
        <div
          ref={hubRef}
          className={`ch5-s2-hub ${hubLoaded ? 'loaded' : ''}`}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0.6)' }}
        >
          <div className="ch5-s2-hub-ring" />
          <div className="ch5-s2-hub-ring-2" />
          <div className="ch5-s2-hub-ring-outer" />
          <div className="ch5-s2-hub-glow" />
          <div className="ch5-s2-hub-inner">
            <div className="ch5-s2-hub-title">Attention</div>
            <div className="ch5-s2-hub-formula">
              <Latex>{`$$ \\text{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V $$`}</Latex>
            </div>
          </div>
        </div>

        {/* 卫星节点 */}
        {satNodes.map((node, i) => (
          <div
            key={i}
            ref={(el) => { satRefs.current[i] = el; }}
            className={`ch5-s2-sat ${satsLoaded ? 'loaded' : ''}`}
            style={{
              transform: `translate(calc(-50% + ${node.targetX}px), calc(-50% + ${node.targetY}px))`,
              transitionDelay: satsLoaded ? `${i * 150}ms` : '0ms',
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="ch5-s2-card-header">
              <div className="ch5-s2-card-icon">
                <IconComponent icon={node.icon} />
              </div>
              <div>
                <div className="ch5-s2-card-title">{node.title}</div>
                <div className="ch5-s2-card-sub">{node.subtitle}</div>
              </div>
            </div>
            <div className="ch5-s2-card-desc">{node.desc}</div>
            <div className="ch5-s2-card-metric">
              <span>{node.metric}</span>
              <span className="ch5-s2-metric-val">{node.metricVal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Stage 3 · 2024-2026 · 全球 AI 生态双峰对决
═══════════════════════════════════════════════════════ */
const Stage3 = ({ year }: { year: string }) => {
  const models = scalingData[2].modelCards || [];
  const chinaModels = models.filter(m => m.faction === 'china');
  const usModels = models.filter(m => m.faction === 'us');

  const [cardsLoaded, setCardsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCardsLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ch5-s3-root">
      {/* 背景层：DeepSeek 深色风格：青+紫粒子背景 */}
      <div className="ch5-grid-bg" />
      <div className="ch5-ambient" />
      <div className="ch5-ambient-center" />

      {/* 背景水印年份：2023-2026 */}
      <div className="ch5-watermark is-active">
        <div className="ch5-wm-tl">2023</div>
        <div className="ch5-wm-br">2026</div>
      </div>

      <canvas className="ch5-canvas" />

      {/* 顶部标题 */}
      <div className="ch5-s3-header">
        <div className="ch5-s3-eyebrow">GLOBAL RIVALRY · 2026.1 – 2026.5</div>
        <h1 className="ch5-s3-title">
          大模型生态<span className="ch5-s3-title-cn">双峰对决</span>
        </h1>
      </div>

      {/* 对决舞台 */}
      <div className="ch5-s3-battlefield">
        {/* 中国阵营 */}
        <div className="ch5-s3-faction china">
          <div className="ch5-s3-faction-title">
            <div className="ch5-s3-faction-name">中国开源生态</div>
            <div className="ch5-s3-faction-sub">BOTTOM-UP INNOVATION</div>
          </div>
          <div className="ch5-s3-model-list">
            {chinaModels.map((model, i) => (
              <div
                key={model.name}
                className={`ch5-s3-model-card ${model.special ? 'is-special' : ''} ${cardsLoaded ? 'loaded' : ''}`}
                style={{ transitionDelay: cardsLoaded ? `${200 + i * 120}ms` : '0ms' }}
              >
                {/* 卡片头部：图标 + 品牌名 */}
                <div className="ch5-s3-card-head">
                  <div className="ch5-s3-icon-box">
                    <ModelIcon icon={model.icon} name={model.name} />
                  </div>
                  <div className="ch5-s3-card-identity">
                    <div className="ch5-s3-model-name">{model.name}</div>
                    <div className="ch5-s3-model-tag">{model.tag}</div>
                  </div>
                </div>
                {/* 版本时间线 */}
                <div className="ch5-s3-timeline">
                  {model.versions.map((v, vi) => (
                    <div key={v.name} className={`ch5-s3-tl-item ${v.highlight ? 'is-hl' : ''}`}
                         style={{ transitionDelay: `${vi * 60}ms` }}>
                      <div className="ch5-s3-tl-dot" />
                      <div className="ch5-s3-tl-date">{v.date}</div>
                      <div className="ch5-s3-tl-name">{v.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VS 中央分割线 */}
        <div className="ch5-s3-vs-divider">
          <div className="ch5-s3-vs-line" />
          <div className="ch5-s3-vs-badge">VS</div>
          <div className="ch5-s3-vs-line" />
        </div>

        {/* 美国阵营 */}
        <div className="ch5-s3-faction us">
          <div className="ch5-s3-faction-title">
            <div className="ch5-s3-faction-name">硅谷算力高墙</div>
            <div className="ch5-s3-faction-sub">COMPUTE MONOPOLY</div>
          </div>
          <div className="ch5-s3-model-list">
            {usModels.map((model, i) => (
              <div
                key={model.name}
                className={`ch5-s3-model-card ${cardsLoaded ? 'loaded' : ''}`}
                style={{ transitionDelay: cardsLoaded ? `${200 + i * 120}ms` : '0ms' }}
              >
                {/* 卡片头部：图标 + 品牌名 */}
                <div className="ch5-s3-card-head">
                  <div className="ch5-s3-icon-box">
                    <ModelIcon icon={model.icon} name={model.name} />
                  </div>
                  <div className="ch5-s3-card-identity">
                    <div className="ch5-s3-model-name">{model.name}</div>
                    <div className="ch5-s3-model-tag">{model.tag}</div>
                  </div>
                </div>
                {/* 版本时间线 */}
                <div className="ch5-s3-timeline">
                  {model.versions.map((v, vi) => (
                    <div key={v.name} className={`ch5-s3-tl-item ${v.highlight ? 'is-hl' : ''}`}
                         style={{ transitionDelay: `${vi * 60}ms` }}>
                      <div className="ch5-s3-tl-dot" />
                      <div className="ch5-s3-tl-date">{v.date}</div>
                      <div className="ch5-s3-tl-name">{v.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Stage 4 · 2024-2026 · DeepSeek 破壁时刻
═══════════════════════════════════════════════════════ */

const Stage4 = ({ year }: { year: string }) => {
  const data = scalingData[3]; // Stage 4 data
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);
  const techCanvasRef = useRef<HTMLCanvasElement>(null);
  const techAnimRef = useRef<number>(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const stats = data.stats || [];
  const compareRows = data.compareRows || [];
  const milestones = data.milestones || [];
  const techCards = data.techCards || [];

  // Global particle canvas (cyan/purple, like HTML)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(0, 229, 255, 0.4)' : 'rgba(176, 38, 255, 0.3)',
      z: Math.random() * 2,
    }));

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let offsetX = 0, offsetY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const render = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const targetX = (window.innerWidth / 2 - mouseX) * 0.05;
      const targetY = (window.innerHeight / 2 - mouseY) * 0.05;
      offsetX += (targetX - offsetX) * 0.1;
      offsetY += (targetY - offsetY) * 0.1;

      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p1 = ps[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas!.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas!.height) p1.vy *= -1;

        const px = p1.x + offsetX * p1.z;
        const py = p1.y + offsetY * p1.z;

        ctx!.beginPath();
        ctx!.arc(px, py, p1.r, 0, Math.PI * 2);
        ctx!.fillStyle = p1.color;
        ctx!.fill();
      }
      requestRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Tech engine canvas animation (central core with orbiting nodes)
  useEffect(() => {
    const canvas = techCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement!.offsetWidth;
      canvas.height = canvas.parentElement!.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodePositions = [
      { x: 0.15, y: 0.3 },  // top-left
      { x: 0.15, y: 0.78 }, // bottom-left
      { x: 0.85, y: 0.33 }, // top-right
      { x: 0.85, y: 0.78 }, // bottom-right
    ];

    const satellites = Array.from({ length: 6 }).map((_, i) => ({
      angle: (Math.PI * 2 / 6) * i,
      speed: 0.015,
      radius: 80,
      size: 2.5,
    }));

    let time = 0;
    let pulses: Array<{ sx: number; sy: number; tx: number; ty: number; progress: number; speed: number; color: string; width: number }> = [];

    const spawnPulse = (forceNode?: number) => {
      const idx = forceNode !== undefined ? forceNode : Math.floor(Math.random() * nodePositions.length);
      const target = nodePositions[idx];
      pulses.push({
        sx: canvas!.width / 2,
        sy: canvas!.height / 2,
        tx: target.x * canvas!.width,
        ty: target.y * canvas!.height,
        progress: 0,
        speed: 0.012 + Math.random() * 0.008,
        color: target.x < 0.5 ? '#00E5FF' : '#B026FF',
        width: 2,
      });
    };

    const drawPolygon = (cx: number, cy: number, r: number, sides: number, angleOff: number) => {
      ctx!.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = angleOff + (Math.PI * 2 / sides) * i;
        if (i === 0) ctx!.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        else ctx!.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx!.closePath();
      ctx!.stroke();
    };

    const render = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      time += 0.01;

      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2 + 20;

      ctx!.save();
      ctx!.translate(cx, cy);

      // Outer rotating hexagons
      ctx!.strokeStyle = 'rgba(0, 229, 255, 0.15)';
      ctx!.lineWidth = 1;
      drawPolygon(0, 0, 110, 6, time * 0.2);
      drawPolygon(0, 0, 95, 6, -time * 0.3);

      // Dashed orbit ring
      ctx!.rotate(time * 0.5);
      ctx!.beginPath();
      ctx!.arc(0, 0, 65, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(176, 38, 255, 0.5)';
      ctx!.setLineDash([8, 12]);
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // Inner dotted ring
      ctx!.rotate(-time * 1.2);
      ctx!.beginPath();
      ctx!.arc(0, 0, 45, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(0, 229, 255, 0.8)';
      ctx!.setLineDash([4, 4, 16, 4]);
      ctx!.lineWidth = 2.5;
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Orbiting satellites
      satellites.forEach(sat => {
        sat.angle += sat.speed;
        const sx = Math.cos(sat.angle) * sat.radius;
        const sy = Math.sin(sat.angle) * sat.radius;
        ctx!.beginPath();
        ctx!.arc(sx, sy, sat.size, 0, Math.PI * 2);
        ctx!.fillStyle = '#FFF';
        ctx!.shadowColor = '#00E5FF';
        ctx!.shadowBlur = 8;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        ctx!.beginPath();
        ctx!.moveTo(0, 0);
        ctx!.lineTo(sx, sy);
        ctx!.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      });

      // Pulsing core
      ctx!.rotate(time);
      const pulse = (Math.sin(Date.now() * 0.008) + 1) / 2;
      ctx!.beginPath();
      ctx!.arc(0, 0, 20 + pulse * 6, 0, Math.PI * 2);
      const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, 30);
      grad.addColorStop(0, '#FFF');
      grad.addColorStop(0.4, '#00E5FF');
      grad.addColorStop(1, 'rgba(0,229,255,0)');
      ctx!.fillStyle = grad;
      ctx!.fill();

      ctx!.restore();

      // Connection lines to nodes
      nodePositions.forEach((pos, idx) => {
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(pos.x * canvas!.width, pos.y * canvas!.height);
        ctx!.strokeStyle = hoveredNode === idx ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.04)';
        ctx!.lineWidth = hoveredNode === idx ? 1.5 : 1;
        ctx!.stroke();
      });

      // Spawn data pulses
      if (Math.random() < 0.06) spawnPulse();
      if (hoveredNode !== null && Math.random() < 0.25) spawnPulse(hoveredNode);

      // Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        const curX = p.sx + (p.tx - p.sx) * p.progress;
        const curY = p.sy + (p.ty - p.sy) * p.progress;

        const tailX = p.sx + (p.tx - p.sx) * Math.max(0, p.progress - 0.12);
        const tailY = p.sy + (p.ty - p.sy) * Math.max(0, p.progress - 0.12);

        ctx!.beginPath();
        ctx!.moveTo(curX, curY);
        ctx!.lineTo(tailX, tailY);
        const pg = ctx!.createLinearGradient(curX, curY, tailX, tailY);
        pg.addColorStop(0, p.color);
        pg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.strokeStyle = pg;
        ctx!.lineWidth = p.width;
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(curX, curY, p.width, 0, Math.PI * 2);
        ctx!.fillStyle = '#FFF';
        ctx!.shadowColor = p.color;
        ctx!.shadowBlur = 8;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        if (p.progress >= 1) {
          ctx!.beginPath();
          ctx!.arc(p.tx, p.ty, 8, 0, Math.PI * 2);
          ctx!.fillStyle = p.color;
          ctx!.globalAlpha = 0.5;
          ctx!.fill();
          ctx!.globalAlpha = 1;
          pulses.splice(i, 1);
        }
      }

      techAnimRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (techAnimRef.current) cancelAnimationFrame(techAnimRef.current);
    };
  }, [hoveredNode]);

  return (
    <div className="ch5-s4-root">
      {/* 统一背景层 */}
      <div className="ch5-grid-bg" />
      <div className="ch5-ambient" />
      <div className="ch5-ambient-center" />

      {/* 背景水印年份 */}
      <div className="ch5-watermark is-active">
        <div className="ch5-wm-tl">2023</div>
        <div className="ch5-wm-br">2026</div>
      </div>

      <canvas ref={canvasRef} className="ch5-canvas" />

      {/* 主仪表盘 */}
      <div className="ch5-s4-dashboard">
        {/* 顶部 Header */}
        <div className="ch5-s4-header">
          <div>
            <div className="ch5-s4-badge">Bottom-Up Innovation · 底层技术探索</div>
            <div className="ch5-s4-eyebrow">{data.eyebrow}</div>
            <div className="ch5-s4-ds-icon">
              <div className="ch5-s4-ds-logo">
                <ModelIcon icon="deepseek-color.png" name="DeepSeek" />
              </div>
              <div>
                <div className="ch5-s4-ds-name">DeepSeek</div>
                <div className="ch5-s4-ds-sub">中国智算方案 · 破壁时刻</div>
              </div>
            </div>
            <p className="ch5-s4-desc">
              通过底层架构创新优化算力效率，在保障模型性能的同时，显著降低预训练与推理成本。
            </p>
          </div>
          <div className="ch5-s4-stats">
            {stats.map((stat, i) => (
              <div key={i} className="ch5-s4-stat-item">
                <div className={`ch5-s4-stat-num ${stat.color}`}>{stat.value}</div>
                <div className="ch5-s4-stat-label">{stat.label}</div>
                <div className="ch5-s4-stat-note">{stat.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 左侧列 */}
        <div className="ch5-s4-left">
          {/* 技术路线对比 */}
          <div className="ch5-s4-panel">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#00E5FF">
                <path d="M12 2L2 7v13c0 5.55 4.84 10.74 10 12 5.16-1.26 10-6.45 10-12V7L12 2z" />
              </svg>
              技术路线特征与应用倾向对比
            </h3>
            {compareRows.map((row, i) => (
              <div key={i} className="ch5-s4-compare-row">
                <div className="ch5-s4-china">
                  {row.china}<br />
                  <span className="ch5-s4-china-sub">{row.chinaSub}</span>
                </div>
                <div className="ch5-s4-vs">VS</div>
                <div className="ch5-s4-west">
                  {row.west}<br />
                  <span className="ch5-s4-west-sub">{row.westSub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 技术演进里程碑 */}
          <div className="ch5-s4-panel">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              技术演进里程碑
            </h3>
            {milestones.map((m, i) => (
              <div key={i} className={`ch5-s4-tl-item ${m.highlight ? 'is-hl' : ''}`}>
                <div className="ch5-s4-tl-date">{m.date}</div>
                <div className="ch5-s4-tl-title">{m.title}</div>
                <div className="ch5-s4-tl-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：核心技术架构 */}
        <div className="ch5-s4-tech-panel">
          <div className="ch5-s4-tech-header">
            <h2>核心技术架构矩阵</h2>
            <p>优化大模型训练与推理流程，缓解显存与计算压力</p>
          </div>

          <div className="ch5-s4-tech-hud">
            <div className="ch5-s4-hud-item">ENGINE <span className="ch5-s4-hud-val blink">ONLINE</span></div>
            <div className="ch5-s4-hud-item">MODEL <span className="ch5-s4-hud-val">V3 / R1</span></div>
            <div className="ch5-s4-hud-item">PARAMS <span className="ch5-s4-hud-val">671B</span></div>
            <div className="ch5-s4-hud-item">ACTIVE <span className="ch5-s4-hud-val">37B</span></div>
            <div className="ch5-s4-hud-item">KV 压缩 (vs MHA) <span className="ch5-s4-hud-val">-93%</span></div>
          </div>

          {/* 技术卡片 */}
          <div className="ch5-s4-tech-nodes">
            {techCards.map((card, i) => {
              const posClass = ['ch5-s4-node-tl', 'ch5-s4-node-bl', 'ch5-s4-node-tr', 'ch5-s4-node-br'][i];
              return (
                <div
                  key={i}
                  className={`ch5-s4-tech-card ${posClass}`}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                  <div className="ch5-s4-tech-metric">
                    <span>{card.metric}</span>
                    <span className="ch5-s4-tech-metric-val">{card.metricVal}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canvas 动画 */}
          <canvas ref={techCanvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Stage 5 · 2026 · 完整模型发布序列（卡片瀑布流入场）
═══════════════════════════════════════════════════════ */

const ModelIconS5 = ({ icon, name }: { icon: string; name: string }) => {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fallbacks: Record<string, string> = {
    'deepseek-color.png': 'DS', 'qwen-color.png': '通', 'kimi-color.png': 'K',
    'zhipu-color.png': '智', 'doubao-color.png': '豆', 'openai.png': 'OA',
    'claude-color.png': 'C', 'gemini-color.png': 'G', 'meta-color.png': 'M', 'grok.png': 'x',
  };
  const fallback = fallbacks[icon] || name.charAt(0).toUpperCase();
  return errored ? (
    <div className="ch5-s5-icon-fallback">{fallback}</div>
  ) : (
    <img src={`/AI_tubiao/${icon}`} alt={name} style={{ opacity: loaded ? 1 : 0 }}
      onError={() => setErrored(true)} onLoad={() => setLoaded(true)} />
  );
};

const TimelineCardItem = ({
  card, index, total, delay,
}: {
  card: import('./chapter-data').TimelineCard;
  index: number;
  total: number;
  delay?: number;
}) => {
  const isChina = card.faction === 'china';
  return (
    <motion.div
      className={`ch5-s5-card ${isChina ? 'china' : 'us'}`}
      initial={{ opacity: 0, scale: 0.75, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: delay ?? index * 1.0,
        duration: 0.5,
        type: 'spring',
        stiffness: 180,
        damping: 20,
      }}
      style={{ '--card-color': card.color } as React.CSSProperties}
    >
      <div className="ch5-s5-card-header">
        <div className="ch5-s5-icon-box">
          <ModelIconS5 icon={card.icon} name={card.company} />
        </div>
        <div className="ch5-s5-company-info">
          <div className="ch5-s5-company">{card.company}</div>
          <div className="ch5-s5-company-en">{card.companyEn}</div>
        </div>
        <div className="ch5-s5-tag">{card.tag}</div>
      </div>

      <div className="ch5-s5-model-name">{card.model}</div>
      <div className="ch5-s5-date">{card.dateShort}</div>
      <div className="ch5-s5-desc">{card.desc}</div>

      <div className="ch5-s5-faction-bar">
        <span className="ch5-s5-faction-dot" />
        <span>{isChina ? '中国阵营' : '美国阵营'}</span>
      </div>
    </motion.div>
  );
};

const Stage5 = ({ year }: { year: string }) => {
  const data = scalingData[4];
  const cards = data.timelineCards || [];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.2 + 0.4,
      color: Math.random() > 0.5 ? 'rgba(0,229,255,0.3)' : 'rgba(176,38,255,0.25)',
    }));

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let offsetX = 0, offsetY = 0;
    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const render = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const targetX = (window.innerWidth / 2 - mouseX) * 0.04;
      const targetY = (window.innerHeight / 2 - mouseY) * 0.04;
      offsetX += (targetX - offsetX) * 0.08;
      offsetY += (targetY - offsetY) * 0.08;
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p1 = ps[i];
        p1.x += p1.vx; p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas!.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas!.height) p1.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p1.x + offsetX * (p1.r * 2), p1.y + offsetY * (p1.r * 2), p1.r, 0, Math.PI * 2);
        ctx!.fillStyle = p1.color;
        ctx!.fill();
      }
      animRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="ch5-s5-root">
      <div className="ch5-grid-bg" />
      <div className="ch5-ambient" />
      <div className="ch5-ambient-center" />
      <div className="ch5-watermark is-active">
        <div className="ch5-wm-tl">{year.split('–')[0].trim()}</div>
        <div className="ch5-wm-br">{year.split('–')[1]?.trim() || year.split('–')[0].trim()}</div>
      </div>
      <canvas ref={canvasRef} className="ch5-canvas" />

      <motion.div
        className="ch5-s5-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="ch5-s5-eyebrow">{data.eyebrow}</div>
        <h1 className="ch5-s5-title">
          <span className="ch5-s5-title-attn">Attention 的探索还在继续</span>
        </h1>
        <p className="ch5-s5-subtitle-rivalry">{data.subtitle}</p>
      </motion.div>

      <div className="ch5-s5-cards-grid">
        {cards.map((card, i) => (
          <TimelineCardItem key={card.date + card.model} card={card} index={i} total={cards.length} delay={2 + i * 1.0} />
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   主组件 · 多页面切换
══════════════════════════════════════════ */
export function Chapter05({ showHints, onRequestChapterNav, requestedPageIndex = 0 }: ChapterComponentProps) {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const nextPageIndex = Math.min(Math.max(requestedPageIndex, 0), scalingData.length - 1);
    setCurrentPage(nextPageIndex);
  }, [requestedPageIndex]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);
  const s2CanvasRef = useRef<HTMLCanvasElement>(null);
  const s2ParticlesRef = useRef<any[]>([]);
  const s2RequestRef = useRef<number>(0);

  // Stage 1 Canvas 粒子动画
  useEffect(() => {
    if (currentPage !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const render = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p1 = ps[i];
        p1.x += p1.vx; p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas!.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas!.height) p1.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(148,163,184,0.15)';
        ctx!.fill();
        for (let j = i + 1; j < ps.length; j++) {
          const p2 = ps[j];
          const d2 = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
          if (d2 < 15000) {
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(148,163,184,${(15000 - d2) / 15000 * 0.1})`;
            ctx!.stroke();
          }
        }
      }
      requestRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [currentPage]);

  // Stage 2 Canvas 粒子动画
  useEffect(() => {
    if (currentPage !== 1) return;
    const canvas = s2CanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    s2ParticlesRef.current = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.2 + 0.4,
    }));

    const render = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const ps = s2ParticlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p1 = ps[i];
        p1.x += p1.vx; p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas!.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas!.height) p1.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(3,105,161,0.12)';
        ctx!.fill();
        for (let j = i + 1; j < ps.length; j++) {
          const p2 = ps[j];
          const d2 = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
          if (d2 < 20000) {
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(3,105,161,${(20000 - d2) / 20000 * 0.08})`;
            ctx!.stroke();
          }
        }
      }
      s2RequestRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', resize);
      if (s2RequestRef.current) cancelAnimationFrame(s2RequestRef.current);
    };
  }, [currentPage]);

  // 键盘导航
  const goNext = useCallback(() => {
    if (currentPage < scalingData.length - 1) {
      setCurrentPage(p => p + 1);
    }
  }, [currentPage]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
    }
  }, [currentPage]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  const evt = scalingData[currentPage];
  const years = evt.year.split('–').map((y) => y.trim());

  // Stage 1 渲染
  if (currentPage === 0) {
    return (
      <div className="ch5-root">
        <div className="ch5-grid-bg" />
        <div className="ch5-ambient" />
        <div className="ch5-ambient-center" />

        <div className="ch5-watermark is-active">
          <div className="ch5-wm-tl">{years[0]}</div>
          <div className="ch5-wm-br">{years[1] || years[0]}</div>
        </div>

        <canvas ref={canvasRef} className="ch5-canvas" />

        <div className="ch5-viewport">
          <div className="ch5-stage is-active">
            {/* 左侧文案 */}
            <div className="ch5-left">
              <div className="ch5-badge ch5-bdg-scaling">
                {evt.badge} | {evt.year}
              </div>

              <h2 className="ch5-title">{evt.title}</h2>

              <div className="ch5-causal ch5-cs-brk">
                <div className="ch5-clbl">{evt.causalLabel}</div>
              </div>

              <div className="ch5-content">{evt.content}</div>

              <div className="ch5-quote-card">
                <div className="ch5-qc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.3 8.1C11.7 6.5 13.4 4.3 15.5 4c.7-.1 1.3.4 1.5 1 .2.7-.4 1.3-1 1.5-1.3.2-2.8 1.4-3.2 2.6l-2 .7-2-.7zM5.7 8.1C6.1 6.5 7.8 4.3 9.9 4c.7-.1 1.3.4 1.5 1 .2.7-.4 1.3-1 1.5C9.1 6.7 7.6 7.9 7.2 9.1L5.2 9.8l-2-.7zM21 21c0-3-4-4.4-4-7.5 0-1.8.8-3 1.7-3.8-.8-1.3-1.9-2.4-1.9-4.2C14.8 3.2 12.9 2 10.7 2 8 2 6 3.9 6 6.5c0 2.5 1.5 4.4 3.7 4.9-.4 1-.7 2-.7 3.1C9 17.2 6.5 19.2 3 21l2-1.5C8.8 17.8 11.4 16 12 13H9.5c-1.7 0-3-1.3-3-3s1.3-3 3-3c1.1 0 2 .6 2.5 1.5.3.4.8.7 1.3.7.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5c-.1 0-.3 0-.4.1C14.5 4.5 13 3.2 10.7 3.2 7.4 3.2 5 6.1 5 9.5c0 2.1.9 3.9 2.3 5.1C6.5 15.6 6 16.7 6 18c0 4.4 3.6 8 8 8s8-3.6 8-8l-.1-.1z"/>
                  </svg>
                </div>
                <div className="ch5-qc-text">{evt.desc}</div>
              </div>

              <div className="ch5-formula">
                {evt.formulaTag && <div className="ch5-f-tag">{evt.formulaTag}</div>}
                <div className="ch5-latex">
                  <Latex>{`$$${evt.formula}$$`}</Latex>
                </div>
              </div>
            </div>

            {/* 右侧可视化 */}
            <div className="ch5-right">
              <GPTEvolutionVisual />
            </div>
          </div>
        </div>

        {showHints && (
          <button className="ch5-navbtn" onClick={onRequestChapterNav}>
            章节目录
          </button>
        )}
      </div>
    );
  }

  // Stage 2 渲染
  if (currentPage === 1) {
    return (
      <div className="ch5-s2-root">
        <Stage2 year={evt.year} />

        {showHints && (
          <button className="ch5-navbtn" onClick={onRequestChapterNav}>
            章节目录
          </button>
        )}
      </div>
    );
  }

  // Stage 3 渲染
  if (currentPage === 2) {
    return (
      <div className="ch5-s3-wrapper">
        <Stage3 year={evt.year} />

        {showHints && (
          <button className="ch5-navbtn" onClick={onRequestChapterNav}>
            章节目录
          </button>
        )}
      </div>
    );
  }

  // Stage 4 渲染
  if (currentPage === 3) {
    return (
      <div className="ch5-s4-wrapper">
        <Stage4 year={evt.year} />

        {showHints && (
          <button className="ch5-navbtn" onClick={onRequestChapterNav}>
            章节目录
          </button>
        )}
      </div>
    );
  }

  // Stage 5 渲染：2026 模型发布完整时间轴
  return (
    <div className="ch5-s5-wrapper">
      <Stage5 year={evt.year} />

      {showHints && (
        <button className="ch5-navbtn" onClick={onRequestChapterNav}>
          章节目录
        </button>
      )}
    </div>
  );
}
