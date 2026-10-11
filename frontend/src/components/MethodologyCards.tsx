import React from 'react';
import { RevealBlock } from './MiddleSection';
import { Search, Radio, ShieldCheck } from 'lucide-react';

interface MethodologyStep {
  step: number;
  title: string;
  subtitle: string;
  badge: string;
  badgeIcon: React.ElementType;
  imageSrc: string;
  imageAlt: string;
}

const STEPS: MethodologyStep[] = [
  {
    step: 1,
    title: 'Ask before you trade',
    subtitle: 'Check upcoming earnings, catalysts, and conditions in plain words.',
    badge: 'Step 1 • Query',
    badgeIcon: Search,
    imageSrc: '/images/step1_check_earnings.jpg',
    imageAlt: 'User checking upcoming earnings for tokenized stock rNVDA on Trace'
  },
  {
    step: 2,
    title: 'Audit across 4 live feeds',
    subtitle: 'Bitget orderbook, NYSE close, SEC EDGAR filings & Wall St consensus.',
    badge: 'Step 2 • Multi-Source Audit',
    badgeIcon: Radio,
    imageSrc: '/images/step2_audit_sources.jpg',
    imageAlt: 'Multi-source financial feeds audited simultaneously'
  },
  {
    step: 3,
    title: 'Act on structured output',
    subtitle: 'Fact-validated condition verdicts and historical look-backs. No price forecasts.',
    badge: 'Step 3 • Grounded Verdict',
    badgeIcon: ShieldCheck,
    imageSrc: '/images/step3_ai_output.jpg',
    imageAlt: 'Structured AI condition output with verified facts and condition status'
  }
];

export const MethodologyCards: React.FC = () => {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-12 sm:my-16 lg:my-20">
      {/* 3 nor.ma-style Cards Grid with Crisp Thin Border */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
        {STEPS.map((item, idx) => {
          const BadgeIcon = item.badgeIcon;
          return (
            <RevealBlock key={item.step} delay={idx * 90} className="h-full">
              <div className="group h-full flex flex-col justify-between bg-white rounded-[28px] sm:rounded-[36px] border border-black/[0.08] p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-black/20 transition-all duration-300">
                {/* Top Content: Circled Step Number, Title, Subtitle */}
                <div>
                  <div className="flex items-center justify-between">
                    {/* Circled Number matching nor.ma screenshot 1, 2, 3 */}
                    <div className="w-8 h-8 rounded-full border border-black/15 bg-zinc-50 flex items-center justify-center text-xs font-black text-zinc-900 select-none shadow-2xs">
                      {item.step}
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-zinc-600 bg-zinc-100 border border-black/5">
                      <BadgeIcon className="w-3 h-3 text-zinc-800" />
                      <span>{item.badge}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-zinc-500 mt-2 font-medium leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* Bottom Graphic: Realistic Photo Mockup with Thin Border */}
                <div className="mt-6 pt-2">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] sm:rounded-[26px] border border-black/[0.08] bg-zinc-100 shadow-2xs">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[22px] sm:rounded-[26px] pointer-events-none" />
                  </div>
                </div>
              </div>
            </RevealBlock>
          );
        })}
      </div>
    </section>
  );
};

export default MethodologyCards;
