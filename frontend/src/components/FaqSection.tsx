import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What does Trace actually do?',
      a: 'Trace is an event-aware trading and research assistant for tokenized US stocks. It monitors market sessions, calculates price divergence between tokens and underlying equities, highlights upcoming earnings/macro catalysts, and reviews what happened during past similar events so you can trade or research with full context.'
    },
    {
      q: 'Does Trace make price predictions or give investment advice?',
      a: 'Never. One of our four firm non-negotiable rules is that nothing is presented as a prediction or investment advice. Trace describes current market conditions, activity ratios, and historical facts only. The user always decides.'
    },
    {
      q: 'What happens when the US stock market is closed on weekends or nights?',
      a: 'Tokenized stocks on Bitget trade 24/7, but the underlying stock market closes. When the underlying market is closed, Trace explicitly labels the reference price as "last_close" (never live) and evaluates a WAIT condition so you know the token price may reflect off-hours liquidity rather than regular market pricing.'
    },
    {
      q: 'How does Trace verify data freshness and source origin?',
      a: 'Every single number displayed carries a Value metadata object specifying its origin tag (observed, estimated, historical, unavailable), the source endpoint, and its exact age. You can hover or click any metric to inspect its provenance card.'
    },
    {
      q: 'How do orders work in Demo mode?',
      a: 'If order testing is enabled, Trace enforces a strict two-step confirmation process with safety caps ($50 max). No automated trades are ever placed without explicit user confirmation, and orders will fail safe if market conditions shift during review.'
    }
  ];

  return (
    <section className="py-16 sm:py-24 max-w-[1040px] mx-auto px-4 border-t border-zinc-200/60 dark:border-zinc-800">
      <div className="text-center sm:text-left mb-10">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          Core Principles & FAQ
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-3">
          Frequently Answered Questions
        </h2>
      </div>

      <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-5">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-base sm:text-lg text-zinc-950 dark:text-white group cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed pr-8 animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
