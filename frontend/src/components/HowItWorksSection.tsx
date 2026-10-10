import React from 'react';
import { Eye, Activity, Sparkles } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 max-w-[1040px] mx-auto px-4">
      {/* Title Block */}
      <div className="text-center sm:text-left">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          Architecture & Methodology
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mt-4">
          How Trace assesses market conditions.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          No invented data, no price predictions, and no black boxes. Every card is assembled from verified endpoints, tagged with freshness, and phrased for clarity.
        </p>
      </div>

      {/* 3 Numbered Cards matching nor.ma */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="group flex flex-col justify-between p-8 rounded-[36px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="nums flex size-8 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                1
              </span>
              <Eye className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
              Observe Ground Truth
            </h3>
            <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Trace monitors the real-time NYSE/NASDAQ market session. Outside regular US trading hours, reference prices are labeled as <strong>last close</strong>, never misrepresented as live equity trades.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-400 font-mono">
            NYSE / NASDAQ / Bitget Reality
          </div>
        </div>

        {/* Step 2 */}
        <div className="group flex flex-col justify-between p-8 rounded-[36px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="nums flex size-8 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                2
              </span>
              <Activity className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
              Measure Divergence
            </h3>
            <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Calculates the price gap between the token and underlying, alongside the <strong>Activity Ratio</strong>—comparing current turnover with historical medians for the same session type.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-400 font-mono">
            Divergence & Turnover Medians
          </div>
        </div>

        {/* Step 3 */}
        <div className="group flex flex-col justify-between p-8 rounded-[36px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="nums flex size-8 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                3
              </span>
              <Sparkles className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
              Contextualize & Ground
            </h3>
            <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Fetches historical event look-backs, analyst consensus, and corporate filings. Explanations are strictly fact-validated before rendering. <strong>The user always decides.</strong>
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-400 font-mono">
            Validated Synthesis • No Advice
          </div>
        </div>
      </div>
    </section>
  );
};
