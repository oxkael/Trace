import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
    <section className="py-16 sm:py-20 max-w-[1040px] mx-auto px-4">
      <div className="p-7 sm:p-9 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
        <div className="p-6 sm:p-8 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Methodology & FAQ
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-black/[0.06]">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="py-4.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-base sm:text-lg text-zinc-950 group cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed pr-8 animate-in fade-in duration-150">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
