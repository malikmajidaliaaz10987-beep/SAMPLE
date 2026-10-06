import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Bookmark, Heart, Share2, Check, 
  Type, MessageSquare, ArrowLeft, ArrowRight,
  Sun, Moon, BookOpen
} from 'lucide-react';
import { Article, Comment } from '../types/blog';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onAddComment: (articleId: string, comment: Comment) => void;
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isLiked,
  onToggleLike,
  onAddComment,
  allArticles,
  onSelectArticle,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [readerTheme, setReaderTheme] = useState<'parchment' | 'light' | 'charcoal'>('parchment');
  const [copiedLink, setCopiedLink] = useState(false);

  // New comment input state
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const articleContentRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle scroll progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = target.scrollTop / (target.scrollHeight - target.clientHeight);
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentText.trim()) return;

    setIsSubmittingComment(true);
    const newComment: Comment = {
      id: 'c_' + Date.now(),
      author: commentName.trim() || 'Anonymous Reader',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      date: 'Just now',
      content: commentText.trim(),
      likes: 0,
    };

    onAddComment(article.id, newComment);
    setCommentText('');
    setCommentName('');
    setIsSubmittingComment(false);
  };

  if (!article) return null;

  // Find next and previous articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Dynamic theme colors
  const themeClasses = {
    parchment: 'bg-[#FBF9F5] text-[#1C1917]',
    light: 'bg-white text-stone-900',
    charcoal: 'bg-[#18181B] text-[#E4E4E7]',
  }[readerTheme];

  const borderClass = readerTheme === 'charcoal' ? 'border-zinc-800' : 'border-[#EBE4D5]';
  const subtextClass = readerTheme === 'charcoal' ? 'text-zinc-400' : 'text-stone-500';
  const surfaceClass = readerTheme === 'charcoal' ? 'bg-[#27272A]' : 'bg-[#F7F4EE]';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-0 sm:p-4 lg:p-6 bg-stone-950/70 backdrop-blur-xs">
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-4xl h-full sm:h-[94vh] rounded-none sm:rounded-xl shadow-2xl overflow-hidden flex flex-col ${themeClasses}`}
        >
          {/* Sticky Reader Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-stone-200/40 z-30">
            <div
              className="h-full bg-amber-800 transition-all duration-75 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Reader Top Utility Ribbon */}
          <header className={`shrink-0 h-14 px-4 sm:px-6 flex items-center justify-between border-b ${borderClass} z-20`}>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-stone-200/50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                aria-label="Close reader"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
              <span className={`text-xs ${subtextClass} font-sans hidden md:inline border-l ${borderClass} pl-3`}>
                {article.category}
              </span>
            </div>

            {/* Reading preferences controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Typeface Toggle */}
              <button
                onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
                className="p-1.5 rounded-md hover:bg-stone-200/50 transition-colors cursor-pointer text-xs flex items-center gap-1"
                title={`Switch to ${fontFamily === 'serif' ? 'Sans-serif' : 'Serif'} font`}
              >
                <Type className="w-3.5 h-3.5" />
                <span className="text-[11px] font-sans font-medium">{fontFamily === 'serif' ? 'Serif' : 'Sans'}</span>
              </button>

              {/* Font Size Adjust */}
              <div className="flex items-center border border-stone-300/60 rounded-md overflow-hidden text-xs">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 font-sans ${fontSize === 'normal' ? 'bg-stone-800 text-stone-50' : 'hover:bg-stone-200/40'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 font-sans ${fontSize === 'large' ? 'bg-stone-800 text-stone-50' : 'hover:bg-stone-200/40'}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize('xl')}
                  className={`px-2 py-1 font-sans ${fontSize === 'xl' ? 'bg-stone-800 text-stone-50' : 'hover:bg-stone-200/40'}`}
                >
                  A++
                </button>
              </div>

              {/* Reading Theme */}
              <div className="flex items-center border border-stone-300/60 rounded-md p-0.5 gap-0.5">
                <button
                  onClick={() => setReaderTheme('parchment')}
                  className={`p-1 rounded cursor-pointer ${readerTheme === 'parchment' ? 'bg-[#EAE3D2] text-stone-900' : 'text-stone-400'}`}
                  title="Parchment theme"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setReaderTheme('light')}
                  className={`p-1 rounded cursor-pointer ${readerTheme === 'light' ? 'bg-stone-200 text-stone-900' : 'text-stone-400'}`}
                  title="Crisp white theme"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setReaderTheme('charcoal')}
                  className={`p-1 rounded cursor-pointer ${readerTheme === 'charcoal' ? 'bg-zinc-700 text-white' : 'text-stone-400'}`}
                  title="Charcoal dark theme"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className={`h-4 w-[1px] ${borderClass} mx-1`} />

              {/* Share link */}
              <button
                onClick={handleShare}
                className="p-1.5 rounded-md hover:bg-stone-200/50 transition-colors cursor-pointer"
                aria-label="Share article link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Bookmark */}
              <button
                onClick={() => onToggleBookmark(article.id)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isBookmarked ? 'text-amber-700 bg-amber-50' : 'hover:bg-stone-200/50'
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-700' : ''}`} />
              </button>
            </div>
          </header>

          {/* Scrollable Reader Body */}
          <div
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-5 sm:px-10 lg:px-16 py-8 sm:py-12 scroll-smooth"
            ref={articleContentRef}
          >
            <div className="max-w-2xl mx-auto">
              {/* Institutional Header & Vol */}
              <div className="flex items-center justify-between text-xs font-sans uppercase tracking-widest text-stone-400 pb-4 border-b border-stone-200/60 mb-8">
                <span>Folio Publication · Issue IV</span>
                <span>ACC. 2026.04.18</span>
              </div>

              {/* Article Headings */}
              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight ${
                  fontFamily === 'serif' ? 'font-serif-editorial' : 'font-sans font-bold'
                }`}
                style={{ textWrap: 'balance' }}
              >
                {article.title}
              </h1>

              {article.subtitle && (
                <p className={`mt-4 text-lg sm:text-xl leading-relaxed italic ${subtextClass} font-serif-editorial`}>
                  {article.subtitle}
                </p>
              )}

              {/* Author & Byline Grid */}
              <div className={`mt-8 py-4 border-y ${borderClass} flex flex-wrap items-center justify-between gap-4 text-xs font-sans`}>
                <div className="flex items-center gap-3">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-stone-300"
                  />
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{article.author.name}</div>
                    <div className={subtextClass}>{article.author.role}</div>
                  </div>
                </div>

                {/* Zero-Pill Unboxed Metadata */}
                <div className={`flex items-center gap-2 ${subtextClass}`}>
                  <span>{article.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Featured Cover Art */}
              <div className="mt-8 mb-10">
                <div className="overflow-hidden rounded-md bg-stone-200">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
                {article.imageCaption && (
                  <p className={`mt-2 text-xs font-serif-editorial italic ${subtextClass}`}>
                    {article.imageCaption}
                  </p>
                )}
              </div>

              {/* Prose Content with Drop Cap */}
              <div
                className={`prose max-w-none space-y-6 ${
                  fontSize === 'normal'
                    ? 'text-base sm:text-lg leading-[1.8]'
                    : fontSize === 'large'
                    ? 'text-lg sm:text-xl leading-[1.85]'
                    : 'text-xl sm:text-2xl leading-[1.9]'
                } ${fontFamily === 'serif' ? 'font-serif-editorial' : 'font-sans'}`}
              >
                {/* Opening paragraph with Drop Cap */}
                <p>
                  <span className="float-left text-5xl sm:text-6xl font-serif-editorial leading-none font-medium pr-3 pt-1 text-stone-900 dark:text-stone-100">
                    {article.content.dropCap}
                  </span>
                  {article.content.opening}
                </p>

                {/* Section 1 */}
                {article.content.section1Heading && (
                  <h2 className="pt-6 text-xl sm:text-2xl font-medium tracking-tight font-sans text-stone-900 dark:text-stone-100">
                    {article.content.section1Heading}
                  </h2>
                )}
                <p>{article.content.section1Text}</p>

                {/* Pull Quote */}
                {article.content.pullQuote && (
                  <blockquote className="my-8 py-6 px-6 border-l-2 border-stone-800 dark:border-stone-200 bg-stone-200/20 italic font-serif-editorial text-xl sm:text-2xl text-stone-800 dark:text-stone-200 leading-snug">
                    “{article.content.pullQuote}”
                  </blockquote>
                )}

                {/* Section 2 */}
                {article.content.section2Heading && (
                  <h2 className="pt-6 text-xl sm:text-2xl font-medium tracking-tight font-sans text-stone-900 dark:text-stone-100">
                    {article.content.section2Heading}
                  </h2>
                )}
                <p>{article.content.section2Text}</p>

                {/* Figure Image if available */}
                {article.content.figureImage && (
                  <div className="my-8">
                    <img
                      src={article.content.figureImage}
                      alt="Editorial figure illustration"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto rounded-md object-cover max-h-[380px]"
                    />
                    {article.content.figureCaption && (
                      <p className={`mt-2 text-xs font-serif-editorial italic ${subtextClass}`}>
                        {article.content.figureCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Conclusion */}
                <p className="pt-2">{article.content.conclusion}</p>
              </div>

              {/* Tags Section (Clean Unboxed) */}
              <div className="mt-12 pt-6 border-t border-stone-200/60">
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Tags:</span>
                  {article.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span className="hover:text-stone-900 transition-colors">#{tag}</span>
                      {idx < article.tags.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Like / Applause Action Bar */}
              <div className={`mt-8 p-6 ${surfaceClass} rounded-lg border ${borderClass} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleLike(article.id)}
                    className={`px-4 py-2 rounded-md font-sans text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                      isLiked
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-200 border border-stone-300/80 hover:border-stone-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                    <span>Applause ({article.likes + (isLiked ? 1 : 0)})</span>
                  </button>

                  <button
                    onClick={() => onToggleBookmark(article.id)}
                    className={`px-3 py-2 rounded-md font-sans text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                      isBookmarked
                        ? 'bg-amber-800 text-white'
                        : 'bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-200 border border-stone-300/80 hover:border-stone-900'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                    <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
                  </button>
                </div>

                <button
                  onClick={handleShare}
                  className="text-xs font-sans text-stone-600 dark:text-stone-400 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share link</span>
                </button>
              </div>

              {/* Author Bio Box */}
              <div className={`mt-10 p-6 border ${borderClass} rounded-lg flex items-start gap-4`}>
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover shrink-0 border border-stone-300"
                />
                <div>
                  <div className="text-xs uppercase tracking-widest text-stone-400 font-sans">About the Author</div>
                  <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 mt-0.5">{article.author.name}</h4>
                  <p className={`mt-1 text-xs leading-relaxed ${subtextClass} font-sans`}>
                    Regular contributor to Folio Journal. Dedicated to exploring intersections of craft, materiality, and contemporary culture.
                  </p>
                </div>
              </div>

              {/* Navigation to Next / Previous Article */}
              <div className={`mt-10 py-6 border-y ${borderClass} grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs`}>
                {prevArticle ? (
                  <button
                    onClick={() => onSelectArticle(prevArticle)}
                    className="text-left p-3 rounded-md hover:bg-stone-200/30 transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-1 text-stone-400 group-hover:text-stone-800 mb-1">
                      <ArrowLeft className="w-3 h-3" /> Previous Essay
                    </span>
                    <span className="font-serif-editorial text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                      {prevArticle.title}
                    </span>
                  </button>
                ) : <div />}

                {nextArticle ? (
                  <button
                    onClick={() => onSelectArticle(nextArticle)}
                    className="text-right p-3 rounded-md hover:bg-stone-200/30 transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center justify-end gap-1 text-stone-400 group-hover:text-stone-800 mb-1">
                      Next Essay <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="font-serif-editorial text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                      {nextArticle.title}
                    </span>
                  </button>
                ) : <div />}
              </div>

              {/* Reader Comments Section */}
              <section className="mt-12 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    <h3 className="text-lg font-serif-editorial font-medium text-stone-900 dark:text-stone-100">
                      Discussions ({article.comments.length})
                    </h3>
                  </div>
                </div>

                {/* Interactive Comment Form */}
                <form onSubmit={handleCommentSubmit} className={`p-4 sm:p-5 rounded-lg border ${borderClass} ${surfaceClass} mb-8`}>
                  <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 mb-3 font-sans">
                    Join the Discussion
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name or moniker..."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800"
                    />
                    <textarea
                      rows={3}
                      placeholder="Contribute your critique, reflection, or note..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingComment || !commentText.trim()}
                        className="px-4 py-1.5 text-xs font-sans font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Publish Comment
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {article.comments.length === 0 ? (
                    <p className={`text-xs italic ${subtextClass} py-4 text-center font-serif-editorial`}>
                      No comments recorded yet. Be the first to share an observation.
                    </p>
                  ) : (
                    article.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-lg border ${borderClass} bg-white/60 dark:bg-zinc-900/40`}
                      >
                        <div className="flex items-center justify-between text-xs font-sans mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="font-semibold text-stone-900 dark:text-stone-100">{comment.author}</span>
                          </div>
                          <span className={subtextClass}>{comment.date}</span>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Bottom padding */}
              <div className="h-16" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
