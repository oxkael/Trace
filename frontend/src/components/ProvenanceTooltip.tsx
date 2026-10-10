import React, { useState } from 'react';
import type { Value } from '../types/contract';
import { Info, CheckCircle2, Clock, Database } from 'lucide-react';

interface ProvenanceTooltipProps {
  value: Value;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ProvenanceTooltip: React.FC<ProvenanceTooltipProps> = ({
  value,
  label,
  className = '',
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'live':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'delayed':
        return 'text-zinc-700 bg-zinc-100 border-zinc-200';
      case 'stale':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-zinc-600 bg-zinc-50 border-zinc-200';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'observed':
        return 'bg-zinc-100 text-zinc-800';
      case 'estimated':
        return 'bg-sky-50 text-sky-800';
      case 'historical':
        return 'bg-zinc-100 text-zinc-800';
      default:
        return 'bg-rose-50 text-rose-800';
    }
  };

  return (
    <div className="relative inline-block" onMouseLeave={() => setIsOpen(false)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`cursor-pointer inline-flex items-center gap-1 group ${className}`}
      >
        {children || <span className="nums font-medium">{value.display}</span>}
        <Info className="w-3.5 h-3.5 text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 bottom-full mb-2 w-72 p-3.5 rounded-2xl bg-white text-zinc-900 shadow-xl border border-zinc-200/80 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
            <span className="font-semibold text-zinc-900">{label || 'Value Provenance'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${getFreshnessColor(value.freshness)}`}>
              {value.freshness}
            </span>
          </div>

          <div className="space-y-1.5 text-zinc-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Origin:
              </span>
              <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${getTagColor(value.tag)}`}>
                {value.tag}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Database className="w-3.5 h-3.5 text-zinc-400" /> Source:
              </span>
              <span className="font-mono text-zinc-800 font-medium truncate max-w-[140px]" title={value.source}>
                {value.source}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> Recorded:
              </span>
              <span className="nums text-zinc-700">
                {value.age_sec !== null && value.age_sec !== undefined
                  ? `${value.age_sec}s ago`
                  : new Date(value.as_of).toLocaleTimeString()}
              </span>
            </div>

            {value.reason && (
              <div className="mt-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 italic">
                {value.reason}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
