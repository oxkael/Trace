import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustProofStrip } from './components/TrustProofStrip';
import { StreamingProgress } from './components/StreamingProgress';
import { AssessmentCard } from './components/AssessmentCard';
import { ScoreboardView } from './components/ScoreboardView';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import type { AssessmentResponse, ProgressStep, OrderPreview, OptionItem, ScoreboardData } from './types/contract';
import { MOCK_ASSESSMENT_NVDA, MOCK_SCOREBOARD } from './mock/data';
import { askAssistant, getOrderPreview, confirmOrder } from './api/client';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'assistant' | 'scoreboard' | 'how-it-works'>('assistant');
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(MOCK_ASSESSMENT_NVDA);
  const [steps, setSteps] = useState<ProgressStep[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [orderModalData, setOrderModalData] = useState<OrderPreview | null>(null);
  const [scoreboardData] = useState<ScoreboardData>(MOCK_SCOREBOARD);

  const handleSearch = async (query: string) => {
    setIsStreaming(true);
    setSteps([]);
    setCurrentView('assistant');

    // Smooth scroll down to assessment area
    window.scrollTo({ top: 750, behavior: 'smooth' });

    await askAssistant(query, {
      onStep: (step) => {
        setSteps((prev) => {
          const idx = prev.findIndex((s) => s.step === step.step);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = step;
            return next;
          }
          return [...prev, step];
        });
      },
      onResult: (result) => {
        setAssessment(result);
        setIsStreaming(false);
      },
      onError: (err) => {
        console.error('Error during query:', err);
        setIsStreaming(false);
      }
    });
  };

  const handleSelectTicker = (ticker: string) => {
    handleSearch(`Check conditions and upcoming events for ${ticker}`);
  };

  const handleActionClick = async (option: OptionItem) => {
    if (option.kind === 'confirm_order') {
      const preview = await getOrderPreview();
      setOrderModalData(preview);
    } else if (option.kind === 'ask_followup' && option.params?.message) {
      handleSearch(option.params.message);
    } else if (option.kind === 'adjust_amount') {
      handleSearch('Run check with adjusted amount of $1,000 for rNVDA');
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col selection:bg-zinc-900 selection:text-white">
      {/* Floating Pill Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view !== 'assistant') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        market={assessment?.market}
        isMock={assessment?.mock ?? true}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'assistant' && (
          <>
            {/* nor.ma-style Dark Hero Stage */}
            <Hero
              onSearch={handleSearch}
              onSelectTicker={handleSelectTicker}
              isLoading={isStreaming}
            />

            {/* nor.ma Screenshot 1: Social Proof & Feeds Strip */}
            <TrustProofStrip />

            {/* Real-time Streaming Progress Steps */}
            <StreamingProgress steps={steps} isStreaming={isStreaming} />

            {/* Assessment Card (Crisp White nor.ma Cards) */}
            {assessment && (
              <AssessmentCard
                data={assessment}
                onActionClick={handleActionClick}
                isLoading={isStreaming}
              />
            )}

            {/* nor.ma Screenshot 2: Numbered 3-Step Methodology Cards */}
            <HowItWorksSection />

            {/* FAQ Accordion */}
            <FaqSection />
          </>
        )}

        {currentView === 'scoreboard' && (
          <div className="pt-28">
            <ScoreboardView scoreboard={scoreboardData} />
            <FaqSection />
          </div>
        )}

        {currentView === 'how-it-works' && (
          <div className="pt-28">
            <HowItWorksSection />
            <FaqSection />
          </div>
        )}
      </main>

      {/* Two-step Order Confirmation Modal */}
      {orderModalData && (
        <OrderModal
          preview={orderModalData}
          onClose={() => setOrderModalData(null)}
          onConfirm={confirmOrder}
        />
      )}

      {/* Calm Footer */}
      <Footer />
    </div>
  );
};

export default App;
