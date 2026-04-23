import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

import type { ChapterComponentProps } from '../catalog';
import { scalingData } from './chapter-data';
import './Chapter05.css';

/* ─── OpenAI 官方 Logo（源自 openai.com/favicon） ─── */
const OpenAILogo = ({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.103 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.3927-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.5081 2.6002 1.5081v3.0204l-2.5955 1.5033-2.6067-1.5033z" />
  </svg>
);

/* ─── 神经节点图（参数密度递增） ─── */
const NeuralDots = ({ density, color, glow }: { density: number; color: string; glow: boolean }) => {
  // 生成伪随机的节点位置
  const nodes = Array.from({ length: density }, (_, i) => {
    const seed = i * 9301 + 49297;
    const px = ((seed % 100) / 100) * 80 + 10; // 10-90%
    const py = (((seed * 7) % 100) / 100) * 80 + 10;
    return { x: px, y: py, id: i };
  });
  // 连接近邻节点
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 25) edges.push([i, j]);
    }
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0 }}>
      {/* 连接线 */}
      {edges.map(([a, b], ei) => (
        <line
          key={ei}
          x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
          x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
          stroke={color}
          strokeWidth="0.4"
          opacity={glow ? 0.5 : 0.2}
        />
      ))}
      {/* 节点 */}
      {nodes.map((n, ni) => (
        <circle
          key={ni}
          cx={`${n.x}%`} cy={`${n.y}%`}
          r={glow && ni % 3 === 0 ? 2.5 : 1.8}
          fill={color}
          opacity={glow ? 0.9 : 0.6}
        />
      ))}
    </svg>
  );
};

/* ─── 单个 GPT 模型卡片 ─── */
const GPTModelCard = ({
  name, params, year, tag, desc, color, bg, border, glow,
  logo, density, highlight, delay,
}: {
  name: string;
  params: string;
  year: string;
  tag: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
  glow: boolean;
  logo: React.ReactNode;
  density: number;
  highlight?: boolean;
  delay: number;
}) => (
  <motion.div
    className={`gpt-card ${highlight ? 'is-highlight' : ''}`}
    style={{ '--c': color, '--bg': bg, '--bd': border, '--glow': glow } as React.CSSProperties}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    whileHover={{ scale: 1.05, y: -4 }}
  >
    {/* 神经节点层 */}
    <div className="gpt-card-dots">
      <NeuralDots density={density} color={color} glow={glow} />
    </div>

    {/* Logo */}
    <div className="gpt-card-logo">{logo}</div>

    {/* 标签 */}
    <div className="gpt-card-tag">{tag}</div>

    {/* 名称 */}
    <div className="gpt-card-name">{name}</div>

    {/* 参数 */}
    <div className="gpt-card-params">{params}</div>

    {/* 描述 */}
    <div className="gpt-card-desc">{desc}</div>

    {/* 年份 */}
    <div className="gpt-card-year">{year}</div>

    {/* 高亮点 */}
    {highlight && <div className="gpt-card-pulse" />}
  </motion.div>
);

/* ─── 右侧 GPT 演进可视化 ─── */
const GPTEvolutionVisual = () => {
  const models = [
    {
      name: 'GPT-1',
      params: '1.17 亿参数',
      year: '2018',
      tag: '预训练验证',
      desc: '无监督预训练\n+ 有监督微调',
      color: '#94a3b8',
      bg: 'rgba(148,163,184,0.07)',
      border: 'rgba(148,163,184,0.25)',
      glow: false,
      logo: <OpenAILogo size={26} color="#94a3b8" />,
      density: 18,
      highlight: false,
      delay: 0.1,
    },
    {
      name: 'GPT-2',
      params: '15 亿参数',
      year: '2019',
      tag: '泛化初现',
      desc: '无需微调\n提示即完成',
      color: '#818cf8',
      bg: 'rgba(129,140,248,0.07)',
      border: 'rgba(129,140,248,0.28)',
      glow: false,
      logo: <OpenAILogo size={26} color="#818cf8" />,
      density: 28,
      highlight: false,
      delay: 0.2,
    },
    {
      name: 'GPT-3',
      params: '1750 亿参数',
      year: '2020',
      tag: '零样本涌现',
      desc: '语境学习\n举一反三',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.08)',
      border: 'rgba(168,85,247,0.4)',
      glow: true,
      logo: <OpenAILogo size={26} color="#a855f7" />,
      density: 40,
      highlight: true,
      delay: 0.3,
    },
    {
      name: 'ChatGPT',
      params: '+ RLHF',
      year: '2022',
      tag: '对齐突破',
      desc: '听懂指令\n有益且无害',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.07)',
      border: 'rgba(16,185,129,0.38)',
      glow: true,
      logo: <OpenAILogo size={26} color="#10b981" />,
      density: 50,
      highlight: true,
      delay: 0.4,
    },
  ];

  return (
    <motion.div
      className="gpt-evo-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      {/* 背景大水印 */}
      <div className="gpt-evo-watermark">LLM</div>

      {/* 标题区 */}
      <motion.div
        className="gpt-evo-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="gpt-evo-header-title">大语言模型三代跃迁</div>
        <div className="gpt-evo-header-sub">Parameter Explosion · Emergence · Alignment</div>
      </motion.div>

      {/* 演进箭头行 */}
      <motion.div
        className="gpt-evo-timeline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* 时间轴线 */}
        <div className="gpt-evo-timeline-line">
          <motion.div
            className="gpt-evo-timeline-progress"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
        {/* 4个时间节点 */}
        {['2018', '2019', '2020', '2022'].map((y, i) => (
          <motion.div
            key={y}
            className="gpt-evo-timeline-node"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
          >
            <div className="gpt-evo-timeline-dot" />
            <div className="gpt-evo-timeline-label">{y}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* 四张模型卡片 */}
      <div className="gpt-evo-cards">
        {/* 连接箭头（卡片之间） */}
        <div className="gpt-evo-arrows">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="gpt-evo-arrow-sep"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}
            >
              <svg width="28" height="12" viewBox="0 0 28 12">
                <line x1="0" y1="6" x2="22" y2="6" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray={i === 2 ? 'none' : '4,3'} />
                <polygon points="22,2 28,6 22,10" fill="#c4b5fd" />
              </svg>
              <div className="gpt-evo-arrow-label">
                {i === 0 ? '×14' : i === 1 ? '×117' : '对齐'}
              </div>
            </motion.div>
          ))}
        </div>

        {models.map((m) => (
          <GPTModelCard key={m.name} {...m} />
        ))}
      </div>

      {/* 参数增长说明 */}
      <motion.div
        className="gpt-evo-scale-facts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
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

      {/* RLHF 对齐卡 */}
      <motion.div
        className="gpt-evo-rlhf"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, type: 'spring' }}
      >
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
   主组件
══════════════════════════════════════════ */
export function Chapter05({ showHints, onRequestChapterNav }: ChapterComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
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
  }, []);

  const evt = scalingData[0];
  const years = evt.year.split('–').map((y) => y.trim());

  return (
    <div className="ch5-root">
      <div className="ch5-grid-bg" />
      <div className="ch5-ambient" />

      <div className="ch5-watermark is-active">
        <div className="ch5-wm-tl">{years[0]}</div>
        <div className="ch5-wm-br">{years[1] || years[0]}</div>
      </div>

      <canvas ref={canvasRef} className="ch5-canvas" />

      <div className="ch5-viewport">
        <div className="ch5-stage is-active">
          {/* 左侧文案 */}
          <div className="ch5-left">
            <motion.div
              className="ch5-badge ch5-bdg-scaling"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              {evt.badge} | {evt.year}
            </motion.div>

            <motion.h2
              className="ch5-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {evt.title}
            </motion.h2>

            <motion.div
              className="ch5-causal ch5-cs-brk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <div className="ch5-clbl">{evt.causalLabel}</div>
            </motion.div>

            <motion.div
              className="ch5-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              {evt.content}
            </motion.div>

            <motion.div
              className="ch5-quote-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <div className="ch5-qc-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.3 8.1C11.7 6.5 13.4 4.3 15.5 4c.7-.1 1.3.4 1.5 1 .2.7-.4 1.3-1 1.5-1.3.2-2.8 1.4-3.2 2.6l-2 .7-2-.7zM5.7 8.1C6.1 6.5 7.8 4.3 9.9 4c.7-.1 1.3.4 1.5 1 .2.7-.4 1.3-1 1.5C9.1 6.7 7.6 7.9 7.2 9.1L5.2 9.8l-2-.7zM21 21c0-3-4-4.4-4-7.5 0-1.8.8-3 1.7-3.8-.8-1.3-1.9-2.4-1.9-4.2C14.8 3.2 12.9 2 10.7 2 8 2 6 3.9 6 6.5c0 2.5 1.5 4.4 3.7 4.9-.4 1-.7 2-.7 3.1C9 17.2 6.5 19.2 3 21l2-1.5C8.8 17.8 11.4 16 12 13H9.5c-1.7 0-3-1.3-3-3s1.3-3 3-3c1.1 0 2 .6 2.5 1.5.3.4.8.7 1.3.7.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5c-.1 0-.3 0-.4.1C14.5 4.5 13 3.2 10.7 3.2 7.4 3.2 5 6.1 5 9.5c0 2.1.9 3.9 2.3 5.1C6.5 15.6 6 16.7 6 18c0 4.4 3.6 8 8 8s8-3.6 8-8l-.1-.1z"/>
                </svg>
              </div>
              <div className="ch5-qc-text">{evt.desc}</div>
            </motion.div>

            <motion.div
              className="ch5-formula"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
              whileHover={{ scale: 1.02 }}
            >
              {evt.formulaTag && <div className="ch5-f-tag">{evt.formulaTag}</div>}
              <div className="ch5-latex">
                <Latex>{`$$${evt.formula}$$`}</Latex>
              </div>
            </motion.div>
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
