import type { Slide0Props } from '../types/attention.types';

export default function Slide0({ step }: Slide0Props) {
  return (
    <div className={`a-slide a-active ${step > 0 ? 'a-moved' : ''}`} id='a-s0'>
      <div className={`a-s0-center ${step > 0 ? 'a-moved' : ''}`}>
        <div className='a-s0-desc' style={{ marginTop: step > 0 ? 0 : '35vh' }}>
          人类在面对海量信息时，并不会平均分配大脑算力。<br/>
          而是带着目标，将目光聚焦于关键的"特征线索"，过滤无关背景。
        </div>
      </div>
      {step === 0 && <div className='a-s0-hint'>按 [空格] 或 [→] 键步进推演</div>}

      <div className={`a-s0-content ${step > 0 ? 'a-show' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='a-paper-card'>
            <div className='a-paper-header'>
              <img
                src="https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/67c3335e-4edb-482c-863a-e4138b8bb7df/67e7d5ff4cf32dba2ac0264c6081780c.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1776247375&Signature=ev9LB4MbBQHpKVhyJwQZU2K0MOg="
                alt="DeepSeek"
                className='a-paper-deepseek-logo'
              />
            </div>
            <div className='a-paper-body'>
              "2024年，深度求索发布了新一代大语言模型 DeepSeek-V3。为突破长上下文推理的内存瓶颈，
              <span className={`a-hl-base ${step === 2 || step >= 6 ? 'a-hl-k-active' : ''}`}>该模型全面采用了
                <strong className={`a-hl-base ${step === 3 || step >= 7 ? 'a-hl-v-active' : ''}`}>多头潜在注意力（MLA）</strong>架构。
              </span>
              测试表明，DeepSeek-V3 在数学和代码能力上全面对标顶尖闭源模型，同时保持了极高的训练效率。"
            </div>
            <div style={{ borderTop: '1px dashed rgba(15,23,42,.1)', margin: '25px 0' }} />
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--a1)', fontWeight: 700, marginBottom: '10px', fontSize: '1rem' }}>Q: 用户提问</div>
            <div className='a-paper-q-body'>
              <span className={`a-hl-base ${step === 1 || step >= 5 ? 'a-hl-q-active' : ''}`}>DeepSeek-V3 解决显存瓶颈的架构是什么？</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className={`a-fade-panel ${step >= 4 ? 'a-hidden-panel' : ''}`}>
            <h3 className='a-step-title'>人类认知本能：目标导向</h3>
            <div className='a-step-list'>
              <div className={`a-step-item ${step === 1 ? 'a-item-active a-q-mode' : ''}`}><span className='a-step-num'>01</span><span className='a-step-text'>阅读问题，建立寻找目标（Query）。</span></div>
              <div className={`a-step-item ${step === 2 ? 'a-item-active a-k-mode' : ''}`}><span className='a-step-num'>02</span><span className='a-step-text'>扫读原文，定位匹配特征（Key）。</span></div>
              <div className={`a-step-item ${step === 3 ? 'a-item-active a-v-mode' : ''}`}><span className='a-step-num'>03</span><span className='a-step-text'>锁定线索，提取核心实体（Value）。</span></div>
            </div>
          </div>

          <div className={`a-fade-panel ${step < 4 ? 'a-hidden-panel' : ''}`}>
            <div style={{ opacity: step >= 5 ? 1 : 0, transition: 'opacity .5s' }}>
              <h3 className='a-step-title' style={{ color: 'var(--muted)', fontFamily: 'var(--mono)' }}>机器注意力：高维映射</h3>
              <div className='a-step-list'>
                <div className={`a-step-item ${step >= 5 ? 'a-item-active a-q-mode' : ''}`} style={{ padding: '10px 16px' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 700, color: 'var(--Q)', fontSize: '1.05rem', marginBottom: '2px', fontFamily: 'var(--mono)' }}>Query (Q)</div>
                    <div className='a-step-text' style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>「我要找什么信息？」</div>
                  </div>
                </div>
                <div className={`a-step-item ${step >= 6 ? 'a-item-active a-k-mode' : ''}`} style={{ padding: '10px 16px' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 700, color: 'var(--K)', fontSize: '1.05rem', marginBottom: '2px', fontFamily: 'var(--mono)' }}>Key (K)</div>
                    <div className='a-step-text' style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>「我有什么特征？」</div>
                  </div>
                </div>
                <div className={`a-step-item ${step >= 7 ? 'a-item-active a-v-mode' : ''}`} style={{ padding: '10px 16px' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 700, color: 'var(--V)', fontSize: '1.05rem', marginBottom: '2px', fontFamily: 'var(--mono)' }}>Value (V)</div>
                    <div className='a-step-text' style={{ fontSize: '1.3rem', color: 'var(--ink)' }}>「我能提供的内容。」</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
