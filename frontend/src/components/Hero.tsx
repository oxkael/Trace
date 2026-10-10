import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Clock } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
  onSelectTicker: (ticker: string) => void;
  isLoading?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onSelectTicker,
  isLoading = false
}) => {
  const [inputVal, setInputVal] = useState('');

  const examplePrompts = [
    { label: 'rNVDA weekend trade check', query: 'What should I know before trading rNVDA this weekend?' },
    { label: 'Microsoft analyst split', query: 'What are analysts split on for Microsoft?' },
    { label: 'Apple earnings look-back', query: 'When does Apple report earnings, and what happened last time?' },
    { label: 'Tesla off-hours volume', query: 'Is rTSLA always this quiet at night?' },
    { label: 'Compare rNVDA & rAMD', query: 'Compare rNVDA and rAMD before earnings' }
  ];

  const popularTickers = [
    { ticker: 'NVDA', token: 'rNVDA', price: '$188.40', move: '+1.18%', status: 'Weekend Closed' },
    { ticker: 'TSLA', token: 'rTSLA', price: '$242.10', move: '+2.40%', status: 'Weekend Closed' },
    { ticker: 'AMD', token: 'rAMD', price: '$164.20', move: '-0.35%', status: 'Weekend Closed' },
    { ticker: 'AMZN', token: 'rAMZN', price: '$185.90', move: '+0.12%', status: 'Weekend Closed' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  return (
    <section className="relative z-10 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto flex min-h-[82vh] max-w-[1920px] flex-col overflow-hidden rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-[#242528] via-[#161719] to-[#0a0a0a] text-white p-6 sm:p-12 shadow-2xl border border-white/10">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.18),transparent)] pointer-events-none" />

        {/* Top Eyebrow */}
        <div className="relative z-10 pt-20 sm:pt-24 flex items-center justify-center sm:justify-start">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80 bg-white/10 backdrop-blur-md border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-white/90" />
            <span>AI assists, human decides • Bitget Hackathon S2</span>
          </span>
        </div>

        {/* Headline & Input Container */}
        <div className="relative z-10 mt-8 sm:mt-12 max-w-[1040px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            {/* Left: Dual Tone Headline */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
                <span className="text-white/50 block">Ask before you trade.</span>
                <span className="text-white block mt-1">In plain words.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/70 max-w-[42ch] font-normal leading-relaxed">
                Tokenized stocks trade 24/7, but the real stock market does not. Get calm, fact-grounded condition checks, upcoming event catalysts, and historical look-backs.
              </p>
            </div>

            {/* Right: Search Input Box */}
            <div className="w-full">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 shadow-xl focus-within:border-white/50 transition-all">
                  <Search className="w-5 h-5 text-white/60 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask about rNVDA, Tesla earnings, analyst views..."
                    className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputVal.trim()}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-zinc-950 font-medium text-sm hover:bg-white/90 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                  >
                    {isLoading ? 'Checking...' : (
                      <>
                        <span>Ask</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Example Question Chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {examplePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputVal(item.query);
                      onSearch(item.query);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/75 bg-white/5 hover:bg-white/15 border border-white/10 transition-colors text-left"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Ticker Strip & Session Countdown */}
        <div className="relative z-10 mt-auto pt-12 sm:pt-16 pb-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1040px] mx-auto w-full">
          {/* Ticker tape */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold mr-1">
              Supported Tokens:
            </span>
            {popularTickers.map((t) => (
              <button
                key={t.ticker}
                type="button"
                onClick={() => onSelectTicker(t.ticker)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors text-xs font-medium"
              >
                <span className="text-white/90 font-semibold">{t.token}</span>
                <span className="nums text-white/70">{t.price}</span>
                <span className={`nums text-[11px] ${t.move.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.move}
                </span>
              </button>
            ))}
          </div>

          {/* Session Countdown */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
            <Clock className="w-3.5 h-3.5 text-zinc-300" />
            <span>US Regular Session: <strong className="nums text-white">Closed</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
