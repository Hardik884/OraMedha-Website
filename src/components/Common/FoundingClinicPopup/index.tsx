'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import posterImage from '../../../../public/images/founding-clinic-poster.jpeg';
import {
  Wrapper,
  Card,
  CloseButton,
  PosterFrame,
  Poster,
  Body,
  Eyebrow,
  Headline,
  CtaLink,
} from './styles';

const DISMISSED_KEY = 'oramedha-founding-clinic-popup-dismissed';
const INSTAGRAM_URL = 'https://www.instagram.com/p/Dda18uMSJSu/';

/**
 * A small dismissible card announcing the Founding Clinic Programme, pinned
 * to the top-left corner on every page. Independent of the demo dialog and
 * the header/footer nav — this is a promo, not a route.
 *
 * Dismissal is remembered in localStorage so a visitor who closes it doesn't
 * see it again on their next visit from the same browser.
 */
const FoundingClinicPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); fall
      // through and show the popup rather than fail silently forever.
    }
    // A short delay so it arrives after the preloader/hero settle, not on
    // top of the loading screen.
    const id = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Nothing to persist to; it'll just show again next visit.
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <Wrapper
          role="complementary"
          aria-label="Founding Clinic Programme announcement"
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        >
          <Card>
            <CloseButton type="button" onClick={dismiss} aria-label="Close">
              &#215;
            </CloseButton>

            <PosterFrame>
              <Poster
                src={posterImage}
                alt="OraMedha Founding Clinic Programme — intelligent clinic management for dentists"
                fill
                sizes="(max-width: 768px) 280px, 304px"
                priority={false}
              />
            </PosterFrame>

            <Body>
              <Eyebrow>Founding Clinic Programme</Eyebrow>
              <Headline>Founding Clinic Programme is live now.</Headline>
              <CtaLink
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here to know more
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 12.5L12.5 3.5M12.5 3.5H5.5M12.5 3.5V10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </CtaLink>
            </Body>
          </Card>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};

export default FoundingClinicPopup;
