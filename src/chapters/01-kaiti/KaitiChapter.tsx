import { AnimatePresence, motion } from 'framer-motion';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChapterComponentProps } from '../catalog';
import { type DemoIcon, type KaitiGifItem, kaitiGifItems } from './chapter-data';
import './KaitiChapter.css';

type ModalStatus = 'loading' | 'playing' | 'stopped';
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

function captureImageToCanvas(image: HTMLImageElement, canvas: HTMLCanvasElement) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  if (!width || !height) {
    return false;
  }

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    return false;
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return true;
}

function KaitiGifCard({
  item,
  showHints,
  onOpen,
}: {
  item: KaitiGifItem;
  showHints: boolean;
  onOpen: () => void;
}) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frozenReady, setFrozenReady] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) {
      return undefined;
    }

    let cancelled = false;

    const captureFirstFrame = () => {
      if (cancelled) {
        return;
      }

      const captured = captureImageToCanvas(image, canvas);
      if (captured) {
        setFrozenReady(true);
      }
    };

    const scheduleCapture = () => {
      requestAnimationFrame(() => requestAnimationFrame(captureFirstFrame));
    };

    if (image.complete && image.naturalWidth > 0) {
      scheduleCapture();
    } else {
      image.addEventListener('load', scheduleCapture, { once: true });
    }

    return () => {
      cancelled = true;
      image.removeEventListener('load', scheduleCapture);
    };
  }, [item.src]);

  const iconClass = item.id === 'text' ? 'kaiti-icon-text' : item.id === 'image' ? 'kaiti-icon-image' : 'kaiti-icon-video';

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <button type="button" className="kaiti-gif-card" onClick={onOpen} onKeyDown={handleKeyDown}>
      <div className="kaiti-card-header">
        <div className={`kaiti-card-icon ${iconClass}`}>
          <ChapterIcon icon={item.id} />
        </div>

        <div>
          <div className="kaiti-card-title">{item.title}</div>
          <div className="kaiti-card-subtitle">{item.subtitle}</div>
        </div>
      </div>

      <div className="kaiti-gif-frame">
        <img
          ref={imageRef}
          src={item.src}
          alt={item.title}
          style={{ visibility: frozenReady ? 'hidden' : 'visible' }}
        />
        <canvas ref={canvasRef} aria-hidden="true" style={{ opacity: frozenReady ? 1 : 0 }} />
        {showHints ? (
          <div className="kaiti-play-hint">
            <div className="kaiti-play-icon">▶</div>
          </div>
        ) : null}
      </div>

      {showHints ? (
        <div className="kaiti-status-row">
          <span className="kaiti-status-badge">
            <span className="kaiti-status-dot" />点击播放
          </span>
        </div>
      ) : null}
    </button>
  );
}

export default function KaitiChapter({ showHints, onRequestChapterNav, requestedPageIndex = 0, onPageChange }: ChapterComponentProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [pageDirection, setPageDirection] = useState<1 | -1>(1);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalStatus, setModalStatus] = useState<ModalStatus>('loading');
  const [modalSource, setModalSource] = useState('');
  const [progressActive, setProgressActive] = useState(false);
  const [progressDuration, setProgressDuration] = useState(0);
  const [modalFrozen, setModalFrozen] = useState(false);
  const coverCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalImageRef = useRef<HTMLImageElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const pageRef = useRef(0);
  const stepRef = useRef(0);

  const activeItem = modalIndex === null ? null : kaitiGifItems[modalIndex];
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

  const clearPlaybackTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

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
    if (modalIndex !== null) {
      return;
    }

    const pageIndex = pageRef.current;
    const stepIndex = stepRef.current;
    const maxStep = PAGE_META[pageIndex].maxStep;

    if (stepIndex < maxStep) {
      setCurrentStep(stepIndex + 1);
      return;
    }

    if (pageIndex < PAGE_META.length - 1) {
      goToPage(pageIndex + 1, 1, 0);
    }
  }, [goToPage, modalIndex]);

  const retreatStep = useCallback(() => {
    if (modalIndex !== null) {
      return;
    }

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
  }, [goToPage, modalIndex]);

  const goToNextPage = useCallback(() => {
    if (modalIndex !== null) {
      return;
    }

    const pageIndex = pageRef.current;
    if (pageIndex < PAGE_META.length - 1) {
      goToPage(pageIndex + 1, 1, 0);
    }
  }, [goToPage, modalIndex]);

  const goToPreviousPage = useCallback(() => {
    if (modalIndex !== null) {
      return;
    }

    const pageIndex = pageRef.current;
    if (pageIndex > 0) {
      const previousPage = pageIndex - 1;
      goToPage(previousPage, -1, PAGE_META[previousPage].maxStep);
    }
  }, [goToPage, modalIndex]);

  const stopPlayback = useCallback(() => {
    clearPlaybackTimer();

    const image = modalImageRef.current;
    const canvas = modalCanvasRef.current;
    if (image && canvas && captureImageToCanvas(image, canvas)) {
      setModalFrozen(true);
    }

    setModalStatus('stopped');
  }, [clearPlaybackTimer]);

  const beginPlayback = useCallback(
    (index: number) => {
      const item = kaitiGifItems[index];
      if (!item) {
        return;
      }

      clearPlaybackTimer();
      setModalIndex(index);
      setModalStatus('loading');
      setModalSource(`${item.src}?t=${Date.now()}`);
      setProgressDuration(item.duration);
      setProgressActive(false);
      setModalFrozen(false);
    },
    [clearPlaybackTimer],
  );

  const handleModalImageLoad = useCallback(() => {
    if (!activeItem) {
      return;
    }

    setModalFrozen(false);
    setModalStatus('playing');
    requestAnimationFrame(() => setProgressActive(true));
    timerRef.current = window.setTimeout(stopPlayback, activeItem.duration);
  }, [activeItem, stopPlayback]);

  const closeModal = useCallback(() => {
    clearPlaybackTimer();
    setModalIndex(null);
    setModalSource('');
    setProgressActive(false);
    setModalFrozen(false);
  }, [clearPlaybackTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (modalIndex !== null) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeModal();
        }

        if (event.key === 'ArrowLeft' && modalIndex > 0) {
          event.preventDefault();
          beginPlayback(modalIndex - 1);
        }

        if (event.key === 'ArrowRight' && modalIndex < kaitiGifItems.length - 1) {
          event.preventDefault();
          beginPlayback(modalIndex + 1);
        }

        return;
      }

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
  }, [advanceStep, beginPlayback, closeModal, goToNextPage, goToPreviousPage, modalIndex, retreatStep]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, [modalIndex]);

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

  const modalBadgeClass =
    modalStatus === 'loading'
      ? 'kaiti-modal-badge kaiti-modal-badge-loading'
      : modalStatus === 'playing'
        ? 'kaiti-modal-badge kaiti-modal-badge-playing'
        : 'kaiti-modal-badge kaiti-modal-badge-stopped';

  const modalBadgeText = modalStatus === 'loading' ? '加载中…' : modalStatus === 'playing' ? '播放中' : '已播完';

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
          {demoStage >= 1 ? (
            <motion.div
              key="demo-grid"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="kaiti-stage-demo-body"
            >
              <div className="kaiti-gif-grid">
                {kaitiGifItems.map((item, index) => (
                  <KaitiGifCard
                    key={item.id}
                    item={item}
                    showHints={showHints}
                    onOpen={() => beginPlayback(index)}
                  />
                ))}
              </div>
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
  }, [beginPlayback, currentPage, demoStage, goToPage, onRequestChapterNav, pageDirection, showHints]);

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

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            key="modal"
            className="kaiti-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              className="kaiti-modal-box"
              initial={{ opacity: 0, y: 22, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 250, damping: 24 }}
            >
              <button
                type="button"
                className="kaiti-modal-nav kaiti-modal-nav-prev"
                onClick={() => modalIndex !== null && beginPlayback(modalIndex - 1)}
                disabled={modalIndex === 0}
                aria-label="上一个演示"
              >
                ‹
              </button>
              <button
                type="button"
                className="kaiti-modal-nav kaiti-modal-nav-next"
                onClick={() => modalIndex !== null && beginPlayback(modalIndex + 1)}
                disabled={modalIndex === kaitiGifItems.length - 1}
                aria-label="下一个演示"
              >
                ›
              </button>

              <div className="kaiti-modal-header">
                <div className="kaiti-modal-title-wrap">
                  <div
                    className={[
                      'kaiti-modal-icon',
                      activeItem.id === 'text'
                        ? 'kaiti-icon-text'
                        : activeItem.id === 'image'
                          ? 'kaiti-icon-image'
                          : 'kaiti-icon-video',
                    ].join(' ')}
                  >
                    <ChapterIcon icon={activeItem.id} />
                  </div>
                  <div>
                    <div className="kaiti-card-title">{activeItem.title}</div>
                    <div className="kaiti-card-subtitle">{activeItem.subtitle}</div>
                  </div>
                </div>

                <button type="button" className="kaiti-modal-close" onClick={closeModal} aria-label="关闭播放弹窗">
                  ✕
                </button>
              </div>

              <div className="kaiti-modal-media">
                <img
                  ref={modalImageRef}
                  src={modalSource}
                  alt={activeItem.title}
                  onLoad={handleModalImageLoad}
                  style={{ visibility: modalFrozen ? 'hidden' : 'visible' }}
                />
                <canvas ref={modalCanvasRef} aria-hidden="true" style={{ opacity: modalFrozen ? 1 : 0 }} />
                <div
                  className={progressActive ? 'kaiti-modal-progress kaiti-modal-progress-running' : 'kaiti-modal-progress'}
                  style={{ transition: progressActive ? `width ${progressDuration}ms linear` : 'none' }}
                />
              </div>

              <div className="kaiti-modal-footer mt-4">
                <div className="kaiti-modal-dots">
                  {kaitiGifItems.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className={index === modalIndex ? 'kaiti-modal-dot kaiti-modal-dot-active' : 'kaiti-modal-dot'}
                      onClick={() => beginPlayback(index)}
                      aria-label={`切换到${item.title}`}
                    />
                  ))}
                </div>

                <div className="kaiti-modal-actions">
                  <span className={modalBadgeClass}>
                    <span className={modalStatus === 'stopped' ? 'kaiti-status-dot' : 'kaiti-status-dot kaiti-modal-dot-pulse'} />
                    {modalBadgeText}
                  </span>

                  {modalStatus === 'stopped' ? (
                    <button type="button" className="kaiti-modal-replay" onClick={() => modalIndex !== null && beginPlayback(modalIndex)}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      重新播放
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}