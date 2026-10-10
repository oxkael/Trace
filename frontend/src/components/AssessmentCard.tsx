import React, { useState } from 'react';
import type { AssessmentResponse, OptionItem } from '../types/contract';
import { VerdictBanner } from './VerdictBanner';
import { KeyFactsGrid } from './KeyFactsGrid';
import { EventBanner } from './EventBanner';
import { LookbackTable } from './LookbackTable';
import { OutlookSection } from './OutlookSection';
import { ExplanationBox } from './ExplanationBox';
import { ActionBar } from './ActionBar';
import { Layers, History, TrendingUp } from 'lucide-react';

interface AssessmentCardProps {
  data: AssessmentResponse;
  onActionClick: (option: OptionItem) => void;
  isLoading?: boolean;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  data,
  onActionClick,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'outlook' | 'history'>('all');

  return (
    <div className="w-full max-w-[1040px] mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Verdict Banner */}
      <VerdictBanner verdict={data.verdict} />

      {/* 2. Key Facts Grid */}
      <KeyFactsGrid facts={data.facts} />

      {/* 3. Event Catalyst Banner if active */}
      <EventBanner banner={data.events.banner} upcoming={data.events.upcoming} />

      {/* 4. Section Selector Tabs (nor.ma pill style) */}
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full Context & Outlook</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outlook')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'outlook'
              ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Analyst Views & News</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Event Look-back ({data.history.length})</span>
        </button>
      </div>

      {/* 5. Deep Dive Sections */}
      {activeTab === 'all' && (
        <div className="space-y-8">
          <LookbackTable history={data.history} />
          <OutlookSection outlook={data.outlook} />
        </div>
      )}

      {activeTab === 'outlook' && (
        <OutlookSection outlook={data.outlook} />
      )}

      {activeTab === 'history' && (
        <LookbackTable history={data.history} />
      )}

      {/* 6. AI Grounded Readout Box */}
      <ExplanationBox explanation={data.explanation} />

      {/* 7. Action Bar Options */}
      <ActionBar
        options={data.options}
        onActionClick={onActionClick}
        isLoading={isLoading}
      />
    </div>
  );
};
