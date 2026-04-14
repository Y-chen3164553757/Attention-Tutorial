export interface TimelineEvent {
  id: string;
  year: string;
  track: 'nlp' | 'cv' | 'mg';
  side: 'up' | 'dn';
  badge: string;
  title: string;
  causalType: 'pain' | 'brk' | 'mg';
  causalLabel: string;
  content: string;
  desc: string;
  formula: string;
  formulaTag: string;
}

export const timelineData: TimelineEvent[] = [
  {
    id: 'stage-1',
    year: '1950s – 1980s',
    track: 'mg',
    side: 'up',
    badge: '阶段一 · 规则时代',
    title: '阶段一：符号主义与早期神经网络',
    causalType: 'pain',
    causalLabel: '人工强加的注意力 → 组合爆炸',
    content: '1956年达特茅斯会议确立符号主义路线。纽厄尔的「逻辑理论家」与后来的专家系统，试图将无穷的人类常识转化为 If-Then 规则代码——本质上是人类在为机器强行分配"注意力"，告诉机器遇到什么条件必须关注什么，但很快便陷入规则组合爆炸的死局。\n\n1958年罗森布拉特发明感知机，打开了机器自主学习的大门。然而1969年明斯基指出其"无法解决异或问题"的致命缺陷，将神经网络打入十年冷宫。转机在于：保罗·韦伯斯推导、辛顿等人重新发表反向传播算法(BP)，为多层网络提供了"责任分配"的数学基础——这正是机器未来能自主调控注意力权重的底层引擎。',
    desc: '"在这个阶段，机器没有自己的注意力。人类试图充当机器的大脑，最终却被现实的复杂性与规则的极限压垮。"',
    formula: '\\Delta w_{ij} = -\\eta \\dfrac{\\partial E}{\\partial w_{ij}}',
    formulaTag: '反向传播：注意力权重的底层引擎'
  },
  {
    id: 'stage-2',
    year: '1980s – 2000s',
    track: 'nlp',
    side: 'dn',
    badge: '阶段二 · 序列建模',
    title: '阶段二：序列建模的探索',
    causalType: 'pain',
    causalLabel: '长距离依赖问题 → 梯度消失',
    content: '1982 年 Hopfield 网络引入递归连接，1986 年 RNN 正式提出，机器终于开始「从左到右」处理序列——文字、语音、时间序列。RNN 的隐藏状态承载着对历史的「记忆」，这是一种朴素的注意力代理：机器开始知道顺序，知道「之前发生了什么」。\n\n然而 1991 年 Hochreiter 证明了「梯度消失」的数学诅咒：距离越远的信息，对当前的影响越趋近零。1997 年，Hochreiter 与 Schmidhuber 发明了 LSTM，引入遗忘门、输入门、输出门三道闸，用「细胞状态高速公路」绕过梯度消失。2003 年 Bengio 提出神经语言模型，将词映射为连续向量，为后续深度序列学习奠基。',
    desc: '"RNN/LSTM 是线性的记忆，它必须一步一步读完整句话才能处理。长距离的依赖，依然是它的噩梦。"',
    formula: 'C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t',
    formulaTag: 'LSTM 细胞状态高速公路'
  },
  {
    id: 'stage-3',
    year: '2006 – 2015',
    track: 'cv',
    side: 'up',
    badge: '阶段三 · 深度复兴',
    title: '阶段三：深度学习复兴与关键架构突破',
    causalType: 'brk',
    causalLabel: '信息瓶颈暴露 → 呼唤注意力机制',
    content: '2006 年辛顿（Hinton）发表深度信念网络（DBN）论文，开启深度学习复兴。2009 年李飞飞团队正式开放 ImageNet 数据集——1400 万张标注图片引爆数据燃料，机器第一次拥有了足够庞大的训练样本。2012 年 AlexNet 以 GPU 暴力算力横空出世，将 ImageNet 错误率从 26.2% 砸至 15.3%，深度学习时代正式开启。机器获得了局部感受野——CNN 的滑动窗口本质上是一种静态的、局部的注意力。\n\n2014 年 Sutskever 等人提出 Seq2Seq，将整个句子压缩为固定长度的「上下文向量 c」，尝试用 RNN 做英法翻译。但 c 必须独自承载所有语义，翻译越长句子越差。与此同时，2015 年何恺明的 ResNet 通过残差跳跃连接解决了极深网络训练难题，为后来 Transformer 堆叠数十层奠定了架构基础。',
    desc: '"Seq2Seq 的信息瓶颈就像把一本书压成一句话——丢失是必然的。这个缺陷直接呼唤了注意力机制的诞生。"',
    formula: '\\mathcal{H}(x) = \\mathcal{F}(x) + x',
    formulaTag: 'ResNet 残差连接：深度堆叠的铺垫'
  },
  {
    id: 'stage-4',
    year: '2014 – 2017',
    track: 'nlp',
    side: 'dn',
    badge: '阶段四 · Attention 诞生',
    title: '阶段四：注意力机制演进与 Transformer 诞生',
    causalType: 'brk',
    causalLabel: '自注意力 + 残差连接 → 现代大模型核心',
    content: '2014 年 Bahdanau 提出软注意力 (Soft Attention)，首次让解码器在生成每个词时动态对齐编码器的所有隐状态——机器终于获得了自主分配注意力的权力，翻译质量大幅提升。2015 年 Luong 进一步简化了注意力计算方式。\n\n2017 年，Google 研究员 Vaswani 等人在 NIPS 大会发表论文《Attention Is All You Need》，提出 Transformer 架构：完全抛弃 RNN 的顺序约束，核心是多头自注意力 (Multi-Head Self-Attention) 与残差连接的堆叠。每个 Token 同时与所有 Token 计算相关性，实现真正的「全局视野」。这篇论文成为了 AI 领域被引用最多的论文之一，GPT、BERT、LLaMA 均直接脱胎于此。',
    desc: '"Transformer 的提出标志着一个全新范式的诞生——注意力机制释放了并行的潜力，彻底改变了序列建模的规则。"',
    formula: '\\text{Attention}(Q,K,V)=\\text{softmax}\\!\\left(\\dfrac{QK^\\top}{\\sqrt{d_k}}\\right)V',
    formulaTag: 'Scaled Dot-Product Attention'
  }
];

export const TOTAL_STEPS = timelineData.length;



