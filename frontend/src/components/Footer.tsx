import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6">
      <div className="max-w-[1040px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">
            Trace
          </span>
          <span className="text-xs text-zinc-400">
            • Bitget AI Base Camp Hackathon S2 (AI Trading Desk Track)
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <span>AI assists, human decides</span>
          <span>•</span>
          <span>No predictive advice</span>
          <span>•</span>
          <span>Open market data only</span>
        </div>
      </div>
    </footer>
  );
};
