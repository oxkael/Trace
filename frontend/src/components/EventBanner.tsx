import React from 'react';
import { BellRing, ArrowUpRight } from 'lucide-react';
import type { EventItem } from '../types/contract';

interface EventBannerProps {
  banner?: {
    event_id: string;
    text: string;
    tone: string;
  };
  upcoming?: EventItem[];
}

export const EventBanner: React.FC<EventBannerProps> = ({ banner, upcoming }) => {
  if (!banner && (!upcoming || upcoming.length === 0)) return null;

  const urgentEvent = upcoming?.[0];

  return (
    <div className="p-5 rounded-[24px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0">
          <BellRing className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Upcoming Catalyst
            </span>
            {urgentEvent?.timing && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                {urgentEvent.timing.replace('_', ' ')}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base font-semibold mt-0.5 text-zinc-900 dark:text-white">
            {banner?.text || urgentEvent?.title}
          </p>
        </div>
      </div>

      {urgentEvent?.source_url && (
        <a
          href={urgentEvent.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shrink-0 shadow-sm"
        >
          <span>Official IR Source</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
