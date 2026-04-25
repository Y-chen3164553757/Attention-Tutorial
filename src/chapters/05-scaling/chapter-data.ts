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
  // Stage 4: DeepSeek breakthrough
  stats?: DeepSeekStat[];
  compareRows?: CompareRow[];
  milestones?: Milestone[];
  techCards?: TechCard[];
  // Stage 5: 2026 model release timeline
  timelineCards?: TimelineCard[];
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

export interface DeepSeekStat {
  label: string;
  value: string;
  note: string;
  color: 'cyan' | 'purple';
}

export interface CompareRow {
  china: string;
  chinaSub: string;
  west: string;
  westSub: string;
}

export interface Milestone {
  date: string;
  title: string;
  desc: string;
  highlight: boolean;
}

export interface TechCard {
  title: string;
  desc: string;
  color: 'cyan' | 'purple';
  metric: string;
  metricVal: string;
}

// Stage 5: 2026 模型发布完整时间轴
export interface TimelineCard {
  date: string;
  dateShort: string;
  company: string;
  companyEn: string;
  model: string;
  desc: string;
  faction: 'china' | 'us';
  icon: string;
  color: string;
  tag: string;
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
    content: `Transformer 诞生后，当行业被 BERT 的双向架构微调范式主导时，OpenAI 团队始终坚守纯解码器路线。从 GPT-2 开始，他们尝试摆脱特定任务的束缚，顶住算力压力，坚持海量数据的自回归训练。

从 GPT-1 的 1.17 亿参数，到 GPT-2 的 15 亿，量变一直在蓄力。直到 2020 年，GPT-3 基于规模法则将参数量提升至 1750 亿，打破了性能线性增长的规律，展现出惊人的 "语境学习" 能力 —— 机器能够举一反三，这正是学界定义的大模型 "智能涌现" 核心表现。

然而，千亿参数模型的输出仍与人类需求存在明显偏差。经过数年的探索，RLHF（人类反馈强化学习）技术终于在 2022 年初的 InstructGPT 上成熟落地，完成了至关重要的 "对齐"。2022 年底，搭载该技术的 ChatGPT 横空出世，上线仅 5 天用户破百万。`,
    desc: '"这不是魔法，这是规模法则与对齐技术结合的工程化成果。大模型并未颠覆 Attention 的核心逻辑，而是通过海量数据与算力，释放了参数中蕴含的语言建模与逻辑推理能力。"',
    formula: '\\mathcal{R} = \\mathbb{E}_{(x,y)\\sim\\pi}\\left[\\hat{r}(x, y)\\right] - \\beta \\cdot D_{\\text{KL}}\\left[\\pi_\\theta(y|x)\\|\\pi_{\\text{SFT}}(y|x)\\right]',
    formulaTag: 'RLHF：对齐人类意图的强化学习目标'
  },
  {
    id: 'stage-6',
    year: '2017 – 2025',
    track: 'scaling',
    badge: '阶段六 · 纪元开启',
    eyebrow: 'ATTENTION ERA: 2023 - 2026',
    title: 'Attention 的全维度衍生与底层重构',
    content: '自 2017 年 Transformer 论文发布后，Attention 机制持续演进：多模态融合、超长上下文、稀疏计算、显存压缩等方向相继突破，驱动大模型能力边界的不断扩展。',
    satNodes: [
      {
        icon: 'fa-solid fa-shapes',
        title: '跨模态空间对齐',
        subtitle: 'CROSS-MODAL ATTENTION',
        desc: '多模态大模型通过统一 Token 化或共享语义空间，将文本、图像、音频等异构模态映射至同一表示空间，使跨模态间可进行 Attention 运算，实现语义层面的跨感官理解与生成。',
        metric: '突破现象',
        metricVal: '端到端多模态理解',
        targetX: -490,
        targetY: -234
      },
      {
        icon: 'fa-solid fa-brain',
        title: '长链推理机制',
        subtitle: 'CHAIN OF THOUGHT (CoT)',
        desc: '通过提示工程引导模型显式生成中间推理步骤，将复杂问题分解为多步子问题。Attention 机制在整个显式推理序列上运行，使模型得以对推理路径进行全局建模与自我修正。',
        metric: '突破现象',
        metricVal: '复杂推理能力提升',
        targetX: 490,
        targetY: -234
      },
      {
        icon: 'fa-solid fa-magnifying-glass-chart',
        title: '超长上下文建模',
        subtitle: 'LONG-CONTEXT ATTENTION',
        desc: '基于 RoPE 位置编码扩展与 Sparse Attention 等优化，模型上下文窗口已扩展至百万量级。Attention 在更长序列范围内建模依赖关系，显著提升长文档理解与信息检索能力。',
        metric: '突破现象',
        metricVal: '100 万 Token 上下文窗口',
        targetX: -560,
        targetY: 65
      },
      {
        icon: 'fa-solid fa-network-wired',
        title: '稀疏混合专家网络',
        subtitle: 'MIXTURE OF EXPERTS (MoE)',
        desc: 'MoE 将模型参数拆分为多个"专家"网络，由门控路由机制依据输入动态激活对应专家，使总参数量与训练成本脱钩。相比稠密模型，可在等效算力下实现更高模型容量。',
        metric: '突破现象',
        metricVal: '万亿参数高效扩展',
        targetX: 560,
        targetY: 65
      },
      {
        icon: 'fa-solid fa-earth-americas',
        title: '扩散 Transformer 生成',
        subtitle: 'DiT (Diffusion Transformer)',
        desc: 'DiT 将 Transformer 架构引入扩散模型，以自注意力机制替换传统 U-Net 对时空块进行全局建模，有效提升生成图像的语义一致性与细节质量，成为高分辨率视觉生成的主流范式。',
        metric: '突破现象',
        metricVal: '高分辨率视觉生成',
        targetX: -440,
        targetY: 340
      },
      {
        icon: 'fa-solid fa-microchip',
        title: '注意力显存压缩',
        subtitle: 'KV CACHE OPTIMIZATION / MLA',
        desc: '长序列推理中 KV Cache 是显存主要瓶颈。Multi-Head Latent Attention（MLA）等架构通过低秩投影对 Key-Value 进行压缩存储，在保持模型性能的同时显著降低长序列推理的显存占用。',
        metric: '突破现象',
        metricVal: '长序列推理显存降低',
        targetX: 440,
        targetY: 340
      }
    ]
  },
  {
    id: 'stage-7',
    year: '2023 – 2025',
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
          { name: 'DeepSeek-V2',        date: '2024-05-06', highlight: false },
          { name: 'DeepSeek-V2.5',      date: '2024-09-05', highlight: false },
          { name: 'DeepSeek-V3',        date: '2024-12-26', highlight: true  },
          { name: 'DeepSeek-R1',         date: '2025-01-20', highlight: true  },
        ]
      },
      {
        name: 'Qwen', tag: '开源霸主', icon: 'qwen-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'Qwen1.5',            date: '2024-02-04', highlight: false },
          { name: 'Qwen2',              date: '2024-06-07', highlight: true  },
          { name: 'Qwen2.5',            date: '2024-09-19', highlight: false },
          { name: 'Qwen3 (235B)',        date: '2025-08-13', highlight: true  },
        ]
      },
      {
        name: 'Kimi', tag: '长文本领跑', icon: 'kimi-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'Kimi (200万长文本)', date: '2024-03-18', highlight: true  },
          { name: 'Kimi K2 (开源MoE)',  date: '2025-07-11', highlight: true  },
          { name: 'Kimi K2-0905',       date: '2025-09-05', highlight: false },
          { name: 'Kimi K2 Thinking',   date: '2025-11-06', highlight: true  },
        ]
      },
      {
        name: 'GLM', tag: '全栈矩阵', icon: 'zhipu-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'GLM-4',             date: '2024-01-16', highlight: true  },
          { name: 'GLM-4-0520',         date: '2024-06-05', highlight: false },
          { name: 'GLM-4-Plus',         date: '2024-08-29', highlight: false },
          { name: 'GLM-4-Voice',        date: '2024-12-20', highlight: false },
        ]
      },
      {
        name: 'Doubao', tag: '国民级应用', icon: 'doubao-color.png',
        faction: 'china', special: false,
        versions: [
          { name: 'Doubao-pro',         date: '2024-05-15', highlight: false },
          { name: 'Doubao-Video',       date: '2024-09-24', highlight: false },
          { name: 'Doubao-vision',      date: '2024-12-18', highlight: false },
          { name: 'Doubao-pro-1215',    date: '2024-12-30', highlight: true  },
        ]
      },
      // 美国阵营
      {
        name: 'GPT', tag: '闭源领航者', icon: 'openai.png',
        faction: 'us', special: false,
        versions: [
          { name: 'GPT-4o',             date: '2024-05-13', highlight: true  },
          { name: 'o1',                 date: '2024-09-12', highlight: true  },
          { name: 'GPT-5',              date: '2025-08-07', highlight: true  },
          { name: 'GPT-5.2-Codex',      date: '2025-12-18', highlight: true  },
        ]
      },
      {
        name: 'Claude', tag: '系统级对齐', icon: 'claude-color.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Claude 3.5 Sonnet',   date: '2024-06-20', highlight: true  },
          { name: 'Claude 3.7 Sonnet',  date: '2025-02-24', highlight: true  },
          { name: 'Claude 4',            date: '2025-05-22', highlight: true  },
          { name: 'Claude Sonnet 4.5',   date: '2025-09-29', highlight: false },
        ]
      },
      {
        name: 'Claude Opus', tag: '旗舰对齐', icon: 'claude-color.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Claude Opus 4.5',    date: '2025-11-24', highlight: true  },
        ]
      },
      {
        name: 'Gemini', tag: '原生多模态', icon: 'gemini-color.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Gemini 1.5 Pro',     date: '2024-02-15', highlight: true  },
          { name: 'Gemini 2.5 Pro',     date: '2025-03-25', highlight: true  },
          { name: 'Gemini 2.5 Flash',   date: '2025-06-17', highlight: false },
          { name: 'Gemini 3 Pro',       date: '2025-11-18', highlight: true  },
        ]
      },
      {
        name: 'Llama', tag: '开源底座', icon: 'meta-color.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Llama 3',             date: '2024-04-18', highlight: true  },
          { name: 'Llama 3.1',           date: '2024-07-23', highlight: false },
          { name: 'Llama 3.2',           date: '2024-09-25', highlight: false },
          { name: 'Llama 4 Scout',       date: '2025-04-05', highlight: true  },
        ]
      },
      {
        name: 'Grok', tag: '实时数据流', icon: 'grok.png',
        faction: 'us', special: false,
        versions: [
          { name: 'Grok-2',              date: '2024-08-13', highlight: false },
          { name: 'Grok-3 Beta',         date: '2025-02-19', highlight: true  },
          { name: 'Grok-4',              date: '2025-07-09', highlight: true  },
          { name: 'Grok-4.1',            date: '2025-11-17', highlight: false },
        ]
      },
    ]
  },
  {
    id: 'stage-8',
    year: '2024 – 2025',
    track: 'scaling',
    badge: '阶段八 · 破壁时刻',
    eyebrow: 'DEEPSEEK BREAKTHROUGH',
    subtitle: 'DeepSeek 的底层重构：算法效率 vs 算力规模',
    // Stage 4: DeepSeek breakthrough
    stats: [
      { label: 'V3 预训练成本优化', value: '$5.5M', note: '基于约 2048 H800 集群公开披露数据', color: 'cyan' },
      { label: '极具竞争力的推理定价', value: '1/50', note: '缓存命中场景，对比同级别闭源头部模型输入定价', color: 'purple' },
      { label: 'AIME 2024 复杂推理', value: '86.7%', note: '特定评测条件下，达同期开源模型领先水平', color: 'cyan' },
    ],
    compareRows: [
      { china: '算法效率优先', chinaSub: '注重底层架构创新与参数利用率', west: '算力规模驱动', westSub: '依托大规模算力探索模型能力上限' },
      { china: '开源共创模式', chinaSub: '开放模型权重，促进学术与落地研发', west: '闭源 API 服务', westSub: '提供标准化接口，保障模型迭代安全性' },
      { china: '本土生态适配', chinaSub: '优化国内算力集群部署与硬件适配', west: '全球化云服务', westSub: '依托国际云厂商，提供成熟商业解决方案' },
    ],
    milestones: [
      { date: '2024-12-26', title: 'V3 模型发布', desc: '采用 MLA 与 DeepSeekMoE 架构，应用 FP8 混合精度训练，有效提升训练效率。', highlight: false },
      { date: '2025-01-20', title: 'R1 全面开源', desc: '探索将纯强化学习引入后训练阶段，显著提升模型在复杂推理任务中的表现。', highlight: true },
      { date: '2025-01-24', title: '获《Nature》关注报道', desc: '《Nature》刊文报道其强化学习训练方法，肯定其对开源 AI 研究社区的积极贡献。', highlight: true },
    ],
    techCards: [
      { title: 'MLA 架构', desc: '对 Key-Value 缓存进行联合压缩，在多数交互场景下有效降低推理期显存占用。', color: 'cyan', metric: 'KV 压缩 (vs MHA)', metricVal: '-93%' },
      { title: 'DeepSeekMoE', desc: '结合共享专家与细粒度路由策略，在控制激活参数量的前提下，优化专家网络的分配效率。', color: 'cyan', metric: '激活参数量', metricVal: '37B / 671B' },
      { title: 'GRPO 强化学习', desc: '省去传统 RLHF 中的独立价值模型以降低训练开销，采用组相对策略优化，在数学与代码场景表现良好。', color: 'purple', metric: '训练效率提升', metricVal: '显著' },
      { title: '多尺寸蒸馏', desc: '尝试将大模型的推理模式蒸馏至较小规模的密集型模型，为端侧设备本地化部署提供技术参考。', color: 'purple', metric: '蒸馏效果', metricVal: '可用' },
    ],
  },
  {
    id: 'stage-9',
    year: '2026.1 – 2026.5',
    track: 'scaling',
    eyebrow: 'ATTENTION TIMELINE · 2026.1 – 2026.5 · GLOBAL RIVALRY',
    title: 'Attention 的探索还在继续',
    subtitle: '全球 AI 竞争格局加速重塑',
    timelineCards: [
      { date: '2026-01-26', dateShort: '1月26日', company: '月之暗面', companyEn: 'Moonshot AI', model: 'Kimi K2.5', desc: '年初最强国产开源 API 之一，首发上线 NGC 等云平台。', faction: 'china', icon: 'kimi-color.png', color: '#00E5FF', tag: '国产开源' },
      { date: '2026-02-05', dateShort: '2月5日',   company: 'Anthropic', companyEn: 'Anthropic', model: 'Claude Opus 4.6', desc: '巩固代码生成与长文本处理的稳定性。', faction: 'us', icon: 'claude-color.png', color: '#FF6B6B', tag: '旗舰升级' },
      { date: '2026-02-11', dateShort: '2月11日', company: '智谱', companyEn: 'Zhipu AI', model: 'GLM-5', desc: '首个由中国公司发布的顶级 Frontier 模型，参数达 744B。', faction: 'china', icon: 'zhipu-color.png', color: '#FFD700', tag: 'Frontier' },
      { date: '2026-02-15', dateShort: '2月15日', company: '通义千问', companyEn: 'Alibaba Qwen', model: 'Qwen3.5 系列', desc: '奠定 Qwen3 家族年初的基座能力与多尺寸矩阵。', faction: 'china', icon: 'qwen-color.png', color: '#FF6B35', tag: '家族矩阵' },
      { date: '2026-02-17', dateShort: '2月17日', company: 'Anthropic', companyEn: 'Anthropic', model: 'Claude Sonnet 4.6', desc: '优化响应速度与企业级 API 吞吐量。', faction: 'us', icon: 'claude-color.png', color: '#FF6B6B', tag: '速度优化' },
      { date: '2026-02-19', dateShort: '2月19日', company: 'Google', companyEn: 'Google DeepMind', model: 'Gemini 3.1 Pro Preview', desc: '全面开放 100 万 token 窗口的顶级预览基座。', faction: 'us', icon: 'gemini-color.png', color: '#4FC3F7', tag: '百万窗口' },
      { date: '2026-02-26', dateShort: '2月26日', company: 'Google', companyEn: 'Google DeepMind', model: 'Nano Banana 2', desc: '针对图像生成与密集文本嵌入的 Gemini 3.1 Flash Image 模型。', faction: 'us', icon: 'gemini-color.png', color: '#4FC3F7', tag: '图像嵌入' },
      { date: '2026-03-03', dateShort: '3月3日',  company: 'Google', companyEn: 'Google DeepMind', model: 'Gemini 3.1 Flash Lite', desc: '极致降本增效的端侧 Flash 变体。', faction: 'us', icon: 'gemini-color.png', color: '#4FC3F7', tag: '轻量高效' },
      { date: '2026-03-05', dateShort: '3月5日',  company: 'OpenAI', companyEn: 'OpenAI', model: 'GPT-5.4 Thinking / Pro', desc: '强化慢思考与推理链路，奠定第一季度统治力。', faction: 'us', icon: 'openai.png', color: '#10A37F', tag: '推理旗舰' },
      { date: '2026-03-17', dateShort: '3月17日', company: 'OpenAI', companyEn: 'OpenAI', model: 'GPT-5.4 mini / nano', desc: '针对移动端与高频 API 调用的轻量级模型。', faction: 'us', icon: 'openai.png', color: '#10A37F', tag: '轻量 API' },
      { date: '2026-03-20', dateShort: '3月下旬', company: '月之暗面', companyEn: 'Moonshot AI', model: 'Kimi K2.6', desc: '长文本与复杂代码逻辑能力的持续升级。', faction: 'china', icon: 'kimi-color.png', color: '#00E5FF', tag: '能力升级' },
      { date: '2026-04-01', dateShort: '4月1日',  company: '通义千问', companyEn: 'Alibaba Qwen', model: 'Qwen3.6-Plus', desc: '强化商业 API 调用的综合性能。', faction: 'china', icon: 'qwen-color.png', color: '#FF6B35', tag: '商业 API' },
      { date: '2026-04-07', dateShort: '4月7日',  company: 'Anthropic', companyEn: 'Anthropic', model: 'Claude Mythos (Preview)', desc: '针对复杂叙事、创意写作与深度语境的新型变体。', faction: 'us', icon: 'claude-color.png', color: '#FF6B6B', tag: '创意变体' },
      { date: '2026-04-07', dateShort: '4月7日',  company: '智谱', companyEn: 'Zhipu AI', model: 'GLM-5.1', desc: '首个实现 8 小时持续工作能力的开源模型，在 SWE-Bench Pro 中首次超越 Claude Opus 4.6。', faction: 'china', icon: 'zhipu-color.png', color: '#FFD700', tag: '代码工程' },
      { date: '2026-02-14', dateShort: '2月14日', company: '豆包', companyEn: 'ByteDance', model: 'Doubao-Seed 2.0', desc: '字节跳动最新基座大模型，包含 Pro / Lite / Mini / Code 四款，Pro 版全面对标 GPT-5.2 与 Gemini 3 Pro。', faction: 'china', icon: 'doubao-color.png', color: '#CC33FF', tag: '全尺寸矩阵' },
      { date: '2026-04-15', dateShort: '4月15日', company: '通义千问', companyEn: 'Alibaba Qwen', model: 'Qwen3.6-35B-A3B', desc: '全新开源变体，专精 Agentic Coding 与前端工作流。', faction: 'china', icon: 'qwen-color.png', color: '#FF6B35', tag: 'Agent 开源' },
      { date: '2026-04-16', dateShort: '4月16日', company: 'Anthropic', companyEn: 'Anthropic', model: 'Claude Opus 4.7', desc: 'SWE-bench Pro 达 64.3%，超越 GPT-5.4；视觉分辨率提升 3 倍；长上下文能力（1M MRCR）有所下降。', faction: 'us', icon: 'claude-color.png', color: '#FF6B6B', tag: '编程旗舰' },
      { date: '2026-04-17', dateShort: '4月17日', company: 'xAI', companyEn: 'xAI', model: 'Grok 4.3 Beta', desc: '支持原生视频理解与 PDF/PPT 生成能力，仅限 SuperGrok Heavy 订阅用户（$300/月）使用。', faction: 'us', icon: 'grok.png', color: '#8B5CF6', tag: '多模态文件' },
      { date: '2026-04-20', dateShort: '4月20日', company: '通义千问', companyEn: 'Alibaba Qwen', model: 'Qwen3.6-Max-Preview', desc: 'Qwen3.6 系列满血版预览，可在 Qwen Studio 与阿里云百炼调用。', faction: 'china', icon: 'qwen-color.png', color: '#FF6B35', tag: '满血预览' },
      { date: '2026-04-21', dateShort: '4月21日', company: 'OpenAI', companyEn: 'OpenAI', model: 'GPT-Image 2', desc: '原生 4K，具备 o1 级物理常识推理，跨语种文本渲染准确率达 99%。', faction: 'us', icon: 'openai.png', color: '#10A37F', tag: '图像生成' },
      { date: '2026-04-22', dateShort: '4月22日', company: '通义千问', companyEn: 'Alibaba Qwen', model: 'Qwen3.6-27B', desc: '兼顾性能与部署成本的中等尺寸 MoE 开源模型。', faction: 'china', icon: 'qwen-color.png', color: '#FF6B35', tag: '中量开源' },
      { date: '2026-04-24', dateShort: '4月24日', company: 'DeepSeek', companyEn: 'DeepSeek', model: 'DeepSeek-V4 / V4-Pro', desc: '总参数 1.6 万亿（激活 49B），完全开源并适配华为昇腾芯片，支持 100 万 token 上下文窗口。', faction: 'china', icon: 'deepseek-color.png', color: '#00BFFF', tag: '开源旗舰' },
      { date: '2026-04-23', dateShort: '4月23日', company: 'OpenAI', companyEn: 'OpenAI', model: 'GPT-5.5 / GPT-5.5 Pro', desc: '具备顶级复杂系统工程和长周期 Agent 能力。', faction: 'us', icon: 'openai.png', color: '#10A37F', tag: '最强旗舰' },
    ],
  }
];

export const TOTAL_STEPS = scalingData.length;
