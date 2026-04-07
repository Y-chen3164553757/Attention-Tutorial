import { AnimatePresence, motion } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChapterComponentProps } from '../catalog';
import './AttentionChapter.css';

const PAGE_COUNT = 6;
const INTRO_WORDS = ['我', '吃', '了', '一', '个', '很', '甜', '的', '苹果'];
const INTRO_FOCUS = new Set(['甜', '苹果']);
const TOKEN_STEPS = [
  { label: '① 输入文本', value: '"苹果"' },
  { label: '② Token 分词', value: '苹 | 果' },
  { label: '③ ID 编号', value: '[2533]' },
] as const;
const POSITION_WORDS = ['苹果', '公司', '发布', '了', '新手机'];
const ATTENTION_WORDS = ['苹果', '公司', '发布', '了', '新', '手机'];
const ATTENTION_SCORES = [
  [28, 9, 6, 3, 22, 32],
  [10, 31, 5, 2, 14, 38],
  [7, 18, 24, 8, 20, 23],
  [4, 5, 13, 34, 26, 18],
  [13, 9, 16, 20, 23, 19],
  [12, 20, 8, 4, 24, 32],
];
const MULTI_HEADS = [
  { title: 'Head 1 · 语法', color: '#0369a1', bars: [64, 42, 28, 16, 36] },
  { title: 'Head 2 · 逻辑', color: '#059669', bars: [38, 60, 34, 18, 48] },
  { title: 'Head 3 · 情感', color: '#7c3aed', bars: [30, 44, 36, 20, 58] },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function AttentionChapter({
  showHints,
  onRequestChapterNav,
  requestedPageIndex = 0,
  onPageChange,
}: ChapterComponentProps) {
  const [page, setPage] = useState(() => clamp(requestedPageIndex, 0, PAGE_COUNT - 1));
  const [direction, setDirection] = useState<1 | -1>(1);
  const [introActive, setIntroActive] = useState(false);
  const [tokenStep, setTokenStep] = useState(-1);
  const [positionStamped, setPositionStamped] = useState(false);
  const [qkvActive, setQkvActive] = useState<number | null>(null);
  const [attentionIndex, setAttentionIndex] = useState(0);
  const [concatOn, setConcatOn] = useState(false);
  const pageRef = useRef(page);
  const sentenceWrapRef = useRef<HTMLDivElement>(null);
  const sentenceWordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [introLines, setIntroLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; strong: boolean }>>([]);

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

  const updateIntroLines = useCallback(() => {
    if (!introActive || !sentenceWrapRef.current) {
      setIntroLines([]);
      return;
    }

    const wrapRect = sentenceWrapRef.current.getBoundingClientRect();
    const focusIndexes = INTRO_WORDS
      .map((word, index) => (INTRO_FOCUS.has(word) ? index : -1))
      .filter((index) => index >= 0);
    const nextLines = focusIndexes.flatMap((focusIndex) => {
      const focusEl = sentenceWordRefs.current[focusIndex];
      if (!focusEl) {
        return [];
      }
      const focusRect = focusEl.getBoundingClientRect();
      return INTRO_WORDS.map((word, targetIndex) => {
        const targetEl = sentenceWordRefs.current[targetIndex];
        if (!targetEl) {
          return null;
        }
        const targetRect = targetEl.getBoundingClientRect();
        return {
          x1: focusRect.left + focusRect.width / 2 - wrapRect.left,
          y1: 4,
          x2: targetRect.left + targetRect.width / 2 - wrapRect.left,
          y2: 48,
          strong: INTRO_FOCUS.has(word),
        };
      });
    }).filter((line): line is { x1: number; y1: number; x2: number; y2: number; strong: boolean } => Boolean(line));
    setIntroLines(nextLines);
  }, [introActive]);

  useEffect(() => {
    updateIntroLines();
    window.addEventListener('resize', updateIntroLines);
    return () => window.removeEventListener('resize', updateIntroLines);
  }, [updateIntroLines]);

  const attentionSummary = useMemo(() => {
    const row = ATTENTION_SCORES[attentionIndex];
    const sorted = row
      .map((value, index) => ({ value, index }))
      .sort((left, right) => right.value - left.value);
    return {
      total: row.reduce((sum, item) => sum + item, 0),
      primary: `${ATTENTION_WORDS[sorted[0].index]} ${sorted[0].value}%`,
      secondary: `${ATTENTION_WORDS[sorted[1].index]} ${sorted[1].value}%`,
    };
  }, [attentionIndex]);

  return (
    <div className="attention-root">
      <header className="attention-header">
        <div>
          <div className="attention-kicker">Chapter 03 · 什么是 Attention</div>
          <div className="attention-chapter-title">纯 React 交互重构版</div>
        </div>
        <button type="button" className="attention-nav-open" onClick={onRequestChapterNav}>
          章节目录
        </button>
      </header>

      <div className={showHints ? 'attention-slide-num' : 'attention-slide-num is-hidden'}>
        {page + 1} / {PAGE_COUNT}
      </div>

      <div className="attention-stage">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            className="attention-slide-shell"
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -32 : 32, scale: 0.985 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
          >
            {page === 0 ? (
              <div className="attention-slide">
                <div className="attention-two-col">
                  <div className="attention-col">
                    <div className="attention-eyebrow">Attention Mechanism · 01</div>
                    <h1 className="attention-display-title">
                      <span className="attention-gradient">机器如何</span>
                      <br />
                      拥有全局视野？
                    </h1>
                    <div className="attention-rule" />
                    <p className="attention-body">
                      传统 AI 逐字线性处理，读完开头遗忘末尾，无法建立全局关联。
                    </p>
                    <div className="attention-note" style={{ marginTop: 18 }}>
                      <strong style={{ color: '#0369a1' }}>Attention 机制</strong>让模型动态分配权重，把计算资源集中到最相关的位置。
                    </div>
                  </div>
                  <div className="attention-col-right">
                    <div className="attention-card attention-sentence-box">
                      <div className="attention-eyebrow" style={{ marginBottom: 16 }}>点击句子，激活注意力</div>
                      <div ref={sentenceWrapRef} className="attention-sentence">
                        {INTRO_WORDS.map((word, index) => {
                          const isFocus = INTRO_FOCUS.has(word);
                          return (
                            <span
                              key={`${word}-${index}`}
                              ref={(node) => { sentenceWordRefs.current[index] = node; }}
                              className={[
                                'attention-word',
                                introActive && !isFocus ? 'is-dim' : '',
                                introActive && isFocus ? 'is-focus' : '',
                              ].join(' ')}
                              onClick={() => {
                                setIntroActive((current) => !current);
                                requestAnimationFrame(updateIntroLines);
                              }}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </div>
                      <svg className="attention-svg" viewBox={`0 0 ${sentenceWrapRef.current?.clientWidth ?? 700} 52`} preserveAspectRatio="none">
                        {introLines.map((line, index) => (
                          <path
                            key={`line-${index}`}
                            d={`M ${line.x1} ${line.y1} C ${line.x1} 26, ${line.x2} 26, ${line.x2} ${line.y2}`}
                            stroke={`rgba(3, 105, 161, ${line.strong ? 0.55 : 0.18})`}
                            strokeWidth={line.strong ? 2.5 : 1}
                            fill="none"
                          />
                        ))}
                      </svg>
                      <div className="attention-note" style={{ opacity: introActive ? 1 : 0.75 }}>
                        模型不会平等对待每个词，而是让“甜”“苹果”等高相关词得到更高权重。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 1 ? (
              <div className="attention-slide">
                <div className="attention-two-col">
                  <div className="attention-col">
                    <div className="attention-eyebrow">Tokenization · 02</div>
                    <h2 className="attention-section-title"><span className="attention-gradient">万物皆 Token</span></h2>
                    <div className="attention-rule" />
                    <p className="attention-body">AI 将一切信息切分为 Token，转化为数学向量之后才能计算。</p>
                    <div className="attention-token-steps" style={{ marginTop: 20 }}>
                      <button type="button" className={`attention-token-step ${tokenStep >= 0 ? 'is-active' : ''}`} onClick={() => setTokenStep(0)}>文字</button>
                      <button type="button" className={`attention-token-step ${tokenStep >= 1 ? 'is-active' : ''}`} onClick={() => setTokenStep(1)}>Token</button>
                      <button type="button" className={`attention-token-step ${tokenStep >= 2 ? 'is-active' : ''}`} onClick={() => setTokenStep(2)}>ID 号</button>
                      <button type="button" className={`attention-token-step ${tokenStep >= 3 ? 'is-active' : ''}`} onClick={() => setTokenStep(3)}>向量</button>
                    </div>
                    <div className="attention-note" style={{ marginTop: 18 }}>
                      文字、图像、音频最终都能落到统一的 token 表示空间里。
                    </div>
                  </div>
                  <div className="attention-col-right">
                    <div className="attention-token-panel">
                      <div className="attention-eyebrow" style={{ marginBottom: 16 }}>实时演示 · 苹果</div>
                      {tokenStep < 0 ? (
                        <div>
                          <div className="attention-token-label">点击左侧流程步骤查看演示</div>
                          <div className="attention-token-value" style={{ fontSize: '1.8rem' }}>"苹果"</div>
                        </div>
                      ) : null}
                      {TOKEN_STEPS.slice(0, Math.min(tokenStep + 1, TOKEN_STEPS.length)).map((step) => (
                        <div key={step.label} className="attention-token-item">
                          <div className="attention-token-label">{step.label}</div>
                          <div className="attention-token-value">{step.value}</div>
                        </div>
                      ))}
                      {tokenStep >= 3 ? (
                        <div className="attention-token-item">
                          <div className="attention-token-label">④ 词向量</div>
                          <div className="attention-vector-row">
                            {['+0.24', '-0.51', '+0.89', '-0.12', '+0.67', '...'].map((item, index) => (
                              <span key={item} className={`attention-vector-pill ${index % 2 === 0 ? 'is-strong' : ''}`}>{item}</span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 2 ? (
              <div className="attention-slide">
                <div className="attention-center">
                  <div className="attention-eyebrow">Positional Encoding · 03</div>
                  <h2 className="attention-section-title" style={{ textAlign: 'center' }}>
                    为 Token 盖上<span className="attention-gradient">时间戳钢印</span>
                  </h2>
                  <div className="attention-rule" />
                  <p className="attention-body" style={{ textAlign: 'center', maxWidth: 760 }}>
                    自注意力本身不感知顺序，必须通过位置编码给每个 token 注入位置信息。
                  </p>
                  <div className="attention-position-row" style={{ marginTop: 22 }}>
                    {POSITION_WORDS.map((word, index) => (
                      <div key={word} className="attention-pos-chip">
                        <div className="attention-pos-label">{word}</div>
                        <div className="attention-pos-bar">
                          <div className={`attention-pos-bar-fill ${positionStamped ? 'is-on' : ''}`} />
                        </div>
                        <div className={`attention-pos-index ${positionStamped ? 'is-on' : ''}`}>pos={index}</div>
                      </div>
                    ))}
                  </div>
                  <div className="attention-wave">位置编码波形（正弦 / 余弦）</div>
                  <button type="button" className="attention-primary-btn" onClick={() => setPositionStamped(true)}>盖上时间戳钢印</button>
                  <div className="attention-note" style={{ marginTop: 18, width: 'min(760px, 100%)' }}>
                    <div className="attention-math">
                      <Latex>{'$$PE_{(pos,2i)}=\\sin\\left(\\tfrac{pos}{10000^{2i/d}}\\right),\\quad PE_{(pos,2i+1)}=\\cos\\left(\\tfrac{pos}{10000^{2i/d}}\\right)$$'}</Latex>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 3 ? (
              <div className="attention-slide">
                <div className="attention-two-col">
                  <div className="attention-col">
                    <div className="attention-eyebrow">Q / K / V · 04</div>
                    <h2 className="attention-section-title">Token 的<span className="attention-gradient">三重化身</span></h2>
                    <div className="attention-rule" />
                    <p className="attention-body">同一个输入向量经过三组参数矩阵后，变成 Query、Key、Value 三种角色。</p>
                    <button type="button" className="attention-primary-btn" style={{ marginTop: 18 }} onClick={() => setQkvActive(0)}>
                      激活向量分裂
                    </button>
                    <div className="attention-note" style={{ marginTop: 18 }}>
                      <Latex>{'$\\mathbf{q}=W^Q\\mathbf{x}$ · $\\mathbf{k}=W^K\\mathbf{x}$ · $\\mathbf{v}=W^V\\mathbf{x}$'}</Latex>
                    </div>
                  </div>
                  <div className="attention-col-right">
                    <div className="attention-qkv-grid">
                      {[
                        ['🔦', 'Q — Query 查询向量', '手持手电筒，主动搜寻“我在找谁？”', '#0369a1'],
                        ['🏷️', 'K — Key 键向量', '举着身份牌，等待匹配“我是谁？”', '#059669'],
                        ['📦', 'V — Value 值向量', '携带真实内容“我包含什么？”', '#dc2626'],
                      ].map(([icon, title, desc, color], index) => (
                        <button
                          key={title}
                          type="button"
                          className={`attention-qkv-card ${qkvActive === index ? 'is-active' : ''}`}
                          onClick={() => setQkvActive(index)}
                        >
                          <div className="attention-qkv-icon" style={{ background: `${color}1a`, color }}>{icon}</div>
                          <div>
                            <div className="attention-qkv-title" style={{ color }}>{title}</div>
                            <div className="attention-qkv-desc">{desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 4 ? (
              <div className="attention-slide">
                <div className="attention-center">
                  <div className="attention-eyebrow">Self-Attention · 05</div>
                  <h2 className="attention-section-title" style={{ textAlign: 'center' }}>
                    <span className="attention-gradient">自</span>注意力：Token 之间的相互观察
                  </h2>
                  <div className="attention-rule" />
                  <p className="attention-body" style={{ textAlign: 'center', maxWidth: 760 }}>
                    点击任意词元，观察它如何对其它词分配权重，并经过 Softmax 归一化为 100%。
                  </p>
                  <div className="attention-word-buttons" style={{ justifyContent: 'center', marginTop: 18 }}>
                    {ATTENTION_WORDS.map((word, index) => (
                      <button
                        key={word}
                        type="button"
                        className={`attention-word-button ${attentionIndex === index ? 'is-active' : ''}`}
                        onClick={() => setAttentionIndex(index)}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                  <div className="attention-bars" style={{ marginTop: 18 }}>
                    {ATTENTION_WORDS.map((word, index) => (
                      <div key={word} className="attention-bar-col">
                        <div className="attention-bar-wrap">
                          <div className="attention-bar-fill" style={{ height: `${ATTENTION_SCORES[attentionIndex][index] * 1.6}px`, opacity: 0.2 + ATTENTION_SCORES[attentionIndex][index] / 45 }} />
                        </div>
                        <div className="attention-bar-word">{word}</div>
                        <div className="attention-bar-pct">{ATTENTION_SCORES[attentionIndex][index]}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="attention-note" style={{ marginTop: 14, width: '100%', textAlign: 'center' }}>
                    「{ATTENTION_WORDS[attentionIndex]}」最强关注 {attentionSummary.primary}，次强关注 {attentionSummary.secondary}，总和 {attentionSummary.total}%。
                  </div>
                  <div className="attention-note" style={{ marginTop: 10, width: '100%', textAlign: 'center' }}>
                    <Latex>{'$\\text{Attention}(Q,K,V)=\\text{softmax}\\left(\\dfrac{QK^{\\top}}{\\sqrt{d_k}}\\right)V$'}</Latex>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 5 ? (
              <div className="attention-slide">
                <div className="attention-center">
                  <div className="attention-eyebrow">Multi-Head Attention · 06</div>
                  <h2 className="attention-section-title" style={{ textAlign: 'center' }}>
                    多维视角的叠加：<span className="attention-gradient">多头</span>注意力
                  </h2>
                  <div className="attention-rule" />
                  <p className="attention-body" style={{ textAlign: 'center', maxWidth: 760 }}>
                    单一视角太片面，多头注意力同时从语法、逻辑、情感等多个维度观察同一序列。
                  </p>
                  <div className="attention-heads" style={{ marginTop: 22 }}>
                    {MULTI_HEADS.map((head) => (
                      <div key={head.title} className="attention-head-box">
                        <div className="attention-head-title" style={{ color: head.color }}>{head.title}</div>
                        <div className="attention-head-bar-row">
                          {head.bars.map((bar, index) => (
                            <div key={`${head.title}-${index}`} className="attention-head-bar" style={{ height: `${bar}px`, background: head.color }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                    <button type="button" className="attention-primary-btn" onClick={() => setConcatOn(true)}>Concat 叠加</button>
                    <button type="button" className="attention-secondary-btn" onClick={() => setConcatOn(false)}>重置</button>
                  </div>
                  {concatOn ? (
                    <div style={{ width: '100%', marginTop: 18 }}>
                      <div className="attention-concat">
                        <div className="attention-concat-piece" style={{ background: 'rgba(3,105,161,.72)' }}>Head 1</div>
                        <div className="attention-concat-piece" style={{ background: 'rgba(124,58,237,.72)' }}>Head 2</div>
                        <div className="attention-concat-piece" style={{ background: 'rgba(5,150,105,.72)' }}>Head 3</div>
                      </div>
                      <div className="attention-note" style={{ marginTop: 12, textAlign: 'center' }}>
                        <Latex>{'$$MultiHead(Q,K,V)=Concat(head_1,\\ldots,head_h)W^O$$'}</Latex>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={showHints ? 'attention-hint' : 'attention-hint is-hidden'}>
        Tab 查看章节目录 · ← → 切换页面
      </div>

      <div className={showHints ? 'attention-footer' : 'attention-footer is-hidden'}>
        <button type="button" className="attention-secondary-btn" onClick={() => goToPage(page - 1)}>‹ 上一页</button>
        <div className="attention-dot-row">
          {Array.from({ length: PAGE_COUNT }, (_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`attention-dot ${page === index ? 'is-active' : ''}`}
              onClick={() => goToPage(index)}
              aria-label={`跳转到第 ${index + 1} 页`}
            />
          ))}
        </div>
        <button type="button" className="attention-secondary-btn" onClick={() => goToPage(page + 1)}>下一页 ›</button>
      </div>
    </div>
  );
}
