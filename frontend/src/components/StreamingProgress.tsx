import React from 'react';
import type { ProgressStep } from '../types/contract';
import { CheckCircle2, Loader2, AlertCircle, SkipForward } from 'lucide-react';

interface StreamingProgressProps {
  steps: ProgressStep[];
  isStreaming: boolean;
}

export const StreamingProgress: React.FC<StreamingProgressProps> = ({ steps, isStreaming }) => {
  if (steps.length === 0) return null;

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 py-4 animate-in fade-in duration-300">
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <Loader2 className="w-4 h-4 text-zinc-900 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span className="text-xs font-semibold text-zinc-800 uppercase tracking-wider">
              {isStreaming ? 'Verifying live market conditions...' : 'Pipeline execution complete'}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 nums">
            {steps.filter(s => s.status === 'done').length} of {steps.length} checks resolved
          </span>
        </div>

        {/* Steps Chips Grid */}
        <div className="flex flex-wrap gap-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                step.status === 'done'
                  ? 'bg-white text-zinc-800 border-zinc-200 shadow-2xs'
                  : step.status === 'running'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm animate-pulse'
                  : step.status === 'failed'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200/60'
              }`}
            >
              {step.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {step.status === 'running' && <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />}
              {step.status === 'failed' && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
              {step.status === 'skipped' && <SkipForward className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{step.label}</span>
              {step.ms !== undefined && (
                <span className="text-[10px] opacity-70 nums pl-1 border-l border-zinc-300">
                  {step.ms}ms
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
