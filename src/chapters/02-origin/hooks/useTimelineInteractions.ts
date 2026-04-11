import { useState, useEffect } from 'react';

// 1. 滚动进度监听 (requestAnimationFrame 节流)
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    updateScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

// 2. 滚动间谍 (监听当前激活的阶段)
export function useScrollSpy(sectionIds: string[], offset = 200) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `-${offset}px 0px -40% 0px` }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return activeId;
}

// 3. 演示模式状态
export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  return { isDemoMode, toggleDemoMode: () => setIsDemoMode(p => !p) };
}
