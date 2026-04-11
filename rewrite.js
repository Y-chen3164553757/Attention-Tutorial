const fs = require('fs');
let code = fs.readFileSync('src/chapters/03-attention/AttentionChapter.tsx', 'utf-8');

const canvasEffectCode = \  const canvasRef = useRef<HTMLCanvasElement>(null);
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
            ctx.strokeStyle = \gba(148, 163, 184, \)\;
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

  const advance = useCallback(() => {\;

code = code.replace(/  const advance = useCallback\(\(\) => \{/, canvasEffectCode);

code = code.replace(
  /<div className=\"a-amb\" \/>\\s*<div className=\"a-amb-grid\" \/>/,
  \\\t<div className=\"attention-grid-bg\" />\\n\\t\\t<div className=\"ambient-glow\" id=\"glow-nlp\"></div>\\n\\t\\t<div className=\"ambient-glow\" id=\"glow-cv\"></div>\\n\\t\\t<canvas ref={canvasRef} className=\"tl-canvas\" />\
);

if(!code.includes('useRef')) {
  code = code.replace(/import React, \\{ (.*?)\\} from 'react';/, \"import React, { useRef, \} from 'react';\");
}

fs.writeFileSync('src/chapters/03-attention/AttentionChapter.tsx', code);
console.log('Successfully injected canvas and grid backgrounds.');
