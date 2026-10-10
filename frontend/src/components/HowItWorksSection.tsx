import React, { useState } from 'react';
import { ArrowRight, Eye, Activity, History, X } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  return (
    <section id="how-it-works" className="w-full px-3 sm:px-4 my-12 sm:my-20">
      {/* End-to-end Widescreen Cinematic Card matching nor.ma screenshot exactly */}
      <div className="relative mx-auto max-w-[1920px] overflow-hidden rounded-[28px] sm:rounded-[36px] bg-black border border-white/10 shadow-2xl min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex flex-col items-center justify-center p-6 sm:p-14 text-center select-none">
        {/* Deep Black Ambient Background */}
        <div className="absolute inset-0 bg-black pointer-events-none" />

        {/* 3D Inverted Dome Mesh Grid SVG matching reference screenshot */}
        <div className="absolute inset-x-0 top-0 h-[80%] pointer-events-none overflow-hidden">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1400 700"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Grid stroke gradient - fades towards dark edges */}
              <radialGradient id="meshCenterGlow" cx="50%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.09" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.01" />
              </radialGradient>

              {/* Blue spotlight cone gradient */}
              <linearGradient id="beaconSpotlight" x1="70%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="45%" stopColor="#2563eb" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
              </linearGradient>

              <filter id="spotlightBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
            </defs>

            {/* Subtle dark gradient behind the bowl */}
            <path
              d="M 0,0 L 1400,0 L 1400,700 Q 700,700 0,700 Z"
              fill="#06070a"
              opacity="0.95"
            />

            {/* Angled Light Beam shining down-left from the Beacon (coords: 550, 190) */}
            <polygon
              points="550,190 260,430 390,500 550,190"
              fill="url(#beaconSpotlight)"
              filter="url(#spotlightBlur)"
            />

            {/* Latitudinal concentric curved arcs (forming the bowl) */}
            <g stroke="url(#meshCenterGlow)" strokeWidth="0.85" fill="none">
              <path d="M 0,50 Q 700,300 1400,50" />
              <path d="M 0,100 Q 700,370 1400,100" />
              <path d="M 0,160 Q 700,450 1400,160" />
              <path d="M 0,230 Q 700,540 1400,230" />
              <path d="M 40,310 Q 700,610 1360,310" />
              <path d="M 100,400 Q 700,670 1300,400" />
              {/* Outer bottom contour of the bowl */}
              <path d="M 190,490 Q 700,700 1210,490" strokeWidth="1.2" stroke="rgba(255,255,255,0.25)" />
            </g>

            {/* Longitudinal perspective lines radiating downwards to bowl center */}
            <g stroke="url(#meshCenterGlow)" strokeWidth="0.75" fill="none">
              <path d="M 700,0 L 700,700" strokeDasharray="3,4" opacity="0.4" />
              
              {/* Left hemisphere curves */}
              <path d="M 80,0 Q 330,350 700,700" />
              <path d="M 210,0 Q 420,350 700,700" />
              <path d="M 350,0 Q 500,350 700,700" />
              <path d="M 490,0 Q 580,350 700,700" />
              <path d="M 610,0 Q 640,350 700,700" />

              {/* Right hemisphere curves */}
              <path d="M 1320,0 Q 1070,350 700,700" />
              <path d="M 1190,0 Q 980,350 700,700" />
              <path d="M 1050,0 Q 900,350 700,700" />
              <path d="M 910,0 Q 820,350 700,700" />
              <path d="M 790,0 Q 760,350 700,700" />
            </g>
          </svg>
        </div>

        {/* Expansive Deep Solid Black Lower Area matching screenshot */}
        <div className="absolute inset-x-0 bottom-0 h-56 sm:h-72 bg-gradient-to-t from-black via-black to-transparent pointer-events-none" />

        {/* Foreground Content - Centered, Iconic & Deep */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto pt-8 pb-6">
          {/* Glowing Beacon matching nor.ma screenshot */}
          <div className="relative mb-6 sm:mb-8">
            {/* Soft Ambient Halo */}
            <div className="absolute -inset-4 rounded-full bg-blue-500/40 blur-2xl animate-pulse pointer-events-none" />
            
            {/* Outer Gray Ring Shell */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-600/90 border border-white/40 backdrop-blur-md p-2.5 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
              {/* Intense Vibrant Blue Core */}
              <div className="w-full h-full rounded-full bg-[#3b82f6] shadow-[0_0_28px_#3b82f6] flex items-center justify-center" />
            </div>
          </div>

          {/* Large Bold Editorial Headline matching screenshot */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.06] max-w-3xl">
            Tokenized stocks trade 24/7.
            <br />
            <span className="text-zinc-200">The stock market</span>
            <br />
            <span className="text-zinc-400">does not.</span>
          </h2>

          {/* Pure White Pill Button matching "Get your Norma ->" */}
          <div className="mt-10 sm:mt-12">
            <button
              type="button"
              onClick={() => setShowMethodologyModal(true)}
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-white text-zinc-950 font-semibold text-sm sm:text-base hover:bg-zinc-100 transition shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Trace methodology</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Clean Interactive Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-black/10">
            <button
              type="button"
              onClick={() => setShowMethodologyModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-left">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-700">
                Trace Methodology
              </span>
              <h3 className="text-2xl font-bold text-zinc-950 mt-3">
                How Trace evaluates 24/7 tokenized markets
              </h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Bitget rTokens allow 24/7 equity exposure, but when official exchanges close, liquidity dynamics shift. Trace enforces three strict safeguards:
              </p>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-[#E3E3E3]/60 border border-black/5 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white shadow-2xs text-zinc-900 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">1. Ground Truth Observation</h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Checks official NYSE/NASDAQ trading hours. Outside regular sessions, reference prices are labeled as last regular close, never conflated with live prices.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E3E3E3]/60 border border-black/5 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white shadow-2xs text-zinc-900 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">2. Real-Time Divergence & Liquidity</h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Measures spread vs underlying equities and compares current trading volume against 30-day medians to flag illiquid price spikes.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E3E3E3]/60 border border-black/5 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white shadow-2xs text-zinc-900 shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950">3. Historical Catalyst Look-Back</h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Audits past stock moves across identical earnings and macro catalysts. Explanations are strictly fact-validated with zero price predictions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowMethodologyModal(false)}
                  className="px-6 py-2.5 rounded-full bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
