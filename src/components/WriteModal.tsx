import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Article } from '../types/blog';

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newArticle: Article) => void;
}

const COVER_OPTIONS = [
  {
    url: '/src/assets/images/blog_lead_architecture_1791278932495.jpg',
    label: 'Architecture & Stone',
  },
  {
    url: '/src/assets/images/blog_feature_typography_1791278950074.jpg',
    label: 'Letterpress & Typography',
  },
  {
    url: '/src/assets/images/blog_feature_nature_1791278962726.jpg',
    label: 'Nordic Forest & Mist',
  },
  {
    url: '/src/assets/images/blog_feature_craft_1791278976314.jpg',
    label: 'Pottery & Ceramic Wheel',
  },
];

export const WriteModal: React.FC<WriteModalProps> = ({ isOpen, onClose, onPublish }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Article['category']>('Architecture');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Guest Essayist');
  const [selectedCover, setSelectedCover] = useState(COVER_OPTIONS[0].url);
  const [opening, setOpening] = useState('');
  const [section1Heading, setSection1Heading] = useState('');
  const [section1Text, setSection1Text] = useState('');
  const [pullQuote, setPullQuote] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !opening.trim()) return;

    const firstLetter = opening.trim().charAt(0);
    const restOfOpening = opening.trim().slice(1);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newArticle: Article = {
      id: 'essay_' + Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim() || 'A reflection on modern materiality and spatial design.',
      category,
      author: {
        name: authorName.trim() || 'Contributing Author',
        role: authorRole.trim() || 'Guest Essayist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      },
      publishedAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: '4 min read',
      coverImage: selectedCover,
      imageCaption: `Fig. 1 — Archival study for "${title.trim()}".`,
      excerpt: subtitle.trim() || opening.trim().slice(0, 140) + '...',
      content: {
        dropCap: firstLetter.toUpperCase(),
        opening: restOfOpening,
        section1Heading: section1Heading.trim() || undefined,
        section1Text: section1Text.trim() || 'The deeper truth of craft lies in its resistance to haste. When we slow down our engagement with material artifacts, their silent wisdom unfolds.',
        pullQuote: pullQuote.trim() || undefined,
        conclusion: conclusion.trim() || 'Writing and thinking remain our most faithful anchors in an ephemeral world.',
      },
      likes: 1,
      tags: tags.length > 0 ? tags : ['Editorial', category],
      comments: [],
    };

    onPublish(newArticle);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-[#FBF9F5] border border-[#E8E1D3] rounded-xl shadow-2xl flex flex-col overflow-hidden text-stone-900"
        >
          {/* Header */}
          <div className="shrink-0 px-6 py-4 border-b border-[#EBE4D5] flex items-center justify-between bg-[#F7F4EE]">
            <div>
              <div className="text-[11px] font-sans uppercase tracking-widest text-stone-500">Folio Journal Submissions</div>
              <h2 className="text-xl font-serif-editorial font-medium text-stone-900">Draft a New Essay</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Subtitle */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Essay Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., The Grammar of Silence in Modern Architecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-base font-serif-editorial bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Subtitle / Deck (Summary)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Why stripping superfluous ornament restores spatial resonance."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* Category & Author Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Article['category'])}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                >
                  <option value="Architecture">Architecture</option>
                  <option value="Typography & Craft">Typography & Craft</option>
                  <option value="Ecology">Ecology</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Digital Culture">Digital Culture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Author Title / Role
                </label>
                <input
                  type="text"
                  placeholder="Essayist / Architect"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* Choose Cover Imagery */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Curated Cover Photography
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COVER_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.url}
                    onClick={() => setSelectedCover(opt.url)}
                    className={`relative rounded-md overflow-hidden aspect-4/3 border-2 transition-all cursor-pointer text-left ${
                      selectedCover === opt.url
                        ? 'border-stone-900 ring-2 ring-stone-900/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40 p-2 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-sans font-medium line-clamp-1">{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Opening Paragraph */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Opening Paragraph (Initial drop cap will be formatted automatically) *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Begin your essay here with an engaging historical, tactile, or philosophical hook..."
                value={opening}
                onChange={(e) => setOpening(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 leading-relaxed font-serif-editorial"
              />
            </div>

            {/* Section 1 */}
            <div className="grid grid-cols-1 gap-3 p-4 bg-[#F7F4EE] rounded-lg border border-[#E8E1D3]">
              <div className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Section 1 (Optional)
              </div>
              <input
                type="text"
                placeholder="Section Heading (e.g. 01. The Resistance of Raw Matter)"
                value={section1Heading}
                onChange={(e) => setSection1Heading(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <textarea
                rows={3}
                placeholder="Elaborate on the core thesis..."
                value={section1Text}
                onChange={(e) => setSection1Text(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-serif-editorial"
              />
            </div>

            {/* Pull Quote */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Central Pull Quote (Highlight sentence)
              </label>
              <input
                type="text"
                placeholder="e.g., A sentence that captures the essence of your reflection."
                value={pullQuote}
                onChange={(e) => setPullQuote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-serif-editorial italic"
              />
            </div>

            {/* Conclusion */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Concluding Reflection
              </label>
              <textarea
                rows={3}
                placeholder="Conclude your essay with a lasting insight..."
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-serif-editorial"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Spatial Theory, Concrete, Slow Craft"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EBE4D5] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Publish to Journal</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
