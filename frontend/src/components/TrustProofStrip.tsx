import React from 'react';

export const TrustProofStrip: React.FC = () => {
  const sources = [
    { name: 'Bitget Reality', label: 'Tokenized Equities Engine' },
    { name: 'NYSE', label: 'Session Calendars' },
    { name: 'NASDAQ', label: 'Official Market Close' },
    { name: 'SEC EDGAR', label: '10-Q / 10-K Filings' },
    { name: 'Bloomberg', label: 'Consensus Target Range' },
    { name: 'Zacks', label: 'Earnings Estimates' },
    { name: 'Reuters', label: 'Verified Corporate News' }
  ];

  return (
    <section className="relative z-0 -mt-6 px-3 sm:-mt-8 sm:px-4">
      <div className="mx-auto max-w-[1920px] overflow-hidden rounded-b-[28px] sm:rounded-b-[36px] bg-[#f5f5f5] px-6 pb-12 pt-16 sm:pb-16 sm:pt-20 text-center border-x border-b border-black/[0.06]">
        <p className="mx-auto max-w-[34ch] text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
          The verified market feeds and official filings powering Trace.
        </p>

        <div className="mx-auto mt-10 sm:mt-12 flex w-full max-w-[1040px] flex-wrap items-center justify-center gap-6 sm:gap-10">
          {sources.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
              <span className="font-bold text-sm tracking-tight text-zinc-800">
                {s.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
