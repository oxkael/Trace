import React, { useState } from 'react';
import { Bot, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Info, Sparkles } from 'lucide-react';
import type { Briefing, SignalItem } from '../types/contract';

interface ExplanationBoxProps {
  explanation: {
    kind: 'interpretation';
    text: string;
    validated: boolean;
    fallback_used: boolean;
  };
  briefing?: Briefing;
  signals?: SignalItem[];
}

export const ExplanationBox: React.FC<ExplanationBoxProps> = ({
  explanation,
  briefing,
  signals = []
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const hasBriefing = !!briefing && !!briefing.headline;

  return (
    <div className="p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
      <div className="p-6 sm:p-8 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs space-y-6">
        
        {/* Top Header: Signals & Validation Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.08]">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-zinc-700" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
              Event-Aware Desk Briefing
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {signals.map((sig, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight shadow-2xs ${
                  sig.tone === 'notice'
                    ? 'bg-amber-100 text-amber-950 border border-amber-300'
                    : 'bg-zinc-100 text-zinc-800 border border-black/10'
                }`}
              >
                {sig.tone === 'notice' ? <AlertCircle className="w-3 h-3 text-amber-700" /> : <Info className="w-3 h-3 text-zinc-600" />}
                {sig.text}
              </span>
            ))}

            {(briefing?.validated ?? explanation.validated) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Fact-Validated
              </span>
            )}

            {(briefing?.fallback_used ?? explanation.fallback_used) && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 text-zinc-800">
                Template Fallback
              </span>
            )}
          </div>
        </div>

        {/* 1. Headline: Direct Answer */}
        {hasBriefing && briefing.headline && (
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 leading-snug">
              {briefing.headline}
            </h2>
          </div>
        )}

        {/* 2. Summary: Connected Narrative */}
        <p className="text-base sm:text-[17px] leading-relaxed sm:leading-[1.7] text-zinc-900 font-medium">
          {hasBriefing ? briefing.summary : explanation.text}
        </p>

        {/* 3. Worth Weighing (Neutral Considerations) */}
        {hasBriefing && briefing.worth_weighing && briefing.worth_weighing.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-black/[0.06] space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-600">
                Worth Weighing (Trader Decides)
              </span>
            </div>
            <ul className="space-y-2">
              {briefing.worth_weighing.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-800 leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Structured Expandable Sections */}
        {hasBriefing && briefing.sections && briefing.sections.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              Detailed Breakdown
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {briefing.sections.map((sec, idx) => {
                const isOpen = !!expandedSections[idx];
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-black/[0.07] bg-white hover:bg-zinc-50/80 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(idx)}
                      className="w-full flex items-center justify-between text-left gap-2 cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 block">
                          {sec.topic}
                        </span>
                        <span className="text-sm font-bold text-zinc-950">
                          {sec.title}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 pt-2.5 border-t border-black/[0.06] text-xs leading-relaxed text-zinc-700">
                        {sec.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Not Found (Plain statement of missing items) */}
        {hasBriefing && briefing.not_found && briefing.not_found.length > 0 && (
          <div className="pt-2 text-xs text-zinc-600 space-y-1">
            <span className="font-bold text-zinc-700">Sources checked with no data:</span>
            {briefing.not_found.map((nf, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="font-semibold text-zinc-800">{nf.item}:</span>
                <span>{nf.note}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="mt-4 pt-3.5 border-t border-black/[0.08] flex items-center justify-between text-xs sm:text-sm text-zinc-600 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-zinc-600" />
            AI informs, human decides. 24/7 token context grounded in verified facts.
          </span>
        </div>
      </div>
    </div>
  );
};
