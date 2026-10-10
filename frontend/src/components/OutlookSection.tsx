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
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
        {/* The Outlook Brief */}
        <div className="p-6 sm:p-7 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Wall Street Outlook & News Synthesis
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium">
                Interpretation
              </span>
            </div>

            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
              {brief.text}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Basis: <strong className="nums text-zinc-700 dark:text-zinc-300">{brief.basis.analyst_updates} analyst updates</strong>, {brief.basis.articles} articles ({brief.basis.window_days}d window)
            </span>
            {brief.validated && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fact Validated
              </span>
            )}
          </div>
        </div>

        {/* Analyst Consensus Breakdown */}
        {availability.consensus !== 'unavailable' && (
          <div className="p-6 sm:p-7 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200/60 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Analyst Consensus
                </span>
                <span className="text-xs text-zinc-400 nums">
                  {totalConsensus} ratings
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex my-3">
                <div style={{ width: `${buyPct}%` }} className="bg-emerald-500" title={`Buy: ${consensus.buy}`} />
                <div style={{ width: `${holdPct}%` }} className="bg-zinc-400" title={`Hold: ${consensus.hold}`} />
                <div style={{ width: `${sellPct}%` }} className="bg-rose-500" title={`Sell: ${consensus.sell}`} />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 text-center mt-4">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700">
                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Buy</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-white nums">{consensus.buy}</div>
                  <div className="text-[10px] text-zinc-400 nums">{buyPct.toFixed(0)}%</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700">
                  <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Hold</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-white nums">{consensus.hold}</div>
                  <div className="text-[10px] text-zinc-400 nums">{holdPct.toFixed(0)}%</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700">
                  <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400">Sell</div>
                  <div className="text-lg font-bold text-zinc-900 dark:text-white nums">{consensus.sell}</div>
                  <div className="text-[10px] text-zinc-400 nums">{sellPct.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Source: {consensus.source}</span>
              <span className="capitalize">{consensus.freshness}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Price Targets vs Today */}
      {availability.targets !== 'unavailable' && (
        <div className="p-6 sm:p-7 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                12-Month Published Price Targets vs Today
              </span>
            </div>
            <span className="text-xs text-zinc-400 nums">
              {targets.analyst_count} analysts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700">
              <span className="text-xs text-zinc-400 font-medium">Low Target</span>
              <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1 nums">
                {targets.low.display}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700">
              <span className="text-xs text-zinc-400 font-medium">Consensus Mean</span>
              <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1 nums">
                {targets.mean.display}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700">
              <span className="text-xs text-zinc-400 font-medium">High Target</span>
              <div className="text-xl font-bold text-zinc-900 dark:text-white mt-1 nums">
                {targets.high.display}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-900">
              <span className="text-xs text-zinc-400 font-medium">Current Price</span>
              <div className="text-xl font-bold text-white mt-1 nums">
                {targets.current_price.display}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Arguments: Supporters vs Skeptics */}
      {availability.arguments !== 'unavailable' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supporters */}
          <div className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-200/60 dark:border-zinc-800 text-emerald-700 dark:text-emerald-400">
              <ThumbsUp className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Key Bull Arguments
              </h4>
            </div>

            <div className="space-y-4">
              {args.supporters.map((arg, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700">
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                    "{arg.text}"
                  </p>
                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="nums font-medium text-emerald-600 dark:text-emerald-400">
                      Backed by {arg.source_count} sources
                    </span>
                    <span className="truncate max-w-[140px]" title={arg.sources[0]?.title}>
                      {arg.sources[0]?.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeptics */}
          <div className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-200/60 dark:border-zinc-800 text-rose-700 dark:text-rose-400">
              <ThumbsDown className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Key Skeptic Arguments
              </h4>
            </div>

            <div className="space-y-4">
              {args.skeptics.map((arg, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700">
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                    "{arg.text}"
                  </p>
                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="nums font-medium text-rose-600 dark:text-rose-400">
                      Backed by {arg.source_count} sources
                    </span>
                    <span className="truncate max-w-[140px]" title={arg.sources[0]?.title}>
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
        <div className="p-6 sm:p-7 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200/60 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Upcoming Earnings Estimates vs Year-Ago
            </span>
            <span className="text-xs text-zinc-400">Zacks Consensus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 font-medium">EPS Estimate</span>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mt-1 nums">
                  {expectations.eps.expected.display}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-400">Year-Ago Actual</span>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 nums">
                  {expectations.eps.year_ago.display}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 font-medium">Revenue Estimate</span>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mt-1 nums">
                  {expectations.revenue.expected.display}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-400">Growth YoY</span>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 nums">
                  {expectations.revenue.growth.display}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Recent Analyst Changes & Merged Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-4">
        {/* Recent Analyst Adjustments */}
        {recent_changes && recent_changes.length > 0 && (
          <div className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="pb-3 mb-4 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Recent Wall Street Adjustments
              </span>
            </div>

            <div className="space-y-3">
              {recent_changes.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      {item.firm}
                    </div>
                    <div className="text-zinc-400 text-[11px] nums mt-0.5">
                      {item.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      item.action === 'raised' || item.action === 'upgraded'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.action === 'lowered' || item.action === 'downgraded'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {item.action}
                    </span>
                    {item.target_to && (
                      <div className="mt-1 font-bold nums text-zinc-800 dark:text-zinc-200">
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
          <div className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Merged Event & News Timeline
              </span>

              {/* Kind Filters */}
              <div className="flex items-center gap-1">
                {(['all', 'news', 'analyst', 'company'] as const).map(kind => (
                  <button
                    key={kind}
                    onClick={() => setTimelineFilter(kind)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize transition-colors ${
                      timelineFilter === kind
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {kind}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredTimeline.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                      {item.kind}
                    </span>
                    <span className="nums">{item.relative}</span>
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                    {item.title}
                  </p>
                  <div className="mt-2 text-[10px] text-zinc-400 flex items-center justify-between">
                    <span>{item.source}</span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-600 dark:text-zinc-300 hover:underline inline-flex items-center gap-0.5"
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
