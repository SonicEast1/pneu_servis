'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SELECTOR = '.animate-fadeInUp, .animate-fadeInDown, .reveal-clip, .reveal-steps';

/**
 * Odhalení obsahu při scrollu.
 *
 * Prvky, které jsou při startu už ve viewportu, dostanou .in-view ještě
 * PŘED zapnutím html.reveal-ready. Jejich vstupní CSS animace tak doběhne
 * jen jednou — dřív se po hydrataci schovaly a přehrály znovu (probliknutí).
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      root.classList.remove('reveal-ready');
      return;
    }

    const isInViewport = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (isInViewport(el)) el.classList.add('in-view');
    });

    root.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const observe = (el: Element) => {
      if (!el.classList.contains('in-view')) observer.observe(el);
    };

    document.querySelectorAll(SELECTOR).forEach(observe);

    // Prvky vykreslené později (např. po načtení dat z API) také zachytíme
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(SELECTOR)) observe(node);
          node.querySelectorAll(SELECTOR).forEach(observe);
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
