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
    <div className="p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
      <div className="p-6 sm:p-8 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.08]">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-zinc-700" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
              Assistant Readout & Synthesis
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 border border-black/5">
              kind: interpretation
            </span>
            {explanation.validated && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Fact-Validated
              </span>
            )}
            {explanation.fallback_used && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 text-zinc-800">
                Template Fallback
              </span>
            )}
          </div>
        </div>

        <p className="text-base sm:text-[17px] leading-relaxed sm:leading-[1.7] text-zinc-950 font-medium">
          {explanation.text}
        </p>

        <div className="mt-5 pt-3.5 border-t border-black/[0.08] flex items-center justify-between text-xs sm:text-sm text-zinc-600 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-zinc-600" />
            Strictly grounded in observed session data & filings. No price forecasts.
          </span>
        </div>
      </div>
    </div>
  );
};
