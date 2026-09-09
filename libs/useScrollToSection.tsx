'use client';
import { useLenis } from '@studio-freight/react-lenis';
import { useCallback } from 'react';

/** Ids of the homepage sections the navigation points at. */
export const SECTION_IDS = {
  product: 'product',
  intelligence: 'intelligence',
  solutions: 'solutions',
  security: 'security',
} as const;

/**
 * Scrolling the page is Lenis's job, not the browser's — but only when the
 * link's target is already on the page we're on.
 *
 * Header and Footer are rendered on every route (see Layout), so a section
 * link like `/#product` shows up on `/privacy` too, where there is no
 * `#product` to scroll to. `href` therefore carries a real path (`/#product`,
 * not a bare `#product`): on the homepage that path matches
 * `location.pathname` and this hook takes over exactly as before; anywhere
 * else it leaves the click alone, so the browser does a real navigation to
 * `/#product` and Layout's own `DeepLinkToSection` scrolls once the homepage
 * has mounted. A plain `href="#product"` would jump instantly and leave
 * Lenis's internal position out of step with the real scroll offset, which
 * makes the next wheel event snap — `lenis.scrollTo` keeps one scroller in
 * charge, so anchor navigation eases exactly like every other scroll on the
 * page, and the anchor still works with JavaScript disabled either way.
 */
export const useScrollToSection = () => {
  const lenis = useLenis();

  return useCallback(
    (event: React.MouseEvent<HTMLElement>, href: string) => {
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const hash = href.slice(hashIndex);
      const path = href.slice(0, hashIndex) || '/';
      if (typeof window !== 'undefined' && window.location.pathname !== path) {
        return; // different page: let the browser navigate there for real
      }

      const target = document.querySelector(hash);
      if (!target) return; // leave the browser to its default behaviour

      event.preventDefault();
      scrollToTarget(lenis, target);

      // Keep the address bar honest without adding a history entry per click.
      window.history.replaceState(null, '', hash);
    },
    [lenis]
  );
};

/** True when the visitor has asked the OS for less motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Move to a section. Falls back to the native scroll if Lenis has not mounted
 * yet, and jumps rather than eases when reduced motion is requested.
 */
export function scrollToTarget(lenis: any, target: Element) {
  const reduce = prefersReducedMotion();

  // An instant, direct jump — used as a correction below, and as the whole
  // fallback when Lenis isn't around at all. Deliberately not `scrollIntoView`
  // with `behavior: 'smooth'`: a smooth *native* scroll fires its own stream
  // of scroll events while Lenis's listener is still attached, and Lenis has
  // been observed to read those as drift and snap the page back to where it
  // last knew it was — fighting the very correction meant to fix it. A single
  // synchronous jump gives it nothing to fight.
  const jumpTo = () => {
    const rect = target.getBoundingClientRect();
    window.scrollTo({ top: rect.top + window.scrollY - 24, behavior: 'auto' });
  };

  if (lenis?.scrollTo) {
    const startY = typeof window !== 'undefined' ? window.scrollY : 0;
    const duration = reduce ? 0 : 1.1;

    lenis.scrollTo(target, {
      offset: -24,
      duration,
      immediate: reduce,
    });

    /*
     * Lenis measures the page's scrollable height itself, off its own rAF
     * loop, and that measurement has been observed to come back stale right
     * after a full cross-page navigation — a click on a `/#section` link
     * from another page, landing here via Layout's DeepLinkToSection —
     * clamping the request above to a no-op and leaving the visitor
     * stranded at the top of the page while Lenis still holds its own
     * scroll lock for the tween's declared duration. Checking after that
     * duration has fully elapsed (rather than mid-tween, which would fight
     * a tween that's genuinely in progress) and jumping there directly if
     * the viewport still hasn't moved covers that case.
     */
    if (typeof window !== 'undefined') {
      window.setTimeout(
        () => {
          if (Math.abs(window.scrollY - startY) < 2) jumpTo();
        },
        duration * 1000 + 150
      );
    }
    return;
  }

  if (reduce) {
    jumpTo();
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
