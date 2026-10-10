import React from 'react';
import type { Verdict } from '../types/contract';
import { AlertTriangle, Clock, VolumeX, CheckCircle, HelpCircle } from 'lucide-react';

interface VerdictBannerProps {
  verdict: Verdict;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ verdict }) => {
  const getVerdictStyle = (code: string) => {
    switch (code) {
      case 'WAIT':
        return {
          bg: 'bg-zinc-950 text-white border-zinc-800/90 shadow-xl',
          badgeBg: 'bg-white text-zinc-950',
          textColor: 'text-zinc-200',
          evidenceBg: 'bg-white/10 text-zinc-200 border border-white/10',
          borderSubtle: 'border-white/10',
          icon: Clock
        };
      case 'CAUTION':
        return {
          bg: 'bg-zinc-950 text-white border-zinc-800/90 shadow-xl',
          badgeBg: 'bg-white text-zinc-950',
          textColor: 'text-zinc-200',
          evidenceBg: 'bg-white/10 text-zinc-200 border border-white/10',
          borderSubtle: 'border-white/10',
          icon: AlertTriangle
        };
      case 'QUIET':
        return {
          bg: 'bg-zinc-950 text-white border-zinc-800/90 shadow-xl',
          badgeBg: 'bg-white text-zinc-950',
          textColor: 'text-zinc-200',
          evidenceBg: 'bg-white/10 text-zinc-200 border border-white/10',
          borderSubtle: 'border-white/10',
          icon: VolumeX
        };
      case 'REASONABLE':
        return {
          bg: 'bg-zinc-950 text-white border-zinc-800/90 shadow-xl',
          badgeBg: 'bg-white text-zinc-950',
          textColor: 'text-zinc-200',
          evidenceBg: 'bg-white/10 text-zinc-200 border border-white/10',
          borderSubtle: 'border-white/10',
          icon: CheckCircle
        };
      default:
        return {
          bg: 'bg-zinc-950 text-white border-zinc-800/90 shadow-xl',
          badgeBg: 'bg-white text-zinc-950',
          textColor: 'text-zinc-200',
          evidenceBg: 'bg-white/10 text-zinc-200 border border-white/10',
          borderSubtle: 'border-white/10',
          icon: HelpCircle
        };
    }
  };

  const style = getVerdictStyle(verdict.code);
  const IconComponent = style.icon;

  return (
    <div className={`p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border ${style.bg} transition-all relative overflow-hidden`}>
      {/* Subtle ambient lighting accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${style.borderSubtle}`}>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${style.badgeBg} shadow-sm inline-flex items-center gap-1.5`}>
            <IconComponent className="w-3.5 h-3.5" />
            {verdict.code}
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
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium ${style.evidenceBg}`}
              >
                {ev}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {verdict.headline}
        </h2>
        <p className={`mt-2.5 text-sm sm:text-base ${style.textColor} leading-relaxed max-w-3xl font-normal`}>
          {verdict.reason}
        </p>

        <div className={`mt-5 pt-3.5 flex items-center gap-2 text-xs text-zinc-400 border-t ${style.borderSubtle}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span>{verdict.limitation}</span>
        </div>
      </div>
    </div>
  );
};
