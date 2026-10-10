import React from 'react';
import type { ScoreboardData } from '../types/contract';

interface ScoreboardViewProps {
  scoreboard: ScoreboardData;
}

export const ScoreboardView: React.FC<ScoreboardViewProps> = ({ scoreboard }) => {
  return (
    <div className="max-w-[1040px] mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center sm:text-left">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          Historical Audit Ledger
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-3">
          Verdicts & Outcome Ledger
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Trace records every condition assessment and measures stock and token divergence after 1 hour and 24 hours. Full transparency with sample sizes.
        </p>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Logged</span>
          <div className="text-3xl font-bold text-zinc-950 dark:text-white mt-1 nums">
            {scoreboard.totals.verdicts_logged}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Resolved 24h</span>
          <div className="text-3xl font-bold text-zinc-950 dark:text-white mt-1 nums">
            {scoreboard.totals.resolved}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Live Journal Events</span>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 nums">
            {scoreboard.journal.events_recorded_live}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Historical Baseline</span>
          <div className="text-3xl font-bold text-zinc-700 dark:text-zinc-300 mt-1 nums">
            {scoreboard.journal.events_loaded_historical}
          </div>
        </div>
      </div>

      {/* Breakdown by Verdict Code */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-4">
          Distribution & 24h Move by Condition Code
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-medium">
                <th className="py-2.5 pr-4">Condition</th>
                <th className="py-2.5 px-3 text-right">Logged</th>
                <th className="py-2.5 px-3 text-right">Resolved</th>
                <th className="py-2.5 px-3 text-right">Median 24h Move</th>
                <th className="py-2.5 pl-3 text-right">Observed 24h Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {scoreboard.by_verdict.map((v, idx) => (
                <tr key={idx} className="hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 pr-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                      {v.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-zinc-900 dark:text-white nums">
                    {v.count}
                  </td>
                  <td className="py-3.5 px-3 text-right text-zinc-600 dark:text-zinc-400 nums">
                    {v.resolved}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-zinc-900 dark:text-white nums">
                    {v.median_move_24h || '—'}
                  </td>
                  <td className="py-3.5 pl-3 text-right text-zinc-500 nums font-mono">
                    {v.range_24h || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
          <span>{scoreboard.note}</span>
          <span className="nums">Resolution Window: 1h & 24h post-verdict</span>
        </div>
      </div>
    </div>
  );
};
