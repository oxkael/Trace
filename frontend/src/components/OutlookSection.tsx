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
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6">
        {/* The Outlook Brief Block */}
        <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm flex flex-col justify-between">
          <div className="p-6 sm:p-8 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.08]">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
                  Wall Street Outlook & News Synthesis
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-zinc-950 text-white shadow-xs tracking-wide">
                  Interpretation
                </span>
              </div>

              <p className="text-base sm:text-[18px] text-zinc-950 leading-relaxed sm:leading-[1.7] font-medium antialiased">
                {brief.text}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-zinc-700 font-medium">
              <span>
                Basis: <strong className="nums text-black font-extrabold">{brief.basis.analyst_updates} analyst updates</strong>, <strong className="nums text-black font-extrabold">{brief.basis.articles} articles</strong> ({brief.basis.window_days}d window)
              </span>
              {brief.validated && (
                <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold border border-emerald-300 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Fact Validated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Analyst Consensus Breakdown */}
        {availability.consensus !== 'unavailable' && (
          <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm flex flex-col justify-between">
            <div className="p-6 sm:p-8 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.08]">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
                    Analyst Consensus
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-zinc-100 text-black border border-black/10 shadow-2xs nums">
                    {totalConsensus} ratings
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3.5 w-full rounded-full bg-zinc-100 overflow-hidden flex my-4 border border-black/10 shadow-inner">
                  <div style={{ width: `${buyPct}%` }} className="bg-black" title={`Buy: ${consensus.buy}`} />
                  <div style={{ width: `${holdPct}%` }} className="bg-zinc-500" title={`Hold: ${consensus.hold}`} />
                  <div style={{ width: `${sellPct}%` }} className="bg-zinc-300" title={`Sell: ${consensus.sell}`} />
                </div>

                {/* Legend - High-Contrast Stat Cards */}
                <div className="grid grid-cols-3 gap-2.5 text-center mt-5">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.08] shadow-xs">
                    <div className="text-xs font-extrabold text-zinc-600 uppercase tracking-wider">Buy</div>
                    <div className="text-2xl font-black text-black nums mt-0.5">{consensus.buy}</div>
                    <div className="text-xs text-zinc-600 nums font-bold">{buyPct.toFixed(0)}%</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.08] shadow-xs">
                    <div className="text-xs font-extrabold text-zinc-600 uppercase tracking-wider">Hold</div>
                    <div className="text-2xl font-black text-black nums mt-0.5">{consensus.hold}</div>
                    <div className="text-xs text-zinc-600 nums font-bold">{holdPct.toFixed(0)}%</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.08] shadow-xs">
                    <div className="text-xs font-extrabold text-zinc-600 uppercase tracking-wider">Sell</div>
                    <div className="text-2xl font-black text-black nums mt-0.5">{consensus.sell}</div>
                    <div className="text-xs text-zinc-600 nums font-bold">{sellPct.toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-black/[0.08] flex items-center justify-between text-xs text-zinc-600 font-semibold">
                <span>Source: <strong className="text-black font-bold">{consensus.source}</strong></span>
                <span className="capitalize px-2 py-0.5 rounded-full bg-zinc-100 font-bold">{consensus.freshness}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Price Targets vs Today */}
      {availability.targets !== 'unavailable' && (
        <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
          <div className="p-6 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.08]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-zinc-700" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
                  12-Month Published Price Targets vs Today
                </span>
              </div>
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-zinc-100 text-black border border-black/10 shadow-2xs nums">
                {targets.analyst_count} analysts
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4.5 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs">
                <span className="text-xs text-zinc-600 uppercase tracking-wider font-extrabold">Low Target</span>
                <div className="text-2xl sm:text-3xl font-black text-black mt-1 nums">
                  {targets.low.display}
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs">
                <span className="text-xs text-zinc-600 uppercase tracking-wider font-extrabold">Consensus Mean</span>
                <div className="text-2xl sm:text-3xl font-black text-black mt-1 nums">
                  {targets.mean.display}
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs">
                <span className="text-xs text-zinc-600 uppercase tracking-wider font-extrabold">High Target</span>
                <div className="text-2xl sm:text-3xl font-black text-black mt-1 nums">
                  {targets.high.display}
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-zinc-950 text-white border border-zinc-900 shadow-xs">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-extrabold">Current Price</span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 nums">
                  {targets.current_price.display}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Arguments: Supporters vs Skeptics */}
      {availability.arguments !== 'unavailable' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supporters */}
          <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="p-6 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-black/[0.08] text-zinc-900">
                  <ThumbsUp className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-800">
                    Key Bull Arguments
                  </h4>
                </div>

                <div className="space-y-3.5">
                  {args.supporters.map((arg, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs">
                      <p className="text-[15px] sm:text-base text-zinc-950 leading-relaxed font-medium">
                        "{arg.text}"
                      </p>
                      <div className="mt-3.5 pt-2.5 border-t border-black/[0.06] flex items-center justify-between text-xs text-zinc-600">
                        <span className="nums font-extrabold text-black">
                          Backed by {arg.source_count} sources
                        </span>
                        <span className="truncate max-w-[140px] text-zinc-500 font-semibold" title={arg.sources[0]?.title}>
                          {arg.sources[0]?.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skeptics */}
          <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="p-6 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-black/[0.08] text-zinc-900">
                  <ThumbsDown className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-800">
                    Key Skeptic Arguments
                  </h4>
                </div>

                <div className="space-y-3.5">
                  {args.skeptics.map((arg, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs">
                      <p className="text-[15px] sm:text-base text-zinc-950 leading-relaxed font-medium">
                        "{arg.text}"
                      </p>
                      <div className="mt-3.5 pt-2.5 border-t border-black/[0.06] flex items-center justify-between text-xs text-zinc-600">
                        <span className="nums font-extrabold text-black">
                          Backed by {arg.source_count} sources
                        </span>
                        <span className="truncate max-w-[140px] text-zinc-500 font-semibold" title={arg.sources[0]?.title}>
                          {arg.sources[0]?.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Earnings Expectations (EPS & Revenue) */}
      {expectations && availability.expectations !== 'unavailable' && (
        <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
          <div className="p-6 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.08]">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
                Upcoming Earnings Estimates vs Year-Ago
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-zinc-100 text-black border border-black/10 shadow-2xs">
                Zacks Consensus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-600 uppercase tracking-wider font-extrabold">EPS Estimate</span>
                  <div className="text-2xl sm:text-3xl font-black text-black mt-1 nums">
                    {expectations.eps.expected.display}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-600 font-medium">Year-Ago Actual</span>
                  <div className="text-base font-extrabold text-black nums">
                    {expectations.eps.year_ago.display}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-600 uppercase tracking-wider font-extrabold">Revenue Estimate</span>
                  <div className="text-2xl sm:text-3xl font-black text-black mt-1 nums">
                    {expectations.revenue.expected.display}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-600 font-medium">Growth YoY</span>
                  <div className="text-base font-extrabold text-emerald-700 nums">
                    {expectations.revenue.growth.display}
                  </div>
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
          <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="p-6 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs h-full flex flex-col justify-between">
              <div>
                <div className="pb-4 mb-4 border-b border-black/[0.08]">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
                    Recent Wall Street Adjustments
                  </span>
                </div>

                <div className="space-y-3">
                  {recent_changes.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs flex items-center justify-between text-xs">
                      <div>
                        <div className="font-extrabold text-black text-sm sm:text-base">
                          {item.firm}
                        </div>
                        <div className="text-zinc-600 text-xs nums mt-0.5 font-bold">
                          {item.date}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-white text-black border border-black/10 shadow-2xs">
                          {item.action}
                        </span>
                        {item.target_to && (
                          <div className="mt-1 font-black nums text-black text-sm">
                            {item.target_to.display}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Merged Timeline Feed */}
        {timeline && timeline.length > 0 && (
          <div className="p-6 sm:p-7 rounded-[28px] sm:rounded-[36px] bg-[#E3E3E3] border border-black/[0.07] shadow-sm">
            <div className="p-6 sm:p-7 rounded-[22px] sm:rounded-[26px] bg-white border border-black/[0.06] shadow-2xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.08]">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-700">
                    Merged Event & News Timeline
                  </span>

                  {/* Kind Filters */}
                  <div className="flex items-center gap-1.5">
                    {(['all', 'news', 'analyst', 'company'] as const).map(kind => (
                      <button
                        key={kind}
                        onClick={() => setTimelineFilter(kind)}
                        className={`px-3.5 py-1 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                          timelineFilter === kind
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-800 border border-black/10 hover:border-black/30'
                        }`}
                      >
                        {kind}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredTimeline.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-zinc-50 border border-black/[0.07] shadow-xs">
                      <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
                        <span className="font-extrabold uppercase text-zinc-800">
                          {item.kind}
                        </span>
                        <span className="nums font-bold text-zinc-700">{item.relative}</span>
                      </div>
                      <p className="text-sm font-bold text-black leading-snug">
                        {item.title}
                      </p>
                      <div className="mt-2.5 text-xs text-zinc-600 flex items-center justify-between">
                        <span className="font-semibold text-zinc-700">{item.source}</span>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black hover:underline inline-flex items-center gap-0.5 font-extrabold"
                          >
                            Source <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
