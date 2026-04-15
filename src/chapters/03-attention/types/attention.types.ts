import type { ChapterComponentProps } from '../../catalog';

// ============================================================
// Slide Props
// ============================================================

export interface Slide0Props {
  step: number;
}

export interface Slide1Props {
  step: number;
}

export interface Slide2Props {
  step: number;
}

// ============================================================
// Matrix Types
// ============================================================

export type MatrixStep = -1 | 0 | 1 | 2;

export interface MatrixCell {
  val: string;
  cls: string;
}

export type MatrixData = number[][];

// ============================================================
// Animation Variants
// ============================================================

export interface AnimationVariants {
  hidden: { opacity: number; scale: number };
  visible: {
    opacity: number;
    scale: number;
    transition: {
      duration: number;
      ease: readonly [number, number, number, number];
    };
  };
}

// ============================================================
// Hook Return Types
// ============================================================

export interface UseAttentionStepsReturn {
  page: number;
  step: number;
  advance: () => void;
  retreat: () => void;
  getWatermarkText: () => string;
}

// ============================================================
// TensorizeCard Props
// ============================================================

export interface TensorizeCardProps {
  tokens: readonly string[];
  resultMat: string;
  resultDim: string;
  side: 'a' | 'b';
  delay: number;
}

// ============================================================
// Constants
// ============================================================

export const PAGE_COUNT = 3;
export const STEPS = [8, 5, 9] as const;
export const S2_PROJ_STEP = 2;
export const S2_MATRIX_BASE = 5;

// Sequence tokens
export const SEQ_A = ['它', '好', '可', '爱'] as const;
export const SEQ_B = ['有', '一', '只', '小', '猫'] as const;

// ============================================================
// Re-export ChapterComponentProps for convenience
// ============================================================

export type { ChapterComponentProps };
