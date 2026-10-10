import React from 'react';
import type { Value } from '../types/contract';
import { ProvenanceTooltip } from './ProvenanceTooltip';
import { DollarSign, Landmark, ArrowLeftRight, BarChart2, Calendar } from 'lucide-react';

interface KeyFactsGridProps {
  facts: Array<{
    id: string;
    label: string;
    value: Value;
  }>;
}

export const KeyFactsGrid: React.FC<KeyFactsGridProps> = ({ facts }) => {
  const getFactIcon = (id: string) => {
    switch (id) {
      case 'session':
        return Calendar;
      case 'token_price':
        return DollarSign;
      case 'reference_price':
        return Landmark;
      case 'deviation':
        return ArrowLeftRight;
      case 'activity_ratio':
        return BarChart2;
      default:
        return DollarSign;
    }
  };

  return (
    <div className="w-full rounded-[24px] sm:rounded-[32px] bg-white border border-black/15 shadow-sm">
      {/* Top Header Row of the Unified Block */}
      <div className="px-6 py-4 border-b border-black/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-800">
            Observed Ground Truth & Core Metrics
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-900 border border-black/10 shadow-2xs">
          Audited Real-Time Feeds
        </span>
      </div>

      {/* Unified 1-Block Row with Visible Borders Between Every Writeup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y divide-black/10 sm:divide-y-0">
        {facts.map((fact, idx) => {
          const Icon = getFactIcon(fact.id);
          const isUnavailable = fact.value.tag === 'unavailable';

          return (
            <div
              key={fact.id}
              className={`p-5 sm:p-6 flex flex-col justify-between hover:bg-zinc-50/60 transition-colors ${
                // Visible desktop vertical border between writeups (except last)
                idx !== facts.length - 1 ? 'lg:border-r border-black/10' : ''
              } ${
                // Visible tablet vertical border between odd/even columns
                idx % 2 === 0 ? 'sm:border-r border-black/10' : ''
              } ${
                // Visible tablet horizontal border between rows
                idx < facts.length - 1 ? 'sm:border-b lg:border-b-0 border-black/10' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-zinc-600 mb-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-600 truncate" title={fact.label}>
                    {fact.label}
                  </span>
                  <div className="p-1.5 rounded-xl bg-zinc-100 text-zinc-800 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="my-2">
                  {isUnavailable ? (
                    <span className="text-sm font-semibold text-zinc-400 italic">
                      Unavailable
                    </span>
                  ) : (
                    <ProvenanceTooltip value={fact.value} label={fact.label}>
                      <span className="text-2xl sm:text-2xl lg:text-[25px] font-black tracking-tight text-black nums">
                        {fact.value.display}
                      </span>
                    </ProvenanceTooltip>
                  )}
                </div>
              </div>

              {/* Provenance Metadata Tag */}
              <div className="mt-4 pt-3 border-t border-black/[0.08] flex items-center justify-between text-xs text-zinc-600">
                <span className="font-mono text-[11px] font-medium truncate max-w-[110px]" title={fact.value.source}>
                  {fact.value.source}
                </span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-zinc-100 font-bold text-[10px] text-zinc-800 border border-black/5">
                  {fact.value.freshness}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
