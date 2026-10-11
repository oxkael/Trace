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
  parallaxStrength = 32
}) => {
  const { ref, isVisible, progress } = useScrollReveal<HTMLDivElement>({
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px',
    triggerOnce: true
  });

  // Calculate organic scroll float: as element moves through the viewport,
  // it glides smoothly by up to parallaxStrength pixels.
  // (0.5 - progress) gives +parallax/2 at bottom, 0 at center, -parallax/2 at top.
  const parallaxOffset = isVisible ? (0.5 - progress) * parallaxStrength : 48;

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transform: `translate3d(0, ${parallaxOffset.toFixed(1)}px, 0) scale(${isVisible ? 1 : 0.985})`,
        opacity: isVisible ? 1 : 0,
        transitionProperty: 'opacity, transform',
        transitionDuration: isVisible ? '650ms, 260ms' : '650ms, 650ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`will-change-transform will-change-opacity ${className}`}
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
