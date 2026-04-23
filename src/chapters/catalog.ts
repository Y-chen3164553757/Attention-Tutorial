import type { ComponentType } from 'react';
import { KaitiChapter } from './01-kaiti';
import { OriginChapter } from './02-origin';
import { AttentionChapter } from './03-attention';
import { SelfMultiAttentionChapter } from './04-self-multi-attention';
import { Chapter05 } from './05-scaling/Chapter05';export interface ChapterComponentProps {
  showHints: boolean;
  onRequestChapterNav: () => void;
  requestedPageIndex?: number;
  onPageChange?: (pageIndex: number) => void;
}

export interface ChapterPageRecord {
  id: string;
  title: string;
  note?: string;
  implemented?: boolean;
}

export interface ChapterRecord {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  range: string;
  duration: string;
  summary: string;
  badge?: string;
  implemented: boolean;
  pages: ChapterPageRecord[];
  component?: ComponentType<ChapterComponentProps>;
}

export const chapters: ChapterRecord[] = [
  {
    id: '01',
    order: 1,
    title: 'AI 交互演示开题',
    subtitle: 'AI Capability Demo · 开题演示',
    range: '0:00 - 0:30',
    duration: '0:30',
    summary: '演示对话与图像生成两个片段，提出"这些能力从何而来"的开题问题。',
    badge: '当前已实现',
    implemented: true,
    pages: [
      { id: '01-cover', title: '万物皆 Token', note: '封面开题页', implemented: true },
      { id: '01-demo', title: 'AI 生成能力演示', note: '标题、动图与引导', implemented: true },
    ],
    component: KaitiChapter,
  },
  {
    id: '02',
    order: 2,
    title: '探索 Attention 的起源',
    subtitle: '前传：追寻机器注意力的觉醒',
    range: '0:30 - 2:30',
    duration: '2:00',
    summary: '梳理 AI 怎样一步步学会抓重点：从人工强加规则遭遇组合爆炸，到机器获得局部感受野凝视局部，最终迎来主动决策与全局注意力的觉醒。',
    implemented: true,
    pages: [
      { id: '02-intro', title: 'Attention 的必然诞生', note: '时间线卷首语', implemented: true },
      { id: '02-act1', title: '符号主义与早期神经网络',       note: '阶段一 · 1950s – 1980s', implemented: true },
      { id: '02-act2', title: '序列建模的探索', note: '阶段二 · 1980s – 2012', implemented: true },
      { id: '02-act3', title: '深度学习复兴与关键架构突破', note: '阶段三 · 2006 – 2015',   implemented: true },
      { id: '02-act4', title: '注意力机制演进与 Transformer 诞生', note: '阶段四 · 2014 – 2017',   implemented: true },
    ],
    component: OriginChapter,
  },
  {
    id: '03',
    order: 3,
    title: '什么是 Attention',
    subtitle: '直觉 · 张量化 · 运算推演 · 多头协同',
    range: '1:30 - 3:30',
    duration: '2:00',
    summary: '从人类阅读直觉出发，拆解 Q/K/V 全局搜索机制，并详细推演点积计算、Softmax 与多头注意力。',
    badge: '已实现',
    implemented: true,
    pages: [
      { id: '03-01', title: '什么是 Attention？', note: '认知直觉与 QKV 概念', implemented: true },
      { id: '03-02', title: '驶入矩阵前', note: '文本张量化与位置编码', implemented: true },
      { id: '03-03', title: '运算推演', note: '跨域注意力计算过程', implemented: true },
    ],
    component: AttentionChapter,
  },
  {
    id: '04',
    order: 4,
    title: '自注意力机制',
    subtitle: 'Self-Attention · QKV 生成与相似度计算',
    range: '3:30 - 5:30',
    duration: '2:00',
    summary: '深入解析自注意力机制中输入如何生成 Q/K/V 矩阵，以及多头注意力的并行计算原理。',
    badge: '当前已实现',
    implemented: true,
    pages: [
      { id: '04-01', title: '自注意力机制', note: 'QKV 生成与相似度计算', implemented: true },
      { id: '04-02', title: '多头注意力机制', note: '12 个头的并行计算', implemented: true },
    ],
    component: SelfMultiAttentionChapter,
  },
  {
    id: '05',
    order: 5,
    title: '规模法则与涌现',
    subtitle: '阶段五：范式重塑 2018 – 2023',
    range: '5:30 - 7:30',
    duration: '2:00',
    summary: '从 GPT 的诞生到 ChatGPT 的横空出世，讲述纯解码器架构如何通过规模定律与 RLHF 对齐，完成从「智能涌现」到「听话好用」的跨越。',
    badge: '新增章节',
    implemented: true,
    pages: [
      { id: '05-act', title: '阶段五：规模法则与涌现', note: '阶段五 · 范式重塑', implemented: true },
    ],
    component: Chapter05,
  },
];
