import React from 'react';
import type { LookbackRow } from '../types/contract';
import { History, ShieldAlert } from 'lucide-react';

interface LookbackTableProps {
  history: LookbackRow[];
}

export const LookbackTable: React.FC<LookbackTableProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] text-center text-sm text-zinc-600">
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
    <div className="p-7 sm:p-9 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm flex flex-col justify-between transition-all">
      <div>
        {/* Header Block matching nor.ma screenshot layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-black/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-zinc-800 shadow-2xs border border-black/5">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-zinc-950 tracking-tight">
                Event Look-back History
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Past price and token moves across identical corporate catalysts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-zinc-900 border border-black/5 shadow-2xs nums">
              Last {history.length} events
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-zinc-800 border border-black/5 shadow-2xs nums">
              Range: <strong className="text-zinc-950 font-bold">{minMove > 0 ? `+${minMove}%` : `${minMove}%`} to +{maxMove}%</strong>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-zinc-800 border border-black/5 shadow-2xs nums">
              Moves ≥ 5%: <strong className="text-zinc-950 font-bold">{largeMovesCount} of {history.length}</strong>
            </span>
          </div>
        </div>

        {/* Pure White Table Island Card */}
        <div className="mt-6 overflow-hidden rounded-[24px] bg-white border border-black/[0.05] p-3 sm:p-4 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-black/[0.08] text-zinc-600 font-extrabold uppercase text-xs tracking-wider">
                  <th className="py-3.5 pr-4">Event</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3">Timing</th>
                  <th className="py-3.5 px-3 text-right">Stock Move</th>
                  <th className="py-3.5 px-3 text-right">Token Move</th>
                  <th className="py-3.5 px-3 text-right">Turnover Δ</th>
                  <th className="py-3.5 pl-3 text-right">Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 pr-4 font-extrabold text-black text-sm sm:text-base">
                      {row.event_title}
                    </td>
                    <td className="py-4 px-3 text-zinc-700 nums font-bold text-xs sm:text-sm">
                      {row.date}
                    </td>
                    <td className="py-4 px-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-zinc-100 text-zinc-900 capitalize font-bold border border-black/5">
                        {row.timing.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`py-4 px-3 text-right font-black nums text-sm sm:text-base ${row.stock_move_pct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {row.stock_move_pct > 0 ? `+${row.stock_move_pct}%` : `${row.stock_move_pct}%`}
                    </td>
                    <td className="py-4 px-3 text-right nums font-extrabold text-sm sm:text-base">
                      {row.token_move_pct !== null && row.token_move_pct !== undefined ? (
                        <span className={row.token_move_pct >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                          {row.token_move_pct > 0 ? `+${row.token_move_pct}%` : `${row.token_move_pct}%`}
                        </span>
                      ) : (
                        <span className="text-zinc-500 italic font-medium text-xs">No token</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right nums text-zinc-700 font-medium">
                      {row.activity_change_pct !== null && row.activity_change_pct !== undefined ? (
                        `+${row.activity_change_pct}%`
                      ) : (
                        <span className="text-zinc-400 italic font-normal text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.origin === 'live'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600 border border-black/[0.04]'
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
      </div>

      {/* Disclaimers & Limitations Note */}
      <div className="mt-5 pt-3.5 border-t border-black/[0.07] flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
          <span>Past outcomes only. Not a forecast or predictive signal.</span>
        </div>
        <span className="nums font-medium text-zinc-600">Sample size N = {history.length}</span>
      </div>
    </div>
  );
};
