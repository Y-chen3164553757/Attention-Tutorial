import type { Slide1Props } from '../types/attention.types';

export default function Slide1({ step }: Slide1Props) {
  const isTitleVisible = step >= 1;

  return (
    <div className='a-slide a-active' id='a-s1'>
      <div className='a-s1-header' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto', opacity: isTitleVisible ? 1 : 0, transition: 'all 0.8s var(--spring)', transform: isTitleVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className='a-eyebrow'>PRE-COMPUTATION</div>
        <h1 className='a-display-title'>驶入矩阵前：<span className='a-grad'>文本的张量化</span></h1>
        <p style={{ fontSize: 'clamp(0.9rem,1.3vw,1.3rem)', color: 'var(--muted)', lineHeight: '1.6' }}>我们以序列 <strong style={{ color: 'var(--ink)' }}>"有一只小猫"</strong> 为例，计算机如何理解？</p>
      </div>
      <div className='a-s1-body'>
        <div className={`a-s1-card ${step >= 2 ? 'a-active' : ''}`}>
          <h3 className='a-s1-h'>Tokenization</h3><div className='a-s1-sub'>离散切分</div>
          <div className='a-tensor-box'><span className='a-tensor-label'>Text</span>"有一只小猫"</div>
          <div className='a-arr-down'>↓</div>
          <div className='a-tensor-box a-highlight a-hl-blue'><span className='a-tensor-label'>Token IDs</span>[ 15, 23, 89, 44, 91 ]</div>
          <div className="a-s1-detail" style={{marginTop:'10px', fontSize:'0.85rem', color:'var(--desc)'}}>将句子切分为词元(Token)并分配对应ID，是语言数字化的最小单位。</div>
        </div>
        <div className={`a-s1-card ${step >= 3 ? 'a-active' : ''}`}>
          <h3 className='a-s1-h'>Embedding</h3><div className='a-s1-sub'>查表获取语义向量</div>
          <div className='a-tensor-box'><span className='a-tensor-label'>Input</span>IDs</div>
          <div className='a-arr-down'>× W_emb (权重表) ↓</div>
          <div className='a-tensor-box a-highlight a-hl-purple' style={{ fontFamily: "'Times New Roman',serif", fontStyle: 'italic', fontSize: 'clamp(.9rem,1.2vw,1.5rem)' }}>
            <span className='a-tensor-label'>Word Matrix</span>X ∈ ℝ⁵ˣᵈ
          </div>
          <div className="a-s1-detail" style={{marginTop:'10px', fontSize:'0.85rem', color:'var(--desc)'}}>通过映射矩阵赋予离散词元高维连续空间的数学语义。</div>
        </div>
        <div className={`a-s1-card ${step >= 4 ? 'a-active' : ''}`}>
          <h3 className='a-s1-h'>Positional Enc</h3><div className='a-s1-sub'>注入时序位置信息</div>
          <div className='a-tensor-box'><span className='a-tensor-label'>Context</span>X</div>
          <div className='a-arr-down'>+ P_E (sin/cos编码) ↓</div>
          <div className='a-tensor-box a-highlight a-hl-dark' style={{ fontFamily: "'Times New Roman',serif", fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.8rem)' }}>
            <span className='a-tensor-label'>Final Tensor</span>X ∈ ℝ⁵ˣᵈ
          </div>
          <div className="a-s1-detail" style={{marginTop:'10px', fontSize:'0.85rem', color:'var(--desc)'}}>引入位置编码信号保留人类语言中语法先后构成的时序图谱。</div>
        </div>
      </div>
    </div>
  );
}
