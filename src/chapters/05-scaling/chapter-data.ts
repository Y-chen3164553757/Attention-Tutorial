export interface ScalingEvent {
  id: string;
  year: string;
  track: 'scaling';
  badge: string;
  title: string;
  causalType?: 'brk';
  causalLabel?: string;
  content: string;
  desc?: string;
  formula?: string;
  formulaTag?: string;
  // Stage 2: Radial attention era
  eyebrow?: string;
  subtitle?: string;
  satNodes?: SatNode[];
  // Stage 3: Global rivalry
  modelCards?: ModelCard[];
}

export interface SatNode {
  icon: string;        // FontAwesome class
  title: string;
  subtitle: string;
  desc: string;
  metric: string;
  metricVal: string;
  targetX: number;
  targetY: number;
}

export interface ModelVersion {
  name: string;      // 模型型号
  date: string;      // 发布日期 "YYYY-MM"
  highlight?: boolean; // 是否高亮（重大版本）
}

export interface ModelCard {
  name: string;
  tag: string;
  icon: string;
  faction: 'china' | 'us';
  special?: boolean;
  versions: ModelVersion[];
}

export const scalingData: ScalingEvent[] = [
  {
    id: 'stage-5',
    year: '2018 – 2023',
    track: 'scaling',
    badge: '阶段五 · 范式重塑',
    title: '规模法则与「涌现」的破局',
    causalType: 'brk',
    causalLabel: '纯解码器 + 规模定律 + RLHF → 智能涌现与对齐',
    content: `Transformer 诞生后，多数研究者聚焦于双向架构的微调。而 OpenAI 团队逆向而行，选择了备受冷落的"纯解码器"路线：无需预设特定任务，只要顶住算力压力，坚持海量数据的自回归训练，让机器不断"预测下一个词"，它终能自行内化世界的规则。

从 GPT-1 的 1.17 亿参数，到 GPT-2 的 15 亿，量变一直在蓄力。直到 2020 年，当参数量被狂热地推高到 1750 亿时，高维空间的壁垒被彻底击穿。模型打破了性能线性增长的常规，展现出惊人的"语境学习（In-context Learning）"能力——机器能够举一反三，这就是大模型最震撼的"智能涌现"。

然而，千亿参数的巨兽仍如同脱缰之马。直到 2022 年底，RLHF（人类反馈强化学习）被引入，完成了至关重要的"对齐（Alignment）"。搭载该技术的 ChatGPT 横空出世，上线仅 5 天用户破百万——原本写在论文里的高深数学，在这一刻彻底颠覆了人类社会的科技进程。`,
    desc: '"这不是魔法，这是数学在高维空间中极致放大的必然结果。大模型没有改变 Attention 的基础，而是通过规模法则与对齐技术，唤醒了沉睡在参数中的逻辑。"',
    formula: '\\mathcal{R} = \\mathbb{E}_{(x,y)\\sim\\pi}\\left[\\hat{r}(x, y)\\right] - \\beta \\cdot D_{\\text{KL}}\\left[\\pi_\\theta(y|x)\\|\\pi_{\\text{SFT}}(y|x)\\right]',
    formulaTag: 'RLHF：对齐人类意图的强化学习目标'
  },
  {
    id: 'stage-6',
    year: '2023 – 2026',
    track: 'scaling',
    badge: '阶段六 · 纪元开启',
    eyebrow: 'ATTENTION ERA: 2023 - 2026',
    title: 'Attention 的全维度衍生与底层重构',
    content: '从 2023 年开始，Attention 机制彻底打破了文本序列的边界。它不仅向多模态与系统推理延伸，更在自身架构上实现了极其优雅的显存压缩与效率突围。',
    satNodes: [
      {
        icon: 'fa-solid fa-shapes',
        title: '跨模态空间统一',
        subtitle: 'OMNI-MODAL ATTENTION',
        desc: '打破物理模态隔离。将音频波形与视觉 Patch 彻底转化为离散 Token，令自注意力机制能在统一的高维空间中实现原生端到端对齐。',
        metric: '突破现象',
        metricVal: '极低延迟拟真交互',
        targetX: -420,
        targetY: -200
      },
      {
        icon: 'fa-solid fa-brain',
        title: '慢思考推理演进',
        subtitle: 'SYSTEM 2 / CHAIN OF THOUGHT',
        desc: '将 Attention 分配给推理期的超长"隐藏思维链"。结合强化学习，让模型在自我反思与验证中打破"预测下一个词"的快思考瓶颈。',
        metric: '突破现象',
        metricVal: '数学与代码逻辑飞跃',
        targetX: 420,
        targetY: -200
      },
      {
        icon: 'fa-solid fa-magnifying-glass-chart',
        title: '百万级上下文',
        subtitle: 'LONG-CONTEXT RETRIEVAL',
        desc: 'RoPE 机制拓展与 Sparse Attention 的结合。模型能够瞬间吞入数百万 Token，在信息汪洋中实现接近 100% 准确率的"大海捞针"。',
        metric: '突破现象',
        metricVal: '1M+ Token 级全局视野',
        targetX: -480,
        targetY: 60
      },
      {
        icon: 'fa-solid fa-network-wired',
        title: '稀疏混合专家网络',
        subtitle: 'MIXTURE OF EXPERTS (MoE)',
        desc: '解除算力诅咒。Attention 层计算后，路由网络根据当前语义动态只激活极少部分的"专家"参数，完美兼顾万亿级容量与极致推理效率。',
        metric: '突破现象',
        metricVal: '极细粒度稀疏激活',
        targetX: 480,
        targetY: 60
      },
      {
        icon: 'fa-solid fa-earth-americas',
        title: '物理规律内化',
        subtitle: 'WORLD MODELS (e.g. DiT)',
        desc: '扩散模型与 Transformer 深度融合（DiT）。Attention 在海量时空块中隐式学习时间一致性与三维透视，在模型内部重构物理法则。',
        metric: '突破现象',
        metricVal: '超长连贯视频生成',
        targetX: -380,
        targetY: 300
      },
      {
        icon: 'fa-solid fa-microchip',
        title: '底层显存极致压缩',
        subtitle: 'KV CACHE COMPRESSION / MLA',
        desc: '针对长序列推理中的显存墙问题，对标准 Attention 实施"手术级重构"。引入多头潜在注意力，通过极低秩投影令显存开销断崖式下降。',
        metric: '突破现象',
        metricVal: '推理成本断崖下跌',
        targetX: 380,
        targetY: 300
      }
    ]
  },
  {
    id: 'stage-7',
    year: '2023 – 2026',
    track: 'scaling',
    badge: '阶段七 · 全球博弈',
    eyebrow: 'GLOBAL RIVALRY',
    title: '大模型生态的双峰对决',
    content: '在算力与算法的交织下，世界 AI 演变为双寡头格局。一侧是凭借底层重构打破壁垒的中国生态，另一侧是坚守算力高墙的硅谷闭源霸权。',
    modelCards: [
      // 中国阵营
      {
        name: 'DeepSeek', tag: 'MLA · 极限突围', icon: 'deepseek-color.png',
        faction: 'china', special: true,
        versions: [
          { name: 'DeepSeek-V2',     date: '2024-05-06', highlight: false },
          { name: 'DeepSeek-V2.5',   date: '2024-09-05', highlight: false },
          { name: 'DeepSeek-V3',     date: '2024-12-26', highlight: true  },
          { name: 'DeepSeek-R1',     date: '2025-01-20', highlight: true  },
        ]
      },
      {
        name: 'Qwen', tag: '开源霸主', icon: 'qwen-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'Qwen1.5',         date: '2024-02-04', highlight: false },
          { name: 'Qwen2',           date: '2024-06-07', highlight: true  },
          { name: 'Qwen2.5',         date: '2024-09-19', highlight: false },
          { name: 'Qwen3 (235B)',     date: '2025-08-13', highlight: true  },
        ]
      },
      {
        name: 'Kimi', tag: '长文本领跑', icon: 'kimi-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'Kimi (200万长文本)', date: '2024-03-18', highlight: true  },
          { name: 'Kimi K2 (开源MoE)', date: '2025-07-11', highlight: true  },
          { name: 'Kimi K2.5',        date: '2026-01-26', highlight: false },
          { name: 'Kimi K2.6',        date: '2026-04-20', highlight: true  },
        ]
      },
      {
        name: 'GLM', tag: '全栈矩阵', icon: 'zhipu-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'GLM-4',           date: '2024-01-16', highlight: true  },
          { name: 'GLM-4-0520',      date: '2024-06-05', highlight: false },
          { name: 'GLM-4-Plus',      date: '2024-08-29', highlight: false },
          { name: 'GLM-4-Voice',     date: '2024-12-20', highlight: false },
        ]
      },
      {
        name: 'Doubao', tag: '国民级应用', icon: 'doubao-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'Doubao-pro',      date: '2024-05-15', highlight: false },
          { name: 'Doubao-Video',    date: '2024-09-24', highlight: false },
          { name: 'Doubao-vision',   date: '2024-12-18', highlight: false },
          { name: 'Doubao-pro-1215', date: '2024-12-30', highlight: true  },
        ]
      },
      // 美国阵营
      {
        name: 'GPT', tag: '闭源领航者', icon: 'openai.png',
        faction: 'us', special: false,
        versions: [
          { name: 'GPT-4o',          date: '2024-05-13', highlight: true  },
          { name: 'o1',              date: '2024-09-12', highlight: true  },
          { name: 'GPT-5',           date: '2025-08-07', highlight: true  },
          { name: 'GPT-5.5',         date: '2026-04-24', highlight: true  },
        ]
      },
      {
        name: 'Claude', tag: '系统级对齐', icon: 'claude-color.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Claude 3.5 Sonnet', date: '2024-06-20', highlight: true },
          { name: 'Claude 3.7 Sonnet', date: '2025-02-24', highlight: true },
          { name: 'Claude 4',          date: '2025-05-22', highlight: true },
          { name: 'Claude 4.6',        date: '2026-02-20', highlight: false },
        ]
      },
      {
        name: 'Gemini', tag: '原生多模态', icon: 'gemini-color.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Gemini 1.5 Pro',  date: '2024-02-15', highlight: true  },
          { name: 'Gemini 1.5 Flash', date: '2024-05-14', highlight: false },
          { name: 'Gemini 2.0 Flash', date: '2024-12-11', highlight: true  },
          { name: 'Gemini 3 Pro',   date: '2025-11-18', highlight: true  },
        ]
      },
      {
        name: 'Llama', tag: '开源底座', icon: 'meta-color.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Llama 3',          date: '2024-04-18', highlight: true  },
          { name: 'Llama 3.1',        date: '2024-07-23', highlight: false },
          { name: 'Llama 3.2',        date: '2024-09-25', highlight: false },
          { name: 'Llama 4 Scout',    date: '2025-04-05', highlight: true  },
        ]
      },
      {
        name: 'Grok', tag: '实时数据流', icon: 'grok.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Grok-2',           date: '2024-08-13', highlight: false },
          { name: 'Grok-3 Beta',     date: '2025-02-19', highlight: true  },
          { name: 'Grok-4',           date: '2025-07-09', highlight: true  },
          { name: 'Grok-4.1',         date: '2025-11-17', highlight: false },
        ]
      },
    ]
  }
];

export const TOTAL_STEPS = scalingData.length;
