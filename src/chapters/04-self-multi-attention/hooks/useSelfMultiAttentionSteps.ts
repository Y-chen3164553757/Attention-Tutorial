import { useState, useCallback, useEffect } from 'react';
import type { ChapterComponentProps } from '../../catalog';

export const PAGE_COUNT = 1;
export const STEPS = [4] as const;

export interface UseSelfMultiAttentionStepsReturn {
  page: number;
  step: number;
  advance: () => void;
  retreat: () => void;
  getWatermarkText: () => string;
}

export function useSelfMultiAttentionSteps(props: ChapterComponentProps): UseSelfMultiAttentionStepsReturn {
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
    return 'Self-Attention · 自注意力机制';
  }, []);

  return { page, step, advance, retreat, getWatermarkText };
}
