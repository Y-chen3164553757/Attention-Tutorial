import { useState, useCallback, useEffect } from 'react';
import type { ChapterComponentProps, UseAttentionStepsReturn } from '../types/attention.types';
import { PAGE_COUNT, STEPS, S2_MATRIX_BASE } from '../types/attention.types';

export function useAttentionSteps(props: ChapterComponentProps): UseAttentionStepsReturn {
  const { requestedPageIndex = 0, onPageChange, onRequestChapterNav } = props;
  const [page, setPage] = useState(requestedPageIndex);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setPage(requestedPageIndex);
    setStep(0);
  }, [requestedPageIndex]);

  useEffect(() => {
    onPageChange?.(page);
  }, [onPageChange, page]);

  const advance = useCallback(() => {
    if (step < STEPS[page] - 1) {
      setStep(s => s + 1);
    } else if (page < PAGE_COUNT - 1) {
      setPage(p => p + 1);
      setStep(0);
    } else {
      onRequestChapterNav();
    }
  }, [page, step, onRequestChapterNav]);

  const retreat = useCallback(() => {
    if (step > 0) {
      setStep(s => s - 1);
    } else if (page > 0) {
      setPage(p => p - 1);
      setStep(STEPS[page - 1] - 1);
    }
  }, [page, step]);

  const getWatermarkText = useCallback(() => {
    if (page === 1) {
      if (step === 1) return 'Text Tensorization';
      if (step === 2) return 'Tokenization / Word Segmentation';
      if (step === 3) return 'Embedding Matrix / High Dimensional Space';
      if (step === 4) return 'Positional Encoding (Sin/Cos)';
    } else if (page === 2) {
      if (step <= 1) return 'Sequence A / B → Tensorization → X_A, X_B';
      if (step === 2) return 'Projection: X_A × W_Q → Q';
      if (step === 3) return 'Projection: X_B × W_K → K';
      if (step === 4) return 'Projection: X_B × W_V → V';
      if (step === S2_MATRIX_BASE) return 'Inner Product Q·Kᵀ';
      if (step === S2_MATRIX_BASE + 1) return 'Scaled logits / √d_k';
      if (step === S2_MATRIX_BASE + 2) return 'Softmax → probability α';
      if (step === S2_MATRIX_BASE + 3) return 'Attention Weighted Output (α·V)';
    } else if (page === 3) {
      return 'Self-Attention / Multi-Head Paradigm';
    }
    return 'Attention Mechanism';
  }, [page, step]);

  return { page, step, advance, retreat, getWatermarkText };
}
