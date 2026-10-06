/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Filter, SlidersHorizontal, BookOpen, 
  Search, Check, PenLine 
} from 'lucide-react';
import { Article, Comment } from './types/blog';
import { INITIAL_ARTICLES } from './data/mockArticles';
import { Navbar } from './components/Navbar';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { WriteModal } from './components/WriteModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';

export default function App() {
  // Articles state with localStorage persistence
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('folio_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_ARTICLES;
  });

  // Bookmarks state with localStorage persistence
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('folio_bookmarks');
      return saved ? JSON.parse(saved) : ['silence-of-concrete'];
    } catch {
      return ['silence-of-concrete'];
    }
  });

  // Liked article IDs with localStorage persistence
  const [likedArticles, setLikedArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('folio_likes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<'latest' | 'popular' | 'short'>('latest');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('folio_articles', JSON.stringify(articles));
    } catch {
      // ignore
    }
  }, [articles]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('folio_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Sync likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('folio_likes', JSON.stringify(likedArticles));
    } catch {
      // ignore
    }
  }, [likedArticles]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const isAlready = prev.includes(id);
      const next = isAlready ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(isAlready ? 'Removed from reading list' : 'Saved to reading list');
      return next;
    });
  };

  const handleToggleLike = (id: string) => {
    setLikedArticles((prev) => {
      const isLiked = prev.includes(id);
      return isLiked ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const handlePublishArticle = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
    showToast('Essay published successfully to the journal');
    // Open the new article immediately
    setSelectedArticle(newArticle);
  };

  const handleAddComment = (articleId: string, comment: Comment) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === articleId) {
          return {
            ...a,
            comments: [comment, ...a.comments],
          };
        }
        return a;
      })
    );
    // Also update selectedArticle if currently viewed
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle((curr) => curr ? {
        ...curr,
        comments: [comment, ...curr.comments],
      } : null);
    }
    showToast('Your comment has been added to the discussion');
  };

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((a) => a.category === activeCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortOption === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortOption === 'short') {
      result.sort((a, b) => {
        const timeA = parseInt(a.readTime) || 5;
        const timeB = parseInt(b.readTime) || 5;
        return timeA - timeB;
      });
    }

    return result;
  }, [articles, activeCategory, searchQuery, sortOption]);

  // Lead featured story vs secondary stories
  const leadArticle = useMemo(() => {
    if (activeCategory === 'all' && !searchQuery.trim() && sortOption === 'latest') {
      return articles.find((a) => a.featured) || articles[0];
    }
    return null;
  }, [articles, activeCategory, searchQuery, sortOption]);

  const restArticles = useMemo(() => {
    if (leadArticle) {
      return filteredArticles.filter((a) => a.id !== leadArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, leadArticle]);

  // Categorize for sections
  const gridArticles = restArticles.slice(0, 4);
  const compactArticles = restArticles.slice(4);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col font-sans selection:bg-[#E2D8C6]">
      {/* Top Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
      />

      {/* Main Single Page Publication Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Curatorial Masthead Banner */}
        <section className="mb-10 sm:mb-14 pb-8 border-b border-[#E8E1D3]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-500 font-sans mb-1.5 flex items-center gap-2">
                <span>The Contemporary Monograph</span>
                <span aria-hidden="true" className="text-stone-300">/</span>
                <span>Issue No. 14</span>
              </div>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-stone-950">
                Essays on Form, Materiality & Mind
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md leading-relaxed font-sans">
              Critical inquiries into architectural presence, the tactile weight of analog print, and the quiet spaces between thought and manufacture.
            </p>
          </div>
        </section>

        {/* Lead Featured Story (when on All and no search) */}
        {leadArticle && (
          <section className="mb-14 sm:mb-18">
            <ArticleCard
              article={leadArticle}
              onRead={(art) => setSelectedArticle(art)}
              isBookmarked={bookmarks.includes(leadArticle.id)}
              onToggleBookmark={handleToggleBookmark}
              isLiked={likedArticles.includes(leadArticle.id)}
              onToggleLike={handleToggleLike}
              variant="featured"
            />
          </section>
        )}

        {/* Filter, Search & Sort Control Bar */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E1D3]">
            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
              {[
                { label: 'All Subjects', value: 'all' },
                { label: 'Architecture', value: 'Architecture' },
                { label: 'Craft & Print', value: 'Typography & Craft' },
                { label: 'Ecology', value: 'Ecology' },
                { label: 'Philosophy', value: 'Philosophy' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveCategory(item.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === item.value
                      ? 'bg-stone-900 text-stone-50 shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-[#F2ECE1]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown & Count */}
            <div className="flex items-center gap-3 text-xs text-stone-500 font-sans">
              <span>{filteredArticles.length} {filteredArticles.length === 1 ? 'essay' : 'essays'} found</span>
              <div className="flex items-center gap-1 bg-[#F2ECE1] p-0.5 rounded-md border border-[#E4DC CE]">
                <button
                  onClick={() => setSortOption('latest')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    sortOption === 'latest' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setSortOption('popular')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    sortOption === 'popular' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Applauded
                </button>
                <button
                  onClick={() => setSortOption('short')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    sortOption === 'short' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Quick Read
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="py-20 text-center bg-[#F7F4EE] rounded-lg border border-[#E8E1D3] my-8">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto stroke-1 mb-3" />
            <h3 className="font-serif-editorial text-2xl text-stone-900">No essays match your query</h3>
            <p className="mt-2 text-sm text-stone-500 max-w-sm mx-auto">
              Try adjusting your category filter or clearing your search term to explore our archival catalog.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-5 px-4 py-2 text-xs font-medium text-stone-900 bg-white border border-stone-300 rounded-md hover:border-stone-900 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Secondary Articles Grid */}
        {gridArticles.length > 0 && (
          <section className="mb-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {gridArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onRead={(art) => setSelectedArticle(art)}
                  isBookmarked={bookmarks.includes(article.id)}
                  onToggleBookmark={handleToggleBookmark}
                  isLiked={likedArticles.includes(article.id)}
                  onToggleLike={handleToggleLike}
                  variant="standard"
                />
              ))}
            </div>
          </section>
        )}

        {/* Archive Dispatches Section (Compact Rows) */}
        {compactArticles.length > 0 && (
          <section className="mb-16 pt-8 border-t border-[#E8E1D3]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-editorial text-2xl font-normal text-stone-950">
                Departmental Archive & Shorter Notes
              </h3>
              <span className="text-xs uppercase tracking-widest text-stone-400 font-sans">
                Curatorial Index
              </span>
            </div>
            <div className="divide-y divide-[#EBE4D5]">
              {compactArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onRead={(art) => setSelectedArticle(art)}
                  isBookmarked={bookmarks.includes(article.id)}
                  onToggleBookmark={handleToggleBookmark}
                  isLiked={likedArticles.includes(article.id)}
                  onToggleLike={handleToggleLike}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter / Monograph Section */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
      />

      {/* Interactive Article Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? bookmarks.includes(selectedArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        isLiked={selectedArticle ? likedArticles.includes(selectedArticle.id) : false}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        allArticles={articles}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* Bookmarks / Reading List Slideover */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        articles={articles}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={() => {
          setBookmarks([]);
          showToast('Reading list cleared');
        }}
      />

      {/* Publish Essay Modal */}
      <WriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onPublish={handlePublishArticle}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 px-4 py-2.5 rounded-lg text-xs font-medium font-sans shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
