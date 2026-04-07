import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

import type { ChapterComponentProps } from '../catalog';
import { timelineData, TOTAL_STEPS } from './chapter-data';
import './OriginChapter.css';

const NODE_W = 280; // Distance between dots on the bottom track

const Stage1Visual = () => (
  <motion.div 
    className="v-s1-box"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, type: "spring" }}
  >
    <motion.div 
      className="v-s1-code"
      initial={{ y: -50, rotate: -10 }}
      animate={{ y: 0, rotate: -2 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
    >
      <span className="v-kw">if</span> (object.hasWings &amp;&amp; object.canFly) {'{\n'}
      {'  '}return <span className="v-str">"Bird"</span>;\n
      {'}'} <span className="v-kw">else if</span> (object.has... <motion.span animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="v-err">/* COMBINATORIAL EXPLOSION */</motion.span>
    </motion.div>
    <motion.div 
      className="v-s1-bp"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="v-layer">
        <motion.div className="v-node" whileHover={{ scale: 1.5, backgroundColor: "#ef4444" }}/>
        <motion.div className="v-node" whileHover={{ scale: 1.5, backgroundColor: "#ef4444" }}/>
        <motion.div className="v-node" whileHover={{ scale: 1.5, backgroundColor: "#ef4444" }}/>
      </div>
      <div className="v-layer">
        <motion.div className="v-node is-active" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}/>
        <motion.div className="v-node" whileHover={{ scale: 1.5, backgroundColor: "#ef4444" }}/>
        <motion.div className="v-node is-active" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}/>
        <motion.div className="v-node" whileHover={{ scale: 1.5, backgroundColor: "#ef4444" }}/>
      </div>
      <div className="v-layer">
        <motion.div className="v-node" whileHover={{ scale: 1.5, backgroundColor: "#ef4444" }}/>
        <motion.div className="v-node is-active" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}/>
      </div>
      <motion.div className="v-line" style={{ top: '25%', left: '30%', transform: 'rotate(25deg)', borderColor: 'var(--cv)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.5 }} />
      <motion.div className="v-line" style={{ top: '65%', left: '30%', transform: 'rotate(-15deg)', borderColor: 'var(--nlp)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.5 }} />
      <motion.div className="v-line" style={{ top: '40%', left: '65%', transform: 'rotate(10deg)', borderColor: 'var(--cv)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.5 }} />
    </motion.div>
  </motion.div>
);

const Stage2Visual = () => (
  <motion.div 
    className="v-s2-wrapper"
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="ambient-glow" id="glow-nlp"></div>
    <div className="v-s2-seq">
      {['[START]', 'x₁', 'x₂', 'x₃', '...'].map((txt, i) => (
        <div key={i} className="v-s2-col">
          <motion.div 
            className="v-s2-node v-s2-in"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.4, duration: 0.5 }}
          >{txt}</motion.div>
          <motion.div 
            className="v-s2-arrow-dn"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.4 + 0.2, duration: 0.3 }}
          >↓</motion.div>
          <motion.div 
            className="v-s2-node v-s2-hidden"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, boxShadow: ["0 0 0px #3b82f6", "0 0 20px #3b82f6", "0 0 10px #3b82f6"] }}
            transition={{ delay: i * 0.4 + 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >h_{i}</motion.div>
          {i < 4 && (
            <motion.div 
              className="v-s2-arrow-rt"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.4 + 0.6, duration: 0.4 }}
            >→</motion.div>
          )}
        </div>
      ))}
    </div>
    <motion.div 
      className="v-s2-lbl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.8, type: 'spring' }}
    >
      RNN / LSTM 串行记忆屏障
    </motion.div>
  </motion.div>
);

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

  // Very smooth spring config specifically tuned for 30fps recordings
  const springConfig = { stiffness: 50, damping: 20, mass: 1 };
  const smoothX = useSpring(mx, springConfig);
  const smoothY = useSpring(my, springConfig);

  // Subtle 3D tilt mapped from mouse position
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
  const jumpTo = useCallback((idx: number) => setStep(Math.max(-1, Math.min(idx, TOTAL_STEPS - 1))), []);

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
  const trackX = isIntro ? 0 : -(step * NODE_W);
  const progressW = isIntro ? 0 : `calc(50vw + ${step * NODE_W}px)`;

  return (
    <div className="tl-root">
      
      
      <canvas ref={canvasRef} className="tl-canvas" />

      {/* TOP VIEWPORT: FULLSCREEN SPLIT STAGES */}
      <div className="tls-viewport">
        {/* Intro */}
        <div className={`tls-stage tls-intro-stage ${isIntro ? 'is-active' : ''}`}>
          <div className="tls-intro-kicker">1950s — 2016</div>
          <h1 className="tls-intro-title">
            Attention<br/>的必然诞生
          </h1>
          <p className="tls-intro-sub">
            横跨半个世纪，解密大模型前传：机器是如何学会“抓重点”的？
          </p>
          <button className="tls-intro-btn" onClick={advance}>开启演进之旅 ›</button>
        </div>

        {/* 3 Stages */}
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

      {/* BOTTOM VIEWPORT: TIMELINE AXIS */}
      <div className="tlb-viewport">
        <motion.div 
          className="tl-track"
          animate={{ x: trackX }}
          initial={false}
          transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
        >
          <div className="tl-axis-line">
            <motion.div 
              className="tl-axis-prog" 
              animate={{ width: progressW }} 
              transition={{ duration: 0.8 }} 
            />
          </div>

          {timelineData.map((evt, i) => {
            const isActive = i === step;
            const isDone = i <= step;
            const state = isActive ? 'on' : isDone ? 'done' : 'future';
            
            return (
              <div className="tlb-node" key={evt.id} style={{ left: `calc(50vw + ${i * NODE_W}px)` }}>
                <div className={`tlb-yr ${isActive ? 'is-bold' : ''}`}>
                  {evt.year}
                </div>
                <motion.div 
                  className={`tlb-dot tlb-dot-${state} tlb-dot-trk-${evt.track}`}
                  onClick={() => jumpTo(i)}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                />
              </div>
            );
          })}
        </motion.div>
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
















