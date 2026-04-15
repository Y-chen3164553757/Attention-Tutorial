import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import type { ChapterComponentProps } from '../catalog';
import '../02-origin/OriginChapter.css';
import './AttentionChapter.css';
import { useAttentionSteps } from './hooks/useAttentionSteps';
import Slide0 from './slides/Slide0';
import Slide1 from './slides/Slide1';
import Slide2 from './slides/Slide2';

export default function AttentionChapter(props: ChapterComponentProps) {
  const { page, step, advance, retreat, getWatermarkText } = useAttentionSteps(props);

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
      <div className="ambient-glow"></div>
      <div className="ambient-glow-corner" id="glow-nlp"></div>
      <div className="ambient-glow-corner" id="glow-cv"></div>
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
            {page===2 && <Slide2 step={step} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
