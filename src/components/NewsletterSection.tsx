import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <section className="my-16 border-y border-[#E8E1D3] bg-[#F4EFE6] py-14 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
          Weekly Curatorial Dispatch
        </div>
        <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-950">
          The Folio Monograph
        </h2>
        <p className="mt-3 text-sm sm:text-base text-stone-600 font-sans leading-relaxed max-w-xl mx-auto">
          Delivered every Sunday morning. One comprehensive long-form essay on architectural philosophy, material craftsmanship, or ecological stillness. No promotions, ever.
        </p>

        {isSubscribed ? (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you for subscribing. The next edition will arrive in your inbox Sunday dawn.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@address.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 text-stone-900 placeholder:text-stone-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              Join Reader Circle
            </button>
          </form>
        )}

        <div className="mt-4 text-[11px] text-stone-400 font-sans">
          Curated by our senior editorial council · Read by 24,000+ architects and scholars worldwide.
        </div>
      </div>
    </section>
  );
};
