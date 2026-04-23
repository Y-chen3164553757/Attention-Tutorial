export interface ScalingEvent {
  id: string;
  year: string;
  track: 'scaling';
  badge: string;
  title: string;
  causalType: 'brk';
  causalLabel: string;
  content: string;
  desc: string;
  formula: string;
  formulaTag: string;
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
  }
];

export const TOTAL_STEPS = scalingData.length;
