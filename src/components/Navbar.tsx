import React from 'react';
import { Bookmark, PenLine, Search, X } from 'lucide-react';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
  onOpenWriteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  setIsSearchOpen,
  bookmarksCount,
  onOpenBookmarks,
  onOpenWriteModal,
}) => {
  const navCategories = [
    { label: 'All Essays', value: 'all' },
    { label: 'Architecture', value: 'Architecture' },
    { label: 'Craft & Print', value: 'Typography & Craft' },
    { label: 'Ecology', value: 'Ecology' },
    { label: 'Philosophy', value: 'Philosophy' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EBE4D5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectCategory('all')}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Folio Journal Home"
            >
              <span className="font-serif-editorial text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
                Folio Journal
              </span>
            </button>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-stone-400 font-sans border-l border-stone-300 pl-3">
              Vol. IV · 2026
            </span>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`relative py-1 transition-colors cursor-pointer text-sm ${
                    isActive
                      ? 'text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-900" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-md transition-colors cursor-pointer"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Bookmarks drawer trigger */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-md transition-colors cursor-pointer"
              aria-label={`View ${bookmarksCount} bookmarked essays`}
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-50 text-[10px] font-sans font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Primary Action: Write / Draft an essay */}
            <button
              onClick={onOpenWriteModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Draft Essay</span>
            </button>
          </div>
        </div>

        {/* Collapsible Search Input Bar */}
        {isSearchOpen && (
          <div className="py-3 border-t border-stone-200">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search essays by title, theme, or author..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 text-stone-900 placeholder:text-stone-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
