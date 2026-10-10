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
    <div className="w-full max-w-[1040px] mx-auto px-4 py-12 sm:py-16 space-y-10 sm:space-y-14 lg:space-y-16 animate-in fade-in duration-300">
      {/* 1. Verdict Banner */}
      <VerdictBanner verdict={data.verdict} />

      {/* 2. Key Facts Grid */}
      <KeyFactsGrid facts={data.facts} />

      {/* 3. Event Catalyst Banner if active */}
      <EventBanner banner={data.events.banner} upcoming={data.events.upcoming} />

      {/* 4. Section Selector Tabs with generous padding */}
      <div className="flex items-center gap-2.5 pt-4 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs ${
            activeTab === 'all'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white text-zinc-700 border border-black/10 hover:border-black/30'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full Context & Outlook</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outlook')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs ${
            activeTab === 'outlook'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white text-zinc-700 border border-black/10 hover:border-black/30'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Analyst Views & News</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs ${
            activeTab === 'history'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'bg-white text-zinc-700 border border-black/10 hover:border-black/30'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Event Look-back ({data.history.length})</span>
        </button>
      </div>

      {/* 5. Deep Dive Sections with generous spacing */}
      {activeTab === 'all' && (
        <div className="space-y-10 sm:space-y-14 lg:space-y-16">
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
