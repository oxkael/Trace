import React from 'react';
import { Eye, Activity, Sparkles } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 max-w-[1040px] mx-auto px-4">
      {/* Title Block matching Screenshot 2 */}
      <div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">
          How it works.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
          Set your intent once, then let Trace assess the conditions — one read to verify sessions, another to measure history.
        </p>
      </div>

      {/* 3 Numbered Cards exactly matching Screenshot 2 */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="group flex flex-col justify-between overflow-hidden rounded-[32px] sm:rounded-[36px] border border-black/[0.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-black/20 transition-all">
          <div className="p-7 sm:p-8">
            <span className="nums flex size-8 items-center justify-center rounded-full border border-black/15 text-xs font-semibold text-zinc-800 bg-white">
              1
            </span>
            <h3 className="mt-5 text-xl font-bold text-zinc-950">
              Observe ground truth
            </h3>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              Trace monitors the real-time NYSE/NASDAQ session. Outside regular hours, reference prices are labeled as last close, never masked.
            </p>
          </div>

          <div className="relative min-h-[200px] w-full bg-zinc-50 border-t border-black/[0.06] p-6 flex flex-col justify-end">
            <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs flex items-center gap-3">
              <Eye className="w-4 h-4 text-zinc-500 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-zinc-900">NYSE / NASDAQ Regular Hours</div>
                <div className="text-[11px] text-zinc-400">Official exchange calendars</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="group flex flex-col justify-between overflow-hidden rounded-[32px] sm:rounded-[36px] border border-black/[0.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-black/20 transition-all">
          <div className="p-7 sm:p-8">
            <span className="nums flex size-8 items-center justify-center rounded-full border border-black/15 text-xs font-semibold text-zinc-800 bg-white">
              2
            </span>
            <h3 className="mt-5 text-xl font-bold text-zinc-950">
              Measure divergence
            </h3>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              Calculates the price gap vs the underlying, and computes the Activity Ratio against historical turnover medians for that session.
            </p>
          </div>

          <div className="relative min-h-[200px] w-full bg-zinc-50 border-t border-black/[0.06] p-6 flex flex-col justify-end">
            <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs flex items-center gap-3">
              <Activity className="w-4 h-4 text-zinc-500 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-zinc-900">Gap & Turnover Medians</div>
                <div className="text-[11px] text-zinc-400">Ratio vs typical session volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="group flex flex-col justify-between overflow-hidden rounded-[32px] sm:rounded-[36px] border border-black/[0.08] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-black/20 transition-all">
          <div className="p-7 sm:p-8">
            <span className="nums flex size-8 items-center justify-center rounded-full border border-black/15 text-xs font-semibold text-zinc-800 bg-white">
              3
            </span>
            <h3 className="mt-5 text-xl font-bold text-zinc-950">
              Contextualize context
            </h3>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              Reviews what happened around past similar events and consolidates analyst targets. Explanations are strictly fact-validated.
            </p>
          </div>

          <div className="relative min-h-[200px] w-full bg-zinc-50 border-t border-black/[0.06] p-6 flex flex-col justify-end">
            <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-zinc-500 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-zinc-900">Verified Synthesis</div>
                <div className="text-[11px] text-zinc-400">Strictly fact-grounded readout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
