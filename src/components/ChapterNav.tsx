import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { ChapterRecord } from '../chapters/catalog';

interface ChapterNavProps {
  chapters: ChapterRecord[];
  activeChapterId: string;
  activePageIndex: number;
  showHints: boolean;
  onClose: () => void;
  onToggleHints: () => void;
  onSelectChapter: (chapterId: string, pageIndex?: number) => void;
}

function formatDuration(duration: string) {
  const [minutePart, secondPart] = duration.split(':');
  return `${minutePart}'${secondPart}"`;
}

export default function ChapterNav({
  chapters,
  activeChapterId,
  activePageIndex,
  showHints,
  onClose,
  onToggleHints,
  onSelectChapter,
}: ChapterNavProps) {
  const implementedCount = chapters.filter((chapter) => chapter.implemented).length;
  const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>([activeChapterId]);

  const totalPageCount = useMemo(
    () => chapters.reduce((sum, chapter) => sum + chapter.pages.length, 0),
    [chapters],
  );

  const expandedSet = useMemo(() => new Set(expandedChapterIds), [expandedChapterIds]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapterIds((current) =>
      current.includes(chapterId) ? current.filter((item) => item !== chapterId) : [...current, chapterId],
    );
  };

  return (
    <>
      <motion.div
        className="chapter-nav-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.aside
        className="chapter-sidebar"
        initial={{ x: -360, opacity: 0.8 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -360, opacity: 0.9 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <div className="chapter-sidebar-topline" />

        <div className="chapter-sidebar-header">
          <div>
            <div className="chapter-sidebar-kicker">Presentation Flowchart</div>
            <div className="chapter-sidebar-title-row">
              <span className="chapter-sidebar-emoji">🗂️</span>
              <h2 className="chapter-sidebar-title">课程流程导航</h2>
            </div>
          </div>

          <button type="button" className="chapter-sidebar-close" onClick={onClose} aria-label="关闭章节导航">
            ✕
          </button>
        </div>

        <div className="chapter-sidebar-summary">
          <div>
            已规划 <strong>{totalPageCount}</strong> 页 · 已实现 <strong>{implementedCount}</strong> 章
          </div>
          <div className="mt-2">章节可展开到页级目录，已实现页面支持直接跳转</div>
        </div>

        <div className="chapter-sidebar-list">
          {chapters.map((chapter) => {
            const isActive = chapter.id === activeChapterId;
            const isReady = chapter.implemented;
            const isExpanded = expandedSet.has(chapter.id);

            return (
              <div key={chapter.id} className="chapter-sidebar-group">
                <div
                  className={[
                    'chapter-sidebar-card',
                    isActive ? 'chapter-sidebar-card-active' : '',
                    !isReady ? 'chapter-sidebar-card-disabled' : '',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    className="chapter-sidebar-card-toggle"
                    onClick={() => toggleChapter(chapter.id)}
                    aria-expanded={isExpanded}
                    aria-label={`展开${chapter.title}页目录`}
                  >
                    <span className={isExpanded ? 'chapter-sidebar-card-chevron chapter-sidebar-card-chevron-open' : 'chapter-sidebar-card-chevron'}>
                      ▾
                    </span>
                  </button>

                  <button
                    type="button"
                    className="chapter-sidebar-card-main"
                    onClick={() => onSelectChapter(chapter.id, 0)}
                    disabled={!isReady}
                  >
                    <div className="chapter-sidebar-card-icon">✦</div>

                    <div className="chapter-sidebar-card-body">
                      <div className="chapter-sidebar-card-title-row">
                        <span className="chapter-sidebar-card-order">{chapter.order.toString().padStart(2, '0')}</span>
                        <div className="chapter-sidebar-card-title">{chapter.title}</div>
                      </div>
                      <div className="chapter-sidebar-card-subtitle">{chapter.subtitle}</div>
                      <div className="chapter-sidebar-card-meta">
                        <span className="chapter-sidebar-card-duration">{formatDuration(chapter.duration)}</span>
                        <span className="chapter-sidebar-card-range">{chapter.range}</span>
                        <span className="chapter-sidebar-card-pages">{chapter.pages.length} 页</span>
                      </div>
                    </div>

                    <span className={isActive ? 'chapter-sidebar-card-dot chapter-sidebar-card-dot-active' : 'chapter-sidebar-card-dot'} />
                  </button>
                </div>

                {isExpanded ? (
                  <div className="chapter-sidebar-pages">
                    {chapter.pages.map((page, index) => {
                      const isPageActive = isActive && activePageIndex === index;
                      const isPageReady = isReady && page.implemented !== false;

                      return (
                        <button
                          key={page.id}
                          type="button"
                          className={[
                            'chapter-sidebar-page',
                            isPageActive ? 'chapter-sidebar-page-active' : '',
                            !isPageReady ? 'chapter-sidebar-page-disabled' : '',
                          ].join(' ')}
                          onClick={() => onSelectChapter(chapter.id, index)}
                          disabled={!isPageReady}
                        >
                          <span className="chapter-sidebar-page-index">P{index + 1}</span>
                          <span className="chapter-sidebar-page-body">
                            <span className="chapter-sidebar-page-title">{page.title}</span>
                            <span className="chapter-sidebar-page-note">{page.note ?? '待补充内容'}</span>
                          </span>
                          <span className={isPageActive ? 'chapter-sidebar-page-dot chapter-sidebar-page-dot-active' : 'chapter-sidebar-page-dot'} />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="chapter-sidebar-settings">
          <div className="chapter-sidebar-settings-title">🎞️ 录屏辅助设置</div>

          <div className="chapter-sidebar-settings-card">
            <div>
              <div className="chapter-sidebar-settings-label">键盘操作提示</div>
              <div className="chapter-sidebar-settings-help">
                {showHints ? '已开启 · 显示操作指引' : '已关闭 · 隐藏所有操作提示'}
              </div>
            </div>

            <button
              type="button"
              className={showHints ? 'settings-switch settings-switch-on' : 'settings-switch'}
              onClick={onToggleHints}
              aria-pressed={showHints}
            >
              <span className="settings-switch-thumb" />
            </button>
          </div>

          <div className="chapter-sidebar-keycaps">
            <div className="chapter-sidebar-keycap">⇅ 切换页</div>
            <div className="chapter-sidebar-keycap">←→ 步进</div>
          </div>

          <div className="chapter-sidebar-footer-hint">TAB 菜单 · ESC 关闭</div>
        </div>
      </motion.aside>
    </>
  );
}