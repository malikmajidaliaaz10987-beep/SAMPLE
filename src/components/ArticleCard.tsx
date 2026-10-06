import React from 'react';
import { Bookmark, Heart, ArrowUpRight } from 'lucide-react';
import { Article } from '../types/blog';

interface ArticleCardProps {
  article: Article;
  onRead: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  isLiked: boolean;
  onToggleLike: (articleId: string) => void;
  variant?: 'featured' | 'standard' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onRead,
  isBookmarked,
  onToggleBookmark,
  isLiked,
  onToggleLike,
  variant = 'standard',
}) => {
  // Featured Lead Story Card
  if (variant === 'featured') {
    return (
      <article className="group relative bg-[#F7F4EE] border border-[#E8E1D3] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Visual Column */}
          <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] bg-stone-200 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              onError={(e) => {
                // Resilient fallback container if needed
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-stone-900/10 transition-opacity group-hover:opacity-0" />
            <div className="absolute top-4 left-4">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-900 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-sm">
                Curator’s Selection
              </span>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#F7F4EE]">
            <div>
              {/* Zero-Pill Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500 font-sans tracking-wide">
                <span className="font-semibold text-stone-800 uppercase tracking-wider">{article.category}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>{article.publishedAt}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>{article.readTime}</span>
              </div>

              <h2
                onClick={() => onRead(article)}
                className="mt-4 font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-stone-950 cursor-pointer hover:text-amber-950 transition-colors"
                style={{ textWrap: 'balance' }}
              >
                {article.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-stone-600 line-clamp-3">
                {article.subtitle || article.excerpt}
              </p>
            </div>

            {/* Author Byline & Actions */}
            <div className="mt-8 pt-6 border-t border-[#E8E1D3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-stone-300"
                />
                <div>
                  <div className="text-xs font-semibold text-stone-900">{article.author.name}</div>
                  <div className="text-[11px] text-stone-500">{article.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(article.id);
                  }}
                  className={`p-2 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                    isLiked
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
                  }`}
                  aria-label="Like essay"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                  <span className="font-sans tabular-nums">{article.likes + (isLiked ? 1 : 0)}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(article.id);
                  }}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'text-amber-800 bg-amber-50'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
                  }`}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark essay'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-700' : ''}`} />
                </button>

                <button
                  onClick={() => onRead(article)}
                  className="ml-1 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-900 bg-white border border-stone-300 hover:border-stone-900 rounded-md transition-colors cursor-pointer"
                >
                  <span>Read</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact List View
  if (variant === 'compact') {
    return (
      <article className="group py-5 border-b border-[#EBE4D5] flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 hover:bg-[#F7F4EE]/50 px-2 rounded-sm transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
            <span className="font-semibold text-stone-800 uppercase tracking-wider">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>
          <h4
            onClick={() => onRead(article)}
            className="mt-1 font-serif-editorial text-lg text-stone-950 font-normal hover:text-amber-900 cursor-pointer transition-colors"
          >
            {article.title}
          </h4>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs text-stone-500">
          <span>{article.author.name}</span>
          <button
            onClick={() => onRead(article)}
            className="text-stone-900 font-medium hover:underline inline-flex items-center gap-0.5 cursor-pointer"
          >
            Read <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </article>
    );
  }

  // Standard Card View
  return (
    <article className="group flex flex-col bg-[#FBF9F5] border border-[#E8E1D3] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:border-stone-300">
      {/* Visual Header */}
      <div
        onClick={() => onRead(article)}
        className="relative aspect-4/3 bg-stone-200 overflow-hidden cursor-pointer"
      >
        <img
          src={article.coverImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-stone-950/5 group-hover:opacity-0 transition-opacity" />
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-sans tracking-wide">
            <span className="font-semibold text-stone-800 uppercase tracking-wider">{article.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{article.readTime}</span>
          </div>

          <h3
            onClick={() => onRead(article)}
            className="mt-2.5 font-serif-editorial text-xl sm:text-2xl font-normal leading-snug text-stone-950 cursor-pointer group-hover:text-amber-950 transition-colors line-clamp-2"
          >
            {article.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600 line-clamp-2">
            {article.excerpt}
          </p>
        </div>

        {/* Footer info & interactive buttons */}
        <div className="mt-6 pt-4 border-t border-[#EBE4D5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-stone-300"
            />
            <span className="text-xs font-medium text-stone-800">{article.author.name}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleLike(article.id)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                isLiked
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-stone-400 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
              aria-label="Like essay"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span className="font-sans tabular-nums text-[11px]">{article.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isBookmarked
                  ? 'text-amber-800 bg-amber-50'
                  : 'text-stone-400 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark essay'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-700' : ''}`} />
            </button>

            <button
              onClick={() => onRead(article)}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md transition-colors cursor-pointer"
              aria-label="Read full article"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
