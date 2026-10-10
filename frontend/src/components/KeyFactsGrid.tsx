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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {facts.map((fact) => {
        const Icon = getFactIcon(fact.id);
        const isUnavailable = fact.value.tag === 'unavailable';

        return (
          <div
            key={fact.id}
            className="p-5 rounded-[24px] bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-black/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-500 mb-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {fact.label}
                </span>
                <div className="p-1.5 rounded-xl bg-zinc-100 text-zinc-700">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-1">
                {isUnavailable ? (
                  <span className="text-sm font-medium text-zinc-400 italic">
                    Unavailable
                  </span>
                ) : (
                  <ProvenanceTooltip value={fact.value} label={fact.label}>
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 nums">
                      {fact.value.display}
                    </span>
                  </ProvenanceTooltip>
                )}
              </div>
            </div>

            {/* Bottom provenance metadata pill */}
            <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
              <span className="font-mono truncate max-w-[120px]" title={fact.value.source}>
                {fact.value.source}
              </span>
              <span className="capitalize px-2 py-0.5 rounded-full bg-zinc-100 font-medium text-[10px] text-zinc-600 border border-black/[0.04]">
                {fact.value.freshness}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
