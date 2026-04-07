import { AnimatePresence, motion } from 'framer-motion';
import { startTransition, useEffect, useMemo, useState } from 'react';
import ChapterNav from './components/ChapterNav';
import { chapters } from './chapters/catalog';

const HINTS_STORAGE_KEY = 'presentation-show-hints';

function readStoredHints() {
  if (typeof window === 'undefined') {
    return true;
  }

  const storedValue = window.localStorage.getItem(HINTS_STORAGE_KEY);
  return storedValue === null ? true : storedValue === 'true';
}

export default function App() {
  const [activeChapterId, setActiveChapterId] = useState(() => chapters[0]?.id ?? '01');
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isChapterNavOpen, setIsChapterNavOpen] = useState(false);
  const [showHints, setShowHints] = useState(readStoredHints);

  const activeChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === activeChapterId) ?? chapters[0],
    [activeChapterId],
  );

  useEffect(() => {
    window.localStorage.setItem(HINTS_STORAGE_KEY, String(showHints));

    document.body.classList.toggle('recording-clean-mode', !showHints);
    if (!showHints && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [showHints]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setIsChapterNavOpen((current) => !current);
      }

      if (event.key === 'Escape' && isChapterNavOpen) {
        event.preventDefault();
        setIsChapterNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChapterNavOpen]);

  const ActiveChapterComponent = activeChapter.component;

  const handleSelectChapter = (chapterId: string, pageIndex?: number) => {
    const nextChapter = chapters.find((chapter) => chapter.id === chapterId);
    if (!nextChapter?.implemented || !nextChapter.component) {
      return;
    }

    startTransition(() => {
      setActiveChapterId(chapterId);
      setActivePageIndex(pageIndex ?? 0);
      setIsChapterNavOpen(false);
    });
  };

  return (
    <div className="app-shell">
      {ActiveChapterComponent ? (
        <ActiveChapterComponent
          showHints={showHints}
          onRequestChapterNav={() => setIsChapterNavOpen(true)}
          requestedPageIndex={activePageIndex}
          onPageChange={setActivePageIndex}
        />
      ) : null}

      <AnimatePresence>
        {showHints ? (
          <motion.div
            key="global-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.32 }}
            className="app-key-hint"
          >
            Tab 查看章节目录 · Esc 关闭当前浮层
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isChapterNavOpen ? (
          <ChapterNav
            chapters={chapters}
            activeChapterId={activeChapter.id}
            activePageIndex={activePageIndex}
            showHints={showHints}
            onClose={() => setIsChapterNavOpen(false)}
            onToggleHints={() => setShowHints((current) => !current)}
            onSelectChapter={handleSelectChapter}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

