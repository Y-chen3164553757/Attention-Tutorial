import type { ComponentType } from 'react';
import { KaitiChapter } from './01-kaiti';
import { OriginChapter } from './02-origin';
import { AttentionChapter } from './03-attention';
import { VitChapter } from './04-vit';

export interface ChapterComponentProps {
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
    summary: '演示对话与图像生成两个片段，提出“这些能力从何而来”的开题问题。',
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
    subtitle: 'Token · 位置编码 · Q/K/V · 多头注意力',
    range: '1:30 - 3:30',
    duration: '2:00',
    summary: '从全局视野出发，拆解 Token 化、位置编码、Q/K/V 三重身份、自注意力热力图与多头注意力机制。',
    badge: '已实现',
    implemented: true,
    pages: [
      { id: '03-01', title: '机器的全局视野', note: 'Attention 概念引入', implemented: true },
      { id: '03-02', title: '万物皆 Token', note: 'Tokenization', implemented: true },
      { id: '03-03', title: '位置编码', note: 'Positional Encoding', implemented: true },
      { id: '03-04', title: 'Q / K / V 三重身份', note: '向量角色拆解', implemented: true },
      { id: '03-05', title: '自注意力热力图', note: 'Self-Attention', implemented: true },
      { id: '03-06', title: '多头注意力', note: 'Multi-Head Attention', implemented: true },
    ],
    component: AttentionChapter,
  },
  {
    id: '04',
    order: 4,
    title: 'ViT 视觉变换器',
    subtitle: 'Patch · Q/K/V · CNN vs ViT · DINOv3',
    range: '3:30 - 4:45',
    duration: '1:15',
    summary: '从全局视野出发，拆解图片 Patch 切分、Q/K/V 统一架构、CNN 局部感受野 vs ViT 全局注意力，并演示 DINOv3 本地推理热力图。',
    badge: '已实现',
    implemented: true,
    pages: [
      { id: '04-01', title: 'AI 的全局视野', note: '概念引入', implemented: true },
      { id: '04-02', title: '切分图片为 Patch', note: 'Image Serialization', implemented: true },
      { id: '04-03', title: '万物同源的 Q/K/V', note: 'Unified Architecture', implemented: true },
      { id: '04-04', title: '近视眼 vs 上帝视角', note: 'CNN vs ViT', implemented: true },
      { id: '04-05', title: 'DINOv3 本地演示', note: 'Live WebML Demo', implemented: true },
    ],
    component: VitChapter,
  },
  {
    id: '05',
    order: 5,
    title: '迁移到图像',
    subtitle: 'ViT 与 patch token',
    range: '4:45 - 6:00',
    duration: '1:15',
    summary: '把图像切成 patch，对比 CNN 局部感受野与 ViT 全局 token 的区别。',
    badge: 'patch = token',
    implemented: false,
    pages: [
      { id: '05-01', title: 'Patch 切分', note: '图像离散化' },
      { id: '05-02', title: 'ViT 编码', note: '视觉 token 建模' },
      { id: '05-03', title: '与 CNN 对比', note: '局部与全局' },
    ],
  },
  {
    id: '06',
    order: 6,
    title: '前沿技术',
    subtitle: '多模态 + Attention 变体',
    range: '6:00 - 7:45',
    duration: '1:45',
    summary: '覆盖文本、图像、视频统一 token 空间，以及 Cross-Attention、稀疏注意力等扩展。',
    badge: '万物皆 token',
    implemented: false,
    pages: [
      { id: '06-01', title: '多模态统一', note: '跨模态 token 空间' },
      { id: '06-02', title: 'Cross-Attention', note: '信息对齐机制' },
      { id: '06-03', title: '注意力变体', note: '稀疏与高效化' },
    ],
  },
  {
    id: '07',
    order: 7,
    title: '未来展望',
    subtitle: 'Attention 的边界与挑战',
    range: '7:45 - 9:30',
    duration: '1:45',
    summary: '从 Mamba、SSM 到具身智能，讨论 Attention 是否仍是通往 AGI 的基础。',
    implemented: false,
    pages: [
      { id: '07-01', title: '现有瓶颈', note: '长度与成本问题' },
      { id: '07-02', title: '替代路线', note: 'Mamba / SSM' },
      { id: '07-03', title: '未来判断', note: 'Attention 的位置' },
    ],
  },
  {
    id: '08',
    order: 8,
    title: '收尾',
    subtitle: '回扣开题',
    range: '9:30 - 10:00',
    duration: '0:30',
    summary: '回到开头的两个生成演示，完成“现在你知道背后是什么了”的闭环。',
    implemented: false,
    pages: [
      { id: '08-01', title: '回扣开题', note: '重看生成能力' },
      { id: '08-02', title: '总结收束', note: '完成闭环' },
    ],
  },
];

