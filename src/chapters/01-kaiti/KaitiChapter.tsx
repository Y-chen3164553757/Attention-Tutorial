import { AnimatePresence, motion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChapterComponentProps } from '../catalog';
import { type DemoIcon, type KaitiGifItem, kaitiGifItems } from './chapter-data';
import './KaitiChapter.css';

const PAGE_META = [
  { id: 'intro', title: '开题', maxStep: 0 },
  { id: 'demo', title: '能力演示', maxStep: 2 },
] as const;

function ChapterIcon({ icon }: { icon: DemoIcon }) {
  if (icon === 'text') {
    return (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    );
  }

  if (icon === 'image') {
    return (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    );
  }

  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function KaitiGifCard({
  item,
  isFullscreen,
}: {
  item: KaitiGifItem;
  isFullscreen: boolean;
}) {
  const iconClass = item.id === 'text' ? 'kaiti-icon-text' : item.id === 'image' ? 'kaiti-icon-image' : 'kaiti-icon-video';

  return (
    <motion.div layout className="kaiti-auto-gif">
      <motion.div layout="position" className="kaiti-auto-gif-header">
        <div className={`kaiti-card-icon ${iconClass}`}>
          <ChapterIcon icon={item.id} />
        </div>
        <div>
          <div className="kaiti-auto-gif-title">{item.title}</div>
          <div className="kaiti-auto-gif-subtitle">{item.subtitle}</div>
        </div>
      </motion.div>

      <motion.div layout="position" className="kaiti-auto-gif-media">
        <img
          src={item.src}
          alt={item.title}
        />
      </motion.div>

      {isFullscreen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kaiti-gif-playing">
          <span className="kaiti-gif-playing-dot" />
          AI 生成中
        </motion.div>
      )}
    </motion.div>
  );
}

export default function KaitiChapter({ showHints, onRequestChapterNav, requestedPageIndex = 0, onPageChange }: ChapterComponentProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [pageDirection, setPageDirection] = useState<1 | -1>(1);
  const coverCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pageRef = useRef(0);
  const stepRef = useRef(0);

  const activePageMeta = PAGE_META[currentPage];

  useEffect(() => {
    pageRef.current = currentPage;
    stepRef.current = currentStep;
  }, [currentPage, currentStep]);

  useEffect(() => {
    const nextPageIndex = Math.min(Math.max(requestedPageIndex, 0), PAGE_META.length - 1);
    setCurrentPage(nextPageIndex);
    setCurrentStep(0);
  }, [requestedPageIndex]);

  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage, onPageChange]);

  const goToPage = useCallback((pageIndex: number, direction: 1 | -1, targetStep?: number) => {
    const nextMeta = PAGE_META[pageIndex];
    if (!nextMeta) {
      return;
    }

    setPageDirection(direction);
    setCurrentPage(pageIndex);
    setCurrentStep(targetStep ?? 0);
  }, []);

  const advanceStep = useCallback(() => {
    const pageIndex = pageRef.current;
    const stepIndex = stepRef.current;
    const maxStep = PAGE_META[pageIndex].maxStep;

    if (stepIndex < maxStep) {
      setCurrentStep(stepIndex + 1);
      return;
    }

    if (pageIndex < PAGE_META.length - 1) {
      goToPage(pageIndex + 1, 1, 0);
    } else {
      onRequestChapterNav?.();
    }
  }, [goToPage, onRequestChapterNav]);

  const retreatStep = useCallback(() => {
    const pageIndex = pageRef.current;
    const stepIndex = stepRef.current;

    if (stepIndex > 0) {
      setCurrentStep(stepIndex - 1);
      return;
    }

    if (pageIndex > 0) {
      const previousPage = pageIndex - 1;
      goToPage(previousPage, -1, PAGE_META[previousPage].maxStep);
    }
  }, [goToPage]);

  const goToNextPage = useCallback(() => {
    const pageIndex = pageRef.current;
    if (pageIndex < PAGE_META.length - 1) {
      goToPage(pageIndex + 1, 1, 0);
    } else {
      onRequestChapterNav?.();
    }
  }, [goToPage, onRequestChapterNav]);

  const goToPreviousPage = useCallback(() => {
    const pageIndex = pageRef.current;
    if (pageIndex > 0) {
      const previousPage = pageIndex - 1;
      goToPage(previousPage, -1, PAGE_META[previousPage].maxStep);
    }
  }, [goToPage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        advanceStep();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        retreatStep();
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        goToNextPage();
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        goToPreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceStep, goToNextPage, goToPreviousPage, retreatStep]);

  useEffect(() => {
    const canvas = coverCanvasRef.current;
    if (!canvas || currentPage !== 0) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return undefined;
    }

    const particles = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0012,
      vy: (Math.random() - 0.5) * 0.0012,
      size: 1 + Math.random() * 2.6,
    }));

    let animationFrame = 0;

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * window.devicePixelRatio;
      canvas.height = clientHeight * window.devicePixelRatio;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const render = () => {
      const { clientWidth, clientHeight } = canvas;
      context.clearRect(0, 0, clientWidth, clientHeight);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= 1) {
          particle.vx *= -1;
        }

        if (particle.y <= 0 || particle.y >= 1) {
          particle.vy *= -1;
        }
      });

      particles.forEach((leftParticle, leftIndex) => {
        const leftX = leftParticle.x * clientWidth;
        const leftY = leftParticle.y * clientHeight;

        context.beginPath();
        context.fillStyle = 'rgba(3, 105, 161, 0.22)';
        context.arc(leftX, leftY, leftParticle.size, 0, Math.PI * 2);
        context.fill();

        for (let index = leftIndex + 1; index < particles.length; index += 1) {
          const rightParticle = particles[index];
          const rightX = rightParticle.x * clientWidth;
          const rightY = rightParticle.y * clientHeight;
          const distance = Math.hypot(leftX - rightX, leftY - rightY);

          if (distance < 180) {
            context.beginPath();
            context.strokeStyle = `rgba(3, 105, 161, ${0.15 - distance / 1800})`;
            context.lineWidth = 1;
            context.moveTo(leftX, leftY);
            context.lineTo(rightX, rightY);
            context.stroke();
          }
        }
      });

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [currentPage]);

  const demoStage = currentPage === 1 ? currentStep : 0;

  const pageContent = useMemo(() => {
    if (currentPage === 0) {
      return (
        <motion.div
          key="page-intro"
          initial={{ opacity: 0, x: pageDirection > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: pageDirection > 0 ? -30 : 30 }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="kaiti-cover-page"
        >
          <canvas ref={coverCanvasRef} className="kaiti-cover-canvas" />
          <div className="kaiti-cover-grid" />
          <div className="kaiti-cover-glow" />
          <div className="kaiti-cover-rule-left" />
          <div className="kaiti-cover-rule-right" />
          <div className="kaiti-cover-scan" />

          <div className="kaiti-cover-inner">
            <div className="kaiti-cover-ref">
              <span>VASWANI ET AL. · NIPS 2017</span> · ATTENTION IS ALL YOU NEED
            </div>

            <h1 className="kaiti-cover-title">
              <span className="kaiti-cover-title-line">
                <span className="kaiti-cover-title-grad">万物皆 Token</span>
              </span>
              <span className="kaiti-cover-title-line">注意力机制驱动的 AI 生成能力 — 开题答辩 · 2026</span>
            </h1>

            <div className="kaiti-cover-signal">TITLE SEQUENCE · ATTENTION FOCUSING</div>

            <p className="kaiti-cover-desc">
              从<em>文字</em>到<em>图像</em>、从<em>图像</em>到<em>视频</em>，
              <br />
              一套注意力机制，统御所有模态的生成边界
            </p>

            <div className="kaiti-cover-sep" />

            <button type="button" className="kaiti-cover-cta" onClick={() => goToPage(1, 1, 0)}>
              开始演示
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {showHints ? (
            <div className="kaiti-cover-footnote">
              按 <span className="kaiti-kbd">→</span> 进入能力演示
            </div>
          ) : null}
        </motion.div>
      );
    }

    return (
      <motion.div
        key="page-demo"
        initial={{ opacity: 0, x: pageDirection > 0 ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: pageDirection > 0 ? -30 : 30 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="kaiti-stage-panel kaiti-stage-panel-demo-page"
      >
        <motion.div
          className="kaiti-stage-header"
          animate={{
            y: demoStage === 0 ? 164 : 0,
            scale: demoStage === 0 ? 1.02 : 0.94,
            opacity: demoStage === 1 ? 0 : 1,
            pointerEvents: demoStage === 1 ? 'none' : 'auto'
          }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="kaiti-eyebrow">AI Capability Demo · 能力演示</div>
          <h1 className="kaiti-display-title">
            <span className="kaiti-grad">AI 生成能力演示</span>
          </h1>
          <div className="kaiti-accent-rule" />
          <div className="mt-2 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[linear-gradient(90deg,transparent,rgba(3,105,161,.4),transparent)]" />
            <span className="kaiti-body-text text-[.95rem]">文字 · 图像 · 视频</span>
            <div className="h-px w-16 bg-[linear-gradient(90deg,rgba(3,105,161,.4),transparent)]" />
          </div>
        </motion.div>

        <AnimatePresence>
          {demoStage >= 0 ? (
            <motion.div
              layout
              key="demo-grid"
              initial={{ opacity: 0, y: 22 }}
              animate={{ 
                opacity: demoStage === 0 ? 0 : 1, 
                y: demoStage === 0 ? 22 : 0,
                pointerEvents: demoStage === 0 ? 'none' : 'auto'
              }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="kaiti-stage-demo-body"
            >
              <motion.div layout className={demoStage === 1 ? 'kaiti-fullscreen-gifs' : 'kaiti-gif-grid'}>
                {kaitiGifItems.map((item) => (
                  <KaitiGifCard
                    key={item.id}
                    item={item}
                    isFullscreen={demoStage === 1}
                  />
                ))}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {demoStage >= 2 ? (
            <motion.div
              key="demo-explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.46, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="kaiti-principle-card kaiti-principle-card-wide kaiti-stage-explore"
            >
              <div className="kaiti-principle-question">这些能力从何而来？</div>
              <p className="kaiti-principle-desc">
                当文字、图像、视频都能被稳定生成，真正值得追问的问题就不再是“它会不会做”，而是“它为什么能做到”。
                <br />
                接下来进入注意力机制与 Transformer 的核心解释。
              </p>
              <button type="button" className="kaiti-cta" onClick={onRequestChapterNav}>
                ✦ 探索注意力机制
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    );
  }, [currentPage, demoStage, goToPage, onRequestChapterNav, pageDirection]);

  return (
    <div className="kaiti-root">
      <div className="kaiti-amb" />
      <div className="kaiti-amb-grid" />

      {showHints ? <div className="kaiti-slide-num">{currentPage + 1} / {PAGE_META.length}</div> : null}

      {showHints ? (
        <div className="kaiti-nav">
          <button type="button" className="kaiti-nav-btn" onClick={goToPreviousPage} disabled={currentPage === 0}>
            ↑ 翻回
          </button>
          <button type="button" className="kaiti-nav-btn" onClick={retreatStep}>
            ← 步退
          </button>
          <div className="kaiti-nav-center">
            <div className="kaiti-nav-dots">
              {PAGE_META.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  className={index === currentPage ? 'kaiti-nav-dot kaiti-nav-dot-active' : 'kaiti-nav-dot'}
                  onClick={() => goToPage(index, index > currentPage ? 1 : -1, index < currentPage ? PAGE_META[index].maxStep : 0)}
                  aria-label={`切换到${page.title}`}
                />
              ))}
            </div>
            <div className="kaiti-nav-readout">{activePageMeta.title} · Step {currentStep + 1}/{activePageMeta.maxStep + 1}</div>
          </div>
          <button type="button" className="kaiti-nav-btn" onClick={advanceStep}>
            步进 →
          </button>
          <button
            type="button"
            className="kaiti-nav-btn"
            onClick={goToNextPage}
            disabled={currentPage === PAGE_META.length - 1}
          >
            翻页 ↓
          </button>
        </div>
      ) : null}

      <div className="kaiti-deck">
        <div className="kaiti-slide-shell kaiti-single-stage">
          <AnimatePresence mode="wait">{pageContent}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}