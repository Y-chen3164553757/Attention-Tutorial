import os

with open(r"D:\桌面\test\Attention-Tutorial\src\chapters\03-attention\AttentionChapter.tsx", "w", encoding="utf-8") as f:
    f.write("""import { AnimatePresence, motion } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChapterComponentProps } from '../catalog';
import './AttentionChapter.css';

const PAGE_COUNT = 6;
const SENTENCE = "2025年1月20日，深度求索正式发布推理大模型 DeepSeek-R1。该模型表现优异，它大规模使用了强化学习技术。";
const TOKENS = ['2025年', '1月20日', '，', '深度求索', '正式', '发布', '推理', '大', '模型', ' ', 'DeepSeek-R1', '。', '该', '模型', '表现', '优异', '，', '它', '大', '规模', '使用了', '强化学习', '技术', '。'];
// "它" is index 17
const ATTENTION_SCORES = [
  { index: 10, word: 'DeepSeek-R1', score: 158.4, scaled: 6.8, weight: 92 },
  { index: 13, word: '模型', score: 85.2, scaled: 3.1, weight: 2 },
  { index: 3, word: '深度求索', score: 64.1, scaled: 2.2, weight: 1 },
  { index: 21, word: '强化学习', score: 45.0, scaled: 1.5, weight: 1 }
];

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

  // S0 states
  const [s0Step, setS0Step] = useState(0);

  // S1 states
  const [s1Step, setS1Step] = useState(0);

  // S2 states
  const [s2Step, setS2Step] = useState(0);

  // S3 states
  const [s3Step, setS3Step] = useState(0);

  // S4 states
  const [s4Step, setS4Step] = useState(0);

  // S5 states
  const [s5Step, setS5Step] = useState(0);

  const pageRef = useRef(page);

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

  // ... (UI Code to match requirements)
  // I will write the detailed SVG/Canvas code in a separate python string injection if needed
  
  return (
    <div className="attention-root">
      <header className="attention-header">
        <div>
          <div className="attention-kicker">Chapter 03 · 什么是 Attention</div>
          <div className="attention-chapter-title">重构版: DeepSeek 实例</div>
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
                    <div className="attention-eyebrow">Cognitive Intuition · 00</div>
                    <h1 className="attention-display-title">
                      <span className="attention-gradient">机器如何做</span>
                      <br />
                      阅读理解？
                    </h1>
                    <div className="attention-rule" />
                    <p className="attention-body">
                      Attention 的本质是“QKV 软寻址”。就像我们带着问题去文章中寻找答案。
                    </p>
                  </div>
                  <div className="attention-col-right">
                    <div className="attention-card attention-sentence-box" style={{position:'relative'}}>
                      <div className="attention-sentence" style={{ fontSize: '1.2rem', lineHeight: 1.8 }}>
                        {TOKENS.map((token, i) => (
                           <span key={i} className="attention-word" style={{
                             background: s0Step > 0 && (i===5 || i===3 || i===0) ? 'rgba(5,150,105,0.3)' : 'transparent',
                             border: s0Step > 0 && (i===5 || i===3 || i===0) ? '1px solid #059669' : '1px solid transparent'
                           }}>
                             {token}
                             {s0Step > 0 && (i===5 || i===3 || i===0) && <span style={{position:'absolute', top:'-20px', left:'50%', transform:'translateX(-50%)', fontSize:'12px', color:'#059669', fontWeight:'bold'}}>K</span>}
                           </span>
                        ))}
                      </div>
                      
                      <div style={{marginTop: 40, textAlign:'center'}}>
                        <button className="attention-primary-btn" onClick={() => setS0Step(1)}>
                          [ 深度求索发布了什么？ ] (这便是 Query)
                        </button>
                      </div>

                      {s0Step > 0 && (
                         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} style={{position:'absolute', bottom: -60, right: 20, background:'rgba(220,38,38,0.1)', border:'2px solid #dc2626', padding:'10px 20px', borderRadius:'8px', color:'#dc2626', fontWeight:'bold'}}>
                            DeepSeek-R1 [ V (Value) ]
                         </motion.div>
                      )}
                      
                      {/* Connection Line */}
                      {s0Step > 0 && (
                        <svg style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none'}}>
                           <path d="M 300, 200 Q 200,100 150,50" stroke="#0369a1" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 1 ? (
              <div className="attention-slide">
                <div className="attention-two-col">
                  <div className="attention-col">
                    <div className="attention-eyebrow">Parameter Mapping · 01</div>
                    <h2 className="attention-section-title"><span className="attention-gradient">Token 的三重化身</span></h2>
                    <div className="attention-rule" />
                    <p className="attention-body">词元在计算前会分裂成三种身份角色的矩阵。</p>
                  </div>
                  <div className="attention-col-right" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                      <div style={{fontSize: '4rem', fontWeight:'bold', border:'2px solid rgba(255,255,255,0.2)', borderRadius:'12px', padding:'20px 40px', marginBottom: 40, background:'rgba(0,0,0,0.3)', position:'relative'}}>
                         它
                      </div>
                      
                      <button className="attention-primary-btn" onClick={() => setS1Step(1)}>
                        [ 乘以权重矩阵 W ]
                      </button>

                      {s1Step > 0 && (
                         <div style={{display:'flex', gap:'20px', marginTop: 40, width:'100%', justifyContent:'center'}}>
                           <motion.div initial={{y:-50, opacity:0}} animate={{y:0, opacity:1}} style={{padding:'20px', border:'2px solid #0369a1', borderRadius:'8px', color:'#0369a1', background:'rgba(3,105,161,0.1)', boxShadow:'0 0 15px rgba(3,105,161,0.5)'}}>
                             Q向量：我在找谁？
                           </motion.div>
                           <motion.div initial={{y:0, opacity:0}} animate={{y:0, opacity:1}} style={{padding:'20px', border:'2px solid #059669', borderRadius:'8px', color:'#059669', background:'rgba(5,150,105,0.1)', boxShadow:'0 0 15px rgba(5,150,105,0.5)'}}>
                             K向量：我是谁？
                           </motion.div>
                           <motion.div initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} style={{padding:'20px', border:'2px solid #dc2626', borderRadius:'8px', color:'#dc2626', background:'rgba(220,38,38,0.1)', boxShadow:'0 0 15px rgba(220,38,38,0.5)'}}>
                             V向量：我的本体信息
                           </motion.div>
                         </div>
                      )}
                  </div>
                </div>
              </div>
            ) : null}

            {page === 2 ? (
              <div className="attention-slide">
                <div className="attention-two-col">
                  <div className="attention-col">
                    <div className="attention-eyebrow">Dot Product · 02</div>
                    <h2 className="attention-section-title"><span className="attention-gradient">点积：计算语义相似度</span></h2>
                    <div className="attention-rule" />
                    <p className="attention-body">这就是模型如何理解“它”指代什么。</p>
                  </div>
                  <div className="attention-col-right" style={{ display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div className="attention-sentence" style={{ fontSize: '1.2rem', marginBottom: 30, background:'rgba(0,0,0,0.2)', padding:'20px', borderRadius:'12px'}}>
                         {TOKENS.map((t, i) => (
                           <span key={i} style={{color: i === 17 ? '#0369a1' : 'inherit', fontWeight: i===17 ? 'bold':'normal', fontSize: i===17?'1.4rem':'1.2rem', margin:'0 4px', position:'relative'}}>
                             {t}
                             {i===17 && <span style={{position:'absolute', top:'-20px', left:'50%', transform:'translateX(-50%)', fontSize:'12px'}}>Q</span>}
                           </span>
                         ))}
                      </div>

                      <button className="attention-primary-btn" onClick={() => setS2Step(1)}>
                        [ 执行 Q·K^T 点积 ]
                      </button>

                      {s2Step > 0 && (
                        <div style={{width:'100%', marginTop: 30, display:'flex', alignItems:'flex-end', justifyContent:'space-around', height:'150px', borderBottom:'1px solid rgba(255,255,255,0.2)'}}>
                           {ATTENTION_SCORES.map((item) => (
                             <motion.div key={item.word} initial={{height:0}} animate={{height: `${item.score}px`}} style={{width:'60px', background:'#0369a1', position:'relative', borderRadius:'4px 4px 0 0'}}>
                                <div style={{position:'absolute', top:'-25px', width:'100%', textAlign:'center', color:'#60a5fa', fontWeight:'bold'}}>{item.score}</div>
                                <div style={{position:'absolute', bottom:'-30px', width:'200%', left:'-50%', textAlign:'center', fontSize:'14px'}}>{item.word}</div>
                             </motion.div>
                           ))}
                        </div>
                      )}

                      <div className="attention-note" style={{ marginTop: 50, textAlign: 'center', width:'100%' }}>
                         <Latex>{'$$Score = Q \\cdot K^T$$'}</Latex>
                      </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 3 ? (
              <div className="attention-slide">
                <div className="attention-two-col">
                  <div className="attention-col">
                    <div className="attention-eyebrow">Scale & Normalize · 03</div>
                    <h2 className="attention-section-title"><span className="attention-gradient">缩放与归一化</span></h2>
                    <h3 style={{color:'rgba(255,255,255,0.5)', marginTop:'-10px', fontSize:'1.2rem'}}>工业级大模型的稳定器</h3>
                    <div className="attention-rule" />
                    <p className="attention-body">平抑方差，防止高维空间溢出。</p>
                  </div>
                  <div className="attention-col-right" style={{ display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{display:'flex', gap:'15px', marginBottom: 30}}>
                        <button className="attention-primary-btn" onClick={() => setS3Step(1)}>
                          [ / sqrt(d_k) 缩放 ]
                        </button>
                        <button className="attention-primary-btn" style={{background:s3Step>=1?'#0369a1':'#333', color:s3Step>=1?'#fff':'#888'}} disabled={s3Step<1} onClick={() => setS3Step(2)}>
                          [ Softmax 激活 ]
                        </button>
                      </div>

                      <div style={{width:'100%', display:'flex', flexDirection:'column', gap:'15px', marginTop: 20}}>
                         {ATTENTION_SCORES.map((item) => (
                           <div key={item.word} style={{display:'flex', alignItems:'center', width:'100%'}}>
                              <div style={{width:'100px', textAlign:'right', paddingRight:'15px'}}>{item.word}</div>
                              <div style={{flex:1, background:'rgba(255,255,255,0.1)', height:'24px', borderRadius:'12px', position:'relative', overflow:'hidden'}}>
                                 <motion.div 
                                    animate={{ 
                                      width: s3Step === 0 ? `${(item.score/200)*100}%` : s3Step === 1 ? `${(item.scaled/10)*100}%` : `${item.weight}%`,
                                      background: s3Step === 2 ? '#dc2626' : '#0369a1'
                                    }}
                                    style={{height:'100%', transition:'all 0.5s ease'}}
                                 />
                                 <div style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', fontSize:'12px', color:'#fff', textShadow:'0 0 4px #000'}}>
                                    {s3Step === 0 ? item.score : s3Step === 1 ? item.scaled : `${item.weight}%`}
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="attention-note" style={{ marginTop: 40, textAlign: 'center', width:'100%' }}>
                         <Latex>{'$$Weight = \\text{Softmax}\\left(\\frac{Q \\cdot K^T}{\\sqrt{d_k}}\\right)$$'}</Latex>
                      </div>
                  </div>
                </div>
              </div>
            ) : null}

            {page === 4 ? (
              <div className="attention-slide">
                  <div className="attention-center" style={{padding:'40px'}}>
                    <div className="attention-eyebrow">Information Aggregation · 04</div>
                    <h2 className="attention-section-title" style={{textAlign:'center'}}><span className="attention-gradient">信息聚合</span>：孤立词元的进化</h2>
                    <div className="attention-rule" style={{margin:'20px auto'}} />
                    
                    <div style={{display:'flex', width:'100%', marginTop: 50, position:'relative', height:'200px'}}>
                       <div style={{flex:1, display:'flex', flexDirection:'column', gap:'20px', justifyContent:'center', zIndex:2}}>
                          {ATTENTION_SCORES.slice(0,3).map(item => (
                            <div key={item.word} style={{display:'flex',alignItems:'center', gap:'10px'}}>
                               <div style={{width:'100px', padding:'10px', background:'rgba(220,38,38,0.2)', border:`2px solid #dc2626`, borderRadius:'8px', textAlign:'center', color:'#dc2626'}}>V: {item.word}</div>
                               <div style={{color:'#999', fontSize:'14px'}}>× {item.weight}%</div>
                            </div>
                          ))}
                       </div>

                       <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:1, pointerEvents:'none'}}>
                           {/* SVG Lines */}
                           <svg width="100%" height="100%">
                              <path d="M 200,40 C 400,40 500,100 700,100" stroke="rgba(220,38,38,0.9)" strokeWidth="4" fill="none" className="flow-anim" />
                              <path d="M 200,100 C 400,100 500,100 700,100" stroke="rgba(220,38,38,0.2)" strokeWidth="2" fill="none" />
                              <path d="M 200,160 C 400,160 500,100 700,100" stroke="rgba(220,38,38,0.1)" strokeWidth="1" fill="none" />
                           </svg>
                       </div>

                       <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'flex-end', zIndex:2}}>
                          <div style={{padding:'30px 50px', background:'rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.4)', borderRadius:'50%', fontSize:'2rem', fontWeight:'bold', color:'#fff', boxShadow:'0 0 30px rgba(220,38,38,0.5)'}}>
                             它
                          </div>
                       </div>
                    </div>

                    <div style={{marginTop: 40, padding:'20px', background:'rgba(16,185,129,0.1)', border:'1px solid #10b981', borderRadius:'8px', color:'#10b981', textAlign:'center', width:'100%'}}>
                       结论：“它”融合了上下文，真正懂得了自己的含义。
                    </div>

                    <div className="attention-note" style={{ marginTop: 30, textAlign: 'center', width:'100%', fontSize:'1.2rem' }}>
                         <Latex>{'$$\\text{Attention}(Q,K,V) = \\text{Softmax}\\left(\\frac{Q \\cdot K^T}{\\sqrt{d_k}}\\right) \\cdot V$$'}</Latex>
                    </div>
                  </div>
              </div>
            ) : null}

            {page === 5 ? (
              <div className="attention-slide">
                 <div className="attention-center">
                    <div className="attention-eyebrow">Multi-Head Attention · 05</div>
                    <h2 className="attention-section-title" style={{textAlign:'center'}}><span className="attention-gradient">多头机制</span>：高并发的暴力美学</h2>
                    <div className="attention-rule" style={{margin:'20px auto'}} />
                    
                    <div style={{display:'flex', width:'100%', gap:'40px', justifyContent:'center', marginTop: 30}}>
                       <div style={{flex:1, padding:'20px', background:'rgba(3,105,161,0.1)', border:'2px solid #0369a1', borderRadius:'12px'}}>
                          <h3 style={{color:'#0369a1', textAlign:'center'}}>Head 1 (语法)</h3>
                          <div style={{marginTop:20, textAlign:'center', fontSize:'1.2rem'}}>
                             它 <span style={{color:'#0369a1', fontWeight:'bold'}}>→ 强烈连接 →</span> 使用了
                          </div>
                          <svg height="80" width="100%" style={{marginTop:20}}>
                             <path d="M 50,40 Q 150,0 250,40" stroke="#0369a1" strokeWidth="4" fill="none" />
                          </svg>
                       </div>

                       <div style={{flex:1, padding:'20px', background:'rgba(5,150,105,0.1)', border:'2px solid #059669', borderRadius:'12px'}}>
                          <h3 style={{color:'#059669', textAlign:'center'}}>Head 2 (实体)</h3>
                          <div style={{marginTop:20, textAlign:'center', fontSize:'1.2rem'}}>
                             它 <span style={{color:'#059669', fontWeight:'bold'}}>→ 强烈连接 →</span> DeepSeek-R1
                          </div>
                          <svg height="80" width="100%" style={{marginTop:20}}>
                             <path d="M 50,40 Q 150,80 250,40" stroke="#059669" strokeWidth="4" fill="none" />
                          </svg>
                       </div>
                    </div>

                    <button className="attention-primary-btn" style={{marginTop:40}} onClick={() => setS5Step(1)}>
                       [ Concat 拼接 ]
                    </button>

                    {s5Step > 0 && (
                       <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} style={{marginTop: 30, width:'80%', height:'80px', background:'linear-gradient(90deg, #0369a1 0%, #059669 100%)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'1.5rem', fontWeight:'bold', letterSpacing:'4px'}}>
                          完整的特征矩阵
                       </motion.div>
                    )}
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
""")
