import React from 'react';
import { Bot, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ExplanationBoxProps {
  explanation: {
    kind: 'interpretation';
    text: string;
    validated: boolean;
    fallback_used: boolean;
  };
}

export const ExplanationBox: React.FC<ExplanationBoxProps> = ({ explanation }) => {
  return (
    <div className="p-6 sm:p-7 rounded-[28px] bg-zinc-950 text-white shadow-xl border border-zinc-800">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Assistant Readout & Synthesis
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300">
            kind: interpretation
          </span>
          {explanation.validated && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
              <CheckCircle2 className="w-3 h-3" /> Fact-Validated
            </span>
          )}
          {explanation.fallback_used && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-950 text-amber-300">
              Template Fallback
            </span>
          )}
        </div>
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-zinc-200 font-normal">
        {explanation.text}
      </p>

      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          Strictly grounded in observed session data & filings. No price forecasts.
        </span>
      </div>
    </div>
  );
};
