import React from 'react';
import type { Verdict } from '../types/contract';
import { Clock, AlertTriangle, VolumeX, CheckCircle, HelpCircle } from 'lucide-react';

interface VerdictBannerProps {
  verdict: Verdict;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ verdict }) => {
  const getIcon = (code: string) => {
    switch (code) {
      case 'WAIT':
        return Clock;
      case 'CAUTION':
        return AlertTriangle;
      case 'QUIET':
        return VolumeX;
      case 'REASONABLE':
        return CheckCircle;
      default:
        return HelpCircle;
    }
  };

  const IconComponent = getIcon(verdict.code);

  return (
    <div className="p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] bg-white border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
      {/* Top Header: Badge & Evidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-zinc-950 text-white shadow-xs">
            <IconComponent className="w-3.5 h-3.5" />
            <span>{verdict.code}</span>
          </span>
          <span className="text-xs font-medium text-zinc-400">
            Assessed Market Condition
          </span>
        </div>

        {/* Evidence Chips */}
        {verdict.evidence && verdict.evidence.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-zinc-400 font-medium">Triggered by:</span>
            {verdict.evidence.map((ev, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-zinc-100 text-zinc-700 border border-black/[0.04]"
              >
                {ev}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Verdict Content */}
      <div className="mt-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          {verdict.headline}
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-3xl font-normal">
          {verdict.reason}
        </p>

        <div className="mt-5 pt-3.5 flex items-center gap-2 text-xs text-zinc-400 border-t border-black/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span>{verdict.limitation}</span>
        </div>
      </div>
    </div>
  );
};
