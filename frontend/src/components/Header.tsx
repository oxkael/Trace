import React from 'react';
import { Activity, ShieldCheck, HelpCircle, BarChart3, Radio } from 'lucide-react';
import type { MarketInfo } from '../types/contract';

interface HeaderProps {
  currentView: 'assistant' | 'scoreboard' | 'how-it-works';
  onViewChange: (view: 'assistant' | 'scoreboard' | 'how-it-works') => void;
  market?: MarketInfo;
  isMock?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  market,
  isMock = true
}) => {
  const isMarketClosed = market?.session?.state === 'closed' || market?.session?.state === 'holiday';

  return (
    <header className="fixed inset-x-0 z-50 pointer-events-none" style={{ top: '24px' }}>
      <div className="mx-auto w-full px-4 sm:px-6 max-w-[1040px] flex items-center justify-between pointer-events-auto">
        {/* Left: Brand Pill */}
        <div className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-sm transition-all">
          <div className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
          <span className="font-semibold text-sm tracking-tight text-zinc-950 dark:text-white">
            Trace
          </span>
          <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-400 pl-1 border-l border-zinc-200 dark:border-zinc-800">
            Bitget Tokenized Stocks
          </span>
        </div>

        {/* Center: Navigation Pill Menu */}
        <nav className="flex items-center gap-1 h-10 p-1 rounded-full bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-sm">
          <button
            type="button"
            onClick={() => onViewChange('assistant')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              currentView === 'assistant'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Assistant</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('scoreboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              currentView === 'scoreboard'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Scoreboard</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('how-it-works')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              currentView === 'how-it-works'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
          </button>
        </nav>

        {/* Right: Market Session & Mode Badges */}
        <div className="flex items-center gap-2">
          {/* Live Market Session Pill */}
          <div className="hidden md:flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/10 dark:border-white/10 text-xs font-medium shadow-sm">
            <Radio className={`w-3.5 h-3.5 ${isMarketClosed ? 'text-zinc-400' : 'text-emerald-500'}`} />
            <span className="text-zinc-700 dark:text-zinc-200">
              {isMarketClosed ? 'US Closed' : 'US Regular'}
            </span>
            {market?.session?.next_open_relative && isMarketClosed && (
              <span className="text-zinc-400 text-[11px] nums">
                • opens {market.session.next_open_relative}
              </span>
            )}
          </div>

          {/* Mode Pill */}
          <div className="flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/10 dark:border-white/10 text-xs font-medium shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-800 dark:text-zinc-100">Demo</span>
            {isMock && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                Mock
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
