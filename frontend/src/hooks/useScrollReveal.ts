import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.05,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true
}: ScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0.5);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // IntersectionObserver for entrance reveal (Float & Lift)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Continuous scroll progress tracker with requestAnimationFrame for smooth parallax float
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!element) return;
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Calculate how far through the viewport the element is (0 = entering bottom, 1 = leaving top)
          const totalDistance = windowHeight + rect.height;
          const currentDistance = windowHeight - rect.top;
          const rawProgress = totalDistance > 0 ? currentDistance / totalDistance : 0.5;
          const clamped = Math.max(0, Math.min(1, rawProgress));

          setProgress(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible, progress };
}
