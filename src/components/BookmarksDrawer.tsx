import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, Trash2, ArrowUpRight, Clock } from 'lucide-react';
import { Article } from '../types/blog';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: string[];
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  articles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const bookmarkedArticles = articles.filter((a) => bookmarks.includes(a.id));

  // Compute total reading minutes
  const totalMinutes = bookmarkedArticles.reduce((acc, curr) => {
    const mins = parseInt(curr.readTime) || 5;
    return acc + mins;
  }, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs"
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-[#FBF9F5] border-l border-[#EBE4D5] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#EBE4D5] flex items-center justify-between bg-[#F7F4EE]">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-800 fill-amber-800" />
                <h3 className="font-serif-editorial text-lg font-medium text-stone-900">
                  Reading List ({bookmarkedArticles.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-stone-200/60 transition-colors cursor-pointer"
                aria-label="Close reading list"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Reading stats bar */}
            {bookmarkedArticles.length > 0 && (
              <div className="px-6 py-2.5 bg-[#EFE9DC]/70 border-b border-[#E8E1D3] flex items-center justify-between text-xs text-stone-600 font-sans">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  Estimated: {totalMinutes} min reading time
                </span>
                <button
                  onClick={onClearAll}
                  className="text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {bookmarkedArticles.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Bookmark className="w-10 h-10 mx-auto text-stone-300 stroke-1 mb-3" />
                  <p className="font-serif-editorial text-lg text-stone-800">Your reading list is empty</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Click the bookmark icon on any essay to curate your personal offline reading queue.
                  </p>
                </div>
              ) : (
                bookmarkedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 bg-white border border-[#E8E1D3] rounded-lg hover:border-stone-400 transition-all flex gap-3.5 group"
                  >
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-16 h-16 rounded object-cover shrink-0 bg-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-stone-500 font-sans uppercase tracking-wider">
                        {article.category} · {article.readTime}
                      </div>
                      <h4
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="font-serif-editorial text-sm font-medium text-stone-900 group-hover:text-amber-900 line-clamp-2 mt-0.5 cursor-pointer"
                      >
                        {article.title}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-stone-500 text-[11px]">{article.author.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onRemoveBookmark(article.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove from list"
                            aria-label={`Remove ${article.title} from bookmarks`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              onSelectArticle(article);
                              onClose();
                            }}
                            className="text-stone-900 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
                          >
                            Read <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
