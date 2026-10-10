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
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-700">
          Historical Audit Ledger
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-3">
          Verdicts & Outcome Ledger
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
          Trace records every condition assessment and measures stock and token divergence after 1 hour and 24 hours. Full transparency with sample sizes.
        </p>
      </div>

      {/* Totals Summary */}
      <div className="p-5 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/[0.07]">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Ledger Statistics
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] bg-white text-zinc-900 font-semibold border border-black/5 shadow-2xs">
            Live Verifications
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-5 rounded-[22px] bg-white border border-black/[0.06] shadow-2xs">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Logged</span>
            <div className="text-3xl font-bold text-zinc-950 mt-1 nums">
              {scoreboard.totals.verdicts_logged}
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-white border border-black/[0.06] shadow-2xs">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Resolved 24h</span>
            <div className="text-3xl font-bold text-zinc-950 mt-1 nums">
              {scoreboard.totals.resolved}
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-white border border-black/[0.06] shadow-2xs">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Live Journal</span>
            <div className="text-3xl font-bold text-zinc-950 mt-1 nums">
              {scoreboard.journal.events_recorded_live}
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-white border border-black/[0.06] shadow-2xs">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Historical Base</span>
            <div className="text-3xl font-bold text-zinc-700 mt-1 nums">
              {scoreboard.journal.events_loaded_historical}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Verdict Code */}
      <div className="p-7 sm:p-9 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
        <div className="p-6 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs">
          <h3 className="text-base font-bold text-zinc-950 mb-4">
            Distribution & 24h Move by Condition Code
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] text-zinc-400 font-medium">
                  <th className="py-2.5 pr-4">Condition</th>
                  <th className="py-2.5 px-3 text-right">Logged</th>
                  <th className="py-2.5 px-3 text-right">Resolved</th>
                  <th className="py-2.5 px-3 text-right">Median 24h Move</th>
                  <th className="py-2.5 pl-3 text-right">Observed 24h Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {scoreboard.by_verdict.map((v, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-900 border border-black/[0.04]">
                        {v.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-zinc-900 nums">
                      {v.count}
                    </td>
                    <td className="py-3.5 px-3 text-right text-zinc-600 nums">
                      {v.resolved}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-zinc-900 nums">
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

          <div className="mt-5 pt-4 border-t border-black/[0.06] text-xs text-zinc-500 flex items-center justify-between">
            <span>{scoreboard.note}</span>
            <span className="nums">Resolution Window: 1h & 24h post-verdict</span>
          </div>
        </div>
      </div>
    </div>
  );
};
