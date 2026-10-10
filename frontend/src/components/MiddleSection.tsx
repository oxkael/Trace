import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RevealBlockProps {
  children: React.ReactNode;
  delay?: number; // ms delay for staggered reveals
  className?: string;
  parallaxStrength?: number; // subtle translateY tracking
}

/**
 * RevealBlock: Wraps any card or section element and applies
 * the Scroll-Driven Float & Lift animation as you scroll.
 */
export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  delay = 0,
  className = '',
  parallaxStrength = 0
}) => {
  const { ref, isVisible, progress } = useScrollReveal<HTMLDivElement>({
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Calculate subtle scroll parallax float (e.g. slight lift as you scroll through)
  const parallaxOffset = parallaxStrength ? (0.5 - progress) * parallaxStrength : 0;

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transform: isVisible
          ? `translate3d(0, ${parallaxOffset}px, 0)`
          : 'translate3d(0, 36px, 0)',
        opacity: isVisible ? 1 : 0
      }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform will-change-opacity ${className}`}
    >
      {children}
    </div>
  );
};

interface MiddleSectionProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * MiddleSection: Container that choreographs scroll-driven float & lift
 * across its child cards and blocks.
 */
export const MiddleSection: React.FC<MiddleSectionProps> = ({
  children,
  className = ''
}) => {
  return (
    <section className={`relative w-full ${className}`}>
      {children}
    </section>
  );
};

export default MiddleSection;
