import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustProofStrip } from './components/TrustProofStrip';
import { StreamingProgress } from './components/StreamingProgress';
import { AssessmentCard } from './components/AssessmentCard';
import { ScoreboardView } from './components/ScoreboardView';
import { HowItWorksSection } from './components/HowItWorksSection';
import { MethodologyCards } from './components/MethodologyCards';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import type { AssessmentResponse, ProgressStep, OrderPreview, OptionItem, ScoreboardData } from './types/contract';
import { MOCK_ASSESSMENT_NVDA, MOCK_SCOREBOARD } from './mock/data';
import { askAssistant, getOrderPreview, confirmOrder, fetchScoreboard } from './api/client';
import { useEffect } from 'react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'assistant' | 'scoreboard' | 'how-it-works'>('assistant');
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(MOCK_ASSESSMENT_NVDA);
  const [steps, setSteps] = useState<ProgressStep[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [orderModalData, setOrderModalData] = useState<OrderPreview | null>(null);
  const [scoreboardData, setScoreboardData] = useState<ScoreboardData>(MOCK_SCOREBOARD);

  useEffect(() => {
    fetchScoreboard().then((data) => {
      if (data) setScoreboardData(data);
    });

    // Initial silent load of live verified data from backend
    askAssistant('Check conditions and upcoming events for NVDA', {
      onStep: () => {},
      onResult: (result) => {
        setAssessment(result);
      },
      onError: (err) => {
        console.warn('Initial live assessment failed:', err);
      }
    });
  }, []);

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
      const ticker = option.params?.ticker || assessment?.request?.ticker || 'NVDA';
      const amount = option.params?.amount_usd || 50;
      const preview = await getOrderPreview(ticker, amount);
      setOrderModalData(preview);
    } else if (option.kind === 'ask_followup' && option.params?.message) {
      handleSearch(option.params.message);
    } else if (option.kind === 'adjust_amount') {
      const ticker = assessment?.request?.ticker || 'NVDA';
      handleSearch(`Check conditions with adjusted amount of $500 for r${ticker}`);
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

            {/* 3 nor.ma-style numbered Methodology Cards with generated UI photos */}
            <MethodologyCards />

            {/* nor.ma Cinematic Dark Dome Card: "Tokenized stocks trade 24/7. The stock market does not." */}
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
            <MethodologyCards />
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
