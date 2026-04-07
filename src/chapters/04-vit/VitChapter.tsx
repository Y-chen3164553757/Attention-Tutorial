import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, MouseEvent } from 'react';
import type { ChapterComponentProps } from '../catalog';
import './VitChapter.css';

const PAGE_COUNT = 5;
const PATCH_COUNT = 9;
const VS_SIZE = 7;
const MODEL_ID = 'onnx-community/dinov3-vits16-pretrain-lvd1689m-ONNX';
const EXAMPLE_IMAGE_URL = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png';
const SEMANTIC_MASK = [
  0, 0, 1, 1, 1, 0, 0,
  0, 1, 0, 0, 0, 1, 0,
  1, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 1,
  0, 1, 0, 0, 0, 1, 0,
  0, 0, 1, 1, 1, 0, 0,
];
const INFERNO: Array<[number, [number, number, number]]> = [
  [0.0, [0, 0, 4]],
  [0.1, [39, 12, 69]],
  [0.2, [84, 15, 104]],
  [0.3, [128, 31, 103]],
  [0.4, [170, 48, 88]],
  [0.5, [209, 70, 68]],
  [0.6, [240, 97, 47]],
  [0.7, [253, 138, 28]],
  [0.8, [252, 185, 26]],
  [0.9, [240, 231, 56]],
  [1.0, [252, 255, 160]],
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getInfernoColor(value: number) {
  for (let index = 1; index < INFERNO.length; index += 1) {
    const [prevT, prevColor] = INFERNO[index - 1];
    const [nextT, nextColor] = INFERNO[index];
    if (value <= nextT) {
      const factor = (value - prevT) / (nextT - prevT);
      const red = prevColor[0] + factor * (nextColor[0] - prevColor[0]);
      const green = prevColor[1] + factor * (nextColor[1] - prevColor[1]);
      const blue = prevColor[2] + factor * (nextColor[2] - prevColor[2]);
      return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
    }
  }
  return 'rgb(252,255,160)';
}

export default function VitChapter({
  showHints,
  onRequestChapterNav,
  requestedPageIndex = 0,
  onPageChange,
}: ChapterComponentProps) {
  const [page, setPage] = useState(() => clamp(requestedPageIndex, 0, PAGE_COUNT - 1));
  const [direction, setDirection] = useState<1 | -1>(1);
  const [patchStage, setPatchStage] = useState<'initial' | 'sliced' | 'flattened' | 'positioned'>('initial');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [status, setStatus] = useState('正在等待加载浏览器 AI 引擎...');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isOverlayMode, setIsOverlayMode] = useState(true);
  const [hasImage, setHasImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const pageRef = useRef(page);
  const initStartedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const transformersRef = useRef<any>(null);
  const extractorRef = useRef<any>(null);
  const patchSizeRef = useRef<number | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const similarityScoresRef = useRef<number[][] | null>(null);
  const lastHoverRef = useRef<{ queryIndex: number; allPatches: Array<{ score: number; index: number }> } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointerEventRef = useRef<MouseEvent<HTMLCanvasElement> | null>(null);
  const maxPixelsRef = useRef(2097152);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const target = clamp(requestedPageIndex, 0, PAGE_COUNT - 1);
    setDirection(target >= pageRef.current ? 1 : -1);
    setPage(target);
  }, [requestedPageIndex]);

  useEffect(() => {
    onPageChange?.(page);
  }, [onPageChange, page]);

  const goToPage = useCallback((next: number) => {
    const clamped = clamp(next, 0, PAGE_COUNT - 1);
    setDirection(clamped >= pageRef.current ? 1 : -1);
    setPage(clamped);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        goToPage(pageRef.current + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPage(pageRef.current - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToPage]);

  useEffect(() => {
    if (page !== 4 || initStartedRef.current) {
      return;
    }

    initStartedRef.current = true;
    let cancelled = false;

    const initModel = async () => {
      try {
        setIsModelLoading(true);
        const module = await import('@huggingface/transformers');
        if (cancelled) {
          return;
        }
        transformersRef.current = module;
        const isWebGpuSupported = typeof navigator !== 'undefined' && 'gpu' in navigator;
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        maxPixelsRef.current = isMobile ? 1048576 : 2097152;
        const device = isWebGpuSupported ? 'webgpu' : 'wasm';
        const dtype = isWebGpuSupported ? 'q4' : 'q8';
        setStatus(`正在加载 AI 模型（${device.toUpperCase()}）...`);
        const extractor = await module.pipeline('image-feature-extraction', MODEL_ID, { device, dtype });
        if (cancelled) {
          return;
        }
        const extractorAny = extractor as any;
        extractorAny.processor.image_processor.do_resize = false;
        extractorRef.current = extractor;
        patchSizeRef.current = extractorAny.model.config.patch_size;
        setIsModelReady(true);
        setStatus('模型已就绪。请选择示例图或上传图片。');
      } catch (error) {
        console.error(error);
        setStatus('模型加载失败，请稍后重试。');
      } finally {
        if (!cancelled) {
          setIsModelLoading(false);
        }
      }
    };

    void initModel();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const clearHighlights = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    pointerEventRef.current = null;
    lastHoverRef.current = null;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context && originalImageRef.current) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  const drawHighlights = useCallback((queryIndex: number, allPatches: Array<{ score: number; index: number }>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const patchSize = patchSizeRef.current;
    if (!canvas || !context || !originalImageRef.current || !patchSize) {
      return;
    }

    const patchesPerRow = canvas.width / patchSize;
    if (isOverlayMode) {
      context.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
      context.fillStyle = 'rgba(0, 0, 0, 0.65)';
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      context.fillStyle = getInfernoColor(0);
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (allPatches.length > 0) {
      const values = allPatches.map((patch) => patch.score);
      const minScore = Math.min(...values);
      const maxScore = Math.max(...values);
      const range = maxScore - minScore;

      allPatches.forEach((patch) => {
        if (patch.index === queryIndex) {
          return;
        }
        const normalized = range > 0.0001 ? (patch.score - minScore) / range : 1;
        const patchY = Math.floor(patch.index / patchesPerRow);
        const patchX = patch.index % patchesPerRow;
        context.fillStyle = isOverlayMode
          ? `rgba(255, 255, 255, ${Math.pow(normalized, 2) * 0.85})`
          : getInfernoColor(normalized);
        context.fillRect(patchX * patchSize, patchY * patchSize, patchSize, patchSize);
      });
    }

    const queryY = Math.floor(queryIndex / patchesPerRow);
    const queryX = queryIndex % patchesPerRow;
    context.strokeStyle = isOverlayMode ? 'rgba(129, 188, 255, 0.9)' : 'cyan';
    context.lineWidth = 2;
    context.strokeRect(queryX * patchSize, queryY * patchSize, patchSize, patchSize);
  }, [isOverlayMode]);

  useEffect(() => {
    if (lastHoverRef.current) {
      drawHighlights(lastHoverRef.current.queryIndex, lastHoverRef.current.allPatches);
    } else if (hasImage) {
      clearHighlights();
    }
  }, [clearHighlights, drawHighlights, hasImage, isOverlayMode]);

  const processImage = useCallback(async () => {
    const canvas = canvasRef.current;
    const extractor = extractorRef.current;
    const module = transformersRef.current;
    if (!canvas || !extractor || !module) {
      return;
    }

    try {
      setStatus('AI 正在本地计算 ViT 全局注意力特征...');
      setIsModelLoading(true);
      similarityScoresRef.current = null;
      lastHoverRef.current = null;
      const imageData = await module.RawImage.fromCanvas(canvas);
      const features = await extractor(imageData, { pooling: 'none' });
      const numRegisterTokens = extractor.model.config.num_register_tokens ?? 0;
      const startIndex = 1 + numRegisterTokens;
      const patchFeatures = features.slice(null, [startIndex, null]);
      const normalized = patchFeatures.normalize(2, -1);
      const scores = await module.matmul(normalized, normalized.permute(0, 2, 1));
      similarityScoresRef.current = (await scores.tolist())[0];
      setStatus(`分析完成。尺寸 ${canvas.width} × ${canvas.height}，可直接悬停查看注意力。`);
    } catch (error) {
      console.error(error);
      setStatus('处理图片时出现错误，请换一张图片再试。');
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  const loadImageOntoCanvas = useCallback(async (imageUrl: string) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const dropzone = dropzoneRef.current;
    const patchSize = patchSizeRef.current;
    if (!canvas || !context || !dropzone || !patchSize) {
      setStatus('模型尚未准备完成，请稍后再试。');
      return;
    }

    const image = new Image();
    image.onload = async () => {
      const containerWidth = dropzone.clientWidth - 20;
      const containerHeight = dropzone.clientHeight - 20;
      let scale = Math.min(containerWidth / image.naturalWidth, containerHeight / image.naturalHeight);
      if (scale > 1) {
        scale = 1;
      }
      let nextWidth = image.naturalWidth * scale;
      let nextHeight = image.naturalHeight * scale;
      const numPixels = nextWidth * nextHeight;
      if (numPixels > maxPixelsRef.current) {
        const shrinkRatio = Math.sqrt(maxPixelsRef.current / numPixels);
        nextWidth *= shrinkRatio;
        nextHeight *= shrinkRatio;
      }

      const croppedWidth = Math.floor(nextWidth / patchSize) * patchSize;
      const croppedHeight = Math.floor(nextHeight / patchSize) * patchSize;
      if (croppedWidth < patchSize || croppedHeight < patchSize) {
        setStatus('图片缩放后过小，无法处理。');
        return;
      }

      canvas.width = croppedWidth;
      canvas.height = croppedHeight;
      context.clearRect(0, 0, croppedWidth, croppedHeight);
      context.drawImage(image, 0, 0, croppedWidth, croppedHeight);
      originalImageRef.current = image;
      setHasImage(true);
      await processImage();
    };
    image.src = imageUrl;
  }, [processImage]);

  const handleExample = useCallback(async () => {
    try {
      setStatus('正在下载示例图片...');
      setIsModelLoading(true);
      const response = await fetch(EXAMPLE_IMAGE_URL);
      const blob = await response.blob();
      await loadImageOntoCanvas(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      setStatus('加载示例图片失败。');
      setIsModelLoading(false);
    }
  }, [loadImageOntoCanvas]);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await loadImageOntoCanvas(URL.createObjectURL(file));
  }, [loadImageOntoCanvas]);

  const handleDrop = useCallback(async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    await loadImageOntoCanvas(URL.createObjectURL(file));
  }, [loadImageOntoCanvas]);

  const handleCanvasMove = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    pointerEventRef.current = event;
    if (animationFrameRef.current !== null) {
      return;
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;
      const canvas = canvasRef.current;
      const scores = similarityScoresRef.current;
      const patchSize = patchSizeRef.current;
      if (!canvas || !scores || !patchSize || !pointerEventRef.current) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (pointerEventRef.current.clientX - rect.left) * scaleX;
      const y = (pointerEventRef.current.clientY - rect.top) * scaleY;
      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
        return;
      }
      const patchesPerRow = canvas.width / patchSize;
      const patchX = Math.floor(x / patchSize);
      const patchY = Math.floor(y / patchSize);
      const queryIndex = patchY * patchesPerRow + patchX;
      if (queryIndex < 0 || queryIndex >= scores.length || !scores[queryIndex]) {
        return;
      }
      const allPatches = Array.from(scores[queryIndex]).map((score, index) => ({ score, index }));
      lastHoverRef.current = { queryIndex, allPatches };
      drawHighlights(queryIndex, allPatches);
    });
  }, [drawHighlights]);

  const cnnActiveSet = useMemo(() => {
    if (hoverIndex === null) {
      return new Set<number>();
    }
    const cx = hoverIndex % VS_SIZE;
    const cy = Math.floor(hoverIndex / VS_SIZE);
    const set = new Set<number>();
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && nx < VS_SIZE && ny >= 0 && ny < VS_SIZE) {
          set.add(ny * VS_SIZE + nx);
        }
      }
    }
    return set;
  }, [hoverIndex]);

  const vitRelatedSet = useMemo(() => {
    if (hoverIndex === null) {
      return new Set<number>();
    }
    const isTarget = SEMANTIC_MASK[hoverIndex] === 1;
    const set = new Set<number>();
    SEMANTIC_MASK.forEach((value, index) => {
      if (index === hoverIndex) {
        return;
      }
      if (isTarget && value === 1) {
        set.add(index);
      }
      if (!isTarget && value === 0 && index % 3 === 0) {
        set.add(index);
      }
    });
    return set;
  }, [hoverIndex]);

  return (
    <div className="vit-root">
      <div className={showHints ? 'vit-progress' : 'vit-progress is-hidden'} style={{ width: `${((page + 1) / PAGE_COUNT) * 100}%` }} />

      <header className="vit-header">
        <div>
          <div className="vit-kicker">Chapter 04 · ViT 视觉变换器</div>
          <div className="vit-title">纯 React 交互重构版</div>
        </div>
        <button type="button" className="vit-nav-open" onClick={onRequestChapterNav}>章节目录</button>
      </header>

      <div className={showHints ? 'vit-slide-num' : 'vit-slide-num is-hidden'}>{page + 1} / {PAGE_COUNT}</div>

      <div className="vit-stage">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            className="vit-slide-shell"
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -32 : 32, scale: 0.985 }}
            transition={{ duration: 0.34, ease: 'easeOut' }}
          >
            {page === 0 ? (
              <div className="vit-slide">
                <div className="vit-two-col">
                  <div className="vit-col">
                    <div className="vit-eyebrow">Vision Transformer · 01</div>
                    <h1 className="vit-display-title">
                      AI 如何拥有
                      <br />
                      <span className="vit-gradient">全局视野？</span>
                    </h1>
                    <div className="vit-rule" />
                    <p className="vit-body">
                      过去，AI 看图片像盲人摸象，只能靠 CNN 一点点扫描局部特征。ViT 的核心突破是：把图片当成一句话来读。
                    </p>
                    <div className="vit-note" style={{ marginTop: 20 }}>
                      如果把每个像素都当成一个词，计算量会爆炸，所以第一步必须先给图片做“分词”。
                    </div>
                  </div>
                  <div className="vit-col-right">
                    <div className="vit-card" style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '4rem', lineHeight: 1, marginBottom: 20 }}>🖼️ ➔ 🧩 ➔ 🔤</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>跨越模态的统一</div>
                      <div className="vit-body">用处理自然语言的 Transformer 架构，直接征服视觉领域。</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 1 ? (
              <div className="vit-slide">
                <div className="vit-center">
                  <div className="vit-eyebrow">Image Serialization · 02</div>
                  <h2 className="vit-section-title" style={{ textAlign: 'center' }}>
                    第一步：像切蛋糕一样<span className="vit-gradient">切分图片</span>
                  </h2>
                  <div className="vit-rule" />
                  <p className="vit-body" style={{ textAlign: 'center', maxWidth: 820 }}>
                    ViT 先把图片切成固定大小的 patch。每个 patch 就像语言中的一个 token。
                  </p>
                  <div className="vit-demo-wrap" style={{ width: '100%', maxWidth: 860, marginTop: 24 }}>
                    <div className="vit-patch-stage">
                      <div className={[
                        'vit-patch-grid',
                        patchStage === 'sliced' || patchStage === 'flattened' || patchStage === 'positioned' ? 'is-sliced' : '',
                        patchStage === 'flattened' || patchStage === 'positioned' ? 'is-flattened' : '',
                        patchStage === 'positioned' ? 'is-positioned' : '',
                      ].join(' ')}>
                        {Array.from({ length: PATCH_COUNT }, (_, index) => (
                          <div key={`patch-${index + 1}`} className="vit-patch-cell" data-pos={index + 1} />
                        ))}
                      </div>
                    </div>
                    <div className="vit-btn-row">
                      <button type="button" className="vit-btn" onClick={() => setPatchStage('sliced')} disabled={patchStage !== 'initial'}>1. 切成小方块</button>
                      <button type="button" className="vit-btn" onClick={() => setPatchStage('flattened')} disabled={patchStage === 'initial' || patchStage === 'flattened' || patchStage === 'positioned'}>2. 排成一列</button>
                      <button type="button" className="vit-btn" onClick={() => setPatchStage('positioned')} disabled={patchStage !== 'flattened'}>3. 盖上位置编号</button>
                      <button type="button" className="vit-btn-muted" onClick={() => setPatchStage('initial')}>重置</button>
                    </div>
                    <div className="vit-note" style={{ marginTop: 20, textAlign: 'center' }}>
                      {patchStage === 'initial' ? '一张完整图像，还未转换成 token。' : null}
                      {patchStage === 'sliced' ? '图像被切成独立 patch，原始连续画面被离散化。' : null}
                      {patchStage === 'flattened' ? 'patch 被展平成序列，但还缺少“谁在前谁在后”的位置信息。' : null}
                      {patchStage === 'positioned' ? '注入位置编号后，patch 正式变成可送入 Transformer 的视觉 token。' : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 2 ? (
              <div className="vit-slide">
                <div className="vit-two-col">
                  <div className="vit-col">
                    <div className="vit-eyebrow">Unified Architecture · 03</div>
                    <h2 className="vit-section-title">万物同源的 <span className="vit-gradient-green">Q / K / V</span></h2>
                    <div className="vit-rule" />
                    <p className="vit-body">
                      图片变成 patch 序列后，后续流程就和语言模型处理文本几乎一样。每个 patch 同样会映射成 Q、K、V 三种角色。
                    </p>
                    <div className="vit-note" style={{ marginTop: 18 }}>
                      Q 像提问者，K 像身份标签，V 携带真实信息。于是遥远位置的 patch 可以立刻建立联系。
                    </div>
                  </div>
                  <div className="vit-col-right">
                    <div className="vit-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3].map((item) => (
                          <div key={item} style={{ width: 40, height: 40, borderRadius: 8, background: ['#cbd5e1', '#94a3b8', '#64748b'][item - 1], color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{item}</div>
                        ))}
                      </div>
                      <div style={{ fontSize: '1.4rem', color: '#64748b' }}>↓</div>
                      <div style={{ fontSize: '1.1rem', color: '#059669', fontWeight: 700 }}>送入 Transformer</div>
                      <div style={{ fontSize: '1.4rem', color: '#64748b' }}>↓</div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {[
                          ['Q', '#0284c7'],
                          ['K', '#059669'],
                          ['V', '#7c3aed'],
                        ].map(([label, color]) => (
                          <div key={label} style={{ padding: '10px 18px', borderRadius: 8, background: `${color}1a`, border: `2px solid ${color}4d`, color, fontWeight: 800, fontSize: '1.2rem' }}>{label}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 3 ? (
              <div className="vit-slide">
                <div className="vit-center">
                  <div className="vit-eyebrow">Local vs Global · 04</div>
                  <h2 className="vit-section-title" style={{ textAlign: 'center' }}>
                    <span className="vit-gradient">近视眼</span> vs <span className="vit-gradient">上帝视角</span>
                  </h2>
                  <div className="vit-rule" />
                  <p className="vit-body" style={{ textAlign: 'center', maxWidth: 860 }}>
                    将鼠标移到网格上。CNN 只能看到局部邻居，而 ViT 从一开始就能跨越全图找相关区域。
                  </p>
                  <div className="vit-vs-wrap">
                    <div className="vit-vs-box">
                      <div className="vit-vs-title" style={{ color: '#ef4444' }}>传统 CNN：局部感受野</div>
                      <div className="vit-vs-grid">
                        {Array.from({ length: VS_SIZE * VS_SIZE }, (_, index) => (
                          <div
                            key={`cnn-${index}`}
                            className={[
                              'vit-vs-cell',
                              hoverIndex === index ? 'is-cnn-focus' : '',
                              hoverIndex !== index && cnnActiveSet.has(index) ? 'is-cnn-neighbor' : '',
                            ].join(' ')}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                          />
                        ))}
                      </div>
                      <div className="vit-note" style={{ marginTop: 18, textAlign: 'center', background: 'rgba(239,68,68,.05)', borderColor: 'rgba(239,68,68,.2)' }}>
                        只能看到相邻 3×3 邻居，必须叠很多层才能逐步扩大视野。
                      </div>
                    </div>
                    <div className="vit-vs-box">
                      <div className="vit-vs-title" style={{ color: '#0284c7' }}>ViT：全局注意力</div>
                      <div className="vit-vs-grid">
                        {Array.from({ length: VS_SIZE * VS_SIZE }, (_, index) => (
                          <div
                            key={`vit-${index}`}
                            className={[
                              'vit-vs-cell',
                              hoverIndex === index ? 'is-vit-focus' : '',
                              hoverIndex !== index && vitRelatedSet.has(index) ? 'is-vit-related' : '',
                            ].join(' ')}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                          />
                        ))}
                      </div>
                      <div className="vit-note" style={{ marginTop: 18, textAlign: 'center' }}>
                        无视物理距离，直接点亮全图中具有相同语义的区域。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 4 ? (
              <div className="vit-slide">
                <div className="vit-center">
                  <div className="vit-eyebrow">Live WebML Demo · 05</div>
                  <h2 className="vit-section-title" style={{ textAlign: 'center' }}>
                    <span className="vit-gradient">DINOv3</span>：真正在浏览器本地运行的 ViT
                  </h2>
                  <div className="vit-rule" />
                  <p className="vit-body" style={{ textAlign: 'center', maxWidth: 860 }}>
                    理论不如实践。下面直接在 React 组件里驱动 Transformers.js，对图片做本地推理并渲染注意力热图。
                  </p>
                  <div className="vit-dino-ui" style={{ marginTop: 20 }}>
                    <div className="vit-dino-toolbar">
                      <div className="vit-dino-actions">
                        <button type="button" className="vit-nav-btn" onClick={() => void handleExample()} disabled={!isModelReady || isModelLoading}>加载示例图片</button>
                        <button type="button" className="vit-nav-btn" onClick={() => fileInputRef.current?.click()} disabled={!isModelReady || isModelLoading}>本地上传图</button>
                        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(event) => { void handleFileChange(event); }} />
                      </div>
                      <div className="vit-dino-status">{isModelLoading ? '⏳' : isModelReady ? '✅' : '⚙️'} {status}</div>
                      <div className="vit-dino-toggle">
                        <span>纯热力图</span>
                        <label className="vit-switch">
                          <input type="checkbox" checked={isOverlayMode} onChange={(event) => setIsOverlayMode(event.target.checked)} />
                          <span className="vit-switch-track" />
                        </label>
                        <span>原图叠加</span>
                      </div>
                    </div>
                    <div className="vit-dino-body">
                      <div
                        ref={dropzoneRef}
                        className={[
                          'vit-dropzone',
                          hasImage ? 'is-loaded' : '',
                          dragOver ? 'is-dragover' : '',
                        ].join(' ')}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={(event) => {
                          event.preventDefault();
                          setDragOver(false);
                        }}
                        onDrop={(event) => { void handleDrop(event); }}
                      >
                        {!hasImage ? (
                          <div className="vit-placeholder">
                            <div className="vit-placeholder-icon">🖼️</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>点击上传或拖拽图片到这里</div>
                            <div style={{ marginBottom: 12 }}>(支持 PNG、JPG 等格式)</div>
                            <div style={{ fontSize: '0.82rem', padding: '6px 12px', background: 'rgba(3,105,161,0.08)', color: '#0284c7', borderRadius: 6, display: 'inline-block' }}>
                              所有推理均在本地完成，不上云端
                            </div>
                          </div>
                        ) : null}
                        <canvas
                          ref={canvasRef}
                          className="vit-canvas"
                          style={{ display: hasImage ? 'block' : 'none' }}
                          onMouseMove={handleCanvasMove}
                          onMouseLeave={clearHighlights}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="vit-note" style={{ marginTop: 16, width: 'min(860px, 100%)', textAlign: 'center' }}>
                    上传图片后，把鼠标移到不同 patch 上，观察模型如何点亮同一物体或相同语义区域。
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={showHints ? 'vit-hint' : 'vit-hint is-hidden'}>
        Tab 查看章节目录 · ← → 切换页面
      </div>

      <div className={showHints ? 'vit-footer' : 'vit-footer is-hidden'}>
        <button type="button" className="vit-nav-btn" onClick={() => goToPage(page - 1)}>‹ 上一页</button>
        <div className="vit-dots">
          {Array.from({ length: PAGE_COUNT }, (_, index) => (
            <button
              key={`vit-dot-${index}`}
              type="button"
              className={`vit-dot ${page === index ? 'is-active' : ''}`}
              onClick={() => goToPage(index)}
              aria-label={`跳转到第 ${index + 1} 页`}
            />
          ))}
        </div>
        <button type="button" className="vit-nav-btn" onClick={() => goToPage(page + 1)}>下一页 ›</button>
      </div>
    </div>
  );
}
