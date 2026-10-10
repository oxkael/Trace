import React, { useState } from 'react';
import type { OutlookData } from '../types/contract';
import { Target, ThumbsUp, ThumbsDown, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface OutlookSectionProps {
  outlook: OutlookData;
}

export const OutlookSection: React.FC<OutlookSectionProps> = ({ outlook }) => {
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'news' | 'analyst' | 'company'>('all');

  const {
    brief,
    consensus,
    targets,
    arguments: args,
    expectations,
    recent_changes,
    timeline,
    availability
  } = outlook;

  const totalConsensus = consensus.buy + consensus.hold + consensus.sell;
  const buyPct = totalConsensus > 0 ? (consensus.buy / totalConsensus) * 100 : 0;
  const holdPct = totalConsensus > 0 ? (consensus.hold / totalConsensus) * 100 : 0;
  const sellPct = totalConsensus > 0 ? (consensus.sell / totalConsensus) * 100 : 0;

  const filteredTimeline = timeline.filter(item => {
    if (timelineFilter === 'all') return true;
    return item.kind === timelineFilter;
  });

  return (
    <div className="space-y-6">
      {/* 1. Brief & Consensus Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* The Outlook Brief Block */}
        <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/[0.07]">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Wall Street Outlook & News Synthesis
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] bg-white text-zinc-900 font-semibold border border-black/5 shadow-2xs">
                Interpretation
              </span>
            </div>

            <p className="text-base text-zinc-900 leading-relaxed font-normal">
              {brief.text}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-black/[0.07] flex items-center justify-between text-xs text-zinc-500">
            <span>
              Basis: <strong className="nums text-zinc-800 font-semibold">{brief.basis.analyst_updates} analyst updates</strong>, {brief.basis.articles} articles ({brief.basis.window_days}d window)
            </span>
            {brief.validated && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-emerald-700 text-[11px] font-semibold border border-black/5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fact Validated
              </span>
            )}
          </div>
        </div>

        {/* Analyst Consensus Breakdown */}
        {availability.consensus !== 'unavailable' && (
          <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/[0.07]">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Analyst Consensus
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-zinc-800 border border-black/5 shadow-2xs nums">
                  {totalConsensus} ratings
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full rounded-full bg-white overflow-hidden flex my-4 border border-black/5 shadow-inner">
                <div style={{ width: `${buyPct}%` }} className="bg-zinc-950" title={`Buy: ${consensus.buy}`} />
                <div style={{ width: `${holdPct}%` }} className="bg-zinc-400" title={`Hold: ${consensus.hold}`} />
                <div style={{ width: `${sellPct}%` }} className="bg-zinc-300" title={`Sell: ${consensus.sell}`} />
              </div>

              {/* Legend - Pure White Cards */}
              <div className="grid grid-cols-3 gap-2.5 text-center mt-4">
                <div className="p-3 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Buy</div>
                  <div className="text-xl font-bold text-zinc-950 nums mt-0.5">{consensus.buy}</div>
                  <div className="text-[10px] text-zinc-400 nums">{buyPct.toFixed(0)}%</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Hold</div>
                  <div className="text-xl font-bold text-zinc-950 nums mt-0.5">{consensus.hold}</div>
                  <div className="text-[10px] text-zinc-400 nums">{holdPct.toFixed(0)}%</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Sell</div>
                  <div className="text-xl font-bold text-zinc-950 nums mt-0.5">{consensus.sell}</div>
                  <div className="text-[10px] text-zinc-400 nums">{sellPct.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-black/[0.07] flex items-center justify-between text-[11px] text-zinc-500">
              <span>Source: {consensus.source}</span>
              <span className="capitalize font-medium">{consensus.freshness}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Price Targets vs Today */}
      {availability.targets !== 'unavailable' && (
        <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-black/[0.07]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                12-Month Published Price Targets vs Today
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-zinc-800 border border-black/5 shadow-2xs nums">
              {targets.analyst_count} analysts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Low Target</span>
              <div className="text-2xl font-bold text-zinc-950 mt-1 nums">
                {targets.low.display}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Consensus Mean</span>
              <div className="text-2xl font-bold text-zinc-950 mt-1 nums">
                {targets.mean.display}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">High Target</span>
              <div className="text-2xl font-bold text-zinc-950 mt-1 nums">
                {targets.high.display}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-900 shadow-xs">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Current Price</span>
              <div className="text-2xl font-bold text-white mt-1 nums">
                {targets.current_price.display}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Arguments: Supporters vs Skeptics */}
      {availability.arguments !== 'unavailable' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supporters */}
          <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-black/[0.07] text-zinc-900">
              <ThumbsUp className="w-4 h-4 text-zinc-800" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Key Bull Arguments
              </h4>
            </div>

            <div className="space-y-3.5">
              {args.supporters.map((arg, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
                  <p className="text-xs sm:text-sm text-zinc-900 leading-relaxed font-normal">
                    "{arg.text}"
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="nums font-semibold text-zinc-800">
                      Backed by {arg.source_count} sources
                    </span>
                    <span className="truncate max-w-[140px] text-zinc-400" title={arg.sources[0]?.title}>
                      {arg.sources[0]?.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeptics */}
          <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-black/[0.07] text-zinc-900">
              <ThumbsDown className="w-4 h-4 text-zinc-800" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Key Skeptic Arguments
              </h4>
            </div>

            <div className="space-y-3.5">
              {args.skeptics.map((arg, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
                  <p className="text-xs sm:text-sm text-zinc-900 leading-relaxed font-normal">
                    "{arg.text}"
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="nums font-semibold text-zinc-800">
                      Backed by {arg.source_count} sources
                    </span>
                    <span className="truncate max-w-[140px] text-zinc-400" title={arg.sources[0]?.title}>
                      {arg.sources[0]?.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Earnings Expectations (EPS & Revenue) */}
      {expectations && availability.expectations !== 'unavailable' && (
        <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-black/[0.07]">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Upcoming Earnings Estimates vs Year-Ago
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-zinc-800 border border-black/5 shadow-2xs">
              Zacks Consensus
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.05] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">EPS Estimate</span>
                <div className="text-2xl font-bold text-zinc-950 mt-1 nums">
                  {expectations.eps.expected.display}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-400">Year-Ago Actual</span>
                <div className="text-sm font-bold text-zinc-700 nums">
                  {expectations.eps.year_ago.display}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-black/[0.05] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Revenue Estimate</span>
                <div className="text-2xl font-bold text-zinc-950 mt-1 nums">
                  {expectations.revenue.expected.display}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-400">Growth YoY</span>
                <div className="text-sm font-bold text-emerald-600 nums">
                  {expectations.revenue.growth.display}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Recent Analyst Changes & Merged Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
        {/* Recent Analyst Adjustments */}
        {recent_changes && recent_changes.length > 0 && (
          <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="pb-3.5 mb-4 border-b border-black/[0.07]">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Recent Wall Street Adjustments
              </span>
            </div>

            <div className="space-y-3">
              {recent_changes.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-black/[0.05] shadow-xs flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-zinc-950">
                      {item.firm}
                    </div>
                    <div className="text-zinc-400 text-[11px] nums mt-0.5 font-medium">
                      {item.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-zinc-100 text-zinc-800 border border-black/5">
                      {item.action}
                    </span>
                    {item.target_to && (
                      <div className="mt-1 font-bold nums text-zinc-950">
                        {item.target_to.display}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merged Timeline Feed */}
        {timeline && timeline.length > 0 && (
          <div className="p-7 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-black/[0.07]">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Merged Event & News Timeline
              </span>

              {/* Kind Filters */}
              <div className="flex items-center gap-1.5">
                {(['all', 'news', 'analyst', 'company'] as const).map(kind => (
                  <button
                    key={kind}
                    onClick={() => setTimelineFilter(kind)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                      timelineFilter === kind
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'bg-white text-zinc-700 border border-black/5 hover:border-black/20'
                    }`}
                  >
                    {kind}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredTimeline.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-white border border-black/[0.05] shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-bold uppercase text-zinc-600">
                      {item.kind}
                    </span>
                    <span className="nums font-medium">{item.relative}</span>
                  </div>
                  <p className="text-xs text-zinc-900 font-medium leading-snug">
                    {item.title}
                  </p>
                  <div className="mt-2 text-[10px] text-zinc-400 flex items-center justify-between">
                    <span className="font-medium text-zinc-500">{item.source}</span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-800 hover:underline inline-flex items-center gap-0.5 font-semibold"
                      >
                        Source <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
