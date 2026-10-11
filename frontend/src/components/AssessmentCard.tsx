import React, { useState } from 'react';
import type { AssessmentResponse, OptionItem } from '../types/contract';
import { VerdictBanner } from './VerdictBanner';
import { KeyFactsGrid } from './KeyFactsGrid';
import { EventBanner } from './EventBanner';
import { LookbackTable } from './LookbackTable';
import { OutlookSection } from './OutlookSection';
import { ExplanationBox } from './ExplanationBox';
import { ActionBar } from './ActionBar';
import { RevealBlock, MiddleSection } from './MiddleSection';
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
    <MiddleSection className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10 sm:space-y-14 lg:space-y-16">
      {/* 1. Verdict Banner with Scroll-Driven Float & Lift (Focused 880px reading width) */}
      <RevealBlock delay={0} className="max-w-[880px] mx-auto">
        <VerdictBanner verdict={data.verdict} />
      </RevealBlock>

      {/* 2. Key Facts Grid with Scroll-Driven Float & Lift (Expansive 1140px data span) */}
      <RevealBlock delay={80} className="max-w-[1140px] mx-auto">
        <KeyFactsGrid facts={data.facts} />
      </RevealBlock>

      {/* 3. Event Catalyst Banner if active (Focused 880px width) */}
      {data.events && (data.events.banner || (data.events.upcoming && data.events.upcoming.length > 0)) && (
        <RevealBlock delay={100} className="max-w-[880px] mx-auto">
          <EventBanner banner={data.events.banner} upcoming={data.events.upcoming} />
        </RevealBlock>
      )}

      {/* 4. Section Selector Tabs (Balanced 1040px anchor width) */}
      <RevealBlock delay={120} className="max-w-[1040px] mx-auto">
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
      </RevealBlock>

      {/* 5. Deep Dive Sections with varied rhythmic widths */}
      {activeTab === 'all' && (
        <div className="space-y-10 sm:space-y-14 lg:space-y-16">
          <RevealBlock delay={0} className="max-w-[1160px] mx-auto">
            <LookbackTable history={data.history} />
          </RevealBlock>
          <RevealBlock delay={50} className="w-full">
            <OutlookSection outlook={data.outlook} />
          </RevealBlock>
        </div>
      )}

      {activeTab === 'outlook' && (
        <RevealBlock delay={0} className="w-full">
          <OutlookSection outlook={data.outlook} />
        </RevealBlock>
      )}

      {activeTab === 'history' && (
        <RevealBlock delay={0} className="max-w-[1160px] mx-auto">
          <LookbackTable history={data.history} />
        </RevealBlock>
      )}

      {/* 6. AI Grounded Readout Box (Optimal 920px reading width) */}
      <RevealBlock delay={0} className="max-w-[920px] mx-auto">
        <ExplanationBox explanation={data.explanation} />
      </RevealBlock>

      {/* 7. Action Bar Options (Focused 880px width) */}
      <RevealBlock delay={50} className="max-w-[880px] mx-auto">
        <ActionBar
          options={data.options}
          onActionClick={onActionClick}
          isLoading={isLoading}
        />
      </RevealBlock>
    </MiddleSection>
  );
};
