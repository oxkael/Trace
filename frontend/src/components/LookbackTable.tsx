import React from 'react';
import type { LookbackRow } from '../types/contract';
import { History, ShieldAlert } from 'lucide-react';

interface LookbackTableProps {
  history: LookbackRow[];
}

export const LookbackTable: React.FC<LookbackTableProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center text-sm text-zinc-500">
        No past look-back events recorded for this instrument yet.
      </div>
    );
  }

  // Summary stats
  const stockMoves = history.map(h => h.stock_move_pct);
  const minMove = Math.min(...stockMoves);
  const maxMove = Math.max(...stockMoves);
  const largeMovesCount = history.filter(h => Math.abs(h.stock_move_pct) >= 5.0).length;

  return (
    <div className="p-6 sm:p-8 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200/70 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            <h3 className="font-bold text-base text-zinc-950 dark:text-white">
              Event Look-back History
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 nums">
              Last {history.length} events
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>Historical range: <strong className="nums text-zinc-800 dark:text-zinc-200">{minMove > 0 ? `+${minMove}%` : `${minMove}%`} to +{maxMove}%</strong></span>
            <span>•</span>
            <span>Moves ≥ 5%: <strong className="nums text-zinc-800 dark:text-zinc-200">{largeMovesCount} of {history.length}</strong></span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-medium">
                <th className="py-2.5 pr-4">Event</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Timing</th>
                <th className="py-2.5 px-3 text-right">Stock Move</th>
                <th className="py-2.5 px-3 text-right">Token Move</th>
                <th className="py-2.5 px-3 text-right">Turnover Δ</th>
                <th className="py-2.5 pl-3 text-right">Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {row.event_title}
                  </td>
                  <td className="py-3 px-3 text-zinc-500 nums">
                    {row.date}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 capitalize">
                      {row.timing.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`py-3 px-3 text-right font-bold nums ${row.stock_move_pct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {row.stock_move_pct > 0 ? `+${row.stock_move_pct}%` : `${row.stock_move_pct}%`}
                  </td>
                  <td className="py-3 px-3 text-right nums text-zinc-600 dark:text-zinc-400">
                    {row.token_move_pct !== null && row.token_move_pct !== undefined ? (
                      <span className={row.token_move_pct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {row.token_move_pct > 0 ? `+${row.token_move_pct}%` : `${row.token_move_pct}%`}
                      </span>
                    ) : (
                      <span className="text-zinc-400 italic font-normal text-[11px]">No token</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right nums text-zinc-600 dark:text-zinc-400">
                    {row.activity_change_pct !== null && row.activity_change_pct !== undefined ? (
                      `+${row.activity_change_pct}%`
                    ) : (
                      <span className="text-zinc-400 italic font-normal text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      row.origin === 'live'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {row.origin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimers & Limitations Note */}
      <div className="mt-4 pt-3 border-t border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
          <span>Past outcomes only. Not a forecast or predictive signal.</span>
        </div>
        <span className="nums">N = {history.length}</span>
      </div>
    </div>
  );
};
