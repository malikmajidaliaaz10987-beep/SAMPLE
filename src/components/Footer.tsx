import React from 'react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenWriteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenWriteModal }) => {
  return (
    <footer className="border-t border-[#E8E1D3] bg-[#F7F4EE] pt-14 pb-12 text-stone-600 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#E8E1D3]">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <span className="font-serif-editorial text-2xl font-medium text-stone-900">
              Folio Journal
            </span>
            <p className="mt-3 text-stone-500 leading-relaxed max-w-sm">
              An independent, curated single-page quarterly exploring the physical and conceptual dimensions of design, architecture, materiality, and the contemplative mind.
            </p>
            <div className="mt-4 text-[11px] text-stone-400">
              ISSN 2714-8831 · Published in Zurich & Kyoto
            </div>
          </div>

          {/* Departments */}
          <div>
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Editorial Sections
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('Architecture')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Spatial Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Typography & Craft')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Typography & Letterpress
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Ecology')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Boreal Ecology & Stillness
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Philosophy')}
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Continental Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Submissions & Colophon */}
          <div>
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Submissions & Archive
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenWriteModal}
                  className="hover:text-stone-900 transition-colors cursor-pointer underline underline-offset-4"
                >
                  Submit an Essay / Draft
                </button>
              </li>
              <li>
                <span className="text-stone-400 cursor-default">Style Manual 2026</span>
              </li>
              <li>
                <span className="text-stone-400 cursor-default">Archival Holdings</span>
              </li>
              <li>
                <span className="text-stone-400 cursor-default">Masthead & Ethics</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Folio Journal Editorial Council. All essays copyrighted by their respective authors.
          </div>
          <div className="flex items-center gap-6">
            <span>Set in Newsreader & Plus Jakarta Sans</span>
            <span>Single Page Monograph Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
