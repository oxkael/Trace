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
    <div className="p-7 sm:p-9 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm transition-all">
      {/* Top Header: Badge & Evidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wider uppercase bg-black text-white shadow-xs">
            <IconComponent className="w-4 h-4" />
            <span>{verdict.code}</span>
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-zinc-600 uppercase tracking-wider">
            Assessed Market Condition
          </span>
        </div>

        {/* Evidence Chips */}
        {verdict.evidence && verdict.evidence.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-600 font-bold">Triggered by:</span>
            {verdict.evidence.map((ev, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-black border border-black/10 shadow-2xs"
              >
                {ev}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Verdict Content */}
      <div className="mt-5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black">
          {verdict.headline}
        </h2>
        <p className="mt-3 text-base sm:text-[18px] text-zinc-950 leading-relaxed sm:leading-[1.7] max-w-3xl font-medium">
          {verdict.reason}
        </p>

        <div className="mt-5 pt-4 flex items-center gap-2 text-xs sm:text-sm text-zinc-600 font-medium border-t border-black/10">
          <span className="w-2 h-2 rounded-full bg-zinc-500" />
          <span>{verdict.limitation}</span>
        </div>
      </div>
    </div>
  );
};
